import BackgroundItem from './background_item.js';

class Tree extends BackgroundItem {
  constructor({ x = 0, img = null }) {
    const dir = random([-1, 1]);
    const h = random(200, 300);

    super({
      x, img, h, dir,
    });
  }
}

export default Tree;
