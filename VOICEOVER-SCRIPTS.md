# Voice-Over Scripts for Product Videos

This document contains the voice-over scripts for both product videos with natural pacing and pauses.

---

## Better Coaching V2 - Interactive Demo

**Voice:** Rachel (warm, calm, soothing female voice)
**Tone:** Friendly, conversational, wellness-focused
**Duration:** ~22 seconds

### Script with Timing

| Scene | Start Time | Script | Delivery Notes |
|-------|------------|--------|----------------|
| **Hook** | 0:00 | "Need a little guidance? ... Meet your AI coach." | Warm, inviting question → pause → confident answer |
| **Intro** | 0:02.5 | "Better Coaching." | Clear, warm brand announcement |
| **Coach Selection** | 0:05.5 | "Browse thousands of coaches, for any life goal. ... Pick the one that resonates with you." | Encouraging, exploratory tone |
| **Chat Demo** | 0:09.5 | "Get personalized advice, ... instantly. Each coach adapts to your unique journey." | Reassuring, emphasis on "instantly" |
| **Voice Mode** | 0:15 | "Or, ... just talk. It's like having a wise friend, ... right in your pocket." | Soft, intimate, like sharing a secret |
| **CTA** | 0:19.5 | "Better Coaching. Download now, on the App Store." | Confident, clear call to action |

### Full Script (Copy-Paste Ready)

```
[0:00 - Hook]
Need a little guidance? ... Meet your AI coach.

[0:02.5 - Intro]
Better Coaching.

[0:05.5 - Coach Selection]
Browse thousands of coaches, for any life goal. ... Pick the one that resonates with you.

[0:09.5 - Chat Demo]
Get personalized advice, ... instantly. Each coach adapts to your unique journey.

[0:15 - Voice Mode]
Or, ... just talk. It's like having a wise friend, ... right in your pocket.

[0:19.5 - CTA]
Better Coaching. Download now, on the App Store.
```

---

## Signal Harvester - Explainer Video

**Voice:** Adam (deep, professional, confident male voice)
**Tone:** Professional, growth-focused, B2B SaaS vibe
**Duration:** ~24 seconds

### Script with Timing

| Scene | Start Time | Script | Delivery Notes |
|-------|------------|--------|----------------|
| **Hook** | 0:00 | "Thousands of people are asking for recommendations in comments. ... And nobody's answering them." | Matter-of-fact → pause → hint at missed opportunity |
| **Intro** | 0:04.5 | "Signal Harvester. ... Turn comments, into customers." | Strong brand name → pause → confident value prop |
| **How It Works** | 0:08.5 | "Three simple steps. Pick your niche. AI scans comments. Review, and reply." | Clear, punchy rhythm |
| **Demo** | 0:13.5 | "Our AI finds buyers hiding in plain sight, ... and crafts the perfect response." | Confident, revealing a superpower |
| **Features** | 0:18.5 | "Intent detection. Instant replies. Multi-platform. ... Everything you need to convert." | Fast feature list → slower conclusion |
| **CTA** | 0:22.5 | "Signal Harvester. ... Join the waitlist today." | Brand with authority → pause → clear CTA |

### Full Script (Copy-Paste Ready)

```
[0:00 - Hook]
Thousands of people are asking for recommendations in comments. ... And nobody's answering them.

[0:04.5 - Intro]
Signal Harvester. ... Turn comments, into customers.

[0:08.5 - How It Works]
Three simple steps. Pick your niche. AI scans comments. Review, and reply.

[0:13.5 - Demo]
Our AI finds buyers hiding in plain sight, ... and crafts the perfect response.

[0:18.5 - Features]
Intent detection. Instant replies. Multi-platform. ... Everything you need to convert.

[0:22.5 - CTA]
Signal Harvester. ... Join the waitlist today.
```

---

## How to Generate Audio Files

### Option 1: Run the ElevenLabs Scripts (Recommended)

1. Make sure you have an ElevenLabs API key (or use the one in the scripts)
2. From the `remotion-studio` directory, run:

```bash
# Generate Better Coaching V2 voice-over
node scripts/generate-voiceover-better-coaching-v2.js

# Generate Signal Harvester voice-over
node scripts/generate-voiceover-signal-harvester.js
```

Audio files will be saved to:
- `public/assets/better-coaching-v2/voiceover-*.mp3`
- `public/assets/signal-harvester/voiceover-*.mp3`

### Option 2: Use ElevenLabs Web Interface

1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Select voice:
   - **Better Coaching:** Rachel (warm, calm female)
   - **Signal Harvester:** Adam (deep, confident male)
3. Copy each script segment and generate
4. Download and save to the appropriate `public/assets/` folder

### Option 3: Record Your Own

Use the scripts above with any voice recording tool or text-to-speech service.

---

## Audio File Names Required

### Better Coaching V2
```
public/assets/better-coaching-v2/
├── voiceover-hook.mp3
├── voiceover-intro.mp3
├── voiceover-coach-selection.mp3
├── voiceover-chat-demo.mp3
├── voiceover-voice-mode.mp3
└── voiceover-cta.mp3
```

### Signal Harvester
```
public/assets/signal-harvester/
├── voiceover-hook.mp3
├── voiceover-intro.mp3
├── voiceover-how-it-works.mp3
├── voiceover-demo.mp3
├── voiceover-features.mp3
└── voiceover-cta.mp3
```

---

## ElevenLabs Voice Settings

### Better Coaching (Warm, Calming)
```json
{
  "stability": 0.65,
  "similarity_boost": 0.75,
  "style": 0.2,
  "use_speaker_boost": true
}
```

### Signal Harvester (Professional, Energetic)
```json
{
  "stability": 0.55,
  "similarity_boost": 0.8,
  "style": 0.4,
  "use_speaker_boost": true
}
```

---

## Pause Notation

In the scripts, pauses are indicated by:
- `...` = 0.5-1 second pause (breath/emphasis)
- `,` = natural comma pause (0.2-0.3 seconds)
- `.` = sentence pause (0.3-0.5 seconds)

These are important for natural-sounding delivery!
