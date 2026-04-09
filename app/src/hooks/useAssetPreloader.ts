import { useState, useEffect } from 'react';

type AssetType = 'video' | 'audio' | 'image' | 'fetch';

interface Asset {
  url: string;
  type: AssetType;
}

const INITIAL_ASSETS: Asset[] = [
  // Required immediately for Level 0 / Landing
  { url: '/preloads/landingSong.mp3', type: 'audio' },
  { url: '/preloads/landingSong.wav', type: 'audio' },
  { url: '/preloads/Introduction(I)-the-time-domain.mp4', type: 'video' },
  { url: '/preloads/level1/level0DotIntro.mp4', type: 'video' },
  { url: '/preloads/level1/videoClickOnPixel.mp4', type: 'video' },
  { url: '/preloads/level1/4v2.wav', type: 'audio' }
];

const BACKGROUND_ASSETS: Asset[] = [
  // The rest load silently in the background while Level 0 is playing
  { url: '/preloads/level1/dotLevelEnding.mp4', type: 'video' },
  { url: '/preloads/level2/level2Intro.mp4', type: 'video' },
  { url: '/preloads/level2/Level2End.mp4', type: 'video' },
  { url: '/preloads/level2/girl&boy(clean).mp4', type: 'video' },
  { url: '/preloads/level2/girl&boyGlitch.mp4', type: 'video' },
  { url: '/preloads/level3/PianoIntro.mp4', type: 'video' },
  { url: '/preloads/level3/level3Interact.mp4', type: 'video' },
  { url: '/preloads/climax/finaleMontage.mp4', type: 'video' },

  { url: '/preloads/level1/iclosedmyeyesWhisper.wav', type: 'audio' },
  { url: '/preloads/level2/10v2.wav', type: 'audio' },
  { url: '/preloads/level3/13v1.wav', type: 'audio' },
  { url: '/preloads/climax/14v1.wav', type: 'audio' },
  { url: '/preloads/climax/16v1.wav', type: 'audio' },
  { url: '/preloads/climax/17v1.wav', type: 'audio' },
  { url: '/preloads/climax/18v1.wav', type: 'audio' },
  { url: '/preloads/19v1.wav', type: 'audio' },
  { url: '/preloads/spencer_yk-light-trails-151006.mp3', type: 'audio' },

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

  { url: '/preloads/climax/3dSplatWorld.spz', type: 'fetch' },
  { url: '/preloads/credits.txt', type: 'fetch' }
];

export function useAssetPreloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let loadedCount = 0;
    const totalCount = INITIAL_ASSETS.length;

    const updateProgress = () => {
      loadedCount++;
      setProgress(Math.round((loadedCount / totalCount) * 100));
      if (loadedCount === totalCount) {
        // Initials are done, we can boot the main game
        setTimeout(() => {
          setIsLoaded(true);
          // And kick off the rest
          loadBackgroundAssets();
        }, 800);
      }
    };

    const loadAsset = (asset: Asset, onProgress?: () => void) => {
      return new Promise<void>((resolve) => {
        let finished = false;
        
        const finish = () => {
          if (finished) return;
          finished = true;
          if (onProgress) onProgress();
          resolve();
        };

        // Safety timeout in case a video hangs on iOS or spotty connections
        setTimeout(finish, 15000); 

        try {
          if (asset.type === 'image') {
            const img = new Image();
            img.onload = finish;
            img.onerror = () => {
              console.warn(`Failed to load image: ${asset.url}`);
              finish(); 
            };
            img.src = asset.url;
          } else if (asset.type === 'video') {
            const video = document.createElement('video');
            video.oncanplay = finish; // Firing slightly earlier than oncanplaythrough speeds up initial queue
            video.onerror = () => {
              console.warn(`Failed to load video: ${asset.url}`);
              finish();
            };
            video.preload = 'auto';
            video.src = asset.url;
            video.load();
          } else if (asset.type === 'audio') {
            const audio = new Audio();
            audio.oncanplay = finish;
            audio.onerror = () => {
              console.warn(`Failed to load audio: ${asset.url}`);
              finish();
            };
            audio.preload = 'auto';
            audio.src = asset.url;
            audio.load();
          } else {
            fetch(asset.url).then(finish).catch(finish);
          }
        } catch (e: any) {
          console.error(`Preload error for ${asset.url}:`, e);
          setError(e.message || String(e));
          finish();
        }
      });
    };

    const BATCH_SIZE = 3;
    async function loadInitial() {
      for (let i = 0; i < INITIAL_ASSETS.length; i += BATCH_SIZE) {
        const batch = INITIAL_ASSETS.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(a => loadAsset(a, updateProgress)));
      }
    }

    async function loadBackgroundAssets() {
      for (let i = 0; i < BACKGROUND_ASSETS.length; i += BATCH_SIZE) {
        const batch = BACKGROUND_ASSETS.slice(i, i + BATCH_SIZE);
        // Load them without strict progression tracking
        await Promise.all(batch.map(a => loadAsset(a)));
      }
    }

    loadInitial();
  }, []);

  return { progress, isLoaded, error };
}
