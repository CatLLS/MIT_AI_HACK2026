import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LevelDisplay.module.css';
import { Level1Display } from './Level1Display';
import { Level2Display } from './Level2Display';
import { Level3Display } from './Level3Display';

export function LevelDisplay() {
  const { 
    level,
    levelStage,
    resetExperience
  } = useLaplaceStore();

  if (level === 0 || level > 3) return null;

  if (levelStage === 'DEATH') {
    return (
      <div className={styles.death_container}>
        <div className={styles.death_message}>
          <h1 className="glitch-text" data-text="FATAL RESONANCE">FATAL RESONANCE</h1>
          <p>SYSTEM COLLAPSE. POLES HAVE ENTERED THE RIGHT-HALF PLANE.</p>
          <button onClick={() => {
            if (level === 2 && useLaplaceStore.getState().minigameSave) {
              useLaplaceStore.getState().setLevelStage('INTERACT');
              useLaplaceStore.getState().setSigma(-3);
            } else {
              resetExperience();
            }
          }} className={styles.reboot_btn}>
            {'>'} REBOOT CONSCIOUSNESS
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fullscreen}>
      {level === 1 && <Level1Display />}
      {level === 2 && <Level2Display />}
      {level === 3 && <Level3Display />}
    </div>
  );
}
