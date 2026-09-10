import * as THREE from 'three';
import { addBeacon } from './sceneHelpers';

// Helper to wrap concrete pads in high-visibility yellow/black safety stripes
function addPadSafetyBorders(group, w, h, d, m, offsetY = 0) {
  // Wrap stripes around the lower half of the pad vertical walls
  const borderGeom = new THREE.BoxGeometry(w + 0.04, h * 0.35, d + 0.04);
  const border = new THREE.Mesh(borderGeom, m.stripeWarningMat);
  border.position.y = offsetY + h * 0.45;
  group.add(border);
}

export function buildPumpjack(masterGroup, m) {
  const pumpjack = new THREE.Group();
  pumpjack.position.set(-7.5, 0, 18);
  pumpjack.userData = {
    id: "pumpjack", name: "Cyclic Steam Pumpjack (BGW-014)", type: "Surface Artificial Lift (SRP)",
    purpose: "Extracts heavy viscous crude oil from Jodhpur Sandstone via sucker rod pumping.",
    status: "Active Production", health: 94, pressure: "420 psi", temp: "45 °C", flow: "118 bbl/d",
    vibration: "1.4 mm/s (Normal)", maintenance: "Scheduled in 42 days (Polished Rod Seal check)",
    alerts: "None — Operating within normal mechanical limits.",
    worldPos: new THREE.Vector3(-7.5, 10, 18)
  };
  masterGroup.add(pumpjack);

  // Concrete pad with oil stain
  const pad = new THREE.Mesh(new THREE.BoxGeometry(22, 1.2, 12), m.concreteMat);
  pad.position.y = 0.6; pad.receiveShadow = true; pad.castShadow = true;
  pumpjack.add(pad);
  const oilStain = new THREE.Mesh(new THREE.CircleGeometry(3, 16), m.oilSpillMat);
  oilStain.rotation.x = -Math.PI / 2; oilStain.position.set(2, 1.22, 0);
  pumpjack.add(oilStain);

  // Pad edge safety borders
  addPadSafetyBorders(pumpjack, 22, 1.2, 12, m, 0);

  // Textured steel checker plate walkway on pad top edge
  const walkPlate = new THREE.Mesh(new THREE.BoxGeometry(21.4, 0.03, 2.0), m.darkSteelMat);
  walkPlate.position.set(0, 1.215, 4.8);
  pumpjack.add(walkPlate);

  // Perimeter steel safety handrails
  const hrGroup = new THREE.Group();
  hrGroup.position.set(0, 1.2, 5.75);
  pumpjack.add(hrGroup);

  const hrTop = new THREE.Mesh(new THREE.BoxGeometry(21.6, 0.04, 0.04), m.handrailMat);
  hrTop.position.y = 1.15; hrGroup.add(hrTop);

  const hrMid = new THREE.Mesh(new THREE.BoxGeometry(21.6, 0.03, 0.03), m.handrailMat);
  hrMid.position.y = 0.58; hrGroup.add(hrMid);

  for (let i = 0; i < 5; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.15, 6), m.handrailMat);
    post.position.set(-10.8 + i * 5.4, 0.575, 0);
    hrGroup.add(post);
  }

  // Base frame / skid
  const skidBeam1 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.5, 0.6), m.skidMat);
  skidBeam1.position.set(0, 1.5, 3); pumpjack.add(skidBeam1);
  const skidBeam2 = skidBeam1.clone(); skidBeam2.position.z = -3; pumpjack.add(skidBeam2);
  const skidC1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 6.6), m.skidMat);
  skidC1.position.set(-8, 1.5, 0); pumpjack.add(skidC1);
  const skidC2 = skidC1.clone(); skidC2.position.x = 8; pumpjack.add(skidC2);

  // Samson posts (A-frame)
  const postGeo = new THREE.CylinderGeometry(0.35, 0.55, 15, 10);
  const postL = new THREE.Mesh(postGeo, m.pumpjackYellowMat);
  postL.position.set(-4, 8, 2.2); postL.rotation.z = 0.2; postL.rotation.x = -0.08; postL.castShadow = true;
  const postR = new THREE.Mesh(postGeo, m.pumpjackYellowMat);
  postR.position.set(-4, 8, -2.2); postR.rotation.z = 0.2; postR.rotation.x = 0.08; postR.castShadow = true;
  const postB = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 14, 8), m.pumpjackYellowMat);
  postB.position.set(-8, 7.5, 0); postB.rotation.z = -0.15; postB.castShadow = true;
  pumpjack.add(postL, postR, postB);

  // Cross bracing
  const brace1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 6), m.pumpjackYellowMat);
  brace1.position.set(-5.5, 6, 0); brace1.rotation.z = 0.6; pumpjack.add(brace1);
  const brace2 = brace1.clone(); brace2.position.set(-6, 5, 0); brace2.rotation.z = -0.4; pumpjack.add(brace2);

  // Walking beam
  const walkingBeam = new THREE.Mesh(new THREE.BoxGeometry(18, 1.5, 1.2), m.pumpjackYellowMat);
  walkingBeam.position.set(-2, 14.5, 0); walkingBeam.castShadow = true;
  pumpjack.add(walkingBeam);

  // Pivot bearing
  const pivotBearing = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 12), m.darkSteelMat);
  pivotBearing.rotation.x = Math.PI / 2; pivotBearing.position.set(-4, 14.5, 0);
  pumpjack.add(pivotBearing);

  // Horse head
  const horseHead = new THREE.Group(); horseHead.position.set(14.5, -0.5, 0);
  const hhFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 6, 1.2), m.pumpjackYellowMat);
  hhFrame.castShadow = true;
  const hhCrank = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.2, 16, 1, false, 0, Math.PI), m.pumpjackYellowMat);
  hhCrank.rotation.x = Math.PI / 2; hhCrank.rotation.z = -Math.PI / 2; hhCrank.position.set(0.4, 0, 0); hhCrank.castShadow = true;
  const bridleMat = new THREE.MeshStandardMaterial({ color: '#555', roughness: 0.4, metalness: 0.8 });
  const bridleL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5, 4), bridleMat);
  bridleL.position.set(0.0, -2.5, 0.4);
  const bridleR = bridleL.clone(); bridleR.position.z = -0.4;
  horseHead.add(hhFrame, hhCrank, bridleL, bridleR);
  walkingBeam.add(horseHead);

  // Rear counterweight
  const rearWeight = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 1.5), m.pumpjackYellowMat);
  rearWeight.position.set(-17, 0, 0); walkingBeam.add(rearWeight);

  // Gearbox with cooling fins
  const gearbox = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.5, 4), m.structuralSteelMat);
  gearbox.position.set(-8, 3, 0); gearbox.castShadow = true; pumpjack.add(gearbox);
  for (let fi = 0; fi < 6; fi++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.8, 0.3), m.structuralSteelMat);
    fin.position.set(-8 - 2.3, 3, -1.5 + fi * 0.6); pumpjack.add(fin);
  }
  const gearboxTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 3.8), m.darkSteelMat);
  gearboxTop.position.set(-8, 5.3, 0); pumpjack.add(gearboxTop);

  // Electric motor with cooling fins
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 12), m.blueEquipmentMat);
  motor.rotation.z = Math.PI / 2; motor.position.set(-8, 2, 4.5); motor.castShadow = true;
  pumpjack.add(motor);
  for (let mfi = 0; mfi < 10; mfi++) {
    const mfin = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.4, 0.15), m.blueEquipmentMat);
    const mAngle = (mfi * Math.PI * 2) / 10;
    mfin.position.set(-8, 2 + Math.sin(mAngle) * 1.25, 4.5 + Math.cos(mAngle) * 1.25);
    pumpjack.add(mfin);
  }
  const termBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.8), m.darkSteelMat);
  termBox.position.set(-8, 3.8, 4.5); pumpjack.add(termBox);

  // Belt drive
  const belt = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 8, 24), m.beltMat);
  belt.position.set(-8, 2.8, 3.3); belt.rotation.y = Math.PI / 2; pumpjack.add(belt);
  const belt2 = belt.clone(); belt2.position.z = 2.8; pumpjack.add(belt2);

  // Crank assembly
  const crank = new THREE.Group(); crank.position.set(-8, 3, 2.5); pumpjack.add(crank);
  const crankShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2, 10), m.pipelineSteelMat);
  crankShaft.rotation.x = Math.PI / 2; crank.add(crankShaft);
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(5, 0.8, 0.5), m.pipelineSteelMat);
  crankArm.position.set(2.2, 0, 0); crank.add(crankArm);
  const counterweight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 1.2), m.stripeWarningMat);
  counterweight.position.set(3.5, 0, 0.3); counterweight.castShadow = true; crank.add(counterweight);
  for (let bi = 0; bi < 4; bi++) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 6), m.boltMat);
    bolt.position.set(3.5 + (bi % 2 - 0.5) * 1.5, (bi < 2 ? -0.8 : 0.8), 0.95); crank.add(bolt);
  }
  const crank2 = crank.clone(); crank2.position.z = -2.5; pumpjack.add(crank2);
  const cranks = [crank, crank2];

  // Walking beam top handrails
  const hr1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 16, 6), m.handrailMat);
  hr1.position.set(-2, 15.8, 0.7); pumpjack.add(hr1);
  const hr2 = hr1.clone(); hr2.position.z = -0.7; pumpjack.add(hr2);
  for (let hri = 0; hri < 6; hri++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 4), m.handrailMat);
    post.position.set(-8 + hri * 3, 15.3, 0.7); pumpjack.add(post);
    const post2 = post.clone(); post2.position.z = -0.7; pumpjack.add(post2);
  }

  // Access ladder
  const lr1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 8, 4), m.ladderMat);
  lr1.position.set(-10, 5, 5.5); pumpjack.add(lr1);
  const lr2 = lr1.clone(); lr2.position.x = -9; pumpjack.add(lr2);
  for (let lri = 0; lri < 8; lri++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.2, 4), m.ladderMat);
    rung.rotation.z = Math.PI / 2; rung.position.set(-9.5, 1.5 + lri, 5.5); pumpjack.add(rung);
  }

  // Safety cage for access ladder
  for (let ci = 0; ci < 5; ci++) {
    const cageRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 6, 12, Math.PI), m.ladderMat);
    cageRing.position.set(-9.5, 3.5 + ci * 1.1, 5.5);
    cageRing.rotation.y = -Math.PI / 2;
    pumpjack.add(cageRing);
  }

  // OSHA Crank Guard (yellow safety fence)
  const guardGroup = new THREE.Group();
  guardGroup.position.set(-8, 0.6, 2.5);
  for (let i = 0; i < 4; i++) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.8, 6), m.safetyYellowMat);
    const px = (i % 2 === 0 ? 1 : -1) * 2.8;
    const pz = (i < 2 ? 1 : -1) * 1.8;
    post.position.set(px, 1.4, pz);
    guardGroup.add(post);
  }
  const railX1 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.06, 0.06), m.safetyYellowMat);
  railX1.position.set(0, 2.8, 1.8); guardGroup.add(railX1);
  const railX2 = railX1.clone(); railX2.position.z = -1.8; guardGroup.add(railX2);
  const railZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 3.6), m.safetyYellowMat);
  railZ1.position.set(2.8, 2.8, 0); guardGroup.add(railZ1);
  const railZ2 = railZ1.clone(); railZ2.position.x = -2.8; guardGroup.add(railZ2);
  const mrailX1 = railX1.clone(); mrailX1.position.y = 1.4; guardGroup.add(mrailX1);
  const mrailX2 = railX2.clone(); mrailX2.position.y = 1.4; guardGroup.add(mrailX2);
  const mrailZ1 = railZ1.clone(); mrailZ1.position.y = 1.4; guardGroup.add(mrailZ1);
  const mrailZ2 = railZ2.clone(); mrailZ2.position.y = 1.4; guardGroup.add(mrailZ2);
  pumpjack.add(guardGroup);

  // Samson post warning decals
  const dangerSign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), m.stripeWarningMat);
  dangerSign.position.set(-3.65, 7.5, 2.2);
  dangerSign.rotation.y = Math.PI / 2;
  pumpjack.add(dangerSign);

  // Gearbox output drive shaft
  const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.8, 10), m.pipelineSteelMat);
  driveShaft.rotation.x = Math.PI / 2;
  driveShaft.position.set(-8, 3, 1.5);
  pumpjack.add(driveShaft);

  // Carrier Bar Block at horsehead attachment
  const carrierBar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.6), m.darkSteelMat);
  carrierBar.position.set(0.0, -5.0, 0);
  horseHead.add(carrierBar);

  // Equalizer bar and articulated Pitman arms
  const eqBar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.2, 8), m.pipelineSteelMat);
  eqBar.rotation.z = Math.PI / 2;
  eqBar.position.set(-11, 0, 0);
  walkingBeam.add(eqBar);

  const pitmanGeo = new THREE.CylinderGeometry(0.18, 0.18, 11.5, 8);
  const pitmanL = new THREE.Mesh(pitmanGeo, m.pumpjackYellowMat);
  pitmanL.castShadow = true;
  pumpjack.add(pitmanL);

  const pitmanR = pitmanL.clone();
  pumpjack.add(pitmanR);

  return { pumpjack, beam: walkingBeam, horsehead: horseHead, cranks, pitmanL, pitmanR, eqBar };
}

