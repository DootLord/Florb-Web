import React, { useState, useEffect, useRef } from 'react';
import Florb, { FlorbData } from './Florb';
import './FlorbInventory.css';

interface FlorbInventoryProps {
  className?: string;
}

interface FlorbInventoryState {
  mode: 'grid' | 'detail';
  selectedFlorb: FlorbData | null;
  florbs: FlorbData[];
  loading: boolean;
  error: string | null;
}

const FlorbInventory: React.FC<FlorbInventoryProps> = ({ className = '' }) => {
  const [state, setState] = useState<FlorbInventoryState>({
    mode: 'grid',
    selectedFlorb: null,
    florbs: [],
    loading: true,
    error: null,
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Fetch Florbs from API
  useEffect(() => {
    const fetchFlorbs = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch('/api/florbs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched Florbs:', data);
        
        // Extract florbs from the nested data structure
        let florbsArray = [];
        if (Array.isArray(data)) {
          florbsArray = data;
        } else if (data.data && Array.isArray(data.data.florbs)) {
          florbsArray = data.data.florbs;
        } else if (Array.isArray(data.florbs)) {
          florbsArray = data.florbs;
        }
        
        // Transform the florb data to match our component expectations
        const transformedFlorbs = florbsArray.map((florb: any) => {
          // Convert API path format to public path format
          let transformedPath = florb.baseImagePath;
          
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
          
          return {
            ...florb,
            baseImagePath: transformedPath,
          };
        });
        
        console.log('Extracted florbs array:', transformedFlorbs);
        
        setState(prev => ({
          ...prev,
          florbs: transformedFlorbs,
          loading: false,
        }));
      } catch (error) {
        console.error('Error fetching Florbs:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch Florbs',
          loading: false,
        }));
      }
    };

    fetchFlorbs();
  }, []);

  // Handle Florb selection with animation
  async function handleFlorbSelect(florb: FlorbData, index: number) {
    if (animatingOut) return;

    console.log('Selected Florb:', florb.name);
    setAnimatingOut(true);

    // Add animation classes to all grid items except selected
    const gridItems = gridRef.current?.querySelectorAll('.florb-grid-item');
    if (gridItems) {
      gridItems.forEach((item, i) => {
        if (i !== index) {
          item.classList.add('animate-out');
        } else {
          item.classList.add('animate-selected');
        }
      });
    }

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 600));

    setState(prev => ({
      ...prev,
      mode: 'detail',
      selectedFlorb: florb,
    }));

    setAnimatingOut(false);
  };

  // Handle back to grid
  function handleBackToGrid() {
    setState(prev => ({
      ...prev,
      mode: 'grid',
      selectedFlorb: null,
    }));
  };

  // Loading state
  if (state.loading) {
    return (
      <div className={`florb-inventory ${className}`}>
        <div className="inventory-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Florb Collection...</h2>
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className={`florb-inventory ${className}`}>
        <div className="inventory-error">
          <h2>Failed to Load Collection</h2>
          <p>{state.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Detail view
  if (state.mode === 'detail' && state.selectedFlorb) {
    return (
      <div className={`florb-inventory detail-mode ${className}`}>
        <button 
          onClick={handleBackToGrid}
          className="back-to-grid-button"
        >
          ← Back to Collection
        </button>
        
        <div className="florb-detail-view">
          <div className="florb-detail-display">
            <Florb 
              florbData={state.selectedFlorb}
              size={300}
              enableTilt={true}
            />
          </div>
          
          <div className="florb-detail-info">
            <h1 className="florb-detail-name">{state.selectedFlorb.name}</h1>
            
            <div className="florb-detail-rarity">
              <span className={`rarity-badge rarity-${state.selectedFlorb.rarity.toLowerCase()}`}>
                {state.selectedFlorb.rarity}
              </span>
            </div>
            
            <div className="florb-detail-description">
              <p>{state.selectedFlorb.description}</p>
            </div>
            
            <div className="florb-detail-effects">
              <h3>Special Effects:</h3>
              <div className="effects-grid">
                {state.selectedFlorb.specialEffects.map((effect, index) => (
                  <span key={index} className={`effect-badge effect-${effect.toLowerCase()}`}>
                    {effect}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="florb-detail-stats">
              <div className="stat-item">
                <span className="stat-label">ID:</span>
                <span className="stat-value">{state.selectedFlorb.florbId}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Gradient:</span>
                <span className="stat-value">{state.selectedFlorb.gradientConfig.direction}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Intensity:</span>
                <span className="stat-value">{Math.round(state.selectedFlorb.gradientConfig.intensity * 100)}%</span>
              </div>
            </div>
            
            {state.selectedFlorb.tags && state.selectedFlorb.tags.length > 0 && (
              <div className="florb-detail-tags">
                <h4>Tags:</h4>
                <div className="tags-list">
                  {state.selectedFlorb.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`florb-inventory grid-mode ${className}`}>
      <div className="inventory-header">
        <h1 className="inventory-title">Florb Collection</h1>
        <div className="inventory-stats">
          <span className="collection-count">{state.florbs.length} Florbs</span>
        </div>
      </div>
      
      <div 
        ref={gridRef}
        className="florb-grid"
      >
        {state.florbs.map((florb, index) => (
          <div
            key={florb.florbId}
            className="florb-grid-item"
            onClick={() => handleFlorbSelect(florb, index)}
            style={{
              '--animation-delay': `${index * 0.05}s`
            } as React.CSSProperties & { '--animation-delay': string }}
          >
            <div className="florb-grid-slot">
              <Florb 
                florbData={florb}
                size={120}
                enableTilt={false}
              />
              <div className="florb-grid-info">
                <span className="florb-grid-name">{florb.name}</span>
                <span className={`florb-grid-rarity rarity-${florb.rarity.toLowerCase()}`}>
                  {florb.rarity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlorbInventory;
