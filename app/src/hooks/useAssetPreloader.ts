import { useState, useEffect } from 'react';
import { VIDEOS, AUDIO, IMAGES, OTHER } from '../assets/mediaManifest';
import { useLaplaceStore } from '../store/useLaplaceStore';

// ─────────────────────────────────────────────────────────────────────────────
// Asset buckets — only preload what the user needs SOON.
// INITIAL: blocks the loading screen (must be small + critical).
// LEVEL_ASSETS[N]: preloaded silently while the user plays level N-1,
//   so assets are in disk cache before level N begins.
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_URLS: string[] = [
  AUDIO.LANDING_SONG,
  AUDIO.L1_NARRATOR,
];

const LEVEL_ASSETS: Record<number, string[]> = {
  // Preloaded right after loading screen dismisses (user on Level 0 landing)
  1: [
    VIDEOS.TIME_DOMAIN_INTRO_PT1,
    VIDEOS.TIME_DOMAIN_INTRO_PT2,
    VIDEOS.TIME_DOMAIN_INTRO_PT3,
    VIDEOS.L1_DOT_INTRO,
    VIDEOS.L1_CLICK_PIXEL,
    VIDEOS.L1_ENDING,
    AUDIO.L1_WHISPER,
    IMAGES.L1_NOSTALGIA,
    IMAGES.L1_LONGING,
    IMAGES.L1_LOGIC,
    IMAGES.L1_INSANITY,
  ],
  // Preloaded while user is in Level 1
  2: [
    VIDEOS.L2_INTRO,
    VIDEOS.L2_GIRL_BOY_CLEAN,
    VIDEOS.L2_GIRL_BOY_GLITCH,
    VIDEOS.L2_ENDING,
    AUDIO.L2_NARRATOR,
    IMAGES.L2_SKY_HABITS,
    IMAGES.L2_SKY_CONNECTIONS,
    IMAGES.L2_SKY_CONVOLUTED,
    IMAGES.L2_SKY_SOUL,
  ],
  // Preloaded while user is in Level 2
  3: [
    VIDEOS.L3_PIANO_INTRO,
    VIDEOS.L3_INTERACT,
    AUDIO.L3_NARRATOR,
    IMAGES.L3_GIRL_SARCASM,
    IMAGES.L3_GIRL_LOGIC,
    IMAGES.L3_GIRL_VELOCITY,
    IMAGES.L3_GIRL_DAMPING,
  ],
  // Preloaded while user is in Level 3 (climax assets)
  4: [
    VIDEOS.FINALE_MONTAGE,
    AUDIO.CLIMAX_14,
    AUDIO.CLIMAX_16,
    AUDIO.CLIMAX_17,
    AUDIO.CLIMAX_18,
    AUDIO.CLIMAX_19,
    AUDIO.CLIMAX_MUSIC,
    IMAGES.PANORAMA_360,
    IMAGES.MIT_HACK_LOGO,
    OTHER.CREDITS_TXT,
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Session guard
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = 'laplace_preloaded';

function alreadyPreloaded(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; }
  catch { return false; }
}

function markPreloaded(): void {
  try { sessionStorage.setItem(SESSION_KEY, '1'); }
  catch { /* private browsing — safe to ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch — retries with exponential backoff on network failure.
//
// fetch() with force-cache writes the full response to the browser's HTTP disk
// cache. The <video> element's subsequent range requests are served from that
// cached entry — zero network round-trip, stutter-free playback.
// Requires GCS Cache-Control headers: gsutil -m setmeta \
//   -h "Cache-Control:public, max-age=31536000" "gs://laplace-transform/**"
// ─────────────────────────────────────────────────────────────────────────────
export async function cacheUrl(url: string, retries = 3): Promise<void> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      await res.arrayBuffer();
      return;
    } catch {
      if (attempt === retries) {
        console.warn(`[Preloader] Gave up after ${retries} retries: ${url}`);
      } else {
        await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
      }
    }
  }
}

const BATCH_SIZE = 4;

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
  const level = useLaplaceStore(state => state.level);

  // Phase 1: block on loading screen, then kick off Level 1 preload
  useEffect(() => {
    if (alreadyPreloaded()) return;

    let loaded = 0;
    const total = INITIAL_URLS.length;
    const onProgress = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    async function run() {
      await cacheAll(INITIAL_URLS, onProgress);
      setTimeout(() => {
        setIsLoaded(true);
        markPreloaded();
        cacheAll(LEVEL_ASSETS[1]);
      }, 600);
    }

    run();
  }, []);

  // Phase 2: whenever the user advances to level N, preload level N+1 assets
  useEffect(() => {
    if (level < 1) return;
    const nextAssets = LEVEL_ASSETS[level + 1];
    if (nextAssets) cacheAll(nextAssets);
  }, [level]);

  return { progress, isLoaded };
}