export function buildDrillingRig(masterGroup, m) {
  const drillingRig = new THREE.Group();
  drillingRig.position.set(-30, 0, -28);
  drillingRig.userData = {
    id: "rig", name: "Heavy Workover Rig (WR-04)", type: "Thermal Well Workover & Intervention",
    purpose: "Executes thermal well cleanouts, casing perforations, and downhole pump installations.",
    status: "Standby Operations", health: 95, pressure: "0 psi", temp: "Ambient 38 °C",
    flow: "N/A", vibration: "0.1 mm/s", maintenance: "Derrick structure inspected (API 4F certified)",
    alerts: "Standby for cyclic steam well intervention.",
    worldPos: new THREE.Vector3(-30, 18, -28)
  };
  masterGroup.add(drillingRig);

  const substructure = new THREE.Mesh(new THREE.BoxGeometry(10, 2.5, 10), m.concreteMat);
  substructure.position.y = 1.25; drillingRig.add(substructure);

  const rigFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.4, 9.6), m.structuralSteelMat);
  rigFloor.position.y = 2.7; drillingRig.add(rigFloor);

  // Derrick Mast Structure
  for (let c = 0; c < 4; c++) {
    const dLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 34, 6), m.safetyYellowMat);
    const ang = (c * Math.PI) / 2 + Math.PI / 4;
    dLeg.position.set(Math.cos(ang) * 3.8, 19.5, Math.sin(ang) * 3.8);
    dLeg.rotation.z = Math.cos(ang) * -0.06;
    dLeg.rotation.x = Math.sin(ang) * 0.06;
    drillingRig.add(dLeg);
  }

  const crownBlock = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 3.2), m.darkSteelMat);
  crownBlock.position.y = 36.5; drillingRig.add(crownBlock);

  const travelingBlock = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.2), m.greenEquipmentMat);
  travelingBlock.position.y = 22; drillingRig.add(travelingBlock);

  const rotaryTable = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.4, 16), m.darkSteelMat);
  rotaryTable.position.y = 2.9; drillingRig.add(rotaryTable);

  return { drillingRig, travelingBlock };
}

