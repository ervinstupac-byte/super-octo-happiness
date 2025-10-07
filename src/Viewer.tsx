import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Helper function to map a pressure value (0-1) to a color (blue-red)
const getColorFromPressure = (value: number) => {
  const hue = (1 - value) * 240; // 240 is blue, 0 is red
  return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
};

// Helper function to map a stress value (0-1) to a color (green-red)
const getColorFromStress = (value: number) => {
  const hue = (1 - value) * 120; // 120 is green, 0 is red
  return new THREE.Color(`hsl(${hue}, 100%, 50%)`);
};

function FlyingDevice({ pressureData, stressData }: { pressureData?: number[] | null, stressData?: number[] | null }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [isPaused, setIsPaused] = useState(false);
  const [baseColor, setBaseColor] = useState('hotpink');

  useFrame((state, delta) => {
    if (!isPaused && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  const handleClick = () => {
    setIsPaused(!isPaused);
    setBaseColor(isPaused ? 'hotpink' : 'lime');
  };

  const bodyColor = stressData ? getColorFromStress(stressData[0]) : pressureData ? getColorFromPressure(pressureData[0]) : baseColor;
  const cockpitColor = stressData ? getColorFromStress(stressData[1]) : pressureData ? getColorFromPressure(pressureData[1]) : 'skyblue';
  const leftWingColor = stressData ? getColorFromStress(stressData[2]) : pressureData ? getColorFromPressure(pressureData[2]) : baseColor;
  const rightWingColor = stressData ? getColorFromStress(stressData[3]) : pressureData ? getColorFromPressure(pressureData[3]) : baseColor;

  return (
    <group ref={groupRef} onClick={handleClick}>
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[0.4, 16, 16]} position={[0, 0, 0.8]}>
        <meshStandardMaterial color={cockpitColor} />
      </Sphere>
      <Cone args={[0.5, 2, 4]} position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color={leftWingColor} metalness={0.8} roughness={0.2} />
      </Cone>
      <Cone args={[0.5, 2, 4]} position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <meshStandardMaterial color={rightWingColor} metalness={0.8} roughness={0.2} />
      </Cone>
    </group>
  );
}

function LoadedModel({ data }: { data: any }) {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    if (data) {
      const loader = new GLTFLoader();
      loader.parse(JSON.stringify(data), '', (gltf) => {
        setModel(gltf.scene);
      });
    }
  }, [data]);

  return model ? <primitive object={model} /> : null;
}

export default function Viewer({ data, pressureData, stressData }: { data: any, pressureData: any, stressData: any }) {
  return (
    <div style={{ height: '400px', backgroundColor: '#111', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        {data ? <LoadedModel data={data} /> : <FlyingDevice pressureData={pressureData} stressData={stressData} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
