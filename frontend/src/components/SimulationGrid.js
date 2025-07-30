import React from 'react';

const SimulationGrid = ({ simulationState }) => {
  if (!simulationState || !simulationState.area) {
    return <div>Loading simulation...</div>;
  }

  const { area } = simulationState;
  const { width, height, cells, colonies, antEaters } = area;

  // Create a lookup for quick access to entities
  const antPositions = new Map();
  const antEaterPositions = new Map();
  const nestPositions = new Set();

  // Map ants by position
  colonies.forEach(colony => {
    colony.ants.forEach(ant => {
      const key = `${ant.position.x},${ant.position.y}`;
      if (!antPositions.has(key)) {
        antPositions.set(key, []);
      }
      antPositions.get(key).push(ant);
    });
    
    // Mark nest positions
    nestPositions.add(`${colony.nest.position.x},${colony.nest.position.y}`);
  });

  // Map ant eaters by position
  antEaters.forEach(antEater => {
    const key = `${antEater.position.x},${antEater.position.y}`;
    if (!antEaterPositions.has(key)) {
      antEaterPositions.set(key, []);
    }
    antEaterPositions.get(key).push(antEater);
  });

  const renderCell = (cell, x, y) => {
    const key = `${x},${y}`;
    const cellAnts = antPositions.get(key) || [];
    const cellAntEaters = antEaterPositions.get(key) || [];
    const isNest = nestPositions.has(key);
    
    let cellClass = 'cell';
    
    if (isNest) {
      cellClass += ' nest';
    } else if (cell.foodAmount > 0) {
      cellClass += ' food';
    } else if (cell.pheromone > 0) {
      cellClass += ' pheromone';
      if (cell.pheromone > 50) {
        cellClass += ' strong';
      }
    }

    return (
      <div key={`${x}-${y}`} className={cellClass} title={`(${x},${y}) Food: ${cell.foodAmount}mg, Pheromone: ${cell.pheromone}`}>
        {/* Render ants */}
        {cellAnts.map((ant, index) => (
          <div
            key={`ant-${ant.id}`}
            className="ant"
            style={{
              left: `${2 + (index % 4) * 4}px`,
              top: `${2 + Math.floor(index / 4) * 4}px`
            }}
            title={`Ant ${ant.id} - Weight: ${ant.weight}mg, Food: ${ant.carriedFood}mg`}
          />
        ))}
        
        {/* Render ant eaters */}
        {cellAntEaters.map((antEater, index) => (
          <div
            key={`anteater-${antEater.id}`}
            className={`ant-eater ${antEater.state.toLowerCase()}`}
            style={{
              left: `${6 + index * 2}px`,
              top: `${6 + index * 2}px`
            }}
            title={`Ant Eater ${antEater.id} - State: ${antEater.state}, Consumed: ${antEater.antsConsumed}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="grid-container">
      <div className="simulation-info">
        <h3>Simulation Grid ({width}x{height})</h3>
        <p>Tick: {simulationState.tickCount} | Status: {simulationState.running ? '🟢 Running' : '🔴 Stopped'}</p>
      </div>
      
      <div className="grid">
        {Array.from({ length: height }, (_, y) => (
          <div key={y} className="grid-row">
            {Array.from({ length: width }, (_, x) => 
              renderCell(cells[y][x], x, y)
            )}
          </div>
        ))}
      </div>
      
      <div className="legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#8b4513' }}></div>
          <span>Nest</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#f39c12' }}></div>
          <span>Food Pile</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(46, 204, 113, 0.5)' }}></div>
          <span>Pheromone Trail</span>
        </div>
        <div className="legend-item">
          <div className="legend-color ant" style={{ backgroundColor: '#2c3e50', borderRadius: '50%', width: '8px', height: '8px' }}></div>
          <span>Ant</span>
        </div>
        <div className="legend-item">
          <div className="legend-color ant-eater" style={{ backgroundColor: '#e74c3c', borderRadius: '50%', width: '12px', height: '12px' }}></div>
          <span>Ant Eater</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationGrid;
