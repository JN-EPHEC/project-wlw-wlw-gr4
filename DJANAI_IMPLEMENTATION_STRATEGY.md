# 🤖 DjanAI Implementation Strategy

**Date:** 1 January 2026  
**Goal:** Implement AI-powered dog training program generation for v1 MVP  
**Complexity:** Medium  
**Effort:** 8-12 hours for full implementation

---

## 📊 Current State Analysis

### ✅ What's Already Built

**Existing Components:**
- `DjanaiScreen.tsx` - Entry point with dog selection
- `DjanaiResultsScreen.tsx` - 9-question quiz (currently shows you have 8 questions, but there are 9)
- `DjanaiLoadingScreen.tsx` - Loading animation with AI theme
- `DjanaiProgramScreen.tsx` - Results display
- `DjanaiContext.tsx` - State management
- Navigation routing fully set up

**Quiz Questions (9 total):**
1. Age category
2. Breed category
3. Size
4. Energy level
5. Owner experience level
6. Training objectives (multi-select)
7. Current behaviors (multi-select)
8. Living environment
9. Available daily time

**Mock Generation:**
- Currently generates fake data in `generateMockProgram()`
- Returns structured program with sessions, exercises, advice

### ❌ What's Missing

- **No real AI integration** (currently mocked)
- **No Backend** (no API endpoint)
- **No Persistence** (data lost on refresh)
- **No Real API calls** (hardcoded responses)

---

## 🎯 Three Implementation Approaches

### Option 1: Backend API + Claude AI (RECOMMENDED FOR v1)

**Approach:** Create backend endpoint → call Claude API → return structured response

**Pros:**
✅ Simple to implement (one API call)  
✅ Uses open API (Claude via API key)  
✅ No need for complex backend logic  
✅ Easy to scale later  
✅ Costs reasonable (~$0.03-0.10 per request)  
✅ Can test immediately  

**Cons:**
❌ Requires backend (Vercel, Firebase Functions, etc.)  
❌ API costs (but very small)  
❌ Need Anthropic API key  

**Architecture:**
```
App (Quiz answers) 
  → POST /api/djanai/generate
    → Anthropic Claude API
    → Parse response
    → Return structured JSON
  ← JSON response (sessions, exercises, advice)
  → Save to Firestore
  → Display in UI
```

**Estimated Cost:** $50-100/month for thousands of requests

**Time to Implement:** 3-4 hours

---

### Option 2: Firebase Cloud Functions + OpenAI

**Approach:** Use Firebase Functions + OpenAI API for instant responses

**Pros:**
✅ No separate backend needed  
✅ Scales automatically  
✅ Integrates seamlessly with Firebase  
✅ Good OpenAI models available  

**Cons:**
❌ More complex setup  
❌ Cold start delays (2-3 seconds)  
❌ Requires Google Cloud setup  

**Time to Implement:** 4-5 hours

---

### Option 3: Hybrid - Local Template + Simple API Calls

**Approach:** Use hardcoded templates + light API call for personalization

**Pros:**
✅ Fastest to implement (1-2 hours)  
✅ Minimal costs  
✅ Works offline with fallback  
✅ Good for MVP  

**Cons:**
❌ Less "intelligent"  
❌ Feels less like real AI  
❌ Needs manual template updates  

---

## 🏆 RECOMMENDED: Option 1 with Vercel Serverless

**Why?** Best balance of simplicity, cost, and "real AI" feel for v1.

### Architecture

```
┌─────────────────────────────────────────┐
│   React Native App (DjanaiLoadingScreen)│
├─────────────────────────────────────────┤
│ POST /api/djanai/generate               │
│ {                                       │
│   age, breed, size, energy,             │
│   experience, objectives, behaviors,    │
│   environment, timeAvailable            │
│ }                                       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Vercel Function (Node.js)             │
│   - Validate input                      │
│   - Build Claude prompt                 │
│   - Call Anthropic API                  │
│   - Parse + structure response          │
│   - Return JSON                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Anthropic Claude API (claude-3-5-sonnet)
│   - Generate personalized program       │
│   - ~15 second response time            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   App receives structured JSON          │
│   - Save to Firestore                   │
│   - Display in DjanaiProgramScreen      │
│   - Allow editing/tracking              │
└─────────────────────────────────────────┘
```

