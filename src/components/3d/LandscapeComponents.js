/**
 * Hyperrealistic 3D Landscape Components
 * Modular components for complex landscaping scenes
 */

import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { 
  Sphere, 
  Box, 
  Cylinder, 
  Cone, 
  Torus,
  RoundedBox,
  Plane,
  useTexture
} from '@react-three/drei'
import * as THREE from 'three'
import { WindSystem, GrowthAnimations, EquipmentAnimations, ParticleHelpers } from '../../utils/3d-animations'

// Hyperrealistic Grass Blade with Advanced Physics
function HyperrealisticGrassBlade({ position, scale = 1, color = "#22c55e", windIntensity = 1 }) {
  const meshRef = useRef()
  const materialRef = useRef()
  
  // Advanced grass texture simulation
  const grassTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    
    // Create gradient for grass blade
    const gradient = ctx.createLinearGradient(0, 0, 0, 128)
    gradient.addColorStop(0, '#4ade80')
    gradient.addColorStop(0.3, '#22c55e')
    gradient.addColorStop(0.7, '#16a34a')
    gradient.addColorStop(1, '#15803d')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 128)
    
    // Add texture details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(Math.random() * 32, Math.random() * 128, 1, Math.random() * 20)
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const wind = WindSystem.grassWind(state.clock.elapsedTime, position, windIntensity)
      
      meshRef.current.rotation.z = wind.rotation.z
      meshRef.current.rotation.x = wind.rotation.x
      meshRef.current.scale.y = wind.scale.y * scale
      
      // Dynamic color variation
      materialRef.current.color.setHSL(
        0.25 + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05,
        0.8 + Math.sin(state.clock.elapsedTime * 0.3 + position[1]) * 0.1,
        0.4 + Math.sin(state.clock.elapsedTime * 0.2 + position[2]) * 0.1
      )
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <cylinderGeometry args={[0.015, 0.005, 0.8, 6]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={grassTexture}
        color={color}
        roughness={0.8}
        metalness={0.1}
        transparent
        alphaTest={0.1}
      />
    </mesh>
  )
}

