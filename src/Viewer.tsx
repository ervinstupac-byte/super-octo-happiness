import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

function FlyingDevice() {
  const groupRef = useRef<THREE.Group>(null!);
  const [isPaused, setIsPaused] = useState(false);
  const [color, setColor] = useState('hotpink');

  // Automatic rotation
  useFrame((state, delta) => {
    if (!isPaused) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleClick = () => {
    setIsPaused(!isPaused);
    setColor(isPaused ? 'hotpink' : 'lime');
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Main Body */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Sphere>
      {/* Cockpit */}
      <Sphere args={[0.4, 16, 16]} position={[0, 0, 0.8]}>
        <meshStandardMaterial color="skyblue" />
      </Sphere>
      {/* Wings */}
      <Cone args={[0.5, 2, 4]} position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Cone>
      <Cone args={[0.5, 2, 4]} position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </Cone>
    </group>
  );
}

export default function Viewer() {
  return (
    <div style={{ height: '400px', backgroundColor: '#111', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FlyingDevice />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
