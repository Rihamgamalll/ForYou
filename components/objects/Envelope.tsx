"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

export interface EnvelopeHandle {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

interface EnvelopeProps {
  sealColor?: string;
  paperColor?: string;
  flapOpen?: boolean;
  className?: string;
}

/**
 * Realistic paper envelope rendered with layered SVG + CSS.
 * The flap, body, and letter are separate elements that animate independently.
 * Designed to look like a real physical envelope with paper texture and shadows.
 */
const Envelope = forwardRef<EnvelopeHandle, EnvelopeProps>(
  ({ sealColor = "hsl(355 55% 42%)", className = "" }, ref) => {
    const flapRef = useRef<SVGGElement>(null);
    const letterRef = useRef<HTMLDivElement>(null);
    const sealRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      async open() {
        const flap = flapRef.current;
        const letter = letterRef.current;
        const seal = sealRef.current;
        if (!flap || !letter) return;

        // Break the seal
        if (seal) {
          seal.style.transition = "transform 0.3s ease, opacity 0.3s ease";
          seal.style.transform = "scale(0.8) rotate(-15deg)";
          seal.style.opacity = "0";
        }

        // Open the flap with a 3D rotation
        await new Promise((r) => setTimeout(r, 200));
        flap.style.transition =
          "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
        flap.style.transformOrigin = "top center";
        flap.style.transform = "perspective(600px) rotateX(180deg)";

        // Slide the letter out
        await new Promise((r) => setTimeout(r, 400));
        letter.style.transition =
          "transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease";
        letter.style.transform = "translateY(-60%) scale(1.05)";
        letter.style.opacity = "1";
      },
      async close() {
        const flap = flapRef.current;
        const letter = letterRef.current;
        const seal = sealRef.current;
        if (!flap || !letter) return;

        letter.style.transition = "transform 0.4s ease, opacity 0.3s ease";
        letter.style.transform = "translateY(0) scale(1)";
        letter.style.opacity = "0";

        await new Promise((r) => setTimeout(r, 200));
        flap.style.transition = "transform 0.5s ease";
        flap.style.transform = "perspective(600px) rotateX(0deg)";

        if (seal) {
          seal.style.transform = "scale(1) rotate(0deg)";
          seal.style.opacity = "1";
        }
      },
    }));

    return (
      <div className={`relative ${className}`} style={{ width: 320, height: 220 }}>
        {/* Envelope body — back layer */}
        <div
          className="absolute inset-0 paper-texture paper-grain rounded-lg shadow-envelope"
          style={{
            background: "linear-gradient(145deg, hsl(42 35% 93%), hsl(38 30% 88%))",
            overflow: "visible",
          }}
        >
          {/* Envelope back pocket — the V shape */}
          <svg
            viewBox="0 0 320 220"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            <defs>
              <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(42 38% 94%)" />
                <stop offset="100%" stopColor="hsl(38 32% 88%)" />
              </linearGradient>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(40 40% 92%)" />
                <stop offset="100%" stopColor="hsl(36 35% 85%)" />
              </linearGradient>
              <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38 30% 86%)" />
                <stop offset="100%" stopColor="hsl(36 28% 82%)" />
              </linearGradient>
              <filter id="env-shadow">
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="3"
                  floodColor="hsl(30 20% 20%)"
                  floodOpacity="0.15"
                />
              </filter>
              <filter id="paper-tex">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.04"
                  numOctaves="2"
                  seed="3"
                />
                <feColorMatrix values="0 0 0 0 0.82  0 0 0 0 0.75  0 0 0 0 0.68  0 0 0 0.15 0" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>

            {/* Envelope rectangle body */}
            <rect
              x="2"
              y="2"
              width="316"
              height="216"
              rx="8"
              fill="url(#env-body)"
              filter="url(#env-shadow)"
            />

            {/* Pocket — the V shape at the bottom front */}
            <path
              d="M 2 210 L 160 100 L 318 210 L 318 218 L 2 218 Z"
              fill="url(#env-pocket)"
              filter="url(#env-shadow)"
            />
            {/* Pocket V line — subtle crease */}
            <path
              d="M 8 210 L 160 106 L 312 210"
              fill="none"
              stroke="hsl(36 25% 78%)"
              strokeWidth="1"
              opacity="0.5"
            />

            {/* Left and right side triangles of the pocket */}
            <path
              d="M 2 2 L 160 100 L 2 210 Z"
              fill="url(#env-pocket)"
              opacity="0.7"
            />
            <path
              d="M 318 2 L 160 100 L 318 210 Z"
              fill="url(#env-pocket)"
              opacity="0.7"
            />

            {/* Subtle paper texture overlay */}
            <rect
              x="2"
              y="2"
              width="316"
              height="216"
              rx="8"
              fill="url(#env-body)"
              filter="url(#paper-tex)"
              opacity="0.3"
            />
          </svg>

          {/* The letter inside — hidden by default, slides up on open */}
          <div
            ref={letterRef}
            className="absolute left-1/2 z-10"
            style={{
              top: "50%",
              transform: "translate(-50%, 0)",
              width: "80%",
              height: "70%",
              opacity: 0,
            }}
          >
            <div
              className="w-full h-full rounded shadow-paper-lg paper-grain"
              style={{
                background:
                  "linear-gradient(160deg, hsl(45 40% 97%), hsl(42 35% 94%))",
              }}
            >
              <div className="p-4 h-full flex flex-col justify-center">
                <div
                  className="font-handwriting text-lg leading-snug"
                  style={{ color: "hsl(30 15% 25%)" }}
                >
                  For you...
                </div>
                <div className="mt-2 h-px w-3/4 bg-hsl(38 25% 80%)" style={{ background: "hsl(38 25% 80%)" }} />
                <div className="mt-2 h-px w-1/2" style={{ background: "hsl(38 25% 82%)" }} />
                <div className="mt-2 h-px w-2/3" style={{ background: "hsl(38 25% 82%)" }} />
              </div>
            </div>
          </div>

          {/* The flap — top triangular piece that opens */}
          <svg
            viewBox="0 0 320 220"
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 20, overflow: "visible" }}
          >
            <g ref={flapRef} style={{ transformStyle: "preserve-3d" }}>
              <path
                d="M 2 2 L 160 100 L 318 2 L 2 2 Z"
                fill="url(#env-flap)"
                filter="url(#env-shadow)"
              />
              {/* Flap crease line */}
              <path
                d="M 8 6 L 160 104 L 312 6"
                fill="none"
                stroke="hsl(36 30% 75%)"
                strokeWidth="0.8"
                opacity="0.4"
              />
              {/* Flap paper texture */}
              <path
                d="M 2 2 L 160 100 L 318 2 L 2 2 Z"
                fill="url(#env-flap)"
                filter="url(#paper-tex)"
                opacity="0.25"
              />
            </g>
          </svg>

          {/* Wax seal on the flap tip */}
          <div
            ref={sealRef}
            className="absolute left-1/2 z-30"
            style={{
              top: "calc(50% - 14px)",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                background: `radial-gradient(circle at 35% 35%, hsl(355 50% 52%), ${sealColor})`,
                boxShadow:
                  "0 2px 4px hsl(30 20% 20% / 0.3), inset -2px -2px 4px hsl(355 60% 30%), inset 2px 2px 3px hsl(355 45% 55%)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2C8 2 4 5 4 9C4 11.2 5.8 13 8 13C10.2 13 12 11.2 12 9C12 5 8 2 8 2Z"
                  fill="hsl(355 60% 28%)"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Envelope.displayName = "Envelope";
export default Envelope;
