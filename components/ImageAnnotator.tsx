'use client';
import Image from 'next/image';

import React, { useState, useRef, useEffect } from 'react';
import { Region } from '../types';
import { MousePointer2, X } from 'lucide-react';

interface ImageAnnotatorProps {
  imageSrc: string;
  region: Region | null;
  onRegionChange: (region: Region | null) => void;
  className?: string;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageSrc,
  region,
  onRegionChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate percentage coordinates (0-100)
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to stop scrolling on touch devices
    // e.preventDefault(); 
    const coords = getCoordinates(e);
    setStartPos(coords);
    setIsDragging(true);
    // Initial click resets region
    onRegionChange({ x: coords.x, y: coords.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !startPos) return;
    const current = getCoordinates(e);

    const x = Math.min(startPos.x, current.x);
    const y = Math.min(startPos.y, current.y);
    const width = Math.abs(current.x - startPos.x);
    const height = Math.abs(current.y - startPos.y);

    onRegionChange({ x, y, width, height });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (region && (region.width < 5 || region.height < 5)) {
        // Filter out tiny accidental clicks
        onRegionChange(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative select-none touch-none cursor-crosshair group ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <Image 
        src={imageSrc} 
        alt="Annotate" 
        className="w-full h-full object-contain rounded-lg"
        draggable={false}
      />
      
      {!region && !isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm">
                <MousePointer2 size={14} /> Click & Drag to target AI
            </div>
        </div>
      )}

      {region && (region.width > 0 || region.height > 0) && (
        <div
          className="absolute border-2 border-green-400 bg-green-400/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.width}%`,
            height: `${region.height}%`,
          }}
        >
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onRegionChange(null);
                }}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm z-20"
            >
                <X size={12} />
            </button>
            <div className="absolute bottom-full left-0 mb-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap">
                Target Area
            </div>
        </div>
      )}
    </div>
  );
};