export function buildTankFarm(masterGroup, m) {
  const tankFarm = new THREE.Group();
  tankFarm.position.set(28, 0, 15);
  tankFarm.userData = {
    id: "tanks", name: "Crude Storage & Settling Tanks (TK-101 / TK-102)", type: "Thermal Crude Dehydration & Storage Battery",
    purpose: "Stores mobilized heavy crude oil, allows thermal gravity settling, and buffers export.",
    status: "Filling (78.4% Capacity)", health: 96, pressure: "Atmospheric (5 psi N2 blanketing)", temp: "68 °C",
    flow: "212.2 bbl/d into TK-102", vibration: "0.2 mm/s (Optimal)", maintenance: "Ultrasonic tank shell thickness verified",
    alerts: "Thermal heating coils maintaining 68°C to prevent crude solidification.",
    worldPos: new THREE.Vector3(28, 8, 15)
  };
  masterGroup.add(tankFarm);

  // High-spec metallic silver tank material with authentic PBR sheen
  const tankSteelMat = new THREE.MeshStandardMaterial({
    color: '#d0d8e2',
    roughness: 0.25,
    metalness: 0.85
  });

  const tankRoofMat = new THREE.MeshStandardMaterial({
    color: '#b8c4d2',
    roughness: 0.32,
    metalness: 0.75
  });

  const stairMat = new THREE.MeshStandardMaterial({
    color: '#64748b',
    roughness: 0.45,
    metalness: 0.7
  });

  const yellowHandrailMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.35,
    metalness: 0.4
  });

  function buildMasterTank(x, z, tag, fillRatio = 0.75) {
    const tank = new THREE.Group();
    tank.position.set(x, 0, z);

    const TANK_R = 7.5;
    const TANK_H = 12.5;

    // 1. Concrete Foundation Plinth Ring
    const ringGeo = new THREE.CylinderGeometry(TANK_R + 0.6, TANK_R + 0.8, 0.6, 32);
    const plinth = new THREE.Mesh(ringGeo, m.concreteMat);
    plinth.position.y = 0.3;
    plinth.receiveShadow = true;
    tank.add(plinth);

    // 2. Tank Main Cylindrical Shell
    const shellGeo = new THREE.CylinderGeometry(TANK_R, TANK_R, TANK_H, 48, 6, false);
    const shell = new THREE.Mesh(shellGeo, tankSteelMat);
    shell.position.y = 0.6 + TANK_H / 2;
    shell.castShadow = true;
    shell.receiveShadow = true;
    tank.add(shell);

    // 3. Horizontal Wind Girder Reinforcement Rings (4 rings)
    const girderGeo = new THREE.TorusGeometry(TANK_R + 0.08, 0.08, 8, 48);
    girderGeo.rotateX(Math.PI / 2);
    for (let gi = 1; gi <= 3; gi++) {
      const gMesh = new THREE.Mesh(girderGeo, tankSteelMat);
      gMesh.position.y = 0.6 + (TANK_H / 4) * gi;
      gMesh.castShadow = true;
      tank.add(gMesh);
    }

    // 4. Low-Profile Geodesic Dome / Cone Roof
    const roofGeo = new THREE.ConeGeometry(TANK_R + 0.2, 1.6, 48);
    const roof = new THREE.Mesh(roofGeo, tankRoofMat);
    roof.position.y = 0.6 + TANK_H + 0.8;
    roof.castShadow = true;
    tank.add(roof);

    // 5. Roof Center Apex Vent
    const ventGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
    const vent = new THREE.Mesh(ventGeo, m.darkSteelMat);
    vent.position.y = 0.6 + TANK_H + 1.8;
    tank.add(vent);

    // 6. Helical Exterior Spiral Staircase with Handrails
    const stairGroup = new THREE.Group();
    tank.add(stairGroup);

    const stepCount = 38;
    const turns = 0.95; // wraps ~340 degrees around tank
    const stepW = 1.3;
    const stepD = 0.5;
    const stepH = 0.06;
    const stepGeo = new THREE.BoxGeometry(stepW, stepH, stepD);

    const railPts = [];

    for (let s = 0; s < stepCount; s++) {
      const t = s / stepCount;
      const angle = t * Math.PI * 2 * turns - Math.PI / 2;
      const r = TANK_R + stepW / 2 + 0.05;
      const sy = 0.6 + t * TANK_H;

      const step = new THREE.Mesh(stepGeo, stairMat);
      step.position.set(Math.cos(angle) * r, sy, Math.sin(angle) * r);
      step.rotation.y = -angle;
      step.castShadow = true;
      stairGroup.add(step);

      // Handrail posts every 4 steps
      if (s % 4 === 0) {
        const outerR = TANK_R + stepW + 0.05;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), yellowHandrailMat);
        post.position.set(Math.cos(angle) * outerR, sy + 0.55, Math.sin(angle) * outerR);
        stairGroup.add(post);
      }

      const outerR = TANK_R + stepW + 0.05;
      railPts.push(new THREE.Vector3(Math.cos(angle) * outerR, sy + 1.1, Math.sin(angle) * outerR));
    }

    // Continuous Outer Spiral Handrail Tube
    if (railPts.length > 2) {
      const curve = new THREE.CatmullRomCurve3(railPts);
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.035, 6, false);
      const tube = new THREE.Mesh(tubeGeo, yellowHandrailMat);
      stairGroup.add(tube);
    }

    // 7. Roof Walkway Platform & Full 360° Safety Guardrail
    const roofRingGeo = new THREE.RingGeometry(TANK_R - 1.2, TANK_R + 0.1, 36);
    roofRingGeo.rotateX(-Math.PI / 2);
    const roofWalkway = new THREE.Mesh(roofRingGeo, stairMat);
    roofWalkway.position.y = 0.6 + TANK_H + 0.02;
    tank.add(roofWalkway);

    // Top Perimeter Handrail
    const topHandrailPts = [];
    const topPostCount = 18;
    for (let p = 0; p <= topPostCount; p++) {
      const pAngle = (p / topPostCount) * Math.PI * 2;
      const pr = TANK_R + 0.05;
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), yellowHandrailMat);
      post.position.set(Math.cos(pAngle) * pr, 0.6 + TANK_H + 0.55, Math.sin(pAngle) * pr);
      tank.add(post);
      topHandrailPts.push(new THREE.Vector3(Math.cos(pAngle) * pr, 0.6 + TANK_H + 1.1, Math.sin(pAngle) * pr));
    }
    const topCurve = new THREE.CatmullRomCurve3(topHandrailPts);
    const topTube = new THREE.Mesh(new THREE.TubeGeometry(topCurve, 48, 0.035, 6, true), yellowHandrailMat);
    tank.add(topTube);

    // 8. Radar Level Transmitter Box with Telemetry Light
    const radar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.6), m.blueEquipmentMat);
    radar.position.set(TANK_R * 0.5, 0.6 + TANK_H + 0.7, TANK_R * 0.5);
    const radarLed = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    radarLed.position.set(0, 0.35, 0.31);
    radar.add(radarLed);
    tank.add(radar);

    // 9. Pressure / Vacuum Relief Valve (PVRV) Assembly on Roof
    const pvrvGroup = new THREE.Group();
    pvrvGroup.position.set(-TANK_R * 0.45, 0.6 + TANK_H + 0.5, -TANK_R * 0.45);
    const pvrvBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 12), m.structuralSteelMat);
    const pvrvHoodL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.2, 0.5, 12), m.pipelineSteelMat);
    pvrvHoodL.position.set(0.35, 0.45, 0);
    pvrvHoodL.rotation.z = -0.4;
    const pvrvHoodR = pvrvHoodL.clone();
    pvrvHoodR.position.x = -0.35;
    pvrvHoodR.rotation.z = 0.4;
    pvrvGroup.add(pvrvBody, pvrvHoodL, pvrvHoodR);
    tank.add(pvrvGroup);

    // 10. Ground Cleanout Manhole Flange Door (Bolted)
    const manholeGroup = new THREE.Group();
    manholeGroup.position.set(0, 1.8, TANK_R + 0.05);
    const manholeRim = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.3, 16), m.structuralSteelMat);
    manholeRim.rotation.x = Math.PI / 2;
    const manholeCover = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), m.pipelineSteelMat);
    manholeCover.position.z = 0.16;
    manholeCover.rotation.x = Math.PI / 2;
    manholeGroup.add(manholeRim, manholeCover);

    // Perimeter Bolt Studs on Manhole
    for (let bi = 0; bi < 8; bi++) {
      const bAng = (bi / 8) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), m.boltMat);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(Math.cos(bAng) * 0.75, Math.sin(bAng) * 0.75, 0.22);
      manholeGroup.add(bolt);
    }
    tank.add(manholeGroup);

    // 11. Vertical Digital Level Indicator Board along Tank Wall
    const boardGeo = new THREE.BoxGeometry(0.4, TANK_H * 0.8, 0.08);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(TANK_R * 0.88, 0.6 + TANK_H * 0.5, TANK_R * 0.45);
    board.rotation.y = -Math.PI / 6;
    tank.add(board);

    // Level float indicator on board
    const floatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.25, 0.12), m.warningRedMat);
    floatMesh.position.set(0, (fillRatio - 0.5) * (TANK_H * 0.75), 0.04);
    board.add(floatMesh);

    // 12. Bottom Inlet/Outlet Piping Manifold & Gate Valves
    const pipeY = 1.0;
    const pipeOut = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.5, 12), m.pipelineSteelMat);
    pipeOut.rotation.x = Math.PI / 2;
    pipeOut.position.set(-TANK_R * 0.6, pipeY, TANK_R + 1.2);
    tank.add(pipeOut);

    // Gate valve on pipe with red handwheel
    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.7), m.darkSteelMat);
    valveBody.position.set(-TANK_R * 0.6, pipeY, TANK_R + 1.8);
    const valveWheel = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 16), m.valveWheelMat);
    valveWheel.rotation.x = Math.PI / 2;
    valveWheel.position.set(-TANK_R * 0.6, pipeY + 0.7, TANK_R + 1.8);
    tank.add(valveBody, valveWheel);

    // 13. Tank Identifier Tag Plaque
    const plaqueGeo = new THREE.PlaneGeometry(3.5, 1.2);
    const plaqueMat = new THREE.MeshBasicMaterial({ color: 0x0f172a, side: THREE.DoubleSide });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.set(0, 7.5, TANK_R + 0.05);
    tank.add(plaque);

    return tank;
  }

  // Build the twin crude storage tanks TK-101 and TK-102
  const tank1 = buildMasterTank(0, 0, 'TK-102', 0.78);
  const tank2 = buildMasterTank(-18, -4, 'TK-101', 0.64);
  tankFarm.add(tank1, tank2);

  // Interconnecting Elevated Tank Walkway Bridge between Tank 1 & Tank 2
  const bridgeGeo = new THREE.BoxGeometry(11, 0.2, 1.4);
  const bridge = new THREE.Mesh(bridgeGeo, stairMat);
  bridge.position.set(-9, 13.2, -2);
  const bridgeAngle = Math.atan2(-4, -18);
  bridge.rotation.y = bridgeAngle;
  tankFarm.add(bridge);

  // Bridge Handrails
  const bRailL = new THREE.Mesh(new THREE.BoxGeometry(11, 0.04, 0.04), yellowHandrailMat);
  bRailL.position.set(-9, 14.3, -2 + 0.65);
  bRailL.rotation.y = bridgeAngle;
  const bRailR = bRailL.clone();
  bRailR.position.z = -2 - 0.65;
  tankFarm.add(bRailL, bRailR);

  return tankFarm;
}

