import { useEffect, useState, useMemo } from 'react';
import { useLaplaceStore } from '../store/useLaplaceStore';
import './BreakdownOverlay.css';

const MATH_SYMBOLS = [
  'F(s)', '∫', 'e^{-st}', 'σ', 'jω', '∞', 'Σ', 'Δ', 'λ', '∂', 
  'L⁻¹', '∮', 'ℒ', '→∞', 's²+ω²', '1/s', 'δ(t)', 'u(t)',
  'OVERFLOW', 'UNSTABLE', 'σ > 0', 'POLE', 'ZERO', 'DIVERGENT',
  'ERROR', 'NaN', '∄', '⊘', '∅', 'FATAL'
];

const ERROR_TEXTS = [
  'SYSTEM FAILURE', 'IDENTITY NOT FOUND', 'OVERFLOW', 'UNSTABLE',
  'POLES IN RIGHT HALF PLANE', 'DIVERGENT', 'FATAL ERROR',
  'CANNOT RESOLVE', 'NaN', 'STACK OVERFLOW', 'SEGFAULT'
];

function BleedingSymbol({ symbol, delay }: { symbol: string; delay: number }) {
  const style = useMemo(() => ({
    left: `${Math.random() * 95}vw`,
    top: `${Math.random() * 95}vh`,
    fontSize: `${0.8 + Math.random() * 2.5}rem`,
    animationDelay: `${delay}ms`,
  }), [delay]);

  return <div className="bleeding-symbol" style={style}>{symbol}</div>;
}

function AnswerBleed({ answer }: { answer: string }) {
  const positions = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      left: `${Math.random() * 85}vw`,
      top: `${Math.random() * 85}vh`,
      fontSize: `${2 + Math.random() * 10}rem`,
      transform: `rotate(${-45 + Math.random() * 90}deg)`,
    }));
  }, []);

  return (
    <>
      {positions.map((style, i) => (
        <div 
          className="answer-bleed" 
          style={{ ...style, animationDelay: `${100 + i * 200}ms` }} 
          key={i}
        >
          {answer}
        </div>
      ))}
    </>
  );
}

function ErrorTexts() {
  const items = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      text: ERROR_TEXTS[i % ERROR_TEXTS.length],
      left: `${Math.random() * 90}vw`,
      top: `${Math.random() * 90}vh`,
      fontSize: `${1 + Math.random() * 3}rem`,
      transform: `rotate(${-30 + Math.random() * 60}deg)`,
      animationDelay: `${i * 150}ms`,
    }));
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <div className="error-text" style={{
          left: item.left,
          top: item.top,
          fontSize: item.fontSize,
          transform: item.transform,
          animationDelay: item.animationDelay,
        }} key={i}>
          {item.text}
        </div>
      ))}
    </>
  );
}

export function BreakdownOverlay() {
  const { levelStage, finalAnswer, setLevelStage, setSigma } = useLaplaceStore();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (levelStage !== 'BREAKING') return;

    // Phase 1: snap UI, letters start falling + error text
    const t1 = setTimeout(() => setPhase(1), 300);
    // Phase 2: flip/snap to random positions, user answer everywhere
    const t2 = setTimeout(() => setPhase(2), 1500);
    // Phase 3: obscure screen → montage
    const t3 = setTimeout(() => setPhase(3), 3500);
    // Phase 4: transition to MONTAGE
    const t4 = setTimeout(() => {
      setSigma(-1); // Reset sigma before montage
      setLevelStage('MONTAGE');
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [levelStage, setLevelStage, setSigma]);

  if (levelStage !== 'BREAKING') return null;

  return (
    <div className={`breakdown-overlay phase-${phase}`}>
      {/* Scrolling formula that breaks out of bounds */}
      <div className="formula-scroll">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="formula-scroll-item">
            F(s) = ∫₀^∞ e^(-st) f(t) dt &nbsp;•&nbsp; 
          </span>
        ))}
      </div>

      {/* Snap UI transforms — applied to the whole page via CSS */}
      {phase >= 1 && <div className="snap-glitch-layer" />}

      {/* Bleeding math symbols */}
      {phase >= 1 && MATH_SYMBOLS.map((sym, i) => (
        <BleedingSymbol symbol={sym} delay={i * 80} key={`a-${i}`} />
      ))}

      {/* Error texts of various sizes */}
      {phase >= 1 && <ErrorTexts />}

      {/* The user's answer plastered huge in red */}
      {phase >= 2 && finalAnswer && <AnswerBleed answer={finalAnswer} />}

      {/* More symbols for chaos */}
      {phase >= 2 && MATH_SYMBOLS.map((sym, i) => (
        <BleedingSymbol symbol={sym} delay={i * 50 + 500} key={`b-${i}`} />
      ))}

      {/* Full screen black out */}
      {phase >= 3 && <div className="breakdown-obscure" />}
    </div>
  );
}
