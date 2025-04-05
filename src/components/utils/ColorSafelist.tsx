
import React from 'react';

// This component is never rendered, it just ensures that all color classes are included in the build
const ColorSafelist = () => {
  return (
    <div className="hidden">
      {/* Family colors */}
      <div className="bg-family-a text-family-a"></div>
      <div className="bg-family-b text-family-b"></div>
      <div className="bg-family-c text-family-c"></div>
      <div className="bg-family-a/10 bg-family-a/20"></div>
      <div className="bg-family-b/10 bg-family-b/20"></div>
      <div className="bg-family-c/10 bg-family-c/20"></div>
      <div className="hover:bg-family-a/20 hover:bg-family-b/20 hover:bg-family-c/20"></div>
      
      {/* Archetype colors */}
      <div className="bg-archetype-a1 text-archetype-a1 hover:bg-archetype-a1 hover:text-archetype-a1"></div>
      <div className="bg-archetype-a2 text-archetype-a2 hover:bg-archetype-a2 hover:text-archetype-a2"></div>
      <div className="bg-archetype-a3 text-archetype-a3 hover:bg-archetype-a3 hover:text-archetype-a3"></div>
      <div className="bg-archetype-b1 text-archetype-b1 hover:bg-archetype-b1 hover:text-archetype-b1"></div>
      <div className="bg-archetype-b2 text-archetype-b2 hover:bg-archetype-b2 hover:text-archetype-b2"></div>
      <div className="bg-archetype-b3 text-archetype-b3 hover:bg-archetype-b3 hover:text-archetype-b3"></div>
      <div className="bg-archetype-c1 text-archetype-c1 hover:bg-archetype-c1 hover:text-archetype-c1"></div>
      <div className="bg-archetype-c2 text-archetype-c2 hover:bg-archetype-c2 hover:text-archetype-c2"></div>
      <div className="bg-archetype-c3 text-archetype-c3 hover:bg-archetype-c3 hover:text-archetype-c3"></div>
      
      {/* Opacity variants */}
      <div className="bg-archetype-a1/10 bg-archetype-a1/20 border-archetype-a1"></div>
      <div className="bg-archetype-a2/10 bg-archetype-a2/20 border-archetype-a2"></div>
      <div className="bg-archetype-a3/10 bg-archetype-a3/20 border-archetype-a3"></div>
      <div className="bg-archetype-b1/10 bg-archetype-b1/20 border-archetype-b1"></div>
      <div className="bg-archetype-b2/10 bg-archetype-b2/20 border-archetype-b2"></div>
      <div className="bg-archetype-b3/10 bg-archetype-b3/20 border-archetype-b3"></div>
      <div className="bg-archetype-c1/10 bg-archetype-c1/20 border-archetype-c1"></div>
      <div className="bg-archetype-c2/10 bg-archetype-c2/20 border-archetype-c2"></div>
      <div className="bg-archetype-c3/10 bg-archetype-c3/20 border-archetype-c3"></div>
    </div>
  );
};

export default ColorSafelist;
