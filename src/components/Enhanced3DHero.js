'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  Float, 
  Sparkles, 
  Cloud,
  Sky,
  ContactShadows,
  useTexture,
  Sphere,
  Box,
  Cylinder,
  Cone,
  Torus,
  RoundedBox,
  Plane
} from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import Image from 'next/image'

// 3D Grass Blade Component
function GrassBlade({ position, scale = 1, color = "#22c55e" }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
      meshRef.current.scale.y = scale + Math.sin(state.clock.elapsedTime * 3 + position[1]) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.02, 0.01, 0.8, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// 3D Lawn Mower Component
function LawnMower({ position }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Mower Body */}
      <Box args={[1.2, 0.3, 0.8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      
      {/* Handle */}
      <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.8, -0.3]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      
      {/* Wheels */}
      <Cylinder args={[0.15, 0.15, 0.1]} position={[-0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.15, 0.15, 0.1]} position={[0.4, -0.1, 0.3]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.1]} position={[-0.4, -0.1, -0.3]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.1]} position={[0.4, -0.1, -0.3]} rotation={[0, 0, Math.PI/2]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
    </group>
  )
}

// 3D Tree Component
function Tree({ position, scale = 1 }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Trunk */}
      <Cylinder args={[0.1, 0.15, 1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#92400e" />
      </Cylinder>
      
      {/* Leaves */}
      <Sphere args={[0.6]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#16a34a" />
      </Sphere>
      <Sphere args={[0.4]} position={[0.3, 1.4, 0.2]}>
        <meshStandardMaterial color="#15803d" />
      </Sphere>
      <Sphere args={[0.3]} position={[-0.2, 1.5, -0.1]}>
        <meshStandardMaterial color="#166534" />
      </Sphere>
    </group>
  )
}

// Enhanced Flower Component
function Flower({ position, color = "#ff6b9d" }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {/* Stem */}
      <Cylinder args={[0.01, 0.01, 0.3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#16a34a" />
      </Cylinder>
      
      {/* Petals */}
      {[...Array(6)].map((_, i) => (
        <Sphere 
          key={i}
          args={[0.03]} 
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.05,
            0.3,
            Math.sin((i / 6) * Math.PI * 2) * 0.05
          ]}
        >
          <meshStandardMaterial color={color} />
        </Sphere>
      ))}
      
      {/* Center */}
      <Sphere args={[0.02]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Sphere>
    </group>
  )
}

// Garden Path Component
function GardenPath() {
  const stones = useMemo(() => {
    const stoneArray = []
    for (let i = 0; i < 15; i++) {
      stoneArray.push({
        position: [i * 0.8 - 6, -0.45, -2 + Math.sin(i * 0.5) * 0.5],
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI
      })
    }
    return stoneArray
  }, [])

  return (
    <>
      {stones.map((stone, index) => (
        <RoundedBox
          key={index}
          args={[0.6 * stone.scale, 0.1, 0.6 * stone.scale]}
          position={stone.position}
          rotation={[0, stone.rotation, 0]}
        >
          <meshStandardMaterial color="#6b7280" roughness={0.8} />
        </RoundedBox>
      ))}
    </>
  )
}

// Garden Tools Component
function GardenTools({ position }) {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Shovel */}
      <group position={[0, 0, 0]}>
        <Cylinder args={[0.02, 0.02, 1.2]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color="#92400e" />
        </Cylinder>
        <Box args={[0.15, 0.3, 0.02]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} />
        </Box>
      </group>
      
      {/* Rake */}
      <group position={[0.3, 0, 0]} rotation={[0, 0, 0.2]}>
        <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#92400e" />
        </Cylinder>
        <Box args={[0.4, 0.05, 0.02]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.8} />
        </Box>
      </group>
    </group>
  )
}

