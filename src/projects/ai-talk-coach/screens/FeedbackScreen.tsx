import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

/**
 * AI Talk Coach - Feedback Screen
 * Shows AI analysis results with animated metrics
 */
export const FeedbackScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated score reveal
  const scoreProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const overallScore = Math.round(interpolate(scoreProgress, [0, 1], [0, 87]));

  const metrics = [
    { label: "Pace", score: 92, color: "#4ADE80", icon: "⏱" },
    { label: "Clarity", score: 85, color: "#FFB347", icon: "💬" },
    { label: "Filler Words", score: 78, color: "#FF7F66", icon: "🎯" },
    { label: "Confidence", score: 90, color: "#A78BFA", icon: "💪" },
  ];

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
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 4 }}>
          Session Complete
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
          Your Feedback
        </div>
      </div>

      {/* Overall Score Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255,127,102,0.15) 0%, rgba(255,179,71,0.15) 100%)",
          borderRadius: 24,
          padding: 32,
          marginBottom: 32,
          border: "1px solid rgba(255,127,102,0.2)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 12 }}>
            Overall Performance
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              background: "linear-gradient(135deg, #FF7F66 0%, #FFD93D 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {overallScore}
          </div>
          <div style={{ fontSize: 16, color: "#4ADE80", marginTop: 8 }}>
            🔥 Great job! Above average
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {metrics.map((metric, i) => {
          const delay = i * 8;
          const metricProgress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 15, stiffness: 100 },
          });
          const animatedScore = Math.round(
            interpolate(Math.max(0, metricProgress), [0, 1], [0, metric.score])
          );

          return (
            <div
              key={metric.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 20,
                opacity: interpolate(metricProgress, [0, 0.5], [0, 1], {
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{metric.icon}</div>
              <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 4 }}>
                {metric.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: metric.color }}>
                {animatedScore}%
              </div>
              {/* Progress bar */}
              <div
                style={{
                  marginTop: 12,
                  height: 6,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${animatedScore}%`,
                    height: "100%",
                    background: metric.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div
        style={{
          background: "rgba(167,139,250,0.1)",
          borderRadius: 16,
          padding: 20,
          border: "1px solid rgba(167,139,250,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: "linear-gradient(135deg, #A78BFA 0%, #818CF8 100%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
            }}
          >
            🤖
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>
            AI Coach Tip
          </div>
        </div>
        <div style={{ fontSize: 15, color: "#d4c8e8", lineHeight: 1.5 }}>
          "Try pausing briefly after key points. This gives your audience time to absorb your message and makes you appear more confident."
        </div>
      </div>

      {/* Bottom button */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 40,
          right: 40,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FF7F66 0%, #FFB347 100%)",
            borderRadius: 16,
            padding: "18px 32px",
            textAlign: "center",
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
            boxShadow: "0 8px 32px rgba(255,127,102,0.3)",
          }}
        >
          Practice Again
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default FeedbackScreen;
