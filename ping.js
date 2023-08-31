const stage = document.querySelector("canvas");
const width = stage.width;
const height = stage.height;
let context = stage.getContext("2d");

let maxCompSpeed = 3;
let ballSize = 5;
let ballPosition;
let xSpeed;
let ySpeed;

const paddleWidth = 5;
const paddleHeight = 20;
const paddleOffset = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

let leftScore = 0;
let rightScore = 0;
let gameOver = false;
let won = false;
function initBall() {
  ballPosition = {
    x: 20,
    y: 30,
  };
  xSpeed = 5;
  ySpeed = 3;
}
initBall();

function draw() {
  //draw stage
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  //draw ball
  context.fillStyle = "white";
  context.fillRect(ballPosition.x, ballPosition.y, ballSize, ballSize);

  //draw left paddle
  context.fillRect(paddleOffset, leftPaddleTop, paddleWidth, paddleHeight);

  //draw right paddle
  context.fillRect(
    width - paddleOffset - paddleWidth,
    rightPaddleTop,
    paddleWidth,
    paddleHeight
  );

  //draw left score
  context.font = "30px monospace";
  context.textAlign = "left";
  context.fillText(leftScore.toString(), 50, 50);

  //draw right score
  context.textAlign = "right";
  context.fillText(rightScore.toString(), width - 50, 50);
}

stage.addEventListener("mousemove", (e) => {
  rightPaddleTop = e.y - stage.offsetTop;
});

function followBall() {
  let ball = {
    top: ballPosition.y,
    bottom: ballPosition.y + ballSize,
  };

  let leftPaddle = {
    top: leftPaddleTop,
    bottom: leftPaddleTop + paddleHeight,
  };

  if (ball.top < leftPaddle.top) {
    leftPaddleTop -= maxCompSpeed;
  } else if (ball.bottom > leftPaddle.bottom) {
    leftPaddleTop += maxCompSpeed;
  }
}

function checkPaddleCollision(paddle, ball) {
  return (
    ball.left < paddle.right &&
    ball.right > paddle.left &&
    ball.bottom > paddle.top &&
    ball.top < paddle.bottom
  );
}

function adjustAngle(distanceFromTop, distanceFromBottom) {
  if (distanceFromTop < 0) {
    ySpeed -= 1;
  } else if (distanceFromBottom < 0) {
    ySpeed += 1;
  }
}

function checkCollision() {
  //get ball
  let ball = {
    left: ballPosition.x,
    right: ballPosition.x + ballSize,
    top: ballPosition.y,
    bottom: ballPosition.y + ballSize,
  };

  //get left paddle
  let leftPaddle = {
    left: paddleOffset,
    right: paddleOffset + paddleWidth,
    top: leftPaddleTop,
    bottom: leftPaddleTop + paddleHeight,
  };

  //get right paddle
  let rightPaddle = {
    left: width - paddleOffset - paddleWidth,
    right: width - paddleOffset,
    top: rightPaddleTop,
    bottom: rightPaddleTop + paddleHeight,
  };

  if (checkPaddleCollision(leftPaddle, ball)) {
    let distanceFromTop = ball.top - leftPaddle.top;
    let distanceFromBottom = leftPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = Math.abs(xSpeed);
  } else if (checkPaddleCollision(rightPaddle, ball)) {
    let distanceFromTop = ball.top - rightPaddle.top;
    let distanceFromBottom = rightPaddle.bottom - ball.bottom;
    adjustAngle(distanceFromTop, distanceFromBottom);
    xSpeed = -Math.abs(xSpeed);
  }

  if (ball.bottom > height || ball.top < 0) {
    ySpeed = -ySpeed;
  }

  if (ball.left < 0) {
    rightScore++;
    initBall();
  } else if (ball.right > width) {
    leftScore++;
    initBall();
  }

  if (leftScore > 9) {
    gameOver = true;
  } else if (rightScore > 9) {
    won = true;
  }
}

function gameWon() {
  context.fillStyle = "GREEN";
  context.font = "30px monospace";
  context.textAlign = "center";
  context.fillText("YOU HAVE WON!", width / 2, height / 2);
}

function drawGameover() {
  context.fillStyle = "red";
  context.font = "30px monospace";
  context.textAlign = "center";
  context.fillText("GAME OVER", width / 2, height / 2);
}

function update() {
  ballPosition.x += xSpeed;
  ballPosition.y += ySpeed;
  followBall();
}

function gameLoop() {
  draw();
  update();
  checkCollision();
  if (gameOver === true) {
    draw();
    drawGameover();
  } else if(won === true){
    draw();
    gameWon();
  }else{
   setTimeout(gameLoop, 30);
  }
}
gameLoop();
