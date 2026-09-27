"use client";

import { forwardRef, useRef, useImperativeHandle } from "react";

export interface GiftBoxHandle {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

interface GiftBoxProps {
  className?: string;
  ribbonColor?: string;
}

/**
 * Realistic gift box with depth, edges, ribbon, and lid that opens.
 * The box body, lid, ribbon, and bow are separate elements that animate independently.
 */
const GiftBox = forwardRef<GiftBoxHandle, GiftBoxProps>(
  ({ className = "", ribbonColor = "hsl(175 35% 45%)" }, ref) => {
    const lidRef = useRef<HTMLDivElement>(null);
    const bowRef = useRef<HTMLDivElement>(null);
    const lidShadowRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      async open() {
        const lid = lidRef.current;
        const bow = bowRef.current;
        const lidShadow = lidShadowRef.current;
        if (!lid) return;

        if (bow) {
          bow.style.transition = "transform 0.8s ease, opacity 0.5s ease";
          bow.style.transform = "translateY(-30px) scale(0.9) rotate(8deg)";
          bow.style.opacity = "0";
        }

        await new Promise((r) => setTimeout(r, 200));
        lid.style.transition = "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
        lid.style.transform = "translateY(-50px) rotate(-3deg)";
        if (lidShadow) {
          lidShadow.style.transition = "opacity 0.5s ease";
          lidShadow.style.opacity = "0";
        }
      },
      async close() {
        const lid = lidRef.current;
        const bow = bowRef.current;
        const lidShadow = lidShadowRef.current;
        if (!lid) return;

        lid.style.transition = "transform 0.5s ease";
        lid.style.transform = "translateY(0) rotate(0deg)";
        if (lidShadow) {
          lidShadow.style.opacity = "1";
        }

        await new Promise((r) => setTimeout(r, 200));
        if (bow) {
          bow.style.transform = "translateY(0) scale(1) rotate(0deg)";
          bow.style.opacity = "1";
        }
      },
    }));

    const ribbonLight = "hsl(175 30% 60%)";
    const ribbonDark = "hsl(175 40% 35%)";

    return (
      <div className={`relative ${className}`} style={{ width: 200, height: 200 }}>
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="box-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(42 40% 93%)" />
              <stop offset="50%" stopColor="hsl(38 35% 88%)" />
              <stop offset="100%" stopColor="hsl(36 30% 82%)" />
            </linearGradient>
            <linearGradient id="box-lid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(42 42% 95%)" />
              <stop offset="100%" stopColor="hsl(36 35% 86%)" />
            </linearGradient>
            <linearGradient id="box-side-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(36 30% 80%)" />
              <stop offset="100%" stopColor="hsl(38 35% 88%)" />
            </linearGradient>
            <linearGradient id="box-side-r" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(38 35% 88%)" />
              <stop offset="100%" stopColor="hsl(36 28% 78%)" />
            </linearGradient>
            <linearGradient id="ribbon-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ribbonLight} />
              <stop offset="50%" stopColor={ribbonColor} />
              <stop offset="100%" stopColor={ribbonDark} />
            </linearGradient>
            <filter id="box-shadow">
              <feDropShadow
                dx="0" dy="6" stdDeviation="8"
                floodColor="hsl(30 20% 20%)" floodOpacity="0.18"
              />
            </filter>
          </defs>
        </svg>

        {/* Box body — bottom part with 3D perspective */}
        <div
          className="absolute left-1/2 bottom-0"
          style={{
            transform: "translateX(-50%)",
            width: 160,
            height: 110,
            filter: "url(#box-shadow)",
          }}
        >
          <svg viewBox="0 0 160 110" className="w-full h-full">
            {/* Right side panel (darker) */}
            <path d="M 130 10 L 150 0 L 150 90 L 130 100 Z" fill="url(#box-side-r)" />
            {/* Left side panel (darker) */}
            <path d="M 30 10 L 10 0 L 10 90 L 30 100 Z" fill="url(#box-side-l)" />
            {/* Front face */}
            <rect x="30" y="10" width="100" height="90" fill="url(#box-body)" />
            {/* Front face subtle texture lines */}
            <line x1="30" y1="30" x2="130" y2="30" stroke="hsl(36 25% 80%)" strokeWidth="0.5" opacity="0.3" />
            <line x1="30" y1="60" x2="130" y2="60" stroke="hsl(36 25% 80%)" strokeWidth="0.5" opacity="0.3" />
            <line x1="30" y1="80" x2="130" y2="80" stroke="hsl(36 25% 80%)" strokeWidth="0.5" opacity="0.3" />

            {/* Vertical ribbon on front */}
            <rect x="74" y="10" width="12" height="90" fill="url(#ribbon-grad)" />
            {/* Ribbon highlight */}
            <rect x="76" y="10" width="3" height="90" fill={ribbonLight} opacity="0.5" />
            {/* Ribbon shadow on the side panels */}
            <rect x="10" y="0" width="3" height="90" fill={ribbonDark} opacity="0.3" transform="translate(64 0)" />
          </svg>
        </div>

        {/* Lid shadow on the box body */}
        <div
          ref={lidShadowRef}
          className="absolute left-1/2"
          style={{
            top: 70,
            transform: "translateX(-50%)",
            width: 170,
            height: 12,
            background: "hsl(30 20% 20% / 0.12)",
            borderRadius: "50%",
            filter: "blur(4px)",
          }}
        />

        {/* Box lid — top part that lifts off */}
        <div
          ref={lidRef}
          className="absolute left-1/2"
          style={{
            top: 50,
            transform: "translateX(-50%)",
            width: 180,
            height: 40,
            zIndex: 10,
            transition: "transform 0.5s ease",
          }}
        >
          <svg viewBox="0 0 180 40" className="w-full h-full">
            {/* Lid right side */}
            <path d="M 145 8 L 170 0 L 170 14 L 145 22 Z" fill="url(#box-side-r)" />
            {/* Lid left side */}
            <path d="M 35 8 L 10 0 L 10 14 L 35 22 Z" fill="url(#box-side-l)" />
            {/* Lid top face */}
            <rect x="35" y="0" width="110" height="22" rx="2" fill="url(#box-lid)" />
            {/* Lid front lip */}
            <rect x="35" y="22" width="110" height="14" fill="url(#box-body)" />
            {/* Lid edge highlight */}
            <line x1="35" y1="22" x2="145" y2="22" stroke="hsl(36 25% 75%)" strokeWidth="0.5" opacity="0.5" />

            {/* Horizontal ribbon on lid */}
            <rect x="35" y="0" width="110" height="14" fill="url(#ribbon-grad)" />
            {/* Ribbon highlight */}
            <rect x="35" y="2" width="110" height="3" fill={ribbonLight} opacity="0.4" />
            {/* Ribbon fold over edge */}
            <rect x="35" y="22" width="110" height="6" fill={ribbonColor} opacity="0.7" />

            {/* Vertical ribbon on lid */}
            <rect x="80" y="0" width="14" height="36" fill="url(#ribbon-grad)" />
            <rect x="82" y="0" width="3" height="36" fill={ribbonLight} opacity="0.4" />
          </svg>

          {/* Bow on top of the lid */}
          <div
            ref={bowRef}
            className="absolute left-1/2"
            style={{
              top: -18,
              transform: "translateX(-50%)",
              transition: "transform 0.4s ease, opacity 0.3s ease",
            }}
          >
            <svg width="60" height="36" viewBox="0 0 60 36">
              {/* Left loop */}
              <path
                d="M 28 18 C 10 2, 2 8, 6 18 C 2 28, 10 34, 28 18 Z"
                fill="url(#ribbon-grad)"
                stroke={ribbonDark}
                strokeWidth="0.5"
              />
              {/* Right loop */}
              <path
                d="M 32 18 C 50 2, 58 8, 54 18 C 58 28, 50 34, 32 18 Z"
                fill="url(#ribbon-grad)"
                stroke={ribbonDark}
                strokeWidth="0.5"
              />
              {/* Left loop inner shadow */}
              <path
                d="M 26 18 C 16 10, 12 12, 14 18 C 12 24, 16 26, 26 18 Z"
                fill={ribbonDark}
                opacity="0.2"
              />
              {/* Right loop inner shadow */}
              <path
                d="M 34 18 C 44 10, 48 12, 46 18 C 48 24, 44 26, 34 18 Z"
                fill={ribbonDark}
                opacity="0.2"
              />
              {/* Center knot */}
              <rect x="26" y="14" width="8" height="10" rx="2" fill={ribbonColor} />
              <rect x="27" y="15" width="2" height="8" fill={ribbonLight} opacity="0.5" />
              {/* Ribbon tails */}
              <path d="M 27 24 L 22 34 L 25 32 L 27 28 Z" fill="url(#ribbon-grad)" opacity="0.8" />
              <path d="M 33 24 L 38 34 L 35 32 L 33 28 Z" fill="url(#ribbon-grad)" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
);

GiftBox.displayName = "GiftBox";
export default GiftBox;
