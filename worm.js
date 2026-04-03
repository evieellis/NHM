// Three.js is loaded locally from three.min.js, should be available via window.THREE
const { useEffect, useRef, useState } = React;

const steps = [
  {
    id: 1,
    bubble: "What do you think is happening between these fungi and tree roots?",
    title: "What is their relationship?",
    cta: "Tap to guess",
  },
  {
    id: 2,
    bubble: "Most of the action happens underground. Fungi connect directly to tree roots.",
    title: "Underground connection",
    cta: "Next",
  },
  {
    id: 3,
    bubble: "They exchange nutrients - fungi get sugars, and trees get water and minerals.",
    title: "Mycorrhizal Symbiosis",
    cta: "Finish",
  },
];

function ProgressDots({ active }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s) => (
        <div
          key={s.id}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            s.id <= active ? "bg-slate-800" : "bg-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

function Worm() {
  return (
    <div className="relative h-32 w-48 shrink-0">
      <svg viewBox="0 0 340 210" className="h-full w-full drop-shadow-[0_10px_14px_rgba(15,23,42,0.28)]">
        <defs>
          <linearGradient id="wormSkin" x1="0" y1="0" x2="1" y2="1.1">
            <stop offset="0%" stopColor="#ffb1c8" />
            <stop offset="52%" stopColor="#ff7aa5" />
            <stop offset="100%" stopColor="#de5f89" />
          </linearGradient>
          <linearGradient id="wormBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe4ee" />
            <stop offset="100%" stopColor="#ffc4d8" />
          </linearGradient>
          <radialGradient id="wormCheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9eb7" />
            <stop offset="100%" stopColor="#ff9eb7" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d="M29 154 C44 139, 58 128, 74 118 C90 108, 106 103, 124 108" stroke="url(#wormSkin)" strokeWidth="28" strokeLinecap="round" fill="none" />
        <path d="M121 109 C152 118, 175 143, 210 151 C244 159, 273 146, 287 122" stroke="url(#wormSkin)" strokeWidth="36" strokeLinecap="round" fill="none" />
        <path d="M286 122 C301 95, 304 64, 289 44" stroke="url(#wormSkin)" strokeWidth="33" strokeLinecap="round" fill="none" />

        <path d="M48 153 C64 139, 85 129, 107 125" stroke="url(#wormBelly)" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M126 122 C153 133, 173 153, 206 160 C234 165, 258 158, 272 142" stroke="url(#wormBelly)" strokeWidth="12" strokeLinecap="round" fill="none" />

        <ellipse cx="82" cy="121" rx="5.5" ry="3.5" fill="#f6a8c3" />
        <ellipse cx="113" cy="110" rx="5" ry="3.3" fill="#f6a8c3" />
        <ellipse cx="146" cy="124" rx="6" ry="3.5" fill="#f6a8c3" />
        <ellipse cx="182" cy="145" rx="6" ry="3.5" fill="#f6a8c3" />
        <ellipse cx="220" cy="156" rx="6" ry="3.5" fill="#f6a8c3" />

        <ellipse cx="290" cy="42" rx="38" ry="31" fill="url(#wormSkin)" />
        <ellipse cx="290" cy="52" rx="20" ry="12" fill="#ffd9e7" opacity="0.88" />

        <ellipse cx="277" cy="37" rx="8" ry="8.5" fill="#fff" />
        <ellipse cx="304" cy="37" rx="8" ry="8.5" fill="#fff" />
        <circle cx="279" cy="38" r="3.7" fill="#2b2331" />
        <circle cx="306" cy="38" r="3.7" fill="#2b2331" />
        <circle cx="280.5" cy="36.5" r="1" fill="#fff" />
        <circle cx="307.5" cy="36.5" r="1" fill="#fff" />

        <path d="M279 57 C286 66, 297 66, 304 57" stroke="#9e3d63" strokeWidth="3.3" fill="none" strokeLinecap="round" />
        <ellipse cx="268" cy="49" rx="12" ry="8" fill="url(#wormCheek)" />
        <ellipse cx="313" cy="49" rx="12" ry="8" fill="url(#wormCheek)" />

        <path d="M272 15 C267 5, 272 -3, 283 -8" stroke="#e86d95" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M307 15 C313 7, 324 6, 330 12" stroke="#e86d95" strokeWidth="4" fill="none" strokeLinecap="round" />

        <path d="M24 155 L10 160 L20 146 Z" fill="#f18bb0" />
        <ellipse cx="182" cy="116" rx="11" ry="5" fill="#ffffff" opacity="0.35" />
      </svg>
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
    scene.fog = new THREE.Fog(0xddeecf, 20, 42);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);

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
      new THREE.CircleGeometry(5.1, 64),
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
        color: 0x4a3326,
        roughness: 0.95,
        metalness: 0.01,
        transparent: true,
        opacity: 0.94,
      })
    );
    soil.position.set(0, -1.35, 0);
    scene.add(soil);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

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
    let raf = 0;
    const animate = () => {
      const t = clock.getElapsedTime();
      const px = parallaxRef.current.x || 0;
      const py = parallaxRef.current.y || 0;

      treeGroup.rotation.y = Math.sin(t * 0.18) * 0.06 + px * 0.32;
      canopyGroup.position.x = Math.sin(t * 0.65) * 0.08 + px * 0.16;
      canopyGroup.position.z = Math.cos(t * 0.52) * 0.06;

      camera.position.x = px * 1.05;
      camera.position.y = 1.05 + py * 0.35;
      camera.lookAt(px * 0.36, -0.15 + py * 0.08, 0.35);

      const targetGlow = stepRef.current >= 2 ? 1 : 0;
      const pulse = 0.58 + 0.42 * Math.sin(t * 2.1);
      mycoMaterialsRef.current.forEach((mat) => {
        mat.opacity = targetGlow ? 0.42 + pulse * 0.28 : 0;
        mat.emissiveIntensity = targetGlow ? 0.52 + pulse * 0.55 : 0;
      });
      const xrayPulse = 0.6 + 0.4 * Math.sin(t * 1.8 + 0.6);
      xrayRootMat.opacity = 0.32 + xrayPulse * 0.2;

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

  const nutrientDots = [
    { top: "62%", left: "17%", delay: "0ms" },
    { top: "71%", left: "31%", delay: "120ms" },
    { top: "76%", left: "48%", delay: "240ms" },
    { top: "69%", left: "63%", delay: "360ms" },
    { top: "74%", left: "80%", delay: "460ms" },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-t-[28px] bg-gradient-to-b from-[#d5f0ff] via-[#99d07e] to-[#5f8b42]">
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

      {step >= 3 &&
        nutrientDots.map((d, i) => (
          <div
            key={i}
            className="absolute h-3 w-3 animate-pulse rounded-full bg-amber-200 shadow-[0_0_18px_rgba(253,230,138,0.9)]"
            style={{ top: d.top, left: d.left, animationDelay: d.delay }}
          />
        ))}

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

function ARLessonPrototype() {
  const [step, setStep] = useState(1);
  const [guessed, setGuessed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(""), 1400);
    return () => clearTimeout(t);
  }, [feedback]);

  const next = () => {
    if (step === 1 && !guessed) {
      setGuessed(true);
      setFeedback("Nice guess");
      return;
    }
    if (step < 3) {
      setStep((s) => s + 1);
      setFeedback(step === 1 ? "Hidden connections revealed" : "Nutrients are moving!");
      return;
    }
    setStep(1);
    setGuessed(false);
    setFeedback("Restarting lesson");
  };

  const back = () => {
    if (step === 1) {
      setGuessed(false);
      return;
    }
    setStep((s) => s - 1);
  };

  const current = steps[step - 1];

  const updateParallax = (clientX, clientY, rect) => {
    const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) });
  };

  const handleSceneMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateParallax(e.clientX, e.clientY, rect);
  };

  const handleSceneTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    updateParallax(e.touches[0].clientX, e.touches[0].clientY, rect);
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-900 md:p-8">
      <div className="mx-auto w-full max-w-[1536px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
        <div className="grid min-h-[840px] grid-rows-[45%_55%] md:h-[1024px] md:grid-rows-2">
          <div
            className="relative"
            onMouseMove={handleSceneMove}
            onMouseLeave={resetParallax}
            onTouchMove={handleSceneTouchMove}
            onTouchEnd={resetParallax}
          >
            <RootNetwork step={step} parallax={parallax} />
          </div>

          <div className="relative bg-[#F7F9F7] px-4 pb-6 pt-5 md:px-8">
            {feedback && (
              <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
                {feedback}
              </div>
            )}

            <div className="mb-4 flex items-end justify-between gap-4">
              <div className="max-w-[980px] rounded-[24px] bg-white px-4 py-4 text-lg font-medium leading-snug text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:px-6 md:py-5 md:text-[22px]">
                {current.bubble}
              </div>
              <Worm />
            </div>

            <div className="mx-auto max-w-[1200px]">
              {step === 1 ? (
                <QuestionCard
                  guessed={guessed}
                  onGuess={() => {
                    setGuessed(true);
                    setFeedback("Nice guess");
                  }}
                />
              ) : step === 2 ? (
                <ConnectionCard />
              ) : (
                <ExplanationCard />
              )}
            </div>

            <div className="mt-5 flex items-center justify-between px-2">
              <button onClick={back} className="rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-200/70">
                &lt; Back
              </button>

              <ProgressDots active={step} />

              <button onClick={next} className="rounded-xl bg-emerald-800 px-4 py-2.5 text-white transition hover:scale-[1.01] active:scale-[0.99]">
                {step === 1 && !guessed ? current.cta : step === 3 ? "Restart" : "Next"} &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ARLessonPrototype />);
