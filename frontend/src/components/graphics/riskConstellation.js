import * as THREE from 'three';

/**
 * Imperative Three.js scene: the "Exposure Constellation".
 *
 * A data-driven instrument — every asset from the risk engine becomes a
 * glowing node sized by EAL and colored by severity, orbiting the bank
 * core. The primary risk asset beams lateral-movement paths to every
 * other node with flowing particles, mirroring the attack-path model.
 *
 * Perf contract:
 *  - single rAF loop, paused when off-screen (IntersectionObserver) or tab hidden
 *  - DPR capped, star count reduced on small screens
 *  - every geometry/material/texture disposed on teardown
 *  - reduced-motion: renders a single static frame, no continuous animation
 */

const SEVERITY = {
  danger: 0xe05260,
  warn: 0xe39b3d,
  calm: 0x7a84ea,
  brass: 0xd9a84e,
};

const severityFor = (eal) => {
  if (eal >= 7000000) return SEVERITY.danger;
  if (eal >= 3000000) return SEVERITY.warn;
  return SEVERITY.calm;
};

const makeGlowTexture = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.32)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
};

const makeLabelSprite = (text, accent) => {
  const scale = 2; // draw at 2x for crispness
  const c = document.createElement('canvas');
  c.width = 192 * scale;
  c.height = 40 * scale;
  const ctx = c.getContext('2d');
  ctx.font = `600 ${10.5 * scale}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // hairline plate behind the text so labels stay legible over lines
  const w = ctx.measureText(text).width + 18 * scale;
  ctx.fillStyle = 'rgba(11,14,20,0.72)';
  ctx.beginPath();
  ctx.roundRect((c.width - w) / 2, 6 * scale, w, 28 * scale, 6 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(59,72,96,0.9)';
  ctx.lineWidth = scale;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillText(text, c.width / 2, c.height / 2 + scale);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.92, depthWrite: false })
  );
  sprite.scale.set(1.14, 0.24, 1);
  return sprite;
};

export function createConstellation(container, { assets = [], reducedMotion = false, onHover, onSelect }) {
  if (!container) return null;

  const isSmall = container.clientWidth < 480;
  const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 1.75);
  const disposables = [];
  const track = (x) => {
    disposables.push(x);
    return x;
  };

  // ---------- renderer / scene / camera ----------
  const renderer = track(
    new THREE.WebGLRenderer({ alpha: true, antialias: !isSmall, powerPreference: 'high-performance' })
  );
  renderer.setPixelRatio(dpr);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.touchAction = 'pan-y';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.15, 7.4);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0x3a4060, 0.7));
  const keyLight = new THREE.PointLight(0xd9a84e, 26, 22);
  keyLight.position.set(2.6, 3.4, 3.2);
  scene.add(keyLight);
  const coolFill = new THREE.PointLight(0x7a84ea, 14, 22);
  coolFill.position.set(-3.4, -1.6, -2.4);
  scene.add(coolFill);

  const world = new THREE.Group();
  scene.add(world);

  // ---------- backdrop starfield ----------
  const starCount = isSmall ? 170 : 360;
  const starPos = new Float32Array(starCount * 3);
  const starTint = new Float32Array(starCount * 3);
  const cWarm = new THREE.Color(0xd9a84e);
  const cCool = new THREE.Color(0x7a84ea);
  const cInk = new THREE.Color(0x5a6478);
  const tmp = new THREE.Color();
  for (let i = 0; i < starCount; i++) {
    // hollow spherical shell so stars never cross the instrument focal area
    const r = 6.4 + Math.random() * 3.2;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    starPos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    starPos[i * 3 + 1] = r * Math.cos(ph) * 0.72;
    starPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const roll = Math.random();
    tmp.copy(roll > 0.86 ? cWarm : roll > 0.66 ? cCool : cInk).multiplyScalar(0.5 + Math.random() * 0.5);
    starTint[i * 3] = tmp.r;
    starTint[i * 3 + 1] = tmp.g;
    starTint[i * 3 + 2] = tmp.b;
  }
  const starGeo = track(new THREE.BufferGeometry());
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starTint, 3));
  const starMat = track(
    new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false })
  );
  const stars = new THREE.Points(starGeo, starMat);
  world.add(stars);

  // ---------- bank core ----------
  const coreGeo = track(new THREE.IcosahedronGeometry(0.62, 1));
  const coreMat = track(
    new THREE.MeshBasicMaterial({ color: SEVERITY.brass, wireframe: true, transparent: true, opacity: 0.34 })
  );
  const core = new THREE.Mesh(coreGeo, coreMat);
  world.add(core);
  const coreInnerGeo = track(new THREE.IcosahedronGeometry(0.3, 0));
  const coreInnerMat = track(new THREE.MeshBasicMaterial({ color: SEVERITY.brass, transparent: true, opacity: 0.16 }));
  world.add(new THREE.Mesh(coreInnerGeo, coreInnerMat));

  const glowTex = track(makeGlowTexture());
  const coreGlow = new THREE.Sprite(
    track(new THREE.SpriteMaterial({ map: glowTex, color: SEVERITY.brass, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }))
  );
  coreGlow.scale.set(2.1, 2.1, 1);
  world.add(coreGlow);

  // ---------- asset nodes ----------
  const nodes = (assets.length ? assets : []).slice(0, 8);
  const maxEal = Math.max(...nodes.map((n) => n.eal || 0), 1);
  const primary = nodes.reduce((a, b) => ((b.eal || 0) > (a.eal || 0) ? b : a), { eal: 0 });

  const nodeMeshes = [];
  const nodeMeta = [];

  const positionFor = (i, total) => {
    // two tilted orbital shells — reads like a volume, not a flat wheel
    const shell = i % 2;
    const ringR = shell === 0 ? 2.35 : 3.25;
    const perShell = Math.ceil(total / 2);
    const idxInShell = Math.floor(i / 2);
    const angle = (idxInShell / perShell) * Math.PI * 2 + (shell ? Math.PI / perShell : 0);
    const tilt = shell === 0 ? 0.34 : -0.22;
    const x = Math.cos(angle) * ringR;
    const z = Math.sin(angle) * ringR;
    const y = Math.sin(angle + shell * 1.7) * ringR * tilt * 0.42;
    return new THREE.Vector3(x, y, z);
  };

  nodes.forEach((asset, i) => {
    const eal = asset.eal || 0;
    const color = severityFor(eal);
    const intensity = Math.sqrt((eal || 1) / maxEal); // area ∝ EAL
    const radius = 0.1 + intensity * 0.13;
    const pos = positionFor(i, nodes.length);

    const mat = track(
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
    );
    const mesh = new THREE.Mesh(track(new THREE.SphereGeometry(radius, 20, 20)), mat);
    mesh.position.copy(pos);
    world.add(mesh);

    const halo = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity: 0.34 + intensity * 0.3, blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    halo.scale.setScalar(radius * 7.2);
    mesh.add(halo);

    const label = makeLabelSprite(asset.short_name || `AST-${i + 1}`, '#d6dae4');
    label.position.set(0, -(radius + 0.19), 0);
    mesh.add(label);
    track(label.material);
    track(label.material.map);

    // orbit ring guides (one per shell, drawn once per shell)
    nodeMeshes.push(mesh);
    nodeMeta.push({ asset, mesh, baseScale: 1, targetScale: 1, baseY: pos.y, phase: Math.random() * Math.PI * 2 });
  });

  // two faint orbit guides
  [2.35, 3.25].forEach((r, idx) => {
    const pts = [];
    for (let a = 0; a <= 64; a++) {
      const t = (a / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r * (idx === 0 ? 0.16 : -0.1), Math.sin(t) * r));
    }
    const geo = track(new THREE.BufferGeometry().setFromPoints(pts));
    const mat = track(new THREE.LineBasicMaterial({ color: 0x303850, transparent: true, opacity: 0.35 }));
    world.add(new THREE.LineLoop(geo, mat));
  });

  // ---------- edges: primary asset ⇄ every other asset (lateral movement) ----------
  const curves = [];
  const primaryMesh = nodeMeshes[nodes.findIndex((n) => n === primary)] || nodeMeshes[0];
  if (primaryMesh) {
    nodeMeshes.forEach((target) => {
      if (target === primaryMesh) return;
      const start = primaryMesh.position.clone();
      const end = target.position.clone();
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.y += 0.75 + start.distanceTo(end) * 0.1; // arced "hop" over the core plane
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)));
      const mat = track(new THREE.LineBasicMaterial({ color: 0x5a6478, transparent: true, opacity: 0.4 }));
      world.add(new THREE.Line(geo, mat));
      curves.push({ curve, mat });
    });
    // spokes from core to primary ingress
    const start = new THREE.Vector3(0, 0, 0);
    const end = primaryMesh.position.clone();
    const curve = new THREE.QuadraticBezierCurve3(start, end.clone().multiplyScalar(0.5).setY(end.y + 0.4), end);
    const geo = track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(36)));
    const mat = track(new THREE.LineBasicMaterial({ color: SEVERITY.danger, transparent: true, opacity: 0.5 }));
    world.add(new THREE.Line(geo, mat));
    curves.push({ curve, mat });
  }

  // ---------- flowing particles along edges ----------
  const particlesPerEdge = isSmall ? 1 : 2;
  const flow = [];
  curves.forEach(({ curve }) => {
    for (let k = 0; k < particlesPerEdge; k++) {
      flow.push({ curve, t: Math.random(), speed: 0.12 + Math.random() * 0.1 });
    }
  });
  const flowGeo = track(new THREE.BufferGeometry());
  const flowPos = new Float32Array(flow.length * 3);
  flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
  const flowMat = track(
    new THREE.PointsMaterial({
      map: glowTex,
      color: 0xf0d189,
      size: 0.14,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  world.add(new THREE.Points(flowGeo, flowMat));

  // ---------- interaction ----------
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2(-2, -2);
  let hovered = null;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let spinVel = 0;
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  const dom = renderer.domElement;
  dom.style.cursor = 'grab';
  dom.setAttribute('aria-hidden', 'true');

  const setPointerFromEvent = (e) => {
    const rect = dom.getBoundingClientRect();
    pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    parallax.tx = pointerNdc.x;
    parallax.ty = pointerNdc.y;
  };

  const onPointerMove = (e) => {
    setPointerFromEvent(e);
    if (dragging && !reducedMotion) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      world.rotation.y += dx * 0.0052;
      world.rotation.x = THREE.MathUtils.clamp(world.rotation.x + dy * 0.0028, -0.55, 0.75);
      spinVel = dx * 0.0052;
      return; // no hover changes mid-drag
    }
    if (reducedMotion) return;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(nodeMeshes, false);
    const mesh = hits.length ? hits[0].object : null;
    if (mesh !== hovered) {
      hovered = mesh;
      dom.style.cursor = mesh ? 'pointer' : 'grab';
      const meta = nodeMeta.find((m) => m.mesh === mesh);
      const rect = container.getBoundingClientRect();
      onHover?.(meta ? { ...meta.asset } : null, meta ? e.clientX - rect.left : 0, meta ? e.clientY - rect.top : 0);
    } else if (mesh) {
      const meta = nodeMeta.find((m) => m.mesh === mesh);
      const rect = container.getBoundingClientRect();
      onHover?.({ ...meta.asset }, e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const onPointerDown = (e) => {
    if (reducedMotion) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    spinVel = 0;
    dom.style.cursor = 'grabbing';
    dom.setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e) => {
    if (dragging) {
      dragging = false;
      dom.style.cursor = hovered ? 'pointer' : 'grab';
      dom.releasePointerCapture?.(e.pointerId);
    }
  };

  const onClick = () => {
    if (hovered && !reducedMotion) {
      const meta = nodeMeta.find((m) => m.mesh === hovered);
      if (meta) onSelect?.(meta.asset);
    }
  };

  const onPointerLeave = () => {
    pointerNdc.set(-2, -2);
    parallax.tx = 0;
    parallax.ty = 0;
    if (hovered) {
      hovered = null;
      onHover?.(null, 0, 0);
    }
  };

  dom.addEventListener('pointermove', onPointerMove);
  dom.addEventListener('pointerdown', onPointerDown);
  dom.addEventListener('pointerup', onPointerUp);
  dom.addEventListener('pointercancel', onPointerUp);
  dom.addEventListener('click', onClick);
  dom.addEventListener('pointerleave', onPointerLeave);

  // ---------- lifecycle: pause off-screen / hidden, resize ----------
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(container);

  const onVisibility = () => {
    visible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibility);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (reducedMotion) renderer.render(scene, camera);
  });
  ro.observe(container);

  // ---------- frame loop ----------
  const clock = new THREE.Clock();
  let raf = null;

  const frame = () => {
    // idle tick while off-screen or tab hidden — no render, no simulation
    if (!visible) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!dragging) {
      world.rotation.y += 0.055 * dt + spinVel;
      spinVel *= 0.94;
      world.rotation.x += (Math.sin(t * 0.1) * 0.03 - world.rotation.x) * 0.008;
    }

    // pointer parallax — camera leans toward the cursor
    parallax.x += (parallax.tx - parallax.x) * 0.045;
    parallax.y += (parallax.ty - parallax.y) * 0.045;
    camera.position.x = parallax.x * 0.55;
    camera.position.y = 1.15 + parallax.y * 0.32;
    camera.lookAt(0, 0, 0);

    core.rotation.y += 0.12 * dt;
    core.rotation.x += 0.035 * dt;
    stars.rotation.y -= 0.008 * dt;

    nodeMeta.forEach((meta, i) => {
      meta.mesh.position.y = meta.baseY + Math.sin(t * 0.6 + meta.phase) * 0.07;
      const target = meta.mesh === hovered ? 1.42 : 1;
      meta.targetScale += (target - meta.targetScale) * 0.14;
      meta.mesh.scale.setScalar(meta.targetScale);
      const halo = meta.mesh.children[0];
      if (halo) halo.material.opacity = Math.min(1, (meta.mesh === hovered ? 0.75 : 0.4) + Math.sin(t * 1.4 + i) * 0.08);
    });

    flow.forEach((p, i) => {
      p.t = (p.t + p.speed * dt) % 1;
      const pos = p.curve.getPoint(p.t);
      flowPos[i * 3] = pos.x;
      flowPos[i * 3 + 1] = pos.y;
      flowPos[i * 3 + 2] = pos.z;
    });
    flowGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };

  if (reducedMotion) {
    // static composition — no continuous decorative motion
    world.rotation.x = 0.18;
    nodeMeta.forEach((meta) => meta.mesh.scale.setScalar(1));
    flow.forEach((p, i) => {
      const pos = p.curve.getPoint(0.5);
      flowPos[i * 3] = pos.x;
      flowPos[i * 3 + 1] = pos.y;
      flowPos[i * 3 + 2] = pos.z;
    });
    flowGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  } else {
    raf = requestAnimationFrame(frame);
  }

  // ---------- api ----------
  return {
    start() {
      if (!raf && !reducedMotion) {
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    },
    stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    },
    dispose() {
      this.stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('pointerleave', onPointerLeave);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      dom.remove();
    },
  };
}
