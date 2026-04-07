import { useState, useRef, useEffect } from 'react';
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

  // Force play if autoPlay attribute fails to catch
  useEffect(() => {
    if (levelStage === 'INTERACT' && videoRef.current) {
      videoRef.current.play().catch((e) => console.log('Autoplay block:', e));
    }
  }, [levelStage]);

  if (levelStage === 'INTRO') {
     return (
       <div className={styles.transition_container}>
         <video 
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('INTERACT')}
         >
           <source src="/preloads/level3/PianoIntro.mov" />
         </video>
       </div>
     );
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        <video 
          key="l3-interact"
          ref={videoRef}
          className={styles.bg_video} 
          autoPlay 
          muted={false}
          playsInline
          onEnded={handleVideoEnded}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.duration && video.currentTime >= video.duration - 0.1 && !interactFinished) {
              handleVideoEnded();
            }
          }}
        >
          <source src="/preloads/level3/level3Interact.mp4" type="video/mp4" />
        </video>

        {interactFinished && (
          <>
            <audio 
              autoPlay 
              onEnded={() => {
                setLevel(4);
                setLevelStage('CLI');
              }}
            >
              <source src="/preloads/level3/13v1.wav" type="audio/wav" />
            </audio>

            {userLens && (
              <img 
                src={`/preloads/level3/girl${userLens === 'Sarcasm' ? 'Sarcasmo' : userLens}.png`} 
                className={styles.lens_reflection_fade}
                alt={userLens} 
              />
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}
