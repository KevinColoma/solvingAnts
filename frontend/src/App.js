import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SimulationGrid from './components/SimulationGrid';
import ControlsPanel from './components/ControlsPanel';
import './App.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://solvingants.onrender.com' 
  : 'http://localhost:3001';

function App() {
  const [simulationState, setSimulationState] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('simulationUpdate', (state) => {
      setSimulationState(state);
    });

    newSocket.on('simulationReset', () => {
      setSimulationState(null);
      console.log('Simulation reset by server');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const startSimulation = async (config) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const result = await response.json();
      setSimulationState(result.state);
    } catch (error) {
      console.error('Error starting simulation:', error);
    }
  };

  const stopSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/stop`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSimulationState(null);
        console.log('Simulation stopped successfully');
      } else {
        console.error('Failed to stop simulation');
      }
    } catch (error) {
      console.error('Error stopping simulation:', error);
    }
  };

  const resetSimulation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/simulation/reset`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSimulationState(null);
        console.log('Simulation reset successfully');
      } else {
        console.error('Failed to reset simulation');
      }
    } catch (error) {
      console.error('Error resetting simulation:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🐜 Ants and Ant Eaters Simulation</h1>
        <div className="connection-status">
          Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div>
          
          <span className="author-name">Kevin Coloma</span>  
        </div>
        
      </header>
      
      <div className="main-content">
        <ControlsPanel
          onStart={startSimulation}
          onStop={stopSimulation}
          onReset={resetSimulation}
          simulationState={simulationState}
        />
        
        <div className="simulation-area">
          {simulationState ? (
            <SimulationGrid simulationState={simulationState} />
          ) : (
            <div className="no-simulation">
              <h3>No simulation running</h3>
              <p>Configure and start a simulation using the controls panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
