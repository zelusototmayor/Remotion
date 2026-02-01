import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * AI Talk Coach - Record Screen
 * Shows the main recording interface with animated waveform
 */
export const RecordScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // Animated waveform bars
  const bars = [0.6, 0.9, 0.4, 0.8, 1.0, 0.7, 0.5, 0.85, 0.65, 0.95, 0.55, 0.75];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1025 0%, #2d1f3d 50%, #1a1025 100%)",
        padding: 40,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#fff",
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        <span>9:41</span>
        <div style={{ display: "flex", gap: 6 }}>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ fontSize: 28, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
          Practice Session
        </div>
        <div style={{ fontSize: 16, color: "#b8a8c8" }}>
          Speak naturally, I'm listening...
        </div>
      </div>

      {/* Central waveform visualization */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          height: 200,
          marginBottom: 60,
        }}
      >
        {bars.map((baseHeight, i) => {
          const animatedHeight =
            baseHeight * (0.5 + 0.5 * Math.sin((frame + i * 8) / 10));
          return (
            <div
              key={i}
              style={{
                width: 12,
                height: `${animatedHeight * 150}px`,
                background: `linear-gradient(180deg, #FF7F66 0%, #FFB347 50%, #FFD93D 100%)`,
                borderRadius: 6,
                transition: "height 0.1s",
              }}
            />
          );
        })}
      </div>

      {/* Timer */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div style={{ fontSize: 64, fontWeight: 300, color: "#fff", letterSpacing: 4 }}>
          {Math.floor(frame / 30)}:{String(Math.floor((frame % 30) * 2)).padStart(2, "0")}
        </div>
        <div style={{ fontSize: 16, color: "#FF7F66", marginTop: 8 }}>
          Recording...
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* Pause button */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 6, height: 24, background: "#fff", borderRadius: 2 }} />
            <div style={{ width: 6, height: 24, background: "#fff", borderRadius: 2 }} />
          </div>
        </div>

        {/* Stop button */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            background: "linear-gradient(135deg, #FF7F66 0%, #FFB347 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 8px 32px rgba(255,127,102,0.4)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "#fff",
              borderRadius: 4,
            }}
          />
        </div>

        {/* Restart button */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 24,
          }}
        >
          ↻
        </div>
      </div>

      {/* Bottom tip */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 14,
          color: "#b8a8c8",
        }}
      >
        💡 Tip: Speak as if presenting to a real audience
      </div>
    </AbsoluteFill>
  );
};

export default RecordScreen;
