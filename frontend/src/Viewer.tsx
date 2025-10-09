import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// This component loads the .glb model from the URL
function Model(props: any) {
  // useGLTF hook will fetch and load the model.
  // The URL provided by the user is used here.
  const { scene } = useGLTF("https://storage.googleapis.com/flowth/0%20(5).glb");
  
  // The <primitive> object will render the loaded scene.
  return <primitive object={scene} {...props} />;
}

export default function Viewer({ data }: { data: any }) {
  return (
    <div style={{ height: '400px', backgroundColor: '#111', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 3, 5], fov: 75 }}>
        {/* Suspense is used to show a fallback while the model is loading */}
        <Suspense fallback={null}>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          
          {/* The Model component is rendered here */}
          <Model />
          
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
