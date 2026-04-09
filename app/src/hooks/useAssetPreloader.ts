import { useState, useEffect } from 'react';
import { VIDEOS, AUDIO, IMAGES, OTHER } from '../assets/mediaManifest';

// ─────────────────────────────────────────────────────────────────────────────
// Asset lists — split into INITIAL (blocks loading screen) and BACKGROUND (silent)
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
  OTHER.SPLAT_WORLD,
  OTHER.CREDITS_TXT,
];

// ─────────────────────────────────────────────────────────────────────────────
// Core fetch-based loader
//
// WHY FETCH INSTEAD OF <video preload="auto">:
//   Hidden video elements are evicted by the browser under memory pressure.
//   fetch() writes the full response to the browser's HTTP cache which persists
//   reliably. When the <video> element later requests the same URL, the network
//   layer serves it from cache instantly — zero stutter, zero network round-trip.
//
//   This only works correctly when the server sends proper Accept-Ranges +
//   Cache-Control headers (see vercel.json).
// ─────────────────────────────────────────────────────────────────────────────
async function cacheUrl(url: string): Promise<void> {
  try {
    const response = await fetch(url, {
      // 'force-cache' returns a cached response if one exists, otherwise fetches
      // and stores it. Perfect for preloading: first visit downloads + caches,
      // subsequent visits or <video> element requests are instant.
      cache: 'force-cache',
    });
    // Consume the body so the browser actually writes it to cache
    await response.arrayBuffer();
  } catch (e) {
    // Non-fatal — log and move on. The experience can still work, just may stutter.
    console.warn(`[Preloader] Failed to cache: ${url}`, e);
  }
}

const BATCH_SIZE = 3; // Max concurrent fetches — avoids overwhelming a CDN connection pool

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
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = INITIAL_URLS.length;

    const onInitialProgress = () => {
      loaded++;
      setProgress(Math.round((loaded / total) * 100));
    };

    async function run() {
      // Phase 1 — blocks the loading screen
      await cacheAll(INITIAL_URLS, onInitialProgress);

      setTimeout(() => {
        setIsLoaded(true);
        // Phase 2 — silent background caching while the user is in Level 0
        cacheAll(BACKGROUND_URLS);
      }, 600);
    }

    run();
  }, []);

  return { progress, isLoaded };
}
