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
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  DustParticles,
  TypewriterText,
} from "../../shared/components";

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

// Avatar gradient colors based on name hash (matching app exactly)
const avatarGradients: [string, string][] = [
  ["#6F8F79", "#4F6F5A"],  // Sage CTA gradient
  ["#B8A9C9", "#8A7A9E"],  // Lavender gradient
  ["#D4A5A5", "#B87878"],  // Blush gradient
  ["#A5C4D4", "#7A9EB0"],  // Sky gradient
];

function getAvatarGradient(name: string): [string, string] {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarGradients[hash % avatarGradients.length];
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

// ============ SVG ICONS (replacing emojis) ============
const Icons = {
  // Feature icons
  Search: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Chat: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Sparkles: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 12l.5 1.5L21 14l-1.5.5L19 16l-.5-1.5L17 14l1.5-.5L19 12z" />
    </svg>
  ),
  DollarSign: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  // Creator step icons
  Pencil: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Mask: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Brain: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5z" />
      <path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08A2.5 2.5 0 0 1 12 20" />
    </svg>
  ),
  Cpu: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  Rocket: ({ size = 24, color = "#fff" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  // Rating icons
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

// ============ HOOK SCENE - Problem Statement ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const line1 = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });
  const line2 = spring({ frame: frame - 20, fps, config: { damping: 15, stiffness: 80 } });
  const line3 = spring({ frame: frame - 50, fps, config: { damping: 15, stiffness: 80 } });

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
        {/* First line */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 48,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 16,
            transform: `translateY(${interpolate(Math.max(0, line1), [0, 1], [30, 0])}px)`,
            opacity: Math.max(0, line1),
          }}
        >
          Great coaching is expensive
        </div>

        {/* Second line */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 48,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 32,
            transform: `translateY(${interpolate(Math.max(0, line2), [0, 1], [30, 0])}px)`,
            opacity: Math.max(0, line2),
          }}
        >
          and hard to find
        </div>

        {/* Solution */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 700,
            color: colors.textPrimary,
            textAlign: "center",
            lineHeight: 1.2,
            transform: `scale(${interpolate(Math.max(0, line3), [0, 1], [0.9, 1])})`,
            opacity: Math.max(0, line3),
          }}
        >
          What if you could access
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.ctaStart} 0%, ${colors.ctaEnd} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            thousands of AI coaches
          </span>
          ?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ INTRO SCENE - App Reveal with Logo Animation ============
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const textReveal = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const taglineReveal = spring({
    frame: frame - 30,
    fps,
    config: { damping: 18, stiffness: 110 },
  });

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

        {/* Text */}
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
            The AI Coaching Marketplace
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ FEATURE CARD COMPONENT ============
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  color,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 70 },
  });

  const float = interpolate(
    Math.sin((frame + delay * 3) / 25),
    [-1, 1],
    [-4, 4]
  );

  return (
    <div
      style={{
        width: 280,
        padding: 28,
        background: colors.surface,
        borderRadius: 22,
        border: `1px solid ${color}40`,
        boxShadow: `0 10px 28px rgba(17,24,39,0.06)`,
        transform: `scale(${Math.max(0, cardSpring)}) translateY(${float}px)`,
        opacity: Math.max(0, cardSpring),
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>
    </div>
  );
};

// ============ FEATURES SCENE ============
const FeaturesScene: React.FC = () => {
  const features = [
    {
      icon: <Icons.Search size={28} color="#4A7B8C" />,
      title: "Discover",
      description: "Browse thousands of AI coaches across career, wellness, productivity & more",
      color: colors.sky,
    },
    {
      icon: <Icons.Chat size={28} color="#4F6F5A" />,
      title: "Chat",
      description: "Get instant, personalized guidance with streaming AI responses",
      color: colors.sage,
    },
    {
      icon: <Icons.Sparkles size={28} color="#7C3AED" />,
      title: "Create",
      description: "Build & publish your own coaching agents with full prompt control",
      color: colors.lavender,
    },
    {
      icon: <Icons.DollarSign size={28} color="#A67C52" />,
      title: "Earn",
      description: "Monetize your expertise by selling AI coaches on the marketplace",
      color: colors.sand,
    },
  ];

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
          padding: 60,
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: 50 }}>
          <TypewriterText
            text="Everything you need"
            startFrame={0}
            fontSize={48}
            fontWeight={700}
            color={colors.textPrimary}
            charsPerFrame={2}
          />
        </div>

        {/* Feature Cards */}
        <div style={{ display: "flex", gap: 24 }}>
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={20 + i * 10}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ AUTHENTIC COACH CARD COMPONENT ============
interface CoachData {
  name: string;
  tagline: string;
  creatorName?: string;
  rating?: number;
  ratingCount?: number;
  sessionCount?: number;
  tags?: string[];
  tier: "free" | "premium";
  avatarImage?: string; // Profile image path
}

