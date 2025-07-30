const Position = require('./Position');
const Nest = require('./Nest');
const Ant = require('./Ant');

class Colony {
  constructor(position) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.nest = new Nest(position);
    this.ants = [];
    
    // Start with one ant
    const initialAnt = new Ant(this, position);
    this.ants.push(initialAnt);
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

  update() {
    // Try to create new ants
    if (this.nest.canCreateAnt()) {
      const newAnt = this.nest.createAnt(this);
      if (newAnt) {
        this.addAnt(newAnt);
      }
    }

    // Remove dead ants
    this.ants = this.ants.filter(ant => !ant.isDead());
  }

  getState() {
    return {
      id: this.id,
      nest: this.nest.getState(),
      antCount: this.ants.length,
      ants: this.ants.map(ant => ant.getState())
    };
  }
}

module.exports = Colony;
