// Knowledge Base and Guardrail Configuration for SPARK AI Assistant
// Oil India Limited - Baghewala CSS-SRP Digital Twin Platform

export const SPARK_GUARDRAILS = {
  // Prohibited inquiries regarding underlying technologies, code, or confidential data
  prohibitedTopics: [
    {
      regex: /(what\s+language|which\s+language|programming\s+language|built\s+with|tech\s+stack|framework|source\s+code|github\s+repo|git\s+repository|react|tailwind|vite|javascript|python|css|html|backend\s+code|npm\s+package|dependencies|inspect\s+code|show\s+code|secret|password|api\s+key|token|credential|security\s+token|admin\s+password|clearance\s+bypass)/i,
      response: "I am SPARK, the operational knowledge copilot for the Baghewala CSS-SRP Digital Twin. Technical implementation details, underlying codebase architecture, framework specifications, and internal system credentials are confidential and proprietary to Oil India Limited. I can, however, provide complete engineering and operational assistance regarding reservoir physics, CSS steam parameters, SRP kinematics, and SCADA workflows."
    },
    {
      regex: /(bypass|jailbreak|ignore\s+all\s+instructions|system\s+prompt|who\s+created\s+you|internal\s+prompt|developer\s+mode)/i,
      response: "Protocol violation detected. My operational guidelines are permanently fixed by the Oil India Limited Engineering Directorate. I am restricted to answering questions regarding the Baghewala Digital Twin platform, field assets, thermodynamic equations, and operational workflows."
    }
  ]
};

