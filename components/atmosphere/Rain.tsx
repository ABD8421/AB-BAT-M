"use client";

import { useEffect, useRef } from "react";

export type SnowMode = "gentle" | "blizzard" | "storm";

interface Flake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  windWeight: number;
  swayFreq: number;
  swayAmp: number;
  swayOffset: number;
  alpha: number;
}

export function Rain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = window.innerWidth || 1200;
    let height = window.innerHeight || 800;
    let frame = 0;
    let tick = 0;
    let isAnimating = true;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = width < 768;

    // Intensity mode configuration
    let currentMode: SnowMode = "blizzard";

    const MODE_CONFIG = {
      gentle: {
        speedScale: 0.65,
        windScale: 0.55,
        gustAmp: 0.0005,
      },
      blizzard: {
        speedScale: 1.0,
        windScale: 1.0,
        gustAmp: 0.0011,
      },
      storm: {
        speedScale: 1.5,
        windScale: 1.8,
        gustAmp: 0.0020,
      },
    };

    // 1. Background distant powder flurries (high density, fine drifting particles)
    const bgCount = isMobile ? 85 : 190;
    const bgFlakes: Flake[] = Array.from({ length: bgCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 1.1 + Math.random() * 1.3,
      speed: 0.0022 + Math.random() * 0.0026,
      windWeight: 1.1 + Math.random() * 0.4,
      swayFreq: 0.003 + Math.random() * 0.005,
      swayAmp: 0.0004 + Math.random() * 0.0005,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0.45 + Math.random() * 0.35,
    }));

    // 2. Midground fluttering snowflakes (crisp, prominent, natural sine sway)
    const midCount = isMobile ? 55 : 120;
    const midFlakes: Flake[] = Array.from({ length: midCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 2.4 + Math.random() * 2.2,
      speed: 0.0013 + Math.random() * 0.0018,
      windWeight: 0.9 + Math.random() * 0.3,
      swayFreq: 0.002 + Math.random() * 0.0035,
      swayAmp: 0.0008 + Math.random() * 0.0010,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0.70 + Math.random() * 0.28,
    }));

    // 3. Foreground macro bokeh flakes (large, soft blurred snowflakes close to viewport)
    const fgCount = isMobile ? 10 : 24;
    const fgFlakes: Flake[] = Array.from({ length: fgCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 5.5 + Math.random() * 4.5,
      speed: 0.0008 + Math.random() * 0.0013,
      windWeight: 0.6 + Math.random() * 0.25,
      swayFreq: 0.0012 + Math.random() * 0.0022,
      swayAmp: 0.0012 + Math.random() * 0.0015,
      swayOffset: Math.random() * Math.PI * 2,
      alpha: 0.82 + Math.random() * 0.16,
    }));

    function resize() {
      if (!canvas) return;
      width = window.innerWidth || document.documentElement.clientWidth || 1200;
      height = window.innerHeight || document.documentElement.clientHeight || 800;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function onModeChange(e: Event) {
      const customEvent = e as CustomEvent<{ mode: SnowMode }>;
      if (customEvent.detail?.mode && MODE_CONFIG[customEvent.detail.mode]) {
        currentMode = customEvent.detail.mode;
      }
    }

    window.addEventListener("arkham-snow-mode", onModeChange);

    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      tick++;

      const cfg = MODE_CONFIG[currentMode];

      // Gotham Blizzard wind gusts: compound oscillating wave
      const baseWind = 0.0010 * cfg.windScale;
      const gust = (Math.sin(tick * 0.0028) * 0.0008 + Math.cos(tick * 0.0064) * 0.0005) * (cfg.gustAmp / 0.0011);
      const currentWind = baseWind + gust;

      // 1. Draw Background Flakes (Powder Blizzard)
      const activeBg = Math.floor(bgFlakes.length * (currentMode === "gentle" ? 0.6 : currentMode === "storm" ? 1.0 : 0.88));
      for (let i = 0; i < activeBg; i++) {
        const f = bgFlakes[i];
        if (!f) continue;
        f.y += f.speed * cfg.speedScale;
        f.x += currentWind * f.windWeight + Math.sin(tick * f.swayFreq + f.swayOffset) * f.swayAmp;

        if (f.y > 1.03) { f.y = -0.03; f.x = Math.random(); }
        if (f.x > 1.05) f.x = -0.05;
        else if (f.x < -0.05) f.x = 1.05;

        const x = f.x * width;
        const y = f.y * height;

        context.fillStyle = `rgba(225, 238, 255, ${f.alpha})`;
        context.beginPath();
        context.arc(x, y, f.radius, 0, Math.PI * 2);
        context.fill();
      }

      // 2. Draw Midground Flakes (Fluttering Snowflakes)
      const activeMid = Math.floor(midFlakes.length * (currentMode === "gentle" ? 0.55 : currentMode === "storm" ? 1.0 : 0.88));
      for (let i = 0; i < activeMid; i++) {
        const f = midFlakes[i];
        if (!f) continue;
        f.y += f.speed * cfg.speedScale;
        f.x += currentWind * f.windWeight + Math.sin(tick * f.swayFreq + f.swayOffset) * f.swayAmp;

        if (f.y > 1.03) { f.y = -0.03; f.x = Math.random(); }
        if (f.x > 1.05) f.x = -0.05;
        else if (f.x < -0.05) f.x = 1.05;

        const x = f.x * width;
        const y = f.y * height;

        context.fillStyle = `rgba(242, 248, 255, ${f.alpha})`;
        context.beginPath();
        context.arc(x, y, f.radius, 0, Math.PI * 2);
        context.fill();
      }

      // 3. Draw Foreground Flakes (Cinematic Soft Bokeh)
      const activeFg = Math.floor(fgFlakes.length * (currentMode === "gentle" ? 0.5 : currentMode === "storm" ? 1.0 : 0.88));
      for (let i = 0; i < activeFg; i++) {
        const f = fgFlakes[i];
        if (!f) continue;
        f.y += f.speed * cfg.speedScale;
        f.x += currentWind * f.windWeight + Math.sin(tick * f.swayFreq + f.swayOffset) * f.swayAmp;

        if (f.y > 1.04) { f.y = -0.04; f.x = Math.random(); }
        if (f.x > 1.06) f.x = -0.06;
        else if (f.x < -0.06) f.x = 1.06;

        const x = f.x * width;
        const y = f.y * height;

        // Radial blur gradient for camera lens bokeh
        const grad = context.createRadialGradient(x, y, 0, x, y, f.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha})`);
        grad.addColorStop(0.4, `rgba(235, 244, 255, ${f.alpha * 0.65})`);
        grad.addColorStop(1, "rgba(215, 235, 255, 0)");

        context.fillStyle = grad;
        context.beginPath();
        context.arc(x, y, f.radius, 0, Math.PI * 2);
        context.fill();
      }
    }

    function loop() {
      if (!isAnimating) return;
      draw();
      frame = requestAnimationFrame(loop);
    }

    function onVisibility() {
      if (document.hidden) {
        isAnimating = false;
        cancelAnimationFrame(frame);
      } else {
        if (!isAnimating) {
          isAnimating = true;
          frame = requestAnimationFrame(loop);
        }
      }
    }

    resize();
    isAnimating = true;
    frame = requestAnimationFrame(loop);

    // Re-check size after initial paint to guarantee full viewport match
    const resizeTimer = setTimeout(resize, 100);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isAnimating = false;
      clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("arkham-snow-mode", onModeChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="atmos__rain" aria-hidden="true" />;
}

export const Snowfall = Rain;
