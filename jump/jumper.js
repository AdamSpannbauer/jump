class Jumper {
  constructor({
    pos = createVector(width / 2, height / 2), w = 50, standIm = null, jumpSquatIm = null,
  }) {
    this.w = w;
    this.h = 2 * w;

    this.standIm = standIm;
    this.jumpSquatIm = jumpSquatIm;

    this.pos = pos;
    this.v = createVector();
    this.a = createVector();
    this.f = createVector();

    this.mass = 20;

    this.gravity = createVector(0, 3);
    this.maxSpeed = 10;
    this.maxAccel = 10;

    this.jumpCount = 0;
    this.doubleJumpLimit = 1;
    this.upKeyIsHeld = false;

    this.jumpForce = createVector(0, -100);
    this.doubleJumpForce = createVector(0, -130);

    this.groundMoveForce = createVector(50, 0);
    this.airMoveForce = createVector(3, 0);

    this.friction = 0.5;
    this.airResistance = 0.99;
    this.bounciness = 0.7;
  }

  get isGrounded() {
    const flag = this.pos.y + this.h / 2 + 3 >= height && this.v.y >= 0;

    if (flag) {
      this.jumpCount = 0;
    }

    return flag;
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
    this.a.limit(this.maxAccel);

    this.v.add(this.a);
    this.v.mult(this.airResistance);
    this.v.limit(this.maxSpeed);

    if (this.isGrounded) {
      // stop moving if too slow
      if (this.v.mag() < 1) {
        this.v.mult(0);
      } else {
        this.v.x *= this.friction;
      }
    }

    this.pos.add(this.v);
    this.bounce();

    this.f.mult(0);
    this.a.mult(0);
  }

  draw_box() {
    push();
    translate(this.pos.x, this.pos.y);
    rect(0, 0, this.w, this.h);
    pop();
  }

  draw() {
    push();
    translate(0, this.pos.y);

    // Change dir based on x vel
    scale(this.v.x / abs(this.v.x), 1.0);

    if (this.upKeyIsHeld) {
      const h_adj = this.h * 0.88;
      image(this.jumpSquatIm, 0, this.h - h_adj, this.w, h_adj);
    } else {
      image(this.standIm, 0, 0, this.w, this.h);
    }

    pop();
  }

  bounce() {
    const tooLeft = this.pos.x - this.w / 2 <= 0;
    const tooRight = this.pos.x + this.w / 2 >= width;

    const tooHigh = this.pos.y - this.h / 2 <= 0;
    const tooLow = this.pos.y + this.h / 2 >= height;

    if (tooLeft || tooRight) {
      if (tooRight) {
        // this.pos.x = width - this.w / 2 - 1;
      } else {
        this.pos.x = this.w / 2 + 1;
        this.v.x *= -this.bounciness;
      }
    }

    if (tooLow || tooHigh) {
      if (tooLow) {
        this.pos.y = height - this.h / 2 - 1;
      } else {
        this.pos.y = this.h / 2 + 1;
      }

      this.v.y *= -this.bounciness;
      this.v.y *= 0;
    }
  }

  move() {
    // left or a
    const leftPressed = keyIsDown(LEFT_ARROW) || keyIsDown(65);
    if (leftPressed) {
      if (this.isGrounded) {
        this.f.sub(this.groundMoveForce);
      } else {
        this.f.sub(this.airMoveForce);
      }
    }

    // right or d
    const rightPressed = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
    if (rightPressed) {
      if (this.isGrounded) {
        this.f.add(this.groundMoveForce);
      } else {
        this.f.add(this.airMoveForce);
      }
    }
  }

  jump() {
    // up or w
    const upPressed = keyIsDown(UP_ARROW) || keyIsDown(87);
    const hasRemainingJumps = this.jumpCount < this.doubleJumpLimit + 1;

    if (upPressed && !this.upKeyIsHeld && hasRemainingJumps) {
      if (this.jumpCount === 0) {
        this.f.add(this.jumpForce);
      } else {
        this.f.add(this.doubleJumpForce);
      }

      this.upKeyIsHeld = true;
      this.jumpCount += 1;
    } else if (!upPressed) {
      this.upKeyIsHeld = false;
    }
  }

  userInput() {
    // it's dumb, but... this.move has to be done before this.jump
    // this.isGrounded resets the jump counter when true
    // this.move checks if grounded and if run after this.jump
    // then the player gets an extra jump while moving horizontally
    this.move();
    this.jump();
  }
}

export default Jumper;
