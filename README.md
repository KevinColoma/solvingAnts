# Ants and Ant Eaters Simulation 🐜

A real-time simulation of ants and ant eaters behavior, built with Node.js/Express backend and React frontend.

## Features

- **Real-time simulation** with WebSocket connections
- **Interactive visualization** of the ant colony behavior
- **Configurable parameters** (grid size, tick duration, entities)
- **Multiple colonies** support
- **Ant eater predators** with realistic behavior
- **Pheromone trail system** for ant navigation
- **Food gathering and nest management**

## Live Demo

🚀 **Frontend**: [https://your-frontend-app.onrender.com](https://your-frontend-app.onrender.com)
🔧 **Backend API**: [https://your-backend-app.onrender.com](https://your-backend-app.onrender.com)

## Architecture

### Backend (`/backend`)
- **Node.js** with Express server
- **Socket.IO** for real-time updates
- **RESTful API** for simulation control
- **Object-oriented design** with proper entity modeling

### Frontend (`/frontend`)
- **React** with hooks
- **Socket.IO client** for real-time updates
- **Responsive grid visualization**
- **Interactive controls panel**

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ants-simulation.git
   cd ants-simulation
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```
   Backend will run on http://localhost:3001

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```
   Frontend will run on http://localhost:3000

## Simulation Rules

### Ant Behavior
- **Birth**: Created in nest with 1mg weight, needs 3mg to leave
- **Movement**: Random exploration or pheromone trail following
- **Food Gathering**: Pick up food when found, carry up to 5mg
- **Pheromone**: Drop trails when carrying food back to nest
- **Metabolism**: Lose 1mg weight every 50 ticks
- **Death**: Dies when weight reaches 0

### Ant Eater Behavior
- **Hungry**: Wander randomly, eat ants on contact
- **Eating**: Digest ant for 10 ticks
- **Sleeping**: Sleep for 600 ticks after eating 50 ants

### Colony Behavior
- **Nest Management**: Store food, create new ants (5mg cost)
- **Growth**: Automatic ant production when food available
- **Survival**: Colony dies if all ants die

### Environment
- **Pheromone Decay**: Trails fade over time (1 level per tick)
- **Food Piles**: Finite resources scattered across the area
- **Grid System**: Discrete cell-based movement

## API Endpoints

### Simulation Control
- `POST /api/simulation/start` - Start new simulation
- `POST /api/simulation/stop` - Stop current simulation
- `POST /api/simulation/reset` - Reset simulation
- `GET /api/simulation` - Get current simulation state

### WebSocket Events
- `simulationUpdate` - Real-time simulation state updates

## Deployment on Render

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the root directory to `frontend`
4. Build command: `npm run build`
5. Publish directory: `build`

### Environment Variables
Backend:
- `PORT` - Server port (automatically set by Render)

Frontend:
- Update `API_BASE_URL` in `App.js` to your backend URL

## Project Structure

```
ants-simulation/
├── backend/
│   ├── models/
│   │   ├── Ant.js          # Ant entity
│   │   ├── AntEater.js     # Ant eater entity
│   │   ├── Area.js         # Simulation area
│   │   ├── Colony.js       # Ant colony
│   │   ├── Food.js         # Food objects
│   │   ├── FoodPile.js     # Food pile entities
│   │   ├── GroundCell.js   # Grid cell
│   │   ├── Nest.js         # Ant nest
│   │   ├── Pheromone.js    # Pheromone trail
│   │   ├── Position.js     # Position utility
│   │   └── Simulation.js   # Main simulation engine
│   ├── package.json
│   └── server.js           # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ControlsPanel.js    # Simulation controls
│   │   │   └── SimulationGrid.js   # Grid visualization
│   │   ├── App.js          # Main React component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by classic ant colony optimization algorithms
- Built with modern web technologies for educational purposes
