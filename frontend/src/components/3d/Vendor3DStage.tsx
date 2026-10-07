'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Html } from '@react-three/drei';
import { VehicleType } from '../../types';
import { RotateCcw, ZoomIn, Sun, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface Vendor3DStageProps {
  vehicleType?: VehicleType;
  businessName?: string;
}

export const Vendor3DStage: React.FC<Vendor3DStageProps> = ({
  vehicleType = 'BURGER_TRUCK',
  businessName = 'Ramesh Burger Truck'
}) => {
  const [doorsOpen, setDoorsOpen] = useState(true);
  const [headlights, setHeadlights] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'360' | 'COOKING' | 'INTERIOR'>('360');

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-dark-bg via-dark-card to-dark-bg border border-dark-border overflow-hidden shadow-2xl">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-dark-bg/80 backdrop-blur border border-dark-border px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
          <span className="text-xs font-bold text-white">3D Vehicle Configurator</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-dark-bg/80 backdrop-blur border border-dark-border p-1 rounded-full">
          <button
            onClick={() => setHeadlights(!headlights)}
            className={`p-1.5 rounded-full text-xs transition-colors ${headlights ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400'}`}
            title="Toggle Headlights"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDoorsOpen(!doorsOpen)}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${doorsOpen ? 'bg-brand-orange text-white' : 'bg-dark-surface text-gray-300'}`}
          >
            {doorsOpen ? 'Doors Open' : 'Doors Closed'}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-full text-gray-400 hover:text-white"
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* R3F Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 2.5, 5]} fov={50} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} minDistance={3} maxDistance={9} />

        {/* Lighting Setup */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#FF6B00" />
        {headlights && <spotLight position={[2.5, 0.8, 1.8]} angle={0.6} penumbra={0.5} intensity={3} color="#FFF5C3" />}

        {/* Vehicle Scene */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <ProceduralVehicle vehicleType={vehicleType} doorsOpen={doorsOpen} headlights={headlights} />
        </Float>

        {/* Floor Stage Grid */}
        <mesh receiveShadow position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0F1623" roughness={0.8} metalness={0.2} />
        </mesh>
      </Canvas>

      {/* Bottom Floating Stats Pill */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-dark-bg/90 backdrop-blur border border-dark-border px-3 py-1.5 rounded-xl flex items-center gap-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Interactive Model</p>
            <p className="text-xs font-bold text-white">{vehicleType.replace('_', ' ')}</p>
          </div>
        </div>

        <div className="pointer-events-auto text-[10px] text-gray-400 bg-dark-bg/80 backdrop-blur px-2.5 py-1 rounded-full border border-dark-border">
          Drag to rotate 360° | Scroll to zoom
        </div>
      </div>
    </div>
  );
};

// Procedural Low-Poly 3D Vehicle Renderer
const ProceduralVehicle: React.FC<{ vehicleType: VehicleType; doorsOpen: boolean; headlights: boolean }> = ({
  vehicleType,
  doorsOpen,
  headlights
}) => {
  const truckGroup = useRef<any>(null);

  useFrame((state, delta) => {
    if (truckGroup.current) {
      // Subtle float vibration
      truckGroup.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
    }
  });

  const getVehicleColors = () => {
    switch (vehicleType) {
      case 'COFFEE_VAN':
        return { body: '#4A2C2A', roof: '#F5E6D3', accent: '#D97706' };
      case 'ICE_CREAM_TRUCK':
        return { body: '#EC4899', roof: '#FFFFFF', accent: '#06B6D4' };
      case 'PIZZA_TRUCK':
        return { body: '#DC2626', roof: '#F59E0B', accent: '#10B981' };
      case 'TEA_CART':
      case 'JUICE_CART':
      case 'FOOD_CART':
        return { body: '#10B981', roof: '#F59E0B', accent: '#3B82F6' };
      default:
        return { body: '#1F2937', roof: '#FF6B00', accent: '#F59E0B' };
    }
  };

  const colors = getVehicleColors();

  return (
    <group ref={truckGroup} position={[0, 0, 0]}>
      {/* Vehicle Body Cabin */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.8, 1.4, 1.6]} />
        <meshStandardMaterial color={colors.body} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Vehicle Roof */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[2.9, 0.2, 1.7]} />
        <meshStandardMaterial color={colors.roof} roughness={0.2} />
      </mesh>

      {/* Serving Canopy Window Door */}
      <mesh position={[0, 0.6, 0.82]} rotation={[doorsOpen ? -0.8 : 0, 0, 0]}>
        <boxGeometry args={[1.6, 0.7, 0.05]} />
        <meshStandardMaterial color={colors.accent} roughness={0.4} />
      </mesh>

      {/* Counter Desk Inside */}
      <mesh position={[0, 0.2, 0.5]}>
        <boxGeometry args={[1.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Headlights */}
      <mesh position={[1.41, 0.2, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={headlights ? '#FFF5C3' : '#6B7280'} emissive={headlights ? '#FFF5C3' : '#000000'} emissiveIntensity={2} />
      </mesh>
      <mesh position={[1.41, 0.2, -0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={headlights ? '#FFF5C3' : '#6B7280'} emissive={headlights ? '#FFF5C3' : '#000000'} emissiveIntensity={2} />
      </mesh>

      {/* Wheels */}
      <mesh position={[0.9, -0.4, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.9, -0.4, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0.9, -0.4, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.9, -0.4, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
};
