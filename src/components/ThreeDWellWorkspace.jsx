import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { QUALITY_PRESETS, createMaterials, buildDetailedPipe, buildFluidPipeSegment, clearSharedGeometryCache, buildIndustrialTerminal } from './sceneHelpers';
import { buildPumpjack, buildTankFarm, buildWellhead, buildSeparator, buildSteamBoiler, buildFlareStack, buildControlSkid, buildSupportAssets, buildDownhole, buildSubsurface } from './sceneAssets';

const ThreeDWellWorkspace = forwardRef(function ThreeDWellWorkspace(
  { 
    // eslint-disable-next-line no-unused-vars
    SPM = 7.5, 
    strokeLen = 100, 
    Tres = 45, 
    currentMetrics = {}, 
    inputs = {}, 
    _dataMode = 'baseline', 
    onSelectAsset, 
    viewMode = 'twin', 
    tankViewMode = 'transparent', 
    simIsPlaying = true,
    subsurfaceWellFocus = 'none',
    showSubsurfaceHeatMap = true,
    showSubsurfaceOilFlow = true,
    groundTransparency = 0.22,
    quality = 'High',
    visible = true,
    interactionMode = 'detailed',
    xrayExploded = false,
    parentDOM = null,
    illustrativeMode = false,
    selectedAsset: selectedAssetProp = null,
    assetViewMode = 'normal',
    darkMode = true
  },
  ref
) {
  const mountRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const cameraReadoutRef = useRef(null);
  const resizeRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);

  const resetCameraFn = useRef(null);
  const presetCameraFn = useRef(null);

  const [internalXray, setInternalXray] = useState(false);
  const isXrayActive = xrayExploded || internalXray;
  const isXrayActiveRef = useRef(isXrayActive);
  useEffect(() => {
    isXrayActiveRef.current = isXrayActive;
  }, [isXrayActive]);

  const zoomInFn = useRef(null);
  const zoomOutFn = useRef(null);

  // Imperative handles exposed to App.jsx
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (resetCameraFn.current) resetCameraFn.current();
    },
    presetCamera: (presetId) => {
      if (presetCameraFn.current) presetCameraFn.current(presetId);
    },
    zoomIn: () => {
      if (zoomInFn.current) zoomInFn.current();
    },
    zoomOut: () => {
      if (zoomOutFn.current) zoomOutFn.current();
    },
    setXray: (val) => setInternalXray(!!val),
    toggleXray: () => setInternalXray(v => !v),
    getXray: () => isXrayActiveRef.current
  }));

  const [fallbackContainer] = useState(() => {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.style.display = 'none';
      document.body.appendChild(div);
      return div;
    }
    return null;
  });

  useEffect(() => {
    return () => {
      if (fallbackContainer && fallbackContainer.parentNode) {
        fallbackContainer.parentNode.removeChild(fallbackContainer);
      }
    };
  }, [fallbackContainer]);

  const [hoveredEquipment, setHoveredEquipment] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isSubsurfaceMode, setIsSubsurfaceMode] = useState(true);
  const [labelMode] = useState('key');
  const selectedLabelDOMRef = useRef(null);
  const flowVelTextRef = useRef(null);
  const flowVelBarRef = useRef(null);

  // Refs for tracking animation loops to prevent rebuilding Three.js scene
  const isSubsurfaceModeRef = useRef(isSubsurfaceMode);
  const tankViewModeRef = useRef(tankViewMode);
  const selectedAssetRef = useRef(selectedAsset);
  const inputsRef = useRef(inputs);
  const currentMetricsRef = useRef(currentMetrics);
  const viewModeRef = useRef(viewMode);
  const onSelectAssetRef = useRef(onSelectAsset);
  const simIsPlayingRef = useRef(simIsPlaying);
  const subsurfaceWellFocusRef = useRef(subsurfaceWellFocus);
  const showSubsurfaceHeatMapRef = useRef(showSubsurfaceHeatMap);
  const showSubsurfaceOilFlowRef = useRef(showSubsurfaceOilFlow);
  const groundTransparencyRef = useRef(groundTransparency);

  const isTabVisibleRef = useRef(true);
  useEffect(() => {
    const handleVisChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, []);

  const visibleRef = useRef(visible);
  useEffect(() => { visibleRef.current = visible; }, [visible]);

  const interactionModeRef = useRef(interactionMode);
  useEffect(() => { interactionModeRef.current = interactionMode; }, [interactionMode]);

  const [oilFlowMode]                 = useState('normal');
  const [flowPaused]                  = useState(false);
  const [showFlowDir]                 = useState(true);
  const [selectedPipeInfo, setSelectedPipeInfo] = useState(null);

  const flowVelocityRef   = useRef(0);
  const flowPausedRef     = useRef(false);
  const oilFlowModeRef    = useRef('normal');
  const showFlowDirRef    = useRef(true);
  const fluidRegistryRef  = useRef([]);
  const isVisibleRef      = useRef(visible);
  useEffect(() => { 
    isVisibleRef.current = visible;
    if (visible && resizeRef.current) {
      setTimeout(() => {
        resizeRef.current();
      }, 20);
    }
  }, [visible]);

  useEffect(() => { flowPausedRef.current = flowPaused; }, [flowPaused]);
  useEffect(() => { oilFlowModeRef.current = oilFlowMode; }, [oilFlowMode]);
  useEffect(() => { showFlowDirRef.current = showFlowDir; }, [showFlowDir]);

  useEffect(() => { isSubsurfaceModeRef.current = isSubsurfaceMode; }, [isSubsurfaceMode]);
  useEffect(() => { tankViewModeRef.current = tankViewMode; }, [tankViewMode]);
  useEffect(() => { selectedAssetRef.current = selectedAsset; }, [selectedAsset]);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);
  useEffect(() => { currentMetricsRef.current = currentMetrics; }, [currentMetrics]);
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);
  useEffect(() => { onSelectAssetRef.current = onSelectAsset; }, [onSelectAsset]);
  useEffect(() => { simIsPlayingRef.current = simIsPlaying; }, [simIsPlaying]);
  useEffect(() => { subsurfaceWellFocusRef.current = subsurfaceWellFocus; }, [subsurfaceWellFocus]);
  useEffect(() => { showSubsurfaceHeatMapRef.current = showSubsurfaceHeatMap; }, [showSubsurfaceHeatMap]);
  useEffect(() => { showSubsurfaceOilFlowRef.current = showSubsurfaceOilFlow; }, [showSubsurfaceOilFlow]);
  useEffect(() => { groundTransparencyRef.current = groundTransparency; }, [groundTransparency]);

  const assetViewModeRef = useRef(assetViewMode);
  useEffect(() => { assetViewModeRef.current = assetViewMode; }, [assetViewMode]);

  useEffect(() => {
    if (!selectedAssetProp) {
      setSelectedAsset(null);
      if (resetCameraFn.current) resetCameraFn.current();
    } else {
      setSelectedAsset(selectedAssetProp);
      if (presetCameraFn.current) {
        presetCameraFn.current(selectedAssetProp.id);
      }
    }
  }, [selectedAssetProp]);

  // ── Trigger window resize on parentDOM container change ──────────────────
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 30);
  }, [parentDOM]);

  // Maintain clean studio background in Digital Twin without blur haze
  useEffect(() => {
    if (sceneRef.current && rendererRef.current) {
      const isRes = viewModeRef.current === 'reservoir' || viewModeRef.current === 'subsurface';
      const bgHex = isRes ? '#080b13' : (darkMode ? '#080b13' : '#eef2f6');
      sceneRef.current.background = new THREE.Color(bgHex);
      sceneRef.current.fog = null;
      rendererRef.current.setClearColor(new THREE.Color(bgHex), 1);
    }
  }, [darkMode, viewMode]);

  // Watch for viewMode changes and trigger camera transitions instantly without rebuilding scene
  useEffect(() => {
    if (presetCameraFn.current) {
      presetCameraFn.current(viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    const Q = QUALITY_PRESETS[quality] || QUALITY_PRESETS.Default;
    const container = canvasContainerRef.current;

    // Scene
    const scene = new THREE.Scene();
    const initBgHex = darkMode ? '#080b13' : '#0e1422';
    scene.background = new THREE.Color(initBgHex);
    // Remove heavy exponential fog that causes distant assets to look hazy and blurry
    scene.fog = null;
    sceneRef.current = scene;

    // Camera Configuration - Perfectly Framed for Facility & Subsurface
    const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 1000);
    const defaultTargetPos = new THREE.Vector3(0, 5, 0);
    const defaultCameraPos = new THREE.Vector3(-25, 25, 115);
    const currentCameraPos = defaultCameraPos.clone();
    const currentTargetPos = defaultTargetPos.clone();
    const targetCameraPos = defaultCameraPos.clone();
    const targetTargetPos = defaultTargetPos.clone();
    camera.position.copy(currentCameraPos);
    camera.lookAt(currentTargetPos);

    // Renderer with optimized native resolution according to quality preset
    const getDevicePR = () => {
      if (typeof window === 'undefined') return 1.0;
      const dpr = window.devicePixelRatio || 1;
      return Math.min(dpr, Q.pixelRatio || 1.25);
    };
    const pr = getDevicePR();

    const renderer = new THREE.WebGLRenderer({ 
      antialias: Q.aa !== false, 
      alpha: false, 
      powerPreference: 'high-performance',
      precision: quality === 'High' ? 'highp' : 'mediump',
      stencil: false,
      depth: true
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(pr);
    renderer.shadowMap.enabled = quality !== 'Low';
    renderer.shadowMap.type = quality === 'High' ? THREE.PCFSoftShadowMap : THREE.BasicShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(darkMode ? 0x080b13 : 0xeef2f6, 1);
    renderer.sortObjects = true;

    if (container) {
      container.innerHTML = '';
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);

      const rect = container.getBoundingClientRect();
      const cW = Math.max(1, container.clientWidth || Math.round(rect.width));
      const cH = Math.max(1, container.clientHeight || Math.round(rect.height));
      if (cW > 0 && cH > 0) {
        renderer.setPixelRatio(pr);
        renderer.setSize(cW, cH, false);
        camera.aspect = cW / cH;
        camera.updateProjectionMatrix();
      }
    }

    // Materials
    const m = createMaterials(Q);

    // Sleek, High-Tech Transparent Subsurface Crystalline Cutaway Layers
    m.capRockMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.12,
      depthWrite: false
    });

    m.sandstoneMat = new THREE.MeshStandardMaterial({
      color: '#d97706',
      roughness: 0.25,
      metalness: 0.5,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    });

    m.reservoirMaterial = new THREE.MeshStandardMaterial({
      color: '#8b5cf6', // Indigo-purple
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.20,
      emissive: '#5b21b6', // Deep purple
      emissiveIntensity: 0.65,
      depthWrite: false
    });

    m.aquiferMat = new THREE.MeshStandardMaterial({
      color: '#1e293b',
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    });

    m.strataMat = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.5,
      metalness: 0.6,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });

    // Clipping plane at z=18 to cleanly slice open the front of the geology block right at the wellbore center
    const cutawayPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 18);
    const cutawayPlanesArray = [cutawayPlane];
    m.capRockMat.clippingPlanes = cutawayPlanesArray;
    m.sandstoneMat.clippingPlanes = cutawayPlanesArray;
    m.reservoirMaterial.clippingPlanes = cutawayPlanesArray;
    m.aquiferMat.clippingPlanes = cutawayPlanesArray;
    m.strataMat.clippingPlanes = cutawayPlanesArray;

    // ── STUDIO HD LIGHTING & ENVIRONMENTAL SPECULAR HIGHLIGHTS ──
    const hemiLight = new THREE.HemisphereLight('#ffffff', '#cbd5e1', 2.5);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8);
    scene.add(ambientLight);
    
    // Key Sun Light with High-Resolution 2048px Shadows
    const sunLight = new THREE.DirectionalLight('#fffaf0', 4.5);
    sunLight.position.set(70, 95, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.00005;
    sunLight.shadow.normalBias = 0.015;
    sunLight.shadow.camera.left = -110;
    sunLight.shadow.camera.right = 110;
    sunLight.shadow.camera.top = 110;
    sunLight.shadow.camera.bottom = -110;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 350;
    sunLight.shadow.bias = -0.0001;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);

    // Rim & Fill Lights for Metallic Sheen and Depth
    const fillLight = new THREE.DirectionalLight('#bae6fd', 2.5);
    fillLight.position.set(-80, 60, -80);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#fef08a', 2.0);
    rimLight.position.set(40, 50, -90);
    scene.add(rimLight);

    const warningBeacons = [];

    // High-Tech Industrial Facility Tarmac & Equipment Foundation
    const surfaceGroup = new THREE.Group();
    scene.add(surfaceGroup);

    // Ultra-Detailed Industrial Energy Facility Terminal & Infrastructure
    buildIndustrialTerminal(surfaceGroup, m, Q);

    const masterGroup = new THREE.Group(); 
    scene.add(masterGroup);



    // Subsurface and Geology Layers
    const subAssets = buildSubsurface(masterGroup, m, currentMetricsRef.current.Tres || Tres);
    masterGroup.userData.reservoir = subAssets.reservoir;
    const downhole = buildDownhole(masterGroup, m);
    
    // Add the glowing heat sphere at the perforations
    const heatSphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const heatSphereMat = new THREE.MeshStandardMaterial({
      color: '#ff6600',
      transparent: true,
      opacity: 0.4,
      emissive: '#b45309',
      emissiveIntensity: 0.8,
      roughness: 0.35,
      metalness: 0.1,
      depthWrite: false
    });
    const heatSphere = new THREE.Mesh(heatSphereGeo, heatSphereMat);
    heatSphere.position.set(5, -22, 18);
    masterGroup.add(heatSphere);

    // ── PROMINENT UNDERGROUND THERMAL PULSE & SHOCKWAVE SYSTEM ────────────
    const subsurfacePulseGroup = new THREE.Group();
    subsurfacePulseGroup.position.set(5, -22, 18);
    masterGroup.add(subsurfacePulseGroup);

    // 1. Multiple Expanding Thermal Shockwave Shells (Volumetric Heat Pulse)
    const thermalPulseShells = [];
    for (let i = 0; i < 3; i++) {
      const shellGeo = new THREE.SphereGeometry(1.0, 24, 24);
      const shellMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? '#ff4500' : (i === 1 ? '#ff8c00' : '#ffd700'),
        transparent: true,
        opacity: 0.45,
        emissive: i === 0 ? '#ff2200' : '#ff7700',
        emissiveIntensity: 0.9,
        depthWrite: false,
        wireframe: i === 2
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      subsurfacePulseGroup.add(shellMesh);
      thermalPulseShells.push(shellMesh);
    }

    // 2. Horizontal Radial Perforation Thermal Rings (Expanding Energy Waves)
    const perforationRings = [];
    const pRingGeo = new THREE.RingGeometry(0.8, 1.4, 32);
    for (let i = 0; i < 3; i++) {
      const pRingMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#ff3b30' : '#ff9500',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const pRing = new THREE.Mesh(pRingGeo, pRingMat);
      pRing.rotation.x = -Math.PI / 2;
      pRing.position.y = -0.5 * i;
      subsurfacePulseGroup.add(pRing);
      perforationRings.push(pRing);
    }

    // 3. Flowing Perforation Energy Sparks
    const perfSparks = [];
    const sparkGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const sparkMat = new THREE.MeshBasicMaterial({ color: '#ffea00', toneMapped: false });
    for (let i = 0; i < 14; i++) {
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      subsurfacePulseGroup.add(spark);
      perfSparks.push({
        mesh: spark,
        angle: (i * Math.PI * 2) / 14,
        speed: 0.6 + Math.random() * 0.8,
        seed: Math.random() * 10
      });
    }
    // ────────────────────────────────────────────────────────────────────────

    // Add geological flow arrows inside reservoir
    const reservoirArrows = new THREE.Group();
    masterGroup.add(reservoirArrows);
    
    // Outward steam injection arrows
    const steamArrowCount = 6;
    const steamArrows = [];
    for (let i = 0; i < steamArrowCount; i++) {
      const angle = (i * Math.PI * 2) / steamArrowCount;
      const dir = new THREE.Vector3(Math.cos(angle), -0.25, Math.sin(angle)).normalize();
      const origin = new THREE.Vector3(5, -22, 18);
      const arrow = new THREE.ArrowHelper(dir, origin, 3, 0xf97316, 0.7, 0.35);
      reservoirArrows.add(arrow);
      steamArrows.push(arrow);
    }
    
    // Inward heated oil arrows pointing to pump intake at [5, -27, 18]
    const oilArrowCount = 6;
    const oilArrows = [];
    for (let i = 0; i < oilArrowCount; i++) {
      const angle = (i * Math.PI * 2) / oilArrowCount + Math.PI / 6;
      const origin = new THREE.Vector3(5 + Math.cos(angle) * 11, -26.5, 18 + Math.sin(angle) * 11);
      const arrowDir = new THREE.Vector3().subVectors(new THREE.Vector3(5, -27.5, 18), origin).normalize();
      const arrow = new THREE.ArrowHelper(arrowDir, origin, 3.2, 0xd97706, 0.7, 0.35);
      reservoirArrows.add(arrow);
      oilArrows.push(arrow);
    }

    // Surface equipment
    const pj = buildPumpjack(surfaceGroup, m);
    const tanksAsset = buildTankFarm(surfaceGroup, m);
    const wh = buildWellhead(surfaceGroup, m);
    buildSeparator(surfaceGroup, m);
    const sb = buildSteamBoiler(surfaceGroup, m);
    if (sb?.warningBeacons) warningBeacons.push(...sb.warningBeacons);
    const fl = buildFlareStack(surfaceGroup, m);
    const cs = buildControlSkid(masterGroup, m);
    buildSupportAssets(masterGroup, m);

    // ── INTERNAL WORKING PROCESS VISUALIZERS (VISIBLE WHEN ASSEMBLED & EXPLODED) ──
    // 1. Separator Internal 3-Phase Working Vortex (Gas Bubbles + Oil Spillover + Water Settle)
    const sepWorkingGroup = new THREE.Group();
    sepWorkingGroup.position.set(16, 7, -5);
    masterGroup.add(sepWorkingGroup);

    const sepBubbles = [];
    const sepBubbleGeo = new THREE.SphereGeometry(0.12, 6, 6);
    const sepGasMat = new THREE.MeshBasicMaterial({ color: '#facc15', toneMapped: false });
    const sepOilMat = new THREE.MeshBasicMaterial({ color: '#f97316', toneMapped: false });
    for (let i = 0; i < 16; i++) {
      const isGas = i % 2 === 0;
      const bMesh = new THREE.Mesh(sepBubbleGeo, isGas ? sepGasMat : sepOilMat);
      bMesh.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2);
      sepWorkingGroup.add(bMesh);
      sepBubbles.push({ mesh: bMesh, isGas, speed: 0.5 + Math.random() * 0.8, seed: Math.random() * 10 });
    }

    // 2. Steam Boiler Internal Helical Superheated Steam Coil & Burner Fire Vortex
    const boilerWorkingGroup = new THREE.Group();
    boilerWorkingGroup.position.set(-16, 4.5, -15);
    masterGroup.add(boilerWorkingGroup);

    const boilerCoilParticles = [];
    const bCoilGeo = new THREE.SphereGeometry(0.15, 6, 6);
    const bPlasmaMat = new THREE.MeshBasicMaterial({ color: '#38bdf8', toneMapped: false });
    for (let i = 0; i < 20; i++) {
      const pMesh = new THREE.Mesh(bCoilGeo, bPlasmaMat);
      boilerWorkingGroup.add(pMesh);
      boilerCoilParticles.push(pMesh);
    }

    const burnerFlameCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 12, 12),
      new THREE.MeshBasicMaterial({ color: '#ff4500', toneMapped: false, transparent: true, opacity: 0.85 })
    );
    burnerFlameCore.position.set(0, 0.5, 0);
    boilerWorkingGroup.add(burnerFlameCore);

    // 3. Wellhead Internal High-Pressure Oil Stream Jet
    const wellheadWorkingGroup = new THREE.Group();
    wellheadWorkingGroup.position.set(5, 4.5, 18);
    masterGroup.add(wellheadWorkingGroup);

    const whJetParticles = [];
    const whJetGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const whOilMat = new THREE.MeshBasicMaterial({ color: '#fbbf24', toneMapped: false });
    for (let i = 0; i < 12; i++) {
      const jMesh = new THREE.Mesh(whJetGeo, whOilMat);
      wellheadWorkingGroup.add(jMesh);
      whJetParticles.push(jMesh);
    }
    // ────────────────────────────────────────────────────────────────────────


    // ── Heat Shimmer Cones above the steam boiler exhaust stack ──
    const steamBoiler = sb.steamStation;
    const shimmerGroup = new THREE.Group();
    shimmerGroup.position.set(0, 12, -2);
    steamBoiler.add(shimmerGroup);
    
    const shimmerMat = new THREE.MeshBasicMaterial({
      color: '#ffaa66',
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const shimmerCone1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 4.0, 8, 4, true), shimmerMat);
    shimmerCone1.position.y = 2.0;
    shimmerGroup.add(shimmerCone1);

    const shimmerCone2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.5, 3.5, 8, 4, true), shimmerMat.clone());
    shimmerCone2.position.y = 1.75;
    shimmerGroup.add(shimmerCone2);
    
    steamBoiler.userData.shimmerCone1 = shimmerCone1;
    steamBoiler.userData.shimmerCone2 = shimmerCone2;

    // Overhaul Pipelines: Steam (insulated) and Oil (layered fluid system)
    const pipelineGroup = new THREE.Group(); 
    masterGroup.add(pipelineGroup);

    // ── Steam injection: Boiler → Injection wellhead (insulated, high-temp)
    buildDetailedPipe(new THREE.Vector3(-16, 4.5, -15), new THREE.Vector3(-16, 4.5, 0),  m.steamInjectionPipeMat, pipelineGroup, m, true);
    buildDetailedPipe(new THREE.Vector3(-16, 4.5,   0), new THREE.Vector3(  5, 4.5, 18), m.steamInjectionPipeMat, pipelineGroup, m, true);

    // ── Oil production: full layered fluid pipe system ─────────────────────
    const fluidGroup = new THREE.Group(); 
    masterGroup.add(fluidGroup);
    const fluidRegistry = [];
    fluidRegistryRef.current = fluidRegistry;

    buildFluidPipeSegment(
      new THREE.Vector3(5, 4.5, 18), new THREE.Vector3(5, 4.5, 0),
      fluidGroup, m, fluidRegistry, 'oil'
    );
    buildFluidPipeSegment(
      new THREE.Vector3(5, 4.5, 0), new THREE.Vector3(16, 7, -5),
      fluidGroup, m, fluidRegistry, 'oil'
    );
    buildFluidPipeSegment(
      new THREE.Vector3(16, 7, -5), new THREE.Vector3(28, 4.5, 15),
      fluidGroup, m, fluidRegistry, 'oil'
    );

    // Flow particles inside steam pipes
    const steamFlowParticles = [];
    const steamFlowGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const steamFlowMat = new THREE.MeshBasicMaterial({ color: '#fffdf5', toneMapped: false });
    const steamStart1 = new THREE.Vector3(-16, 4.5, -15);
    const steamEnd1   = new THREE.Vector3(-16, 4.5,  0);
    const steamStart2 = new THREE.Vector3(-16, 4.5,  0);
    const steamEnd2   = new THREE.Vector3(  5, 4.5, 18);
    for (let p = 0; p < 12; p++) {
      const dot = new THREE.Mesh(steamFlowGeo, steamFlowMat);
      pipelineGroup.add(dot);
      steamFlowParticles.push(dot);
    }

    // Boiler smoke particles
    const smokeGeo = new THREE.BufferGeometry();
    const smokeCount = Q.smokeCount;
    const posArr = new Float32Array(smokeCount * 3);
    const smokeSpeeds = [];
    for (let i = 0; i < smokeCount; i++) {
      posArr[i * 3] = -16 + (Math.random() - 0.5) * 0.4;
      posArr[i * 3 + 1] = 12 + Math.random() * 8;
      posArr[i * 3 + 2] = -17 + (Math.random() - 0.5) * 0.4;
      smokeSpeeds.push({ vy: 0.04 + Math.random() * 0.03, vx: 0.01 + Math.random() * 0.015, vz: (Math.random() - 0.5) * 0.008 });
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const smokeCloud = new THREE.Points(smokeGeo, new THREE.PointsMaterial({ color: '#dee2e6', size: 2.2, transparent: true, opacity: 0.35, depthWrite: false }));
    masterGroup.add(smokeCloud);

    // NOTE: All sand dunes, trees, rocks, scrub, grass, clouds, and dust have been completely removed.

    // ── Perimeter Safety Lighting Poles ──
    const lightPoles = [[-48, 40], [48, 40], [-48, -40], [48, -40]];
    lightPoles.forEach(([px, pz]) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(px, 0, pz);
      masterGroup.add(poleGroup);
      
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 6), m.concreteMat);
      base.position.y = 0.4; poleGroup.add(base);
      
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 10, 6), m.structuralSteelMat);
      mast.position.y = 5.4; poleGroup.add(mast);
      
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 1.2), m.darkSteelMat);
      head.position.set(0.4, 10.4, 0); poleGroup.add(head);
      
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), m.workLightMat);
      bulb.position.set(0.4, 10.2, 0); poleGroup.add(bulb);
    });

    // Populate default material settings on userData with selective, high-performance shadow tagging
    masterGroup.traverse(child => {
      if (child.isMesh && child.material) {
        child.userData.defaultTransparent = child.material.transparent !== undefined ? child.material.transparent : false;
        child.userData.defaultOpacity = (child.material.opacity !== undefined && !isNaN(child.material.opacity)) ? child.material.opacity : 1.0;
        child.userData.defaultDepthWrite = child.material.depthWrite !== undefined ? child.material.depthWrite : true;
        
        // Selective shadows: only large structural geometries cast shadows (saves >80% shadow draw calls)
        const name = (child.name || '').toLowerCase();
        const isTransparent = child.material.transparent && child.material.opacity < 0.6;
        const isSmallDetail = name.includes('bolt') || name.includes('rung') || name.includes('wire') || name.includes('flange') || name.includes('ring') || name.includes('chevron') || name.includes('dial') || name.includes('arrow');
        
        if (isTransparent || isSmallDetail || child.isPoints || child.isLine) {
          child.castShadow = false;
        }
        child.receiveShadow = true;
      }
    });

    // 3D Selection Ring Group
    const selectionMarkerGroup = new THREE.Group();
    selectionMarkerGroup.visible = false;
    scene.add(selectionMarkerGroup);

    const ringGeo = new THREE.RingGeometry(3.5, 4.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2; ringMesh.position.y = 0.15;
    selectionMarkerGroup.add(ringMesh);

    // Interaction controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let radius = 110, theta = -0.35, phi = 1.18;
    const updateCameraFromSpherical = () => {
      targetCameraPos.x = targetTargetPos.x + radius * Math.sin(phi) * Math.sin(theta);
      targetCameraPos.y = targetTargetPos.y + radius * Math.cos(phi);
      targetCameraPos.z = targetTargetPos.z + radius * Math.sin(phi) * Math.cos(theta);
    };
    updateCameraFromSpherical();
    currentCameraPos.copy(targetCameraPos);
    currentTargetPos.copy(targetTargetPos);

    const handleMouseDown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let lastRaycastTime = 0;

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - previousMousePosition.x; const dy = e.clientY - previousMousePosition.y;
        theta -= dx * 0.005; phi -= dy * 0.005;
        phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, phi));
        updateCameraFromSpherical();
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
      // In preview mode: skip all hover detection — orbit/pan still works above
      if (interactionModeRef.current !== 'detailed') {
        setHoveredEquipment(null);
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
        return;
      }
      
      const now = performance.now();
      if (now - lastRaycastTime < 30) return;
      lastRaycastTime = now;

      if (renderer.domElement) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(masterGroup.children, true);
        if (intersects.length > 0) {
          let target = intersects[0].object;
          while (target.parent && target.parent !== masterGroup && !target.userData.name) { target = target.parent; }
          if (target.userData.name) {
            setHoveredEquipment(target.userData);
            setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top + 15 });
            document.body.style.cursor = 'pointer'; return;
          }
        }
        setHoveredEquipment(null);
        document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const handleClick = (e) => {
      if (interactionModeRef.current !== 'detailed') {
        setSelectedPipeInfo(null);
        setSelectedAsset(null);
        return;
      }
      if (container) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(masterGroup.children, true);
        if (intersects.length > 0) {
          let target = intersects[0].object;

          // ── Check if clicked object is a fluid pipe segment mesh ──────────
          const hitSeg = fluidRegistry.find(seg =>
            seg && (seg.fluidMesh === target || seg.outerMesh === target ||
                    seg.surfMesh === target || seg.chevrons.includes(target))
          );
          if (hitSeg) {
            const inp = inputsRef.current;
            const vel = flowVelocityRef.current;
            const qOil = currentMetricsRef.current?.q_oil ?? 0;
            const pipeLabels = ['Wellhead → Junction', 'Junction → Separator', 'Separator → Tank'];
            const segIdx = fluidRegistry.indexOf(hitSeg);
            setSelectedPipeInfo({
              label:    pipeLabels[segIdx] ?? `Segment ${segIdx + 1}`,
              flowRate: Math.round(qOil * (0.85 + segIdx * 0.05)),
              velocity: (vel * 100).toFixed(1),
              pressure: Math.round((inp.injection_pressure ?? 850) * (1 - segIdx * 0.06)),
              temp:     Math.round((inp.steam_T ?? 220) * 0.38),
              viscosity: Math.round(1200 / Math.max(0.1, (inp.steam_T ?? 220) / 100)),
              valve:    Math.round(inp.valve_opening ?? 100),
            });
            return;
          }

          // ── Otherwise check for named equipment ─────────────────────────
          while (target.parent && target.parent !== masterGroup && !target.userData.name) { target = target.parent; }
          if (target.userData.name) {
            setSelectedAsset(target.userData);
            if (onSelectAssetRef.current) onSelectAssetRef.current(target.userData);
            if (target.userData.worldPos) {
              targetTargetPos.copy(target.userData.worldPos);
              radius = 42; updateCameraFromSpherical();
            }
            return;
          }
        }
        // Click on empty space — clear pipe selection
        setSelectedPipeInfo(null);
      }
    };

    const handleMouseUp = () => { isDragging = false; };
    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('click', handleClick);
    window.addEventListener('mouseup', handleMouseUp);

    zoomInFn.current = () => {
      radius = Math.max(12, radius - 12);
      updateCameraFromSpherical();
    };
    zoomOutFn.current = () => {
      radius = Math.min(180, radius + 12);
      updateCameraFromSpherical();
    };

    const handleWheel = (e) => {
      // If user holds Shift, allow natural page scrolling through the viewport
      if (e.shiftKey) return;
      
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      const step = Math.sign(delta) * Math.max(4, radius * 0.08);
      const nextRadius = radius + step;

      // While zooming within bounds, zoom 3D model
      if (nextRadius >= 14 && nextRadius <= 176) {
        e.preventDefault();
        radius = nextRadius;
        updateCameraFromSpherical();
      }
      // If at boundary, allow page to scroll naturally
    };
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Camera preset logic bound to active viewMode or selected asset
    presetCameraFn.current = (presetId) => {
      if (presetId === 'site' || presetId === 'overview' || presetId === 'twin' || presetId === 'full') {
        setSelectedAsset(null); targetTargetPos.set(4, 5, 2);
        radius = 110; theta = -0.35; phi = 1.18; setIsSubsurfaceMode(true);
        updateCameraFromSpherical();
      } else if (presetId === 'front') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = 0.0; phi = Math.PI / 2; setIsSubsurfaceMode(false);
      } else if (presetId === 'rear') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = Math.PI; phi = Math.PI / 2; setIsSubsurfaceMode(false);
      } else if (presetId === 'left') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = -Math.PI / 2; phi = Math.PI / 2; setIsSubsurfaceMode(false);
      } else if (presetId === 'right') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = Math.PI / 2; phi = Math.PI / 2; setIsSubsurfaceMode(false);
      } else if (presetId === 'top') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = 0.0; phi = 0.01; setIsSubsurfaceMode(false);
      } else if (presetId === 'bottom') {
        targetTargetPos.set(0, 0, 0); radius = 80; theta = 0.0; phi = Math.PI - 0.01; setIsSubsurfaceMode(false);
      } else if (presetId === 'isometric') {
        targetTargetPos.set(0, 0, 0); radius = 90; theta = -Math.PI / 4; phi = Math.PI / 4; setIsSubsurfaceMode(false);
      } else if (presetId === 'pumpjack') {
        targetTargetPos.set(-7.5, 9, 18); radius = 38; theta = -0.15; phi = 1.1; setIsSubsurfaceMode(false);
      } else if (presetId === 'wellhead' || presetId === 'wellbore') {
        targetTargetPos.set(5, 5, 18); radius = 30; theta = -0.3; phi = 1.15; setIsSubsurfaceMode(false);
      } else if (presetId === 'separator') {
        targetTargetPos.set(16, 5, -5); radius = 32; theta = 0.4; phi = 1.05; setIsSubsurfaceMode(false);
      } else if (presetId === 'tanks') {
        targetTargetPos.set(28, 7, 15); radius = 42; theta = 0.6; phi = 1.1; setIsSubsurfaceMode(false);
      } else if (presetId === 'steam') {
        targetTargetPos.set(-16, 5, -15); radius = 35; theta = -0.6; phi = 1.1; setIsSubsurfaceMode(false);
      } else if (presetId === 'rig') {
        targetTargetPos.set(-28, 10, -28); radius = 45; theta = -0.5; phi = 1.15; setIsSubsurfaceMode(false);
      } else if (presetId === 'flare') {
        targetTargetPos.set(22, 10, -22); radius = 35; theta = 0.5; phi = 1.1; setIsSubsurfaceMode(false);
      } else if (presetId === 'subsurface' || presetId === 'reservoir') {
        targetTargetPos.set(5, -20, 18); radius = 42; theta = -0.32; phi = 1.32; setIsSubsurfaceMode(true);
      } else if (presetId === 'surface') {
        targetTargetPos.set(5, 5, 18); radius = 40; theta = -0.3; phi = 1.1; setIsSubsurfaceMode(false);
      }
      updateCameraFromSpherical();
    };

    resetCameraFn.current = () => {
      setSelectedAsset(null); targetTargetPos.copy(defaultTargetPos);
      radius = 115; theta = -0.22; phi = 1.38; updateCameraFromSpherical();
      setIsSubsurfaceMode(true);
    };

    // ── HIGH-PERFORMANCE 60-120 FPS ZERO-LAG ANIMATION LOOP ──
    let lastTime = performance.now() * 0.001;
    let animationFrameId;
    let xrayLerpFactor = 0.0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Inactive tab / background throttle & visibility check
      if (!isTabVisibleRef.current || !isVisibleRef.current) return;

      const now = performance.now() * 0.001;
      const delta = Math.min(0.05, now - lastTime);
      lastTime = now;
      const time = now;

      // ── 1. MECHANICAL WORKING ANIMATIONS ──────────────────────────────────
      // Sucker Rod Pumpjack (SRP) Working Mechanism
      const spmVal = parseFloat(currentMetricsRef.current.SPM) || SPM;
      const spmSpeed = simIsPlayingRef.current ? (spmVal * Math.PI * 2) / 60 : 0;
      const angle = time * spmSpeed;
      const strokeProgress = (Math.sin(angle) + 1) / 2; // 0 (bottom dead center) to 1 (top dead center)
      const isUpstroke = Math.cos(angle) >= 0; // True when moving upwards, False when moving downwards

      const strokeVal = parseFloat(currentMetricsRef.current.stroke_length) || strokeLen;
      const strokeAmp = (strokeVal / 100) * 0.22; // Pronounced swing amplitude
      const beamPitch = Math.sin(angle) * strokeAmp;

      if (pj) {
        if (pj.beam) pj.beam.rotation.z = beamPitch;
        if (wh?.polishedRod) {
          wh.polishedRod.position.y = 12 - strokeProgress * (strokeVal / 100) * 3.4;
        }
        if (pj.cranks) {
          pj.cranks.forEach(c => { c.rotation.z = -angle; });
        }
        // Articulated Pitman arm linkages
        if (pj.pitmanL && pj.pitmanR) {
          const crankRadius = 3.5;
          const crankX = -8 + Math.cos(-angle) * crankRadius;
          const crankY = 3.0 + Math.sin(-angle) * crankRadius;
          const beamRearX = -13 + Math.sin(beamPitch) * 2.0;
          const beamRearY = 14.5 - Math.sin(beamPitch) * 11.0;

          const midX = (crankX + beamRearX) * 0.5;
          const midY = (crankY + beamRearY) * 0.5;
          const pitmanAngle = Math.atan2(beamRearY - crankY, beamRearX - crankX) - Math.PI / 2;

          pj.pitmanL.position.set(midX, midY, 2.5);
          pj.pitmanL.rotation.z = pitmanAngle;
          pj.pitmanR.position.set(midX, midY, -2.5);
          pj.pitmanR.rotation.z = pitmanAngle;
        }
      }

      // ── DOWNHOLE SUCKER ROD & VALVE KINEMATICS (REAL SRP CYCLE) ────────────
      const plungerTravel = (strokeVal / 100) * 2.5; // Vertical plunger displacement
      const plungerY = -28.0 + strokeProgress * plungerTravel;

      if (downhole) {
        // 1. Sucker rod string and plunger reciprocate in exact synchrony with polished rod
        if (downhole.suckerRodGroup) {
          downhole.suckerRodGroup.position.y = strokeProgress * plungerTravel;
        } else if (downhole.plunger) {
          downhole.plunger.position.y = plungerY;
        }

        // 2. Standing Valve Action (At bottom of stationary pump barrel):
        // Upstroke -> Valve Opens (lifts unseated +0.35m) to draw crude into barrel
        // Downstroke -> Valve Closes (seats firmly at -29.2m) to prevent backflow
        if (downhole.standingValve) {
          const standingOpenY = -28.85;
          const standingClosedY = -29.25;
          const targetSV = isUpstroke ? standingOpenY : standingClosedY;
          downhole.standingValve.position.y += (targetSV - downhole.standingValve.position.y) * 0.25;
          if (downhole.standingValve.material) {
            downhole.standingValve.material.emissiveIntensity = isUpstroke ? 0.9 : 0.2;
          }
        }

        // 3. Traveling Valve Action (Inside reciprocating plunger):
        // Upstroke -> Valve Closes (seats at -1.5m relative to plunger) lifting oil column
        // Downstroke -> Valve Opens (fluid pushes ball UP to -1.15m) passing fluid into tubing
        if (downhole.travelingValve) {
          const travelingClosedY = -1.50;
          const travelingOpenY = -1.15;
          const targetTV = isUpstroke ? travelingClosedY : travelingOpenY;
          downhole.travelingValve.position.y += (targetTV - downhole.travelingValve.position.y) * 0.25;
          if (downhole.travelingValve.material) {
            const baseTV = !isUpstroke ? 0.9 : 0.2;
            downhole.travelingValve.material.emissiveIntensity = THREE.MathUtils.lerp(baseTV, 1.6, xrayLerpFactor);
          }
        }

        // ── EXPLODED / X-RAY INSPECTION KINEMATICS ──
        const targetXray = isXrayActiveRef.current ? 1.0 : 0.0;
        xrayLerpFactor += (targetXray - xrayLerpFactor) * 0.08;

        if (xrayLerpFactor > 0.001) {
          // A. Slide open downhole casing halves laterally
          if (downhole.casingHalfL && downhole.casingHalfR) {
            downhole.casingHalfL.position.x = -xrayLerpFactor * 3.4;
            downhole.casingHalfL.position.z = -xrayLerpFactor * 0.9;
            downhole.casingHalfR.position.x = xrayLerpFactor * 3.4;
            downhole.casingHalfR.position.z = xrayLerpFactor * 0.9;
          } else if (downhole.casingGroup) {
            downhole.casingGroup.position.x = xrayLerpFactor * 3.0;
          }
          if (downhole.casingMat) {
            downhole.casingMat.opacity = THREE.MathUtils.lerp(0.28, 0.06, xrayLerpFactor);
          }

          // B. Slide open downhole pump barrel sleeve to reveal plunger & ball valves
          if (downhole.barrelSleeve) {
            downhole.barrelSleeve.position.x = xrayLerpFactor * 2.4;
            downhole.barrelSleeve.position.z = -xrayLerpFactor * 1.6;
            if (downhole.barrelSleeve.material) {
              downhole.barrelSleeve.material.opacity = THREE.MathUtils.lerp(0.45, 0.12, xrayLerpFactor);
            }
          }

          // C. Standing ball valve emissive boost during X-ray inspection
          if (downhole.standingValve && downhole.standingValve.material) {
            const baseSV = isUpstroke ? 0.9 : 0.2;
            downhole.standingValve.material.emissiveIntensity = THREE.MathUtils.lerp(baseSV, 1.6, xrayLerpFactor);
          }

          // D. Wellhead Stuffing Box housing halves slide open & Chevron packing rings expand
          if (wh?.stuffingBoxHousingL && wh?.stuffingBoxHousingR) {
            wh.stuffingBoxHousingL.position.x = -xrayLerpFactor * 1.5;
            wh.stuffingBoxHousingR.position.x = xrayLerpFactor * 1.5;
            if (wh.stuffingBoxHousingL.material) {
              wh.stuffingBoxHousingL.material.opacity = THREE.MathUtils.lerp(0.92, 0.35, xrayLerpFactor);
            }
            if (wh.stuffingBoxHousingR.material) {
              wh.stuffingBoxHousingR.material.opacity = THREE.MathUtils.lerp(0.92, 0.35, xrayLerpFactor);
            }
          }
          if (wh?.glandNut) {
            wh.glandNut.position.y = 1.1 + xrayLerpFactor * 0.9;
          }
          if (wh?.packingRings) {
            wh.packingRings.forEach((ring, rIdx) => {
              ring.position.y = -0.5 + rIdx * (0.45 + xrayLerpFactor * 0.35);
              if (ring.material) {
                ring.material.emissiveIntensity = THREE.MathUtils.lerp(0.4, 1.4, xrayLerpFactor);
              }
            });
          }
        } else {
          if (downhole.casingHalfL && downhole.casingHalfR) {
            downhole.casingHalfL.position.set(0, 0, 0);
            downhole.casingHalfR.position.set(0, 0, 0);
          } else if (downhole.casingGroup) {
            downhole.casingGroup.position.set(0, 0, 0);
          }
          if (downhole.casingMat) downhole.casingMat.opacity = 0.28;
          if (downhole.barrelSleeve) {
            downhole.barrelSleeve.position.set(0, -27, 0);
            if (downhole.barrelSleeve.material) downhole.barrelSleeve.material.opacity = 0.45;
          }
          if (wh?.stuffingBoxHousingL && wh?.stuffingBoxHousingR) {
            wh.stuffingBoxHousingL.position.set(0, 0, 0);
            wh.stuffingBoxHousingR.position.set(0, 0, 0);
            if (wh.stuffingBoxHousingL.material) wh.stuffingBoxHousingL.material.opacity = 0.92;
            if (wh.stuffingBoxHousingR.material) wh.stuffingBoxHousingR.material.opacity = 0.92;
          }
          if (wh?.glandNut) wh.glandNut.position.y = 1.1;
          if (wh?.packingRings) {
            wh.packingRings.forEach((ring, rIdx) => {
              ring.position.y = -0.5 + rIdx * 0.45;
              if (ring.material) ring.material.emissiveIntensity = 0.4;
            });
          }
        }

        // 4. Perforation & Pore Fluid Inflow Streamers (Accelerates on upstroke suction)
        if (downhole.poreInflowStreamers) {
          const suctionBoost = isUpstroke ? 2.2 : 0.6;
          downhole.poreInflowStreamers.forEach((str) => {
            str.radius -= str.speed * suctionBoost * (simIsPlayingRef.current ? 1 : 0);
            if (str.radius < 0.6) {
              str.radius = 4.5 + Math.random() * 5.5; // Reset back to reservoir pore boundary
            }
            str.mesh.position.set(
              Math.cos(str.angle) * str.radius,
              str.y + Math.sin(time * 6 + str.angle) * 0.15,
              Math.sin(str.angle) * str.radius
            );
            str.mesh.scale.setScalar(0.7 + (1.0 - str.radius / 10.0) * 0.7);
          });
        }

        // 5. Steam Radial Jet Sprays at Perforation Zone
        if (downhole.steamJets) {
          downhole.steamJets.forEach((jet, jIdx) => {
            const jPulse = 1.0 + Math.sin(time * 8.0 + jIdx) * 0.35;
            jet.scale.set(jPulse, 1.0 + Math.cos(time * 6.0 + jIdx) * 0.4, jPulse);
          });
        }

        // 6. Downhole Steam Injection Conduit Flow
        if (downhole.steamParticles) {
          downhole.steamParticles.forEach((sDot, sp) => {
            const sOffset = (time * 1.2 + sp / downhole.steamParticles.length) % 1.0;
            sDot.position.y = -1.0 - sOffset * 21.0;
            sDot.scale.setScalar(1.0 + Math.sin(sOffset * Math.PI) * 0.5);
          });
        }

        // 7. Crude Oil Column Lifting up Tubing (Heavy upward surge during upstroke)
        if (downhole.oilLiftParticles) {
          const liftSpeed = isUpstroke ? 1.6 : 0.3;
          downhole.oilLiftParticles.forEach((oDot, op) => {
            const oOffset = (time * liftSpeed + op / downhole.oilLiftParticles.length) % 1.0;
            oDot.position.y = -27.0 + oOffset * 27.0;
            oDot.scale.setScalar(1.1 + Math.sin(oOffset * Math.PI) * 0.4);
          });
        }
      }

      // ── 2. HIGH-VISIBILITY PIPELINE FLUID FLOW & TRACERS ──────────────────
      const isFlowing = !flowPausedRef.current && simIsPlayingRef.current;
      const vel = isFlowing ? flowVelocityRef.current : 0;
      const showDir = showFlowDirRef.current;

      if (flowVelTextRef.current) flowVelTextRef.current.textContent = `${(vel * 100).toFixed(1)}%`;
      if (flowVelBarRef.current) flowVelBarRef.current.style.width = `${(vel * 100).toFixed(1)}%`;

      // Rapid steam flow inside pipeline
      steamFlowParticles.forEach((dot, idx) => {
        const offset = (time * 1.6 + idx / steamFlowParticles.length) % 1.0;
        if (offset < 0.5) {
          dot.position.lerpVectors(steamStart1, steamEnd1, offset * 2);
        } else {
          dot.position.lerpVectors(steamStart2, steamEnd2, (offset - 0.5) * 2);
        }
        dot.scale.setScalar(1.2 + Math.sin(time * 8 + idx) * 0.4);
      });

      // Liquid crude oil flow through surface pipes (with extraction pulse)
      if (fluidRegistryRef.current) {
        const pulseMult = isUpstroke ? 1.5 : 0.7;
        fluidRegistryRef.current.forEach((seg) => {
          if (seg.fluidMesh && seg.fluidMesh.material && seg.fluidMesh.material.map) {
            if (isFlowing) {
              seg.fluidMesh.material.map.offset.x -= delta * vel * 2.2 * pulseMult;
            }
          }
          seg.chevrons.forEach((chev) => {
            if (!isFlowing || !showDir) {
              if (chev.material.opacity !== 0) chev.material.opacity = 0;
              return;
            }
            const baseT = chev.userData.baseT;
            const t = (baseT + time * vel * 0.75 * pulseMult) % 1.0;
            chev.position.lerpVectors(seg.startPt, seg.endPt, t);
            chev.position.y -= 0.22;
            chev.material.opacity = 0.95;
            chev.scale.setScalar(1.25);
          });
        });
      }

      // ── DRIVE INTERNAL WORKING PROCESSES (CONTINUOUS EVEN WHEN EXPLODED) ──
      // A. Separator 3-Phase Internal Separation Flow
      sepBubbles.forEach((b) => {
        const bProgress = (time * b.speed + b.seed) % 1.0;
        if (b.isGas) {
          // Gas vapor rises to upper mist extractor
          b.mesh.position.y = -0.5 + bProgress * 1.8;
          b.mesh.position.x = Math.sin(time * 3 + b.seed) * 2.5;
        } else {
          // Oil spills over weir plate and cascades into bucket
          b.mesh.position.x = -2.5 + bProgress * 5.0;
          b.mesh.position.y = 0.4 - (bProgress > 0.6 ? (bProgress - 0.6) * 2.2 : 0);
        }
        b.mesh.scale.setScalar(0.8 + Math.sin(bProgress * Math.PI) * 0.5);
      });

      // B. Boiler Internal Superheated Steam Helical Flow & Burner Fire Pulse
      boilerCoilParticles.forEach((pMesh, pIdx) => {
        const pAngle = time * 4.0 + (pIdx / boilerCoilParticles.length) * Math.PI * 6;
        const coilRadius = 1.6;
        pMesh.position.set(
          Math.cos(pAngle) * coilRadius,
          -1.5 + (pIdx / boilerCoilParticles.length) * 3.2,
          Math.sin(pAngle) * coilRadius
        );
        pMesh.scale.setScalar(1.0 + Math.sin(time * 8 + pIdx) * 0.4);
      });
      burnerFlameCore.scale.set(
        1.1 + Math.sin(time * 18) * 0.25,
        1.3 + Math.cos(time * 22) * 0.35,
        1.1 + Math.sin(time * 15) * 0.25
      );

      // C. Wellhead Internal High-Pressure Oil Stream Jet (Pulsing with SRP upstroke discharge)
      whJetParticles.forEach((jMesh, jIdx) => {
        const jProgress = (time * (isUpstroke ? 3.5 : 1.2) + jIdx / whJetParticles.length) % 1.0;
        jMesh.position.set(
          jProgress * 3.5, // shooting from wellbore center into horizontal production wing
          Math.sin(time * 12 + jIdx) * 0.12,
          Math.cos(time * 12 + jIdx) * 0.12
        );
        jMesh.scale.setScalar((isUpstroke ? 1.4 : 0.8) + Math.sin(jProgress * Math.PI) * 0.4);
      });
      // ────────────────────────────────────────────────────────────────────────

      // ── DYNAMIC SURFACE VS. UNDERGROUND UTILITY ISOLATION ──
      const isReservoirOnly = viewModeRef.current === 'reservoir' || viewModeRef.current === 'subsurface';
      surfaceGroup.visible = !isReservoirOnly;
      
      // Dynamic ground layer transparency (0% = soil completely invisible / hidden for 100% unobstructed wellbore view)
      const gTrans = typeof groundTransparencyRef.current === 'number' ? groundTransparencyRef.current : 0.0;
      const showSoil = isReservoirOnly && gTrans > 0.01;

      if (subAssets.capRock) {
        subAssets.capRock.visible = showSoil;
        if (m.capRockMat) m.capRockMat.opacity = Math.max(0.01, gTrans * 0.35);
      }
      if (subAssets.sandstone) {
        subAssets.sandstone.visible = showSoil;
        if (m.sandstoneMat) m.sandstoneMat.opacity = Math.max(0.01, gTrans * 0.45);
      }
      if (subAssets.strataLine) {
        subAssets.strataLine.visible = showSoil;
        if (m.strataMat) m.strataMat.opacity = Math.max(0.01, gTrans * 0.40);
      }
      if (subAssets.strataLine2) {
        subAssets.strataLine2.visible = showSoil;
      }
      if (subAssets.aquifer) {
        subAssets.aquifer.visible = showSoil;
        if (m.aquiferMat) m.aquiferMat.opacity = Math.max(0.01, gTrans * 0.35);
      }
      if (subAssets.reservoir) {
        subAssets.reservoir.visible = showSoil;
        if (m.reservoirMaterial) m.reservoirMaterial.opacity = Math.max(0.02, gTrans * 0.50);
      }

      // ── DRIVE REFINED SUBTLE UNDERGROUND THERMAL PULSE & SHOCKWAVE EFFECTS ──
      // A. Heat Sphere Thermal Breathing & Dynamic Temperature Color (Tightly Scaled)
      if (heatSphere) {
        heatSphere.visible = showSubsurfaceHeatMapRef.current;
        const rVal = parseFloat(currentMetricsRef.current.heated_radius) || 1.8;
        const breath = 1.0 + Math.sin(time * 3.5) * 0.08;
        heatSphere.scale.setScalar(rVal * 0.65 * breath);

        const tempVal = inputsRef.current.steam_T || 220;
        if (tempVal > 300) {
          heatSphere.material.color.setHex(0xdc2626);
          heatSphere.material.emissive.setHex(0xb91c1c);
        } else if (tempVal >= 220) {
          heatSphere.material.color.setHex(0xf97316);
          heatSphere.material.emissive.setHex(0xc2410c);
        } else if (tempVal >= 120) {
          heatSphere.material.color.setHex(0x0d9488);
          heatSphere.material.emissive.setHex(0x0f766e);
        } else {
          heatSphere.material.color.setHex(0x1e3a8a);
          heatSphere.material.emissive.setHex(0x1e40af);
        }
        heatSphere.material.emissiveIntensity = 0.65 + Math.sin(time * 5) * 0.25;
      }

      // B. Expanding Volumetric Thermal Shockwave Shells (Reduced radius & soft opacity)
      thermalPulseShells.forEach((shell, sIdx) => {
        shell.visible = showSubsurfaceHeatMapRef.current;
        const baseR = parseFloat(currentMetricsRef.current.heated_radius) || 1.8;
        const wave = (time * 0.35 + sIdx * 0.33) % 1.0;
        const sScale = baseR * (0.65 + wave * 0.85);
        shell.scale.setScalar(sScale);
        shell.material.opacity = (1.0 - wave) * 0.35;
        shell.rotation.y += 0.012;
      });

      // C. Expanding Horizontal Perforation Energy Rings (Proportional radius)
      perforationRings.forEach((pRing, rIdx) => {
        pRing.visible = showSubsurfaceHeatMapRef.current;
        const rWave = (time * 0.45 + rIdx * 0.33) % 1.0;
        const rScale = 1.0 + rWave * 4.2;
        pRing.scale.set(rScale, rScale, 1.0);
        pRing.material.opacity = (1.0 - rWave) * 0.45;
      });

      // D. Perforation Channel Energy Sparks (Proportional flow distance)
      perfSparks.forEach((sp) => {
        sp.mesh.visible = showSubsurfaceHeatMapRef.current;
        const spProg = (time * sp.speed + sp.seed) % 1.0;
        const dist = 0.8 + spProg * 3.8;
        sp.mesh.position.set(
          Math.cos(sp.angle) * dist,
          Math.sin(time * 5 + sp.seed) * 0.25,
          Math.sin(sp.angle) * dist
        );
        sp.mesh.scale.setScalar(0.5 + Math.sin(spProg * Math.PI) * 0.35);
      });

      // E. Reservoir Geological Flow Vectors (Clean refined lengths)
      if (reservoirArrows) {
        reservoirArrows.visible = showSubsurfaceOilFlowRef.current;
        steamArrows.forEach((arr, idx) => {
          const pulse = 1.6 + Math.sin(time * 6 + idx) * 0.5;
          arr.setLength(pulse, 0.5, 0.25);
        });
        oilArrows.forEach((arr, idx) => {
          const pulse = 1.8 + Math.cos(time * 5 + idx) * 0.6;
          arr.setLength(pulse, 0.5, 0.25);
        });
      }
      // ────────────────────────────────────────────────────────────────────────

      // Warning beacons flashing
      warningBeacons.forEach(b => {
        const intensity = 0.5 + Math.sin(time * 8) * 0.5;
        if (b.children[0] && b.children[0].material) b.children[0].material.color.setHSL(0, 1.0, 0.35 + intensity * 0.25);
        if (b.children[2]) b.children[2].intensity = intensity * 2.2;
      });

      // Roaring flare flame
      if (fl?.flareLight) {
        fl.flareLight.intensity = 4.5 + Math.sin(time * 24) * 2.5;
      }
      if (fl?.flameMesh) {
        fl.flameMesh.scale.set(1.2 + Math.sin(time * 16) * 0.3, 1.6 + Math.cos(time * 19) * 0.4, 1.2 + Math.sin(time * 14) * 0.3);
      }
      if (fl?.flameInner) {
        fl.flameInner.scale.set(1.0 + Math.sin(time * 28) * 0.2, 1.3 + Math.cos(time * 22) * 0.3, 1.0 + Math.sin(time * 25) * 0.2);
      }

      // Drive Combustion Blower Fan & Meteorological Anemometer
      if (sb?.steamStation?.userData?.fanRotor) {
        sb.steamStation.userData.fanRotor.rotation.z = time * 18.0;
      }
      if (cs?.userData?.anemometer) {
        cs.userData.anemometer.rotation.y = time * 6.5;
      }

      // Boiler steam exhaust smoke billows
      const smPos = smokeGeo.attributes.position.array;
      for (let i = 0; i < smokeCount; i++) {
        const s = smokeSpeeds[i];
        smPos[i * 3 + 1] += s.vy * 1.8; smPos[i * 3] += s.vx * 1.4; smPos[i * 3 + 2] += s.vz * 1.4;
        if (smPos[i * 3 + 1] > 26) {
          smPos[i * 3] = -16 + (Math.random() - 0.5) * 0.8;
          smPos[i * 3 + 1] = 12;
          smPos[i * 3 + 2] = -17 + (Math.random() - 0.5) * 0.8;
        }
      }
      smokeGeo.attributes.position.needsUpdate = true;

      // Storage tank dynamic level and inlet turbulence
        if (tanksAsset && tanksAsset.userData && tanksAsset.userData.tanks) {
        tanksAsset.userData.tanks.forEach((tRef, tIdx) => {
          const qOilVal = parseFloat(currentMetricsRef.current.q_oil) || 0;
          const fillRatio = Math.max(0.15, Math.min(0.95, 0.25 + (time * (qOilVal / 700)) % 0.65));
          const maxLiquidH = 9.6;
          const currentH = maxLiquidH * fillRatio;
          if (tRef.liquidMesh) {
            tRef.liquidMesh.scale.y = fillRatio;
            tRef.liquidMesh.position.y = currentH / 2 + 0.5;
          }
          if (tRef.surfaceMesh) {
            const turb = Math.sin(time * 6.0 + tIdx * 1.5) * 0.08;
            tRef.surfaceMesh.position.y = currentH + 0.5 + turb;
          }
          if (tRef.gaugeFloat) tRef.gaugeFloat.position.y = currentH + 1.2;
        });
      }

      // Camera smooth interpolation
      currentCameraPos.lerp(targetCameraPos, 0.075);
      currentTargetPos.lerp(targetTargetPos, 0.075);
      camera.position.copy(currentCameraPos);
      camera.lookAt(currentTargetPos);


      renderer.render(scene, camera);
    };
    animate();

    const updateSize = () => {
      const activeMount = canvasContainerRef.current || renderer.domElement?.parentElement;
      if (!activeMount) return;
      const rect = activeMount.getBoundingClientRect();
      const w = Math.max(1, activeMount.clientWidth || Math.round(rect.width));
      const h = Math.max(1, activeMount.clientHeight || Math.round(rect.height));
      if (w > 20 && h > 20) {
        const currentPR = getDevicePR();
        renderer.setPixelRatio(currentPR);
        renderer.setSize(w, h, false);
        if (renderer.domElement) {
          renderer.domElement.style.width = '100%';
          renderer.domElement.style.height = '100%';
        }
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    resizeRef.current = updateSize;
    window.addEventListener('resize', updateSize);
    updateSize();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 20 && height > 20) {
          const currentPR = getDevicePR();
          renderer.setPixelRatio(currentPR);
          renderer.setSize(width, height, false);
          if (renderer.domElement) {
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
          }
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }
    });
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    // Initial camera positioning according to page viewMode
    if (presetCameraFn.current) presetCameraFn.current(viewModeRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('click', handleClick);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
          else child.material.dispose();
        }
      });
      clearSharedGeometryCache();
      renderer.dispose();
    };
  }, [quality]);

  useEffect(() => {
    const activeMount = canvasContainerRef.current;
    const rndr = rendererRef.current;
    if (activeMount && rndr && rndr.domElement) {
      if (rndr.domElement.parentNode !== activeMount) {
        activeMount.innerHTML = '';
        activeMount.appendChild(rndr.domElement);
      }
      rndr.domElement.style.position = 'absolute';
      rndr.domElement.style.top = '0';
      rndr.domElement.style.left = '0';
      rndr.domElement.style.width = '100%';
      rndr.domElement.style.height = '100%';
      rndr.domElement.style.display = 'block';
    }
    if (resizeRef.current) {
      resizeRef.current();
      const t1 = setTimeout(resizeRef.current, 10);
      const t2 = setTimeout(resizeRef.current, 50);
      const t3 = setTimeout(resizeRef.current, 150);
      const t4 = setTimeout(resizeRef.current, 350);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [parentDOM, viewMode]);

  const target = parentDOM || fallbackContainer;
  if (!target) return null;

  return createPortal(
    <div ref={mountRef} className={`absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing ${darkMode ? 'bg-[#080b13]' : 'bg-[#eef2f6]'}`}>
      
      {/* Dynamic 3D Scene Status HUD Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none font-sans select-none">
        {!illustrativeMode ? (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg border ${
            darkMode ? 'bg-zinc-950/95 border-amber-500/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            <span>Locked Verified Field View</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-medium normal-case font-mono tracking-normal text-[11px] ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Awaiting validated model inputs</span>
          </div>
        ) : (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg border ${
            darkMode ? 'bg-amber-950/95 border-amber-500/40 text-amber-400' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <span>Active Simulation Sandbox</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span className={`font-medium normal-case font-mono tracking-normal text-[11px] ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Predictive dynamics active</span>
          </div>
        )}
      </div>
      
      {/* 3D WebGL Canvas mount container */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full" />
      
      {/* Dynamic 3D selected asset marker badge — detailed mode only */}
      {interactionMode === 'detailed' && selectedAsset && labelMode !== 'off' && (
        <div ref={selectedLabelDOMRef} className={`absolute pointer-events-none rounded-2xl p-4 shadow-2xl text-sm font-mono z-30 flex flex-col gap-2 min-w-[220px] border-2 ${
            darkMode ? 'bg-zinc-950/98 border-amber-400/80 text-zinc-100 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'bg-white border-amber-500 text-slate-800 shadow-[0_4px_25px_rgba(180,83,9,0.2)]'
          }`}
          style={{ transform: 'translate(-50%, -100%)', display: 'none' }}>
          <div className={`flex items-center justify-between border-b pb-1.5 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
            <span className="font-bold text-amber-500 uppercase text-sm tracking-wide">{selectedAsset.name}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={`font-semibold ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Status:</span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{selectedAsset.status}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={`font-semibold ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Pressure / Temp:</span>
            <span className="text-amber-400 font-bold">{selectedAsset.pressure || '0 psi'} | {selectedAsset.temp || '35 °C'}</span>
          </div>
        </div>
      )}

      {/* Hover tooltip for surface equipment — detailed mode only */}
      {interactionMode === 'detailed' && hoveredEquipment && !selectedAsset && (
        <div className={`absolute pointer-events-none rounded-2xl p-3.5 shadow-2xl text-sm font-mono w-64 z-40 transition-all duration-75 border-2 ${
            darkMode ? 'bg-zinc-950/98 border-amber-400/70 text-zinc-200 shadow-[0_0_20px_rgba(245,158,11,0.25)]' : 'bg-white border-amber-500 text-slate-800 shadow-[0_4px_20px_rgba(180,83,9,0.15)]'
          }`}
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}>
          <div className={`flex justify-between items-center border-b pb-1 mb-1.5 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
            <span className="font-bold text-amber-500 text-sm tracking-wide">{hoveredEquipment.name}</span>
          </div>
          <p className="text-amber-400 font-semibold mb-1">Status: {hoveredEquipment.status}</p>
          <p className={`text-[13px] leading-relaxed font-sans ${darkMode ? 'text-zinc-500' : 'text-slate-600'}`}>Click asset to inspect operational metrics & SCADA state.</p>
        </div>
      )}



      {/* ── Selected Pipe Telemetry Card — detailed mode only ────────────── */}
      {interactionMode === 'detailed' && selectedPipeInfo && (
        <div className={`absolute top-4 right-4 z-30 rounded-2xl p-4 shadow-2xl w-72 pointer-events-auto font-sans border ${
          darkMode ? 'bg-zinc-950/98 border-amber-500/30 text-zinc-200' : 'bg-white border-slate-300 text-slate-800 shadow-2xl'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 mb-3 ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
            <div>
              <span className={`text-[12px] font-sans uppercase tracking-widest block ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Oil Flowline</span>
              <span className="font-bold text-amber-500 text-sm font-sans">{selectedPipeInfo.label}</span>
            </div>
            <button onClick={() => setSelectedPipeInfo(null)} className={`text-xl leading-none cursor-pointer ${darkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-700'}`}>×</button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              { label: 'Flow Rate', value: selectedPipeInfo.flowRate, unit: 'bbl/d', color: darkMode ? 'text-white' : 'text-slate-900' },
              { label: 'Velocity',  value: selectedPipeInfo.velocity,  unit: '%',    color: darkMode ? 'text-amber-400' : 'text-amber-700' },
              { label: 'Pressure',  value: selectedPipeInfo.pressure,  unit: 'psi',  color: darkMode ? 'text-orange-400' : 'text-orange-600' },
              { label: 'Temp',      value: selectedPipeInfo.temp,      unit: '°C',   color: darkMode ? 'text-amber-400' : 'text-amber-700' },
              { label: 'Viscosity', value: selectedPipeInfo.viscosity, unit: 'cP',   color: darkMode ? 'text-zinc-300' : 'text-slate-700' },
              { label: 'Valve',     value: selectedPipeInfo.valve,     unit: '%',    color: darkMode ? 'text-amber-400' : 'text-amber-600' },
            ].map(row => (
              <div key={row.label}>
                <span className={`text-[11px] font-sans uppercase block ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>{row.label}</span>
                <span className={`text-[15px] font-bold font-mono ${row.color}`}>{row.value} <span className={`text-[11px] font-mono ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>{row.unit}</span></span>
              </div>
            ))}
          </div>
          <div className={`mt-3 pt-2 border-t ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
            <span className={`text-[11px] font-sans leading-relaxed block ${darkMode ? 'text-zinc-500' : 'text-slate-500'}`}>Calculated simulation model output: subject to calibration verification with Oil India Limited field production logs.</span>
          </div>
        </div>
      )}

      {/* ── CAD Coordinate Readout Panel ─────────────────────────────────── */}
      {interactionMode === 'detailed' && (
        <div className={`absolute bottom-4 right-4 z-30 rounded-xl p-3 shadow-xl pointer-events-none w-56 border ${
          darkMode ? 'bg-zinc-950/95 border-zinc-800 text-zinc-300' : 'bg-white border-slate-300 text-slate-800 shadow-md'
        }`}>
          <div className={`text-[10px] font-bold uppercase tracking-widest font-mono mb-1.5 border-b pb-1 flex items-center justify-between ${
            darkMode ? 'text-zinc-400 border-zinc-800' : 'text-slate-700 border-slate-200'
          }`}>
            <span>Viewport SCADA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div ref={cameraReadoutRef} className={darkMode ? 'text-zinc-300' : 'text-slate-700'} />
        </div>
      )}
    </div>,
    target
  );
});

export default ThreeDWellWorkspace;
