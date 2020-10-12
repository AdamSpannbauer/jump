// TODO: make a background object class for image assets to be rel positioned to character
// TODO: clean up this file while doing above TODO

import Jumper from './jump/jumper.js';

const canvasW = 512;
const canvasH = 512;

let jumper;
const jumper_width = 50;

const trees = [];

const font8BitPath = './assets/8_bit_wonder.ttf';
let font8Bit;

const standImPath = './assets/imgs/stand.png';
let standImage;

const jumpSquatImPath = './assets/imgs/jump_squat.png';
let jumpSquatImage;

const moonImPath = './assets/imgs/moon.png';
let moonImage;

const tree1ImPath = './assets/imgs/tree_1.png';
const tree2ImPath = './assets/imgs/tree_2.png';
let tree1Image;
let tree2Image;

const backgroundMusicPath = './assets/sounds/music.wav';
let backgroundMusic;

const leafWalkSoundPath = './assets/sounds/leaf_walk.wav';
let leafWalkSound;

function preload() {
  font8Bit = loadFont(font8BitPath);

  standImage = loadImage(standImPath);
  jumpSquatImage = loadImage(jumpSquatImPath);

  tree1Image = loadImage(tree1ImPath);
  tree2Image = loadImage(tree2ImPath);

  moonImage = loadImage(moonImPath);

  leafWalkSound = loadSound(leafWalkSoundPath);
  backgroundMusic = loadSound(backgroundMusicPath);
}

function setup() {
  createCanvas(canvasW, canvasH);
  rectMode(CENTER);
  imageMode(CENTER);
  textFont(font8Bit);
  userStartAudio();

  backgroundMusic.loop();
  backgroundMusic.setVolume(0.05);

  jumper = new Jumper({
    p: createVector(width / 2, height - jumper_width),
    w: jumper_width,
    standIm: standImage,
    jumpSquatIm: jumpSquatImage,
  });

  let tree;
  for (let i = 0; i < 30; i++) {
    tree = new Tree(random(0, width * 5));
    trees.push(tree);
  }
}

function relativeX(x, center) {
  return width / 2 + (x - center);
}

function relativeY(y, zero) {
  return height - (zero - y);
}

function draw() {
  background(50);

  image(moonImage, 100, 200, 150, 150);

  fill(0);
  rect(
    width / 2,
    relativeY(height, jumper.pos.y + jumper.h / 2),
    width,
    15,
  );

  for (const tree of trees) {
    tree.draw({ relX: jumper.pos.x, relY: jumper.pos.y + jumper.h / 2 });
  }

  translate(width / 2, 0);

  if (jumper.isGrounded && abs(jumper.v.x) > 0 && !leafWalkSound._playing) {
    leafWalkSound.loop();
  } else if ((!jumper.isGrounded || !abs(jumper.v.x) > 0) && leafWalkSound._playing) {
    leafWalkSound.pause();
  }

  jumper.update();
  jumper.draw();
}

window.preload = preload;
window.setup = setup;
window.draw = draw;

class Tree {
  constructor(x) {
    this.x = x;
    this.y = height - 5;
    this.dir = random([-1, 1]);

    this.img = random([tree1Image, tree1Image, tree2Image]);

    this.h = random(200, 300);
    this.w = this.img.width * (this.h / this.img.height);
  }

  draw({ relX = 0, relY = 0 }) {
    // Assuming relative_pos will be in middle of canvas
    let drawX = width / 2 + (this.x - relX);

    // Assuming relative_pos will be bottom of canvas
    let drawY = height - (relY - this.y);

    drawX -= this.w / 2;
    drawY -= this.h / 2;

    push();
    translate(drawX, drawY);
    scale(this.dir, 1);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}
