"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

export interface SecretRevealHandle {
  reveal: () => Promise<void>;
  reset: () => Promise<void>;
}

interface SecretRevealProps {
  className?: string;
}

/**
 * A locked glass bottle / apothecary jar containing a rolled message.
 * On reveal: the cork pops, golden light escapes, the scroll unfurls.
 */
const SecretReveal = forwardRef<SecretRevealHandle, SecretRevealProps>(
  ({ className = "" }, ref) => {
    const bottleRef = useRef<HTMLDivElement>(null);
    const corkRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      async reveal() {
        const cork = corkRef.current;
        const glow = glowRef.current;
        const scroll = scrollRef.current;
        const bottle = bottleRef.current;
        const particles = particlesRef.current;

        // Glow builds up inside the bottle
        if (glow) {
          glow.style.transition = "opacity 0.6s ease, transform 0.6s ease";
          glow.style.opacity = "0.9";
          glow.style.transform = "scale(1.3)";
        }

        // Particles swirl inside
        if (particles) {
          const dots = particles.querySelectorAll("[data-spark]");
          dots.forEach((dot, i) => {
            const el = dot as HTMLElement;
            const angle = (i / dots.length) * Math.PI * 2;
            el.style.transition = "transform 0.5s ease-out, opacity 0.5s ease";
            el.style.transform = `translate(${Math.cos(angle) * 20}px, ${Math.sin(angle) * 20}px) scale(1.5)`;
            el.style.opacity = "1";
          });
        }

        await new Promise((r) => setTimeout(r, 400));

        // Cork pops off
        if (cork) {
          cork.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease 0.3s";
          cork.style.transform = "translateY(-60px) rotate(20deg)";
          cork.style.opacity = "0";
        }

        // Light bursts out
        if (glow) {
          glow.style.transition = "opacity 0.4s ease, transform 0.8s ease";
          glow.style.opacity = "0";
          glow.style.transform = "scale(2.5)";
        }

        await new Promise((r) => setTimeout(r, 300));

        // Bottle fades slightly
        if (bottle) {
          bottle.style.transition = "opacity 0.8s ease";
          bottle.style.opacity = "0.3";
        }

        // Scroll unfurls
        if (scroll) {
          scroll.style.display = "block";
          scroll.style.transition = "transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease";
          // force reflow
          void scroll.offsetHeight;
          scroll.style.transform = "translate(-50%, 0) scaleY(1) scaleX(1)";
          scroll.style.opacity = "1";
        }

        await new Promise((r) => setTimeout(r, 600));
      },
      async reset() {
        const cork = corkRef.current;
        const glow = glowRef.current;
        const scroll = scrollRef.current;
        const bottle = bottleRef.current;
        const particles = particlesRef.current;
        if (cork) {
          cork.style.transition = "none";
          cork.style.transform = "translateY(0) rotate(0deg)";
          cork.style.opacity = "1";
        }
        if (glow) {
          glow.style.opacity = "0";
          glow.style.transform = "scale(1)";
        }
        if (bottle) {
          bottle.style.opacity = "1";
        }
        if (scroll) {
          scroll.style.transition = "none";
          scroll.style.transform = "translate(-50%, 0) scaleY(0) scaleX(0.3)";
          scroll.style.opacity = "0";
        }
        if (particles) {
          const dots = particles.querySelectorAll("[data-spark]");
          dots.forEach((dot) => {
            const el = dot as HTMLElement;
            el.style.transition = "none";
            el.style.transform = "translate(0, 0) scale(0.5)";
            el.style.opacity = "0.3";
          });
        }
      },
    }));

    return (
      <div className={`relative ${className}`} style={{ width: 160, height: 280 }}>
        {/* Ambient glow */}
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            transform: "translate(-50%, -50%)",
            width: 120,
            height: 120,
            background: "radial-gradient(circle, hsl(42 80% 60% / 0.8) 0%, hsl(38 70% 55% / 0.2) 50%, transparent 70%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Bottle */}
        <div ref={bottleRef} className="absolute left-1/2" style={{ top: 30, transform: "translateX(-50%)", width: 120, height: 230, zIndex: 10 }}>
          <svg viewBox="0 0 120 230" className="w-full h-full">
            <defs>
              <linearGradient id="bottle-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(180 15% 75%)" stopOpacity="0.5" />
                <stop offset="30%" stopColor="hsl(180 10% 88%)" stopOpacity="0.6" />
                <stop offset="70%" stopColor="hsl(180 10% 88%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(180 15% 70%)" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="bottle-neck" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(180 15% 72%)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="hsl(180 10% 86%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(180 15% 68%)" stopOpacity="0.5" />
              </linearGradient>
              <radialGradient id="bottle-inner-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(42 70% 65%)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(42 70% 65%)" stopOpacity="0" />
              </radialGradient>
              <filter id="bottle-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="hsl(180 20% 30%)" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Bottle body */}
            <path
              d="M 30 60 Q 30 50 40 45 L 45 30 L 45 20 L 75 20 L 75 30 L 80 45 Q 90 50 90 60 L 90 200 Q 90 215 75 215 L 45 215 Q 30 215 30 200 Z"
              fill="url(#bottle-glass)"
              stroke="hsl(180 15% 60%)"
              strokeWidth="1"
              strokeOpacity="0.3"
              filter="url(#bottle-shadow)"
            />

            {/* Inner glow */}
            <ellipse cx="60" cy="130" rx="25" ry="70" fill="url(#bottle-inner-glow)" />

            {/* Glass shine — left */}
            <path d="M 38 70 Q 36 120 38 190" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="3" strokeOpacity="0.3" strokeLinecap="round" />
            {/* Glass shine — right small */}
            <path d="M 82 90 Q 83 110 82 130" fill="none" stroke="hsl(0 0% 100%)" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />

            {/* Neck rim */}
            <rect x="43" y="20" width="34" height="4" rx="1" fill="hsl(180 15% 65%)" opacity="0.4" />

            {/* Particles inside bottle */}
          </svg>

          {/* Inner particles */}
          <div ref={particlesRef} className="absolute" style={{ left: 35, top: 60, width: 50, height: 140, pointerEvents: "none" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                data-spark
                className="absolute rounded-full"
                style={{
                  width: 4,
                  height: 4,
                  background: "hsl(42 80% 60%)",
                  left: 15 + ((i * 7) % 20),
                  top: 20 + ((i * 29) % 100),
                  opacity: 0.3,
                  boxShadow: "0 0 4px hsl(42 80% 60%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Cork */}
        <div
          ref={corkRef}
          className="absolute left-1/2"
          style={{
            top: 10,
            transform: "translateX(-50%)",
            width: 40,
            height: 24,
            zIndex: 15,
          }}
        >
          <svg viewBox="0 0 40 24" className="w-full h-full">
            <defs>
              <linearGradient id="cork-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(28 40% 55%)" />
                <stop offset="50%" stopColor="hsl(25 45% 48%)" />
                <stop offset="100%" stopColor="hsl(22 50% 38%)" />
              </linearGradient>
            </defs>
            <rect x="6" y="0" width="28" height="20" rx="3" fill="url(#cork-grad)" />
            {/* Cork top */}
            <ellipse cx="20" cy="2" rx="14" ry="3" fill="hsl(28 40% 60%)" />
            {/* Cork texture spots */}
            <circle cx="12" cy="8" r="1" fill="hsl(22 50% 30%)" opacity="0.4" />
            <circle cx="22" cy="12" r="0.8" fill="hsl(22 50% 30%)" opacity="0.3" />
            <circle cx="28" cy="6" r="0.6" fill="hsl(22 50% 30%)" opacity="0.3" />
            <circle cx="16" cy="14" r="0.7" fill="hsl(22 50% 30%)" opacity="0.3" />
          </svg>
        </div>

        {/* Scroll that unfurls */}
        <div
          ref={scrollRef}
          className="absolute left-1/2"
          style={{
            top: 60,
            transform: "translate(-50%, 0) scaleY(0) scaleX(0.3)",
            transformOrigin: "top center",
            width: 100,
            height: 180,
            opacity: 0,
            display: "none",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 100 180" className="w-full h-full">
            <defs>
              <linearGradient id="scroll-paper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(45 40% 95%)" />
                <stop offset="100%" stopColor="hsl(40 35% 90%)" />
              </linearGradient>
              <linearGradient id="scroll-rod" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(30 35% 55%)" />
                <stop offset="100%" stopColor="hsl(28 40% 45%)" />
              </linearGradient>
            </defs>
            {/* Top rod */}
            <rect x="10" y="0" width="80" height="8" rx="3" fill="url(#scroll-rod)" />
            <circle cx="8" cy="4" r="5" fill="url(#scroll-rod)" />
            <circle cx="92" cy="4" r="5" fill="url(#scroll-rod)" />
            {/* Paper body */}
            <rect x="14" y="8" width="72" height="164" fill="url(#scroll-paper)" />
            {/* Text lines */}
            <line x1="22" y1="30" x2="78" y2="30" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="45" x2="72" y2="45" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="60" x2="78" y2="60" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="75" x2="68" y2="75" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="90" x2="75" y2="90" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="105" x2="70" y2="105" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            <line x1="22" y1="120" x2="76" y2="120" stroke="hsl(30 15% 60%)" strokeWidth="0.8" opacity="0.3" />
            {/* Bottom rod */}
            <rect x="10" y="172" width="80" height="8" rx="3" fill="url(#scroll-rod)" />
            <circle cx="8" cy="176" r="5" fill="url(#scroll-rod)" />
            <circle cx="92" cy="176" r="5" fill="url(#scroll-rod)" />
          </svg>
        </div>
      </div>
    );
  }
);

SecretReveal.displayName = "SecretReveal";
export default SecretReveal;
