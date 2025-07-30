const Food = require('./Food');

class FoodPile {
  constructor(amount) {
    this.amount = amount; // in milligrams
  }

  requestFood(requestedAmount) {
    const availableAmount = Math.min(requestedAmount, this.amount);
    this.amount -= availableAmount;
    
    if (availableAmount > 0) {
      return new Food(availableAmount);
    }
    return null;
  }

  isEmpty() {
    return this.amount <= 0;
  }
}

module.exports = FoodPile;
