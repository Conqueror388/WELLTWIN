import * as THREE from 'three';

export const QUALITY_PRESETS = {
  Low: { pixelRatio: 1.0, shadowSize: 1024, textureSize: 512, terrainSeg: 32, grassCount: 15, cloudPuffs: 4, smokeCount: 10, flowParticles: 12, aa: false },
  Medium: { pixelRatio: 1.25, shadowSize: 2048, textureSize: 1024, terrainSeg: 48, grassCount: 40, cloudPuffs: 8, smokeCount: 20, flowParticles: 20, aa: true },
  High: { pixelRatio: 1.5, shadowSize: 2048, textureSize: 2048, terrainSeg: 64, grassCount: 75, cloudPuffs: 12, smokeCount: 32, flowParticles: 32, aa: true },
  Default: { pixelRatio: 1.25, shadowSize: 2048, textureSize: 1024, terrainSeg: 48, grassCount: 40, cloudPuffs: 8, smokeCount: 20, flowParticles: 20, aa: true }
};

export function detectDefaultQuality() {
  return 'Default';
}

const canvasCache = new Map();

export function generateCanvas(type, size = 256) {
  const cacheKey = `${type}_${size}`;
  if (canvasCache.has(cacheKey)) {
    return canvasCache.get(cacheKey);
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (type === 'mud') {
    // Generate golden Thar Desert sand texture
    const grd = ctx.createRadialGradient(size * 0.4, size * 0.4, 0, size * 0.5, size * 0.5, size * 0.7);
    grd.addColorStop(0, '#e8be8f'); // bright sand
    grd.addColorStop(0.5, '#cca06c'); // warm golden sand
    grd.addColorStop(1, '#ab7c4c'); // dune shadow sand
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);
    
    // Fine sand grains
    const grainCount = Math.min(size * 3, 768);
    for (let i = 0; i < grainCount; i++) {
      ctx.fillStyle = Math.random() > 0.5 
        ? `rgba(255, 245, 220, ${0.25 + Math.random() * 0.35})`
        : `rgba(130, 90, 50, ${0.18 + Math.random() * 0.28})`;
      const s = 1 + Math.random() * 2;
      ctx.fillRect(Math.random() * size, Math.random() * size, s, s);
    }
    
    // Wavy wind ripples
    ctx.lineWidth = 2.5;
    const rippleCount = 8;
    for (let t = 0; t < rippleCount; t++) {
      ctx.strokeStyle = `rgba(255, 245, 230, ${0.14 + Math.random() * 0.14})`;
      ctx.beginPath();
      const y0 = -10 + (t * (size + 20)) / rippleCount;
      ctx.moveTo(-10, y0);
      ctx.bezierCurveTo(
        size * 0.25, y0 + (Math.sin(t) * 10), 
        size * 0.75, y0 - (Math.cos(t) * 10), 
        size + 10, y0
      );
      ctx.stroke();

      ctx.strokeStyle = `rgba(100, 70, 40, ${0.09 + Math.random() * 0.09})`;
      ctx.beginPath();
      ctx.moveTo(-10, y0 + 2.5);
      ctx.bezierCurveTo(
        size * 0.25, y0 + 2.5 + (Math.sin(t) * 10), 
        size * 0.75, y0 + 2.5 - (Math.cos(t) * 10), 
        size + 10, y0 + 2.5
      );
      ctx.stroke();
    }
  } else if (type === 'mud_normal') {
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, size, size);
    const count = Math.min(size * 2, 384);
    for (let i = 0; i < count; i++) {
      const v = 120 + Math.random() * 16;
      ctx.fillStyle = `rgb(${v}, ${v}, 255)`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  } else if (type === 'mud_roughness') {
    ctx.fillStyle = '#f5f5f5'; // very rough matte sand
    ctx.fillRect(0, 0, size, size);
    const count = Math.min(size * 2, 256);
    for (let i = 0; i < count; i++) {
      const v = 220 + Math.random() * 35;
      ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
  } else if (type === 'metal') {
    ctx.fillStyle = '#8a8a8a';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 4) {
      const v = 120 + Math.random() * 30;
      ctx.fillStyle = `rgb(${v}, ${v}, ${v + 5})`;
      ctx.fillRect(0, y, size, 4);
    }
  } else if (type === 'metal_normal') {
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 6) {
      const v = 125 + Math.random() * 6;
      ctx.fillStyle = `rgb(${v}, ${v}, 255)`;
      ctx.fillRect(0, y, size, 6);
    }
  } else if (type === 'rust') {
    ctx.fillStyle = '#5c3815';
    ctx.fillRect(0, 0, size, size);
    const rustCount = Math.min(size * 2, 512);
    for (let i = 0; i < rustCount; i++) {
      const r = 60 + Math.random() * 60;
      const g = 20 + Math.random() * 30;
      const b = 5 + Math.random() * 15;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      const s = 1 + Math.random() * 3;
      ctx.fillRect(Math.random() * size, Math.random() * size, s, s);
    }
  } else if (type === 'concrete') {
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(0, 0, size, size);
    const concCount = Math.min(size * 2, 512);
    for (let i = 0; i < concCount; i++) {
      const v = 140 + Math.random() * 40;
      ctx.fillStyle = `rgb(${v}, ${v - 5}, ${v - 10})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
    }
  } else if (type === 'stripes') {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#1a1a1a';
    const stripeW = size / 6;
    for (let i = -2; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * stripeW, 0);
      ctx.lineTo(i * stripeW + stripeW * 0.5, 0);
      ctx.lineTo(i * stripeW - stripeW * 0.5, size);
      ctx.lineTo(i * stripeW - stripeW, size);
      ctx.fill();
    }
  } else if (type === 'clouds') {
    ctx.fillStyle = 'rgba(240, 244, 248, 0.0)';
    ctx.fillRect(0, 0, size, size);
    for (let c = 0; c < 6; c++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      const cr = 40 + Math.random() * 60;
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      grd.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      grd.addColorStop(0.5, 'rgba(240, 244, 250, 0.25)');
      grd.addColorStop(1, 'rgba(240, 244, 250, 0.0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  canvasCache.set(cacheKey, canvas);
  return canvas;
}

export function generateTexture(type, size = 1024) {
  const canvas = generateCanvas(type, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// ── Shared Geometries Cache ────────────────────────────────────────────────
const sharedGeoCache = new Map();

export function getSharedGeometry(key, createFn) {
  if (!sharedGeoCache.has(key)) {
    sharedGeoCache.set(key, createFn());
  }
  return sharedGeoCache.get(key);
}

export function clearSharedGeometryCache() {
  sharedGeoCache.clear();
}

export function createMaterials(Q) {
  const texSize = Q.textureSize;
  const groundTex = generateTexture('mud', texSize);
  groundTex.repeat.set(8, 8);
  const groundNormalTex = generateTexture('mud_normal', texSize);
  groundNormalTex.repeat.set(8, 8);
  const groundRoughTex = generateTexture('mud_roughness', texSize);
  groundRoughTex.repeat.set(8, 8);
  const metalTex = generateTexture('metal', texSize);
  const metalNormalTex = generateTexture('metal_normal', texSize);
  const rustTex = generateTexture('rust', texSize);
  const concreteTex = generateTexture('concrete', texSize);
  concreteTex.repeat.set(4, 4);
  const stripeTex = generateTexture('stripes', texSize);

  const m = {};
  m.groundMat = new THREE.MeshStandardMaterial({
    map: groundTex, normalMap: groundNormalTex, normalScale: new THREE.Vector2(0.6, 0.6),
    roughnessMap: groundRoughTex, roughness: 0.92, metalness: 0.02, transparent: true, opacity: 0.97
  });
  m.concreteMat = new THREE.MeshStandardMaterial({ map: concreteTex, roughness: 0.85, metalness: 0.05, bumpMap: rustTex, bumpScale: 0.02 });
  m.pumpjackYellowMat = new THREE.MeshStandardMaterial({ color: '#d4a017', roughness: 0.38, metalness: 0.75, map: metalTex, normalMap: metalNormalTex, normalScale: new THREE.Vector2(0.4, 0.4) });
  m.safetyYellowMat = new THREE.MeshStandardMaterial({ color: '#f5c518', roughness: 0.32, metalness: 0.55 });
  m.warningRedMat = new THREE.MeshStandardMaterial({ color: '#cc2222', roughness: 0.35, metalness: 0.5 });
  m.pipelineCoatedGreenMat = new THREE.MeshStandardMaterial({ color: '#1a7a3a', roughness: 0.28, metalness: 0.7 });
  m.storageSilverMat = new THREE.MeshStandardMaterial({ color: '#d0d8e0', roughness: 0.25, metalness: 0.75 });
  m.structuralSteelMat = new THREE.MeshStandardMaterial({ color: '#3a4455', roughness: 0.48, metalness: 0.68, map: metalTex });
  m.pipelineSteelMat = new THREE.MeshStandardMaterial({ color: '#707880', roughness: 0.25, metalness: 0.85 });
  m.rustSteelMat = new THREE.MeshStandardMaterial({ color: '#8a4d10', roughness: 0.72, metalness: 0.38, map: rustTex });
  m.oilSpillMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.08, metalness: 0.92 });
  m.stripeWarningMat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.3, map: stripeTex });
  m.steamInjectionPipeMat = new THREE.MeshStandardMaterial({ color: '#d8dde6', roughness: 0.2, metalness: 0.85, emissive: '#ff8c00', emissiveIntensity: 0.06 });
  m.darkSteelMat = new THREE.MeshStandardMaterial({ color: '#1a1e28', roughness: 0.55, metalness: 0.7 });
  m.blueEquipmentMat = new THREE.MeshStandardMaterial({ color: '#1e5fa0', roughness: 0.35, metalness: 0.65 });
  m.greenEquipmentMat = new THREE.MeshStandardMaterial({ color: '#1a6b35', roughness: 0.35, metalness: 0.6 });
  m.whiteEquipmentMat = new THREE.MeshStandardMaterial({ color: '#e8eaed', roughness: 0.3, metalness: 0.5 });
  m.boltMat = new THREE.MeshStandardMaterial({ color: '#888', roughness: 0.2, metalness: 0.9 });
  m.rubberMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.9, metalness: 0.0 });
  m.glassMat = new THREE.MeshPhysicalMaterial({ color: '#c0d8f0', transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.1, transmission: 0.7, thickness: 0.3 });
  m.steamPipeMat = new THREE.MeshStandardMaterial({ color: '#aaa', roughness: 0.3, metalness: 0.75 });
  m.handrailMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.35, metalness: 0.6 });
  m.ladderMat = new THREE.MeshStandardMaterial({ color: '#777', roughness: 0.4, metalness: 0.75 });
  m.skidMat = new THREE.MeshStandardMaterial({ color: '#2a3040', roughness: 0.5, metalness: 0.7 });
  m.valveWheelMat = new THREE.MeshStandardMaterial({ color: '#cc3333', roughness: 0.4, metalness: 0.6 });
  m.wireMat = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.5, metalness: 0.7 });
  m.trussMat = new THREE.MeshStandardMaterial({ color: '#4a5568', roughness: 0.5, metalness: 0.7 });
  m.platformMat = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.6, metalness: 0.5 });
  m.stairMat = new THREE.MeshStandardMaterial({ color: '#666', roughness: 0.5, metalness: 0.6 });
  m.beltMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.85, metalness: 0.05 });
  m.suckerRodMat = new THREE.MeshStandardMaterial({ color: '#888', roughness: 0.3, metalness: 0.9 });
  m.casingCouplingMat = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.4, metalness: 0.8 });
  m.tubingCollarMat = new THREE.MeshStandardMaterial({ color: '#606870', roughness: 0.3, metalness: 0.85 });
  m.insulationMat = new THREE.MeshStandardMaterial({ color: '#b0b0b0', roughness: 0.7, metalness: 0.2, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  m.flangeMat = new THREE.MeshStandardMaterial({ color: '#666', roughness: 0.3, metalness: 0.8 });

  const cloudTex = generateTexture('clouds', texSize);
  m.roadMat = new THREE.MeshStandardMaterial({ color: '#524335', map: concreteTex, roughness: 0.95, metalness: 0.02 });
  m.stoneMat = new THREE.MeshStandardMaterial({ color: '#7a7a72', roughness: 0.9, metalness: 0.05 });
  m.shrubMat = new THREE.MeshStandardMaterial({ color: '#2a5a1a', roughness: 0.85, metalness: 0.02 });
  m.capRockMat = new THREE.MeshStandardMaterial({ color: '#4b5563', roughness: 0.8, metalness: 0.2, transparent: true, opacity: 0.3 });
  m.sandstoneMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.8, metalness: 0.1, transparent: true, opacity: 0.35 });
  m.reservoirMaterial = new THREE.MeshStandardMaterial({ color: '#8b5cf6', transparent: true, opacity: 0.85, emissive: '#5b21b6', emissiveIntensity: 0.65, roughness: 0.2, metalness: 0.9 });
  m.cloudMat = new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, opacity: 0.65, depthWrite: false, side: THREE.DoubleSide });
  m.fireExtMat = new THREE.MeshStandardMaterial({ color: '#cc2222', roughness: 0.35, metalness: 0.6 });
  m.signMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.3, metalness: 0.4 });
  m.poleMat = new THREE.MeshStandardMaterial({ color: '#5a4a3a', roughness: 0.8, metalness: 0.05 });
  m.fenceMat = new THREE.MeshStandardMaterial({ color: '#777', roughness: 0.5, metalness: 0.7 });
  m.workLightMat = new THREE.MeshBasicMaterial({ color: '#fffde0', toneMapped: false });
  m.bollardMat = new THREE.MeshStandardMaterial({ color: '#eab308', roughness: 0.4, metalness: 0.5 });

  // ── Oil Flow Fluid System Materials ──────────────────────────────────────
  const oilFlowCanvas = document.createElement('canvas');
  oilFlowCanvas.width = 64; oilFlowCanvas.height = 256;
  const oilFlowCtx = oilFlowCanvas.getContext('2d');
  const oilGrd = oilFlowCtx.createLinearGradient(0, 0, 64, 0);
  oilGrd.addColorStop(0, '#060402'); oilGrd.addColorStop(0.5, '#110906'); oilGrd.addColorStop(1, '#060402');
  oilFlowCtx.fillStyle = oilGrd; oilFlowCtx.fillRect(0, 0, 64, 256);
  for (let s = 0; s < 16; s++) {
    const x0 = Math.random() * 64;
    const alpha = 0.08 + Math.random() * 0.18;
    oilFlowCtx.fillStyle = `rgba(110,45,6,${alpha})`;
    oilFlowCtx.beginPath();
    oilFlowCtx.ellipse(x0, 128, 2, 70 + Math.random() * 80, 0, 0, Math.PI * 2);
    oilFlowCtx.fill();
  }
  const oilFlowTex = new THREE.CanvasTexture(oilFlowCanvas);
  oilFlowTex.wrapS = THREE.RepeatWrapping; oilFlowTex.wrapT = THREE.RepeatWrapping;
  oilFlowTex.repeat.set(1, 2);

  m.oilInnerFluidMat = new THREE.MeshStandardMaterial({
    color: '#130a03', map: oilFlowTex, roughness: 0.28, metalness: 0.12,
    emissive: '#2a1004', emissiveIntensity: 0.04,
    depthTest: true, depthWrite: true
  });
  m.oilInnerFluidMat.userData.oilFlowTex = oilFlowTex;

  m.oilSurfaceMat = new THREE.MeshStandardMaterial({
    color: '#1e0e05', roughness: 0.18, metalness: 0.22,
    emissive: '#1a0802', emissiveIntensity: 0.03
  });

  m.oilGlowStreakMat = new THREE.MeshBasicMaterial({
    color: '#d4621a', transparent: true, opacity: 0.75, depthWrite: false, toneMapped: false
  });

  m.pipeOuterMat = new THREE.MeshPhysicalMaterial({
    color: '#c2d0de', transparent: true, opacity: 0.30,
    roughness: 0.04, metalness: 0.08,
    transmission: 0.85, thickness: 1.4, ior: 1.50,
    depthWrite: false
  });
  m.pipeOuterMat.renderOrder = 4;

  m.pipeWallMat = new THREE.MeshStandardMaterial({
    color: '#bcc8d4', roughness: 0.15, metalness: 0.62,
    depthWrite: true, side: THREE.BackSide
  });

  m._textures = [groundTex, groundNormalTex, groundRoughTex, metalTex, metalNormalTex, rustTex, concreteTex, stripeTex, cloudTex, oilFlowTex];
  return m;
}

export function addBeacon(parent, x, y, z, warningBeacons) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const bulbGeo = getSharedGeometry('beaconBulb', () => new THREE.SphereGeometry(0.3, 8, 8));
  const bulbMat = getSharedGeometry('beaconBulbMat', () => new THREE.MeshBasicMaterial({ color: '#ff3344', toneMapped: false }));
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  g.add(bulb);
  const housingGeo = getSharedGeometry('beaconHousing', () => new THREE.CylinderGeometry(0.5, 0.4, 0.6, 6));
  const housingMat = getSharedGeometry('beaconHousingMat', () => new THREE.MeshStandardMaterial({ color: '#222225', roughness: 0.5, metalness: 0.8 }));
  const housing = new THREE.Mesh(housingGeo, housingMat);
  housing.position.y = -0.3;
  g.add(housing);
  const light = new THREE.PointLight('#ff3344', 0.6, 12);
  g.add(light);
  parent.add(g);
  warningBeacons.push(g);
  return g;
}

export function buildDetailedPipe(start, end, material, pipelineGroup, m, hasInsulation) {
  const distance = start.distanceTo(end);
  const pipeRadius = 0.72;
  const pipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, distance, 10);
  const pipeMesh = new THREE.Mesh(pipeGeo, material);
  pipeMesh.position.copy(start).add(end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  pipeMesh.setRotationFromQuaternion(quaternion);
  pipelineGroup.add(pipeMesh);

  // Pipe wall shell
  const wallGeo = new THREE.CylinderGeometry(pipeRadius + 0.08, pipeRadius + 0.08, distance, 10, 1, true);
  const wallMesh = new THREE.Mesh(wallGeo, m.pipelineSteelMat);
  wallMesh.position.copy(pipeMesh.position);
  wallMesh.setRotationFromQuaternion(quaternion);
  pipelineGroup.add(wallMesh);

  if (hasInsulation) {
    const insulGeo = new THREE.CylinderGeometry(pipeRadius + 0.28, pipeRadius + 0.28, distance, 10, 1, true);
    const insul = new THREE.Mesh(insulGeo, m.insulationMat);
    insul.position.copy(pipeMesh.position);
    insul.setRotationFromQuaternion(quaternion);
    pipelineGroup.add(insul);

    const bandCount = Math.max(1, Math.floor(distance / 5));
    const bandGeo = getSharedGeometry('steamBandGeo', () => new THREE.CylinderGeometry(pipeRadius + 0.30, pipeRadius + 0.30, 0.18, 8));
    for (let bi = 0; bi < bandCount; bi++) {
      const t = (bi + 0.5) / bandCount;
      const bp = new THREE.Vector3().lerpVectors(start, end, t);
      const band = new THREE.Mesh(bandGeo, m.handrailMat);
      band.position.copy(bp);
      band.setRotationFromQuaternion(quaternion);
      pipelineGroup.add(band);
    }
  }

  return pipeMesh;
}

export function buildFluidPipeSegment(start, end, group, m, fluidRegistry, role = 'oil') {
  const PIPE_R = 0.72;
  const FLUID_R = 0.60;
  const WALL_R = PIPE_R + 0.08;

  const distance = start.distanceTo(end);
  const midPt = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  // 1. Outer glass shell
  const outerGeo = new THREE.CylinderGeometry(WALL_R, WALL_R, distance, 10, 1, false);
  const outerMesh = new THREE.Mesh(outerGeo, m.pipeOuterMat);
  outerMesh.position.copy(midPt);
  outerMesh.setRotationFromQuaternion(quat);
  outerMesh.renderOrder = 4;
  group.add(outerMesh);

  // 2. Inner wall backface
  const wallGeo = new THREE.CylinderGeometry(WALL_R - 0.02, WALL_R - 0.02, distance, 10, 1, true);
  const wallMesh = new THREE.Mesh(wallGeo, m.pipeWallMat);
  wallMesh.position.copy(midPt);
  wallMesh.setRotationFromQuaternion(quat);
  wallMesh.renderOrder = 1;
  group.add(wallMesh);

  // 3. Inner fluid cylinder
  const fluidMat = m.oilInnerFluidMat.clone();
  fluidMat.map = m.oilInnerFluidMat.map.clone();
  fluidMat.map.wrapS = THREE.RepeatWrapping;
  fluidMat.map.wrapT = THREE.RepeatWrapping;
  fluidMat.map.repeat.set(1, Math.max(1, Math.round(distance / 4)));
  fluidMat.map.needsUpdate = true;

  const horizontalness = 1.0 - Math.abs(direction.dot(new THREE.Vector3(0, 1, 0)));
  const gravOffset = new THREE.Vector3(0, -FLUID_R * 0.10 * horizontalness, 0);

  const fluidGeo = new THREE.CylinderGeometry(FLUID_R, FLUID_R, distance - 0.05, 10, 1, false);
  const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
  fluidMesh.position.copy(midPt).add(gravOffset);
  fluidMesh.setRotationFromQuaternion(quat);
  fluidMesh.renderOrder = 0;
  group.add(fluidMesh);

  // 4. Oil surface cap
  const surfGeo = new THREE.CylinderGeometry(FLUID_R * 0.92, FLUID_R * 0.92, 0.02, 10);
  const surfMesh = new THREE.Mesh(surfGeo, m.oilSurfaceMat);
  const topOffset = new THREE.Vector3(0, FLUID_R * horizontalness * 0.90, 0);
  surfMesh.position.copy(midPt).add(topOffset).add(gravOffset);
  surfMesh.setRotationFromQuaternion(quat);
  surfMesh.renderOrder = 2;
  group.add(surfMesh);

  // 5. Directional chevrons
  const chevrons = [];
  const chevCount = Math.max(2, Math.min(5, Math.ceil(distance / 4)));
  const chevGeo = getSharedGeometry('pipeChevGeo', () => new THREE.ConeGeometry(0.10, 0.35, 4));
  for (let ci = 0; ci < chevCount; ci++) {
    const chev = new THREE.Mesh(chevGeo, m.oilGlowStreakMat);
    chev.setRotationFromQuaternion(quat);
    chev.renderOrder = 5;
    group.add(chev);
    chevrons.push(chev);
  }

  // 6. Elbow rings
  const elbowGeo = getSharedGeometry('pipeElbowGeo', () => new THREE.TorusGeometry(WALL_R + 0.02, 0.055, 6, 12));
  [start, end].forEach(pt => {
    const elbowMesh = new THREE.Mesh(elbowGeo, m.pipeWallMat);
    elbowMesh.position.copy(pt);
    elbowMesh.setRotationFromQuaternion(quat);
    group.add(elbowMesh);
  });

  const ref = {
    fluidMesh,
    fluidMat,
    surfMesh,
    chevrons,
    outerMesh,
    startPt: start.clone(),
    endPt: end.clone(),
    direction: direction.clone(),
    role,
    horizontalness,
    baseGravOffset: gravOffset.clone(),
    midPt: midPt.clone(),
    distance,
    _uvOffset: 0
  };
  fluidRegistry.push(ref);
  return ref;
}

export function createGrassTuftGeometry() {
  const geom = new THREE.BufferGeometry();
  const vertices = []; const indices = []; const colors = [];
  const bladeCount = 5; let vertexIdx = 0;
  for (let b = 0; b < bladeCount; b++) {
    const angle = (b * Math.PI * 2) / bladeCount;
    const height = 0.5 + Math.random() * 0.8;
    const lean = 0.15 + Math.random() * 0.2;
    const cos = Math.cos(angle); const sin = Math.sin(angle);
    const w = 0.05;
    const bx1 = -sin * w; const bz1 = cos * w; const bx2 = sin * w; const bz2 = -cos * w;
    const tx = cos * lean; const tz = sin * lean; const ty = height;
    vertices.push(bx1, 0, bz1, bx2, 0, bz2, tx, ty, tz);
    colors.push(0.08, 0.18, 0.06, 0.08, 0.18, 0.06, 0.55, 0.52, 0.12);
    const baseIdx = vertexIdx;
    indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
    vertexIdx += 3;
  }
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

export const EQUIPMENT_FOOTPRINTS = [
  { x: -7.5, z: 18, r: 14 }, { x: 5, z: 18, r: 6 }, { x: 28, z: 15, r: 18 },
  { x: 16, z: -5, r: 10 }, { x: -16, z: -15, r: 8 }, { x: 38, z: -22, r: 5 },
  { x: -28, z: -28, r: 12 }, { x: 22, z: -12, r: 5 }, { x: -38, z: 10, r: 4 }
];

export function isInsideFootprint(x, z, extraRadius = 0) {
  for (const fp of EQUIPMENT_FOOTPRINTS) {
    if (Math.sqrt((x - fp.x) ** 2 + (z - fp.z) ** 2) < fp.r + extraRadius) return true;
  }
  return false;
}

export function getDesertElevation(x, z) {
  const distFromCenter = Math.hypot(x * 0.9, z * 1.05);
  const dunePrimary = Math.sin(x * 0.022 + z * 0.032) * 5.8 + Math.cos(x * 0.038 - z * 0.024) * 4.2;
  const duneSecondary = Math.sin((x * 0.7 + z * 1.1) * 0.065) * 2.2 + Math.cos(x * 0.12 - z * 0.08) * 0.8;
  const perimeterRise = Math.max(0, (distFromCenter - 42) * 0.14) ** 1.15;
  const totalDune = dunePrimary + duneSecondary + perimeterRise;
  
  if (distFromCenter < 26) return 0.0;
  if (distFromCenter > 56) return totalDune;
  
  const t = (distFromCenter - 26) / (56 - 26);
  const smooth = t * t * (3 - 2 * t);
  return totalDune * smooth;
}

export function buildKhejriTree(m) {
  const group = new THREE.Group();
  
  // Trunk
  const trunkGeo = getSharedGeometry('treeTrunkGeo', () => new THREE.CylinderGeometry(0.22, 0.45, 4.5, 5));
  const trunkMesh = new THREE.Mesh(trunkGeo, m.poleMat);
  trunkMesh.position.y = 2.25;
  trunkMesh.castShadow = true;
  group.add(trunkMesh);
  
  // Branches & foliage canopy
  const branchGeo = getSharedGeometry('treeBranchGeo', () => new THREE.CylinderGeometry(0.08, 0.16, 2.4, 4));
  const puffGeo = getSharedGeometry('treePuffGeo', () => new THREE.DodecahedronGeometry(1.4, 0));
  
  const branchCount = 4;
  for (let b = 0; b < branchCount; b++) {
    const angle = (b * Math.PI * 2) / branchCount;
    const branch = new THREE.Mesh(branchGeo, m.poleMat);
    branch.position.set(Math.cos(angle) * 0.6, 3.8, Math.sin(angle) * 0.6);
    branch.rotation.z = Math.cos(angle) * 0.75;
    branch.rotation.x = Math.sin(angle) * 0.75;
    branch.castShadow = true;
    group.add(branch);
    
    const puff = new THREE.Mesh(puffGeo, m.shrubMat);
    puff.position.set(Math.cos(angle) * 2.2, 4.8, Math.sin(angle) * 2.2);
    puff.scale.set(1.4, 0.65, 1.4);
    puff.castShadow = true;
    group.add(puff);
  }
  
  return group;
}

// ── Instanced Rocks Builder (55 rocks in 1 single draw call) ───────────────
export function buildInstancedRocks(count, parentGroup) {
  const rockGeo = new THREE.DodecahedronGeometry(1.0, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x8a7862,
    roughness: 0.95,
    metalness: 0.05
  });

  const instancedMesh = new THREE.InstancedMesh(rockGeo, rockMat, count);
  const dummy = new THREE.Object3D();
  let placed = 0;

  for (let r = 0; r < count; r++) {
    const rx = (Math.random() - 0.5) * 210;
    const rz = (Math.random() - 0.5) * 210;
    if (!isInsideFootprint(rx, rz, 4)) {
      const sx = 0.6 + Math.random() * 1.5;
      const sy = 0.3 + Math.random() * 0.8;
      const sz = 0.6 + Math.random() * 1.5;
      const terrainHeight = getDesertElevation(rx, rz);
      
      dummy.position.set(rx, terrainHeight - 0.15, rz);
      dummy.scale.set(sx, sy, sz);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(placed++, dummy.matrix);
    }
  }

  instancedMesh.count = placed;
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.receiveShadow = true;
  instancedMesh.castShadow = false; // Rocks don't need expensive shadows
  parentGroup.add(instancedMesh);
  return instancedMesh;
}

// ── Instanced Desert Scrub Bushes (45 bushes in 1 draw call) ───────────────
export function buildInstancedScrub(count, m, parentGroup) {
  const bushGeo = new THREE.DodecahedronGeometry(0.7, 0);
  const instancedMesh = new THREE.InstancedMesh(bushGeo, m.shrubMat, count * 2);
  const dummy = new THREE.Object3D();
  let placed = 0;

  for (let s = 0; s < count; s++) {
    const rx = (Math.random() - 0.5) * 210;
    const rz = (Math.random() - 0.5) * 210;
    if (!isInsideFootprint(rx, rz, 6)) {
      const by = getDesertElevation(rx, rz);
      const sc = 0.7 + Math.random() * 0.7;
      
      dummy.position.set(rx, by + 0.2, rz);
      dummy.scale.set(sc * 1.2, sc * 0.75, sc * 1.2);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(placed++, dummy.matrix);

      // Sub-clump
      dummy.position.set(rx + (Math.random() - 0.5) * 0.6, by + 0.15, rz + (Math.random() - 0.5) * 0.6);
      dummy.scale.set(sc * 0.8, sc * 0.5, sc * 0.8);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(placed++, dummy.matrix);
    }
  }

  instancedMesh.count = placed;
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.receiveShadow = true;
  instancedMesh.castShadow = false;
  parentGroup.add(instancedMesh);
  return instancedMesh;
}

// ── Instanced Desert Grass (GrassCount in 1 draw call) ──────────────────────
export function buildInstancedGrass(count, parentGroup) {
  if (count <= 0) return null;
  const grassTuftGeo = createGrassTuftGeometry();
  const grassTuftMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.88 });
  const instancedMesh = new THREE.InstancedMesh(grassTuftGeo, grassTuftMat, count);
  const dummy = new THREE.Object3D();
  let placed = 0;

  for (let g = 0; g < count; g++) {
    const rx = (Math.random() - 0.5) * 210;
    const rz = (Math.random() - 0.5) * 210;
    if (!isInsideFootprint(rx, rz, 4)) {
      const gy = getDesertElevation(rx, rz);
      const sc = 0.7 + Math.random() * 0.6;
      dummy.position.set(rx, gy - 0.25, rz);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(placed++, dummy.matrix);
    }
  }

  instancedMesh.count = placed;
  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.receiveShadow = true;
  instancedMesh.castShadow = false;
  parentGroup.add(instancedMesh);
  return instancedMesh;
}



// ── Master Industrial Energy Terminal & Infrastructure ─────────────────────
export function buildIndustrialTerminal(parentGroup, m, _Q) {
  const terminalGroup = new THREE.Group();
  parentGroup.add(terminalGroup);

  // 1. Main High-Tech Asphalt Tarmac Ground (140m x 120m)
  const tarmacGeo = new THREE.BoxGeometry(140, 0.8, 120);
  const tarmacMat = new THREE.MeshStandardMaterial({
    color: 0x141824,
    roughness: 0.65,
    metalness: 0.25,
    flatShading: false
  });
  const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
  tarmac.position.set(0, -0.4, 0);
  tarmac.receiveShadow = true;
  terminalGroup.add(tarmac);

  // 2. Concrete Equipment Zones / Pads
  // SRP Pumpjack Pad
  const srpPadGeo = new THREE.BoxGeometry(26, 0.4, 16);
  const srpPad = new THREE.Mesh(srpPadGeo, m.concreteMat);
  srpPad.position.set(-7.5, 0.2, 18);
  srpPad.receiveShadow = true;
  terminalGroup.add(srpPad);

  // Tank Farm Bund Containment Basin
  const tankBundGeo = new THREE.BoxGeometry(46, 0.35, 34);
  const tankBund = new THREE.Mesh(tankBundGeo, m.concreteMat);
  tankBund.position.set(28, 0.18, 15);
  tankBund.receiveShadow = true;
  terminalGroup.add(tankBund);

  // Tank Bund Retaining Dike Wall (Yellow/Black Safety Perimeter)
  const wallMat = m.stripeWarningMat;
  const dikeH = 0.8;
  // North & South dike walls
  const dikeNSGeo = new THREE.BoxGeometry(46.4, dikeH, 0.5);
  const dikeN = new THREE.Mesh(dikeNSGeo, wallMat);
  dikeN.position.set(28, 0.4 + dikeH / 2, 15 - 17);
  const dikeS = dikeN.clone();
  dikeS.position.z = 15 + 17;
  // East & West dike walls
  const dikeEWGeo = new THREE.BoxGeometry(0.5, dikeH, 34.4);
  const dikeW = new THREE.Mesh(dikeEWGeo, wallMat);
  dikeW.position.set(28 - 23, 0.4 + dikeH / 2, 15);
  const dikeE = dikeW.clone();
  dikeE.position.x = 28 + 23;
  terminalGroup.add(dikeN, dikeS, dikeW, dikeE);

  // Steam Boiler Station Skid Platform
  const boilerPadGeo = new THREE.BoxGeometry(24, 0.35, 18);
  const boilerPad = new THREE.Mesh(boilerPadGeo, m.concreteMat);
  boilerPad.position.set(-16, 0.18, -15);
  boilerPad.receiveShadow = true;
  terminalGroup.add(boilerPad);

  // Separator & Test Header Skid Pad
  const sepPadGeo = new THREE.BoxGeometry(18, 0.35, 14);
  const sepPad = new THREE.Mesh(sepPadGeo, m.concreteMat);
  sepPad.position.set(16, 0.18, -5);
  sepPad.receiveShadow = true;
  terminalGroup.add(sepPad);

  // 3. Precision Road & Safety Markings (Yellow & White Striping)
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
  const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, side: THREE.DoubleSide });

  // Main access roadway center lines
  for (let z = -50; z <= 50; z += 10) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 5), whiteLineMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(-38, 0.02, z);
    terminalGroup.add(dash);
  }

  // Crosswalk near SRP bay
  for (let c = 0; c < 6; c++) {
    const cross = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 3.5), whiteLineMat);
    cross.rotation.x = -Math.PI / 2;
    cross.position.set(-25 + c * 1.6, 0.02, 18);
    terminalGroup.add(cross);
  }

  // Equipment Bay Yellow Safety Bounds
  const srpBorder = new THREE.Mesh(new THREE.RingGeometry(12, 12.3, 4), stripeMat);
  srpBorder.rotation.x = -Math.PI / 2;
  srpBorder.rotation.z = Math.PI / 4;
  srpBorder.position.set(-7.5, 0.02, 18);
  terminalGroup.add(srpBorder);

  // 4. Elevated Steel Structural Pipe Rack Overpass
  const pipeRackGroup = new THREE.Group();
  terminalGroup.add(pipeRackGroup);

  const rackColumnGeo = new THREE.BoxGeometry(0.35, 6.0, 0.35);
  const rackBeamGeo = new THREE.BoxGeometry(0.3, 0.3, 7.0);

  const rackXPositions = [-16, -5, 6, 17, 28];
  rackXPositions.forEach(rx => {
    // Left and right support columns
    const col1 = new THREE.Mesh(rackColumnGeo, m.structuralSteelMat);
    col1.position.set(rx, 3.0, -2);
    col1.castShadow = true;
    const col2 = col1.clone();
    col2.position.z = 4;
    // Cross beams (top and mid tier)
    const beamTop = new THREE.Mesh(rackBeamGeo, m.structuralSteelMat);
    beamTop.position.set(rx, 5.8, 1);
    beamTop.castShadow = true;
    const beamMid = beamTop.clone();
    beamMid.position.y = 3.6;

    pipeRackGroup.add(col1, col2, beamTop, beamMid);
  });

  // Longitudinal pipe rack stringers
  const stringerGeo = new THREE.BoxGeometry(45, 0.25, 0.25);
  const str1 = new THREE.Mesh(stringerGeo, m.structuralSteelMat);
  str1.position.set(6, 5.8, -2);
  const str2 = str1.clone();
  str2.position.z = 4;
  pipeRackGroup.add(str1, str2);

  // 5. Four High-Mast Industrial Floodlight Gantries
  const lightTowerCoords = [
    [-60, 50], [60, 50], [-60, -50], [60, -50]
  ];

  lightTowerCoords.forEach(([lx, lz]) => {
    const tower = new THREE.Group();
    tower.position.set(lx, 0, lz);
    terminalGroup.add(tower);

    // Concrete base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 1.2, 8), m.concreteMat);
    base.position.y = 0.6;
    tower.add(base);

    // Tapered lattice mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 26, 8), m.structuralSteelMat);
    mast.position.y = 13;
    mast.castShadow = true;
    tower.add(mast);

    // Top luminaire crossarm platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 1.5), m.darkSteelMat);
    platform.position.y = 26;
    tower.add(platform);

    // 4 LED flood fixtures
    for (let f = -1.5; f <= 1.5; f += 1.0) {
      const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.4), m.darkSteelMat);
      fixture.position.set(f, 26.5, 0.5);
      fixture.rotation.x = 0.4;
      tower.add(fixture);

      const lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
      lamp.position.set(f, 26.5, 0.72);
      lamp.rotation.x = 0.4;
      tower.add(lamp);
    }

    // Directional light from tower facing facility center
    const flood = new THREE.DirectionalLight(0xfffbeb, 1.2);
    flood.position.set(lx, 27, lz);
    flood.target.position.set(0, 0, 0);
    terminalGroup.add(flood);
    terminalGroup.add(flood.target);
  });

  // 6. Perimeter Heavy-Duty Industrial Security Fencing & Yellow Crash Bollards
  const fenceMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.8,
    roughness: 0.35,
    wireframe: true
  });
  const postMat = m.structuralSteelMat;

  // Perimeter posts along edges
  for (let px = -65; px <= 65; px += 10) {
    [-55, 55].forEach(pz => {
      const fpost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 6), postMat);
      fpost.position.set(px, 1.75, pz);
      terminalGroup.add(fpost);
    });
  }

  // Chainlink wire panels
  const fenceNS = new THREE.Mesh(new THREE.PlaneGeometry(130, 3.0), fenceMat);
  fenceNS.position.set(0, 1.5, -55);
  const fenceS = fenceNS.clone();
  fenceS.position.z = 55;
  const fenceEW = new THREE.Mesh(new THREE.PlaneGeometry(110, 3.0), fenceMat);
  fenceEW.rotation.y = Math.PI / 2;
  fenceEW.position.set(-65, 1.5, 0);
  const fenceE = fenceEW.clone();
  fenceE.position.x = 65;
  terminalGroup.add(fenceNS, fenceS, fenceEW, fenceE);

  // Safety Crash Bollards around Pumpjack & Tank Farm
  const bollardGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8);
  const bollardPositions = [
    [-15, 18], [-15, 10], [5, 10],
    [5, 26], [-7.5, 26],
    [5, 0], [5, 32], [51, 0], [51, 32]
  ];
  bollardPositions.forEach(([bx, bz]) => {
    const bollard = new THREE.Mesh(bollardGeo, m.bollardMat || m.handrailMat);
    bollard.position.set(bx, 0.6, bz);
    bollard.castShadow = true;
    terminalGroup.add(bollard);
  });

  return terminalGroup;
}