---

## 📋 Implementation Steps (Option 1 Recommended)

### Step 1: Setup Backend (1 hour)

Choose one:

**Option A: Vercel (Simplest)**
```bash
npm install vercel
vercel link
# Create /api/djanai.js or .ts
```

**Option B: Firebase Cloud Functions**
```bash
npm install -g firebase-tools
firebase init functions
# Create function
firebase deploy --only functions
```

**Option C: Simple Node/Express (Self-hosted)**
```bash
npm install express
# Create simple server
```

### Step 2: Install Anthropic SDK (15 min)

```bash
npm install @anthropic-ai/sdk
# or for JS:
npm install @anthropic-ai/sdk
```

### Step 3: Create API Endpoint (1.5 hours)

**Example Vercel Function (`/api/djanai.ts`):**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
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
    } = req.body;

    // Build prompt for Claude
    const prompt = `Tu es un expert en éducation canine. Crée un programme d'apprentissage personnalisé.

Profil du chien:
- Nom: ${dogName}
- Âge: ${age}
- Race: ${breed}
- Taille: ${size}
- Niveau d'énergie: ${energy}
- Comportements actuels: ${behaviors.join(", ")}

Profil du propriétaire:
- Expérience: ${experience}
- Objectifs: ${objectives.join(", ")}
- Environnement: ${environment}
- Temps disponible: ${timeAvailable}

Génère un JSON strictement valide avec cette structure (SANS markdown, SANS explications):
{
  "title": "Programme personnalisé pour ${dogName}",
  "description": "Description courte du programme",
  "sessions": [
    {
      "id": "1",
      "title": "Session 1",
      "goal": "Objectif",
      "exercises": [
        {
          "id": "1",
          "name": "Assis",
          "duration": "5-10 min",
          "frequency": "Quotidien"
        }
      ]
    }
  ],
  "exercises": {
    "title": "Tous les exercices",
    "description": "Liste complète",
    "items": [
      {
        "id": "1",
        "name": "Assis",
        "duration": "5 min",
        "frequency": "Quotidien",
        "description": "Apprendre au chien..."
      }
    ]
  },
  "advice": {
    "title": "Conseils importants",
    "description": "Conseils généraux",
    "categories": [
      {
        "id": "1",
        "title": "Récompenses",
        "category": "Motivation",
        "tips": ["Utiliser des friandises", "Féliciter oralement"]
      }
    ]
  }
}`;

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.status(400).json({ error: "Invalid AI response format" });
    }

    const program = JSON.parse(jsonMatch[0]);

    res.status(200).json({
      success: true,
      program,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
```

### Step 4: Update DjanaiLoadingScreen (1 hour)

```typescript
// Replace the mock with real API call
const generateProgram = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(
      "https://your-vercel-domain.vercel.app/api/djanai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quizAnswers,
          dogName: "Your Dog Name",
        }),
      }
    );

    const data = await response.json();
    setProgram(data.program);
  } catch (err) {
    console.error("Error generating program:", err);
    // Fallback to mock
    const mockProgram = generateMockProgram(quizAnswers);
    setProgram(mockProgram);
  }
  setIsLoading(false);
  (navigation as any).replace("djanai-program", { dogId });
};
```

### Step 5: Add Persistence to Firestore (1 hour)

```typescript
// After program is generated, save it
const saveProgram = async (program) => {
  try {
    await setDoc(
      doc(db, "users", userId, "dogs", dogId, "trainingPrograms", "latest"),
      {
        ...program,
        generatedAt: new Date(),
        version: 1,
      }
    );
  } catch (err) {
    console.error("Error saving program:", err);
  }
};
```

### Step 6: Display in DogDetailPage (1 hour)

Add button:
```typescript
<TouchableOpacity 
  onPress={() => navigation.navigate('djanai', { dogId })}
  style={styles.programButton}
>
  <MaterialCommunityIcons name="brain" size={20} color="#fff" />
  <Text style={styles.programButtonText}>Programme DjanAI</Text>