export function buildWellhead(masterGroup, m) {
  const wellhead = new THREE.Group();
  wellhead.position.set(5, 0, 18);
  wellhead.userData = {
    id: "wellhead", name: "Sub-Surface Wellhead Assembly (X-Tree)", type: "Wellhead Flow Control",
    purpose: "Controls wellbore pressure, steam injection routing, and production discharge.",
    status: "Active Injection / Production", health: 96, pressure: "540 psi", temp: "45 °C",
    flow: "118 bbl/d", vibration: "0.8 mm/s", maintenance: "Flange seal test passed (100% integrity)",
    alerts: "High fluid temperature during thermal cycle.",
    worldPos: new THREE.Vector3(5, 6, 18)
  };
  masterGroup.add(wellhead);

  const cellar = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.5, 1.5, 16, 1, true), m.concreteMat);
  cellar.position.y = 0.75; wellhead.add(cellar);

  const baseFlange = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 0.8, 14), m.pipelineSteelMat);
  baseFlange.position.y = 1.5; wellhead.add(baseFlange);

  const vertStack = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 6, 14), m.pipelineSteelMat);
  vertStack.position.y = 4.8; vertStack.castShadow = true; wellhead.add(vertStack);

  // ── Authentic API 11B Stuffing Box Assembly (Reveals Seals in Exploded / X-Ray Mode) ──
  const stuffingBoxGroup = new THREE.Group();
  stuffingBoxGroup.position.set(0, 9.5, 0);
  stuffingBoxGroup.userData = {
    id: "stuffing_box",
    name: "Stuffing Box Polished Rod Seal",
    type: "Surface Fluid Containment",
    purpose: "Prevents crude leakage along reciprocating polished rod via chevron compression packing.",
    status: "100% Integrity — Verified",
    health: 98,
    pressure: "420 psi",
    temp: "42 °C",
    flow: "118 bbl/d",
    vibration: "0.4 mm/s",
    maintenance: "Packing ring set inspected (API Spec 11B compliant)",
    alerts: "Zero leaks detected across primary and secondary barrier seals.",
    worldPos: new THREE.Vector3(5, 9.5, 18)
  };
  wellhead.add(stuffingBoxGroup);

  // Split-Housing Shell (Slides open horizontally during Exploded / X-Ray mode)
  const housingMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.35,
    metalness: 0.85,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide
  });
  
  const stuffingBoxHousingL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 2.2, 16, 1, false, -Math.PI / 2, Math.PI),
    housingMat
  );
  stuffingBoxHousingL.castShadow = true;
  stuffingBoxGroup.add(stuffingBoxHousingL);

  const stuffingBoxHousingR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 2.2, 16, 1, false, Math.PI / 2, Math.PI),
    housingMat.clone()
  );
  stuffingBoxHousingR.castShadow = true;
  stuffingBoxGroup.add(stuffingBoxHousingR);

  // Gland Follower Bushing / Threaded Nut on top (slides upward in exploded view)
  const glandNutMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.2,
    metalness: 0.92,
    emissive: '#b45309',
    emissiveIntensity: 0.25
  });
  const glandNut = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.78, 0.5, 14), glandNutMat);
  glandNut.position.y = 1.1;
  stuffingBoxGroup.add(glandNut);

  // Internal Compression Chevron Elastomeric Packing Rings (Tri-seal barrier set)
  const packingRings = [];
  const sealRingGeo = new THREE.TorusGeometry(0.38, 0.12, 12, 24);
  sealRingGeo.rotateX(Math.PI / 2);

  const ringColors = ['#ef4444', '#f59e0b', '#38bdf8']; // Primary, Secondary, Wiper chevron seals
  for (let si = 0; si < 3; si++) {
    const sealMat = new THREE.MeshStandardMaterial({
      color: ringColors[si],
      roughness: 0.3,
      metalness: 0.3,
      emissive: ringColors[si],
      emissiveIntensity: 0.4
    });
    const ringMesh = new THREE.Mesh(sealRingGeo, sealMat);
    ringMesh.position.y = -0.5 + si * 0.45;
    stuffingBoxGroup.add(ringMesh);
    packingRings.push(ringMesh);
  }

  // Brass Lantern Lubricator Ring between packing sets
  const lanternRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.22, 16, 1, true),
    new THREE.MeshStandardMaterial({ color: '#fbbf24', roughness: 0.15, metalness: 0.95 })
  );
  lanternRing.position.y = -0.05;
  stuffingBoxGroup.add(lanternRing);

  const polishedRod = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 28, 10), m.pipelineSteelMat);
  polishedRod.position.y = 12;
  wellhead.add(polishedRod);

  return {
    wellhead,
    polishedRod,
    stuffingBox: stuffingBoxGroup,
    stuffingBoxHousingL,
    stuffingBoxHousingR,
    glandNut,
    packingRings,
    lanternRing
  };
}

