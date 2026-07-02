import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Lazy-initialize GoogleGenAI client to avoid crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { goal, tier, experience, availability } = await req.json();

    if (!goal || !tier || !experience) {
      return NextResponse.json(
        { error: "Missing required parameters: goal, tier, experience" },
        { status: 400 }
      );
    }

    let client;
    try {
      client = getAIClient();
    } catch (err: any) {
      console.error("Gemini API Key missing:", err.message);
      return NextResponse.json(
        {
          error: "API Key Not Configured",
          message: "The Gemini API key is missing. Please set GEMINI_API_KEY in your AI Studio secrets panel.",
          isDemo: true,
          demoPlan: generateDemoPlan(goal, tier, experience, availability)
        },
        { status: 200 } // Return 200 with a clean fallback so the client can show a beautiful demo plan
      );
    }

    const systemPrompt = `You are an elite athletic coach and sports nutritionist for ApexFit, a premium hyper-personalized fitness subscription service.
Your task is to generate a highly detailed, professional, and motivating Weekly Fitness Blueprint and Nutrition Guide.
Format the output in clean, readable Markdown without any surrounding code fences.
Include the following sections:
1. 🎯 **The Athlete Profile**: A brief summary of their goal: "${goal}", current experience level: "${experience}", subscription tier: "${tier}", and weekly availability: "${availability} hours". Include a short, highly motivating intro.
2. 🏋️‍♂️ **Workout Blueprint**: A daily schedule showing recommended exercises, sets, reps, and RPE (Rate of Perceived Exertion) suited to their subscription tier ("${tier}"). Give a structured table or bold lists.
3. 🥗 **Nutritional Catalyst**: Daily macro recommendations (Protein, Carbs, Fats) and key superfood fuel strategies to optimize results for their "${goal}" goal.
4. 📈 **Apex Progress Strategy**: One actionable pro tip to boost progress and keep consistency high.`;

    const promptText = `Please generate a personalized fitness blueprint for:
Goal: ${goal}
Subscription Tier: ${tier}
Experience Level: ${experience}
Weekly Availability: ${availability} hours`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: systemPrompt },
        { text: promptText }
      ]
    });

    return NextResponse.json({
      text: response.text || "Failed to generate plan. Please try again.",
      isDemo: false
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// Beautiful static fallback workout planner in case API key is not configured
function generateDemoPlan(goal: string, tier: string, experience: string, availability: string) {
  return `### 🎯 **The Athlete Profile (PROTOTYPE DEMO)**
- **Goal**: ${goal}
- **Experience Level**: ${experience}
- **Subscription Tier**: ${tier} (Apex Premium Tier Demo)
- **Weekly Commitment**: ${availability} Hours

*Note: Since the GEMINI_API_KEY is not yet configured, we have unlocked this high-performance blueprint preview using local athletic models.*

---

### 🏋️‍♂️ **Workout Blueprint (Weekly Microcycle)**

#### **Phase 1: Peak Strength & Hypertrophy**
*Recommended Schedule: 4 active sessions / week*

| Day | Workout Focus | Core Exercises | Sets x Reps | RPE | Recovery Focus |
|---|---|---|---|---|---|
| **Monday** | Anterior Power | Barbell Squats, Incline Bench Press, Overhead Press | 4 x 6, 3 x 8, 3 x 10 | 8.5/10 | Cold shower, high-carb intake |
| **Tuesday** | Posterior Drive | Deadlifts, Romanian Deadlifts, Weighted Pull-ups | 3 x 5, 3 x 8, 4 x max | 9/10 | Active mobility, dynamic stretching |
| **Wednesday** | Active Recalibration | Core Stability, Steady-State Cardio (Zone 2) | 30 mins, Planks | 5/10 | Hydration, 8+ hours sleep |
| **Thursday** | Full-Body Hypertrophy | Dumbbell Lunges, Dips, Lateral Raises, Hammer Curls | 3 x 12, 3 x 10, 4 x 15 | 8/10 | Foam rolling, magnesium bath |

---

### 🥗 **Nutritional Catalyst (Fuel Strategy)**

To aggressively support your goal of **${goal}**, aim for these target daily targets:
- **Daily Target Calories**: ~2,600 kcal (adjusted for active days)
- **Protein Target**: 1.8g per kg of body weight (approx. 160g) to accelerate muscle myofibrillar repair.
- **Carbohydrates**: 3.5g per kg (approx. 300g) to keep glycogen reserves topped off.
- **Healthy Fats**: 1g per kg (approx. 85g) for essential hormonal optimization.

**Apex Athlete Fuel Strategy**:
- Consume 40g of whey/vegan isolate protein with 50g of simple fast-acting carbohydrates within 45 minutes post-workout.
- Stay hydrated with 3.5 liters of mineralized water daily.

---

### 📈 **Apex Progress Strategy**
**"The 1% Rule"**: Track your weights for every single lift. Next week, aim to add exactly **1 rep** or **1kg** to your major lifts. This simple progressive overload is the ultimate catalyst for permanent physical transformation.`;
}
