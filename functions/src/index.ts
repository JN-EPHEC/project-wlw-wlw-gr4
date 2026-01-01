import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { OpenAI } from "openai";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Initialize OpenAI
const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.api_key;
const openai = new OpenAI({
  apiKey: apiKey,
});

// Type definitions
interface DjanaiQuizAnswers {
  dogId: string;
  dogName: string;
  ageCategory: string;
  breedCategory: string;
  size: string;
  energyLevel: string;
  ownerExperience: string;
  objectives: string[];
  behaviorsConcerns: string[];
  environment: string;
  availableTime: string;
}

interface TrainingSession {
  week: number;
  focus: string;
  exercises: string[];
  duration: number;
  notes: string;
}

interface TrainingProgram {
  createdAt: number;
  dogId: string;
  dogName: string;
  sessions: TrainingSession[];
  exercises: Array<{
    name: string;
    description: string;
    duration: number;
    frequency: string;
  }>;
  advices: string[];
  summary: string;
}

// Cloud Function: Generate DjanAI Training Program
export const generateDjanaiProgram = functions.https.onCall(
  async (data: DjanaiQuizAnswers, context) => {
    try {
      // Verify user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const userId = context.auth.uid;
      const { dogId, dogName, ...quizAnswers } = data;

      // Create the prompt for OpenAI
      const prompt = `Tu es un expert en entraînement canin avec 20 ans d'expérience. 
Crée un programme d'entraînement personnalisé pour un chien basé sur les réponses suivantes:

Profil du chien:
- Âge: ${quizAnswers.ageCategory}
- Race: ${quizAnswers.breedCategory}
- Taille: ${quizAnswers.size}
- Niveau d'énergie: ${quizAnswers.energyLevel}
- Expérience du propriétaire: ${quizAnswers.ownerExperience}
- Objectifs: ${quizAnswers.objectives.join(", ")}
- Préoccupations comportementales: ${quizAnswers.behaviorsConcerns.join(", ")}
- Environnement: ${quizAnswers.environment}
- Temps disponible par semaine: ${quizAnswers.availableTime}

Réponds UNIQUEMENT avec un JSON valide (sans texte supplémentaire) avec cette structure:
{
  "summary": "Résumé du programme en 2-3 phrases",
  "sessions": [
    {
      "week": 1,
      "focus": "Focus principal de la semaine",
      "exercises": ["Exercice 1", "Exercice 2"],
      "duration": 30,
      "notes": "Notes pour cette semaine"
    }
  ],
  "exercises": [
    {
      "name": "Nom de l'exercice",
      "description": "Description détaillée",
      "duration": 10,
      "frequency": "3x par semaine"
    }
  ],
  "advices": [
    "Conseil 1",
    "Conseil 2",
    "Conseil 3"
  ]
}

Crée 8 semaines de programme avec des exercices progressifs et réalistes.`;

      // Call OpenAI API
      const message = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      // Extract content
      const content = message.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }

      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not extract JSON from response");
      }

      const parsedProgram = JSON.parse(jsonMatch[0]);

      // Create the training program object
      const trainingProgram: TrainingProgram = {
        createdAt: Date.now(),
        dogId,
        dogName: dogName || "Mon chien",
        sessions: parsedProgram.sessions || [],
        exercises: parsedProgram.exercises || [],
        advices: parsedProgram.advices || [],
        summary: parsedProgram.summary || "",
      };

      // Save to Firestore
      await db
        .collection("users")
        .doc(userId)
        .collection("dogs")
        .doc(dogId)
        .collection("trainingPrograms")
        .doc("latest")
        .set(trainingProgram);

      // Return success response
      return {
        success: true,
        program: trainingProgram,
      };
    } catch (error) {
      console.error("Error in generateDjanaiProgram:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      // Return error response
      throw new functions.https.HttpsError(
        "internal",
        `Failed to generate program: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
);

// Cloud Function: Get DjanAI Program
export const getDjanaiProgram = functions.https.onCall(
  async (data: { dogId: string }, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const userId = context.auth.uid;
      const { dogId } = data;

      const doc = await db
        .collection("users")
        .doc(userId)
        .collection("dogs")
        .doc(dogId)
        .collection("trainingPrograms")
        .doc("latest")
        .get();

      if (!doc.exists) {
        return { success: true, program: null };
      }

      return {
        success: true,
        program: doc.data(),
      };
    } catch (error) {
      console.error("Error in getDjanaiProgram:", error);
      throw new functions.https.HttpsError(
        "internal",
        `Failed to get program: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
);

// Cloud Function: Update Exercise Progress
export const updateExerciseProgress = functions.https.onCall(
  async (
    data: {
      dogId: string;
      exerciseName: string;
      completed: boolean;
      completedDate: string;
    },
    context
  ) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const userId = context.auth.uid;
      const { dogId, exerciseName, completed, completedDate } = data;

      // Get or create progress document
      const progressRef = db
        .collection("users")
        .doc(userId)
        .collection("dogs")
        .doc(dogId)
        .collection("trainingPrograms")
        .doc("progress");

      const progressDoc = await progressRef.get();
      
      let currentProgress: any = {
        exercises: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (progressDoc.exists) {
        currentProgress = progressDoc.data() || currentProgress;
      }

      // Ensure exercises object exists
      if (!currentProgress.exercises) {
        currentProgress.exercises = {};
      }

      // Update exercise status
      const existingExercise = currentProgress.exercises[exerciseName] || {
        completedDates: [],
      };

      currentProgress.exercises[exerciseName] = {
        completed,
        completedDates: existingExercise.completedDates || [],
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Add completed date if marking as done
      if (
        completed &&
        !currentProgress.exercises[exerciseName].completedDates.includes(completedDate)
      ) {
        currentProgress.exercises[exerciseName].completedDates.push(completedDate);
      }

      // Save progress
      await progressRef.set(currentProgress);

      return {
        success: true,
        progress: currentProgress,
      };
    } catch (error) {
      console.error("Error in updateExerciseProgress:", error);
      throw new functions.https.HttpsError(
        "internal",
        `Failed to update progress: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
);

// Cloud Function: Get Exercise Progress
export const getExerciseProgress = functions.https.onCall(
  async (data: { dogId: string }, context) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const userId = context.auth.uid;
      const { dogId } = data;

      const progressRef = db
        .collection("users")
        .doc(userId)
        .collection("dogs")
        .doc(dogId)
        .collection("trainingPrograms")
        .doc("progress");

      const progressDoc = await progressRef.get();

      if (!progressDoc.exists) {
        return {
          success: true,
          progress: { exercises: {}, createdAt: Date.now() },
        };
      }

      return {
        success: true,
        progress: progressDoc.data(),
      };
    } catch (error) {
      console.error("Error in getExerciseProgress:", error);
      throw new functions.https.HttpsError(
        "internal",
        `Failed to get progress: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
);
