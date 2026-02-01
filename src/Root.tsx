import { Composition, Folder } from "remotion";
import { HelloWorld, myCompSchema } from "./compositions/shared-templates/HelloWorld";
import { Logo, myCompSchema2 } from "./compositions/shared-templates/HelloWorld/Logo";
import {
  SocialPromo,
  ProductShowcase,
  ProductShowcaseV2,
  ProductShowcaseV3,
  ProductShowcaseV4,
  ProductShowcaseV5,
  ProductShowcaseV6,
  ProductShowcaseV7,
  ProductShowcaseV8,
} from "./compositions/becoming-app";

// New Template System
import { ProductShowcaseTemplate, calculateDuration } from "./templates/ProductShowcase";
import { becomingAppConfig } from "./projects/becoming-app";
import { AITalkCoachVideo, AI_TALK_COACH_DURATION } from "./projects/ai-talk-coach/AITalkCoachVideo";
import { BecomingAppXVideo, BECOMING_APP_X_DURATION } from "./projects/becoming-app/BecomingAppXVideo";
import { BetterCoachingVideo, BETTER_COACHING_DURATION } from "./projects/better-coaching/BetterCoachingVideo";
import { BetterCoachingVideoV2, BETTER_COACHING_V2_DURATION } from "./projects/better-coaching/BetterCoachingVideoV2";
import { SignalHarvesterVideo, SIGNAL_HARVESTER_DURATION } from "./projects/signal-harvester/SignalHarvesterVideo";

// Initialize fonts (loads asynchronously)
import "./shared/fonts";

// Each <Composition> is an entry in the sidebar!
// Organized by project for easy multi-project management

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== NEW: Template-Based Compositions ========== */}
      <Folder name="Templates">
        {/* Becoming App - Using new template system */}
        <Composition
          id="BecomingApp-Template"
          component={() => <ProductShowcaseTemplate config={becomingAppConfig} />}
          durationInFrames={calculateDuration(becomingAppConfig)}
          fps={becomingAppConfig.timing?.fps || 30}
          width={becomingAppConfig.width || 1080}
          height={becomingAppConfig.height || 1920}
        />
      </Folder>

      {/* ========== AI Talk Coach ========== */}
      <Folder name="AITalkCoach">
        <Composition
          id="AITalkCoach-Promo"
          component={AITalkCoachVideo}
          durationInFrames={AI_TALK_COACH_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      {/* ========== Becoming App - New X Promo ========== */}
      <Folder name="BecomingApp">
        <Composition
          id="BecomingApp-X-Promo"
          component={BecomingAppXVideo}
          durationInFrames={BECOMING_APP_X_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ========== Better Coaching ========== */}
      <Folder name="BetterCoaching">
        <Composition
          id="BetterCoaching-X-Promo"
          component={BetterCoachingVideo}
          durationInFrames={BETTER_COACHING_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="BetterCoaching-Interactive-Demo"
          component={BetterCoachingVideoV2}
          durationInFrames={BETTER_COACHING_V2_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ========== Signal Harvester ========== */}
      <Folder name="SignalHarvester">
        <Composition
          id="SignalHarvester-Explainer"
          component={SignalHarvesterVideo}
          durationInFrames={SIGNAL_HARVESTER_DURATION}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ========== LEGACY: Original Becoming App Videos ========== */}
      <Folder name="BecomingApp-Legacy">
        <Composition
          id="SocialPromo"
          component={SocialPromo}
          durationInFrames={750} // 25 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcase"
          component={ProductShowcase}
          durationInFrames={900} // 30 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV2"
          component={ProductShowcaseV2}
          durationInFrames={900} // 30 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV3"
          component={ProductShowcaseV3}
          durationInFrames={900} // 30 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV4"
          component={ProductShowcaseV4}
          durationInFrames={720} // 24 seconds at 30fps (shorter)
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV5"
          component={ProductShowcaseV5}
          durationInFrames={690} // 23 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV6"
          component={ProductShowcaseV6}
          durationInFrames={750} // 25 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV7"
          component={ProductShowcaseV7}
          durationInFrames={885} // ~29.5 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
        <Composition
          id="ProductShowcaseV8"
          component={ProductShowcaseV8}
          durationInFrames={900} // 30 seconds at 30fps
          fps={30}
          width={1080}
          height={1920} // 9:16 portrait for TikTok/Reels
        />
      </Folder>

      {/* ========== Remotion Default Templates ========== */}
      <Folder name="Remotion-Defaults">
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={myCompSchema}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />

        <Composition
          id="OnlyLogo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={myCompSchema2}
          defaultProps={{
            logoColor1: "#91dAE2" as const,
            logoColor2: "#86A8E7" as const,
          }}
        />
      </Folder>
    </>
  );
};
