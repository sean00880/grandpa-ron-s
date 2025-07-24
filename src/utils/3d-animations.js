/**
 * 3D Animation Utilities for Hyperrealistic Landscaping Scene
 * Modular animation helpers for complex 3D elements
 */

import * as THREE from 'three'

// Wind Animation System
export const WindSystem = {
  // Natural wind patterns for grass and foliage
  grassWind: (time, position, intensity = 1) => ({
    rotation: {
      z: Math.sin(time * 2 + position[0] * 0.5) * 0.15 * intensity,
      x: Math.cos(time * 1.5 + position[2] * 0.3) * 0.08 * intensity
    },
    scale: {
      y: 1 + Math.sin(time * 3 + position[1]) * 0.1 * intensity
    }
  }),

  // Tree swaying animation
  treeSway: (time, position, height = 1) => ({
    rotation: {
      z: Math.sin(time * 0.8 + position[0]) * 0.05 * height,
      x: Math.cos(time * 0.6 + position[2]) * 0.03 * height
    }
  }),

  // Flower gentle movement
  flowerSway: (time, position) => ({
    rotation: {
      y: Math.sin(time * 0.5 + position[0]) * 0.1,
      z: Math.cos(time * 0.7 + position[2]) * 0.05
    }
  }),

  // Leaf rustling
  leafRustle: (time, leafIndex) => ({
    rotation: {
      z: Math.sin(time * 4 + leafIndex * 0.5) * 0.2,
      y: Math.cos(time * 3 + leafIndex * 0.3) * 0.15
    }
  })
}

// Realistic Growth Animations
export const GrowthAnimations = {
  // Grass blade growth from seed
  grassGrowth: (progress) => ({
    scale: {
      y: Math.max(0.1, progress),
      x: Math.min(1, progress * 1.2),
      z: Math.min(1, progress * 1.2)
    },
    position: {
      y: -0.4 + (progress * 0.4)
    }
  }),

  // Flower blooming animation
  flowerBloom: (progress) => ({
    scale: {
      x: Math.max(0.1, progress),
      y: Math.max(0.1, Math.min(1, progress * 1.5)),
      z: Math.max(0.1, progress)
    },
    rotation: {
      y: progress * Math.PI * 2
    }
  }),

  // Tree growth stages
  treeGrowth: (progress) => ({
    scale: {
      x: Math.max(0.2, progress),
      y: Math.max(0.3, progress),
      z: Math.max(0.2, progress)
    }
  })
}

// Weather Effect Animations
export const WeatherEffects = {
  // Rain droplet physics
  rainDrop: (time, dropIndex) => ({
    position: {
      y: 10 - ((time * 8 + dropIndex) % 12),
      x: Math.sin(time * 0.5 + dropIndex) * 0.2,
      z: Math.cos(time * 0.3 + dropIndex) * 0.2
    },
    rotation: {
      z: time * 2 + dropIndex
    }
  }),

  // Sunlight rays movement
  sunRays: (time) => ({
    rotation: {
      y: time * 0.1,
      z: Math.sin(time * 0.2) * 0.05
    },
    intensity: 0.8 + Math.sin(time * 0.5) * 0.3
  }),

  // Cloud drift
  cloudDrift: (time, cloudIndex) => ({
    position: {
      x: Math.sin(time * 0.1 + cloudIndex) * 5,
      z: Math.cos(time * 0.08 + cloudIndex) * 3
    },
    opacity: 0.3 + Math.sin(time * 0.3 + cloudIndex) * 0.2
  })
}