// Hyperrealistic 3D Scene Component
function LandscapeScene() {
  const { viewport } = useThree()
  
  // Generate dense grass field
  const grassBlades = useMemo(() => {
    const blades = []
    for (let i = 0; i < 500; i++) {
      blades.push({
        position: [
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 30
        ],
        scale: 0.3 + Math.random() * 0.7,
        color: `hsl(${115 + Math.random() * 25}, ${60 + Math.random() * 20}%, ${25 + Math.random() * 25}%)`
      })
    }
    return blades
  }, [])

  // Generate flowers
  const flowers = useMemo(() => {
    const flowerArray = []
    const colors = ["#ff6b9d", "#fbbf24", "#8b5cf6", "#ef4444", "#06b6d4"]
    for (let i = 0; i < 30; i++) {
      flowerArray.push({
        position: [
          (Math.random() - 0.5) * 25,
          0,
          (Math.random() - 0.5) * 25
        ],
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    return flowerArray
  }, [])

  return (
    <>
      {/* Enhanced Environment and Lighting */}
      <Environment preset="park" />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[15, 15, 8]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-15, 10, -15]} color="#10b981" intensity={0.6} />
      <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={0.8} color="#fbbf24" />
      
      {/* Realistic Sky */}
      <Sky 
        distance={450000}
        sunPosition={[1, 0.2, 0]}
        inclination={0.1}
        azimuth={0.15}
        turbidity={8}
        rayleigh={2}
      />

      {/* Multi-layered Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#16a34a" 
          roughness={0.9}
          normalScale={[0.5, 0.5]}
        />
      </mesh>

      {/* Dirt patches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.48, 3]} receiveShadow>
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#92400e" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.48, -8]} receiveShadow>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#92400e" roughness={1} />
      </mesh>

      {/* Dense Grass Field */}
      {grassBlades.map((blade, index) => (
        <GrassBlade 
          key={index}
          position={blade.position}
          scale={blade.scale}
          color={blade.color}
        />
      ))}

      {/* Flowers scattered around */}
      {flowers.map((flower, index) => (
        <Flower 
          key={index}
          position={flower.position}
          color={flower.color}
        />
      ))}

      {/* Garden Path */}
      <GardenPath />

      {/* Multiple Lawn Mowers */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.3}>
        <LawnMower position={[3, 0, 2]} />
      </Float>
      <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <LawnMower position={[-6, 0, 4]} />
      </Float>

      {/* Garden Tools */}
      <GardenTools position={[5, 0, -3]} />
      <GardenTools position={[-8, 0, 2]} />

      {/* Enhanced Trees with variety */}
      <Tree position={[-12, 0, -8]} scale={2} />
      <Tree position={[10, 0, -12]} scale={1.8} />
      <Tree position={[-5, 0, -15]} scale={1.2} />
      <Tree position={[15, 0, -6]} scale={1.5} />
      <Tree position={[-15, 0, 5]} scale={1.3} />

      {/* Bushes */}
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Sphere 
            args={[0.8 + Math.random() * 0.4]} 
            position={[
              (Math.random() - 0.5) * 25,
              0.3,
              (Math.random() - 0.5) * 25
            ]}
          >
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </Sphere>
        </Float>
      ))}

      {/* Garden Decorations */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[0, 2, -5]}>
          <Torus args={[0.5, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.2} />
          </Torus>
        </group>
      </Float>

      {/* Enhanced Sparkles */}
      <Sparkles count={150} scale={[30, 15, 30]} size={3} speed={0.3} color="#10b981" />
      <Sparkles count={80} scale={[20, 8, 20]} size={1.5} speed={0.6} color="#fbbf24" />
      
      {/* Realistic Contact Shadows */}
      <ContactShadows 
        position={[0, -0.49, 0]} 
        opacity={0.6} 
        scale={40} 
        blur={1.5} 
        far={6} 
        resolution={512}
      />

      {/* Enhanced Clouds */}
      <Cloud position={[-8, 12, -20]} speed={0.1} opacity={0.4} />
      <Cloud position={[6, 10, -15]} speed={0.15} opacity={0.3} />
      <Cloud position={[12, 14, -25]} speed={0.08} opacity={0.5} />
      <Cloud position={[-15, 11, -18]} speed={0.12} opacity={0.35} />
    </>
  )
}

// Loading Component
function CanvasLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  )
}

