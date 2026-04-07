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
    // 1. Spark Sorting
    if (sparkRef.current) {
      sparkRef.current.update({ scene, viewToWorld: camera.matrixWorld });
    }

    // 2. Falling Animation
    if (!landed) {
      // Smooth fall to target Y
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, TARGET_POS.y, 1.5 * delta);
      
      // If close enough, snap and unlock
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
  const { finalAnswer } = useLaplaceStore();
  const [stage, setStage] = useState<'falling' | 'message' | 'credits'>('falling');
  const [creditsText, setCreditsText] = useState("");
  const musicRef = useRef<HTMLAudioElement>(null);

  // Load credits
  useEffect(() => {
    fetch('/preloads/credits.txt')
      .then(res => res.text())
      .then(setCreditsText)
      .catch(() => setCreditsText("..."));
  }, []);

  // Initial enter audio (19v1)
  useEffect(() => {
    const audio = new Audio('/preloads/19v1.wav');
    audio.play().catch(() => {});
  }, []);

  // Progression Lifecycle
  useEffect(() => {
    if (stage === 'message') {
      // Play "itWasMe" voice line
      const voice = new Audio('/preloads/itWasMe.wav');
      voice.play().catch(() => {});

      const timer = setTimeout(() => {
        setStage('credits');
        if (musicRef.current) {
          musicRef.current.volume = 0.5; // Cut volume by half
          musicRef.current.play().catch(e => console.log("Music play blocked", e));
        }
      }, 10000); // 10 seconds as requested
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
        <WalkControls enabled={stage !== 'falling'} />
        <CinematicScene onLanded={() => setStage('message')} />
        <ambientLight intensity={0.5} />
      </Canvas>
      
      {/* "IT WAS ME" Overlay */}
      {stage === 'message' && (
        <div className={styles.final_text_overlay}>
          IT WAS ME
          <div className={styles.subtext}>{finalAnswer}</div>
        </div>
      )}

      {/* Credits Roll */}
      {stage === 'credits' && (
        <div className={styles.credits_container}>
          <div className={styles.credits_scroller}>
            {creditsText.split('\n').map((line, i) => (
              <div key={i} className={styles.credits_line}>
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
