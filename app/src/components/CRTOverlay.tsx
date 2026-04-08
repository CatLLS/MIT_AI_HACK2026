import styles from './CRTOverlay.module.css';

export function CRTOverlay() {
  return (
    <div className={styles.crt_wrapper}>
      <div className={styles.scanlines} />
      <div className={styles.flicker} />
      <div className={styles.vignette} />
    </div>
  );
}
