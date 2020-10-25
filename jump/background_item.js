class BackgroundItem {
  constructor({
    x = 0, img = null, h = null, dir = 1,
  }) {
    this.x = x;
    this.y = height - 5;
    this.dir = dir;

    this.img = img;

    this.h = h || this.img.height;
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

export default BackgroundItem;
