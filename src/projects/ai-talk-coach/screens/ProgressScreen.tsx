import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

/**
 * AI Talk Coach - Progress Screen
 * Shows user's improvement over time with animated charts
 */
export const ProgressScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress data points (simulated improvement over 4 weeks)
  const weeklyScores = [62, 71, 79, 87];
  const maxScore = 100;

  // Current streak
  const streakDays = 12;

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
          Your Journey
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
          Progress
        </div>
      </div>

      {/* Streak card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255,127,102,0.2) 0%, rgba(255,217,61,0.2) 100%)",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid rgba(255,127,102,0.3)",
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "#b8a8c8", marginBottom: 4 }}>
            Current Streak
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 800,
                background: "linear-gradient(135deg, #FF7F66 0%, #FFD93D 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {streakDays}
            </span>
            <span style={{ fontSize: 18, color: "#fff" }}>days</span>
          </div>
        </div>
        <div style={{ fontSize: 56 }}>🔥</div>
      </div>

      {/* Weekly progress chart */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
          Weekly Improvement
        </div>

        {/* Chart */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            height: 180,
            gap: 16,
          }}
        >
          {weeklyScores.map((score, i) => {
            const barDelay = i * 8;
            const barProgress = spring({
              frame: frame - barDelay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });

            const barHeight = interpolate(
              Math.max(0, barProgress),
              [0, 1],
              [0, (score / maxScore) * 160]
            );

            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                {/* Score label */}
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 8,
                    opacity: Math.max(0, barProgress),
                  }}
                >
                  {Math.round(interpolate(Math.max(0, barProgress), [0, 1], [0, score]))}
                </div>

                {/* Bar */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 50,
                    height: barHeight,
                    background: `linear-gradient(180deg, #FF7F66 0%, #FFB347 50%, #FFD93D 100%)`,
                    borderRadius: 8,
                    boxShadow: "0 4px 20px rgba(255,127,102,0.3)",
                  }}
                />

                {/* Week label */}
                <div
                  style={{
                    fontSize: 13,
                    color: "#b8a8c8",
                    marginTop: 12,
                  }}
                >
                  Week {i + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Improvement badge */}
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "rgba(74,222,128,0.15)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 20 }}>📈</span>
          <span style={{ fontSize: 15, color: "#4ADE80", fontWeight: 600 }}>
            +25% improvement in 4 weeks!
          </span>
        </div>
      </div>

      {/* Skills breakdown */}
      <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 16 }}>
        Skill Levels
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { skill: "Pace Control", level: 4, maxLevel: 5, color: "#4ADE80" },
          { skill: "Clarity", level: 3, maxLevel: 5, color: "#FFB347" },
          { skill: "Confidence", level: 4, maxLevel: 5, color: "#A78BFA" },
          { skill: "Filler Reduction", level: 3, maxLevel: 5, color: "#FF7F66" },
        ].map((item, i) => {
          const skillProgress = spring({
            frame: frame - 20 - i * 5,
            fps,
            config: { damping: 20, stiffness: 100 },
          });

          return (
            <div
              key={item.skill}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 12,
                opacity: Math.max(0, skillProgress),
              }}
            >
              <div style={{ fontSize: 15, color: "#fff" }}>{item.skill}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {Array.from({ length: item.maxLevel }).map((_, j) => (
                  <div
                    key={j}
                    style={{
                      width: 24,
                      height: 8,
                      borderRadius: 4,
                      background:
                        j < Math.round(item.level * Math.max(0, skillProgress))
                          ? item.color
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default ProgressScreen;
