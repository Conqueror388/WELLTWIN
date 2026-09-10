import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Gauge, 
  Activity, 
  Clock, 
  Zap, 
  Sliders, 
  Target, 
  Play, 
  Pause, 
  RotateCcw, 
  Bookmark, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Cpu, 
  Save, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

// Baseline reference values for Oil India Limited - Baghewala Heavy Oil Well BGW-014
const BASELINE_SETPOINTS = {
  steam_T: 245,
  injection_pressure: 650,
  steam_rate: 30,
  injection_duration: 14,
  soak_duration: 5,
  SPM: 7.5,
  stroke_length: 100,
  valve_opening: 80
};

// Full channel specifications with authentic petroleum engineering tags
const CHANNEL_SPECS = [
  {
    key: 'steam_T',
    tag: 'TIC-101',
    label: 'Steam Injection Temperature',
    sublabel: 'Superheated Steam Quality Enthalpy',
    unit: '°C',
    min: 150,
    max: 350,
    step: 5,
    safeMin: 210,
    safeMax: 290,
    color: '#f59e0b',
    colorName: 'amber',
    icon: Flame,
    getPhysics: (val) => {
      // Dynamic viscosity approximation based on Arrhenius equation for Baghewala heavy oil
      const v = Math.round(9200 * Math.exp(-0.024 * (val - 50)));
      const enthalpy = Math.round(1800 + (val - 150) * 4.2);
      return {
        primary: `Downhole Viscosity: ~${Math.max(18, v)} cP`,
        secondary: `Enthalpy: ${enthalpy} kJ/kg | Vapor: 82%`
      };
    }
  },
  {
    key: 'injection_pressure',
    tag: 'PIC-102',
    label: 'Steam Injection Pressure',
    sublabel: 'Wellhead Annular Injection Hydraulic',
    unit: 'psi',
    min: 250,
    max: 1400,
    step: 25,
    safeMin: 450,
    safeMax: 1150,
    color: '#0ea5e9',
    colorName: 'sky',
    icon: Gauge,
    getPhysics: (val) => {
      const margin = 1450 - val;
      const status = margin > 300 ? 'Safe Formation Limit' : margin > 100 ? 'Caution Near Frac' : 'CRITICAL FRAC RISK';
      return {
        primary: `Frac Safety Margin: +${margin} psi`,
        secondary: `Formation Integrity: ${status}`
      };
    }
  },
  {
    key: 'steam_rate',
    tag: 'FIC-103',
    label: 'Steam Injection Mass Rate',
    sublabel: 'High-Pressure Steam Boiler Throughput',
    unit: 't/d',
    min: 10,
    max: 80,
    step: 5,
    safeMin: 20,
    safeMax: 60,
    color: '#a855f7',
    colorName: 'purple',
    icon: Activity,
    getPhysics: (val) => {
      const thermalMW = ((val * 2.15) / 24 * 0.2778 * 10).toFixed(1);
      const overburdenLoss = (9 + (val / 80) * 6).toFixed(1);
      return {
        primary: `Thermal Flux: ~${thermalMW} MW-th`,
        secondary: `Overburden Loss: ~${overburdenLoss}%`
      };
    }
  },
  {
    key: 'injection_duration',
    tag: 'CYC-104',
    label: 'Steam Injection Cycle',
    sublabel: 'Continuous Superheated Steam Injection',
    unit: 'd',
    min: 1,
    max: 30,
    step: 1,
    safeMin: 7,
    safeMax: 21,
    color: '#10b981',
    colorName: 'emerald',
    icon: Clock,
    getPhysics: (val, inputs) => {
      const rate = parseFloat(inputs.steam_rate || 30);
      const totalTons = Math.round(rate * val);
      const estRadius = (Math.sqrt(totalTons) * 0.85).toFixed(1);
      return {
        primary: `Cum. Injected Steam: ${totalTons} tonnes`,
        secondary: `Est. Heated Front: ~${estRadius} m`
      };
    }
  },
  {
    key: 'soak_duration',
    tag: 'TMR-105',
    label: 'Thermal Soak Period',
    sublabel: 'Radial Heat Conduction & Equalization',
    unit: 'd',
    min: 1,
    max: 10,
    step: 1,
    safeMin: 3,
    safeMax: 7,
    color: '#f97316',
    colorName: 'orange',
    icon: Clock,
    getPhysics: (val) => {
      const equilibrium = Math.min(99, Math.round(45 + val * 7.5));
      const heatLossToCaprock = (3.5 + val * 1.2).toFixed(1);
      return {
        primary: `Thermal Conduction: ${equilibrium}% Equilibrium`,
        secondary: `Caprock Heat Dissipation: ~${heatLossToCaprock}%`
      };
    }
  },
  {
    key: 'SPM',
    tag: 'SIC-201',
    label: 'SRP Pumping Speed',
    sublabel: 'Surface Sucker Rod Beam Kinematics',
    unit: 'SPM',
    min: 2,
    max: 14,
    step: 0.5,
    safeMin: 4.5,
    safeMax: 10.5,
    color: '#f43f5e',
    colorName: 'rose',
    icon: Zap,
    getPhysics: (val) => {
      const cyclesPerDay = Math.round(val * 1440).toLocaleString();
      const stressRatio = (35 + (val / 14) * 45).toFixed(0);
      return {
        primary: `Kinematic Cycles: ${cyclesPerDay}/day`,
        secondary: `Rod String Stress: ${stressRatio}% of Yield`
      };
    }
  },
  {
    key: 'stroke_length',
    tag: 'LIC-202',
    label: 'Polished Rod Stroke Length',
    sublabel: 'Subsurface Downhole Plunger Travel',
    unit: 'in',
    min: 50,
    max: 150,
    step: 5,
    safeMin: 70,
    safeMax: 125,
    color: '#6366f1',
    colorName: 'indigo',
    icon: Sliders,
    getPhysics: (val, inputs) => {
      const spm = parseFloat(inputs.SPM || 7.5);
      const displacement = Math.round(spm * val * 0.22);
      return {
        primary: `Pump Sweep Capacity: ~${displacement} bbl/d`,
        secondary: `Plunger Travel: ${(val * 0.0254).toFixed(2)} m`
      };
    }
  },
  {
    key: 'valve_opening',
    tag: 'HIC-203',
    label: 'Production Choke Valve',
    sublabel: 'Surface Wellhead Manifold Backpressure',
    unit: '%',
    min: 0,
    max: 100,
    step: 5,
    safeMin: 20,
    safeMax: 90,
    color: '#3b82f6',
    colorName: 'blue',
    icon: Target,
    getPhysics: (val) => {
      const backpressure = Math.round((100 - val) * 2.8 + 45);
      const cavitation = val > 85 ? 'None (Full Bore)' : val < 20 ? 'High Cavitation Risk' : 'Acceptable Delta-P';
      return {
        primary: `Wellhead Backpressure: ~${backpressure} psi`,
        secondary: `Flow Regime: ${cavitation}`
      };
    }
  }
];

