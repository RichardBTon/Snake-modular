import {
  Snake,
  keyMove,
  snakeBox,
  snakePartClassCSS,
  pxPerSquare,
  SnakePart,
  Apple,
} from "./snake.js";

let tailCoords = [
  {
    x: 4,
    y: 5,
  },
  {
    x: 3,
    y: 5,
  },
  {
    x: 2,
    y: 5,
  },
  {
    x: 1,
    y: 5,
  },
];

let snake = new Snake(5, 5, tailCoords, pxPerSquare, snakeBox);
let apple = new Apple(8, 5, pxPerSquare, snakeBox);
// apple.setRandomPos();
// let snakePart = new SnakePart(7, 7, pxPerSquare);
window.addEventListener("keydown", (e) => {
  keyMove(e, snake);
  if (e.keyCode === 13) {
    snake.removeSnake();
  }
});
