import React, { useEffect, useRef } from 'react';

interface BridgeCanvasProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  phase: number;
  speed: number;
  depth: number;
}

/**
 * Hero visual: a constellation of skill nodes suspended from flowing
 * bridge arcs. The structure rotates gently toward the cursor and each
 * node drifts with its own phase, giving quiet depth without WebGL.
 * Rendered on a 2D canvas for performance and universal support.
 */
export const BridgeCanvas: React.FC<BridgeCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let time = 0;

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(26, Math.floor(width / 42));
      nodes = Array.from({ length: count }, () => {
        const depth = 0.35 + Math.random() * 0.65;
        return {
          baseX: Math.random() * width,
          baseY: height * (0.18 + Math.random() * 0.62),
          x: 0,
          y: 0,
          radius: (1.2 + Math.random() * 2.4) * depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.7,
          depth,
        };
      });
      // Anchor the first few nodes along the top arc like suspension cables.
      nodes.slice(0, 7).forEach((node, index) => {
        node.baseX = (width / 6) * index + width / 12;
        node.baseY = height * 0.16 + Math.sin(index * 1.1) * height * 0.06;
      });
    };

    const drawArc = (t: number) => {
      const sway = prefersReducedMotion ? 0 : Math.sin(t * 0.3) * 6;

      for (let layer = 0; layer < 3; layer += 1) {
        const layerDepth = 1 - layer * 0.28;
        const yBase = height * (0.34 + layer * 0.1);
        const sag = height * (0.16 + layer * 0.05);

        ctx.beginPath();
        for (let px = 0; px <= width; px += 8) {
          const nx = px / width;
          const y =
            yBase +
            Math.pow(2 * nx - 1, 2) * sag +
            (prefersReducedMotion ? 0 : Math.sin(nx * 9 + t * 0.6 + layer) * 4 * layerDepth);
          if (px === 0) ctx.moveTo(px + sway * layerDepth, y);
          else ctx.lineTo(px + sway * layerDepth, y);
        }
        ctx.strokeStyle = `rgba(247, 244, 238, ${0.16 - layer * 0.045})`;
        ctx.lineWidth = 1.4 - layer * 0.35;
        ctx.stroke();

        // Vertical hangers, like a real suspension bridge.
        ctx.strokeStyle = `rgba(247, 244, 238, ${0.08 - layer * 0.022})`;
        ctx.lineWidth = 1;
        for (let hx = width * 0.08; hx < width * 0.95; hx += width * 0.09) {
          const nx = hx / width;
          const yTop =
            yBase +
            Math.pow(2 * nx - 1, 2) * sag +
            (prefersReducedMotion ? 0 : Math.sin(nx * 9 + t * 0.6 + layer) * 4 * layerDepth);
          ctx.beginPath();
          ctx.moveTo(hx + sway * layerDepth, yTop);
          ctx.lineTo(hx + sway * layerDepth, yTop + sag * 0.9 * layerDepth);
          ctx.stroke();
        }
      }
    };

    const render = () => {
      time += 1 / 60;

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      ctx.clearRect(0, 0, width, height);
      drawArc(time);

      const centerX = width / 2;
      const centerY = height / 2;

      nodes.forEach((node) => {
        if (prefersReducedMotion) {
          node.x = node.baseX;
          node.y = node.baseY;
        } else {
          const drift = Math.sin(time * node.speed + node.phase);
          node.x =
            node.baseX +
            drift * 10 * node.depth +
            (pointer.x - 0.5) * 34 * node.depth;
          node.y =
            node.baseY +
            Math.cos(time * node.speed * 0.8 + node.phase) * 8 * node.depth +
            (pointer.y - 0.5) * 22 * node.depth;
        }

        const parallax = (node.x - centerX) * (pointer.x - 0.5) * 0.08;
        const glow = 0.35 + 0.3 * node.depth;

        ctx.beginPath();
        ctx.arc(node.x + parallax, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 163, 92, ${glow})`;
        ctx.fill();

        // Occasional connecting lines to nearby nodes form the network.
        if (node.depth > 0.7 && Math.sin(node.phase) > 0.2) {
          const partner = nodes[(node.phase * 13 | 0) % nodes.length];
          ctx.beginPath();
          ctx.moveTo(node.x + parallax, node.y);
          ctx.lineTo(partner.x, partner.y);
          ctx.strokeStyle = 'rgba(240, 163, 92, 0.10)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      raf = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (event.clientY - rect.top) / Math.max(1, rect.height);
    };

    const onPointerLeave = () => {
      pointer.tx = 0.5;
      pointer.ty = 0.5;
    };

    const onResize = () => {
      build();
    };

    build();
    render();

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};

export default BridgeCanvas;
