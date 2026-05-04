import { useState, useRef, useEffect } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import { VideoPlayer } from './VideoPlayer';

import styles from './LevelDisplay.module.css';
import { VIDEOS, AUDIO, getLensImage } from '../assets/mediaManifest';

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
         <VideoPlayer 
           sourceSrc={VIDEOS.L3_PIANO_INTRO}
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('INTERACT')}
         />
       </div>
     );
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        <VideoPlayer 
          key="l3-interact"
          ref={videoRef}
          sourceSrc={VIDEOS.L3_INTERACT}
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
        />

        {interactFinished && (
          <>
            <audio 
              autoPlay 
              src={AUDIO.L3_NARRATOR}
              onEnded={() => {
                setLevel(4);
                setLevelStage('CLI');
              }}
            />

            {userLens && (
              <img 
                src={getLensImage(userLens)}
                className={styles.lens_reflection_fade}
                alt={userLens}
                crossOrigin="anonymous"
              />
            )}
          </>
        )}
      </div>
    );
  }

  return null;
}
