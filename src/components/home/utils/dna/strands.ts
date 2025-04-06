
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

  // Define family colors based on the provided specifications
  const familyColors = {
    a: '#00B0F0', // Strategists
    b: '#00B2B1', // Pragmatists
    c: '#FF8B91'  // Logisticians
  };
  
  // Create gradient for left strand (blue to teal to deeper blue)
  const leftStrandGradient = ctx.createLinearGradient(0, 0, 0, height);
  leftStrandGradient.addColorStop(0, '#00B0F0');  // Family a color at top
  leftStrandGradient.addColorStop(0.5, '#00B2B1'); // Family b color in middle
  leftStrandGradient.addColorStop(1, '#FF8B91');  // Family c color at bottom
  
  // Create gradient for right strand (orange to yellow to pink)
  const rightStrandGradient = ctx.createLinearGradient(0, 0, 0, height);
  rightStrandGradient.addColorStop(0, '#EC7500');  // a1 color at top
  rightStrandGradient.addColorStop(0.5, '#7030A0');  // b1 color in middle
  rightStrandGradient.addColorStop(1, '#E40032');  // c1 color at bottom
  
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
  ctx.strokeStyle = leftStrandGradient;
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
  ctx.strokeStyle = rightStrandGradient;
  ctx.stroke();
  
  // If a family is selected, highlight its section on both strands
  if (selectedFamilyId) {
    const section = familySections[selectedFamilyId];
    const familyColor = familyColors[selectedFamilyId];
    
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
    ctx.lineWidth = strandWidth + 3;
    ctx.strokeStyle = familyColor;
    ctx.stroke();
    
    // Add glow effect to selected section
    ctx.beginPath();
    for (let y = section.startY; y <= section.endY; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y);
      
      if (y === section.startY) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth + 8;
    ctx.strokeStyle = `rgba(var(--family-${selectedFamilyId}-rgb), 0.3)`;
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
    ctx.lineWidth = strandWidth + 3;
    ctx.strokeStyle = familyColor;
    ctx.stroke();
    
    // Add glow effect to selected section
    ctx.beginPath();
    for (let y = section.startY; y <= section.endY; y++) {
      const x = centerX + amplitude * Math.sin(frequency * y + Math.PI);
      
      if (y === section.startY) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineWidth = strandWidth + 8;
    ctx.strokeStyle = `rgba(var(--family-${selectedFamilyId}-rgb), 0.3)`;
    ctx.stroke();
  }
};
