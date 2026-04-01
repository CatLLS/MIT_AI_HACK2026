import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLaplaceStore } from '../store/useLaplaceStore';
import styles from './Climax360.module.css';

function ClimaxScene() {
  const { userConstant, userHabit, userLens, finalAnswer } = useLaplaceStore();
  const skyboxTexture = useLoader(THREE.TextureLoader, '/preloads/climax/skybox.jpg');

  // Rotate the entire group slowly
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.05;
    }
  });

  return (
    <>
      <OrbitControls makeDefault enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      
      {/* 360 Skybox */}
      <mesh>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={skyboxTexture} side={THREE.BackSide} />
      </mesh>

      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#9D00FF" />

      <group ref={groupRef}>
        {/* Floating Constat */}
        {userConstant && (
          <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-20, 5, -30]}>
             <Text fontSize={4} color="#FF00F0" font="https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdWfMOD5Vvl4jO.ttf">{userConstant}</Text>
          </Float>
        )}

        {/* Floating Habit */}
        {userHabit && (
          <Float speed={3} rotationIntensity={0.5} floatIntensity={1.5} position={[20, -5, -25]}>
             <Text fontSize={3} color="#00FFFF" font="https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdWfMOD5Vvl4jO.ttf">{userHabit}</Text>
          </Float>
        )}

        {/* Floating Lens */}
        {userLens && (
          <Float speed={1.5} rotationIntensity={2} floatIntensity={3} position={[0, 15, -40]}>
             <Text fontSize={5} color="#9D00FF" font="https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdWfMOD5Vvl4jO.ttf">{`[ ${userLens} ]`}</Text>
          </Float>
        )}
      </group>

      {/* The Central Liquid Mirror */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1} position={[0, -2, -10]}>
        <mesh>
          <sphereGeometry args={[4, 64, 64]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={80}
            roughness={0.1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#150030"
            metalness={0.8}
            mirror={1}
          />
        </mesh>
      </Float>
      
      <Environment preset="night" />
    </>
  );
}

export function Climax360() {
  const { finalAnswer } = useLaplaceStore();

  return (
    <div className={styles.canvas_container}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <ClimaxScene />
      </Canvas>
      
      {/* Delayed final text */}
      <div className={styles.final_text_overlay} style={{ animationDelay: '5s' }}>
        IT WAS ME
        <div className={styles.subtext}>{finalAnswer}</div>
      </div>
    </div>
  );
}
