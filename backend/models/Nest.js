const Position = require('./Position');
const Ant = require('./Ant');

class Nest {
  constructor(position) {
    this.position = position.clone();
    this.foodStock = 0; // Food stored in the nest
  }

  addFood(food) {
    this.foodStock += food.amount;
  }

  feedAnt(ant) {
    if (this.foodStock >= 1) {
      this.foodStock -= 1;
      ant.weight = Math.min(5, ant.weight + 1);
      return true;
    }
    return false;
  }

  canCreateAnt() {
    return this.foodStock >= 5;
  }

  createAnt(colony) {
    if (this.canCreateAnt()) {
      this.foodStock -= 5;
      return new Ant(colony, this.position);
    }
    return null;
  }

  getState() {
    return {
      position: { x: this.position.x, y: this.position.y },
      foodStock: this.foodStock
    };
  }
}

module.exports = Nest;
