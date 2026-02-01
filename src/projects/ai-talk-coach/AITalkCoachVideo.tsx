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

import {
  AnimatedBackground,
  DustParticles,
  TypewriterText,
  LetterPopText,
} from "../../shared/components";
import {
  RecordScreen,
  FeedbackScreen,
  AnalysisScreen,
  ProgressScreen,
} from "./screens";

// Brand colors
const colors = {
  background: "#1a1025",
  backgroundDark: "#0d0812",
  primary: "#FF7F66",
  secondary: "#FFB347",
  tertiary: "#FFD93D",
  text: "#ffffff",
  textMuted: "#b8a8c8",
};

// ============ HOOK SCENE ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Staggered text reveals
  const line1Start = 10;
  const line2Start = 35;
  const line3Start = 60;
  const highlightStart = 100;

  // Highlight animation
  const highlightProgress = spring({
    frame: frame - highlightStart,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn,
      }}
    >
      <div style={{ textAlign: "center", padding: 50 }}>
        <TypewriterText
          text="Heart racing."
          startFrame={line1Start}
          fontSize={52}
          fontWeight={300}
          color={colors.textMuted}
          charsPerFrame={1.5}
          style={{ marginBottom: 16 }}
        />
        <TypewriterText
          text="Palms sweating."
          startFrame={line2Start}
          fontSize={52}
          fontWeight={300}
          color={colors.textMuted}
          charsPerFrame={1.5}
          style={{ marginBottom: 16 }}
        />
        <TypewriterText
          text="Your big moment is coming..."
          startFrame={line3Start}
          fontSize={48}
          fontWeight={400}
          color={colors.text}
          charsPerFrame={1.2}
          style={{ marginBottom: 40, lineHeight: 1.4 }}
        />

        {/* Highlight */}
        <div
          style={{
            opacity: interpolate(highlightProgress, [0, 0.3], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `scale(${Math.max(0, highlightProgress)})`,
          }}
        >
          <LetterPopText
            text="What if you were ready?"
            startFrame={highlightStart + 5}
            fontSize={56}
            fontWeight={700}
            color={colors.primary}
            delayPerLetter={1.5}
            style={{
              filter: `drop-shadow(0 0 30px ${colors.primary}60)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ INTRODUCTION SCENE ============
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const preTextOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const preTextY = interpolate(frame, [0, 15], [20, 0], {
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const nameScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const glowIntensity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <DustParticles count={40} colors={colors} />

      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${colors.primary}50 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(80px)",
          opacity: glowIntensity * 0.7,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* "Meet" */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 36,
            fontWeight: 400,
            color: colors.textMuted,
            opacity: preTextOpacity,
            transform: `translateY(${preTextY}px)`,
            marginBottom: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Meet
        </div>

        {/* Logo */}
        <div
          style={{
            opacity: Math.max(0, logoScale),
            transform: `scale(${Math.max(0, logoScale)})`,
            marginBottom: 24,
          }}
        >
          <Img
            src={staticFile("assets/ai-talk-coach/logo.png")}
            style={{
              width: 180,
              height: 180,
              filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${colors.primary}80)`,
            }}
          />
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.tertiary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: Math.max(0, nameScale),
            transform: `scale(${Math.max(0, nameScale)})`,
            filter: `drop-shadow(0 0 ${30 * glowIntensity}px ${colors.primary}60)`,
          }}
        >
          AI Talk Coach
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ FEATURE SLIDE ============
const FeatureSlide: React.FC<{
  title: string;
  subtitle: string;
  titleColor: string;
  ScreenComponent: React.FC;
}> = ({ title, subtitle, titleColor, ScreenComponent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <TypewriterText
          text={title}
          startFrame={0}
          fontSize={64}
          fontWeight={700}
          color={titleColor}
          charsPerFrame={2.5}
          style={{
            marginBottom: 12,
            textShadow: `0 4px 30px ${titleColor}40`,
          }}
        />
        <TypewriterText
          text={subtitle}
          startFrame={Math.ceil(title.length / 2.5) + 5}
          fontSize={28}
          fontWeight={400}
          color={colors.textMuted}
          charsPerFrame={1.5}
        />
      </div>

      {/* Phone mockup with screen content */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: `translate(-50%, -50%) scale(${1.4 * Math.max(0, phoneEntrance)})`,
          opacity: Math.max(0, phoneEntrance),
        }}
      >
        <div
          style={{
            width: 375,
            height: 812,
            borderRadius: 55,
            overflow: "hidden",
            boxShadow:
              "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
            background: "#000",
          }}
        >
          <ScreenComponent />
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 130,
              height: 35,
              background: "#000",
              borderRadius: 20,
            }}
          />
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
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });

  const buttonEntrance = spring({
    frame: frame - 25,
    fps,
    config: { damping: 15 },
  });

  const logoPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.96, 1.04]);
  const logoGlow = interpolate(Math.sin(frame / 15), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${colors.primary}40 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(100px)",
          opacity: logoEntrance * logoGlow,
        }}
      />

      <div style={{ textAlign: "center", zIndex: 1 }}>
        {/* Logo */}
        <div
          style={{
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.3, 1]) * logoPulse})`,
            marginBottom: 32,
          }}
        >
          <Img
            src={staticFile("assets/ai-talk-coach/logo.png")}
            style={{
              width: 240,
              height: 240,
              filter: `drop-shadow(0 0 ${50 * logoGlow}px ${colors.primary}80)`,
            }}
          />
        </div>

        {/* App name */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 80,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.tertiary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 16,
          }}
        >
          AI Talk Coach
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 42,
            fontWeight: 500,
            color: colors.textMuted,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [15, 0])}px)`,
            marginBottom: 50,
          }}
        >
          Find Your Voice
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1])}) translateY(${interpolate(buttonEntrance, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.tertiary} 100%)`,
              padding: "28px 60px",
              borderRadius: 50,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#fff",
              boxShadow: `0 20px 60px ${colors.primary}50`,
            }}
          >
            Download Free
          </div>
        </div>

        {/* Availability */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 20,
            color: colors.textMuted,
            opacity: buttonEntrance * 0.8,
            marginTop: 24,
          }}
        >
          Available on the App Store
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const AITalkCoachVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations (in frames)
  const hookDuration = 6 * fps;      // 6 seconds
  const introDuration = 3 * fps;     // 3 seconds
  const featureDuration = 3 * fps;   // 3 seconds each
  const ctaDuration = 4 * fps;       // 4 seconds

  const transitionDuration = Math.round(fps * 0.4); // 0.4 second transitions

  const features = [
    {
      title: "Practice Anywhere",
      subtitle: "Your personal speaking coach, in your pocket",
      titleColor: colors.primary,
      Screen: RecordScreen,
    },
    {
      title: "Speak. Get Feedback.",
      subtitle: "AI analyzes your pace, clarity, and filler words",
      titleColor: colors.secondary,
      Screen: FeedbackScreen,
    },
    {
      title: "Real-Time Insights",
      subtitle: "See exactly where you can improve",
      titleColor: colors.tertiary,
      Screen: AnalysisScreen,
    },
    {
      title: "Track Your Growth",
      subtitle: "Watch your confidence build over time",
      titleColor: colors.primary,
      Screen: ProgressScreen,
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

        {/* Feature slides */}
        {features.map((feature, i) => (
          <React.Fragment key={feature.title}>
            <TransitionSeries.Sequence durationInFrames={featureDuration}>
              <FeatureSlide
                title={feature.title}
                subtitle={feature.subtitle}
                titleColor={feature.titleColor}
                ScreenComponent={feature.Screen}
              />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: transitionDuration })}
            />
          </React.Fragment>
        ))}

        {/* CTA */}
        <TransitionSeries.Sequence durationInFrames={ctaDuration}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export default AITalkCoachVideo;

// Calculate total duration for composition registration
export const AI_TALK_COACH_DURATION =
  6 * 30 +  // hook
  3 * 30 +  // intro
  4 * 3 * 30 + // features
  4 * 30 -  // cta
  6 * Math.round(30 * 0.4); // subtract transition overlaps
