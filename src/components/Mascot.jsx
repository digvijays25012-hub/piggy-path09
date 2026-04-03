import React from 'react';

export default function Mascot() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <motion.img
        src="/assets/mascot.png"
        alt="Piggy Mascot"
        className="w-full h-full object-contain drop-shadow-xl"
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
}
