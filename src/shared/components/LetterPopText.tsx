import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type LetterPopTextProps = {
  text: string;
  startFrame?: number;
  fontSize: number;
  fontWeight?: number;
  color: string;
  delayPerLetter?: number;
  fontFamily?: string;
  springConfig?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
  style?: React.CSSProperties;
};

/**
 * Letter-by-letter pop animation component.
 * Each letter springs in with scale and vertical movement.
 *
 * @example
 * <LetterPopText
 *   text="Amazing"
 *   startFrame={30}
 *   fontSize={72}
 *   color="#14b8a6"
 *   delayPerLetter={2}
 * />
 */
export const LetterPopText: React.FC<LetterPopTextProps> = ({
  text,
  startFrame = 0,
  fontSize,
  fontWeight = 700,
  color,
  delayPerLetter = 2,
  fontFamily = "Inter, system-ui, sans-serif",
  springConfig = { damping: 12, stiffness: 200 },
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {letters.map((letter, i) => {
        const letterStart = startFrame + i * delayPerLetter;
        const progress = spring({
          frame: frame - letterStart,
          fps,
          config: springConfig,
        });

        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontSize,
              fontWeight,
              color,
              display: "inline-block",
              opacity: Math.max(0, progress),
              transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])}) translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
              whiteSpace: letter === " " ? "pre" : "normal",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

export default LetterPopText;
