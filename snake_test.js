import {
  keyMove,
  snakeBox,
  snakePartClassCSS,
  pxPerSquare,
  SnakeGame,
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

let snakeGame = new SnakeGame(snakeBox, pxPerSquare, 5, 5, tailCoords, 8, 5);

window.addEventListener("keydown", (e) => {
  if (snakeGame.tailCrashed) {
    return;
  }
  keyMove(e, snakeGame);
  if (e.keyCode === 13) {
    snakeGame.snake.removeSnake();
  }
});
