import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LiveFormula.module.css';
import katex from 'katex';
import { useEffect, useRef } from 'react';

export function LiveFormula() {
  const { level, userConstant, userLens } = useLaplaceStore();
  const formulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let expression = 'F(s) = \\int_{0}^{\\infty} e^{-st} f(t) dt'; // default

    if (level === 1 && userConstant) {
      expression = `F(s) = \\frac{\\text{${userConstant}}}{s}`;
    } else if (level === 2) {
      // Loop of Habits
      expression = `F(s) = \\frac{\\omega}{s^2 + \\omega^2}`;
    } else if (level === 3) {
      // The Filter
      const lensTxt = userLens ? userLens : '\\text{Lens}';
      expression = `F(s) = \\frac{s + \\text{${lensTxt}}}{(s+a)^2 + b^2}`;
    } else if (level === 4) {
      // Maximum complexity
      expression = `F(s) = \\frac{s + \\text{???}}{(s - \\sigma - j\\omega)(s - \\sigma + j\\omega)}`;
    }

    if (formulaRef.current) {
      katex.render(expression, formulaRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [level, userConstant, userLens]);

  if (level === 0 || level > 5) return null;

  return (
    <div className={styles.formula_container}>
      <div className={styles.label}>LIVE DOMAIN MODEL</div>
      <div ref={formulaRef} className={styles.math_content} />
    </div>
  );
}
