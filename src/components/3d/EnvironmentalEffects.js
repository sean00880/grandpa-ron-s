/**
 * Environmental Effects for Hyperrealistic 3D Landscaping
 * Advanced particle systems, weather effects, and atmospheric elements
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Points, 
  PointMaterial,
  Sphere,
  Cylinder,
  Box,
  Plane
} from '@react-three/drei'
import * as THREE from 'three'
import { WeatherEffects, ParticleHelpers, LightingHelpers, EquipmentAnimations } from '../../utils/3d-animations'

// Advanced Particle Rain System
function RealisticRain({ intensity = 0.5, windDirection = [0.1, 0, 0.05] }) {
  const rainRef = useRef()
  const dropCount = Math.floor(intensity * 1000)
  
  const rainDrops = useMemo(() => {
    const positions = new Float32Array(dropCount * 3)
    const velocities = new Float32Array(dropCount * 3)
    
    for (let i = 0; i < dropCount; i++) {
      const i3 = i * 3
      // Random positions across the scene
      positions[i3] = (Math.random() - 0.5) * 60
      positions[i3 + 1] = Math.random() * 20 + 10
      positions[i3 + 2] = (Math.random() - 0.5) * 60
      
      // Falling velocities with wind effect
      velocities[i3] = windDirection[0] + (Math.random() - 0.5) * 0.1
      velocities[i3 + 1] = -8 - Math.random() * 4
      velocities[i3 + 2] = windDirection[2] + (Math.random() - 0.5) * 0.1
    }
    
    return { positions, velocities }
  }, [dropCount, windDirection])

  useFrame((state, delta) => {
    if (rainRef.current) {
      const positions = rainRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < dropCount; i++) {
        const i3 = i * 3
        
        // Update positions
        positions[i3] += rainDrops.velocities[i3] * delta
        positions[i3 + 1] += rainDrops.velocities[i3 + 1] * delta
        positions[i3 + 2] += rainDrops.velocities[i3 + 2] * delta
        
        // Reset drops that hit the ground
        if (positions[i3 + 1] < -0.5) {
          positions[i3] = (Math.random() - 0.5) * 60
          positions[i3 + 1] = Math.random() * 5 + 15
          positions[i3 + 2] = (Math.random() - 0.5) * 60
        }
      }
      
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={dropCount}
          array={rainDrops.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.1}
        color="#87ceeb"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  )
}

// Floating Pollen and Seeds System
function PollenSystem({ density = 0.3, season = 'spring' }) {
  const pollenRef = useRef()
  const particleCount = Math.floor(density * 200)
  
  const pollenParticles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    const seasonalColors = {
      spring: [1, 1, 0.7], // Yellow pollen
      summer: [0.9, 0.9, 0.9], // White seeds
      autumn: [0.8, 0.4, 0.2], // Brown seeds
      winter: [0.9, 0.9, 1] // Snow-like
    }
    
    const baseColor = seasonalColors[season] || seasonalColors.spring
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      positions[i3] = (Math.random() - 0.5) * 40
      positions[i3 + 1] = Math.random() * 8 + 1
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      
      colors[i3] = baseColor[0] + (Math.random() - 0.5) * 0.2
      colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * 0.2
      colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * 0.2
      
      sizes[i] = Math.random() * 2 + 1
    }
    
    return { positions, colors, sizes }
  }, [particleCount, season])

  useFrame((state) => {
    if (pollenRef.current) {
      const positions = pollenRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const time = state.clock.elapsedTime
        
        const pollen = ParticleHelpers.pollenFloat(time, i)
        
        positions[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.01
        positions[i3 + 1] += Math.sin(time * 0.3 + i * 0.2) * 0.005
        positions[i3 + 2] += Math.cos(time * 0.4 + i * 0.15) * 0.01
        
        // Boundary wrapping
        if (positions[i3] > 20) positions[i3] = -20
        if (positions[i3] < -20) positions[i3] = 20
        if (positions[i3 + 2] > 20) positions[i3 + 2] = -20
        if (positions[i3 + 2] < -20) positions[i3 + 2] = 20
      }
      
      pollenRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={pollenRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={pollenParticles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={pollenParticles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={pollenParticles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <PointMaterial
        size={2}
        transparent
        opacity={0.4}
        sizeAttenuation
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

// Firefly System for Evening Ambiance
function FireflySystem({ count = 15, active = true }) {
  const fireflies = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        Math.random() * 3 + 0.5,
        (Math.random() - 0.5) * 30
      ],
      phase: Math.random() * Math.PI * 2
    }))
  }, [count])

  if (!active) return null

  return (
    <group>
      {fireflies.map((firefly) => (
        <Firefly key={firefly.id} {...firefly} />
      ))}
    </group>
  )
}

function Firefly({ position, phase, id }) {
  const lightRef = useRef()
  const meshRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current && meshRef.current) {
      const glow = LightingHelpers.fireflyGlow(state.clock.elapsedTime + phase, id)
      
      lightRef.current.intensity = glow.intensity
      meshRef.current.position.x = position[0] + glow.position.x
      meshRef.current.position.y = position[1] + glow.position.y
      meshRef.current.position.z = position[2] + glow.position.z
      
      lightRef.current.position.copy(meshRef.current.position)
    }
  })

  return (
    <group>
      <pointLight
        ref={lightRef}
        color="#ffff88"
        intensity={0.5}
        distance={3}
        decay={2}
      />
      <Sphere ref={meshRef} args={[0.02]} position={position}>
        <meshBasicMaterial
          color="#ffff88"
          transparent
          opacity={0.8}
        />
      </Sphere>
    </group>
  )
}

// Advanced Water Sprinkler System
function SprinklerSystem({ position, active = true, coverage = 5 }) {
  const sprinklerRef = useRef()
  const waterRef = useRef()
  const dropCount = 300
  
  const waterDrops = useMemo(() => {
    const positions = new Float32Array(dropCount * 3)
    const velocities = new Float32Array(dropCount * 3)
    const lifetimes = new Float32Array(dropCount)
    
    for (let i = 0; i < dropCount; i++) {
      const i3 = i * 3
      const angle = (i / dropCount) * Math.PI * 2
      const radius = Math.random() * coverage
      
      positions[i3] = Math.cos(angle) * radius
      positions[i3 + 1] = 0.5
      positions[i3 + 2] = Math.sin(angle) * radius
      
      velocities[i3] = Math.cos(angle) * 2
      velocities[i3 + 1] = 3 + Math.random() * 2
      velocities[i3 + 2] = Math.sin(angle) * 2
      
      lifetimes[i] = Math.random() * 2
    }
    
    return { positions, velocities, lifetimes }
  }, [dropCount, coverage])

  useFrame((state, delta) => {
    if (sprinklerRef.current && active) {
      const rotation = EquipmentAnimations.sprinklerRotation(state.clock.elapsedTime)
      sprinklerRef.current.rotation.y = rotation.rotation.y
    }
    
    if (waterRef.current && active) {
      const positions = waterRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < dropCount; i++) {
        const i3 = i * 3
        
        // Apply gravity and movement
        waterDrops.velocities[i3 + 1] -= 9.8 * delta
        
        positions[i3] += waterDrops.velocities[i3] * delta
        positions[i3 + 1] += waterDrops.velocities[i3 + 1] * delta
        positions[i3 + 2] += waterDrops.velocities[i3 + 2] * delta
        
        waterDrops.lifetimes[i] -= delta
        
        // Reset drops that hit ground or expire
        if (positions[i3 + 1] < -0.5 || waterDrops.lifetimes[i] <= 0) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * coverage
          
          positions[i3] = position[0] + Math.cos(angle) * radius
          positions[i3 + 1] = position[1] + 0.5
          positions[i3 + 2] = position[2] + Math.sin(angle) * radius
          
          waterDrops.velocities[i3] = Math.cos(angle) * 2
          waterDrops.velocities[i3 + 1] = 3 + Math.random() * 2
          waterDrops.velocities[i3 + 2] = Math.sin(angle) * 2
          
          waterDrops.lifetimes[i] = Math.random() * 2 + 1
        }
      }
      
      waterRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Sprinkler Head */}
      <group ref={sprinklerRef}>
        <Cylinder args={[0.05, 0.03, 0.3]} position={[0, 0.15, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.04]} position={[0, 0.3, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
        </Sphere>
      </group>
      
      {/* Water Particles */}
      {active && (
        <Points ref={waterRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={dropCount}
              array={waterDrops.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            size={0.05}
            color="#87ceeb"
            transparent
            opacity={0.7}
            sizeAttenuation
          />
        </Points>
      )}
    </group>
  )
}

// Realistic Mulch Bed System
function MulchBed({ position, size = [4, 0.1, 6], mulchType = 'bark' }) {
  const mulchRef = useRef()
  const particleCount = 500
  
  const mulchParticles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    const mulchColors = {
      bark: [0.4, 0.2, 0.1],
      red: [0.6, 0.2, 0.1],
      black: [0.1, 0.1, 0.1],
      natural: [0.5, 0.3, 0.2]
    }
    
    const baseColor = mulchColors[mulchType] || mulchColors.bark
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      positions[i3] = (Math.random() - 0.5) * size[0]
      positions[i3 + 1] = Math.random() * size[1]
      positions[i3 + 2] = (Math.random() - 0.5) * size[2]
      
      colors[i3] = baseColor[0] + (Math.random() - 0.5) * 0.2
      colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * 0.2
      colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * 0.2
      
      sizes[i] = Math.random() * 3 + 1
    }
    
    return { positions, colors, sizes }
  }, [particleCount, size, mulchType])

  return (
    <group position={position}>
      {/* Base mulch bed */}
      <Box args={size} position={[0, -size[1]/2, 0]} receiveShadow>
        <meshStandardMaterial 
          color={mulchType === 'red' ? '#8b4513' : '#654321'} 
          roughness={0.9}
        />
      </Box>
      
      {/* Mulch particles for texture */}
      <Points ref={mulchRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={mulchParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={mulchParticles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={mulchParticles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <PointMaterial
          size={2}
          transparent
          opacity={0.8}
          sizeAttenuation
          vertexColors
        />
      </Points>
    </group>
  )
}

// Realistic Stone Border System
function StoneBorder({ points, stoneType = 'river' }) {
  const stones = useMemo(() => {
    const stoneArray = []
    
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i]
      const end = points[i + 1]
      const distance = Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)
      )
      const stoneCount = Math.floor(distance / 0.3)
      
      for (let j = 0; j < stoneCount; j++) {
        const t = j / stoneCount
        const x = start[0] + (end[0] - start[0]) * t
        const z = start[2] + (end[2] - start[2]) * t
        
        stoneArray.push({
          position: [
            x + (Math.random() - 0.5) * 0.2,
            start[1] + Math.random() * 0.1,
            z + (Math.random() - 0.5) * 0.2
          ],
          scale: [
            0.1 + Math.random() * 0.1,
            0.05 + Math.random() * 0.05,
            0.1 + Math.random() * 0.1
          ],
          rotation: [0, Math.random() * Math.PI, 0]
        })
      }
    }
    
    return stoneArray
  }, [points])

  const stoneColors = {
    river: '#8b7355',
    granite: '#696969',
    limestone: '#f5f5dc',
    lava: '#2f2f2f'
  }

  return (
    <group>
      {stones.map((stone, index) => (
        <Box
          key={index}
          args={stone.scale}
          position={stone.position}
          rotation={stone.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color={stoneColors[stoneType]} 
            roughness={0.8}
            metalness={0.1}
          />
        </Box>
      ))}
    </group>
  )
}

export {
  RealisticRain,
  PollenSystem,
  FireflySystem,
  SprinklerSystem,
  MulchBed,
  StoneBorder
}