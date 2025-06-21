import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const Book = ({ coverImage, spineImage, backCoverImage }: { coverImage: string, spineImage: string, backCoverImage: string }) => {
  const bookRef = useRef<THREE.Mesh>(null);
  
  const [cover, spine, back] = useTexture([coverImage, spineImage, backCoverImage]);
  
  useFrame(() => {
    if (bookRef.current) {
      bookRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={bookRef}>
      <boxGeometry args={[3, 4, 0.5]} />
      <meshStandardMaterial map={cover} attach="material-0" />
      <meshStandardMaterial map={spine} attach="material-1" />
      <meshStandardMaterial map={back} attach="material-2" />
      <meshStandardMaterial color="#f5f5f5" attach="material-3" />
      <meshStandardMaterial color="#f5f5f5" attach="material-4" />
      <meshStandardMaterial color="#f5f5f5" attach="material-5" />
    </mesh>
  );
};

export const Book3DViewer = ({ bookId }: { bookId: string }) => {
  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Book 
          coverImage={`/api/books/${bookId}/cover`}
          spineImage={`/api/books/${bookId}/spine`}
          backCoverImage={`/api/books/${bookId}/back`}
        />
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
};