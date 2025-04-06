
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
        const newStepPositions = drawDNAHelix(ctx, canvas.width, canvas.height, selectedArchetypeId, selectedFamilyId);
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
  }, [selectedArchetypeId, selectedFamilyId]);

  // Get y positions for second step of each family (a2, b2, c2)
  const getFamilyYPositions = () => {
    if (stepPositions.length === 0) return [];
    
    // Find positions for a2, b2, c2 (indices 1, 4, 7)
    const familyPositions = [
      {
        id: 'a',
        name: 'Strategists',
        yPos: stepPositions[1]?.y || 0 // a2 is at index 1
      },
      {
        id: 'b',
        name: 'Pragmatists',
        yPos: stepPositions[4]?.y || 0 // b2 is at index 4
      },
      {
        id: 'c',
        name: 'Logisticians',
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
                ? `bg-family-${family.id} text-white shadow-md`
                : `bg-family-${family.id}/20 hover:bg-family-${family.id}/40 text-gray-700`
            }`}
            onClick={() => onFamilyClick && onFamilyClick(family.id as 'a' | 'b' | 'c')}
            style={{ 
              position: 'absolute',
              top: family.yPos, // Position exactly at the y coordinate of the step
              transform: 'translateY(-50%)' // Center vertically
            }}
          >
            Family {family.id.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Main canvas */}
      <canvas 
        ref={canvasRef} 
        className={`w-full cursor-pointer ${className || ''}`}
        style={{ maxHeight: '600px' }}
        onClick={handleCanvasClick}
      />
    </div>
  );
};

export default DNAHelix;
