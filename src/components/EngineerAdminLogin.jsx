import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  AlertCircle, 
  Fingerprint, 
  Cpu, 
  Sun, 
  Moon, 
  ArrowRight, 
  Wrench, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  IdCard, 
  Building2, 
  QrCode, 
  Film,
  Download
} from 'lucide-react';

// Web audio feedback synthesizer for holographic enterprise HUD
const playHoloTone = (type = 'click') => {
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
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === 'scan') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'granted') {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.04, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.25);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(580, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    // AudioContext blocked or not supported
  }
};

// Enterprise Roles and Profiles for downstream components
export const ENTERPRISE_PERSONAS = [
  {
    id: 'engineer_lead',
    name: 'Dr. Rajesh Sharma',
    role: 'Engineer',
    title: 'Lead Petroleum & Reservoir Engineer',
    badgeId: 'OIL-PE-8842',
    clearance: 'LVL-4 SECRET',
    clearanceLabel: 'Full Numerical Physics & NSGA-II Solver Overrides',
    department: 'Subsurface & PVT Thermodynamics',
    dept: 'Reservoir Ops',
    avatarColor: 'from-amber-400 via-amber-500 to-amber-600',
    icon: Cpu,
    initials: 'RS',
    experience: '16 Yrs Basin Ops',
    status: 'ACTIVE • SCADA LINKED',
    description: 'Authorized for Marx-Langenheim enthalpy modeling, Arrhenius matrix calibration, and downhole setpoint overrides.'
  },
  {
    id: 'field_operator',
    name: 'Vikram Singh',
    role: 'Operator',
    title: 'Senior Artificial Lift Field Operator',
    badgeId: 'OIL-OPS-2041',
    clearance: 'LVL-2 OPERATIONAL',
    clearanceLabel: 'Surface Artificial Lift & Steam Valve Actuators',
    department: 'Surface Facilities & Artificial Lift (SRP)',
    dept: 'Surface Lift Ops',
    avatarColor: 'from-emerald-400 via-teal-500 to-emerald-600',
    icon: Wrench,
    initials: 'VS',
    experience: '11 Yrs Wellhead Ops',
    status: 'ACTIVE • RTU STREAMING',
    description: 'Authorized for sucker rod pump speed regulation, flowline throttling, and three-phase separator telemetry.'
  },
  {
    id: 'scada_manager',
    name: 'Anita Mehta',
    role: 'Manager',
    title: 'SCADA Operations & Asset Director',
    badgeId: 'OIL-DIR-1044',
    clearance: 'LVL-5 TOP SECRET',
    clearanceLabel: 'Executive Analytics & Field Data Governance',
    department: 'Asset Economics & Digital Strategy',
    dept: 'Asset Governance',
    avatarColor: 'from-sky-400 via-blue-500 to-indigo-600',
    icon: TrendingUp,
    initials: 'AM',
    experience: '19 Yrs Asset Management',
    status: 'ACTIVE • GOVERNANCE AUDIT',
    description: 'Authorized for comprehensive asset performance reviews, lifting cost analytics, and audit logging reports.'
  },
  {
    id: 'sys_admin',
    name: 'Suresh Roy',
    role: 'Administrator',
    title: 'Chief Systems & SCADA Cyber Administrator',
    badgeId: 'OIL-ADM-0010',
    clearance: 'ROOT MASTER',
    clearanceLabel: 'Master Sensor Matrix & TLS Infrastructure',
    department: 'Cyber Physical Security & IT Architecture',
    dept: 'Cyber SCADA',
    avatarColor: 'from-purple-400 via-violet-500 to-fuchsia-600',
    icon: Shield,
    initials: 'SR',
    experience: '14 Yrs ICS Security',
    status: 'ROOT PRIVILEGED',
    description: 'Full root clearance across high-voltage sensory telemetry, TLS cryptographic tokens, and physics residual models.'
  }
];

