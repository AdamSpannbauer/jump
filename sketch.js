const canvasW = 512;
const canvasH = 512;

function setup() {
  createCanvas(canvasW, canvasH);
}

function draw() {
  background(100);
}

window.draw = draw;
window.setup = setup;
