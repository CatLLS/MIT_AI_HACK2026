import { useState, useEffect } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LevelDisplay.module.css';

export function Level2Display() {
  const { levelStage, sigma, setSigma, userHabit, setLevelStage, setLevel } = useLaplaceStore();
  
  const [isGlitching, setIsGlitching] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [minigameWon, setMinigameWon] = useState(false);

  // Failure timer
  useEffect(() => {
    if (isGlitching && !minigameWon) {
      const dt = setTimeout(() => {
        if (useLaplaceStore.getState().sigma > -2) {
          setLevelStage('DEATH');
        }
      }, 15000); // 15 seconds to survive parameter
      return () => clearTimeout(dt);
    }
  }, [isGlitching, minigameWon, setLevelStage]);

  // Winning the minigame
  useEffect(() => {
    if (isGlitching && sigma <= -2 && !minigameWon) {
      setMinigameWon(true);
      // Brief pause before playing outro video
      setTimeout(() => {
        setLevelStage('OUTRO');
        setSigma(0); // reset noise
      }, 1000);
    }
  }, [sigma, isGlitching, minigameWon, setLevelStage, setSigma]);

  if (levelStage === 'INTRO') {
     return (
       <div className={styles.transition_container}>
         <video 
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('INTERACT')}
         >
           <source src="/preloads/level2/level2Intro.mov" type="video/mp4" />
         </video>
       </div>
     );
  }

  if (levelStage === 'OUTRO') {
     return (
       <div className={styles.transition_container}>
         <video 
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => {
             setLevel(3);
             setLevelStage('CLI');
           }}
         >
           <source src="/preloads/level2/Level2End.mp4" type="video/mp4" />
         </video>
       </div>
     );
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        {/* Background driven by habit */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(/preloads/level2/${userHabit?.toLowerCase()}_bg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: minigameWon ? 'grayscale(100%) brightness(0.7)' : 'none',
          transition: 'filter 2s ease'
        }} />

        {!isGlitching && !showPopup && (
          <video 
            key="video-clean"
            autoPlay 
            muted={false} 
            playsInline 
            className={styles.bg_video}
            onEnded={() => setShowPopup(true)}
            style={{ position: 'absolute', inset: 0, zIndex: 1, mixBlendMode: 'normal' }}
          >
            <source src="/preloads/level2/girl&boy(clean).webm" type="video/webm" />
          </video>
        )}

        {showPopup && (
          <div style={{ position: 'absolute', zIndex: 100, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <audio autoPlay>
              <source src="/preloads/level2/10v2.wav" type="audio/wav" />
            </audio>

            <div className={styles.instruction_popup} style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none' }}>
              <h1>CRITICAL INSTABILITY</h1>
              <p>The system is tearing itself apart. Slide the damping coefficient completely to the left (below -2) before the loop destroys you (15s).</p>
              
              <button 
                className={styles.reboot_btn} 
                style={{ marginTop: '2rem' }}
                onClick={() => {
                  setShowPopup(false);
                  setIsGlitching(true);
                }}
              >
                [ OK ]
              </button>
            </div>
          </div>
        )}

        {isGlitching && !minigameWon && (
          <>
            <video 
              autoPlay 
              loop
              muted={false} 
              playsInline 
              className={styles.bg_video}
              style={{ position: 'absolute', inset: 0, zIndex: 1 }}
            >
              <source src="/preloads/level2/girl&boyGlitch.mov" />
            </video>

            <div className={styles.damping_ui}>
              <label>SYSTEM NOISE DAMPING (REAL PART \sigma)</label>
              <input 
                type="range" 
                min="-5" 
                max="5" 
                step="0.1" 
                value={sigma} 
                onChange={(e) => setSigma(parseFloat(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.poles_grid}>
                 <div className={styles.pole_mark} style={{ left: `calc(50% + ${sigma * 10}px)`, top: '30%' }}>✕</div>
                 <div className={styles.pole_mark} style={{ left: `calc(50% + ${sigma * 10}px)`, top: '70%' }}>✕</div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return null;
}
