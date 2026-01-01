# 🔥 DjanAI Implementation - Firebase Cloud Functions

**Date:** 1 January 2026  
**Approach:** Firebase Cloud Functions + Claude API  
**Complexity:** Easy  
**Total Time:** ~2 hours  
**Status:** 🚀 Ready to Start

---

## 🎯 Overview

We're building a real AI dog training program generator using:
- **Frontend:** React Native (already built - DjanaiLoadingScreen, DjanaiProgramScreen)
- **Backend:** Firebase Cloud Functions (serverless, no infrastructure)
- **AI:** OpenAI GPT-4 API (real intelligence)
- **Storage:** Firestore (automatic save + persistence)

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│  React Native App (DjanaiLoadingScreen)         │
│  User answers 9 quiz questions                  │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Call Firebase Cloud Function
                   ↓
┌─────────────────────────────────────────────────┐
│  Firebase Cloud Function (generateDjanaiProgram)│
│  - Validates user is logged in                  │
│  - Sends answers to Claude API                  │
│  - Gets AI response                             │
│  - Parses JSON                                  │
│  → AUTOMATICALLY SAVES TO FIRESTORE ✓           │
│  - Returns program                              │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ↓                   ↓
    ┌─────────┐        ┌──────────┐
    │ Claude  │        │Firestore │
    │  API    │        │ Database │
    └─────────┘        └────────┬─────┐
         │                      │     │
         └──────────────────────┼─────┤
                                │     │
                    ┌───────────┘     │
                    │                 │
                    ↓                 ↓
         ┌────────────────────────────────────┐
         │  DjanaiProgramScreen               │
         │                                    │
         │  Option 1: Show from Context       │
         │  (right after generation)          │
         │                                    │
         │  Option 2: Load from Firestore     │
         │  (when user comes back later)      │
         │                                    │
         │  → User sees program in real-time ✓│
         │  → Program persists in DB ✓        │
         │  → Access anytime from dog page ✓  │
         └────────────────────────────────────┘
```

**Key Point:** The Cloud Function automatically saves to Firestore when the program is generated. This means:
- ✅ Program is saved in the database
- ✅ User can access it anytime by clicking "Voir le Programme Actuel"
- ✅ Program persists even if user closes app
- ✅ Real-time access (no extra setup needed)

---

## 📋 Implementation Steps (In Order)

### ✅ Step 1: Get OpenAI API Key (5 min)

**What:** Get your API key from OpenAI

**Action:**
1. Go to https://platform.openai.com/api/keys
2. Sign up or log in (free account, but requires payment method)
3. Create an API key
4. Copy it (looks like: `sk-...`)
5. Save it somewhere safe (you'll need it soon)

**Cost:** GPT-4o: ~$0.005 per request (~$1-2/month for MVP)

---

### ✅ Step 2: Initialize Firebase Functions (20 min)

**What:** Create the Firebase Functions folder in your project

**Commands:**
```bash
cd /Users/lavic/Downloads/project-wlw-wlw-gr4

# Check if functions folder exists
ls functions/

# If NOT, initialize (answer: TypeScript)
firebase init functions
# → Select TypeScript
# → Allow ESLint? No
# → Install npm dependencies? Yes

# Navigate to functions
cd functions
```

**What happens:** Creates a `functions/` folder with boilerplate code

---

### ✅ Step 3: Install Dependencies (10 min)

**What:** Add the OpenAI SDK

**Commands:**
```bash
cd /Users/lavic/Downloads/project-wlw-wlw-gr4/functions

