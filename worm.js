// Three.js is loaded locally from three.min.js, should be available via window.THREE
const { useEffect, useRef, useState } = React;

const steps = [
  {
    id: 1,
    bubble: "A mature oak stands on a hidden fungal network. Start the journey to uncover what the eye cannot see.",
    title: "Detect The Hidden Web",
    cta: "Start Journey",
  },
  {
    id: 2,
    bubble: "Fungal threads touch root tips and spread outward, creating living pathways through the soil.",
    title: "Trace Root-Fungi Paths",
    cta: "Reveal Exchange",
  },
  {
    id: 3,
    bubble: "Now watch the exchange: the tree sends sugars, while fungi return water and minerals to the roots.",
    title: "Watch Resource Exchange",
    cta: "Restart Journey",
  },
];

function ProgressDots({ active, compact = false }) {
  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      {steps.map((s) => (
        <div
          key={s.id}
          className={`${compact ? "h-2 w-2" : "h-2.5 w-2.5"} rounded-full transition-all duration-300 ${
            s.id <= active ? "bg-[#3f5b3b]" : "bg-[#b7b09d]"
          }`}
        />
      ))}
    </div>
  );
}

function Worm({ isTalking, compact, ultraCompact = false }) {
  const wrapperClass = ultraCompact
    ? "relative h-14 w-20 shrink-0 -translate-y-1"
    : compact
    ? "relative h-16 w-24 shrink-0 -translate-y-1"
    : "relative h-40 w-56 shrink-0 translate-x-2 translate-y-1";

  return (
    <div className={wrapperClass}>
      <div
        style={
          isTalking
            ? { animation: "wormTalkBounce 0.72s ease-in-out infinite" }
            : undefined
        }
      >
        <img
          src="./WORMY.png"
          alt="Worm mascot"
          className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.28)]"
        />
      </div>
    </div>
  );
}

