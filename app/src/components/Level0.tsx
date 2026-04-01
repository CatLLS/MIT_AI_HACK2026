import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './Level0.module.css';
import { Terminal } from 'lucide-react';

export function Level0() {
  const setLevel = useLaplaceStore((state) => state.setLevel);

  return (
    <div className={styles.container}>
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
          <button className={styles.glitch_btn} onClick={() => setLevel(1)}>
            [ INITIALIZE S-DOMAIN ]
          </button>
        </div>
      </div>
    </div>
  );
}
