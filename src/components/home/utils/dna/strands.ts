
import { createDNAGradients } from './colors';

/**
 * Draws the DNA strands
 */
export const drawDNAStrands = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  centerX: number,
  amplitude: number,
  frequency: number,
  strandWidth: number
) => {
  const { blueGradient, orangeGradient } = createDNAGradients(ctx, height);
  
  // Draw the left strand (blue to teal gradient)
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
};
