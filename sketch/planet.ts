interface PlanetInit {
  name: string;
  diameter: number;
  mass: number;
  color: p5.Color;
  velocity?: p5.Vector;
  position?: p5.Vector;
  force?: p5.Vector;
  showTrail?: boolean;
}

class Planet {
  private readonly _name: string;
  private readonly _diameter: number;
  private readonly _mass: number;
  private readonly _velocity: p5.Vector;
  private readonly _position: p5.Vector;
  private readonly _force: p5.Vector;
  private readonly _showTrail: boolean;
  private readonly _trail: p5.Vector[];
  private readonly _color: p5.Color;

  constructor(init: PlanetInit) {
    this._diameter = init.diameter;
    this._mass = init.mass;
    this._name = init.name;
    this._position = init.position ? init.position : createVector();
    this._velocity = init.velocity ? init.velocity : createVector();
    this._force = init.force ? init.force : createVector();
    this._showTrail = init.showTrail !== undefined ? init.showTrail : true;
    this._color = init.color ? init.color : color(0);
    this._trail = [];
  }

  public attractTo = (planet: Planet) => {
    if (this == planet) return;

    const force = p5.Vector.sub(planet._position, this._position);
    const distance = force.mag();
    if (distance == 0) return;

    force.normalize();

    const strength =
      (GRAVITATIONAL_CONSTANT * this._mass * planet._mass) /
      (distance * distance);
    force.mult(strength);

    this._force.add(force);
  };

  public update = (planets: Planet[], timeStep: number): void => {
    planets.forEach((planet) => this.attractTo(planet));

    this._velocity.add(this._force.copy().div(this._mass).mult(timeStep));
    this._position.add(this._velocity.copy().mult(timeStep));

    if (this._showTrail) {
      this._trail.push(this._position.copy());
      if (this._trail.length > 100) this._trail.shift();
    }

    this._force.set(0, 0);
  };

  public draw = (): void => {
    const diameter = this._diameter * PLANET_SCALE;
    const x = this._position.x * PLANET_SCALE;
    const y = this._position.y * PLANET_SCALE;

    const nameWidth = textWidth(this._name);
    text(this._name, x - nameWidth / 2, y - diameter / 2 - textSize());

    if (this._showTrail && this._trail.length > 2) {
      push();
      const trailCopy = [...this._trail];
      noFill();
      for (let index = 1; index < trailCopy.length; index++) {
        const p1 = trailCopy[index - 1];
        const p2 = trailCopy[index];
        stroke(0, ((index / trailCopy.length) * 255) / 2);
        line(
          p1.x * PLANET_SCALE,
          p1.y * PLANET_SCALE,
          p2.x * PLANET_SCALE,
          p2.y * PLANET_SCALE
        );
      }
      pop();
    }

    push();
    noStroke();
    this.glow(this._color, 10);
    fill(this._color);
    circle(x, y, diameter + 3);
    pop();
  };

  public glow = (color: p5.Color, blurriness: number) => {
    // @ts-ignore
    const context: CanvasRenderingContext2D = drawingContext;
    context.shadowBlur = blurriness;
    context.shadowColor = color.toString();
  };

  get position(): p5.Vector {
    return this._position;
  }

  get name(): string {
    return this._name;
  }
}
