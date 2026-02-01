import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  staticFile,
  Img,
  Easing,
  random,
  Audio,
} from "remotion";
import { OffthreadVideo } from "remotion";
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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${colors.background} 0%, ${colors.backgroundDark} 100%)` }} />
      <div style={{ position: "absolute", left: "5%", top: `${15 + blob1Y * 0.1}%`, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", right: "0%", top: `${45 + blob2Y * 0.1}%`, width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`, filter: "blur(70px)" }} />
    </AbsoluteFill>
  );
};

// ============ FLOATING DUST PARTICLES ============
const DustParticles: React.FC<{ count?: number }> = ({ count = 40 }) => {
  const frame = useCurrentFrame();
  const particles = [];

  for (let i = 0; i < count; i++) {
    // Use random with seed for consistent positions
    const startX = random(`dust-x-${i}`) * 100;
    const startY = random(`dust-y-${i}`) * 100;
    const size = 2 + random(`dust-size-${i}`) * 6;
    const speed = 0.3 + random(`dust-speed-${i}`) * 0.7;
    const delay = random(`dust-delay-${i}`) * 100;
    const color = random(`dust-color-${i}`) > 0.5 ? colors.primary : colors.secondary;

    // Floating motion
    const floatX = Math.sin((frame + delay) / (40 * speed)) * 30;
    const floatY = Math.cos((frame + delay) / (30 * speed)) * 20;
    const opacity = 0.3 + Math.sin((frame + delay) / 25) * 0.2;

    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${startX}%`,
          top: `${startY}%`,
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          opacity,
          transform: `translate(${floatX}px, ${floatY}px)`,
          filter: `blur(${size > 5 ? 1 : 0}px)`,
          boxShadow: `0 0 ${size * 2}px ${color}80`,
        }}
      />
    );
  }

  return <AbsoluteFill style={{ overflow: "hidden" }}>{particles}</AbsoluteFill>;
};

// ============ TYPEWRITER TEXT ============
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  charsPerFrame?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, fontSize, fontWeight, color, charsPerFrame = 0.8, style = {} }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  const visibleText = text.slice(0, visibleChars);

  // Cursor blink
  const showCursor = visibleChars < text.length && Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      {visibleText}
      {showCursor && <span style={{ opacity: 0.8 }}>|</span>}
    </div>
  );
};

// ============ LETTER POP TEXT ============
const LetterPopText: React.FC<{
  text: string;
  startFrame: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  delayPerLetter?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, fontSize, fontWeight, color, delayPerLetter = 2, style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        ...style,
      }}
    >
      {letters.map((letter, i) => {
        const letterStart = startFrame + i * delayPerLetter;
        const progress = spring({
          frame: frame - letterStart,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        return (
          <span
            key={i}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize,
              fontWeight,
              color,
              display: "inline-block",
              opacity: Math.max(0, progress),
              transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])}) translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
              whiteSpace: letter === " " ? "pre" : "normal",
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

// ============ CINEMATIC HOOK ============
const CinematicHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from black
  const fadeFromBlack = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // "Become" - bouncy and prominent (app name!)
  const becomeOpacity = interpolate(frame, [80, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const becomeScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 8, stiffness: 100 },
  });
  const becomeGlow = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "who you were meant to be" - one punch
  const line4Opacity = interpolate(frame, [115, 128], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line4Y = interpolate(frame, [115, 128], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // Subtle zoom
  const sceneScale = interpolate(frame, [0, 150], [1, 1.02], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50, opacity: fadeFromBlack }}>
      <div style={{ textAlign: "center", transform: `scale(${sceneScale})` }}>
        {/* "What if" - typewriter */}
        <TypewriterText
          text="What if"
          startFrame={5}
          fontSize={56}
          fontWeight={300}
          color={colors.textMuted}
          charsPerFrame={1.2}
          style={{ marginBottom: 18, letterSpacing: 1 }}
        />

        {/* "your phone could help you" - typewriter */}
        <TypewriterText
          text="your phone could help you"
          startFrame={35}
          fontSize={50}
          fontWeight={400}
          color={colors.text}
          charsPerFrame={1.5}
          style={{ marginBottom: 25, lineHeight: 1.3 }}
        />

        {/* "Become" - bold white, pop in */}
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 85,
            fontWeight: 800,
            color: colors.text,
            opacity: becomeOpacity,
            transform: `scale(${Math.max(becomeScale, 0)})`,
            marginBottom: 20,
            letterSpacing: -1,
          }}
        >
          Become
        </div>

        {/* "who you were meant to be" - letter pop */}
        <div style={{ opacity: line4Opacity, transform: `translateY(${line4Y}px)` }}>
          <LetterPopText
            text="who you were meant to be"
            startFrame={118}
            fontSize={72}
            fontWeight={700}
            color={colors.primary}
            delayPerLetter={1}
            style={{
              fontStyle: "italic",
              filter: `drop-shadow(0 0 ${25 * becomeGlow}px ${colors.primary}70)`,
              lineHeight: 1.2,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ SLIDE DATA ============
interface SlideData {
  title: string;
  subtitle: string;
  titleColor: string;
  holdDuration: number;
}

const slides: SlideData[] = [
  { title: "Your Path to Transformation", subtitle: "Direction • Signals • Reflect", titleColor: colors.text, holdDuration: 95 },
  { title: "Define Your Goals", subtitle: "What do you want to achieve?", titleColor: colors.secondary, holdDuration: 70 },
  { title: "AI Crafts Your Identity", subtitle: "Become the person that achieves your goals", titleColor: colors.tertiary, holdDuration: 70 },
  { title: "Get Notified", subtitle: "Daily signals that speak to you", titleColor: colors.primary, holdDuration: 85 },
  { title: "Track Your Journey", subtitle: "Day 1 of your transformation", titleColor: colors.text, holdDuration: 65 },
  { title: "Reflect Daily", subtitle: "Were you that person today?", titleColor: colors.tertiary, holdDuration: 65 },
];

const TRANSITION_FRAMES = 18;

// ============ ANIMATED CAROUSEL ============
const AnimatedCarousel: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate current slide
  let currentSlideIndex = 0;
  let frameInSlide = frame;
  let cumulativeFrames = 0;

  for (let i = 0; i < slides.length; i++) {
    const slideTotal = slides[i].holdDuration + TRANSITION_FRAMES;
    if (frame < cumulativeFrames + slideTotal) {
      currentSlideIndex = i;
      frameInSlide = frame - cumulativeFrames;
      break;
    }
    cumulativeFrames += slideTotal;
    if (i === slides.length - 1) {
      currentSlideIndex = slides.length - 1;
      frameInSlide = frame - cumulativeFrames + slideTotal;
    }
  }

  const currentSlide = slides[currentSlideIndex];
  const holdDuration = currentSlide.holdDuration;

  const isTransitioning = frameInSlide >= holdDuration;
  const transitionFrame = isTransitioning ? frameInSlide - holdDuration : 0;

  const transitionProgress = isTransitioning
    ? interpolate(transitionFrame, [0, TRANSITION_FRAMES], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    : 0;

  // Determine which slide to show for title
  const displaySlideIndex = isTransitioning && transitionProgress > 0.5
    ? Math.min(currentSlideIndex + 1, slides.length - 1)
    : currentSlideIndex;

  // Reset frameInSlide for new title animation
  const titleFrameInSlide = isTransitioning && transitionProgress > 0.5
    ? Math.floor((transitionProgress - 0.5) * TRANSITION_FRAMES * 2)
    : frameInSlide;

  return (
    <AbsoluteFill>
      {/* Animated Title with typewriter */}
      <AnimatedTitleV8
        slide={slides[displaySlideIndex]}
        frameInSlide={titleFrameInSlide}
        isNewSlide={isTransitioning && transitionProgress > 0.4 && transitionProgress < 0.6}
      />

      {/* Previous phone (left) */}
      {currentSlideIndex > 0 && !isTransitioning && (
        <PhonePosition position="left" opacity={0.2} scale={0.95}>
          <SlidePhone slideIndex={currentSlideIndex - 1} isCenter={false} />
        </PhonePosition>
      )}

      {/* Current phone sliding left during transition */}
      {isTransitioning && (
        <PhonePosition
          position="center"
          offsetX={interpolate(transitionProgress, [0, 1], [0, -400])}
          opacity={interpolate(transitionProgress, [0, 0.8, 1], [1, 0.4, 0.2])}
          scale={interpolate(transitionProgress, [0, 1], [1.45, 0.95])}
        >
          <SlidePhone slideIndex={currentSlideIndex} isCenter={false} />
        </PhonePosition>
      )}

      {/* Current phone in center */}
      {!isTransitioning && (
        <PhonePosition position="center" opacity={1} scale={1.45}>
          <SlidePhone slideIndex={currentSlideIndex} isCenter={true} frameInSlide={frameInSlide} />
        </PhonePosition>
      )}

      {/* Next phone sliding in */}
      {isTransitioning && currentSlideIndex < slides.length - 1 && (
        <PhonePosition
          position="center"
          offsetX={interpolate(transitionProgress, [0, 1], [400, 0])}
          opacity={interpolate(transitionProgress, [0, 0.2, 1], [0.2, 0.4, 1])}
          scale={interpolate(transitionProgress, [0, 1], [0.95, 1.45])}
        >
          <SlidePhone slideIndex={currentSlideIndex + 1} isCenter={transitionProgress > 0.7} />
        </PhonePosition>
      )}

      {/* Next phone (right) */}
      {currentSlideIndex < slides.length - 1 && !isTransitioning && (
        <PhonePosition position="right" opacity={0.2} scale={0.95}>
          <SlidePhone slideIndex={currentSlideIndex + 1} isCenter={false} />
        </PhonePosition>
      )}
    </AbsoluteFill>
  );
};

// ============ ANIMATED TITLE V8 ============
const AnimatedTitleV8: React.FC<{
  slide: SlideData;
  frameInSlide: number;
  isNewSlide: boolean;
}> = ({ slide, frameInSlide }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 20,
      }}
    >
      {/* Title with typewriter effect */}
      <TypewriterText
        text={slide.title}
        startFrame={0}
        fontSize={68}
        fontWeight={700}
        color={slide.titleColor}
        charsPerFrame={2}
        style={{
          marginBottom: 14,
          lineHeight: 1.1,
          padding: "0 35px",
          textShadow: `0 4px 30px ${slide.titleColor}40`,
        }}
      />
      {/* Subtitle with slight delay */}
      <TypewriterText
        text={slide.subtitle}
        startFrame={Math.ceil(slide.title.length / 2) + 5}
        fontSize={32}
        fontWeight={500}
        color={colors.textMuted}
        charsPerFrame={1.5}
        style={{ padding: "0 40px" }}
      />
    </div>
  );
};

// ============ PHONE POSITION WRAPPER ============
const PhonePosition: React.FC<{
  children: React.ReactNode;
  position: "left" | "center" | "right";
  offsetX?: number;
  opacity?: number;
  scale?: number;
}> = ({ children, position, offsetX = 0, opacity = 1, scale = 1 }) => {
  const baseX = position === "left" ? -360 : position === "right" ? 360 : 0;
  const zIndex = position === "center" ? 10 : 5;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "60%",
        transform: `translate(-50%, -50%) translateX(${baseX + offsetX}px) scale(${scale})`,
        opacity,
        zIndex,
      }}
    >
      {children}
    </div>
  );
};

// ============ SLIDE PHONE RENDERER ============
const SlidePhone: React.FC<{
  slideIndex: number;
  isCenter: boolean;
  frameInSlide?: number;
}> = ({ slideIndex, isCenter, frameInSlide = 0 }) => {
  if (slideIndex === 0) {
    return <PhoneWithVideo videoSrc="assets/becoming-app/three-pillars-recording.mp4" />;
  }

  if (slideIndex === 3) {
    const notificationProgress = isCenter
      ? interpolate(frameInSlide - 20, [0, 35], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 1;

    return <PhoneWithNotification notificationProgress={Math.min(notificationProgress, 1)} />;
  }

  const screenshots = [
    "",
    "assets/becoming-app/03-identity-input.png",
    "assets/becoming-app/04-north-star.png",
    "",
    "assets/becoming-app/09-home-screen.png",
    "assets/becoming-app/11-check-in.png",
  ];

  return <IPhoneMockup screenshot={screenshots[slideIndex]} scale={1} />;
};

// ============ PHONE WITH VIDEO ============
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
      <OffthreadVideo
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

// ============ PHONE WITH NOTIFICATION ============
const PhoneWithNotification: React.FC<{ notificationProgress: number }> = ({ notificationProgress }) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;
  const notificationY = interpolate(notificationProgress, [0, 1], [-100, 55]);

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

// ============ CTA SCENE ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoEntrance = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const textEntrance = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const buttonEntrance = spring({ frame: frame - 25, fps, config: { damping: 15 } });

  const logoPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.96, 1.04]);
  const logoGlow = interpolate(Math.sin(frame / 15), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${colors.primary}40 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(120px)",
          opacity: logoEntrance * logoGlow,
        }}
      />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            opacity: logoEntrance,
            transform: `scale(${interpolate(logoEntrance, [0, 1], [0.3, 1]) * logoPulse})`,
            marginBottom: 45,
          }}
        >
          <Img
            src={staticFile("assets/becoming-app/logo-no-bg.png")}
            style={{
              width: 320,
              height: 320,
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${50 * logoGlow}px ${colors.primary}80)`,
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110,
            fontWeight: 700,
            fontStyle: "italic",
            color: colors.text,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`,
            marginBottom: 22,
          }}
        >
          Becoming...
        </div>

        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 48,
            fontWeight: 500,
            color: colors.textMuted,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 60,
          }}
        >
          Motivation Made For You
        </div>

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
              padding: "36px 75px",
              borderRadius: 60,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 38,
              fontWeight: 700,
              color: colors.backgroundDark,
              boxShadow: `0 30px 80px ${colors.primary}50`,
            }}
          >
            Available in the App Store
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ EPIC TRANSITION SCENE ============
const EpicTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Introducing" appears first
  const introducingOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const introducingY = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  // "The Becoming App" - big and bold, with spring
  const mainTextScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 10, stiffness: 80 },
  });
  const mainTextOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow intensifies
  const glowIntensity = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out at end
  const fadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Animated dust particles */}
      <DustParticles count={50} />

      {/* Radial glow behind text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 600,
          background: `radial-gradient(ellipse, ${colors.primary}50 0%, ${colors.secondary}30 40%, transparent 70%)`,
          filter: "blur(80px)",
          opacity: glowIntensity * 0.8,
        }}
      />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {/* "Introducing" */}
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 400,
              color: colors.textMuted,
              opacity: introducingOpacity,
              transform: `translateY(${introducingY}px)`,
              marginBottom: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Introducing
          </div>

          {/* "The Becoming App" - BIG and prominent */}
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 90,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.primary} 50%, ${colors.secondary} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: mainTextOpacity,
              transform: `scale(${Math.max(mainTextScale, 0)})`,
              filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${colors.primary}90)`,
              lineHeight: 1.1,
            }}
          >
            The Becoming App
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const ProductShowcaseV8: React.FC = () => {
  const { fps } = useVideoConfig();

  const hookDuration = 5 * fps;
  const transitionDuration = 3 * fps; // 3s for epic transition

  const carouselDuration = slides.reduce((acc, slide) => acc + slide.holdDuration + TRANSITION_FRAMES, 0);
  const ctaDuration = 4 * fps;

  // Voiceover segment timings - each starts at section boundary, must end before next
  // Hook: 0-150 | Transition: 150-240 | Carousel: 240-798 | CTA: 798-900
  const voiceoverSegments = [
    { file: "voiceover-hook.mp3", startFrame: 20 },       // Start ~0.67s later, ends by 150
    { file: "voiceover-transition.mp3", startFrame: 150 }, // Ends by 240
    { file: "voiceover-carousel-1.mp3", startFrame: 240 }, // Ends by 353
    { file: "voiceover-carousel-2.mp3", startFrame: 353 }, // Ends by 441
    { file: "voiceover-carousel-3.mp3", startFrame: 441 }, // Ends by 529
    { file: "voiceover-carousel-4.mp3", startFrame: 529 }, // Ends by 632
    { file: "voiceover-carousel-5.mp3", startFrame: 632 }, // Ends by 715
    { file: "voiceover-carousel-6.mp3", startFrame: 715 }, // Ends by 798
    { file: "voiceover-cta.mp3", startFrame: 798 },        // Ends by 900
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      {/* Background Music */}
      <Audio src={staticFile("assets/becoming-app/background-music.mp3")} volume={0.3} />

      {/* Synced Voiceover Segments */}
      {voiceoverSegments.map((segment) => (
        <Sequence key={segment.file} from={segment.startFrame}>
          <Audio src={staticFile(`assets/becoming-app/${segment.file}`)} volume={1} />
        </Sequence>
      ))}

      <AnimatedBackground />

      {/* Cinematic Hook */}
      <Sequence from={0} durationInFrames={hookDuration} premountFor={fps}>
        <CinematicHook />
      </Sequence>

      {/* Epic Transition: "Introducing The Becoming App" */}
      <Sequence from={hookDuration} durationInFrames={transitionDuration} premountFor={fps}>
        <EpicTransition />
      </Sequence>

      {/* Animated Carousel */}
      <Sequence from={hookDuration + transitionDuration} durationInFrames={carouselDuration} premountFor={fps}>
        <AnimatedCarousel />
      </Sequence>

      {/* CTA */}
      <Sequence from={hookDuration + transitionDuration + carouselDuration} durationInFrames={ctaDuration} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
