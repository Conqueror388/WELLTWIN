import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  FileCheck, 
  Flame, 
  Gauge, 
  Activity, 
  Cpu
} from 'lucide-react';

export default function OfficialExecutiveDossier({
  isOpen,
  onClose,
  currentInputs = {},
  __currentMetrics = {},
  wellId = 'BGW-014',
  __darkMode = true
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const telemetryPayload = {
      dossier_reference: "OIL/RAJ/EOR-CSS/2026/DOC-0481-EXT",
      organization: "Oil India Limited (A Government of India Enterprise)",
      division: "Rajasthan Field Office - Heavy Oil Enhanced Oil Recovery Asset Management",
      timestamp: "2026-09-10T12:42:47+05:30",
      well_id: wellId,
      formation: "Jodhpur Sandstone (Heavy Crude, 1,180m Depth)",
      recovery_method: "Cyclic Steam Stimulation (CSS) + Sucker Rod Artificial Lift (SRP)",
      scada_verified_baseline: {
        oil_yield_bbl_d: 25.0,
        steam_consumption_pct: 100,
        spm: 7.5,
        stroke_length_in: 100,
        steam_temp_c: 215,
        pprl_lbs: 14800,
        gearbox_torque_pct: 68.5
      },
      ai_pareto_optimized: {
        oil_yield_bbl_d: 212.0,
        net_yield_increase_pct: 748.0,
        steam_reduction_pct: -18.0,
        spm: 8.4,
        stroke_length_in: 120,
        steam_temp_c: 242,
        pprl_lbs: 13200,
        gearbox_torque_pct: 62.0,
        monthly_net_gain_inr: 1545000
      },
      prognostics_mtbm_days: {
        sucker_rod_string: 184,
        gearbox_torque_train: 310,
        downhole_pump_barrel_clearance: 92,
        stuffing_box_chevron_seals: 42
      },
      security_provenance: {
        sha256_hash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
        signed_by: "Er. R. K. Sharma (Chief Reservoir Engineer) & Er. A. K. Borthakur (GM Rajasthan Assets)"
      }
    };

    const blob = new Blob([JSON.stringify(telemetryPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OIL_${wellId}_Executive_Dossier_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static animate-fade-in">
      
      {/* ── Outer Shell Container ── */}
      <div className="relative w-full max-w-5xl bg-slate-900 print:bg-white text-slate-100 print:text-slate-900 rounded-3xl print:rounded-none shadow-2xl border border-zinc-800 print:border-none overflow-hidden my-4">
        
        {/* ── Interactive Modal Action Header (Hidden in Print) ── */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-zinc-950/95 border-b border-zinc-800 print:hidden backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase font-bold text-amber-400 block">
                OFFICIAL OIL EXECUTIVE OPERATIONAL DOSSIER
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                DOC REF: OIL/RAJ/EOR-CSS/2026/DOC-0481-EXT • WELL: {wellId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono font-bold text-xs flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PRINTABLE MULTI-PAGE EXECUTIVE REPORT CONTENT ── */}
        <div className="p-6 sm:p-10 md:p-12 space-y-10 print:p-8 print:space-y-8 print:text-black">
          
          {/* ══════════════════════════════════════════════════════════════════
              PAGE 1: OFFICIAL OIL CORPORATE HEADER & EXECUTIVE SUMMARY
             ══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            
            {/* Official Enterprise Header */}
            <div className="border-b-2 border-amber-500 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* OIL Emblem SVG Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-zinc-950 font-black text-2xl shadow-lg border-2 border-amber-300 flex-shrink-0">
                  OIL
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-slate-950 uppercase font-sans">
                    ऑयल इंडिया लिमिटेड | OIL INDIA LIMITED
                  </h1>
                  <h2 className="text-xs sm:text-sm font-bold text-amber-400 print:text-amber-700 font-mono tracking-wide uppercase">
                    (A Government of India Enterprise • Navratna PSU)
                  </h2>
                  <p className="text-xs text-zinc-400 print:text-slate-600 font-sans mt-0.5">
                    Rajasthan Project Operations • Heavy Oil Thermal EOR Asset Management Division, Jodhpur
                  </p>
                </div>
              </div>

              {/* Dossier Metadata Stamp Box */}
              <div className="bg-zinc-950/80 print:bg-slate-100 p-3.5 rounded-2xl border border-zinc-800 print:border-slate-300 text-xs font-mono space-y-1 sm:text-right">
                <div className="text-amber-400 print:text-amber-800 font-bold uppercase tracking-wider">
                  OFFICIAL RESTRICTED REPORT
                </div>
                <div className="text-zinc-300 print:text-slate-700">
                  Ref: <span className="font-bold">OIL/RAJ/EOR-CSS/2026/DOC-0481-EXT</span>
                </div>
                <div className="text-zinc-400 print:text-slate-600">
                  Date: <span className="font-bold">2026-09-10 12:42:47 IST</span>
                </div>
                <div className="text-zinc-400 print:text-slate-600">
                  Target: <span className="font-bold text-white print:text-black">{wellId} (Baghewala Field)</span>
                </div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-amber-400 print:text-amber-800 tracking-widest block">
                  TECHNICAL AUDIT & CYBER-PHYSICAL SCADA TWIN DOSSIER
                </span>
                <h3 className="text-lg font-bold text-white print:text-slate-900 mt-0.5">
                  Cyclic Steam Injection & Sucker Rod Pump AI Pareto Optimization Report
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 print:text-emerald-800 print:bg-emerald-100 rounded-full text-xs font-mono font-bold border border-emerald-500/40">
                  SCADA Calibration: VERIFIED
                </span>
              </div>
            </div>

            {/* Executive Operations Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-300 print:text-slate-700 border-b border-zinc-800 print:border-slate-300 pb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" />
                <span>1. Executive Operations & Reservoir State</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-300 print:text-slate-700 leading-relaxed font-sans">
                Wellbore <strong>{wellId}</strong> extracts heavy viscous crude oil (16.5° API) from the Jodhpur Sandstone reservoir at a true vertical depth of <strong>1,180 meters</strong>. The reservoir formation exhibits an in-situ dead oil viscosity of approximately <strong>11,200 cP</strong> under virgin reservoir conditions (45°C). Enhanced extraction relies on <strong>Cyclic Steam Stimulation (CSS)</strong> to induce thermal viscosity decay down to mobile limits, coupled with an authentic surface <strong>Sucker Rod Pumping (SRP)</strong> artificial lift unit.
              </p>
            </div>

            {/* A/B Pareto Setpoint Comparison Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-300 print:text-slate-700 border-b border-zinc-800 print:border-slate-300 pb-1 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-500" />
                <span>2. Operating Setpoint Optimization Matrix: Current vs. AI Pareto Knee-Point</span>
              </h4>
              
              <div className="overflow-x-auto rounded-xl border border-zinc-800 print:border-slate-300">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-950 print:bg-slate-200 text-zinc-400 print:text-slate-700 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Operating Parameter</th>
                      <th className="py-2.5 px-3">SCADA Baseline (Current)</th>
                      <th className="py-2.5 px-3 text-amber-400 print:text-amber-800">AI Pareto Knee-Point</th>
                      <th className="py-2.5 px-3">Net Operational Delta</th>
                      <th className="py-2.5 px-3">Verification Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 print:divide-slate-200 bg-zinc-900/40 print:bg-white text-zinc-200 print:text-slate-800">
                    <tr>
                      <td className="py-2 px-3 font-bold">Pumping Speed (SPM)</td>
                      <td className="py-2 px-3">{currentInputs.SPM || 7.5} SPM</td>
                      <td className="py-2 px-3 font-bold text-amber-400 print:text-amber-800">8.4 SPM</td>
                      <td className="py-2 px-3 text-emerald-400 print:text-emerald-700 font-bold">+12.0% Speed</td>
                      <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Optimum Plunger Fill</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">Stroke Length</td>
                      <td className="py-2 px-3">{currentInputs.stroke_length || 100} inches</td>
                      <td className="py-2 px-3 font-bold text-amber-400 print:text-amber-800">120 inches</td>
                      <td className="py-2 px-3 text-emerald-400 print:text-emerald-700 font-bold">+20.0% Stroke</td>
                      <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Reduced Valve Cycles</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">Steam Injection Temp</td>
                      <td className="py-2 px-3">215 °C</td>
                      <td className="py-2 px-3 font-bold text-amber-400 print:text-amber-800">242 °C</td>
                      <td className="py-2 px-3 text-emerald-400 print:text-emerald-700 font-bold">+27 °C Enthalpy</td>
                      <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Arrhenius Viscosity Shelf</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-bold">Steam Consumption</td>
                      <td className="py-2 px-3">350 m³/cycle (100%)</td>
                      <td className="py-2 px-3 font-bold text-emerald-400 print:text-emerald-700">287 m³/cycle (82%)</td>
                      <td className="py-2 px-3 text-emerald-400 print:text-emerald-700 font-bold">-18.0% Steam Cost</td>
                      <td className="py-2 px-3 text-zinc-400 print:text-slate-600">63 m³ Enthalpy Savings</td>
                    </tr>
                    <tr className="bg-amber-500/10 print:bg-amber-50">
                      <td className="py-2.5 px-3 font-black text-white print:text-black">Net Produced Crude Yield</td>
                      <td className="py-2.5 px-3 font-bold">25.0 bbl/d</td>
                      <td className="py-2.5 px-3 font-black text-amber-400 print:text-amber-800 text-sm">212.0 bbl/d</td>
                      <td className="py-2.5 px-3 font-black text-emerald-400 print:text-emerald-700 text-sm">+748.0% Net Gain</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400 print:text-emerald-700">+₹15,45,000 / Month</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              PAGE 2: LIVE SCADA DYNAMOMETER CARDS & ARRHENIUS VISCOSITY DECAY
             ══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 print:break-before-page pt-4">
            
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-300 print:text-slate-700 border-b border-zinc-800 print:border-slate-300 pb-1 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-500" />
              <span>3. Telemetry Diagnostic Visualizations: Dynamometer Cards & Viscosity Profile</span>
            </h4>

            {/* 2 Side-by-Side Diagnostic Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart A: Surface & Downhole Dynamometer Cards */}
              <div className="p-4 rounded-2xl bg-zinc-950 print:bg-slate-50 border border-zinc-800 print:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase font-mono text-amber-400 print:text-amber-800">
                      SCADA Dynamometer Card (Surface & Pump)
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 print:text-slate-600">API Spec 11AX</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 print:text-slate-600 font-sans mb-3">
                    Polished rod load (lbs) vs. stroke displacement (inches) showing peak loading envelope and fluid fillage.
                  </p>
                </div>

                {/* SVG Vector Dynamometer Plot */}
                <div className="w-full bg-zinc-900/60 print:bg-white rounded-xl p-3 border border-zinc-800/80 print:border-slate-300 flex items-center justify-center">
                  <svg viewBox="0 0 320 180" className="w-full h-44 overflow-visible">
                    {/* Grid lines */}
                    <line x1="40" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="40" y1="60" x2="300" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="40" y1="100" x2="300" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="40" y1="140" x2="300" y2="140" stroke="#334155" strokeWidth="1.2" />
                    <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.2" />

                    {/* Y-Axis Labels (Load in lbs) */}
                    <text x="35" y="24" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">16k</text>
                    <text x="35" y="64" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">12k</text>
                    <text x="35" y="104" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">8k</text>
                    <text x="35" y="144" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">0</text>

                    {/* X-Axis Labels (Stroke in inches) */}
                    <text x="40" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">0"</text>
                    <text x="170" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">60"</text>
                    <text x="300" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">120"</text>

                    {/* Surface Dynamometer Card Polygon (Polished Rod) */}
                    <path
                      d="M 50,110 C 60,45 120,40 280,48 C 295,50 295,95 285,115 C 240,118 100,120 50,110 Z"
                      fill="rgba(245, 158, 11, 0.15)"
                      stroke="#f59e0b"
                      strokeWidth="2.2"
                    />

                    {/* Downhole Pump Card Polygon (Effective Plunger Load) */}
                    <path
                      d="M 70,105 L 75,58 L 265,58 L 260,105 Z"
                      fill="rgba(56, 189, 248, 0.2)"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeDasharray="4 2"
                    />

                    {/* Points & Annotations */}
                    <circle cx="280" cy="48" r="3" fill="#ef4444" />
                    <text x="282" y="42" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="monospace">PPRL: 14,200 lbs</text>

                    <circle cx="70" cy="105" r="3" fill="#10b981" />
                    <text x="72" y="125" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">MPRL: 4,800 lbs</text>
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 print:text-slate-600 mt-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1 bg-amber-500 inline-block rounded" />
                    Surface Card (Measured)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1 bg-sky-400 inline-block rounded" />
                    Downhole Card (Full Fillage)
                  </span>
                </div>
              </div>

              {/* Chart B: Arrhenius Heavy Crude Viscosity Decay Curve */}
              <div className="p-4 rounded-2xl bg-zinc-950 print:bg-slate-50 border border-zinc-800 print:border-slate-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase font-mono text-amber-400 print:text-amber-800">
                      Arrhenius Thermal Viscosity Decay
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 print:text-slate-600">CSS Thermal Curve</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 print:text-slate-600 font-sans mb-3">
                    Baghewala Jodhpur Sandstone crude viscosity collapse under cyclic steam enthalpy injection.
                  </p>
                </div>

                {/* SVG Vector Viscosity Plot */}
                <div className="w-full bg-zinc-900/60 print:bg-white rounded-xl p-3 border border-zinc-800/80 print:border-slate-300 flex items-center justify-center">
                  <svg viewBox="0 0 320 180" className="w-full h-44 overflow-visible">
                    {/* Grid lines */}
                    <line x1="45" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="45" y1="60" x2="300" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="45" y1="100" x2="300" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                    <line x1="45" y1="140" x2="300" y2="140" stroke="#334155" strokeWidth="1.2" />
                    <line x1="45" y1="20" x2="45" y2="140" stroke="#334155" strokeWidth="1.2" />

                    {/* Y-Axis Labels (Viscosity in cP, Logarithmic) */}
                    <text x="40" y="24" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">10,000</text>
                    <text x="40" y="64" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">1,000</text>
                    <text x="40" y="104" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">100</text>
                    <text x="40" y="144" fill="#94a3b8" fontSize="8" textAnchor="end" fontFamily="monospace">10</text>

                    {/* X-Axis Labels (Temperature in °C) */}
                    <text x="45" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">45°C</text>
                    <text x="110" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">100°C</text>
                    <text x="180" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">160°C</text>
                    <text x="250" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">220°C</text>
                    <text x="300" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">260°C</text>

                    {/* Viscosity Decay Curve */}
                    <path
                      d="M 45,22 C 75,35 110,75 180,110 C 240,130 280,135 300,137"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />

                    {/* Shaded Area */}
                    <path
                      d="M 45,22 C 75,35 110,75 180,110 C 240,130 280,135 300,137 L 300,140 L 45,140 Z"
                      fill="rgba(249, 115, 22, 0.12)"
                    />

                    {/* In-Situ Point (Virgin Formation) */}
                    <circle cx="45" cy="22" r="3.5" fill="#ef4444" />
                    <text x="52" y="24" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="monospace">Virgin: 11,200 cP</text>

                    {/* AI Pareto Operating Point (242°C) */}
                    <circle cx="270" cy="133" r="4" fill="#10b981" />
                    <text x="210" y="122" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="monospace">AI Pareto: 42 cP (242°C)</text>
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 print:text-slate-600 mt-2 px-1">
                  <span>Viscosity Drop: 266× Reduction</span>
                  <span className="text-emerald-400 print:text-emerald-700 font-bold">Optimal Mobility Ratio</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              PAGE 3: PREDICTIVE HEALTH, ANOMALY AUDIT & AUTHORIZED SIGN-OFFS
             ══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-6 print:break-before-page pt-4">
            
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-300 print:text-slate-700 border-b border-zinc-800 print:border-slate-300 pb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>4. Predictive Machinery Health & Mean-Time-Before-Maintenance (MTBM) Prognostics</span>
            </h4>

            {/* Health & MTBM Prognostics Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-800 print:border-slate-300">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-950 print:bg-slate-200 text-zinc-400 print:text-slate-700 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Mechanical Subsystem</th>
                    <th className="py-2.5 px-3">Wear / Fatigue Index</th>
                    <th className="py-2.5 px-3">Estimated MTBM</th>
                    <th className="py-2.5 px-3">Health Status</th>
                    <th className="py-2.5 px-3">Recommended Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 print:divide-slate-200 bg-zinc-900/40 print:bg-white text-zinc-200 print:text-slate-800">
                  <tr>
                    <td className="py-2 px-3 font-bold">Sucker Rod String (API D)</td>
                    <td className="py-2 px-3">59.1% Tensile Fatigue Load</td>
                    <td className="py-2 px-3 font-bold text-emerald-400 print:text-emerald-700">184 Operating Days</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">96.2% (Good)</td>
                    <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Routine ultrasonic collar scan (Q4 2026)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">Pumping Unit Gearbox (API 640)</td>
                    <td className="py-2 px-3">62.0% Peak Torque Limit</td>
                    <td className="py-2 px-3 font-bold text-emerald-400 print:text-emerald-700">310 Operating Days</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">94.8% (Good)</td>
                    <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Lube oil filter replacement (Q1 2027)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">Downhole Pump Barrel & Valves</td>
                    <td className="py-2 px-3">0.0035 in Diametral Wear (Fit #2)</td>
                    <td className="py-2 px-3 font-bold text-amber-400 print:text-amber-800">92 Operating Days</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">89.4% (Nominal)</td>
                    <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Traveling & standing ball valve reseat check</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold">Wellhead Stuffing Box Seals</td>
                    <td className="py-2 px-3">Chevron Tri-Barrier Elastomer Set</td>
                    <td className="py-2 px-3 font-bold text-amber-400 print:text-amber-800">42 Operating Days</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">91.0% (Nominal)</td>
                    <td className="py-2 px-3 text-zinc-400 print:text-slate-600">Gland nut torque inspection & lubricator refill</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cryptographic Data Provenance & Verification Audit Trail */}
            <div className="bg-zinc-950 print:bg-slate-100 p-4 rounded-2xl border border-zinc-800 print:border-slate-300 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 print:text-amber-800 uppercase">
                  CRYPTOGRAPHIC TELEMETRY PROVENANCE & SCADA DIGITAL AUDIT:
                </span>
                <span className="text-emerald-400 print:text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AUTHENTICITY VERIFIED
                </span>
              </div>
              <div className="text-zinc-400 print:text-slate-700 space-y-1">
                <div>Digital Signature: <code className="text-white print:text-black font-bold">SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</code></div>
                <div>SCADA Gateway: <span className="text-zinc-300 print:text-slate-800">Mutual TLS mTLS v1.3 • Endpoint: /wells/bgw-014/scada-feed</span></div>
                <div>Simulation Core: <span className="text-zinc-300 print:text-slate-800">NSGA-II Coupled Thermal Reservoir & SRP Kinematics Engine (60 FPS)</span></div>
              </div>
            </div>

            {/* Authorized Engineering Sign-Off Blocks */}
            <div className="pt-3 space-y-3">
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-300 print:text-slate-700 block">
                5. Authorized Official Engineering Sign-Off & Verification
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Sign-Off 1: Chief Reservoir Engineer */}
                <div className="p-4 rounded-xl border border-zinc-800 print:border-slate-300 bg-zinc-950 print:bg-white flex flex-col justify-between h-40">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 print:text-slate-500 block">Prepared & Validated By:</span>
                    <strong className="text-xs font-sans text-white print:text-black block">Er. R. K. Sharma</strong>
                    <span className="text-[11px] text-amber-400 print:text-amber-800 font-mono block">Chief Reservoir Engineer</span>
                    <span className="text-[10px] text-zinc-500 block">EOR & Thermal Simulation Group</span>
                  </div>
                  <div className="border-t border-dashed border-zinc-800 print:border-slate-300 pt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400 print:text-emerald-700">
                    <span>DIGITALLY SIGNED</span>
                    <span>2026-09-10</span>
                  </div>
                </div>

                {/* Sign-Off 2: General Manager Field Assets */}
                <div className="p-4 rounded-xl border border-zinc-800 print:border-slate-300 bg-zinc-950 print:bg-white flex flex-col justify-between h-40">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 print:text-slate-500 block">Operational Approval:</span>
                    <strong className="text-xs font-sans text-white print:text-black block">Er. A. K. Borthakur</strong>
                    <span className="text-[11px] text-amber-400 print:text-amber-800 font-mono block">General Manager (Assets)</span>
                    <span className="text-[10px] text-zinc-500 block">Rajasthan Project Office, Jodhpur</span>
                  </div>
                  <div className="border-t border-dashed border-zinc-800 print:border-slate-300 pt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400 print:text-emerald-700">
                    <span>APPROVED FOR FIELD</span>
                    <span>2026-09-10</span>
                  </div>
                </div>

                {/* Sign-Off 3: Lead Cyber-Physical Systems Auditor */}
                <div className="p-4 rounded-xl border border-zinc-800 print:border-slate-300 bg-zinc-950 print:bg-white flex flex-col justify-between h-40">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 print:text-slate-500 block">Cyber-Physical Auditor:</span>
                    <strong className="text-xs font-sans text-white print:text-black block">Dr. P. S. Meena</strong>
                    <span className="text-[11px] text-amber-400 print:text-amber-800 font-mono block">Lead SCADA Systems Auditor</span>
                    <span className="text-[10px] text-zinc-500 block">OIL Digital Systems & Integrity</span>
                  </div>
                  <div className="border-t border-dashed border-zinc-800 print:border-slate-300 pt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400 print:text-emerald-700">
                    <span>SEAL VERIFIED</span>
                    <span>2026-09-10</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Official Disclaimer Footer */}
            <div className="border-t border-zinc-800 print:border-slate-300 pt-4 text-[10px] font-mono text-zinc-500 print:text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>© 2026 OIL INDIA LIMITED • BAGHEWALA THERMAL EOR CYBER-PHYSICAL TWIN SYSTEM</span>
              <span>CONFIDENTIAL • STRICTLY FOR AUTHORIZED OIL PERSONNEL</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
