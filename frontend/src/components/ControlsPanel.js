import React, { useState } from 'react';

const ControlsPanel = ({ onStart, onStop, onReset, simulationState }) => {
  const [config, setConfig] = useState({
    width: 20,
    height: 20,
    tickDuration: 100,
    colonies: [{ x: 5, y: 5 }],
    antEaters: [{ x: 15, y: 15 }],
    foodPiles: [
      { x: 10, y: 10, amount: 20 },
      { x: 3, y: 17, amount: 15 },
      { x: 16, y: 3, amount: 25 }
    ]
  });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addColony = () => {
    const x = Math.floor(Math.random() * config.width);
    const y = Math.floor(Math.random() * config.height);
    setConfig(prev => ({
      ...prev,
      colonies: [...prev.colonies, { x, y }]
    }));
  };

  const addAntEater = () => {
    const x = Math.floor(Math.random() * config.width);
    const y = Math.floor(Math.random() * config.height);
    setConfig(prev => ({
      ...prev,
      antEaters: [...prev.antEaters, { x, y }]
    }));
  };

  const addFoodPile = () => {
    const x = Math.floor(Math.random() * config.width);
    const y = Math.floor(Math.random() * config.height);
    const amount = Math.floor(Math.random() * 30) + 10;
    setConfig(prev => ({
      ...prev,
      foodPiles: [...prev.foodPiles, { x, y, amount }]
    }));
  };

  const handleStart = () => {
    onStart(config);
  };

  const getTotalStats = () => {
    if (!simulationState || !simulationState.area) {
      return {
        totalAnts: 0,
        totalAntEaters: 0,
        totalFood: 0,
        totalPheromone: 0,
        colonies: 0
      };
    }

    const { area } = simulationState;
    let totalAnts = 0;
    let totalFood = 0;
    let totalPheromone = 0;

    area.colonies.forEach(colony => {
      totalAnts += colony.antCount;
    });

    area.cells.forEach(row => {
      row.forEach(cell => {
        totalFood += cell.foodAmount;
        totalPheromone += cell.pheromone;
      });
    });

    return {
      totalAnts,
      totalAntEaters: area.antEaters.length,
      totalFood: Math.round(totalFood),
      totalPheromone: Math.round(totalPheromone),
      colonies: area.colonies.length
    };
  };

  const stats = getTotalStats();

  return (
    <div className="controls-panel">
      <div className="controls-section">
        <h3>Simulation Controls</h3>
        
        <div className="form-group">
          <label>Grid Width:</label>
          <input
            type="number"
            value={config.width}
            onChange={(e) => handleInputChange('width', parseInt(e.target.value))}
            min="10"
            max="50"
            disabled={simulationState?.running}
          />
        </div>
        
        <div className="form-group">
          <label>Grid Height:</label>
          <input
            type="number"
            value={config.height}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
            min="10"
            max="50"
            disabled={simulationState?.running}
          />
        </div>
        
        <div className="form-group">
          <label>Tick Duration (ms):</label>
          <input
            type="number"
            value={config.tickDuration}
            onChange={(e) => handleInputChange('tickDuration', parseInt(e.target.value))}
            min="50"
            max="1000"
            disabled={simulationState?.running}
          />
        </div>
        
        <div className="form-actions">
          {!simulationState?.running ? (
            <button className="btn btn-success" onClick={handleStart}>
              ▶️ Start Simulation
            </button>
          ) : (
            <button className="btn btn-danger" onClick={onStop}>
              ⏹️ Stop Simulation
            </button>
          )}
          
          <button className="btn btn-secondary" onClick={onReset}>
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="controls-section">
        <h3>Entities</h3>
        
        <div className="entity-controls">
          <div className="entity-group">
            <h4>Colonies ({config.colonies.length})</h4>
            <button 
              className="btn btn-primary" 
              onClick={addColony}
              disabled={simulationState?.running}
            >
              + Add Colony
            </button>
          </div>
          
          <div className="entity-group">
            <h4>Ant Eaters ({config.antEaters.length})</h4>
            <button 
              className="btn btn-primary" 
              onClick={addAntEater}
              disabled={simulationState?.running}
            >
              + Add Ant Eater
            </button>
          </div>
          
          <div className="entity-group">
            <h4>Food Piles ({config.foodPiles.length})</h4>
            <button 
              className="btn btn-primary" 
              onClick={addFoodPile}
              disabled={simulationState?.running}
            >
              + Add Food Pile
            </button>
          </div>
        </div>
      </div>

      {simulationState && (
        <div className="stats">
          <h4>Live Statistics</h4>
          <div className="stat-item">
            <span>Tick:</span>
            <span>{simulationState.tickCount}</span>
          </div>
          <div className="stat-item">
            <span>Colonies:</span>
            <span>{stats.colonies}</span>
          </div>
          <div className="stat-item">
            <span>Total Ants:</span>
            <span>{stats.totalAnts}</span>
          </div>
          <div className="stat-item">
            <span>Ant Eaters:</span>
            <span>{stats.totalAntEaters}</span>
          </div>
          <div className="stat-item">
            <span>Total Food:</span>
            <span>{stats.totalFood}mg</span>
          </div>
          <div className="stat-item">
            <span>Pheromone:</span>
            <span>{stats.totalPheromone}</span>
          </div>
        </div>
      )}

      {simulationState && simulationState.area.colonies.length > 0 && (
        <div className="stats">
          <h4>Colony Details</h4>
          {simulationState.area.colonies.map((colony, index) => (
            <div key={colony.id} className="colony-stats">
              <h5>Colony {index + 1}</h5>
              <div className="stat-item">
                <span>Ants:</span>
                <span>{colony.antCount}</span>
              </div>
              <div className="stat-item">
                <span>Nest Food:</span>
                <span>{colony.nest.foodStock}mg</span>
              </div>
              <div className="stat-item">
                <span>Position:</span>
                <span>({colony.nest.position.x}, {colony.nest.position.y})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlsPanel;
