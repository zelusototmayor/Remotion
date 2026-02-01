import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { IPhoneMockup } from "./components/IPhoneMockup";

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

// ============ ANIMATED BACKGROUND ============
const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const blob1Y = Math.sin(frame / 60) * 30;
  const blob2Y = Math.cos(frame / 45) * 25;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${colors.background} 0%, ${colors.backgroundDark} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "5%",
          top: `${15 + blob1Y * 0.1}%`,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "0%",
          top: `${45 + blob2Y * 0.1}%`,
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
    </AbsoluteFill>
  );
};

// ============ GIANT KINETIC HOOK ============
const KineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each line slams in with spring bounce
  const line1 = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const line2 = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const line3 = spring({
    frame: frame - 24,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const line4 = spring({
    frame: frame - 36,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  // "meant" word emphasis
  const meantGlow = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Line 1 */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 68,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [80, 0])}px) scale(${interpolate(line1, [0, 1], [1.2, 1])})`,
            marginBottom: 15,
          }}
        >
          What if your phone
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 68,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [80, 0])}px) scale(${interpolate(line2, [0, 1], [1.2, 1])})`,
            marginBottom: 15,
          }}
        >
          helped you become
        </div>

        {/* Line 3 */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 78,
            fontWeight: 600,
            color: colors.text,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [80, 0])}px) scale(${interpolate(line3, [0, 1], [1.2, 1])})`,
            marginBottom: 15,
          }}
        >
          who you were
        </div>

        {/* Line 4 - MEANT with emphasis */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 100,
            fontWeight: 800,
            fontStyle: "italic",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: line4,
            transform: `translateY(${interpolate(line4, [0, 1], [100, 0])}px) scale(${interpolate(line4, [0, 1], [1.3, 1])})`,
            textShadow: `0 0 ${60 * meantGlow}px ${colors.primary}`,
            filter: `drop-shadow(0 0 ${30 * meantGlow}px ${colors.primary}80)`,
          }}
        >
          meant to be?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ THREE PILLARS WITH VIDEO ============
const ThreePillarsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const textEntrance = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Big label at top */}
      <div
        style={{
          position: "absolute",
          top: 80,
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
            fontSize: 52,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 15,
          }}
        >
          Your path to transformation
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 32,
            fontWeight: 500,
            color: colors.primary,
          }}
        >
          Direction • Signals • Reflect
        </div>
      </div>

      {/* Phone with video inside */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: `translate(-50%, -50%) scale(${interpolate(phoneEntrance, [0, 1], [0.8, 1.4])})`,
          opacity: phoneEntrance,
        }}
      >
        <PhoneWithVideo videoSrc="assets/becoming-app/three-pillars-recording.mov" />
      </div>
    </AbsoluteFill>
  );
};

// Phone mockup that accepts video
const PhoneWithVideo: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
        background: "#000",
      }}
    >
      <Video
        src={staticFile(videoSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: bezelRadius - 4,
        }}
        muted
      />
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 150,
          height: 35,
          background: "#000",
          borderRadius: 20,
        }}
      />
    </div>
  );
};

// ============ IDENTITY REVEAL ============
const IdentityReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const midPoint = durationInFrames * 0.4;
  const showResult = frame > midPoint;

  const labelEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const phone1Entrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });

  const transitionProgress = spring({
    frame: frame - midPoint,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  const label2Entrance = spring({
    frame: frame - midPoint - 10,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      {/* Labels */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {!showResult ? (
          <div style={{ opacity: labelEntrance }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                color: colors.text,
                marginBottom: 10,
              }}
            >
              Define your aspiration
            </div>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 28,
                color: colors.secondary,
              }}
            >
              What do you want to achieve?
            </div>
          </div>
        ) : (
          <div style={{ opacity: label2Entrance }}>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 48,
                fontWeight: 700,
                color: colors.text,
                marginBottom: 10,
              }}
            >
              AI crafts your identity
            </div>
            <div
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 28,
                color: colors.tertiary,
              }}
            >
              Your north star is born
            </div>
          </div>
        )}
      </div>

      {/* Phone 1 - Input */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: `translate(-50%, -50%)
            translateX(${showResult ? -300 * transitionProgress : 0}px)
            scale(${showResult ? 1.3 - 0.4 * transitionProgress : interpolate(phone1Entrance, [0, 1], [0.9, 1.3])})
            rotateY(${showResult ? -15 * transitionProgress : 0}deg)`,
          opacity: showResult ? 1 - transitionProgress * 0.8 : phone1Entrance,
        }}
      >
        <IPhoneMockup
          screenshot="assets/becoming-app/03-identity-input.png"
          scale={1}
        />
      </div>

      {/* Phone 2 - Result */}
      {showResult && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: `translate(-50%, -50%)
              translateX(${300 * (1 - transitionProgress)}px)
              scale(${0.9 + 0.4 * transitionProgress})
              rotateY(${15 * (1 - transitionProgress)}deg)`,
            opacity: transitionProgress,
          }}
        >
          <IPhoneMockup
            screenshot="assets/becoming-app/04-north-star.png"
            scale={1}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ HERO: ANIMATED NOTIFICATION ============
const HeroNotification: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 60 },
  });

  // Notification slides in after phone appears
  const notificationDelay = 35;
  const notificationSlide = spring({
    frame: frame - notificationDelay,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const textEntrance = spring({
    frame: frame - notificationDelay - 20,
    fps,
    config: { damping: 200 },
  });

  const glowPulse = interpolate(
    Math.sin(frame / 12),
    [-1, 1],
    [0.7, 1],
  );

  return (
    <AbsoluteFill>
      {/* Glow behind phone */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 800,
          background: `radial-gradient(ellipse, ${colors.primary}35 0%, transparent 60%)`,
          filter: "blur(80px)",
          opacity: phoneEntrance * glowPulse,
        }}
      />

      {/* Phone container with notification overlay */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: `translate(-50%, -50%) scale(${interpolate(phoneEntrance, [0, 1], [0.7, 1.5])})`,
          opacity: phoneEntrance,
        }}
      >
        <PhoneWithNotification
          notificationProgress={notificationSlide}
        />
      </div>

      {/* Big text below */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textEntrance,
          transform: `translateY(${interpolate(textEntrance, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 15,
          }}
        >
          Signals that speak to{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            you
          </span>
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            color: colors.textMuted,
          }}
        >
          Personalized nudges throughout your day
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Phone with animated notification
const PhoneWithNotification: React.FC<{ notificationProgress: number }> = ({
  notificationProgress,
}) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;

  // Notification slides down from top
  const notificationY = interpolate(notificationProgress, [0, 1], [-100, 650]);
  const notificationOpacity = notificationProgress;

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.6), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
        background: "#000",
      }}
    >
      {/* Lock screen background - simplified */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        {/* Time */}
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 200,
            color: "#fff",
            letterSpacing: -2,
          }}
        >
          9:41
        </div>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 18,
            color: "#999",
            marginTop: 5,
          }}
        >
          Wednesday, January 21
        </div>
      </div>

      {/* Animated notification */}
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: notificationY,
          opacity: notificationOpacity,
          background: "rgba(40, 40, 50, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          padding: 14,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* App icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          🚀
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              The Becoming
            </div>
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 13,
                color: "#888",
              }}
            >
              now
            </div>
          </div>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 15,
              color: "#ddd",
              lineHeight: 1.35,
            }}
          >
            Every choice today is a step toward your self-reliant and balanced life.
          </div>
        </div>
      </div>

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
  );
};

