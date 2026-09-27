"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vy: number;
  vx: number;
  opacity: number;
  color: string;
  shape: "petal" | "leaf" | "spark" | "paper";
}

interface ParticlesProps {
  type?: "petals" | "confetti" | "sparks" | "paper";
  count?: number;
  className?: string;
  active?: boolean;
}

const COLORS = {
  petals: ["hsl(355 55% 65%)", "hsl(350 50% 70%)", "hsl(0 45% 72%)", "hsl(340 45% 68%)"],
  confetti: ["hsl(42 60% 55%)", "hsl(175 35% 45%)", "hsl(355 55% 55%)", "hsl(140 30% 50%)", "hsl(30 70% 55%)"],
  sparks: ["hsl(42 80% 60%)", "hsl(38 75% 55%)", "hsl(45 85% 65%)"],
  paper: ["hsl(42 35% 88%)", "hsl(40 30% 85%)", "hsl(38 28% 82%)"],
};

export default function Particles({
  type = "petals",
  count = 20,
  className = "",
  active = true,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.parentElement?.clientWidth) || window.innerWidth;
    let height = (canvas.parentElement?.clientHeight) || window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const colors = COLORS[type];
    const petals: Petal[] = [];

    function createPetal(startTop = false): Petal {
      return {
        x: Math.random() * width,
        y: startTop ? -20 - Math.random() * 100 : Math.random() * height,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        vy: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.8,
        opacity: 0.4 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: type === "petals" ? "petal" : type === "sparks" ? "spark" : type === "paper" ? "paper" : "leaf",
      };
    }

    for (let i = 0; i < count; i++) {
      petals.push(createPetal(false));
    }

    function drawPetal(p: Petal) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === "petal") {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        // Add a subtle gradient for depth
        ctx.globalAlpha = p.opacity * 0.5;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, p.size * 0.3, p.size * 0.3, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === "leaf") {
        ctx.fillRect(-p.size * 0.3, -p.size * 0.5, p.size * 0.6, p.size);
      } else if (p.shape === "spark") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = p.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // paper piece
        ctx.fillRect(-p.size * 0.5, -p.size * 0.3, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.y += p.vy;
        p.x += p.vx;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        drawPetal(p);
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    if (active) {
      animate();
    }

    function handleResize() {
      const c = canvasRef.current;
      if (!c) return;
      width = c.parentElement?.clientWidth || window.innerWidth;
      height = c.parentElement?.clientHeight || window.innerHeight;
      c.width = width;
      c.height = height;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [type, count, active]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
