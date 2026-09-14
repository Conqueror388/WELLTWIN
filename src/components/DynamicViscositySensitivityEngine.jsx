import React, { useMemo, Suspense } from 'react';
import { Droplets, Activity } from 'lucide-react';

const DynamicEChart = React.lazy(async () => {
  const [echartsModule, reactEchartsModule] = await Promise.all([
    import('echarts'),
    import('echarts-for-react')
  ]);
  const echarts = echartsModule.default || echartsModule;
  const ReactECharts = reactEchartsModule.default || reactEchartsModule;
  return {
    default: (props) => <ReactECharts echarts={echarts} {...props} />
  };
});

function LazyChart(props) {
  return (
    <Suspense fallback={
      <div className="h-full w-full rounded-2xl flex items-center justify-center text-xs text-zinc-400 font-mono">
        Loading viscosity analytics...
      </div>
    }>
      <DynamicEChart {...props} />
    </Suspense>
  );
}

export default function DynamicViscositySensitivityEngine({ inputs = {}, darkMode = true }) {
  const steamT = parseFloat(inputs.steam_T) || 220;
  const soakDays = parseFloat(inputs.soak_duration) || 5;
  const injPressure = parseFloat(inputs.injection_pressure) || 850;
  const spm = parseFloat(inputs.SPM) || 7.5;

  // Calculate Arrhenius dynamic curve and parameter contributions
  const { calculatedViscosity = 120, baselineViscosity = 11500, viscosityDropPct, mobilityRatio, curveData, activePoint } = useMemo(() => {
    const baseVisc = 11500; // cP at 45°C cold reservoir baseline
    const T_kelvin = steamT + 273.15;
    const T0_kelvin = 45 + 273.15;
    const Ea_over_R = 4150; // Activation energy over gas constant for Baghewala asphaltic crude

    // Arrhenius base thermal decay
    const thermalFactor = Math.exp(Ea_over_R * (1 / T_kelvin - 1 / T0_kelvin));
    
    // Soak duration diffusion enhancement (up to 18% additional near-wellbore matrix equilibration)
    const soakFactor = 1 - Math.min(0.18, (soakDays / 14) * 0.18);
    
    // Pressure enthalpy factor (higher pressure increases saturation temperature and steam quality delivery)
    const pressureFactor = 1 - Math.min(0.12, ((injPressure - 400) / 1100) * 0.12);

    // Non-Newtonian shear thinning from pump drawdown (Ostwald-de Waele flow behavior index n=0.78)
    const shearFactor = 1 - Math.min(0.08, ((spm - 4) / 10) * 0.08);

    const calcVisc = Math.max(65, Math.round(baseVisc * thermalFactor * soakFactor * pressureFactor * shearFactor));
    const dropPct = (((baseVisc - calcVisc) / baseVisc) * 100).toFixed(1);

    // Mobility ratio M = (krw * mu_oil) / (kro * mu_water) where mu_water ~ 0.35 cP
    const M = ((0.22 * calcVisc) / (0.65 * 0.35)).toFixed(1);

    // Generate full Arrhenius temperature curve data from 40°C to 350°C
    const curve = [];
    for (let t = 40; t <= 350; t += 10) {
      const Tk = t + 273.15;
      const v = Math.round(baseVisc * Math.exp(Ea_over_R * (1 / Tk - 1 / T0_kelvin)) * soakFactor * pressureFactor * shearFactor);
      curve.push([t, Math.max(50, v)]);
    }

    return {
      calculatedViscosity: calcVisc,
      baselineViscosity: baseVisc,
      viscosityDropPct: dropPct,
      mobilityRatio: M,
      curveData: curve,
      activePoint: [steamT, calcVisc]
    };
  }, [steamT, soakDays, injPressure, spm]);

  const darcyFluxMultiplier = (baselineViscosity / Math.max(1, calculatedViscosity)).toFixed(1);

  return (
    <div className="glass-panel p-6 space-y-6 page-transition-wrap">
      {/* ── Section Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4 slide-edge-top">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Droplets className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              Thermodynamic Viscosity Dynamics & Parameter Sensitivity
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 font-sans">
            Arrhenius Thermal Thinning Law coupled with Marx-Langenheim Enthalpy Matrix Diffusion for Heavy Crude
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-3 font-mono text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-amber-400 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Viscosity Reduction: −{viscosityDropPct}%
          </span>
        </div>
      </div>

      {/* ── 3-Column Visual Layout: Live Curve + Parameter Drivers + Mobility Gauge ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left (7 Columns): Arrhenius Viscosity vs Temperature Interactive Curve */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-3 slide-edge-left stagger-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-700 dark:text-zinc-300 font-bold uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Dynamic Viscosity vs. Steam Temperature Curve
            </span>
            <span className="text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Operating Point: {activePoint[0]}°C @ {activePoint[1]} cP
            </span>
          </div>

          <div className="h-60 w-full">
            <LazyChart
              style={{ height: '100%', width: '100%' }}
              option={{
                backgroundColor: 'transparent',
                tooltip: {
                  trigger: 'axis',
                  backgroundColor: darkMode ? 'rgba(10, 13, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: '#f59e0b',
                  textStyle: { color: darkMode ? '#f8fafc' : '#0f172a', fontFamily: 'monospace', fontSize: 12 },
                  formatter: (params) => {
                    const pt = params[0]?.data;
                    if (!pt) return '';
                    return `Temperature: <b>${pt[0]} °C</b><br/>Crude Viscosity: <b style="color:#38bdf8;">${pt[1].toLocaleString()} cP</b>`;
                  }
                },
                grid: { top: 20, bottom: 30, left: 60, right: 30 },
                xAxis: {
                  type: 'value',
                  name: '°C',
                  min: 40,
                  max: 350,
                  axisLabel: { color: darkMode ? '#94a3b8' : '#475569', fontFamily: 'monospace', fontSize: 11 },
                  splitLine: { lineStyle: { color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' } }
                },
                yAxis: {
                  type: 'log',
                  name: 'cP (Log Scale)',
                  min: 50,
                  max: 15000,
                  axisLabel: { color: darkMode ? '#94a3b8' : '#475569', fontFamily: 'monospace', fontSize: 11 },
                  splitLine: { lineStyle: { color: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' } }
                },
                series: [
                  {
                    name: 'Arrhenius Curve',
                    type: 'line',
                    smooth: true,
                    data: curveData,
                    lineStyle: { color: '#38bdf8', width: 3.5, shadowColor: 'rgba(56, 189, 248, 0.5)', shadowBlur: 10 },
                    areaStyle: {
                      color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                          { offset: 0, color: 'rgba(56, 189, 248, 0.35)' },
                          { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
                        ]
                      }
                    }
                  },
                  {
                    name: 'Live Setpoint',
                    type: 'scatter',
                    data: [activePoint],
                    symbolSize: 16,
                    itemStyle: {
                      color: '#f59e0b',
                      borderColor: '#ffffff',
                      borderWidth: 2,
                      shadowColor: '#f59e0b',
                      shadowBlur: 15
                    }
                  }
                ]
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-zinc-400 pt-1 border-t border-slate-200 dark:border-zinc-800">
            <span>Baseline: 11,500 cP (@ 45°C)</span>
            <span className="text-amber-400 font-bold">Max Achievable Thinning: 65 cP (@ 350°C)</span>
          </div>
        </div>

        {/* Right (5 Columns): 4-Axis Parameter Sensitivity Breakdown */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 slide-edge-right stagger-1">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 space-y-3">
            <span className="text-xs font-bold text-amber-500 font-mono uppercase tracking-wider block">
              Parameter Sensitivity Contributions
            </span>

            {/* 1. Thermal Injection Temp */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">1. Steam Temp ({steamT}°C):</span>
                <span className="text-amber-400 font-bold">−{((1 - Math.exp(4150 * (1/(steamT+273.15) - 1/318.15))) * 100).toFixed(0)}% (Primary Driver)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, ((steamT - 150) / 200) * 100)}%` }} />
              </div>
            </div>

            {/* 2. Soak Duration Conduction */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">2. Soak Period ({soakDays} Days):</span>
                <span className="text-amber-400 font-bold">−{((soakDays / 14) * 18).toFixed(1)}% Matrix Heat</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, (soakDays / 14) * 100)}%` }} />
              </div>
            </div>

            {/* 3. Injection Pressure Enthalpy */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">3. Pressure ({injPressure} psi):</span>
                <span className="text-zinc-300 font-bold">−{(((injPressure - 400) / 1100) * 12).toFixed(1)}% Latent Enthalpy</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(100, ((injPressure - 400) / 1100) * 100)}%` }} />
              </div>
            </div>

            {/* 4. Drawdown Shear Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-700 dark:text-zinc-300 font-medium">4. Pump Speed ({spm} SPM):</span>
                <span className="text-amber-400 font-bold">−{(((spm - 4) / 10) * 8).toFixed(1)}% Shear Thinning</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, ((spm - 4) / 10) * 100)}%` }} />
              </div>
            </div>
          </div>

          {/* Mobility Ratio Card */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-500 uppercase font-mono block">Mobility Ratio (M)</span>
              <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">Water-to-Oil Mobility</span>
            </div>
            <div className="text-right font-mono">
              <strong className="text-lg font-bold text-amber-500">{mobilityRatio}</strong>
              <span className="text-[10px] text-amber-400 block font-bold">
                {parseFloat(mobilityRatio) < 10 ? '✓ Piston Displacement' : '⚡ Unfavorable Fingering'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Dynamic Capillary Darcy Flow Simulator ── */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 space-y-3 slide-edge-bottom stagger-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-zinc-800/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-amber-400">
              Micro-Capillary Matrix Flow Simulator (Darcy's Law: Q = -k·A·ΔP / μ·L)
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            ⚡ {darcyFluxMultiplier}× Higher Laminar Matrix Mobility
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Tube 1: Cold Reservoir In-Situ (45°C, 11,500 cP) */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 flex items-center gap-3.5 shadow-sm">
            {/* Visual Droplet Tube */}
            <div className="relative w-9 h-24 rounded-full bg-slate-200 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700/80 overflow-hidden flex flex-col justify-between items-center py-1 flex-shrink-0 shadow-inner">
              <div className="w-6 h-2 rounded-full bg-slate-400 dark:bg-zinc-800 border-b border-zinc-700" />
              {/* Sluggish Tar Drop (8.5s slow descent) */}
              <div
                className="w-3.5 h-4 rounded-full bg-gradient-to-b from-zinc-700 to-black border border-zinc-600 viscosity-drip-bead shadow-sm"
                style={{ animationDuration: '8.5s' }}
              />
              <div className="w-7 h-3 rounded-b-full bg-slate-400 dark:bg-zinc-900 border-t border-zinc-800" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-600 dark:text-zinc-400 font-bold uppercase">Cold Matrix In-Situ</span>
                <span className="text-slate-600 dark:text-zinc-400 font-bold">45°C</span>
              </div>
              <div className="text-base font-mono font-bold text-slate-800 dark:text-zinc-200">11,500 cP</div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 leading-tight">
                Immobile bitumen. Near-zero matrix flow without cyclic steam injection.
              </div>
            </div>
          </div>

          {/* Tube 2: Thermally Stimulated Heavy Crude (Steam T) */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3.5 shadow-sm">
            {/* Visual Droplet Tube */}
            <div className="relative w-9 h-24 rounded-full bg-slate-200 dark:bg-zinc-950 border border-amber-500/40 overflow-hidden flex flex-col justify-between items-center py-1 flex-shrink-0 shadow-inner">
              <div className="w-6 h-2 rounded-full bg-amber-600/80 border-b border-amber-400/50" />
              {/* Free-flowing drop (duration scaled to calculated viscosity: 0.45s to 3.5s) */}
              <div
                className="w-3.5 h-4 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 viscosity-drip-bead shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                style={{
                  animationDuration: `${Math.max(0.45, Math.min(3.5, (calculatedViscosity / 11500) * 8.5)).toFixed(2)}s`
                }}
              />
              <div className="w-7 h-3 rounded-b-full bg-amber-950/80 border-t border-amber-500/30" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-500 font-bold uppercase">Stimulated Oil Inflow</span>
                <span className="text-amber-500 font-bold">{steamT}°C</span>
              </div>
              <div className="text-base font-mono font-bold text-amber-500 dark:text-amber-300">
                {calculatedViscosity.toLocaleString()} cP
              </div>
              <div className="text-[11px] font-mono text-slate-600 dark:text-amber-200/80 leading-tight">
                High-temperature Arrhenius breakdown unlocks rapid drainage to horizontal slotted liner.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
