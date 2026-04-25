import { useState, useEffect } from 'react';
import { VIDEOS, AUDIO, IMAGES, OTHER } from '../assets/mediaManifest';

// ─────────────────────────────────────────────────────────────────────────────
// Asset lists
//
// INITIAL_URLS  — fetched before the loading screen dismisses.
// BACKGROUND_URLS — fetched silently while the user is on the landing page.
//
// WHY NOT INCLUDE THE SPLAT HERE:
//   OTHER.SPLAT_WORLD (~33 MB) is only needed at Level 6. The user spends
//   several minutes in the Level 5 audio sequence before reaching it.
//   useSplatPreloader() in Level5AudioSequence handles it lazily so we don't
//   burn mobile bandwidth up front.
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_URLS: string[] = [
  AUDIO.LANDING_SONG,
  VIDEOS.TIME_DOMAIN_INTRO,
  VIDEOS.L1_DOT_INTRO,
  AUDIO.L1_NARRATOR,
];

const BACKGROUND_URLS: string[] = [
  VIDEOS.L1_CLICK_PIXEL,
  VIDEOS.L1_ENDING,
  AUDIO.L1_WHISPER,
  VIDEOS.L2_INTRO,
  VIDEOS.L2_GIRL_BOY_CLEAN,
  VIDEOS.L2_GIRL_BOY_GLITCH,
  VIDEOS.L2_ENDING,
  AUDIO.L2_NARRATOR,
  VIDEOS.L3_PIANO_INTRO,
  VIDEOS.L3_INTERACT,
  AUDIO.L3_NARRATOR,
  VIDEOS.FINALE_MONTAGE,
  AUDIO.CLIMAX_14,
  AUDIO.CLIMAX_16,
  AUDIO.CLIMAX_17,
  AUDIO.CLIMAX_18,
  AUDIO.CLIMAX_19,
  AUDIO.CLIMAX_MUSIC,
  IMAGES.PANORAMA_360,
  IMAGES.MIT_HACK_LOGO,
  IMAGES.L1_NOSTALGIA,
  IMAGES.L1_LONGING,
  IMAGES.L1_LOGIC,
  IMAGES.L1_INSANITY,
  IMAGES.L2_SKY_HABITS,
  IMAGES.L2_SKY_CONNECTIONS,
  IMAGES.L2_SKY_CONVOLUTED,
  IMAGES.L2_SKY_SOUL,
  IMAGES.L3_GIRL_SARCASM,
  IMAGES.L3_GIRL_LOGIC,
  IMAGES.L3_GIRL_VELOCITY,
  IMAGES.L3_GIRL_DAMPING,
  OTHER.CREDITS_TXT,
];

// ─────────────────────────────────────────────────────────────────────────────
// Session guard — skip the loading screen on refresh if we already ran this
// session. Assets are in the browser's HTTP disk cache; the loading screen
// would flash and immediately disappear, which looks broken.
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = 'laplace_preloaded';

function alreadyPreloaded(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markPreloaded(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // sessionStorage unavailable (private browsing restrictions) — safe to ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch-based preloader
//
// WHY fetch() INSTEAD OF <video preload="auto">:
//   Hidden <video> elements are evicted by the browser under memory pressure.
//   fetch() with cache:'force-cache' writes the full response to the browser's
//   HTTP disk cache. When the <video> element later requests the same URL, the
//   browser serves it from disk instantly — zero stutter, zero network round-
//   trip, network-failure-resilient after first load.
//
//   Requires the server to send proper Cache-Control + Accept-Ranges headers
//   (set these on the GCS bucket via gsutil — see implementation plan).
// ─────────────────────────────────────────────────────────────────────────────
export async function cacheUrl(url: string): Promise<void> {
  try {
    const response = await fetch(url, { cache: 'force-cache' });
    // Consume the body so the browser writes the full response to disk cache.
    await response.arrayBuffer();
  } catch (e) {
    console.warn(`[Preloader] Failed to cache: ${url}`, e);
  }
}

const BATCH_SIZE = 5; // GCS handles more concurrent connections than Vercel CDN

async function cacheAll(urls: string[], onEach?: () => void): Promise<void> {
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (url) => {
        await cacheUrl(url);
        onEach?.();
      })
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export function useAssetPreloader() {
  const [progress, setProgress] = useState(() => alreadyPreloaded() ? 100 : 0);
  const [isLoaded, setIsLoaded] = useState(alreadyPreloaded);

  useEffect(() => {
    // If we already ran this session (e.g. hot-reload / refresh), skip entirely.
    if (alreadyPreloaded()) return;

    let loaded = 0;
    const total = INITIAL_URLS.length;

    const onInitialProgress = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    async function run() {
      // Phase 1 — block the loading screen until critical assets are cached
      await cacheAll(INITIAL_URLS, onInitialProgress);

      setTimeout(() => {
        setIsLoaded(true);
        markPreloaded();
        // Phase 2 — silent background caching while the user is on Level 0
        cacheAll(BACKGROUND_URLS);
      }, 600);
    }

    run();
  }, []);

  return { progress, isLoaded };
}
