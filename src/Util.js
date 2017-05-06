import seedrandom from 'seedrandom'

export default class Util {
  constructor() {
    this.randSeed = 0;
    window.util = this;
  }

  seed(seed) {
    this.randSeed = seed + 7;
    this.rng = new Math.seedrandom(this.randSeed);
  }

  randInt() {
    return this.random() * 2147483647;
  }

  randRange(a, b) {
    return this.random() * (b - a) + a;
  }

  randIntRange(a, b) {
    return Math.floor(this.randRange(a, b));
  }

  random() {
    return this.rng();
  }

  randomDisk(rx, ry) {
    let sqrtrx = Math.sqrt(this.random());
    let sqrtry = Math.sqrt(this.random());
    let theta = this.random() * 2 * Math.PI;
    let px = sqrtrx * Math.cos(theta) * rx;
    let py = sqrtry * Math.sin(theta) * ry;
    return {px, py};
  }

  /*
  Randomly selects an object from a list given weights. Weights do not have to sum to 1.
  Follows this parameter format:
  [
    {w: 3, o: choice1},
    {w: 10, o: choice2},
    ...
  ]
  Return: `o`
  */
  randChoice(l) {
    let sumWeights = 0;
    l.forEach(item => {
      item.w += sumWeights;
      sumWeights = item.w;
    });
    let rand = this.random() * sumWeights;
    for (let i = 0; i < l.length; i++) {
      if (rand < l[i].w) {
        return l[i].o;
      }
    }
  }

  choose(l) {
    return l[Math.floor(this.random() * l.length)];
  }

  /*
  Iterates integers starting from `start` and finishes at `end` inclusively
  and applies callback function `f`. The callback follows this signature:
  f(i) {
    ...
  }

  Return: undefined
  */

  iterate(start, end, f) {
    let d = end - start;
    let sd = Math.sign(d);
    for (let i = 0; i < Math.abs(d); i++) {
      f(start + i * sd);
    }
  }

  clamp(min, x, max) {
    return Math.min(Math.max(x, min), max);
  }

  inBound(min, x, max) {
    return min <= x && x < max;
  }

  lerp(x1, y1, x2, y2, x) {
    return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
  }
}

export let util = new Util();
