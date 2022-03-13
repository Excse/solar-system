let timeStepSlider: p5.Element;
let centerCheckbox: p5.Element;
let centeredPlanet: p5.Element;

let planets: Planet[] = [];
let controls: Controls;

let translateX = 0;
let translateY = 0;

// @ts-ignore
window.mousePressed = (event) => controls.mousePressed(event);
// @ts-ignore
window.mouseDragged = (event) => controls.mouseDragged(event);
window.mouseReleased = () => controls.mouseReleased();

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  controls = new Controls();
  canvas.mouseWheel((event) => controls.mouseWheel(event));

  timeStepSlider = createSlider(
    TIME_STEP_MIN,
    TIME_STEP_MAX,
    TIME_STEP_DEFAULT,
    TIME_STEP_STEP
  );
  timeStepSlider.position(10, 20);

  centerCheckbox = createCheckbox(" Centered Planet");
  centerCheckbox.position(10, 40);

  centeredPlanet = createSelect();
  centeredPlanet.position(10, 60);

  const sun = new Planet({
    name: "Sun",
    mass: 1.98892e30,
    diameter: 1392700000,
    showTrail: false,
    color: color(255, 255, 0),
  });
  planets.push(sun);

  const mercury = new Planet({
    name: "Mercury",
    mass: 0.33e24,
    diameter: 4879e3,
    position: createVector(57.9e9, 0),
    velocity: createVector(0, 47.4e3),
    color: color(219, 206, 202),
  });
  planets.push(mercury);

  const venus = new Planet({
    name: "Venus",
    mass: 4.87e24,
    diameter: 12104e3,
    position: createVector(108.2e9, 0),
    velocity: createVector(0, 35.0e3),
    color: color(139, 125, 130),
  });
  planets.push(venus);

  const earth = new Planet({
    name: "Earth",
    mass: 5.97e24,
    diameter: 12756e3,
    position: createVector(149.6e9, 0),
    velocity: createVector(0, 29.8e3),
    color: color(0, 0, 165),
  });
  planets.push(earth);

  const mars = new Planet({
    name: "Mars",
    mass: 0.642e24,
    diameter: 6792e3,
    position: createVector(228.0e9, 0),
    velocity: createVector(0, 24.1e3),
    color: color(188, 39, 49),
  });
  planets.push(mars);

  for (let index = 1; index < planets.length; index++) {
    const planet = planets[index];
    // @ts-ignore
    centeredPlanet.option(planet.name);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();

  const timeStep = timeStepSlider.value() as number;
  text("Time Step: " + humanizeDuration(timeStep * 1000), 10, 15);

  const fpsString = "FPS: " + frameRate().toFixed();
  text(fpsString, width - textWidth(fpsString) - 10, 15);

  controls.update();
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom);

  // @ts-ignore
  if (!centerCheckbox.checked()) {
    translateX = lerp(translateX, 0, 0.15);
    translateY = lerp(translateY, 0, 0.15);

    translate(width / 2 - translateX, height / 2 - translateY);
  } else {
    const planetName = centeredPlanet.value();
    const planet: Planet = planets.filter(
      (planet) => planet.name === planetName
    )[0];

    translateX = lerp(translateX, planet.position.x * PLANET_SCALE, 0.15);
    translateY = lerp(translateY, planet.position.y * PLANET_SCALE, 0.15);

    translate(width / 2 - translateX, height / 2 - translateY);
  }

  planets.forEach((planet) => planet.update(planets, timeStep));
  planets.forEach((planet) => planet.draw());
}
