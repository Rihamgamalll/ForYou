"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

export interface WishLanternHandle {
  release: () => Promise<void>;
  reset: () => Promise<void>;
}

interface WishLanternProps {
  className?: string;
}

/**
 * A floating wish lantern / paper lantern that rises when released.
 * The lantern glows, particles drift upward, and the lantern floats away.
 */
const WishLantern = forwardRef<WishLanternHandle, WishLanternProps>(
  ({ className = "" }, ref) => {
    const lanternRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      async release() {
        const lantern = lanternRef.current;
        const glow = glowRef.current;
        const particles = particlesRef.current;

        // Glow intensifies
        if (glow) {
          glow.style.transition = "opacity 0.5s ease, transform 0.5s ease";
          glow.style.opacity = "0.8";
          glow.style.transform = "scale(1.5)";
        }

        // Release particles
        if (particles) {
          const dots = particles.querySelectorAll("[data-dot]");
          dots.forEach((dot, i) => {
            const el = dot as HTMLElement;
            const angle = (i / dots.length) * Math.PI - Math.PI / 2;
            const dist = 40 + Math.random() * 50;
            el.style.transition = "transform 1.5s ease-out, opacity 1.5s ease";
            el.style.transform = `translate(${Math.cos(angle) * dist}px, ${-80 - Math.random() * 60}px) scale(${0.5 + Math.random()})`;
            el.style.opacity = "0";
          });
        }

        await new Promise((r) => setTimeout(r, 400));

        // Lantern floats up and away
        if (lantern) {
          lantern.style.transition =
            "transform 2s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.5s ease 0.5s";
          lantern.style.transform = "translateY(-300px) scale(0.4) rotate(2deg)";
          lantern.style.opacity = "0";
        }
      },
      async reset() {
        const lantern = lanternRef.current;
        const glow = glowRef.current;
        const particles = particlesRef.current;
        if (lantern) {
          lantern.style.transition = "none";
          lantern.style.transform = "translateY(0) scale(1) rotate(0deg)";
          lantern.style.opacity = "1";
        }
        if (glow) {
          glow.style.opacity = "0.4";
          glow.style.transform = "scale(1)";
        }
        if (particles) {
          const dots = particles.querySelectorAll("[data-dot]");
          dots.forEach((dot) => {
            const el = dot as HTMLElement;
            el.style.transition = "none";
            el.style.transform = "translate(0, 0) scale(1)";
            el.style.opacity = "1";
          });
        }
      },
    }));

    return (
      <div className={`relative ${className}`} style={{ width: 160, height: 240 }}>
        {/* Glow halo behind lantern */}
        <div
          ref={glowRef}
          className="absolute left-1/2 top-8 rounded-full"
          style={{
            transform: "translateX(-50%)",
            width: 140,
            height: 140,
            background:
              "radial-gradient(circle, hsl(38 70% 60% / 0.4) 0%, hsl(38 60% 55% / 0.1) 50%, transparent 70%)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        {/* Floating particles */}
        <div
          ref={particlesRef}
          className="absolute left-1/2 top-0"
          style={{ transform: "translateX(-50%)", pointerEvents: "none" }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <div
              key={i}
              data-dot
              className="absolute rounded-full"
              style={{
                width: 3 + (i % 4),
                height: 3 + ((i * 2) % 4),
                background: "hsl(42 70% 60%)",
                left: ((i * 23) % 80) - 40,
                top: 40 + ((i * 31) % 60),
                opacity: 0.62 + (i % 4) * 0.07,
                boxShadow: "0 0 6px hsl(38 70% 55% / 0.6)",
              }}
            />
          ))}
        </div>

        {/* Lantern body */}
        <div
          ref={lanternRef}
          className="absolute left-1/2"
          style={{
            top: 20,
            transform: "translateX(-50%)",
            width: 120,
            height: 160,
          }}
        >
          <svg viewBox="0 0 120 160" className="w-full h-full">
            <defs>
              <linearGradient id="lantern-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(35 50% 88%)" />
                <stop offset="50%" stopColor="hsl(32 55% 82%)" />
                <stop offset="100%" stopColor="hsl(28 50% 75%)" />
              </linearGradient>
              <radialGradient id="lantern-inner" cx="50%" cy="45%" r="40%">
                <stop offset="0%" stopColor="hsl(45 80% 70%)" stopOpacity="0.9" />
                <stop offset="60%" stopColor="hsl(38 70% 55%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(35 60% 50%)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lantern-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(30 30% 60%)" />
                <stop offset="100%" stopColor="hsl(30 35% 50%)" />
              </linearGradient>
              <filter id="lantern-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="hsl(30 40% 30%)" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Top cap */}
            <rect x="42" y="0" width="36" height="10" rx="2" fill="url(#lantern-top)" />
            <rect x="38" y="8" width="44" height="6" rx="1" fill="url(#lantern-top)" />

            {/* Lantern body — rounded shape */}
            <path
              d="M 25 20 Q 15 50 15 80 Q 15 120 60 128 Q 105 120 105 80 Q 105 50 95 20 Z"
              fill="url(#lantern-body)"
              filter="url(#lantern-shadow)"
            />

            {/* Inner glow */}
            <ellipse cx="60" cy="70" rx="32" ry="45" fill="url(#lantern-inner)" />

            {/* Ribs — vertical lines for the paper structure */}
            <path d="M 40 22 Q 35 70 38 125" fill="none" stroke="hsl(30 35% 65%)" strokeWidth="0.5" opacity="0.4" />
            <path d="M 60 20 Q 60 70 60 128" fill="none" stroke="hsl(30 35% 65%)" strokeWidth="0.5" opacity="0.4" />
            <path d="M 80 22 Q 85 70 82 125" fill="none" stroke="hsl(30 35% 65%)" strokeWidth="0.5" opacity="0.4" />

            {/* Bottom cap */}
            <rect x="38" y="126" width="44" height="6" rx="1" fill="url(#lantern-top)" />
            <rect x="42" y="130" width="36" height="8" rx="2" fill="url(#lantern-top)" />

            {/* Tassel */}
            <path d="M 60 138 L 58 152 M 60 138 L 60 155 M 60 138 L 62 152"
              fill="none" stroke="hsl(35 40% 55%)" strokeWidth="1" opacity="0.6" />

            {/* Paper texture */}
            <path
              d="M 25 20 Q 15 50 15 80 Q 15 120 60 128 Q 105 120 105 80 Q 105 50 95 20 Z"
              fill="none"
              stroke="hsl(30 30% 70%)" strokeWidth="0.3" opacity="0.3"
            />
          </svg>
        </div>
      </div>
    );
  }
);

WishLantern.displayName = "WishLantern";
export default WishLantern;
