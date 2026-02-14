'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

type BuildingMaps = {
  map: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
};

function configureTexture(texture: THREE.DataTexture, repeatX: number, repeatY: number, srgb = false): void {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.needsUpdate = true;
}

function createColorMap(size = 384): THREE.DataTexture {
  const data = new Uint8Array(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 3;
      const row = Math.floor(y / 28);
      const col = Math.floor(x / 24);
      const seam = y % 28 <= 2 || x % 24 <= 2;
      const windowPanel = !seam && (row + col) % 2 === 0;
      const variation = Math.floor((Math.sin(x * 0.11) + Math.cos(y * 0.07)) * 6);

      let r = 186 + variation;
      let g = 188 + variation;
      let b = 184 + variation;

      if (windowPanel) {
        r = 156 + variation;
        g = 166 + variation;
        b = 172 + variation;
      }

      if (seam) {
        r = 132;
        g = 136;
        b = 138;
      }

      data[index] = Math.min(255, Math.max(0, r));
      data[index + 1] = Math.min(255, Math.max(0, g));
      data[index + 2] = Math.min(255, Math.max(0, b));
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  configureTexture(texture, 2.5, 1.35, true);
  return texture;
}

function createNormalMap(size = 384): THREE.DataTexture {
  const data = new Uint8Array(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 3;
      const seam = y % 28 <= 2 || x % 24 <= 2;
      const edgeBoost = seam ? 18 : 0;

      data[index] = 128 - edgeBoost;
      data[index + 1] = 128 - edgeBoost;
      data[index + 2] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  configureTexture(texture, 2.5, 1.35);
  return texture;
}

function createRoughnessMap(size = 384): THREE.DataTexture {
  const data = new Uint8Array(size * size * 3);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 3;
      const row = Math.floor(y / 28);
      const col = Math.floor(x / 24);
      const seam = y % 28 <= 2 || x % 24 <= 2;
      const windowPanel = !seam && (row + col) % 2 === 0;

      let value = 208;
      if (windowPanel) {
        value = 126;
      }
      if (seam) {
        value = 228;
      }

      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
  configureTexture(texture, 2.5, 1.35);
  return texture;
}

function createBuildingMaps(): BuildingMaps {
  return {
    map: createColorMap(),
    normalMap: createNormalMap(),
    roughnessMap: createRoughnessMap()
  };
}

type CityBlock = {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  tone: string;
  roof: 'flat' | 'spike' | 'step';
};

function CityDistrict() {
  const blocks: CityBlock[] = [
    { x: -7.8, z: -5.8, width: 0.6, height: 1.9, depth: 0.58, tone: '#7f95aa', roof: 'flat' },
    { x: -7.0, z: -5.6, width: 0.62, height: 2.2, depth: 0.6, tone: '#6e879f', roof: 'spike' },
    { x: -6.15, z: -5.5, width: 0.68, height: 2.75, depth: 0.64, tone: '#89a0b8', roof: 'flat' },
    { x: -5.25, z: -5.4, width: 0.7, height: 2.15, depth: 0.68, tone: '#6f869e', roof: 'step' },
    { x: -4.35, z: -5.3, width: 0.8, height: 2.85, depth: 0.75, tone: '#7f98b1', roof: 'flat' },
    { x: -3.25, z: -5.2, width: 0.66, height: 2.45, depth: 0.62, tone: '#6e869f', roof: 'spike' },
    { x: -2.35, z: -5.12, width: 0.74, height: 2.1, depth: 0.66, tone: '#839ab0', roof: 'step' },
    { x: -1.28, z: -5.05, width: 0.6, height: 1.95, depth: 0.55, tone: '#6c8297', roof: 'flat' },
    { x: 3.1, z: -5.2, width: 0.64, height: 2.0, depth: 0.58, tone: '#6d8197', roof: 'flat' },
    { x: 3.95, z: -5.3, width: 0.72, height: 2.35, depth: 0.64, tone: '#8096ac', roof: 'spike' },
    { x: 4.85, z: -5.4, width: 0.76, height: 2.8, depth: 0.7, tone: '#90a7bc', roof: 'flat' },
    { x: 5.85, z: -5.5, width: 0.72, height: 2.2, depth: 0.64, tone: '#738ca5', roof: 'step' },
    { x: 6.75, z: -5.6, width: 0.64, height: 2.0, depth: 0.58, tone: '#69839b', roof: 'flat' },
    { x: 7.55, z: -5.75, width: 0.56, height: 1.82, depth: 0.54, tone: '#7c93a8', roof: 'flat' }
  ];

  return (
    <group>
      {blocks.map((block, index) => {
        const stripeCount = Math.max(3, Math.floor(block.height * 2.2));
        const stripeOffset = block.height / (stripeCount + 1);
        const glassColor = index % 2 === 0 ? '#b8d4ea' : '#9fc1dc';

        return (
          <group key={`city-${block.x}-${block.z}`} position={[block.x, block.height * 0.5, block.z]}>
            <mesh castShadow={index % 3 === 0} receiveShadow>
              <boxGeometry args={[block.width, block.height, block.depth]} />
              <meshStandardMaterial color={block.tone} roughness={0.83} metalness={0.1} />
            </mesh>

            {Array.from({ length: stripeCount }, (_, stripeIndex) => (
              <group key={`stripe-${block.x}-${stripeIndex}`}>
                <mesh position={[0, -block.height * 0.5 + stripeOffset * (stripeIndex + 1), block.depth * 0.501]}>
                  <boxGeometry args={[block.width * 0.78, 0.024, 0.008]} />
                  <meshStandardMaterial
                    color={glassColor}
                    roughness={0.34}
                    metalness={0.22}
                    emissive="#9abbd5"
                    emissiveIntensity={0.05}
                  />
                </mesh>
                <mesh position={[0, -block.height * 0.5 + stripeOffset * (stripeIndex + 1), -block.depth * 0.501]}>
                  <boxGeometry args={[block.width * 0.74, 0.022, 0.008]} />
                  <meshStandardMaterial color={glassColor} roughness={0.38} metalness={0.2} />
                </mesh>
              </group>
            ))}

            {block.roof === 'spike' && (
              <mesh castShadow position={[0, block.height * 0.52, 0]}>
                <cylinderGeometry args={[0.018, 0.036, 0.26, 8]} />
                <meshStandardMaterial color="#7f93aa" roughness={0.6} metalness={0.26} />
              </mesh>
            )}

            {block.roof === 'step' && (
              <mesh castShadow position={[0, block.height * 0.53, 0]}>
                <boxGeometry args={[block.width * 0.58, 0.12, block.depth * 0.58]} />
                <meshStandardMaterial color="#8198af" roughness={0.75} metalness={0.12} />
              </mesh>
            )}
          </group>
        );
      })}

      <mesh position={[0, 1.25, -6.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 2.8]} />
        <meshBasicMaterial color="#b7d2ea" transparent opacity={0.22} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

type TrafficLineProps = {
  reduceMotion: boolean;
};

function TrafficLine({ reduceMotion }: TrafficLineProps) {
  const forwardRef = useRef<THREE.Group>(null);
  const backwardRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reduceMotion) {
      return;
    }

    const t = clock.getElapsedTime();

    if (forwardRef.current) {
      forwardRef.current.children.forEach((child, index) => {
        const speed = 1.05 + index * 0.12;
        child.position.x = -7.2 + ((t * speed + index * 2.1) % 14.4);
      });
    }

    if (backwardRef.current) {
      backwardRef.current.children.forEach((child, index) => {
        const speed = 0.95 + index * 0.1;
        child.position.x = 7.2 - ((t * speed + index * 1.9) % 14.4);
      });
    }
  });

  const carColors = ['#5f7488', '#8ba1b6', '#f59e0b', '#c2410c', '#334155'];

  return (
    <group>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.01, -3.35]}>
        <planeGeometry args={[16.5, 0.34]} />
        <meshStandardMaterial color="#8e959d" roughness={0.9} metalness={0.08} />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.012, -3.45]}>
        <planeGeometry args={[16.5, 0.04]} />
        <meshStandardMaterial color="#d7dbe1" roughness={0.8} metalness={0.05} />
      </mesh>

      <group ref={forwardRef} position={[0, 0.03, -3.28]}>
        {Array.from({ length: 6 }, (_, index) => (
          <group key={`forward-car-${index}`} position={[-7 + index * 1.6, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.06, 0.08]} />
              <meshStandardMaterial color={carColors[index % carColors.length]} roughness={0.55} metalness={0.25} />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.1, 0.04, 0.07]} />
              <meshStandardMaterial color="#c8d8e8" roughness={0.42} metalness={0.22} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={backwardRef} position={[0, 0.03, -3.42]}>
        {Array.from({ length: 5 }, (_, index) => (
          <group key={`backward-car-${index}`} position={[7 - index * 1.9, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.06, 0.08]} />
              <meshStandardMaterial
                color={carColors[(index + 2) % carColors.length]}
                roughness={0.58}
                metalness={0.24}
              />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[0.1, 0.04, 0.07]} />
              <meshStandardMaterial color="#bfd1e4" roughness={0.45} metalness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function CloudLayer() {
  const clouds = [
    [-6.8, 4.4, -8.3, 0.55],
    [-4.2, 4.7, -8.8, 0.72],
    [-1.5, 4.35, -8.1, 0.62],
    [2.1, 4.65, -8.6, 0.78],
    [5.7, 4.4, -8.4, 0.64]
  ] as const;

  return (
    <group>
      {clouds.map((cloud) => {
        const [x, y, z, s] = cloud;
        return (
          <group key={`cloud-${x}-${z}`} position={[x, y, z]} scale={s}>
            <mesh>
              <sphereGeometry args={[0.78, 18, 18]} />
              <meshStandardMaterial color="#ffffff" roughness={0.92} metalness={0} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0.72, 0.06, 0]}>
              <sphereGeometry args={[0.62, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.92} metalness={0} transparent opacity={0.88} />
            </mesh>
            <mesh position={[-0.66, 0.08, 0]}>
              <sphereGeometry args={[0.58, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.92} metalness={0} transparent opacity={0.86} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function ForegroundHouses() {
  const houses = [
    [-6.35, 0.34, -2.2, 1.45, 0.68, 1.0],
    [-5.0, 0.3, -2.05, 1.15, 0.6, 0.85],
    [5.75, 0.3, -2.15, 1.3, 0.6, 0.9],
    [6.95, 0.27, -2.0, 1.0, 0.54, 0.75]
  ] as const;

  return (
    <group>
      {houses.map((house) => {
        const [x, y, z, w, h, d] = house;
        return (
          <group key={`house-${x}-${z}`} position={[x, y, z]}>
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial color="#c7ad88" roughness={0.9} metalness={0.03} />
            </mesh>
            <mesh castShadow position={[0, h * 0.6, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[w * 0.48, h * 0.55, 4]} />
              <meshStandardMaterial color="#78634f" roughness={0.78} metalness={0.07} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

type TreeProps = {
  position: [number, number, number];
  scale?: number;
};

function Tree({ position, scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.5, 8]} />
        <meshStandardMaterial color="#6f4a2d" roughness={0.85} metalness={0.03} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.23, 12, 12]} />
        <meshStandardMaterial color="#4f7f3c" roughness={0.9} metalness={0} />
      </mesh>
      <mesh castShadow position={[0.18, 0.64, 0.05]}>
        <sphereGeometry args={[0.17, 10, 10]} />
        <meshStandardMaterial color="#5f8f47" roughness={0.9} metalness={0} />
      </mesh>
      <mesh castShadow position={[-0.16, 0.62, -0.06]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#457336" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

function TreeBelt() {
  const treePositions = [
    [-7.9, 0.03, -2.95, 1.2],
    [-7.1, 0.03, -2.78, 1.0],
    [-6.4, 0.03, -2.9, 1.1],
    [-5.6, 0.03, -2.7, 1.15],
    [-4.8, 0.03, -2.86, 1.0],
    [-3.95, 0.03, -2.74, 0.95],
    [-3.1, 0.03, -2.9, 1.08],
    [3.3, 0.03, -2.88, 1.06],
    [4.1, 0.03, -2.7, 1.0],
    [4.95, 0.03, -2.9, 1.15],
    [5.8, 0.03, -2.76, 1.0],
    [6.55, 0.03, -2.93, 1.08],
    [7.35, 0.03, -2.78, 1.12],
    [-8.05, 0.03, 0.35, 1.28],
    [8.15, 0.03, 0.42, 1.3]
  ] as const;

  return (
    <group>
      {treePositions.map((tree) => (
        <Tree
          key={`tree-${tree[0]}-${tree[2]}`}
          position={[tree[0], tree[1], tree[2]]}
          scale={tree[3]}
        />
      ))}
    </group>
  );
}

type WorkerProps = {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  helmetColor?: string;
  vestColor?: string;
  action?: 'idle' | 'walk' | 'work';
  phase?: number;
  reduceMotion: boolean;
};

function Worker({
  position,
  scale = 1,
  rotationY = 0,
  helmetColor = '#fbbf24',
  vestColor = '#f97316',
  action = 'idle',
  phase = 0,
  reduceMotion
}: WorkerProps) {
  const rootRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const baseX = useRef(position[0]);
  const baseY = useRef(position[1]);

  useFrame(({ clock }) => {
    if (reduceMotion) {
      return;
    }

    const t = clock.getElapsedTime() + phase;
    const bob = Math.sin(t * 3.2) * 0.012;

    if (rootRef.current) {
      rootRef.current.position.y = baseY.current + bob;

      if (action === 'walk') {
        rootRef.current.position.x = baseX.current + Math.sin(t * 0.8) * 0.16;
      }
    }

    if (leftArmRef.current && rightArmRef.current) {
      if (action === 'walk') {
        const swing = Math.sin(t * 4.8) * 0.65;
        leftArmRef.current.rotation.x = swing;
        rightArmRef.current.rotation.x = -swing;
      } else if (action === 'work') {
        leftArmRef.current.rotation.x = -0.9 + Math.sin(t * 4.2) * 0.3;
        rightArmRef.current.rotation.x = -0.45 + Math.cos(t * 4.2) * 0.18;
      } else {
        leftArmRef.current.rotation.x = -0.25;
        rightArmRef.current.rotation.x = -0.25;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.27, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.08]} />
        <meshStandardMaterial color="#31445a" roughness={0.86} />
      </mesh>
      <mesh castShadow position={[0, 0.28, 0.042]}>
        <boxGeometry args={[0.13, 0.18, 0.02]} />
        <meshStandardMaterial color={vestColor} roughness={0.7} metalness={0.08} />
      </mesh>
      <mesh castShadow position={[0, 0.43, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial color="#f1c8a6" roughness={0.62} />
      </mesh>
      <mesh castShadow position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.055, 0.06, 0.026, 12]} />
        <meshStandardMaterial color={helmetColor} roughness={0.5} metalness={0.18} />
      </mesh>

      <mesh ref={leftArmRef} castShadow position={[-0.09, 0.31, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <meshStandardMaterial color="#f1c8a6" roughness={0.62} />
      </mesh>
      <mesh ref={rightArmRef} castShadow position={[0.09, 0.31, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <meshStandardMaterial color="#f1c8a6" roughness={0.62} />
      </mesh>

      <mesh castShadow position={[-0.04, 0.13, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.15, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0.04, 0.13, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.15, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.78} />
      </mesh>
    </group>
  );
}

type WorkerLayerProps = {
  reduceMotion: boolean;
};

function WorkerLayer({ reduceMotion }: WorkerLayerProps) {
  return (
    <group>
      <Worker position={[-0.3, 0.0, 1.82]} scale={1.1} action="work" phase={0.2} reduceMotion={reduceMotion} />
      <Worker
        position={[0.18, 0.0, 1.78]}
        scale={1.05}
        action="work"
        phase={1.8}
        vestColor="#f59e0b"
        reduceMotion={reduceMotion}
      />
      <Worker
        position={[1.25, 0.0, 2.35]}
        scale={1.15}
        action="walk"
        phase={0.9}
        rotationY={0.28}
        reduceMotion={reduceMotion}
      />
      <Worker
        position={[2.7, 0.0, 2.15]}
        scale={1.08}
        action="walk"
        phase={2.2}
        rotationY={-0.22}
        vestColor="#f97316"
        reduceMotion={reduceMotion}
      />
      <Worker
        position={[-2.5, 0.0, 2.18]}
        scale={1.05}
        action="walk"
        phase={3.1}
        rotationY={0.2}
        vestColor="#f59e0b"
        reduceMotion={reduceMotion}
      />
      <Worker position={[-3.25, 0.0, 1.5]} scale={1.0} action="idle" phase={2.7} reduceMotion={reduceMotion} />
      <Worker
        position={[3.85, 0.0, 1.55]}
        scale={0.95}
        action="idle"
        phase={1.3}
        vestColor="#f59e0b"
        reduceMotion={reduceMotion}
      />
      <Worker
        position={[-5.1, 0.0, 0.35]}
        scale={0.92}
        action="walk"
        phase={2.4}
        rotationY={0.12}
        reduceMotion={reduceMotion}
      />
      <Worker
        position={[5.4, 0.0, 0.42]}
        scale={0.92}
        action="walk"
        phase={1.1}
        rotationY={-0.14}
        vestColor="#f59e0b"
        reduceMotion={reduceMotion}
      />
    </group>
  );
}

function SiteProps() {
  return (
    <group>
      <mesh receiveShadow position={[-3.8, 0.05, 1.65]} rotation={[-0.2, 0.34, 0]}>
        <boxGeometry args={[2.2, 0.18, 1.2]} />
        <meshStandardMaterial color="#9a7b5a" roughness={0.95} metalness={0.03} />
      </mesh>

      <mesh position={[-2.8, 0.2, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.4, 0.8]} />
        <meshStandardMaterial color="#b58e66" roughness={0.82} />
      </mesh>
      <mesh position={[-1.5, 0.16, 2.05]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.32, 0.7]} />
        <meshStandardMaterial color="#d2b38d" roughness={0.84} />
      </mesh>
      <mesh position={[1.1, 0.22, 1.9]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.44, 0.7]} />
        <meshStandardMaterial color="#b9824d" roughness={0.78} />
      </mesh>
      <mesh position={[2.35, 0.15, 1.55]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.3, 0.52]} />
        <meshStandardMaterial color="#cfa276" roughness={0.8} />
      </mesh>

      <mesh position={[3.4, 0.1, 1.55]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 0.62]} />
        <meshStandardMaterial color="#b16f3f" roughness={0.78} />
      </mesh>

      <mesh position={[-0.65, 0.08, 2.25]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.16, 0.7]} />
        <meshStandardMaterial color="#d9bf9c" roughness={0.86} />
      </mesh>

      <mesh position={[-1.52, 0.35, 2.05]} rotation={[0.06, 0.14, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.05, 0.78]} />
        <meshStandardMaterial color="#2f7197" roughness={0.9} metalness={0.03} />
      </mesh>

      <mesh position={[2.75, 0.27, 1.76]} rotation={[-0.04, -0.22, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.045, 0.62]} />
        <meshStandardMaterial color="#597b4e" roughness={0.9} metalness={0.02} />
      </mesh>

      <group position={[3.18, 0.11, 1.95]}>
        <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[0.3, 0.12, 0.18]} />
          <meshStandardMaterial color="#f97316" roughness={0.72} metalness={0.18} />
        </mesh>
        <mesh castShadow position={[-0.06, 0.14, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.06, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.55} metalness={0.28} />
        </mesh>
        <mesh castShadow position={[0.06, 0.14, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.06, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.55} metalness={0.28} />
        </mesh>
      </group>

      <group position={[2.34, 0.12, 2.16]}>
        {[-0.14, -0.07, 0, 0.07, 0.14].map((x) => (
          <mesh key={`pipe-${x}`} castShadow receiveShadow position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 10]} />
            <meshStandardMaterial color="#7a838e" roughness={0.6} metalness={0.24} />
          </mesh>
        ))}
      </group>

      {[
        [1.9, 0.08, 2.35],
        [2.12, 0.08, 2.32],
        [2.34, 0.08, 2.29]
      ].map((cone) => (
        <mesh key={`cone-${cone[0]}-${cone[2]}`} castShadow position={[cone[0], cone[1], cone[2]]}>
          <coneGeometry args={[0.05, 0.12, 10]} />
          <meshStandardMaterial color="#f97316" roughness={0.58} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function BuildingModel() {
  const buildingMaps = useMemo(() => createBuildingMaps(), []);
  const normalScale = useMemo(() => new THREE.Vector2(0.22, 0.22), []);

  useEffect(() => {
    return () => {
      buildingMaps.map.dispose();
      buildingMaps.normalMap.dispose();
      buildingMaps.roughnessMap.dispose();
    };
  }, [buildingMaps]);

  const floors = [
    { width: 4.05, height: 0.42, depth: 3.2, y: 0.21 },
    { width: 3.7, height: 0.38, depth: 2.85, y: 0.64 },
    { width: 3.25, height: 0.36, depth: 2.5, y: 1.03 },
    { width: 2.8, height: 0.34, depth: 2.15, y: 1.39 },
    { width: 2.35, height: 0.32, depth: 1.85, y: 1.72 }
  ];

  const openDecks = [
    { y: 0.64, width: 3.14 },
    { y: 1.03, width: 2.84 },
    { y: 1.39, width: 2.44 },
    { y: 1.72, width: 2.02 }
  ];
  const frontColumns = [-1.52, -1.06, -0.6, -0.14, 0.32, 0.78, 1.24];
  const scaffoldLevels = [0.28, 0.62, 0.96, 1.3, 1.64];
  const rebarGrid = [-0.26, -0.12, 0.02, 0.16];

  const concreteMaterial = {
    color: '#d8d4cd',
    normalMap: buildingMaps.normalMap,
    roughnessMap: buildingMaps.roughnessMap,
    normalScale,
    metalness: 0.04,
    roughness: 0.94
  } as const;

  return (
    <group position={[-0.75, 0, 0.05]}>
      {floors.map((floor) => (
        <mesh key={`${floor.width}-${floor.y}`} castShadow receiveShadow position={[0, floor.y, 0]}>
          <boxGeometry args={[floor.width, floor.height, floor.depth]} />
          <meshStandardMaterial {...concreteMaterial} />
        </mesh>
      ))}

      {openDecks.map((deck) => (
        <group key={`open-deck-${deck.y}`}>
          <mesh castShadow receiveShadow position={[0, deck.y, 1.04]}>
            <boxGeometry args={[deck.width, 0.2, 0.52]} />
            <meshStandardMaterial color="#b9b8b1" roughness={0.93} metalness={0.04} />
          </mesh>
          <mesh castShadow position={[0, deck.y + 0.13, 1.29]}>
            <boxGeometry args={[deck.width, 0.05, 0.08]} />
            <meshStandardMaterial color="#9aa1a8" roughness={0.74} metalness={0.18} />
          </mesh>
        </group>
      ))}

      {floors.map((floor) => (
        <group key={`formwork-${floor.y}`}>
          <mesh position={[0, floor.y, floor.depth * 0.503]} castShadow>
            <boxGeometry args={[floor.width * 0.92, floor.height * 0.12, 0.012]} />
            <meshStandardMaterial color="#9d8e7d" roughness={0.95} metalness={0.02} />
          </mesh>
          <mesh position={[0, floor.y, -floor.depth * 0.503]} castShadow>
            <boxGeometry args={[floor.width * 0.9, floor.height * 0.1, 0.01]} />
            <meshStandardMaterial color="#a89887" roughness={0.95} metalness={0.02} />
          </mesh>
        </group>
      ))}

      <mesh castShadow receiveShadow position={[0.58, 1.35, 0.1]}>
        <boxGeometry args={[1.2, 2.25, 1.15]} />
        <meshPhysicalMaterial
          color="#7ca7cc"
          roughness={0.2}
          metalness={0.28}
          transmission={0.05}
          clearcoat={0.25}
          clearcoatRoughness={0.18}
        />
      </mesh>

      {frontColumns.map((x) => (
        <mesh key={`col-${x}`} castShadow receiveShadow position={[x, 1.04, 1.35]}>
          <boxGeometry args={[0.075, 1.66, 0.08]} />
          <meshStandardMaterial color="#b2b7bb" roughness={0.82} metalness={0.08} />
        </mesh>
      ))}

      <group position={[-2.1, 0.08, 1.18]}>
        {[-0.17, 0.17].map((x) =>
          scaffoldLevels.map((y) => (
            <mesh key={`scaffold-vert-${x}-${y}`} castShadow position={[x, y, 0]}>
              <cylinderGeometry args={[0.016, 0.016, 0.34, 8]} />
              <meshStandardMaterial color="#6d7b8a" roughness={0.6} metalness={0.32} />
            </mesh>
          ))
        )}
        {scaffoldLevels.map((y) => (
          <mesh key={`scaffold-bar-${y}`} castShadow position={[0, y, 0]}>
            <boxGeometry args={[0.42, 0.025, 0.025]} />
            <meshStandardMaterial color="#778594" roughness={0.58} metalness={0.28} />
          </mesh>
        ))}
        {[0.44, 1.12].map((y) => (
          <mesh key={`plank-${y}`} castShadow receiveShadow position={[0, y, 0.09]}>
            <boxGeometry args={[0.46, 0.028, 0.18]} />
            <meshStandardMaterial color="#b58a63" roughness={0.85} metalness={0.08} />
          </mesh>
        ))}
      </group>

      <group position={[1.92, 0.45, 1.26]} rotation={[0, 0, -0.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.012, 0.012, 1.42, 8]} />
          <meshStandardMaterial color="#7b8896" roughness={0.58} metalness={0.26} />
        </mesh>
        <mesh castShadow position={[0.12, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.42, 8]} />
          <meshStandardMaterial color="#7b8896" roughness={0.58} metalness={0.26} />
        </mesh>
        {Array.from({ length: 7 }, (_, index) => (
          <mesh key={`ladder-rung-${index}`} castShadow position={[0.06, -0.58 + index * 0.2, 0]}>
            <boxGeometry args={[0.11, 0.012, 0.012]} />
            <meshStandardMaterial color="#8a95a3" roughness={0.55} metalness={0.24} />
          </mesh>
        ))}
      </group>

      <group position={[-0.56, 2.02, -0.5]}>
        {rebarGrid.flatMap((x) =>
          rebarGrid.map((z) => (
            <mesh key={`rebar-vert-${x}-${z}`} castShadow position={[x, 0.29, z]}>
              <cylinderGeometry args={[0.014, 0.014, 0.58, 8]} />
              <meshStandardMaterial color="#6b7280" roughness={0.5} metalness={0.34} />
            </mesh>
          ))
        )}
        {[0.07, 0.23, 0.39, 0.53].map((y) => (
          <group key={`rebar-ring-${y}`} position={[0, y, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.52, 0.012, 0.012]} />
              <meshStandardMaterial color="#7a828d" roughness={0.56} metalness={0.28} />
            </mesh>
            <mesh castShadow rotation-y={Math.PI / 2}>
              <boxGeometry args={[0.52, 0.012, 0.012]} />
              <meshStandardMaterial color="#7a828d" roughness={0.56} metalness={0.28} />
            </mesh>
          </group>
        ))}
      </group>

      {[1.12, 1.48].map((y) => (
        <group key={`safety-rail-${y}`} position={[0, y, 1.42]}>
          <mesh castShadow>
            <boxGeometry args={[3.08 - (y - 1.12) * 1.1, 0.028, 0.028]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.45} metalness={0.24} />
          </mesh>
          {[-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35].map((x) => (
            <mesh key={`rail-post-${y}-${x}`} castShadow position={[x, -0.08, 0]}>
              <boxGeometry args={[0.02, 0.16, 0.02]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.45} metalness={0.24} />
            </mesh>
          ))}
        </group>
      ))}

      <mesh position={[-1.02, 1.06, 1.4]} rotation={[0.03, 0.06, 0]} castShadow>
        <boxGeometry args={[0.9, 0.24, 0.012]} />
        <meshStandardMaterial color="#f4aa4f" roughness={0.62} metalness={0.08} transparent opacity={0.82} />
      </mesh>

      <mesh position={[-0.68, 1.75, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.94, 0.2, 0.04]} />
        <meshStandardMaterial color="#c79667" roughness={0.84} metalness={0.05} />
      </mesh>

      <mesh position={[-1.34, 0.88, 0.98]} rotation={[0.12, 0.18, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[0.88, 0.05, 0.56]} />
        <meshStandardMaterial color="#2f6f95" roughness={0.92} metalness={0.04} />
      </mesh>

      <mesh position={[0.78, 0.76, 1.06]} rotation={[-0.05, -0.1, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.04, 0.44]} />
        <meshStandardMaterial color="#5d8c57" roughness={0.9} metalness={0.03} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 2.1, 0]}>
        <boxGeometry args={[0.72, 0.24, 0.72]} />
        <meshStandardMaterial {...concreteMaterial} metalness={0.16} roughness={0.83} />
      </mesh>
    </group>
  );
}

function CraneModel() {
  const craneRef = useRef<THREE.Group>(null);
  const hookRef = useRef<THREE.Group>(null);
  const payloadRef = useRef<THREE.Mesh>(null);
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);

  useFrame(({ clock }) => {
    if (reduceMotion) {
      return;
    }

    const t = clock.getElapsedTime();

    if (craneRef.current) {
      craneRef.current.rotation.y = Math.sin(t * 0.22) * 0.14;
    }

    if (hookRef.current) {
      hookRef.current.rotation.z = Math.sin(t * 1.35) * 0.07;
    }

    if (payloadRef.current) {
      payloadRef.current.position.y = -1.34 + Math.sin(t * 1.1) * 0.035;
    }
  });

  return (
    <group ref={craneRef} position={[2.2, 0, -0.25]}>
      <mesh castShadow position={[0, 1.95, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 3.9, 20]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.26} roughness={0.5} />
      </mesh>

      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={`mast-ring-${i}`} castShadow position={[0, 0.3 + i * 0.33, 0]}>
          <boxGeometry args={[0.25, 0.03, 0.25]} />
          <meshStandardMaterial color="#e58d0b" roughness={0.55} metalness={0.2} />
        </mesh>
      ))}

      <mesh castShadow position={[1.55, 3.74, 0]}>
        <boxGeometry args={[3.2, 0.12, 0.12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.25} roughness={0.46} />
      </mesh>

      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={`jib-truss-${i}`} castShadow position={[0.12 + i * 0.3, 3.79, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.02]} />
          <meshStandardMaterial color="#f7b44b" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      <mesh castShadow position={[-0.72, 3.32, 0]}>
        <boxGeometry args={[1.35, 0.08, 0.08]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.2} roughness={0.52} />
      </mesh>

      <mesh castShadow position={[-1.22, 3.26, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.3]} />
        <meshStandardMaterial color="#8b5e34" roughness={0.68} />
      </mesh>

      <group ref={hookRef} position={[2.88, 3.72, 0]}>
        <mesh castShadow position={[0, -0.68, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.36, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.36} roughness={0.42} />
        </mesh>
        <mesh ref={payloadRef} castShadow position={[0, -1.34, 0]}>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <meshStandardMaterial color="#cfd8e3" roughness={0.78} metalness={0.12} />
        </mesh>
      </group>
    </group>
  );
}

type SceneProps = {
  reduceMotion: boolean;
};

function Scene({ reduceMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#9ac2ed']} />
      <fog attach="fog" args={['#9ac2ed', 8, 24]} />

      <ambientLight intensity={0.34} />
      <hemisphereLight intensity={0.5} color="#d6eaff" groundColor="#7d8ea2" />

      <directionalLight
        castShadow
        position={[7, 9, 5]}
        intensity={1.45}
        color="#fff1dc"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={32}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-6, 5, -4]} intensity={0.66} color="#a9cbff" />

      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.015, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshStandardMaterial color="#d6e0ec" roughness={0.96} metalness={0.02} />
      </mesh>

      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0.0, -2.8]}>
        <planeGeometry args={[18, 1.7]} />
        <meshStandardMaterial color="#5d8449" roughness={0.95} metalness={0} />
      </mesh>

      <TrafficLine reduceMotion={reduceMotion} />

      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.005, 2.15]}>
        <planeGeometry args={[9, 3.1]} />
        <meshStandardMaterial color="#c4a888" roughness={0.88} metalness={0.04} />
      </mesh>

      <CloudLayer />
      <CityDistrict />
      <TreeBelt />
      <ForegroundHouses />
      <BuildingModel />
      <CraneModel />
      <SiteProps />
      <WorkerLayer reduceMotion={reduceMotion} />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.38}
        scale={11}
        blur={2.8}
        far={5.4}
        color="#1c3d72"
      />
    </>
  );
}

type Hero3DProps = {
  className?: string;
};

export default function Hero3D({ className }: Hero3DProps) {
  const reducedMotionPreference = useReducedMotion();
  const reduceMotion = Boolean(reducedMotionPreference);

  return (
    <div
      className={[
        'h-[360px] w-full overflow-hidden rounded-2xl border border-brand-sky bg-gradient-to-b from-white to-slate-100 shadow-card sm:h-[420px]',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Canvas
        dpr={[1, 1.8]}
        shadows
        camera={{ position: [5.8, 3.7, 6.6], fov: 44 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <Scene reduceMotion={reduceMotion} />
        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          enableDamping
          dampingFactor={0.06}
          autoRotate={!reduceMotion}
          autoRotateSpeed={0.18}
          minDistance={4.2}
          maxDistance={11}
          minPolarAngle={Math.PI / 5.2}
          maxPolarAngle={Math.PI / 2.08}
        />
      </Canvas>
    </div>
  );
}
