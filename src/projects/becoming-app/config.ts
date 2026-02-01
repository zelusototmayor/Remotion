import type { ProjectConfig } from "../../templates/ProductShowcase/types";

/**
 * Configuration for The Becoming App promo video.
 *
 * This configuration drives the ProductShowcase template to generate
 * a complete promotional video with:
 * - Hook scene with emotional question
 * - App introduction with dramatic reveal
 * - Feature carousel showcasing key screens
 * - Call-to-action with App Store download
 */
export const becomingAppConfig: ProjectConfig = {
  id: "becoming-app",
  name: "The Becoming App",

  // Brand Colors
  colors: {
    background: "#0c1426",
    backgroundDark: "#050a12",
    primary: "#14b8a6",      // Teal
    secondary: "#f59e0b",    // Amber
    tertiary: "#10b981",     // Emerald
    text: "#fafafa",
    textMuted: "#a1a1aa",
  },

  // Opening Hook
  hook: {
    lines: [
      { text: "What if", style: "muted" },
      { text: "your phone could help you", style: "normal" },
    ],
    highlightWord: "Become",
    highlightStyle: "pop",
  },

  // App Introduction
  introduction: {
    preText: "Introducing",
    appName: "The Becoming App",
  },

  // Feature Carousel Slides
  slides: [
    {
      title: "Your Path to Transformation",
      subtitle: "Direction • Signals • Reflect",
      video: "assets/becoming-app/three-pillars-recording.mp4",
      holdDuration: 95,
    },
    {
      title: "Define Your Goals",
      subtitle: "What do you want to achieve?",
      screenshot: "assets/becoming-app/03-identity-input.png",
      titleColor: "#f59e0b",
      holdDuration: 70,
    },
    {
      title: "AI Crafts Your Identity",
      subtitle: "Become the person that achieves your goals",
      screenshot: "assets/becoming-app/04-north-star.png",
      titleColor: "#10b981",
      holdDuration: 70,
    },
    {
      title: "Get Notified",
      subtitle: "Daily signals that speak to you",
      titleColor: "#14b8a6",
      holdDuration: 85,
      notification: {
        appIcon: "assets/becoming-app/logo-with-bg.png",
        appName: "The Becoming",
        message: "Every choice today is a step toward your self-reliant and balanced life.",
        time: "now",
      },
    },
    {
      title: "Track Your Journey",
      subtitle: "Day 1 of your transformation",
      screenshot: "assets/becoming-app/09-home-screen.png",
      holdDuration: 65,
    },
    {
      title: "Reflect Daily",
      subtitle: "Were you that person today?",
      screenshot: "assets/becoming-app/11-check-in.png",
      titleColor: "#10b981",
      holdDuration: 65,
    },
  ],

  // Call to Action
  cta: {
    logo: "assets/becoming-app/logo-no-bg.png",
    appName: "Becoming...",
    tagline: "Motivation Made For You",
    buttonText: "Available in the App Store",
  },

  // Audio
  audio: {
    backgroundMusic: "assets/becoming-app/background-music.mp3",
    musicVolume: 0.3,
    voiceoverSegments: [
      { file: "assets/becoming-app/voiceover-hook.mp3", startFrame: 20 },
      { file: "assets/becoming-app/voiceover-transition.mp3", startFrame: 150 },
      { file: "assets/becoming-app/voiceover-carousel-1.mp3", startFrame: 240 },
      { file: "assets/becoming-app/voiceover-carousel-2.mp3", startFrame: 353 },
      { file: "assets/becoming-app/voiceover-carousel-3.mp3", startFrame: 441 },
      { file: "assets/becoming-app/voiceover-carousel-4.mp3", startFrame: 529 },
      { file: "assets/becoming-app/voiceover-carousel-5.mp3", startFrame: 632 },
      { file: "assets/becoming-app/voiceover-carousel-6.mp3", startFrame: 715 },
      { file: "assets/becoming-app/voiceover-cta.mp3", startFrame: 798 },
    ],
  },

  // Timing (frames at 30fps)
  timing: {
    fps: 30,
    hookDuration: 150,         // 5 seconds
    transitionDuration: 90,    // 3 seconds
    ctaDuration: 120,          // 4 seconds
    slideTransitionFrames: 18,
    defaultSlideHold: 70,
  },

  // Video Dimensions (9:16 vertical for mobile)
  width: 1080,
  height: 1920,
};

export default becomingAppConfig;