// Enhanced Equipment Animations for Intuitive Lawncare
export const EquipmentAnimations = {
  // Realistic lawn mower movement patterns with detailed physics
  mowerMovement: (time, pathIndex) => {
    const speed = 0.4
    const pathVariation = pathIndex * 2.5
    
    return {
      position: {
        x: Math.sin(time * speed + pathVariation) * 12 + Math.cos(time * speed * 0.3) * 2,
        z: Math.cos(time * speed * 0.7 + pathVariation) * 8 + Math.sin(time * speed * 0.5) * 1.5,
        y: 0.05 + Math.sin(time * 4) * 0.03 // Engine vibration
      },
      rotation: {
        y: Math.atan2(
          Math.cos(time * speed + pathVariation) * 12,
          -Math.sin(time * speed * 0.7 + pathVariation) * 8
        ) + Math.PI/2,
        z: Math.sin(time * 2) * 0.02, // Slight tilting on uneven ground
        x: Math.cos(time * 1.5) * 0.01
      },
      engineRPM: 2000 + Math.sin(time * 8) * 200,
      grassCutting: Math.abs(Math.sin(time * speed)) > 0.1
    }
  },

  // Enhanced push mower with realistic operator interaction
  pushMowerMovement: (time, isMoving) => {
    if (!isMoving) {
      return {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        engineRPM: 800 + Math.sin(time * 6) * 100
      }
    }

    return {
      position: {
        x: Math.sin(time * 0.6) * 0.8,
        z: time * 0.3 % 10 - 5,
        y: Math.sin(time * 8) * 0.02 // Walking bounce
      },
      rotation: {
        y: Math.sin(time * 0.6) * 0.1,
        z: Math.sin(time * 4) * 0.03,
        x: Math.cos(time * 3) * 0.02
      },
      engineRPM: 1500 + Math.sin(time * 10) * 150,
      grassCutting: true
    }
  },

  // Detailed tool work animations
  toolWorkAnimation: (time, toolType, isWorking) => {
    const animations = {
      shovel: {
        workCycle: isWorking ? Math.sin(time * 2.5) : Math.sin(time * 0.3) * 0.2,
        rotation: {
          x: isWorking ? Math.sin(time * 2.5) * 0.6 : 0,
          z: isWorking ? Math.cos(time * 2.5) * 0.2 : 0
        },
        position: {
          y: isWorking ? Math.abs(Math.sin(time * 2.5)) * 0.3 : 0
        },
        dirtFlying: isWorking && Math.sin(time * 2.5) > 0.7
      },
      rake: {
        workCycle: isWorking ? Math.sin(time * 3) : Math.sin(time * 0.4) * 0.1,
        rotation: {
          x: isWorking ? Math.sin(time * 3) * 0.4 : 0,
          y: isWorking ? Math.cos(time * 1.5) * 0.3 : 0
        },
        position: {
          x: isWorking ? Math.sin(time * 3) * 0.2 : 0
        },
        leavesMoving: isWorking
      },
      trimmer: {
        workCycle: isWorking ? 1 : 0,
        rotation: {
          z: isWorking ? time * 20 : 0, // High-speed rotation
          x: isWorking ? Math.sin(time * 4) * 0.1 : 0
        },
        vibration: isWorking ? Math.sin(time * 50) * 0.01 : 0,
        grassTrimming: isWorking
      }
    }

    return animations[toolType] || animations.shovel
  },

  // Enhanced sprinkler system with water physics
  sprinklerSystem: (time, coverage = 8) => ({
    rotation: {
      y: time * 1.5 // Slower, more realistic rotation
    },
    waterIntensity: 0.8 + Math.sin(time * 2) * 0.2,
    waterReach: coverage + Math.sin(time * 0.8) * 1,
    waterDroplets: {
      count: Math.floor(50 + Math.sin(time * 3) * 20),
      spread: coverage,
      height: 2 + Math.sin(time * 1.2) * 0.5
    },
    pressure: 0.7 + Math.sin(time * 4) * 0.3
  }),

  // Legacy sprinkler rotation for backward compatibility
  sprinklerRotation: (time) => ({
    rotation: {
      y: time * 1.5
    },
    waterIntensity: 0.8 + Math.sin(time * 2) * 0.2
  }),

  // Leaf blower animation
  leafBlowerEffect: (time, isActive) => ({
    airFlow: isActive ? 1 : 0,
    rotation: {
      y: isActive ? Math.sin(time * 2) * 0.3 : 0,
      z: isActive ? Math.cos(time * 1.5) * 0.1 : 0
    },
    vibration: isActive ? Math.sin(time * 30) * 0.02 : 0,
    leavesBlowing: isActive,
    windForce: isActive ? 0.8 + Math.sin(time * 5) * 0.2 : 0
  }),

  // Edger precision work
  edgerWork: (time, isWorking) => ({
    rotation: {
      z: isWorking ? time * 15 : 0, // Blade rotation
      x: isWorking ? Math.sin(time * 3) * 0.05 : 0
    },
    position: {
      y: isWorking ? Math.sin(time * 6) * 0.02 : 0
    },
    sparkEffect: isWorking && Math.random() > 0.8,
    grassEdging: isWorking
  })
}