// Professional Lawn Mower with Realistic Details
function ProfessionalLawnMower({ position, isMoving = true, mowerType = 'riding' }) {
  const groupRef = useRef()
  const wheelRefs = [useRef(), useRef(), useRef(), useRef()]
  
  useFrame((state) => {
    if (groupRef.current && isMoving) {
      const movement = EquipmentAnimations.mowerMovement(state.clock.elapsedTime, position[0])
      
      groupRef.current.position.x = position[0] + movement.position.x
      groupRef.current.position.z = position[2] + movement.position.z
      groupRef.current.position.y = position[1] + movement.position.y
      groupRef.current.rotation.y = movement.rotation.y
      groupRef.current.rotation.z = movement.rotation.z
      
      // Animate wheels
      wheelRefs.forEach((wheelRef) => {
        if (wheelRef.current) {
          wheelRef.current.rotation.x += 0.1
        }
      })
    }
  })

  if (mowerType === 'riding') {
    return (
      <group ref={groupRef} position={position}>
        {/* Main Body */}
        <Box args={[2.5, 0.8, 1.5]} position={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
        </Box>
        
        {/* Seat */}
        <Box args={[0.6, 0.3, 0.6]} position={[0, 0.95, -0.3]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Box>
        
        {/* Steering Wheel */}
        <Torus args={[0.2, 0.03]} position={[0, 1.3, -0.1]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.8} />
        </Torus>
        
        {/* Engine Hood */}
        <Box args={[1.8, 0.4, 1.2]} position={[0, 0.6, 0.5]} castShadow>
          <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.9} />
        </Box>
        
        {/* Cutting Deck */}
        <Cylinder args={[1.2, 1.2, 0.3]} position={[0, -0.1, 0]} castShadow>
          <meshStandardMaterial color="#374151" roughness={0.7} metalness={0.8} />
        </Cylinder>
        
        {/* Wheels */}
        <Cylinder ref={wheelRefs[0]} args={[0.3, 0.3, 0.2]} position={[-1, -0.2, 0.8]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        <Cylinder ref={wheelRefs[1]} args={[0.3, 0.3, 0.2]} position={[1, -0.2, 0.8]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        <Cylinder ref={wheelRefs[2]} args={[0.4, 0.4, 0.25]} position={[-1, -0.2, -0.8]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        <Cylinder ref={wheelRefs[3]} args={[0.4, 0.4, 0.25]} position={[1, -0.2, -0.8]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        
        {/* Exhaust Pipe */}
        <Cylinder args={[0.05, 0.05, 0.8]} position={[0.8, 0.8, 0.5]} rotation={[0, 0, Math.PI/6]} castShadow>
          <meshStandardMaterial color="#6b7280" roughness={0.4} metalness={0.9} />
        </Cylinder>
        
        {/* Headlights */}
        <Sphere args={[0.08]} position={[-0.6, 0.7, 1.2]} castShadow>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Sphere>
        <Sphere args={[0.08]} position={[0.6, 0.7, 1.2]} castShadow>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
        </Sphere>
      </group>
    )
  }

  // Push mower variant
  return (
    <group ref={groupRef} position={position}>
      <Box args={[1.2, 0.3, 0.8]} position={[0, 0.15, 0]} castShadow>
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
      </Box>
      
      <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.8, -0.3]} rotation={[0.3, 0, 0]} castShadow>
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </Cylinder>
      
      <Cylinder ref={wheelRefs[0]} args={[0.15, 0.15, 0.1]} position={[-0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]} castShadow>
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </Cylinder>
      <Cylinder ref={wheelRefs[1]} args={[0.15, 0.15, 0.1]} position={[0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]} castShadow>
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </Cylinder>
    </group>
  )
}

// Hyperrealistic Tree with Seasonal Variations
function HyperrealisticTree({ position, scale = 1, season = 'summer', treeType = 'oak' }) {
  const groupRef = useRef()
  const leavesRefs = useRef([])
  
  // Tree configurations
  const treeConfigs = {
    oak: {
      trunkColor: '#92400e',
      trunkHeight: 2.5,
      trunkRadius: 0.15,
      leafSpheres: [
        { pos: [0, 3, 0], radius: 1.2 },
        { pos: [0.5, 3.5, 0.3], radius: 0.8 },
        { pos: [-0.3, 3.8, -0.2], radius: 0.6 },
        { pos: [0.2, 4.2, 0.1], radius: 0.5 }
      ]
    },
    maple: {
      trunkColor: '#7c2d12',
      trunkHeight: 2.8,
      trunkRadius: 0.12,
      leafSpheres: [
        { pos: [0, 3.2, 0], radius: 1.0 },
        { pos: [0.4, 3.8, 0.2], radius: 0.7 },
        { pos: [-0.2, 4.1, -0.1], radius: 0.5 }
      ]
    }
  }
  
  const config = treeConfigs[treeType] || treeConfigs.oak
  
  // Seasonal colors
  const seasonalColors = {
    spring: '#22c55e',
    summer: '#16a34a',
    autumn: '#f59e0b',
    winter: '#6b7280'
  }

  useFrame((state) => {
    if (groupRef.current) {
      const sway = WindSystem.treeSway(state.clock.elapsedTime, position, scale)
      groupRef.current.rotation.z = sway.rotation.z
      groupRef.current.rotation.x = sway.rotation.x
      
      // Animate individual leaf clusters
      leavesRefs.current.forEach((leafRef, index) => {
        if (leafRef) {
          const leafSway = WindSystem.leafRustle(state.clock.elapsedTime, index)
          leafRef.rotation.z = leafSway.rotation.z * 0.5
          leafRef.rotation.y = leafSway.rotation.y * 0.3
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk with texture */}
      <Cylinder args={[config.trunkRadius, config.trunkRadius * 1.2, config.trunkHeight]} position={[0, config.trunkHeight/2, 0]} castShadow>
        <meshStandardMaterial 
          color={config.trunkColor} 
          roughness={0.9}
          normalScale={[0.5, 0.5]}
        />
      </Cylinder>
      
      {/* Root system */}
      {[...Array(6)].map((_, i) => (
        <Cylinder 
          key={i}
          args={[0.05, 0.08, 0.3]} 
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.3,
            -0.1,
            Math.sin((i / 6) * Math.PI * 2) * 0.3
          ]}
          rotation={[Math.PI/6, (i / 6) * Math.PI * 2, 0]}
          castShadow
        >
          <meshStandardMaterial color={config.trunkColor} roughness={0.9} />
        </Cylinder>
      ))}
      
      {/* Leaf clusters */}
      {config.leafSpheres.map((leaf, index) => (
        <Sphere 
          key={index}
          ref={(el) => leavesRefs.current[index] = el}
          args={[leaf.radius]} 
          position={leaf.pos}
          castShadow
        >
          <meshStandardMaterial 
            color={seasonalColors[season]} 
            roughness={0.8}
            transparent={season === 'winter'}
            opacity={season === 'winter' ? 0.3 : 1}
          />
        </Sphere>
      ))}
      
      {/* Branches */}
      {[...Array(8)].map((_, i) => (
        <Cylinder 
          key={i}
          args={[0.02, 0.04, 0.8]} 
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.4,
            2 + Math.random() * 0.8,
            Math.sin((i / 8) * Math.PI * 2) * 0.4
          ]}
          rotation={[
            Math.PI/4 + Math.random() * 0.3,
            (i / 8) * Math.PI * 2,
            Math.random() * 0.2
          ]}
          castShadow
        >
          <meshStandardMaterial color={config.trunkColor} roughness={0.8} />
        </Cylinder>
      ))}
    </group>
  )
}

// Advanced Flower with Realistic Petals
function HyperrealisticFlower({ position, flowerType = 'rose', color = "#ff6b9d", bloomStage = 1 }) {
  const groupRef = useRef()
  const petalRefs = useRef([])
  
  const flowerConfigs = {
    rose: { petals: 12, petalSize: 0.04, centerSize: 0.02 },
    daisy: { petals: 16, petalSize: 0.06, centerSize: 0.03 },
    tulip: { petals: 6, petalSize: 0.08, centerSize: 0.02 },
    sunflower: { petals: 20, petalSize: 0.1, centerSize: 0.05 }
  }
  
  const config = flowerConfigs[flowerType] || flowerConfigs.rose

  useFrame((state) => {
    if (groupRef.current) {
      const sway = WindSystem.flowerSway(state.clock.elapsedTime, position)
      groupRef.current.rotation.y = sway.rotation.y
      groupRef.current.rotation.z = sway.rotation.z
      
      // Individual petal movement
      petalRefs.current.forEach((petalRef, index) => {
        if (petalRef) {
          petalRef.rotation.z = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1 * bloomStage
          petalRef.scale.setScalar(bloomStage * (0.8 + Math.sin(state.clock.elapsedTime + index) * 0.2))
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Stem */}
      <Cylinder args={[0.008, 0.012, 0.4]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </Cylinder>
      
      {/* Leaves on stem */}
      {[...Array(2)].map((_, i) => (
        <Box 
          key={i}
          args={[0.08, 0.02, 0.15]} 
          position={[
            Math.cos(i * Math.PI) * 0.05,
            0.1 + i * 0.15,
            Math.sin(i * Math.PI) * 0.05
          ]}
          rotation={[0, i * Math.PI, Math.PI/6]}
          castShadow
        >
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </Box>
      ))}
      
      {/* Petals */}
      {[...Array(config.petals)].map((_, i) => (
        <Box 
          key={i}
          ref={(el) => petalRefs.current[i] = el}
          args={[config.petalSize, 0.01, config.petalSize * 1.5]} 
          position={[
            Math.cos((i / config.petals) * Math.PI * 2) * config.petalSize * 1.2,
            0.4,
            Math.sin((i / config.petals) * Math.PI * 2) * config.petalSize * 1.2
          ]}
          rotation={[
            Math.PI/6,
            (i / config.petals) * Math.PI * 2,
            0
          ]}
          castShadow
        >
          <meshStandardMaterial 
            color={color} 
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </Box>
      ))}
      
      {/* Flower center */}
      <Sphere args={[config.centerSize]} position={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial 
          color={flowerType === 'sunflower' ? '#7c2d12' : '#fbbf24'} 
          roughness={0.9}
        />
      </Sphere>
    </group>
  )
}

// Professional Garden Tools Set
function ProfessionalGardenTools({ position, toolSet = 'basic' }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      const idle = EquipmentAnimations.toolIdle(state.clock.elapsedTime, position[0])
      groupRef.current.rotation.y = idle.rotation.y
      groupRef.current.rotation.z = idle.rotation.z
      groupRef.current.position.y = position[1] + idle.position.y
    }
  })

  const tools = {
    basic: [
      { type: 'shovel', pos: [0, 0, 0] },
      { type: 'rake', pos: [0.4, 0, 0] },
      { type: 'hoe', pos: [-0.4, 0, 0] }
    ],
    professional: [
      { type: 'shovel', pos: [0, 0, 0] },
      { type: 'rake', pos: [0.4, 0, 0] },
      { type: 'hoe', pos: [-0.4, 0, 0] },
      { type: 'pruners', pos: [0.2, 0, 0.3] },
      { type: 'watering_can', pos: [-0.2, 0, 0.3] }
    ]
  }

  const renderTool = (tool, index) => {
    switch (tool.type) {
      case 'shovel':
        return (
          <group key={index} position={tool.pos}>
            <Cylinder args={[0.015, 0.015, 1.2]} position={[0, 0.6, 0]} castShadow>
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </Cylinder>
            <Box args={[0.15, 0.3, 0.02]} position={[0, 0.05, 0]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.3} />
            </Box>
          </group>
        )
      
      case 'rake':
        return (
          <group key={index} position={tool.pos} rotation={[0, 0, 0.2]}>
            <Cylinder args={[0.015, 0.015, 1]} position={[0, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </Cylinder>
            <Box args={[0.4, 0.05, 0.02]} position={[0, 0.05, 0]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.3} />
            </Box>
            {[...Array(8)].map((_, i) => (
              <Cylinder 
                key={i}
                args={[0.005, 0.005, 0.1]} 
                position={[-0.15 + i * 0.04, 0.02, 0]} 
                castShadow
              >
                <meshStandardMaterial color="#6b7280" metalness={0.8} />
              </Cylinder>
            ))}
          </group>
        )
      
      case 'hoe':
        return (
          <group key={index} position={tool.pos}>
            <Cylinder args={[0.015, 0.015, 1.1]} position={[0, 0.55, 0]} castShadow>
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </Cylinder>
            <Box args={[0.2, 0.08, 0.02]} position={[0, 0.05, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.3} />
            </Box>
          </group>
        )
      
      case 'pruners':
        return (
          <group key={index} position={tool.pos}>
            <Box args={[0.03, 0.2, 0.01]} position={[0, 0.1, 0]} castShadow>
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </Box>
            <Box args={[0.03, 0.15, 0.01]} position={[0.02, 0.08, 0]} rotation={[0, 0, 0.3]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.2} />
            </Box>
          </group>
        )
      
      case 'watering_can':
        return (
          <group key={index} position={tool.pos}>
            <Cylinder args={[0.08, 0.1, 0.15]} position={[0, 0.08, 0]} castShadow>
              <meshStandardMaterial color="#10b981" roughness={0.4} metalness={0.6} />
            </Cylinder>
            <Cylinder args={[0.01, 0.01, 0.2]} position={[0.12, 0.1, 0]} rotation={[0, 0, Math.PI/4]} castShadow>
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </Cylinder>
            <Torus args={[0.05, 0.01]} position={[-0.08, 0.12, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
              <meshStandardMaterial color="#10b981" roughness={0.4} />
            </Torus>
          </group>
        )
      
      default:
        return null
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {tools[toolSet].map(renderTool)}
    </group>
  )
}

// Animated Butterfly
function AnimatedButterfly({ position, butterflyIndex = 0 }) {
  const groupRef = useRef()
  const wingRefs = [useRef(), useRef()]
  
  useFrame((state) => {
    if (groupRef.current) {
      const flight = ParticleHelpers.butterflyFlight(state.clock.elapsedTime, butterflyIndex)
      
      groupRef.current.position.x = flight.position.x
      groupRef.current.position.y = flight.position.y
      groupRef.current.position.z = flight.position.z
      groupRef.current.rotation.y = flight.rotation.y
      
      // Wing flapping
      wingRefs.forEach((wingRef, index) => {
        if (wingRef.current) {
          wingRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 15) * 0.5 * (index === 0 ? 1 : -1)
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <Cylinder args={[0.01, 0.01, 0.1]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      
      {/* Wings */}
      <Box ref={wingRefs[0]} args={[0.08, 0.01, 0.06]} position={[-0.04, 0, 0.02]} castShadow>
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} />
      </Box>
      <Box ref={wingRefs[1]} args={[0.08, 0.01, 0.06]} position={[0.04, 0, 0.02]} castShadow>
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} />
      </Box>
      
      {/* Wing patterns */}
      <Sphere args={[0.01]} position={[-0.04, 0.01, 0.02]} castShadow>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere args={[0.01]} position={[0.04, 0.01, 0.02]} castShadow>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
    </group>
  )
}

export {
  HyperrealisticGrassBlade,
  ProfessionalLawnMower,
  HyperrealisticTree,
  HyperrealisticFlower,
  ProfessionalGardenTools,
  AnimatedButterfly
}