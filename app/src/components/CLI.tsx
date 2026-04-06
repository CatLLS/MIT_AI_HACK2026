import { useState, useEffect, useRef } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './CLI.module.css';

export function CLI() {
  const { 
    level, 
    sigma,
    setConstant, 
    setHabit, 
    setLens, 
    setFinalAnswer 
  } = useLaplaceStore();
  
  const [logs, setLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Initial logs per level
  useEffect(() => {
    if (level === 1) {
      setLogs([
        '> Initializing S-Domain Interface...',
        `> System Status: MARGINALLY STABLE (sigma: ${sigma.toFixed(1)})`,
        '> Complexity Level: 1 (Linear Initialization)',
        '> To stabilize the singularity, identify the Constant.',
        '> What is the one thing in your life that never changes, no matter the time?',
        '> [Options: Bread, Coffee, Sky]'
      ]);
    } else if (level === 2) {
      setLogs((prev) => {
        if (prev.includes('> Complexity Level: 2 (Linear Oscillation)')) return prev;
        return [
          ...prev,
          '> Constant Locked. System processing...',
          '> Complexity Level: 2 (Linear Oscillation)',
          '> Signals repeat. What is a habit or a memory that keeps oscillating in your mind, refusing to decay?',
          '> [Options: Rain, Traffic, Wind]'
        ];
      });
    } else if (level === 3) {
      setLogs((prev) => {
        if (prev.includes('> Loop identified. Resonance detected...')) return prev;
        return [
          ...prev,
          '> Loop identified. Resonance detected...',
          '> Multiple solutions found. To stabilize the output, identify your Filter.',
          '> What is the lens you use to protect yourself from the noise?',
          '> [Options: Sarcasm, Logic, Silence, Work]'
        ];
      });
    } else if (level === 4) {
      setLogs((prev) => {
        if (prev.includes('> Complexity: MAX (Identity Overflow)')) return prev;
        return [
          ...prev,
          '> Evaluating Filter...',
          '> Complexity: MAX (Identity Overflow)',
          '> W H O A M I ?'
        ];
      });
    } else if (level === 5) {
      setLogs((prev) => {
        if (prev.includes('> FATAL ERROR: OVERFLOW // IDENTITY NOT FOUND.')) return prev;
        return [
          ...prev,
          '> FATAL ERROR: OVERFLOW // IDENTITY NOT FOUND.',
          '> Attempting Inverse Transform L⁻¹...',
          '> Warning: Real-time signal contains non-linearities.',
        ];
      });
    }
  }, [level]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const normalized = inputValue.trim().toLowerCase();
    
    // Check required options based on level
    if (level === 1) {
      if (!['bread', 'coffee', 'sky'].includes(normalized)) {
        setLogs((prev) => [...prev, `> ${inputValue}`, '[ERROR] Invalid Constant. Choose: Bread, Coffee, Sky']);
        setInputValue('');
        return;
      }
      setLogs((prev) => [...prev, `> ${inputValue}`]);
      setConstant(normalized.charAt(0).toUpperCase() + normalized.slice(1));
    } else if (level === 2) {
      if (!['rain', 'traffic', 'wind'].includes(normalized)) {
        setLogs((prev) => [...prev, `> ${inputValue}`, '[ERROR] Invalid Habit. Choose: Rain, Traffic, Wind']);
        setInputValue('');
        return;
      }
      setLogs((prev) => [...prev, `> ${inputValue}`]);
      setHabit(normalized.charAt(0).toUpperCase() + normalized.slice(1));
    } else if (level === 3) {
      if (['sarcasm', 'logic', 'silence', 'work'].includes(normalized)) {
        const lensLiteral = normalized.charAt(0).toUpperCase() + normalized.slice(1) as 'Sarcasm' | 'Logic' | 'Silence' | 'Work';
        setLogs((prev) => [...prev, `> ${inputValue}`]);
        setLens(lensLiteral);
      } else {
        setLogs((prev) => [...prev, `> ${inputValue}`, '[ERROR] Invalid Lens. Choose: Sarcasm, Logic, Silence, Work']);
        setInputValue('');
        return;
      }
    } else if (level === 4) {
      setLogs((prev) => [...prev, `> ${inputValue}`]);
      setFinalAnswer(inputValue);
    } else if (level === 5) {
      setLogs((prev) => [...prev, `> ${inputValue}`]);
      if (normalized === 'y') {
        useLaplaceStore.getState().setLevel(6); // Trigger 360 climax
      }
    }

    setInputValue('');
  };

  // If level 0 or >=6, or not in CLI stage, it is hidden
  if (level === 0 || level > 5 || useLaplaceStore.getState().levelStage !== 'CLI') return null;

  return (
    <div className={`${styles.cli_container} ${sigma > 0 ? 'glitch-text' : ''}`}>
      <div className={styles.terminal}>
        <div className={styles.logs}>
          {logs.map((log, i) => (
            <div key={i} className={styles.log_line}>
              {log}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        {/* Level 5 is audio-driven — no text input */}
        {level < 5 && (
          <form className={styles.input_line} onSubmit={handleSubmit}>
            <span className={styles.prompt}>{'>'}</span>
            <input 
              type="text" 
              autoFocus
              className={styles.input}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Awaiting input..."
            />
            <span className={styles.cursor}></span>
          </form>
        )}
      </div>
    </div>
  );
}
