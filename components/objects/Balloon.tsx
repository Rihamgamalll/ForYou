"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

export interface BalloonHandle {
  pop: () => Promise<void>;
  reset: () => Promise<void>;
}

interface BalloonProps {
  className?: string;
  color?: string;
}

/**
 * Realistic balloon with highlights, knot, and string.
 * On pop: the balloon bursts into fragments, the message is revealed.
 */
const Balloon = forwardRef<BalloonHandle, BalloonProps>(
  ({ className = "", color = "hsl(355 60% 55%)" }, ref) => {
    const balloonRef = useRef<HTMLDivElement>(null);
    const fragmentsRef = useRef<HTMLDivElement>(null);
    const stringRef = useRef<SVGPathElement>(null);

    useImperativeHandle(ref, () => ({
      async pop() {
        const balloon = balloonRef.current;
        const fragments = fragmentsRef.current;
        if (!balloon) return;

        // Shake slightly before pop
        balloon.style.transition = "transform 0.15s ease";
        balloon.style.transform = "scale(1.05)";
        await new Promise((r) => setTimeout(r, 100));
        balloon.style.transform = "scale(0.98)";
        await new Promise((r) => setTimeout(r, 80));

        // Pop! — hide balloon, show fragments
        balloon.style.transition = "opacity 0.1s ease, transform 0.1s ease";
        balloon.style.opacity = "0";
        balloon.style.transform = "scale(0.3)";

        if (fragments) {
          fragments.style.display = "block";
          const frags = fragments.querySelectorAll("[data-frag]");
          frags.forEach((frag, i) => {
            const el = frag as HTMLElement;
            const angle = (i / frags.length) * Math.PI * 2;
            const dist = 80 + Math.random() * 60;
            el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease";
            el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 50}px) rotate(${Math.random() * 360}deg) scale(0.5)`;
            el.style.opacity = "0";
          });
        }
      },
      async reset() {
        const balloon = balloonRef.current;
        const fragments = fragmentsRef.current;
        if (balloon) {
          balloon.style.opacity = "1";
          balloon.style.transform = "scale(1)";
        }
        if (fragments) {
          fragments.style.display = "none";
          const frags = fragments.querySelectorAll("[data-frag]");
          frags.forEach((frag) => {
            const el = frag as HTMLElement;
            el.style.transform = "translate(0, 0) rotate(0deg) scale(1)";
            el.style.opacity = "1";
            el.style.transition = "none";
          });
        }
      },
    }));

    const colorLight = "hsl(355 55% 65%)";
    const colorDark = "hsl(355 65% 40%)";

    return (
      <div className={`relative ${className}`} style={{ width: 180, height: 280 }}>
        {/* Balloon string */}
        <svg
          className="absolute left-1/2"
          style={{ top: 130, transform: "translateX(-50%)", pointerEvents: "none" }}
          width="40"
          height="150"
          viewBox="0 0 40 150"
        >
          <path
            ref={stringRef}
            d="M 20 0 Q 15 30 20 60 Q 25 90 18 120 Q 16 135 20 150"
            fill="none"
            stroke="hsl(30 10% 40%)"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>

        {/* Balloon body */}
        <div
          ref={balloonRef}
          className="absolute left-1/2"
          style={{
            top: 0,
            transform: "translateX(-50%)",
            width: 140,
            height: 170,
          }}
        >
          <svg viewBox="0 0 140 170" className="w-full h-full">
            <defs>
              <radialGradient id="balloon-grad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor={colorLight} />
                <stop offset="60%" stopColor={color} />
                <stop offset="100%" stopColor={colorDark} />
              </radialGradient>
              <radialGradient id="balloon-shine" cx="30%" cy="25%" r="20%">
                <stop offset="0%" stopColor="hsl(0 0% 100%)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(0 0% 100%)" stopOpacity="0" />
              </radialGradient>
              <filter id="balloon-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="hsl(355 60% 30%)" floodOpacity="0.2" />
              </filter>
            </defs>
            {/* Balloon shape — teardrop */}
            <path
              d="M 70 0 C 108 0 135 30 135 70 C 135 105 110 130 78 140 L 74 155 L 66 155 L 62 140 C 30 130 5 105 5 70 C 5 30 32 0 70 0 Z"
              fill="url(#balloon-grad)"
              filter="url(#balloon-shadow)"
            />
            {/* Shine highlight */}
            <ellipse cx="48" cy="35" rx="18" ry="28" fill="url(#balloon-shine)" />
            {/* Knot at the bottom */}
            <path
              d="M 62 155 L 66 155 L 64 162 L 62 160 Z M 66 155 L 74 155 L 72 162 L 70 160 Z"
              fill={colorDark}
            />
          </svg>
        </div>

        {/* Pop fragments — hidden by default */}
        <div
          ref={fragmentsRef}
          className="absolute left-1/2"
          style={{
            top: 60,
            transform: "translateX(-50%)",
            display: "none",
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              data-frag
              className="absolute"
              style={{
                width: 14 + (i % 4) * 2,
                height: 15 + ((i * 3) % 4) * 2,
                background: i % 2 === 0 ? color : colorLight,
                clipPath:
                  i % 3 === 0
                    ? "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
                    : i % 3 === 1
                    ? "polygon(0 0, 100% 0, 80% 100%, 20% 100%)"
                    : "polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)",
                left: 0,
                top: 0,
              }}
            />
          ))}
          {/* Confetti pieces */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div
              key={`c-${i}`}
              data-frag
              className="absolute"
              style={{
                width: 6,
                height: 10,
                background: [
                  "hsl(42 60% 55%)",
                  "hsl(175 35% 45%)",
                  "hsl(355 55% 55%)",
                  "hsl(140 30% 50%)",
                  "hsl(30 70% 55%)",
                ][i % 5],
                left: 0,
                top: 0,
              }}
            />
          ))}
        </div>
      </div>
    );
  }
);

Balloon.displayName = "Balloon";
export default Balloon;
