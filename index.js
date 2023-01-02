const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

/**
 * @type {HTMLDivElement}
 */
const text = document.getElementById("text");

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas 2D context is not supported");
}

const MAX_DEPTH = 50;
const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;
const DIRS_AMOUNT = 4;
const DIRECTIONS = {
  [RIGHT]: "RIGHT",
  [DOWN]: "DOWN",
  [LEFT]: "LEFT",
  [UP]: "UP",
};

const COLORS = [...Array(MAX_DEPTH).keys()].map(i => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
});

/**
 * @param {number} depth
 * @param {number} dir
 * @param {{ x: number, y: number, w: number, h: number }} box
 */
const draw = (depth, dir, box) => {
  ctx.fillStyle = COLORS[depth - 1];
  ctx.fillRect(box.x, box.y, box.w, box.h);

  if (depth > 1) {
    let newBox;
    switch (dir) {
      case RIGHT:
        newBox = { x: box.x + box.h, y: box.y, w: box.w - box.h, h: box.h };
        break;
      case DOWN:
        newBox = { x: box.x, y: box.y + box.w, w: box.w, h: box.h - box.w };
        break;
      case LEFT:
        newBox = { x: box.x, y: box.y, w: box.w - box.h, h: box.h };
        break;
      case UP:
        newBox = { x: box.x, y: box.y, w: box.w, h: box.h - box.w };
        break;
      default:
        throw new Error(`Invalid direction ${dir}`);
    }

    if (newBox.w <= 0 || newBox.h <= 0) {
      return;
    }

    draw(depth - 1, (dir + 1) % DIRS_AMOUNT, newBox);
  }
};

/**
 * @param {number} width
 * @param {number} height
 */
const updateRatio = (width, height) => {
  const ratio = width / height;

  text.innerHTML = `Ratio: ${ratio.toFixed(3)}`;
};

updateRatio(WIDTH, HEIGHT);
draw(MAX_DEPTH, RIGHT, { x: 0, y: 0, w: WIDTH, h: HEIGHT });

let isDragging = false;

/**
 * @param {MouseEvent} e
 */
const handleMouseDown = (e) => {
  isDragging = true;
};

/**
 * @param {MouseEvent} e
 */
const handleMouseUp = (e) => {
  isDragging = false;
};

/**
 * @param {MouseEvent} e
 */
const handleMouse = (e) => {
  if (!isDragging) {
    return;
  }
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  updateRatio(e.clientX, e.clientY);

  draw(MAX_DEPTH, RIGHT, {
    x: 0,
    y: 0,
    w: e.clientX,
    h: e.clientY,
  });
};

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseout", handleMouseUp);
canvas.addEventListener("mousemove", handleMouse);
canvas.addEventListener("touchstart", handleMouseDown);
canvas.addEventListener("touchend", handleMouseUp);
canvas.addEventListener("touchcancel", handleMouseUp);
canvas.addEventListener("touchmove", handleMouse);
