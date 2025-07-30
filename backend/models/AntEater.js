const Position = require('./Position');

class AntEater {
  constructor(position) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.position = position.clone();
    this.state = 'HUNGRY'; // HUNGRY, EATING, SLEEPING
    this.ticksInCurrentState = 0;
    this.antsConsumed = 0;
    this.eatingAnt = null;
  }

  update(area) {
    this.ticksInCurrentState++;

    switch (this.state) {
      case 'HUNGRY':
        this.wander(area);
        this.tryToEatAnt(area);
        break;

      case 'EATING':
        if (this.ticksInCurrentState >= 10) {
          this.finishEating(area);
        }
        break;

      case 'SLEEPING':
        if (this.ticksInCurrentState >= 600) {
          this.wakeUp();
        }
        break;
    }
  }

  wander(area) {
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

    const direction = directions[Math.floor(Math.random() * directions.length)];
    const newX = this.position.x + direction.x;
    const newY = this.position.y + direction.y;

    // Check bounds
    if (newX >= 0 && newX < area.width && newY >= 0 && newY < area.height) {
      this.position.x = newX;
      this.position.y = newY;
    }
  }

  tryToEatAnt(area) {
    const cell = area.getCell(this.position.x, this.position.y);
    if (cell.ants.length > 0) {
      this.startEating(cell.ants[0]);
    }
  }

  startEating(ant) {
    this.state = 'EATING';
    this.ticksInCurrentState = 0;
    this.eatingAnt = ant;
  }

  finishEating(area) {
    if (this.eatingAnt) {
      // Remove ant from the simulation
      area.removeAnt(this.eatingAnt);
      this.eatingAnt = null;
      this.antsConsumed++;
    }

    // Check if should sleep
    if (this.antsConsumed >= 50) {
      this.goToSleep();
    } else {
      // Check for more ants in the same cell
      const cell = area.getCell(this.position.x, this.position.y);
      if (cell.ants.length > 0) {
        this.startEating(cell.ants[0]);
      } else {
        this.state = 'HUNGRY';
        this.ticksInCurrentState = 0;
      }
    }
  }

  goToSleep() {
    this.state = 'SLEEPING';
    this.ticksInCurrentState = 0;
    this.antsConsumed = 0;
  }

  wakeUp() {
    this.state = 'HUNGRY';
    this.ticksInCurrentState = 0;
  }

  getState() {
    return {
      id: this.id,
      position: { x: this.position.x, y: this.position.y },
      state: this.state,
      antsConsumed: this.antsConsumed
    };
  }
}

module.exports = AntEater;
