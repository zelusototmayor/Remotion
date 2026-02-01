import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { AnimatedPhone, IPhoneMockup } from "./components/IPhoneMockup";

// Brand colors
const colors = {
  background: "#0c1426",
  backgroundDark: "#050a12",
  primary: "#14b8a6",
  secondary: "#f59e0b",
  tertiary: "#10b981",
  text: "#fafafa",
  textMuted: "#a1a1aa",
};

// ============ BACKGROUND ============
const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const blob1Y = Math.sin(frame / 60) * 30;
  const blob2Y = Math.cos(frame / 45) * 25;

  return (
    <AbsoluteFill>
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
        }}
      />
      {/* Animated blobs */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          top: `${20 + blob1Y * 0.1}%`,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "5%",
          top: `${50 + blob2Y * 0.1}%`,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.secondary}12 0%, transparent 70%)`,
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "60%",
          bottom: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.tertiary}10 0%, transparent 70%)`,
          filter: "blur(45px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ============ HOOK SCENE ============
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame, fps, config: { damping: 20 } });
  const line2 = spring({ frame: frame - 15, fps, config: { damping: 20 } });
  const line3 = spring({ frame: frame - 30, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 900 }}>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [30, 0])}px)`,
            marginBottom: 20,
          }}
        >
          What if your phone
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [30, 0])}px)`,
            marginBottom: 20,
          }}
        >
          helped you become
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 600,
            color: colors.text,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [30, 0])}px)`,
          }}
        >
          who you want to be?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SETUP SCENE - Phone slides in with name screen ============
const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 500,
            color: colors.primary,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Personalized from day one
        </div>
      </div>

      {/* Phone */}
      <AnimatedPhone
        screenshot="assets/becoming-app/01-name-input.png"
        scale={1.8}
        y={80}
        entranceFrom="bottom"
        entranceDelay={0}
      />
    </AbsoluteFill>
  );
};

// ============ THREE PILLARS SCENE ============
const ThreePillarsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textEntrance,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 10,
          }}
        >
          Three pillars guide your journey
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 24,
            color: colors.textMuted,
          }}
        >
          Direction → Signals → Reflect
        </div>
      </div>

      {/* Phone with zoom effect */}
      <AnimatedPhone
        screenshot="assets/becoming-app/02-three-pillars.png"
        scale={1.8}
        y={100}
        entranceFrom="scale"
        entranceDelay={0}
        zoomTo={{ x: 0, y: -30, scale: 1.15 }}
        zoomDelay={30}
      />
    </AbsoluteFill>
  );
};

// ============ IDENTITY GENERATION SCENE ============
const IdentityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Show input screen first, then switch to result
  const showResult = frame > durationInFrames * 0.45;

  const switchProgress = spring({
    frame: frame - durationInFrames * 0.45,
    fps,
    config: { damping: 15 },
  });

  const labelEntrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  const label2Entrance = spring({
    frame: frame - durationInFrames * 0.5,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        {!showResult ? (
          <div style={{ opacity: labelEntrance }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 28,
                fontWeight: 500,
                color: colors.secondary,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Define your goal
            </div>
          </div>
        ) : (
          <div style={{ opacity: label2Entrance }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 28,
                fontWeight: 500,
                color: colors.tertiary,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              AI crafts your identity
            </div>
          </div>
        )}
      </div>

      {/* Input screen */}
      <div
        style={{
          opacity: showResult ? 1 - switchProgress : 1,
          transform: showResult ? `translateX(${-200 * switchProgress}px) scale(${1 - 0.1 * switchProgress})` : "none",
        }}
      >
        <AnimatedPhone
          screenshot="assets/becoming-app/03-identity-input.png"
          scale={1.8}
          y={100}
          entranceFrom="bottom"
          entranceDelay={0}
        />
      </div>

      {/* Result screen */}
      {showResult && (
        <div
          style={{
            opacity: switchProgress,
            transform: `translateX(${200 * (1 - switchProgress)}px) scale(${0.9 + 0.1 * switchProgress})`,
          }}
        >
          <IPhoneMockup
            screenshot="assets/becoming-app/04-north-star.png"
            scale={1.8}
            y={100}
            zoomTo={{ x: 0, y: -50, scale: 1.1 }}
            zoomDelay={20}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ HERO SHOT - Lock Screen Notification ============
const HeroNotificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const glowPulse = Math.sin(frame / 15) * 0.3 + 1;

  const textEntrance = spring({
    frame: frame - 40,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Glow effect behind phone */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 900,
          background: `radial-gradient(ellipse, ${colors.primary}30 0%, transparent 60%)`,
          filter: "blur(60px)",
          opacity: phoneEntrance * glowPulse,
        }}
      />

      {/* Phone */}
      <div
        style={{
          opacity: phoneEntrance,
          transform: `scale(${interpolate(phoneEntrance, [0, 1], [0.8, 1])})`,
        }}
      >
        <IPhoneMockup
          screenshot="assets/becoming-app/10-lock-screen.png"
          scale={2}
          y={0}
          showFrame={true}
        />
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 500,
            color: colors.text,
            marginBottom: 10,
          }}
        >
          Daily signals that speak to{" "}
          <span style={{ color: colors.primary }}>you</span>
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
            color: colors.textMuted,
          }}
        >
          Personalized nudges throughout your day
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ DAILY RITUAL SCENE ============
const DailyRitualScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const showCheckin = frame > durationInFrames * 0.5;

  const phone1Entrance = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  const phone2Entrance = spring({
    frame: frame - durationInFrames * 0.5,
    fps,
    config: { damping: 15 },
  });

  const labelEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelEntrance,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 600,
            color: colors.text,
          }}
        >
          {showCheckin ? "Reflect on your day" : "Track your journey"}
        </div>
      </div>

      {/* Home screen */}
      <div
        style={{
          opacity: showCheckin ? 1 - phone2Entrance : phone1Entrance,
          transform: `translateX(${showCheckin ? -150 * phone2Entrance : 0}px)`,
        }}
      >
        <IPhoneMockup
          screenshot="assets/becoming-app/09-home-screen.png"
          scale={1.8}
          y={80}
        />
      </div>

      {/* Check-in screen */}
      {showCheckin && (
        <div
          style={{
            opacity: phone2Entrance,
            transform: `translateX(${150 * (1 - phone2Entrance)}px)`,
          }}
        >
          <IPhoneMockup
            screenshot="assets/becoming-app/11-check-in.png"
            scale={1.8}
            y={80}
          />
        </div>
      )}
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
    config: { damping: 12 },
  });

  const taglineEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  const buttonEntrance = spring({
    frame: frame - 40,
    fps,
    config: { damping: 15 },
  });

  const pulse = Math.sin(frame / 10) * 0.02 + 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 60%)`,
          filter: "blur(80px)",
          opacity: logoEntrance,
        }}
      />

      <div style={{ textAlign: "center" }}>
        {/* Logo text */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 72,
            fontWeight: 700,
            fontStyle: "italic",
            color: colors.text,
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.8, 1])})`,
            marginBottom: 20,
          }}
        >
          The Becoming
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            color: colors.textMuted,
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 50,
          }}
        >
          Identity-based transformation
        </div>

        {/* CTA Button */}
        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1]) * pulse})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              padding: "24px 60px",
              borderRadius: 50,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: colors.backgroundDark,
            }}
          >
            Start Your Transformation
          </div>
        </div>

        {/* App store hint */}
        <div
          style={{
            marginTop: 30,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 18,
            color: colors.textMuted,
            opacity: buttonEntrance,
          }}
        >
          Available on iOS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const ProductShowcase: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      <AnimatedBackground />

      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps} premountFor={fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Setup - Name input (3-6s) */}
      <Sequence from={3 * fps} durationInFrames={3 * fps} premountFor={fps}>
        <SetupScene />
      </Sequence>

      {/* Scene 3: Three Pillars (6-9.5s) */}
      <Sequence from={6 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <ThreePillarsScene />
      </Sequence>

      {/* Scene 4: Identity creation (9.5-15s) */}
      <Sequence from={9.5 * fps} durationInFrames={5.5 * fps} premountFor={fps}>
        <IdentityScene />
      </Sequence>

      {/* Scene 5: HERO - Lock screen notification (15-20s) */}
      <Sequence from={15 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <HeroNotificationScene />
      </Sequence>

      {/* Scene 6: Daily ritual (20-25s) */}
      <Sequence from={20 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <DailyRitualScene />
      </Sequence>

      {/* Scene 7: CTA (25-30s) */}
      <Sequence from={25 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
