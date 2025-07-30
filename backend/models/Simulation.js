const Area = require('./Area');
const Position = require('./Position');

class Simulation {
  constructor(width, height, tickDuration = 100) {
    this.area = new Area(width, height);
    this.tickDuration = tickDuration;
    this.running = false;
    this.tickCount = 0;
    this.intervalId = null;
    this.updateCallbacks = [];
  }

  addColony(x, y) {
    return this.area.addColony(x, y);
  }

  addAntEater(x, y) {
    return this.area.addAntEater(x, y);
  }

  addFoodPile(x, y, amount) {
    this.area.addFoodPile(x, y, amount);
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.intervalId = setInterval(() => {
        this.tick();
      }, this.tickDuration);
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }

  isRunning() {
    return this.running;
  }

  tick() {
    this.tickCount++;
    
    // Update ant behavior
    this.updateAnts();
    
    // Update ant eater behavior
    this.updateAntEaters();
    
    // Update area (pheromones, etc.)
    this.area.update();
    
    // Notify callbacks
    this.updateCallbacks.forEach(callback => {
      callback(this.getState());
    });
  }

  updateAnts() {
    this.area.colonies.forEach(colony => {
      colony.ants.forEach(ant => {
        this.updateAnt(ant);
      });
    });
  }

  updateAnt(ant) {
    // Decrease weight every 50 ticks
    ant.decreaseWeight();
    
    if (ant.isDead()) {
      this.area.removeAnt(ant);
      return;
    }

    const currentCell = this.area.getCell(ant.position.x, ant.position.y);
    
    if (ant.isInNest()) {
      this.updateAntInNest(ant, currentCell);
    } else {
      this.updateAntOutsideNest(ant, currentCell);
    }
  }

  updateAntInNest(ant, currentCell) {
    // Drop carried food
    if (ant.carriedFood) {
      ant.colony.nest.addFood(ant.dropFood());
    }
    
    // Try to eat from nest
    if (ant.colony.nest.foodStock >= 1 && ant.weight < 5) {
      ant.colony.nest.feedAnt(ant);
    }
    
    // Leave nest if weight >= 3
    if (ant.canLeaveNest()) {
      const neighbors = this.area.getNeighboringCells(ant.position.x, ant.position.y);
      let targetCell = null;
      
      // Prefer cells with pheromone
      const pheromoneNeighbors = neighbors.filter(cell => cell.pheromone && cell.pheromone.level > 0);
      if (pheromoneNeighbors.length > 0) {
        targetCell = pheromoneNeighbors[Math.floor(Math.random() * pheromoneNeighbors.length)];
      } else if (neighbors.length > 0) {
        targetCell = neighbors[Math.floor(Math.random() * neighbors.length)];
      }
      
      if (targetCell) {
        this.area.moveAnt(ant, new Position(targetCell.x, targetCell.y));
      }
    }
  }

  updateAntOutsideNest(ant, currentCell) {
    if (!ant.carriedFood) {
      // Look for food
      if (currentCell.foodPile && currentCell.foodPile.amount > 0) {
        ant.pickupFood(currentCell.foodPile);
      } else {
        this.moveAntLookingForFood(ant, currentCell);
      }
    } else {
      // Look for nest and drop pheromone
      if (currentCell.pheromone) {
        currentCell.addPheromone(100);
      } else {
        currentCell.addPheromone(100);
      }
      
      this.moveAntTowardsNest(ant, currentCell);
    }
  }

  moveAntLookingForFood(ant, currentCell) {
    const neighbors = this.area.getNeighboringCells(ant.position.x, ant.position.y);
    let targetCell = null;
    
    if (currentCell.pheromone && currentCell.pheromone.level > 0) {
      // Follow decreasing pheromone
      const validNeighbors = neighbors.filter(cell => 
        cell.pheromone && cell.pheromone.level > 0 && cell.pheromone.level < currentCell.pheromone.level
      );
      if (validNeighbors.length > 0) {
        targetCell = validNeighbors.reduce((min, cell) => 
          cell.pheromone.level < min.pheromone.level ? cell : min
        );
      }
    } else {
      // Look for pheromone neighbors
      const pheromoneNeighbors = neighbors.filter(cell => cell.pheromone && cell.pheromone.level > 0);
      if (pheromoneNeighbors.length > 0) {
        targetCell = pheromoneNeighbors[Math.floor(Math.random() * pheromoneNeighbors.length)];
      }
    }
    
    // Random movement if no pheromone guidance
    if (!targetCell && neighbors.length > 0) {
      // Prefer current direction
      const preferredNeighbors = neighbors.filter(cell => {
        const dx = cell.x - ant.position.x;
        const dy = cell.y - ant.position.y;
        return dx === ant.direction.x && dy === ant.direction.y;
      });
      
      if (preferredNeighbors.length > 0) {
        targetCell = preferredNeighbors[0];
      } else {
        targetCell = neighbors[Math.floor(Math.random() * neighbors.length)];
        ant.direction = {
          x: targetCell.x - ant.position.x,
          y: targetCell.y - ant.position.y
        };
      }
    }
    
    if (targetCell) {
      this.area.moveAnt(ant, new Position(targetCell.x, targetCell.y));
    }
  }

  moveAntTowardsNest(ant, currentCell) {
    const neighbors = this.area.getNeighboringCells(ant.position.x, ant.position.y);
    let targetCell = null;
    
    // Follow increasing pheromone towards nest
    const pheromoneNeighbors = neighbors.filter(cell => 
      cell.pheromone && cell.pheromone.level > (currentCell.pheromone ? currentCell.pheromone.level : 0)
    );
    
    if (pheromoneNeighbors.length > 0) {
      targetCell = pheromoneNeighbors.reduce((max, cell) => 
        cell.pheromone.level > max.pheromone.level ? cell : max
      );
    } else {
      // Move towards nest directly
      const nestPosition = ant.colony.nest.position;
      let minDistance = Infinity;
      
      neighbors.forEach(cell => {
        const distance = new Position(cell.x, cell.y).distance(nestPosition);
        if (distance < minDistance) {
          minDistance = distance;
          targetCell = cell;
        }
      });
    }
    
    if (targetCell) {
      this.area.moveAnt(ant, new Position(targetCell.x, targetCell.y));
    }
  }

  updateAntEaters() {
    this.area.antEaters.forEach(antEater => {
      antEater.update(this.area);
    });
  }

  onUpdate(callback) {
    this.updateCallbacks.push(callback);
  }

  getState() {
    return {
      tickCount: this.tickCount,
      running: this.running,
      tickDuration: this.tickDuration,
      area: this.area.getState()
    };
  }
}

module.exports = Simulation;
