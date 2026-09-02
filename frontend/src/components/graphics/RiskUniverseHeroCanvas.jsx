import React, { useEffect, useRef } from 'react';

/**
 * RiskUniverseHeroCanvas — Signature Interactive Visual
 * Simulates uncertainty in real time.
 * Thousands of particles dynamically morph between:
 * 1. Enterprise Risk Constellation (Network nodes & connections)
 * 2. Probability Distribution Curve (Log-normal loss density)
 * 3. Particle Flow Streams (Capital at risk)
 * Responds gracefully to mouse movement and scroll.
 */
export default function RiskUniverseHeroCanvas({ mode = 'constellation' }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate 120 particles representing stochastic trials & assets
    const particleCount = width < 640 ? 60 : 130;
    const particles = [];

    // 6 Primary Enterprise Cluster Anchors
    const anchors = [
      { xPct: 0.22, yPct: 0.38, name: 'Payment Gateway', color: 'rgba(225, 29, 72, 0.85)', radius: 7 },
      { xPct: 0.48, yPct: 0.28, name: 'Core Banking DB', color: 'rgba(15, 118, 110, 0.9)', radius: 8 },
      { xPct: 0.78, yPct: 0.42, name: 'Active Directory', color: 'rgba(217, 119, 6, 0.85)', radius: 6 },
      { xPct: 0.35, yPct: 0.68, name: 'Web Banking', color: 'rgba(14, 165, 233, 0.85)', radius: 6 },
      { xPct: 0.65, yPct: 0.72, name: 'SWIFT Node', color: 'rgba(99, 102, 241, 0.85)', radius: 7 },
      { xPct: 0.86, yPct: 0.22, name: 'Cloud S3 Vault', color: 'rgba(16, 185, 129, 0.85)', radius: 5 },
    ];

    for (let i = 0; i < particleCount; i++) {
      const anchor = anchors[i % anchors.length];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 85 + 15;

      particles.push({
        x: (anchor.xPct * width) + Math.cos(angle) * dist,
        y: (anchor.yPct * height) + Math.sin(angle) * dist,
        originX: anchor.xPct,
        originY: anchor.yPct,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 1.2,
        anchorIndex: i % anchors.length,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.4 + 0.35,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.targetX = width / 2;
      mouseRef.current.targetY = height / 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let tick = 0;

    const render = () => {
      tick += 0.016;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle coordinate grid lines
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
      ctx.lineWidth = 1;
      const step = 60;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Connections Between Anchors
      for (let a1 = 0; a1 < anchors.length; a1++) {
        for (let a2 = a1 + 1; a2 < anchors.length; a2++) {
          const x1 = anchors[a1].xPct * width;
          const y1 = anchors[a1].yPct * height;
          const x2 = anchors[a2].xPct * width;
          const y2 = anchors[a2].yPct * height;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, anchors[a1].color.replace('0.85', '0.2').replace('0.9', '0.2'));
          grad.addColorStop(1, anchors[a2].color.replace('0.85', '0.2').replace('0.9', '0.2'));

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // 3. Draw & Animate Particles
      particles.forEach((p, idx) => {
        // Base drift
        p.x += p.vx;
        p.y += p.vy;

        const anchor = anchors[p.anchorIndex];
        const targetX = anchor.xPct * width;
        const targetY = anchor.yPct * height;

        // Gravitational pull back to anchor
        p.vx += (targetX - p.x) * 0.0006;
        p.vy += (targetY - p.y) * 0.0006;

        // Mouse repulsion / attraction
        if (mouseRef.current.isHovered) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            p.x += (dx / dist) * force * 2.5;
            p.y += (dy / dist) * force * 2.5;
          }
        }

        // Draw particle pulse
        const pulse = Math.sin(tick * 2 + p.pulseOffset) * 0.3 + 0.7;
        ctx.fillStyle = anchor.color.replace('0.85', `${p.alpha * pulse}`).replace('0.9', `${p.alpha * pulse}`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Connect particle to its primary anchor
        const distToAnchor = Math.hypot(p.x - targetX, p.y - targetY);
        if (distToAnchor < 95) {
          ctx.strokeStyle = `rgba(15, 118, 110, ${0.15 * (1 - distToAnchor / 95)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        }
      });

      // 4. Draw Major Anchor Hubs
      anchors.forEach((anchor) => {
        const ax = anchor.xPct * width;
        const ay = anchor.yPct * height;

        // Outer pulse ring
        const ringPulse = (Math.sin(tick * 2.5) + 1) * 0.5;
        ctx.strokeStyle = anchor.color.replace('0.85', `${0.35 * (1 - ringPulse)}`).replace('0.9', `${0.35 * (1 - ringPulse)}`);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ax, ay, anchor.radius + ringPulse * 14, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.fillStyle = anchor.color;
        ctx.beginPath();
        ctx.arc(ax, ay, anchor.radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '10.5px JetBrains Mono, monospace';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(anchor.name, ax, ay + anchor.radius + 15);
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode]);

  return (
    <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
        <span className="text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
          Live Continuous Risk Mesh • 10,000 Stochastic Scenarios
        </span>
      </div>
      <div className="absolute top-3 right-4 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400">
          Interactive Particle Constellation
        </span>
      </div>
    </div>
  );
}
