"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Check, 
  Zap, 
  ChevronRight, 
  Calendar, 
  Users, 
  Target, 
  Dumbbell, 
  Apple, 
  Heart, 
  Trophy, 
  Menu, 
  X,
  Plus,
  Scale,
  Brain,
  Clock,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

// Subscriptions Constant Data
const PLANS = [
  {
    id: "starter",
    name: "Base Track",
    priceMonthly: 19,
    priceAnnually: 15,
    tagline: "Essential tracking & routine guidelines",
    features: [
      "Access to standard training routines",
      "Automatic biometric tracker syncing",
      "Dynamic digital progress charts",
      "Community workout hub access",
      "E-mail customer support"
    ],
    accentColor: "border-slate-800 hover:border-slate-700",
    badge: null,
    multiplier: 0.8
  },
  {
    id: "pro",
    name: "Performance Pro",
    priceMonthly: 49,
    priceAnnually: 39,
    tagline: "Premium tracking with expert coaching",
    features: [
      "Everything in Base Track",
      "Weekly human coach progress review",
      "Custom routine blueprints generator",
      "Personalized daily nutrition targets",
      "Priority messaging with specialist trainers",
      "Advanced predictive goal charting"
    ],
    accentColor: "border-primary-500/50 hover:border-primary-400",
    badge: "Most Popular",
    multiplier: 1.0
  },
  {
    id: "elite",
    name: "Apex Elite",
    priceMonthly: 99,
    priceAnnually: 79,
    tagline: "Uncompromised custom-grade dynamic training",
    features: [
      "Everything in Performance Pro",
      "1-on-1 daily dedicated video coach check-ins",
      "Real-time pose & posture tracking analytics",
      "Custom supplements & vitamin protocols",
      "24/7 priority cellular coach hotline",
      "Free premium biometric smart scale included"
    ],
    accentColor: "border-accent-500/50 hover:border-accent-400 shadow-lg shadow-accent-500/10",
    badge: "Elite Tier",
    multiplier: 1.25
  }
];

