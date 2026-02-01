/**
 * Font loading utilities using @remotion/google-fonts
 *
 * IMPORTANT: Import fonts at the top level of your composition
 * to ensure they're loaded before any text measurement.
 */

import { loadFont as loadInterFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfairFont } from "@remotion/google-fonts/PlayfairDisplay";

// Load Inter font (primary UI font)
const { fontFamily: interFamily, waitUntilDone: waitForInter } = loadInterFont();

// Load Playfair Display (serif font for elegant text - similar to Georgia)
const { fontFamily: playfairFamily, waitUntilDone: waitForPlayfair } = loadPlayfairFont();

/**
 * Font families to use in your compositions
 */
export const fonts = {
  inter: interFamily,
  serif: playfairFamily,
  // Fallback system fonts
  system: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};

/**
 * Wait for all fonts to be loaded.
 * Call this before any text measurement operations.
 */
export const waitForAllFonts = async (): Promise<void> => {
  await Promise.all([waitForInter(), waitForPlayfair()]);
};

/**
 * Default font family string to use throughout compositions
 */
export const DEFAULT_FONT_FAMILY = `${interFamily}, system-ui, sans-serif`;
export const SERIF_FONT_FAMILY = `${playfairFamily}, Georgia, serif`;