function RootNetwork({ step, parallax }) {
  const mountRef = useRef(null);
  const stepRef = useRef(step);
  const parallaxRef = useRef(parallax || { x: 0, y: 0 });
  const mycoMaterialsRef = useRef([]);
  const threeLoadAttemptedRef = useRef(false);
  const [sceneStatus, setSceneStatus] = useState("loading");
  const [threeRetryKey, setThreeRetryKey] = useState(0);

  stepRef.current = step;
  parallaxRef.current = parallax || { x: 0, y: 0 };

  useEffect(() => {
    console.log("🌳 RootNetwork useEffect fired, threeRetryKey:", threeRetryKey);
    if (!mountRef.current) {
      console.log("❌ mountRef not ready");
      return;
    }
    console.log("✓ mountRef ready, window.THREE:", !!window.THREE);
    
    if (!window.THREE) {
      console.error("❌ Three.js not found! Make sure three.min.js is loaded");
      setSceneStatus("missing-three");
      return;
    }

    console.log("✅ THREE available, creating scene...");
    const container = mountRef.current;
    const THREE = window.THREE;
    console.log("Container dimensions:", container.clientWidth, "x", container.clientHeight);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xd7ebff, 22, 45);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 1.0, 5.2);

    let renderer;
    try {
      console.log("Creating WebGL renderer...");
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      console.log("✅ WebGL renderer created successfully");
    } catch (err) {
      console.error("❌ WebGL renderer failed:", err);
      setSceneStatus("webgl-failed");
      return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    console.log("Setting scene status to ready...");
    container.appendChild(renderer.domElement);
    setSceneStatus("ready");

    const hemi = new THREE.HemisphereLight(0xdff7ff, 0x6c5038, 1.05);
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(3.8, 5.2, 2.6);
    const fill = new THREE.DirectionalLight(0x9cc8ff, 0.35);
    fill.position.set(-4, 2.8, -2.4);
    const rootLight = new THREE.PointLight(0xffd2a8, 0.55, 14);
    rootLight.position.set(0, -0.8, 1.8);
    scene.add(hemi, key, fill, rootLight);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(10.5, 96),
      new THREE.MeshStandardMaterial({ color: 0x5f8247, roughness: 0.94, metalness: 0.01 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.03;
    scene.add(ground);

    const xrayDisk = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 64),
      new THREE.MeshBasicMaterial({ color: 0x101010, transparent: true, opacity: 0.16, depthWrite: false })
    );
    xrayDisk.rotation.x = -Math.PI / 2;
    xrayDisk.position.y = -0.027;
    xrayDisk.renderOrder = 2;
    scene.add(xrayDisk);

    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 2.6, 8.5),
      new THREE.MeshStandardMaterial({
        color: 0x5c7f4d,
        roughness: 0.95,
        metalness: 0.01,
        transparent: true,
        opacity: 0.88,
      })
    );
    soil.position.set(0, -1.35, 0);
    scene.add(soil);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);
    treeGroup.scale.set(1.15, 1.15, 1.15);

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x6f4a34, roughness: 0.94, metalness: 0.02 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.78, 3.4, 20), barkMat);
    trunk.position.y = 1.56;
    treeGroup.add(trunk);

    const branchAngles = [-0.95, -0.52, 0.45, 0.9, 0.15, -0.2];
    branchAngles.forEach((a, i) => {
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.23, 1.5 - i * 0.08, 10), barkMat);
      branch.position.set(Math.sin(a) * 0.55, 2.4 + (i % 2) * 0.25, Math.cos(a) * 0.45);
      branch.rotation.z = a * 0.72;
      branch.rotation.x = (i % 2 === 0 ? 1 : -1) * 0.22;
      branch.rotation.y = a * 0.55;
      treeGroup.add(branch);
    });

  // Hanging branch
  const hangingBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 1.2, 10), barkMat);
  hangingBranch.position.set(-0.4, 1.1, 0.35);
  hangingBranch.rotation.z = -0.75;
  hangingBranch.rotation.x = 0.45;
  hangingBranch.rotation.y = -0.3;
  treeGroup.add(hangingBranch);

    const canopyGroup = new THREE.Group();
    treeGroup.add(canopyGroup);
    const canopyPalette = [0x5e9747, 0x6aa84f, 0x4e7f3b, 0x7ab85d, 0x467336];
    for (let i = 0; i < 36; i++) {
      const radius = i < 10 ? 1.08 : 0.58 + ((i % 7) / 14);
      const leaf = new THREE.Mesh(
        new THREE.IcosahedronGeometry(radius, i % 2),
        new THREE.MeshStandardMaterial({
          color: canopyPalette[i % canopyPalette.length],
          roughness: 0.9,
          metalness: 0.02,
          flatShading: i % 3 === 0,
        })
      );
      const ring = i * 0.45;
      leaf.position.set(
        Math.cos(ring) * (1.1 + (i % 3) * 0.4),
        3.2 + Math.sin(i * 0.7) * 0.45 + (i % 6) * 0.08,
        Math.sin(ring) * (0.9 + (i % 4) * 0.35)
      );
      canopyGroup.add(leaf);
    }

    const rootMat = new THREE.MeshStandardMaterial({
      color: 0x8a5b3a,
      roughness: 0.92,
      metalness: 0.01,
      emissive: 0x2a170d,
      emissiveIntensity: 0.16,
    });
    const xrayRootMat = new THREE.MeshBasicMaterial({
      color: 0xffdf4d,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const mycoMats = [];
    const rootSegments = [];
    const tipCandidates = [];
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    scene.add(rootGroup);

    const addRoot = (start, heading, length, depth, radius) => {
      if (depth < 0 || radius < 0.015) return;

      const bend = new THREE.Vector3(heading.x * 0.48, -0.26 - Math.random() * 0.12, heading.z * 0.48);
      const end = new THREE.Vector3(
        start.x + heading.x * length,
        start.y - 0.24 - Math.random() * 0.36,
        start.z + heading.z * length
      );

      const curve = new THREE.CatmullRomCurve3([
        start.clone(),
        start.clone().add(bend),
        start
          .clone()
          .add(bend)
          .add(new THREE.Vector3((Math.random() - 0.5) * 0.2, -0.14, (Math.random() - 0.5) * 0.2)),
        end,
      ]);

      const root = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 18, radius, 8, false),
        rootMat
      );
      root.renderOrder = 1;
      rootGroup.add(root);
      rootSegments.push({
        curve,
        start: start.clone(),
        end: end.clone(),
        radius,
        depth,
      });
      if (depth <= 1) {
        tipCandidates.push(end.clone());
      }

      const xrayRoot = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, Math.max(0.018, radius * 0.58), 8, false),
        xrayRootMat
      );
      xrayRoot.renderOrder = 5;
      rootGroup.add(xrayRoot);

      const myco = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 28, Math.max(0.012, radius * 0.25), 8, false),
        new THREE.MeshStandardMaterial({
          color: 0xcfffb1,
          emissive: 0x9dff6d,
          emissiveIntensity: 0,
          transparent: true,
          opacity: 0,
          roughness: 0.35,
          metalness: 0,
        })
      );
      rootGroup.add(myco);
      mycoMats.push(myco.material);

      const branches = depth > 2 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < branches; i++) {
        const spread = (i - (branches - 1) / 2) * 0.42 + (Math.random() - 0.5) * 0.18;
        const lateral = spread + (Math.random() - 0.5) * 0.12;
        const perp = new THREE.Vector3(-heading.z, 0, heading.x).normalize();
        const newHeading = new THREE.Vector3(
          heading.x * 0.86 + perp.x * lateral + (Math.random() - 0.5) * 0.04,
          -0.52 - Math.random() * 0.08,
          heading.z * 0.86 + perp.z * lateral + (Math.random() - 0.5) * 0.04
        ).normalize();
        addRoot(end, newHeading, length * (0.64 + Math.random() * 0.16), depth - 1, radius * (0.68 + Math.random() * 0.12));
      }
    };

    const rootStarts = 13;
    for (let i = 0; i < rootStarts; i++) {
      const angle = (i / rootStarts) * Math.PI * 2;
      const start = new THREE.Vector3(Math.cos(angle) * 0.32, -0.08, Math.sin(angle) * 0.26);
      const heading = new THREE.Vector3(Math.cos(angle) * 0.92, -0.65, Math.sin(angle) * 0.92).normalize();
      addRoot(start, heading, 1.1 + Math.random() * 0.7, 3, 0.09 + Math.random() * 0.04);
    }

    console.log("✅ Roots created");
    mycoMaterialsRef.current = mycoMats;

    const overlayGroup = new THREE.Group();
    overlayGroup.renderOrder = 7;
    rootGroup.add(overlayGroup);

    const candidateAnchors = [];
    rootSegments.forEach((seg, idx) => {
      if (idx % 2 !== 0) return;
      [0.24, 0.48, 0.72, 0.9].forEach((tVal) => {
        const p = seg.curve.getPoint(tVal);
        if (p.y < -0.05) candidateAnchors.push(p);
      });
    });
    if (!candidateAnchors.length) {
      candidateAnchors.push(...(tipCandidates.length ? tipCandidates : rootSegments.map((s) => s.end)));
    }

    const sectorCount = 14;
    const sectors = Array.from({ length: sectorCount }, () => []);
    candidateAnchors.forEach((p) => {
      const angle = Math.atan2(p.z, p.x) + Math.PI;
      const sectorIndex = Math.min(sectorCount - 1, Math.floor((angle / (Math.PI * 2)) * sectorCount));
      sectors[sectorIndex].push(p);
    });

    const chosenTips = [];
    sectors.forEach((bucket) => {
      if (!bucket.length) return;
      bucket.sort((a, b) => {
        const ar = a.x * a.x + a.z * a.z;
        const br = b.x * b.x + b.z * b.z;
        return br - ar;
      });
      chosenTips.push(bucket[0].clone());
      if (bucket[2]) chosenTips.push(bucket[2].clone());
    });

    const tipDotMats = [];
    const tipHaloMats = [];
    const tipDots = [];
    const tipHalos = [];
      const fallbackTips = rootSegments
        .map((s) => s.end)
        .filter((p, idx) => idx % Math.max(1, Math.floor(rootSegments.length / 16)) === 0);
      const displayTips = chosenTips.length >= 6 ? chosenTips : fallbackTips;

      displayTips.forEach((pos, i) => {
      const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0x92f4ff,
          transparent: true,
          opacity: 0,
            depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 14, 14),
        new THREE.MeshBasicMaterial({
          color: 0x21a5df,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      m.position.copy(pos);
      m.position.y += 0.02 + (i % 2) * 0.015;
      halo.position.copy(m.position);
      m.renderOrder = 8;
      halo.renderOrder = 8;
      overlayGroup.add(m);
      overlayGroup.add(halo);
      tipDotMats.push(m.material);
      tipHaloMats.push(halo.material);
      tipDots.push(m);
      tipHalos.push(halo);
    });

    const connectionMats = [];
    const connectionInnerMats = [];
    const connectionCurves = [];
    const connectionHeadMats = [];
    const connectionHeads = [];
    const makeConnection = (a, b, lift, color, radius, opacity) => {
      if (!a || !b) return;
      const mid = a.clone().lerp(b, 0.5);
      mid.y += lift;
      const c = new THREE.CatmullRomCurve3([a.clone(), mid, b.clone()]);
      const mesh = new THREE.Mesh(
          new THREE.TubeGeometry(c, 28, radius, 8, false),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
            depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      mesh.renderOrder = 8;
      overlayGroup.add(mesh);
      mesh.material.userData.baseOpacity = opacity;
      connectionMats.push(mesh.material);

      const inner = new THREE.Mesh(
        new THREE.TubeGeometry(c, 28, Math.max(0.009, radius * 0.48), 8, false),
        new THREE.MeshBasicMaterial({
          color: 0x83d5ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      inner.renderOrder = 9;
      overlayGroup.add(inner);
      inner.material.userData.baseOpacity = Math.min(1, opacity + 0.08);
      connectionInnerMats.push(inner.material);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(0.03, radius * 1.5), 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0xb8ecff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      head.renderOrder = 10;
      head.position.copy(a);
      overlayGroup.add(head);
      connectionHeads.push(head);
      connectionHeadMats.push(head.material);

      connectionCurves.push(c);
    };

    const lineTips = displayTips.length >= 6
      ? displayTips
      : [
          displayTips[0],
          displayTips[Math.floor(displayTips.length * 0.25)],
          displayTips[Math.floor(displayTips.length * 0.5)],
          displayTips[Math.floor(displayTips.length * 0.75)],
          displayTips[displayTips.length - 1],
        ].filter(Boolean);

    const blueShades = [0x0f2f76, 0x123c8a, 0x164ba1, 0x1a56b6, 0x1f63c8, 0x11509b];
    const orderedTips = lineTips.filter(Boolean);
    if (orderedTips.length >= 3) {
      const usedPairs = new Set();
      const addPair = (i, j, lift, shadeIdx, radius, opacity) => {
        if (i === j || i < 0 || j < 0 || i >= orderedTips.length || j >= orderedTips.length) return;
        const a = Math.min(i, j);
        const b = Math.max(i, j);
        const key = `${a}-${b}`;
        if (usedPairs.has(key)) return;
        usedPairs.add(key);
        makeConnection(orderedTips[a], orderedTips[b], lift, blueShades[shadeIdx % blueShades.length], radius, opacity);
      };

      for (let i = 0; i < orderedTips.length; i++) {
        addPair(i, (i + 1) % orderedTips.length, 0.08 + (i % 3) * 0.03, i, 0.024, 0.92);
        addPair(i, (i + 2) % orderedTips.length, 0.12 + (i % 2) * 0.04, i + 2, 0.021, 0.86);
        addPair(i, (i + 3) % orderedTips.length, 0.16 + (i % 2) * 0.03, i + 4, 0.018, 0.8);
      }

      const centerTip = orderedTips[Math.floor(orderedTips.length / 2)];
      orderedTips.forEach((tip, i) => {
        if (tip === centerTip) return;
        makeConnection(tip, centerTip, 0.2 + (i % 2) * 0.04, blueShades[(i + 1) % blueShades.length], 0.017, 0.78);
      });
    }

    const nutrientMats = [];
    const nutrientDots = [];
    const nutrientRingMats = [];
    const nutrientRings = [];
    const nutrientSeeds = [];
    const spreadSegments = rootSegments
      .map((seg) => {
        const probe = seg.curve.getPoint(0.72);
        return { seg, probe, angle: Math.atan2(probe.z, probe.x) };
      })
      .filter((item) => item.probe.y < -0.08)
      .sort((a, b) => a.angle - b.angle);

    const nutrientCount = 10;
    for (let i = 0; i < nutrientCount; i++) {
      const spreadIdx = spreadSegments.length
        ? Math.floor((i / nutrientCount) * spreadSegments.length)
        : (i * 7 + 3) % rootSegments.length;
      const seg = spreadSegments.length ? spreadSegments[spreadIdx].seg : rootSegments[spreadIdx];
      const tVal = 0.28 + (i % 5) * 0.12;
      const base = seg.curve.getPoint(Math.min(0.94, tVal));
      nutrientSeeds.push({ seg, tVal, wobble: Math.random() * Math.PI * 2 });
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0xffd15a,
          transparent: true,
          opacity: 0,
            depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      dot.position.copy(base);
      dot.renderOrder = 20;
      overlayGroup.add(dot);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.115, 0.012, 8, 32),
        new THREE.MeshBasicMaterial({
          color: 0xe8ff72,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      ring.position.copy(base);
      ring.rotation.x = Math.PI / 2;
      ring.renderOrder = 21;
      overlayGroup.add(ring);

      nutrientDots.push(dot);
      nutrientMats.push(dot.material);
      nutrientRings.push(ring);
      nutrientRingMats.push(ring.material);
    }

    const flowParticleMats = [];
    const flowParticles = [];
    const spreadRootTracks = spreadSegments.slice(0, 10).map((item) => item.seg.curve);
    const flowTracks = connectionCurves.length
      ? connectionCurves.concat(spreadRootTracks)
      : spreadRootTracks.length
      ? spreadRootTracks
      : rootSegments.slice(0, 6).map((s) => s.curve);

    const flowTrackMeta = flowTracks
      .map((curve) => {
        const mid = curve.getPoint(0.5);
        return {
          curve,
          angle: Math.atan2(mid.z, mid.x),
          radius: mid.x * mid.x + mid.z * mid.z,
        };
      })
      .sort((a, b) => a.angle - b.angle || b.radius - a.radius);

    const flowParticleCount = Math.min(16, Math.max(10, flowTrackMeta.length));
    for (let i = 0; i < flowParticleCount; i++) {
      const p = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.082, 0),
        new THREE.MeshBasicMaterial({
          color: 0xff6a2b,
          transparent: true,
          opacity: 0,
            depthTest: false,
          depthWrite: false,
          toneMapped: false,
        })
      );
      p.renderOrder = 22;
      overlayGroup.add(p);
      const trackIndex = flowTrackMeta.length ? Math.floor((i / flowParticleCount) * flowTrackMeta.length) : 0;
      p.userData.trackIndex = Math.min(Math.max(trackIndex, 0), Math.max(flowTrackMeta.length - 1, 0));
      p.userData.offset = (i / flowParticleCount + (i % 3) * 0.07) % 1;
      p.userData.speed = 0.24 + (i % 5) * 0.035;
      p.userData.spin = 0.6 + Math.random() * 0.8;
      flowParticles.push(p);
      flowParticleMats.push(p.material);
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) {
        console.log("⚠️ Container has no dimensions, retrying...");
        return;
      }
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      console.log(`📐 Resized to ${w}x${h}, aspect ratio: ${camera.aspect.toFixed(2)}`);
    };
    resize();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resize();
      });
    });

    const clock = new THREE.Clock();
    let connectionRevealStart = null;
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      const px = parallaxRef.current.x || 0;
      const py = parallaxRef.current.y || 0;

      treeGroup.rotation.y = Math.sin(t * 0.18) * 0.06 + px * 0.32;
      canopyGroup.position.x = Math.sin(t * 0.65) * 0.08 + px * 0.16;
      canopyGroup.position.z = Math.cos(t * 0.52) * 0.06;

      camera.position.x = px * 0.95;
      camera.position.y = 1.15 + py * 0.28;
      camera.lookAt(px * 0.3, 0.22 + py * 0.07, 0.22);

      const targetGlow = stepRef.current >= 2 ? 1 : 0;
      const pulse = 0.58 + 0.42 * Math.sin(t * 2.1);
      mycoMaterialsRef.current.forEach((mat) => {
        mat.opacity = targetGlow ? 0.42 + pulse * 0.28 : 0;
        mat.emissiveIntensity = targetGlow ? 0.52 + pulse * 0.55 : 0;
      });
      const xrayPulse = 0.6 + 0.4 * Math.sin(t * 1.8 + 0.6);
      const xrayBase = stepRef.current === 1 ? 0.16 : stepRef.current === 2 ? 0.2 : 0.42;
      xrayRootMat.opacity = xrayBase + xrayPulse * 0.12;

      const showConnections = stepRef.current >= 2;
      const showExchange = stepRef.current >= 3;
      if (showConnections && connectionRevealStart === null) {
        connectionRevealStart = t;
      }
      if (!showConnections) {
        connectionRevealStart = null;
      }
      const revealProgress = showConnections
        ? Math.min(1, ((t - (connectionRevealStart || t)) * 1.35))
        : 0;

      tipDotMats.forEach((mat, i) => {
        const tipPulse = 0.62 + 0.38 * Math.sin(t * 2.1 + i * 0.9);
        mat.opacity = showConnections ? 0.65 + tipPulse * 0.35 : 0;
      });
      tipHaloMats.forEach((mat, i) => {
        const haloPulse = 0.58 + 0.42 * Math.sin(t * 1.7 + i * 0.7);
        mat.opacity = showConnections ? 0.18 + haloPulse * 0.3 : 0;
      });
      tipDots.forEach((dot, i) => {
        const s = 1 + Math.sin(t * 2.3 + i * 0.9) * 0.2;
        dot.scale.setScalar(s);
      });
      tipHalos.forEach((halo, i) => {
        const hs = 1 + Math.sin(t * 1.8 + i * 0.9) * 0.32;
        halo.scale.setScalar(hs);
      });

      connectionMats.forEach((mat, i) => {
        const linePulse = 0.6 + 0.4 * Math.sin(t * 1.6 + i * 1.2);
        mat.opacity = showConnections ? (mat.userData?.baseOpacity || 0.8) * revealProgress * (0.78 + linePulse * 0.34) : 0;
      });
      connectionInnerMats.forEach((mat, i) => {
        const innerPulse = 0.55 + 0.45 * Math.sin(t * 2.25 + i * 1.15);
        mat.opacity = showConnections ? (mat.userData?.baseOpacity || 0.88) * revealProgress * (0.68 + innerPulse * 0.44) : 0;
      });
      connectionHeads.forEach((head, i) => {
        const curve = connectionCurves[i];
        if (!curve) return;
        const localReach = Math.min(1, Math.max(0, revealProgress * 1.18 - i * 0.012));
        const travel = Math.min(1, localReach + Math.sin(t * 2.4 + i * 0.8) * 0.03);
        head.position.copy(curve.getPoint(Math.max(0, travel)));
        const s = 1 + Math.sin(t * 5.5 + i * 0.7) * 0.25;
        head.scale.setScalar(s);
      });
      connectionHeadMats.forEach((mat, i) => {
        const shimmer = 0.6 + 0.4 * Math.sin(t * 4 + i * 0.9);
        mat.opacity = showConnections ? Math.min(0.95, revealProgress * (0.45 + shimmer * 0.5)) : 0;
      });

      nutrientDots.forEach((dot, i) => {
        const seed = nutrientSeeds[i];
        const drift = 0.035 * Math.sin(t * 1.4 + seed.wobble);
        dot.position.copy(seed.seg.curve.getPoint(Math.min(0.96, seed.tVal + drift)));
        dot.position.y += 0.06 + Math.sin(t * 1.8 + i * 0.75) * 0.02;
        dot.scale.setScalar(1 + Math.sin(t * 2.6 + i * 0.9) * 0.22);
        nutrientRings[i].position.copy(dot.position);
        nutrientRings[i].rotation.z = t * (0.7 + i * 0.08);
      });
      nutrientMats.forEach((mat, i) => {
        const nutriPulse = 0.64 + 0.36 * Math.sin(t * 2.45 + i * 0.75);
        mat.opacity = showExchange ? 0.66 + nutriPulse * 0.32 : 0;
      });
      nutrientRingMats.forEach((mat, i) => {
        const ringPulse = 0.56 + 0.44 * Math.sin(t * 2.2 + i * 0.6);
        mat.opacity = showExchange ? 0.22 + ringPulse * 0.28 : 0;
      });

      flowParticles.forEach((p, i) => {
        const trackMeta = flowTrackMeta[p.userData.trackIndex] || flowTrackMeta[i % flowTrackMeta.length];
        if (!trackMeta) return;
        const travel = (t * p.userData.speed + p.userData.offset) % 1;
        const track = trackMeta.curve;
        p.position.copy(track.getPoint(travel));
        p.position.y += 0.07;
        p.rotation.x = t * p.userData.spin;
        p.rotation.y = t * (p.userData.spin * 0.72);
        p.scale.setScalar(1 + Math.sin(t * 4 + i * 1.2) * 0.24);
      });
      flowParticleMats.forEach((mat, i) => {
        const flowPulse = 0.66 + 0.34 * Math.sin(t * 3.1 + i * 0.8);
        mat.opacity = showExchange ? 0.62 + flowPulse * 0.34 : 0;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    console.log("🎬 Starting animation loop");
    animate();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const observer = new ResizeObserver(() => resize());
    observer.observe(container);

    console.log("✅ Scene fully initialized and rendering");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, [threeRetryKey]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-t-[28px] bg-gradient-to-b from-[#d6efff] via-[#9fd6ff] to-[#5da8ec]">
      <div ref={mountRef} className="absolute inset-0" />

      {(sceneStatus === "missing-three" || sceneStatus === "webgl-failed") && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fbSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dff2ff" />
              <stop offset="100%" stopColor="#9ccc80" />
            </linearGradient>
            <linearGradient id="fbSoil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a6547" />
              <stop offset="100%" stopColor="#513827" />
            </linearGradient>
            <radialGradient id="fbCanopy" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#75b95b" />
              <stop offset="100%" stopColor="#36642d" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="1000" height="280" fill="url(#fbSky)" />
          <rect x="0" y="272" width="1000" height="228" fill="url(#fbSoil)" />
          <path d="M0 266 C160 252, 300 286, 460 264 C620 248, 760 286, 1000 260 L1000 302 L0 302 Z" fill="#6da04e" opacity="0.9" />

          <ellipse cx="500" cy="130" rx="170" ry="112" fill="url(#fbCanopy)" />
          <ellipse cx="395" cy="146" rx="96" ry="74" fill="#5e9a49" opacity="0.9" />
          <ellipse cx="610" cy="146" rx="96" ry="74" fill="#5e9a49" opacity="0.9" />

          <path d="M482 188 C472 232, 468 270, 472 312 L528 312 C532 270, 526 232, 516 188 Z" fill="#6b4933" />
          <path d="M500 312 C442 344, 390 360, 318 396" stroke="#764f37" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M500 312 C470 346, 438 382, 410 448" stroke="#764f37" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M500 312 C500 350, 500 392, 500 466" stroke="#764f37" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M500 312 C558 344, 610 360, 682 396" stroke="#764f37" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M500 312 C530 346, 562 382, 590 448" stroke="#764f37" strokeWidth="12" fill="none" strokeLinecap="round" />

          <path d="M318 396 C270 414, 228 442, 186 472" stroke="#8c6649" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M410 448 C364 456, 324 468, 284 488" stroke="#8c6649" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M590 448 C636 456, 676 468, 716 488" stroke="#8c6649" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M682 396 C730 414, 772 442, 814 472" stroke="#8c6649" strokeWidth="7" fill="none" strokeLinecap="round" />

          {step >= 2 && (
            <g>
              <path d="M186 472 C290 410, 386 370, 500 336" stroke="#e6ffc8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
              <path d="M500 336 C614 370, 710 410, 814 472" stroke="#e6ffc8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
              <path d="M284 488 C362 446, 430 410, 500 374" stroke="#ccf5a3" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d="M500 374 C570 410, 638 446, 716 488" stroke="#ccf5a3" strokeWidth="2.6" fill="none" strokeLinecap="round" opacity="0.85" />
            </g>
          )}
        </svg>
      )}

      {sceneStatus !== "ready" && (
        <div className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-slate-700 shadow">
          {sceneStatus === "loading" && "Loading 3D tree..."}
          {sceneStatus === "missing-three" && "3D CDN failed. Showing fallback tree scene."}
          {sceneStatus === "webgl-failed" && "WebGL unavailable. Showing fallback tree scene."}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.36),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),transparent_30%,rgba(40,24,12,0.10)_68%,rgba(20,12,8,0.28))]" />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}

