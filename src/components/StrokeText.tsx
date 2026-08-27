"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface StrokeTextProps {
  text: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  reverse?: boolean;
}

export default function StrokeText({
  text,
  strokeColor = "#FACC15", // Amarillo brillante (Yellow 400)
  fillColor = "#FEF08A",   // Amarillo muy claro / casi blanco brillante
  strokeWidth = 1.6,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = "power2.out",
  fontSize = 80,
  fontWeight = 800,
  letterSpacing = -2,
  reverse = false,
}: StrokeTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const strokePathRef = useRef<SVGTextElement>(null);
  const fillPathRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const strokeEl = strokePathRef.current;
    const fillEl = fillPathRef.current;

    if (!strokeEl || !fillEl) return;

    const tl = gsap.timeline({ defaults: { ease } });

    if (!reverse) {
      tl.fromTo(
        strokeEl,
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: drawDuration, stagger }
      )
      .fromTo(
        fillEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        `-=${drawDuration * fillDelay}`
      );
    }
  }, [drawDuration, fillDelay, ease, reverse, stagger]);

  return (
    <div className="w-full flex justify-center items-center overflow-visible my-2">
      <svg
        className="overflow-visible w-full max-w-2xl h-auto"
        viewBox="0 0 500 110"
        style={{ maxHeight: "140px" }}
      >
        <defs>
          <style>{`
            .stroke-text__stroke {
              fill: none;
              stroke: ${strokeColor};
              stroke-width: ${strokeWidth};
              filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.6));
            }
            .stroke-text__fill {
              fill: ${fillColor};
              opacity: 0;
              filter: drop-shadow(0 0 12px rgba(254, 240, 138, 0.5));
            }
            @keyframes softPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            .pulse-effect {
              animation: softPulse 2s infinite ease-in-out;
            }
          `}</style>
        </defs>

        {/* Texto de Contorno (Stroke) */}
        <text
          ref={strokePathRef}
          x="50%"
          y="80"
          textAnchor="middle"
          className="stroke-text__stroke uppercase"
          style={{ fontSize, fontWeight, letterSpacing }}
        >
          {text}
        </text>

        {/* Texto de Relleno (Fill) con parpadeo cada 2s y brillo fuerte */}
        <text
          ref={fillPathRef}
          x="50%"
          y="80"
          textAnchor="middle"
          className="stroke-text__fill uppercase pulse-effect"
          style={{ fontSize, fontWeight, letterSpacing }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}