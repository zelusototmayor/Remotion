import React from "react";
import { useCurrentFrame } from "remotion";

type TypewriterTextProps = {
  text: string;
  startFrame?: number;
  fontSize: number;
  fontWeight?: number;
  color: string;
  charsPerFrame?: number;
  fontFamily?: string;
  showCursor?: boolean;
  cursorBlinkRate?: number;
  style?: React.CSSProperties;
};

/**
 * Typewriter text animation component.
 * Reveals text character by character with optional blinking cursor.
 *
 * @example
 * <TypewriterText
 *   text="Hello World"
 *   startFrame={0}
 *   fontSize={48}
 *   color="#ffffff"
 *   charsPerFrame={1.5}
 * />
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  fontSize,
  fontWeight = 400,
  color,
  charsPerFrame = 0.8,
  fontFamily = "Inter, system-ui, sans-serif",
  showCursor = true,
  cursorBlinkRate = 8,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const visibleText = text.slice(0, visibleChars);

  // Cursor blink logic
  const isTyping = visibleChars < text.length;
  const showBlinkingCursor =
    showCursor && isTyping && Math.floor(frame / cursorBlinkRate) % 2 === 0;

  return (
    <div
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      {visibleText}
      {showBlinkingCursor && <span style={{ opacity: 0.8 }}>|</span>}
    </div>
  );
};

export default TypewriterText;
