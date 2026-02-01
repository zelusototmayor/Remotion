import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import type { ColorScheme, CTAConfig } from "../types";

type CTASceneProps = {
  config: CTAConfig;
  colors: ColorScheme;
};

/**
 * Call-to-action scene with logo, app name, tagline, and download button.
 * Features pulsing logo with glow effects and animated entrance.
 */
export const CTAScene: React.FC<CTASceneProps> = ({ config, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  // Text entrance (delayed)
  const textEntrance = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });

  // Button entrance (more delayed)
  const buttonEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15 },
  });

  // Logo pulse and glow
  const logoPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.96, 1.04]);
  const logoGlow = interpolate(Math.sin(frame / 15), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${colors.primary}40 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(120px)",
          opacity: logoEntrance * logoGlow,
        }}
      />

      <div style={{ textAlign: "center" }}>
        {/* Logo */}
        <div
          style={{
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.3, 1]) * logoPulse})`,
            marginBottom: 45,
          }}
        >
          <Img
            src={staticFile(config.logo)}
            style={{
              width: 320,
              height: 320,
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${50 * logoGlow}px ${colors.primary}80)`,
            }}
          />
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110,
            fontWeight: 700,
            fontStyle: "italic",
            color: colors.text,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
            marginBottom: 22,
          }}
        >
          {config.appName}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 48,
            fontWeight: 500,
            color: colors.textMuted,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 60,
          }}
        >
          {config.tagline}
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1])}) translateY(${interpolate(buttonEntrance, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              padding: "36px 75px",
              borderRadius: 60,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 38,
              fontWeight: 700,
              color: colors.backgroundDark,
              boxShadow: `0 30px 80px ${colors.primary}50`,
            }}
          >
            {config.buttonText}
          </div>
        </div>

        {/* Availability text */}
        {config.availability && (
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 24,
              fontWeight: 400,
              color: colors.textMuted,
              opacity: buttonEntrance * 0.8,
              marginTop: 30,
            }}
          >
            {config.availability}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default CTAScene;
