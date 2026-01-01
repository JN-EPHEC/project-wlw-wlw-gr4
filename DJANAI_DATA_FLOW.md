# 📱 DjanAI User Flow & Data Persistence

**Date:** 1 January 2026  
**Purpose:** Explain how programs are created, saved, and accessed  

---

## 🔄 Complete User Journey

### **Scenario: User Creates AI Training Program**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DOG DETAIL PAGE (app/DogDetailPage.tsx)                  │
│                                                             │
│ User sees their dog profile                                │
│ Two DjanAI buttons already exist:                          │
│   🟣 Nouveau Programme (Create new)                        │
│   🟢 Voir le Programme Actuel (View existing)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                    Click 🟣
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. DJANAI QUIZ (DjanaiResultsScreen.tsx)                   │
│                                                             │
│ User answers 9 questions:                                  │
│   1. Age category                                          │
│   2. Breed                                                 │
│   3. Size                                                  │
│   4. Energy level                                          │
│   5. Owner experience                                      │
│   6. Objectives (multi-select)                            │
│   7. Behaviors (multi-select)                             │
│   8. Environment                                           │
│   9. Available time                                        │
│                                                             │
│ onPress → Navigate to DjanaiLoadingScreen                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                    Submit
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. LOADING SCREEN (DjanaiLoadingScreen.tsx)                │
│                                                             │
│ Brain icon pulsing animation                               │
│ Text: "DjanAI analyse vos réponses..."                     │
│                                                             │
│ BEHIND THE SCENES:                                         │
│   → Calls Cloud Function: generateDjanaiProgram()          │
│   → Sends 9 quiz answers                                   │
│   → Waits for Claude API response (10-15 sec)             │
│   → Cloud Function SAVES to Firestore automatically        │
│                                                             │
│ Flow: answers → Cloud Function → Claude API → Firestore    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                 Generation complete
                 Program saved to DB ✓
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PROGRAM DISPLAY (DjanaiProgramScreen.tsx)               │
│                                                             │
│ Shows the AI-generated program with 3 tabs:               │
│   📅 Programme (Weekly sessions)                           │
│   💪 Exercices (All exercises)                             │
│   💡 Conseils (Tips & advice)                              │
│                                                             │
│ DATA LOADED FROM:                                          │
│   → Context (from generation) OR                           │
│   → Firestore (if user comes back later)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 💾 Data Persistence Flow

### **When Program is Generated:**

```
1. User submits quiz
   ↓
2. Cloud Function receives answers
   ↓
3. Cloud Function calls Claude API
   ↓
4. Claude returns JSON program
   ↓
5. Cloud Function SAVES to Firestore:
   
   /users/{userId}
     /dogs/{dogId}
       /trainingPrograms
         /latest
           {
             title: "Programme pour Max",
             description: "...",
             sessions: [...],
             exercises: {...},
             advice: {...},
             generatedAt: 2026-01-01T12:00:00Z,
             version: 1,
             completedSessions: []
           }
   ↓
6. Cloud Function returns program to app
   ↓
7. App displays program immediately
```

### **When User Comes Back Later:**

```
User on dog detail page
   │
   ├─ Click "Nouveau Programme" 
   │  → Repeat above flow (generate new)
   │
   └─ Click "Voir le Programme Actuel"
      → DjanaiProgramScreen loads
      → useEffect triggers
      → Reads from Firestore:
        users/{uid}/dogs/{dogId}/trainingPrograms/latest
      → If exists, displays program
      → If not exists, shows "No program" message
```

---

## 🗄️ Firestore Collection Structure

```
/users
  /userId (e.g., "auth0_user_123")
    /dogs
      /dogId (e.g., "dog_max_456")
        /trainingPrograms
          /latest                          ← This is the saved program
            {
              "title": "Programme pour Max",
              "description": "Programme spécialisé pour Max...",
              "sessionCount": 4,
              "ageCategory": "Chiot (0-12 mois)",
              "energyLevel": "Énergique",
              "dogId": "dog_max_456",
              "dogName": "Max",
              "generatedAt": Timestamp(2026-01-01T12:00:00Z),
              "version": 1,
              "completedSessions": [],
              "sessions": [
                {
                  "id": "1",
                  "title": "Semaine 1: Les Bases",
                  "goal": "Établir la confiance",
                  "exercises": [...]
                }
              ],
              "exercises": {
                "title": "Tous les exercices",
                "items": [...]
              },
              "advice": {
                "title": "Conseils importants",
                "categories": [...]
              }
            }
```

**Key Points:**
- ✅ Path: `users/{uid}/dogs/{dogId}/trainingPrograms/latest`
- ✅ File saved automatically by Cloud Function
- ✅ One program per dog (overwrite when generating new)
- ✅ Contains all quiz answers + generated content
- ✅ Real-time access via Firestore SDK

---

## 🔄 Component Integration

### **DjanaiProgramScreen.tsx** (Updated)

```typescript
export default function DjanaiProgramScreen({ navigation, route }: Props) {
  const { program, setProgram } = useDjanai();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const dogId = (route.params as any)?.dogId;

  // NEW: Load from Firestore on component mount
  useEffect(() => {
    const loadProgramFromFirestore = async () => {
      if (!user || !dogId) {
        setLoading(false);
        return;
      }

      try {
        // Read from: users/{uid}/dogs/{dogId}/trainingPrograms/latest
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
          // Program found in DB
          setProgram(docSnap.data() as any);
        } else {
          // No program yet
          console.log("No program generated yet");
        }
      } catch (error) {
        console.error("Error loading from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgramFromFirestore();
  }, [dogId, user]);

  // If loading, show spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no program, show empty state
  if (!program) {
    return <NoProgram />;
  }

  // Show program
  return (
    <View>
      {/* Render sessions, exercises, advice */}
    </View>
  );
}
```

