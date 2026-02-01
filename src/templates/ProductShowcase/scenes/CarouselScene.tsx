import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  staticFile,
  OffthreadVideo,
} from "remotion";
import {
  TypewriterText,
  IPhoneMockup,
  PhoneWithNotification,
} from "../../../shared/components";
import type { ColorScheme, SlideConfig } from "../types";

type CarouselSceneProps = {
  slides: SlideConfig[];
  colors: ColorScheme;
  transitionFrames?: number;
  defaultHoldDuration?: number;
};

/**
 * Animated carousel scene that showcases multiple features/screens.
 * Each slide transitions smoothly with the phone mockups sliding left/right.
 */
export const CarouselScene: React.FC<CarouselSceneProps> = ({
  slides,
  colors,
  transitionFrames = 18,
  defaultHoldDuration = 70,
}) => {
  const frame = useCurrentFrame();

  // Calculate current slide based on frame
  let currentSlideIndex = 0;
  let frameInSlide = frame;
  let cumulativeFrames = 0;

  for (let i = 0; i < slides.length; i++) {
    const holdDuration = slides[i].holdDuration || defaultHoldDuration;
    const slideTotal = holdDuration + transitionFrames;
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
  const holdDuration = currentSlide.holdDuration || defaultHoldDuration;

  const isTransitioning = frameInSlide >= holdDuration;
  const transitionFrame = isTransitioning ? frameInSlide - holdDuration : 0;

  const transitionProgress = isTransitioning
    ? interpolate(transitionFrame, [0, transitionFrames], [0, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    : 0;

  // Determine which slide to show for title
  const displaySlideIndex =
    isTransitioning && transitionProgress > 0.5
      ? Math.min(currentSlideIndex + 1, slides.length - 1)
      : currentSlideIndex;

  // Reset frameInSlide for new title animation
  const titleFrameInSlide =
    isTransitioning && transitionProgress > 0.5
      ? Math.floor((transitionProgress - 0.5) * transitionFrames * 2)
      : frameInSlide;

  return (
    <AbsoluteFill>
      {/* Animated Title */}
      <AnimatedTitle
        slide={slides[displaySlideIndex]}
        frameInSlide={titleFrameInSlide}
        colors={colors}
      />

      {/* Previous phone (left) */}
      {currentSlideIndex > 0 && !isTransitioning && (
        <PhonePosition position="left" opacity={0.2} scale={0.95}>
          <SlidePhone
            slide={slides[currentSlideIndex - 1]}
            isCenter={false}
            colors={colors}
          />
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
          <SlidePhone
            slide={slides[currentSlideIndex]}
            isCenter={false}
            colors={colors}
          />
        </PhonePosition>
      )}

      {/* Current phone in center */}
      {!isTransitioning && (
        <PhonePosition position="center" opacity={1} scale={1.45}>
          <SlidePhone
            slide={slides[currentSlideIndex]}
            isCenter={true}
            frameInSlide={frameInSlide}
            colors={colors}
          />
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
          <SlidePhone
            slide={slides[currentSlideIndex + 1]}
            isCenter={transitionProgress > 0.7}
            colors={colors}
          />
        </PhonePosition>
      )}

      {/* Next phone (right) */}
      {currentSlideIndex < slides.length - 1 && !isTransitioning && (
        <PhonePosition position="right" opacity={0.2} scale={0.95}>
          <SlidePhone
            slide={slides[currentSlideIndex + 1]}
            isCenter={false}
            colors={colors}
          />
        </PhonePosition>
      )}
    </AbsoluteFill>
  );
};

// ============ ANIMATED TITLE ============
const AnimatedTitle: React.FC<{
  slide: SlideConfig;
  frameInSlide: number;
  colors: ColorScheme;
}> = ({ slide, frameInSlide, colors }) => {
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
        color={slide.titleColor || colors.text}
        charsPerFrame={2}
        style={{
          marginBottom: 14,
          lineHeight: 1.1,
          padding: "0 35px",
          textShadow: `0 4px 30px ${slide.titleColor || colors.text}40`,
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
  slide: SlideConfig;
  isCenter: boolean;
  frameInSlide?: number;
  colors: ColorScheme;
}> = ({ slide, isCenter, frameInSlide = 0, colors }) => {
  // Video content
  if (slide.video) {
    return <PhoneWithVideo videoSrc={slide.video} />;
  }

  // Notification content
  if (slide.notification) {
    const notificationProgress = isCenter
      ? interpolate(frameInSlide - 20, [0, 35], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        })
      : 1;

    return (
      <PhoneWithNotification
        notificationProgress={Math.min(notificationProgress, 1)}
        notification={slide.notification}
        colors={colors}
      />
    );
  }

  // Screenshot content (default)
  return <IPhoneMockup screenshot={slide.screenshot} scale={1} />;
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
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333",
        background: "#000",
      }}
    >
      <OffthreadVideo
        src={staticFile(videoSrc)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: bezelRadius - 4,
        }}
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

export default CarouselScene;
