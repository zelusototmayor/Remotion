const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "REVOKED_KEY_REMOVED";

// Using "Josh" - young, dynamic, energetic male voice - perfect for engaging promo
// More natural and energetic than Adam
const VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Josh - young, energetic, conversational

// Video structure (at 30fps):
// Hook: 0-150 frames (5s)
// Intro: 150-270 frames (4s) - minus 15 frame transition overlap
// How It Works: 270-420 frames (5s) - minus transition
// Demo: 420-570 frames (5s) - minus transition
// Features: 570-690 frames (4s) - minus transition
// CTA: 690-810 frames (4s) - minus transition
// Total: ~24.5s = 735 frames

// Voice-over segments with natural pauses
// Script written for professional, confident, growth-focused delivery
const SEGMENTS = [
  {
    id: "hook",
    text: "Thousands of people are asking for recommendations in comments. ... And nobody's answering them.",
    startFrame: 0,
    description: "Hook - the problem",
    // Delivery: Start matter-of-fact, pause for emphasis, then hint at the missed opportunity
  },
  {
    id: "intro",
    text: "Signal Harvester. ... Turn comments, into customers.",
    startFrame: 135, // After hook
    description: "Intro - brand reveal",
    // Delivery: Strong brand name, pause, then confident value prop
  },
  {
    id: "how-it-works",
    text: "Three simple steps. Pick your niche. AI scans comments. Review, and reply.",
    startFrame: 255, // After intro + transition
    description: "How It Works - 3 steps",
    // Delivery: Clear, punchy, easy to follow rhythm
  },
  {
    id: "demo",
    text: "Our AI finds buyers hiding in plain sight, ... and crafts the perfect response.",
    startFrame: 405, // After steps + transition
    description: "Demo - AI in action",
    // Delivery: Confident, revealing a superpower
  },
  {
    id: "features",
    text: "Intent detection. Instant replies. Multi-platform. ... Everything you need to convert.",
    startFrame: 555, // After demo + transition
    description: "Features - key capabilities",
    // Delivery: Fast, punchy feature list, then slower conclusion
  },
  {
    id: "cta",
    text: "Signal Harvester. ... Test free now.",
    startFrame: 675, // After features + transition
    description: "CTA - try it free",
    // Delivery: Brand name with authority, pause, clear call to action
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
          stability: 0.4,         // Lower stability for more natural variation
          similarity_boost: 0.75, // Good voice matching
          style: 0.7,             // High expressiveness for energy and engagement
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
  const outputDir = path.join(__dirname, "../public/assets/signal-harvester");

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("🎙️  Generating Signal Harvester voiceover with ElevenLabs...\n");
  console.log(`Using voice: Josh (young, energetic, conversational)\n`);
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
    video: "SignalHarvester-Explainer",
    voice: "Josh",
    voiceId: VOICE_ID,
    tone: "energetic, natural, engaging - conversational promo vibe",
    segments: results,
    fps: 30,
    totalDuration: 735, // frames
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