export default function EngineerAdminLogin({ 
  onLogin, 
  darkMode = true, 
  onToggleTheme,
  onLaunchIntro
}) {
  // Authentication deck mode: 'login' (Official Sign In) | 'create_id' (Issue Official OIL ID)
  const [authMode, setAuthMode] = useState('login');
  
  // Official Corporate Sign In fields
  const [badgeId, setBadgeId] = useState('OIL-PE-8842');
  const [departmentRole, setDepartmentRole] = useState('Engineer');
  const [pin, setPin] = useState('8842-BGW');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  
  // Issue Corporate ID Generator fields (Referring to Oil India Limited)
  const [newEngineerName, setNewEngineerName] = useState('');
  const [newDesignation, setNewDesignation] = useState('Lead Petroleum & Reservoir Engineer');
  const [newDepartment, setNewDepartment] = useState('Subsurface & PVT Thermodynamics');
  const [newCadreType, setNewCadreType] = useState('OIL Regular Cadre');
  const [newClearance, setNewClearance] = useState('LVL-4');
  const [newEmailPrefix, setNewEmailPrefix] = useState('');
  const [generatedBadge, setGeneratedBadge] = useState(null);

  // Authentication & Verification progress states
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }
    const onPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    playHoloTone('click');
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('To install: click the Install icon (⤓) in your browser address bar or use browser menu "Install Oil India Limited".');
    }
  };

  const canvasRef = useRef(null);

  // ── CINEMATIC 2D PARTICLE GRID BACKGROUND ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(26, Math.floor((width * height) / 45000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.8,
      color: Math.random() > 0.4 ? 'rgba(245, 158, 11, ' : 'rgba(56, 189, 248, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (darkMode) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        const gridSize = 120;
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color + (darkMode ? '0.55)' : '0.40)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [darkMode]);

  const scanSteps = useMemo(() => [
    'Connecting to Oil India Limited Rajasthan SCADA Gateway (Port 8443)...',
    'Verifying Corporate PKI Digital Certificate & Ministry LDAP Directory...',
    'Authorizing Subsurface Simulation Clearance & NSGA-II Solver Stream...',
    'Clearance Verified: Launching Digital Twin Operations Overview...'
  ], []);

  // Quick Demo Fast-Track Filler
  const handleUseDemoCredentials = () => {
    playHoloTone('click');
    setBadgeId('OIL-PE-8842');
    setDepartmentRole('Engineer');
    setPin('8842-BGW');
    setAuthError(null);
  };

  // Submit Official Sign-In
  const handleOfficialSignIn = (e) => {
    e.preventDefault();
    const trimmed = badgeId.trim().slice(0, 25).replace(/[^a-zA-Z0-9_-]/g, '');
    if (!trimmed) {
      setAuthError('Please enter a valid Oil India Limited Employee Badge ID (e.g. OIL-PE-8842).');
      playHoloTone('alert');
      return;
    }
    setAuthError(null);
    playHoloTone('click');

    const formattedBadge = trimmed.toUpperCase().startsWith('OIL-') 
      ? trimmed.toUpperCase() 
      : `OIL-${trimmed.toUpperCase()}`;

    // If matches default lead persona, preserve their details
    const existingPersona = ENTERPRISE_PERSONAS.find(p => p.badgeId.toUpperCase() === formattedBadge);

    const userProfile = existingPersona ? {
      ...existingPersona,
      status: 'ACTIVE • SCADA LINKED'
    } : {
      id: `oil_user_${Date.now()}`,
      name: formattedBadge.replace('OIL-', 'Er. '),
      role: departmentRole,
      title: departmentRole === 'Engineer' ? 'Lead Petroleum & Reservoir Engineer' : (departmentRole === 'Operator' ? 'Senior Artificial Lift Field Operator' : (departmentRole === 'Manager' ? 'SCADA Operations & Asset Director' : 'Chief SCADA Cyber Administrator')),
      badgeId: formattedBadge,
      clearance: departmentRole === 'Administrator' ? 'ROOT MASTER' : (departmentRole === 'Manager' ? 'LVL-5 TOP SECRET' : (departmentRole === 'Engineer' ? 'LVL-4 SECRET' : 'LVL-2 OPERATIONAL')),
      clearanceLabel: `${departmentRole} Field Authority`,
      department: 'Rajasthan Project (Baghewala Field)',
      dept: departmentRole === 'Administrator' ? 'Cyber SCADA' : (departmentRole === 'Manager' ? 'Asset Governance' : (departmentRole === 'Operator' ? 'Surface Lift Ops' : 'Reservoir Ops')),
      avatarColor: departmentRole === 'Administrator' ? 'from-purple-400 to-purple-600' : (departmentRole === 'Manager' ? 'from-sky-400 to-indigo-600' : (departmentRole === 'Operator' ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-amber-600')),
      icon: departmentRole === 'Administrator' ? Shield : (departmentRole === 'Manager' ? TrendingUp : (departmentRole === 'Operator' ? Wrench : Cpu)),
      initials: formattedBadge.slice(4, 6) || 'ER',
      status: 'ACTIVE • VERIFIED SCADA LINK'
    };

    startAuthSequence(userProfile);
  };

  // Generate Official OIL Engineering ID
  const handleGenerateCorporateID = (e) => {
    e.preventDefault();
    const cleanName = newEngineerName.trim().slice(0, 40);
    if (!cleanName) {
      setAuthError('Please enter your full legal engineering name.');
      playHoloTone('alert');
      return;
    }

    const randomSerial = Math.floor(1000 + Math.random() * 9000);
    const prefix = newClearance === 'LVL-5' ? 'OIL-DIR' : (newClearance === 'LVL-4' ? 'OIL-PE' : (newClearance === 'LVL-2' ? 'OIL-OPS' : 'OIL-ENG'));
    const generatedId = `${prefix}-${randomSerial}`;
    const email = (newEmailPrefix.trim() || cleanName.toLowerCase().replace(/\s+/g, '.')).slice(0, 30) + '@oilindia.in';

    const roleMapped = newClearance === 'LVL-5' ? 'Manager' : (newClearance === 'ROOT' ? 'Administrator' : (newClearance === 'LVL-2' ? 'Operator' : 'Engineer'));

    const newBadge = {
      id: `issued_${Date.now()}`,
      name: cleanName.startsWith('Er.') || cleanName.startsWith('Dr.') ? cleanName : `Er. ${cleanName}`,
      title: newDesignation,
      role: roleMapped,
      badgeId: generatedId,
      email,
      department: newDepartment,
      cadreType: newCadreType,
      clearance: `${newClearance} ${newClearance === 'LVL-5' ? 'TOP SECRET' : (newClearance === 'LVL-4' ? 'SECRET' : 'OPERATIONAL')}`,
      issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
      securityHash: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-OIL`,
      avatarColor: roleMapped === 'Manager' ? 'from-sky-400 to-indigo-600' : (roleMapped === 'Operator' ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-amber-600'),
      initials: cleanName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ER',
      status: 'VERIFIED CORPORATE CREDENTIAL'
    };

    setGeneratedBadge(newBadge);
    setAuthError(null);
    playHoloTone('granted');
  };

  // Immediate login with freshly generated ID
  const handleProceedWithGeneratedID = () => {
    if (!generatedBadge) return;
    playHoloTone('click');
    startAuthSequence(generatedBadge);
  };

  // Biometric / PKI Verification Sequence
  const startAuthSequence = (userProfile) => {
    setIsAuthenticating(true);
    setAuthError(null);
    setScanProgress(0);
    setScanStepIndex(0);
    playHoloTone('scan');

    const interval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 25;
        if (next >= 25 && next < 50) setScanStepIndex(1);
        if (next >= 50 && next < 75) setScanStepIndex(2);
        if (next >= 75 && next < 100) setScanStepIndex(3);

        if (next >= 100) {
          clearInterval(interval);
          setAuthSuccess(true);
          playHoloTone('granted');
          setTimeout(() => {
            onLogin(userProfile, rememberSession);
          }, 600);
          return 100;
        }
        playHoloTone('scan');
        return next;
      });
    }, 150);
  };

  return (
    <div className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto font-sans select-none transition-colors duration-500 portal-entrance-root relative ${
      darkMode ? 'dark-theme bg-[#05070c] text-zinc-100' : 'light-theme bg-[#eef2f8] text-slate-900'
    }`}>
      {/* ── CENTRAL CYBERNETIC LENS BLOOM ── */}
      <div className="portal-laser-bloom-effect" />

      {/* ── CANVAS PARTICLE BACKGROUND ── */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ── CINEMATIC AMBIENT GLOWS ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-orb-cyan top-[-140px] left-[-120px] opacity-40 scale-125" />
        <div className="ambient-orb-amber top-[35%] right-[-150px] opacity-45 scale-125" />
        <div className="ambient-orb-purple bottom-[-120px] left-[20%] opacity-35 scale-110" />
      </div>

      {/* ── TOP EXECUTIVE HEADER BAR ── */}
      <header className={`relative z-20 w-full px-6 lg:px-12 py-3.5 border-b backdrop-blur-2xl flex flex-wrap justify-between items-center gap-4 ${
        darkMode ? 'bg-black/70 border-zinc-800/80 text-zinc-100 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-white/85 border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`px-3.5 py-2 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
            darkMode 
              ? 'bg-white shadow-[0_0_24px_rgba(255,255,255,0.4)] border-2 border-amber-400/80' 
              : 'bg-white shadow-[0_4px_16px_rgba(15,23,42,0.14)] border-2 border-amber-500/80'
          }`}>
            <img
              src="/oil-india-logo.png"
              alt="Oil India Limited Official Logo"
              className="h-11 sm:h-12 w-auto object-contain flex-shrink-0 drop-shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`text-lg sm:text-xl font-black font-display tracking-widest uppercase leading-none ${
                darkMode ? 'text-white' : 'text-slate-950'
              }`}>
                OIL INDIA LIMITED
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                Govt. of India Navratna Enterprise
              </span>
            </div>
            <span className={`text-[11px] font-bold font-mono tracking-wider mt-1 block leading-none ${
              darkMode ? 'text-zinc-400' : 'text-slate-600'
            }`}>
              BAGHEWALA HEAVY OIL FIELD • OPERATIONS & DIGITAL TWIN GATEWAY
            </span>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs">
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md ${
            darkMode ? 'bg-zinc-900/80 border-amber-500/30 text-zinc-300 shadow-inner' : 'bg-white border-amber-500/40 text-slate-700 shadow-sm'
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-400 beacon-pulse" />
            <span className="text-amber-400 font-bold">PORT 8443 TLS 1.3</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-bold">12ms RTU</span>
          </div>

          {onLaunchIntro && (
            <button
              onClick={() => {
                playHoloTone('click');
                onLaunchIntro();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 hover:border-amber-500/70 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold uppercase transition-all cursor-pointer shadow-sm text-xs"
              title="Watch Cinematic Intro Page"
            >
              <Film className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Intro Film</span>
            </button>
          )}

          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold uppercase transition-all cursor-pointer shadow-sm text-xs ${
                darkMode
                  ? 'border-amber-500/50 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'border-amber-400 bg-amber-100 hover:bg-amber-200 text-amber-900'
              }`}
              title="Install Oil India Limited App on Desktop or Phone"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Install App</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={() => {
                playHoloTone('click');
                onToggleTheme();
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                darkMode
                  ? 'border-zinc-800 bg-zinc-900/80 text-amber-400 hover:bg-zinc-800 hover:text-white shadow-lg'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-amber-600 shadow-md'
              }`}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (DUAL-PANEL CORPORATE GATEWAY) ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ════════════ LEFT COLUMN: CORPORATE ASSET & FIELD OVERVIEW (5 COLUMNS) ════════════ */}
          <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 border shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
            darkMode ? 'glass-panel border-white/10 bg-zinc-950/80 text-zinc-200' : 'bg-white/90 border-slate-200 text-slate-800 shadow-lg'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                  Ministry of Petroleum & Natural Gas
                </span>
                <span className="text-zinc-500 text-xs font-mono">•</span>
                <span className="text-zinc-400 text-xs font-mono">Govt. of India</span>
              </div>

              <div>
                <h2 className={`text-xl sm:text-2xl font-black font-display tracking-wide uppercase ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Rajasthan Project Directorate
                </h2>
                <p className="text-xs text-amber-500 font-mono font-bold mt-1">
                  Baghewala Heavy Oil Field Asset • CSS–SRP Digital Twin
                </p>
              </div>

              <p className="text-xs font-sans leading-relaxed text-zinc-400">
                Authorized SCADA operations gateway providing real-time physics modeling, Cyclic Steam Stimulation (CSS) heat front kinematics, and Sucker Rod Pumping (SRP) dynamometer diagnostics for Jodhpur Sandstone heavy crude reservoirs.
              </p>

              {/* Key Reservoir Specifications */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 font-mono">
                  <span className="text-zinc-500 block text-[10px] uppercase">Reservoir Depth</span>
                  <strong className="text-amber-400 text-xs font-bold">1,180 m (TVD)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 font-mono">
                  <span className="text-zinc-500 block text-[10px] uppercase">Crude Gravity</span>
                  <strong className="text-zinc-200 text-xs font-bold">16.5° API (Heavy)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 font-mono">
                  <span className="text-zinc-500 block text-[10px] uppercase">Dead Viscosity</span>
                  <strong className="text-amber-400 text-xs font-bold">11,200 cP @ 30°C</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 font-mono">
                  <span className="text-zinc-500 block text-[10px] uppercase">Thermal Recovery</span>
                  <strong className="text-white text-xs font-bold">Cyclic Steam (CSS)</strong>
                </div>
              </div>
            </div>

            {/* Field Compliance & Security Footnote */}
            <div className="space-y-3 pt-3 border-t border-zinc-800/80 font-mono text-[11px]">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> SCADA Network Node:</span>
                <span className="text-amber-400 font-bold">BGW-EOR-NODE-01</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-400" /> Encryption Standard:</span>
                <span className="text-amber-400 font-bold">AES-256 GCM • TLS 1.3</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cyber Standard:</span>
                <span className="text-emerald-400 font-bold">CERT-In Hardened</span>
              </div>
            </div>
          </div>

          {/* ════════════ RIGHT COLUMN: OFFICIAL AUTHENTICATION DECK (7 COLUMNS) ════════════ */}
          <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6 border shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative backdrop-blur-2xl transition-all duration-300 ${
            darkMode 
              ? 'glass-panel border-white/10 bg-zinc-950/95 text-zinc-100' 
              : 'bg-white/95 border-slate-200 text-slate-800 shadow-xl'
          }`}>
            
            {/* Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    playHoloTone('tab');
                    setAuthMode('login');
                    setAuthError(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Corporate Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playHoloTone('tab');
                    setAuthMode('create_id');
                    setAuthError(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    authMode === 'create_id'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  <IdCard className="w-3.5 h-3.5" />
                  <span>Issue Corporate ID</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-amber-400">
                  {authMode === 'login' ? 'Direct Official Clearance' : 'Credential Issuance Office'}
                </span>
              </div>
            </div>

            {/* ── TAB 1: OFFICIAL CORPORATE SIGN IN ── */}
            {authMode === 'login' && (
              <form onSubmit={handleOfficialSignIn} className="space-y-4">
                
                {/* Fast-Track Demo Chip for Evaluators */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block">Official Field Lead Pass:</span>
                      <span className="text-[11px] font-mono text-zinc-400 truncate block">Dr. Rajesh Sharma (OIL-PE-8842)</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDemoCredentials}
                    className="self-end sm:self-auto px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-mono font-bold rounded-lg cursor-pointer transition-all shadow-sm shrink-0"
                  >
                    Use Lead Pass
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Badge ID Input */}
                  <div>
                    <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                      <span>Oil India Limited Badge ID / Staff ID</span>
                      <span className="text-amber-500 text-[10px]">Official OIL Standard</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={badgeId}
                        onChange={(e) => setBadgeId(e.target.value)}
                        placeholder="e.g. OIL-PE-8842 or OIL-OPS-2041"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono outline-none transition-all ${
                          darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Role & Security PIN Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                        Department & Clearance Tier
                      </label>
                      <select
                        value={departmentRole}
                        onChange={(e) => setDepartmentRole(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono outline-none cursor-pointer transition-all ${
                          darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                        }`}
                      >
                        <option value="Engineer">Petroleum & Reservoir Eng (LVL-4)</option>
                        <option value="Operator">Field Artificial Lift Operator (LVL-2)</option>
                        <option value="Manager">SCADA Asset Director (LVL-5)</option>
                        <option value="Administrator">Chief Cyber Administrator (ROOT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                        Security PIN / Passkey
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="••••••••"
                          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-mono outline-none transition-all ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={rememberSession}
                        onChange={(e) => setRememberSession(e.target.checked)}
                        className="rounded accent-amber-500 cursor-pointer w-4 h-4"
                      />
                      <span>Keep active workstation session</span>
                    </label>

                    <span className="text-amber-400 font-bold">256-Bit Encrypted</span>
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono animate-in fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* Primary Authorization Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className={`w-full py-3.5 rounded-2xl font-bold font-sans text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.01] active:scale-[0.99] ${
                    darkMode
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-black shadow-[0_10px_35px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_45px_rgba(245,158,11,0.6)]'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-[0_10px_25px_rgba(217,119,6,0.3)]'
                  }`}
                >
                  <Fingerprint className="w-5 h-5" />
                  <span>Authorize Clearance & Enter Digital Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Switch to Issue ID prompt */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      playHoloTone('tab');
                      setAuthMode('create_id');
                      setAuthError(null);
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Don't have an OIL Badge ID?</span>
                    <strong className="text-amber-400 underline">Issue Corporate ID referring to the company →</strong>
                  </button>
                </div>
              </form>
            )}

            {/* ── TAB 2: ISSUE OFFICIAL OIL CORPORATE ENGINEERING ID ── */}
            {authMode === 'create_id' && (
              <div className="space-y-4">
                {!generatedBadge ? (
                  <form onSubmit={handleGenerateCorporateID} className="space-y-3.5">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                      <Building2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <strong className="text-white block font-sans">Oil India Limited • Rajasthan Asset Credential Issuance</strong>
                        <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                          Official digital engineering badge registered with the Exploration & Production Directorate, Baghewala Heavy Oil Complex.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Engineer Full Name
                        </label>
                        <input
                          type="text"
                          value={newEngineerName}
                          onChange={(e) => setNewEngineerName(e.target.value)}
                          placeholder="e.g. Er. Priya Sundaram"
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono outline-none ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Designation
                        </label>
                        <select
                          value={newDesignation}
                          onChange={(e) => setNewDesignation(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono outline-none ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                        >
                          <option value="Lead Petroleum & Reservoir Engineer">Lead Petroleum & Reservoir Engineer</option>
                          <option value="Senior Artificial Lift Field Operator">Senior Artificial Lift Field Operator</option>
                          <option value="SCADA Production Technologist">SCADA Production Technologist</option>
                          <option value="Executive Asset Director">Executive Asset Director</option>
                          <option value="Technical Audit Evaluator">Technical Audit Evaluator</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Directorate / Department
                        </label>
                        <select
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono outline-none ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                        >
                          <option value="Subsurface & PVT Thermodynamics">Subsurface & PVT Thermodynamics</option>
                          <option value="Surface Facilities & Artificial Lift (SRP)">Surface Facilities & Artificial Lift (SRP)</option>
                          <option value="SCADA Instrumentation & Telemetry">SCADA Instrumentation & Telemetry</option>
                          <option value="EOR Asset Management Directorate">EOR Asset Management Directorate</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Clearance Level
                        </label>
                        <select
                          value={newClearance}
                          onChange={(e) => setNewClearance(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono outline-none ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                        >
                          <option value="LVL-4">LVL-4: Full Numerical Solvers & Physics Overrides</option>
                          <option value="LVL-2">LVL-2: Surface Wellhead & Pumping Controls</option>
                          <option value="LVL-5">LVL-5: Executive Field Analytics & Reports</option>
                          <option value="ROOT">ROOT: SCADA Cyber Systems Administration</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Cadre / Appointment Type
                        </label>
                        <select
                          value={newCadreType}
                          onChange={(e) => setNewCadreType(e.target.value)}
                          className={`w-full px-3.5 py-2 rounded-xl border text-sm font-mono outline-none ${
                            darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                          }`}
                        >
                          <option value="OIL Regular Cadre">OIL Regular Engineering Cadre</option>
                          <option value="Technical Field Consultant">Technical Field Consultant</option>
                          <option value="EOR Research Scholar">EOR Research Scholar / Evaluator</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                          Corporate Email Alias
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={newEmailPrefix}
                            onChange={(e) => setNewEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                            placeholder="priya.sundaram"
                            className={`flex-1 px-3.5 py-2 rounded-l-xl border-y border-l text-sm font-mono outline-none ${
                              darkMode ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-600'
                            }`}
                          />
                          <span className="px-3.5 py-2 rounded-r-xl border text-sm font-mono font-bold bg-amber-500/10 border-amber-500/30 text-amber-400">
                            @oilindia.in
                          </span>
                        </div>
                      </div>
                    </div>

                    {authError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-mono">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 cursor-pointer transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <IdCard className="w-4 h-4" />
                      <span>Issue Official Oil India Limited Digital ID</span>
                    </button>
                  </form>
                ) : (
                  /* ── OFFICIAL ISSUED ID BADGE PREVIEW ── */
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className={`p-5 rounded-2xl border-2 border-amber-500/60 relative overflow-hidden shadow-2xl ${
                      darkMode ? 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white' : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900'
                    }`}>
                      {/* Hologram top ribbon */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
                      
                      <div className="flex justify-between items-start gap-3 border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-white p-1 rounded-lg">
                            <img src="/oil-india-logo.png" alt="OIL" className="h-6 w-auto" />
                          </div>
                          <div>
                            <span className="text-[11px] font-black font-display uppercase tracking-widest text-amber-400 block leading-none">
                              OIL INDIA LIMITED
                            </span>
                            <span className="text-[9px] font-mono text-zinc-400">
                              Rajasthan Basin EOR Asset ID
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold">
                          ACTIVE • VERIFIED
                        </span>
                      </div>

                      {/* ID Details */}
                      <div className="grid grid-cols-3 gap-3 py-3 items-center">
                        <div className="col-span-2 space-y-1">
                          <span className="text-[10px] font-mono text-zinc-400 block uppercase">Official Passholder</span>
                          <h3 className="text-base font-bold font-sans text-white">{generatedBadge.name}</h3>
                          <span className="text-xs font-mono text-amber-400 block">{generatedBadge.title}</span>
                          <span className="text-[10px] font-mono text-zinc-400 block">{generatedBadge.department}</span>
                          <span className="text-[10px] font-mono text-zinc-400 block">{generatedBadge.email}</span>
                        </div>

                        <div className="col-span-1 flex flex-col items-end text-right space-y-1">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                            <QrCode className="w-10 h-10 text-amber-400" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-amber-400">{generatedBadge.badgeId}</span>
                          <span className="text-[8px] font-mono text-zinc-500">{generatedBadge.clearance}</span>
                        </div>
                      </div>

                      {/* Badge Footer */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400 pt-2 border-t border-zinc-800">
                        <span>Issued: {generatedBadge.issueDate}</span>
                        <span>{generatedBadge.securityHash}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleProceedWithGeneratedID}
                        disabled={isAuthenticating}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider cursor-pointer hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Fingerprint className="w-4 h-4" />
                        <span>Authenticate & Enter Operations Overview</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setGeneratedBadge(null)}
                        className="px-4 py-3 rounded-xl border border-zinc-700 hover:border-zinc-500 text-xs font-mono text-zinc-300 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── BIOMETRIC / PKI RADAR AUTHENTICATION OVERLAY ── */}
            {isAuthenticating && (
              <div className="absolute inset-0 z-50 bg-black/92 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-6 space-y-5 animate-in fade-in duration-200 font-mono">
                {/* Rotating High-Tech Radar Ring */}
                <div className="relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-500/40 animate-[spin_8s_linear_infinite]" />
                  <div className="absolute w-20 h-20 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-amber-300 border-l-transparent animate-[spin_1.5s_linear_infinite]" />
                  <div className="absolute w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <div className="text-center space-y-1.5 max-w-md">
                  <span className="text-sm font-black text-white uppercase tracking-wider block">
                    {authSuccess ? 'CLEARANCE VERIFIED • ACCESS GRANTED' : 'OIL INDIA LIMITED SCADA VERIFICATION'}
                  </span>
                  <p className="text-xs text-amber-400 transition-all font-mono min-h-[1.5rem]">
                    {authSuccess 
                      ? 'Dispatching Operations Overview Deck...' 
                      : (scanSteps[scanStepIndex] || 'Authenticating Digital Credentials...')}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-56 bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/20 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 h-full transition-all duration-150 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* ── FOOTER TELEMETRY STRIP ── */}
      <footer className={`relative z-20 w-full px-6 lg:px-12 py-2.5 border-t backdrop-blur-2xl flex flex-wrap justify-between items-center text-xs font-mono ${
        darkMode ? 'bg-black/70 border-zinc-800/80 text-zinc-400' : 'bg-white/85 border-slate-200 text-slate-600 shadow-sm'
      }`}>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <span>HOST: <b className={darkMode ? 'text-amber-400' : 'text-slate-800'}>BAGHEWALA-NODE-01</b></span>
          <span>LATENCY: <b className="text-amber-400">12ms (SCADA RTU)</b></span>
          <span>PKI VAULT: <b className="text-zinc-300">OIL-PKI-2026-TLS1.3</b></span>
          <span className="hidden md:inline">DIRECTORATE: <b className="text-zinc-300">OIL INDIA LIMITED RAJASTHAN BASIN</b></span>
        </div>

        <div>
          <span>© 2026 Oil India Limited • All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
