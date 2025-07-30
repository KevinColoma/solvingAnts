const Pheromone = require('./Pheromone');
const FoodPile = require('./FoodPile');

class GroundCell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pheromone = null;
    this.foodPile = null;
    this.ants = [];
    this.antEaters = [];
  }

  addPheromone(level = 100) {
    if (this.pheromone) {
      this.pheromone.add(level);
    } else {
      this.pheromone = new Pheromone(level);
    }
  }

  addFoodPile(amount) {
    if (this.foodPile) {
      this.foodPile.amount += amount;
    } else {
      this.foodPile = new FoodPile(amount);
    }
  }

  addAnt(ant) {
    if (!this.ants.includes(ant)) {
      this.ants.push(ant);
    }
  }

  removeAnt(ant) {
    const index = this.ants.indexOf(ant);
    if (index > -1) {
      this.ants.splice(index, 1);
    }
  }

  addAntEater(antEater) {
    if (!this.antEaters.includes(antEater)) {
      this.antEaters.push(antEater);
    }
  }

  removeAntEater(antEater) {
    const index = this.antEaters.indexOf(antEater);
    if (index > -1) {
      this.antEaters.splice(index, 1);
    }
  }

  update() {
    // Update pheromone
    if (this.pheromone) {
      this.pheromone.decrease();
      if (this.pheromone.isEmpty()) {
        this.pheromone = null;
      }
    }

    // Clean up empty food pile
    if (this.foodPile && this.foodPile.isEmpty()) {
      this.foodPile = null;
    }
  }

  getState() {
    return {
      x: this.x,
      y: this.y,
      pheromone: this.pheromone ? this.pheromone.level : 0,
      foodAmount: this.foodPile ? this.foodPile.amount : 0,
      antCount: this.ants.length,
      antEaterCount: this.antEaters.length
    };
  }
}

module.exports = GroundCell;
