import { useState } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import { PanoramaView } from './PanoramaView';
import { useSplatPreloader } from '../hooks/useSplatPreloader';
import styles from './Climax360.module.css';
import { AUDIO } from '../assets/mediaManifest';

type AudioPhase = 'audio14' | 'audio16' | 'audio17' | 'prompt';

export function Level5AudioSequence() {
  const { setLevelStage, setLevel } = useLaplaceStore();
  const [audioPhase, setAudioPhase] = useState<AudioPhase>('audio14');

  // Prime the gaussian splat into browser disk cache while the user listens
  // to the audio sequence. The splat takes ~33 MB — the user has several minutes
  // to let it download before Climax360 mounts.
  useSplatPreloader();

  const handleDeath = () => {
    setLevelStage('DEATH');
  };

  const handleOpenEyes = () => {
    setLevel(6);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div className={styles.hud_instructions} style={{ zIndex: 7000, pointerEvents: 'none' }}>
        DRAG TO LOOK AROUND
      </div>

      {/* 360 Panorama Background */}
      <PanoramaView />

      {/* Audio Chain Logic */}
      <div style={{ pointerEvents: 'none' }}>
        {audioPhase === 'audio14' && (
          <audio autoPlay src={AUDIO.CLIMAX_14} onEnded={() => setAudioPhase('audio16')} />
        )}
        {audioPhase === 'audio16' && (
          <audio autoPlay src={AUDIO.CLIMAX_16} onEnded={() => setAudioPhase('audio17')} />
        )}
        {audioPhase === 'audio17' && (
          <audio autoPlay src={AUDIO.CLIMAX_17} onEnded={() => setAudioPhase('prompt')} />
        )}
        {audioPhase === 'prompt' && (
          <audio autoPlay src={AUDIO.CLIMAX_18} />
        )}
      </div>

      {/* Overlay appears after audio14, 16, 17 finished */}
      {audioPhase === 'prompt' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.4)', // Slightly less opaque than before to see the panorama
          backdropFilter: 'blur(5px)',
          fontFamily: "'Courier New', monospace",
        }}>
          <p style={{
            color: '#c77dff',
            fontSize: '2rem',
            letterSpacing: '0.3em',
            textShadow: '0 0 20px #9d00ff',
            marginBottom: '3rem',
            animation: 'pulse 2s ease-in-out infinite',
          }}>
            open your eyes?
          </p>

          <div style={{ display: 'flex', gap: '2rem', pointerEvents: 'auto' }}>
            <button
              onClick={handleOpenEyes}
              style={{
                background: 'transparent',
                border: '1px solid #c77dff',
                color: '#c77dff',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.2em',
                textShadow: '0 0 10px #9d00ff',
                boxShadow: '0 0 15px rgba(157,0,255,0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(157,0,255,0.2)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(157,0,255,0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(157,0,255,0.3)';
              }}
            >
              [ YES ]
            </button>

            <button
              onClick={handleDeath}
              style={{
                background: 'transparent',
                border: '1px solid #ff003c',
                color: '#ff003c',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.2em',
                textShadow: '0 0 10px #ff003c',
                boxShadow: '0 0 15px rgba(255,0,60,0.3)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,0,60,0.1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,0,60,0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255,0,60,0.3)';
              }}
            >
              [ NO ]
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
