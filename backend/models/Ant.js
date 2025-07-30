const Position = require('./Position');

class Ant {
  constructor(colony, position) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.colony = colony;
    this.position = position.clone();
    this.weight = 1; // Initial weight in mg
    this.carriedFood = null;
    this.direction = this.getRandomDirection();
    this.ticksSinceWeightDecrease = 0;
  }

  getRandomDirection() {
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
    return directions[Math.floor(Math.random() * directions.length)];
  }

  canLeaveNest() {
    return this.weight >= 3;
  }

  isInNest() {
    return this.position.equals(this.colony.nest.position);
  }

  eat(food) {
    const canEat = Math.min(food.amount, 5 - this.weight);
    this.weight += canEat;
    food.consume(canEat);
    return canEat;
  }

  pickupFood(foodPile) {
    if (this.carriedFood || !foodPile) return false;
    
    const maxCarry = 5;
    const food = foodPile.requestFood(maxCarry);
    if (food) {
      this.carriedFood = food;
      return true;
    }
    return false;
  }

  dropFood() {
    if (this.carriedFood) {
      const food = this.carriedFood;
      this.carriedFood = null;
      return food;
    }
    return null;
  }

  decreaseWeight() {
    this.ticksSinceWeightDecrease++;
    if (this.ticksSinceWeightDecrease >= 50) {
      this.weight = Math.max(0, this.weight - 1);
      this.ticksSinceWeightDecrease = 0;
    }
  }

  move(newPosition) {
    this.position = newPosition.clone();
  }

  isDead() {
    return this.weight <= 0;
  }

  getState() {
    return {
      id: this.id,
      position: { x: this.position.x, y: this.position.y },
      weight: this.weight,
      carriedFood: this.carriedFood ? this.carriedFood.amount : 0,
      isInNest: this.isInNest()
    };
  }
}

module.exports = Ant;