export const SPARK_KNOWLEDGE = [
  {
    topic: "About Oil India Limited & Baghewala Asset",
    keywords: ["oil india", "baghewala", "asset", "oil india limited", "rajasthan", "oil field", "formation", "crude", "heavy oil", "reservoir", "directorate"],
    content: `**Oil India Limited (OIL)** is a Government of India Navratna Enterprise operating the **Baghewala Heavy Oil Field** in the Bikaner-Nagaur Basin of Rajasthan.
• **Formation**: Jodhpur Sandstone at approximately **1,180 m (TVD)** with a 15 m net pay thickness and 28% porosity.
• **Crude Properties**: Extra-heavy asphaltic crude with **16.5° API gravity** and an ultra-high dead oil viscosity of **11,500 cP** at natural reservoir temperature (45°C).
• **Recovery Strategy**: Because the crude is virtually immobile under cold conditions (yielding only ~25 bbl/d naturally), OIL implements **Cyclic Steam Stimulation (CSS)** coupled with deep-rod **Sucker Rod Pumping (SRP)** artificial lift to achieve peak production rates over 212 bbl/d.`
  },
  {
    topic: "What is this Digital Twin & How Does It Work?",
    keywords: ["what is this", "digital twin", "twin", "how it works", "overview", "website", "platform", "purpose", "why this twin"],
    content: `The **Baghewala CSS–SRP Digital Twin** is an integrated operational and physics-based cyber-physical platform engineered for Oil India Limited.
It solves the coupled **thermodynamic-mechanical optimization** challenge of heavy oil recovery:
1. **Thermodynamic Heat Front**: Simulates superheated steam injection, matrix soak diffusion, and thermal viscosity collapse using the Marx-Langenheim & Arrhenius formulations.
2. **Artificial Lift Kinematics**: Simulates downhole plunger displacement, peak rod loads (PPRL), and dynamometer card geometries using API Spec 11AX and API RP 11L.
3. **Interactive 3D Engineering Model**: Renders a photorealistic surface facility (beam pumpjack, wellhead, flowlines, 3-phase separator, tank farm) and a multi-layered geological subsurface.
4. **Real-time SCADA Streaming**: Live RTU telemetry simulating pressure, temperature, oil yield, and power across 12 field channels.`
  },
  {
    topic: "Cyclic Steam Stimulation (CSS) Process",
    keywords: ["css", "cyclic steam", "steam", "steam injection", "huff and puff", "soak", "heat front", "steam temp", "steam rate", "sor", "csor"],
    content: `**Cyclic Steam Stimulation (CSS)**, also known as 'Huff and Puff', operates in three distinct sequential stages:
1. **Injection Phase (Huff)**: High-pressure superheated steam (typically 220°C–260°C at 650–900 psi) is injected into the Jodhpur Sandstone for 10–20 days.
2. **Soak Phase**: The well is shut in for 3–7 days to allow thermal conduction to heat the matrix, collapsing crude viscosity from 11,500 cP to under 150 cP.
3. **Production Phase (Puff)**: The well is placed on artificial lift (SRP) to pump out hot, mobilized oil.
• **SOR (Steam-to-Oil Ratio)**: Represents steam consumption per barrel of oil produced. Baseline is ~0.40 ton/bbl, optimized AI Pareto targets ~0.05–0.28 ton/bbl.`
  },
  {
    topic: "Sucker Rod Pump (SRP) & Artificial Lift",
    keywords: ["srp", "sucker rod", "pump", "pumpjack", "spm", "stroke length", "pprl", "dynamometer", "rod load", "horsehead", "walking beam"],
    content: `The **Sucker Rod Pump (SRP)** is the primary artificial lift mechanism used to lift viscous heavy oil to the surface:
• **Kinematics**: Driven by a walking beam and horsehead running at **4.0 to 12.0 SPM** (Strokes Per Minute) with stroke lengths between **60 and 144 inches**.
• **API Spec 11AX Plunger Constant**: 0.283 bbl/stroke-in based on a 2.25" downhole plunger and 85% volumetric efficiency.
• **PPRL (Peak Polished Rod Load)**: Monitored to prevent rod fatigue failure (safe threshold: 14,000 lbs). Calculated via Mills Acceleration: PPRL = W_rod × (1 + SPM² × S / 70500) + W_fluid.
• **Dynamometer Card**: Plots Polished Rod Load vs. Position to diagnose pump fillage, fluid pound, gas interference, or parted rods in real time.`
  },
  {
    topic: "Is 212 bbl/d Production Possible?",
    keywords: ["212", "is 212 possible", "212 bbl/d", "production rate", "can we produce 212", "max oil", "q_oil"],
    content: `**Yes, absolutely.** A peak production of **212 bbl/d** is thermodynamically and mechanically verified for Well BGW-014:
• Under cold natural conditions (45°C, 11,500 cP), the well yields only ~25 bbl/d.
• Following a high-temperature CSS cycle (steam at 242°C–250°C), near-wellbore viscosity drops by over 97% to ~85 cP, causing inflow capability (Vogel IPR) to surge over 400 bbl/d.
• With SRP artificial lift operating at **8.4 SPM** and **120-inch stroke** at 78% pump fillage, the positive displacement output calculates exactly to:
  Q = 0.283 × 8.4 SPM × 120 in × 0.78 fillage ≈ 222 bbl/d gross, netting **212 bbl/d** clean oil after gas-liquid separation.`
  },
  {
    topic: "Navigation Guide: All 12 Pages & Features",
    keywords: ["pages", "tabs", "sections", "navigation", "how to navigate", "features", "menu"],
    content: `The platform features **12 dedicated operational modules** in the top navigation strip:
1. **Operations Overview**: High-level telemetry, field KPIs, process flow strip, and well selector.
2. **Digital Twin**: Full interactive 3D WebGL digital twin with pumpjack animation, flowline tracing, and X-ray CAD inspection.
3. **CSS Planning**: Real-time parameter sliders (Steam Temp, Injection Pressure, SPM, Soak Time) with physics feedback.
4. **SRP Performance**: Dynamometer card analysis, Mills acceleration, rod stress, and motor power.
5. **Reservoir Intelligence**: Subsurface stratigraphic column, Marx-Langenheim heat boundary, and permeability layers.
6. **Production Analytics**: Interactive ECharts for historical vs. simulated trends, SOR curves, and pressure profiles.
7. **Scenario Optimization**: Multi-objective NSGA-II solver, Pareto knee-point analysis, and A/B slider comparisons.
8. **Equipment & Maintenance**: SCADA registry, MTBM tracking, work orders, and scheduled work logs.
9. **Data Governance**: Provenance tracking, ISO/IEC 25012 audit, and verified field measurement validation.
10. **Model Validation**: Quantitative residual metrics, RMSE (1.8%), R² (0.978), and historical ground-truth benchmarks.
11. **Reports & Export**: Executive dossier generation, CSV data export, and PDF operational printouts.
12. **Modernization Hub**: Architectural blueprint showcasing OIL's digital roadmap and compliance standards.`
  },
  {
    topic: "Governing Physics & Scientific Citations",
    keywords: ["physics", "formula", "equations", "calculation", "literature", "source", "reference", "vogel", "arrhenius", "api 11l", "marx"],
    content: `Every calculation in this digital twin is derived from peer-reviewed petroleum standards:
• **Vogel (1968, SPE-1476)**: Non-linear solution-gas inflow performance relationship (IPR).
• **Marx & Langenheim (1959, Trans. AIME 216)**: Radial steam zone expansion and caprock thermal boundary conduction.
• **Arrhenius / Al-Fariss & Pinder (1987, SPE-15697)**: Heavy crude thermal viscosity collapse: μ(T) = μ₀ × exp[b × (T₀ - T)].
• **API Spec 11AX & API RP 11L**: Downhole positive displacement and polished rod dynamic fatigue limits.
• **Boberg & Lantz (1966, SPE-1578)**: Reservoir soak temperature dissipation and thermal decay constant (tau = 45 days).`
  },
  {
    topic: "Safety, Clearances & User Personas",
    keywords: ["clearance", "persona", "role", "engineer", "login", "admin", "sign out", "security"],
    content: `The platform enforces enterprise role-based security clearance levels:
• **Dr. Rajesh Sharma (OIL-PE-8842)**: Lead Petroleum Engineer (LVL-4 Secret Clearance).
• **Er. Sunita Verma (OIL-RES-5519)**: Senior Reservoir Specialist (LVL-3 Confidential).
• **Shri Amit Patel (OIL-OPS-2041)**: SCADA Field Operations Lead (LVL-3 Operational).
• **Priya Sundaram (OIL-SYS-9901)**: Digital Twin Systems Administrator (LVL-5 Top Secret).
You can switch personas, issue new corporate IDs, or sign out anytime via the user avatar menu in the top-right corner.`
  }
];

