import { useLaplaceStore } from './store/useLaplaceStore';
import { Level0 } from './components/Level0';
import { CLI } from './components/CLI';
import { LiveFormula } from './components/LiveFormula';
import { LevelDisplay } from './components/LevelDisplay';
import { Climax360 } from './components/Climax360';
import { BreakdownOverlay } from './components/BreakdownOverlay';
import { Level5AudioSequence } from './components/Level5AudioSequence';
import { CRTOverlay } from './components/CRTOverlay';
import { LoadingScreen } from './components/LoadingScreen';
import { useAssetPreloader } from './hooks/useAssetPreloader';
import { VideoPlayer } from './components/VideoPlayer';
import './index.css';
import { useEffect } from 'react';

function App() {
  const { level, levelStage, sigma, setLevel, setLevelStage } = useLaplaceStore();
  const { progress, isLoaded } = useAssetPreloader();

  // Safety guard: if level is 0, always ensure we're in a valid landing stage
  useEffect(() => {
    if (level === 0 && levelStage !== 'LANDING' && levelStage !== 'TIME_DOMAIN_VIDEO') {
      setLevelStage('LANDING');
    }
  }, []); // Only on mount

  // Dynamic stability effects based on sigma (only during normal gameplay, not during breakdown)
  useEffect(() => {
    const container = document.getElementById('app-container');
    if (!container) return;

    // During BREAKING, MONTAGE, or level 5+, forcefully clear all CSS effects
    if (levelStage === 'MONTAGE' || levelStage === 'PANORAMA' || level >= 5) {
      container.classList.remove('app-breaking');
      container.style.animation = 'none';
      container.style.filter = 'none';
      container.style.transform = 'none';
      return;
    }

    if (levelStage === 'BREAKING') {
      // No container effects — the BreakdownOverlay handles its own visuals
      container.style.animation = 'none';
      container.style.filter = 'none';
      return;
    }

    container.classList.remove('app-breaking');
    if (sigma > 0 && level < 5) {
      container.style.animation = `glitch-shake ${1 / Math.max(sigma, 0.1)}s infinite`;
      container.style.filter = `hue-rotate(${Math.min(sigma * 15, 360)}deg)`;
    } else {
      container.style.animation = 'none';
      container.style.filter = 'none';
    }
  }, [sigma, levelStage, level]);

  return (
    <div id="app-container" className="unstable-container" style={{ width: '100%', height: '100%' }}>
      {!isLoaded && <LoadingScreen progress={progress} />}
      
      {/* Level 1-5 CRT Overlay (Hidden in Climax and 360 Panorama for clarity) */}
      {level < 5 && <CRTOverlay />}

      {/* Level 0: always render when level === 0, regardless of levelStage */}
      {level === 0 && <Level0 />}
      
      {/* HUD overlays that persist across levels > 0 */}
      {levelStage === 'CLI' && <CLI />}
      {level > 0 && levelStage !== 'CLI' && levelStage !== 'DEATH' && levelStage !== 'BREAKING' && levelStage !== 'MONTAGE' && levelStage !== 'PANORAMA' && <LiveFormula />}

      {/* Background / Game Layers (levels 1-3) */}
      <LevelDisplay />

      {/* Level 4: visual chaos breakdown */}
      {levelStage === 'BREAKING' && <BreakdownOverlay />}

      {/* MONTAGE: fullscreen video before level 5 */}
      {levelStage === 'MONTAGE' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 8500, background: '#000' }}>
          <VideoPlayer
            sourceSrc="/preloads/climax/finaleMontage.mp4"
            autoPlay
            playsInline
            muted={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onEnded={() => {
              setLevel(5);
              setLevelStage('CLI');
            }}
          />
        </div>
      )}

      {/* Level 5: 360 Panorama Sequence (starts after CLI finishes) */}
      {level === 5 && levelStage === 'PANORAMA' && <Level5AudioSequence />}

      {/* Level 6: 360 Splat World */}
      {level === 6 && <Climax360 />}
    </div>
  );
}

export default App;
