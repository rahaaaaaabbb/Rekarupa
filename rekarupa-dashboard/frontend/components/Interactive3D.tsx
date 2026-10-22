// components/Interactive3D.tsx
"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function Interactive3D() {
  return (
    <div className="bg-slate-50 rounded-xl shadow-inner h-full flex items-center justify-center min-h-[300px] border border-gray-200">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <mesh rotation={[10, 10, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4f46e5" wireframe={true} />
        </mesh>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}