// Particle System Helpers
export const ParticleHelpers = {
  // Pollen particles
  pollenFloat: (time, particleIndex) => ({
    position: {
      x: Math.sin(time * 0.5 + particleIndex * 0.1) * 2,
      y: 1 + Math.sin(time * 0.3 + particleIndex * 0.2) * 0.5,
      z: Math.cos(time * 0.4 + particleIndex * 0.15) * 2
    },
    opacity: 0.3 + Math.sin(time * 2 + particleIndex) * 0.2
  }),

  // Grass seed dispersal
  seedFloat: (time, seedIndex) => ({
    position: {
      x: Math.sin(time * 0.8 + seedIndex) * 5,
      y: 2 - (time * 0.5 + seedIndex) % 3,
      z: Math.cos(time * 0.6 + seedIndex) * 5
    },
    rotation: {
      x: time * 3 + seedIndex,
      y: time * 2 + seedIndex,
      z: time * 4 + seedIndex
    }
  }),

  // Butterfly flight patterns
  butterflyFlight: (time, butterflyIndex) => ({
    position: {
      x: Math.sin(time * 0.7 + butterflyIndex) * 8 + Math.cos(time * 1.2) * 2,
      y: 1.5 + Math.sin(time * 1.5 + butterflyIndex) * 1,
      z: Math.cos(time * 0.5 + butterflyIndex) * 8 + Math.sin(time * 0.9) * 2
    },
    rotation: {
      y: Math.atan2(
        Math.cos(time * 0.7 + butterflyIndex),
        Math.sin(time * 0.7 + butterflyIndex)
      )
    }
  })
}

// Lighting Animation Helpers
export const LightingHelpers = {
  // Dynamic sun position
  sunPosition: (time) => ({
    position: [
      Math.cos(time * 0.1) * 20,
      10 + Math.sin(time * 0.1) * 5,
      Math.sin(time * 0.1) * 20
    ],
    intensity: 0.8 + Math.sin(time * 0.1) * 0.3,
    color: new THREE.Color().setHSL(
      0.1 + Math.sin(time * 0.1) * 0.05,
      0.8,
      0.6 + Math.sin(time * 0.1) * 0.2
    )
  }),

  // Ambient lighting changes
  ambientCycle: (time) => ({
    intensity: 0.3 + Math.sin(time * 0.05) * 0.2,
    color: new THREE.Color().setHSL(
      0.6 + Math.sin(time * 0.05) * 0.1,
      0.3,
      0.5 + Math.sin(time * 0.05) * 0.3
    )
  }),

  // Firefly glow
  fireflyGlow: (time, fireflyIndex) => ({
    intensity: 0.5 + Math.sin(time * 3 + fireflyIndex * 2) * 0.4,
    position: {
      x: Math.sin(time * 0.8 + fireflyIndex) * 6,
      y: 0.5 + Math.sin(time * 1.2 + fireflyIndex) * 0.8,
      z: Math.cos(time * 0.6 + fireflyIndex) * 6
    }
  })
}

// Texture Animation Helpers
export const TextureAnimations = {
  // Water ripple effects
  waterRipple: (time, center = [0, 0]) => ({
    displacement: Math.sin(time * 2) * 0.1,
    normalScale: [
      0.5 + Math.sin(time * 1.5) * 0.3,
      0.5 + Math.cos(time * 1.2) * 0.3
    ]
  }),

  // Grass texture wind
  grassTextureWind: (time) => ({
    offset: [
      Math.sin(time * 0.5) * 0.01,
      Math.cos(time * 0.3) * 0.01
    ],
    scale: [
      1 + Math.sin(time * 0.8) * 0.05,
      1 + Math.cos(time * 0.6) * 0.05
    ]
  }),

  // Leaf texture seasonal changes
  leafSeasonal: (time, season = 'spring') => {
    const seasonalColors = {
      spring: { h: 0.25, s: 0.8, l: 0.5 },
      summer: { h: 0.3, s: 0.9, l: 0.4 },
      autumn: { h: 0.08, s: 0.9, l: 0.6 },
      winter: { h: 0.1, s: 0.3, l: 0.3 }
    }
    
    const base = seasonalColors[season]
    return new THREE.Color().setHSL(
      base.h + Math.sin(time * 0.1) * 0.05,
      base.s + Math.sin(time * 0.15) * 0.1,
      base.l + Math.sin(time * 0.2) * 0.1
    )
  }
}

// Performance Optimization Helpers
export const PerformanceHelpers = {
  // Level of Detail (LOD) calculator
  calculateLOD: (distance, camera) => {
    if (distance < 10) return 'high'
    if (distance < 25) return 'medium'
    return 'low'
  },

  // Frustum culling helper
  isInView: (object, camera) => {
    // Simplified frustum check
    const distance = camera.position.distanceTo(object.position)
    return distance < 50 // Adjust based on scene scale
  },

  // Animation frame throttling
  shouldAnimate: (frameCount, throttle = 1) => {
    return frameCount % throttle === 0
  }
}

export default {
  WindSystem,
  GrowthAnimations,
  WeatherEffects,
  EquipmentAnimations,
  ParticleHelpers,
  LightingHelpers,
  TextureAnimations,
  PerformanceHelpers
}