import { useState, useEffect } from 'react';

type AssetType = 'video' | 'audio' | 'image' | 'fetch';

interface Asset {
  url: string;
  type: AssetType;
}

const ASSETS: Asset[] = [
  // Videos
  { url: '/preloads/Introduction(I)-the-time-domain.mp4', type: 'video' },
  { url: '/preloads/level1/level0DotIntro.mp4', type: 'video' },
  { url: '/preloads/level1/videoClickOnPixel.mp4', type: 'video' },
  { url: '/preloads/level1/dotLevelEnding.mov', type: 'video' },
  { url: '/preloads/level2/level2Intro.mov', type: 'video' },
  { url: '/preloads/level2/Level2End.mp4', type: 'video' },
  { url: '/preloads/level2/girl&boy(clean).webm', type: 'video' },
  { url: '/preloads/level2/girl&boyGlitch.mov', type: 'video' },
  { url: '/preloads/level3/PianoIntro.mov', type: 'video' },
  { url: '/preloads/level3/level3Interact.mp4', type: 'video' },
  { url: '/preloads/climax/finaleMontage.mp4', type: 'video' },

  // Audio
  { url: '/preloads/landingSong.mp3', type: 'audio' },
  { url: '/preloads/landingSong.wav', type: 'audio' },
  { url: '/preloads/level1/4v2.wav', type: 'audio' },
  { url: '/preloads/level1/iclosedmyeyesWhisper.wav', type: 'audio' },
  { url: '/preloads/level2/10v2.wav', type: 'audio' },
  { url: '/preloads/level3/13v1.wav', type: 'audio' },
  { url: '/preloads/climax/14v1.wav', type: 'audio' },
  { url: '/preloads/climax/16v1.wav', type: 'audio' },
  { url: '/preloads/climax/17v1.wav', type: 'audio' },
  { url: '/preloads/climax/18v1.wav', type: 'audio' },
  { url: '/preloads/19v1.wav', type: 'audio' },
  { url: '/preloads/spencer_yk-light-trails-151006.mp3', type: 'audio' },

  // Images
  { url: '/preloads/climax/360World.png', type: 'image' },
  { url: '/preloads/MITHack.webp', type: 'image' },
  { url: '/preloads/level1/nostalgiaPoint.png', type: 'image' },
  { url: '/preloads/level1/longingPoint.png', type: 'image' },
  { url: '/preloads/level1/logicPoint.png', type: 'image' },
  { url: '/preloads/level1/insanityPoint.png', type: 'image' },
  { url: '/preloads/level2/skyHabits.png', type: 'image' },
  { url: '/preloads/level2/skyConnections.png', type: 'image' },
  { url: '/preloads/level2/skyConvoluted.png', type: 'image' },
  { url: '/preloads/level2/skySoul.png', type: 'image' },
  { url: '/preloads/level3/girlSarcasmo.png', type: 'image' },
  { url: '/preloads/level3/girlLogic.png', type: 'image' },
  { url: '/preloads/level3/girlVelocity.png', type: 'image' },
  { url: '/preloads/level3/girlDamping.png', type: 'image' },

  // Others
  { url: '/preloads/climax/3dSplatWorld.spz', type: 'fetch' },
  { url: '/preloads/credits.txt', type: 'fetch' },
];

export function useAssetPreloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let loadedCount = 0;
    const totalCount = ASSETS.length;

    const updateProgress = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / totalCount) * 100));
      if (loadedCount === totalCount) {
        // Add a small delay for smooth transition
        setTimeout(() => setIsLoaded(true), 800);
      }
    };

    const loadAsset = async (asset: Asset) => {
      try {
        if (asset.type === 'image') {
          const img = new Image();
          img.src = asset.url;
          img.onload = updateProgress;
          img.onerror = () => {
            console.warn(`Failed to load image: ${asset.url}`);
            updateProgress(); // Continue anyway
          };
        } else if (asset.type === 'video') {
          const video = document.createElement('video');
          video.src = asset.url;
          video.preload = 'auto';
          video.oncanplaythrough = updateProgress;
          video.onerror = () => {
            console.warn(`Failed to load video: ${asset.url}`);
            updateProgress();
          };
        } else if (asset.type === 'audio') {
          const audio = new Audio();
          audio.src = asset.url;
          audio.preload = 'auto';
          audio.oncanplaythrough = updateProgress;
          audio.onerror = () => {
            console.warn(`Failed to load audio: ${asset.url}`);
            updateProgress();
          };
        } else {
          await fetch(asset.url);
          updateProgress();
        }
      } catch (e: any) {
        console.error(`Preload error for ${asset.url}:`, e);
        setError(e.message || String(e));
        updateProgress();
      }
    };

    // Load assets in batches to avoid overwhelming the browser/network
    const BATCH_SIZE = 4;
    async function loadAll() {
      for (let i = 0; i < ASSETS.length; i += BATCH_SIZE) {
        const batch = ASSETS.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(loadAsset));
      }
    }

    loadAll();
  }, []);

  return { progress, isLoaded, error };
}
