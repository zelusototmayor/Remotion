import React from "react";
import {
  AbsoluteFill,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  spring,
  staticFile,
  Sequence,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

// Voice-over segments timing (synced to scenes)
const VOICEOVER_SEGMENTS = [
  { id: "hook", startFrame: 0, file: "voiceover-hook.mp3" },
  { id: "intro", startFrame: 135, file: "voiceover-intro.mp3" },
  { id: "how-it-works", startFrame: 255, file: "voiceover-how-it-works.mp3" },
  { id: "demo", startFrame: 405, file: "voiceover-demo.mp3" },
  { id: "features", startFrame: 555, file: "voiceover-features.mp3" },
  { id: "cta", startFrame: 675, file: "voiceover-cta.mp3" },
];

// Wrapper component to handle missing audio files gracefully
const VoiceoverAudio: React.FC<{ file: string }> = ({ file }) => {
  try {
    return <Audio src={staticFile(file)} volume={1} />;
  } catch {
    return null;
  }
};

// Signal Harvester brand colors - Emerald/Green focused
const colors = {
  background: "#ffffff",
  backgroundDark: "#0f172a",
  surface: "rgba(255,255,255,0.95)",

  // Primary brand
  emerald: "#10b981",
  emeraldDark: "#059669",
  emeraldLight: "#d1fae5",
  lime: "#84cc16",
  teal: "#022c22",

  // Neutrals
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",

  // Accents
  red: "#ef4444",
  orange: "#ff8c42",
  blue: "#3b82f6",

  // Text
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textMuted: "#94a3b8",
};

// ============ SVG ICONS ============
const Icons = {
  Comment: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Bot: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  Search: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Target: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Zap: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Users: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Send: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  CheckCircle: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  TrendingUp: ({ size = 24, color = colors.emerald }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Instagram: ({ size = 24, color = "#E4405F" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  TikTok: ({ size = 24, color = "#000" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
};

// ============ ANIMATED BACKGROUND ============
const AnimatedBackground: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: dark
          ? `linear-gradient(135deg, ${colors.backgroundDark} 0%, ${colors.teal} 100%)`
          : colors.background,
        overflow: "hidden",
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: dark
            ? `linear-gradient(${colors.emeraldDark}20 1px, transparent 1px), linear-gradient(90deg, ${colors.emeraldDark}20 1px, transparent 1px)`
            : `linear-gradient(${colors.emeraldLight}80 1px, transparent 1px), linear-gradient(90deg, ${colors.emeraldLight}80 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: `translateY(${(frame / 2) % 60}px)`,
          opacity: 0.5,
        }}
      />

      {/* Floating blobs */}
      {[
        { x: "15%", y: "20%", size: 500, color: colors.emerald, delay: 0 },
        { x: "75%", y: "25%", size: 400, color: colors.lime, delay: 20 },
        { x: "60%", y: "70%", size: 450, color: colors.emeraldDark, delay: 40 },
      ].map((blob, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: blob.x,
            top: blob.y,
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            background: blob.color,
            filter: "blur(120px)",
            opacity: dark ? 0.3 : 0.15,
            transform: `translate(-50%, -50%) translate(${Math.sin((frame + blob.delay) / 50) * 40}px, ${Math.cos((frame + blob.delay) / 40) * 30}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ============ HOOK SCENE - The Problem ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Comment bubbles floating in - Instagram only with varied sizes
  const comments = [
    { text: "Anyone know a good tool for this?", x: 100, y: 120, delay: 10, platform: "instagram", scale: 1.1 },
    { text: "Ugh this app keeps crashing 😤", x: 850, y: 180, delay: 20, platform: "instagram", scale: 0.85 },
    { text: "Looking for recommendations!", x: 500, y: 280, delay: 35, platform: "instagram", scale: 1.0 },
    { text: "Is there anything better than X?", x: 150, y: 380, delay: 45, platform: "instagram", scale: 0.9 },
    { text: "Help! Need advice ASAP", x: 750, y: 420, delay: 55, platform: "instagram", scale: 1.15 },
    { text: "Can someone suggest alternatives?", x: 400, y: 520, delay: 65, platform: "instagram", scale: 0.95 },
    { text: "Best protein powder brands? 💪", x: 1100, y: 320, delay: 75, platform: "instagram", scale: 1.05 },
    { text: "Any recommendations for beginners?", x: 1250, y: 150, delay: 30, platform: "instagram", scale: 0.88 },
    { text: "Which one actually works??", x: 1050, y: 480, delay: 80, platform: "instagram", scale: 1.0 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AnimatedBackground />

      {/* Floating comment bubbles */}
      {comments.map((comment, i) => {
        const commentSpring = spring({
          frame: frame - comment.delay,
          fps,
          config: { damping: 12, stiffness: 60 },
        });

        const float = interpolate(
          Math.sin((frame + comment.delay * 2) / 20),
          [-1, 1],
          [-8, 8]
        );

        const commentScale = (comment as { scale?: number }).scale || 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: comment.x,
              top: comment.y,
              transform: `scale(${Math.max(0, commentSpring) * commentScale}) translateY(${float}px)`,
              opacity: Math.max(0, commentSpring) * 0.7,
              background: colors.surface,
              borderRadius: 20,
              padding: "12px 20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              border: `1px solid ${colors.slate200}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Icons.Instagram size={18} />
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                color: colors.textPrimary,
              }}
            >
              {comment.text}
            </span>
          </div>
        );
      })}

      {/* Central text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 32,
            padding: "50px 80px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            transform: `scale(${interpolate(frame, [60, 90], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              color: colors.textSecondary,
              marginBottom: 16,
            }}
          >
            Thousands of high-intent prospects
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 56,
              fontWeight: 700,
              color: colors.textPrimary,
            }}
          >
            And{" "}
            <span style={{ color: colors.red }}>nobody's</span>
            {" "}answering them
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ INTRO SCENE - Brand Reveal ============
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const textReveal = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 90 } });
  const taglineReveal = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 100 } });

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Img
          src={staticFile("assets/signal-harvester/logo.png")}
          style={{
            width: 140,
            height: 140,
            borderRadius: 36,
            boxShadow: `0 30px 60px ${colors.emerald}40`,
            marginBottom: 40,
            transform: `scale(${Math.max(0, logoScale)}) rotate(${interpolate(Math.max(0, logoScale), [0, 1], [-20, 0])}deg)`,
            opacity: Math.max(0, logoScale),
          }}
        />

        {/* Name */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -3,
            transform: `translateY(${interpolate(Math.max(0, textReveal), [0, 1], [40, 0])}px)`,
            opacity: Math.max(0, textReveal),
          }}
        >
          <span style={{ color: colors.textPrimary }}>Signal</span>
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.lime} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Harvester
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            color: colors.textSecondary,
            marginTop: 20,
            transform: `translateY(${interpolate(Math.max(0, taglineReveal), [0, 1], [30, 0])}px)`,
            opacity: Math.max(0, taglineReveal),
          }}
        >
          Turn social comments into customers
        </div>

        {/* Platform badges */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 50,
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 24px",
              background: colors.surface,
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <Icons.Instagram size={24} />
            <span style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 600, color: colors.textPrimary }}>
              Instagram
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ HOW IT WORKS SCENE ============
const HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  const steps = [
    {
      num: 1,
      icon: Icons.Target,
      title: "Pick Your Niche",
      description: "Add influencers or hashtags to monitor in your industry",
    },
    {
      num: 2,
      icon: Icons.Bot,
      title: "AI Scans Comments",
      description: "Our AI finds high-intent prospects asking for help",
    },
    {
      num: 3,
      icon: Icons.Send,
      title: "Review & Reply",
      description: "Approve AI-generated replies or send them automatically",
    },
  ];

  // Animate which step is highlighted
  const activeStep = Math.min(3, Math.floor(frame / 40) + 1);

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 80px",
        }}
      >
        {/* Title */}
        <div
          style={{
            marginBottom: 60,
            textAlign: "center",
            transform: `translateY(${interpolate(Math.max(0, titleSpring), [0, 1], [30, 0])}px)`,
            opacity: Math.max(0, titleSpring),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: colors.emerald,
              textTransform: "uppercase",
              letterSpacing: 3,
              marginBottom: 16,
            }}
          >
            How It Works
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -1,
            }}
          >
            Three simple steps to more customers
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {steps.map((step, i) => {
            const stepSpring = spring({
              frame: frame - 10 - i * 15,
              fps,
              config: { damping: 12, stiffness: 70 },
            });

            const isActive = step.num <= activeStep;
            const isCurrent = step.num === activeStep;

            return (
              <div
                key={step.num}
                style={{ display: "flex", alignItems: "center" }}
              >
                {/* Step Card */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 400,
                    padding: 40,
                    background: isCurrent ? colors.surface : "transparent",
                    borderRadius: 32,
                    boxShadow: isCurrent ? "0 20px 50px rgba(0,0,0,0.08)" : "none",
                    transform: `scale(${Math.max(0, stepSpring)}) translateY(${isCurrent ? -10 : 0}px)`,
                    opacity: Math.max(0, stepSpring),
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: isActive
                        ? `linear-gradient(135deg, ${colors.emerald}, ${colors.emeraldDark})`
                        : colors.slate200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 700,
                      color: isActive ? "#fff" : colors.textMuted,
                      marginBottom: 24,
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 28,
                      background: isActive ? colors.emeraldLight : colors.slate100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 24,
                    }}
                  >
                    <step.icon size={48} color={isActive ? colors.emeraldDark : colors.textMuted} />
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 26,
                      fontWeight: 600,
                      color: isActive ? colors.textPrimary : colors.textMuted,
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    {step.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 18,
                      color: colors.textSecondary,
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </div>
                </div>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      background: step.num < activeStep
                        ? `linear-gradient(90deg, ${colors.emerald}, ${colors.lime})`
                        : colors.slate200,
                      borderRadius: 2,
                      margin: "0 -16px",
                      marginBottom: 120,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ DEMO SCENE - Show the tool in action ============
const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });

  // Comment detection animation
  const commentHighlight = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aiReplyAppear = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <AnimatedBackground dark />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          padding: "40px 80px",
        }}
      >
        {/* Left: Description */}
        <div
          style={{
            flex: 1,
            maxWidth: 500,
            transform: `translateX(${interpolate(Math.max(0, panelEntrance), [0, 1], [-50, 0])}px)`,
            opacity: Math.max(0, panelEntrance),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 24,
              fontWeight: 600,
              color: colors.emerald,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            AI-Powered Detection
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 56,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: -1,
              lineHeight: 1.2,
              marginBottom: 28,
            }}
          >
            Find buyers hiding in comments
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
            }}
          >
            Our AI analyzes sentiment and intent to find people who are ready to buy—then generates the perfect reply.
          </div>
        </div>

        {/* Right: Demo Panel */}
        <div
          style={{
            width: 550,
            background: colors.surface,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
            transform: `scale(${Math.max(0, panelEntrance)})`,
            opacity: Math.max(0, panelEntrance),
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 24px",
              background: colors.slate100,
              borderBottom: `1px solid ${colors.slate200}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icons.Bot size={20} color={colors.emerald} />
              <span style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                Lead Inbox
              </span>
            </div>
            <div
              style={{
                padding: "4px 12px",
                background: colors.emeraldLight,
                borderRadius: 20,
                fontFamily: "Inter",
                fontSize: 13,
                fontWeight: 600,
                color: colors.emeraldDark,
              }}
            >
              3 new leads
            </div>
          </div>

          {/* Comment Card */}
          <div style={{ padding: 20 }}>
            {/* Detected Comment */}
            <div
              style={{
                background: "#fff",
                border: `2px solid ${commentHighlight > 0.5 ? colors.emerald : colors.slate200}`,
                borderRadius: 20,
                padding: 20,
                marginBottom: 16,
                boxShadow: commentHighlight > 0.5 ? `0 0 20px ${colors.emerald}30` : "none",
              }}
            >
              {/* User info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, #667eea, #764ba2)`,
                  }}
                />
                <div>
                  <div style={{ fontFamily: "Inter", fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
                    @sarah_fitness
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 13, color: colors.textMuted }}>
                    2 minutes ago
                  </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <Icons.Instagram size={20} />
                </div>
              </div>

              {/* Comment text */}
              <div style={{ fontFamily: "Inter", fontSize: 16, color: colors.textPrimary, lineHeight: 1.5, marginBottom: 12 }}>
                "Does anyone know a good{" "}
                <span
                  style={{
                    background: commentHighlight > 0.5 ? `${colors.emerald}30` : "transparent",
                    padding: "2px 4px",
                    borderRadius: 4,
                  }}
                >
                  protein powder that actually tastes good
                </span>
                ? The one I've been using is awful 😩"
              </div>

              {/* Intent badge */}
              {commentHighlight > 0.5 && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: colors.emeraldLight,
                    borderRadius: 12,
                    opacity: commentHighlight,
                  }}
                >
                  <Icons.Zap size={14} color={colors.emeraldDark} />
                  <span style={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: colors.emeraldDark }}>
                    High Intent Detected • 94% match
                  </span>
                </div>
              )}
            </div>

            {/* AI Suggested Reply */}
            {aiReplyAppear > 0 && (
              <div
                style={{
                  background: colors.emeraldLight,
                  borderRadius: 20,
                  padding: 20,
                  opacity: aiReplyAppear,
                  transform: `translateY(${interpolate(aiReplyAppear, [0, 1], [20, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Icons.Bot size={18} color={colors.emeraldDark} />
                  <span style={{ fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: colors.emeraldDark }}>
                    AI-Generated Reply
                  </span>
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 15, color: colors.textPrimary, lineHeight: 1.5, marginBottom: 16 }}>
                  "I totally get it! I switched to [Your Product] last month and it's been a game-changer. Tastes like a milkshake honestly! Happy to share more if you're interested 🙌"
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      padding: "10px 20px",
                      background: colors.emerald,
                      borderRadius: 12,
                      fontFamily: "Inter",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    Send Reply
                  </div>
                  <div
                    style={{
                      padding: "10px 20px",
                      background: "#fff",
                      borderRadius: 12,
                      fontFamily: "Inter",
                      fontSize: 14,
                      fontWeight: 600,
                      color: colors.textSecondary,
                      border: `1px solid ${colors.slate200}`,
                    }}
                  >
                    Edit
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ FEATURES SCENE ============
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    { icon: Icons.Search, title: "Intent Detection", description: "AI finds buyers, not just browsers" },
    { icon: Icons.Zap, title: "Instant Replies", description: "Generate natural responses in seconds" },
    { icon: Icons.Users, title: "Competitor Monitoring", description: "Win their unhappy customers" },
    { icon: Icons.TrendingUp, title: "Analytics", description: "Track conversions and ROI" },
    { icon: Icons.Bot, title: "Auto or Manual", description: "Full control over your engagement" },
    { icon: Icons.CheckCircle, title: "Multi-Platform", description: "Instagram supported" },
  ];

  return (
    <AbsoluteFill>
      <AnimatedBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 100px",
        }}
      >
        {/* Title */}
        <div
          style={{
            marginBottom: 50,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -1,
            }}
          >
            Everything you need to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.lime} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              convert
            </span>
          </div>
        </div>

        {/* Feature Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 320px)",
            gap: 24,
          }}
        >
          {features.map((feature, i) => {
            const cardSpring = spring({
              frame: frame - 10 - i * 8,
              fps,
              config: { damping: 12, stiffness: 70 },
            });

            return (
              <div
                key={feature.title}
                style={{
                  background: colors.surface,
                  borderRadius: 24,
                  padding: 28,
                  border: `1px solid ${colors.slate200}`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                  transform: `scale(${Math.max(0, cardSpring)})`,
                  opacity: Math.max(0, cardSpring),
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: colors.emeraldLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <feature.icon size={28} color={colors.emeraldDark} />
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: 8,
                  }}
                >
                  {feature.title}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 15,
                    color: colors.textSecondary,
                    lineHeight: 1.5,
                  }}
                >
                  {feature.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ CTA SCENE ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const contentEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const buttonPulse = interpolate(Math.sin(frame / 10), [-1, 1], [1, 1.05]);

  return (
    <AbsoluteFill>
      <AnimatedBackground dark />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Img
          src={staticFile("assets/signal-harvester/logo.png")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 32,
            boxShadow: `0 30px 60px ${colors.emerald}50`,
            marginBottom: 40,
            transform: `scale(${Math.max(0, contentEntrance)})`,
            opacity: Math.max(0, contentEntrance),
          }}
        />

        {/* Text */}
        <div
          style={{
            textAlign: "center",
            transform: `translateY(${interpolate(Math.max(0, contentEntrance), [0, 1], [40, 0])}px)`,
            opacity: Math.max(0, contentEntrance),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 16,
            }}
          >
            Ready to turn comments into customers?
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2,
              marginBottom: 50,
            }}
          >
            <span style={{ color: "#fff" }}>Signal</span>
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.lime} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Harvester
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div
          style={{
            transform: `scale(${Math.max(0, contentEntrance) * buttonPulse})`,
            opacity: Math.max(0, contentEntrance),
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              background: `linear-gradient(135deg, ${colors.emerald} 0%, ${colors.emeraldDark} 100%)`,
              padding: "24px 50px",
              borderRadius: 20,
              boxShadow: `0 20px 40px ${colors.emerald}40`,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Test Free Now
            </span>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>

        {/* Platform badge */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
            opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icons.Instagram size={20} />
            <span style={{ fontFamily: "Inter", fontSize: 16, color: "rgba(255,255,255,0.6)" }}>Instagram</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const SignalHarvesterVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations
  const hookDuration = 5 * fps;        // 5 sec
  const introDuration = 4 * fps;        // 4 sec
  const howItWorksDuration = 5 * fps;   // 5 sec
  const demoDuration = 5 * fps;         // 5 sec
  const featuresDuration = 4 * fps;     // 4 sec
  const ctaDuration = 4 * fps;          // 4 sec

  const transitionDuration = Math.round(fps * 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <TransitionSeries>
        {/* Hook - The Problem */}
        <TransitionSeries.Sequence durationInFrames={hookDuration}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Intro - Brand Reveal */}
        <TransitionSeries.Sequence durationInFrames={introDuration}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* How It Works */}
        <TransitionSeries.Sequence durationInFrames={howItWorksDuration}>
          <HowItWorksScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Demo */}
        <TransitionSeries.Sequence durationInFrames={demoDuration}>
          <DemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Features */}
        <TransitionSeries.Sequence durationInFrames={featuresDuration}>
          <FeaturesScene />
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

      {/* Voice-over disabled - using music only
          To re-enable, uncomment the voiceover section below:
          {VOICEOVER_SEGMENTS.map((segment) => (
            <Sequence key={segment.id} from={segment.startFrame} layout="none">
              <VoiceoverAudio file={`assets/signal-harvester/${segment.file}`} />
            </Sequence>
          ))}
      */}

      {/* Background Music - main audio track */}
      <Audio
        src={staticFile("assets/signal-harvester/background-music.mp3")}
        volume={0.6}
      />
    </AbsoluteFill>
  );
};

export default SignalHarvesterVideo;

// Total duration calculation:
// 5 + 4 + 5 + 5 + 4 + 4 = 27 seconds
// Minus 5 transitions × 0.5 = 2.5 seconds overlap
// Total: ~24.5 seconds = 735 frames at 30fps
export const SIGNAL_HARVESTER_DURATION =
  5 * 30 +  // hook
  4 * 30 +  // intro
  5 * 30 +  // how it works
  5 * 30 +  // demo
  4 * 30 +  // features
  4 * 30 -  // cta
  5 * Math.round(30 * 0.5); // subtract 5 transition overlaps
