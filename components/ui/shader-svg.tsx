"use client";

// Kiro mascot rendered as an animated mesh-gradient "bichito".
//
// The original shader clipped the gradient into a generic blob. Here the clip
// shape is Kiro's own body path (from the official mark), and Kiro's two eyes
// sit on top: they blink on a timer and gently track the pointer, so the whole
// thing reads as a small living creature.
//
// Note on colors: the values below are shader stops fed straight into a WebGL
// program (they cannot be CSS custom properties), which is why they live here
// as literals rather than in `app/globals.css`. Everything else in the app
// still references palette tokens.

import { MeshGradient } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Kiro mark geometry (viewBox 0 0 256 256).
const KIRO_BODY =
  "m195.9 107.8c-2.84-27.64-18.85-62.98-60.73-64.4h-3.09c-29.9 0-52.18 21.88-56.84 52.31-2.68 9.26-2.46 20.79-4.86 35.12-2.48 14.9-7.38 20.23-10.77 28.96-1.88 5.11-1.19 17.58 10.84 18.65 6.63 0.59 14.92-2.78 15.03-3.96-2.25 4.59-5.08 12.84-4.78 19.82 0.6 11.64 8.71 17.78 21.25 17.78 14.07 0 24.1-8.4 30.32-12.14 3.01 7.78 6.93 12.14 14.41 12.14 13.02 0 27.47-13.13 33.84-23.58 11.19-19.55 18.26-42.4 16.17-71.32-0.08-2.87-0.35-6.08-0.79-9.38z";
const KIRO_EYE_LEFT =
  "m135.1 90.55c-7.28-0.54-7.85 8.36-7.85 14.05 0 6.08 1.6 13.14 7.96 13.14 6.6 0 8.92-8.08 8.92-13.14 0-5.56-1.59-14.05-9.03-14.05z";
const KIRO_EYE_RIGHT =
  "m164.4 90.55c-7.27-0.54-8.66 7.59-8.66 14.05 0 5.82 1.51 13.14 8.07 13.14 7.38 0 8.83-9.57 8.83-13.14 0-5.89-2.01-14.05-8.24-14.05z";

type MeshGradientSVGProps = {
  /** Optional extra classes for the wrapper (sizing, etc.). */
  className?: string;
  /** Mesh animation speed. */
  speed?: number;
};

export function MeshGradientSVG({
  className = "relative mx-auto w-full max-w-sm",
  speed = 1,
}: MeshGradientSVGProps) {
  const colors = [
    "#FFB3D9", // Pastel pink
    "#87CEEB", // Sky blue
    "#4A90E2", // Medium blue
    "#2C3E50", // Dark blue-gray
    "#1A1A2E", // Very dark blue
  ];

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Scale pointer delta into the 256-unit viewBox and clamp so the eyes
      // never leave the face.
      const scale = 256 / rect.width || 1;
      const maxOffset = 9;
      const deltaX = (event.clientX - centerX) * 0.05 * scale;
      const deltaY = (event.clientY - centerY) * 0.05 * scale;

      setEyeOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY)),
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0], scaleY: [1, 1.05, 1] }}
      transition={{
        duration: 2.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: "top center" }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        className="h-auto w-full drop-shadow-lg"
        role="img"
        aria-label="Kiro"
      >
        <defs>
          <clipPath id="kiroBodyClip">
            <path d={KIRO_BODY} />
          </clipPath>
        </defs>

        <foreignObject width="256" height="256" clipPath="url(#kiroBodyClip)">
          <div className="h-full w-full">
            <MeshGradient
              colors={colors}
              className="h-full w-full"
              speed={speed}
            />
          </div>
        </foreignObject>

        {/* Kiro's eyes: blink on a timer, drift toward the pointer. */}
        <motion.g
          animate={{ x: eyeOffset.x, y: eyeOffset.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <path d={KIRO_EYE_LEFT} fill="currentColor" className="kiro-eye" />
          <path d={KIRO_EYE_RIGHT} fill="currentColor" className="kiro-eye" />
        </motion.g>
      </svg>

      <style jsx>{`
        .kiro-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: kiro-blink 3.6s infinite ease-in-out;
        }

        @keyframes kiro-blink {
          0%,
          92%,
          100% {
            transform: scaleY(1);
          }
          96% {
            transform: scaleY(0.1);
          }
        }
      `}</style>
    </motion.div>
  );
}
