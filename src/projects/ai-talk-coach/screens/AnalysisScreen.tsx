import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

/**
 * AI Talk Coach - Analysis Screen
 * Shows detailed speech analysis with timeline and highlights
 */
export const AnalysisScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Speech timeline segments
  const segments = [
    { start: 0, end: 15, type: "good", label: "Strong opening" },
    { start: 15, end: 25, type: "warning", label: '"um" detected' },
    { start: 25, end: 45, type: "good", label: "Clear explanation" },
    { start: 45, end: 55, type: "fast", label: "Speaking too fast" },
    { start: 55, end: 75, type: "good", label: "Good pacing" },
    { start: 75, end: 85, type: "pause", label: "Perfect pause" },
    { start: 85, end: 100, type: "good", label: "Strong close" },
  ];

  const getSegmentColor = (type: string) => {
    switch (type) {
      case "good": return "#4ADE80";
      case "warning": return "#FFB347";
      case "fast": return "#FF7F66";
      case "pause": return "#A78BFA";
      default: return "#666";
    }
  };

  // Animated playhead position
  const playheadPosition = interpolate(frame, [0, 90], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1025 0%, #0d0812 100%)",
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
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 4 }}>
          Deep Dive
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
          Speech Analysis
        </div>
      </div>

      {/* Waveform with timeline */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 16 }}>
          Your Recording (2:34)
        </div>

        {/* Fake waveform */}
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 16,
            position: "relative",
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => {
            const height = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 20;
            const segmentIndex = segments.findIndex(
              (s) => i >= s.start * 0.6 && i < s.end * 0.6
            );
            const color =
              segmentIndex >= 0
                ? getSegmentColor(segments[segmentIndex].type)
                : "#666";

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  background: color,
                  borderRadius: 2,
                  opacity: i < playheadPosition * 0.6 ? 1 : 0.3,
                }}
              />
            );
          })}

          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${playheadPosition}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#fff",
              boxShadow: "0 0 10px rgba(255,255,255,0.5)",
            }}
          />
        </div>

        {/* Time markers */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#666",
          }}
        >
          <span>0:00</span>
          <span>0:30</span>
          <span>1:00</span>
          <span>1:30</span>
          <span>2:00</span>
          <span>2:34</span>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { type: "good", label: "Good" },
          { type: "warning", label: "Filler words" },
          { type: "fast", label: "Too fast" },
          { type: "pause", label: "Good pause" },
        ].map((item) => (
          <div
            key={item.type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#b8a8c8",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: getSegmentColor(item.type),
              }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Insights list */}
      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
        Key Moments
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { time: "0:23", text: '"um" - Try replacing with a pause', type: "warning" },
          { time: "0:48", text: "Pace increased 40% - Slow down here", type: "fast" },
          { time: "1:12", text: "Perfect 2-second pause after key point", type: "pause" },
          { time: "2:15", text: "Confident closing statement", type: "good" },
        ].map((insight, i) => {
          const itemProgress = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 20, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 16,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                borderLeft: `3px solid ${getSegmentColor(insight.type)}`,
                opacity: Math.max(0, itemProgress),
                transform: `translateX(${interpolate(Math.max(0, itemProgress), [0, 1], [20, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: getSegmentColor(insight.type),
                  fontWeight: 600,
                  minWidth: 45,
                }}
              >
                {insight.time}
              </div>
              <div style={{ fontSize: 14, color: "#d4c8e8" }}>{insight.text}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default AnalysisScreen;
