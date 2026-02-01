import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  staticFile,
  Img,
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

// ============ SCENE HEADER - BIGGER AND LOWER ============
const SceneHeader: React.FC<{
  title: string;
  subtitle: string;
  titleColor?: string;
}> = ({ title, subtitle, titleColor = colors.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 140, // Lower position
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 64, // Bigger
          fontWeight: 700,
          color: titleColor,
          marginBottom: 16,
          lineHeight: 1.1,
          padding: "0 40px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 34, // Bigger
          fontWeight: 500,
          color: colors.textMuted,
          padding: "0 50px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ============ PHONE WITH ENTER/EXIT ANIMATIONS ============
const AnimatedPhoneScene: React.FC<{
  screenshot: string;
  enterDelay?: number;
  exitStartFrame?: number;
}> = ({ screenshot, enterDelay = 8, exitStartFrame }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance: slide in from right
  const entrance = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Exit: slide out to left (starts near end of scene)
  const exitStart = exitStartFrame ?? durationInFrames - 15;
  const exitProgress = spring({
    frame: frame - exitStart,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  const isExiting = frame >= exitStart;

  // Calculate position
  const enterX = interpolate(entrance, [0, 1], [400, 0]);
  const exitX = interpolate(exitProgress, [0, 1], [0, -400]);
  const finalX = isExiting ? exitX : enterX;

  const enterScale = interpolate(entrance, [0, 1], [0.85, 1.3]);
  const exitScale = interpolate(exitProgress, [0, 1], [1.3, 1.1]);
  const finalScale = isExiting ? exitScale : enterScale;

  const enterOpacity = entrance;
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0.3]);
  const finalOpacity = isExiting ? exitOpacity : enterOpacity;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        transform: `translate(-50%, -50%) translateX(${finalX}px) scale(${finalScale})`,
        opacity: finalOpacity,
      }}
    >
      <IPhoneMockup screenshot={screenshot} scale={1} />
    </div>
  );
};

