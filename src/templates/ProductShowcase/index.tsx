import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { AnimatedBackground } from "../../shared/components";
import { HookScene, IntroductionScene, CarouselScene, CTAScene } from "./scenes";
import type { ProjectConfig } from "./types";
import { DEFAULT_TIMING, DEFAULT_COLORS } from "./types";

type ProductShowcaseTemplateProps = {
  config: ProjectConfig;
};

/**
 * Main ProductShowcase template component.
 * Creates a complete promo video from a project configuration.
 *
 * Features:
 * - Animated hook scene with typewriter text
 * - Epic app introduction with particle effects
 * - Feature carousel with phone mockups
 * - Call-to-action with pulsing logo
 * - Scene transitions (fade, slide)
 * - Background music and voiceover support
 *
 * @example
 * <Composition
 *   id="MyAppPromo"
 *   component={() => <ProductShowcaseTemplate config={myAppConfig} />}
 *   durationInFrames={calculateDuration(myAppConfig)}
 *   fps={30}
 *   width={1080}
 *   height={1920}
 * />
 */
export const ProductShowcaseTemplate: React.FC<ProductShowcaseTemplateProps> = ({
  config,
}) => {
  const { fps } = useVideoConfig();

  // Merge with defaults
  const colors = { ...DEFAULT_COLORS, ...config.colors };
  const timing = { ...DEFAULT_TIMING, ...config.timing };

  // Calculate scene durations
  const hookDuration = timing.hookDuration;
  const transitionDuration = timing.transitionDuration;

  const carouselDuration = config.slides.reduce(
    (acc, slideItem) =>
      acc +
      (slideItem.holdDuration || timing.defaultSlideHold) +
      timing.slideTransitionFrames,
    0
  );

  const ctaDuration = timing.ctaDuration;

  // Scene transition timing (frames for crossfade)
  const sceneTransitionDuration = Math.round(fps * 0.5); // 0.5 second transitions

  return (
    <AbsoluteFill style={{ backgroundColor: colors.backgroundDark }}>
      {/* Background Music */}
      {config.audio?.backgroundMusic && (
        <Audio
          src={staticFile(config.audio.backgroundMusic)}
          volume={config.audio.musicVolume ?? 0.3}
        />
      )}

      {/* Synced Voiceover Segments */}
      {config.audio?.voiceoverSegments?.map((segment) => (
        <Sequence key={segment.file} from={segment.startFrame}>
          <Audio src={staticFile(segment.file)} volume={1} />
        </Sequence>
      ))}

      {/* Animated Background (persists throughout) */}
      <AnimatedBackground colors={colors} />

      {/* Scene Transitions */}
      <TransitionSeries>
        {/* Hook Scene */}
        <TransitionSeries.Sequence durationInFrames={hookDuration}>
          <HookScene config={config.hook} colors={colors} />
        </TransitionSeries.Sequence>

        {/* Transition: Hook -> Introduction */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: sceneTransitionDuration })}
        />

        {/* Introduction Scene */}
        <TransitionSeries.Sequence durationInFrames={transitionDuration}>
          <IntroductionScene
            preText={config.introduction.preText}
            appName={config.introduction.appName}
            colors={colors}
          />
        </TransitionSeries.Sequence>

        {/* Transition: Introduction -> Carousel */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: sceneTransitionDuration })}
        />

        {/* Carousel Scene */}
        <TransitionSeries.Sequence durationInFrames={carouselDuration}>
          <CarouselScene
            slides={config.slides}
            colors={colors}
            transitionFrames={timing.slideTransitionFrames}
            defaultHoldDuration={timing.defaultSlideHold}
          />
        </TransitionSeries.Sequence>

        {/* Transition: Carousel -> CTA */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: sceneTransitionDuration })}
        />

        {/* CTA Scene */}
        <TransitionSeries.Sequence durationInFrames={ctaDuration}>
          <CTAScene config={config.cta} colors={colors} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

/**
 * Calculate total video duration based on configuration.
 * Use this with calculateMetadata for dynamic duration.
 */
export const calculateDuration = (config: ProjectConfig): number => {
  const timing = { ...DEFAULT_TIMING, ...config.timing };

  const hookDuration = timing.hookDuration;
  const transitionDuration = timing.transitionDuration;
  const ctaDuration = timing.ctaDuration;

  const carouselDuration = config.slides.reduce(
    (acc, slideItem) =>
      acc +
      (slideItem.holdDuration || timing.defaultSlideHold) +
      timing.slideTransitionFrames,
    0
  );

  // Account for scene transitions (they overlap, so subtract overlap)
  const sceneTransitionFrames = Math.round(timing.fps * 0.5);
  const totalTransitions = 3; // hook->intro, intro->carousel, carousel->cta
  const transitionOverlap = sceneTransitionFrames * totalTransitions;

  return (
    hookDuration +
    transitionDuration +
    carouselDuration +
    ctaDuration -
    transitionOverlap
  );
};

export default ProductShowcaseTemplate;
export * from "./types";
