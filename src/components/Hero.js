"use client";

import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import style from "../styles/Hero.module.css";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = ({ clientX, clientY }) => {
      setMousePosition({ x: clientX, y: clientY })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          <feColorMatrix values="1 0 0 1 0 0 1 0 3 1 1 2 1 2 2 3 50 23 20 1" />
        </filter>
      </svg>
      <div className={style['hooks-main']}>
        <div className={style['hooks-filter']}>
          <motion.div
            className="b1"
            animate={{
              x: mousePosition.x - 50,
              y: mousePosition.y - 50
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />
          <motion.div
            className="b2"
            animate={{
              x: mousePosition.x - 50,
              y: mousePosition.y - 50
            }}
            transition={{ type: "spring", damping: 40, stiffness: 150, delay: 0.1 }}
          />
          <motion.div
            className="b3"
            animate={{
              x: mousePosition.x - 50,
              y: mousePosition.y - 50
            }}
            transition={{ type: "spring", damping: 50, stiffness: 100, delay: 0.2 }}
          />
        </div>
      </div>
    </>
  )
}