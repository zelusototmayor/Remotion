const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "REVOKED_KEY_REMOVED";

// Trimmed script for ~30 second video
const VOICEOVER_SCRIPT = `What if your phone could help you become who you were meant to be?

Introducing The Becoming App.

Define your goals. Let AI craft your identity. Get daily signals to stay aligned. Track your journey. Reflect on your growth.

The Becoming App. Motivation made for you. Download now.`;

// Voice options for energetic & confident tone:
// - "Adam" - deep, confident male voice
// - "Antoni" - warm, friendly male voice
// - "Josh" - young, energetic male voice
// - "Rachel" - warm, confident female voice
// - "Domi" - confident, clear female voice

const VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Josh - young and energetic

async function listVoices() {
  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Available voices:");
  data.voices.forEach((voice) => {
    console.log(`  - ${voice.name} (${voice.voice_id}): ${voice.labels?.description || "No description"}`);
  });
  return data.voices;
}

async function generateVoiceover() {
  console.log("Generating voiceover with ElevenLabs...");
  console.log("Script:", VOICEOVER_SCRIPT.substring(0, 100) + "...");

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
        text: VOICEOVER_SCRIPT,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.4, // More expressive/energetic
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const outputPath = path.join(__dirname, "../public/assets/becoming-app/voiceover.mp3");

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, Buffer.from(audioBuffer));
  console.log(`✅ Voiceover saved to: ${outputPath}`);

  return outputPath;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--list-voices")) {
    await listVoices();
    return;
  }

  await generateVoiceover();
}

main().catch(console.error);
