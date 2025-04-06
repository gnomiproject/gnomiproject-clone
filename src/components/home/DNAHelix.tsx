
import React, { useEffect, useRef, useState } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { DNAHelixProps, StepPosition } from './types/dnaHelix';
import { drawDNAHelix } from './utils/dna';
import { detectStepClick } from './utils/dna/interactions';

const DNAHelix: React.FC<DNAHelixProps> = ({ className, onStepClick, selectedArchetypeId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stepPositions, setStepPositions] = useState<StepPosition[]>([]);
  
  // Handle click on canvas
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onStepClick || stepPositions.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const clickedArchetypeId = detectStepClick(event, canvas, stepPositions);
    
    if (clickedArchetypeId) {
      onStepClick(clickedArchetypeId);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.min(600, window.innerHeight * 0.6);
        
        // Force a redraw when the canvas size changes or selection changes
        const newStepPositions = drawDNAHelix(ctx, canvas.width, canvas.height, selectedArchetypeId);
        setStepPositions(newStepPositions);
      }
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [selectedArchetypeId]);

  return (
    <div className={`dna-helix-container ${className || ''}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full cursor-pointer"
        style={{ maxHeight: '600px' }}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default DNAHelix;
