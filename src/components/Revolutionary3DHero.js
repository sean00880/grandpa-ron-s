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

// 3D Scene Component
function LandscapeScene() {
  const { viewport } = useThree()
  
  // Generate grass field
  const grassBlades = useMemo(() => {
    const blades = []
    for (let i = 0; i < 200; i++) {
      blades.push({
        position: [
          (Math.random() - 0.5) * 20,
          0,
          (Math.random() - 0.5) * 20
        ],
        scale: 0.5 + Math.random() * 0.5,
        color: `hsl(${120 + Math.random() * 20}, 70%, ${30 + Math.random() * 20}%)`
      })
    }
    return blades
  }, [])

  return (
    <>
      {/* Environment and Lighting */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} color="#10b981" intensity={0.5} />
      
      {/* Sky */}
      <Sky 
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>

      {/* Grass Field */}
      {grassBlades.map((blade, index) => (
        <GrassBlade 
          key={index}
          position={blade.position}
          scale={blade.scale}
          color={blade.color}
        />
      ))}

      {/* 3D Lawn Mower */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <LawnMower position={[2, 0, 1]} />
      </Float>

      {/* Trees */}
      <Tree position={[-8, 0, -5]} scale={1.5} />
      <Tree position={[6, 0, -8]} scale={1.2} />
      <Tree position={[-3, 0, -10]} scale={0.8} />

      {/* Floating 3D Text */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        <group position={[-3, 3, 0]} rotation={[0, 0.2, 0]}>
          <Box args={[2, 0.3, 0.1]}>
            <meshStandardMaterial color="#10b981" />
          </Box>
        </group>
      </Float>

      {/* Sparkles for magical effect */}
      <Sparkles count={100} scale={[20, 10, 20]} size={2} speed={0.4} color="#10b981" />
      
      {/* Contact Shadows */}
      <ContactShadows 
        position={[0, -0.49, 0]} 
        opacity={0.4} 
        scale={30} 
        blur={2} 
        far={4} 
      />

      {/* Clouds */}
      <Cloud position={[-4, 8, -15]} speed={0.2} opacity={0.3} />
      <Cloud position={[4, 6, -10]} speed={0.3} opacity={0.2} />
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

export default function Revolutionary3DHero() {
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

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 z-10" />

      {/* Main Content */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content - Enhanced Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Trust Badge with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-lg border border-emerald-500/30 rounded-full px-6 py-3 shadow-2xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
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
              <span className="text-white font-heading font-semibold text-lg">500+ Happy Clients</span>
            </motion.div>

            {/* Revolutionary 3D Heading */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-light text-white leading-[0.85] tracking-tight"
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

            {/* Enhanced Subtitle with 3D effects */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-sans font-light leading-relaxed max-w-2xl"
              style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}
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

            {/* Enhanced CTA Button with 3D effects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  rotateX: 10,
                  boxShadow: "0 30px 60px rgba(16, 185, 129, 0.4)"
                }}
                whileTap={{ scale: 0.95, rotateX: -5 }}
                animate={{
                  y: [0, -3, 0],
                  boxShadow: [
                    "0 15px 35px rgba(16, 185, 129, 0.3)",
                    "0 25px 50px rgba(16, 185, 129, 0.4)",
                    "0 15px 35px rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity },
                  boxShadow: { duration: 4, repeat: Infinity },
                  scale: { duration: 0.2 },
                  rotateX: { duration: 0.3 }
                }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-12 py-5 rounded-2xl font-heading font-thin text-xl shadow-2xl cursor-pointer relative overflow-hidden group transform-gpu"
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
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="text-2xl"
                  >
                    📞
                  </motion.span>
                  <motion.span
                    whileHover={{ 
                      scale: 1.05,
                      letterSpacing: "0.1em"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    Schedule Consultation
                  </motion.span>
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Interactive Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
          >
            {/* 3D Stats Cards */}
            <div className="grid grid-cols-2 gap-6">
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
                    scale: 1.1, 
                    rotateY: 10,
                    z: 50
                  }}
                  className={`bg-black/40 backdrop-blur-lg border border-${stat.color}-500/30 p-6 rounded-2xl text-center shadow-2xl transform-gpu`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div 
                    className={`text-4xl font-heading font-bold text-${stat.color}-400 mb-2`}
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

            {/* Professional Info Card with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="mt-8 bg-black/50 backdrop-blur-lg border border-emerald-500/30 p-6 rounded-2xl shadow-2xl transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <h3 className="text-white font-heading font-semibold text-2xl mb-2">Josh Reichley</h3>
              <p className="text-emerald-400 font-sans font-medium text-lg mb-3">Master Landscaper Since 2019</p>
              <div className="flex items-center gap-4 text-white/80">
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
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-center z-30"
        >
          <div className="text-lg mb-3 font-heading font-medium">Explore our work</div>
          <motion.div 
            className="w-8 h-12 border-2 border-white/40 rounded-full mx-auto relative"
            whileHover={{ scale: 1.2, borderColor: 'rgba(16, 185, 129, 0.8)' }}
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-4 bg-emerald-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}