export default function IndustrialSimulationController({
  mode = 'css', // 'css' (8 channels) | 'scenario' (6 channels)
  inputs = {},
  onChange,
  onApplyPreset,
  onReset,
  onSaveScenario,
  simIsPlaying = false,
  onToggleSim,
  illustrativeMode = true,
  _darkMode = true,
  _currentMetrics = {},
  _userRole = 'Engineer',
  onTriggerESD,
  onRunOptimization,
  optimizationLoading = false,
  optimizationProgress = 0,
  selectedParetoPoint = null
}) {
  // Channel locks state (allows engineer to pin specific channels while tuning others)
  const [lockedChannels, setLockedChannels] = useState({});

  // Snapshot memory slots (A, B, C) for instant setpoint capture and A/B comparison
  const [snapshots, setSnapshots] = useState({
    A: null,
    B: null,
    C: null
  });
  const [activeSnapshot, setActiveSnapshot] = useState(null);

  // Time-step speed multiplier state (0.5x, 1x, 2x, 5x)
  const [simSpeed, setSimSpeed] = useState('1.0x');

  // Filter channels based on mode (CSS has all 8, Scenario Optimization has 6 joint variables)
  const activeChannels = useMemo(() => {
    if (mode === 'scenario') {
      return CHANNEL_SPECS.filter(c => 
        ['steam_T', 'steam_rate', 'soak_duration', 'SPM', 'stroke_length', 'valve_opening'].includes(c.key)
      );
    }
    return CHANNEL_SPECS;
  }, [mode]);

  const toggleChannelLock = (key) => {
    setLockedChannels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleStep = (channel, direction, isCoarse = false) => {
    if (!illustrativeMode || lockedChannels[channel.key]) return;
    const currentVal = parseFloat(inputs[channel.key] ?? BASELINE_SETPOINTS[channel.key] ?? channel.min);
    const multiplier = isCoarse ? 5 : 1;
    const delta = direction * channel.step * multiplier;
    let nextVal = Math.min(channel.max, Math.max(channel.min, currentVal + delta));
    if (channel.step % 1 !== 0) {
      nextVal = parseFloat(nextVal.toFixed(1));
    } else {
      nextVal = Math.round(nextVal);
    }
    onChange?.(channel.key, nextVal);
  };

  // Capture snapshot into slot
  const captureSnapshot = (slot) => {
    setSnapshots(prev => ({
      ...prev,
      [slot]: { ...inputs, timestamp: new Date().toLocaleTimeString() }
    }));
    setActiveSnapshot(slot);
  };

  // Restore snapshot
  const restoreSnapshot = (slot) => {
    const snap = snapshots[slot];
    if (!snap) return;
    Object.keys(snap).forEach(key => {
      if (key !== 'timestamp') {
        onChange?.(key, snap[key]);
      }
    });
    setActiveSnapshot(slot);
  };

  return (
    <div className="scada-rack-container rounded-3xl border border-slate-700/60 dark:border-white/10 bg-gradient-to-b from-slate-900/95 via-zinc-950/95 to-[#080b12] shadow-2xl p-5 sm:p-6 space-y-5 backdrop-blur-xl relative overflow-hidden">
      
      {/* Top SCADA Command Console Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 pb-4 border-b border-slate-700/50 dark:border-white/10">
        
        {/* Left: Telemetry identity and solver indicator */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
                {mode === 'css' ? 'CSS & SRP INTEGRATED SCADA CONTROLLER' : 'MULTI-OBJECTIVE EOR SCENARIO OPTIMIZER'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-amber-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                PLC LINK: 10ms
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
              <span>RACK: JODHPUR-BGW-014</span>
              <span>•</span>
              <span className="text-amber-400/90 font-semibold">
                {mode === 'css' ? '8-AXIS THERMAL-MECHANICAL PHYSICAL TWIN' : '6-AXIS NSGA-II PARETO FRONTIER TUNER'}
              </span>
              <span>•</span>
              <span className="text-amber-400">CLOSED-LOOP ODE SOLVER</span>
            </div>
          </div>
        </div>

        {/* Right: Master Control Deck (Speed, Presets, Snapshots, Play/Pause, ESD) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-start xl:justify-end">
          
          {/* Simulation Playback & Speed */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
            <button
              onClick={onToggleSim}
              disabled={!illustrativeMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                simIsPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-emerald-500/20 text-amber-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title={simIsPlaying ? 'Pause dynamic simulation physics' : 'Run dynamic simulation physics'}
            >
              {simIsPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{simIsPlaying ? 'SIM ACTIVE' : 'RUN SIM'}</span>
            </button>

            {/* Time-step speed selector */}
            <div className="flex items-center text-[10px] font-mono border-l border-white/10 pl-1">
              {['0.5x', '1.0x', '2.0x', '5.0x'].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-1.5 py-1 rounded transition-colors ${
                    simSpeed === spd 
                      ? 'bg-white/20 text-amber-400 font-bold' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
            <span className="text-[10px] font-mono text-zinc-400 font-bold px-1.5 uppercase">PRESET:</span>
            {[
              { id: 'low', label: 'ECO' },
              { id: 'optimal', label: 'OPTIMAL' },
              { id: 'high', label: 'MAX LIFT' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onApplyPreset?.(p.id)}
                disabled={!illustrativeMode}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-amber-300 border border-white/5 hover:border-amber-400/40 cursor-pointer disabled:opacity-30"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Snapshot Memory Bank (Slot A / B / C) */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
            <span className="text-[10px] font-mono text-zinc-400 font-bold px-1.5 flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-400" />
              SNAP:
            </span>
            {['A', 'B', 'C'].map((slot) => {
              const hasSnap = Boolean(snapshots[slot]);
              const isActive = activeSnapshot === slot;
              return (
                <div key={slot} className="flex items-center">
                  <button
                    onClick={() => (hasSnap ? restoreSnapshot(slot) : captureSnapshot(slot))}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      captureSnapshot(slot);
                    }}
                    title={hasSnap ? `Slot ${slot}: Captured at ${snapshots[slot].timestamp} (Click to Recall, Right-click to Overwrite)` : `Slot ${slot}: Empty (Click to Save)`}
                    className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-500 text-slate-950 shadow-[0_0_10px_rgba(14,165,233,0.6)]'
                        : hasSnap
                        ? 'bg-sky-500/20 text-amber-300 border border-sky-500/40 hover:bg-sky-500/40'
                        : 'bg-white/5 text-zinc-500 border border-dashed border-white/10 hover:text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {slot}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Reset button */}
          <button
            onClick={onReset}
            disabled={!illustrativeMode}
            className="p-2 bg-black/40 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer disabled:opacity-30"
            title="Reset to Oil India Limited baseline setpoints"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mode specific right button: ESD or Save Scenario */}
          {mode === 'scenario' ? (
            <button
              onClick={() => {
                if (onTriggerESD) {
                  onTriggerESD();
                } else if (window.confirm("CRITICAL PROTOCOL ALERT:\n\nTrigger Emergency Wellhead Shutdown (ESD) for BGW-014?")) {
                  onChange?.('SPM', 0);
                  onChange?.('steam_rate', 0);
                  onChange?.('valve_opening', 0);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>ESD Cutoff</span>
            </button>
          ) : (
            <button
              onClick={onSaveScenario}
              disabled={!illustrativeMode}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario</span>
            </button>
          )}

        </div>
      </div>

      {/* Controller Channels Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${mode === 'css' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 ${!illustrativeMode ? 'opacity-40 pointer-events-none' : ''}`}>
        {activeChannels.map((channel) => {
          const val = parseFloat(inputs[channel.key] ?? BASELINE_SETPOINTS[channel.key] ?? channel.min);
          const baselineVal = BASELINE_SETPOINTS[channel.key] ?? channel.min;
          const delta = val - baselineVal;
          const deltaPct = baselineVal !== 0 ? ((delta / baselineVal) * 100).toFixed(1) : 0;
          const pct = Math.min(100, Math.max(0, ((val - channel.min) / (channel.max - channel.min)) * 100));
          const safeMinPct = ((channel.safeMin - channel.min) / (channel.max - channel.min)) * 100;
          const safeMaxPct = ((channel.safeMax - channel.min) / (channel.max - channel.min)) * 100;
          const isLocked = lockedChannels[channel.key];
          const isSafe = val >= channel.safeMin && val <= channel.safeMax;
          const isHighRisk = val > channel.safeMax;
          const physicsInfo = channel.getPhysics(val, inputs);
          const IconComponent = channel.icon;

          return (
            <div 
              key={channel.key}
              className={`scada-channel-card group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 p-4 ${
                isLocked 
                  ? 'border-zinc-800 bg-zinc-950/70 opacity-75' 
                  : 'border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-zinc-950/95 to-[#0a0d14] hover:border-slate-700 shadow-lg'
              }`}
            >
              {/* Top Row: Channel Tag, Status LED & Lock Toggle */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 truncate">
                  <span 
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-extrabold tracking-wider border shadow-sm flex items-center gap-1.5"
                    style={{ 
                      backgroundColor: `${channel.color}15`, 
                      borderColor: `${channel.color}40`, 
                      color: channel.color 
                    }}
                  >
                    <IconComponent className="w-3 h-3" />
                    {channel.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-zinc-200 tracking-wider truncate uppercase">
                    {channel.label}
                  </span>
                </div>

                {/* Channel Lock Icon Button */}
                <button
                  type="button"
                  onClick={() => toggleChannelLock(channel.key)}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isLocked ? 'text-amber-400 bg-amber-500/15' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={isLocked ? 'Channel is LOCKED against changes' : 'Lock this channel'}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />}
                </button>
              </div>

              {/* Digital Meter & Delta Variance Display */}
              <div className="flex items-end justify-between gap-2 my-1 px-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    {channel.sublabel}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span 
                      className="text-2xl sm:text-3xl font-mono font-black tracking-tight"
                      style={{ color: channel.color }}
                    >
                      {val}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      {channel.unit}
                    </span>
                  </div>
                </div>

                {/* Live Delta vs Field Baseline */}
                <div className="text-right">
                  <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-1 ${
                    delta === 0
                      ? 'bg-zinc-800/80 text-zinc-400 border-zinc-700'
                      : delta > 0
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-sky-500/15 text-amber-300 border-sky-500/30'
                  }`}>
                    <span>{delta >= 0 ? `+${delta}` : delta}</span>
                    <span>({delta >= 0 ? `+${deltaPct}%` : `${deltaPct}%`})</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 mt-0.5">
                    BASE: {baselineVal}{channel.unit}
                  </div>
                </div>
              </div>

              {/* Tactical Steppers and Multi-Zone Precision Slider */}
              <div className="space-y-2 mt-2">
                
                {/* Stepper Buttons and Slider Track */}
                <div className="flex items-center gap-1.5">
                  {/* Coarse Down */}
                  <button
                    type="button"
                    disabled={!illustrativeMode || isLocked || val <= channel.min}
                    onClick={() => handleStep(channel, -1, true)}
                    className="scada-jog-btn w-6 h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-xs border border-white/5 disabled:opacity-20 cursor-pointer"
                    title={`Coarse decrease by ${channel.step * 5} ${channel.unit}`}
                  >
                    <ChevronsLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Fine Down */}
                  <button
                    type="button"
                    disabled={!illustrativeMode || isLocked || val <= channel.min}
                    onClick={() => handleStep(channel, -1, false)}
                    className="scada-jog-btn w-6 h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-xs border border-white/5 disabled:opacity-20 cursor-pointer"
                    title={`Fine decrease by ${channel.step} ${channel.unit}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* The Multi-Zone Slider Track with Visual Envelope */}
                  <div className="relative flex-grow flex items-center py-1">
                    {/* Visual Safe Operating Envelope Backdrop */}
                    <div className="absolute inset-x-0 h-1.5 rounded-full bg-zinc-900 border border-white/5 overflow-hidden pointer-events-none">
                      {/* Sub-optimal low range */}
                      <div 
                        className="absolute top-0 bottom-0 left-0 bg-blue-500/20"
                        style={{ width: `${safeMinPct}%` }}
                      />
                      {/* Safe Operating Green Envelope */}
                      <div 
                        className="absolute top-0 bottom-0 bg-emerald-500/25 border-x border-emerald-500/40"
                        style={{ left: `${safeMinPct}%`, width: `${safeMaxPct - safeMinPct}%` }}
                      />
                      {/* High-Stress Envelope */}
                      <div 
                        className="absolute top-0 bottom-0 right-0 bg-rose-500/25"
                        style={{ width: `${100 - safeMaxPct}%` }}
                      />
                      {/* Active Progress Fill */}
                      <div 
                        className="h-full transition-all duration-75"
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: channel.color,
                          boxShadow: `0 0 10px ${channel.color}`
                        }}
                      />
                    </div>

                    <input
                      type="range"
                      min={channel.min}
                      max={channel.max}
                      step={channel.step}
                      disabled={!illustrativeMode || isLocked}
                      value={val}
                      onChange={(e) => onChange?.(channel.key, parseFloat(e.target.value))}
                      className="scada-slider-track w-full appearance-none bg-transparent cursor-pointer relative z-10"
                      style={{ color: channel.color }}
                    />
                  </div>

                  {/* Fine Up */}
                  <button
                    type="button"
                    disabled={!illustrativeMode || isLocked || val >= channel.max}
                    onClick={() => handleStep(channel, 1, false)}
                    className="scada-jog-btn w-6 h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-xs border border-white/5 disabled:opacity-20 cursor-pointer"
                    title={`Fine increase by ${channel.step} ${channel.unit}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Coarse Up */}
                  <button
                    type="button"
                    disabled={!illustrativeMode || isLocked || val >= channel.max}
                    onClick={() => handleStep(channel, 1, true)}
                    className="scada-jog-btn w-6 h-7 rounded bg-slate-800/80 hover:bg-slate-700 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-xs border border-white/5 disabled:opacity-20 cursor-pointer"
                    title={`Coarse increase by ${channel.step * 5} ${channel.unit}`}
                  >
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Range Indicators & Envelope Status */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-0.5">
                  <span>{channel.min} {channel.unit}</span>
                  
                  {/* Status Badge */}
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                    isHighRisk 
                      ? 'bg-rose-500/20 text-amber-300 border border-rose-500/30' 
                      : isSafe 
                      ? 'bg-emerald-500/20 text-amber-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isHighRisk ? 'HIGH STRESS' : isSafe ? 'OPTIMAL' : 'LOW EFFICIENCY'}
                  </span>

                  <span>{channel.max} {channel.unit}</span>
                </div>

                {/* Live Subsurface Physics Feed */}
                <div className="bg-black/50 border border-white/5 rounded-xl p-2 font-mono text-[10px] space-y-0.5">
                  <div className="text-zinc-200 font-semibold flex items-center justify-between">
                    <span>{physicsInfo.primary}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: channel.color }} />
                  </div>
                  <div className="text-zinc-400 truncate">
                    {physicsInfo.secondary}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario Optimization Extension Bar (when in 'scenario' mode) */}
      {mode === 'scenario' && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-black/40 rounded-2xl p-4 border border-white/5">
          {/* Optimization Solver Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-zinc-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <span>NSGA-II MULTI-OBJECTIVE SOLVER</span>
                {optimizationLoading && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-zinc-200 animate-pulse">
                    COMPUTING: {optimizationProgress}%
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                Optimizing Recovery vs. Steam Fuel Cost for Jodhpur Member sandstone reservoir
              </div>
            </div>
          </div>

          {/* Action to trigger solver */}
          <div className="flex items-center gap-3">
            {selectedParetoPoint && (
              <div className="text-right hidden sm:block font-mono text-xs">
                <span className="text-zinc-400">Candidate #{selectedParetoPoint.id}: </span>
                <span className="text-amber-400 font-bold">{selectedParetoPoint.production?.toFixed(0)} bbl/d</span>
                <span className="text-zinc-500"> | </span>
                <span className="text-amber-400 font-bold">₹{Math.round(selectedParetoPoint.cost)}/d</span>
              </div>
            )}
            <button
              onClick={onRunOptimization}
              disabled={optimizationLoading}
              className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>{optimizationLoading ? 'Solving Pareto Frontier...' : 'Run NSGA-II Solver'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
