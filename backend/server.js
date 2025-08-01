const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Simulation = require('./models/Simulation');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Global simulation instance
let simulation = null;

// API Routes
app.get('/api/simulation', (req, res) => {
  if (!simulation) {
    return res.status(404).json({ message: 'No simulation running' });
  }
  res.json(simulation.getState());
});

app.post('/api/simulation/start', (req, res) => {
  const { width, height, tickDuration, colonies, antEaters, foodPiles } = req.body;
  
  simulation = new Simulation(width || 20, height || 20, tickDuration || 100);
  
  // Add colonies
  if (colonies) {
    colonies.forEach(colony => {
      simulation.addColony(colony.x, colony.y);
    });
  }
  
  // Add ant eaters
  if (antEaters) {
    antEaters.forEach(antEater => {
      simulation.addAntEater(antEater.x, antEater.y);
    });
  }
  
  // Add food piles
  if (foodPiles) {
    foodPiles.forEach(foodPile => {
      simulation.addFoodPile(foodPile.x, foodPile.y, foodPile.amount);
    });
  }
  
  simulation.start();
  
  res.json({ message: 'Simulation started', state: simulation.getState() });
});

app.post('/api/simulation/stop', (req, res) => {
  if (simulation) {
    simulation.stop();
  }
  res.json({ message: 'Simulation stopped' });
});

app.post('/api/simulation/reset', (req, res) => {
  if (simulation) {
    simulation.stop();
    simulation = null;
  }
  res.json({ message: 'Simulation reset' });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  // Send simulation updates
  if (simulation) {
    simulation.onUpdate((state) => {
      socket.emit('simulationUpdate', state);
    });
  }
});

// Broadcast simulation updates to all connected clients
setInterval(() => {
  if (simulation && simulation.isRunning()) {
    io.emit('simulationUpdate', simulation.getState());
  } else if (!simulation) {
    // Notify clients that simulation is reset/stopped
    io.emit('simulationReset');
  }
}, 100);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
