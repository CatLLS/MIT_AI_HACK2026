import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './LevelDisplay.module.css';
import { useState, useEffect } from 'react';

// This component acts as the 2.5D manager for levels 1-3.
export function LevelDisplay() {
  const { level, sigma, setSigma, setLevel, userConstant, userHabit, userLens } = useLaplaceStore();
  const [clickedConstant, setClickedConstant] = useState(false);
  
  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionSrc, setTransitionSrc] = useState('');

  // LEVEL 1 PROGRESSION
  useEffect(() => {
    if (level === 1 && clickedConstant) {
      const walkDuration = 4000;
      const t1 = setTimeout(() => {
        setIsTransitioning(true);
        setTransitionSrc('/preloads/level1/transition_to_2.mp4');
        
        const t2 = setTimeout(() => {
          setIsTransitioning(false);
          setLevel(2);
        }, 5000); // 5 sec transition video
        
        return () => clearTimeout(t2);
      }, walkDuration);
      
      return () => clearTimeout(t1);
    }
  }, [level, clickedConstant, setLevel]);

  // LEVEL 2 PROGRESSION
  useEffect(() => {
    // If user dampens the system to a stable state (sigma <= -2)
    if (level === 2 && sigma <= -2 && !isTransitioning) {
      const waitTime = 3000; // let them observe the quietness
      const t1 = setTimeout(() => {
        setIsTransitioning(true);
        setTransitionSrc('/preloads/level2/transition_to_3.mp4');
        
        const t2 = setTimeout(() => {
          setIsTransitioning(false);
          setSigma(0); // reset basic noise for next level
          setLevel(3);
        }, 5000); // 5 sec video
        
        return () => clearTimeout(t2);
      }, waitTime);
      
      return () => clearTimeout(t1);
    }
  }, [level, sigma, isTransitioning, setLevel, setSigma]);

  // LEVEL 3 PROGRESSION
  useEffect(() => {
    if (level === 3 && userLens && !isTransitioning) {
      const waitTime = 4000; // Let them see the reflection before moving on
      const t1 = setTimeout(() => {
        setIsTransitioning(true);
        setTransitionSrc('/preloads/level3/transition_to_4.mp4');
        
        const t2 = setTimeout(() => {
          setIsTransitioning(false);
          setLevel(4);
        }, 5000);
        
        return () => clearTimeout(t2);
      }, waitTime);
      
      return () => clearTimeout(t1);
    }
  }, [level, userLens, isTransitioning, setLevel]);

  // If in transition, return the transition video player
  if (isTransitioning) {
    return (
      <div className={styles.transition_container}>
        <video 
           key={transitionSrc} 
           autoPlay 
           muted 
           playsInline 
           className={styles.transition_video}
        >
          <source src={transitionSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  // Background layers based on level
  const renderLevel1 = () => (
    <div className={styles.layer_container}>
      {/* Background Video/Image Layer: The Purple Desert */}
      <video className={styles.bg_video} autoPlay loop muted playsInline>
        <source src="/preloads/level1/desert_bg.mp4" type="video/mp4" />
      </video>

      {/* Girl Sprite (Idle vs Walking) */}
      <img 
        src={clickedConstant ? "/preloads/level1/girl_walk.gif" : "/preloads/level1/girl_idle.png"} 
        className={`${styles.sprite} ${clickedConstant ? styles.walk_anim : ''}`} 
        alt="The Girl" 
      />

      {/* The Constant Orb */}
      {userConstant && !clickedConstant && (
        <div 
          className={styles.constant_orb} 
          onClick={() => setClickedConstant(true)}
        >
          <img src="/preloads/level1/constant_item.png" alt={userConstant} />
          <span className={styles.orb_label}>{userConstant}</span>
        </div>
      )}
    </div>
  );

  const renderLevel2 = () => (
    <div className={styles.layer_container}>
       {/* Use a filter to make video greyscale if user stabilized it */}
       <video 
         className={styles.bg_video} 
         autoPlay loop muted playsInline
         style={{ filter: sigma <= -2 ? 'grayscale(100%) brightness(0.7)' : 'none', transition: 'filter 2s ease' }}
       >
        <source src="/preloads/level2/luma_rain_loop.mp4" type="video/mp4" />
      </video>

      {/* Boy Wireframe interacting with the habit */}
      {userHabit && (
        <div className={styles.boy_wireframe} style={{ opacity: sigma <= -2 ? 0.2 : 0.7, transition: 'opacity 2s ease' }}>
          <span>{userHabit}... {userHabit}...</span>
        </div>
      )}

      {/* Damping Slider UI (The Pole/Zero Mechanic) */}
      <div className={styles.damping_ui}>
        <label>SYSTEM NOISE DAMPING (REAL PART \sigma)</label>
        <input 
          type="range" 
          min="-5" 
          max="5" 
          step="0.1" 
          value={sigma} 
          onChange={(e) => setSigma(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.poles_grid}>
           {/* Visual representation of poles based on sigma */}
           <div 
            className={styles.pole_mark} 
            style={{ left: `calc(50% + ${sigma * 10}px)`, top: '30%' }}
           >✕</div>
           <div 
            className={styles.pole_mark} 
            style={{ left: `calc(50% + ${sigma * 10}px)`, top: '70%' }}
           >✕</div>
        </div>
      </div>
    </div>
  );

  const renderLevel3 = () => (
    <div className={styles.layer_container}>
      {/* Melting piano sequence */}
      <video className={styles.bg_video} autoPlay loop muted playsInline>
        <source src="/preloads/level3/melting_piano.mp4" type="video/mp4" />
      </video>

      {userLens && (
        <img 
          src={`/preloads/level3/lens_${userLens.toLowerCase()}.png`} 
          className={styles.lens_reflection} 
          alt={userLens} 
        />
      )}
    </div>
  );

  if (level === 0 || level > 3) return null;

  return (
    <div className={styles.fullscreen}>
      {level === 1 && renderLevel1()}
      {level === 2 && renderLevel2()}
      {level === 3 && renderLevel3()}
    </div>
  );
}
