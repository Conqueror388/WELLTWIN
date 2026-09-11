import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { ArrowDown, Sun, Moon, ChevronRight } from 'lucide-react';

export default function CinematicIntroPage({
  onEnter,
  onProgress,
  darkMode = true,
  onToggleTheme,
  _inputs = { injection_pressure: 1850, steam_T: 310, SPM: 6.5 },
  _currentMetrics = { q_oil: 142, SOR: 3.2, health_score: 94 },
  _connectionState = 'normal'
}) {
  const containerRef = useRef(null);
  const canvasMountRef = useRef(null);
  const titleBoxRef = useRef(null);
  const flashOverlayRef = useRef(null);
  const scrollPillRef = useRef(null);
  const progressBarRef = useRef(null);

  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const isFinishedRef = useRef(false);
  const isAutoAdvancing = useRef(true);
  const onEnterRef = useRef(onEnter);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onProgressRef.current = onProgress;
  }, [onEnter, onProgress]);

  // ── PRECISION CAD RESERVOIR WIREFRAME SCENE ────────────────────────────────
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(darkMode ? 0x04060a : 0xf4f6fb, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        precision: 'mediump'
      });
      renderer.setClearColor(darkMode ? 0x04060a : 0xf4f6fb, 1.0);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1, 1.25));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = darkMode ? 1.2 : 1.1;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed in CinematicIntroPage:', e);
      return;
    }

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, darkMode ? 1.0 : 1.5);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xd97706, darkMode ? 2.5 : 3.5);
    goldKeyLight.position.set(10, 20, 20);
    scene.add(goldKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x0284c7, darkMode ? 1.8 : 2.5);
    cyanRimLight.position.set(-15, -10, 15);
    scene.add(cyanRimLight);

    // ── 1. ARCHITECTURAL RESERVOIR MATRIX ──────────────────────────────────
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const icoGeo = new THREE.IcosahedronGeometry(4.8, 1);
    const wireGeo = new THREE.WireframeGeometry(icoGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: darkMode ? 0xf59e0b : 0xb45309,
      transparent: true,
      opacity: darkMode ? 0.75 : 0.9,
      linewidth: 1.5
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    const innerGeo = new THREE.SphereGeometry(2.4, 20, 20);
    const innerMat = new THREE.MeshBasicMaterial({
      color: darkMode ? 0xfef08a : 0xf59e0b,
      transparent: true,
      opacity: darkMode ? 0.45 : 0.6
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    const ring1Geo = new THREE.RingGeometry(6.8, 6.88, 48);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: darkMode ? 0xfbbf24 : 0xd97706,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: darkMode ? 0.6 : 0.85
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(8.5, 8.58, 48);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: darkMode ? 0x38bdf8 : 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: darkMode ? 0.45 : 0.75
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // ── 2. PRE-SCULPTED SUBSURFACE GEOLOGY GRID ──
    const gridCols = 22;
    const gridRows = 22;
    const gridGeo = new THREE.PlaneGeometry(80, 80, gridCols - 1, gridRows - 1);
    gridGeo.rotateX(-Math.PI / 2.3);
    gridGeo.translate(0, -6.5, -4);

    const posAttr = gridGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const bx = posAttr.getX(i);
      const bz = posAttr.getZ(i);
      const wave1 = Math.sin(bx * 0.12) * Math.cos(bz * 0.14) * 2.2;
      const wave2 = Math.cos(bx * 0.20 - bz * 0.16) * 1.0;
      posAttr.setY(i, posAttr.getY(i) + wave1 + wave2);
    }
    gridGeo.computeVertexNormals();

    const gridWireMat = new THREE.MeshStandardMaterial({
      color: darkMode ? 0xf59e0b : 0xd97706,
      wireframe: true,
      transparent: true,
      opacity: darkMode ? 0.35 : 0.45,
      emissive: darkMode ? 0xb45309 : 0x7c2d12,
      emissiveIntensity: 0.3
    });
    const terrainGridMesh = new THREE.Mesh(gridGeo, gridWireMat);
    scene.add(terrainGridMesh);

    // Geological Horizon Iso-Contour Lines
    const contourGroup = new THREE.Group();
    scene.add(contourGroup);

    const contourCount = 4;
    const contourLines = [];
    for (let c = 0; c < contourCount; c++) {
      const ringG = new THREE.RingGeometry(12 + c * 5.0, 12.08 + c * 5.0, 36);
      ringG.rotateX(-Math.PI / 2.3);
      ringG.translate(0, -6.8 - c * 0.8, -4);
      const ringM = new THREE.MeshBasicMaterial({
        color: darkMode ? 0xf59e0b : 0xd97706,
        transparent: true,
        opacity: darkMode ? 0.22 : 0.32,
        side: THREE.DoubleSide
      });
      const cMesh = new THREE.Mesh(ringG, ringM);
      contourGroup.add(cMesh);
      contourLines.push(cMesh);
    }

    // ── ANIMATION LOOP ─────────────────────────────────
    let clock = new THREE.Clock();
    let animId;
    let lastTime = performance.now();

    const animate = (now) => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const time = clock.getElapsedTime();

      // Paced cinematic auto-advance (Smooth and responsive)
      if (isAutoAdvancing.current && targetScrollRef.current < 1.0) {
        targetScrollRef.current = Math.min(1.0, targetScrollRef.current + dt * 0.35);
      }

      // Snappy high-frequency damping
      const lerpSpeed = 1 - Math.exp(-11.0 * dt);
      currentScrollRef.current += (targetScrollRef.current - currentScrollRef.current) * lerpSpeed;
      const p = Math.max(0, Math.min(1.0, currentScrollRef.current));

      if (onProgressRef.current) {
        onProgressRef.current(p);
      }

      // Elegant Core Rotation
      const rotSpeed = 1.0 + p * 1.6;
      coreGroup.rotation.y = time * 0.22 * rotSpeed;
      coreGroup.rotation.x = Math.sin(time * 0.14) * 0.10;

      ring1.rotation.z = time * 0.24 * rotSpeed;
      ring2.rotation.z = -time * 0.20 * rotSpeed;

      // Subsurface terrain gentle drift
      terrainGridMesh.rotation.z = time * 0.025;

      for (let idx = 0; idx < contourLines.length; idx++) {
        contourLines[idx].rotation.z = time * (0.02 + idx * 0.01);
      }

      // Fluid Camera Progression
      camera.position.z = 32 - p * 20;
      camera.position.y = Math.sin(time * 0.2) * 0.3 - p * 1.2;
      camera.fov = 45 + p * 8;
      camera.updateProjectionMatrix();

      // UI Transitions - 2-3 contrast color architecture
      const translateY = -p * 28;
      const textOp = p < 0.60 ? 1.0 : Math.max(0, 1.0 - (p - 0.60) / 0.30);
      const exitOp = p < 0.85 ? 1.0 : Math.max(0, (1.0 - p) / 0.15);

      if (containerRef.current) {
        containerRef.current.style.opacity = exitOp.toFixed(3);
      }

      if (titleBoxRef.current) {
        titleBoxRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        titleBoxRef.current.style.opacity = textOp.toFixed(3);
      }

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      }

      if (scrollPillRef.current) {
        if (p > 0.03) {
          scrollPillRef.current.textContent = `SYNCHRONIZING DIGITAL TWIN: ${Math.round(p * 100)}%`;
        } else {
          scrollPillRef.current.textContent = 'INITIALIZING SYSTEM • SCROLL TO ACCELERATE';
        }
      }

      // Hand-Off Complete
      if (p >= 0.985 && !isFinishedRef.current) {
        isFinishedRef.current = true;
        cancelAnimationFrame(animId);
        onEnterRef.current();
        return;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [darkMode]);

  // Responsive mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.0013;
    targetScrollRef.current = Math.max(0, Math.min(1.0, targetScrollRef.current + delta));
  }, []);

  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const deltaY = (touchStartY.current - e.touches[0].clientY) * 0.0035;
    targetScrollRef.current = Math.max(0, Math.min(1.0, targetScrollRef.current + deltaY));
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleFastForward = useCallback(() => {
    targetScrollRef.current = 1.0;
    if (onEnterRef.current) {
      onEnterRef.current();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        targetScrollRef.current = Math.min(1.0, targetScrollRef.current + 0.22);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        targetScrollRef.current = Math.max(0, targetScrollRef.current - 0.22);
      } else if (e.key === 'Enter' || e.key === 'Escape') {
        handleFastForward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFastForward]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`fixed inset-0 z-50 flex flex-col justify-between select-none overflow-hidden font-sans transition-colors duration-300 ${
        darkMode ? 'dark-theme bg-[#04060a] text-white' : 'light-theme bg-[#f4f6fb] text-slate-900'
      }`}
      style={{ transform: 'translateZ(0)', willChange: 'opacity' }}
    >
      {/* ── 3D CAD MATRIX VIEWPORT ── */}
      <div ref={canvasMountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* ── SUBTLE FLARE OVERLAY ── */}
      <div
        ref={flashOverlayRef}
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
        style={{
          opacity: 0,
          background: darkMode
            ? 'radial-gradient(circle at center, rgba(245,158,11,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(217,119,6,0.15) 0%, transparent 70%)'
        }}
      />

      {/* ── HEADER (STRICT 2-COLOR: WHITE + AMBER) ── */}
      <header
        className={`relative z-20 w-full px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b ${
          darkMode ? 'bg-black/80 border-zinc-800/80 text-white' : 'bg-white/90 border-slate-300 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`px-3 py-1.5 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
            darkMode 
              ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.35)] border-2 border-amber-400/80' 
              : 'bg-white shadow-[0_4px_14px_rgba(15,23,42,0.12)] border-2 border-amber-500/80'
          }`}>
            <img
              src="/oil-india-logo.png"
              alt="Oil India Limited Official Logo"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm"
            />
          </div>
          <div>
            {/* Color 1: Crisp Pure White */}
            <h1 className={`text-base font-bold font-display tracking-widest uppercase leading-none ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              OIL INDIA LIMITED
            </h1>
            {/* Color 2: High-Contrast Amber Gold */}
            <span className={`text-[10px] font-bold font-mono tracking-wider mt-0.5 block leading-none ${
              darkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              BAGHEWALA PLATFORM • CSS–SRP DIGITAL TWIN
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleFastForward}
            className={`px-3.5 py-1.5 rounded-xl border font-mono font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              darkMode
                ? 'border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
                : 'border-slate-300 bg-white text-slate-700 hover:text-amber-700 hover:border-amber-500/50 shadow-sm'
            }`}
          >
            <span>Skip Intro</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {onToggleTheme && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleTheme();
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                darkMode
                  ? 'border-zinc-800 bg-zinc-900/90 text-amber-400 hover:bg-zinc-800 hover:text-white shadow-lg'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-amber-700 shadow-md'
              }`}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* ── HERO BANNER (STRICT 2-3 HIGH-CONTRAST COLORS: WHITE, AMBER, ZINC) ── */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 max-w-7xl w-full text-left">
        <div
          ref={titleBoxRef}
          className="space-y-6 max-w-4xl text-left flex flex-col items-start"
          style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform, opacity' }}
        >
          {/* Official Emblem Badge */}
          <div className="flex items-center gap-4">
            <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-[0_0_35px_rgba(255,255,255,0.4)] border-2 border-amber-400/80 flex items-center justify-center shrink-0">
              <img
                src="/oil-india-logo.png"
                alt="Oil India Limited Corporate Logo"
                className="h-20 sm:h-24 md:h-28 w-auto object-contain"
              />
            </div>
            <div className="space-y-1.5">
              {/* Color 2: High-Contrast Amber Tag */}
              <div className={`inline-flex items-center gap-2 border px-3.5 py-1 rounded-full ${
                darkMode
                  ? 'border-amber-500/40 bg-black/80 text-amber-400'
                  : 'border-amber-600/50 bg-white text-amber-800 shadow-md font-bold'
              }`}>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
                  Maharatna CPSE • Govt. of India Enterprise
                </span>
              </div>
              {/* Color 3: Muted Clean Neutral */}
              <p className={`font-mono text-xs font-semibold ${
                darkMode ? 'text-zinc-400' : 'text-slate-600'
              }`}>
                Conquering Newer Horizons • Upstream Exploration & EOR
              </p>
            </div>
          </div>

          {/* MAIN BIG TITLE: OIL INDIA LIMITED (COLOR 1: SOLID PURE WHITE) */}
          <h1
            style={{ 
              fontFamily: "'Syncopate', 'Unbounded', sans-serif",
              textShadow: darkMode ? '0 0 25px rgba(245,158,11,0.25)' : 'none'
            }}
            className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.14em] uppercase select-none leading-none ${
              darkMode ? 'text-white' : 'text-slate-950'
            }`}
          >
            OIL INDIA LIMITED
          </h1>

          {/* SECONDARY BIG TITLE: BAGHEWALA FIELD (COLOR 2: VIBRANT AMBER GOLD) */}
          <h2
            style={{ 
              fontFamily: "'Unbounded', 'Syne', sans-serif",
              textShadow: darkMode ? '0 0 20px rgba(245,158,11,0.2)' : 'none'
            }}
            className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.18em] uppercase select-none leading-tight ${
              darkMode ? 'text-amber-400' : 'text-amber-700'
            }`}
          >
            BAGHEWALA FIELD
          </h2>

          {/* Operational Formation Badge (Color 3: Clean Neutral Text) */}
          <div className="pt-1 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className={`border px-4 py-1.5 rounded-xl font-bold ${
              darkMode
                ? 'bg-black/80 border-amber-500/30 text-zinc-300'
                : 'bg-white border-amber-500/40 text-slate-700 shadow-md'
            }`}>
              FORMATION: JODHPUR SANDSTONE (1,180M) • CYCLIC STEAM STIMULATION & SRP
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleFastForward}
              className={`px-8 py-3.5 rounded-2xl font-bold font-sans text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 ${
                darkMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_10px_25px_rgba(245,158,11,0.4)]'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_10px_25px_rgba(217,119,6,0.35)]'
              }`}
            >
              <span>Initialize Platform Control</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER TELEMETRY (STRICT 3 COLORS: WHITE, AMBER, ZINC) ── */}
      <footer className={`relative z-20 w-full px-6 py-3 border-t flex flex-wrap justify-between items-center text-xs font-mono ${
        darkMode ? 'bg-black/80 border-zinc-800/80 text-zinc-400' : 'bg-white/90 border-slate-300 text-slate-600 shadow-sm'
      } pointer-events-none`}>
        <div className="flex items-center gap-6">
          <span>OPERATOR: <b className={darkMode ? 'text-white' : 'text-slate-900'}>OIL INDIA LIMITED</b></span>
          <span>LOCATION: <b className={darkMode ? 'text-amber-400' : 'text-amber-700'}>RAJASTHAN BASIN</b></span>
          <span>PVT SOLVER: <b className={darkMode ? 'text-white' : 'text-slate-900'}>MARX-LANGENHEIM</b></span>
        </div>

        {/* Precision Progress Bar & Scroll Indicator */}
        <div className={`flex items-center gap-4 border px-5 py-2 rounded-full pointer-events-auto ${
          darkMode ? 'bg-black/80 border-amber-500/30 text-amber-400' : 'bg-white border-amber-500/50 text-amber-800 shadow-md'
        }`}>
          <div className={`w-24 h-1.5 rounded-full overflow-hidden border ${
            darkMode ? 'bg-zinc-800 border-white/10' : 'bg-slate-200 border-slate-300'
          }`}>
            <div
              ref={progressBarRef}
              className="h-full bg-amber-500 transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
          <span ref={scrollPillRef} className="font-bold tracking-wider text-[11px] uppercase">
            INITIALIZING SYSTEM • SCROLL TO ACCELERATE
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
        </div>
      </footer>
    </div>
  );
}
