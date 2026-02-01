import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

// Brand colors from TheBecomingApp
const colors = {
  background: "#0c1426",
  primary: "#14b8a6", // teal
  secondary: "#f59e0b", // amber
  tertiary: "#10b981", // emerald
  text: "#fafafa",
  textMuted: "#a1a1aa",
};

// Animated background with subtle gradient
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gradientPosition = interpolate(frame, [0, 10 * fps], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% ${30 + gradientPosition * 0.2}%, ${colors.background} 0%, #050a12 100%)`,
      }}
    />
  );
};

// Animated particles/orbs for visual interest
const FloatingOrb: React.FC<{
  delay: number;
  x: number;
  y: number;
  size: number;
  color: string;
}> = ({ delay, x, y, size, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });

  const float = Math.sin((frame + delay) / 30) * 20;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y + float * 0.1}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, ${color}00 70%)`,
        opacity: entrance * 0.6,
        transform: `scale(${entrance}) translateY(${float}px)`,
      }}
    />
  );
};

// Hook scene - "Stop chasing goals."
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const word1Entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const word2Entrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const word3Entrance = spring({
    frame: frame - 16,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 72,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: word1Entrance,
            transform: `translateY(${interpolate(word1Entrance, [0, 1], [40, 0])}px)`,
          }}
        >
          Stop
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 72,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: word2Entrance,
            transform: `translateY(${interpolate(word2Entrance, [0, 1], [40, 0])}px)`,
          }}
        >
          chasing
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 88,
            fontWeight: 600,
            color: colors.text,
            opacity: word3Entrance,
            transform: `translateY(${interpolate(word3Entrance, [0, 1], [40, 0])}px)`,
          }}
        >
          goals.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Transformation scene - "Become them."
const BecomeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const becomeEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const themEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const glowIntensity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 96,
            fontWeight: 600,
            fontStyle: "italic",
            color: colors.primary,
            opacity: becomeEntrance,
            transform: `scale(${interpolate(becomeEntrance, [0, 1], [0.8, 1])})`,
            textShadow: `0 0 ${40 * glowIntensity}px ${colors.primary}60`,
          }}
        >
          Become
        </div>
        <div
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 96,
            fontWeight: 600,
            fontStyle: "italic",
            color: colors.secondary,
            opacity: themEntrance,
            transform: `scale(${interpolate(themEntrance, [0, 1], [0.8, 1])})`,
            textShadow: `0 0 ${40 * glowIntensity}px ${colors.secondary}60`,
          }}
        >
          them.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// App name reveal
const AppNameScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const taglineEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        <div
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 80,
            fontWeight: 700,
            color: colors.text,
            opacity: logoEntrance,
            transform: `translateY(${interpolate(logoEntrance, [0, 1], [60, 0])}px)`,
            letterSpacing: 4,
          }}
        >
          The Becoming
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 36,
            fontWeight: 400,
            color: colors.textMuted,
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Identity-based transformation
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Feature highlight component
const FeatureHighlight: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: string;
}> = ({ icon, title, description, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const textEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
        }}
      >
        <div
          style={{
            fontSize: 120,
            opacity: entrance,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 600,
            color: color,
            opacity: textEntrance,
            textAlign: "center",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 32,
            fontWeight: 400,
            color: colors.textMuted,
            opacity: textEntrance,
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// CTA Scene
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const textEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  const pulse = Math.sin(frame / 8) * 0.03 + 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 44,
            fontWeight: 400,
            color: colors.textMuted,
            opacity: textEntrance,
          }}
        >
          Start your transformation
        </div>

        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1]) * pulse})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              padding: "32px 64px",
              borderRadius: 60,
              fontFamily: "Inter, sans-serif",
              fontSize: 40,
              fontWeight: 600,
              color: colors.background,
            }}
          >
            Download Now
          </div>
        </div>

        <div
          style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 36,
            fontWeight: 600,
            fontStyle: "italic",
            color: colors.text,
            opacity: textEntrance,
            marginTop: 20,
          }}
        >
          The Becoming
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Main composition
export const SocialPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <Background />

      {/* Floating orbs for ambiance */}
      <FloatingOrb delay={0} x={20} y={30} size={200} color={colors.primary} />
      <FloatingOrb delay={10} x={75} y={60} size={150} color={colors.secondary} />
      <FloatingOrb delay={20} x={15} y={75} size={180} color={colors.tertiary} />
      <FloatingOrb delay={30} x={80} y={20} size={120} color={colors.primary} />

      {/* Scene 1: Hook - "Stop chasing goals." (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps} premountFor={fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: "Become them." (3-6s) */}
      <Sequence from={3 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <BecomeScene />
      </Sequence>

      {/* Scene 3: App name (6-9s) */}
      <Sequence from={6 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <AppNameScene />
      </Sequence>

      {/* Scene 4: Feature 1 - AI Signals (9-12.5s) */}
      <Sequence from={9 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <FeatureHighlight
          icon="✨"
          title="AI-Powered Signals"
          description="Daily nudges tailored to your tone and goals"
          color={colors.primary}
        />
      </Sequence>

      {/* Scene 5: Feature 2 - Identity (12.5-16s) */}
      <Sequence from={12.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <FeatureHighlight
          icon="🎯"
          title="Identity-First"
          description="Don't chase goals. Embody who you want to become"
          color={colors.secondary}
        />
      </Sequence>

      {/* Scene 6: Feature 3 - Reflect (16-19.5s) */}
      <Sequence from={16 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <FeatureHighlight
          icon="🪞"
          title="Daily Reflection"
          description="Track alignment with your chosen identity"
          color={colors.tertiary}
        />
      </Sequence>

      {/* Scene 7: CTA (19.5-25s) */}
      <Sequence from={19.5 * fps} durationInFrames={5.5 * fps} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
