import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Asset lists — split into INITIAL (blocks loading screen) and BACKGROUND (silent)
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_URLS: string[] = [
  // Everything needed for Level 0 landing + start of Level 1
  '/preloads/landingSong.mp3',
  '/preloads/Introduction(I)-the-time-domain.mp4',
  '/preloads/level1/level0DotIntro.mp4',
  '/preloads/level1/4v2.wav',
];

const BACKGROUND_URLS: string[] = [
  '/preloads/level1/videoClickOnPixel.mp4',
  '/preloads/level1/dotLevelEnding.mp4',
  '/preloads/level1/iclosedmyeyesWhisper.wav',
  '/preloads/level2/level2Intro.mp4',
  '/preloads/level2/girl&boy(clean).mp4',
  '/preloads/level2/girl&boyGlitch.mp4',
  '/preloads/level2/Level2End.mp4',
  '/preloads/level2/10v2.wav',
  '/preloads/level3/PianoIntro.mp4',
  '/preloads/level3/level3Interact.mp4',
  '/preloads/level3/13v1.wav',
  '/preloads/climax/finaleMontage.mp4',
  '/preloads/climax/14v1.wav',
  '/preloads/climax/16v1.wav',
  '/preloads/climax/17v1.wav',
  '/preloads/climax/18v1.wav',
  '/preloads/19v1.wav',
  '/preloads/spencer_yk-light-trails-151006.mp3',
  '/preloads/climax/360World.png',
  '/preloads/MITHack.webp',
  '/preloads/level1/nostalgiaPoint.png',
  '/preloads/level1/longingPoint.png',
  '/preloads/level1/logicPoint.png',
  '/preloads/level1/insanityPoint.png',
  '/preloads/level2/skyHabits.png',
  '/preloads/level2/skyConnections.png',
  '/preloads/level2/skyConvoluted.png',
  '/preloads/level2/skySoul.png',
  '/preloads/level3/girlSarcasmo.png',
  '/preloads/level3/girlLogic.png',
  '/preloads/level3/girlVelocity.png',
  '/preloads/level3/girlDamping.png',
  '/preloads/climax/3dSplatWorld.spz',
  '/preloads/credits.txt',
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