// ============ GIANT KINETIC HOOK ============
const KineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const line2 = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 100 } });
  const line3 = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const line4 = spring({ frame: frame - 30, fps, config: { damping: 10, stiffness: 80 } });

  const meantGlow = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [60, 0])}px) scale(${interpolate(line1, [0, 1], [1.15, 1])})`,
            marginBottom: 12,
          }}
        >
          What if your phone
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 64,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [60, 0])}px) scale(${interpolate(line2, [0, 1], [1.15, 1])})`,
            marginBottom: 12,
          }}
        >
          helped you become
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 72,
            fontWeight: 600,
            color: colors.text,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [60, 0])}px) scale(${interpolate(line3, [0, 1], [1.15, 1])})`,
            marginBottom: 12,
          }}
        >
          who you were
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 90,
            fontWeight: 800,
            fontStyle: "italic",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: line4,
            transform: `translateY(${interpolate(line4, [0, 1], [80, 0])}px) scale(${interpolate(line4, [0, 1], [1.2, 1])})`,
            filter: `drop-shadow(0 0 ${25 * meantGlow}px ${colors.primary}80)`,
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
  const { fps, durationInFrames } = useVideoConfig();

  const phoneEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  // Exit animation
  const exitStart = durationInFrames - 15;
  const exitProgress = spring({
    frame: frame - exitStart,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const isExiting = frame >= exitStart;

  const enterX = interpolate(phoneEntrance, [0, 1], [400, 0]);
  const exitX = interpolate(exitProgress, [0, 1], [0, -400]);
  const finalX = isExiting ? exitX : enterX;

  const enterScale = interpolate(phoneEntrance, [0, 1], [0.8, 1.3]);
  const exitScale = interpolate(exitProgress, [0, 1], [1.3, 1.1]);
  const finalScale = isExiting ? exitScale : enterScale;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="Your path to transformation"
        subtitle="Direction • Signals • Reflect"
        titleColor={colors.text}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: `translate(-50%, -50%) translateX(${finalX}px) scale(${finalScale})`,
          opacity: isExiting ? interpolate(exitProgress, [0, 1], [1, 0.3]) : phoneEntrance,
        }}
      >
        <PhoneWithVideo videoSrc="assets/becoming-app/three-pillars-recording.mov" />
      </div>
    </AbsoluteFill>
  );
};

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
        boxShadow: "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
        background: "#000",
      }}
    >
      <Video
        src={staticFile(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: bezelRadius - 4 }}
        muted
      />
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

// ============ DEFINE YOUR GOALS ============
const DefineGoalsScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SceneHeader
        title="Define Your Goals"
        subtitle="What do you want to achieve?"
        titleColor={colors.secondary}
      />
      <AnimatedPhoneScene screenshot="assets/becoming-app/03-identity-input.png" />
    </AbsoluteFill>
  );
};

// ============ AI CRAFTS IDENTITY ============
const AICraftsIdentityScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <SceneHeader
        title="AI Crafts Your Identity"
        subtitle="Become the person that achieves your goals"
        titleColor={colors.tertiary}
      />
      <AnimatedPhoneScene screenshot="assets/becoming-app/04-north-star.png" />
    </AbsoluteFill>
  );
};

// ============ GET NOTIFIED ============
const GetNotifiedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const phoneEntrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const notificationSlide = spring({
    frame: frame - 35,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Exit animation
  const exitStart = durationInFrames - 15;
  const exitProgress = spring({
    frame: frame - exitStart,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const isExiting = frame >= exitStart;

  const enterX = interpolate(phoneEntrance, [0, 1], [400, 0]);
  const exitX = interpolate(exitProgress, [0, 1], [0, -400]);
  const finalX = isExiting ? exitX : enterX;

  const enterScale = interpolate(phoneEntrance, [0, 1], [0.85, 1.3]);
  const exitScale = interpolate(exitProgress, [0, 1], [1.3, 1.1]);
  const finalScale = isExiting ? exitScale : enterScale;

  return (
    <AbsoluteFill>
      <SceneHeader
        title="Get Notified"
        subtitle="Daily signals that speak to you"
        titleColor={colors.primary}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: `translate(-50%, -50%) translateX(${finalX}px) scale(${finalScale})`,
          opacity: isExiting ? interpolate(exitProgress, [0, 1], [1, 0.3]) : phoneEntrance,
        }}
      >
        <PhoneWithNotification notificationProgress={notificationSlide} />
      </div>
    </AbsoluteFill>
  );
};

const PhoneWithNotification: React.FC<{ notificationProgress: number }> = ({
  notificationProgress,
}) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;
  const notificationY = interpolate(notificationProgress, [0, 1], [-120, 620]);

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
        background: "#000",
      }}
    >
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
        <div style={{ fontFamily: "system-ui", fontSize: 72, fontWeight: 200, color: "#fff", letterSpacing: -2 }}>
          9:41
        </div>
        <div style={{ fontFamily: "system-ui", fontSize: 18, color: "#999", marginTop: 5 }}>
          Wednesday, January 21
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: notificationY,
          opacity: notificationProgress,
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
        <Img
          src={staticFile("assets/becoming-app/logo-with-bg.png")}
          style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontFamily: "system-ui", fontSize: 15, fontWeight: 600, color: "#fff" }}>The Becoming</div>
            <div style={{ fontFamily: "system-ui", fontSize: 13, color: "#888" }}>now</div>
          </div>
          <div style={{ fontFamily: "system-ui", fontSize: 15, color: "#ddd", lineHeight: 1.35 }}>
            Every choice today is a step toward your self-reliant and balanced life.
          </div>
        </div>
      </div>

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

// ============ TRACK YOUR JOURNEY ============
const TrackJourneyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const midPoint = durationInFrames * 0.45;
  const showCheckin = frame > midPoint;

  const phone1Entrance = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const transitionProgress = spring({
    frame: frame - midPoint,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <AbsoluteFill>
      <SceneHeader
        title="Track Your Journey"
        subtitle="Reflect on your alignment"
        titleColor={colors.text}
      />

      {/* Home screen - exits left */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          transform: `translate(-50%, -50%)
            translateX(${showCheckin ? interpolate(transitionProgress, [0, 1], [0, -400]) : interpolate(phone1Entrance, [0, 1], [400, 0])}px)
            scale(${showCheckin ? interpolate(transitionProgress, [0, 1], [1.3, 1.1]) : interpolate(phone1Entrance, [0, 1], [0.85, 1.3])})`,
          opacity: showCheckin ? interpolate(transitionProgress, [0, 1], [1, 0.3]) : phone1Entrance,
        }}
      >
        <IPhoneMockup screenshot="assets/becoming-app/09-home-screen.png" scale={1} />
      </div>

      {/* Check-in screen - enters from right */}
      {showCheckin && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "58%",
            transform: `translate(-50%, -50%)
              translateX(${interpolate(transitionProgress, [0, 1], [400, 0])}px)
              scale(${interpolate(transitionProgress, [0, 1], [0.85, 1.3])})`,
            opacity: transitionProgress,
          }}
        >
          <IPhoneMockup screenshot="assets/becoming-app/11-check-in.png" scale={1} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ============ CTA - MUCH BIGGER ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const textEntrance = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const buttonEntrance = spring({ frame: frame - 30, fps, config: { damping: 15 } });

  const logoPulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.95, 1.05]);
  const logoGlow = interpolate(Math.sin(frame / 18), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Big glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${colors.primary}35 0%, ${colors.secondary}25 40%, transparent 70%)`,
          filter: "blur(100px)",
          opacity: logoEntrance * logoGlow,
        }}
      />

      <div style={{ textAlign: "center" }}>
        {/* BIGGER Pulsing Logo */}
        <div
          style={{
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.4, 1]) * logoPulse})`,
            marginBottom: 40,
          }}
        >
          <Img
            src={staticFile("assets/becoming-app/logo-no-bg.png")}
            style={{
              width: 280, // Much bigger
              height: 280,
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${40 * logoGlow}px ${colors.primary}70)`,
            }}
          />
        </div>

        {/* BIGGER Text */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 100, // Much bigger
            fontWeight: 700,
            fontStyle: "italic",
            color: colors.text,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
            marginBottom: 20,
          }}
        >
          Becoming...
        </div>

        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 44, // Much bigger
            fontWeight: 500,
            color: colors.textMuted,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 55,
          }}
        >
          Motivation Made For You
        </div>

        {/* BIGGER Button */}
        <div
          style={{
            opacity: buttonEntrance,
            transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1])}) translateY(${interpolate(buttonEntrance, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`,
              padding: "32px 65px", // Bigger padding
              borderRadius: 55,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 34, // Bigger text
              fontWeight: 700,
              color: colors.backgroundDark,
              boxShadow: `0 25px 70px ${colors.primary}50`,
            }}
          >
            Available in the App Store
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION - SHORTER SCENES ============
export const ProductShowcaseV4: React.FC = () => {
  const { fps } = useVideoConfig();

  // Shorter durations
  const hookDuration = 3.5 * fps;      // 3.5s
  const pillarsDuration = 3 * fps;     // 3s
  const goalsDuration = 3 * fps;       // 3s
  const identityDuration = 3 * fps;    // 3s
  const notifyDuration = 3.5 * fps;    // 3.5s
  const trackDuration = 4 * fps;       // 4s (has internal transition)
  const ctaDuration = 4 * fps;         // 4s

  let currentFrame = 0;

  const scenes = [
    { start: currentFrame, duration: hookDuration },
    { start: (currentFrame += hookDuration), duration: pillarsDuration },
    { start: (currentFrame += pillarsDuration), duration: goalsDuration },
    { start: (currentFrame += goalsDuration), duration: identityDuration },
    { start: (currentFrame += identityDuration), duration: notifyDuration },
    { start: (currentFrame += notifyDuration), duration: trackDuration },
    { start: (currentFrame += trackDuration), duration: ctaDuration },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      <AnimatedBackground />

      {/* Scene 1: Hook */}
      <Sequence from={scenes[0].start} durationInFrames={scenes[0].duration} premountFor={fps}>
        <KineticHook />
      </Sequence>

      {/* Scene 2: Three Pillars */}
      <Sequence from={scenes[1].start} durationInFrames={scenes[1].duration} premountFor={fps}>
        <ThreePillarsVideo />
      </Sequence>

      {/* Scene 3: Define Your Goals */}
      <Sequence from={scenes[2].start} durationInFrames={scenes[2].duration} premountFor={fps}>
        <DefineGoalsScene />
      </Sequence>

      {/* Scene 4: AI Crafts Identity */}
      <Sequence from={scenes[3].start} durationInFrames={scenes[3].duration} premountFor={fps}>
        <AICraftsIdentityScene />
      </Sequence>

      {/* Scene 5: Get Notified */}
      <Sequence from={scenes[4].start} durationInFrames={scenes[4].duration} premountFor={fps}>
        <GetNotifiedScene />
      </Sequence>

      {/* Scene 6: Track Your Journey */}
      <Sequence from={scenes[5].start} durationInFrames={scenes[5].duration} premountFor={fps}>
        <TrackJourneyScene />
      </Sequence>

      {/* Scene 7: CTA */}
      <Sequence from={scenes[6].start} durationInFrames={scenes[6].duration} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
