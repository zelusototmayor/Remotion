import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { DustParticles } from "../../../shared/components";
import type { ColorScheme } from "../types";

type IntroductionSceneProps = {
  preText?: string;
  appName: string;
  colors: ColorScheme;
};

/**
 * App introduction scene with epic reveal.
 * Shows "Introducing" followed by the app name with dramatic effects.
 */
export const IntroductionScene: React.FC<IntroductionSceneProps> = ({
  preText = "Introducing",
  appName,
  colors,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Introducing" appears first
  const preTextOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const preTextY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // App name - big and bold, with spring
  const mainTextScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const mainTextOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensifies
  const glowIntensity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Animated dust particles */}
      <DustParticles count={50} colors={colors} />

      {/* Radial glow behind text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 600,
          background: `radial-gradient(ellipse, ${colors.primary}50 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(80px)",
          opacity: glowIntensity * 0.8,
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {/* Pre-text (e.g., "Introducing") */}
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 400,
              color: colors.textMuted,
              opacity: preTextOpacity,
              transform: `translateY(${preTextY}px)`,
              marginBottom: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {preText}
          </div>

          {/* App name - BIG and prominent */}
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 90,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: mainTextOpacity,
              transform: `scale(${Math.max(mainTextScale, 0)})`,
              filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${colors.primary}90)`,
              lineHeight: 1.1,
            }}
          >
            {appName}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default IntroductionScene;
