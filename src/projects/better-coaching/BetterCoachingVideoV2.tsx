import React from "react";
import {
  AbsoluteFill,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  spring,
  Img,
  staticFile,
  OffthreadVideo,
  Sequence,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { DustParticles } from "../../shared/components";

// Voice-over segments timing (synced to scenes)
const VOICEOVER_SEGMENTS = [
  { id: "hook", startFrame: 0, file: "voiceover-hook.mp3" },
  { id: "intro", startFrame: 75, file: "voiceover-intro.mp3" },
  { id: "coach-selection", startFrame: 165, file: "voiceover-coach-selection.mp3" },
  { id: "chat-demo", startFrame: 285, file: "voiceover-chat-demo.mp3" },
  { id: "voice-mode", startFrame: 450, file: "voiceover-voice-mode.mp3" },
  { id: "cta", startFrame: 585, file: "voiceover-cta.mp3" },
];

// Wrapper component to handle missing audio files gracefully
const VoiceoverAudio: React.FC<{ file: string }> = ({ file }) => {
  // This will only render if the audio file exists
  // If the file doesn't exist, Remotion will show a warning but won't break
  try {
    return <Audio src={staticFile(file)} volume={1} />;
  } catch {
    return null;
  }
};

// Brand colors from DESIGN.md - Warm, organic, trustworthy
const colors = {
  background: "#F7F6F3",      // Warm cream
  backgroundDark: "#E8E6E1",
  surface: "rgba(255,255,255,0.88)",

  // Pastels
  sage: "#DCE9DF",            // Primary pastel - growth
  sageLight: "#DCE9DF",
  sageDark: "#4F6F5A",
  lavender: "#E7E0F3",        // Premium, creativity
  lavenderDark: "#8A7A9E",
  sky: "#D9ECF7",             // Trust, clarity
  sand: "#F1E9DD",            // Warmth

  // CTA gradient
  ctaStart: "#6F8F79",
  ctaEnd: "#4F6F5A",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Accent
  success: "#22C55E",
  accent: "#2563EB",
  border: "#E7E7E7",
};

// ============ SVG ICONS ============
const Icons = {
  Star: ({ size = 14, color = "#F59E0B", filled = true }: { size?: number; color?: string; filled?: boolean }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Check: ({ size = 14, color = "#6F8F79" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Mic: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  Send: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

// ============ SOFT BACKGROUND COMPONENT ============
const SoftBackground: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
      {/* Floating soft circles */}
      {[
        { x: "10%", y: "20%", size: 400, color: colors.sage, delay: 0 },
        { x: "80%", y: "30%", size: 350, color: colors.lavender, delay: 20 },
        { x: "60%", y: "70%", size: 300, color: colors.sky, delay: 40 },
        { x: "20%", y: "80%", size: 380, color: colors.sand, delay: 10 },
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
            filter: "blur(80px)",
            opacity: 0.6,
            transform: `translate(-50%, -50%) translate(${Math.sin((frame + blob.delay) / 60) * 30}px, ${Math.cos((frame + blob.delay) / 50) * 20}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ============ HOOK SCENE - Brief Problem Statement ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const line1 = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const line2 = spring({ frame: frame - 30, fps, config: { damping: 15, stiffness: 80 } });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 56,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 24,
            textAlign: "center",
            transform: `translateY(${interpolate(Math.max(0, line1), [0, 1], [30, 0])}px)`,
            opacity: Math.max(0, line1),
          }}
        >
          Need guidance on your life goals?
        </div>

        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 700,
            color: colors.textPrimary,
            textAlign: "center",
            lineHeight: 1.2,
            transform: `scale(${interpolate(Math.max(0, line2), [0, 1], [0.9, 1])})`,
            opacity: Math.max(0, line2),
          }}
        >
          Meet your{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.ctaStart} 0%, ${colors.ctaEnd} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Coach
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ INTRO SCENE - App Reveal ============
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const textReveal = spring({ frame: frame - 15, fps, config: { damping: 15, stiffness: 100 } });
  const taglineReveal = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 110 } });

  return (
    <AbsoluteFill>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* Logo Animation Video */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 40,
            overflow: "hidden",
            boxShadow: `0 30px 60px rgba(0,0,0,0.15)`,
            transform: `scale(${Math.max(0, logoScale)})`,
            opacity: Math.max(0, logoScale),
          }}
        >
          <OffthreadVideo
            src={staticFile("assets/better-coaching/logo-animation-silent.mp4")}
            volume={0}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        <div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 80,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -2,
              transform: `translateX(${interpolate(Math.max(0, textReveal), [0, 1], [40, 0])}px)`,
              opacity: Math.max(0, textReveal),
            }}
          >
            Better Coaching
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 400,
              color: colors.textSecondary,
              marginTop: 8,
              transform: `translateX(${interpolate(Math.max(0, taglineReveal), [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, taglineReveal),
            }}
          >
            Your AI coaching marketplace
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ COACH DATA ============
interface CoachData {
  name: string;
  tagline: string;
  category: string;
  rating: number;
  sessionCount: number;
  avatarImage: string;
  tier: "free" | "premium";
}

const coaches: CoachData[] = [
  {
    name: "Productivity Pro",
    tagline: "Master your time and focus",
    category: "Productivity",
    rating: 4.9,
    sessionCount: 12000,
    avatarImage: "assets/better-coaching/coach-1.jpeg",
    tier: "free",
  },
  {
    name: "Mindful Guide",
    tagline: "Find inner peace & balance",
    category: "Wellness",
    rating: 4.8,
    sessionCount: 8500,
    avatarImage: "assets/better-coaching/coach-2.jpeg",
    tier: "premium",
  },
  {
    name: "Startup Mentor",
    tagline: "From idea to IPO",
    category: "Business",
    rating: 4.9,
    sessionCount: 4200,
    avatarImage: "assets/better-coaching/coach-3.jpeg",
    tier: "premium",
  },
  {
    name: "Career Navigator",
    tagline: "Land your dream job",
    category: "Career",
    rating: 4.8,
    sessionCount: 6800,
    avatarImage: "assets/better-coaching/coach-4.jpeg",
    tier: "free",
  },
];

// ============ COACH CARD COMPONENT ============
interface CoachCardProps {
  coach: CoachData;
  delay: number;
  isSelected?: boolean;
  selectionProgress?: number;
}

const CoachCard: React.FC<CoachCardProps> = ({ coach, delay, isSelected = false, selectionProgress = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 70 },
  });

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return count.toString();
  };

  // Selection animation
  const selectionScale = interpolate(selectionProgress, [0, 1], [1, 1.08], { extrapolateRight: "clamp" });
  const selectionGlow = interpolate(selectionProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const otherFade = isSelected ? 1 : interpolate(selectionProgress, [0, 1], [1, 0.3], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: 340,
        background: colors.surface,
        borderRadius: 24,
        border: isSelected && selectionProgress > 0
          ? `3px solid ${colors.ctaStart}`
          : `1px solid ${colors.border}`,
        boxShadow: isSelected && selectionProgress > 0
          ? `0 20px 50px rgba(111, 143, 121, ${0.3 * selectionGlow})`
          : "0 12px 32px rgba(17,24,39,0.08)",
        overflow: "hidden",
        transform: `scale(${Math.max(0, cardSpring) * selectionScale})`,
        opacity: Math.max(0, cardSpring) * otherFade,
      }}
    >
      <div style={{ padding: 20 }}>
        {/* Avatar + Info */}
        <div style={{ display: "flex", marginBottom: 16 }}>
          <div
            style={{
              width: 80,
              height: 95,
              borderRadius: 18,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Img
              src={staticFile(coach.avatarImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ flex: 1, marginLeft: 16 }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: colors.textPrimary,
                lineHeight: 1.2,
              }}
            >
              {coach.name}
            </div>

            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                color: colors.ctaStart,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {coach.category}
            </div>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 8, gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icons.Star size={14} />
                <span
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginLeft: 4,
                  }}
                >
                  {coach.rating.toFixed(1)}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icons.Check size={14} color={colors.ctaStart} />
                <span
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 14,
                    color: colors.textMuted,
                    marginLeft: 4,
                  }}
                >
                  {formatCount(coach.sessionCount)}
                </span>
              </div>
            </div>

            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                color: colors.textMuted,
                marginTop: 6,
              }}
            >
              {coach.tagline}
            </div>
          </div>
        </div>

        {/* Tier Badge */}
        <div
          style={{
            display: "inline-block",
            padding: "6px 14px",
            background: coach.tier === "premium" ? colors.lavender : colors.sage,
            borderRadius: 12,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: coach.tier === "premium" ? colors.lavenderDark : colors.sageDark,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {coach.tier === "premium" ? "Premium" : "Free"}
        </div>
      </div>
    </div>
  );
};

// ============ COACH SELECTION SCENE ============
const CoachSelectionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // Selection happens after 2 seconds (60 frames)
  const selectionStartFrame = 60;
  const selectionProgress = interpolate(
    frame,
    [selectionStartFrame, selectionStartFrame + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // The selected coach index (Mindful Guide = index 1)
  const selectedIndex = 1;

  return (
    <AbsoluteFill>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 60px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 40,
            textAlign: "center",
            transform: `translateY(${interpolate(Math.max(0, titleSpring), [0, 1], [20, 0])}px)`,
            opacity: Math.max(0, titleSpring),
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
            Choose your coach
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 24,
              color: colors.textSecondary,
              marginTop: 12,
            }}
          >
            Browse thousands of AI coaches for any life goal
          </div>
        </div>

        {/* Coach Grid - 2x2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 340px)",
            gap: 24,
            justifyContent: "center",
          }}
        >
          {coaches.map((coach, i) => (
            <CoachCard
              key={coach.name}
              coach={coach}
              delay={15 + i * 8}
              isSelected={i === selectedIndex}
              selectionProgress={selectionProgress}
            />
          ))}
        </div>

        {/* Selection indicator text */}
        {selectionProgress > 0.5 && (
          <div
            style={{
              marginTop: 30,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              color: colors.ctaStart,
              fontWeight: 500,
              opacity: interpolate(selectionProgress, [0.5, 1], [0, 1]),
            }}
          >
            Opening Mindful Guide...
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ============ IPHONE CHAT DEMO SCENE ============
const ChatDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance
  const phoneEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });

  // Message timing (in frames)
  const userMessageStart = 45; // 1.5 sec
  const aiResponseStart = 90; // 3 sec

  // User message typing animation
  const userMessageProgress = interpolate(
    frame,
    [userMessageStart, userMessageStart + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // AI response animation
  const aiResponseProgress = interpolate(
    frame,
    [aiResponseStart, aiResponseStart + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const userMessage = "Can you guide me through a quick meditation?";
  const aiResponse = "Of course! Let's begin with a simple breathing exercise. Find a comfortable position, close your eyes, and take a deep breath in through your nose for 4 counts... hold for 4... and slowly exhale through your mouth for 6 counts. Let's do this together. 🧘‍♀️";

  // Show partial AI response based on progress
  const visibleAiChars = Math.floor(aiResponse.length * aiResponseProgress);
  const visibleAiResponse = aiResponse.slice(0, visibleAiChars);

  return (
    <AbsoluteFill>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "40px 80px",
        }}
      >
        {/* Left: Description */}
        <div
          style={{
            flex: 1,
            maxWidth: 500,
            transform: `translateX(${interpolate(Math.max(0, phoneEntrance), [0, 1], [-50, 0])}px)`,
            opacity: Math.max(0, phoneEntrance),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: colors.ctaStart,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            Personalized AI Chat
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -1,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Get instant guidance,<br />anytime you need it
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              color: colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Each coach adapts to your goals and provides personalized advice with streaming AI responses.
          </div>
        </div>

        {/* Right: iPhone with Chat */}
        <div
          style={{
            transform: `scale(${Math.max(0, phoneEntrance)}) translateY(${interpolate(Math.max(0, phoneEntrance), [0, 1], [50, 0])}px)`,
            opacity: Math.max(0, phoneEntrance),
          }}
        >
          <div
            style={{
              width: 375,
              height: 750,
              borderRadius: 55,
              overflow: "hidden",
              boxShadow: "0 50px 100px rgba(0,0,0,0.3), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
              background: "#fff",
            }}
          >
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
                zIndex: 10,
              }}
            />

            {/* Chat Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${colors.ctaStart} 0%, ${colors.ctaEnd} 100%)`,
                padding: "60px 20px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <Img
                  src={staticFile("assets/better-coaching/coach-2.jpeg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>
                <div style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 600, color: "#fff" }}>
                  Mindful Guide
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  Online • Powered by Claude
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, height: 520, background: "#fff" }}>
              {/* Welcome message */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "14px 18px",
                    borderRadius: "20px 20px 20px 6px",
                    background: "#F3F4F6",
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: colors.textPrimary,
                  }}
                >
                  Hello! I'm Mindful Guide, here to help you find peace and balance. How can I support you today? 🌿
                </div>
              </div>

              {/* User message */}
              {userMessageProgress > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "14px 18px",
                      borderRadius: "20px 20px 6px 20px",
                      background: colors.ctaStart,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: "#fff",
                      opacity: userMessageProgress,
                      transform: `translateY(${interpolate(userMessageProgress, [0, 1], [10, 0])}px)`,
                    }}
                  >
                    {userMessage}
                  </div>
                </div>
              )}

              {/* AI Response */}
              {aiResponseProgress > 0 && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "14px 18px",
                      borderRadius: "20px 20px 20px 6px",
                      background: "#F3F4F6",
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: colors.textPrimary,
                    }}
                  >
                    {visibleAiResponse}
                    {aiResponseProgress < 1 && (
                      <span style={{ opacity: Math.sin(frame / 3) > 0 ? 1 : 0 }}>▊</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#F3F4F6",
                borderRadius: 30,
                padding: "8px 8px 8px 20px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 15,
                  color: colors.textMuted,
                }}
              >
                Type a message...
              </div>
              {/* Voice button */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: colors.lavender,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.Mic size={20} color={colors.lavenderDark} />
              </div>
              {/* Send button */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: colors.ctaStart,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icons.Send size={18} color="#fff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ VOICE MODE SCENE ============
const VoiceModeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Transition from chat to voice mode
  const voiceModeEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });

  // Pulsing mic animation
  const pulseScale = interpolate(
    Math.sin(frame / 8),
    [-1, 1],
    [1, 1.15]
  );

  // Voice interaction simulation
  const isListening = frame < 60;
  const isProcessing = frame >= 60 && frame < 90;
  const isSpeaking = frame >= 90;

  const statusText = isListening
    ? "Listening..."
    : isProcessing
      ? "Processing..."
      : "Speaking...";

  // Transcript animation
  const transcriptProgress = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const userTranscript = "Help me relax before my meeting";
  const visibleTranscript = userTranscript.slice(0, Math.floor(userTranscript.length * transcriptProgress));

  // Response animation
  const responseProgress = interpolate(frame, [90, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aiVoiceResponse = "Taking a deep breath now... breathe in slowly... and release...";
  const visibleResponse = aiVoiceResponse.slice(0, Math.floor(aiVoiceResponse.length * responseProgress));

  return (
    <AbsoluteFill>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "40px 80px",
        }}
      >
        {/* Left: Description */}
        <div
          style={{
            flex: 1,
            maxWidth: 500,
            transform: `translateX(${interpolate(Math.max(0, voiceModeEntrance), [0, 1], [-50, 0])}px)`,
            opacity: Math.max(0, voiceModeEntrance),
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: colors.lavenderDark,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 16,
            }}
          >
            Voice Mode
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 48,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -1,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Talk naturally<br />with your coach
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              color: colors.textSecondary,
              lineHeight: 1.6,
            }}
          >
            Speak your thoughts and hear your coach respond with lifelike voice synthesis.
          </div>
        </div>

        {/* Right: iPhone with Voice Mode */}
        <div
          style={{
            transform: `scale(${Math.max(0, voiceModeEntrance)}) translateY(${interpolate(Math.max(0, voiceModeEntrance), [0, 1], [50, 0])}px)`,
            opacity: Math.max(0, voiceModeEntrance),
          }}
        >
          <div
            style={{
              width: 375,
              height: 750,
              borderRadius: 55,
              overflow: "hidden",
              boxShadow: "0 50px 100px rgba(0,0,0,0.3), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
              background: "#2D3F32", // Dark sage for voice mode
            }}
          >
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
                zIndex: 10,
              }}
            />

            {/* Voice Mode Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 80,
                height: "100%",
              }}
            >
              {/* Coach Avatar */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                <Img
                  src={staticFile("assets/better-coaching/coach-2.jpeg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Mindful Guide
              </div>
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {statusText}
              </div>

              {/* Pulsing Mic Circle */}
              <div
                style={{
                  marginTop: 60,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: isListening
                    ? `linear-gradient(135deg, ${colors.ctaStart}, ${colors.ctaEnd})`
                    : isSpeaking
                      ? "linear-gradient(135deg, #B8A9C9, #8A7A9E)"
                      : "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${isListening ? pulseScale : 1})`,
                  boxShadow: isListening
                    ? `0 0 60px ${colors.ctaStart}60`
                    : "none",
                }}
              >
                <Icons.Mic size={60} color="#fff" />
              </div>

              {/* Transcript Area */}
              <div
                style={{
                  marginTop: 50,
                  padding: "0 30px",
                  textAlign: "center",
                  minHeight: 100,
                }}
              >
                {/* User transcript */}
                {transcriptProgress > 0 && (
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 18,
                      color: "rgba(255,255,255,0.9)",
                      marginBottom: 20,
                      lineHeight: 1.5,
                    }}
                  >
                    "{visibleTranscript}"
                    {transcriptProgress < 1 && (
                      <span style={{ opacity: Math.sin(frame / 3) > 0 ? 1 : 0 }}>|</span>
                    )}
                  </div>
                )}

                {/* AI Response */}
                {responseProgress > 0 && (
                  <div
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 20,
                      fontWeight: 500,
                      color: "#fff",
                      lineHeight: 1.6,
                      fontStyle: "italic",
                    }}
                  >
                    {visibleResponse}
                    {responseProgress < 1 && (
                      <span style={{ opacity: Math.sin(frame / 3) > 0 ? 1 : 0 }}>|</span>
                    )}
                  </div>
                )}
              </div>

              {/* Close button hint */}
              <div
                style={{
                  position: "absolute",
                  bottom: 50,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Tap anywhere to close
              </div>
            </div>
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

  const logoEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 70 } });
  const textEntrance = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 80 } });
  const buttonEntrance = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 70 } });

  return (
    <AbsoluteFill>
      <SoftBackground />
      <DustParticles count={30} colors={{ primary: colors.ctaStart, secondary: colors.ctaEnd }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 48,
            overflow: "hidden",
            boxShadow: `0 40px 80px rgba(0,0,0,0.2)`,
            transform: `scale(${Math.max(0, logoEntrance)}) rotate(${interpolate(Math.max(0, logoEntrance), [0, 1], [-10, 0])}deg)`,
            opacity: Math.max(0, logoEntrance),
          }}
        >
          <Img
            src={staticFile("assets/better-coaching/logo-white.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* CTA Content */}
        <div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              color: colors.textSecondary,
              marginBottom: 12,
              transform: `translateY(${interpolate(Math.max(0, textEntrance), [0, 1], [20, 0])}px)`,
              opacity: Math.max(0, textEntrance),
            }}
          >
            Find your perfect coach today
          </div>

          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 72,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -2,
              marginBottom: 40,
              transform: `translateY(${interpolate(Math.max(0, textEntrance), [0, 1], [30, 0])}px)`,
              opacity: Math.max(0, textEntrance),
            }}
          >
            Better Coaching
          </div>

          {/* App Store Button */}
          <div
            style={{
              transform: `scale(${interpolate(Math.max(0, buttonEntrance), [0, 1], [0.8, 1])})`,
              opacity: Math.max(0, buttonEntrance),
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
                background: `linear-gradient(135deg, ${colors.ctaStart} 0%, ${colors.ctaEnd} 100%)`,
                padding: "20px 40px",
                borderRadius: 20,
                boxShadow: `0 16px 34px ${colors.ctaStart}40`,
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, fill: "#fff" }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                  Download on the
                </div>
                <div style={{ fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#fff" }}>
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
export const BetterCoachingVideoV2: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations
  const hookDuration = 3 * fps;      // 3 sec
  const introDuration = 3 * fps;      // 3 sec
  const selectionDuration = 4 * fps;  // 4 sec
  const chatDuration = 6 * fps;       // 6 sec
  const voiceDuration = 5 * fps;      // 5 sec
  const ctaDuration = 4 * fps;        // 4 sec

  const transitionDuration = Math.round(fps * 0.5);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <TransitionSeries>
        {/* Hook */}
        <TransitionSeries.Sequence durationInFrames={hookDuration}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Intro */}
        <TransitionSeries.Sequence durationInFrames={introDuration}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Coach Selection */}
        <TransitionSeries.Sequence durationInFrames={selectionDuration}>
          <CoachSelectionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Chat Demo */}
        <TransitionSeries.Sequence durationInFrames={chatDuration}>
          <ChatDemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Voice Mode */}
        <TransitionSeries.Sequence durationInFrames={voiceDuration}>
          <VoiceModeScene />
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

      {/* Voice-over Audio Layer
          To generate audio files, run: node scripts/generate-voiceover-better-coaching-v2.js
          Audio files should be placed in: public/assets/better-coaching-v2/
      */}
      {VOICEOVER_SEGMENTS.map((segment) => (
        <Sequence key={segment.id} from={segment.startFrame} layout="none">
          <VoiceoverAudio file={`assets/better-coaching-v2/${segment.file}`} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default BetterCoachingVideoV2;

// Total duration calculation:
// 3 + 3 + 4 + 6 + 5 + 4 = 25 seconds
// Minus 5 transitions × 0.5 = 2.5 seconds overlap
// Total: ~22.5 seconds = 675 frames at 30fps
export const BETTER_COACHING_V2_DURATION =
  3 * 30 +  // hook
  3 * 30 +  // intro
  4 * 30 +  // selection
  6 * 30 +  // chat
  5 * 30 +  // voice
  4 * 30 -  // cta
  5 * Math.round(30 * 0.5); // subtract 5 transition overlaps
