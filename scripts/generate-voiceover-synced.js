const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
if (!ELEVENLABS_API_KEY) {
  throw new Error("Set ELEVENLABS_API_KEY in your environment before generating voiceovers.");
}

// Voice options - trying more natural sounding voices:
// "Adam" - deep, warm male voice
// "Antoni" - young, expressive male
// "Daniel" - British, authoritative
// "Charlie" - casual Australian male
// "Clyde" - war veteran character, deep
// "Dave" - British-Essex, conversational
// "Fin" - Irish male, young
// "George" - British, warm raconteur

// Using "Antoni" - warm, calm, soothing male voice
const VOICE_ID = "ErXwobaYiN019PkySvjV"; // Antoni - warm, calm, inspirational

// Segments synced to video timing (in seconds)
// Video structure:
// - Hook: 0-5s (150 frames)
// - Transition: 5-8s (90 frames)
// - Carousel: 8-23s (~450 frames) - 6 slides
// - CTA: 23-27s (120 frames)

// Video section boundaries (in frames at 30fps):
// Hook: 0-150 (5s)
// Transition: 150-240 (3s)
// Carousel-1: 240-353 (3.77s)
// Carousel-2: 353-441 (2.93s)
// Carousel-3: 441-529 (2.93s)
// Carousel-4: 529-632 (3.43s)
// Carousel-5: 632-715 (2.77s)
// Carousel-6: 715-798 (2.77s)
// CTA: 798-900 (3.4s)

const SEGMENTS = [
  {
    id: "hook",
    text: "What if your phone could help you become, who you were meant to be?",
    startFrame: 0, // Natural pacing, should be ~4s
    description: "Hook - opening question"
  },
  {
    id: "transition",
    text: "Introducing the becoming app.",
    startFrame: 150, // Must end by 240 (max 3s)
    description: "Transition"
  },
  {
    id: "carousel-1",
    text: "Built with 3 main foundations.",
    startFrame: 240, // Must end by 353 (max 3.77s)
    description: "Carousel slide 1 - Three pillars"
  },
  {
    id: "carousel-2",
    text: "Define your goals.",
    startFrame: 353, // Must end by 441 (max 2.93s) - shortened
    description: "Carousel slide 2 - Goals"
  },
  {
    id: "carousel-3",
    text: "AI crafts your identity.",
    startFrame: 441, // Must end by 529 (max 2.93s) - shortened
    description: "Carousel slide 3 - AI Identity"
  },
  {
    id: "carousel-4",
    text: "Daily signals keep you aligned.",
    startFrame: 529, // Must end by 632 (max 3.43s) - shortened
    description: "Carousel slide 4 - Notifications"
  },
  {
    id: "carousel-5",
    text: "Track your journey.",
    startFrame: 632, // Must end by 715 (max 2.77s) - shortened
    description: "Carousel slide 5 - Track"
  },
  {
    id: "carousel-6",
    text: "Reflect on your growth.",
    startFrame: 715, // Must end by 798 (max 2.77s) - shortened
    description: "Carousel slide 6 - Reflect"
  },
  {
    id: "cta",
    text: "The Becoming App. Download now.",
    startFrame: 798, // Must end by 900 (max 3.4s) - shortened
    description: "CTA"
  },
];

async function generateSegment(segment, outputDir) {
  console.log(`Generating: ${segment.description}`);

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
          stability: 0.6,        // Slightly higher for more consistent delivery
          similarity_boost: 0.8,  // Higher for more natural voice matching
          style: 0.3,            // Moderate expressiveness
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
  const outputDir = path.join(__dirname, "../public/assets/becoming-app");

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating voiceover segments with ElevenLabs...\n");
  console.log(`Using voice: Antoni (warm, calm, inspirational)\n`);

  const results = [];

  for (const segment of SEGMENTS) {
    const result = await generateSegment(segment, outputDir);
    results.push(result);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Generate a manifest file for easy import
  const manifest = {
    voice: "Charlie",
    voiceId: VOICE_ID,
    segments: results,
    fps: 30,
  };

  const manifestPath = path.join(outputDir, "voiceover-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("\n✅ All segments generated!");
  console.log(`📄 Manifest saved to: voiceover-manifest.json`);
  console.log("\nSegment timing:");
  results.forEach(r => {
    console.log(`  - ${r.id}: starts at frame ${r.startFrame} (${(r.startFrame / 30).toFixed(1)}s)`);
  });

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