export function buildSeparator(masterGroup, m) {
  const separator = new THREE.Group();
  separator.position.set(16, 0, -5);
  separator.userData = {
    id: "separator", name: "High-Pressure Separator (V-101)", type: "Production Separator Vessel",
    purpose: "Separates produced fluids into heavy crude, produced water, and natural gas.",
    status: "Stabilized Flowing", health: 91, pressure: "210 psi", temp: "84 °C",
    flow: "118 bbl/d", vibration: "0.5 mm/s", maintenance: "Desanding flush scheduled in 14 days",
    alerts: "Liquid level at 68% capacity.",
    worldPos: new THREE.Vector3(16, 6, -5)
  };
  masterGroup.add(separator);

  const sepBody = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 13, 16), m.structuralSteelMat);
  sepBody.position.set(0, 6, 0); sepBody.rotation.z = Math.PI / 2; sepBody.castShadow = true;
  separator.add(sepBody);

  return separator;
}

export function buildSteamBoiler(masterGroup, m) {
  const warningBeacons = [];
  const steamStation = new THREE.Group();
  steamStation.position.set(-16, 0, -15);
  steamStation.userData = {
    id: "steam", name: "Cyclic Steam Generator (SG-101)", type: "Thermal EOR Boiler Unit",
    purpose: "Generates high-pressure 280°C steam for cyclic reservoir injection.",
    status: "Active Venting", health: 89, pressure: "480 psi", temp: "280 °C",
    flow: "25 tons/day steam", vibration: "2.1 mm/s", maintenance: "Burner nozzle cleaning due",
    alerts: "High thermal steam output active.",
    worldPos: new THREE.Vector3(-16, 5, -15)
  };
  masterGroup.add(steamStation);

  const boilerSkid = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 6), m.skidMat);
  boilerSkid.position.y = 0.2; steamStation.add(boilerSkid);

  // Pad edge safety borders
  addPadSafetyBorders(steamStation, 12, 0.4, 6, m, 0);
  const boiler = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 9, 16), m.rustSteelMat);
  boiler.rotation.x = Math.PI / 2; boiler.position.y = 3; boiler.castShadow = true;
  boiler.name = "boiler_shell";
  steamStation.add(boiler);

  const boilerFront = new THREE.Mesh(new THREE.SphereGeometry(2.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), m.rustSteelMat);
  boilerFront.rotation.x = -Math.PI / 2; boilerFront.position.set(0, 3, 4.5);
  boilerFront.name = "boiler_shell_front";
  steamStation.add(boilerFront);

  // Furnace internal fire tube chamber
  const furnaceGeo = new THREE.CylinderGeometry(1.4, 1.4, 8.4, 12);
  const furnaceMat = new THREE.MeshStandardMaterial({ color: '#ff4500', emissive: '#800000', roughness: 0.8, metalness: 0.1 });
  const furnace = new THREE.Mesh(furnaceGeo, furnaceMat);
  furnace.rotation.x = Math.PI / 2; furnace.position.set(0, 3, 0);
  furnace.name = "boiler_furnace_chamber";
  furnace.userData.isInternal = true;
  steamStation.add(furnace);

  // Auxiliary boiler fire tubes
  for (let ti = 0; ti < 4; ti++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8.4, 8), m.pipelineSteelMat);
    tube.rotation.x = Math.PI / 2;
    const angle = (ti * Math.PI) / 2;
    tube.position.set(Math.cos(angle) * 1.9, 3 + Math.sin(angle) * 1.9, 0);
    tube.name = `boiler_tube_${ti}`;
    tube.userData.isInternal = true;
    steamStation.add(tube);
  }
  const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1, 1.5, 10), m.darkSteelMat);
  burner.position.set(0, 3, 5.5); steamStation.add(burner);
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 8, 10), m.structuralSteelMat);
  stack.position.set(0, 8, -2); stack.castShadow = true; steamStation.add(stack);
  addBeacon(steamStation, 0, 12.5, -2, warningBeacons);
  const steamPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 6, 8), m.steamPipeMat);
  steamPipe.position.set(0, 3, -7.5); steamStation.add(steamPipe);
  // Control panel
  const ctrlPanel = new THREE.Mesh(new THREE.BoxGeometry(2, 2.5, 0.5), m.blueEquipmentMat);
  ctrlPanel.position.set(6, 1.5, 0); steamStation.add(ctrlPanel);
  const ctrlScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshBasicMaterial({ color: '#1a4a7a' }));
  ctrlScreen.position.set(6, 2.2, 0.26); steamStation.add(ctrlScreen);

  // Pressure safety relief valves (PRVs) on top of boiler shell
  const prvGroup = new THREE.Group();
  prvGroup.position.set(0, 5.9, 1);
  const prv1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7, 8), m.pipelineSteelMat);
  const prvCap1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), m.valveWheelMat);
  prvCap1.position.y = 0.35; prv1.add(prvCap1);
  const prv2 = prv1.clone(); prv2.position.x = -1.2;
  prvGroup.add(prv1, prv2);
  steamStation.add(prvGroup);

  // Water feed input pump & auxiliary supply line (detailed modeling)
  const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8), m.greenEquipmentMat);
  pumpBody.rotation.z = Math.PI / 2; pumpBody.position.set(-4, 0.8, -1.8); steamStation.add(pumpBody);
  const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 8), m.blueEquipmentMat);
  pumpMotor.rotation.z = Math.PI / 2; pumpMotor.position.set(-5, 0.8, -1.8); steamStation.add(pumpMotor);
  const feedLine = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.2, 8), m.pipelineSteelMat);
  feedLine.position.set(-4, 1.8, -1.8); steamStation.add(feedLine);

  // High Temperature Caution placard signs
  const hotSign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), m.stripeWarningMat);
  hotSign.position.set(2.85, 3.2, 0); hotSign.rotation.y = Math.PI / 2; steamStation.add(hotSign);

  return { steamStation, warningBeacons };
}

