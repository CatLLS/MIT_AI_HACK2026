import { useState, useRef, useEffect } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import { VideoPlayer } from './VideoPlayer';
import styles from './LevelDisplay.module.css';

export function Level1Display() {
  const { levelStage, userConstant, setLevelStage } = useLaplaceStore();
  
  const [clickedConstant, setClickedConstant] = useState(false);
  const whisperRef = useRef<HTMLAudioElement>(null);
  const clickVideoRef = useRef<HTMLVideoElement>(null);
  const whisperLoops = useRef(0);

  // Start volume quiet when rendered
  useEffect(() => {
    if (levelStage === 'CLI' && whisperRef.current) {
      whisperRef.current.volume = 0.15; // Starting very quiet
    }
  }, [levelStage]);

  // Handle Whisper Fading Logic
  const handleWhisperEnded = () => {
    if (whisperRef.current) {
      whisperLoops.current += 1;
      if (whisperLoops.current < 4) {
        // Decrease volume each loop (fades from 0.15 -> 0.11 -> 0.07 -> 0.03 -> 0)
        whisperRef.current.volume = Math.max(0, 0.15 - (whisperLoops.current * 0.04));
        whisperRef.current.play().catch(() => {});
      }
    }
  };

  // If in CLI stage, just render the audio
  if (levelStage === 'CLI') {
    return (
      <>
        {/* Narrator audio */}
        <audio autoPlay>
          <source src="/preloads/level1/4v2.wav" type="audio/wav" />
        </audio>
        {/* Whisper loop */}
        <audio 
          ref={whisperRef}
          autoPlay 
          onEnded={handleWhisperEnded}
        >
          <source src="/preloads/level1/iclosedmyeyesWhisper.wav" type="audio/wav" />
        </audio>
      </>
    );
  }

  if (levelStage === 'INTRO') {
     return (
       <div className={styles.transition_container}>
         <VideoPlayer 
           sourceSrc="/preloads/level1/level0DotIntro.mp4"
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
           sourceSrc="/preloads/level1/dotLevelEnding.mp4"
           autoPlay 
           muted={false} 
           playsInline className={styles.transition_video}
           onEnded={() => setLevelStage('PRE_INTERACT')} // A stage to transition to Level 2
         />
       </div>
     );
  }

  // Intercept completion of OUTRO to go to level 2 CLI
  if (levelStage === 'PRE_INTERACT') {
    // We use this as a momentary trigger to bump the level.
    // In a `useEffect` it's safer:
    return <Level1Completer />;
  }

  if (levelStage === 'INTERACT') {
    return (
      <div className={styles.layer_container}>
        {clickedConstant && (
          <VideoPlayer 
            key="video-click-pixel"
            ref={clickVideoRef}
            sourceSrc="/preloads/level1/videoClickOnPixel.mp4"
            className={styles.bg_video} 
            autoPlay 
            muted={false} 
            playsInline
            onEnded={() => setLevelStage('OUTRO')}
            // Backup for robust ending check
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.duration && video.currentTime >= video.duration - 0.5) {
                // Ensure it transitions even if onEnded is unreliable with this specific .mp4 encoding
                setLevelStage('OUTRO');
              }
            }}
            style={{ zIndex: 0 }}
          />
        )}

        {userConstant && (
          <div 
            className={styles.constant_orb} 
            onClick={() => setClickedConstant(true)}
            style={{ 
              zIndex: 1,
              pointerEvents: clickedConstant ? 'none' : 'auto',
              top: '50%',
              left: '50%',
              right: 'auto',
              transform: clickedConstant ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
              transition: 'transform 2s ease'
            }}
          >
            {/* The preloaded generated image from choices (Nostalgia, Longing, Logic, insanity) */}
            <img 
              src={`/preloads/level1/${userConstant.toLowerCase()}Point.png`} 
              alt={userConstant} 
              onError={(e) => { e.currentTarget.src = "/preloads/level1/nostalgiaPoint.png" }} 
            />
            {!clickedConstant && <span className={styles.orb_label}>{userConstant}</span>}
          </div>
        )}
      </div>
    );
  }

  return null;
}

function Level1Completer() {
  const setLevel = useLaplaceStore((state) => state.setLevel);
  const setLevelStage = useLaplaceStore((state) => state.setLevelStage);
  
  useEffect(() => {
    setLevel(2);
    setLevelStage('CLI');
  }, [setLevel, setLevelStage]);
  
  return null;
}

// Removed ClickTransitionTrigger