function QuestionCard({ guessed, onGuess }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      {!guessed ? (
        <div className="space-y-5">
          <div className="flex items-center justify-center gap-6">
            <div className="flex h-36 w-48 items-center justify-center rounded-2xl bg-stone-100 text-center shadow-inner">
              <div>
                <div className="mx-auto mb-2 h-14 w-10 rounded-full bg-red-500" />
                <div className="mx-auto h-5 w-5 rounded-full bg-white/90" />
              </div>
            </div>
            <div className="text-4xl font-semibold text-slate-400">+</div>
            <div className="flex h-36 w-48 items-center justify-center rounded-2xl bg-stone-100 shadow-inner">
              <svg viewBox="0 0 200 120" className="h-24 w-40">
                <path d="M100 10 C90 35,70 45,55 70" stroke="#8b5a3c" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M100 10 C110 35,130 45,145 72" stroke="#8b5a3c" strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M55 70 C35 78,22 92,10 108" stroke="#9c6b4e" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M145 72 C164 78,178 93,190 108" stroke="#9c6b4e" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M100 10 C100 40,100 66,100 110" stroke="#8b5a3c" strokeWidth="8" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="text-center text-xl font-medium text-slate-700">What is their relationship?</div>
          <div className="flex justify-center">
            <button onClick={onGuess} className="rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] active:scale-[0.99]">
              Tap to guess
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
            Nice guess
          </div>
          <h3 className="text-3xl font-semibold text-slate-900">Mycorrhizal Symbiosis</h3>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Fungi and roots form a mutually beneficial relationship underground.
          </p>
        </div>
      )}
    </div>
  );
}

function ConnectionCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="space-y-4">
        <div className="flex h-44 items-center justify-center rounded-2xl bg-stone-100 shadow-inner">
          <svg viewBox="0 0 420 160" className="h-36 w-full max-w-3xl">
            <path d="M210 18 C185 55,160 68,126 108" stroke="#8b5a3c" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M210 18 C234 56,264 70,294 108" stroke="#8b5a3c" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M126 108 C96 121,68 132,26 146" stroke="#9c6b4e" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M294 108 C332 120,360 132,394 145" stroke="#9c6b4e" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M38 142 C118 120,171 112,250 112" stroke="#b7ff8a" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M250 112 C302 113,348 122,387 144" stroke="#d9ffb8" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>
        <p className="text-center text-lg text-slate-600">Fungal threads connect to plant roots underground.</p>
      </div>
    </div>
  );
}

function ExplanationCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="space-y-5">
        <div className="text-center">
          <h3 className="text-3xl font-semibold text-slate-900">Mycorrhizal Symbiosis</h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-slate-600">
            A mutually beneficial relationship between fungi and plant roots.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-emerald-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-emerald-900">
              <span className="text-xl">🌳</span>
              <span className="font-semibold">Tree gives</span>
            </div>
            <div className="text-lg text-emerald-900">Sugars</div>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-cyan-900">
              <span className="text-xl">💧</span>
              <span className="font-semibold">Fungi gives</span>
            </div>
            <div className="text-lg text-cyan-900">Water + nutrients</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-4 text-slate-700">
          <span className="font-medium">Tree</span>
          <span>-&gt;</span>
          <span>Sugars</span>
          <span>-&gt;</span>
          <span className="font-medium">Fungi</span>
          <span>-&gt;</span>
          <span>Water & nutrients</span>
        </div>
      </div>
    </div>
  );
}

