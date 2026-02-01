import type { ProjectConfig } from "../../templates/ProductShowcase/types";

/**
 * EXAMPLE: Copy this file as a starting point for new project configurations.
 *
 * Steps to add a new project:
 * 1. Copy this folder to src/projects/your-project-name/
 * 2. Update the config values below
 * 3. Add your assets to public/assets/your-project-name/
 * 4. Import and register in Root.tsx
 *
 * Required assets:
 * - Logo image (for CTA scene)
 * - App screenshots (for carousel)
 * - Optional: background music, voiceover files
 */
export const exampleProjectConfig: ProjectConfig = {
  // ============ PROJECT METADATA ============
  id: "example-project",
  name: "Example App",

  // ============ BRAND COLORS ============
  colors: {
    background: "#1a1a2e",     // Main background
    backgroundDark: "#0f0f1a", // Darker shade for depth
    primary: "#4f46e5",        // Primary brand color (indigo)
    secondary: "#ec4899",      // Secondary accent (pink)
    tertiary: "#06b6d4",       // Third accent (cyan)
    text: "#ffffff",           // Main text color
    textMuted: "#9ca3af",      // Muted text color
  },

  // ============ HOOK SCENE ============
  // The opening scene that grabs attention
  hook: {
    lines: [
      { text: "Ever wonder", style: "muted" },
      { text: "how to simplify your life?", style: "normal" },
    ],
    highlightWord: "We did.",
    highlightStyle: "pop", // "pop" | "typewriter" | "letterPop"
  },

  // ============ INTRODUCTION ============
  // The dramatic app name reveal
  introduction: {
    preText: "Introducing",
    appName: "Your App Name",
  },

  // ============ FEATURE CAROUSEL ============
  // Each slide showcases a feature or screen
  slides: [
    {
      title: "Feature One",
      subtitle: "A brief description of this feature",
      screenshot: "assets/example-project/screenshot-1.png",
      titleColor: "#4f46e5", // Optional: override title color
      holdDuration: 70,      // Optional: frames to hold (default: 70)
    },
    {
      title: "Feature Two",
      subtitle: "Another great feature",
      screenshot: "assets/example-project/screenshot-2.png",
      holdDuration: 70,
    },
    {
      title: "Feature Three",
      subtitle: "One more amazing thing",
      screenshot: "assets/example-project/screenshot-3.png",
      holdDuration: 70,
    },
    // Optional: Slide with video instead of screenshot
    // {
    //   title: "See It In Action",
    //   subtitle: "Watch how it works",
    //   video: "assets/example-project/demo.mp4",
    //   holdDuration: 95,
    // },
    // Optional: Slide with notification popup
    // {
    //   title: "Stay Notified",
    //   subtitle: "Get alerts when it matters",
    //   notification: {
    //     appIcon: "assets/example-project/icon.png",
    //     appName: "Your App",
    //     message: "You have a new update!",
    //     time: "now",
    //   },
    //   holdDuration: 85,
    // },
  ],

  // ============ CALL TO ACTION ============
  cta: {
    logo: "assets/example-project/logo.png",
    appName: "Your App",
    tagline: "Your Tagline Here",
    buttonText: "Download Now",
    availability: "Available on App Store", // Optional
  },

  // ============ AUDIO (OPTIONAL) ============
  // audio: {
  //   backgroundMusic: "assets/example-project/music.mp3",
  //   musicVolume: 0.3,
  //   voiceoverSegments: [
  //     { file: "assets/example-project/voiceover-hook.mp3", startFrame: 20 },
  //     { file: "assets/example-project/voiceover-cta.mp3", startFrame: 400 },
  //   ],
  // },

  // ============ TIMING (OPTIONAL) ============
  // Override default timing values
  // timing: {
  //   fps: 30,
  //   hookDuration: 150,         // 5 seconds
  //   transitionDuration: 90,    // 3 seconds
  //   ctaDuration: 120,          // 4 seconds
  //   slideTransitionFrames: 18,
  //   defaultSlideHold: 70,
  // },

  // ============ DIMENSIONS ============
  width: 1080,
  height: 1920, // 9:16 portrait for social media
};

export default exampleProjectConfig;
