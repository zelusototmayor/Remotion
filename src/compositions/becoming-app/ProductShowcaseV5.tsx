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

// ============ KINETIC HOOK ============
const KineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const line2 = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 100 } });
  const line3 = spring({ frame: frame - 16, fps, config: { damping: 12, stiffness: 100 } });
  const line4 = spring({ frame: frame - 24, fps, config: { damping: 10, stiffness: 80 } });

  const meantGlow = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 50 }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 62,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [50, 0])}px)`,
            marginBottom: 10,
          }}
        >
          What if your phone
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 62,
            fontWeight: 300,
            color: colors.textMuted,
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [50, 0])}px)`,
            marginBottom: 10,
          }}
        >
          helped you become
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 70,
            fontWeight: 600,
            color: colors.text,
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [50, 0])}px)`,
            marginBottom: 10,
          }}
        >
          who you were
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 88,
            fontWeight: 800,
            fontStyle: "italic",
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: line4,
            transform: `translateY(${interpolate(line4, [0, 1], [70, 0])}px)`,
            filter: `drop-shadow(0 0 ${25 * meantGlow}px ${colors.primary}80)`,
          }}
        >
          meant to be?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ CAROUSEL SLIDE DATA ============
interface CarouselSlide {
  type: "screenshot" | "video" | "notification";
  asset: string;
  title: string;
  subtitle: string;
  titleColor: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    type: "video",
    asset: "assets/becoming-app/three-pillars-recording.mov",
    title: "Your Path to Transformation",
    subtitle: "Direction • Signals • Reflect",
    titleColor: colors.text,
  },
  {
    type: "screenshot",
    asset: "assets/becoming-app/03-identity-input.png",
    title: "Define Your Goals",
    subtitle: "What do you want to achieve?",
    titleColor: colors.secondary,
  },
  {
    type: "screenshot",
    asset: "assets/becoming-app/04-north-star.png",
    title: "AI Crafts Your Identity",
    subtitle: "Become the person that achieves your goals",
    titleColor: colors.tertiary,
  },
  {
    type: "notification",
    asset: "",
    title: "Get Notified",
    subtitle: "Daily signals that speak to you",
    titleColor: colors.primary,
  },
  {
    type: "screenshot",
    asset: "assets/becoming-app/09-home-screen.png",
    title: "Track Your Journey",
    subtitle: "Day 1 of your transformation",
    titleColor: colors.text,
  },
  {
    type: "screenshot",
    asset: "assets/becoming-app/11-check-in.png",
    title: "Reflect Daily",
    subtitle: "Were you that person today?",
    titleColor: colors.tertiary,
  },
];

// ============ PHONE CAROUSEL ============
const PhoneCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const numSlides = carouselSlides.length;

  // Calculate continuous progress through carousel (0 to numSlides)
  const progress = interpolate(frame, [0, durationInFrames], [0, numSlides], {
    extrapolateRight: "clamp",
  });

  // Current slide index
  const currentIndex = Math.floor(progress);
  const slideProgress = progress - currentIndex; // 0 to 1 within current slide

  return (
    <AbsoluteFill>
      {/* Render visible slides */}
      {carouselSlides.map((slide, index) => {
        // Calculate position relative to current
        const relativePos = index - progress;

        // Only render if within visible range (-1.5 to 1.5)
        if (relativePos < -1.5 || relativePos > 1.5) return null;

        // Position: -1 = left (exiting), 0 = center, 1 = right (entering)
        const xOffset = relativePos * 450;
        const scale = interpolate(Math.abs(relativePos), [0, 1, 1.5], [1.25, 0.9, 0.7], {
          extrapolateRight: "clamp",
        });
        const opacity = interpolate(Math.abs(relativePos), [0, 0.8, 1.5], [1, 0.6, 0], {
          extrapolateRight: "clamp",
        });
        const zIndex = 10 - Math.abs(Math.round(relativePos * 10));

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "58%",
              transform: `translate(-50%, -50%) translateX(${xOffset}px) scale(${scale})`,
              opacity,
              zIndex,
            }}
          >
            <PhoneRenderer slide={slide} />
          </div>
        );
      })}

      {/* Title - interpolate between current and next */}
      <CarouselTitle
        slides={carouselSlides}
        currentIndex={Math.min(currentIndex, numSlides - 1)}
        progress={slideProgress}
      />
    </AbsoluteFill>
  );
};

// ============ PHONE RENDERER ============
const PhoneRenderer: React.FC<{ slide: CarouselSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (slide.type === "video") {
    return <PhoneWithVideo videoSrc={slide.asset} />;
  }

  if (slide.type === "notification") {
    // Notification animates in
    const notificationProgress = spring({
      frame: frame - 20,
      fps,
      config: { damping: 15, stiffness: 100 },
    });
    return <PhoneWithNotification notificationProgress={Math.min(notificationProgress, 1)} />;
  }

  return <IPhoneMockup screenshot={slide.asset} scale={1} />;
};

// ============ CAROUSEL TITLE ============
const CarouselTitle: React.FC<{
  slides: CarouselSlide[];
  currentIndex: number;
  progress: number;
}> = ({ slides, currentIndex, progress }) => {
  const currentSlide = slides[currentIndex];
  const nextSlide = slides[Math.min(currentIndex + 1, slides.length - 1)];

  // Fade out current title, fade in next during transition
  const isTransitioning = progress > 0.6;
  const titleOpacity = isTransitioning
    ? interpolate(progress, [0.6, 0.85], [1, 0], { extrapolateRight: "clamp" })
    : 1;
  const nextTitleOpacity = isTransitioning
    ? interpolate(progress, [0.75, 1], [0, 1], { extrapolateLeft: "clamp" })
    : 0;

  return (
    <>
      {/* Current title */}
      <div
        style={{
          position: "absolute",
          top: 100, // Lowered for better centering
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 72, // BIGGER
            fontWeight: 700,
            color: currentSlide.titleColor,
            marginBottom: 18,
            lineHeight: 1.1,
            padding: "0 30px",
          }}
        >
          {currentSlide.title}
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 36, // BIGGER
            fontWeight: 500,
            color: colors.textMuted,
            padding: "0 40px",
          }}
        >
          {currentSlide.subtitle}
        </div>
      </div>

      {/* Next title (fading in) */}
      {isTransitioning && currentIndex < slides.length - 1 && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: nextTitleOpacity,
            zIndex: 21,
          }}
        >
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 72,
              fontWeight: 700,
              color: nextSlide.titleColor,
              marginBottom: 18,
              lineHeight: 1.1,
              padding: "0 30px",
            }}
          >
            {nextSlide.title}
          </div>
          <div
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
              fontWeight: 500,
              color: colors.textMuted,
              padding: "0 40px",
            }}
          >
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

// ============ PHONE WITH NOTIFICATION ============
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

// ============ CTA SCENE - MUCH BIGGER ============
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
      {/* Big glow */}
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
        {/* MUCH BIGGER Pulsing Logo */}
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
              width: 320, // MUCH bigger
              height: 320,
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${50 * logoGlow}px ${colors.primary}80)`,
            }}
          />
        </div>

        {/* MUCH BIGGER Text */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110, // MUCH bigger
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
            fontSize: 48, // MUCH bigger
            fontWeight: 500,
            color: colors.textMuted,
            opacity: textEntrance,
            transform: `translateY(${interpolate(textEntrance, [0, 1], [20, 0])}px)`,
            marginBottom: 60,
          }}
        >
          Motivation Made For You
        </div>

        {/* MUCH BIGGER Button */}
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
              padding: "36px 75px", // BIGGER padding
              borderRadius: 60,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 38, // BIGGER text
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

// ============ MAIN COMPOSITION ============
export const ProductShowcaseV5: React.FC = () => {
  const { fps } = useVideoConfig();

  const hookDuration = 3 * fps;       // 3s
  const carouselDuration = 16 * fps;  // 16s for 6 slides (~2.7s each)
  const ctaDuration = 4 * fps;        // 4s

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      <AnimatedBackground />

      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={hookDuration} premountFor={fps}>
        <KineticHook />
      </Sequence>

      {/* Scene 2: Phone Carousel (3-19s) */}
      <Sequence from={hookDuration} durationInFrames={carouselDuration} premountFor={fps}>
        <PhoneCarousel />
      </Sequence>

      {/* Scene 3: CTA (19-23s) */}
      <Sequence from={hookDuration + carouselDuration} durationInFrames={ctaDuration} premountFor={fps}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