npm install openai
npm install --save-dev @types/node
```

**Verify:**
```bash
npm list openai
# Should show: openai@x.x.x
```

---

### ✅ Step 4: Create Cloud Function (30 min)

**What:** Write the actual function that calls Claude

**File to Edit:** `functions/src/index.ts`

**Action:** Replace the entire content with this:

```typescript
import * as functions from "firebase-functions";
import OpenAI from "openai";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ========================================
// Cloud Function: Generate DjanAI Program
// ========================================
exports.generateDjanaiProgram = functions.https.onCall(
  async (data, context) => {
    // 1. SECURITY: User must be authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Vous devez être connecté"
      );
    }

    const userId = context.auth.uid;
    const {
      age,
      breed,
      size,
      energy,
      experience,
      objectives,
      behaviors,
      environment,
      timeAvailable,
      dogName,
      dogId,
    } = data;

    console.log(`[DjanAI] Generating program for dog: ${dogName}`);

    try {
      // 2. BUILD PROMPT for OpenAI
      const prompt = `Tu es un expert en éducation canine avec 20+ ans d'expérience. Crée un programme d'apprentissage personnalisé et détaillé pour ce chien.

PROFIL DU CHIEN:
- Nom: ${dogName}
- Âge: ${age}
- Race: ${breed}
- Taille: ${size}
- Niveau d'énergie: ${energy}
- Comportements actuels: ${behaviors.join(", ")}

PROFIL DU PROPRIÉTAIRE:
- Expérience: ${experience}
- Objectifs d'apprentissage: ${objectives.join(", ")}
- Environnement de vie: ${environment}
- Temps disponible par jour: ${timeAvailable}

INSTRUCTIONS:
- Crée un programme réaliste et progressif
- Chaque session doit être faisable
- Donne des conseils pratiques et testés
- Sois personnalisé selon le profil
- Retourne UNIQUEMENT du JSON valide, SANS markdown ni explications

RETOURNE CE JSON (exactement ce format):
{
  "title": "Programme personnalisé pour ${dogName}",
  "description": "Description courte du programme global",
  "sessions": [
    {
      "id": "1",
      "title": "Semaine 1: Les Bases",
      "goal": "Établir la confiance et les commandes de base",
      "exercises": [
        {
          "id": "1",
          "name": "Assis",
          "duration": "5-10 minutes",
          "frequency": "3 fois par jour"
        },
        {
          "id": "2",
          "name": "Couché",
          "duration": "5-10 minutes",
          "frequency": "2 fois par jour"
        }
      ]
    },
    {
      "id": "2",
      "title": "Semaine 2-3: Progression",
      "goal": "Renforcer et ajouter nouvelles commandes",
      "exercises": [
        {
          "id": "3",
          "name": "Rappel",
          "duration": "10 minutes",
          "frequency": "Quotidien"
        }
      ]
    },
    {
      "id": "3",
      "title": "Semaine 4+: Consolidation",
      "goal": "Solidifier les apprentissages",
      "exercises": [
        {
          "id": "4",
          "name": "Marche en laisse",
          "duration": "15-20 minutes",
          "frequency": "Quotidien"
        }
      ]
    }
  ],
  "exercises": {
    "title": "Tous les exercices du programme",
    "description": "Liste complète avec explications",
    "items": [
      {
        "id": "1",
        "name": "Assis",
        "duration": "5-10 minutes",
        "frequency": "3 fois par jour",
        "description": "Apprenez au chien à s'asseoir sur commande. C'est la base.",
        "emoji": "🪑"
      }
    ]
  },
  "advice": {
    "title": "Conseils importants pour réussir",
    "description": "Recommandations clés pour ce chien spécifique",
    "categories": [
      {
        "id": "1",
        "title": "Récompenses & Motivation",
        "category": "Motivation",
        "tips": [
          "Utilisez des friandises qu'il aime vraiment",
          "Félicitez oralement immédiatement après",
          "Variez les récompenses pour maintenir l'intérêt"
        ]
      },
      {
        "id": "2",
        "title": "Quand pratiquer",
        "category": "Timing",
        "tips": [
          "Préférez des sessions courtes (5-15 min max)",
          "Practiques quand le chien est reposé et attentif",
          "Évitez après les repas"
        ]
      }
    ]
  }
}`;

      // 3. CALL OPENAI API
      console.log("[DjanAI] Calling OpenAI GPT-4o...");
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

      // 4. PARSE RESPONSE
      const responseText = message.choices[0].message.content || "";
      console.log("[DjanAI] OpenAI response received, parsing...");

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("[DjanAI] Failed to extract JSON from response");
        throw new Error("Invalid OpenAI response format");
      }

      const program = JSON.parse(jsonMatch[0]);
      console.log("[DjanAI] JSON parsed successfully");

      // 5. SAVE TO FIRESTORE
      const db = admin.firestore();
      console.log("[DjanAI] Saving to Firestore...");

      const programRef = db
        .collection("users")
        .doc(userId)
        .collection("dogs")
        .doc(dogId)
        .collection("trainingPrograms")
        .doc("latest");

      await programRef.set({
        ...program,
        dogId,
        dogName,
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        version: 1,
        completedSessions: [],
      });

      console.log("[DjanAI] Program saved to Firestore ✓");

      // 6. RETURN RESPONSE
      return {
        success: true,
        program,
        message: "Programme généré et sauvegardé avec succès",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("[DjanAI] Error:", error);
      throw new functions.https.HttpsError(
        "internal",
        error instanceof Error ? error.message : "Erreur lors de la génération"
      );
    }
  }
);
```

**Verification:** File should have ~150 lines, no errors

---

### ✅ Step 5: Add Environment Variable (10 min)

**What:** Store your OpenAI API key securely

**Action 1: Create .env.local file**
```bash
cd /Users/lavic/Downloads/project-wlw-wlw-gr4/functions