---

## 🚀 Real-time Access Features

### **Feature 1: Generate New Program**

```
User on dog detail page
   │
   └─ Click "Nouveau Programme"
      → Navigate to quiz
      → Answer questions
      → Submit
      → Cloud Function generates + saves to Firestore
      → Show program immediately
      → Program persists in DB ✓
```

### **Feature 2: View Existing Program**

```
User on dog detail page
   │
   └─ Click "Voir le Programme Actuel"
      → Navigate to DjanaiProgramScreen
      → useEffect loads from Firestore
      → If program exists, display it ✓
      → If not exists, show "No program" message
```

### **Feature 3: App Closes and Reopens**

```
User closes app
   │
   [Program stays in Firestore]
   │
User reopens app
   │
   └─ Navigate to dog detail page
      → Click "Voir le Programme Actuel"
      → Load from Firestore ✓
      → Program shows up immediately
```

---

## 📊 Comparison: Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Generate Program** | Mock data | Real AI (Claude) |
| **Save Program** | Lost on refresh | Saved to Firestore ✓ |
| **Access Later** | Not possible | Load from DB ✓ |
| **Real-time Access** | No | Yes ✓ |
| **Persistence** | No | Yes ✓ |
| **Multiple Programs** | Can overwrite | Latest version saved |
| **Program History** | None | Can add later |

---

## 🔒 Security & Authentication

### **Cloud Function Security:**

```typescript
// This line ensures only authenticated users can generate:
if (!context.auth) {
  throw new functions.https.HttpsError("unauthenticated", "Login required");
}

// Benefits:
✅ Only logged-in users can call function
✅ userId automatically available
✅ Programs saved to user's own folder
✅ No cross-user data access
✅ Firebase Auth handles it automatically
```

### **Firestore Rules (Recommended):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/dogs/{dogId}/trainingPrograms/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 📈 Data Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: User Initiates                                      │
│ Location: DogDetailPage                                     │
│ Action: Click "Nouveau Programme"                          │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Quiz Input                                          │
│ Location: DjanaiResultsScreen                              │
│ Data: 9 quiz answers                                        │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Cloud Function Called                               │
│ Location: Firebase Cloud Functions                          │
│ Function: generateDjanaiProgram()                           │
│ Action: Sends quiz answers to Claude API                   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: AI Generation                                       │
│ Location: Anthropic Claude API                              │
│ Model: claude-3-5-sonnet-20241022                          │
│ Action: Generate personalized training program              │
│ Output: JSON with sessions, exercises, advice              │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Database Save                                       │
│ Location: Firestore                                         │
│ Path: /users/{uid}/dogs/{dogId}/trainingPrograms/latest    │
│ Data: Complete program JSON                                 │
│ Result: ✓ Saved and Persisted                              │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Display                                             │
│ Location: DjanaiProgramScreen                              │
│ Source: Context (or Firestore on reload)                   │
│ Result: User sees their personalized program               │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Future Access                                       │
│ Location: Any time user opens DjanaiProgramScreen          │
│ Source: Load from Firestore                                │
│ Result: Program loads from database, not lost ✓            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Testing the Full Flow

### **Test 1: Generate & View Immediately**

```bash
1. Open app
2. Navigate to dog detail page
3. Click "Nouveau Programme"
4. Answer all 9 questions
5. Wait 10-15 seconds for generation
6. See program display
✓ Program shows immediately (from Context)
```

### **Test 2: Generate & Check Firestore**

```bash
1. Complete Test 1
2. Open Firebase Console
3. Navigate to: Firestore → users → {yourId} → dogs → {dogId} → trainingPrograms → latest
4. Verify program data is there
✓ Document exists with all program data
```

### **Test 3: Close App & Come Back**

```bash
1. Complete Test 1 (generate program)
2. Close app completely
3. Reopen app
4. Navigate to dog detail page
5. Click "Voir le Programme Actuel"
6. Watch loading spinner
7. See program load from Firestore
✓ Program persists and loads correctly
```

### **Test 4: Generate New Program (Overwrite)**

```bash
1. Complete Test 1 (have existing program)
2. Go back to dog detail page
3. Click "Nouveau Programme"
4. Answer questions DIFFERENTLY
5. Generate new program
6. Check Firestore (latest should have new data)
✓ Old program replaced with new one
```

---

## 🎯 Success Indicators

- ✅ Program generates in 10-15 seconds
- ✅ Program displays with all 3 tabs (Sessions, Exercises, Advice)
- ✅ Program appears in Firestore at correct path
- ✅ Program still there after closing/reopening app
- ✅ "Voir le Programme Actuel" button loads from DB
- ✅ Generating new program overwrites old one
- ✅ Console logs show "[DjanAI]" messages

---

## 🔗 Key Files Involved

| File | Purpose | Change |
|------|---------|--------|
| `functions/src/index.ts` | Cloud Function | ✏️ Create (new) |
| `screens/user/DjanaiLoadingScreen.tsx` | Show loading animation | ✏️ Update |
| `screens/user/DjanaiProgramScreen.tsx` | Display program | ✏️ Update (add Firestore load) |
| `app/DogDetailPage.tsx` | Dog profile | ✅ No change (buttons exist) |
| `context/DjanaiContext.tsx` | State management | ✅ No change |

---

**Ready to test?** Start with Test 1 after deploying the Cloud Function! 🚀
