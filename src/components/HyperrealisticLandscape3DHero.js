'use client'

import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
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

// Import our modular components
import {
  HyperrealisticGrassBlade,
  ProfessionalLawnMower,
  HyperrealisticTree,
  HyperrealisticFlower,
  ProfessionalGardenTools,
  AnimatedButterfly
} from './3d/LandscapeComponents'

import {
  LandscaperWithRidingMower,
  LandscaperWithPushMower,
  LandscaperWithTools,
  LandscapingTeam
} from './3d/HyperrealisticHumans'

import {
  RealisticRain,
  PollenSystem,
  FireflySystem,
  SprinklerSystem,
  MulchBed,
  StoneBorder
} from './3d/EnvironmentalEffects'

import { 
  WindSystem, 
  WeatherEffects, 
  LightingHelpers,
  PerformanceHelpers 
} from '../utils/3d-animations'

// Advanced Terrain System with Realistic Textures
function HyperrealisticTerrain() {
  const terrainRef = useRef()
  const grassTexture = useTexture('/img/grass.jpg')
  const lawnTexture = useTexture('/img/lawn.jpeg')
  
  // Configure textures for realism
  useMemo(() => {
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
      grassTexture.repeat.set(8, 8)
    }
    if (lawnTexture) {
      lawnTexture.wrapS = lawnTexture.wrapT = THREE.RepeatWrapping
      lawnTexture.repeat.set(12, 12)
    }
  }, [grassTexture, lawnTexture])

  useFrame((state) => {
    if (terrainRef.current) {
      // Subtle terrain animation for wind effect
      const time = state.clock.elapsedTime
      terrainRef.current.material.normalScale.set(
        0.3 + Math.sin(time * 0.5) * 0.1,
        0.3 + Math.cos(time * 0.3) * 0.1
      )
    }
  })

  return (
    <group>
      {/* Suburban Lawn Area - More realistic residential size */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[60, 40, 32, 32]} />
        <meshStandardMaterial
          map={lawnTexture}
          normalMap={grassTexture}
          color="#16a34a"
          roughness={0.8}
          metalness={0.1}
          normalScale={[0.3, 0.3]}
        />
      </mesh>

      {/* Back Porch/Deck Area */}
      <Box args={[12, 0.3, 8]} position={[0, -0.35, -15]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </Box>
      
      {/* Porch Railings */}
      <Box args={[12, 1, 0.1]} position={[0, 0.15, -19]} castShadow>
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </Box>
      <Box args={[0.1, 1, 8]} position={[-6, 0.15, -15]} castShadow>
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </Box>
      <Box args={[0.1, 1, 8]} position={[6, 0.15, -15]} castShadow>
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </Box>

      {/* Hardscaping - Stone Patio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.45, 5]} receiveShadow>
        <circleGeometry args={[6, 8]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Hardscaping - Walkway */}
      <Box args={[3, 0.1, 20]} position={[8, -0.45, 0]} receiveShadow>
        <meshStandardMaterial color="#9ca3af" roughness={0.8} />
      </Box>

      {/* Garden beds with suburban landscaping */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, -0.48, 8]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial
          map={grassTexture}
          color="#15803d"
          roughness={0.9}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, -0.48, -5]} receiveShadow>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial
          map={grassTexture}
          color="#166534"
          roughness={0.9}
        />
      </mesh>

      {/* Driveway */}
      <Box args={[4, 0.05, 25]} position={[-15, -0.47, 0]} receiveShadow>
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </Box>
    </group>
  )
}

