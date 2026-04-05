import { useLaplaceStore } from './store/useLaplaceStore';
import { Level0 } from './components/Level0';
import { CLI } from './components/CLI';
import { LiveFormula } from './components/LiveFormula';
import { LevelDisplay } from './components/LevelDisplay';
import { Climax360 } from './components/Climax360';
import './index.css';
import { useEffect } from 'react';

function App() {
  const { level, levelStage, sigma } = useLaplaceStore();

  // Dynamic stability effects based on sigma
  useEffect(() => {
    const container = document.getElementById('app-container');
    if (container) {
      if (sigma > 0) {
        // Unstable state: UI breakdown
        container.style.animation = `glitch-shake ${1 / Math.max(sigma, 0.1)}s infinite`;
        container.style.filter = `hue-rotate(${Math.min(sigma * 15, 360)}deg) blur(${Math.min(sigma, 10)}px)`;
      } else {
        // Stable
        container.style.animation = 'none';
        container.style.filter = 'none';
      }
    }
  }, [sigma]);

  return (
    <div id="app-container" className="unstable-container" style={{ width: '100%', height: '100%' }}>
      {level === 0 && <Level0 />}
      
      {/* HUD overlays that persist across levels > 0 */}
      {levelStage === 'CLI' && <CLI />}
      {level > 0 && levelStage !== 'CLI' && levelStage !== 'DEATH' && <LiveFormula />}

      {/* Background / Game Layers */}
      <LevelDisplay />
      
      {/* Fallback for Level 4+ before 360 view renders */}
      {(level === 4 || level === 5) && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <h1>[ FATAL ERROR: OVERFLOW // SYSTEM UNABLE TO RESOLVE DOMAIN ]</h1>
          {/* A montage video plays here. Assuming `overflow_montage.mp4` will be added to preloads/climax */}
          <video autoPlay loop muted style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, opacity: 0.3, mixBlendMode: 'screen' }}>
            <source src="/preloads/climax/overflow_montage.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Level 6: 360 Climax */}
      {level === 6 && <Climax360 />}
    </div>
  );
}

export default App;
