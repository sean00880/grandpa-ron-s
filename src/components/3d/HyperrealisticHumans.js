/**
 * Hyperrealistic Human Characters for 3D Landscaping Scene
 * Complex human figures with realistic animations and interactions
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Sphere, 
  Box, 
  Cylinder, 
  Cone,
  RoundedBox
} from '@react-three/drei'
import * as THREE from 'three'
import { WindSystem, EquipmentAnimations } from '../../utils/3d-animations'

// Hyperrealistic Human Body Component with GR Logo
function HumanBody({ position, scale = 1, skinTone = "#fdbcb4", clothingColors = {} }) {
  const groupRef = useRef()
  
  const defaultClothing = {
    shirt: "#000000", // Default to black
    pants: "#1f2937",
    shoes: "#000000",
    hat: "#000000"
  }
  
  const colors = { ...defaultClothing, ...clothingColors }

  useFrame((state) => {
    if (groupRef.current) {
      // Enhanced breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 1.2) * 0.025
      const heartbeat = Math.sin(state.clock.elapsedTime * 8) * 0.005
      groupRef.current.scale.y = scale + breathe + heartbeat
      
      // Subtle body sway for realism
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Head */}
      <Sphere args={[0.12]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color={skinTone} roughness={0.6} />
      </Sphere>
      
      {/* Hair */}
      <Sphere args={[0.13]} position={[0, 1.75, -0.02]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </Sphere>
      
      {/* Professional Cap with GR Logo */}
      <Cylinder args={[0.14, 0.14, 0.05]} position={[0, 1.82, 0]}>
        <meshStandardMaterial color={colors.hat} roughness={0.7} />
      </Cylinder>
      <Cylinder args={[0.18, 0.18, 0.02]} position={[0, 1.79, 0.08]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color={colors.hat} roughness={0.7} />
      </Cylinder>
      
      {/* GR Logo on Cap */}
      <Box args={[0.08, 0.06, 0.01]} position={[0, 1.83, 0.12]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.02, 0.04, 0.012]} position={[-0.02, 1.83, 0.121]}>
        <meshStandardMaterial color={colors.hat} />
      </Box>
      <Box args={[0.02, 0.04, 0.012]} position={[0.02, 1.83, 0.121]}>
        <meshStandardMaterial color={colors.hat} />
      </Box>
      
      {/* Eyes */}
      <Sphere args={[0.015]} position={[-0.04, 1.72, 0.1]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.015]} position={[0.04, 1.72, 0.1]}>
        <meshStandardMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.008]} position={[-0.04, 1.72, 0.11]}>
        <meshStandardMaterial color="#2563eb" />
      </Sphere>
      <Sphere args={[0.008]} position={[0.04, 1.72, 0.11]}>
        <meshStandardMaterial color="#2563eb" />
      </Sphere>
      
      {/* Nose */}
      <Cone args={[0.015, 0.03]} position={[0, 1.68, 0.11]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color={skinTone} roughness={0.6} />
      </Cone>
      
      {/* Professional Shirt with GR Logo */}
      <Box args={[0.35, 0.6, 0.2]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color={colors.shirt} roughness={0.5} />
      </Box>
      
      {/* GR Logo on Shirt */}
      <Box args={[0.12, 0.08, 0.01]} position={[0, 1.35, 0.11]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>
      <Box args={[0.03, 0.06, 0.012]} position={[-0.03, 1.35, 0.111]}>
        <meshStandardMaterial color={colors.shirt} />
      </Box>
      <Box args={[0.03, 0.06, 0.012]} position={[0.03, 1.35, 0.111]}>
        <meshStandardMaterial color={colors.shirt} />
      </Box>
      
      {/* Arms */}
      <Cylinder args={[0.06, 0.06, 0.5]} position={[-0.25, 1.3, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color={colors.shirt} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.5]} position={[0.25, 1.3, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color={colors.shirt} roughness={0.5} />
      </Cylinder>
      
      {/* Professional Work Gloves */}
      <Sphere args={[0.05]} position={[-0.35, 1.05, 0]}>
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </Sphere>
      <Sphere args={[0.05]} position={[0.35, 1.05, 0]}>
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </Sphere>
      
      {/* Legs */}
      <Cylinder args={[0.08, 0.08, 0.7]} position={[-0.1, 0.55, 0]}>
        <meshStandardMaterial color={colors.pants} roughness={0.6} />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.7]} position={[0.1, 0.55, 0]}>
        <meshStandardMaterial color={colors.pants} roughness={0.6} />
      </Cylinder>
      
      {/* Professional Work Boots */}
      <Box args={[0.12, 0.08, 0.28]} position={[-0.1, 0.12, 0.05]}>
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </Box>
      <Box args={[0.12, 0.08, 0.28]} position={[0.1, 0.12, 0.05]}>
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </Box>
    </group>
  )
}

// Professional Landscaper Operating Riding Mower
function LandscaperWithRidingMower({ position, isMoving = true, landscaperType = 'professional' }) {
  const groupRef = useRef()
  const mowerRef = useRef()
  const humanRef = useRef()
  const wheelRefs = [useRef(), useRef(), useRef(), useRef()]
  
  const landscaperConfigs = {
    professional: {
      skinTone: "#fdbcb4",
      clothing: { shirt: "#10b981", pants: "#1f2937", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    },
    worker: {
      skinTone: "#d4a574",
      clothing: { shirt: "#000000", pants: "#1f2937", shoes: "#000000", hat: "#000000" } // Black GR shirt
    },
    supervisor: {
      skinTone: "#f3d5ab",
      clothing: { shirt: "#10b981", pants: "#000000", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    }
  }
  
  const config = landscaperConfigs[landscaperType] || landscaperConfigs.professional

  useFrame((state) => {
    if (groupRef.current && isMoving) {
      const movement = EquipmentAnimations.mowerMovement(state.clock.elapsedTime, position[0])
      
      groupRef.current.position.x = position[0] + movement.position.x
      groupRef.current.position.z = position[2] + movement.position.z
      groupRef.current.position.y = position[1] + movement.position.y
      groupRef.current.rotation.y = movement.rotation.y
      groupRef.current.rotation.z = movement.rotation.z
      groupRef.current.rotation.x = movement.rotation.x
      
      // Enhanced wheel animation with realistic physics
      wheelRefs.forEach((wheelRef, index) => {
        if (wheelRef.current) {
          wheelRef.current.rotation.x += movement.engineRPM / 10000
          // Add slight wobble for realism
          wheelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8 + index) * 0.02
        }
      })
      
      // Enhanced human steering and body movement
      if (humanRef.current) {
        // More realistic steering based on mower direction
        const steeringAngle = Math.sin(state.clock.elapsedTime * 0.8) * 0.15
        humanRef.current.rotation.y = steeringAngle
        
        // Enhanced arm movement for steering - check if children exist and have rotation
        if (humanRef.current.children[8] && humanRef.current.children[8].rotation) {
          humanRef.current.children[8].rotation.z = 0.4 + steeringAngle * 0.5 // Left arm follows steering
          humanRef.current.children[8].rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.1
        }
        if (humanRef.current.children[9] && humanRef.current.children[9].rotation) {
          humanRef.current.children[9].rotation.z = -0.4 - steeringAngle * 0.5 // Right arm follows steering
          humanRef.current.children[9].rotation.x = Math.sin(state.clock.elapsedTime * 3) * 0.1
        }
        
        // Body lean into turns
        humanRef.current.rotation.z = steeringAngle * 0.3
        
        // Subtle bouncing from mower vibration
        humanRef.current.position.y = Math.sin(state.clock.elapsedTime * 12) * 0.02
      }
      
      // Engine exhaust effect
      if (mowerRef.current && movement.engineRPM > 1800) {
        // Add subtle engine vibration
        mowerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 15) * 0.005
        mowerRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 18) * 0.005
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Riding Mower */}
      <group ref={mowerRef}>
        {/* Main Body */}
        <Box args={[2.5, 0.8, 1.5]} position={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
        </Box>
        
        {/* Seat */}
        <Box args={[0.6, 0.3, 0.6]} position={[0, 0.95, -0.3]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Box>
        
        {/* Steering Wheel */}
        <group position={[0, 1.3, -0.1]}>
          <Cylinder args={[0.2, 0.2, 0.03]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.8} />
          </Cylinder>
          <Cylinder args={[0.02, 0.02, 0.4]} position={[0, -0.2, 0]} castShadow>
            <meshStandardMaterial color="#374151" roughness={0.6} metalness={0.8} />
          </Cylinder>
        </group>
        
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
      
      {/* Human Operator */}
      <group ref={humanRef} position={[0, 0.6, -0.3]}>
        <HumanBody 
          position={[0, 0, 0]} 
          scale={0.9}
          skinTone={config.skinTone}
          clothingColors={config.clothing}
        />
      </group>
    </group>
  )
}

// Professional Landscaper Operating Push Mower
function LandscaperWithPushMower({ position, isMoving = false, landscaperType = 'worker' }) {
  const groupRef = useRef()
  const humanRef = useRef()
  const mowerRef = useRef()
  const wheelRefs = [useRef(), useRef()]
  
  const landscaperConfigs = {
    professional: {
      skinTone: "#fdbcb4",
      clothing: { shirt: "#10b981", pants: "#1f2937", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    },
    worker: {
      skinTone: "#d4a574",
      clothing: { shirt: "#000000", pants: "#1f2937", shoes: "#000000", hat: "#000000" } // Black GR shirt
    },
    supervisor: {
      skinTone: "#f3d5ab",
      clothing: { shirt: "#10b981", pants: "#000000", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    }
  }
  
  const config = landscaperConfigs[landscaperType] || landscaperConfigs.worker

  useFrame((state) => {
    if (groupRef.current) {
      if (isMoving) {
        const movement = EquipmentAnimations.pushMowerMovement(state.clock.elapsedTime, isMoving)
        groupRef.current.position.x = position[0] + movement.position.x
        groupRef.current.position.z = position[2] + movement.position.z
        groupRef.current.position.y = position[1] + movement.position.y
        groupRef.current.rotation.y = movement.rotation.y
        groupRef.current.rotation.z = movement.rotation.z
        groupRef.current.rotation.x = movement.rotation.x
        
        // Enhanced wheel animation with realistic physics
        wheelRefs.forEach((wheelRef, index) => {
          if (wheelRef.current) {
            wheelRef.current.rotation.x += movement.engineRPM / 8000
            // Add slight wobble for realism
            wheelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 6 + index) * 0.015
          }
        })
        
        // Enhanced walking animation with realistic gait
        if (humanRef.current) {
          const walkCycle = Math.sin(state.clock.elapsedTime * 4)
          const walkPhase = state.clock.elapsedTime * 4
          
          // Leg movement with proper walking cycle
          if (humanRef.current.children[12] && humanRef.current.children[12].rotation) {
            humanRef.current.children[12].rotation.x = Math.sin(walkPhase) * 0.4 // Left leg
            humanRef.current.children[12].rotation.z = Math.cos(walkPhase * 2) * 0.05 // Side step
          }
          if (humanRef.current.children[13] && humanRef.current.children[13].rotation) {
            humanRef.current.children[13].rotation.x = Math.sin(walkPhase + Math.PI) * 0.4 // Right leg (opposite phase)
            humanRef.current.children[13].rotation.z = Math.cos(walkPhase * 2 + Math.PI) * 0.05
          }
          
          // Arm swing while pushing
          if (humanRef.current.children[8] && humanRef.current.children[8].rotation) {
            humanRef.current.children[8].rotation.z = 0.3 + Math.sin(walkPhase * 0.5) * 0.1 // Left arm
            humanRef.current.children[8].rotation.x = Math.sin(walkPhase) * 0.15
          }
          if (humanRef.current.children[9] && humanRef.current.children[9].rotation) {
            humanRef.current.children[9].rotation.z = -0.3 - Math.sin(walkPhase * 0.5) * 0.1 // Right arm
            humanRef.current.children[9].rotation.x = Math.sin(walkPhase + Math.PI) * 0.15
          }
          
          // Body movement while walking and pushing
          humanRef.current.position.y = Math.abs(Math.sin(walkPhase)) * 0.03
          humanRef.current.rotation.x = -0.1 + Math.sin(walkPhase * 2) * 0.02 // Slight forward lean
          humanRef.current.rotation.z = Math.sin(walkPhase) * 0.03 // Body sway
        }
        
        // Mower vibration from engine
        if (mowerRef.current) {
          mowerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 12) * 0.008
          mowerRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 15) * 0.006
        }
      } else {
        // Enhanced idle animations
        if (humanRef.current) {
          humanRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
          
          // Relaxed arm positioning
          if (humanRef.current.children[8] && humanRef.current.children[8].rotation) {
            humanRef.current.children[8].rotation.z = 0.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
            humanRef.current.children[8].rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.03
          }
          if (humanRef.current.children[9] && humanRef.current.children[9].rotation) {
            humanRef.current.children[9].rotation.z = -0.15 - Math.sin(state.clock.elapsedTime * 0.8) * 0.05
            humanRef.current.children[9].rotation.x = Math.sin(state.clock.elapsedTime * 0.6 + Math.PI) * 0.03
          }
          
          // Subtle weight shifting
          humanRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.01
          humanRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02
        }
        
        // Idle mower engine
        if (mowerRef.current) {
          mowerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.003
        }
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Human Operator */}
      <group ref={humanRef} position={[0, 0, 0.3]}>
        <HumanBody 
          position={[0, 0, 0]} 
          scale={1}
          skinTone={config.skinTone}
          clothingColors={config.clothing}
        />
      </group>
      
      {/* Push Mower */}
      <group ref={mowerRef} position={[0, 0, -0.2]}>
        <Box args={[1.2, 0.3, 0.8]} position={[0, 0.15, 0]} castShadow>
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.7} />
        </Box>
        
        {/* Handle */}
        <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.8, -0.3]} rotation={[0.3, 0, 0]} castShadow>
          <meshStandardMaterial color="#374151" roughness={0.6} />
        </Cylinder>
        
        {/* Handle Grips */}
        <Cylinder args={[0.03, 0.03, 0.15]} position={[-0.2, 1.2, -0.5]} rotation={[0.3, 0, 0]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.15]} position={[0.2, 1.2, -0.5]} rotation={[0.3, 0, 0]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Cylinder>
        
        {/* Wheels */}
        <Cylinder ref={wheelRefs[0]} args={[0.15, 0.15, 0.1]} position={[-0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        <Cylinder ref={wheelRefs[1]} args={[0.15, 0.15, 0.1]} position={[0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]} castShadow>
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </Cylinder>
        
        {/* Grass Catcher */}
        <Box args={[0.8, 0.4, 0.3]} position={[0, 0.4, -0.4]} castShadow>
          <meshStandardMaterial color="#4b5563" roughness={0.6} />
        </Box>
      </group>
    </group>
  )
}

// Landscaper Using Hand Tools
function LandscaperWithTools({ position, toolType = 'shovel', landscaperType = 'professional', isWorking = true }) {
  const groupRef = useRef()
  const humanRef = useRef()
  const toolRef = useRef()
  
  const landscaperConfigs = {
    professional: {
      skinTone: "#fdbcb4",
      clothing: { shirt: "#10b981", pants: "#1f2937", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    },
    worker: {
      skinTone: "#d4a574",
      clothing: { shirt: "#000000", pants: "#1f2937", shoes: "#000000", hat: "#000000" } // Black GR shirt
    },
    supervisor: {
      skinTone: "#f3d5ab",
      clothing: { shirt: "#10b981", pants: "#000000", shoes: "#000000", hat: "#10b981" } // Green GR shirt
    }
  }
  
  const config = landscaperConfigs[landscaperType] || landscaperConfigs.professional

  useFrame((state) => {
    if (groupRef.current) {
      // Enhanced tool work animation using new animation system
      const toolAnimation = EquipmentAnimations.toolWorkAnimation(state.clock.elapsedTime, toolType, isWorking)
      
      if (humanRef.current) {
        if (isWorking) {
          // Enhanced working motion based on tool type
          humanRef.current.rotation.x = toolAnimation.rotation.x || 0
          humanRef.current.rotation.y = toolAnimation.rotation.y || 0
          humanRef.current.position.y = toolAnimation.position?.y || 0
          humanRef.current.position.x = toolAnimation.position?.x || 0
          
          // Enhanced arm movement for different tools
          if (humanRef.current.children[8] && humanRef.current.children[8].rotation) {
            humanRef.current.children[8].rotation.x = toolAnimation.workCycle * 0.5 // Left arm
            humanRef.current.children[8].rotation.z = 0.3 + toolAnimation.workCycle * 0.2
          }
          if (humanRef.current.children[9] && humanRef.current.children[9].rotation) {
            humanRef.current.children[9].rotation.x = toolAnimation.workCycle * 0.5 // Right arm
            humanRef.current.children[9].rotation.z = -0.3 - toolAnimation.workCycle * 0.2
          }
          
          // Tool-specific body movements
          if (toolType === 'shovel' && toolAnimation.dirtFlying) {
            humanRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 5) * 0.1
          } else if (toolType === 'rake' && toolAnimation.leavesMoving) {
            humanRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.15
          } else if (toolType === 'trimmer' && toolAnimation.grassTrimming) {
            // Add vibration effect for trimmer
            humanRef.current.position.x += toolAnimation.vibration
            humanRef.current.position.y += toolAnimation.vibration * 0.5
          }
        } else {
          // Enhanced idle animations
          humanRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08
          humanRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02
          
          // Relaxed arm positioning
          if (humanRef.current.children[8] && humanRef.current.children[8].rotation) {
            humanRef.current.children[8].rotation.z = 0.1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05
            humanRef.current.children[8].rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.03
          }
          if (humanRef.current.children[9] && humanRef.current.children[9].rotation) {
            humanRef.current.children[9].rotation.z = -0.1 - Math.sin(state.clock.elapsedTime * 0.6) * 0.05
            humanRef.current.children[9].rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + Math.PI) * 0.03
          }
          
          // Subtle weight shifting
          humanRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.01
        }
      }
      
      // Enhanced tool animations
      if (toolRef.current) {
        toolRef.current.rotation.x = toolAnimation.rotation.x || 0
        toolRef.current.rotation.y = toolAnimation.rotation.y || 0
        toolRef.current.rotation.z = toolAnimation.rotation.z || 0
        
        // Tool-specific effects
        if (toolAnimation.vibration) {
          toolRef.current.position.x += toolAnimation.vibration
          toolRef.current.position.y += toolAnimation.vibration * 0.3
        }
      }
    }
  })

  const renderTool = () => {
    switch (toolType) {
      case 'shovel':
        return (
          <group ref={toolRef} position={[0.3, 0.8, 0]} rotation={[0, 0, -0.3]}>
            <Cylinder args={[0.015, 0.015, 1.2]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </Cylinder>
            <Box args={[0.15, 0.3, 0.02]} position={[0, -0.6, 0]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.3} />
            </Box>
          </group>
        )
      
      case 'rake':
        return (
          <group ref={toolRef} position={[0.3, 0.8, 0]} rotation={[0, 0, -0.2]}>
            <Cylinder args={[0.015, 0.015, 1]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#92400e" roughness={0.8} />
            </Cylinder>
            <Box args={[0.4, 0.05, 0.02]} position={[0, -0.5, 0]} castShadow>
              <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.3} />
            </Box>
            {[...Array(8)].map((_, i) => (
              <Cylinder 
                key={i}
                args={[0.005, 0.005, 0.1]} 
                position={[-0.15 + i * 0.04, -0.52, 0]} 
                castShadow
              >
                <meshStandardMaterial color="#6b7280" metalness={0.8} />
              </Cylinder>
            ))}
          </group>
        )
      
      case 'trimmer':
        return (
          <group ref={toolRef} position={[0.3, 0.8, 0]} rotation={[0, 0, -0.4]}>
            <Cylinder args={[0.03, 0.03, 1.2]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#dc2626" roughness={0.4} />
            </Cylinder>
            <Box args={[0.1, 0.1, 0.3]} position={[0, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#1f2937" roughness={0.6} />
            </Box>
            <Cylinder args={[0.15, 0.15, 0.05]} position={[0, -0.6, 0]} castShadow>
              <meshStandardMaterial color="#374151" metalness={0.7} />
            </Cylinder>
          </group>
        )
      
      default:
        return null
    }
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Human */}
      <group ref={humanRef} position={[0, 0, 0]}>
        <HumanBody 
          position={[0, 0, 0]} 
          scale={1}
          skinTone={config.skinTone}
          clothingColors={config.clothing}
        />
      </group>
      
      {/* Tool */}
      {renderTool()}
    </group>
  )
}

// Team of Landscapers Working Together
function LandscapingTeam({ position, teamSize = 3, activity = 'mixed' }) {
  const teamMembers = useMemo(() => {
    const members = []
    const activities = ['shovel', 'rake', 'trimmer']
    const types = ['professional', 'worker', 'supervisor']
    
    for (let i = 0; i < teamSize; i++) {
      const angle = (i / teamSize) * Math.PI * 2
      const radius = 2 + Math.random() * 1
      
      members.push({
        position: [
          position[0] + Math.cos(angle) * radius,
          position[1],
          position[2] + Math.sin(angle) * radius
        ],
        toolType: activities[i % activities.length],
        landscaperType: types[i % types.length],
        isWorking: Math.random() > 0.3
      })
    }
    
    return members
  }, [teamSize, position])

  return (
    <group>
      {teamMembers.map((member, index) => (
        <LandscaperWithTools
          key={index}
          position={member.position}
          toolType={member.toolType}
          landscaperType={member.landscaperType}
          isWorking={member.isWorking}
        />
      ))}
    </group>
  )
}

export {
  HumanBody,
  LandscaperWithRidingMower,
  LandscaperWithPushMower,
  LandscaperWithTools,
  LandscapingTeam
}