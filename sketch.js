import Jumper from './jump/jumper.js';

const canvasW = 512;
const canvasH = 512;

let jumper;
const jumper_width = 50;

const font8BitPath = './assets/8_bit_wonder.ttf';
let font8Bit;

const standImPath = './assets/imgs/stand.png';
const jumpSquatImPath = './assets/imgs/jump_squat.png';
let standImage;
let jumpSquatImage;

function preload() {
  standImage = loadImage(standImPath);
  jumpSquatImage = loadImage(jumpSquatImPath);
  font8Bit = loadFont(font8BitPath);
}

function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CENTER);
  imageMode(CENTER);
  textFont(font8Bit);

  jumper = new Jumper({
    p: createVector(width / 2, height - jumper_width),
    w: jumper_width,
    standIm: standImage,
    jumpSquatIm: jumpSquatImage,
  });
}

function draw() {
  background(100);

  jumper.update();
  jumper.draw();
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
