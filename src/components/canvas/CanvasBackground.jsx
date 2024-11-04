import React, { useMemo } from 'react';

const CanvasBackground = ({ zoom, position }) => {
  const gridConfig = useMemo(() => {
    // Base sizes in pixels - adjusted for zoom levels
    const smallGrid = 32;   // Base grid size
    const mediumGrid = 64;  // Medium density
    const largeGrid = 96;   // Lowest density
    
    // Determine which grid size to use based on zoom level
    let primarySize;
    if (zoom < 0.1) {          // At 10% zoom or less - lowest density
      primarySize = largeGrid;
    } else if (zoom < 0.5) {   // At 50% zoom or less - medium density
      primarySize = mediumGrid;
    } else {                   // At >50% zoom - highest density
      primarySize = smallGrid;
    }
    
    return {
      dotSize: 1, // Fixed 1px dot size
      spacing: primarySize,
      opacity: Math.min(0.3, 0.1 + zoom * 0.1) // Opacity increases with zoom but caps at 0.3
    };
  }, [zoom]);

  return (
    <div className="absolute inset-0 bg-white">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(0, 0, 0, 0.15) ${gridConfig.dotSize}px, transparent ${gridConfig.dotSize}px),
            radial-gradient(circle at center, rgba(0, 0, 0, 0.3) ${gridConfig.dotSize}px, transparent ${gridConfig.dotSize}px)
          `,
          backgroundSize: `
            ${gridConfig.spacing * zoom}px ${gridConfig.spacing * zoom}px,
            ${(gridConfig.spacing * 3) * zoom}px ${(gridConfig.spacing * 3) * zoom}px
          `,
          backgroundPosition: `
            ${position.x}px ${position.y}px,
            ${position.x}px ${position.y}px
          `,
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
    </div>
  );
};

export default CanvasBackground;