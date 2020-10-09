class Jumper {
  constructor(p, w) {
    this.w = w;
    this.angle = 0;

    this.p = p;
    this.v = createVector();
    this.a = createVector();
    this.f = createVector();

    this.mass = 20;

    this.gravity = createVector(0, 3);
    this.max_speed = 5;
    this.max_accel = 5;

    this.jump_count = 0;
    this.up_held = false;
  }

  get isGrounded() {
    const flag = this.p.y + this.w / 2 + 3 >= height;
    if (flag) {
      this.jump_count = 0;
    }

    return flag;
  }

  userInput() {
    if (keyIsDown(UP_ARROW) && this.jump_count < 2 && !this.up_held) {
      if (this.jump_count === 0) {
        this.f.y -= 100;
      } else {
        this.f.y -= 200;
      }

      this.up_held = true;
      this.jump_count += 1;
    } else if (keyIsDown(LEFT_ARROW)) {
      if (this.isGrounded) {
        this.f.x -= 50;
      } else {
        this.f.x -= 3;
      }
    } else if (keyIsDown(RIGHT_ARROW)) {
      if (this.isGrounded) {
        this.f.x += 50;
      } else {
        this.f.x += 3;
      }
    }

    if (!keyIsDown(UP_ARROW)) {
      this.up_held = false;
    }
  }

  applyForce(f) {
    // f = m * a
    // a = f / m
    // (really da = f / m)
    this.a.add(p5.Vector.div(f, this.mass));
  }

  update() {
    this.userInput();

    this.applyForce(this.f);
    this.applyForce(this.gravity);
    this.a.limit(this.max_accel);

    this.v.add(this.a);
    this.v.mult(0.99);
    this.v.limit(this.max_speed);

    if (this.isGrounded) {
      if (this.v.mag() < 1) {
        this.v.mult(0);
      } else {
        this.v.x *= 0.5;
      }
    }

    this.p.add(this.v);
    this.bounce();

    this.f.mult(0);
    this.a.mult(0);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(this.angle);
    rect(0, 0, this.w, this.w);
    pop();
  }

  bounce() {
    const too_left = this.p.x - this.w / 2 <= 0;
    const too_right = this.p.x + this.w / 2 >= width;

    const too_high = this.p.y - this.w / 2 <= 0;
    const too_low = this.p.y + this.w / 2 >= height;

    if (too_left || too_right) {
      if (too_right) {
        this.p.x = width - this.w / 2 - 1;
      } else {
        this.p.x = this.w / 2 + 1;
      }

      this.v.x *= -0.7;
    }

    if (too_low || too_high) {
      if (too_low) {
        this.p.y = height - this.w / 2 - 1;
      } else {
        this.p.y = this.w / 2 + 1;
      }

      this.v.y *= -0.7;
    }
  }
}

export default Jumper;
