import { useState } from 'react';
import Florb, { FlorbData } from './components/Florb';
import FlorbUnboxing from './components/FlorbUnboxing';

// Sample Florb data based on your DB example
const sampleFlorbData: FlorbData = {
  florbId: "florb_dc0a11c3feec326c",
  name: "Grey Florb",
  baseImagePath: "/sharp.png",
  rarity: "Grey",
  specialEffects: ["None"],
  gradientConfig: {
    colors: ["#404040", "#606060", "#505050", "#454545"],
    direction: "radial",
    intensity: 0.3
  },
  description: "A grey rarity florb with none effects.",
  tags: ["grey", "none"]
};

// Sample Florb with special effects
const holoFlorbData: FlorbData = {
  florbId: "florb_holo_example",
  name: "Legendary Holo Florb",
  baseImagePath: "/sharp.png",
  rarity: "Legendary",
  specialEffects: ["Holo", "Glow"],
  gradientConfig: {
    colors: ["#f59e0b", "#fbbf24", "#f97316", "#ea580c"],
    direction: "radial",
    intensity: 0.5
  },
  description: "A legendary florb with holographic effects.",
  tags: ["legendary", "holo", "glow"]
};

const foilFlorbData: FlorbData = {
  florbId: "florb_foil_example",
  name: "Epic Foil Florb",
  baseImagePath: "/sharp.png",
  rarity: "Epic",
  specialEffects: ["Foil", "Shimmer"],
  gradientConfig: {
    colors: ["#a855f7", "#c084fc", "#8b5cf6", "#7c3aed"],
    direction: "linear",
    intensity: 0.4
  },
  description: "An epic florb with foil and shimmer effects.",
  tags: ["epic", "foil", "shimmer"]
};

function FlorbDemo() {
  const [showUnboxing, setShowUnboxing] = useState(false);

  const handleFlorbClick = (florbData: FlorbData) => {
    console.log('Florb clicked:', florbData.name);
  };

  if (showUnboxing) {
    return (
      <div>
        <button 
          onClick={() => setShowUnboxing(false)}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            zIndex: 1000,
          }}
        >
          ← Back to Demo
        </button>
        <FlorbUnboxing />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>
        Florb Component Demo
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Grey Florb (Basic)</h3>
          <Florb
            florbData={sampleFlorbData}
            size={200}
            onClick={() => handleFlorbClick(sampleFlorbData)}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Legendary Holo Florb</h3>
          <Florb
            florbData={holoFlorbData}
            size={200}
            onClick={() => handleFlorbClick(holoFlorbData)}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem' }}>Epic Foil Florb</h3>
          <Florb
            florbData={foilFlorbData}
            size={200}
            onClick={() => handleFlorbClick(foilFlorbData)}
          />
        </div>
      </div>
      
      <div style={{ 
        color: 'white', 
        textAlign: 'center',
        maxWidth: '800px',
        lineHeight: 1.6
      }}>
        <h2>Features:</h2>
        <ul style={{ textAlign: 'left' }}>
          <li>Mouse tilt effect that follows cursor position</li>
          <li>Grayscale base images with customizable gradients</li>
          <li>Multiple special effects: Holo, Foil, Shimmer, Glow</li>
          <li>Rarity-based styling and colors</li>
          <li>Responsive design and accessibility features</li>
          <li>Smooth animations and transitions</li>
        </ul>
        
        <button
          onClick={() => setShowUnboxing(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            border: 'none',
            borderRadius: '50px',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            marginTop: '2rem',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
          }}
        >
          🎁 Try Florb Unboxing Experience
        </button>
      </div>
    </div>
  );
}

export default FlorbDemo;
