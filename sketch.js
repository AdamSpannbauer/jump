import Jumper from './jump/jumper.js';

const canvasW = 512;
const canvasH = 512;

let jumper;
const jumper_width = 50;

function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CENTER);

  jumper = new Jumper({
    p: createVector(width / 2, height - jumper_width),
    w: jumper_width,
  });
}

function draw() {
  background(100);

  jumper.update();
  jumper.draw();
}

window.setup = setup;
window.draw = draw;