// ============ DAILY RITUAL ============
const DailyRitual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const midPoint = durationInFrames * 0.45;
  const showCheckin = frame > midPoint;

  const labelEntrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const phone1Entrance = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15 },
  });

  const transitionProgress = spring({
    frame: frame - midPoint,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: labelEntrance,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: colors.text,
            marginBottom: 15,
          }}
        >
          {showCheckin ? "Reflect on your alignment" : "Track your journey"}
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 28,
            color: showCheckin ? colors.tertiary : colors.primary,
          }}
        >
          {showCheckin ? "Were you that person today?" : "Day 1 of your transformation"}
        </div>
      </div>

      {/* Home screen */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: `translate(-50%, -50%)
            translateX(${showCheckin ? -250 * transitionProgress : 0}px)
            scale(${showCheckin ? 1.3 - 0.3 * transitionProgress : interpolate(phone1Entrance, [0, 1], [0.9, 1.3])})`,
          opacity: showCheckin ? 1 - transitionProgress * 0.7 : phone1Entrance,
        }}
      >
        <IPhoneMockup
          screenshot="assets/becoming-app/09-home-screen.png"
          scale={1}
        />
      </div>

      {/* Check-in screen */}
      {showCheckin && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: `translate(-50%, -50%)
              translateX(${250 * (1 - transitionProgress)}px)
              scale(${1 + 0.3 * transitionProgress})`,
            opacity: transitionProgress,
          }}
        >
          <IPhoneMockup
            screenshot="assets/becoming-app/11-check-in.png"
            scale={1}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ CTA ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 60 },
  });

  const taglineEntrance = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  const buttonEntrance = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12 },
  });

  const pulse = interpolate(Math.sin(frame / 8), [-1, 1], [0.98, 1.02]);

  const glowIntensity = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Big glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${colors.primary}25 0%, transparent 60%)`,
          filter: "blur(100px)",
          opacity: logoEntrance * glowIntensity,
        }}
      />

      <div style={{ textAlign: "center" }}>
        {/* Logo */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 90,
            fontWeight: 700,
            fontStyle: "italic",
            color: colors.text,
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.6, 1])}) translateY(${interpolate(logoEntrance, [0, 1], [50, 0])}px)`,
            marginBottom: 25,
            textShadow: `0 0 ${40 * glowIntensity}px ${colors.primary}40`,
          }}
        >
          The Becoming
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 36,
            color: colors.textMuted,
            opacity: taglineEntrance,
            transform: `translateY(${interpolate(taglineEntrance, [0, 1], [30, 0])}px)`,
            marginBottom: 50,
          }}
        >
          Identity-based transformation
        </div>

        {/* Button */}
        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.7, 1]) * pulse}) translateY(${interpolate(buttonEntrance, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              padding: "28px 70px",
              borderRadius: 60,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: colors.backgroundDark,
              boxShadow: `0 20px 60px ${colors.primary}40`,
            }}
          >
            Start Your Transformation
          </div>
        </div>

        {/* Platform */}
        <div
          style={{
            marginTop: 35,
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 22,
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
export const ProductShowcaseV2: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      <AnimatedBackground />

      {/* Scene 1: Kinetic Hook (0-4s) */}
      <Sequence from={0} durationInFrames={4 * fps} premountFor={fps}>
        <KineticHook />
      </Sequence>

      {/* Scene 2: Three Pillars Video (4-9s) */}
      <Sequence from={4 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <ThreePillarsVideo />
      </Sequence>

      {/* Scene 3: Identity Reveal (9-15s) */}
      <Sequence from={9 * fps} durationInFrames={6 * fps} premountFor={fps}>
        <IdentityReveal />
      </Sequence>

      {/* Scene 4: HERO - Notification (15-21s) */}
      <Sequence from={15 * fps} durationInFrames={6 * fps} premountFor={fps}>
        <HeroNotification />
      </Sequence>

      {/* Scene 5: Daily Ritual (21-26s) */}
      <Sequence from={21 * fps} durationInFrames={5 * fps} premountFor={fps}>
        <DailyRitual />
      </Sequence>

      {/* Scene 6: CTA (26-30s) */}
      <Sequence from={26 * fps} durationInFrames={4 * fps} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
