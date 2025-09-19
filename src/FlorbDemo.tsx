import { useState } from 'react';
import Florb, { FlorbData } from './components/Florb';
import FlorbUnboxing from './components/FlorbUnboxing';
import FlorbInventory from './components/FlorbInventory';
import WorldMap from './components/WorldMap';
import './FlorbDemo.css';

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
  const [currentView, setCurrentView] = useState<'demo' | 'unboxing' | 'inventory' | 'worldmap'>('demo');

  function handleFlorbClick(florbData: FlorbData) {
    console.log('Florb clicked:', florbData.name);
  }

  if (currentView === 'inventory') {
    return (
      <div className="demo-container">
        <button 
          onClick={() => setCurrentView('demo')}
          className="back-button"
        >
          ← Back to Demo
        </button>
        <FlorbInventory />
      </div>
    );
  }

  if (currentView === 'worldmap') {
    return <WorldMap onBack={() => setCurrentView('demo')} />;
  }

  if (currentView === 'unboxing') {
    return (
      <div className="demo-container">
        <button 
          onClick={() => setCurrentView('demo')}
          className="back-button"
        >
          ← Back to Demo
        </button>
        <FlorbUnboxing />
      </div>
    );
  }

  return (
    <div className="demo-container">
      <h1 className="demo-title">
        Florb Component Demo
      </h1>
      
      <div className="florb-grid">
        <div className="florb-showcase">
          <h3 className="florb-showcase-title">Grey Florb (Basic)</h3>
          <Florb
            florbData={sampleFlorbData}
            size={200}
            onClick={() => handleFlorbClick(sampleFlorbData)}
          />
        </div>
        
        <div className="florb-showcase">
          <h3 className="florb-showcase-title">Legendary Holo Florb</h3>
          <Florb
            florbData={holoFlorbData}
            size={200}
            onClick={() => handleFlorbClick(holoFlorbData)}
          />
        </div>
        
        <div className="florb-showcase">
          <h3 className="florb-showcase-title">Epic Foil Florb</h3>
          <Florb
            florbData={foilFlorbData}
            size={200}
            onClick={() => handleFlorbClick(foilFlorbData)}
          />
        </div>
      </div>
      
      <div className="demo-info">
        <h2>Features:</h2>
        <ul className="features-list">
          <li>Mouse tilt effect that follows cursor position</li>
          <li>Grayscale base images with customizable gradients</li>
          <li>Multiple special effects: Holo, Foil, Shimmer, Glow</li>
          <li>Rarity-based styling and colors</li>
          <li>Responsive design and accessibility features</li>
          <li>Smooth animations and transitions</li>
        </ul>
        
        <div className="demo-actions">
          <button
            onClick={() => setCurrentView('unboxing')}
            className="unboxing-cta-button"
          >
            🎁 Try Florb Unboxing Experience
          </button>
          
          <button
            onClick={() => setCurrentView('inventory')}
            className="inventory-cta-button"
          >
            📦 View Florb Inventory
          </button>

          <button
            onClick={() => setCurrentView('worldmap')}
            className="worldmap-cta-button"
          >
            🌍 Explore World Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlorbDemo;
