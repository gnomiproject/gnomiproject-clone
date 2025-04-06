
/**
 * Draws the two DNA strands with a sine wave pattern
 */
export const drawDNAStrands = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number,
  centerX: number, 
  amplitude: number, 
  frequency: number, 
  strandWidth: number,
  selectedFamilyId?: 'a' | 'b' | 'c' | null
) => {
  // Define family sections by y-coordinate ranges
  const familySections = {
    a: { startY: 0, endY: height / 3 },
    b: { startY: height / 3, endY: 2 * height / 3 },
    c: { startY: 2 * height / 3, endY: height }
  };

  // Set up strand colors
  const strandColor1 = 'rgba(0, 176, 240, 0.5)'; // Blue tone
  const strandColor2 = 'rgba(0, 176, 240, 0.5)'; // Blue tone
  
  // Draw first DNA strand (left sine wave)
  ctx.beginPath();
  for (let y = 0; y <= height; y++) {
    const x = centerX + amplitude * Math.sin(frequency * y);
    
    // Check if this part of the strand belongs to the selected family
    let isSelectedFamilySection = false;
    if (selectedFamilyId) {
      const currentSection = familySections[selectedFamilyId];
      isSelectedFamilySection = y >= currentSection.startY && y <= currentSection.endY;
    }
    
    if (y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineWidth = strandWidth;
  ctx.strokeStyle = strandColor1;
  ctx.stroke();
  
  // Draw second DNA strand (right sine wave, phase-shifted by π)
  ctx.beginPath();
  for (let y = 0; y <= height; y++) {
    const x = centerX + amplitude * Math.sin(frequency * y + Math.PI);
    
    // Check if this part of the strand belongs to the selected family
    let isSelectedFamilySection = false;
    if (selectedFamilyId) {
      const currentSection = familySections[selectedFamilyId];
      isSelectedFamilySection = y >= currentSection.startY && y <= currentSection.endY;
    }
    
    if (y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.lineWidth = strandWidth;
  ctx.strokeStyle = strandColor2;
  ctx.stroke();
  
  // If a family is selected, highlight its section on both strands
  if (selectedFamilyId) {
    const section = familySections[selectedFamilyId];
    
    // Left strand highlight
    ctx.beginPath();
    for (let y = section.startY; y <= section.endY; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y);
      
      if (y === section.startY) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth + 2;
    ctx.strokeStyle = `rgba(var(--family-${selectedFamilyId}-rgb), 0.8)`;
    ctx.stroke();
    
    // Right strand highlight
    ctx.beginPath();
    for (let y = section.startY; y <= section.endY; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y + Math.PI);
      
      if (y === section.startY) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth + 2;
    ctx.strokeStyle = `rgba(var(--family-${selectedFamilyId}-rgb), 0.8)`;
    ctx.stroke();
  }
};