export default function FitnessLandingPage() {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Billing interval toggle: 'monthly' | 'annually'
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annually">("annually");

  // Simulator Configuration States
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [goalType, setGoalType] = useState<"shred" | "bulk" | "endurance">("shred");
  const [startingWeight, setStartingWeight] = useState(88); // in kg
  const [targetWeight, setTargetWeight] = useState(76); // in kg
  const [timelineWeeks, setTimelineWeeks] = useState(12); // 8, 12, or 16 weeks
  const [consistency, setConsistency] = useState(85); // 50% to 100%

  // Selected Active Chart Tab
  const [activeChartTab, setActiveChartTab] = useState<"weight" | "strength" | "stamina">("weight");

  // Chart Interactive Cursor position
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // AI Planner Wizard States
  const [aiGoal, setAiGoal] = useState("Fat Loss & Muscle Preservation");
  const [aiExperience, setAiExperience] = useState("Intermediate");
  const [aiAvailability, setAiAvailability] = useState(6);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLogMessages, setAiLogMessages] = useState<string[]>([]);

  // Simulation parameters memoized based on state
  const selectedPlan = useMemo(() => {
    return PLANS.find(p => p.id === selectedPlanId) || PLANS[1];
  }, [selectedPlanId]);

  // Generate simulated weekly dataset
  const simulatedData = useMemo(() => {
    const data = [];
    const totalPoints = timelineWeeks + 1;
    const planMultiplier = selectedPlan.multiplier;
    const consistencyMultiplier = consistency / 100;
    
    // Total change expected under absolute ideal conditions
    const idealWeightChange = targetWeight - startingWeight;

    for (let i = 0; i < totalPoints; i++) {
      const progressRatio = i / timelineWeeks;

      // Nonlinear progress: fast initial progress, stable middle, slow tapering/maintenance
      // Use bezier easing simulation: slow start/end, fast mid
      const curveFactor = progressRatio === 0 ? 0 : Math.pow(progressRatio, 1.3);

      // Realised weight calculation
      // High consistency and premium subscription plans help reach target closer and healthier
      const realizedDeltaRatio = curveFactor * planMultiplier * consistencyMultiplier * 0.95;
      const clampedDeltaRatio = Math.min(1.1, Math.max(0, realizedDeltaRatio));
      
      const currentWeight = startingWeight + (idealWeightChange * clampedDeltaRatio);

      // Body Fat % simulation
      const baseBodyFat = goalType === "shred" ? 24 : goalType === "bulk" ? 16 : 18;
      const targetBodyFatDelta = goalType === "shred" ? -8 : goalType === "bulk" ? 3 : -2;
      const currentBodyFat = baseBodyFat + (targetBodyFatDelta * clampedDeltaRatio * (consistencyMultiplier * 1.05));

      // Strength Score (Bench/Squat index) simulation
      // Multiplier increases more under Elite and Pro plans with consistency
      const strengthGainPotential = goalType === "bulk" ? 45 : goalType === "shred" ? 15 : 25;
      const currentStrength = 100 + (strengthGainPotential * progressRatio * planMultiplier * consistencyMultiplier);

      // Endurance index (VO2 Max estimate) simulation
      const baseVO2 = 38;
      const vo2GainPotential = goalType === "endurance" ? 14 : goalType === "shred" ? 6 : 4;
      const currentVO2 = baseVO2 + (vo2GainPotential * progressRatio * planMultiplier * (consistencyMultiplier * 1.1));

      // Weekly active workouts simulation
      const defaultWorkouts = selectedPlanId === "starter" ? 3 : selectedPlanId === "pro" ? 4 : 5;
      // Use stable deterministic sin calculation to prevent impure render warnings
      const pseudoRandom = Math.sin(i) * 0.05;
      const currentWorkoutsCount = Math.round(defaultWorkouts * (consistency / 100 + pseudoRandom));

      // Estimated Calorie Burn (Kcal)
      const baseBurn = selectedPlanId === "starter" ? 1400 : selectedPlanId === "pro" ? 2200 : 3400;
      const currentWeeklyBurn = Math.round(baseBurn * (consistency / 100) * (goalType === "endurance" ? 1.25 : 1));

      data.push({
        week: i,
        weight: parseFloat(currentWeight.toFixed(1)),
        bodyFat: parseFloat(currentBodyFat.toFixed(1)),
        strength: Math.round(currentStrength),
        stamina: parseFloat(currentVO2.toFixed(1)),
        workouts: currentWorkoutsCount,
        calories: currentWeeklyBurn
      });
    }
    return data;
  }, [startingWeight, targetWeight, timelineWeeks, selectedPlan, consistency, goalType, selectedPlanId]);

  // Compute key summary figures based on simulated results
  const summaryMetrics = useMemo(() => {
    const lastIdx = simulatedData.length - 1;
    const finalWeight = simulatedData[lastIdx].weight;
    const initialWeight = simulatedData[0].weight;
    const weightLoss = parseFloat(Math.abs(finalWeight - initialWeight).toFixed(1));
    
    const finalStrength = simulatedData[lastIdx].strength;
    const initialStrength = simulatedData[0].strength;
    const strengthGain = finalStrength - initialStrength;

    const finalStamina = simulatedData[lastIdx].stamina;
    const staminaGain = parseFloat((finalStamina - simulatedData[0].stamina).toFixed(1));

    // Calculate accuracy to user's targeted goal
    const desiredDelta = Math.abs(targetWeight - startingWeight);
    const achievedDelta = Math.abs(finalWeight - startingWeight);
    const accuracyPercent = Math.min(100, Math.round((achievedDelta / (desiredDelta || 1)) * 100));

    // Calculate total simulated calories burned over the timeline
    const totalBurned = simulatedData.reduce((acc, curr) => acc + curr.calories, 0);

    return {
      weightLoss,
      strengthGain,
      staminaGain,
      accuracyPercent,
      totalBurned
    };
  }, [simulatedData, startingWeight, targetWeight]);

  // Interactive SVG coordinates helpers
  const svgWidth = 600;
  const svgHeight = 250;
  const paddingX = 40;
  const paddingY = 30;

  // Compute X and Y scale mappings for SVG drawing
  const chartCoordinates = useMemo(() => {
    const pointsCount = simulatedData.length;
    
    // Find min and max for active tab's value
    const getTabValue = (d: typeof simulatedData[0]) => {
      if (activeChartTab === "weight") return d.weight;
      if (activeChartTab === "strength") return d.strength;
      return d.stamina;
    };

    const values = simulatedData.map(getTabValue);
    const minValue = Math.min(...values) * 0.98;
    const maxValue = Math.max(...values) * 1.02;
    const valueRange = maxValue - minValue || 1;

    const coordinates = simulatedData.map((d, index) => {
      const val = getTabValue(d);
      const x = paddingX + ((index / (pointsCount - 1)) * (svgWidth - (paddingX * 2)));
      const y = svgHeight - paddingY - (((val - minValue) / valueRange) * (svgHeight - (paddingY * 2)));
      return { x, y, data: d, index };
    });

    return { coordinates, minValue, maxValue };
  }, [simulatedData, activeChartTab]);

  // Path generator for continuous line charts
  const linePath = useMemo(() => {
    const coords = chartCoordinates.coordinates;
    if (coords.length === 0) return "";
    return coords.reduce((acc, curr, index) => {
      return index === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, "");
  }, [chartCoordinates]);

  // Path generator for bottom glowing gradient background under the line
  const fillPath = useMemo(() => {
    const coords = chartCoordinates.coordinates;
    if (coords.length === 0) return "";
    const first = coords[0];
    const last = coords[coords.length - 1];
    return `M ${first.x} ${svgHeight - paddingY} L ${first.x} ${first.y} ${linePath.replace(`M ${first.x} ${first.y}`, "")} L ${last.x} ${svgHeight - paddingY} Z`;
  }, [chartCoordinates, linePath]);

  // Track mouse moves over SVG to place custom tooltips
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartContainerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Map clientX to coordinates space
    const coords = chartCoordinates.coordinates;
    if (coords.length === 0) return;

    // Find the point index closest to clientX
    let closestIndex = 0;
    let minDistance = Infinity;

    coords.forEach((coord, idx) => {
      const distance = Math.abs(coord.x - (clientX * (svgWidth / rect.width)));
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setHoveredPointIndex(closestIndex);
  };

  // Run the AI Generator via the API route
  const generateAIWorkoutPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiGenerating(true);
    setAiResult(null);
    setAiLogMessages([]);

    // Micro diagnostic logging simulation to match the athletic/scientific theme
    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setAiLogMessages((prev) => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    await addLog("⚡ Initializing ApexFit Biometric Neural Processor...", 200);
    await addLog("🔍 Analysing custom experience level (" + aiExperience + ") & training goal...", 350);
    await addLog("📊 Mapping metabolic parameters to " + selectedPlan.name + " resource envelope...", 400);
    await addLog("🧠 Querying server-side elite trainer engine...", 450);

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: aiGoal,
          tier: selectedPlan.name,
          experience: aiExperience,
          availability: aiAvailability
        })
      });

      if (!response.ok) {
        throw new Error("Server responded with error status");
      }

      const data = await response.json();
      
      if (data.isDemo) {
        await addLog("⚠️ Server API Key not configured. Unlocking high-performance demo blueprint...", 300);
        setAiResult(data.demoPlan);
      } else {
        await addLog("✅ Personalized Apex Blueprint compiled successfully!", 200);
        setAiResult(data.text);
      }
    } catch (err: any) {
      console.error(err);
      await addLog("❌ Server error occurred. Unlocking dynamic client-side fallback plan...", 500);
      
      // Beautiful local programmatic fallback in case server drops
      const fallback = `### 🎯 **Dynamic Athlete Profile (RECOVERY GENERATED)**
- **Goal**: ${aiGoal}
- **Experience**: ${aiExperience}
- **Tier**: ${selectedPlan.name}
- **Weekly Schedule**: ${aiAvailability} Hours / Week

---

### 🏋️‍♂️ **Workout Routine (Weekly Cycle)**
- **Session 1 (Push)**: Incline Bench Press (3x8), DB Arnold Press (3x10), Tricep Dips (3xMax reps)
- **Session 2 (Pull)**: Barbell Rows (4x8), LAT Pulldowns (3x10), Face Pulls (3x15)
- **Session 3 (Legs)**: Romanian Deadlifts (4x10), Walking Lunges (3x12), Leg Extensions (3x15)
- **Session 4 (Core & Cardio)**: 20-min HIIT Circuit, Planks (3x60s), Cable Twists (3x15)

---

### 🥗 **Macro Nutrition Target**
- Protein: 170g
- Carbs: 220g
- Fats: 70g
*Adjust metrics by 10% on hard athletic training days.*`;
      setAiResult(fallback);
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-primary-500 selection:text-white bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Absolute Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] rounded-full bg-accent-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center shadow-lg shadow-primary-500/20 animate-pulse">
              <Zap className="h-5.5 w-5.5 text-white font-bold" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
              APEX<span className="text-primary-500">FIT</span>
            </span>
          </div>

          {/* Desktop Navigation Link */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#simulator" className="hover:text-primary-500 transition-colors">Visual Simulator</a>
            <a href="#subscriptions" className="hover:text-primary-500 transition-colors">Subscription Plans</a>
            <a href="#ai-planner" className="hover:text-primary-500 transition-colors">AI Blueprint</a>
            <a href="#features" className="hover:text-primary-500 transition-colors">Technology Hub</a>
          </nav>

          {/* Nav Right CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#subscriptions" 
              className="text-xs font-semibold tracking-wider uppercase text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Plans
            </a>
            <a 
              href="#simulator" 
              className="relative group px-5 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:bg-primary-600 shadow-lg shadow-primary-500/20 active:scale-95 overflow-hidden"
              id="nav-cta"
            >
              <span className="relative z-10 flex items-center space-x-1">
                <span>Access Simulator</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass-panel border-b border-slate-200/40"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 font-semibold">
                <a 
                  href="#simulator" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all"
                >
                  Visual Simulator
                </a>
                <a 
                  href="#subscriptions" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all"
                >
                  Subscription Plans
                </a>
                <a 
                  href="#ai-planner" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all"
                >
                  AI Blueprint
                </a>
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-all"
                >
                  Technology Hub
                </a>
                <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                  <a 
                    href="#subscriptions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                  >
                    View Plans
                  </a>
                  <a 
                    href="#simulator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition-all"
                  >
                    Launch Simulator
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Athletic Promo pill */}
            <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SUBSCRIPTION FITNESS REINVENTED WITH LIVE BIOMETRICS</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-slate-900">
              Shred Goals. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-600 bg-clip-text text-transparent">
                Plot Your Progression.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Stop guessing. ApexFit couples dynamic training subscriptions with **live, responsive tracking charts**. Sync your wearables, choose your coaching intensity, and watch your physical trajectory transform in real time.
            </p>

            {/* Microstats overview cards */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-4 pb-2">
              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="font-display font-bold text-xl text-slate-900">99.4%</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Success Rate</div>
              </div>
              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="font-display font-bold text-xl text-primary-500">140k+</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Active Members</div>
              </div>
              <div className="glass-panel p-3 rounded-xl text-center">
                <div className="font-display font-bold text-xl text-accent-500">2.4M</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Workouts Tracked</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a 
                href="#simulator" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-black tracking-wide text-center hover:opacity-95 shadow-lg shadow-primary-500/25 transition-all active:scale-98"
              >
                Launch Progress Simulator
              </a>
              <a 
                href="#subscriptions" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-800 font-bold hover:bg-slate-100/80 transition-all border border-slate-200 text-center hover:border-slate-300"
              >
                Explore Plans ($15/mo)
              </a>
            </div>
          </div>

          {/* Right Preview Device Widget Column */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-accent-500/10 rounded-3xl blur-2xl pointer-events-none" />
            
            {/* Visual Glassmorphic Widget Container */}
            <div className="relative glass-panel rounded-3xl p-5 border border-slate-200/40 shadow-2xl">
              
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Activity className="h-4.5 w-4.5 text-primary-500" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs text-slate-800">Live Wearable Sync</div>
                    <div className="text-[9px] text-slate-400 font-semibold">Active: Apple Health, Garmin, Whoop</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">Apex Live connected</span>
                </div>
              </div>

              {/* Mock metric panels */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 flex items-center space-x-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>Average Active Burn</span>
                  </span>
                  <span className="font-display font-bold text-sm text-slate-800 text-right">
                    680 <span className="text-slate-400 text-[10px] font-normal">kcal/day</span>
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 flex items-center space-x-1.5">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span>Resting Heart Rate</span>
                  </span>
                  <span className="font-display font-bold text-sm text-slate-800 text-right">
                    54 <span className="text-slate-400 text-[10px] font-normal">BPM</span>
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-600 flex items-center space-x-1.5">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>Consistency Level</span>
                  </span>
                  <span className="font-display font-bold text-sm text-primary-500 text-right">
                    94% <span className="text-slate-400 text-[10px] font-normal">Elite</span>
                  </span>
                </div>
              </div>

              {/* Minimalist preview chart element */}
              <div className="h-28 bg-slate-50 rounded-2xl p-2 border border-slate-100 relative flex flex-col justify-end shadow-inner">
                <div className="absolute top-2 left-3 font-display font-bold text-[10px] text-slate-500">METABOLIC ACCELERATION CURVE</div>
                
                {/* SVG path mockup */}
                <svg className="w-full h-14" viewBox="0 0 200 50">
                  <path 
                    d="M 10 45 Q 40 40 70 25 T 130 20 T 190 5" 
                    fill="none" 
                    stroke="url(#hero-gradient)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="hero-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex justify-between text-[8px] text-slate-400 px-2 pt-1 font-bold">
                  <span>WEEK 1</span>
                  <span>WEEK 4</span>
                  <span>WEEK 8</span>
                  <span>WEEK 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulator" className="py-20 bg-white/60 border-y border-slate-200/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Apex Visual <span className="text-primary-500">Goal Simulator</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Customize variables below to preview how subscription tier, consistency, and athletic programming directly scale your weekly results. Move your cursor over the chart to inspect biometric points.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Sidebar Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col space-y-5 justify-between">
              
              <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 space-y-5">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <Target className="h-5 w-5 text-primary-500" />
                  <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-wider">Configure Parameters</h3>
                </div>

                {/* Subscription Tier Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    Subscription Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                          selectedPlanId === plan.id
                            ? "bg-primary-50 border-primary-500 text-primary-600 shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                        }`}
                      >
                        <span>{plan.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">x{plan.multiplier} Yield</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Strategy Goals */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    Athletic Focus Goal
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setGoalType("shred");
                        setStartingWeight(88);
                        setTargetWeight(76);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        goalType === "shred"
                          ? "bg-accent-50 border-accent-500 text-accent-700 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Lean Shred
                    </button>
                    <button
                      onClick={() => {
                        setGoalType("bulk");
                        setStartingWeight(75);
                        setTargetWeight(82);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        goalType === "bulk"
                          ? "bg-accent-50 border-accent-500 text-accent-700 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Hypertrophy
                    </button>
                    <button
                      onClick={() => {
                        setGoalType("endurance");
                        setStartingWeight(80);
                        setTargetWeight(78);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        goalType === "endurance"
                          ? "bg-accent-50 border-accent-500 text-accent-700 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Cardio/VO2
                    </button>
                  </div>
                </div>

                {/* Starting & Target Weights */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Start Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={startingWeight}
                        onChange={(e) => setStartingWeight(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-primary-500 transition-all shadow-inner"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">KG</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Goal Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetWeight}
                        onChange={(e) => setTargetWeight(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:outline-none focus:border-accent-500 transition-all shadow-inner"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-bold">KG</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Timeline Span
                    </span>
                    <span className="text-xs font-extrabold text-primary-600">{timelineWeeks} Weeks</span>
                  </div>
                  <div className="flex gap-2">
                    {[8, 12, 16].map((w) => (
                      <button
                        key={w}
                        onClick={() => setTimelineWeeks(w)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                          timelineWeeks === w
                            ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                        }`}
                      >
                        {w} Weeks
                      </button>
                    ))}
                  </div>
                </div>

                {/* Training Consistency Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Training Consistency</span>
                    <span className={`font-bold ${consistency >= 90 ? "text-primary-600" : "text-yellow-600"}`}>
                      {consistency}% {consistency >= 90 ? "Elite Athlete" : consistency >= 75 ? "Consistent" : "Basic"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={consistency}
                    onChange={(e) => setConsistency(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg cursor-pointer bg-slate-100"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>50% (Slower Gains)</span>
                    <span>100% (Maximum Apex Yield)</span>
                  </div>
                </div>

              </div>

              {/* Instant Outcomes Highlight Panel */}
              <div className="bg-gradient-to-tr from-slate-50 to-white border border-slate-200/50 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ESTIMATED BIO-METRIC TIMELINE RESULTS</div>
                  <div className="text-lg font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>Target Accuracy</span>
                    <span className="text-primary-600 font-extrabold">{summaryMetrics.accuracyPercent}%</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
              </div>

            </div>

            {/* Simulated Visual Chart Display (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="glass-panel rounded-2xl p-5 border border-slate-200/40 flex-1 flex flex-col justify-between shadow-sm">
                
                {/* Tabs & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">Biometric Projections</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Derived from {selectedPlan.name} training equations</p>
                  </div>

                  {/* Tabs */}
                  <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start sm:self-center">
                    <button
                      onClick={() => {
                        setActiveChartTab("weight");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeChartTab === "weight" 
                          ? "bg-white text-primary-600 border border-slate-200/50 shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Weight ({goalType === "bulk" ? "Gain" : "Loss"})
                    </button>
                    <button
                      onClick={() => {
                        setActiveChartTab("strength");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeChartTab === "strength" 
                          ? "bg-white text-primary-600 border border-slate-200/50 shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Strength index
                    </button>
                    <button
                      onClick={() => {
                        setActiveChartTab("stamina");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeChartTab === "stamina" 
                          ? "bg-white text-primary-600 border border-slate-200/50 shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      VO2 Max / Cardio
                    </button>
                  </div>
                </div>

                {/* SVG Live Custom Chart Canvas */}
                <div 
                  ref={chartContainerRef}
                  className="relative py-6 flex-1 flex items-center justify-center min-h-[250px] w-full"
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  <svg 
                    className="w-full h-full max-h-[250px]" 
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    onMouseMove={handleSvgMouseMove}
                  >
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="strength-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* SVG Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                      const y = paddingY + (ratio * (svgHeight - (paddingY * 2)));
                      return (
                        <line 
                          key={index}
                          x1={paddingX} 
                          y1={y} 
                          x2={svgWidth - paddingX} 
                          y2={y} 
                          stroke="#f1f5f9" 
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      );
                    })}

                    {/* SVG X-Axis Weeks gridlines */}
                    {simulatedData.map((_, i) => {
                      if (timelineWeeks > 12 && i % 2 !== 0) return null; // reduce label density on long timelines
                      const x = paddingX + ((i / timelineWeeks) * (svgWidth - (paddingX * 2)));
                      return (
                        <line 
                          key={i}
                          x1={x} 
                          y1={paddingY} 
                          x2={x} 
                          y2={svgHeight - paddingY} 
                          stroke="#f1f5f9" 
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Shaded Area Under Fill */}
                    <path 
                      d={fillPath} 
                      fill={`url(#${activeChartTab === "weight" ? "chart-glow" : "strength-glow"})`}
                    />

                    {/* Glowing Accent Path line */}
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke={activeChartTab === "weight" ? "#f97316" : activeChartTab === "strength" ? "#14b8a6" : "#0d9488"} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />

                    {/* Circle Nodes for Datapoints */}
                    {chartCoordinates.coordinates.map((coord, index) => {
                      const isHovered = hoveredPointIndex === index;
                      return (
                        <circle 
                          key={index}
                          cx={coord.x}
                          cy={coord.y}
                          r={isHovered ? "6" : "3.5"}
                          fill={activeChartTab === "weight" ? "#f97316" : activeChartTab === "strength" ? "#14b8a6" : "#0d9488"}
                          stroke={isHovered ? "#ffffff" : activeChartTab === "weight" ? "#ffedd5" : "#ccfbf1"}
                          strokeWidth="2"
                          className="transition-all duration-150"
                        />
                      );
                    })}

                    {/* Interactive Cursor Tracking Line */}
                    {hoveredPointIndex !== null && (
                      <line 
                        x1={chartCoordinates.coordinates[hoveredPointIndex].x} 
                        y1={paddingY} 
                        x2={chartCoordinates.coordinates[hoveredPointIndex].x} 
                        y2={svgHeight - paddingY} 
                        stroke="#94a3b8" 
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Axis Y Values Labels */}
                    <text 
                      x={paddingX - 10} 
                      y={paddingY + 4} 
                      fill="#94a3b8" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="end"
                    >
                      {Math.round(chartCoordinates.maxValue)}
                    </text>
                    <text 
                      x={paddingX - 10} 
                      y={svgHeight - paddingY + 4} 
                      fill="#94a3b8" 
                      fontSize="9" 
                      fontWeight="bold" 
                      textAnchor="end"
                    >
                      {Math.round(chartCoordinates.minValue)}
                    </text>

                    {/* Axis X Week Labels */}
                    {simulatedData.map((d, i) => {
                      if (timelineWeeks > 12 && i % 2 !== 0 && i !== timelineWeeks) return null;
                      const x = paddingX + ((i / timelineWeeks) * (svgWidth - (paddingX * 2)));
                      return (
                        <text 
                          key={i}
                          x={x} 
                          y={svgHeight - paddingY + 16} 
                          fill="#94a3b8" 
                          fontSize="9" 
                          fontWeight="bold" 
                          textAnchor="middle"
                        >
                          W{d.week}
                        </text>
                      );
                    })}
                  </svg>

                  {/* Absolute Popup HTML Tooltip when hovering */}
                  {hoveredPointIndex !== null && (
                    <div 
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 border border-slate-200 px-4 py-2.5 rounded-xl shadow-xl flex items-center space-x-6 backdrop-blur text-xs shadow-slate-200/50"
                    >
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">TIMELINE POINT</div>
                        <div className="font-bold text-slate-800">Week {simulatedData[hoveredPointIndex].week}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">WEIGHT STAT</div>
                        <div className="font-bold text-slate-700 flex items-center space-x-1">
                          <span>{simulatedData[hoveredPointIndex].weight} kg</span>
                          <span className="text-[10px] text-slate-400">({simulatedData[hoveredPointIndex].bodyFat}% BF)</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">STRENGTH INDEX</div>
                        <div className="font-bold text-accent-600">Level {simulatedData[hoveredPointIndex].strength}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">VO2 CARDIO</div>
                        <div className="font-bold text-emerald-600">{simulatedData[hoveredPointIndex].stamina} ml</div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Simulated Outcome Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Scale className="h-3.5 w-3.5 text-slate-400" />
                      <span>Net Weight Change</span>
                    </div>
                    <div className="text-lg font-display font-black text-slate-800 pt-1">
                      {goalType === "bulk" ? "+" : "-"}{summaryMetrics.weightLoss} kg
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold">Over {timelineWeeks} weeks</div>
                  </div>

                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Dumbbell className="h-3.5 w-3.5 text-slate-400" />
                      <span>Strength Peak</span>
                    </div>
                    <div className="text-lg font-display font-black text-accent-600 pt-1">
                      +{summaryMetrics.strengthGain}%
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold">1RM progression</div>
                  </div>

                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Heart className="h-3.5 w-3.5 text-slate-400" />
                      <span>VO2 Max Yield</span>
                    </div>
                    <div className="text-lg font-display font-black text-emerald-600 pt-1">
                      +{summaryMetrics.staminaGain} pts
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold">Cardio threshold</div>
                  </div>

                  <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Flame className="h-3.5 w-3.5 text-slate-400" />
                      <span>Deficit Fuel Burned</span>
                    </div>
                    <div className="text-lg font-display font-black text-primary-600 pt-1">
                      {summaryMetrics.totalBurned.toLocaleString()} kcal
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold">Total program active</div>
                  </div>
                </div>

              </div>
              
              {/* Prompt linking simulator changes to subscriptions */}
              <div className="text-center text-xs text-slate-500 font-medium">
                *Simulated figures are mathematically estimated targets. Actual outcomes are powered by individual biological factors and training consistency.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Subscription Pricing Grid Section */}
      <section id="subscriptions" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-black text-primary-500 tracking-widest uppercase">HONEST TRANSPARENT PRICING</div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
            Apex Fit Subscription Tiers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Choose the level of coaching accountability and tracker analytical integration that suits your lifestyle. Save 20% by committing to an annual progression cycle.
          </p>

          {/* Monthly/Annual Toggle Switch */}
          <div className="pt-4 flex items-center justify-center space-x-3">
            <span className={`text-xs font-bold uppercase tracking-wider ${billingInterval === "monthly" ? "text-slate-800" : "text-slate-400"}`}>
              Monthly
            </span>
            <button 
              onClick={() => setBillingInterval(billingInterval === "monthly" ? "annually" : "monthly")}
              className="relative w-12 h-6.5 rounded-full bg-slate-100 p-1 border border-slate-200 transition-colors focus:outline-none"
            >
              <div 
                className={`h-4.5 w-4.5 rounded-full bg-primary-500 transition-all ${
                  billingInterval === "annually" ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${billingInterval === "annually" ? "text-primary-500" : "text-slate-400"}`}>
              <span>Annually (Save 20%)</span>
              <span className="bg-primary-100 text-primary-700 text-[9px] px-1.5 py-0.5 rounded font-black">SAVE</span>
            </span>
          </div>
        </div>

        {/* Subscription Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const price = billingInterval === "monthly" ? plan.priceMonthly : plan.priceAnnually;

            return (
              <div 
                key={plan.id}
                className={`relative rounded-3xl p-7 glass-panel flex flex-col justify-between transition-all duration-300 border ${
                  isSelected 
                    ? "border-primary-500 ring-2 ring-primary-500/20 shadow-xl bg-white scale-[1.02] md:scale-[1.03]" 
                    : "border-slate-200/60 bg-white/70 hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Plan Badge */}
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {plan.badge}
                  </span>
                )}

                <div>
                  {/* Name */}
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-display font-black text-xl text-slate-800">{plan.name}</span>
                    {isSelected && (
                      <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-lg font-bold">
                        Linked to Simulator
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 pb-5 min-h-[40px] font-medium">{plan.tagline}</p>

                  {/* Price */}
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-display font-black text-slate-800">$</span>
                      <span className="text-5xl font-display font-black text-slate-800 tracking-tight">{price}</span>
                      <span className="text-xs text-slate-400 font-bold">/ month</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold pt-1">
                      Billed {billingInterval === "monthly" ? "monthly" : "annually ($" + (price * 12) + "/yr)"}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="py-6 space-y-3.5 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 leading-normal font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected ? "Tier Selected (Active)" : "Select " + plan.name}
                  </button>
                  <p className="text-center text-[9px] text-slate-400 pt-2 font-semibold">
                    14-day zero-risk trial. Cancel with 1 click.
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* Dynamic AI Blueprint Generator Section */}
      <section id="ai-planner" className="py-24 bg-slate-50/50 border-t border-slate-200/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left AI Wizard Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-1.5 bg-accent-50 border border-accent-200 px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-accent-600 uppercase">
                <Brain className="h-3.5 w-3.5" />
                <span>Gemini API Neural Planner</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight leading-none">
                AI Workout <br />
                <span className="bg-gradient-to-r from-accent-600 to-primary-500 bg-clip-text text-transparent">Blueprint Engine</span>
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Experience a high-performance preview of our automated trainer engine. Enter your targets below, and Gemini will instantly generate a tailored exercise microcycle matching your chosen subscription level (**{selectedPlan.name}**).
              </p>

              {/* Wizard Form */}
              <form onSubmit={generateAIWorkoutPlan} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                    Detailed Athlete Target Goal
                  </label>
                  <input
                    type="text"
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                    placeholder="e.g., Shred 10kg & preserve heavy squat strength"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-all shadow-inner"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Experience level
                    </label>
                    <select
                      value={aiExperience}
                      onChange={(e) => setAiExperience(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-accent-500 transition-all shadow-sm"
                    >
                      <option value="Beginner (Restorative)">Beginner</option>
                      <option value="Intermediate (Symmetric)">Intermediate</option>
                      <option value="Advanced (Athletic Elite)">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
                      Weekly Commitment
                    </label>
                    <select
                      value={aiAvailability}
                      onChange={(e) => setAiAvailability(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-accent-500 transition-all shadow-sm"
                    >
                      <option value="3">3 hours / wk</option>
                      <option value="5">5 hours / wk</option>
                      <option value="7">7 hours / wk</option>
                      <option value="10">10 hours / wk</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-500 to-primary-500 text-white font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-md shadow-accent-500/10 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {aiGenerating ? "Generating Biometric Blueprint..." : "Synthesize Workout Blueprint"}
                </button>
              </form>
            </div>

            {/* Right Terminal Console (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xl flex flex-col min-h-[420px] max-h-[500px]">
                
                {/* Console Tab Header */}
                <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono pl-2 font-semibold">blueprint_processor.sh</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">STATUS: READY</span>
                </div>

                {/* Console Screen Body */}
                <div className="p-5 font-mono text-xs overflow-y-auto flex-1 text-slate-700 bg-slate-50/50 space-y-4">
                  
                  {/* Default State or Log Messages */}
                  {aiLogMessages.length === 0 && !aiResult && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-3 text-slate-400">
                      <Brain className="h-10 w-10 text-slate-300 animate-pulse" />
                      <p className="max-w-xs font-sans text-xs">
                        Awaiting parameters... Fill out the form on the left to synthesize your customized athletic routine blueprint.
                      </p>
                    </div>
                  )}

                  {/* Real-time Diagnostics log feed */}
                  {aiLogMessages.map((log, index) => (
                    <div key={index} className="text-accent-600 select-none">
                      {log}
                    </div>
                  ))}

                  {/* Render final markdown once loaded */}
                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-slate-150 text-slate-700 font-sans leading-relaxed space-y-4 markdown-body"
                    >
                      <ReactMarkdown>{aiResult}</ReactMarkdown>
                    </motion.div>
                  )}

                  {/* Loading spinner placeholder */}
                  {aiGenerating && !aiResult && (
                    <div className="flex items-center space-x-2 pt-2 text-slate-400">
                      <span className="h-3 w-3 rounded-full border-2 border-accent-500 border-t-transparent animate-spin" />
                      <span>Synthesizing progressive overload tables...</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Dynamic Technology Hub (Features) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-black text-primary-500 tracking-widest uppercase">THE APEX BIO-ECOSYSTEM</div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
            Pioneering Fitness Analytics Tech
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            We don&apos;t just sell workouts. We sell visual progression loops powered by modern exercise science and zero-friction tracking.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 hover:border-slate-300 bg-white/70 shadow-sm transition-all">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 text-primary-500 shadow-sm">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 pb-2">Dynamic Bio-Deficit Curves</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We compile weight variables, body fat, and active hydration indexes to plot dynamic metabolic deficits. Stop guessing calorie targets; see them adjust dynamically each week.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 hover:border-slate-300 bg-white/70 shadow-sm transition-all">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 text-accent-600 shadow-sm">
              <Gauge className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 pb-2">RPE Volumetric Indexes</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Our charts track your lift load alongside Rate of Perceived Exertion (RPE). We map neuromuscular load curves to predict fatigue states and avoid overtraining plateaus.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 hover:border-slate-300 bg-white/70 shadow-sm transition-all">
            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 text-emerald-600 shadow-sm">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 pb-2">VO2 Threshold Maps</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Merge cardio sessions directly from standard GPS-enabled watches. Watch your breathing threshold shift as subscription training volume changes consistency.
            </p>
          </div>

        </div>

      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 shadow-sm">
              <Zap className="h-4 w-4 text-primary-500" />
            </div>
            <span className="font-display font-black text-lg tracking-tight text-slate-800">
              APEX<span className="text-primary-500">FIT</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-slate-600 font-medium">
            <a href="#simulator" className="hover:text-primary-600 hover:font-bold transition-all">Simulator</a>
            <a href="#subscriptions" className="hover:text-primary-600 hover:font-bold transition-all">Plans</a>
            <a href="#ai-planner" className="hover:text-primary-600 hover:font-bold transition-all">AI Blueprint</a>
            <a href="#features" className="hover:text-primary-600 hover:font-bold transition-all">Tech</a>
          </div>

          {/* Copyright */}
          <div className="font-medium">
            &copy; 2026 ApexFit LLC. All rights athletic, simulated, & reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