export function buildFlareStack(masterGroup, m) {
  const flareStack = new THREE.Group();
  flareStack.position.set(38, 0, -22);
  flareStack.userData = {
    id: "flare", name: "Field Safety Flare Stack (F-101)", type: "Safety Vent & Flare System",
    purpose: "Safely combusts excess gas & volatile casing vapors.",
    status: "Active Pilot Flame", health: 97, pressure: "35 psi", temp: "450 °C at tip",
    flow: "12 Mscf/d", vibration: "0.3 mm/s", maintenance: "Igniter pilot operational",
    alerts: "Controlled flare flame active.",
    worldPos: new THREE.Vector3(38, 18, -22)
  };
  masterGroup.add(flareStack);

  const flareBase = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 4), m.concreteMat);
  flareBase.position.y = 0.5; flareStack.add(flareBase);
  const flareTower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 30, 8), m.structuralSteelMat);
  flareTower.position.y = 16; flareTower.castShadow = true; flareStack.add(flareTower);
  const flareTip = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.35, 2, 10), m.rustSteelMat);
  flareTip.position.y = 32; flareStack.add(flareTip);
  const windGuard = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.7, 1.5, 8, 1, true), m.structuralSteelMat);
  windGuard.position.y = 33.5; flareStack.add(windGuard);
  const flameMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 10), new THREE.MeshBasicMaterial({ color: '#ff6600', toneMapped: false }));
  flameMesh.position.y = 35; flareStack.add(flameMesh);
  const flameInner = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), new THREE.MeshBasicMaterial({ color: '#ffcc00', toneMapped: false }));
  flameInner.position.y = 34.8; flareStack.add(flameInner);
  const flareLight = new THREE.PointLight('#ff6600', 3.5, 35);
  flareLight.position.y = 35; flareStack.add(flareLight);
  // Guy wires
  for (let gi = 0; gi < 3; gi++) {
    const gAngle = (gi * Math.PI * 2) / 3;
    const wireLen = 35;
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, wireLen, 3), m.wireMat);
    wire.position.set(Math.cos(gAngle) * 6, wireLen * 0.4, Math.sin(gAngle) * 6);
    wire.rotation.z = (Math.cos(gAngle) > 0 ? -1 : 1) * 0.18;
    wire.rotation.x = (Math.sin(gAngle) > 0 ? 1 : -1) * 0.18;
    flareStack.add(wire);
  }

  return { flareStack, flameMesh, flameInner, flareLight };
}

export function buildControlSkid(masterGroup, m) {
  const controlSkid = new THREE.Group();
  controlSkid.position.set(22, 0, -12);
  masterGroup.add(controlSkid);
  const skidBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 4), m.skidMat);
  skidBase.position.y = 0.15; controlSkid.add(skidBase);

  // Pad edge safety borders
  addPadSafetyBorders(controlSkid, 6, 0.3, 4, m, 0);
  for (let spi = 0; spi < 2; spi++) {
    const smallPump = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 10), m.greenEquipmentMat);
    smallPump.position.set(-1.5 + spi * 3, 1, 0); controlSkid.add(smallPump);
    const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8), m.blueEquipmentMat);
    pumpMotor.rotation.z = Math.PI / 2; pumpMotor.position.set(-1.5 + spi * 3, 1, 1);
    controlSkid.add(pumpMotor);
  }
  return { controlSkid };
}

export function buildSupportAssets(masterGroup, m) {
  const warningBeacons = [];

  // Pipe structural H-Frame supports
  function createHFrame(x, z, h = 4.5) {
    const frame = new THREE.Group();
    frame.position.set(x, 0, z);
    masterGroup.add(frame);
    
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.8), m.concreteMat);
    foundation.position.y = 0.15; frame.add(foundation);
    
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, h, 6), m.structuralSteelMat);
    legL.position.set(-0.45, h/2, 0); frame.add(legL);
    
    const legR = legL.clone(); legR.position.x = 0.45; frame.add(legR);
    
    const cross = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), m.structuralSteelMat);
    cross.position.y = h; frame.add(cross);
  }

  // Helper for pressure dial gauges
  function createPressureDial(x, y, z, rotY) {
    const dial = new THREE.Group();
    dial.position.set(x, y, z);
    dial.rotation.y = rotY;
    masterGroup.add(dial);
    
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6), m.pipelineSteelMat);
    stem.position.y = 0.175; dial.add(stem);
    
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 10), m.darkSteelMat);
    body.rotation.x = Math.PI / 2; body.position.y = 0.45; dial.add(body);
    
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.2, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    face.position.set(0, 0.45, 0.065); dial.add(face);
    
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.14, 0.01), new THREE.MeshBasicMaterial({ color: '#ef4444' }));
    needle.position.set(0, 0.45, 0.075);
    needle.geometry.translate(0, 0.05, 0);
    needle.rotation.z = -0.5 + Math.random() * 0.35;
    dial.add(needle);
  }

  // Place H-Frames supporting lines (steam and oil lines)
  createHFrame(-16, -8, 4.3);
  createHFrame(-10, 0, 4.3);
  createHFrame(-3, 6, 4.3);
  createHFrame(4, 10, 4.3);
  createHFrame(10, -2, 4.3);
  createHFrame(22, 5, 4.3);

  // Place Pressure Dial Gauges on manifolds
  createPressureDial(4.3, 4.7, 18, 0);       // wellhead steam injection manifold
  createPressureDial(5.7, 4.7, 18, Math.PI); // wellhead oil production manifold
  createPressureDial(14.8, 7.3, -5, Math.PI / 2); // separator inlet junction
  createPressureDial(-16.0, 4.7, -12.5, -Math.PI / 2); // boiler outlet header

  return warningBeacons;
}

