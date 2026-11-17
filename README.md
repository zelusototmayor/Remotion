# Remotion Studio

A React and TypeScript workspace for producing promotional videos for my own applications. It includes original app demonstrations, reusable product-showcase components, animated interface scenes, and timed voiceover sequences.

The workspace contains compositions for The Becoming App, AI Talk Coach, Better Coaching and Signal Harvester. It is a video-authoring project: these compositions illustrate app interfaces rather than operating the apps or collecting their users' information.

## Run locally

Use a current Node.js release and npm.

```sh
npm ci
npm run dev
```

Choose a composition in Remotion Studio to preview it. To list available compositions or render one:

```sh
npx remotion compositions src/index.ts
npx remotion render src/index.ts COMPOSITION_ID output.mp4
```

Use an ID listed by the first command. To check TypeScript and lint rules, run `npm run lint`.

## Structure

- `src/Root.tsx`: composition registration and video dimensions/durations.
- `src/compositions/`: individual compositions and retained starter examples.
- `src/projects/`: project-specific scenes and configuration.
- `src/templates/`: reusable product-showcase composition system.
- `src/shared/`: shared components, fonts and animation helpers.
- `public/assets/`: images, recordings and audio used by compositions.
- `scripts/`: optional voiceover-generation helpers.

## Optional voiceover generation

Previewing existing compositions does not require an ElevenLabs key. The optional generation scripts call a paid external API. Set `ELEVENLABS_API_KEY` in your shell only if you intend to use that service. Never put a real key in source code, a commit or a sample environment file.

## Licensing and media

Original source-code contributions are licensed under MIT; see [LICENSE](LICENSE). The Remotion framework, retained upstream examples, and other dependencies retain their respective licenses. See [Remotion's license](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

The source-code license does not grant rights to third-party photos, music, voices, fonts, trademarks or other media. Check those rights separately and replace assets with material you have permission to use when adapting a composition.
