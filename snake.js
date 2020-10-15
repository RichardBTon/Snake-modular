// ============================================================
// Initialisation

let snakeBox = document.querySelector(".snake-container");
const pxPerSquare = 20;
const snakePartClassCSS = "snake-part";

// document.documentElement.style.setProperty(
//   "--snakePartSize",
//   `${pxPerSquare}px`
// );
// document.documentElement.style.setProperty("--position", `absolute`);

// ============================================================
// Snake classes

class SnakePart {
  constructor(x, y, pxPerSquare) {
    this.x = x;
    this.y = y;
    this.pxPerSquare = pxPerSquare;
    const part = document.createElement("div");
    part.classList.add("snake-part");
    part.classList.add("blue-main");
    snakeBox.appendChild(part);
    this.elm = part;

    this.move(this.x, this.y);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    let windowX = this.x * this.pxPerSquare;
    let windowY = this.y * this.pxPerSquare;
    this.elm.style.left = `${windowX}px`;
    this.elm.style.top = `${windowY}px`;
  }

  removeElm() {
    this.elm.parentNode.removeChild(this.elm);
  }
}

class Head extends SnakePart {
  constructor(x, y, pxPerSquare, history = []) {
    super(x, y, pxPerSquare);
    this.pxPerSquare = pxPerSquare;
    this.elm.classList.add("blue-head");

    this.history = history;
  }

  moveHead(x, y) {
    const newHistory = this.history.slice();
    newHistory.unshift({ x: this.x, y: this.y });
    this.history = newHistory;
    this.move(x, y);
  }
}

class Snake {
  constructor(headX, headY, tailCoords, pxPerSquare, container) {
    this.container = container;
    this.containerWidth = Math.floor(this.container.offsetWidth / pxPerSquare);
    this.containerHeight = Math.floor(
      this.container.offsetHeight / pxPerSquare
    );
    this.pxPerSquare = pxPerSquare;
    let head = new Head(headX, headY, pxPerSquare, tailCoords);
    this.head = head;

    let tail = [];
    for (var i = 0; i < tailCoords.length; i++) {
      tail.push(
        new SnakePart(tailCoords[i].x, tailCoords[i].y, this.pxPerSquare)
      );
    }
    this.tail = tail;

    this.vx = 1;
    this.vy = 0;

    this.moving = false;

    document.documentElement.style.setProperty(
      "--snakePartSize",
      `${this.pxPerSquare}px`
    );
  }

  move() {
    this.start();

    let x = this.head.x + this.vx;
    let y = this.head.y + this.vy;
    [x, y] = this.applyBorders(x, y);

    if (this.tailCrash(x, y)) {
      this.stop();
      return;
    }

    this.head.moveHead(x, y);
    for (var i = 0; i < this.tail.length; i++) {
      this.tail[i].move(this.head.history[i].x, this.head.history[i].y);
    }
  }

  setMoveLeft() {
    if (this.vx === 1) return;
    this.vx = -1;
    this.vy = 0;
  }
  setMoveRight() {
    if (this.vx === -1) return;
    this.vx = 1;
    this.vy = 0;
  }
  setMoveUp() {
    if (this.vy === 1) return;
    this.vx = 0;
    this.vy = -1;
  }
  setMoveDown() {
    if (this.vy === -1) return;
    this.vx = 0;
    this.vy = 1;
  }

  start() {
    if (this.moving) return;
    // console.log("starter");
    this.moving = true;
    let move = () => this.move();
    this.gameLoop = setInterval(move, 200);
  }
  stop() {
    if (!this.moving) return;
    // console.log("stopper");
    this.moving = false;
    clearInterval(this.gameLoop);
  }
  applyBorders(x, y) {
    // top border
    if (y < 0) {
      y = this.containerHeight - 1;
    }
    // right border
    else if (x > this.containerWidth - 1) {
      x = 0;
    }
    // bottom border
    else if (y > this.containerHeight - 1) {
      y = 0;
    }
    // left border
    else if (x < 0) {
      x = this.containerWidth - 1;
    }
    return [x, y];
  }
  extendTail() {
    let x = this.tail[this.tail.length - 1].x;
    let y = this.tail[this.tail.length - 1].y;
    this.tail.push(new SnakePart(x, y, this.pxPerSquare));
  }
  // updateBorders(container) {
  //   this.container = container;
  //   this.containerWidth = Math.floor(
  //     this.container.offsetWidth / this.pxPerSquare
  //   );
  //   this.containerHeight = Math.floor(
  //     this.container.offsetHeight / this.pxPerSquare
  //   );
  // }
  tailCrash(x, y) {
    for (var i = 0; i < this.tail.length; i++) {
      if (this.tail[i].x === x && this.tail[i].y === y) {
        console.log("tailCrash!");
        return true;
      }
    }
    return false;
  }

  removeSnake() {
    this.head.removeElm();
    for (var i = 0; i < this.tail.length; i++) {
      this.tail[i].removeElm();
    }
  }
}

class Apple extends SnakePart {
  constructor(x, y, pxPerSquare) {
    super(x, y, pxPerSquare);
  }
}
// ============================================================
// Customizable stuff

let tailCoords = [
  {
    x: 23,
    y: 9,
  },
  {
    x: 24,
    y: 9,
  },
  {
    x: 24,
    y: 10,
  },
  {
    x: 23,
    y: 10,
  },
  {
    x: 22,
    y: 10,
  },
  {
    x: 21,
    y: 10,
  },
  {
    x: 21,
    y: 11,
  },
  {
    x: 21,
    y: 12,
  },
];

// let snake = new Snake(22, 9, tailCoords, pxPerSquare, snakeBox);
// console.log(snake.containerWidth);
// console.log(snake.container.offsetWidth);

// window.addEventListener("resize", function () {
//   snake = new Snake(5, 5, tailCoords, snakeBox);
// });

// ============================================================
// Actually moving with keys, not necessary if you want to move any other way

// window.addEventListener("keydown", keyMove);

function keyMove(e, snake) {
  arrowMove(e, snake);
  if (![32].includes(e.keyCode)) return;
  e.preventDefault();
  if (e.keyCode === 32) {
    snake.moving ? snake.stop() : snake.start();
  }
}

function arrowMove(e, snake) {
  if (![37, 38, 39, 40].includes(e.keyCode)) return;
  e.preventDefault();
  if (e.keyCode === 37) {
    // left
    snake.setMoveLeft();
  } else if (e.keyCode === 38) {
    // up
    snake.setMoveUp();
  } else if (e.keyCode === 39) {
    // right
    snake.setMoveRight();
  } else if (e.keyCode === 40) {
    // down
    snake.setMoveDown();
  }
  if (!snake.moving) {
    snake.start();
  }
}

// ============================================================
// Exports

export { Snake, keyMove, snakeBox, snakePartClassCSS, pxPerSquare, SnakePart };
