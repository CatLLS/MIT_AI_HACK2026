import { useState } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';

type AudioPhase = 'audio16' | 'audio17' | 'audio18' | 'done';

export function Level5AudioSequence() {
  const { setLevelStage, setLevel } = useLaplaceStore();
  const [audioPhase, setAudioPhase] = useState<AudioPhase>('audio16');

  const handleDeath = () => {
    setLevelStage('DEATH');
  };

  const handleOpenEyes = () => {
    setLevel(6);
  };

  return (
    <>
      {/* Audio 16 -> 17 -> 18 chain */}
      {audioPhase === 'audio16' && (
        <audio autoPlay onEnded={() => setAudioPhase('audio17')}>
          <source src="/preloads/climax/16v1.wav" type="audio/wav" />
        </audio>
      )}
      {audioPhase === 'audio17' && (
        <audio autoPlay onEnded={() => setAudioPhase('audio18')}>
          <source src="/preloads/climax/17v1.wav" type="audio/wav" />
        </audio>
      )}
      {audioPhase === 'audio18' && (
        <audio autoPlay>
          <source src="/preloads/climax/18v1.wav" type="audio/wav" />
        </audio>
      )}

      {/* On audio18, show the "open your eyes?" overlay */}
      {(audioPhase === 'audio18' || audioPhase === 'done') && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.92)',
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

          <div style={{ display: 'flex', gap: '2rem' }}>
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
    </>
  );
}
