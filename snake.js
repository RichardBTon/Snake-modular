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
    this.setMove(x, y);
    let windowX = this.x * this.pxPerSquare;
    let windowY = this.y * this.pxPerSquare;
    this.elm.style.left = `${windowX}px`;
    this.elm.style.top = `${windowY}px`;
  }
  setMove(x, y) {
    this.x = x;
    this.y = y;
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

  setMoveHead(x, y) {
    const newHistory = this.history.slice();
    newHistory.unshift({ x: this.x, y: this.y });
    this.history = newHistory;
    this.setMove(x, y);
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

    document.documentElement.style.setProperty(
      "--snakePartSize",
      `${this.pxPerSquare}px`
    );
  }

  setMove() {
    let x = this.head.x + this.vx;
    let y = this.head.y + this.vy;
    [x, y] = this.applyBorders(x, y);
    this.head.setMoveHead(x, y);
    for (var i = 0; i < this.tail.length; i++) {
      this.tail[i].setMove(this.head.history[i].x, this.head.history[i].y);
    }
  }

  moveSnakeElm(x, y) {
    this.head.move(x, y);
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
    let x = this.head.history[this.tail.length].x;
    let y = this.head.history[this.tail.length].y;
    this.tail.push(new SnakePart(x, y, this.pxPerSquare));
  }

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
  constructor(x = 0, y = 0, pxPerSquare, container) {
    super(x, y, pxPerSquare);
    this.container = container;
    this.containerSizeX = this.container.offsetWidth / this.pxPerSquare;
    this.containerSizeY = this.container.offsetHeight / this.pxPerSquare;
    this.elm.classList.add("apple");
  }
  setRandomPos() {
    this.x = Math.floor(Math.random() * this.containerSizeX);
    this.y = Math.floor(Math.random() * this.containerSizeY);
    this.move(this.x, this.y);
  }
}

class SnakeGame {
  constructor(
    container,
    pxPerSquare,
    headX,
    headY,
    tailCoords,
    appleX,
    appleY
  ) {
    this.container = container;
    this.pxPerSquare = pxPerSquare;

    let snake = new Snake(
      headX,
      headY,
      tailCoords,
      this.pxPerSquare,
      this.container
    );
    this.snake = snake;

    let apple = new Apple(appleX, appleY, this.pxPerSquare, this.container);
    this.apple = apple;

    this.started = false;
  }

  start() {
    if (this.started) return;
    // console.log("starter");
    this.started = true;
    let move = () => this.runGame();
    this.gameLoop = setInterval(move, 200);
  }

  stop() {
    if (!this.started) return;
    // console.log("stopper");
    this.started = false;
    clearInterval(this.gameLoop);
  }

  runGame() {
    console.log(this.snake.head);
    console.log(this.snake.head);
    this.snake.setMove();

    if (this.snake.tailCrash(this.snake.head.x, this.snake.head.y)) {
      this.stop();
    }
    if (
      this.apple.x === this.snake.head.x &&
      this.apple.y === this.snake.head.y
    ) {
      this.apple.setRandomPos();
      this.snake.extendTail();
    }
    this.snake.moveSnakeElm(this.snake.head.x, this.snake.head.y);
  }
}

// ============================================================
// Actually moving with keys, not necessary if you want to move any other way

// window.addEventListener("keydown", keyMove);

function keyMove(e, snakeGame) {
  arrowMove(e, snakeGame);
  if (![32].includes(e.keyCode)) return;
  e.preventDefault();
  if (e.keyCode === 32) {
    snakeGame.started ? snakeGame.stop() : snakeGame.start();
  }
}

function arrowMove(e, snakeGame) {
  if (![37, 38, 39, 40].includes(e.keyCode)) return;
  e.preventDefault();
  if (e.keyCode === 37) {
    // left
    snakeGame.snake.setMoveLeft();
  } else if (e.keyCode === 38) {
    // up
    snakeGame.snake.setMoveUp();
  } else if (e.keyCode === 39) {
    // right
    snakeGame.snake.setMoveRight();
  } else if (e.keyCode === 40) {
    // down
    snakeGame.snake.setMoveDown();
  }
  if (!snakeGame.snake.moving) {
    snakeGame.start();
  }
}

function runSnakeGame(snake, apple) {}
// ============================================================
// Exports

export { keyMove, snakeBox, snakePartClassCSS, pxPerSquare, SnakeGame };
