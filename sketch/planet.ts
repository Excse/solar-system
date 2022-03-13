interface PlanetInit {
  name: string;
  diameter: number;
  mass: number;
  velocity?: p5.Vector;
  position?: p5.Vector;
  force?: p5.Vector;
}

class Planet {
  private readonly _name: string;
  private readonly _diameter: number;
  private readonly _mass: number;
  private readonly _velocity: p5.Vector;
  private readonly _position: p5.Vector;
  private readonly _force: p5.Vector;

  constructor(init: PlanetInit) {
    this._diameter = init.diameter;
    this._mass = init.mass;
    this._name = init.name;
    this._position = init.position ? init.position : createVector();
    this._velocity = init.velocity ? init.velocity : createVector();
    this._force = init.force ? init.force : createVector();
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

    this._force.set(0, 0);
  };

  public draw = (): void => {
    const diameter = this._diameter * PLANET_SCALE;
    const x = this._position.x * PLANET_SCALE;
    const y = this._position.y * PLANET_SCALE;

    const nameWidth = textWidth(this._name);
    text(this._name, x - nameWidth / 2, y - diameter / 2 - textSize());

    circle(x, y, diameter + 1);
  };

  get position(): p5.Vector {
    return this._position;
  }

  get name(): string {
    return this._name;
  }
}
