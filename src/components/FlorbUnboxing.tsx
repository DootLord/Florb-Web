import React, { useState, useRef, useEffect } from 'react';
import { animate, createTimeline, Timeline, utils, stagger } from 'animejs';
import Florb, { FlorbData } from './Florb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';
import './FlorbUnboxing.css';

interface UnboxingState {
  phase: 'idle' | 'opening' | 'complete';
  florb: FlorbData | null;
  error: string | null;
}

const FlorbUnboxing: React.FC = () => {
  // Helper function to get auth headers
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('userToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };
  const [unboxingState, setUnboxingState] = useState<UnboxingState>({
    phase: 'idle',
    florb: null,
    error: null,
  });

  // Refs for animation targets
  const mysteryBoxRef = useRef<HTMLDivElement>(null);
  const boxFacesRef = useRef<HTMLDivElement[]>([]);
  const explosionEffectsRef = useRef<HTMLDivElement>(null);

  // Animation timeline
  const timelineRef = useRef<Timeline | null>(null);

  function addToBoxFacesRef(el: HTMLDivElement | null) {
    if (el && !boxFacesRef.current.includes(el)) {
      boxFacesRef.current.push(el);
    }
  }

  // Idle floating animation
  function startIdleAnimation() {
    if (!mysteryBoxRef.current) return;

    animate(mysteryBoxRef.current, {
      rotateY: ['0deg', '360deg'],
      rotateX: [5, 10, 5],
      translateY: [0, -12, 0],
      scale: [1, 1.02, 1],
      duration: 4000,
      ease: 'inOut(2)',
      loop: true
    });
  }

  // Stop all animations
  function stopAllAnimations() {
    if (utils.remove && mysteryBoxRef.current) {
      utils.remove(mysteryBoxRef.current);
    }
    if (utils.remove && boxFacesRef.current.length > 0) {
      utils.remove(boxFacesRef.current);
    }
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
  }

  // Explosive unboxing animation sequence
  async function startExplosionAnimation() {
    console.log('Explosion animation started');
    console.log('Mystery box ref:', mysteryBoxRef.current);
    console.log('Box faces:', boxFacesRef.current);
    
    if (!mysteryBoxRef.current || boxFacesRef.current.length === 0) {
      console.error('Missing refs for explosion animation');
      return Promise.resolve();
    }

    stopAllAnimations();

    // Create a timeline for the complex sequence
    const tl = createTimeline({
      autoplay: false
    });

    // 1. Dramatic pause and focus the box
    tl.add(mysteryBoxRef.current, {
      rotateY: 0,
      rotateX: 0,
      translateY: -20,
      scale: 1.3,
      duration: 1000,
      ease: 'out(3)'
    });

    // 2. Build intense tension with violent shaking
    tl.add(mysteryBoxRef.current, {
      scale: [1.3, 1.4, 1.5],
      rotateX: [0, 8, -8, 5, -5, 0],
      rotateZ: [0, 3, -3, 2, -2, 0],
      translateY: [-20, -25, -30],
      filter: ['brightness(1)', 'brightness(1.8)', 'brightness(2.5)'],
      duration: 2000,
      ease: 'inOut(4)'
    }, '-=300');

    // 3. Box face explosions (staggered)
    const faceTargets = boxFacesRef.current;
    const explosionDirections = [
      // front face
      { rotateY: -45, translateX: -400, translateY: -200, translateZ: 800, rotateX: 180, rotateZ: 0 },
      // back face  
      { rotateY: 225, translateX: 400, translateY: -150, translateZ: 800, rotateX: -180, rotateZ: 0 },
      // left face
      { rotateY: -135, translateX: -600, translateY: -100, translateZ: 800, rotateZ: 90, rotateX: 0 },
      // right face
      { rotateY: 135, translateX: 600, translateY: -80, translateZ: 800, rotateZ: -90, rotateX: 0 },
      // top face
      { rotateX: 135, translateY: -500, translateZ: 800, rotateY: 180, rotateZ: 0, translateX: 0 },
      // bottom face
      { rotateX: -135, translateY: 300, translateZ: 800, rotateY: -180, rotateZ: 0, translateX: 0 }
    ];

    explosionDirections.forEach((direction, index) => {
      if (faceTargets[index]) {
        tl.add(faceTargets[index], {
          scale: [1, 1.1, 0.3],
          opacity: [1, 1, 0],
          rotateY: direction.rotateY,
          rotateX: direction.rotateX,
          rotateZ: direction.rotateZ,
          translateX: direction.translateX,
          translateY: direction.translateY,
          translateZ: direction.translateZ,
          duration: 1500,
          ease: 'out(3)'
        }, `-=${1400 - (index * 50)}`); // Stagger each face by 50ms
      }
    });

    // 4. Explosion effects
    if (explosionEffectsRef.current) {
      const shockwave = explosionEffectsRef.current.querySelector('.shockwave');
      const energyBeams = explosionEffectsRef.current.querySelectorAll('.energy-beam');
      const particles = explosionEffectsRef.current.querySelectorAll('.explosion-particle');

      // Shockwave
      if (shockwave) {
        tl.add(shockwave, {
          scale: [0, 25],
          opacity: [1, 0.6, 0],
          duration: 1500,
          ease: 'out(4)'
        }, '-=1000');
      }

      // Energy beams
      if (energyBeams.length > 0) {
        tl.add(energyBeams, {
          scaleY: [0, 1, 3],
          opacity: [0, 1, 0],
          rotate: '360deg',
          duration: 1200,
          delay: stagger(100),
          ease: 'out(3)'
        }, '-=1200');
      }

      // Particles
      if (particles.length > 0) {
        tl.add(particles, {
          scale: [0, 1, 0],
          translateX: () => utils.random(-300, 300),
          translateY: () => utils.random(-300, 300),
          rotate: () => utils.random(0, 360),
          opacity: [0, 1, 0],
          duration: 2000,
          delay: stagger(50),
          ease: 'out(3)'
        }, '-=1500');
      }
    }

    timelineRef.current = tl;
    tl.play();

    return tl.then(() => { });
  };

  // Celebration animation
  function startCelebrationAnimation() {
    // Gentle confetti animation
    animate('.confetti', {
      translateY: ['-50vh', '100vh'],
      rotate: () => utils.random(0, 360),
      scale: [0.8, 1, 0.6],
      opacity: [0.8, 1, 0],
      duration: 4000,
      delay: stagger(150),
      ease: 'in(2)',
      loop: 3 // Only loop a few times, not infinite
    });

    // Subtle spotlight pulse
    animate('.florb-spotlight', {
      scale: [1, 1.05, 1],
      opacity: [0.2, 0.4, 0.2],
      duration: 3000,
      ease: 'inOut(2)',
      loop: 5 // Limited loops
    });
  };

  async function generateFlorb() {
    console.log('Generate Florb clicked, starting sequence...');
    setUnboxingState({
      phase: 'opening',
      florb: null,
      error: null,
    });

    try {
      // Start explosion animation
      console.log('Starting explosion animation...');
      const explosionPromise = startExplosionAnimation();

      // Fetch the new Florb while opening animation plays
      const response = await fetch('/api/florbs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      // Extract the florb data from the response
      let newFlorb = responseData.data;
      
      // Transform the baseImagePath to match our component expectations
      if (newFlorb.baseImagePath) {
        let transformedPath = newFlorb.baseImagePath;
        
        // Handle different possible API path formats
        if (transformedPath.startsWith('src/assets/florb_base/')) {
          // Remove the src/assets/florb_base/ prefix and keep just the filename
          transformedPath = '/' + transformedPath.replace('src/assets/florb_base/', '');
        } else if (transformedPath.startsWith('assets/florb_base/')) {
          // Remove the assets/florb_base/ prefix
          transformedPath = '/' + transformedPath.replace('assets/florb_base/', '');
        } else if (transformedPath.startsWith('florb_base/')) {
          // Remove the florb_base/ prefix
          transformedPath = '/' + transformedPath.replace('florb_base/', '');
        } else if (!transformedPath.startsWith('/') && !transformedPath.startsWith('http')) {
          // If it's just a filename, add the leading slash
          transformedPath = '/' + transformedPath;
        }
        
        newFlorb = {
          ...newFlorb,
          baseImagePath: transformedPath,
        };
      }
      
      console.log('Generated Florb (transformed):', newFlorb);

      // Validate that we have the required florb data
      if (!newFlorb || !newFlorb.name || !newFlorb.florbId) {
        throw new Error('Florb generation failed - the magical energies couldn\'t create a proper Florb. Please try again!');
      }

      // Ensure rarity has a default value if not provided
      if (!newFlorb.rarity) {
        newFlorb.rarity = 'Common';
      }

      // Ensure specialEffects is an array
      if (!newFlorb.specialEffects) {
        newFlorb.specialEffects = [];
      }

      // Wait for explosion to complete, then reveal
      await explosionPromise;

      // Skip revealing phase and go directly to complete
      setUnboxingState({
        phase: 'complete',
        florb: newFlorb,
        error: null,
      });

      // Start celebration immediately
      startCelebrationAnimation();

    } catch (error) {
      console.error('Error generating Florb:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Failed to generate Florb';
      if (error instanceof Error) {
        if (error.message.includes('Florb generation failed')) {
          errorMessage = error.message; // Use our custom message
        } else if (error.message.includes('HTTP error')) {
          errorMessage = 'Connection issue with the Florb Universe. Please check your connection and try again!';
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Unable to connect to the Florb Universe. Please check your internet connection!';
        } else {
          errorMessage = 'Something magical went wrong during unboxing. Please try again!';
        }
      }
      
      setUnboxingState({
        phase: 'idle',
        florb: null,
        error: errorMessage,
      });
    }
  };

  function resetUnboxing() {
    stopAllAnimations();
    boxFacesRef.current = []; // Clear refs
    setUnboxingState({
      phase: 'idle',
      florb: null,
      error: null,
    });
  };

  // Start idle animation when component mounts or returns to idle
  useEffect(() => {
    if (unboxingState.phase === 'idle') {
      // Add a longer delay to ensure refs are set
      setTimeout(() => {
        console.log('Starting idle animation, mysteryBoxRef:', mysteryBoxRef.current);
        console.log('Box faces count:', boxFacesRef.current.length);
        startIdleAnimation();
      }, 300);
    }
  }, [unboxingState.phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAnimations();
    };
  }, []);

  return (
    <div className="florb-unboxing">
      <div className="unboxing-container">

        {/* Idle State - Show Button */}
        {unboxingState.phase === 'idle' && (
          <div className="unboxing-idle">
            <div className="mystery-box" ref={mysteryBoxRef}>
              <div className="box-face box-front" ref={addToBoxFacesRef}>
                <div className="box-question">?</div>
              </div>
              <div className="box-face box-back" ref={addToBoxFacesRef}></div>
              <div className="box-face box-right" ref={addToBoxFacesRef}></div>
              <div className="box-face box-left" ref={addToBoxFacesRef}></div>
              <div className="box-face box-top" ref={addToBoxFacesRef}></div>
              <div className="box-face box-bottom" ref={addToBoxFacesRef}></div>
            </div>

            <button
              className="unbox-button"
              onClick={generateFlorb}
              disabled={unboxingState.phase !== 'idle'}
            >
              <span className="button-text">Generate New Florb</span>
            </button>
          </div>
        )}

        {/* Opening Animation */}
        {unboxingState.phase === 'opening' && (
          <div className="unboxing-opening">
            <div className="mystery-box" ref={mysteryBoxRef}>
              <div className="box-face box-front" ref={addToBoxFacesRef}>
                <div className="box-question">?</div>
              </div>
              <div className="box-face box-back" ref={addToBoxFacesRef}></div>
              <div className="box-face box-right" ref={addToBoxFacesRef}></div>
              <div className="box-face box-left" ref={addToBoxFacesRef}></div>
              <div className="box-face box-top" ref={addToBoxFacesRef}></div>
              <div className="box-face box-bottom" ref={addToBoxFacesRef}></div>
            </div>

            <div className="explosion-effects" ref={explosionEffectsRef}>
              <div className="shockwave"></div>
              <div className="energy-burst">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`energy-beam beam-${i}`}></div>
                ))}
              </div>
              <div className="explosion-particles">
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className={`explosion-particle particle-${i}`}></div>
                ))}
              </div>
            </div>

            <div className="opening-text">
              <h2>Unboxing in progress...</h2>
              <div className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </div>
            </div>
          </div>
        )}

        {/* Complete State - Show Florb */}
        {unboxingState.phase === 'complete' && unboxingState.florb && (
          <div className="unboxing-complete">
            <div className="florb-presentation">
              <div className="florb-wrapper">
                <Florb
                  florbData={unboxingState.florb}
                  size={280}
                  enableTilt={true}
                />
              </div>
            </div>

            <div className="florb-details">
              <h2 className="florb-name">{unboxingState.florb.name}</h2>
              <div className={`florb-rarity rarity-${(unboxingState.florb.rarity || 'Common').toLowerCase()}`}>
                {unboxingState.florb.rarity || 'Common'}
              </div>
              <p className="florb-description">{unboxingState.florb.description}</p>

              {unboxingState.florb.specialEffects && unboxingState.florb.specialEffects.length > 0 && (
                <div className="special-effects">
                  <h4>Special Effects:</h4>
                  <div className="effects-list">
                    {unboxingState.florb.specialEffects.map((effect, index) => (
                      <span key={index} className={`effect-tag effect-${effect.toLowerCase()}`}>
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              className="unbox-again-button"
              onClick={resetUnboxing}
            >
              Unbox Another Florb
            </button>
          </div>
        )}

        {/* Error State */}
        {unboxingState.error && (
          <div className="unboxing-error">
            <div className="error-message">
              <h3><FontAwesomeIcon icon={faGift} /> Unboxing Failed</h3>
              <p>{unboxingState.error}</p>
              <button onClick={resetUnboxing} className="retry-button">
                Try Unboxing Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlorbUnboxing;