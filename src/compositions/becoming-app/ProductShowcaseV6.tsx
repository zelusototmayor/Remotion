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
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${colors.background} 0%, ${colors.backgroundDark} 100%)` }} />
      <div style={{ position: "absolute", left: "5%", top: `${15 + blob1Y * 0.1}%`, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", right: "0%", top: `${45 + blob2Y * 0.1}%`, width: 450, height: 450, borderRadius: "50%", background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`, filter: "blur(70px)" }} />
    </AbsoluteFill>
  );
};

// ============ KINETIC HOOK ============
const KineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const line2 = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 100 } });
  const line3 = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 100 } });
  const line4 = spring({ frame: frame - 24, fps, config: { damping: 10, stiffness: 80 } });

  const meantGlow = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 62, fontWeight: 300, color: colors.textMuted, opacity: line1, transform: `translateY(${interpolate(line1, [0, 1], [50, 0])}px)`, marginBottom: 10 }}>
          What if your phone
        </div>
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 62, fontWeight: 300, color: colors.textMuted, opacity: line2, transform: `translateY(${interpolate(line2, [0, 1], [50, 0])}px)`, marginBottom: 10 }}>
          helped you become
        </div>
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 70, fontWeight: 600, color: colors.text, opacity: line3, transform: `translateY(${interpolate(line3, [0, 1], [50, 0])}px)`, marginBottom: 10 }}>
          who you were
        </div>
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 88, fontWeight: 800, fontStyle: "italic", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: line4, transform: `translateY(${interpolate(line4, [0, 1], [70, 0])}px)`, filter: `drop-shadow(0 0 ${25 * meantGlow}px ${colors.primary}80)` }}>
          meant to be?
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
  holdDuration: number; // frames to hold before transition
}

const slides: SlideData[] = [
  { title: "Your Path to Transformation", subtitle: "Direction • Signals • Reflect", titleColor: colors.text, holdDuration: 100 }, // ~3.3s for video
  { title: "Define Your Goals", subtitle: "What do you want to achieve?", titleColor: colors.secondary, holdDuration: 75 },
  { title: "AI Crafts Your Identity", subtitle: "Become the person that achieves your goals", titleColor: colors.tertiary, holdDuration: 75 },
  { title: "Get Notified", subtitle: "Daily signals that speak to you", titleColor: colors.primary, holdDuration: 90 }, // extra time for notification
  { title: "Track Your Journey", subtitle: "Day 1 of your transformation", titleColor: colors.text, holdDuration: 70 },
  { title: "Reflect Daily", subtitle: "Were you that person today?", titleColor: colors.tertiary, holdDuration: 70 },
];

const TRANSITION_FRAMES = 12; // Quick snap transition (~0.4s)

// ============ SNAP CAROUSEL ============
const SnapCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate which slide we're on based on cumulative hold durations
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

  // Are we in hold phase or transition phase?
  const isTransitioning = frameInSlide >= holdDuration;
  const transitionFrame = isTransitioning ? frameInSlide - holdDuration : 0;

  // Snap transition progress (0 to 1 during transition)
  const transitionProgress = isTransitioning
    ? spring({
        frame: transitionFrame,
        fps,
        config: { damping: 20, stiffness: 150 }, // Snappy!
      })
    : 0;

  return (
    <AbsoluteFill>
      {/* Title */}
      <CarouselTitle
        slide={currentSlide}
        nextSlide={slides[Math.min(currentSlideIndex + 1, slides.length - 1)]}
        transitionProgress={transitionProgress}
        isTransitioning={isTransitioning}
      />

      {/* Previous phone (left, faded) - only show if transitioning or if there's a previous */}
      {currentSlideIndex > 0 && !isTransitioning && (
        <PhonePosition position="left" opacity={0.25} scale={1.0}>
          <SlidePhone slideIndex={currentSlideIndex - 1} isCenter={false} />
        </PhonePosition>
      )}

      {/* Current phone sliding left during transition */}
      {isTransitioning && (
        <PhonePosition
          position="center"
          offsetX={interpolate(transitionProgress, [0, 1], [0, -420])}
          opacity={interpolate(transitionProgress, [0, 1], [1, 0.25])}
          scale={interpolate(transitionProgress, [0, 1], [1.5, 1.0])}
        >
          <SlidePhone slideIndex={currentSlideIndex} isCenter={!isTransitioning} />
        </PhonePosition>
      )}

      {/* Current phone in center (when not transitioning) */}
      {!isTransitioning && (
        <PhonePosition position="center" opacity={1} scale={1.5}>
          <SlidePhone slideIndex={currentSlideIndex} isCenter={true} frameInSlide={frameInSlide} />
        </PhonePosition>
      )}

      {/* Next phone sliding in from right during transition */}
      {isTransitioning && currentSlideIndex < slides.length - 1 && (
        <PhonePosition
          position="center"
          offsetX={interpolate(transitionProgress, [0, 1], [420, 0])}
          opacity={interpolate(transitionProgress, [0, 1], [0.25, 1])}
          scale={interpolate(transitionProgress, [0, 1], [1.0, 1.5])}
        >
          <SlidePhone slideIndex={currentSlideIndex + 1} isCenter={transitionProgress > 0.5} />
        </PhonePosition>
      )}

      {/* Next phone (right, faded) - only show if not transitioning and there's a next */}
      {currentSlideIndex < slides.length - 1 && !isTransitioning && (
        <PhonePosition position="right" opacity={0.25} scale={1.0}>
          <SlidePhone slideIndex={currentSlideIndex + 1} isCenter={false} />
        </PhonePosition>
      )}
    </AbsoluteFill>
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
  const baseX = position === "left" ? -380 : position === "right" ? 380 : 0;
  const zIndex = position === "center" ? 10 : 5;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "57%",
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
  const { fps } = useVideoConfig();

  // Slide 0: Video
  if (slideIndex === 0) {
    return <PhoneWithVideo videoSrc="assets/becoming-app/three-pillars-recording.mov" />;
  }

  // Slide 3: Notification with animation and zoom
  if (slideIndex === 3) {
    const notificationProgress = isCenter
      ? spring({ frame: frameInSlide - 15, fps, config: { damping: 15, stiffness: 100 } })
      : 1;

    // Zoom in on notification after it appears
    const zoomProgress = isCenter
      ? interpolate(frameInSlide, [50, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : 0;

    return (
      <div style={{ transform: `scale(${1 + zoomProgress * 0.15}) translateY(${zoomProgress * 80}px)` }}>
        <PhoneWithNotification notificationProgress={Math.min(notificationProgress, 1)} />
      </div>
    );
  }

  // Other slides: Screenshots
  const screenshots = [
    "", // 0 is video
    "assets/becoming-app/03-identity-input.png",
    "assets/becoming-app/04-north-star.png",
    "", // 3 is notification
    "assets/becoming-app/09-home-screen.png",
    "assets/becoming-app/11-check-in.png",
  ];

  return <IPhoneMockup screenshot={screenshots[slideIndex]} scale={1} />;
};

// ============ CAROUSEL TITLE ============
const CarouselTitle: React.FC<{
  slide: SlideData;
  nextSlide: SlideData;
  transitionProgress: number;
  isTransitioning: boolean;
}> = ({ slide, nextSlide, transitionProgress, isTransitioning }) => {
  const currentOpacity = isTransitioning ? interpolate(transitionProgress, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }) : 1;
  const nextOpacity = isTransitioning ? interpolate(transitionProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }) : 0;

  return (
    <>
      {/* Current title */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: currentOpacity,
          zIndex: 20,
        }}
      >
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 72, fontWeight: 700, color: slide.titleColor, marginBottom: 18, lineHeight: 1.1, padding: "0 30px" }}>
          {slide.title}
        </div>
        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 500, color: colors.textMuted, padding: "0 40px" }}>
          {slide.subtitle}
        </div>
      </div>

      {/* Next title (fading in during transition) */}
      {isTransitioning && (
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: nextOpacity,
            zIndex: 21,
          }}
        >
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 72, fontWeight: 700, color: nextSlide.titleColor, marginBottom: 18, lineHeight: 1.1, padding: "0 30px" }}>
            {nextSlide.title}
          </div>
          <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 36, fontWeight: 500, color: colors.textMuted, padding: "0 40px" }}>
            {nextSlide.subtitle}
          </div>
        </div>
      )}
    </>
  );
};

// ============ PHONE WITH VIDEO ============
const PhoneWithVideo: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;

  return (
    <div style={{ position: "relative", width: phoneWidth, height: phoneHeight, borderRadius: bezelRadius, overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333", background: "#000" }}>
      <Video src={staticFile(videoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: bezelRadius - 4 }} muted />
      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 130, height: 35, background: "#000", borderRadius: 20 }} />
    </div>
  );
};

// ============ PHONE WITH NOTIFICATION ============
const PhoneWithNotification: React.FC<{ notificationProgress: number }> = ({ notificationProgress }) => {
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;
  const notificationY = interpolate(notificationProgress, [0, 1], [-120, 620]);

  return (
    <div style={{ position: "relative", width: phoneWidth, height: phoneHeight, borderRadius: bezelRadius, overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333", background: "#000" }}>
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: "system-ui", fontSize: 72, fontWeight: 200, color: "#fff", letterSpacing: -2 }}>9:41</div>
        <div style={{ fontFamily: "system-ui", fontSize: 18, color: "#999", marginTop: 5 }}>Wednesday, January 21</div>
      </div>

      <div style={{ position: "absolute", left: 12, right: 12, top: notificationY, opacity: notificationProgress, background: "rgba(40, 40, 50, 0.95)", backdropFilter: "blur(20px)", borderRadius: 20, padding: 14, display: "flex", alignItems: "flex-start", gap: 12, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
        <Img src={staticFile("assets/becoming-app/logo-with-bg.png")} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
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

      <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 130, height: 35, background: "#000", borderRadius: 20 }} />
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

  const logoPulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.94, 1.06]);
  const logoGlow = interpolate(Math.sin(frame / 15), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 800, height: 800, background: `radial-gradient(circle, ${colors.primary}40 0%, ${colors.secondary}30 40%, transparent 70%)`, filter: "blur(120px)", opacity: logoEntrance * logoGlow }} />

      <div style={{ textAlign: "center" }}>
        <div style={{ opacity: logoEntrance, transform: `scale(${interpolate(logoEntrance, [0, 1], [0.3, 1]) * logoPulse})`, marginBottom: 45 }}>
          <Img src={staticFile("assets/becoming-app/logo-no-bg.png")} style={{ width: 320, height: 320, objectFit: "contain", filter: `drop-shadow(0 0 ${50 * logoGlow}px ${colors.primary}80)` }} />
        </div>

        <div style={{ fontFamily: "Georgia, serif", fontSize: 110, fontWeight: 700, fontStyle: "italic", color: colors.text, opacity: textEntrance, transform: `translateY(${interpolate(textEntrance, [0, 1], [30, 0])}px)`, marginBottom: 22 }}>
          Becoming...
        </div>

        <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 48, fontWeight: 500, color: colors.textMuted, opacity: textEntrance, transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`, marginBottom: 60 }}>
          Motivation Made For You
        </div>

        <div style={{ opacity: buttonEntrance, transform: `scale(${interpolate(buttonEntrance, [0, 1], [0.8, 1])}) translateY(${interpolate(buttonEntrance, [0, 1], [30, 0])}px)` }}>
          <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 50%, ${colors.secondary} 100%)`, padding: "36px 75px", borderRadius: 60, fontFamily: "Inter, system-ui, sans-serif", fontSize: 38, fontWeight: 700, color: colors.backgroundDark, boxShadow: `0 30px 80px ${colors.primary}50` }}>
            Available in the App Store
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const ProductShowcaseV6: React.FC = () => {
  const { fps } = useVideoConfig();

  const hookDuration = 3 * fps; // 3s

  // Calculate carousel duration from slide hold times + transitions
  const carouselDuration = slides.reduce((acc, slide) => acc + slide.holdDuration + TRANSITION_FRAMES, 0);

  const ctaDuration = 4 * fps; // 4s

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      <AnimatedBackground />

      {/* Hook */}
      <Sequence from={0} durationInFrames={hookDuration} premountFor={fps}>
        <KineticHook />
      </Sequence>

      {/* Carousel */}
      <Sequence from={hookDuration} durationInFrames={carouselDuration} premountFor={fps}>
        <SnapCarousel />
      </Sequence>

      {/* CTA */}
      <Sequence from={hookDuration + carouselDuration} durationInFrames={ctaDuration} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
