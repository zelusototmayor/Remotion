import type { ProjectConfig } from "../../templates/ProductShowcase/types";

/**
 * AI Talk Coach - Promo Video Configuration
 *
 * Creative Concept: "Find Your Voice"
 * Theme: Transformation from nervous speaker to confident communicator
 *
 * The video tells a relatable story - we've all been nervous before
 * a big presentation. AI Talk Coach is your personal practice partner
 * that helps you build confidence through AI-powered feedback.
 */
export const aiTalkCoachConfig: ProjectConfig = {
  id: "ai-talk-coach",
  name: "AI Talk Coach",

  // Brand Colors - Warm coral-to-gold gradient palette
  colors: {
    background: "#1a1025",        // Deep purple-black
    backgroundDark: "#0d0812",    // Darker shade
    primary: "#FF7F66",           // Coral (from logo)
    secondary: "#FFB347",         // Warm orange
    tertiary: "#FFD93D",          // Golden yellow
    text: "#ffffff",
    textMuted: "#b8a8c8",         // Soft purple-gray
  },

  // Opening Hook - Relatable pain point
  hook: {
    lines: [
      { text: "Heart racing.", style: "muted" },
      { text: "Palms sweating.", style: "muted" },
      { text: "Your big moment is coming...", style: "normal" },
    ],
    highlightWord: "What if you were ready?",
    highlightStyle: "letterPop",
  },

  // App Introduction
  introduction: {
    preText: "Meet",
    appName: "AI Talk Coach",
  },

  // Feature Carousel - Key value propositions
  slides: [
    {
      title: "Practice Anywhere",
      subtitle: "Your personal speaking coach, in your pocket",
      screenshot: "assets/ai-talk-coach/screen-record.png",
      titleColor: "#FF7F66",
      holdDuration: 80,
    },
    {
      title: "Speak. Get Feedback.",
      subtitle: "AI analyzes your pace, clarity, and filler words",
      screenshot: "assets/ai-talk-coach/screen-feedback.png",
      titleColor: "#FFB347",
      holdDuration: 85,
    },
    {
      title: "Real-Time Insights",
      subtitle: "See exactly where you can improve",
      screenshot: "assets/ai-talk-coach/screen-analysis.png",
      titleColor: "#FFD93D",
      holdDuration: 75,
    },
    {
      title: "Track Your Growth",
      subtitle: "Watch your confidence build over time",
      screenshot: "assets/ai-talk-coach/screen-progress.png",
      titleColor: "#FF7F66",
      holdDuration: 70,
    },
  ],

  // Call to Action
  cta: {
    logo: "assets/ai-talk-coach/logo.png",
    appName: "AI Talk Coach",
    tagline: "Find Your Voice",
    buttonText: "Download Free",
    availability: "Available on the App Store",
  },

  // Timing (frames at 30fps)
  timing: {
    fps: 30,
    hookDuration: 180,           // 6 seconds - let the hook breathe
    transitionDuration: 75,      // 2.5 seconds
    ctaDuration: 120,            // 4 seconds
    slideTransitionFrames: 15,
    defaultSlideHold: 75,
  },

  // Video Dimensions (9:16 vertical for social media)
  width: 1080,
  height: 1920,
};

export default aiTalkCoachConfig;