</TouchableOpacity>
```

### Step 7: Test & Polish (1-2 hours)

- Test with different quiz answers
- Verify JSON parsing
- Add error handling
- Test on real device

---

## 💰 Cost Analysis

| Option | Setup | Monthly | Response Time |
|--------|-------|---------|---|
| **Claude API (Recommended)** | $0 | $30-100 | 5-15s |
| Firebase Functions | $0 | $20-50 | 2-5s |
| OpenAI | $0 | $40-80 | 3-8s |
| Self-hosted | $40/mo | $20 | 2-4s |

**For MVP: Claude API is best value**

---

## 🔐 Security Checklist

- [ ] Add API key validation (require auth token)
- [ ] Rate limit: 5 requests per user per day
- [ ] Validate input (max 10KB)
- [ ] Sanitize responses before storing
- [ ] Add error logging
- [ ] Test with invalid inputs
- [ ] Add timeout (30 seconds max)

**Example Rate Limiting:**
```typescript
// Use Firebase to track usage
const increment = await updateDoc(
  userRef,
  { "stats.djanaiCalls": increment(1) }
);

if (userStats.djanaiCalls > 5) {
  throw new Error("Daily limit reached");
}
```

---

## 🚀 Alternative: Faster v1 Without Real AI

If you want to launch today without waiting for backend:

**Hybrid Approach (2 hours):**
1. Keep the mock for now (fully functional)
2. Add backend later (one API swap)
3. Template-based with variables

```typescript
const templates = {
  puppy: "Programme pour chiots...",
  energetic: "Programme haute énergie...",
  anxious: "Programme anti-anxiété...",
};

// Select template based on answers
const template = selectTemplate(quizAnswers);
const program = populateTemplate(template, quizAnswers);
```

---

## 📊 Implementation Timeline

| Phase | Task | Duration | Priority |
|-------|------|----------|----------|
| 1 | Setup Vercel + Anthropic | 1h | 🔴 |
| 2 | Create API endpoint | 1.5h | 🔴 |
| 3 | Integrate with DjanaiLoadingScreen | 1h | 🔴 |
| 4 | Add Firestore persistence | 1h | 🟡 |
| 5 | Display in DogDetailPage | 1h | 🟡 |
| 6 | Test & bug fixes | 2h | 🟡 |
| 7 | Polish UI/UX | 1h | 🟢 |

**Total: 8-10 hours for full implementation**

---

## 🎓 My Recommendation

**For your situation (v1 MVP, not on stores):**

### Approach: Vercel + Claude API

**Why:**
1. ✅ Simplest to implement (1 API call)
2. ✅ Real AI (feels like magic to users)
3. ✅ Cheap ($30-50/month)
4. ✅ Fast setup (4 hours)
5. ✅ Easy to improve later
6. ✅ No infrastructure to maintain

**What to do today:**
1. Create Vercel account (free)
2. Generate Anthropic API key (free tier available)
3. Deploy the API endpoint
4. Update the loading screen
5. Test with real data

**What to do later:**
1. Add Firestore persistence
2. Add rate limiting
3. Add program editing
4. Add progress tracking
5. Fine-tune Claude prompts

---

## 🛠️ Setup Commands (Quick Start)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Create Anthropic account & get API key
# https://console.anthropic.com

# 3. Setup Vercel project
vercel login
vercel link

# 4. Add API key to Vercel secrets
vercel env add ANTHROPIC_API_KEY

# 5. Create api/djanai.ts (code above)

# 6. Deploy
vercel deploy
```

---

## ❓ FAQ

**Q: Do I need a backend?**  
A: Yes, for security. Never call Claude directly from the app (API key exposed).

**Q: Can I use OpenAI instead?**  
A: Yes, very similar setup. Claude is slightly cheaper and faster.

**Q: What about offline?**  
A: Cache the last generated program. Show it when offline.

**Q: How do users save programs?**  
A: Save to Firestore after generation. Link to dog profile.

**Q: Can I let them edit the program?**  
A: Yes, save it to Firestore as JSON and allow editing.

**Q: What if Claude API is down?**  
A: Return fallback mock program (already built in).

---

## 📞 Next Steps

1. **Today:** Decide which approach (I recommend #1)
2. **Tomorrow:** Setup backend (1-2 hours)
3. **Day 3:** Integrate with app (2 hours)
4. **Day 4:** Test & launch (2 hours)

Let me know which option you want and I'll help with the implementation! 🚀
