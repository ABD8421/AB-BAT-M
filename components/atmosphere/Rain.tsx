"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural rain on a 2D canvas (spec §04, §46).
 *
 * Chosen over Three.js on purpose: this is a 2D effect, and shipping a WebGL
 * runtime for it would cost hundreds of kilobytes for no visual gain.
 * It disables itself for reduced-motion, small screens, low core counts and
 * whenever the tab is hidden.
 */
export function Rain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (reduced || window.innerWidth < 900 || cores < 2) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);

    const drops = Array.from({ length: 130 }, () => ({
      x: Math.random(),
      y: Math.random(),
      length: 8 + Math.random() * 22,
      speed: 0.0035 + Math.random() * 0.007,
      alpha: 0.06 + Math.random() * 0.22,
    }));

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      for (const drop of drops) {
        drop.y += drop.speed;
        if (drop.y > 1.1) {
          drop.y = -0.1;
          drop.x = Math.random();
        }
        const x = drop.x * width + drop.y * 26;
        const y = drop.y * height;
        context.strokeStyle = `rgba(190, 205, 225, ${drop.alpha})`;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - 3, y + drop.length);
        context.stroke();
      }
      frame = requestAnimationFrame(draw);
    }

    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(draw);
    }

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="atmos__rain" aria-hidden="true" />;
}
