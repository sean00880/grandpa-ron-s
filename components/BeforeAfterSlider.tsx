'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    
    const position = ((clientX - containerRect.left) / containerRect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove, handleMouseUp]);

  const handleMouseDown = () => setIsDragging(true);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl cursor-ew-resize select-none ${className}`}
    >
      {/* After Image (Background) */}
      <div className="absolute inset-0">
        <img 
          src={afterImage} 
          alt="After" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg z-10">
          AI Render
        </div>
      </div>

      {/* Before Image (Foreground clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute top-0 left-0 h-full w-auto max-w-none" 
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : '100%' }}
        />
        <div className="absolute top-4 left-4 bg-white/80 text-gray-800 px-3 py-1 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
          Original
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-green-600 hover:scale-110 transition-transform">
            <ChevronsLeftRight size={20} />
        </div>
      </div>
    </div>
  );
};