// ============ MARKETPLACE SCENE - Authentic Coach Cards (Bigger, Centered) ============
const MarketplaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only show 4 coaches for better visual balance - bigger cards with profile images
  const coaches: CoachData[] = [
    {
      name: "Productivity Pro",
      tagline: "Master your time and achieve more every day",
      creatorName: "Alex Chen",
      rating: 4.9,
      ratingCount: 2100,
      sessionCount: 12000,
      tags: ["Productivity", "Time Management"],
      tier: "free",
      avatarImage: "assets/better-coaching/coach-1.jpeg",
    },
    {
      name: "Mindful Guide",
      tagline: "Find inner peace through guided meditation",
      creatorName: "Sarah Williams",
      rating: 4.8,
      ratingCount: 1800,
      sessionCount: 8500,
      tags: ["Wellness", "Meditation"],
      tier: "premium",
      avatarImage: "assets/better-coaching/coach-2.jpeg",
    },
    {
      name: "Startup Mentor",
      tagline: "From idea to IPO - your entrepreneurial guide",
      creatorName: "Michael Torres",
      rating: 4.9,
      ratingCount: 950,
      sessionCount: 4200,
      tags: ["Business", "Startups"],
      tier: "premium",
      avatarImage: "assets/better-coaching/coach-3.jpeg",
    },
    {
      name: "Career Navigator",
      tagline: "Land your dream job with expert guidance",
      creatorName: "James Park",
      rating: 4.8,
      ratingCount: 1500,
      sessionCount: 6800,
      tags: ["Career", "Interviews"],
      tier: "free",
      avatarImage: "assets/better-coaching/coach-4.jpeg", // Professional image
    },
  ];

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

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
        {/* Header - Centered */}
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
              fontSize: 18,
              fontWeight: 500,
              color: colors.ctaStart,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Marketplace
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
            Find your perfect coach
          </div>
        </div>

        {/* Coach Grid - 2x2, Bigger Cards, Centered */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 380px)",
            gap: 24,
            justifyContent: "center",
          }}
        >
          {coaches.map((coach, i) => (
            <BigCoachCard
              key={coach.name}
              coach={coach}
              delay={15 + i * 10}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ BIGGER COACH CARD COMPONENT ============
interface BigCoachCardProps {
  coach: CoachData;
  delay: number;
}

const BigCoachCard: React.FC<BigCoachCardProps> = ({ coach, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 70 },
  });

  const gradientColors = getAvatarGradient(coach.name);
  const initial = getInitial(coach.name);

  const formatCount = (count: number | undefined) => {
    if (!count) return null;
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return count.toString();
  };

  const usageCount = formatCount(coach.sessionCount);
  const ratingCountFormatted = formatCount(coach.ratingCount);

  return (
    <div
      style={{
        width: 380,
        background: colors.surface,
        borderRadius: 24,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 12px 32px rgba(17,24,39,0.08)",
        overflow: "hidden",
        transform: `scale(${Math.max(0, cardSpring)}) translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [30, 0])}px)`,
        opacity: Math.max(0, cardSpring),
      }}
    >
      <div style={{ padding: 20 }}>
        {/* Top section: Photo + Info */}
        <div style={{ display: "flex", marginBottom: 16 }}>
          {/* Avatar - Profile Image or Gradient Fallback */}
          <div
            style={{
              width: 90,
              height: 105,
              borderRadius: 20,
              background: coach.avatarImage
                ? "transparent"
                : `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {coach.avatarImage ? (
              <Img
                src={staticFile(coach.avatarImage)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              /* Letter badge fallback */
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* Info section */}
          <div style={{ flex: 1, marginLeft: 16, justifyContent: "center" }}>
            {/* Coach name */}
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

            {/* Creator name */}
            {coach.creatorName && (
              <div
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginTop: 4,
                }}
              >
                {coach.creatorName}
              </div>
            )}

            {/* Social proof row */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 8, gap: 12 }}>
              {coach.rating && (
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
                  {ratingCountFormatted && (
                    <span
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontSize: 14,
                        color: colors.textMuted,
                        marginLeft: 4,
                      }}
                    >
                      ({ratingCountFormatted})
                    </span>
                  )}
                </div>
              )}
              {usageCount && (
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
                    {usageCount} users
                  </span>
                </div>
              )}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                color: colors.textMuted,
                marginTop: 6,
                lineHeight: 1.4,
              }}
            >
              {coach.tagline}
            </div>
          </div>
        </div>

        {/* Tags row */}
        {coach.tags && coach.tags.length > 0 && (
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 14,
              color: colors.textSecondary,
              marginBottom: 16,
            }}
          >
            {coach.tags.join(" · ")}
          </div>
        )}

        {/* CTA Button - Bigger */}
        <div
          style={{
            background: colors.ctaStart,
            borderRadius: 16,
            padding: "12px 0",
            textAlign: "center",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          Try 1 message free
        </div>
      </div>
    </div>
  );
};

// ============ CHAT PREVIEW SCENE ============
const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const messages = [
    { role: "user", text: "I want to improve my public speaking skills" },
    { role: "ai", text: "Great goal! Let's start by identifying your biggest challenge. Is it nervousness, content organization, or delivery?" },
    { role: "user", text: "Definitely nervousness before presentations" },
    { role: "ai", text: "That's very common! Here's a technique that works: the 4-7-8 breathing method. Breathe in for 4 seconds, hold for 7, exhale for 8. Try it before your next presentation." },
  ];

  return (
    <AbsoluteFill>
      <SoftBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "60px 100px",
          gap: 80,
        }}
      >
        {/* Left: Description */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              fontWeight: 500,
              color: colors.ctaStart,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
              opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
            }}
          >
            Real-time AI Chat
          </div>
          <TypewriterText
            text="Personalized guidance, instantly"
            startFrame={10}
            fontSize={48}
            fontWeight={700}
            color={colors.textPrimary}
            charsPerFrame={1.5}
            style={{ marginBottom: 24, letterSpacing: -1 }}
          />
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 20,
              color: colors.textSecondary,
              lineHeight: 1.6,
              maxWidth: 450,
              opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            Each coach uses your personal context to deliver tailored advice that actually fits your situation.
          </div>
        </div>

        {/* Right: Chat Window */}
        <div
          style={{
            width: 420,
            background: "#FFFFFF",
            borderRadius: 24,
            boxShadow: `0 20px 60px rgba(17,24,39,0.12)`,
            overflow: "hidden",
            border: `1px solid #E7E7E7`,
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: "16px 20px",
              background: `linear-gradient(135deg, ${colors.ctaStart} 0%, ${colors.ctaEnd} 100%)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              P
            </div>
            <div>
              <div style={{ fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: "#fff" }}>
                Public Speaking Coach
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                Online • Powered by Claude
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => {
              const msgSpring = spring({
                frame: frame - 20 - i * 20,
                fps,
                config: { damping: 15, stiffness: 100 },
              });

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    transform: `translateY(${interpolate(Math.max(0, msgSpring), [0, 1], [10, 0])}px)`,
                    opacity: Math.max(0, msgSpring),
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: msg.role === "user" ? colors.ctaStart : "#F3F4F6",
                      color: msg.role === "user" ? "#fff" : colors.textPrimary,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ CREATOR SCENE - Visual No-Code Step Flow ============
const CreatorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 } });

  // 5 steps of the no-code creator flow
  const steps = [
    { num: 1, label: "Identity", IconComponent: Icons.Pencil, description: "Name & category" },
    { num: 2, label: "Personality", IconComponent: Icons.Mask, description: "Tone & style" },
    { num: 3, label: "Expertise", IconComponent: Icons.Brain, description: "Knowledge areas" },
    { num: 4, label: "Model", IconComponent: Icons.Cpu, description: "Choose AI" },
    { num: 5, label: "Publish", IconComponent: Icons.Rocket, description: "Go live!" },
  ];

  // Animate which step is "active" - slower progression to allow pause at end
  // Steps progress every 24 frames (0.8s each), total ~4s for all 5 steps
  const activeStep = Math.min(5, Math.floor(frame / 24) + 1);

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
          padding: "50px 80px",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
            transform: `translateY(${interpolate(Math.max(0, titleSpring), [0, 1], [20, 0])}px)`,
            opacity: Math.max(0, titleSpring),
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: colors.lavender,
              borderRadius: 24,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#7C3AED",
              marginBottom: 20,
            }}
          >
            Creator Studio
          </div>

          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            Build your own coach in 5 simple steps
          </div>

          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 22,
              color: colors.textSecondary,
            }}
          >
            No coding required • Publish in minutes • Start earning
          </div>
        </div>

        {/* Step Flow - Visual Timeline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {steps.map((step, i) => {
            const stepSpring = spring({
              frame: frame - 10 - i * 12,
              fps,
              config: { damping: 12, stiffness: 80 },
            });

            const isActive = step.num <= activeStep;
            const isCurrent = step.num === activeStep;

            return (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Step Card */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${Math.max(0, stepSpring)}) translateY(${isCurrent ? -8 : 0}px)`,
                    opacity: Math.max(0, stepSpring),
                    transition: "transform 0.3s",
                  }}
                >
                  {/* Circle with icon */}
                  <div
                    style={{
                      width: isCurrent ? 90 : 80,
                      height: isCurrent ? 90 : 80,
                      borderRadius: "50%",
                      background: isActive
                        ? `linear-gradient(135deg, ${colors.ctaStart}, ${colors.ctaEnd})`
                        : colors.surface,
                      border: isActive ? "none" : `2px solid ${colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: isCurrent
                        ? `0 12px 30px ${colors.ctaStart}40`
                        : "0 4px 12px rgba(0,0,0,0.06)",
                      transition: "all 0.3s",
                    }}
                  >
                    <step.IconComponent size={isCurrent ? 36 : 32} color={isActive ? "#fff" : colors.textMuted} />
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      marginTop: 14,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: isActive ? colors.ctaStart : colors.textMuted,
                    }}
                  >
                    {step.label}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 13,
                      color: colors.textMuted,
                    }}
                  >
                    {step.description}
                  </div>
                </div>

                {/* Connector Line */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      background: step.num < activeStep
                        ? `linear-gradient(90deg, ${colors.ctaStart}, ${colors.ctaEnd})`
                        : colors.border,
                      borderRadius: 2,
                      marginLeft: 12,
                      marginRight: 12,
                      marginBottom: 50,
                      opacity: interpolate(Math.max(0, stepSpring), [0, 1], [0, 1]),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom: Model badges */}
        <div
          style={{
            marginTop: 50,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 15,
              color: colors.textMuted,
            }}
          >
            Powered by
          </span>
          {["Claude Sonnet 4.5", "GPT 5.2", "Gemini 3"].map((model) => (
            <div
              key={model}
              style={{
                padding: "8px 18px",
                background: colors.surface,
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: colors.textPrimary,
              }}
            >
              {model}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ CTA SCENE with Logo ============
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
            Start getting coached today
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
export const BetterCoachingVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene durations
  const hookDuration = 5 * fps;
  const introDuration = 3 * fps;
  const featuresDuration = 4 * fps;
  const marketplaceDuration = 4 * fps;
  const chatDuration = 4 * fps;
  const creatorDuration = 5 * fps; // Extended by 1 second for Publish pause
  const ctaDuration = 4 * fps;

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

        {/* Features */}
        <TransitionSeries.Sequence durationInFrames={featuresDuration}>
          <FeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Marketplace */}
        <TransitionSeries.Sequence durationInFrames={marketplaceDuration}>
          <MarketplaceScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Chat */}
        <TransitionSeries.Sequence durationInFrames={chatDuration}>
          <ChatScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: transitionDuration })}
        />

        {/* Creator */}
        <TransitionSeries.Sequence durationInFrames={creatorDuration}>
          <CreatorScene />
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

export default BetterCoachingVideo;

// Total duration calculation
export const BETTER_COACHING_DURATION =
  5 * 30 +  // hook
  3 * 30 +  // intro
  4 * 30 +  // features
  4 * 30 +  // marketplace
  4 * 30 +  // chat
  5 * 30 +  // creator (extended by 1s for Publish pause)
  4 * 30 -  // cta
  6 * Math.round(30 * 0.5); // subtract 6 transition overlaps