// Professional Landscaping Scene with Advanced Elements
function ProfessionalLandscapeScene() {
  const { viewport, camera } = useThree()
  const [timeOfDay, setTimeOfDay] = useState('day') // day, evening, night
  const [grassField, setGrassField] = useState([])
  const [flowerGardens, setFlowerGardens] = useState([])
  const frameCount = useRef(0)
  
  // Generate hyperrealistic grass field with LOD - client-side only
  useEffect(() => {
    const blades = []
    const density = 1200 // Increased density for hyperrealism
    
    for (let i = 0; i < density; i++) {
      const x = (Math.random() - 0.5) * 60
      const z = (Math.random() - 0.5) * 60
      const distance = Math.sqrt(x * x + z * z)
      
      // LOD system - fewer details for distant grass
      const lod = PerformanceHelpers.calculateLOD(distance, camera)
      if (lod === 'low' && Math.random() > 0.3) continue
      if (lod === 'medium' && Math.random() > 0.7) continue
      
      blades.push({
        position: [x, 0, z],
        scale: 0.4 + Math.random() * 0.8,
        color: `hsl(${110 + Math.random() * 30}, ${65 + Math.random() * 25}%, ${30 + Math.random() * 25}%)`,
        windIntensity: 0.5 + Math.random() * 0.5
      })
    }
    setGrassField(blades)
  }, [camera])

  // Professional flower arrangements - client-side only
  useEffect(() => {
    const gardens = []
    const gardenConfigs = [
      { center: [15, 0, 10], radius: 3, flowerType: 'rose', colors: ['#ff6b9d', '#ff1744', '#e91e63'] },
      { center: [-12, 0, -8], radius: 2.5, flowerType: 'daisy', colors: ['#ffffff', '#ffeb3b', '#fff9c4'] },
      { center: [8, 0, -15], radius: 2, flowerType: 'tulip', colors: ['#9c27b0', '#673ab7', '#3f51b5'] },
      { center: [-8, 0, 12], radius: 1.8, flowerType: 'sunflower', colors: ['#ffeb3b', '#ffc107', '#ff9800'] }
    ]
    
    gardenConfigs.forEach((garden) => {
      const flowerCount = Math.floor(garden.radius * garden.radius * 8)
      for (let i = 0; i < flowerCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * garden.radius
        const x = garden.center[0] + Math.cos(angle) * radius
        const z = garden.center[2] + Math.sin(angle) * radius
        
        gardens.push({
          position: [x, 0, z],
          flowerType: garden.flowerType,
          color: garden.colors[Math.floor(Math.random() * garden.colors.length)],
          bloomStage: 0.7 + Math.random() * 0.3
        })
      }
    })
    
    setFlowerGardens(gardens)
  }, [])

  // Professional tree placement - static data, no random generation
  const landscapeTrees = useMemo(() => [
    { position: [-20, 0, -15], scale: 2.5, treeType: 'oak', season: 'summer' },
    { position: [18, 0, -20], scale: 2.2, treeType: 'maple', season: 'summer' },
    { position: [-15, 0, 18], scale: 1.8, treeType: 'oak', season: 'summer' },
    { position: [22, 0, 8], scale: 2.0, treeType: 'maple', season: 'summer' },
    { position: [-25, 0, 5], scale: 1.6, treeType: 'oak', season: 'summer' },
    { position: [12, 0, 25], scale: 1.9, treeType: 'maple', season: 'summer' },
    { position: [-8, 0, -25], scale: 2.1, treeType: 'oak', season: 'summer' }
  ], [])

  // Reduced to 3 professional staff members with enhanced animations and better visibility
  const landscapeWorkers = useMemo(() => [
    { position: [8, 0, 5], type: 'riding', landscaperType: 'professional', isMoving: true, scale: 1.2 },
    { position: [-6, 0, 8], type: 'push', landscaperType: 'worker', isMoving: true, scale: 1.2 },
    { position: [15, 0, -3], toolType: 'trimmer', landscaperType: 'supervisor', isWorking: true, scale: 1.2 }
  ], [])

  // Remove individual hand tool workers and teams to focus on main 3 staff
  const handToolWorkers = useMemo(() => [], [])
  const workingTeams = useMemo(() => [], [])

  useFrame((state) => {
    frameCount.current++
    
    // Dynamic time of day changes
    const dayProgress = (Math.sin(state.clock.elapsedTime * 0.1) + 1) / 2
    if (dayProgress > 0.8) setTimeOfDay('evening')
    else if (dayProgress < 0.2) setTimeOfDay('night')
    else setTimeOfDay('day')
  })

  return (
    <>
      {/* Advanced Lighting System */}
      <Environment preset="park" />
      
      {/* Dynamic sun lighting */}
      <directionalLight 
        position={LightingHelpers.sunPosition(frameCount.current * 0.01).position}
        intensity={LightingHelpers.sunPosition(frameCount.current * 0.01).intensity}
        color={LightingHelpers.sunPosition(frameCount.current * 0.01).color}
        castShadow 
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />
      
      {/* Ambient lighting with day/night cycle */}
      <ambientLight 
        intensity={LightingHelpers.ambientCycle(frameCount.current * 0.01).intensity}
        color={LightingHelpers.ambientCycle(frameCount.current * 0.01).color}
      />
      
      {/* Additional atmospheric lighting */}
      <pointLight position={[-20, 8, -20]} color="#10b981" intensity={0.4} distance={25} />
      <pointLight position={[20, 8, 20]} color="#fbbf24" intensity={0.3} distance={25} />
      <spotLight 
        position={[0, 25, 0]} 
        angle={0.6} 
        penumbra={1} 
        intensity={0.5} 
        color="#ffffff"
        castShadow
      />
      
      {/* Hyperrealistic Sky System */}
      <Sky 
        distance={450000}
        sunPosition={LightingHelpers.sunPosition(frameCount.current * 0.01).position}
        inclination={0.1}
        azimuth={0.15}
        turbidity={timeOfDay === 'evening' ? 12 : 8}
        rayleigh={timeOfDay === 'night' ? 0.5 : 2}
      />

      {/* Advanced Terrain */}
      <HyperrealisticTerrain />

      {/* Hyperrealistic Grass Field */}
      {grassField.map((blade, index) => (
        <HyperrealisticGrassBlade 
          key={index}
          position={blade.position}
          scale={blade.scale}
          color={blade.color}
          windIntensity={blade.windIntensity}
        />
      ))}

      {/* Professional Flower Gardens */}
      {flowerGardens.map((flower, index) => (
        <HyperrealisticFlower 
          key={index}
          position={flower.position}
          flowerType={flower.flowerType}
          color={flower.color}
          bloomStage={flower.bloomStage}
        />
      ))}

      {/* Landscape Trees */}
      {landscapeTrees.map((tree, index) => (
        <HyperrealisticTree 
          key={index}
          position={tree.position}
          scale={tree.scale}
          treeType={tree.treeType}
          season={tree.season}
        />
      ))}

      {/* Professional 3-Member Landscaping Team with Enhanced Animations and Better Visibility */}
      {landscapeWorkers.map((worker, index) => (
        <group key={index} scale={worker.scale || 1}>
          <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.15}>
            {worker.type === 'riding' ? (
              <LandscaperWithRidingMower
                position={worker.position}
                landscaperType={worker.landscaperType}
                isMoving={worker.isMoving}
              />
            ) : worker.type === 'push' ? (
              <LandscaperWithPushMower
                position={worker.position}
                landscaperType={worker.landscaperType}
                isMoving={worker.isMoving}
              />
            ) : (
              <LandscaperWithTools
                position={worker.position}
                toolType={worker.toolType}
                landscaperType={worker.landscaperType}
                isWorking={worker.isWorking}
              />
            )}
          </Float>
        </group>
      ))}

      {/* Mulch Beds */}
      <MulchBed position={[15, -0.4, 10]} size={[8, 0.15, 6]} mulchType="red" />
      <MulchBed position={[-12, -0.4, -8]} size={[6, 0.15, 5]} mulchType="bark" />
      <MulchBed position={[8, -0.4, -15]} size={[5, 0.15, 4]} mulchType="black" />

      {/* Stone Borders */}
      <StoneBorder 
        points={[
          [12, -0.3, 7], [18, -0.3, 7], [18, -0.3, 13], [12, -0.3, 13], [12, -0.3, 7]
        ]}
        stoneType="river"
      />
      
      <StoneBorder 
        points={[
          [-15, -0.3, -11], [-9, -0.3, -11], [-9, -0.3, -5], [-15, -0.3, -5], [-15, -0.3, -11]
        ]}
        stoneType="granite"
      />

      {/* Environmental Effects */}
      <PollenSystem density={0.4} season="summer" />
      
      {/* Sprinkler Systems */}
      <SprinklerSystem position={[0, 0, 0]} active={true} coverage={8} />
      <SprinklerSystem position={[20, 0, 15]} active={true} coverage={6} />
      <SprinklerSystem position={[-18, 0, -12]} active={true} coverage={7} />

      {/* Animated Wildlife */}
      <AnimatedButterfly position={[0, 1, 0]} butterflyIndex={0} />
      <AnimatedButterfly position={[10, 1.5, 8]} butterflyIndex={1} />
      <AnimatedButterfly position={[-8, 1.2, -5]} butterflyIndex={2} />

      {/* Evening/Night Effects */}
      {(timeOfDay === 'evening' || timeOfDay === 'night') && (
        <FireflySystem count={20} active={true} />
      )}

      {/* Enhanced Sparkles for Magical Effect */}
      <Sparkles count={200} scale={[60, 20, 60]} size={4} speed={0.2} color="#10b981" />
      <Sparkles count={100} scale={[40, 15, 40]} size={2} speed={0.4} color="#fbbf24" />
      <Sparkles count={50} scale={[20, 8, 20]} size={1} speed={0.6} color="#8b5cf6" />
      
      {/* Professional Contact Shadows */}
      <ContactShadows 
        position={[0, -0.49, 0]} 
        opacity={0.4} 
        scale={80} 
        blur={2} 
        far={10} 
        resolution={1024}
        color="#000000"
      />

      {/* Atmospheric Clouds */}
      <Cloud position={[-15, 15, -30]} speed={0.05} opacity={0.3} />
      <Cloud position={[10, 12, -25]} speed={0.08} opacity={0.4} />
      <Cloud position={[25, 18, -35]} speed={0.06} opacity={0.35} />
      <Cloud position={[-25, 14, -20]} speed={0.07} opacity={0.3} />
      <Cloud position={[5, 16, -40]} speed={0.04} opacity={0.25} />
    </>
  )
}

