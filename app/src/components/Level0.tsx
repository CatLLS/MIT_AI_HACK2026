import { useEffect, useRef } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './Level0.module.css';
import { Terminal } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { VIDEOS, AUDIO } from '../assets/mediaManifest';

export function Level0() {
  const { setLevel, levelStage, setLevelStage } = useLaplaceStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  if (levelStage === 'TIME_DOMAIN_VIDEO') {
    return (
      <div className={styles.container} style={{ background: '#000', padding: 0 }}>
        <VideoPlayer 
          sourceSrc={VIDEOS.TIME_DOMAIN_INTRO}
          autoPlay 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onEnded={() => {
            setLevel(1);
            setLevelStage('CLI');
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <audio ref={audioRef} autoPlay loop src={AUDIO.LANDING_SONG} />
      <div className={styles.screen}>
        <div className={styles.header}>
          <Terminal size={24} className={styles.icon} />
          <span>LAPLACE.TRANSFORM // v1.0.0</span>
        </div>
        
        <div className={styles.content}>
          <h1 className={styles.title}>Co-Authoring Reality with the Machine</h1>
          <p className={styles.text}>
            The Laplace Transform is a mathematical operation that shifts a problem from the Time Domain into the Complex Frequency Domain (the s-plane).
          </p>
          <p className={styles.text}>
            In the time domain, equations describing physical systems can be messy, chaotic, and impossible to solve. By applying the transform, the impossible becomes solvable algebra. A complete change of perspective.
          </p>
          <p className={styles.text}>
            What happens when we apply this transform to a human memory?
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.glitch_btn} onClick={() => setLevelStage('TIME_DOMAIN_VIDEO')}>
            [ INITIALIZE S-DOMAIN ]
          </button>
        </div>
      </div>
    </div>
  );
}
