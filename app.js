const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game Constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
const colors = ['red', 'green', 'blue', 'yellow', 'orange'];
// Background Image
const BACKGROUND = new Image();
BACKGROUND.src = "background.jpg";
// Game Variables
let leftArrow = false;
let rightArrow = false;
let LIVES = 3;
let level = 1;
let score = 0;
// Paddle Object
const paddle = {
  x: canvas.width / 2 - PADDLE_WIDTH / 2,
  y: canvas.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};
// Ball Object
const ball = {
  x: canvas.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};
// Brick Object
const brick = {
  row: 3,
  column: 5,
  width: 55,
  height: 15,
  offsetTop: 10,
  offsetLeft: 20,
  marginTop: 25,
};
const bricks = [];
function createBricks() {
  brick.row = 3 + level; 
  bricks.length = 0; 

  if(brick.row > 7){
    brick.row = 7;
  }
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
        y: r * (brick.offsetTop + brick.height) + brick.marginTop,
        status: 1,
        color: colors[Math.floor(Math.random() * colors.length)], 
      };
    }
  }
}
// Initial Brick Creation
createBricks();
// Draw Paddle Function
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "lightGreen";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.stroke();
  ctx.closePath();
}
// Draw Ball Function
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = "orange";
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}
// Draw Bricks Function
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      if (bricks[r][c].status == 1) {
        let brickX = bricks[r][c].x;
        let brickY = bricks[r][c].y;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brick.width, brick.height);
        ctx.fillStyle = bricks[r][c].color; // Use brick's color
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(brickX, brickY, brick.width, brick.height);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}
// Draw LIVES Function 
function drawLIVES(){
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + LIVES, canvas.width - 235, 20);
}
// Draw Score Function
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, 20);
}
// Draw Level Function
function drawLevel() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Level: " + level, canvas.width - 100, 20);
}
// Draw Function
function draw() {
  ctx.drawImage(BACKGROUND, 0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
  drawScore();
  drawLevel();
  drawLIVES();
}
// Move Paddle Function
function movePaddle() {
  if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  } else if (rightArrow && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.dx;
  }
}
// Move Ball Function
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}
// Ball and Wall Collision Function
function ballWallCollision() {
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > canvas.height) {
    LIVES--;
    resetBall();
  }
}
// Ball and Paddle Collision Function
function ballPaddleCollision() {
  if (
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height &&
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width
  ) {
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);

    let angle = collidePoint * (Math.PI / 3);
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}
// Reset Ball Function
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.speed = 4 + level; 
  if(ball.speed > 7){
    ball.speed = 7;
  }
  ball.dx = ball.speed * (Math.random() * 2 - 1);
  ball.dy = -ball.speed;
}
// Ball and Brick Collision Function
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      if (b.status == 1) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
        }
      }
    }
  }

  
  // Check if all bricks are destroyed
  let allBricksDestroyed = true;
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      if (bricks[r][c].status == 1) {
        allBricksDestroyed = false;
        break;
      }
    }
  }
  if (allBricksDestroyed) {
    level++;
    createBricks();
    resetBall(); 
  }
}
// Keydown Event Listener
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    leftArrow = true;
  } else if (e.key === "ArrowRight") {
    rightArrow = true;
  }
});
// Keyup Event Listener
document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowLeft") {
    leftArrow = false;
  } else if (e.key === "ArrowRight") {
    rightArrow = false;
  }
});

// Touch Event Listeners
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

let touchX = 0;

function handleTouchStart(e) {
  const touch = e.touches[0];
  touchX = touch.clientX;
}

function handleTouchMove(e) {
  const touch = e.touches[0];
  const deltaX = touch.clientX - touchX;
  touchX = touch.clientX;

  if (deltaX < 0 && paddle.x > 0) {
    paddle.x += deltaX;
  } else if (deltaX > 0 && paddle.x < canvas.width - paddle.width) {
    paddle.x += deltaX;
  }
}

function handleTouchEnd(e) {
  // Do nothing
}

// Update Function
function update() {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  ballBrickCollision();
}

// Game Loop Function
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  update();
  if (LIVES > 0) {
    requestAnimationFrame(loop);
  } else {
    alert("Game Over");
  }
}

// Start the game loop
loop();