export default function Enhanced3DHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-emerald-900">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 60 }}
          shadows
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <LandscapeScene />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Glassmorphic Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-10" />
      <div className="absolute inset-0 backdrop-blur-[2px] z-15" />

      {/* Main Content with Enhanced Glassmorphic Background */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content - Enhanced Typography with Glassmorphic Background */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center lg:text-left space-y-6 bg-black/30 backdrop-blur-lg border border-white/10 p-8 rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2))',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Trust Badge with enhanced 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-lg border border-emerald-500/30 rounded-full px-4 py-2 shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className="w-3 h-3 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <span className="text-white font-heading font-semibold text-sm">500+ Happy Clients</span>
            </motion.div>

            {/* Smaller, more refined heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="space-y-3"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-light text-white leading-[0.9] tracking-tight"
                style={{ 
                  textShadow: '0 0 30px rgba(16, 185, 129, 0.5), 0 0 60px rgba(16, 185, 129, 0.3)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.span
                  animate={{ 
                    textShadow: [
                      '0 0 30px rgba(16, 185, 129, 0.5)',
                      '0 0 50px rgba(16, 185, 129, 0.8)',
                      '0 0 30px rgba(16, 185, 129, 0.5)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Elevate
                </motion.span>
                <br />
                <span className="text-white/90">Your</span>{' '}
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Landscape
                </motion.span>
                <br />
                <span className="text-white/90">Vision</span>
              </motion.h1>
            </motion.div>

            {/* Smaller subtitle with enhanced contrast */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-lg sm:text-xl lg:text-2xl text-white/95 font-sans font-light leading-relaxed max-w-xl"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}
            >
              Revolutionary landscaping craftsmanship that transforms properties into 
              <motion.span 
                className="text-emerald-400 font-medium"
                animate={{ 
                  textShadow: [
                    '0 0 10px rgba(16, 185, 129, 0.5)',
                    '0 0 20px rgba(16, 185, 129, 0.8)',
                    '0 0 10px rgba(16, 185, 129, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {' '}extraordinary outdoor sanctuaries
              </motion.span> in Canal Winchester, Ohio
            </motion.p>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                  rotateX: 5,
                  boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.95, rotateX: -5 }}
                animate={{
                  y: [0, -2, 0],
                  boxShadow: [
                    "0 10px 30px rgba(16, 185, 129, 0.3)",
                    "0 20px 40px rgba(16, 185, 129, 0.4)",
                    "0 10px 30px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity },
                  boxShadow: { duration: 4, repeat: Infinity },
                  scale: { duration: 0.2 },
                  rotateX: { duration: 0.3 }
                }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-10 py-4 rounded-2xl font-heading font-thin text-lg shadow-2xl cursor-pointer relative overflow-hidden group transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"
                  initial={{ x: "-200%" }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                <motion.span 
                  className="relative z-10 flex items-center justify-center gap-3"
                  whileHover={{ 
                    textShadow: "0 0 25px rgba(255, 255, 255, 0.9)" 
                  }}
                >
                  <motion.span
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="text-xl"
                  >
                    📞
                  </motion.span>
                  <motion.span
                    whileHover={{ 
                      scale: 1.05,
                      letterSpacing: "0.05em"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Schedule Consultation
                  </motion.span>
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced 3D Interactive Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
          >
            {/* Enhanced 3D Stats Cards with Glassmorphic Background */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "500+", label: "Happy Clients", color: "emerald", delay: 0.2 },
                { value: "100%", label: "Satisfaction", color: "green", delay: 0.4 },
                { value: "5+", label: "Years Experience", color: "blue", delay: 0.6 },
                { value: "1000+", label: "Projects", color: "yellow", delay: 0.8 }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.8 + stat.delay, duration: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    z: 30
                  }}
                  className={`bg-black/50 backdrop-blur-lg border border-${stat.color}-500/30 p-5 rounded-2xl text-center shadow-2xl transform-gpu`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))',
                    backdropFilter: 'blur(15px)'
                  }}
                >
                  <motion.div
                    className={`text-3xl font-heading font-bold text-${stat.color}-400 mb-2`}
                    animate={{
                      textShadow: [
                        `0 0 10px rgba(16, 185, 129, 0.5)`,
                        `0 0 20px rgba(16, 185, 129, 0.8)`,
                        `0 0 10px rgba(16, 185, 129, 0.5)`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/80 font-sans text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Professional Info Card with enhanced 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              whileHover={{ scale: 1.03, rotateY: 3 }}
              className="mt-6 bg-black/60 backdrop-blur-lg border border-emerald-500/30 p-6 rounded-2xl shadow-2xl transform-gpu"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
                backdropFilter: 'blur(20px)'
              }}
            >
              <h3 className="text-white font-heading font-semibold text-xl mb-2">Josh Reichley</h3>
              <p className="text-emerald-400 font-sans font-medium text-lg mb-3">Master Landscaper Since 2019</p>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">📍</span>
                  Canal Winchester, OH
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">📞</span>
                  (220) 666-2520
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator with 3D effect */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-center z-30"
        >
          <div className="text-base mb-3 font-heading font-medium">Explore our work</div>
          <motion.div
            className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto relative"
            whileHover={{ scale: 1.2, borderColor: 'rgba(16, 185, 129, 0.8)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-emerald-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}