import { useRef, useMemo, useEffect } from 'react';
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

function SparkScene() {
  const { gl, scene, camera } = useThree();
  const sparkRef = useRef<any>(null);

  // Initialize SparkRenderer with the WebGL renderer
  // We use useMemo to ensure the args are stable
  const sparkArgs = useMemo(() => [{ 
    renderer: gl,
    autoUpdate: true
  }], [gl]);

  const splatArgs = useMemo(() => [{
    url: "/preloads/climax/3dSplatWorld.spz"
  }], []);

  // Ensure the renderer is updated every frame for sorting
  // While onBeforeRender should handle this, manual update in useFrame
  // is often more reliable in R3F environments to ensure correct camera matrix.
  useFrame(() => {
    if (sparkRef.current) {
      sparkRef.current.update({
        scene: scene,
        viewToWorld: camera.matrixWorld
      });
    }
  });

  return (
    <sparkRenderer 
      ref={sparkRef} 
      args={sparkArgs} 
      frustumCulled={false}
    >
      {/* 
          Standard flip for Gaussian Splats from common converters. 
          Wrapping in a group is safer than direct rotation on splatMesh
          to avoid constructor/property conflicts.
      */}
      <group rotation={[Math.PI, 0, 0]}>
        <splatMesh args={splatArgs} />
      </group>
    </sparkRenderer>
  );
}

export function Climax360() {
  const { finalAnswer } = useLaplaceStore();

  return (
    <div className={styles.canvas_container}>
      <div style={{
        position: 'absolute', top: 20, left: 20, zIndex: 10,
        color: 'white', fontFamily: 'monospace',
        textShadow: '1px 1px 2px black', pointerEvents: 'none',
        fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.8
      }}>
        DRAG TO LOOK AROUND<br/>
        W A S D TO WALK<br/>
        SPACE to ascend · Q to descend
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 60, near: 0.1, far: 2000 }}
        gl={{ antialias: false }} // Highly recommended for Spark performance/rendering
        dpr={[1, 2]} // Standard for high-DPI screens
      >
        <WalkControls />
        <SparkScene />
        <ambientLight intensity={0.5} />
      </Canvas>
      
      {/* Delayed final text */}
      <div className={styles.final_text_overlay} style={{ animationDelay: '5s', pointerEvents: 'none' }}>
        IT WAS ME
        <div className={styles.subtext}>{finalAnswer}</div>
      </div>
    </div>
  );
}