export function buildDownhole(masterGroup, m) {
  const downhole = new THREE.Group(); 
  downhole.position.set(5, 0, 18); 
  masterGroup.add(downhole);

  // 1. Casing String (Engineered Split-Cutaway Casing that slides open in Exploded / X-Ray Mode)
  const casingGroup = new THREE.Group();
  downhole.add(casingGroup);

  const casingMat = new THREE.MeshStandardMaterial({ 
    color: '#475569', 
    transparent: true, 
    opacity: 0.28, 
    side: THREE.DoubleSide,
    roughness: 0.3,
    metalness: 0.85
  });

  // Left Casing Half (slides laterally along -X in Exploded view)
  const casingHalfL = new THREE.Group();
  casingGroup.add(casingHalfL);
  const casingMeshL = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 32, 24, 1, true, -Math.PI / 2, Math.PI),
    casingMat
  );
  casingMeshL.position.y = -16;
  casingHalfL.add(casingMeshL);

  // Right Casing Half (slides laterally along +X in Exploded view)
  const casingHalfR = new THREE.Group();
  casingGroup.add(casingHalfR);
  const casingMeshR = new THREE.Mesh(
    new THREE.CylinderGeometry(1.8, 1.8, 32, 24, 1, true, Math.PI / 2, Math.PI),
    casingMat
  );
  casingMeshR.position.y = -16;
  casingHalfR.add(casingMeshR);

  // Couplings attached to each sliding casing shell
  for (let ci = 0; ci < 6; ci++) {
    const coupGeoL = new THREE.CylinderGeometry(1.95, 1.95, 0.3, 20, 1, true, -Math.PI / 2, Math.PI);
    const coupL = new THREE.Mesh(coupGeoL, m.casingCouplingMat);
    coupL.position.y = -4 - ci * 5;
    casingHalfL.add(coupL);

    const coupGeoR = new THREE.CylinderGeometry(1.95, 1.95, 0.3, 20, 1, true, Math.PI / 2, Math.PI);
    const coupR = new THREE.Mesh(coupGeoR, m.casingCouplingMat);
    coupR.position.y = -4 - ci * 5;
    casingHalfR.add(coupR);
  }

  // 2. Central Production Tubing String (heavy crude lift conduit)
  const tubingGroup = new THREE.Group();
  downhole.add(tubingGroup);

  const tubingGeo = new THREE.CylinderGeometry(0.82, 0.82, 24, 16);
  const tubing = new THREE.Mesh(tubingGeo, m.pipelineSteelMat);
  tubing.position.y = -12; 
  tubingGroup.add(tubing);

  for (let ti = 0; ti < 6; ti++) {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, 0.22, 16), m.tubingCollarMat);
    collar.position.y = -3 - ti * 3.8; 
    tubingGroup.add(collar);
  }

  // 3. Transparent Tubing Cutaway Section around Pump
  const tubingCutawayGeo = new THREE.CylinderGeometry(0.82, 0.82, 6, 16, 1, true);
  const tubingCutawayMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    roughness: 0.1,
    metalness: 0.9
  });
  const tubingCutaway = new THREE.Mesh(tubingCutawayGeo, tubingCutawayMat);
  tubingCutaway.position.y = -27;
  tubingGroup.add(tubingCutaway);

  // 4. Insulated Downhole Steam Injection Line (280°C thermal steam conduit)
  const steamLineMat = new THREE.MeshStandardMaterial({ 
    color: '#ea580c', 
    roughness: 0.25, 
    metalness: 0.8,
    emissive: '#c2410c',
    emissiveIntensity: 0.35
  });
  const steamLine = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 22, 12), steamLineMat);
  steamLine.position.set(-1.15, -11, 0); 
  downhole.add(steamLine);

  // 5. Downhole Thermal Steam Packer (heavy-duty expansion seal above reservoir)
  const packerGroup = new THREE.Group();
  packerGroup.position.set(0, -19.5, 0);
  downhole.add(packerGroup);

  const packerBody = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.72, 1.4, 20), m.darkSteelMat);
  const packerSeal1 = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.78, 0.35, 20), m.rubberMat);
  packerSeal1.position.y = 0.35;
  const packerSeal2 = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.78, 0.35, 20), m.rubberMat);
  packerSeal2.position.y = -0.35;
  const steamMandrel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.0, 12), m.pipelineSteelMat);
  steamMandrel.position.set(-1.15, 0, 0);
  packerGroup.add(packerBody, packerSeal1, packerSeal2, steamMandrel);

  // 6. DOWNHOLE SUCKER ROD PUMP (SRP) AUTHENTIC MECHANICAL ASSEMBLY
  const pumpGroup = new THREE.Group();
  downhole.add(pumpGroup);

  // A. Cutaway Pump Barrel (Stationary Outer Cylinder)
  const barrelSleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 5.2, 20, 1, true),
    new THREE.MeshPhysicalMaterial({
      color: '#cbd5e1',
      transparent: true,
      opacity: 0.45,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.6,
      thickness: 0.2,
      side: THREE.DoubleSide
    })
  );
  barrelSleeve.position.y = -27;
  pumpGroup.add(barrelSleeve);

  const barrelTopCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.4, 16), m.structuralSteelMat);
  barrelTopCollar.position.y = -24.4;
  const barrelBottomCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.4, 16), m.structuralSteelMat);
  barrelBottomCollar.position.y = -29.6;
  pumpGroup.add(barrelTopCollar, barrelBottomCollar);

  // B. Standing Valve Assembly (Fixed at bottom of pump barrel)
  const standingValveSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.3, 16), m.pipelineSteelMat);
  standingValveSeat.position.y = -29.3;
  pumpGroup.add(standingValveSeat);

  const standingValveCage = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.6, 12, 1, true), m.darkSteelMat);
  standingValveCage.position.y = -29.0;
  pumpGroup.add(standingValveCage);

  // Standing Ball Valve (moves up when opening on upstroke)
  const standingBallMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', roughness: 0.15, metalness: 0.95, emissive: '#b45309', emissiveIntensity: 0.3 });
  const standingValve = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), standingBallMat);
  standingValve.position.y = -29.2;
  pumpGroup.add(standingValve);

  // Bottom Slotted Suction Strainer Screen
  const strainer = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 1.2, 16), m.darkSteelMat);
  strainer.position.y = -30.4;
  pumpGroup.add(strainer);

  // C. Reciprocating Sucker Rod String & Centralizers
  const suckerRodGroup = new THREE.Group();
  downhole.add(suckerRodGroup);

  const suckerRod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 26, 10), m.suckerRodMat);
  suckerRod.position.y = -13;
  suckerRodGroup.add(suckerRod);

  // API Centralizer Guides on sucker rod
  for (let ri = 0; ri < 5; ri++) {
    const guide = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 8), m.darkSteelMat);
    guide.position.y = -5 - ri * 4.5;
    suckerRodGroup.add(guide);
  }

  // D. Reciprocating Plunger Assembly (Attached to sucker rod string)
  const plungerGroup = new THREE.Group();
  plungerGroup.position.y = -27;
  suckerRodGroup.add(plungerGroup);

  // Plunger Hollow Chrome Piston with Pressure Ring Grooves
  const plungerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 2.8, 18),
    new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.15, metalness: 0.95 })
  );
  plungerGroup.add(plungerBody);

  // Plunger Seal Grooves
  for (let gi = 0; gi < 4; gi++) {
    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.485, 0.02, 6, 18), m.darkSteelMat);
    groove.rotation.x = Math.PI / 2;
    groove.position.y = -0.8 + gi * 0.5;
    plungerGroup.add(groove);
  }

  // Traveling Valve Cage (Bottom of plunger)
  const travelingCage = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.6, 12, 1, true), m.darkSteelMat);
  travelingCage.position.y = -1.4;
  plungerGroup.add(travelingCage);

  // Traveling Ball Valve (opens upward relative to plunger on downstroke)
  const travelingBallMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.15, metalness: 0.95, emissive: '#0284c7', emissiveIntensity: 0.3 });
  const travelingValve = new THREE.Mesh(new THREE.SphereGeometry(0.20, 16, 16), travelingBallMat);
  travelingValve.position.y = -1.5;
  plungerGroup.add(travelingValve);

  // 7. Multilateral Fishbone Well Branches
  const fishboneGroup = new THREE.Group();
  fishboneGroup.position.set(0, -22, 0);
  downhole.add(fishboneGroup);
  
  const fishboneMat = new THREE.MeshStandardMaterial({
    color: '#f97316',
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0.95,
    emissive: '#c2410c',
    emissiveIntensity: 0.7
  });

  const branchAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  branchAngles.forEach((angle, idx) => {
    const branchLength = 7.5;
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, branchLength, 8), fishboneMat);
    branch.position.set(Math.cos(angle) * (1.8 + branchLength * 0.42), -idx * 0.9, Math.sin(angle) * (1.8 + branchLength * 0.42));
    branch.rotation.z = Math.PI / 2 + 0.22;
    branch.rotation.y = angle;
    fishboneGroup.add(branch);
  });

  // 8. Dynamic Downhole Multi-Phase Extraction Tracers:
  // A. Steam Injection Streamers (Moving down through injection line & spraying into reservoir)
  const steamParticles = [];
  const steamGeo = new THREE.SphereGeometry(0.18, 8, 8);
  const steamMat = new THREE.MeshBasicMaterial({ color: '#ffedd5', toneMapped: false });
  for (let sp = 0; sp < 14; sp++) {
    const sDot = new THREE.Mesh(steamGeo, steamMat);
    sDot.position.set(-1.15, -1 - sp * 1.5, 0);
    downhole.add(sDot);
    steamParticles.push(sDot);
  }

  // Steam Radial Jet Sprays at Perforations
  const steamJets = [];
  const jetGeo = new THREE.ConeGeometry(0.2, 1.4, 6);
  const jetMat = new THREE.MeshBasicMaterial({ color: '#fed7aa', transparent: true, opacity: 0.8, toneMapped: false });
  for (let j = 0; j < 8; j++) {
    const jAng = (j * Math.PI * 2) / 8;
    const jetMesh = new THREE.Mesh(jetGeo, jetMat);
    jetMesh.position.set(Math.cos(jAng) * 2.2, -20.5, Math.sin(jAng) * 2.2);
    jetMesh.rotation.z = -Math.PI / 2;
    jetMesh.rotation.y = jAng;
    downhole.add(jetMesh);
    steamJets.push(jetMesh);
  }

  // B. Produced Crude Oil Column Lift Ribbons (Pumping UP through sucker rod tubing)
  const oilLiftParticles = [];
  const oilLiftGeo = new THREE.SphereGeometry(0.24, 8, 8);
  const oilLiftMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', toneMapped: false });
  for (let op = 0; op < 18; op++) {
    const oDot = new THREE.Mesh(oilLiftGeo, oilLiftMat);
    oDot.position.set(0, -27 + op * 1.5, 0);
    downhole.add(oDot);
    oilLiftParticles.push(oDot);
  }

  // C. Reservoir Pore Inflow Streamers (Migrating from formation into pump suction strainer)
  const poreInflowStreamers = [];
  const streamerGeo = new THREE.SphereGeometry(0.15, 6, 6);
  const streamerMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', toneMapped: false });
  for (let ps = 0; ps < 14; ps++) {
    const pMesh = new THREE.Mesh(streamerGeo, streamerMat);
    const angle = (ps * Math.PI * 2) / 14;
    const rad = 2.2 + (ps % 3) * 0.8;
    pMesh.position.set(Math.cos(angle) * rad, -26 + (ps % 4) * 0.8, Math.sin(angle) * rad);
    downhole.add(pMesh);
    poreInflowStreamers.push({ mesh: pMesh, angle, rad, baseY: pMesh.position.y });
  }

  return {
    downhole,
    casingGroup,
    casingHalfL,
    casingHalfR,
    casingMat,
    tubingGroup,
    tubingCutawayMat,
    barrelSleeve,
    barrelSleeveMat: barrelSleeve.material,
    steamLine,
    packerGroup,
    pumpGroup,
    suckerRodGroup,
    plungerGroup,
    travelingValve,
    travelingBallMat,
    standingValve,
    standingBallMat,
    standingValveSeat,
    strainer,
    fishboneGroup,
    steamParticles,
    steamJets,
    oilLiftParticles,
    poreInflowStreamers
  };
}

