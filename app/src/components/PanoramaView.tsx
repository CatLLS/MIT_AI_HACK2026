import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function SphereBackground() {
  const texture = useTexture('/preloads/climax/360World.png');
  
  return (
    <mesh scale={[-1, 1, 1]}> {/* Invert the sphere so the texture is on the inside */}
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export function PanoramaView() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <SphereBackground />
        <OrbitControls 
          enableZoom={false} 
          autoRotate={false} 
          rotateSpeed={-0.5} // Negative so drag direction feels natural (dragging left moves view right)
        />
      </Canvas>
    </div>
  );
}
