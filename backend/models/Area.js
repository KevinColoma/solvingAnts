const GroundCell = require('./GroundCell');
const Colony = require('./Colony');
const AntEater = require('./AntEater');
const Position = require('./Position');

class Area {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.colonies = [];
    this.antEaters = [];
    
    // Initialize grid
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        this.cells[y][x] = new GroundCell(x, y);
      }
    }
  }

  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.cells[y][x];
    }
    return null;
  }

  addColony(x, y) {
    const position = new Position(x, y);
    const colony = new Colony(position);
    
    // Give initial food to the nest so ants can grow and leave
    colony.nest.foodStock = 10; // Initial food stock
    
    this.colonies.push(colony);
    
    // Add initial ant to the cell
    const cell = this.getCell(x, y);
    if (cell && colony.ants.length > 0) {
      cell.addAnt(colony.ants[0]);
    }
    
    return colony;
  }

  addAntEater(x, y) {
    const position = new Position(x, y);
    const antEater = new AntEater(position);
    this.antEaters.push(antEater);
    
    const cell = this.getCell(x, y);
    if (cell) {
      cell.addAntEater(antEater);
    }
    
    return antEater;
  }

  addFoodPile(x, y, amount) {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.addFoodPile(amount);
    }
  }

  removeAnt(ant) {
    // Remove from colony
    if (ant.colony) {
      ant.colony.removeAnt(ant);
    }
    
    // Remove from cell
    const cell = this.getCell(ant.position.x, ant.position.y);
    if (cell) {
      cell.removeAnt(ant);
    }
  }

  moveAnt(ant, newPosition) {
    const oldCell = this.getCell(ant.position.x, ant.position.y);
    const newCell = this.getCell(newPosition.x, newPosition.y);
    
    if (oldCell && newCell) {
      oldCell.removeAnt(ant);
      newCell.addAnt(ant);
      ant.move(newPosition);
    }
  }

  moveAntEater(antEater, newPosition) {
    const oldCell = this.getCell(antEater.position.x, antEater.position.y);
    const newCell = this.getCell(newPosition.x, newPosition.y);
    
    if (oldCell && newCell) {
      oldCell.removeAntEater(antEater);
      newCell.addAntEater(antEater);
      antEater.position = newPosition.clone();
    }
  }

  getNeighboringCells(x, y) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 }, // North
      { x: 1, y: -1 }, // Northeast
      { x: 1, y: 0 },  // East
      { x: 1, y: 1 },  // Southeast
      { x: 0, y: 1 },  // South
      { x: -1, y: 1 }, // Southwest
      { x: -1, y: 0 }, // West
      { x: -1, y: -1 } // Northwest
    ];
    
    directions.forEach(dir => {
      const newX = x + dir.x;
      const newY = y + dir.y;
      const cell = this.getCell(newX, newY);
      if (cell) {
        neighbors.push(cell);
      }
    });
    
    return neighbors;
  }

  update() {
    // Update all cells
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x].update();
      }
    }
    
    // Update colonies and handle new ants
    this.colonies.forEach(colony => {
      const previousAntCount = colony.ants.length;
      colony.update();
      
      // If new ants were created, add them to the nest cell
      if (colony.ants.length > previousAntCount) {
        const nestCell = this.getCell(colony.nest.position.x, colony.nest.position.y);
        if (nestCell) {
          // Add the newly created ants to the cell
          const newAnts = colony.ants.slice(previousAntCount);
          newAnts.forEach(ant => {
            nestCell.addAnt(ant);
          });
        }
      }
    });
  }

  getState() {
    return {
      width: this.width,
      height: this.height,
      cells: this.cells.map(row => row.map(cell => cell.getState())),
      colonies: this.colonies.map(colony => colony.getState()),
      antEaters: this.antEaters.map(antEater => antEater.getState())
    };
  }
}

module.exports = Area;