export function buildSubsurface(masterGroup, m, Tres) {
  const subsurfaceGroup = new THREE.Group();
  masterGroup.add(subsurfaceGroup);

  // 1. Impermeable Caprock Shale (Seal Rock Layer)
  const capRock = new THREE.Mesh(new THREE.BoxGeometry(65, 8, 65), m.caprockMat);
  capRock.position.set(5, -4, 18);
  subsurfaceGroup.add(capRock);

  const strataLine = new THREE.Mesh(new THREE.BoxGeometry(65.2, 0.15, 65.2), m.strataMat);
  strataLine.position.set(5, -7.9, 18);
  subsurfaceGroup.add(strataLine);

  // 2. Sandstone Layer
  const sandstone = new THREE.Mesh(new THREE.BoxGeometry(65, 10, 65), m.sandstoneMat);
  sandstone.position.set(5, -12, 18);
  subsurfaceGroup.add(sandstone);

  const strataLine2 = new THREE.Mesh(new THREE.BoxGeometry(65.2, 0.15, 65.2), m.strataMat);
  strataLine2.position.set(5, -17, 18);
  subsurfaceGroup.add(strataLine2);

  // 3. Primary Jodhpur Sandstone Heavy Oil Reservoir Block (1,180m Depth)
  const reservoir = new THREE.Mesh(new THREE.BoxGeometry(65, 12, 65), m.reservoirMaterial);
  reservoir.position.set(5, -23, 18);
  reservoir.userData = {
    id: "reservoir",
    name: "Jodhpur Sandstone Heavy Oil Reservoir",
    type: "Subsurface Geological Formation",
    purpose: "Primary oil-bearing sandstone reservoir at 1,180m depth.",
    status: "CSS Thermal Enhanced Recovery",
    health: 96,
    pressure: "1,200 psi",
    temp: `${Tres} °C`,
    flow: "118 bbl/d",
    vibration: "0.0 mm/s",
    maintenance: "Porosity: 22.4% | Permeability: 420 mD | Water Cut: 8.5%",
    alerts: "CSS Steam cycle active — Viscosity reduced via thermal injection.",
    worldPos: new THREE.Vector3(5, -20, 18)
  };
  subsurfaceGroup.add(reservoir);

  // 4. Basal Aquifer Water Zone (Deep Water Formation)
  const aquifer = new THREE.Mesh(new THREE.BoxGeometry(65, 8, 65), m.aquiferMat);
  aquifer.position.set(5, -33, 18);
  subsurfaceGroup.add(aquifer);

  // Perforations
  const perfGroup = new THREE.Group();
  perfGroup.position.set(5, -22, 18);
  masterGroup.add(perfGroup);
  for (let pf = 0; pf < 16; pf++) {
    const perfDot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8), m.warningRedMat);
    const angle = (pf * Math.PI * 2) / 16;
    perfDot.position.set(Math.cos(angle) * 1.85, (pf % 4) * 0.4, Math.sin(angle) * 1.85);
    perfDot.rotation.z = Math.PI / 2;
    perfDot.rotation.y = angle;
    perfGroup.add(perfDot);
  }

  // ── Pulsing Subsurface Steam Chamber (Steam Sweep Front) ──
  const chamberGeo = new THREE.SphereGeometry(3.5, 16, 12);
  const chamberMat = new THREE.MeshStandardMaterial({
    color: '#ec4899', // bright hot pink steam front
    transparent: true,
    opacity: 0.35,
    emissive: '#db2777',
    emissiveIntensity: 0.8,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const steamChamber = new THREE.Mesh(chamberGeo, chamberMat);
  steamChamber.position.set(5, -22, 18);
  masterGroup.add(steamChamber);
  reservoir.userData.steamChamber = steamChamber;

  // ── Geologic Oil Seepage flow indicators (pores flow) ──
  const oilArrows = [];
  const arrowGeo = new THREE.ConeGeometry(0.12, 0.45, 4);
  const arrowMat = new THREE.MeshBasicMaterial({ color: '#f59e0b', toneMapped: false });
  
  for (let i = 0; i < 22; i++) {
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    const angle = Math.random() * Math.PI * 2;
    const startRad = 5.0 + Math.random() * 14.0;
    const ay = -18 - Math.random() * 8;
    
    arrow.position.set(5 + Math.cos(angle) * startRad, ay, 18 + Math.sin(angle) * startRad);
    arrow.rotation.y = -angle - Math.PI / 2;
    masterGroup.add(arrow);
    
    oilArrows.push({
      mesh: arrow,
      angle: angle,
      radius: startRad,
      y: ay,
      speed: 0.035 + Math.random() * 0.04
    });
  }
  reservoir.userData.oilArrows = oilArrows;

  return { subsurfaceGroup, reservoir, perfGroup, capRock, sandstone, aquifer, strataLine, strataLine2 };
}