# Create the file
cat > .env.local << 'EOF'
OPENAI_API_KEY=sk_YOUR_KEY_HERE
EOF
```

**Action 2: Replace with your actual key**
```bash
# Edit the file with your API key
nano .env.local
# Replace sk_YOUR_KEY_HERE with your actual key from Step 1
# Save (Ctrl+O, Enter, Ctrl+X)
```

**Action 3: Prevent accidental commit**
```bash
# Make sure .gitignore includes it
echo ".env.local" >> .gitignore
```

**⚠️ IMPORTANT:** Never commit this file! The .gitignore already includes it.

---

### ✅ Step 6: Deploy Function to Firebase (5 min)

**What:** Upload your function to Google Cloud

**Commands:**
```bash
cd /Users/lavic/Downloads/project-wlw-wlw-gr4

# Deploy only functions
firebase deploy --only functions

# Watch the output - should show:
# ✔ functions: Deployed successfully
```

**After deployment:**
```bash
# View logs
firebase functions:log

# You should see:
# ✔ functions deployed successfully
```

**Verify in Firebase Console:**
1. Go to Firebase Console → Your Project
2. Navigate to Functions
3. Should see `generateDjanaiProgram` listed
4. Status should be green ✓

---

### ✅ Step 7: Update DjanaiLoadingScreen (20 min)

**What:** Make the loading screen call the real Cloud Function instead of mock

**File:** `screens/user/DjanaiLoadingScreen.tsx`

**Find the useEffect that calls `generateMockProgram`:**

Look for this code (around line 150):
```typescript
useEffect(() => {
    const circleAnimation = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.bezier(0.45, 0, 0.55, 1),
        useNativeDriver: true,
      })
    );

    circleAnimation.start();

    const generateProgram = async () => {
      setIsLoading(true);
      // Simulation de délai
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockProgram = generateMockProgram(quizAnswers);
      setProgram(mockProgram);
      setIsLoading(false);

      (navigation as any).replace('djanai-program', { dogId });
    };
