
import React, { useEffect, useRef } from 'react';

interface DNAHelixProps {
  className?: string;
}

const DNAHelix: React.FC<DNAHelixProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        drawDNAHelix(ctx, canvas.width, canvas.height);
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
  }, []);

  const drawDNAHelix = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Constants for the helix
    const centerX = width / 2;
    const amplitude = width * 0.2; // Increased from 0.15 to 0.2 to make the helix wider
    const frequency = Math.PI * 3 / height; // How many cycles to fit in the height
    const strandWidth = 10;
    const numberOfSteps = 13;

    // Draw the left strand (blue to teal gradient)
    const blueGradient = ctx.createLinearGradient(0, 0, 0, height);
    blueGradient.addColorStop(0, '#00B0F0'); // Family A color (top)
    blueGradient.addColorStop(0.5, '#0D41C0'); // Family B3 color (middle)
    blueGradient.addColorStop(1, '#00B2B1'); // Family B color (bottom)
    
    ctx.beginPath();
    for (let y = 0; y < height; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y);
      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth;
    ctx.strokeStyle = blueGradient;
    ctx.stroke();

    // Draw the right strand (orange to pink gradient)
    const orangeGradient = ctx.createLinearGradient(0, 0, 0, height);
    orangeGradient.addColorStop(0, '#EC7500'); // Archetype A1 (top)
    orangeGradient.addColorStop(0.5, '#FFC600'); // Archetype A3 (middle)
    orangeGradient.addColorStop(1, '#FF8B91'); // Family C color (bottom)
    
    ctx.beginPath();
    for (let y = 0; y < height; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y + Math.PI);
      if (y === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth;
    ctx.strokeStyle = orangeGradient;
    ctx.stroke();

    // Draw the connecting steps (thin lines) - evenly spaced from top to bottom
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e0e0e0';
    
    for (let i = 0; i < numberOfSteps; i++) {
      // Adjust the calculation to distribute steps from very top to very bottom
      const y = i * (height / (numberOfSteps - 1));
      const x1 = centerX + amplitude * Math.sin(frequency * y);
      const x2 = centerX + amplitude * Math.sin(frequency * y + Math.PI);
      
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }
  };

  return (
    <div className={`dna-helix-container ${className || ''}`}>
      <canvas 
        ref={canvasRef} 
        className="w-full"
        style={{ maxHeight: '600px' }}
      />
    </div>
  );
};

export default DNAHelix;
