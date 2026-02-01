import React from "react";

/**
 * Color scheme for the video
 */
export type ColorScheme = {
  background: string;
  backgroundDark: string;
  primary: string;
  secondary: string;
  tertiary: string;
  text: string;
  textMuted: string;
};

/**
 * Hook scene configuration - the opening attention grabber
 */
export type HookConfig = {
  lines: Array<{
    text: string;
    style?: "normal" | "muted" | "highlight" | "bold";
  }>;
  highlightWord: string;
  highlightStyle?: "pop" | "typewriter" | "letterPop";
};

/**
 * Individual slide in the feature carousel
 */
export type SlideConfig = {
  title: string;
  subtitle: string;
  titleColor?: string;
  holdDuration?: number; // in frames, default 70

  // Content type - one of these should be provided
  screenshot?: string;        // path relative to public/
  video?: string;             // video file path
  customContent?: React.ReactNode;

  // Optional: notification overlay for "Get Notified" type slides
  notification?: {
    appIcon: string;
    appName: string;
    message: string;
    time?: string;
  };
};

/**
 * Call-to-action scene configuration
 */
export type CTAConfig = {
  logo: string;              // path to logo image
  appName: string;
  tagline: string;
  buttonText: string;
  availability?: string;     // e.g., "Available in the App Store"
};

/**
 * Voiceover segment timing
 */
export type VoiceoverSegment = {
  file: string;              // path relative to public/
  startFrame: number;
};

/**
 * Audio configuration
 */
export type AudioConfig = {
  backgroundMusic?: string;  // path to background music
  musicVolume?: number;      // 0-1, default 0.3
  voiceoverSegments?: VoiceoverSegment[];
};

/**
 * Timing configuration (all in frames unless noted)
 */
export type TimingConfig = {
  fps?: number;              // default 30
  hookDuration?: number;     // default 5 * fps
  transitionDuration?: number; // default 3 * fps
  ctaDuration?: number;      // default 4 * fps
  slideTransitionFrames?: number; // default 18
  defaultSlideHold?: number; // default 70
};

/**
 * Complete project configuration for ProductShowcase template
 */
export type ProjectConfig = {
  // Project metadata
  id: string;
  name: string;

  // Visual theme
  colors: ColorScheme;

  // Content sections
  hook: HookConfig;
  introduction: {
    preText?: string;        // e.g., "Introducing"
    appName: string;
  };
  slides: SlideConfig[];
  cta: CTAConfig;

  // Audio
  audio?: AudioConfig;

  // Timing overrides
  timing?: TimingConfig;

  // Video dimensions
  width?: number;            // default 1080
  height?: number;           // default 1920
};

/**
 * Default values for optional config properties
 */
export const DEFAULT_TIMING: Required<TimingConfig> = {
  fps: 30,
  hookDuration: 150,         // 5 seconds at 30fps
  transitionDuration: 90,    // 3 seconds
  ctaDuration: 120,          // 4 seconds
  slideTransitionFrames: 18,
  defaultSlideHold: 70,
};

export const DEFAULT_COLORS: ColorScheme = {
  background: "#0c1426",
  backgroundDark: "#050a12",
  primary: "#14b8a6",
  secondary: "#f59e0b",
  tertiary: "#10b981",
  text: "#fafafa",
  textMuted: "#a1a1aa",
};
