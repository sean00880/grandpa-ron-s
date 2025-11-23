
// Animation configurations for framer-motion
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

export const hoverLift = {
  y: -5,
  transition: { duration: 0.2 }
};

// Spring animations
export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20
};

export const gentleSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 15
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};
