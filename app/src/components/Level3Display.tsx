import { useState, useRef } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LevelDisplay.module.css';

export function Level3Display() {
  const { levelStage, userLens, setLevelStage, setLevel } = useLaplaceStore();
  const [interactFinished, setInteractFinished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // When video ends, pause on last frame and show overlay
  const handleVideoEnded = () => {
    setInteractFinished(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  if (levelStage === 'INTRO') {
     return (
       <div className={styles.transition_container}>
         <video 
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('INTERACT')}
         >
           <source src="/preloads/level3/PianoIntro.mov" type="video/mp4" />
         </video>
       </div>
     );
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        <video 
          ref={videoRef}
          className={styles.bg_video} 
          autoPlay 
          muted={false}
          playsInline
          onEnded={handleVideoEnded}
        >
          <source src="/preloads/level3/level3Interact.mp4" type="video/mp4" />
        </video>

        {interactFinished && (
          <>
            <audio autoPlay>
              <source src="/preloads/level3/13v1.wav" type="audio/wav" />
            </audio>

            {userLens && (
              <img 
                src={`/preloads/level3/lens_${userLens.toLowerCase()}_image.png`} 
                className={styles.lens_reflection}
                alt={userLens} 
                style={{ mixBlendMode: 'overlay', opacity: 0.8 }}
                onError={(e) => { e.currentTarget.src = `/preloads/level3/lens_${userLens.toLowerCase()}.png` }} // Fallback
              />
            )}

            <button 
              className={styles.reboot_btn} 
              style={{ position: 'absolute', bottom: '10%' }}
              onClick={() => {
                setLevel(4);
                setLevelStage('CLI');
              }}
            >
              [ PROCEED ]
            </button>
          </>
        )}
      </div>
    );
  }

  return null;
}