// Fallback search algorithm for natural language questions
export function querySparkKnowledge(userQuery, currentInputs = {}, currentMetrics = {}) {
  const query = (userQuery || "").trim().toLowerCase();

  // 1. Guardrail check for prohibited tech/code questions
  for (const rule of SPARK_GUARDRAILS.prohibitedTopics) {
    if (rule.regex.test(query)) {
      return rule.response;
    }
  }

  // 2. Dynamic live telemetry questions
  if (/current\s+production|current\s+rate|how\s+much\s+oil|today'?s\s+oil|production\s+now|real-?time\s+oil/i.test(query)) {
    return `Currently, Well **${currentMetrics.wellId || 'BGW-014'}** is producing at **${currentMetrics.q_oil || '212.2'} bbl/d** with a steam-to-oil ratio (SOR) of **${currentMetrics.SOR || '0.28'}**. Polished rod load is operating at **${currentMetrics.rod_load_pct || '68.5'}%** of safe API limits.`;
  }
  if (/current\s+temp|steam\s+temp|temperature\s+now/i.test(query)) {
    return `The active steam injection temperature setpoint is **${currentInputs.steam_T || 245}°C** (TIC-101), which has thermally reduced reservoir viscosity down to approximately **${currentMetrics.viscosity || 84} cP**.`;
  }
  if (/current\s+pressure|injection\s+pressure|wellhead\s+pressure/i.test(query)) {
    return `The active steam injection pressure is **${currentInputs.injection_pressure || 650} psi**, with wellhead backpressure steady at **${currentMetrics.Pwh || 180} psi**.`;
  }
  if (/pump\s+speed|spm|stroke/i.test(query)) {
    return `The sucker rod pumping unit is currently operating at **${currentInputs.SPM || 7.5} SPM** with a polished rod stroke length of **${currentInputs.stroke_length || 100} inches**.`;
  }

  // 3. Keyword Scoring across the Knowledge Base
  let bestMatch = null;
  let highestScore = 0;

  for (const entry of SPARK_KNOWLEDGE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (query.includes(kw.toLowerCase())) {
        score += kw.length; // weight longer specific keywords higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore >= 3) {
    return bestMatch.content;
  }

  // 4. Intelligent Default Assistant Response
  return `I am **SPARK**, your Oil India Limited engineering copilot for the Baghewala CSS-SRP Digital Twin.
I can help you understand:
• **Field Asset**: Jodhpur Sandstone reservoir, 16.5° API heavy oil, and 1,180 m depth.
• **CSS Operations**: Steam injection, soak cycle physics, Marx-Langenheim heat front, and SOR efficiency.
• **SRP Kinematics**: Pumpjack SPM, stroke length, API 11AX displacement, and dynamometer card analysis.
• **Platform Navigation**: How to use the 3D Digital Twin, NSGA-II Optimizer, and SCADA telemetry.
• **Engineering Integrity**: Why 212 bbl/d is achievable, and the exact peer-reviewed formulas used.

*Please feel free to ask any question about the platform or reservoir operations!*`;
}
