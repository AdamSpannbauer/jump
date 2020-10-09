import Jumper from './jump/jumper.js';

const canvasW = 512;
const canvasH = 512;

let jumper;

function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CENTER);

  jumper = new Jumper(createVector(width / 2, height - 50), 50);
}

function draw() {
  background(100);

  jumper.update();
  jumper.draw();
}

window.setup = setup;
window.draw = draw;
