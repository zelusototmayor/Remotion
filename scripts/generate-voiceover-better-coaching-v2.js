const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  throw new Error("Set ELEVENLABS_API_KEY in your environment before generating voiceovers.");
}

// Using "Rachel" - warm, calm female voice - perfect for wellness/coaching app
// Alternative: "Antoni" - warm, calm male voice
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - calm, soothing female

// Video structure (at 30fps):
// Hook: 0-90 frames (3s)
// Intro: 90-180 frames (3s) - minus 15 frame transition overlap
// Coach Selection: 180-300 frames (4s) - minus transition
// Chat Demo: 300-480 frames (6s) - minus transition
// Voice Mode: 480-630 frames (5s) - minus transition
// CTA: 630-750 frames (4s) - minus transition
// Total: ~22.5s = 675 frames

// Voice-over segments with natural pauses (... = pause, commas = breath)
// Script written for warm, calming, conversational delivery
const SEGMENTS = [
  {
    id: "hook",
    text: "Need a little guidance? ... Meet your AI coach.",
    startFrame: 0,
    description: "Hook - opening question",
    // Delivery: Warm, inviting question followed by pause, then confident answer
  },
  {
    id: "intro",
    text: "Better Coaching.",
    startFrame: 75, // After hook
    description: "Intro - brand name",
    // Delivery: Clear, warm brand announcement
  },
  {
    id: "coach-selection",
    text: "Browse thousands of coaches, for any life goal. ... Pick the one that resonates with you.",
    startFrame: 165, // After intro + transition
    description: "Coach Selection - discovery",
    // Delivery: Encouraging, exploratory tone
  },
  {
    id: "chat-demo",
    text: "Get personalized advice, ... instantly. Each coach adapts to your unique journey.",
    startFrame: 285, // After selection + transition
    description: "Chat Demo - personalization",
    // Delivery: Reassuring, helpful tone with emphasis on "instantly"
  },
  {
    id: "voice-mode",
    text: "Or, ... just talk. It's like having a wise friend, ... right in your pocket.",
    startFrame: 450, // After chat + transition
    description: "Voice Mode - natural conversation",
    // Delivery: Soft, intimate, like sharing a secret feature
  },
  {
    id: "cta",
    text: "Better Coaching. Download now, on the App Store.",
    startFrame: 585, // After voice mode + transition
    description: "CTA - download",
    // Delivery: Confident, clear call to action
  },
];

async function generateSegment(segment, outputDir) {
  console.log(`Generating: ${segment.description}`);
  console.log(`  Text: "${segment.text}"`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: segment.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.65,        // Higher for calm, consistent delivery
          similarity_boost: 0.75, // Natural voice matching
          style: 0.2,             // Low expressiveness for calm tone
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error for ${segment.id}: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const outputPath = path.join(outputDir, `voiceover-${segment.id}.mp3`);

  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  console.log(`  ✅ Saved: voiceover-${segment.id}.mp3`);

  return {
    ...segment,
    file: `voiceover-${segment.id}.mp3`,
  };
}

async function generateAllSegments() {
  const outputDir = path.join(__dirname, "../public/assets/better-coaching-v2");

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("🎙️  Generating Better Coaching V2 voiceover with ElevenLabs...\n");
  console.log(`Using voice: Rachel (warm, calm, soothing)\n`);
  console.log("═".repeat(60) + "\n");

  const results = [];

  for (const segment of SEGMENTS) {
    const result = await generateSegment(segment, outputDir);
    results.push(result);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate a manifest file for easy import
  const manifest = {
    video: "BetterCoaching-Interactive-Demo",
    voice: "Rachel",
    voiceId: VOICE_ID,
    tone: "warm, calm, conversational - wellness coaching vibe",
    segments: results,
    fps: 30,
    totalDuration: 675, // frames
  };

  const manifestPath = path.join(outputDir, "voiceover-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("\n" + "═".repeat(60));
  console.log("\n✅ All segments generated!");
  console.log(`📄 Manifest saved to: voiceover-manifest.json`);
  console.log("\n📊 Segment timing:");
  results.forEach(r => {
    console.log(`  - ${r.id}: starts at frame ${r.startFrame} (${(r.startFrame / 30).toFixed(1)}s)`);
  });
  console.log("\n💡 To use: Import Audio from @remotion/media and wrap in <Sequence from={startFrame}>");

  return results;
}

async function listVoices() {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": ELEVENLABS_API_KEY },
  });
  const data = await response.json();
  console.log("Available voices:\n");
  const voices = data.voices || [];
  if (voices.length === 0) {
    console.log("No voices found. Response:", JSON.stringify(data, null, 2));
    return;
  }
  voices.forEach((voice) => {
    const labels = voice.labels || {};
    console.log(`  ${voice.name} (${voice.voice_id})`);
    console.log(`    ${labels.description || labels.accent || "No description"}`);
    console.log();
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list-voices")) {
    await listVoices();
    return;
  }

  await generateAllSegments();
}

main().catch(console.error);
