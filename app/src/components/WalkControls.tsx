import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function WalkControls({ enabled = true }: { enabled?: boolean }) {
  const { camera, gl } = useThree();
  const keys = useRef<{ [key: string]: boolean }>({});
  const isDragging = useRef(false);
  
  // To accumulate rotation from mouse movement
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  // Initialize camera rotation matching the starting looking vector
  useEffect(() => {
    euler.current.setFromQuaternion(camera.quaternion);
  }, [camera]);
  
  useEffect(() => {
    if (!enabled) {
      isDragging.current = false;
      return;
    }

    // Keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    
    // Mouse listeners for drag-to-look
    const handleMouseDown = () => { isDragging.current = true; };
    const handleMouseUp = () => { isDragging.current = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const sensitivity = 0.003;
      euler.current.y -= e.movementX * sensitivity;
      euler.current.x -= e.movementY * sensitivity;
      
      // Clamp vertical rotation to prevent flipping bounds
      euler.current.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, gl, enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed = 2.5 * delta;
    
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // Forward vector
    camera.getWorldDirection(direction);
    direction.y = 0; // lock to horizontal plane
    if (direction.lengthSq() > 0.0001) direction.normalize();
    
    // Right vector
    right.crossVectors(camera.up, direction).normalize();

    // WASD translation
    if (keys.current['w']) camera.position.addScaledVector(direction, speed);
    if (keys.current['s']) camera.position.addScaledVector(direction, -speed);
    if (keys.current['a']) camera.position.addScaledVector(right, speed);
    if (keys.current['d']) camera.position.addScaledVector(right, -speed);
    
    // Space and Q for elevation
    if (keys.current[' ']) camera.position.y += speed;
    if (keys.current['q']) camera.position.y -= speed;
  });

  return null;
}
