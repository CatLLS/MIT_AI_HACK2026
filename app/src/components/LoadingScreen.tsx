import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

const MESSAGES = [
  "Loading alternative perspectives...",
  "Preparing system for time domain storm...",
  "Cleaning up my room...",
  "Mapping Imaginary Axis...",
  "Calibrating S-Plane singularity...",
  "Initializing frequency response...",
  "Decrypting Laplace memories...",
  "Synchronizing unstable poles...",
  "Filtering out standard reality...",
  "Buffering emotional resonances..."
];

interface LoadingScreenProps {
  progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Randomize message every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animated dots for the "active" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.background_fx} />
      <div className={styles.glitch_overlay} />
      
      <div className={styles.content}>
        <h1 className={styles.title}>Loading Laplace Transform Experience</h1>
        
        <div className={styles.bar_container}>
          <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
        
        <div className={styles.percentage}>{progress}%</div>
        
        <div className={styles.message}>
          {MESSAGES[messageIndex]}{dots}
        </div>
      </div>
    </div>
  );
}
