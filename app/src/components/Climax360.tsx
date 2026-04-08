import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { WalkControls } from './WalkControls';
import { SplatMesh, SparkRenderer } from '@sparkjsdev/spark';
import * as THREE from 'three';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './Climax360.module.css';

// Register Spark components with R3F
extend({ SplatMesh, SparkRenderer });

// TypeScript declarations for JSX elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      splatMesh: any;
      sparkRenderer: any;
    }
  }
}

const TARGET_POS = new THREE.Vector3(0.02, -0.13, 1.80);
const START_POS = new THREE.Vector3(0.02, 10, 1.80); // Falling from Y=10

function CinematicScene({ onLanded }: { onLanded: () => void }) {
  const { gl, scene, camera } = useThree();
  const sparkRef = useRef<any>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    camera.position.copy(START_POS);
  }, [camera]);

  useFrame((_, delta) => {
    if (sparkRef.current) {
      sparkRef.current.update({ scene, viewToWorld: camera.matrixWorld });
    }

    if (!landed) {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, TARGET_POS.y, 1.5 * delta);
      if (Math.abs(camera.position.y - TARGET_POS.y) < 0.01) {
        camera.position.y = TARGET_POS.y;
        setLanded(true);
        onLanded();
      }
    }
  });

  const sparkArgs = useMemo(() => [{ renderer: gl, autoUpdate: true }], [gl]);
  const splatArgs = useMemo(() => [{ url: "/preloads/climax/3dSplatWorld.spz" }], []);

  return (
    <sparkRenderer ref={sparkRef} args={sparkArgs} frustumCulled={false}>
      <group rotation={[Math.PI, 0, 0]}>
        <splatMesh args={splatArgs} />
      </group>
    </sparkRenderer>
  );
}

export function Climax360() {
  const [stage, setStage] = useState<'falling' | 'atmosphere' | 'credits' | 'finished'>('falling');
  const [creditsText, setCreditsText] = useState("");
  const musicRef = useRef<HTMLAudioElement>(null);

  // Load credits
  useEffect(() => {
    fetch('/preloads/credits.txt')
      .then(res => res.text())
      .then(setCreditsText)
      .catch(() => setCreditsText("..."));
  }, []);

  // Initial enter audio (19v1) - Falling atmospheric cue
  useEffect(() => {
    const audio = new Audio('/preloads/19v1.wav');
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Progression Lifecycle
  useEffect(() => {
    if (stage === 'atmosphere') {
      // Long atmospheric pause after landing (15 seconds) before credits start
      const timer = setTimeout(() => {
        setStage('credits');
        if (musicRef.current) {
          musicRef.current.volume = 0.5; // Half volume as requested
          musicRef.current.play().catch(e => console.log("Music play blocked", e));
        }
      }, 15000); 

      return () => clearTimeout(timer);
    }

    if (stage === 'credits') {
      // Logic to trigger the final "THE END" after the credits scroller duration (approx 60s)
      const timer = setTimeout(() => {
        setStage('finished');
      }, 65000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <div className={styles.canvas_container}>
      {/* Background Song for credits */}
      <audio 
        ref={musicRef} 
        src="/preloads/spencer_yk-light-trails-151006.mp3" 
        loop
      />

      <div className={styles.hud_instructions}>
        DRAG TO LOOK AROUND<br/>
        W A S D TO WALK<br/>
        SPACE to ascend · Q to descend
      </div>

      <Canvas
        camera={{ position: [0.02, 10, 1.80], fov: 60, near: 0.1, far: 2000 }}
        gl={{ antialias: false }}
        dpr={[1, 2]}
      >
        <WalkControls enabled={true} />
        <CinematicScene onLanded={() => setStage('atmosphere')} />
        <ambientLight intensity={0.5} />
      </Canvas>
      
      {/* Credits Roll */}
      {stage === 'credits' && (
        <div className={styles.credits_container}>
          <div className={styles.credits_scroller}>
            {creditsText.split('\n').map((line, i) => (
              <div key={i} className={styles.credits_line}>
                {line || "\u00A0"}
              </div>
            ))}
            
            {/* Logo at the end of scroll */}
            <img src="/preloads/MITHack.webp" className={styles.mithack_logo} alt="MIT Hack" />
          </div>
        </div>
      )}

      {/* Final "THE END" and Blackout */}
      {stage === 'finished' && (
        <div className={styles.the_end_overlay}>
          <div className={styles.the_end_text}>THE END</div>
        </div>
      )}
    </div>
  );
}