// Enhanced Loading Component
function AdvancedCanvasLoader() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-black via-zinc-900 to-emerald-900">
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-emerald-400 font-heading text-lg"
        >
          Loading Hyperrealistic Landscape...
        </motion.p>
      </div>
    </div>
  )
}

export default function HyperrealisticLandscape3DHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-emerald-900">
      {/* Hyperrealistic 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 8, 15], fov: 55 }}
          shadows="soft"
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ProfessionalLandscapeScene />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false} 
              maxPolarAngle={Math.PI / 2.2}
              minPolarAngle={Math.PI / 4}
              autoRotate
              autoRotateSpeed={0.3}
              dampingFactor={0.05}
              enableDamping
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced Glassmorphic Overlay System */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-black/85 z-10" />
      <div className="absolute inset-0 backdrop-blur-[1px] z-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-16" />

      {/* Main Content with Ultra-Enhanced Glassmorphic Background */}
      <motion.div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16"
        style={{ opacity }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content - Ultra-Enhanced Typography with Advanced Glassmorphic Background */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center lg:text-left space-y-6 bg-black/40 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3), rgba(16, 185, 129, 0.1))',
              backdropFilter: 'blur(25px)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 50px rgba(16, 185, 129, 0.1)'
            }}
          >
            {/* Enhanced Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-emerald-500/25 backdrop-blur-lg border border-emerald-500/40 rounded-full px-5 py-3 shadow-2xl"
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
              <span className="text-white font-heading font-semibold text-base">500+ Happy Clients</span>
            </motion.div>

            {/* Ultra-refined heading with perfect sizing */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="space-y-4"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-thin text-white leading-[0.85] tracking-tight"
                style={{ 
                  textShadow: '0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.4), 0 4px 20px rgba(0, 0, 0, 0.8)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.span
                  animate={{ 
                    textShadow: [
                      '0 0 40px rgba(16, 185, 129, 0.6)',
                      '0 0 60px rgba(16, 185, 129, 0.9)',
                      '0 0 40px rgba(16, 185, 129, 0.6)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Elevate
                </motion.span>
                <br />
                <span className="text-white/95">Your</span>{' '}
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
                <span className="text-white/95">Vision</span>
              </motion.h1>
            </motion.div>

            {/* Perfect subtitle with enhanced contrast */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/98 font-sans font-light leading-relaxed max-w-2xl"
              style={{ textShadow: '0 3px 15px rgba(0, 0, 0, 0.9)' }}
            >
              Revolutionary landscaping craftsmanship that transforms properties into 
              <motion.span 
                className="text-emerald-400 font-medium"
                animate={{ 
                  textShadow: [
                    '0 0 15px rgba(16, 185, 129, 0.6)',
                    '0 0 25px rgba(16, 185, 129, 0.9)',
                    '0 0 15px rgba(16, 185, 129, 0.6)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {' '}extraordinary outdoor sanctuaries
              </motion.span> in Canal Winchester, Ohio
            </motion.p>

            {/* Ultra-Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.08, 
                  y: -4,
                  rotateX: 8,
                  boxShadow: "0 30px 60px rgba(16, 185, 129, 0.5)"
                }}
                whileTap={{ scale: 0.95, rotateX: -8 }}
                animate={{
                  y: [0, -3, 0],
                  boxShadow: [
                    "0 15px 40px rgba(16, 185, 129, 0.4)",
                    "0 25px 50px rgba(16, 185, 129, 0.5)",
                    "0 15px 40px rgba(16, 185, 129, 0.4)"
                  ]
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity },
                  boxShadow: { duration: 4, repeat: Infinity },
                  scale: { duration: 0.2 },
                  rotateX: { duration: 0.3 }
                }}
                className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-12 py-5 rounded-2xl font-heading font-light text-xl shadow-2xl cursor-pointer relative overflow-hidden group transform-gpu"
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
                    textShadow: "0 0 30px rgba(255, 255, 255, 1)" 
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

          {/* Right Content - Ultra-Enhanced 3D Interactive Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="relative"
          >
            {/* Ultra-Enhanced 3D Stats Cards with Advanced Glassmorphic Background */}
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
                    scale: 1.05,
                    rotateY: 5,
                    z: 30
                  }}
                  className={`bg-black/60 backdrop-blur-xl border border-${stat.color}-500/40 p-6 rounded-2xl text-center shadow-2xl transform-gpu`}
                  style={{
                    transformStyle: 'preserve-3d',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <motion.div
                    className={`text-4xl font-heading font-bold text-${stat.color}-400 mb-3`}
                    animate={{
                      textShadow: [
                        `0 0 15px rgba(16, 185, 129, 0.6)`,
                        `0 0 25px rgba(16, 185, 129, 0.9)`,
                        `0 0 15px rgba(16, 185, 129, 0.6)`
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/85 font-sans text-base font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* GrandpaRon Image with Advanced 3D Effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 2.5, duration: 1 }}
              whileHover={{ scale: 1.03, rotateY: 3 }}
              className="mt-8 bg-black/70 backdrop-blur-xl border border-emerald-500/40 p-8 rounded-2xl shadow-2xl transform-gpu overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), rgba(16, 185, 129, 0.1))',
                backdropFilter: 'blur(25px)'
              }}
            >
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/img/GrandpaRon.png"
                    alt="Grandpa Ron - Master Landscaper"
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover rounded-xl"
                    style={{
                      filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 0.8 }}
                  >
                    <h3 className="text-white font-heading font-bold text-2xl mb-2 drop-shadow-lg">
                      Grandpa Ron
                    </h3>
                    <p className="text-emerald-400 font-sans font-medium text-lg drop-shadow-lg">
                      Master Landscaper & Founder
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Ultra-Enhanced Scroll Indicator with Advanced 3D Effect */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-center z-30"
        >
          <div className="text-lg mb-4 font-heading font-medium">Explore our hyperrealistic work</div>
          <motion.div
            className="w-8 h-12 border-2 border-white/50 rounded-full mx-auto relative"
            whileHover={{ scale: 1.2, borderColor: 'rgba(16, 185, 129, 0.9)' }}
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