function JourneyTrack({ step, compact }) {
  const containerClass = compact
    ? "rounded-3xl border border-[#d8cfba] bg-gradient-to-r from-[#e6efdf] via-[#f2ead0] to-[#e8e0cf] p-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
    : "rounded-3xl border border-[#d8cfba] bg-gradient-to-r from-[#e6efdf] via-[#f2ead0] to-[#e8e0cf] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]";

  return (
    <div className={containerClass}>
      <div className="relative">
        <div className={`absolute left-6 right-6 ${compact ? "top-4.5" : "top-6"} h-[3px] rounded-full bg-gradient-to-r from-[#7fa06e] via-[#d8bf73] to-[#8a7a56]`} />
        <div className="grid grid-cols-3 gap-3">
          {steps.map((item) => {
            const active = item.id === step;
            const complete = item.id < step;
            return (
              <div key={item.id} className="relative flex flex-col items-center gap-2 text-center">
                <div
                  className={`relative z-10 flex ${compact ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm"} items-center justify-center rounded-full border-2 font-bold transition-all ${
                    active
                      ? "border-[#3f5b3b] bg-[#3f5b3b] text-white shadow-[0_0_0_6px_rgba(63,91,59,0.2)]"
                      : complete
                      ? "border-[#6f8f60] bg-[#dce8d6] text-[#355238]"
                      : "border-[#b8ae95] bg-[#f7f2e8] text-[#7a725e]"
                  }`}
                >
                  {complete ? "✓" : item.id}
                </div>
                <div className={`${compact ? "text-[10px] leading-tight" : "text-xs"} font-semibold ${active ? "text-[#2f4733]" : "text-[#6b624f]"}`}>
                  {compact
                    ? item.id === 1
                      ? "Detect"
                      : item.id === 2
                      ? "Trace"
                      : "Exchange"
                    : item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JourneyCard({ step, compact }) {
  if (compact) {
    if (step === 1) {
      return (
        <div className="rounded-2xl border border-[#d8cfba] bg-[#f9f5ea] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6d6248]">Step 1</div>
          <h3 className="mt-1 text-base font-semibold text-[#2a3b2c]">Begin Beneath The Oak</h3>
          <p className="mt-1 text-xs text-[#534d3d]">Reveal each hidden layer: roots, links, and exchange.</p>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="rounded-2xl border border-[#d8cfba] bg-[#f9f5ea] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3f5b3b]">Step 2</div>
          <h3 className="mt-1 text-base font-semibold text-[#2a3b2c]">Hidden Underground Network</h3>
          <p className="mt-1 text-xs text-[#534d3d]">Fungi connect root tips and form transport pathways.</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-[#d8cfba] bg-[#f9f5ea] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#73542c]">Step 3</div>
        <h3 className="mt-1 text-base font-semibold text-[#2a3b2c]">Resource Exchange Complete</h3>
        <p className="mt-1 text-xs text-[#534d3d]">Tree sends sugars. Fungi return water and minerals.</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="rounded-3xl border border-[#d8cfba] bg-[#f9f5ea] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#6d6248]">Journey Start</div>
        <h3 className="text-3xl font-semibold text-[#2a3b2c]">Begin Beneath The Oak</h3>
        <p className="mt-2 text-[#534d3d]">Follow the underground story in three moments: detect, trace, and exchange.</p>
        <div className="mt-5 rounded-2xl border border-[#d8cfba] bg-white/75 p-4 text-sm text-[#4a4435]">
          Click <span className="font-semibold">Start Journey</span> to reveal each layer of the ecosystem.
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="rounded-3xl border border-[#d8cfba] bg-[#f9f5ea] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#3f5b3b]">Journey Step 2</div>
        <h3 className="text-3xl font-semibold text-[#2a3b2c]">Hidden Underground Network</h3>
        <p className="mt-2 text-lg text-[#534d3d]">Fungal threads attach to root tips and spread through soil like a transport web.</p>
        <div className="mt-5 rounded-2xl bg-gradient-to-r from-[#d8ead0] via-[#ece3b7] to-[#e7d2a6] p-4 text-sm text-[#4a4435]">
          The glowing network shows possible nutrient pathways between fungi and roots.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#d8cfba] bg-[#f9f5ea] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#73542c]">Journey Step 3</div>
      <h3 className="text-3xl font-semibold text-[#2a3b2c]">Resource Exchange Complete</h3>
      <p className="mt-2 text-lg text-[#534d3d]">This is mycorrhizal symbiosis: sugars go to fungi, water and minerals return to the tree.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-[#dfe9dd] p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#37553b]">Tree Gives</div>
          <div className="mt-1 text-lg font-semibold text-[#2f4733]">Sugars</div>
        </div>
        <div className="rounded-2xl bg-[#e6dfcf] p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#5d4b2d]">Fungi Gives</div>
          <div className="mt-1 text-lg font-semibold text-[#4f3d24]">Water + minerals</div>
        </div>
      </div>
    </div>
  );
}

function OverlayLegend({ step, compact }) {
  const items = [
    {
      id: "roots",
      minStep: 1,
      label: "Root X-ray Layer",
      swatch: (
        <span className="h-2.5 w-8 rounded-full bg-[#ffdf4d]/85 shadow-[0_0_10px_rgba(255,223,77,0.85)]" />
      ),
    },
    {
      id: "tips",
      minStep: 2,
      label: "Root-tip Signals",
      swatch: (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute h-4 w-4 rounded-full bg-[#21a5df]/35" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-[#92f4ff] shadow-[0_0_10px_rgba(146,244,255,0.95)]" />
        </span>
      ),
    },
    {
      id: "connections",
      minStep: 2,
      label: "Fungal Connections",
      swatch: (
        <span className="relative h-2.5 w-9 rounded-full bg-[#123c8a]">
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-[#83d5ff]" />
        </span>
      ),
    },
    {
      id: "nutrients",
      minStep: 3,
      label: "Nutrients",
      swatch: (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute h-4 w-4 rounded-full border border-[#e8ff72]/80" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-[#ffd15a] shadow-[0_0_10px_rgba(255,209,90,0.95)]" />
        </span>
      ),
    },
    {
      id: "flow",
      minStep: 3,
      label: "Flow Particles",
      swatch: (
        <span className="h-3.5 w-3.5 rounded-[3px] bg-[#ff6a2b] shadow-[0_0_10px_rgba(255,106,43,0.95)]" />
      ),
    },
  ].filter((item) => step >= item.minStep);

  return (
    <div className={`rounded-2xl border border-[#d5cab3] bg-[#f7f2e8]/90 ${compact ? "px-3 py-2" : "px-4 py-3"} shadow-[0_8px_22px_rgba(15,23,42,0.07)]`}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#5f573f]">Overlay Key</div>
      <div className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2.5 md:gap-3"}`}>
        {items.map((item) => (
          <div key={item.id} className={`inline-flex items-center ${compact ? "gap-1 px-2 py-1 text-[10px]" : "gap-2 px-3 py-1.5 text-xs"} rounded-full border border-[#d7ccb3] bg-white/70 font-medium text-[#4a4435]`}>
            {item.swatch}
            <span>
              {compact
                ? item.id === "roots"
                  ? "Roots"
                  : item.id === "tips"
                  ? "Tips"
                  : item.id === "connections"
                  ? "Links"
                  : item.id === "nutrients"
                  ? "Nutrients"
                  : "Flow"
                : item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ARLessonPrototype() {
  const isPhoneLandscapeQuery =
    "(orientation: landscape) and (pointer: coarse) and (max-height: 620px) and (max-width: 1200px)";
  const isPhonePortraitQuery =
    "(orientation: portrait) and (pointer: coarse) and (max-width: 900px)";

  const getInitialStep = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = Number(params.get("step"));
      if (Number.isInteger(raw) && raw >= 1 && raw <= 3) return raw;
    } catch (err) {
      console.warn("Step query parse failed", err);
    }
    return 1;
  };

  const [step, setStep] = useState(getInitialStep);
  const [feedback, setFeedback] = useState("");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isPhoneLandscape, setIsPhoneLandscape] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(isPhoneLandscapeQuery).matches;
  });
  const [isPhonePortrait, setIsPhonePortrait] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(isPhonePortraitQuery).matches;
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [wormTalking, setWormTalking] = useState(false);
  const [motionAvailable, setMotionAvailable] = useState(() => {
    if (typeof window === "undefined") return false;
    return "DeviceOrientationEvent" in window;
  });
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionError, setMotionError] = useState("");
  const [isStandaloneMode, setIsStandaloneMode] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerHeight
  );
  const didMountRef = useRef(false);
  const isUltraCompact = isPhoneLandscape && viewportHeight > 0 && viewportHeight <= 430;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const phoneLandscapeMedia = window.matchMedia(isPhoneLandscapeQuery);
    const phonePortraitMedia = window.matchMedia(isPhonePortraitQuery);
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onPhoneChange = (e) => setIsPhoneLandscape(e.matches);
    const onPhonePortraitChange = (e) => setIsPhonePortrait(e.matches);
    const onMotionChange = (e) => setPrefersReducedMotion(e.matches);

    phoneLandscapeMedia.addEventListener("change", onPhoneChange);
    phonePortraitMedia.addEventListener("change", onPhonePortraitChange);
    motionMedia.addEventListener("change", onMotionChange);

    return () => {
      phoneLandscapeMedia.removeEventListener("change", onPhoneChange);
      phonePortraitMedia.removeEventListener("change", onPhonePortraitChange);
      motionMedia.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMotionAvailable("DeviceOrientationEvent" in window);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkStandalone = () => {
      const mediaMatch =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches;
      const iosStandalone = typeof window.navigator !== "undefined" && window.navigator.standalone === true;
      setIsStandaloneMode(Boolean(mediaMatch || iosStandalone));
    };

    checkStandalone();
    window.addEventListener("resize", checkStandalone);
    return () => window.removeEventListener("resize", checkStandalone);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setViewportHeight(window.innerHeight);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isPhoneLandscape) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100svh";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.height = prevBodyHeight;
    };
  }, [isPhoneLandscape]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(""), 1400);
    return () => clearTimeout(t);
  }, [feedback]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (prefersReducedMotion) {
      setWormTalking(false);
      return;
    }

    setWormTalking(true);
    const t = setTimeout(() => setWormTalking(false), 2600);
    return () => clearTimeout(t);
  }, [step, prefersReducedMotion]);

  useEffect(() => {
    if (!motionEnabled || typeof window === "undefined") return;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const onOrientation = (event) => {
      const gamma = typeof event.gamma === "number" ? event.gamma : 0;
      const beta = typeof event.beta === "number" ? event.beta : 0;
      const nextX = clamp(gamma / 35, -1, 1);
      const nextY = clamp((beta - 25) / 35, -1, 1);
      setParallax((prev) => ({
        x: prev.x * 0.82 + nextX * 0.18,
        y: prev.y * 0.82 + nextY * 0.18,
      }));
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => window.removeEventListener("deviceorientation", onOrientation, true);
  }, [motionEnabled]);

  const enableMotionParallax = async () => {
    if (typeof window === "undefined") return;
    setMotionError("");

    try {
      if (!("DeviceOrientationEvent" in window)) {
        setMotionError("Tilt sensing not available on this device.");
        return;
      }

      const needsPermission =
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function";

      if (needsPermission) {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result !== "granted") {
          setMotionError("Tilt permission was not granted.");
          return;
        }
      }

      setMotionEnabled(true);
    } catch (err) {
      console.error("Device orientation permission failed", err);
      setMotionError("Could not enable tilt controls.");
    }
  };

  const next = () => {
    if (step < 3) {
      setStep((s) => s + 1);
      setFeedback(step === 1 ? "Underground pathways revealed" : "Exchange in progress");
      return;
    }
    setStep(1);
    setFeedback("Journey restarted");
  };

  const back = () => {
    if (step === 1) return;
    setStep((s) => s - 1);
  };

  const current = steps[step - 1];

  const updateParallax = (clientX, clientY, rect) => {
    const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
  };

  const handleSceneMove = (e) => {
    if (motionEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateParallax(e.clientX, e.clientY, rect);
  };

  const handleSceneTouchMove = (e) => {
    if (motionEnabled) return;
    if (!e.touches || !e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateParallax(e.touches[0].clientX, e.touches[0].clientY, rect);
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  if (isPhonePortrait) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#ece5d5] p-6 text-center text-[#2f3527]">
        <div className="max-w-sm rounded-3xl border border-[#d5cab3] bg-[#f7f2e8] px-6 py-7 shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
          <style>{`@keyframes rotatePhoneHint{0%{transform:rotate(0deg);}35%{transform:rotate(90deg);}65%{transform:rotate(90deg);}100%{transform:rotate(0deg);}}`}</style>
          <div className="mb-4 flex justify-center">
            <div style={{ animation: "rotatePhoneHint 2.2s ease-in-out infinite" }} className="h-12 w-8 rounded-[10px] border-[3px] border-[#6b624f] bg-[#f2ead8] shadow-inner" />
          </div>
          <h2 className="text-xl font-semibold">Rotate Your Phone</h2>
          <p className="mt-2 text-sm text-[#5f573f]">
            This experience is designed for phone landscape mode. Turn your phone sideways to continue.
          </p>
          <a
            href="./nhm-garden-map.html"
            className="mt-5 inline-flex items-center rounded-full border border-[#cdbf9f] bg-[#f7f2e8] px-4 py-2 text-sm font-semibold text-[#4a4435]"
          >
            ← Home Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={isPhoneLandscape ? "fixed inset-0 h-[100svh] w-screen overflow-hidden overscroll-none bg-[#ece5d5] text-slate-900" : "min-h-[100dvh] bg-[#dfd9c9] p-3 text-slate-900 md:p-8"}>
      <style>{`@keyframes wormTalkBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}`}</style>

      <div className={isPhoneLandscape ? "h-full w-full" : "mx-auto h-[calc(100dvh-1.5rem)] w-full max-w-[1536px] overflow-hidden rounded-[32px] border border-[#c9bfa8] bg-[#f7f2e6] shadow-2xl md:h-[calc(100dvh-4rem)]"}>
        <div className={isPhoneLandscape ? `grid h-full ${isUltraCompact ? "grid-rows-[minmax(145px,34vh)_1fr]" : "grid-rows-[minmax(165px,38vh)_1fr]"}` : "grid h-full grid-rows-[minmax(280px,45vh)_1fr] md:grid-rows-[minmax(360px,48vh)_1fr]"}>
          <div
            className="relative"
            onMouseMove={handleSceneMove}
            onMouseLeave={resetParallax}
            onTouchMove={handleSceneTouchMove}
            onTouchEnd={resetParallax}
          >
            <RootNetwork step={step} parallax={parallax} />
          </div>

          <div className={isPhoneLandscape ? `grid h-full grid-rows-[auto_auto_1fr_auto] ${isUltraCompact ? "gap-1 px-2 pb-1.5 pt-1.5" : "gap-1.5 px-2.5 pb-2 pt-2"} overflow-hidden bg-[#ece5d5]` : "relative overflow-y-auto bg-[#ece5d5] px-4 pb-6 pt-5 md:px-8"}>
            {!isPhoneLandscape && (
              <a
                href="./nhm-garden-map.html"
                className="absolute left-4 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-[#cdbf9f] bg-[#f7f2e8] px-3 py-1.5 text-xs font-semibold text-[#4a4435] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#efe5d1]"
              >
                ← Home Map
              </a>
            )}

            {!isPhoneLandscape && feedback && (
              <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-[#2f4733] px-4 py-2 text-sm font-medium text-white shadow-lg">
                {feedback}
              </div>
            )}

            {isPhoneLandscape && (
              <div className={`flex items-center justify-between ${isUltraCompact ? "gap-1.5" : "gap-2"}`}>
                <a
                  href="./nhm-garden-map.html"
                  className="inline-flex items-center gap-2 rounded-full border border-[#cdbf9f] bg-[#f7f2e8] px-2.5 py-0.5 text-[10px] font-semibold text-[#4a4435] shadow-[0_6px_16px_rgba(15,23,42,0.08)] transition hover:bg-[#efe5d1]"
                >
                  ← Home Map
                </a>

                {motionAvailable && !prefersReducedMotion && (
                  <button
                    type="button"
                    onClick={enableMotionParallax}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition ${
                      motionEnabled
                        ? "border-[#8fa983] bg-[#dce8d6] text-[#355238]"
                        : "border-[#cdbf9f] bg-[#f7f2e8] text-[#4a4435] hover:bg-[#efe5d1]"
                    }`}
                  >
                    {motionEnabled ? "Tilt On" : "Enable Tilt"}
                  </button>
                )}

                <div className="min-h-[24px]">
                  {feedback && (
                    <div className="rounded-full bg-[#2f4733] px-2.5 py-0.5 text-[10px] font-medium text-white shadow">
                      {feedback}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isPhoneLandscape && motionError && (
              <div className="rounded-lg border border-[#d7ccb3] bg-[#f7f2e8] px-2 py-1 text-[10px] text-[#5f573f]">
                {motionError}
              </div>
            )}

            <div className={isPhoneLandscape ? `grid min-h-0 grid-cols-[minmax(0,1fr)_auto] items-start ${isUltraCompact ? "gap-1.5" : "gap-2"}` : "mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"}>
              <div className={isPhoneLandscape ? `relative min-w-0 rounded-[20px] border border-[#d5cab3] bg-[#f7f2e8] ${isUltraCompact ? "px-2.5 py-2 text-[15px]" : isStandaloneMode ? "px-3 py-2.5 text-[18px]" : "px-3 py-2.5 text-[17px]"} font-medium leading-snug text-[#2f3527] shadow-[0_10px_20px_rgba(15,23,42,0.08)]` : "relative min-w-0 rounded-[24px] border border-[#d5cab3] bg-[#f7f2e8] px-5 py-4 text-lg font-medium leading-snug text-[#2f3527] shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:px-6 md:py-5 md:text-[22px]"}>
                {current.bubble}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-[15px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[11px] border-l-[15px] border-y-transparent border-l-[#d5cab3]"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-[13px] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[10px] border-l-[14px] border-y-transparent border-l-[#f7f2e8]"
                />
              </div>
              <div className={isPhoneLandscape ? `justify-self-end ${isUltraCompact ? "pr-0.5 pt-0" : "pr-1 pt-1"}` : "justify-self-end"}>
                <Worm isTalking={wormTalking} compact={isPhoneLandscape} ultraCompact={isUltraCompact} />
              </div>
            </div>

            {!isPhoneLandscape && (
              <div className="mx-auto max-w-[1200px]">
                <div className="space-y-4">
                  <JourneyTrack step={step} compact={false} />
                  <JourneyCard step={step} compact={false} />
                  <OverlayLegend step={step} compact={false} />
                </div>
              </div>
            )}

            {isPhoneLandscape ? (
              <div
                className={`relative z-50 grid grid-cols-[auto_1fr_auto] items-center ${isUltraCompact ? "gap-1.5 px-1.5 py-1" : "gap-1.5 px-1.5 py-1"} rounded-xl border border-[#d5cab3] bg-[#f7f2e8]/95`}
                style={{ marginBottom: "max(0px, env(safe-area-inset-bottom))" }}
              >
                <button
                  onClick={back}
                  disabled={step === 1}
                  className={`relative z-[60] pointer-events-auto rounded-xl ${isUltraCompact ? "px-2.5 py-1 text-xs" : "px-2.5 py-1 text-xs"} transition ${
                    step === 1
                      ? "cursor-not-allowed text-[#7f7764] opacity-70"
                      : "text-[#504730] hover:bg-[#e2d8c2]"
                  }`}
                >
                  &lt; Back
                </button>

                <div className="relative z-[60] flex justify-center pointer-events-none">
                  <ProgressDots active={step} compact={true} />
                </div>

                <button onClick={next} className={`relative z-[60] pointer-events-auto whitespace-nowrap rounded-xl bg-[#3f5b3b] ${isUltraCompact ? "px-2.5 py-1.5 text-xs" : "px-2.5 py-1.5 text-xs"} text-white transition hover:scale-[1.01] hover:bg-[#32492f] active:scale-[0.99]`}>
                  {isUltraCompact
                    ? step === 3
                      ? "Restart >"
                      : step === 1
                      ? "Start >"
                      : "Next >"
                    : step === 3
                    ? "Restart Journey >"
                    : step === 1
                    ? "Start Journey >"
                    : "Next Step >"}
                </button>
              </div>
            ) : (
              <div className="relative z-50 mt-5 flex items-center justify-between rounded-2xl border border-[#d5cab3] bg-[#f7f2e8]/85 px-3 py-3 backdrop-blur">
                <button onClick={back} className="relative z-[60] pointer-events-auto rounded-xl px-3 py-2 text-[#504730] transition hover:bg-[#e2d8c2]">
                  &lt; Back
                </button>

                <div className="relative z-[60] pointer-events-none">
                  <ProgressDots active={step} />
                </div>

                <button onClick={next} className="relative z-[60] pointer-events-auto rounded-xl bg-[#3f5b3b] px-4 py-2.5 text-white transition hover:scale-[1.01] hover:bg-[#32492f] active:scale-[0.99]">
                  {step === 3 ? "Restart" : current.cta} &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ARLessonPrototype />);
