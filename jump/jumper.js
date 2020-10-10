class Jumper {
  constructor({ pos = createVector(width / 2, height / 2), w = 50 }) {
    this.w = w;
    this.angle = 0;

    this.pos = pos;
    this.v = createVector();
    this.a = createVector();
    this.f = createVector();

    this.mass = 20;

    this.gravity = createVector(0, 3);
    this.maxSpeed = 5;
    this.maxAccel = 5;

    this.jumpCount = 0;
    this.doubleJumpLimit = 1;
    this.upKeyIsHeld = false;

    this.jumpForce = createVector(0, -100);
    this.doubleJumpForce = createVector(0, -200);

    this.groundMoveForce = createVector(50, 0);
    this.airMoveForce = createVector(3, 0);

    this.friction = 0.5;
    this.airResistance = 0.99;
    this.bounciness = 0.7;
  }

  get isGrounded() {
    const flag = this.pos.y + this.w / 2 + 3 >= height;

    // Reset jump counter if
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

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    rect(0, 0, this.w, this.w);
    pop();
  }

  bounce() {
    const tooLeft = this.pos.x - this.w / 2 <= 0;
    const tooRight = this.pos.x + this.w / 2 >= width;

    const tooHigh = this.pos.y - this.w / 2 <= 0;
    const tooLow = this.pos.y + this.w / 2 >= height;

    if (tooLeft || tooRight) {
      if (tooRight) {
        this.pos.x = width - this.w / 2 - 1;
      } else {
        this.pos.x = this.w / 2 + 1;
      }

      this.v.x *= -this.bounciness;
    }

    if (tooLow || tooHigh) {
      if (tooLow) {
        this.pos.y = height - this.w / 2 - 1;
      } else {
        this.pos.y = this.w / 2 + 1;
      }

      this.v.y *= -this.bounciness;
    }
  }

  userInput() {
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
}

export default Jumper;
