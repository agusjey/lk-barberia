"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";

interface SpecularButtonProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  onClick?: () => void;
}

export default function SpecularButton({
  children,
  size = "md",
  radius = 18,
  tint = "#ffffff",
  tintOpacity = 0,
  blur = 0,
  textColor = "#f5f5f5",
  lineColor = "#ffffff",
  baseColor = "#171717",
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  onClick,
}: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );

      if (distance < proximity) {
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };

    if (followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (followMouse) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [followMouse, proximity]);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        borderRadius: `${radius}px`,
        backgroundColor: baseColor,
        color: textColor,
        boxShadow: `0 0 ${blur}px ${tint}${Math.round(tintOpacity * 255).toString(16).padStart(2, "0")}`,
        position: "relative",
        overflow: "hidden",
      }}
      className={`relative w-full overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] ${sizeClasses[size]}`}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: `${radius}px`,
          padding: `${thickness}px`,
          background: "transparent",
        }}
      >
        <div 
          className="w-full h-full"
          style={{
            borderRadius: `${Math.max(0, radius - thickness)}px`,
            backgroundColor: baseColor,
          }}
        />
      </div>

      {(followMouse || autoAnimate) && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            top: mousePosition.y - shineSize / 2,
            left: mousePosition.x - shineSize / 2,
            width: `${shineSize}px`,
            height: `${shineSize}px`,
            background: `radial-gradient(circle, ${lineColor} 0%, transparent ${shineFade}%)`,
            opacity: isHovering ? intensity : 0,
            filter: "blur(4px)",
            zIndex: 1,
          }}
        />
      )}

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </button>
  );
}