```

**Replace the `generateProgram` function with this:**

```typescript
const generateProgram = async () => {
  setIsLoading(true);
  try {
    // Import this at the top of file:
    // import { getFunctions, httpsCallable } from "firebase/functions";

    const functions = getFunctions();
    const generateDjanai = httpsCallable(functions, "generateDjanaiProgram");

    console.log("[DjanAI] Calling Cloud Function...");
    
    const result = await generateDjanai({
      ...quizAnswers,
      dogName: (route.params as any)?.dogName || "Mon Chien",
      dogId,
    });

    const { program } = result.data as any;
    console.log("[DjanAI] Program received and saved to Firestore:", program);
    
    setProgram(program);
    setIsLoading(false);

    (navigation as any).replace("djanai-program", { dogId });
  } catch (error) {
    console.error("[DjanAI] Error calling function:", error);
    // Fallback to mock if error
    const mockProgram = generateMockProgram(quizAnswers);
    setProgram(mockProgram);
    setIsLoading(false);

    (navigation as any).replace("djanai-program", { dogId });
  }
};
```

**Also add import at the top of file:**
```typescript
import { getFunctions, httpsCallable } from "firebase/functions";
```

---

### ✅ Step 8: Update DjanaiProgramScreen to Load from Firestore (20 min)

**IMPORTANT:** The buttons already exist on DogDetailPage! There are two buttons:
- "Nouveau Programme" → Navigate to quiz (djanaiResults)
- "Voir le Programme Actuel" → Navigate to djanai-program

**What:** Make DjanaiProgramScreen load the saved program from Firestore (not just from Context)

**File:** `screens/user/DjanaiProgramScreen.tsx`

**Problem:** Currently it only shows program from Context. When user:
1. Creates program ✓ (saved to Firestore automatically by Cloud Function)
2. Leaves the app
3. Comes back and clicks "Voir le Programme Actuel"
4. Program is NOT loaded (Context is empty)

**Solution:** Load from Firestore on component mount

**Add these imports at the top:**
```typescript
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
```

**Replace the component start with this:**
```typescript
export default function DjanaiProgramScreen({ navigation, route }: Props) {
  const { program, setProgram } = useDjanai();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('programme');
  const [loading, setLoading] = useState(true);
  const dogId = (route.params as any)?.dogId;

  // Load program from Firestore on mount
  useEffect(() => {
    const loadProgramFromFirestore = async () => {
      if (!user || !dogId) {
        setLoading(false);
        return;
      }

      try {
        const programRef = doc(
          db,
          "users",
          user.uid,
          "dogs",
          dogId,
          "trainingPrograms",
          "latest"
        );

        const docSnap = await getDoc(programRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          console.log("[DjanAI] Program loaded from Firestore:", data.title);
          setProgram(data);
        } else {
          console.log("[DjanAI] No program found in Firestore for dogId:", dogId);
        }
      } catch (error) {
        console.error("[DjanAI] Error loading program from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgramFromFirestore();
  }, [dogId, user, setProgram]);
```

**Then update the "no program" error check:**
```typescript
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Programme DjanAI</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Chargement du programme...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!program) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Programme DjanAI</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aucun programme disponible</Text>
          <Text style={styles.errorSubtext}>
            Créez un nouveau programme en cliquant sur "Nouveau Programme"
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={handleBack}
          >
            <Text style={styles.errorButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
```

---

### ✅ Step 9: Full Integration Test (15 min)

**What:** Test the entire flow end-to-end

**Steps:**
1. Start the app
   ```bash
   npm start
   ```

2. Navigate to a dog detail page

3. Click "Programme DjanAI" button

4. Answer all 9 quiz questions

5. Wait for generation (10-15 seconds)
   - You'll see the loading animation
   - Watch console for `[DjanAI]` logs

6. Verify the program displays
   - Sessions should show
   - Exercises should show
   - Advice should show

7. Check Firestore
   - Go to Firebase Console
   - Navigate to: `users/{your-uid}/dogs/{dogId}/trainingPrograms/latest`
   - Verify program is saved there

8. **BONUS:** Refresh the page
   - The program should load from Firestore
   - Instant display (no waiting)

---

## 📊 Summary Table

| Item | Status | Time | Done |
|------|--------|------|------|
| Get Anthropic key | ⏳ TODO | 5 min | ❌ |
| Init Firebase Functions | ⏳ TODO | 20 min | ❌ |
| Install SDK | ⏳ TODO | 10 min | ❌ |
| Create Cloud Function | ⏳ TODO | 30 min | ❌ |
| Add API key to .env | ⏳ TODO | 10 min | ❌ |
| Deploy to Firebase | ⏳ TODO | 5 min | ❌ |
| Update DjanaiLoadingScreen | ⏳ TODO | 20 min | ❌ |
| Update DjanaiProgramScreen (Load from DB) | ⏳ TODO | 20 min | ❌ |
| Full end-to-end test | ⏳ TODO | 15 min | ❌ |

**Total: ~2.5 hours**

**Note:** The DjanAI buttons already exist on DogDetailPage! Two buttons are already there:
- 🟣 "Nouveau Programme" → Starts the quiz
- 🟢 "Voir le Programme Actuel" → Views saved program

---

## 🆘 Troubleshooting

### Issue: "OPENAI_API_KEY is undefined"
**Solution:** Make sure you created `.env.local` in the functions folder with your real key

### Issue: "Function not found"
**Solution:** Did you run `firebase deploy --only functions`? Watch for the ✓ success message

### Issue: "User not authenticated"
**Solution:** Make sure user is logged in before calling the function

### Issue: "Invalid JSON response"
**Solution:** GPT sometimes adds markdown. The regex handles this, but check the function logs

### Issue: "API Rate Limit"
**Solution:** OpenAI has rate limits. Wait a minute and try again

### Issue: "Cloud Function cold start is slow"
**Solution:** Normal for first call (2-3 sec). Subsequent calls are faster. This is expected.

---

## 🎯 What's Next (After Implementation)

1. **Test with real dogs:** Add more test data
2. **Track progress:** Add ability to mark sessions as complete
3. **Edit programs:** Let users modify the generated programs
4. **Share programs:** Allow sharing with other owners
5. **Fine-tune prompts:** Improve OpenAI prompts based on feedback

---

## 💾 File Structure After Implementation

```
project/
├── functions/
│   ├── src/
│   │   └── index.ts          ← Your Cloud Function (modified)
│   ├── .env.local            ← API key (don't commit!)
│   └── package.json          ← Added openai
├── screens/user/
│   └── DjanaiLoadingScreen.tsx ← Modified (uses Cloud Function)
├── screens/user/
│   └── DjanaiProgramScreen.tsx ← Modified (loads from Firestore)
├── app/
│   └── DogDetailPage.tsx     ← No change (buttons exist)
└── ...
```

---

## ✅ Success Criteria

- [ ] App compiles without errors
- [ ] Can navigate to DjanAI quiz
- [ ] Can answer all 9 questions
- [ ] Generation takes 10-15 seconds
- [ ] Program displays with sessions, exercises, advice
- [ ] Program saved to Firestore
- [ ] Can refresh and program loads from cache
- [ ] Fallback to mock if API fails

---

## 🚀 YOU'RE READY!

Ready to start? Let me know when you complete each step and I'll help with any issues! 

**Next action:** Get your Anthropic API key from https://console.anthropic.com 🔑
