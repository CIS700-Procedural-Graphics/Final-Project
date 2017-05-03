export default class Agent {
  constructor(agent) {
    this.update(agent);
  }

  move(dir, world) {
    this.dir = dir;
    switch(dir) {
      case 'right':
        if (this.pos.x + 1 < world.size
          && world.getTile(this.pos.x+1, this.pos.y).traversable) {
          this.pos.x += 1;
        }
        break;
      case 'left':
        if (this.pos.x - 1 >= 0
          && world.getTile(this.pos.x-1, this.pos.y).traversable) {
          this.pos.x -= 1;
        }
        break;
      case 'up':
        if (this.pos.y - 1 >= 0
          && world.getTile(this.pos.x, this.pos.y-1).traversable) {
          this.pos.y -= 1;
        }
        break;
      case 'down':
        if (this.pos.y + 1 < world.size
          && world.getTile(this.pos.x, this.pos.y+1).traversable) {
          this.pos.y += 1;
        }
        break;
    }
  }


  moveTo(pos) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }

  update(agent) {
    this.type = agent.type;
    this.pos = agent.pos;
    this.id = agent.id;
    this.spriteID = agent.spriteID;
    this.dir = agent.dir;
  }

  // Deprecated and replaced by `update` which handles deserializing -- David
  serialize() {
    return {
      pos: {
        x: this.pos.x,
        y: this.pos.y
      },
      id: this.id,
    };
  }
}
