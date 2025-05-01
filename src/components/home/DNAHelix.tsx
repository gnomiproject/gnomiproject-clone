
import React, { useEffect, useRef, useState } from 'react';
import { ArchetypeId } from '@/types/archetype';
import { DNAHelixProps, StepPosition } from './types/dnaHelix';
import { drawDNAHelix } from './utils/dna';
import { detectStepClick } from './utils/dna/interactions';

const DNAHelix: React.FC<DNAHelixProps> = ({ 
  className, 
  onStepClick, 
  selectedArchetypeId,
  onFamilyClick, 
  selectedFamilyId 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stepPositions, setStepPositions] = useState<StepPosition[]>([]);
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null);
  
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
  
  // Handle mouse move for hover effects
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || stepPositions.length === 0) return;
    
    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if mouse is near any step or circle
    let foundHoverIndex: number | null = null;
    
    for (let i = 0; i < stepPositions.length; i++) {
      const step = stepPositions[i];
      
      // Check if over circle
      if (step.circleX && step.circleRadius) {
        const distance = Math.sqrt(Math.pow(step.circleX - x, 2) + Math.pow(step.y - y, 2));
        if (distance <= step.circleRadius * 1.2) { // Slightly larger than actual radius for better UX
          foundHoverIndex = i;
          break;
        }
      }
      
      // Check if over step
      const distance = Math.abs(step.y - y);
      if (distance < 10 && x >= Math.min(step.x1, step.x2) - 15 && x <= Math.max(step.x1, step.x2) + 15) {
        foundHoverIndex = i;
        break;
      }
    }
    
    // Update hover state if changed
    if (foundHoverIndex !== hoveredStepIndex) {
      setHoveredStepIndex(foundHoverIndex);
      
      // Update cursor style based on hover state
      if (canvas) {
        canvas.style.cursor = foundHoverIndex !== null ? 'pointer' : 'default';
      }
    }
  };
  
  // Handle mouse leave
  const handleCanvasMouseLeave = () => {
    setHoveredStepIndex(null);
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
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
        // Set a fixed width to avoid stretching
        canvas.width = Math.min(800, container.clientWidth);
        canvas.height = 400; // Reduced from 600px to 400px
        
        // Force a redraw when the canvas size changes or selection changes
        const newStepPositions = drawDNAHelix(ctx, canvas.width, canvas.height, selectedArchetypeId, selectedFamilyId, hoveredStepIndex);
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
  }, [selectedArchetypeId, selectedFamilyId, hoveredStepIndex]);

  // Get y positions for second step of each family (a2, b2, c2)
  const getFamilyYPositions = () => {
    if (stepPositions.length === 0) return [];
    
    // Find positions for a2, b2, c2 (indices 1, 4, 7)
    const familyPositions = [
      {
        id: 'a',
        name: 'strategists',
        yPos: stepPositions[1]?.y || 0 // a2 is at index 1
      },
      {
        id: 'b',
        name: 'pragmatists',
        yPos: stepPositions[4]?.y || 0 // b2 is at index 4
      },
      {
        id: 'c',
        name: 'logisticians',
        yPos: stepPositions[7]?.y || 0 // c2 is at index 7
      }
    ];
    
    return familyPositions;
  };

  const familyPositions = getFamilyYPositions();

  return (
    <div className="dna-helix-container relative flex items-center">
      {/* Family buttons column */}
      <div className="family-buttons absolute left-0 h-full pointer-events-none flex flex-col justify-between" style={{ width: '120px' }}>
        {familyPositions.map(family => (
          <button
            key={family.id}
            className={`pointer-events-auto py-2 px-3 rounded-l-lg text-sm font-medium transition-all transform ${
              selectedFamilyId === family.id 
                ? `bg-family-${family.id} text-white shadow-md scale-110`
                : `bg-family-${family.id}/20 hover:bg-family-${family.id}/40 hover:scale-105 text-gray-700`
            }`}
            onClick={() => onFamilyClick && onFamilyClick(family.id as 'a' | 'b' | 'c')}
            style={{ 
              position: 'absolute',
              top: family.yPos, // Position exactly at the y coordinate of the step
              transform: 'translateY(-50%)', // Center vertically
            }}
            title={`Family ${family.id}: ${family.name}`}
          >
            family {family.id}
          </button>
        ))}
      </div>

      {/* Main canvas */}
      <canvas 
        ref={canvasRef} 
        className={`w-full ${className || ''}`}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      />
    </div>
  );
};

export default DNAHelix;
