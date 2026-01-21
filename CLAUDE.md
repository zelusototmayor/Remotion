# Remotion Studio

This is a multi-project video creation studio using Remotion (React-based programmatic video creation).

## Project Structure

```
src/
├── compositions/
│   ├── becoming-app/     # Videos for TheBecomingApp
│   ├── shared-templates/ # Reusable templates
│   └── [project-name]/   # Add more project folders as needed
├── Root.tsx              # Register all compositions here
public/
├── assets/
│   ├── becoming-app/     # Assets for TheBecomingApp
│   └── shared/           # Shared assets
```

## Creating Videos

### For a specific project:
1. Create components in `src/compositions/[project-name]/`
2. Register them in `src/Root.tsx` inside the appropriate `<Folder>`
3. Place assets in `public/assets/[project-name]/`

### Quick Commands:
- `npm run dev` - Start Remotion Studio (preview at localhost:3000)
- `npx remotion render [CompositionId]` - Render a video
- `npx remotion still [CompositionId]` - Export a still frame

## Video Presets

Common configurations:
- **1080p Landscape**: 1920x1080, 30fps
- **720p Landscape**: 1280x720, 30fps
- **Portrait (TikTok/Reels)**: 1080x1920, 30fps
- **Square (Instagram)**: 1080x1080, 30fps

## Tips

- Use `useCurrentFrame()` and `useVideoConfig()` hooks for animation timing
- Use `<Sequence>` to arrange clips on a timeline
- Use `interpolate()` for smooth animations
- The Remotion skill in `.claude/skills/remotion/` has 31 rule files with examples

## Referencing External Project Assets

To use assets from other projects (like TheBecomingApp):
```tsx
// Reference screenshots or exports from sibling projects
// Copy needed assets to public/assets/[project-name]/
```
