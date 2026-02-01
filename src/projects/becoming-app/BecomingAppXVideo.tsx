import React from "react";
import {
  AbsoluteFill,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  spring,
  Img,
  staticFile,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  AnimatedBackground,
  DustParticles,
  TypewriterText,
} from "../../shared/components";

// Brand colors for Becoming App
const colors = {
  background: "#0c1426",
  backgroundDark: "#050a12",
  primary: "#14b8a6",      // Teal
  secondary: "#f59e0b",    // Amber
  tertiary: "#10b981",     // Emerald
  text: "#fafafa",
  textMuted: "#a1a1aa",
};

// ============ HOOK SCENE - Split Screen Concept ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Left side - The Problem
  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  // Right side - The Solution (delayed)
  const rightSlide = spring({
    frame: frame - 30,
    fps,
    config: { damping: 15, stiffness: 60 },
  });

  // Center reveal
  const centerReveal = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 50 },
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Left Side - Current State */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          transform: `translateX(${interpolate(Math.max(0, leftSlide), [0, 1], [-100, 0])}px)`,
          opacity: Math.max(0, leftSlide),
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            color: colors.textMuted,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          You are here
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
          }}
        >
          Stuck in the
          <br />
          <span style={{ color: colors.secondary }}>same patterns</span>
        </div>
      </div>

      {/* Right Side - Future State */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          padding: 80,
          transform: `translateX(${interpolate(Math.max(0, rightSlide), [0, 1], [100, 0])}px)`,
          opacity: Math.max(0, rightSlide),
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            color: colors.textMuted,
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: 4,
            textAlign: "right",
          }}
        >
          You want to be
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.1,
            textAlign: "right",
          }}
        >
          Living your
          <br />
          <span style={{ color: colors.primary }}>best version</span>
        </div>
      </div>

      {/* Center Divider with Question */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${Math.max(0, centerReveal)})`,
          opacity: Math.max(0, centerReveal),
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 4,
            height: 300,
            background: `linear-gradient(180deg, ${colors.primary}00 0%, ${colors.primary} 50%, ${colors.primary}00 100%)`,
            margin: "0 auto 30px",
          }}
        />
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: colors.primary,
            padding: "16px 32px",
            background: `${colors.primary}15`,
            borderRadius: 50,
            border: `2px solid ${colors.primary}40`,
          }}
        >
          What's the bridge?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ INTRO SCENE - Dramatic Reveal ============
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const nameReveal = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const taglineReveal = spring({
    frame: frame - 35,
    fps,
    config: { damping: 20, stiffness: 120 },
  });

  const glowPulse = interpolate(Math.sin(frame / 15), [-1, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <DustParticles count={50} colors={colors} />

      {/* Glow Effect */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 600,
          background: `radial-gradient(ellipse, ${colors.primary}40 0%, ${colors.secondary}20 50%, transparent 70%)`,
          filter: "blur(100px)",
          opacity: glowPulse * Math.max(0, logoScale),
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 60,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${Math.max(0, logoScale)})`,
            opacity: Math.max(0, logoScale),
          }}
        >
          <Img
            src={staticFile("assets/becoming-app/logo-no-bg.png")}
            style={{
              width: 200,
              height: 200,
              filter: `drop-shadow(0 0 ${40 * glowPulse}px ${colors.primary}80)`,
            }}
          />
        </div>

        {/* Text */}
        <div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 96,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: `translateX(${interpolate(Math.max(0, nameReveal), [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, nameReveal),
            }}
          >
            Becoming
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 400,
              color: colors.textMuted,
              marginTop: 8,
              transform: `translateX(${interpolate(Math.max(0, taglineReveal), [0, 1], [20, 0])}px)`,
              opacity: Math.max(0, taglineReveal),
            }}
          >
            Motivation Made For You
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ FEATURE SCENE - Three Pillars ============
const PillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillars = [
    {
      icon: "🎯",
      title: "Direction",
      description: "Define your goals & ideal identity",
      color: colors.secondary,
    },
    {
      icon: "💬",
      title: "Signals",
      description: "Daily reminders crafted by AI",
      color: colors.primary,
    },
    {
      icon: "🪞",
      title: "Reflect",
      description: "Track your transformation",
      color: colors.tertiary,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <TypewriterText
          text="Three Pillars of Transformation"
          startFrame={0}
          fontSize={56}
          fontWeight={700}
          color={colors.text}
          charsPerFrame={2}
        />
      </div>

      {/* Pillars Grid */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 60,
        }}
      >
        {pillars.map((pillar, i) => {
          const pillarSpring = spring({
            frame: frame - 20 - i * 12,
            fps,
            config: { damping: 12, stiffness: 80 },
          });

          const hoverEffect = interpolate(
            Math.sin((frame + i * 20) / 20),
            [-1, 1],
            [-5, 5]
          );

          return (
            <div
              key={pillar.title}
              style={{
                width: 320,
                padding: 40,
                background: `linear-gradient(180deg, ${pillar.color}15 0%, ${colors.backgroundDark}80 100%)`,
                borderRadius: 24,
                border: `2px solid ${pillar.color}40`,
                textAlign: "center",
                transform: `scale(${Math.max(0, pillarSpring)}) translateY(${hoverEffect}px)`,
                opacity: Math.max(0, pillarSpring),
                boxShadow: `0 20px 60px ${pillar.color}20`,
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 20 }}>{pillar.icon}</div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: pillar.color,
                  marginBottom: 12,
                }}
              >
                {pillar.title}
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 20,
                  color: colors.textMuted,
                  lineHeight: 1.4,
                }}
              >
                {pillar.description}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============ FEATURE SHOWCASE - Phone + Description ============
interface FeatureShowcaseProps {
  title: string;
  subtitle: string;
  description: string;
  screenshot: string;
  accentColor: string;
  phonePosition: "left" | "right";
}

const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  title,
  subtitle,
  description,
  screenshot,
  accentColor,
  phonePosition,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 70 },
  });

  const textEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const isLeft = phonePosition === "left";

  return (
    <AbsoluteFill
      style={{
        flexDirection: isLeft ? "row" : "row-reverse",
        alignItems: "center",
        padding: "60px 100px",
        gap: 80,
      }}
    >
      {/* Phone Mockup */}
      <div
        style={{
          transform: `translateX(${interpolate(Math.max(0, phoneEntrance), [0, 1], [isLeft ? -100 : 100, 0])}px) scale(${Math.max(0, phoneEntrance)})`,
          opacity: Math.max(0, phoneEntrance),
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 280,
            height: 560,
            borderRadius: 40,
            overflow: "hidden",
            boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 4px #0a0a0a, 0 0 60px ${accentColor}30`,
            background: "#000",
          }}
        >
          <Img
            src={staticFile(screenshot)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 26,
              background: "#000",
              borderRadius: 15,
            }}
          />
        </div>
      </div>

      {/* Text Content */}
      <div
        style={{
          flex: 1,
          transform: `translateX(${interpolate(Math.max(0, textEntrance), [0, 1], [isLeft ? 50 : -50, 0])}px)`,
          opacity: Math.max(0, textEntrance),
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 20,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 12,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 24,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 24,
            color: colors.textMuted,
            lineHeight: 1.6,
            maxWidth: 500,
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ NOTIFICATION DEMO ============
const NotificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 70 },
  });

  const notificationSlide = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      {/* Left Side - Lock Screen */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 100,
        }}
      >
        {/* Phone with Lock Screen */}
        <div
          style={{
            transform: `scale(${Math.max(0, phoneEntrance)})`,
            opacity: Math.max(0, phoneEntrance),
            position: "relative",
          }}
        >
          <div
            style={{
              width: 320,
              height: 650,
              borderRadius: 45,
              overflow: "hidden",
              boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 3px #1a1a1a, 0 0 0 6px #0a0a0a`,
              background: "#000",
            }}
          >
            <Img
              src={staticFile("assets/becoming-app/10-lock-screen.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Notification Overlay */}
          <div
            style={{
              position: "absolute",
              top: 120,
              left: 15,
              right: 15,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 20,
              padding: 16,
              transform: `translateY(${interpolate(Math.max(0, notificationSlide), [0, 1], [-20, 0])}px)`,
              opacity: Math.max(0, notificationSlide),
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Img
                src={staticFile("assets/becoming-app/logo-with-bg.png")}
                style={{ width: 40, height: 40, borderRadius: 10 }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#000",
                  }}
                >
                  The Becoming
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 13,
                    color: "#666",
                    marginTop: 2,
                  }}
                >
                  Every choice today is a step toward your self-reliant life.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Explanation */}
        <div style={{ maxWidth: 500 }}>
          <TypewriterText
            text="Daily Signals"
            startFrame={20}
            fontSize={56}
            fontWeight={700}
            color={colors.primary}
            charsPerFrame={2}
            style={{ marginBottom: 20 }}
          />
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 24,
              color: colors.textMuted,
              lineHeight: 1.6,
              opacity: interpolate(frame, [40, 60], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            Receive personalized motivational messages crafted by AI based on
            your unique goals and identity. Each notification is a gentle nudge
            toward your best self.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ CTA SCENE ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const textEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const buttonEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 70 },
  });

  const glowPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.7, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 600,
          background: `radial-gradient(ellipse, ${colors.primary}30 0%, ${colors.secondary}15 50%, transparent 70%)`,
          filter: "blur(80px)",
          opacity: glowPulse * Math.max(0, logoEntrance),
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 80,
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${Math.max(0, logoEntrance)}) rotate(${interpolate(Math.max(0, logoEntrance), [0, 1], [-10, 0])}deg)`,
            opacity: Math.max(0, logoEntrance),
          }}
        >
          <Img
            src={staticFile("assets/becoming-app/logo-no-bg.png")}
            style={{
              width: 280,
              height: 280,
              filter: `drop-shadow(0 0 ${60 * glowPulse}px ${colors.primary}60)`,
            }}
          />
        </div>

        {/* CTA Content */}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              color: colors.textMuted,
              marginBottom: 12,
              transform: `translateY(${interpolate(Math.max(0, textEntrance), [0, 1], [20, 0])}px)`,
              opacity: Math.max(0, textEntrance),
            }}
          >
            Start Your Transformation
          </div>

          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 80,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 40,
              transform: `translateY(${interpolate(Math.max(0, textEntrance), [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, textEntrance),
            }}
          >
            Becoming
          </div>

          {/* App Store Button */}
          <div
            style={{
              transform: `scale(${interpolate(Math.max(0, buttonEntrance), [0, 1], [0.8, 1])}) translateY(${interpolate(Math.max(0, buttonEntrance), [0, 1], [20, 0])}px)`,
              opacity: Math.max(0, buttonEntrance),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                background: "#fff",
                padding: "20px 40px",
                borderRadius: 16,
                boxShadow: `0 20px 60px ${colors.primary}30`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{ width: 36, height: 36, fill: "#000" }}
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  Download on the
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#000",
                  }}
                >
                  App Store
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const BecomingAppXVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations (in frames at 30fps)
  const hookDuration = 5 * fps;          // 5 seconds
  const introDuration = 3 * fps;         // 3 seconds
  const pillarsDuration = 4 * fps;       // 4 seconds
  const featureDuration = 3 * fps;       // 3 seconds each
  const notificationDuration = 4 * fps;  // 4 seconds
  const ctaDuration = 4 * fps;           // 4 seconds

  const transitionDuration = Math.round(fps * 0.5); // 0.5 second transitions

  const features = [
    {
      title: "Define Your Identity",
      subtitle: "Step 1",
      description:
        "Tell us your goals and aspirations. Our AI crafts a personalized identity statement that guides your transformation journey.",
      screenshot: "assets/becoming-app/04-north-star.png",
      accentColor: colors.secondary,
      position: "left" as const,
    },
    {
      title: "Track Your Journey",
      subtitle: "Step 2",
      description:
        "See your progress at a glance. Every day brings you closer to the person you're becoming.",
      screenshot: "assets/becoming-app/09-home-screen.png",
      accentColor: colors.tertiary,
      position: "right" as const,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      {/* Persistent animated background */}
      <AnimatedBackground colors={colors} />

      {/* Scenes with transitions */}
      <TransitionSeries>
        {/* Hook */}
        <TransitionSeries.Sequence durationInFrames={hookDuration}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Introduction */}
        <TransitionSeries.Sequence durationInFrames={introDuration}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Three Pillars */}
        <TransitionSeries.Sequence durationInFrames={pillarsDuration}>
          <PillarsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Feature Showcases */}
        {features.map((feature, i) => (
          <React.Fragment key={feature.title}>
            <TransitionSeries.Sequence durationInFrames={featureDuration}>
              <FeatureShowcase
                title={feature.title}
                subtitle={feature.subtitle}
                description={feature.description}
                screenshot={feature.screenshot}
                accentColor={feature.accentColor}
                phonePosition={feature.position}
              />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={slide({ direction: i % 2 === 0 ? "from-left" : "from-right" })}
              timing={linearTiming({ durationInFrames: transitionDuration })}
            />
          </React.Fragment>
        ))}

        {/* Notification Demo */}
        <TransitionSeries.Sequence durationInFrames={notificationDuration}>
          <NotificationScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* CTA */}
        <TransitionSeries.Sequence durationInFrames={ctaDuration}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default BecomingAppXVideo;

// Calculate total duration for composition registration
// Total = sum of scenes - overlapping transitions
export const BECOMING_APP_X_DURATION =
  5 * 30 +  // hook
  3 * 30 +  // intro
  4 * 30 +  // pillars
  2 * 3 * 30 + // 2 features
  4 * 30 +  // notification
  4 * 30 -  // cta
  6 * Math.round(30 * 0.5); // subtract 6 transition overlaps
