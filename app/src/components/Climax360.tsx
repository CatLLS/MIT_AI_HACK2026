import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { WalkControls } from './WalkControls';
import { SplatMesh } from '@sparkjsdev/spark';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './Climax360.module.css';

function SplatScene({ url }: { url: string }) {
  const [mesh, setMesh] = useState<any>(null);

  useEffect(() => {
    try {
      const splat = new SplatMesh({ url });
      setMesh(splat);
    } catch (e) {
      console.error("Failed to load Splat Mesh:", e);
    }
  }, [url]);

  if (!mesh) return null;
  return <primitive object={mesh} />;
}

export function Climax360() {
  const { finalAnswer } = useLaplaceStore();

  return (
    <div className={styles.canvas_container}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', fontFamily: 'monospace', textShadow: '1px 1px 2px black', pointerEvents: 'none' }}>
        DRAG TO LOOK AROUND<br/>
        W A S D TO WALK<br/>
        SPACE to ascend<br/>
        Q to descend
      </div>

      <Canvas camera={{ position: [0, 1.5, 5], fov: 60 }}>
        <WalkControls />
        <SplatScene url="/preloads/climax/3dSplatWorld.spz" />
      </Canvas>
      
      {/* Delayed final text */}
      <div className={styles.final_text_overlay} style={{ animationDelay: '5s', pointerEvents: 'none' }}>
        IT WAS ME
        <div className={styles.subtext}>{finalAnswer}</div>
      </div>
    </div>
  );
}
