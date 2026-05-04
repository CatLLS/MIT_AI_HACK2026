import { useState, useEffect } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import { VideoPlayer } from './VideoPlayer';

import styles from './LevelDisplay.module.css';
import { VIDEOS, AUDIO, getSkyImage } from '../assets/mediaManifest';

export function Level2Display() {
  const { levelStage, sigma, setSigma, userHabit, setLevelStage, setLevel } = useLaplaceStore();
  
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPopup, setShowPopup] = useState(useLaplaceStore.getState().minigameSave);
  const [minigameWon, setMinigameWon] = useState(false);
  const [timer, setTimer] = useState(15);
  
  // Independent visual drifts for the "poles"
  const [drift1, setDrift1] = useState(0);
  const [drift2, setDrift2] = useState(0);

  // Survival Timer & Game Over
  useEffect(() => {
    if (isGlitching && !minigameWon) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            setMinigameWon(true);
            setTimeout(() => {
              setLevelStage('OUTRO');
              setSigma(0);
            }, 1000);
            return 0;
          }
          return prev - 1;
        });

        // Fail if sigma goes too far right
        if (useLaplaceStore.getState().sigma > 4.6) {
          setLevelStage('DEATH');
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isGlitching, minigameWon, setLevelStage, setSigma]);

  // Mandatory Drift Logic (Every frame)
  useEffect(() => {
    if (isGlitching && !minigameWon) {
      let frameId: number;
      const drift = () => {
        // System pulls sigma towards the right (unstable)
        // Complexity increases as time runs out
        const intensity = (0.01 + (15 - timer) * 0.002) * 1.25; 
        setSigma(useLaplaceStore.getState().sigma + intensity);

        // Individual visual wobbles
        setDrift1(Math.sin(Date.now() / 200) * 0.2);
        setDrift2(Math.cos(Date.now() / 300) * 0.3);

        frameId = requestAnimationFrame(drift);
      };
      frameId = requestAnimationFrame(drift);
      return () => cancelAnimationFrame(frameId);
    }
  }, [isGlitching, minigameWon, setSigma, timer]);

  if (levelStage === 'INTRO') {
     return (
       <div className={styles.transition_container}>
         <VideoPlayer 
           sourceSrc={VIDEOS.L2_INTRO}
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('INTERACT')}
         />
       </div>
     );
  }

  if (levelStage === 'OUTRO') {
     return (
       <div className={styles.transition_container}>
         <VideoPlayer 
           sourceSrc={VIDEOS.L2_ENDING}
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => {
             setLevel(3);
             setLevelStage('CLI');
           }}
         />
       </div>
     );
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        <img
          src={getSkyImage(userHabit || '')}
          crossOrigin="anonymous"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: minigameWon ? 'grayscale(100%) brightness(0.7)' : 'none',
            transition: 'filter 2s ease'
          }}
          alt=""
        />

        {!isGlitching && !showPopup && !useLaplaceStore.getState().minigameSave && (
          <>
            <VideoPlayer 
              key="video-clean"
              sourceSrc={VIDEOS.L2_GIRL_BOY_CLEAN}
              autoPlay 
              muted={false} 
              playsInline 
              className={styles.bg_video}
              onEnded={() => {
                useLaplaceStore.getState().setMinigameSave(true);
                setShowPopup(true);
              }}
              style={{ position: 'absolute', inset: 0, zIndex: 1, mixBlendMode: 'normal' }}
            />
          </>
        )}

        {showPopup && (
          <div style={{ position: 'absolute', zIndex: 100, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <audio autoPlay src={AUDIO.L2_NARRATOR} />

            <div className={styles.instruction_popup} style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
              <h1>SYSTEM OVERLOAD</h1>
              <p>The system is oscillating out of control. The poles are drifting toward the danger zone (+4.6). FIGHT THE DRIFT by holding the slider to the left. SURVIVE FOR 15 SECONDS.</p>
              
              <button 
                className={styles.reboot_btn} 
                style={{ marginTop: '2rem' }}
                onClick={() => {
                  setShowPopup(false);
                  setIsGlitching(true);
                  setSigma(-3); // Start user in a safe spot
                }}
              >
                [ STABILIZE ]
              </button>
            </div>
          </div>
        )}

        {isGlitching && !minigameWon && (
          <>
            <VideoPlayer 
              sourceSrc={VIDEOS.L2_GIRL_BOY_GLITCH}
              autoPlay 
              loop
              muted={false} 
              playsInline 
              className={styles.bg_video}
              style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            />

            <div className={styles.damping_ui}>
              <div style={{ color: '#ff003c', fontSize: '1.5rem', marginBottom: '1rem' }}>STABILITY TIMER: {timer}s</div>
              <label>PULL LEFT TO FIGHT DRIFT ( \sigma )</label>
              <input 
                type="range" 
                min="-5" 
                max="5" 
                step="0.01" 
                value={sigma} 
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.poles_grid}>
                 <div className={styles.pole_mark} style={{ left: `calc(50% + ${(sigma + drift1) * 20}px)`, top: '30%' }}>✕</div>
                 <div className={styles.pole_mark} style={{ left: `calc(50% + ${(sigma + drift2) * 20}px)`, top: '70%' }}>✕</div>
                 <div style={{ position: 'absolute', right: 0, width: '10px', height: '100%', background: 'rgba(255,0,0,0.3)', borderLeft: '2px dashed red' }} />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
