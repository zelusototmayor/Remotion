import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import type { ColorScheme } from "../../templates/ProductShowcase/types";

type AnimatedBackgroundProps = {
  colors: ColorScheme;
  blobSpeed?: number;
  blobIntensity?: number;
};

/**
 * Animated gradient background with floating blobs.
 * Creates a subtle, dynamic atmosphere for the video.
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  colors,
  blobSpeed = 1,
  blobIntensity = 1,
}) => {
  const frame = useCurrentFrame();
  const blob1Y = Math.sin(frame / (60 / blobSpeed)) * 30 * blobIntensity;
  const blob2Y = Math.cos(frame / (45 / blobSpeed)) * 25 * blobIntensity;

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
        }}
      />
      {/* Primary color blob */}
      <div
        style={{
          position: "absolute",
          left: "5%",
          top: `${15 + blob1Y * 0.1}%`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Secondary color blob */}
      <div
        style={{
          position: "absolute",
          right: "0%",
          top: `${45 + blob2Y * 0.1}%`,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
    </AbsoluteFill>
  );
};

type DustParticlesProps = {
  count?: number;
  colors: ColorScheme | { primary: string; secondary: string };
};

/**
 * Floating dust particles for ambient effect.
 * Creates a subtle particle field using seeded random positions.
 */
export const DustParticles: React.FC<DustParticlesProps> = ({
  count = 40,
  colors,
}) => {
  const frame = useCurrentFrame();
  const particles = [];

  for (let i = 0; i < count; i++) {
    // Use random with seed for consistent positions
    const startX = random(`dust-x-${i}`) * 100;
    const startY = random(`dust-y-${i}`) * 100;
    const size = 2 + random(`dust-size-${i}`) * 6;
    const speed = 0.3 + random(`dust-speed-${i}`) * 0.7;
    const delay = random(`dust-delay-${i}`) * 100;
    const color = random(`dust-color-${i}`) > 0.5 ? colors.primary : colors.secondary;

    // Floating motion
    const floatX = Math.sin((frame + delay) / (40 * speed)) * 30;
    const floatY = Math.cos((frame + delay) / (30 * speed)) * 20;
    const opacity = 0.3 + Math.sin((frame + delay) / 25) * 0.2;

    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${startX}%`,
          top: `${startY}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity,
          transform: `translate(${floatX}px, ${floatY}px)`,
          filter: `blur(${size > 5 ? 1 : 0}px)`,
          boxShadow: `0 0 ${size * 2}px ${color}80`,
        }}
      />
    );
  }

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

export default AnimatedBackground;
