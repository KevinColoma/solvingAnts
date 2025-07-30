class Pheromone {
  constructor(level = 100) {
    this.level = level;
  }

  decrease() {
    this.level = Math.max(0, this.level - 1);
  }

  add(amount) {
    this.level = Math.min(100, this.level + amount);
  }

  isEmpty() {
    return this.level <= 0;
  }
}

module.exports = Pheromone;
