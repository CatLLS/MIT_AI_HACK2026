import { useState, useEffect, useRef } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import type { LensType } from '../store/useLaplaceStore';
import styles from './CLI.module.css';

let sharedAudioCtx: AudioContext | null = null;
const playTypingSound = () => {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    osc.type = 'square'; // A softer retro sound
    osc.frequency.setValueAtTime(100 + Math.random() * 50, sharedAudioCtx.currentTime);//this line controls the pitch, lower the number to deepen the sound
    gain.gain.setValueAtTime(0.05, sharedAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    osc.start();
    osc.stop(sharedAudioCtx.currentTime + 0.05);
  } catch (e) { }
};

function TypewriterLine({ text, instant, onDone }: { text: string; instant?: boolean; onDone?: () => void }) {
  const [content, setContent] = useState('');
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (instant) {
      setContent(text);
      const timer = setTimeout(() => {
        onDoneRef.current?.();
      }, 0);
      return () => clearTimeout(timer);
    }

    let i = 0;
    const interval = setInterval(() => {
      setContent(text.substring(0, i + 1));
      if (text[i] && text[i] !== ' ') {
        playTypingSound();
      }
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onDoneRef.current?.();
      }
    }, 30); // Visually fast but distinct typewriter feel

    return () => clearInterval(interval);
  }, [text, instant]);

  return <>{content}</>;
}

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
  const [renderedCount, setRenderedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, renderedCount]);

  // The Typewriter Engine
  useEffect(() => {
    if (!isTyping && renderedCount < logs.length) {
      setRenderedCount(prev => prev + 1);
      setIsTyping(true);
    }
  }, [isTyping, renderedCount, logs.length]);

  // Level 5 Sequence: Auto-close terminal after typing is done
  useEffect(() => {
    if (level === 5 && !isTyping && renderedCount === logs.length && logs.length > 0) {
      const timer = setTimeout(() => {
        useLaplaceStore.getState().setLevelStage('PANORAMA');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [level, isTyping, renderedCount, logs.length]);

  // Initial logs per level
  useEffect(() => {
    if (level === 1) {
      setLogs([
        '> Initializing S-Domain Interface...',
        `> System Status: MARGINALLY STABLE (sigma: ${sigma.toFixed(1)})`,
        '> Complexity Level: 1 (Linear Initialization)',
        '> To stabilize the singularity, identify the Constant.',
        "> If you were a single point in infinity, What is the one thing in your life that stays at $t = \\infty$?",
        '1: The ghost of a memory that feels more real than the present. [Nostalgia]',
        '2: The curiosity about what happens on the very last page I’ll never read. [Longing]',
        '3: The cold comfort of knowing that 1 + 1 will always equal 2. [Logic]',
        '4: The laughter of a mind finally set free from its own boundaries. [Insanity]',
        '(Insert an option from 1 to 4):_'
      ]);
    } else if (level === 2) {
      setLogs((prev) => {
        if (prev.includes('> Complexity Level: 2 (Linear Oscillation)')) return prev;
        return [
          ...prev,
          '> Constant Locked. System processing...',
          '> Complexity Level: 2 (Linear Oscillation)',
          '> Signals repeat. What is the rhythm you find yourself returning to?',
          '1: The comfort of a path so worn that your feet move without your mind. [Habits]',
          '2: The warmth of a conversation where you don\'t have to explain who you are. [Connections]',
          '3: The static of a thousand "what-ifs" overlapping until you can\'t hear your own voice. [Convolution]',
          '4: The internal hum that stays constant even when the world outside goes completely silent. [Soul]',
          '(Insert an option from 1 to 4):_'
        ];
      });
    } else if (level === 3) {
      setLogs((prev) => {
        if (prev.includes('> Loop identified. Resonance detected...')) return prev;
        return [
          ...prev,
          '> Loop identified. Resonance detected...',
          '> Multiple solutions found. To stabilize the output, identify your Filter.',
          '> How do you process the data?',
          '1: Seeing the world as a joke told to a captive audience. [Sarcasm]',
          '2: Analyzing the grain of the wood to ignore the size of the room. [Logic]',
          '3: Moving so fast that the scenery can\'t catch up to the soul. [Velocity]',
          '4: Turning the volume down until the chaos becomes a soft hum. [Damping]',
          '(Insert an option from 1 to 4):_'
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
  }, [level, sigma]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const val = inputValue.trim();
    setInputValue('');

    if (level === 1) {
      const mapping: Record<string, string> = {
        '1': 'Nostalgia',
        '2': 'Longing',
        '3': 'Logic',
        '4': 'Insanity'
      };
      if (!mapping[val]) {
        setLogs((prev) => [...prev, `>> ${val}`, '[ERROR] Invalid choice. Choose 1, 2, 3, or 4.']);
      } else {
        setLogs((prev) => [...prev, `>> ${val}`, `> Constant identified: [${mapping[val]}]`]);
        setConstant(mapping[val]);
      }
    } else if (level === 2) {
      const mapping: Record<string, string> = {
        '1': 'Habits',
        '2': 'Connections',
        '3': 'Convolution',
        '4': 'Soul'
      };
      if (!mapping[val]) {
        setLogs((prev) => [...prev, `>> ${val}`, '[ERROR] Invalid choice. Choose 1, 2, 3, or 4.']);
      } else {
        setLogs((prev) => [...prev, `>> ${val}`, `> Signal identified: [${mapping[val]}]`]);
        setHabit(mapping[val]);
      }
    } else if (level === 3) {
      const mapping: Record<string, LensType> = {
        '1': 'Sarcasm',
        '2': 'Logic',
        '3': 'Velocity',
        '4': 'Damping'
      };
      if (!mapping[val]) {
        setLogs((prev) => [...prev, `>> ${val}`, '[ERROR] Invalid choice. Choose 1, 2, 3, or 4.']);
      } else {
        setLogs((prev) => [...prev, `>> ${val}`, `> Filter identified: [${mapping[val]}]`]);
        setLens(mapping[val]);
      }
    } else if (level === 4) {
      setLogs((prev) => [...prev, `>> ${val}`]);
      setFinalAnswer(val);
    } else if (level === 5) {
      setLogs((prev) => [...prev, `>> ${val}`]);
      if (val.toLowerCase() === 'y') {
        useLaplaceStore.getState().setLevel(6);
      }
    }
  };

  if (level === 0 || level > 5 || useLaplaceStore.getState().levelStage !== 'CLI') return null;

  return (
    <div className={`${styles.cli_container} ${sigma > 0 ? 'glitch-text' : ''}`}>
      <div className={styles.terminal}>
        <div className={styles.logs}>
          {logs.slice(0, renderedCount).map((log, i) => {
            const isInstant = log.startsWith('>> ');
            const displayText = isInstant ? log.replace('>> ', '> ') : log;

            if (i === renderedCount - 1 && isTyping) {
              return (
                <div key={i} className={styles.log_line}>
                  <TypewriterLine
                    text={displayText}
                    instant={isInstant}
                    onDone={() => setIsTyping(false)}
                  />
                </div>
              );
            }
            return <div key={i} className={styles.log_line}>{displayText}</div>;
          })}

          {level < 5 && renderedCount === logs.length && !isTyping && (
            <form className={styles.input_line} onSubmit={handleSubmit}>
              <span className={styles.prompt}>{'>'}</span>
              <input
                type="text"
                autoFocus
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Awaiting choice..."
              />
              <span className={styles.cursor}></span>
            </form>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
