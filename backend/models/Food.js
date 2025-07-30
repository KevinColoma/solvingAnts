class Food {
  constructor(amount) {
    this.amount = amount; // in milligrams
  }

  consume(amount) {
    const consumed = Math.min(amount, this.amount);
    this.amount -= consumed;
    return consumed;
  }

  isEmpty() {
    return this.amount <= 0;
  }
}

module.exports = Food;
