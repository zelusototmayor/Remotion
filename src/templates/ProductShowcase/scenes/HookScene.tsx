import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { TypewriterText, LetterPopText } from "../../../shared/components";
import type { ColorScheme, HookConfig } from "../types";

type HookSceneProps = {
  config: HookConfig;
  colors: ColorScheme;
};

/**
 * Opening hook scene that grabs attention.
 * Displays text lines with various animation styles culminating in a highlighted word.
 */
export const HookScene: React.FC<HookSceneProps> = ({ config, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from black
  const fadeFromBlack = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Calculate timing for lines
  let currentFrame = 5;
  const lineTiming: number[] = [];

  config.lines.forEach((line) => {
    lineTiming.push(currentFrame);
    // Estimate frames needed based on text length
    currentFrame += Math.ceil(line.text.length / 1.2) + 15;
  });

  // Highlight word timing - appears after all lines
  const highlightStartFrame = currentFrame + 10;

  // Highlight word animation
  const highlightOpacity = interpolate(
    frame,
    [highlightStartFrame, highlightStartFrame + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const highlightScale = spring({
    frame: frame - highlightStartFrame,
    fps,
    config: { damping: 8, stiffness: 100 },
  });

  const highlightGlow = interpolate(
    frame,
    [highlightStartFrame + 10, highlightStartFrame + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle zoom effect
  const sceneScale = interpolate(frame, [0, 150], [1, 1.02], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        opacity: fadeFromBlack,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${sceneScale})` }}>
        {/* Render each line */}
        {config.lines.map((line, index) => {
          const lineStyle = line.style || "normal";
          const fontSize =
            lineStyle === "muted" ? 56 : lineStyle === "bold" ? 60 : 50;
          const fontWeight =
            lineStyle === "muted" ? 300 : lineStyle === "bold" ? 600 : 400;
          const textColor =
            lineStyle === "muted" ? colors.textMuted : colors.text;

          return (
            <TypewriterText
              key={index}
              text={line.text}
              startFrame={lineTiming[index]}
              fontSize={fontSize}
              fontWeight={fontWeight}
              color={textColor}
              charsPerFrame={lineStyle === "muted" ? 1.2 : 1.5}
              style={{
                marginBottom: 18,
                letterSpacing: lineStyle === "muted" ? 1 : 0,
                lineHeight: 1.3,
              }}
            />
          );
        })}

        {/* Highlight word - big and bold */}
        {config.highlightStyle === "letterPop" ? (
          <div
            style={{
              opacity: highlightOpacity,
              marginTop: 10,
            }}
          >
            <LetterPopText
              text={config.highlightWord}
              startFrame={highlightStartFrame + 3}
              fontSize={72}
              fontWeight={700}
              color={colors.primary}
              delayPerLetter={1}
              style={{
                fontStyle: "italic",
                filter: `drop-shadow(0 0 ${25 * highlightGlow}px ${colors.primary}70)`,
                lineHeight: 1.2,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 85,
              fontWeight: 800,
              color: colors.text,
              opacity: highlightOpacity,
              transform: `scale(${Math.max(highlightScale, 0)})`,
              marginTop: 10,
              letterSpacing: -1,
              textShadow: `0 0 ${30 * highlightGlow}px ${colors.primary}60`,
            }}
          >
            {config.highlightWord}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default HookScene;
