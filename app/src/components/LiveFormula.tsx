import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LiveFormula.module.css';
import katex from 'katex';
import { useEffect, useRef } from 'react';

export function LiveFormula() {
  const { 
    level, 
    userConstant, 
    userHabit, 
    userLens 
  } = useLaplaceStore();
  
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mapping internal state to formula placeholders
    const constantTxt = userConstant ? userConstant : 'Constant';
    const signalTxt = userHabit ? userHabit : 'Signal';
    const filterTxt = userLens ? userLens : 'Filter';

    // The user's requested formula: H(s) = [Filter / (s + Constant)] * e^{-Signal}
    // We use \text{} for the conceptual keywords to keep it readable in LaTeX
    const expression = `H(s) = \\frac{\\text{${filterTxt}}}{s + \\text{${constantTxt}}} \\cdot e^{-\\text{${signalTxt}}}`;

    if (formulaRef.current) {
      katex.render(expression, formulaRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [level, userConstant, userHabit, userLens]);

  // Hide formula on landing and in the 360 climax
  if (level === 0 || level > 5) return null;

  return (
    <div className={styles.formula_container}>
      <div className={styles.label}>LIVE SYSTEM MODEL</div>
      <div ref={formulaRef} className={styles.math_content} />
    </div>
  );
}
