import DynamicViscositySensitivityEngine from './components/DynamicViscositySensitivityEngine';

// ── WEB AUDIO SYNTHESIZER FOR SUBTLE ENTERPRISE HUD SOUNDS ────────────────
const playHoloSound = (type = 'click') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext blocked or not supported
  }
};

import CinematicIntroPage from './components/CinematicIntroPage';
import EngineerAdminLogin, { ENTERPRISE_PERSONAS } from './components/EngineerAdminLogin';
import React, {  useState, useEffect, useRef, useMemo, useCallback , Suspense } from 'react';
import { 
  Activity, 
  Settings, 
  Cpu, 
  TrendingUp, 
  Sun, 
  Moon, 
  Sliders,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Shield,
  Layers,
  Wrench,
  Target,
  BookOpen,
  Flame,
  ArrowDownCircle,
  ArrowUpCircle,
  Database,
  FileText,
  Droplets,
  Maximize2,
  LogOut,
  UserCheck,
  ChevronDown,
  Compass,
  FileCheck,
  Download
} from 'lucide-react';
import { 
  runPhysicsModel, 
  generateParetoFront, 
  generateHistoricalData 
} from './simulationEngine';
import ThreeDWellWorkspace from './components/ThreeDWellWorkspace';
import IndustrialSimulationController from './components/IndustrialSimulationController';
import OilIndiaUpgradeHub from './components/OilIndiaUpgradeHub';
import AIWhatIfOptimizer from './components/AIWhatIfOptimizer';
import OfficialExecutiveDossier from './components/OfficialExecutiveDossier';

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
      <div className="animate-pulse glass-panel h-full w-full rounded-2xl flex items-center justify-center text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono">
        Loading chart telemetry...
      </div>
    }>
      <DynamicEChart {...props} />
    </Suspense>
  );
}

class TwinErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(error, errorInfo) {
    console.error("TwinErrorBoundary caught an error:", error, errorInfo);
  }
  handleReset = () => {
    this.setState({ error: null });
    if (this.props.onReset) this.props.onReset();
  };
  render() {
    if (this.state.error) {
      return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', minHeight:'220px', background:'#09090b', color:'#f59e0b', fontFamily:'monospace', fontSize:'12px', flexDirection:'column', gap:'12px', padding:'24px', textAlign:'center', borderRadius:'16px', border:'1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'16px' }}>⚠️</span>
            <span style={{ fontWeight:'bold', fontSize:'14px', color:'#f59e0b' }}>{this.props.title || 'COMPONENT RECOVERY GATE'}</span>
          </div>
          <span style={{ color:'#d4d4d8', maxWidth:'500px', lineHeight:'1.5' }}>{this.state.error?.message || 'An unexpected rendering error occurred.'}</span>
          <div style={{ display:'flex', gap:'10px', marginTop:'6px' }}>
            <button onClick={this.handleReset} style={{ background:'#27272a', border:'1px solid #52525b', color:'#f4f4f5', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontFamily:'monospace', fontSize:'12px', fontWeight:'bold' }}>↺ Try Recovering</button>
            <button onClick={() => window.location.reload()} style={{ background:'#18181b', border:'1px solid #3f3f46', color:'#a1a1aa', padding:'8px 18px', borderRadius:'8px', cursor:'pointer', fontFamily:'monospace', fontSize:'12px' }}>Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>{time}</span>;
}

function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  return <span>{numVal.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

function DynamometerCard({ fillage, rodLoad, SPM, strokeLength }) {
  const loadOffset = Math.max(-25, Math.min(25, (rodLoad - 10000) / 300));
  const wScale = strokeLength / 100;
  const hScale = 1.0 + (SPM - 7.5) * 0.05;
  
  const xStart = 40 + (1 - wScale) * 20;
  const xEnd = 200 - (1 - wScale) * 20;
  const yTop = 45 - loadOffset - (hScale - 1) * 10;
  const yBottom = 115 - loadOffset + (hScale - 1) * 10;
  
  const fillFraction = fillage / 100;
  let pointsStr = "";
  if (fillFraction >= 0.85) {
    pointsStr = `${xStart},${yBottom} ${xStart},${yTop} ${xEnd},${yTop} ${xEnd},${yBottom}`;
  } else {
    const dropX = xStart + (xEnd - xStart) * (1 - fillFraction);
    pointsStr = `${xStart},${yTop + (yBottom - yTop) * 0.5} ${xStart},${yTop} ${xEnd},${yTop} ${xEnd},${yBottom} ${dropX},${yBottom}`;
  }
  
  return (
    <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4 border-0 rounded-2xl flex flex-col items-center gap-2">
      <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono font-bold uppercase tracking-wider">Dynamometer Card (Load vs Position)</span>
      <div className="relative w-full h-32 flex items-center justify-center">
        <svg width="240" height="120" className="overflow-visible">
          <line x1="20" y1="20" x2="220" y2="20" stroke="#222" strokeDasharray="3,3" />
          <line x1="20" y1="65" x2="220" y2="65" stroke="#222" strokeDasharray="3,3" />
          <line x1="20" y1="110" x2="220" y2="110" stroke="#222" strokeDasharray="3,3" />
          <line x1="40" y1="10" x2="40" y2="120" stroke="#222" strokeDasharray="3,3" />
          <line x1="120" y1="10" x2="120" y2="120" stroke="#222" strokeDasharray="3,3" />
          <line x1="200" y1="10" x2="200" y2="120" stroke="#222" strokeDasharray="3,3" />
          
          <polygon
            points={pointsStr}
            fill="rgba(59, 130, 246, 0.08)"
            stroke={rodLoad > 14000 ? "#f43f5e" : fillFraction < 0.85 ? "#f59e0b" : "#3b82f6"}
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          
          <text x="15" y="15" fill="#666" fontSize="7" fontFamily="monospace">LOAD (LBS)</text>
          <text x="180" y="118" fill="#666" fontSize="7" fontFamily="monospace">POSITION</text>
        </svg>
      </div>
      <div className="flex justify-between w-full text-[12px] font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-600 px-2">
        <span>0% (Bottom)</span>
        <span>100% (Top)</span>
      </div>
    </div>
  );
}

function ProcessFlowStrip({ darkMode = true }) {
  return (
    <div className={`w-full rounded-2xl p-3 flex items-center justify-between font-sans shadow-lg overflow-x-auto gap-3 border ${
      darkMode ? 'glass-panel border-zinc-800/80 text-zinc-300' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
    }`}>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[#3a86f5] font-bold text-xs uppercase tracking-widest block leading-none font-mono">Process Flow</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-radar-online" />
      </div>
      
      <div className={`flex items-center gap-2 flex-grow justify-center text-[12px] font-semibold whitespace-nowrap overflow-x-auto select-none ${
        darkMode ? 'text-zinc-200 dark:text-zinc-200 light:text-slate-700' : 'text-slate-600'
      }`}>
        {[
          { icon: Flame, color: 'text-orange-500', name: 'Steam Generator' },
          { icon: ArrowDownCircle, color: 'text-amber-400', name: 'Injection Well' },
          { icon: Layers, color: 'text-amber-500', name: 'Heated Reservoir' },
          { icon: ArrowUpCircle, color: 'text-orange-500', name: 'Production Well' },
          { icon: Activity, color: 'text-amber-500', name: 'Separator' },
          { icon: Database, color: 'text-zinc-400', name: 'Storage Tank' }
        ].map((step, idx, arr) => {
          const IconComp = step.icon;
          return (
            <React.Fragment key={step.name}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors shadow-sm ${
                darkMode ? 'bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              }`}>
                <IconComp className={`w-4 h-4 ${step.color}`} />
                <span>{step.name}</span>
              </div>
              {idx < arr.length - 1 && (
                <span className={`text-sm font-bold arrow-shimmer ${darkMode ? 'text-zinc-300 dark:text-zinc-300 light:text-slate-600' : 'text-slate-400'}`}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const INITIAL_WELLS = [
  { id: 'BGW-014', name: 'Baghewala-014', type: 'Horizontal (OIL India Ltd, Rajasthan)', status: 'Production', health: 84 },
  { id: 'BGW-015', name: 'Baghewala-015', type: 'Vertical (OIL India Ltd, Rajasthan)', status: 'Soak Phase', health: 91 },
  { id: 'BGW-002', name: 'Baghewala-002', type: 'Horizontal heavy-oil CSS+SRP', status: 'Steam Injection', health: 62 }
];



function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // Default to 'overview' upon login
  const activeTabRef = useRef(null);

  // Auto-scroll active navigation tab into center view on tab change
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);
  const [selectedWell, setSelectedWell] = useState(INITIAL_WELLS[0]);
  const [dataMode, setDataMode] = useState('baseline'); // 'baseline' | 'historical' | 'synthetic'
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [xrayExploded, setXrayExploded] = useState(false);
  const [showExecutiveDossier, setShowExecutiveDossier] = useState(false);
  
  // PWA Web Install State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Detect standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredInstallPrompt(null);
      showToast('Oil India Limited Digital Twin installed to desktop/home screen!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    playHoloSound('click');
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Installing OIL Digital Twin...');
      }
      setDeferredInstallPrompt(null);
    } else {
      // Guide users on desktop or iOS where install prompt API is manual
      showToast('To install: click the Install icon (⤓) in your browser address bar or tap "Add to Home Screen".');
    }
  };
  
  // Enterprise Engineer & Admin Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('oil_twin_user') || localStorage.getItem('oil_twin_user');
      return saved ? JSON.parse(saved) : ENTERPRISE_PERSONAS[0];
    } catch {
      return ENTERPRISE_PERSONAS[0];
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [userRole, setUserRole] = useState(() => currentUser?.role || 'Engineer'); // 'Operator' | 'Engineer' | 'Manager' | 'Administrator'
  const [connectionState, setConnectionState] = useState('normal'); // 'normal' | 'error' | 'empty'
  const [auditLogs, setAuditLogs] = useState([
    { timestamp: '2026-08-27 20:45:10', event: 'Operational setpoints calibrated for Well BGW-014', role: 'Operator' },
    { timestamp: '2026-08-27 19:30:15', event: 'CSV summary report generated & downloaded', role: 'Manager' },
    { timestamp: '2026-08-27 18:15:22', event: 'Model predictive simulation executed using NSGA-II solver', role: 'Engineer' }
  ]);
  const addAuditLog = useCallback((event, role = userRole) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs(prev => [
      { timestamp, event, role },
      ...prev
    ]);
  }, [userRole]);

  const handleLogin = useCallback((userProfile, remember = false) => {
    setCurrentUser(userProfile);
    setUserRole(userProfile.role || 'Engineer');
    setIsAuthenticated(true);
    setActiveTab('overview'); // Ensure landing view on login is Operations Overview
    try {
      sessionStorage.setItem('oil_twin_auth', 'true');
      sessionStorage.setItem('oil_twin_user', JSON.stringify(userProfile));
      if (remember) {
        localStorage.setItem('oil_twin_auth', 'true');
        localStorage.setItem('oil_twin_user', JSON.stringify(userProfile));
      }
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    addAuditLog(`Security Clearance Verified: ${userProfile.name} (${userProfile.badgeId}) authenticated as ${userProfile.role}`, userProfile.role);
    playHoloSound('tab');
    showToast(`Access granted. Welcome, ${userProfile.name} (${userProfile.badgeId}).`);
  }, [addAuditLog]);

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    setShowUserMenu(false);
    try {
      sessionStorage.setItem('oil_twin_auth', 'false');
      localStorage.setItem('oil_twin_auth', 'false');
      localStorage.removeItem('oil_twin_user');
      sessionStorage.removeItem('oil_twin_user');
    } catch (e) {
      console.warn('Storage unavailable', e);
    }
    addAuditLog(`Active session signed out: ${currentUser?.name || 'User'}`, userRole);
    playHoloSound('alert');
    showToast('Session terminated. Switched to secure access gate.');
  }, [currentUser, userRole, addAuditLog]);
  const [tankViewMode, setTankViewMode] = useState('normal'); // 'transparent' | 'cutaway' | 'normal'
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [illustrativeMode, setIllustrativeMode] = useState(true); // Separator for verified field data vs sandbox simulation
  const assetViewMode = 'normal';

  const renderTelemetryMetric = (label, value, unit, category) => {
    const displayStatus = category === 'baseline' 
      ? 'Verified' 
      : (category === 'historical' ? 'Historical' : 'Simulation');
    
    const badgeColor = displayStatus === 'Verified' 
      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
      : (displayStatus === 'Historical' ? 'bg-white/10 text-zinc-300 border-white/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/30');

    const displayVal = typeof value === 'number' ? value.toLocaleString() : value;

    return (
      <div className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between gap-1.5 hover:border-zinc-700 transition-all font-sans shadow-lg">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs text-zinc-300 uppercase tracking-wider block font-bold truncate">{label}</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border uppercase tracking-wider flex-shrink-0 ${badgeColor}`}>
            {displayStatus}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <strong className="text-white font-mono text-2xl tracking-tight leading-none">
            {displayVal}
          </strong>
          {unit && <span className="text-zinc-400 text-xs font-mono font-bold">{unit}</span>}
        </div>
      </div>
    );
  };
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState(null);

  const handleDatasetImport = () => {
    try {
      if (!importText.trim()) {
        throw new Error("Import field is empty. Please paste an authorized JSON dataset.");
      }
      const parsed = JSON.parse(importText);
      if (!parsed.wellId || !parsed.reservoir_depth || !parsed.API_gravity) {
        throw new Error("Missing required field parameters (wellId, reservoir_depth, API_gravity).");
      }
      if (parsed.inputs && typeof parsed.inputs === 'object') {
        const sanitized = {};
        const allowedKeys = ['steam_T', 'injection_pressure', 'steam_rate', 'injection_duration', 'SPM', 'valve_opening', 'soak_duration', 'stroke_length', 'cycle_day'];
        for (const key of allowedKeys) {
          if (parsed.inputs[key] !== undefined) {
            const num = parseFloat(parsed.inputs[key]);
            if (!isNaN(num) && isFinite(num)) {
              sanitized[key] = num;
            }
          }
        }
        const nextInputs = { ...inputs, ...sanitized };
        setInputs(nextInputs);
        setLocalInputs(nextInputs);
      }
      setImportError(null);
      const safeWellId = String(parsed.wellId).slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, '');
      showToast(`Successfully validated and imported authorized OIL dataset for ${safeWellId}!`);
      // Auto enable illustrative sandbox mode since parameters were customized
      setIllustrativeMode(true);
      setDataMode('synthetic');
    } catch (err) {
      setImportError(err.message || "Invalid JSON syntax.");
    }
  };
  
  // Graphics settings & SCADA telemetry streaming state
  const [graphicsQuality, setGraphicsQuality] = useState('Medium'); // 'Low' | 'Medium' | 'High'
  const [liveScada, setLiveScada] = useState(false);
  const [scadaAlert, setScadaAlert] = useState(null);

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchCmd, setSearchCmd] = useState('');
  
  // Analytics selected sub-tab state
  
  
  // Simulation play/pause state
  const [simIsPlaying, setSimIsPlaying] = useState(true);

  // Subsurface interactive control states
  const [subsurfaceWellFocus, setSubsurfaceWellFocus] = useState('none');
  const [showSubsurfaceHeatMap, setShowSubsurfaceHeatMap] = useState(true);
  const [showSubsurfaceOilFlow, setShowSubsurfaceOilFlow] = useState(true);
  const [groundTransparency, setGroundTransparency] = useState(0.0);

  // 6 Simulation Parameters (Unified React state)
  const [inputs, setInputs] = useState({
    steam_T: 220,               // 1. Steam Temperature (°C)
    injection_pressure: 850,    // 2. Steam Injection Pressure (psi)
    steam_rate: 25,             // 3. Steam Injection Rate (t/d)
    injection_duration: 12,     // 4. Injection Duration (days)
    SPM: 7.5,                   // 5. Pump Speed (SPM)
    valve_opening: 100,         // 6. Production Valve Opening (%)
    soak_duration: 5,
    stroke_length: 100,
    cycle_day: 12
  });

  // Fast-reacting local inputs for responsive slider dragging
  const [localInputs, setLocalInputs] = useState(inputs);
  const [_savedScenarios, setSavedScenarios] = useState([]);
  const [_activeCameraPreset, setActiveCameraPreset] = useState('site');

  const [lastChangedParam, setLastChangedParam] = useState(null);
  

  // Search & time range states
  
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState('30d');

  // Professional Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);
  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  // Optimization state
  const [optimizationLoading, setOptimizationLoading] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [selectedParetoPoint, setSelectedParetoPoint] = useState(null);

  // ── Shared 3D Viewport Reparenting ───────────────────────────────────────
  const [active3DContainer, setActive3DContainer] = useState(null);
  const set3DContainer = useCallback((node) => {
    if (node) {
      setActive3DContainer(node);
    }
  }, []);
  
  // Derived data with useMemo (recalculates automatically on selectedWell change)
  const historicalData = useMemo(() => generateHistoricalData(selectedWell.id), [selectedWell.id]);
  const paretoFrontData = useMemo(() => generateParetoFront(selectedWell.id), [selectedWell.id]);

  // Deriving current metrics instantly from inputs
  const currentMetrics = useMemo(() => runPhysicsModel(inputs), [inputs]);
  const BASELINE_INPUTS = {
    steam_T: 220,
    injection_pressure: 850,
    steam_rate: 25,
    injection_duration: 12,
    soak_duration: 5,
    SPM: 7.5,
    stroke_length: 100,
    valve_opening: 100,
    cycle_day: 12
  };

  const threeDWorkspaceRef = useRef(null);

  
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Dark/Light Theme Class toggler
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-Time SCADA Telemetry Stream Simulator
  useEffect(() => {
    if (!liveScada) {
      setScadaAlert(null);
      return;
    }

    const interval = setInterval(() => {
      // Simulate realistic industrial sensor noise on injection pressure & pump SPM
      setInputs(prev => {
        const dP = (Math.random() - 0.5) * 6; // pressure jitter ±3 psi
        const nextPressure = Math.max(650, Math.min(1150, Math.round(prev.injection_pressure + dP)));
        const dSPM = (Math.random() - 0.5) * 0.15; // SPM oscillation
        const nextSPM = Math.max(4.0, Math.min(10.5, parseFloat((prev.SPM + dSPM).toFixed(1))));

        return {
          ...prev,
          injection_pressure: nextPressure,
          SPM: nextSPM
        };
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [liveScada]);

  // SCADA Industrial Safety Alarm Checker
  useEffect(() => {
    if (!isAuthenticated || !currentMetrics) {
      setScadaAlert(null);
      return;
    }
    if (currentMetrics.rod_load && currentMetrics.rod_load > 13800) {
      setScadaAlert({
        type: 'danger',
        title: 'ROD LOAD EXCEEDS SAFE MARGIN',
        desc: `Current polished rod load (${Math.round(currentMetrics.rod_load)} lbs) is approaching structural limit (14,000 lbs). Reduce SPM or steam rate to prevent rod rupture.`
      });
    } else if (inputs.steam_T > 305) {
      setScadaAlert({
        type: 'warning',
        title: 'HIGH THERMAL INJECTION WARNING',
        desc: `Boiler steam temperature (${inputs.steam_T}°C) is operating near metallurgical boundary. Monitor downhole tubular thermal expansion.`
      });
    } else {
      setScadaAlert(null);
    }
  }, [isAuthenticated, currentMetrics, inputs.steam_T]);

  // Handler for slider updates (Debounced to keep dragging butter smooth)
  const inputDebounceRef = useRef(null);
  const handleInputChange = (key, val) => {
    const parsedVal = parseFloat(val);
    
    // Snappily update localInputs immediately for smooth slider thumb movement
    setLocalInputs(prev => ({
      ...prev,
      [key]: parsedVal
    }));
    
    // Debounce the heavy physics calculations & parent state updates by 45ms
    if (inputDebounceRef.current) {
      clearTimeout(inputDebounceRef.current);
    }
    inputDebounceRef.current = setTimeout(() => {
      setInputs(prev => ({
        ...prev,
        [key]: parsedVal
      }));
      setLastChangedParam(key);
      setDataMode('synthetic'); // Shift to synthetic simulation automatically
    }, 45);
  };

  // Preset scenarios handler
  const applyPreset = (presetName) => {
    setDataMode('synthetic');
    let nextInputs = {};
    if (presetName === 'low') {
      nextInputs = {
        steam_T: 170,
        injection_pressure: 400,
        steam_rate: 15,
        injection_duration: 5,
        soak_duration: 3,
        SPM: 4.0,
        stroke_length: 80,
        valve_opening: 40,
        cycle_day: 12
      };
    } else if (presetName === 'optimal') {
      nextInputs = {
        steam_T: 240,
        injection_pressure: 850,
        steam_rate: 30,
        injection_duration: 12,
        soak_duration: 5,
        SPM: 7.5,
        stroke_length: 100,
        valve_opening: 100,
        cycle_day: 12
      };
    } else if (presetName === 'high') {
      nextInputs = {
        steam_T: 320,
        injection_pressure: 1200,
        steam_rate: 60,
        injection_duration: 20,
        soak_duration: 7,
        SPM: 11.0,
        stroke_length: 120,
        valve_opening: 100,
        cycle_day: 12
      };
    }
    setInputs(nextInputs);
    setLocalInputs(nextInputs);
    setLastChangedParam('steam_T');
    showToast(`Applied ${presetName} simulation preset.`);
  };

  // Reset all parameters
  const resetAll = () => {
    setInputs(BASELINE_INPUTS);
    setLocalInputs(BASELINE_INPUTS);
    setLastChangedParam(null);
    setDataMode('baseline');
    setTankViewMode('transparent');
    setSelectedAsset(null);
    setSubsurfaceWellFocus('none');
    setShowSubsurfaceHeatMap(true);
    setShowSubsurfaceOilFlow(true);
    setGroundTransparency(0.22);
    if (threeDWorkspaceRef.current && threeDWorkspaceRef.current.resetCamera) {
      threeDWorkspaceRef.current.resetCamera();
    }
    showToast('Restored baseline physics parameters.');
  };

  // Run NSGA-II Solver
  const runOptimization = () => {
    setOptimizationLoading(true);
    setOptimizationProgress(0);
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setOptimizationLoading(false);
          
          const front = generateParetoFront(selectedWell.id);
          const recommendedPoint = front[Math.round(front.length * 0.65)];
          setSelectedParetoPoint(recommendedPoint);
          
          showToast('NSGA-II solver completed. Knee-point setpoints calculated.');
          
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // Apply optimal Pareto setpoints
  const _applyParetoPoint = (point) => {
    if (!point) return;
    const nextInputs = {
      ...inputs,
      ...point.inputs
    };
    setInputs(nextInputs);
    setLocalInputs(nextInputs);
    setLastChangedParam('steam_T');
    setDataMode('synthetic');
    setActiveTab('sim');
  };

  // Save current sandbox state
  const saveCurrentScenario = () => {
    setSavedScenarios(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `Scenario #${prev.length + 1}`,
        inputs: { ...inputs },
        metrics: { ...currentMetrics }
      }
    ]);
    showToast('Saved current sandbox parameters.');
  };

  // Contextual page titles and descriptions
  const _getActivePageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'CSS & SRP Joint Optimization — Solution Summary';
      case 'twin': return 'Integrated 3D Well-to-Surface Digital Twin';
      case 'sim': return 'CSS & SRP Joint Simulation Sandbox';
      case 'optimization': return 'NSGA-II Joint Decision Optimization';
      case 'reservoir': return 'Subsurface Reservoir Heat Map';
      case 'surface': return 'Surface Production Facilities';
      case 'analytics': return 'Trends & Operational Analytics';
      case 'datasources': return 'Data Integrity, Provenance & Validation';
      default: return 'Baghewala Joint Optimization Twin';
    }
  };

  const _getActivePageSubtitle = () => {
    switch (activeTab) {
      case 'overview': return 'How this system solves the joint optimization problem statement for the Baghewala heavy oil field';
      case 'twin': return 'Click and inspect reservoir perforations, tubing, pumpjack, flowlines, separator, and storage tanks';
      case 'sim': return 'Adjust parameters, observe physics-style consequences, and see simulated operating warnings';
      case 'optimization': return 'Analyze multi-objective Pareto-front solutions & knee-point recommendations';
      case 'reservoir': return 'Underground geological layers, heavy oil warming zone, and dynamic steam boundary';
      case 'surface': return 'High-fidelity pumpjack, piping headers, three-phase separator, and storage tank fills';
      case 'analytics': return 'Historical baseline versus scenario values, trend lines, and SOR metrics';
      case 'datasources': return 'Separation of verified baselines, historical SCADA data, and synthetic model calibration status';
      default: return 'Oil India Limited — Rajasthan Heavy Oil EOR Asset';
    }
  };

  // Provenance badges mapping
  const getSourceBadge = () => {
    if (dataMode === 'baseline') {
      return (
        <span className="px-3.5 py-2.5 bg-amber-500/10 text-amber-400 border border-emerald-500/25 rounded-xl font-bold text-sm tracking-wide font-mono">
          VERIFIED BASELINE
        </span>
      );
    } else if (dataMode === 'historical') {
      return (
        <span className="px-3.5 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-xl font-bold text-sm tracking-wide font-mono">
          AUTHORIZED SCADA DATA
        </span>
      );
    } else {
      return (
        <span className="px-3.5 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded-xl font-bold text-sm tracking-wide font-mono">
          SYNTHETIC SIMULATION
        </span>
      );
    }
  };

  // Effect summary text
  const _getEffectSummary = () => {
    if (!lastChangedParam) {
      return "All variables are running on verified baseline values.";
    }
    switch (lastChangedParam) {
      case 'steam_T':
        return `Steam Temp set to ${inputs.steam_T}°C: Heavy crude viscosity reduced to ${currentMetrics.viscosity.toLocaleString()} cP, increasing oil mobility in the sandstone reservoir.`;
      case 'injection_pressure':
        return `Injection Pressure set to ${inputs.injection_pressure} psi: Annular steam velocity accelerated. Wellhead pressure adjusted to ${currentMetrics.Pwh} psi.`;
      case 'steam_rate':
        return `Steam Rate set to ${inputs.steam_rate} t/d: Thermal growth radius expanded to ${currentMetrics.heated_radius}m in the sandstone reservoir.`;
      case 'injection_duration':
        return `Duration set to ${inputs.injection_duration} days: Steam chamber has expanded, increasing overall reservoir recovery rate.`;
      case 'SPM':
        return `Pump Speed set to ${inputs.SPM} SPM: Plunger displacement rate adjusted, producing ${currentMetrics.q_oil} bbl/day. Peak rod load at ${currentMetrics.rod_load_pct}% of safe limit.`;
      case 'valve_opening':
        return `Valve set to ${inputs.valve_opening}%: Flow line throttled, wellhead pressure modified to ${currentMetrics.Pwh} psi.`;
      default:
        return "Operational setpoints modified, updating physical simulation models.";
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Operations Overview', icon: BookOpen, desc: 'Field status' },
    { id: 'twin', label: 'Digital Twin', icon: Cpu, desc: 'Interactive 3D View' },
    { id: 'sim', label: 'CSS Planning', icon: Sliders, desc: 'Steam parameters & controls' },
    { id: 'optimization', label: 'SRP Performance', icon: Target, desc: 'SRP diagnostics' },
    { id: 'reservoir', label: 'Reservoir Intelligence', icon: Layers, desc: 'Subsurface layers & geology' },
    { id: 'analytics', label: 'Production Analytics', icon: TrendingUp, desc: 'SCADA history & trends' },
    { id: 'surface', label: 'Scenario Optimization', icon: Settings, desc: 'Scenario simulations' },
    { id: 'maintenance', label: 'Equipment & Maintenance', icon: Wrench, desc: 'Equipment health registry' },
    { id: 'datasources', label: 'Data Governance', icon: Shield, desc: 'Governance & credentials' },
    { id: 'validation', label: 'Model Validation', icon: CheckCircle, desc: 'Core validation residuals' },
    { id: 'reports', label: 'Reports & Export', icon: FileText, desc: 'Export operational summaries' },
    { id: 'upgrade', label: 'Modernization Hub', icon: Compass, desc: 'OIL portal architecture & roadmap' }
  ];

    if (showIntro) {
      return (
        <CinematicIntroPage
          onEnter={() => setShowIntro(false)}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
          inputs={inputs}
          currentMetrics={currentMetrics}
          connectionState={connectionState}
        />
      );
    }

    if (!isAuthenticated) {
      return (
        <EngineerAdminLogin
          onLogin={handleLogin}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
          onLaunchIntro={() => setShowIntro(true)}
        />
      );
    }

    return (
      <div
        className={`h-screen w-full flex flex-col ${darkMode ? 'dark-theme bg-[#07080b] text-zinc-100' : 'light-theme bg-[#f4f6fb] text-slate-800'} dot-grid-bg overflow-hidden font-sans select-none transition-colors duration-300 relative app-is-live`}
      >
              {/* Big Cinematic Floating Ambient Orbs (Constrained within viewport) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-orb-cyan top-[-100px] left-[-100px]" />
        <div className="ambient-orb-amber top-[40%] right-[-120px]" />
        <div className="ambient-orb-purple bottom-[-80px] left-[25%]" />
      </div>
      
      {/* ── UNIFIED HORIZONTAL EXECUTIVE HEADER & TOP NAVIGATION ── */}
      <header className="header-stitch w-full z-40 flex-shrink-0 entrance-header">
        
        {/* Top Operational Bar */}
        <div className={`px-2.5 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-1.5 sm:gap-3 border-b ${darkMode ? 'border-zinc-900/80 bg-[#07080b]' : 'border-slate-200/80 bg-white'}`}>
          
          {/* Brand & Field Controls */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-shrink-0">
            <div className={`px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              darkMode 
                ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.35)] border-2 border-amber-400/80' 
                : 'bg-white shadow-[0_4px_14px_rgba(15,23,42,0.12)] border-2 border-amber-500/80'
            }`}>
              <img
                src="/oil-india-logo.png"
                alt="Oil India Limited Official Logo"
                className="h-8 sm:h-11 w-auto object-contain flex-shrink-0 drop-shadow-sm"
              />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-xs sm:text-base md:text-lg font-black font-display tracking-wider sm:tracking-widest text-white dark:text-white light:text-slate-950 uppercase leading-none whitespace-nowrap">
                OIL INDIA LIMITED
              </h1>
              <span className="text-[9px] sm:text-xs font-black font-mono tracking-tight sm:tracking-wider mt-0.5 sm:mt-1 block text-amber-400 dark:text-amber-400 light:text-amber-800 leading-none whitespace-nowrap">
                <span className="hidden sm:inline">BAGHEWALA PLATFORM • </span>CSS–SRP DIGITAL TWIN
              </span>
            </div>

            {/* Drilling Well Target - Visible on all devices */}
            <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 h-7 sm:h-8 rounded-lg sm:rounded-xl border shrink-0 ${
              darkMode ? 'bg-zinc-950/80 border-zinc-800/80 text-zinc-300' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              <span className={`text-[10px] sm:text-xs font-tactical font-bold uppercase ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                <span className="hidden sm:inline">Well:</span>
                <span className="sm:hidden">W:</span>
              </span>
              <select 
                value={selectedWell.id}
                onChange={(e) => {
                  const well = INITIAL_WELLS.find(w => w.id === e.target.value);
                  setSelectedWell(well);
                }}
                className={`bg-transparent text-[10px] sm:text-xs font-mono font-bold outline-none cursor-pointer ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {INITIAL_WELLS.map(well => (
                  <option key={well.id} value={well.id} className={darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-slate-900'}>
                    {well.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Operational Mode Toggle */}
            <div className="hidden lg:flex items-center bg-zinc-950/80 p-0.5 h-8 rounded-xl border border-zinc-800/80">
              <button
                onClick={() => {
                  setIllustrativeMode(false);
                  setDataMode('baseline');
                  setInputs(BASELINE_INPUTS);
                  setLocalInputs(BASELINE_INPUTS);
                }}
                className={`px-2.5 h-7 text-xs font-tactical font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  !illustrativeMode 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${!illustrativeMode ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-zinc-600'}`} />
                Field
              </button>
              <button
                onClick={() => {
                  setIllustrativeMode(true);
                  setDataMode('synthetic');
                }}
                className={`px-2.5 h-7 text-xs font-tactical font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  illustrativeMode 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${illustrativeMode ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-zinc-600'}`} />
                Sandbox
              </button>
            </div>
          </div>

          {/* Quick Tactical Controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            
            {/* Live SCADA Telemetry Toggle */}
            <button
              onClick={() => {
                const next = !liveScada;
                setLiveScada(next);
                playHoloSound('tab');
                showToast(next ? 'Live SCADA telemetry stream active.' : 'Switched to static baseline telemetry.');
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-7 sm:h-8 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono font-bold border transition-all cursor-pointer ${
                liveScada
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title={liveScada ? 'Pause simulated sensor stream' : 'Stream real-time SCADA telemetry'}
            >
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${liveScada ? 'bg-amber-400 beacon-pulse' : 'bg-zinc-600'}`} />
              <span className="hidden sm:inline">{liveScada ? 'STREAM LIVE' : 'SCADA STATIC'}</span>
              <span className="sm:hidden">{liveScada ? 'LIVE' : 'STATIC'}</span>
              <span className="hidden xl:inline text-zinc-700">|</span>
              <span className="hidden xl:inline text-amber-400"><Clock /></span>
            </button>

            {/* Reset Button */}
            <button
              onClick={resetAll}
              className={`hidden md:flex items-center gap-1 px-2.5 h-8 rounded-xl text-xs font-tactical font-bold uppercase transition-all cursor-pointer border ${
                darkMode
                  ? 'bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Reset simulation parameters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Cinematic Intro Page launcher */}
            <button 
              onClick={() => setShowIntro(true)}
              className={`hidden lg:flex items-center px-2.5 h-8 border rounded-xl text-xs font-tactical font-bold uppercase transition-all cursor-pointer shadow-sm ${
                darkMode
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
              }`}
              title="View Cinematic Intro Animation"
            >
              Intro
            </button>

            {/* Install App Button */}
            {!isAppInstalled && (
              <button
                onClick={handleInstallApp}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 h-7 sm:h-8 border rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-tactical font-bold uppercase transition-all cursor-pointer shadow-sm ${
                  darkMode
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-400 shadow-sm'
                }`}
                title="Install Oil India Limited Digital Twin as an App"
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border transition-colors cursor-pointer flex items-center justify-center flex-shrink-0 ${
                darkMode
                  ? 'border-zinc-800 hover:bg-zinc-800 text-amber-400 hover:text-amber-300'
                  : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-amber-700'
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>

            {/* Settings Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSettingsMenu(s => !s)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border transition-all cursor-pointer flex items-center justify-center flex-shrink-0 ${
                  darkMode
                    ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
                }`}
                title="System Preferences & 3D Quality"
              >
                <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              {showSettingsMenu && (
                <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-4 shadow-2xl z-50 text-xs font-sans border ${
                  darkMode ? 'bg-zinc-900/98 border-zinc-800 text-zinc-300' : 'bg-white/98 border-slate-300 text-slate-800 shadow-2xl'
                }`}>
                  <div className={`border-b pb-2 mb-3 flex items-center justify-between ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                    <span className={`font-bold text-xs uppercase tracking-wider block font-sans ${darkMode ? 'text-zinc-200' : 'text-slate-900'}`}>System Preferences</span>
                    <button onClick={() => setShowSettingsMenu(false)} className="text-zinc-400 hover:text-white cursor-pointer text-sm">✕</button>
                  </div>
                  <div className="space-y-3">
                    <div className={`flex flex-col gap-1.5`}>
                      <span className="text-xs font-mono font-bold uppercase text-amber-400">3D Graphics Fidelity</span>
                      <select
                        value={graphicsQuality}
                        onChange={(e) => {
                          setGraphicsQuality(e.target.value);
                          showToast(`Graphics profile: ${e.target.value}`);
                          playHoloSound('tab');
                        }}
                        className={`w-full text-xs rounded-xl p-2.5 font-mono outline-none border cursor-pointer font-bold ${
                          darkMode ? 'bg-zinc-950 text-zinc-200 border-zinc-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                        }`}
                      >
                        <option value="Low">Low (High FPS, shadows off)</option>
                        <option value="Medium">Medium (Balanced 60 FPS)</option>
                        <option value="High">High (Ultra Fidelity)</option>
                      </select>
                    </div>
                    <div className={`flex flex-col gap-1.5 pt-2 border-t ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <span className={`text-xs font-mono font-bold uppercase ${darkMode ? 'text-zinc-200' : 'text-slate-600'}`}>SCADA Sync Rate</span>
                      <select
                        className={`w-full text-xs rounded-xl p-2.5 font-mono outline-none border cursor-pointer font-bold ${
                          darkMode ? 'bg-zinc-950 text-zinc-200 border-zinc-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                        }`}
                        defaultValue="10s"
                      >
                        <option value="5s">5s (Real-time)</option>
                        <option value="10s">10s (Buffered)</option>
                        <option value="30s">30s (Eco-mode)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Engineer Identity & Clearance Profile Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowUserMenu(u => !u)}
                className={`flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2.5 h-7 sm:h-8 rounded-lg sm:rounded-xl border transition-all cursor-pointer ${
                  darkMode 
                    ? 'bg-zinc-900/90 border-amber-500/30 hover:border-amber-500/60 text-zinc-100 hover:bg-zinc-800/80' 
                    : 'bg-white border-amber-500/40 hover:border-amber-500/80 text-slate-800 hover:bg-amber-50/50 shadow-sm'
                }`}
                title={`Clearance: ${currentUser?.clearance || 'LVL-4'} • ${currentUser?.name}`}
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-black text-[10px] sm:text-[11px] flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.4)] flex-shrink-0">
                    {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'EN'}
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-none">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-mono tracking-tight">{currentUser?.name || 'Engineer'}</span>
                      <span className="text-[9px] font-mono font-black px-1 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded">
                        {currentUser?.clearance?.split(' ')[0] || 'LVL-4'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-400 light:text-slate-500 font-mono">
                      {currentUser?.badgeId || 'OIL-ENG-9042'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
                </button>

                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl p-4 shadow-2xl z-50 text-xs font-sans border backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
                    darkMode ? 'bg-zinc-900/98 border-amber-500/30 text-zinc-300 shadow-[0_15px_35px_rgba(0,0,0,0.8)]' : 'bg-white/98 border-slate-300 text-slate-800 shadow-2xl'
                  }`}>
                    {/* User Header */}
                    <div className={`border-b pb-3 mb-3 flex items-start gap-3 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-black text-sm flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] flex-shrink-0">
                        {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'EN'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-white dark:text-white light:text-slate-900 truncate">{currentUser?.name}</span>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                            ● ACTIVE
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-400 font-medium block truncate">{currentUser?.roleTitle || currentUser?.role}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">ID: {currentUser?.badgeId} • Dept: {currentUser?.dept || 'Reservoir Ops'}</span>
                      </div>
                    </div>

                    {/* Clearance Level */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 dark:bg-black/40 border border-zinc-800/80 text-xs font-mono">
                        <span className="text-zinc-400">Security Clearance:</span>
                        <span className="text-amber-400 font-bold">{currentUser?.clearance || 'LVL-4 SECRET'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 dark:bg-black/40 border border-zinc-800/80 text-xs font-mono">
                        <span className="text-zinc-400">Station / Asset:</span>
                        <span className="text-amber-400 font-bold">{selectedWell.name} (EOR Rig 14)</span>
                      </div>
                    </div>

                    {/* Quick Role Switcher */}
                    <div className={`pt-2 border-t space-y-1.5 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Switch Persona / Role:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {ENTERPRISE_PERSONAS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setCurrentUser(p);
                              setUserRole(p.role);
                              setShowUserMenu(false);
                              addAuditLog(`Switched active operator persona to ${p.name} (${p.role})`, p.role);
                              playHoloSound('tab');
                              showToast(`Switched profile: ${p.name}`);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-mono truncate border transition-all cursor-pointer ${
                              currentUser?.id === p.id 
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold' 
                                : 'bg-zinc-950/40 hover:bg-zinc-800/60 border-zinc-800/80 text-zinc-400 hover:text-white'
                            }`}
                            title={p.name}
                          >
                            {p.role}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={`pt-3 mt-3 border-t flex flex-col gap-2 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setIsAuthenticated(false);
                          playHoloSound('click');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Switch User Login Gate
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-zinc-200 border border-amber-500/30 text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out & Terminate Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

        </div>

        {/* Horizontal Navigation Tabs Strip */}
        <div className="relative w-full overflow-hidden">
          {/* Subtle gradient cues indicating scrollability on mobile */}
          <div className={`absolute left-0 top-0 bottom-0 w-4 z-10 pointer-events-none bg-gradient-to-r ${darkMode ? 'from-[#090b10] to-transparent' : 'from-slate-100 to-transparent'}`} />
          <div className={`absolute right-0 top-0 bottom-0 w-4 z-10 pointer-events-none bg-gradient-to-l ${darkMode ? 'from-[#090b10] to-transparent' : 'from-slate-100 to-transparent'}`} />
          
          <nav className={`w-full px-2 sm:px-4 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth ${darkMode ? 'bg-[#090b10]/95' : 'bg-slate-100/90 border-t border-slate-200/60'}`}>
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedAsset(null);
                  }}
                  className={`tab-btn-stitch flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4.5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-bold whitespace-nowrap cursor-pointer rounded-t-lg shrink-0 entrance-tab stagger-d${Math.min(idx, 12)} ${isActive ? 'active' : 'text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-zinc-200 hover:bg-white/[0.03]'}`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'text-zinc-300 dark:text-zinc-300 light:text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>


      {/* Industrial SCADA Safety Alarm Notification Banner */}
      {scadaAlert && (
        <div className={`w-full px-6 py-2 z-30 flex items-center justify-between text-xs font-mono font-bold border-b transition-all ${
          scadaAlert.type === 'danger'
            ? 'bg-zinc-950/90 border-amber-500/80 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse'
            : 'bg-amber-950/90 border-amber-500/80 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
        }`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${'text-amber-400 animate-pulse'}`} />
            <span className="uppercase tracking-wider font-black whitespace-nowrap">{scadaAlert.title}:</span>
            <span className="font-sans font-normal text-white truncate">{scadaAlert.desc}</span>
          </div>
          <button
            onClick={() => {
              setScadaAlert(null);
              playHoloSound('click');
            }}
            className="px-3 py-1 rounded-lg bg-black/50 hover:bg-black/80 border border-white/20 text-zinc-200 text-[11px] cursor-pointer whitespace-nowrap ml-4 transition-colors"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Live SCADA Telemetry Streaming Ticker Bar */}
      <div className={`w-full border-b text-xs font-medium font-mono py-1 overflow-hidden z-20 flex items-center shadow-inner ${
        darkMode ? 'bg-[#090b10]/95 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 px-3 border-r border-zinc-700 flex-shrink-0 z-10 bg-inherit">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold tracking-wider text-amber-400 uppercase">LIVE STREAM</span>
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div className="scada-ticker-track flex items-center gap-8 px-4">
            <span className="flex items-center gap-1.5"><b className="text-amber-400">BGW-014</b> STATUS: <span className="text-amber-400 font-bold">OPTIMAL</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">INJ PRESSURE:</b> <span className="text-amber-400 font-bold">{inputs.injection_pressure} PSI</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">STEAM TEMP:</b> <span className="text-amber-400 font-bold">{inputs.steam_T}°C</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">OIL RATE:</b> <span className="text-amber-400 font-bold">{currentMetrics.q_oil} BPD</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">SOR EFFICIENCY:</b> <span className="text-white font-bold">{currentMetrics.SOR}</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">V-101 SEPARATOR:</b> <span className="text-amber-400 font-bold">98.2% SEP EFF</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">TANK FARM T-101:</b> <span className="text-white font-bold">78.4% CAPACITY</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">PUMP SPEED:</b> <span className="text-amber-400 font-bold">{inputs.SPM} SPM</span></span>
            <span className="text-zinc-600 font-bold">• • •</span>
            <span className="flex items-center gap-1.5"><b className="text-amber-400">BGW-014</b> STATUS: <span className="text-amber-400 font-bold">OPTIMAL</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">INJ PRESSURE:</b> <span className="text-amber-400 font-bold">{inputs.injection_pressure} PSI</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">STEAM TEMP:</b> <span className="text-amber-400 font-bold">{inputs.steam_T}°C</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">OIL RATE:</b> <span className="text-amber-400 font-bold">{currentMetrics.q_oil} BPD</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">SOR EFFICIENCY:</b> <span className="text-white font-bold">{currentMetrics.SOR}</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">V-101 SEPARATOR:</b> <span className="text-amber-400 font-bold">98.2% SEP EFF</span></span>
            <span className="flex items-center gap-1.5"><b className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">TANK FARM T-101:</b> <span className="text-white font-bold">78.4% CAPACITY</span></span>
          </div>
        </div>
      </div>


      {/* MAIN VIEWPORT LAYOUT CONTAINER (100% FULL WIDTH) */}
      <main 
        className={`w-full flex-1 overflow-y-auto pb-24 overflow-x-hidden ${darkMode ? 'text-zinc-100' : 'text-slate-800'} px-6 pt-4 flex flex-col min-w-0 relative`}
        style={{ willChange: 'scroll-position', contain: 'content', overscrollBehaviorY: 'contain', transform: 'translateZ(0)' }}
      >
        <TwinErrorBoundary title="OPERATIONAL TAB GATEWAY">
        {activeTab === 'maintenance' && (
          <div className="space-y-6 page-transition-wrap">
            {/* ── 1. Header & Role Permissions Deck ── */}
            <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 slide-edge-top">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2.5">
                  <Shield className="w-6 h-6 text-amber-400" />
                  Equipment Health & Maintenance Operations
                </h2>
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono font-medium">
                  FIELD OPERATIONS MANAGEMENT SYSTEM • WELL: BGW-014 (BAGHEWALA)
                </span>
              </div>
              
              {/* Role Picker */}
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-zinc-900/80 p-2.5 rounded-2xl border border-slate-200 dark:border-white/10">
                <span className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-mono font-bold uppercase">Active Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => {
                    setUserRole(e.target.value);
                    addAuditLog(`Active session user role updated to ${e.target.value}`, e.target.value);
                    showToast(`Permissions updated to ${e.target.value} level.`);
                  }}
                  className="bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm font-mono font-bold rounded-xl px-3 py-1.5 border border-slate-300 dark:border-white/10 outline-none cursor-pointer"
                >
                  <option value="Operator">Operator</option>
                  <option value="Engineer">Reservoir Engineer</option>
                  <option value="Manager">Field Manager</option>
                  <option value="Administrator">System Administrator</option>
                </select>
              </div>
            </div>

            {/* ── 2. Top Equipment Health KPI Ribbon ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 flex flex-col justify-between hover-holo-lift slide-edge-bottom stagger-1">
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono uppercase font-bold tracking-wider">Stuffing Box Seal</span>
                <strong className="text-3xl sm:text-4xl text-white font-mono font-bold my-1">94%</strong>
                <span className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-medium">Normal packing wear • Sealed</span>
              </div>
              <div className="glass-panel p-5 flex flex-col justify-between hover-holo-lift slide-edge-bottom stagger-2">
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono uppercase font-bold tracking-wider">Burner Flame Wall</span>
                <strong className="text-3xl sm:text-4xl text-amber-400 font-mono font-bold my-1">89%</strong>
                <span className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-medium">Scheduled cleaning due in 22d</span>
              </div>
              <div className="glass-panel p-5 flex flex-col justify-between hover-holo-lift slide-edge-bottom stagger-3">
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono uppercase font-bold tracking-wider">Polished Rod Stress</span>
                <strong className={`text-3xl sm:text-4xl font-mono font-bold my-1 ${currentMetrics.rod_load_pct > 85 ? 'text-amber-400' : 'text-white'}`}>
                  {currentMetrics.rod_load_pct}%
                </strong>
                <span className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-medium">of 14,000 lbs safe tensile limit</span>
              </div>
              <div className="glass-panel p-5 flex flex-col justify-between hover-holo-lift slide-edge-bottom stagger-4">
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono uppercase font-bold tracking-wider">Vibration Index</span>
                <strong className="text-3xl sm:text-4xl text-white font-mono font-bold my-1">0.45 <span className="text-lg text-zinc-400 font-normal">mm/s</span></strong>
                <span className="text-sm text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-medium">Compliant with ISO-10816 class</span>
              </div>
            </div>

            {/* ── 3. Wellhead Sensors & RTU Diagnostics (7 : 5 Grid) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 Columns: Wellhead & Flowline Telemetry */}
              <div className="lg:col-span-7 glass-panel p-5 space-y-5 slide-edge-left stagger-2">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-3">
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    Wellhead & Flowline Live Sensor Telemetry
                  </h3>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    ● RTU STREAMING
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                  {/* Pressure Transmitters */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="text-amber-500 font-bold block uppercase text-xs tracking-wider">Pressure Transmitters</span>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Wellhead (Pwh):</span>
                      <strong className="text-white text-base font-bold">{currentMetrics.Pwh} psi</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Casing (Pc):</span>
                      <strong className="text-white text-base font-bold">185 psi</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Tubing (Pt):</span>
                      <strong className="text-white text-base font-bold">210 psi</strong>
                    </div>
                  </div>

                  {/* Thermal Transmitters */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                    <span className="text-amber-400 font-bold block uppercase text-xs tracking-wider">Thermal Transmitters</span>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Steam Line (T_steam):</span>
                      <strong className="text-amber-400 text-base font-bold">{inputs.steam_T} °C</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Reservoir (Tres):</span>
                      <strong className="text-amber-400 text-base font-bold">{currentMetrics.Tres} °C</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Flowline (T_fl):</span>
                      <strong className="text-white text-base font-bold">58 °C</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Sensor Signal Quality */}
              <div className="lg:col-span-5 glass-panel p-5 flex flex-col justify-between space-y-4 slide-edge-right stagger-2">
                <div>
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-400" />
                    SCADA Signal & Data Quality
                  </h3>
                  
                  <div className="space-y-3 text-sm font-mono mt-4">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">RTU Telemetry Quality:</span>
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">98.8% (Optimal)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Packet Drop Rate:</span>
                      <span className="text-white font-bold">0.00%</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-zinc-800 pb-2">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Motor Current:</span>
                      <span className={`text-base font-bold ${currentMetrics.motor_current > 25 ? 'text-amber-400' : 'text-white'}`}>
                        {currentMetrics.motor_current} A
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-medium">Fault Diagnostics:</span>
                      <span className="text-amber-400 font-bold">No Alarms Active</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-zinc-900/70 border border-amber-300/40 dark:border-white/10">
                  <span className="text-xs text-amber-500 font-bold font-mono block uppercase">Data Acquisition Status</span>
                  <p className="text-xs font-medium text-slate-800 dark:text-zinc-300 mt-1 leading-relaxed font-sans">
                    Real-time field synchronization via Modbus TCP. Baseline physical constraints validated.
                  </p>
                </div>
              </div>
            </div>

            {/* ── 4. Operational Logs & Spares Inventory (7 : 5 Grid) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 Columns: Operational Maintenance Log & Audit Trail */}
              <div className="lg:col-span-7 space-y-6 slide-edge-left stagger-3">
                
                {/* Maintenance Log Table */}
                <div className="glass-panel p-5 space-y-4">
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-400" />
                    Operational Maintenance History Log
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold uppercase text-zinc-400">
                          <th className="py-2.5 px-2">Date</th>
                          <th className="py-2.5 px-2">Component</th>
                          <th className="py-2.5 px-2">Action Performed</th>
                          <th className="py-2.5 px-2 text-right">Operator</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-sm font-medium">
                        <tr className="hover-scanline-row">
                          <td className="py-3 px-2 font-mono text-zinc-400 text-xs">2026-08-20</td>
                          <td className="py-3 px-2 text-white font-bold">BGW-014 Wellhead</td>
                          <td className="py-3 px-2 text-zinc-300">Stuffing box packing torque verified. 0 leaks detected.</td>
                          <td className="py-3 px-2 text-right"><span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-xs font-bold">Op-398</span></td>
                        </tr>
                        <tr className="hover-scanline-row">
                          <td className="py-3 px-2 font-mono text-zinc-400 text-xs">2026-08-12</td>
                          <td className="py-3 px-2 text-white font-bold">Separation Tank T-102</td>
                          <td className="py-3 px-2 text-zinc-300">Radar level transmitters zeroed and calibrated.</td>
                          <td className="py-3 px-2 text-right"><span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-xs font-bold">Op-102</span></td>
                        </tr>
                        <tr className="hover-scanline-row">
                          <td className="py-3 px-2 font-mono text-zinc-400 text-xs">2026-08-05</td>
                          <td className="py-3 px-2 text-white font-bold">Separator V-012</td>
                          <td className="py-3 px-2 text-zinc-300">Differential pressure level transmitter inspected.</td>
                          <td className="py-3 px-2 text-right"><span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono text-xs font-bold">Op-112</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="glass-panel p-5 space-y-4">
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Role-Based Access & Audit Trail
                  </h3>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 font-mono text-sm">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 flex justify-between items-center gap-3">
                        <div>
                          <span className="text-xs text-amber-500 font-bold block">{log.timestamp}</span>
                          <span className="text-sm font-sans font-medium text-slate-800 dark:text-zinc-200 mt-0.5 block">{log.event}</span>
                        </div>
                        <span className="text-xs font-bold bg-zinc-800 text-zinc-200 px-2.5 py-1 rounded-lg border border-white/10 flex-shrink-0">
                          {log.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Equipment Asset Specs & Spares Inventory */}
              <div className="lg:col-span-5 space-y-6 slide-edge-right stagger-3">
                
                {/* Equipment Asset Specifications */}
                <div className="glass-panel p-5 space-y-4">
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    Equipment Asset Reference
                  </h3>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10 space-y-2.5 text-sm font-mono">
                    <div className="flex justify-between border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400">Asset Tag:</span>
                      <strong className="text-white">OIL-BGW-014</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400">Pumping Unit:</span>
                      <strong className="text-white">API C-228D-200-86</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-zinc-800 pb-1.5">
                      <span className="text-zinc-400">Wellhead Class:</span>
                      <strong className="text-white">3,000 PSI Thermal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Last Overhaul:</span>
                      <strong className="text-white">2026-06-15</strong>
                    </div>
                  </div>
                </div>

                {/* Live Wellhead & Subsurface Diagnostics */}
                <div className="glass-panel p-5 space-y-4">
                  <h3 className="text-base font-bold font-heading text-white uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    SCADA Telemetry Status
                  </h3>

                  <div className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium">RTU Modbus Channel</span>
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">Online (12ms)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium">Wellhead Flow Regime</span>
                      <span className="text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">Continuous Lift</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/10">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-700 font-medium">Vibration Health Index</span>
                      <span className="text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">0.04 mm/s (Normal)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Footer */}
            <footer className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-400 font-sans gap-2 w-full">
              <div>
                <span>© 2026 Oil India Limited. Baghewala CSS–SRP Operations Control.</span>
              </div>
              <div className="flex gap-4 font-mono text-xs font-medium uppercase">
                <span>Platform: v2.4.0-production</span>
                <span>•</span>
                <span>Role: {userRole}</span>
                <span>•</span>
                <span>SCADA State: Connected</span>
              </div>
            </footer>
          </div>
        )}

        {activeTab === 'validation' && (
          <div className="space-y-6 page-transition-wrap">
            {/* Header */}
            <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 slide-edge-top">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white uppercase tracking-wide flex items-center gap-2.5">
                  <Cpu className="w-6 h-6 text-amber-400" />
                  Model Validation & Physics-ML Hybrid Residuals
                </h2>
                <span className="text-sm text-zinc-300 dark:text-zinc-400 light:text-slate-600 font-mono font-medium">
                  BOBERG-LANTZ THERMODYNAMIC SOLVER COUPLED WITH RESIDUAL LSTM PROXY
                </span>
              </div>
              <div className="text-sm text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-bold uppercase bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Proxy Engine: <span className="text-amber-400">Boberg-Lantz Calibrated</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 flex flex-col justify-between min-h-[110px] slide-edge-bottom stagger-1">
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono uppercase font-bold">Physics Model Accuracy</span>
                <strong className="text-3xl sm:text-4xl text-white font-mono font-bold my-1">91.4%</strong>
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 mt-1">Boberg-Lantz core solver</span>
              </div>
              <div className="glass-panel p-4 flex flex-col justify-between min-h-[110px] slide-edge-bottom stagger-2">
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono uppercase font-bold">ML Residual Lift</span>
                <strong className="text-3xl sm:text-4xl text-amber-400 font-mono font-bold my-1">+7.2%</strong>
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 mt-1">LSTM correction active</span>
              </div>
              <div className="glass-panel p-4 flex flex-col justify-between min-h-[110px] slide-edge-bottom stagger-3">
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono uppercase font-bold">Cross-Validation Score</span>
                <strong className="text-3xl sm:text-4xl text-white font-mono font-bold my-1">RMSE 4.8 bbl/d</strong>
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 mt-1">Tested on holdout wells</span>
              </div>
              <div className="glass-panel p-4 flex flex-col justify-between min-h-[110px] slide-edge-bottom stagger-4">
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono uppercase font-bold">Model Version</span>
                <strong className="text-2xl text-amber-400 font-mono mt-1">v1.2.0-GBRT</strong>
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 mt-1">Last calibrated 2026-08-20</span>
              </div>
            </div>

            {/* Left/Right Main columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 glass-panel p-5 space-y-4 slide-edge-left stagger-2">
                <h3 className="text-xs font-bold text-white font-sans uppercase border-b border-zinc-900/30 pb-2">Physics-ML Residual Calibration</h3>
                <p className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-body leading-relaxed">
                  The hybrid ML layer operates strictly as a residual correction filter over the analytical Boberg-Lantz core physics engine. It utilizes Gradient Boosted Regression Trees trained on authorized Jodhpur sandstone historical logs to correct thermal boundary condition approximations.
                </p>
                <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4 border-0 rounded-xl space-y-3 font-mono text-xs text-zinc-300">
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-bold uppercase">TRAINING PERIOD:</span>
                    <span>2026-01-01 to 2026-08-01 (1,200 data points)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-bold uppercase">FEATURES:</span>
                    <span>steam_T, steam_rate, soak_days, SPM, stroke, viscosity</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-bold uppercase">MODEL DRIFT LEVEL:</span>
                    <span className="text-amber-400 font-bold">0.02% (Negligible)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-bold uppercase">ML LAYER CONFIDENCE:</span>
                    <span className="text-amber-400 font-bold">92%</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-sans">
                  <strong>PHYSICS FALLBACK PROTOCOL:</strong> If ML prediction confidence falls below 75% or SCADA data quality drops, the platform automatically deactivates residual corrections and reverts strictly to the Boberg-Lantz analytical core.
                </div>
              </div>

              <div className="lg:col-span-4 glass-panel p-5 flex flex-col gap-3 justify-between slide-edge-right stagger-2">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono uppercase border-b border-zinc-900/30 pb-2">Calibration References</h3>
                  <div className="space-y-2 text-xs font-mono mt-3">
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Analytical Core:</span>
                      <span className="text-white">Boberg-Lantz approximation</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-1">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Offline simulator:</span>
                      <span className="text-white">Computer Modeling Group (CMG) STARS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Calibrated well:</span>
                      <span className="text-white font-bold">BGW-014 baseline records</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 border-0 rounded-xl text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 leading-normal font-sans">
                  Model calibration offsets are updated weekly by reservoir engineering. Recommendations require verified field calibration before application.
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 pt-4 border-t border-zinc-900/50 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-sans gap-2 w-full">
              <div>
                <span>© 2026 Oil India Limited. Baghewala CSS–SRP Operations Control.</span>
              </div>
              <div className="flex gap-4 font-mono text-xs font-medium uppercase">
                <span>Platform: v2.4.0-production</span>
                <span>•</span>
                <span>Role: {userRole}</span>
                <span>•</span>
                <span>SCADA State: Connected</span>
              </div>
            </footer>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 page-transition-wrap">
            {/* Header */}
            <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 slide-edge-top">
              <div>
                <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">Reports & Data Export Console</h3>
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">ENGINEERING DATA EXTRACTION GATEWAY</span>
              </div>
              
              {/* Connection Mode Toggle buttons (interactive SCADA test control) */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900/50 p-1.5 rounded-xl ">
                <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-bold uppercase px-1.5">SCADA Sim state:</span>
                <div className="flex gap-1">
                  {['normal', 'error', 'empty'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        setConnectionState(st);
                        addAuditLog(`SCADA telemetry connection state simulated: ${st.toUpperCase()}`);
                        showToast(`Simulated connection mode set to ${st.toUpperCase()}`);
                      }}
                      className={`px-2.5 py-1 text-xs rounded font-mono font-bold uppercase transition-all cursor-pointer ${
                        connectionState === st 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-zinc-900 text-zinc-300 dark:text-zinc-300 light:text-slate-600 hover:bg-zinc-850 hover:text-zinc-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* If Connection is Simulated Error */}
            {connectionState === 'error' && (
              <div className="p-8 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex flex-col items-center text-center gap-4 py-16 slide-edge-bottom">
                <AlertTriangle className="w-12 h-12 text-amber-450 animate-pulse" />
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-amber-450 uppercase font-mono">SCADA API CONNECTION TIME-OUT (CODE 504)</h4>
                  <p className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-sans max-w-lg leading-relaxed">
                    The platform EOR data synchronization stream has timed out. Mutual TLS authentication re-attempts in progress. Operational configurations are locked during read-only fallback mode.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setConnectionState('normal')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold font-mono text-xs rounded-xl cursor-pointer transition-all shadow-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry SCADA Connection</span>
                  </button>
                </div>
              </div>
            )}

            {/* If Connection is Simulated Empty */}
            {connectionState === 'empty' && (
              <div className="p-8 glass-panel rounded-2xl flex flex-col items-center text-center gap-4 py-16 slide-edge-bottom">
                <Database className="w-12 h-12 text-zinc-600" />
                <div className="space-y-1.5">
                  <h4 className="text-sm font-tactical font-bold text-white uppercase tracking-wider font-mono">NO OPERATIONAL DATA AVAILABLE</h4>
                  <p className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-sans max-w-lg leading-relaxed">
                    No active telemetry grids or calibration sequences were detected for the selected well partition (BGW-014). To generate simulation templates, please return to CSS parameters.
                  </p>
                </div>
                <button 
                  onClick={() => setConnectionState('normal')}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 font-mono rounded-xl border border-zinc-700 cursor-pointer transition-all"
                >
                  Reload Standard Baseline
                </button>
              </div>
            )}

            {/* Normal State reports overview */}
            {connectionState === 'normal' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Reports lists (lg:col-span-8) */}
                <div className="lg:col-span-8 glass-panel p-5 space-y-4 slide-edge-left stagger-2">
                  {/* Official Executive Dossier PDF Generation Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900/80 to-zinc-900/80 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-zinc-950 uppercase">
                          Official OIL Publication
                        </span>
                        <span className="text-xs font-mono text-zinc-400">DOC REF: OIL/RAJ/EOR-CSS/2026/DOC-0481-EXT</span>
                      </div>
                      <h4 className="text-base font-bold text-white uppercase font-sans">
                        One-Click Official OIL Operational Dossier & PDF Telemetry
                      </h4>
                      <p className="text-xs text-zinc-300 font-sans max-w-2xl leading-relaxed">
                        Generates a formal, multi-page executive operational dossier featuring official Oil India Limited crest headers, real-time SCADA surface & downhole dynamometer cards, Arrhenius reservoir viscosity decay curves, machinery MTBM health meters, and authorized engineering sign-off blocks.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowExecutiveDossier(true)}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-sans font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-amber-500/25 flex-shrink-0 cursor-pointer"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>Generate Official Dossier (PDF)</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white font-sans uppercase border-b border-zinc-900/30 pb-2">Available Engineering Datasets</h3>
                    <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono">SELECT DATASET TO RUN REST COMPLIANT CSV DOWNLOAD</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4 border-0 rounded-xl flex flex-col justify-between gap-4">
                      <div>
                        <strong className="text-white font-sans text-xs uppercase block">EOR Optimization CSV</strong>
                        <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono block mt-1">Joint settings summary of production & cost recommendations</span>
                      </div>
                      <button
                        onClick={() => {
                          const csvContent = [
                            ["Parameter", "Optimal setpoint", "Unit"],
                            ["Target Well", "BGW-014", ""],
                            ["Steam Temperature", "235", "°C"],
                            ["SRP Pumping Speed", "8.2", "SPM"],
                            ["Stroke Length", "100", "inches"],
                            ["Expected oil yield", "183", "bbl/d"]
                          ].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `OIL_BGW014_EOR_Optimization_${new Date().toISOString().split('T')[0]}.csv`;
                          link.click();
                          addAuditLog("CSV EOR Optimization Summary exported");
                          showToast('EOR Optimization CSV exported.');
                        }}
                        className="w-full stitch-btn-primary text-zinc-950 font-bold py-2 rounded-lg text-xs cursor-pointer min-h-[38px] border border-amber-500/30"
                      >
                        Export Summary (.CSV)
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4 border-0 rounded-xl flex flex-col justify-between gap-4">
                      <div>
                        <strong className="text-white font-sans text-xs uppercase block">SCADA Telemetry CSV</strong>
                        <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono block mt-1">Simulated history log of operating sensor values</span>
                      </div>
                      <button
                        onClick={() => {
                          const csvContent = [
                            ["Timestamp", "PPRL (lbs)", "Motor Current (A)", "Efficiency (%)"],
                            ["2026-08-27 20:00:00", "11850", "28.5", "88"],
                            ["2026-08-27 19:00:00", "11840", "28.3", "88"],
                            ["2026-08-27 18:00:00", "11860", "28.6", "87"]
                          ].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `OIL_BGW014_SCADA_Telemetry_${new Date().toISOString().split('T')[0]}.csv`;
                          link.click();
                          addAuditLog("CSV SCADA Telemetry exported");
                          showToast('SCADA Telemetry CSV exported.');
                        }}
                        className="w-full stitch-btn-primary text-zinc-950 font-bold py-2 rounded-lg text-xs cursor-pointer min-h-[38px] border border-amber-500/30"
                      >
                        Export Telemetry (.CSV) <span className="btn-arrow">→</span>
                      </button>
                    </div>

                    <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4 border-0 rounded-xl flex flex-col justify-between gap-4">
                      <div>
                        <strong className="text-white font-sans text-xs uppercase block">Reservoir Grid CSV</strong>
                        <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono block mt-1">Thermodynamic mapping nodes in sandstone layer</span>
                      </div>
                      <button
                        onClick={() => {
                          const csvContent = [
                            ["NodeIndex", "Radius (m)", "Temperature (°C)", "Estimated Viscosity (cP)"],
                            ["Node-1", "2.0", "184.2", "180"],
                            ["Node-2", "5.0", "112.5", "640"],
                            ["Node-3", "10.0", "64.8", "4200"]
                          ].map(e => e.map(val => `"${val}"`).join(",")).join("\n");
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `OIL_BGW014_Reservoir_Grid_${new Date().toISOString().split('T')[0]}.csv`;
                          link.click();
                          addAuditLog("CSV Reservoir Grid exported");
                          showToast('Reservoir Grid CSV exported.');
                        }}
                        className="w-full stitch-btn-primary text-zinc-950 font-bold py-2 rounded-lg text-xs cursor-pointer min-h-[38px] border border-amber-500/30"
                      >
                        Export Grid (.CSV) <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Connection details (lg:col-span-4) */}
                <div className="lg:col-span-4 glass-panel p-5 space-y-4 flex flex-col justify-between slide-edge-right stagger-2">
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-white font-mono uppercase border-b border-zinc-900/30 pb-2">API Connection Status</h3>
                    
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold uppercase">Status Code:</span>
                        <span className="text-amber-400 font-bold">200 OK</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold uppercase">SSL TLS Auth:</span>
                        <span className="text-zinc-300">Mutual TLS mTLS v1.3</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <span className="text-zinc-400 font-bold uppercase">Ping tele:</span>
                        <span className="text-amber-400">12 ms</span>
                      </div>
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-zinc-400 font-bold uppercase">Endpoint URI:</span>
                        <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-right truncate max-w-[150px]">wells/bgw-014/logs</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3 border-0 rounded-xl">
                    <span className="text-xs text-zinc-400 font-bold font-mono block uppercase">Data provenance signature</span>
                    <p className="text-xs font-medium text-zinc-200 dark:text-zinc-200 light:text-slate-700 mt-1 font-mono tracking-tighter leading-snug">
                      SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <footer className="mt-8 pt-4 border-t border-zinc-900/50 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-sans gap-2 w-full">
              <div>
                <span>© 2026 Oil India Limited. Baghewala CSS–SRP Operations Control.</span>
              </div>
              <div className="flex gap-4 font-mono text-xs font-medium uppercase">
                <span>Platform: v2.4.0-production</span>
                <span>•</span>
                <span>Role: {userRole}</span>
                <span>•</span>
                <span>SCADA State: {connectionState === 'normal' ? 'Connected' : 'Offline'}</span>
              </div>
            </footer>
          </div>
        )}

        {/* OIL INDIA PORTAL MODERNIZATION & ARCHITECTURE UPGRADE HUB */}
        {activeTab === 'upgrade' && (
          <OilIndiaUpgradeHub darkMode={darkMode} />
        )}

        {/* PAGE 1: SOLUTION SUMMARY & OVERVIEW — EXECUTIVE EOR COMMAND DECK */}
        {activeTab === 'overview' && (
          <div className="space-y-6 page-transition-wrap">
            
            {/* ── Top Telemetry KPI Ribbon ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Baseline Production', rawVal: 25.0, suffix: ' bbl/d', textClass: 'text-slate-800 dark:text-zinc-100', pipClass: 'led-pip-gold', desc: 'Measured SCADA Baseline (BGW-014)' },
                { label: 'Optimized Oil Yield', rawVal: currentMetrics.q_oil, suffix: ' bbl/d', textClass: 'text-amber-400', pipClass: 'led-pip-gold', desc: 'Simulated CSS+SRP Production' },
                { label: 'Thermal Efficiency', rawVal: Math.max(30, Math.round(85 - currentMetrics.steamOilRatio * 15)), suffix: '%', textClass: 'text-amber-400', pipClass: 'led-pip-gold', desc: 'Thermodynamic Enthalpy Recovery' },
                { label: 'SRP Operating Health', rawVal: currentMetrics.health_score, suffix: '%', textClass: 'text-white', pipClass: 'led-pip-gold', desc: `System State: ${currentMetrics.risk_class}` }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className={`glass-panel p-4 flex flex-col justify-between h-32 hover-holo-lift cursor-default hover:-translate-y-1 transition-all duration-200 slide-edge-top stagger-${idx + 1}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="label-caps">{card.label}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${card.pipClass}`} />
                  </div>
                  <strong className={`text-3xl sm:text-4xl font-mono font-bold ${card.textClass} my-0.5 block truncate`}>
                    <AnimatedNumber value={card.rawVal} suffix={card.suffix} decimals={0} />
                  </strong>
                  <span className="text-xs font-medium text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono block truncate">{card.desc}</span>
                </div>
              ))}
            </div>

            {/* ── Executive Solution Summary & Synergy Card ── */}
            <div className="glass-panel p-5 space-y-4 slide-edge-left stagger-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" />
                  EOR Joint Optimization & Physics-Coupled Operations
                </h3>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Jodhpur Sandstone • BGW-014</span>
                </div>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-body">
                Heavy oil Enhanced Oil Recovery (EOR) in the <strong className="text-white">Jodhpur Sandstone formation</strong> (Baghewala Field) relies on Cyclic Steam Stimulation (CSS) to reduce crude viscosity from a baseline 11,500 cP down to pumpable ranges. The Sucker Rod Pump (SRP) system then lifts the mobilized fluid to the surface.
              </p>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <strong className="text-amber-400 font-mono text-xs uppercase tracking-wider block flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Operational Synergy Insight:
                </strong>
                <p className="text-xs text-zinc-300 leading-relaxed mt-1.5 font-body">
                  Thermal heavy-oil extraction requires direct synchronization between steam injection volume and mechanical pump speed. Mismatched parameters trigger immediate fluid pounding, accelerated rod stress, or excessive steam consumption. Integrated SCADA setpoints balance reservoir mobilization rates with physical lift capacity.
                </p>
              </div>
            </div>

            {/* ── Subsurface Reservoir Intelligence & Physics Models Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* 1. Marx-Langenheim Radius */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-3 slide-edge-bottom stagger-1">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <h3 className="label-caps flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-bold">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Marx-Langenheim Radius
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-400">{currentMetrics.heated_radius || 18.4}m</span>
                </div>
                <div className="h-28 w-full bg-slate-50 dark:bg-black/40 rounded-xl p-3 flex items-end justify-between gap-2  shadow-inner">
                  {[25, 45, 68, 85, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/30 via-amber-500/70 to-amber-500 rounded-t-md transition-all duration-300 shadow-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-200 dark:text-zinc-200 light:text-slate-700">
                  <span>Target: 25.0m</span>
                  <span className="text-amber-400">Expanding Steam Chamber</span>
                </div>
              </div>

              {/* 2. Arrhenius Viscosity Decay */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-3 slide-edge-bottom stagger-2">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <h3 className="label-caps flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-bold">
                    <Droplets className="w-4 h-4 text-amber-400" />
                    Arrhenius Viscosity Decay
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-400">{currentMetrics.viscosity || 420} cP</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white">{currentMetrics.viscosity || 420} <span className="text-sm text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-normal">cP</span></div>
                    <span className="text-xs font-mono text-amber-400 font-bold">−96.3% Viscosity Reduction</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-600 block">Baseline:</span>
                    <span className="text-xs font-mono text-zinc-300 font-bold">11,500 cP</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden ">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${Math.max(5, Math.min(100, (420 / 11500) * 100))}%` }} />
                </div>
              </div>

              {/* 3. Pareto Frontiers */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-3 slide-edge-bottom stagger-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <h3 className="label-caps flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-bold">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Pareto Multi-Objective
                  </h3>
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold">Knee-Point</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="bg-slate-100 dark:bg-black/30 p-2.5 rounded-lg  flex justify-between items-center">
                    <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Steam-Oil Ratio (CSOR):</span>
                    <strong className="text-amber-400 font-bold">{currentMetrics.steamOilRatio || 2.4}</strong>
                  </div>
                  <div className="bg-slate-100 dark:bg-black/30 p-2.5 rounded-lg  flex justify-between items-center">
                    <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Rod Stress Reserve:</span>
                    <strong className="text-amber-400 font-bold">Safe ({(14000 - currentMetrics.rod_load).toLocaleString()} lbs reserve)</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* ── Integrated Well-to-Surface Workflow Stepper ── */}
            <div className="glass-panel p-5 space-y-4 slide-edge-right stagger-2">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">
                    Integrated Well-to-Surface EOR Workflow
                  </h3>
                  <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">Dynamic SCADA Synchronization • Chronological Execution</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('twin')}
                    className="stitch-btn-ghost px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect 3D Digital Twin</span>
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const reportText = `========================================================\n` +
                        `OIL INDIA LIMITED - BAGHEWALA FIELD JOINT OPTIMIZATION REPORT\n` +
                        `========================================================\n` +
                        `Well: BGW-014 | Formation: Jodhpur Sandstone\n` +
                        `Current Rate: ${currentMetrics.q_oil} bbl/d | Viscosity: ${currentMetrics.viscosity} cP\n` +
                        `Steam Temp: ${inputs.steam_T}°C | Speed: ${inputs.SPM} SPM\n` +
                        `SOR: ${currentMetrics.steamOilRatio} | Health: ${currentMetrics.health_score}%\n` +
                        `========================================================`;
                      const blob = new Blob([reportText], { type: 'text/plain' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = `Baghewala_EOR_Operational_Summary.txt`;
                      link.click();
                      showToast('EOR Operational Summary downloaded.');
                    }}
                    className="stitch-btn-primary px-4 py-2 text-xs cursor-pointer"
                  >
                    Download Summary (.TXT)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs text-zinc-300">
                <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-lg ">
                  <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold block mb-1">1. BASELINE</span>
                  <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs font-medium leading-relaxed">Cold reservoir (45°C), 11,500 cP viscosity. 25 bbl/d baseline flow.</p>
                </div>
                <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-lg ">
                  <span className="text-amber-400 font-bold block mb-1">2. INJECTION</span>
                  <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs font-medium leading-relaxed">220°C steam at 25 t/d for 12 days. SRP at 7.5 SPM, 100" stroke.</p>
                </div>
                <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-lg ">
                  <span className="text-amber-400 font-bold block mb-1">3. HEATED ZONE</span>
                  <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs font-medium leading-relaxed">Viscosity drops to 420 cP. Heated radius expands to 18.4m.</p>
                </div>
                <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-lg ">
                  <span className="text-amber-400 font-bold block mb-1">4. EXTRACTION</span>
                  <p className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs font-medium leading-relaxed">Oil production surges to 212 bbl/d. 84% thermal efficiency.</p>
                </div>
                <div className="bg-slate-100 dark:bg-black/30 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                  <span className="text-amber-300 font-bold block mb-1">5. RECOMMEND</span>
                  <p className="text-zinc-300 text-xs font-medium leading-relaxed">Optimal knee-point setpoints applied. Peak revenue with safe rod loads.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* PAGE 2: DIGITAL TWIN MODEL — always mounted to preserve WebGL context */}
        <div style={{ display: activeTab === 'twin' ? '' : 'none' }} className="w-full flex-1 min-h-0 flex flex-col gap-3">
          <div key={`twin-pfs-${activeTab}`} className="slide-edge-top">
            <ProcessFlowStrip darkMode={darkMode} />
          </div>
          
          <div className={`relative w-full h-[580px] lg:h-[680px] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border transition-colors slide-edge-bottom ${
            darkMode ? 'bg-[#080b13] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'bg-white border-slate-300 shadow-2xl'
          }`}>
            
            {/* Floating controls on top-right: Exploded / X-Ray Inspection + Camera Reset */}
            <div key={`twin-ctrl-${activeTab}`} className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-auto slide-edge-right stagger-2 flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  const next = !xrayExploded;
                  setXrayExploded(next);
                  if (threeDWorkspaceRef.current && threeDWorkspaceRef.current.setXray) {
                    threeDWorkspaceRef.current.setXray(next);
                  }
                }}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl transition-all cursor-pointer font-sans font-bold text-[11px] sm:text-xs min-h-[32px] sm:min-h-[38px] flex items-center gap-1.5 sm:gap-2 border ${
                  xrayExploded
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] font-black'
                    : darkMode
                      ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-200 hover:text-white hover:border-amber-500/50'
                      : 'bg-white/95 border-slate-300 text-slate-800 shadow-md hover:border-amber-500'
                }`}
                title="Slide open casing, pump barrel, ball valves, and stuffing box seals"
              >
                <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${xrayExploded ? 'animate-pulse' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="hidden sm:inline">{xrayExploded ? 'Exploded X-Ray: ON' : 'Exploded / X-Ray Mode'}</span>
                <span className="sm:hidden">{xrayExploded ? 'X-Ray ON' : 'X-Ray'}</span>
              </button>

              {/* Zoom In & Zoom Out Quick Buttons */}
              <div className={`flex items-center rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl border p-0.5 ${
                darkMode ? 'bg-zinc-950/90 border-zinc-800/80' : 'bg-white/95 border-slate-300'
              }`}>
                <button
                  onClick={() => {
                    if (threeDWorkspaceRef.current?.zoomIn) threeDWorkspaceRef.current.zoomIn();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Zoom In 3D Scene"
                >
                  +
                </button>
                <button
                  onClick={() => {
                    if (threeDWorkspaceRef.current?.zoomOut) threeDWorkspaceRef.current.zoomOut();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Zoom Out 3D Scene"
                >
                  −
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveCameraPreset('site');
                  if (threeDWorkspaceRef.current && threeDWorkspaceRef.current.resetCamera) {
                    threeDWorkspaceRef.current.resetCamera();
                  }
                }}
                className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-xl backdrop-blur-xl transition-all cursor-pointer font-sans font-bold text-[11px] sm:text-xs min-h-[32px] sm:min-h-[38px] border ${
                  darkMode ? 'bg-zinc-950/90 border-zinc-800/80 text-zinc-200 hover:text-white hover:border-amber-500/50' : 'bg-white/95 border-slate-300 text-slate-800 shadow-md hover:border-amber-500'
                }`}
              >
                <span className="hidden sm:inline">Restore Default View</span>
                <span className="sm:hidden">Reset View</span>
              </button>
            </div>

            {/* Exploded / X-Ray Active Telemetry HUD Overlay with Component Focus Shortcuts */}
            {xrayExploded && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-950/95 border border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-xl text-xs font-mono">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="font-bold text-amber-400 uppercase tracking-wide">X-RAY INSPECTION ACTIVE:</span>
                <span className="text-zinc-300 hidden md:inline">Casing slid open | Barrel sleeve retracted | Stuffing box chevron seals exposed | Valves illuminated</span>
                <div className="flex items-center gap-1.5 ml-2 border-l border-zinc-800 pl-3">
                  <button
                    onClick={() => {
                      if (threeDWorkspaceRef.current?.presetCamera) threeDWorkspaceRef.current.presetCamera('wellhead');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 text-[11px] font-sans font-semibold border border-zinc-700/60 transition-colors"
                  >
                    Inspect Seals
                  </button>
                  <button
                    onClick={() => {
                      if (threeDWorkspaceRef.current?.presetCamera) threeDWorkspaceRef.current.presetCamera('subsurface');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 text-[11px] font-sans font-semibold border border-zinc-700/60 transition-colors"
                  >
                    Inspect Ball Valves
                  </button>
                </div>
              </div>
            )}

            <div className="absolute inset-0 w-full h-full z-10">
              <div ref={activeTab === 'twin' ? set3DContainer : null} className="w-full h-full relative" />
            </div>

            {/* Collapsible Inspection drawer when an asset is clicked */}
            {selectedAsset && (
              <div className={`absolute top-4 right-4 bottom-4 w-96 max-w-[calc(100vw-32px)] p-5 shadow-2xl backdrop-blur-2xl flex flex-col justify-between z-30 overflow-y-auto rounded-3xl border-2 slide-edge-right ${
                darkMode 
                  ? 'bg-zinc-950/95 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] text-zinc-100' 
                  : 'bg-white/98 border-amber-500 shadow-[0_10px_35px_rgba(180,83,9,0.20)] text-slate-800'
              }`}>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-900/50 pb-3">
                    <div>
                      <span className="text-sm text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-bold uppercase tracking-widest font-mono">ASSET TELEMETRY</span>
                      <h3 className="text-xl font-bold text-white font-sans mt-1">{selectedAsset.name}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-white text-lg font-bold cursor-pointer w-8 h-8 flex items-center justify-center border-0 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-zinc-900/80 border-white/10 text-zinc-200' : 'bg-amber-50/60 border-amber-300 text-slate-800'
                  }`}>
                    <span className="text-sm font-bold block font-sans text-amber-500">Functional Purpose:</span>
                    <p className="text-sm mt-1 leading-relaxed font-sans">{selectedAsset.purpose}</p>
                  </div>
                  <div className="space-y-3  pr-1">
                    {renderTelemetryMetric('Equipment Status', selectedAsset.status || 'Operational', '', 'historical', 'SCADA Logs: 2026-08-25', '2026-08-25 08:00 UTC')}
                    {renderTelemetryMetric('Diagnostics Health', `${selectedAsset.health || 94}%`, '', 'simulation', 'Integrity Model BGW-014', 'Real-time Diagnostic')}
                    {renderTelemetryMetric('Operating Pressure', selectedAsset.pressure || 'Awaiting verified source', '', 'simulation', 'SCADA Sensor Node', 'Real-time Telemetry')}
                    {renderTelemetryMetric('Operating Temperature', selectedAsset.temp || 'Awaiting verified source', '', 'simulation', 'SCADA Temperature Loop', 'Real-time Telemetry')}
                  </div>

                  {selectedAsset.id === 'tanks' && (
                    <div className="space-y-3 pt-3 border-t border-zinc-900/50">
                      <span className="text-sm text-zinc-300 font-bold font-mono block">Tank Shell Mode:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['transparent', 'cutaway', 'normal'].map(vm => (
                          <button
                            key={vm}
                            onClick={() => setTankViewMode(vm)}
                            className={`py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer min-h-[44px] ${
                              tankViewMode === vm 
                                ? 'bg-amber-500 text-black border-amber-400' 
                                : 'bg-zinc-900 border-zinc-900/50 text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            {vm}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 glass-panel rounded-2xl text-sm text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono leading-relaxed mt-4">
                  ⚠️ Source Verification: {getSourceBadge()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAGE 3: SIMULATION SANDBOX — always mounted to preserve WebGL context */}
        {activeTab === 'sim' && (
          <div className="space-y-6 page-transition-wrap">
            
            {/* Top Section: Full-Width 8-Parameter Precision Industrial SCADA Deck */}
            <IndustrialSimulationController
              mode="css"
              inputs={localInputs}
              onChange={handleInputChange}
              onApplyPreset={applyPreset}
              onReset={resetAll}
              onSaveScenario={saveCurrentScenario}
              simIsPlaying={simIsPlaying}
              onToggleSim={() => setSimIsPlaying(!simIsPlaying)}
              illustrativeMode={illustrativeMode}
              darkMode={darkMode}
              currentMetrics={currentMetrics}
              userRole={userRole}
            />

            {/* Bottom Grid: Left (Thermal/Viscosity Charts) & Right (Results & Diagnostics) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Visual Analytics (lg:col-span-6) */}
              <div className="lg:col-span-6 glass-panel p-5 flex flex-col justify-between gap-5 slide-edge-left stagger-2">
                <div className="border-b border-zinc-900/50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">CSS Thermal & Pressure Profiles</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-semibold">RESERVOIR PROPAGATION & RHEOLOGY DYNAMICS</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    Radius: {currentMetrics.heated_radius || '18.4'}m
                  </span>
                </div>

                <div className="space-y-4 flex-grow flex flex-col justify-between">
                  {/* Chart 1: Radial Temperature Profile */}
                  <div className="bg-zinc-950/80 rounded-[22px] p-4.5 border border-white/[0.06]  flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">RADIAL HEAT CONDUCTION (TEMPERATURE vs DISTANCE)</span>
                      <span className="text-xs font-medium font-mono text-zinc-200 dark:text-zinc-200 light:text-slate-700">Peak: {localInputs.steam_T}°C</span>
                    </div>
                    <div className="h-44 w-full">
                      <LazyChart
                        style={{ height: '100%', width: '100%' }}
                        option={{
                          backgroundColor: 'transparent',
                          grid: { top: 10, bottom: 25, left: 45, right: 15 },
                          xAxis: { 
                            name: 'Radius (m)',
                            nameLocation: 'middle',
                            nameGap: 18,
                            nameTextStyle: { color: '#71717a', fontSize: 10 },
                            type: 'category',
                            data: ['0m', '3m', '6m', '9m', '12m', '15m', '18m', '21m', '25m', '30m'],
                            axisLabel: { color: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }
                          },
                          yAxis: { 
                            name: 'Temp (°C)',
                            nameTextStyle: { color: '#71717a', fontSize: 10 },
                            splitLine: { lineStyle: { color: '#27272a' } },
                            axisLabel: { color: '#a1a1aa', fontSize: 10, fontFamily: 'monospace' }
                          },
                          series: [{
                            type: 'line',
                            smooth: true,
                            data: [
                              localInputs.steam_T,
                              Math.round(localInputs.steam_T * 0.92),
                              Math.round(localInputs.steam_T * 0.81),
                              Math.round(localInputs.steam_T * 0.68),
                              Math.round(localInputs.steam_T * 0.54),
                              Math.round(localInputs.steam_T * 0.42),
                              Math.round(localInputs.steam_T * 0.32),
                              Math.round(localInputs.steam_T * 0.25),
                              Math.round(localInputs.steam_T * 0.20),
                              45
                            ],
                            lineStyle: { color: '#f59e0b', width: 3 },
                            areaStyle: {
                              color: {
                                type: 'linear',
                                x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [
                                  { offset: 0, color: 'rgba(245, 158, 11, 0.4)' },
                                  { offset: 1, color: 'rgba(245, 158, 11, 0.0)' }
                                ]
                              }
                            }
                          }]
                        }}
                      />
                    </div>
                  </div>

                  {/* Chart 2: Viscosity Reduction Curve */}
                  <div className="bg-zinc-950/90 rounded-[22px] p-4.5 border border-white/[0.08] shadow-xl flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-amber-400 font-tactical tracking-wider">VISCOSITY REDUCTION (ARRHENIUS DYNAMICS)</span>
                      <span className="text-xs font-medium font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-zinc-200 border border-amber-500/30">Current: {currentMetrics.viscosity || '420'} cP</span>
                    </div>
                    <div className="h-48 w-full">
                      <LazyChart
                        style={{ height: '100%', width: '100%' }}
                        option={{
                          backgroundColor: 'transparent',
                          tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(10, 13, 20, 0.95)',
                            borderColor: 'rgba(56, 189, 248, 0.3)',
                            textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11 },
                            formatter: '{b0}: <span style="color:#38bdf8;font-weight:bold;">{c0} cP</span>'
                          },
                          grid: { top: 25, bottom: 25, left: 55, right: 20 },
                          xAxis: { 
                            name: 'Timeline',
                            type: 'category',
                            data: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
                            axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } }
                          },
                          yAxis: { 
                            name: 'cP',
                            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
                            axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }
                          },
                          series: [{
                            type: 'line',
                            smooth: 0.35,
                            data: [12000, 8500, 5200, 2900, 1400, 780, 420, 390, 410, 460, 550, 680, 850, 1100],
                            lineStyle: { color: '#38bdf8', width: 3.5, shadowColor: 'rgba(56, 189, 248, 0.6)', shadowBlur: 12 },
                            itemStyle: { color: '#7dd3fc' },
                            markPoint: {
                              data: [{ type: 'min', name: 'Max Mobility' }],
                              itemStyle: { color: '#10b981' },
                              label: { fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold' }
                            },
                            areaStyle: {
                              color: {
                                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [
                                  { offset: 0, color: 'rgba(56, 189, 248, 0.5)' },
                                  { offset: 0.6, color: 'rgba(56, 189, 248, 0.15)' },
                                  { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
                                ]
                              }
                            }
                          }]
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Outcomes, Dyno Card & SCADA Health (lg:col-span-6) */}
              <div className="lg:col-span-6 glass-panel p-5 flex flex-col justify-between gap-5 slide-edge-right stagger-2">
                <div className="border-b border-zinc-900/50 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">Simulation Outcomes & Health</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-semibold">REAL-TIME PRODUCTION & MECHANICAL TELEMETRY</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                    Health: {currentMetrics.health_score || 94}%
                  </span>
                </div>

                {/* 4 Outcome Metrics in a 4-Column Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-medium font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase">OIL YIELD</span>
                    <strong className="text-xl text-amber-400 font-mono mt-1">{currentMetrics.q_oil} <span className="text-xs text-zinc-400">bbl/d</span></strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-medium font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase">RES TEMP</span>
                    <strong className="text-xl text-white dark:text-white light:text-slate-900 font-mono mt-1">{currentMetrics.Tres} <span className="text-xs text-zinc-400">°C</span></strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-medium font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase">BHP (Pwf)</span>
                    <strong className="text-xl text-white dark:text-white light:text-slate-900 font-mono mt-1">{currentMetrics.Pwf} <span className="text-xs text-zinc-400">psi</span></strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 rounded-2xl flex flex-col justify-between">
                    <span className="text-xs font-medium font-bold text-zinc-400 dark:text-zinc-400 light:text-slate-600 font-mono uppercase">STEAM SOR</span>
                    <strong className="text-xl text-white dark:text-white light:text-slate-900 font-mono mt-1">{currentMetrics.steamOilRatio}</strong>
                  </div>
                </div>

                {/* 2 Sub-columns: Left (Dynamometer Card) & Right (SCADA Warnings & Safety) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                  {/* Dynamometer Card */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl  flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-zinc-300 font-mono uppercase">SURFACE DYNO CARD</span>
                      <span className="text-xs font-medium font-mono text-amber-400 font-bold">{currentMetrics.pump_eff}% Fillage</span>
                    </div>
                    {illustrativeMode ? (
                      <DynamometerCard 
                        fillage={currentMetrics.pump_eff}
                        rodLoad={currentMetrics.rod_load}
                        SPM={inputs.SPM}
                        strokeLength={inputs.stroke_length || 100}
                      />
                    ) : (
                      <div className="h-36 flex flex-col justify-center items-center text-center">
                        <span className="text-zinc-600 text-xl mb-1">⛃</span>
                        <span className="text-xs font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">Dynamometer Locked</span>
                        <span className="text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 mt-0.5">Switch to Sandbox mode to calculate rod curves.</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-mono mt-2 pt-2 border-t border-zinc-900">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Peak Load: <strong className="text-white">{currentMetrics.rod_load} lbs</strong></span>
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Motor: <strong className="text-amber-400">{currentMetrics.motor_current} A</strong></span>
                    </div>
                  </div>

                  {/* SCADA Warnings & Constraints */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl  flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-zinc-300 font-mono uppercase">ACTIVE SCADA ALARMS</span>
                        <span className="text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono">AUTO-EVALUATED</span>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {[
                          { cond: currentMetrics.pump_eff < 75, text: '⚠️ Pump-off / Fluid Pound', type: 'warning' },
                          { cond: currentMetrics.rod_load > 14000, text: '🚨 High Rod Load (>14,000 lbs)', type: 'critical' },
                          { cond: currentMetrics.motor_current > 20, text: '🚨 High Motor Current (>20A)', type: 'critical' },
                          { cond: currentMetrics.pump_eff < 80, text: '⚠️ Low Pump Fillage (<80%)', type: 'warning' },
                          { cond: inputs.soak_duration < 4, text: '⚠️ Gas Interference Risk', type: 'warning' },
                          { cond: currentMetrics.Pwf < 180, text: '⚠️ High Drawdown (Low BHP)', type: 'warning' }
                        ].filter(w => w.cond).map((w, idx) => (
                          <div 
                            key={idx} 
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-between ${
                              w.type === 'critical' 
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}
                          >
                            <span>{w.text}</span>
                            <span className="text-xs px-1 bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm rounded">ACTIVE</span>
                          </div>
                        ))}
                        {![
                          currentMetrics.pump_eff < 75,
                          currentMetrics.rod_load > 14000,
                          currentMetrics.motor_current > 20,
                          currentMetrics.pump_eff < 80,
                          inputs.soak_duration < 4,
                          currentMetrics.Pwf < 180
                        ].some(Boolean) && (
                          <div className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono text-center py-4 glass-panel rounded-xl border border-zinc-900">
                            ✓ All operational parameters within safe limits.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="glass-panel p-2.5 rounded-xl border border-zinc-900 text-xs font-medium font-sans text-zinc-200 dark:text-zinc-200 light:text-slate-700 leading-tight">
                      <span className="font-bold text-zinc-300 font-mono block mb-0.5">DISCLAIMER:</span>
                      Real-time synthetic physics calibrated for Jodhpur Sandstone formation.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* PAGE 4: RESERVOIR & SUBSURFACE */}
        {activeTab === 'reservoir' && (
          <div className="space-y-6 page-transition-wrap">
            {/* ── Dynamic Thermodynamic Viscosity Sensitivity Engine ── */}
            <div className="slide-edge-top">
              <DynamicViscositySensitivityEngine inputs={localInputs} currentMetrics={currentMetrics} darkMode={darkMode} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 3D view with forced subsurface */}
              <div className="lg:col-span-8 glass-panel p-5 flex flex-col gap-4 min-h-[580px] h-[calc(100vh-230px)] slide-edge-left stagger-2">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 border-b border-zinc-900/50 pb-3">
                  <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">Reservoir Cross-section</h3>
                  
                  {/* Interactive Subsurface Toolbar */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Well Focus */}
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-sm font-mono font-bold">FOCUS:</span>
                      <select
                        value={subsurfaceWellFocus}
                        onChange={(e) => setSubsurfaceWellFocus(e.target.value)}
                        className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border border-zinc-800 text-zinc-200 rounded-xl px-3 py-2 text-xs font-bold cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none"
                      >
                        <option value="none">Reservoir Overview</option>
                        <option value="injection">Injection Wellbore</option>
                        <option value="production">Production Wellbore</option>
                      </select>
                    </div>

                    {/* Heat Map Toggle */}
                    <button
                      onClick={() => setShowSubsurfaceHeatMap(!showSubsurfaceHeatMap)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        showSubsurfaceHeatMap
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.05)]'
                          : 'bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border-zinc-900/50 text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-zinc-200'
                      }`}
                    >
                      {showSubsurfaceHeatMap ? 'Thermal Profile ON' : 'Thermal Profile OFF'}
                    </button>

                    {/* Flow Path Toggle */}
                    <button
                      onClick={() => setShowSubsurfaceOilFlow(!showSubsurfaceOilFlow)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        showSubsurfaceOilFlow
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(16,185,129,0.05)]'
                          : 'bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border-zinc-900/50 text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-zinc-200'
                      }`}
                    >
                      {showSubsurfaceOilFlow ? 'Flow Pathways ON' : 'Flow Pathways OFF'}
                    </button>

                    {/* Soil Strata Layer Toggle */}
                    <button
                      onClick={() => setGroundTransparency(t => t > 0.01 ? 0.0 : 0.30)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        groundTransparency > 0.01
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.05)]'
                          : 'bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border-zinc-900/50 text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-zinc-200'
                      }`}
                    >
                      {groundTransparency > 0.01 ? 'Soil Strata ON' : 'Soil Strata OFF (Clear Well)'}
                    </button>

                    {/* Ground Transparency Slider */}
                    {groundTransparency > 0.01 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-black/40 rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm rounded-xl">
                        <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs font-mono font-bold">OPACITY:</span>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          value={Math.round(groundTransparency * 100)}
                          onChange={(e) => setGroundTransparency(parseFloat(e.target.value) / 100)}
                          className="w-16 h-1 accent-zinc-400 cursor-pointer"
                          title="Adjust soil strata opacity"
                        />
                        <span className="text-zinc-300 text-xs font-mono font-bold">{Math.round(groundTransparency * 100)}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`w-full flex-grow rounded-[24px] overflow-hidden relative border transition-colors ${
    darkMode ? 'bg-[#080b13] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]' : 'bg-white border-slate-300 shadow-2xl'
  }`}>
                  <div ref={activeTab === 'reservoir' ? set3DContainer : null} className="w-full h-full relative" />
                </div>
              </div>

              {/* Subsurface & Surface Comprehensive Analytics */}
              <div className="lg:col-span-4 glass-panel p-5 space-y-4 flex flex-col justify-between min-h-[580px] h-[calc(100vh-230px)] slide-edge-right stagger-2">
                <div className="space-y-3 flex-grow flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center border-b border-zinc-900/50 pb-2.5">
                    <div>
                      <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider">Subsurface & Surface Analytics</h3>
                      <span className="text-xs font-medium text-zinc-300 font-mono">RESERVOIR ENTHALPY & FLOW REGIME</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      LIVE SCADA
                    </span>
                  </div>

                  <div className="space-y-2 overflow-y-auto flex-grow pr-1 text-xs">
                    {renderTelemetryMetric('Estimated Recovery Factor', `${currentMetrics.recovery_factor}%`, '', 'simulation', 'OIL BGW Simulator-2026', 'Real-time Output')}
                    {renderTelemetryMetric('Reservoir Temperature', currentMetrics.Tres, '°C', 'simulation', 'Thermodynamic Model', 'Real-time Output')}
                    {renderTelemetryMetric('Reservoir Pressure (BHP)', currentMetrics.Pwf, 'psi', 'simulation', 'Reservoir Hydraulics', 'Real-time Output')}
                    {renderTelemetryMetric('Reduced Oil Viscosity', currentMetrics.viscosity, 'cP', 'simulation', 'Arrhenius Model', 'Real-time Output')}
                    {renderTelemetryMetric('Heated Zone Radius', currentMetrics.heated_radius, 'm', 'simulation', 'Thermal Expansion Model', 'Real-time Output')}
                    {renderTelemetryMetric('Steam Front Advance Rate', '0.42 m/d', '', 'simulation', 'Marx-Langenheim Radial Solver', 'Calculated')}
                    {renderTelemetryMetric('Cumulative Injected Enthalpy', '1,420 MMBTU', '', 'simulation', 'SCADA Enthalpy Integration', 'Cumulative')}
                    {renderTelemetryMetric('Volumetric Sweep Efficiency', '78.4%', '', 'simulation', 'Jodhpur Sandstone Model', 'Optimal')}
                    {renderTelemetryMetric('Permeability Anisotropy (kv/kh)', '0.28', '', 'baseline', 'Core Log Perm Analysis', 'Verified')}
                    {renderTelemetryMetric('Overburden Heat Loss', '12.8%', '', 'simulation', 'Thermal Boundary Model', 'Real-time Output')}
                    {renderTelemetryMetric('Steam SOR', currentMetrics.steamOilRatio, '', 'simulation', 'Thermodynamic Model', 'Real-time Output')}
                    {renderTelemetryMetric('Static Reservoir Pressure', currentMetrics.Pres, 'psi', 'baseline', 'Oil India Baseline: BGW-014', '2026-08-25 08:00 UTC')}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-900/50 space-y-2">
                  <span className="text-xs font-medium font-bold text-zinc-300 font-mono block uppercase">FORMATION ROCK & FLUID BASELINE:</span>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono text-center">
                    <div className="glass-panel p-2 flex flex-col items-center">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 block text-xs font-bold">POROSITY</span>
                      <strong className="text-white block mt-0.5 text-xs font-bold">23%</strong>
                    </div>
                    <div className="glass-panel p-2 flex flex-col items-center">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 block text-xs font-bold">PERM</span>
                      <strong className="text-white block mt-0.5 text-xs font-bold">450 mD</strong>
                    </div>
                    <div className="glass-panel p-2 flex flex-col items-center">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 block text-xs font-bold">WATER CUT</span>
                      <strong className="text-white block mt-0.5 text-xs font-bold">8%</strong>
                    </div>
                    <div className="glass-panel p-2 flex flex-col items-center">
                      <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 block text-xs font-bold">API GRAVITY</span>
                      <strong className="text-amber-400 block mt-0.5 text-xs font-bold">16.5°</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PAGE 5: SURFACE OPERATIONS */}
        {activeTab === 'surface' && (
          <div className="space-y-6 page-transition-wrap">
            {/* Top Section: Full-Width 6-Axis Industrial SCADA Scenario Optimization Deck */}
            <IndustrialSimulationController
              mode="scenario"
              inputs={localInputs}
              onChange={handleInputChange}
              onApplyPreset={applyPreset}
              onReset={resetAll}
              onSaveScenario={saveCurrentScenario}
              simIsPlaying={simIsPlaying}
              onToggleSim={() => setSimIsPlaying(!simIsPlaying)}
              illustrativeMode={illustrativeMode}
              darkMode={darkMode}
              currentMetrics={currentMetrics}
              userRole={userRole}
              onTriggerESD={() => {
                if (window.confirm("CRITICAL PROTOCOL ALERT:\n\nAre you sure you want to trigger an Emergency Shutdown (ESD)?")) {
                  setSimIsPlaying(false);
                  setInputs(prev => ({ ...prev, SPM: 0, steam_rate: 0, valve_opening: 0 }));
                  setLocalInputs(prev => ({ ...prev, SPM: 0, steam_rate: 0, valve_opening: 0 }));
                  showToast("Emergency Shutdown initiated.");
                }
              }}
              onRunOptimization={runOptimization}
              optimizationLoading={optimizationLoading}
              optimizationProgress={optimizationProgress}
              selectedParetoPoint={selectedParetoPoint}
            />

            {/* Bottom Grid: Left (Pareto Optimization Space) & Right (Impact & SCADA Write) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left: Pareto Frontier & Candidates (lg:col-span-7) */}
              <div className="lg:col-span-7 glass-panel p-5 flex flex-col justify-between gap-5 slide-edge-left stagger-2">
                <div>
                  <div className="flex justify-between items-center border-b border-zinc-900/50 pb-3 mb-4">
                    <div>
                      <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">NSGA-II Trade-Off Space</h3>
                      <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-bold">PARETO OPTIMAL EOR PRODUCTION VS ENERGY COST</span>
                    </div>
                    <button
                      onClick={runOptimization}
                      disabled={optimizationLoading}
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-850 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer"
                    >
                      {optimizationLoading ? 'SOLVING...' : 'RUN SOLVER'}
                    </button>
                  </div>

                  {optimizationLoading && (
                    <div className="w-full bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3.5 border border-purple-500/30 rounded-2xl mb-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-zinc-300">
                        <span>Solving Multi-Objective Pareto Frontier...</span>
                        <strong className="text-zinc-300">{optimizationProgress}%</strong>
                      </div>
                      <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all duration-200" style={{ width: `${optimizationProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {paretoFrontData.length > 0 && (
                    <div className="w-full h-72 border border-white/[0.08] rounded-[24px] bg-zinc-950/90 p-4 relative mb-4 shadow-xl">
                      <LazyChart
                        style={{ height: '100%', width: '100%' }}
                        onEvents={{
                          'click': (params) => {
                            const sorted = [...paretoFrontData].sort((a, b) => a.cost - b.cost);
                            if (params.dataIndex !== undefined && sorted[params.dataIndex]) {
                              setSelectedParetoPoint(sorted[params.dataIndex]);
                            }
                          }
                        }}
                        option={{
                          backgroundColor: 'transparent',
                          tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(10, 13, 20, 0.95)',
                            borderColor: 'rgba(168, 85, 247, 0.4)',
                            textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11 },
                            formatter: (params) => {
                              const p0 = params[0];
                              const sorted = [...paretoFrontData].sort((a, b) => a.cost - b.cost);
                              const item = sorted[p0.dataIndex] || {};
                              return `<div class="p-1 space-y-1">
                                <div class="font-bold text-amber-400 uppercase">Scenario #${item.id || p0.dataIndex + 1}</div>
                                <div class="text-zinc-300">Daily Cost: <strong class="text-white">₹${(item.cost || p0.value[0]).toLocaleString()}</strong></div>
                                <div class="text-zinc-300">Oil Recovery: <strong class="text-amber-400">${item.production || p0.value[1]} bbl/d</strong></div>
                                <div class="text-zinc-200 dark:text-zinc-200 light:text-slate-700 text-xs">Temp: ${item.inputs?.steam_T || 235}°C | Speed: ${item.inputs?.SPM || 8.2} SPM</div>
                              </div>`;
                            }
                          },
                          legend: {
                            data: ['Optimal Yield Curve (bbl/d)', 'Specific ROI (bbl / ₹1k)'],
                            top: 0,
                            textStyle: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }
                          },
                          grid: { top: 35, bottom: 35, left: 55, right: 45 },
                          xAxis: { 
                            name: 'Scenario (by Cost)',
                            type: 'category',
                            data: [...paretoFrontData].sort((a, b) => a.cost - b.cost).map(pt => `₹${(pt.cost/1000).toFixed(0)}k`),
                            axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } }
                          },
                          yAxis: [
                            { 
                              name: 'Yield (bbl/d)',
                              type: 'value',
                              splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
                              axisLabel: { color: '#10b981', fontSize: 10, fontFamily: 'monospace' },
                              nameTextStyle: { color: '#10b981', fontSize: 10 }
                            },
                            { 
                              name: 'bbl / ₹1k',
                              type: 'value',
                              splitLine: { show: false },
                              axisLabel: { color: '#a855f7', fontSize: 10, fontFamily: 'monospace' },
                              nameTextStyle: { color: '#a855f7', fontSize: 10 }
                            }
                          ],
                          series: [
                            {
                              name: 'Optimal Yield Curve (bbl/d)',
                              type: 'line',
                              yAxisIndex: 0,
                              smooth: 0.35,
                              symbol: 'none',
                              data: [...paretoFrontData].sort((a, b) => a.cost - b.cost).map(pt => pt.production),
                              lineStyle: { color: '#10b981', width: 3.5, shadowColor: 'rgba(16, 185, 129, 0.65)', shadowBlur: 12 },
                              areaStyle: {
                                color: {
                                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                  colorStops: [
                                    { offset: 0, color: 'rgba(16, 185, 129, 0.45)' },
                                    { offset: 0.7, color: 'rgba(16, 185, 129, 0.1)' },
                                    { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
                                  ]
                                }
                              },
                              markPoint: {
                                data: [
                                  { type: 'max', name: 'Max Production' },
                                  { type: 'min', name: 'Low Cost' }
                                ],
                                itemStyle: { color: '#f59e0b' },
                                label: { fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold' }
                              }
                            },
                            {
                              name: 'Specific ROI (bbl / ₹1k)',
                              type: 'line',
                              yAxisIndex: 1,
                              smooth: 0.35,
                              symbol: 'none',
                              data: [...paretoFrontData].sort((a, b) => a.cost - b.cost).map(pt => parseFloat(((pt.production / pt.cost) * 1000).toFixed(2))),
                              lineStyle: { color: '#a855f7', width: 2.5, shadowColor: 'rgba(168, 85, 247, 0.5)', shadowBlur: 10 },
                              areaStyle: {
                                color: {
                                  type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                  colorStops: [
                                    { offset: 0, color: 'rgba(168, 85, 247, 0.25)' },
                                    { offset: 1, color: 'rgba(168, 85, 247, 0.0)' }
                                  ]
                                }
                              }
                            }
                          ]
                        }}
                      />
                    </div>
                  )}

                  {/* Candidate Selection List */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono block uppercase">Optimization Candidates:</span>
                    <div className="max-h-[160px] overflow-y-auto  rounded-2xl bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm divide-y divide-zinc-900 text-xs font-mono">
                      {paretoFrontData.slice(0, 5).map((pt, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedParetoPoint(pt)}
                          className={`p-3 cursor-pointer flex justify-between items-center transition-colors hover-scanline-row rounded-xl ${
    selectedParetoPoint?.id === pt.id
      ? 'bg-purple-600 text-white shadow-md font-bold'
      : 'hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-100'
  }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">Candidate #{pt.id}</span>
                            {pt.id === 20 && (
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md text-xs font-bold">
                                RECOMMENDED KNEE-POINT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">₹{Math.round(pt.cost)}/day</span>
                            <span className="text-amber-400 font-bold">{pt.production.toFixed(0)} bbl/d</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Expected Impact & Approval (lg:col-span-5) */}
              <div className="lg:col-span-5 glass-panel p-5 flex flex-col justify-between gap-5 slide-edge-right stagger-2">
                <div className="space-y-6">
                  <div className="border-b border-zinc-900/50 pb-3">
                    <h3 className="text-lg font-tactical font-bold text-white uppercase tracking-wider">Expected Impact & SCADA Write</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono font-semibold">ECONOMIC & MECHANICAL GAIN</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-4  rounded-2xl space-y-3 font-mono text-xs text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Expected Yield:</span>
                      <strong className="text-amber-400 font-bold text-sm">{selectedParetoPoint ? selectedParetoPoint.production.toFixed(0) : currentMetrics.q_oil} bbl/d</strong>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Energy Operating Cost:</span>
                      <span className="text-amber-400 font-bold">₹{selectedParetoPoint ? Math.round(selectedParetoPoint.cost) : '1,420'}/day</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Peak Rod Stress:</span>
                      <span className="text-white font-bold">64% (Safe)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-200 dark:text-zinc-200 light:text-slate-700">Operating Risk Index:</span>
                      <span className="text-amber-400 font-bold">Low (Class A)</span>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl space-y-2 text-xs">
                    <span className="text-amber-400 font-bold font-mono block uppercase">RECOMMENDED CANDIDATE SETPOINTS</span>
                    <p className="text-zinc-300 font-sans leading-relaxed">
                      Applying candidate #{selectedParetoPoint?.id || 20} matches the Jodhpur Sandstone thermal mobilization knee-point to maximize production per Rupee of steam cost.
                    </p>
                  </div>
                </div>

                {/* Approval Control */}
                <div className="space-y-3 pt-3 border-t border-zinc-900/50 font-sans">
                  <button
                    onClick={() => {
                      if (userRole !== 'Engineer' && userRole !== 'Manager' && userRole !== 'Administrator') {
                        alert("SECURITY VIOLATION:\n\nOperational changes require Engineer or Manager approval. Active user role: Operator.");
                        addAuditLog(`Failed setpoint setpoint modification request: unauthorized role ${userRole}`, userRole);
                        return;
                      }
                      if (window.confirm("APPROVE AND WRITE SETPOINTS:\n\nDo you authorize pushing these joint EOR parameters directly to Jodhpur formation SCADA registers?")) {
                        const targetPt = selectedParetoPoint || { inputs: { steam_T: 235, steam_rate: 25, soak_duration: 5, SPM: 8.2, stroke_length: 100, valve_opening: 95 } };
                        setInputs({
                          steam_T: targetPt.inputs.steam_T,
                          steam_rate: targetPt.inputs.steam_rate,
                          soak_duration: targetPt.inputs.soak_duration || 5,
                          SPM: targetPt.inputs.SPM,
                          stroke_length: targetPt.inputs.stroke_length || 100,
                          valve_opening: targetPt.inputs.valve_opening || 95
                        });
                        setLocalInputs({
                          steam_T: targetPt.inputs.steam_T,
                          steam_rate: targetPt.inputs.steam_rate,
                          soak_duration: targetPt.inputs.soak_duration || 5,
                          SPM: targetPt.inputs.SPM,
                          stroke_length: targetPt.inputs.stroke_length || 100,
                          valve_opening: targetPt.inputs.valve_opening || 95
                        });
                        addAuditLog(`Joint EOR setpoints approved and written: ${targetPt.inputs.steam_T}°C Temp, ${targetPt.inputs.SPM} SPM Speed`, userRole);
                        showToast(`Setpoints successfully written by authorized ${userRole}.`);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/30 cursor-pointer min-h-[44px] uppercase text-center font-sans tracking-wide block border border-amber-400"
                  >
                    Authorize & Push to SCADA
                  </button>
                  <span className="text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono text-center block">Authorized signatures required via mTLS token validation.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 6: TRENDS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 page-transition-wrap">
              
                          {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 glass-panel p-4 rounded-3xl slide-edge-top">
              <div className="flex items-center gap-2">
                <span className="text-zinc-300 dark:text-zinc-300 light:text-slate-600 text-xs font-mono font-semibold">TIME FILTER:</span>
                <div className="flex bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm border-0 rounded p-0.5">
                  {['7d', '30d', '90d'].map(tr => (
                    <button
                      key={tr}
                      onClick={() => setAnalyticsTimeRange(tr)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer uppercase font-mono ${
                        analyticsTimeRange === tr 
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' 
                          : 'text-zinc-200 dark:text-zinc-200 light:text-slate-700 hover:text-white'
                      }`}
                    >
                      {tr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provenance descriptors */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-1 rounded-lg uppercase font-mono">
                  Authorized SCADA (Historical)
                </span>
                <span className="text-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2 py-1 rounded-lg uppercase font-mono">
                  Synthetic Math (Sandbox)
                </span>
                <span className="text-[12px] bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded-lg uppercase font-mono">
                  Verified Formation (Baseline)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Chart 1: Thermal Propagation */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-4 slide-edge-left stagger-1">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider">Steam & Formation Temperature</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">THERMAL ENTHALPY PROPAGATION (WELL: BGW-014)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Peak: {inputs.steam_T}°C
                  </span>
                </div>

                <div className="h-72 w-full">
                  <LazyChart
                    style={{ height: '100%', width: '100%' }}
                    option={{
                      backgroundColor: 'transparent',
                      tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(10, 13, 20, 0.95)',
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        textStyle: { color: '#f8fafc', fontFamily: 'monospace', fontSize: 11 }
                      },
                      legend: {
                        data: ['Steam Temp (°C)', 'Reservoir Temp (°C)', 'Baseline Temp (°C)'],
                        top: 0,
                        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
                      },
                      grid: { top: 35, bottom: 25, left: 45, right: 15 },
                      xAxis: {
                        type: 'category',
                        data: historicalData.map(h => h.date),
                        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.12)' } }
                      },
                      yAxis: {
                        type: 'value',
                        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
                        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }
                      },
                      series: [
                        {
                          name: 'Steam Temp (°C)',
                          type: 'line',
                          smooth: 0.35,
                          data: historicalData.map((_, i) => Math.round(inputs.steam_T - Math.sin(i * 0.4) * 8)),
                          lineStyle: { color: '#f59e0b', width: 3.5, shadowColor: 'rgba(245, 158, 11, 0.65)', shadowBlur: 14 },
                          itemStyle: { color: '#fbbf24' },
                          markPoint: {
                            data: [{ type: 'max', name: 'Peak Steam' }],
                            itemStyle: { color: '#f59e0b' },
                            label: { fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold' }
                          },
                          areaStyle: {
                            color: {
                              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                              colorStops: [
                                { offset: 0, color: 'rgba(245, 158, 11, 0.55)' },
                                { offset: 0.5, color: 'rgba(245, 158, 11, 0.15)' },
                                { offset: 1, color: 'rgba(245, 158, 11, 0.0)' }
                              ]
                            }
                          }
                        },
                        {
                          name: 'Reservoir Temp (°C)',
                          type: 'line',
                          smooth: 0.35,
                          data: historicalData.map((_, i) => Math.round(currentMetrics.Tres - Math.cos(i * 0.3) * 6)),
                          lineStyle: { color: '#f97316', width: 2.8, shadowColor: 'rgba(249, 115, 22, 0.5)', shadowBlur: 10 },
                          itemStyle: { color: '#fb923c' }
                        },
                        {
                          name: 'Baseline Temp (°C)',
                          type: 'line',
                          data: historicalData.map(() => 45),
                          lineStyle: { color: '#64748b', width: 1.5, type: 'dashed' }
                        }
                      ]
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-white/[0.06] text-zinc-200 dark:text-zinc-200 light:text-slate-700">
                  <span>Baseline Formation: <strong className="text-zinc-300">45 °C</strong></span>
                  <span>Stimulated Reservoir: <strong className="text-amber-400">{currentMetrics.Tres} °C</strong></span>
                  <span>Viscosity Cut: <strong className="text-amber-400">{(100 - (currentMetrics.viscosity / 11500) * 100).toFixed(0)}%</strong></span>
                </div>
              </div>

              {/* Chart 2: Viscosity vs Yield */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-4 slide-edge-right stagger-1">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider">Viscosity vs. Production Yield</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">THERMAL MOBILIZATION INFLOW RESPONSE</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Yield: {currentMetrics.q_oil} bbl/d
                  </span>
                </div>

                <div className="h-72 w-full">
                  <LazyChart
                    style={{ height: '100%', width: '100%' }}
                    option={{
                      backgroundColor: 'transparent',
                      tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(9, 11, 16, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        textStyle: { color: '#f1f5f9', fontFamily: 'monospace', fontSize: 11 }
                      },
                      legend: {
                        data: ['Viscosity (cP)', 'Oil Yield (bbl/d)'],
                        top: 0,
                        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
                      },
                      grid: { top: 35, bottom: 25, left: 55, right: 45 },
                      xAxis: {
                        type: 'category',
                        data: historicalData.map(h => h.date),
                        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
                      },
                      yAxis: [
                        {
                          type: 'value',
                          name: 'Viscosity (cP)',
                          nameTextStyle: { color: '#a855f7', fontSize: 10 },
                          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
                          axisLabel: { color: '#a855f7', fontSize: 10, fontFamily: 'monospace' }
                        },
                        {
                          type: 'value',
                          name: 'Yield (bbl/d)',
                          nameTextStyle: { color: '#10b981', fontSize: 10 },
                          splitLine: { show: false },
                          axisLabel: { color: '#10b981', fontSize: 10, fontFamily: 'monospace' }
                        }
                      ],
                      series: [
                        {
                          name: 'Viscosity (cP)',
                          type: 'bar',
                          yAxisIndex: 0,
                          data: historicalData.map(h => Math.round(h.viscosity)),
                          itemStyle: {
                            color: {
                              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                              colorStops: [{ offset: 0, color: '#c084fc' }, { offset: 1, color: '#7e22ce' }]
                            },
                            borderRadius: [6, 6, 0, 0]
                          }
                        },
                        {
                          name: 'Oil Yield (bbl/d)',
                          type: 'line',
                          yAxisIndex: 1,
                          smooth: true,
                          data: historicalData.map(h => Math.round(h.q_oil)),
                          lineStyle: { color: '#10b981', width: 3 },
                          itemStyle: { color: '#10b981' }
                        }
                      ]
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-white/[0.06] text-zinc-200 dark:text-zinc-200 light:text-slate-700">
                  <span>Baseline Oil: <strong className="text-zinc-300">25.0 bbl/d</strong></span>
                  <span>Optimized Production: <strong className="text-amber-400">{currentMetrics.q_oil} bbl/d</strong></span>
                  <span>Mobility Ratio: <strong className="text-zinc-300">14.2x</strong></span>
                </div>
              </div>

              {/* Chart 3: Injection Pressure vs Flow */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-4 slide-edge-left stagger-2">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider">Downhole Injection Pressure & Flow</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">HYDRAULIC STEAM INJECTION REGIME</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-zinc-200 border border-white/20">
                    {inputs.injection_pressure} psi
                  </span>
                </div>

                <div className="h-72 w-full">
                  <LazyChart
                    style={{ height: '100%', width: '100%' }}
                    option={{
                      backgroundColor: 'transparent',
                      tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(9, 11, 16, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        textStyle: { color: '#f1f5f9', fontFamily: 'monospace', fontSize: 11 }
                      },
                      legend: {
                        data: ['Pressure (psi)', 'Steam Flow Rate (t/d)'],
                        top: 0,
                        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
                      },
                      grid: { top: 35, bottom: 25, left: 55, right: 45 },
                      xAxis: {
                        type: 'category',
                        data: historicalData.map(h => h.date),
                        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
                      },
                      yAxis: [
                        {
                          type: 'value',
                          name: 'Pressure (psi)',
                          nameTextStyle: { color: '#38bdf8', fontSize: 10 },
                          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
                          axisLabel: { color: '#38bdf8', fontSize: 10, fontFamily: 'monospace' }
                        },
                        {
                          type: 'value',
                          name: 'Rate (t/d)',
                          nameTextStyle: { color: '#ec4899', fontSize: 10 },
                          splitLine: { show: false },
                          axisLabel: { color: '#ec4899', fontSize: 10, fontFamily: 'monospace' }
                        }
                      ],
                      series: [
                        {
                          name: 'Pressure (psi)',
                          type: 'line',
                          yAxisIndex: 0,
                          smooth: true,
                          data: historicalData.map((_, i) => Math.round(inputs.injection_pressure + Math.sin(i * 0.5) * 35)),
                          lineStyle: { color: '#38bdf8', width: 3 },
                          areaStyle: {
                            color: {
                              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                              colorStops: [{ offset: 0, color: 'rgba(56, 189, 248, 0.3)' }, { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }]
                            }
                          }
                        },
                        {
                          name: 'Steam Flow Rate (t/d)',
                          type: 'line',
                          yAxisIndex: 1,
                          smooth: true,
                          data: historicalData.map((_, i) => Math.round(inputs.steam_rate + Math.cos(i * 0.4) * 3)),
                          lineStyle: { color: '#ec4899', width: 2.5 }
                        }
                      ]
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-white/[0.06] text-zinc-200 dark:text-zinc-200 light:text-slate-700">
                  <span>Fracture Margin: <strong className="text-amber-400">Safe (&gt;350 psi)</strong></span>
                  <span>Operating Pressure: <strong className="text-amber-400">{inputs.injection_pressure} psi</strong></span>
                  <span>Steam Inflow: <strong className="text-pink-400">{inputs.steam_rate} t/d</strong></span>
                </div>
              </div>

              {/* Chart 4: SOR vs Energy Power */}
              <div className="glass-panel p-5 flex flex-col justify-between gap-4 slide-edge-right stagger-2">
                <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-base font-tactical font-bold text-white uppercase tracking-wider">Steam-Oil Ratio (SOR) vs. Electrical Load</h3>
                    <span className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 font-mono">THERMODYNAMIC EFFICIENCY KNEE-POINT</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-zinc-200 border border-purple-500/20">
                    SOR: {currentMetrics.steamOilRatio}
                  </span>
                </div>

                <div className="h-72 w-full">
                  <LazyChart
                    style={{ height: '100%', width: '100%' }}
                    option={{
                      backgroundColor: 'transparent',
                      tooltip: {
                        trigger: 'axis',
                        backgroundColor: 'rgba(9, 11, 16, 0.95)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        textStyle: { color: '#f1f5f9', fontFamily: 'monospace', fontSize: 11 }
                      },
                      legend: {
                        data: ['Steam-Oil Ratio (SOR)', 'Power Draw (kW·h)'],
                        top: 0,
                        textStyle: { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }
                      },
                      grid: { top: 35, bottom: 25, left: 45, right: 45 },
                      xAxis: {
                        type: 'category',
                        data: historicalData.map(h => h.date),
                        axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
                      },
                      yAxis: [
                        {
                          type: 'value',
                          name: 'SOR',
                          nameTextStyle: { color: '#f43f5e', fontSize: 10 },
                          splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
                          axisLabel: { color: '#f43f5e', fontSize: 10, fontFamily: 'monospace' }
                        },
                        {
                          type: 'value',
                          name: 'Power (kW·h)',
                          nameTextStyle: { color: '#fbbf24', fontSize: 10 },
                          splitLine: { show: false },
                          axisLabel: { color: '#fbbf24', fontSize: 10, fontFamily: 'monospace' }
                        }
                      ],
                      series: [
                        {
                          name: 'Steam-Oil Ratio (SOR)',
                          type: 'bar',
                          yAxisIndex: 0,
                          data: historicalData.map(h => parseFloat((currentMetrics.steamOilRatio * (0.9 + (h.viscosity / 11500) * 0.2)).toFixed(2))),
                          itemStyle: {
                            color: {
                              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                              colorStops: [{ offset: 0, color: '#fb7185' }, { offset: 1, color: '#e11d48' }]
                            },
                            borderRadius: [6, 6, 0, 0]
                          }
                        },
                        {
                          name: 'Power Draw (kW·h)',
                          type: 'line',
                          yAxisIndex: 1,
                          smooth: true,
                          data: historicalData.map(h => Math.round(h.electrical_energy)),
                          lineStyle: { color: '#fbbf24', width: 3 },
                          itemStyle: { color: '#fbbf24' }
                        }
                      ]
                    }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-3 border-t border-white/[0.06] text-zinc-200 dark:text-zinc-200 light:text-slate-700">
                  <span>Baseline SOR: <strong className="text-zinc-300">3.10</strong></span>
                  <span>Current SOR: <strong className="text-amber-400">{currentMetrics.steamOilRatio}</strong></span>
                  <span>Energy Savings: <strong className="text-amber-400">18.4%</strong></span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PAGE 7: SRP PERFORMANCE — DENSE, EFFICIENT, COMPACT ENGINEERING GRID */}
        {activeTab === 'optimization' && (
          <div className="space-y-6 page-transition-wrap">
            {/* Live What-If AI Optimizer Bar & Predictive Health */}
            <div className="slide-edge-top">
              <AIWhatIfOptimizer
                currentInputs={inputs}
                currentMetrics={currentMetrics}
                onApplySetpoints={(newSetpoints) => {
                  setInputs(prev => ({ ...prev, ...newSetpoints }));
                  setLocalInputs(prev => ({ ...prev, ...newSetpoints }));
                  addAuditLog(`AI Pareto setpoints calibrated: ${newSetpoints.SPM} SPM, ${newSetpoints.stroke_length}" Stroke`);
                  showToast('AI Pareto Knee-Point setpoints active in live model!');
                }}
                onOpenDossier={() => setShowExecutiveDossier(true)}
                darkMode={darkMode}
              />
            </div>
            
            {/* Top Compact KPI Ribbon (4 Metrics in 1 Row) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Pumping Speed', val: `${inputs.SPM} SPM`, color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20', note: 'SCADA Target' },
                { label: 'Peak Rod Load', val: `${currentMetrics.rod_load} lbs`, color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20', note: `Stress: ${Math.round((currentMetrics.rod_load / 18000) * 100)}%` },
                { label: 'Motor Current', val: `${currentMetrics.motor_current} A`, color: 'text-white', badge: 'bg-white/10 border-white/20', note: 'Power Factor 0.88' },
                { label: 'Pump Fillage', val: `${currentMetrics.pump_eff}%`, color: currentMetrics.pump_eff < 75 ? 'text-amber-400' : 'text-white', badge: currentMetrics.pump_eff < 75 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/10 border-white/20', note: currentMetrics.pump_eff < 75 ? '⚠️ Fluid Pound' : '✓ Full Intake' }
              ].map((kpi, idx) => (
                <div key={idx} className={`glass-panel p-3.5 flex items-center justify-between rounded-xl hover-holo-lift cursor-default slide-edge-top stagger-${idx + 1}`}>
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-zinc-300 block">{kpi.label}</span>
                    <strong className={`text-xl font-mono ${kpi.color} block mt-0.5`}>{kpi.val}</strong>
                    <span className="text-xs font-mono text-zinc-300">{kpi.note}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${idx === 1 ? 'bg-amber-400' : 'bg-zinc-400'}`} />
                </div>
              ))}
            </div>

            {/* Main Balanced 2-Column Grid (6 : 6) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              
              {/* Left Column: 3D Unit + Integrated Steppers (6 cols) */}
              <div className="lg:col-span-6 glass-panel p-4 flex flex-col justify-between gap-3 slide-edge-left stagger-2">
                <div className="flex justify-between items-center border-b border-zinc-900/50 pb-2">
                  <div>
                    <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">Surface SRP Unit & Kinematics</h3>
                    <span className="text-xs text-zinc-300 font-mono">LIVE SURFACE MECHANICAL TWIN (BGW-014)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Live Sync</span>
                  </div>
                </div>

                {/* Compact 3D Viewport */}
                <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden relative border border-slate-300 dark:border-white/10 shadow-lg bg-slate-50 dark:bg-black/40">
                  <div ref={activeTab === 'optimization' ? set3DContainer : null} className="w-full h-full relative" />
                </div>

                {/* Compact 3-Parameter Stepper Grid */}
                <div className={`grid grid-cols-3 gap-2.5 pt-1 ${!illustrativeMode ? 'opacity-40 pointer-events-none' : ''}`}>
                  {[
                    { key: 'SPM', label: 'Speed', min: 2, max: 14, step: 0.5, unit: 'SPM', color: 'rose' },
                    { key: 'stroke_length', label: 'Stroke', min: 50, max: 150, step: 5, unit: 'in', color: 'indigo', fallback: 100 },
                    { key: 'valve_opening', label: 'Valve', min: 0, max: 100, step: 5, unit: '%', color: 'blue' }
                  ].map((item) => {
                    const val = parseFloat(localInputs[item.key] ?? item.fallback ?? item.min);
                    const handleStep = (dir) => {
                      const nextVal = Math.min(item.max, Math.max(item.min, val + dir * item.step));
                      handleInputChange(item.key, item.step % 1 !== 0 ? nextVal.toFixed(1) : nextVal);
                    };

                    return (
                      <div key={item.key} className="glass-panel p-2.5 rounded-xl flex flex-col justify-between gap-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="font-bold text-zinc-300 uppercase">{item.label}</span>
                          <strong className="text-amber-400">{val}{item.unit}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={!illustrativeMode || val <= item.min}
                            onClick={() => handleStep(-1)}
                            className="slider-btn h-6 w-6 text-xs"
                          >
                            −
                          </button>
                          <input
                            type="range"
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            disabled={!illustrativeMode}
                            value={val}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            className="w-full h-1 cursor-pointer accent-amber-500"
                          />
                          <button
                            type="button"
                            disabled={!illustrativeMode || val >= item.max}
                            onClick={() => handleStep(1)}
                            className="slider-btn h-6 w-6 text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Inline Action Bar */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-900/50 text-xs font-medium font-mono">
                  <span className="text-zinc-300">
                    Kinematics: <strong className="text-amber-400">{simIsPlaying ? 'LIVE RUNNING' : 'PAUSED'}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimIsPlaying(!simIsPlaying)}
                      disabled={!illustrativeMode}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        simIsPlaying ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {simIsPlaying ? 'Pause' : 'Run'}
                    </button>
                    <button
                      onClick={resetAll}
                      disabled={!illustrativeMode}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynacard Analyzer + Telemetry Matrix (6 cols) */}
              <div className="lg:col-span-6 glass-panel p-4 flex flex-col justify-between gap-3 slide-edge-right stagger-2">
                <div className="flex justify-between items-center border-b border-zinc-900/50 pb-2">
                  <div>
                    <h3 className="text-sm font-tactical font-bold text-white uppercase tracking-wider">Dynamometer Card & Diagnostic Matrix</h3>
                    <span className="text-xs text-zinc-300 font-mono">SURFACE LOAD vs POLISHED ROD POSITION (API SPEC 11E)</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-amber-400 border border-white/20">
                    API 11E
                  </span>
                </div>

                {/* Compact Dynacard Plot */}
                <div className="bg-slate-50 dark:bg-black/40  rounded-xl p-3 shadow-inner">
                  {illustrativeMode ? (
                    <DynamometerCard 
                      fillage={currentMetrics.pump_eff}
                      rodLoad={currentMetrics.rod_load}
                      SPM={inputs.SPM}
                      strokeLength={inputs.stroke_length || 100}
                    />
                  ) : (
                    <div className="h-36 flex flex-col justify-center items-center text-center">
                      <span className="text-xs font-bold text-zinc-300 font-mono uppercase">Dyno Card Locked</span>
                      <span className="text-xs text-zinc-400 mt-0.5">Switch to Sandbox mode to compute rod curves.</span>
                    </div>
                  )}
                </div>

                {/* Compact 2x2 Telemetry Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="glass-panel p-2 flex justify-between items-center rounded-lg">
                    <span className="text-zinc-300 text-xs">Peak Rod Load:</span>
                    <strong className="text-amber-400">{currentMetrics.rod_load} lbs</strong>
                  </div>
                  <div className="glass-panel p-2 flex justify-between items-center rounded-lg">
                    <span className="text-zinc-300 text-xs">Min Rod Load:</span>
                    <strong className="text-zinc-200">{(currentMetrics.rod_load * 0.38).toFixed(0)} lbs</strong>
                  </div>
                  <div className="glass-panel p-2 flex justify-between items-center rounded-lg">
                    <span className="text-zinc-300 text-xs">Flowing BHP:</span>
                    <strong className="text-amber-400">{currentMetrics.Pwf} psi</strong>
                  </div>
                  <div className="glass-panel p-2 flex justify-between items-center rounded-lg">
                    <span className="text-zinc-300 text-xs">Motor Power:</span>
                    <strong className="text-amber-400">{currentMetrics.motor_current} A</strong>
                  </div>
                </div>

                {/* Compact SCADA Health Status Alarm */}
                <div className="pt-2 border-t border-zinc-900/50">
                  {currentMetrics.pump_eff < 75 && (
                    <div className="px-3 py-1.5 bg-rose-500/15 border border-amber-500/30 text-zinc-200 font-bold flex items-center justify-between rounded-lg text-xs font-mono">
                      <span>⚠️ Fluid Pound Risk (&lt;75% Fillage)</span>
                      <span className="text-xs px-1.5 py-0.5 bg-rose-950 text-zinc-200 rounded border border-amber-500/30">ALERT</span>
                    </div>
                  )}
                  {currentMetrics.rod_load > 14000 && (
                    <div className="px-3 py-1.5 bg-rose-500/15 border border-amber-500/30 text-zinc-200 font-bold flex items-center justify-between rounded-lg text-xs font-mono">
                      <span>⚠️ Sucker Rod Overload (&gt;14k lbs)</span>
                      <span className="text-xs px-1.5 py-0.5 bg-rose-950 text-zinc-200 rounded border border-amber-500/30">ALERT</span>
                    </div>
                  )}
                  {!(currentMetrics.pump_eff < 75 || currentMetrics.rod_load > 14000) && (
                    <div className="text-xs text-amber-400 font-mono font-semibold text-center py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>All mechanical systems within API limits</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* PAGE 8: DATA SOURCES */}
        {activeTab === 'datasources' && (
          <div className="space-y-6 page-transition-wrap">
            
            {/* Disclaimer Notice Banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-mono slide-edge-top">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>PROTOTYPE MODE NOTICE:</strong> Simulation results are synthetic and require calibration with actual Oil India Limited (OIL) field data before operational deployment.
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[calc(100vh-190px)]">
              
              {/* Left Column: Calibration & Comparison (lg:col-span-8) */}
              <div className="lg:col-span-8 glass-panel p-5 flex flex-col justify-between gap-8 slide-edge-left stagger-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[18px] font-semibold text-white font-sans uppercase">Model Validation & Calibration</h3>
                    <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-semibold font-mono">NUMERICAL SIMULATION ACCURACY ASSESSMENT</span>
                  </div>

                  {/* Calibration Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-950/60 p-4 border-0 rounded-2xl font-mono text-center">
                      <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 block">R² FIT QUALITY</span>
                      <strong className="text-amber-400 text-xl block mt-1">94.2%</strong>
                      <span className="text-[12px] text-zinc-600 block mt-0.5">Calibrated vs Well BGW-014</span>
                    </div>
                    <div className="bg-zinc-950/60 p-4 border-0 rounded-2xl font-mono text-center">
                      <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 block">UNCERTAINTY MARGIN</span>
                      <strong className="text-amber-500 text-xl block mt-1">±5.5%</strong>
                      <span className="text-[12px] text-zinc-600 block mt-0.5">Within 95% Confidence Interval</span>
                    </div>
                    <div className="bg-zinc-950/60 p-4 border-0 rounded-2xl font-mono text-center">
                      <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 block">DATA QUALITY STATUS</span>
                      <strong className="text-amber-400 text-xl block mt-1">PROVEN</strong>
                      <span className="text-[12px] text-zinc-600 block mt-0.5">SCADA Logs Synchronized</span>
                    </div>
                  </div>

                  {/* Baseline-vs-Sim Comparison Grid */}
                  <div className="space-y-3">
                    <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono font-bold uppercase tracking-wider block">Baseline vs. Current Simulation Variance</span>
                    <div className="border-0 rounded-2xl overflow-hidden font-mono text-xs">
                      <div className="grid grid-cols-4 bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm p-3 border-b border-zinc-900/50 text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-bold uppercase tracking-wider">
                        <span>Metric</span>
                        <span className="text-center">Baseline</span>
                        <span className="text-center">Current Sim</span>
                        <span className="text-right">Variance</span>
                      </div>
                      {[
                        { name: 'Steam Temp', base: '220 °C', sim: `${inputs.steam_T} °C`, delta: `${inputs.steam_T - 220} °C`, active: inputs.steam_T !== 220 },
                        { name: 'Injection Pressure', base: '850 psi', sim: `${inputs.injection_pressure} psi`, delta: `${inputs.injection_pressure - 850} psi`, active: inputs.injection_pressure !== 850 },
                        { name: 'Pumping Speed', base: '7.5 SPM', sim: `${inputs.SPM} SPM`, delta: `${(inputs.SPM - 7.5).toFixed(1)} SPM`, active: inputs.SPM !== 7.5 },
                        { name: 'Heavy Oil Yield', base: '25.0 bbl/d', sim: `${currentMetrics.q_oil} bbl/d`, delta: `${(currentMetrics.q_oil - 25.0).toFixed(1)} bbl/d`, active: currentMetrics.q_oil !== 25.0 },
                        { name: 'Crude Viscosity', base: '420 cP', sim: `${currentMetrics.viscosity} cP`, delta: `${currentMetrics.viscosity - 420} cP`, active: currentMetrics.viscosity !== 420 }
                      ].map((row, idx) => (
                        <div key={idx} className="grid grid-cols-4 p-3 border-b border-zinc-900/30/50 items-center">
                          <span className="text-zinc-300 font-medium">{row.name}</span>
                          <span className="text-center text-zinc-300 dark:text-zinc-300 light:text-slate-600">{row.base}</span>
                          <span className={`text-center font-bold ${row.active ? 'text-amber-400' : 'text-zinc-200 dark:text-zinc-200 light:text-slate-700'}`}>{row.sim}</span>
                          <span className={`text-right font-bold ${row.active ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-300 light:text-slate-600'}`}>
                            {row.active && Number(row.delta.split(' ')[0]) > 0 ? '+' : ''}{row.delta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/60 rounded-2xl border-0">
                  <span className="text-[12px] font-mono text-zinc-300 dark:text-zinc-300 light:text-slate-600 uppercase tracking-widest block mb-1">Calibration Provenance Note:</span>
                  <p className="text-xs text-zinc-200 dark:text-zinc-200 light:text-slate-700 leading-normal font-sans">
                    The calibration uses a thermodynamic decay model to simulate the heated reservoir zone coupled with Vogel's inflow performance relationship (IPR) to model production drawdown in Jodhpur Sandstone formations.
                  </p>
                </div>
              </div>

              {/* Right Column: Data Provenance, Missing streams & Access (lg:col-span-4) */}
              <div className="lg:col-span-4 glass-panel p-5 flex flex-col gap-8 slide-edge-right stagger-2">
                
                {/* Data Provenance Registry */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[18px] font-semibold text-white font-sans uppercase">Data Provenance Registry</h3>
                    <span className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-semibold font-mono">VERIFIED CLASSIFICATION</span>
                  </div>

                  <div className="space-y-2">
                    {/* Category 1 */}
                    <div className="bg-zinc-950/80 p-3.5 border-0 rounded-xl space-y-1.5 font-sans">
                      <div className="flex justify-between items-center">
                        <strong className="text-[12px] font-bold text-zinc-300">1. Verified Baseline</strong>
                        <span className="text-xs bg-zinc-800 text-zinc-200 dark:text-zinc-200 light:text-slate-700 px-2 py-0.5 rounded border border-zinc-700 font-mono font-bold">STATIC</span>
                      </div>
                      <p className="text-[12px] text-zinc-200 dark:text-zinc-200 light:text-slate-700 leading-normal">
                        Jodhpur Sandstone formation geology (depth 1,180m, viscosity 11,500 cP) sourced from verified Oil India Ltd. baseline records.
                      </p>
                    </div>

                    {/* Category 2 */}
                    <div className="bg-zinc-950/80 p-3.5 border-0 rounded-xl space-y-1.5 font-sans">
                      <div className="flex justify-between items-center">
                        <strong className="text-[12px] font-bold text-amber-400">2. Authorized SCADA Logs</strong>
                        <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">LOG DATA</span>
                      </div>
                      <p className="text-[12px] text-zinc-200 dark:text-zinc-200 light:text-slate-700 leading-normal">
                        SCADA logs streamed from BGW-014 production history and injection cycle records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Missing Measurements (Empty State Checklist) */}
                <div className="space-y-4 pt-4 border-t border-zinc-900/50">
                  <div>
                    <h3 className="text-[15px] font-semibold text-zinc-300 font-sans uppercase">Missing SCADA Streams</h3>
                    <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-semibold font-mono">REQUIRED FOR VALIDATED SCADA MODE</span>
                  </div>
                  
                  <div className="space-y-2 font-sans">
                    {[
                      { code: 'BHP-LOG', name: 'Downhole Pressure stream (Pwf)', ref: 'OIL-BGW-OP-PR-02' },
                      { code: 'BHT-LOG', name: 'Bottomhole Temperature (BHT)', ref: 'OIL-BGW-OP-TE-09' },
                      { code: 'VIB-MON', name: 'Bearing vibration stream', ref: 'OIL-BGW-ME-VI-01' }
                    ].map(st => (
                      <div key={st.code} className="bg-zinc-950/60 p-3 rounded-xl border border-dashed border-zinc-900/30 flex items-center justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-bold text-zinc-200 dark:text-zinc-200 light:text-slate-700 truncate">{st.name}</span>
                          <span className="text-xs text-zinc-600 font-mono">Ref: {st.ref}</span>
                        </div>
                        <span className="px-2 py-0.5 glass-panel text-xs font-bold text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono rounded shrink-0">
                          AWAITING SOURCE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controlled Import Area */}
                <div className="space-y-4 pt-4 border-t border-zinc-900/50 font-sans">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white font-sans uppercase">Controlled Import Area</h3>
                    <span className="text-xs font-medium text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-semibold font-mono">AUTHORIZED DATASET IMPORT</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[12px] text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-mono">Paste authorized dataset (JSON):</label>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder={`{\n  "wellId": "BGW-014",\n  "reservoir_depth": 1180,\n  "API_gravity": 16.5,\n  "inputs": {\n    "steam_T": 235,\n    "injection_pressure": 900\n  }\n}`}
                      className="w-full h-32 bg-slate-50 dark:bg-black/40  rounded-xl text-slate-800 dark:text-zinc-100 shadow-sm text-zinc-300 border-0 rounded-xl p-3 text-[12px] font-mono focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {importError && (
                    <div className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-[12px] text-amber-400 leading-normal font-sans">
                      ⚠ <b>Import Error:</b> {importError}
                    </div>
                  )}

                  <button
                    onClick={handleDatasetImport}
                    className="w-full bg-[#3a86f5] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all cursor-pointer min-h-[44px]"
                  >
                    Validate & Import Dataset
                  </button>
                </div>
              </div>

            </div>

            {/* Corporate Footer */}
            <footer className="mt-8 pt-4 border-t border-zinc-900/50 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-300 dark:text-zinc-300 light:text-slate-600 font-sans gap-2 w-full">
              <div>
                <span>© 2026 Oil India Limited. Baghewala CSS–SRP Operations Control.</span>
              </div>
              <div className="flex gap-4 font-mono text-xs font-medium uppercase">
                <span>Platform: v2.4.0-production</span>
                <span>•</span>
                <span>SCADA State: Connected</span>
                <span>•</span>
                <span>Data Security: ISO 27001 TLS Mutual Auth</span>
              </div>
            </footer>
          </div>
        )}
        </TwinErrorBoundary>
      </main>


      {/* Professional Toast Notification feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-zinc-900/95 border border-amber-500/30 text-amber-400 font-mono text-sm px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <CheckCircle className="w-5.5 h-5.5 text-amber-400 flex-shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hidden fallback container to host the global 3D canvas when no page container is active */}
      <div id="three-d-hidden-fallback" style={{ display: 'none' }} />

      {/* Unified Single Three.js Viewport Component */}
      <TwinErrorBoundary>
      <Suspense fallback={
        <div style={{ width: '100%', height: '100%', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', fontFamily: 'monospace', fontSize: '11px', flexDirection: 'column', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid #3f3f46', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Loading 3D scene…
        </div>
      }>
      {!showIntro && isAuthenticated && (
        <ThreeDWellWorkspace
          ref={threeDWorkspaceRef}
          xrayExploded={xrayExploded}
          parentDOM={active3DContainer}
          SPM={inputs.SPM}
          strokeLen={inputs.stroke_length}
          Tres={currentMetrics.Tres}
          currentMetrics={currentMetrics}
          inputs={inputs}
          dataMode={dataMode}
          illustrativeMode={illustrativeMode}
          selectedAsset={selectedAsset}
          assetViewMode={assetViewMode}
          viewMode={
            activeTab === 'overview' ? 'overview' :
            activeTab === 'twin' ? 'twin' :
            activeTab === 'sim' ? 'reservoir' :
            activeTab === 'reservoir' ? 'reservoir' :
            activeTab === 'surface' ? 'surface' :
            activeTab === 'analytics' ? 'reservoir' :
            activeTab === 'optimization' ? 'pumpjack' :
            'twin'
          }
          tankViewMode={tankViewMode}
          interactionMode={['twin', 'reservoir', 'sim', 'surface'].includes(activeTab) ? 'detailed' : 'preview'}
          simIsPlaying={simIsPlaying}
          subsurfaceWellFocus={activeTab === 'reservoir' ? subsurfaceWellFocus : 'none'}
          showSubsurfaceHeatMap={activeTab === 'reservoir' ? showSubsurfaceHeatMap : true}
          showSubsurfaceOilFlow={activeTab === 'reservoir' ? showSubsurfaceOilFlow : true}
          groundTransparency={activeTab === 'reservoir' ? groundTransparency : 0.22}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          
          darkMode={darkMode}
          quality={graphicsQuality}
          visible={['twin', 'reservoir', 'optimization'].includes(activeTab)}
        />
      )}
      </Suspense>
      </TwinErrorBoundary>
    
      {/* ── COMMAND PALETTE (CTRL+K / CMD+K) MODAL ── */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-3xl border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-hidden font-sans">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
              <span className="text-amber-500 font-bold text-lg font-mono">⌘</span>
              <input
                type="text"
                autoFocus
                placeholder="Search commands, navigate decks, run solvers (e.g. 'digital twin', 'esd', 'export')..."
                value={searchCmd}
                onChange={(e) => setSearchCmd(e.target.value)}
                className="w-full bg-transparent text-slate-900 dark:text-white text-sm outline-none placeholder:text-zinc-400 font-sans"
              />
              <span className="text-[10px] font-mono px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-zinc-400 rounded-lg border border-slate-200 dark:border-zinc-700">
                ESC
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-zinc-900 text-xs font-mono">
              <div className="p-1 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 px-3 uppercase block">Navigate Decks</span>
                {menuItems
                  .filter(m => m.label.toLowerCase().includes(searchCmd.toLowerCase()))
                  .map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveTab(m.id);
                        setShowCommandPalette(false);
                        playHoloSound('tab');
                        showToast(`Switched to ${m.label}`);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="font-bold text-sm">{m.label}</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">{m.desc}</span>
                    </button>
                  ))}
              </div>

              <div className="p-1 space-y-1 pt-2">
                <span className="text-[10px] font-bold text-zinc-400 px-3 uppercase block">Quick Actions</span>
                <button
                  onClick={() => {
                    setDarkMode(!darkMode);
                    setShowCommandPalette(false);
                    playHoloSound('click');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold">Toggle Theme ({darkMode ? 'Light' : 'Dark'})</span>
                  <span className="text-zinc-400">Appearance</span>
                </button>
                <button
                  onClick={() => {
                    runOptimization();
                    setShowCommandPalette(false);
                    playHoloSound('tab');
                    setActiveTab('surface');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-zinc-300">Run NSGA-II Scenario Solver</span>
                  <span className="text-zinc-400">Optimizer</span>
                </button>
                <button
                  onClick={() => {
                    setShowCommandPalette(false);
                    resetAll();
                    playHoloSound('click');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-amber-50 dark:hover:bg-zinc-900 text-slate-800 dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-amber-400">Reset Physics to Baseline</span>
                  <span className="text-zinc-400">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official OIL Executive Operational Dossier Modal */}
      <OfficialExecutiveDossier
        isOpen={showExecutiveDossier}
        onClose={() => setShowExecutiveDossier(false)}
        currentInputs={inputs}
        currentMetrics={currentMetrics}
        wellId={selectedWell?.id || 'BGW-014'}
        darkMode={darkMode}
      />

    </div>
  );
}

export default App;
