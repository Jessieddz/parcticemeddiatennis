let playerRacketImg, catImg, catRacketImg;
let hitSound, endSound;
let angleSlider;

let ballX, ballY;
let direction = true;
let p = 0, k = 0, i = 25;
let score = 0;
let gameStarted = false;
let showGameOver = false;

let dragging = false;
let offsetX = 0, offsetY = 0;
let racketPos;
let linkImage;


let catX, catY;

function preload() {
  playerRacketImg = loadImage("img/tennisp.png");
  catImg = loadImage("img/19a88f5def820ccdd643b69cd0f6149.png");
  catRacketImg = loadImage("img/tennisp2.png");
  hitSound = loadSound("sound/soundforcat.mp3");
  endSound = loadSound("sound/endsound.mp3");
}

function setup() {
 let canvas= createCanvas(windowWidth, windowHeight);
 canvas.parent('canvas-pa');
  colorMode(HSB);
  angleMode(DEGREES);
  frameRate(60);

  racketPos = {
    x: windowWidth * 0.08,
    y: windowHeight * 0.62
  };
  catX = windowWidth * 0.76;
  catY = windowHeight * 0.9;
  ballX = racketPos.x + 100;
  ballY = racketPos.y - 140;

  angleSlider = createSlider(-3, 3, 0, 0.1);
  angleSlider.position(windowWidth * 0.07, windowHeight * 0.89);
  angleSlider.input(() => {
    k = angleSlider.value();
  });

  let startBtn = createButton("Click to Start Serve");
  startBtn.position(windowWidth * 0.015, windowHeight * 0.11);
  
  startBtn.mousePressed(() => {
    gameStarted = true;
    showGameOver = false;
    // racketPos.x = windowWidth * 0.08;整个暂时不加
    // racketPos.y = windowHeight * 0.62;
    catX = windowWidth * 0.76;
    catY = windowHeight * 0.9;
    ballX = racketPos.x + 100;
    ballY = racketPos.y - 140;
    direction = true;
    score = 0;
    k = angleSlider.value();
    p = 0;
  });

  let linkImage = createButton('Return to the game page');
linkImage.position(windowWidth * 0.015, windowHeight * 0.15);  
linkImage.mousePressed(() => {
  window.open('index.html'); 
});
linkImage.style('windowHeight * 0.035');
linkImage.style('padding', '5px 5px');
linkImage.style('background-color', '#ffff');
linkImage.style('border', 'none');
linkImage.style('border-radius', '2px');
linkImage.style('cursor', 'pointer');

}

function draw() {
  background(0, 60, 60);
  push();
  drawCourt();
  pop();

  

  fill(0);
  textSize(windowHeight * 0.05);
  text("Score: " + score, windowWidth * 0.015, windowHeight * 0.08);

  let targetCatY = ballY - (100 - 200);
  catY += (targetCatY - catY) * 0.7;

  image(playerRacketImg, racketPos.x + 10, racketPos.y - 220, 200, 320);
  image(catImg, catX - 95, catY - 120, 300, 300);
  image(catRacketImg, catX + 130, catY - 240, 200, 320);

  fill(0, 100, 100);
  noStroke();
  circle(racketPos.x + 100, racketPos.y -140, 10);

  fill(200, 80, 255);
  noStroke();
  circle(catX + 280, catY - 140, 10);

  if (gameStarted) {
    playRally();
  } else {
    textSize(windowHeight * 0.035);
   fill(0,0,0);
    text("Click 'Start Serve' to begin", windowWidth * 0.68, windowHeight * 0.09);
    drawBall(racketPos.x + 100, racketPos.y - 140);
  }

  if (showGameOver) {
    textSize(windowHeight * 0.08);
    fill(0, 60, 60);
    text("Game Over...", windowWidth * 0.18, windowHeight * 0.5);
    textSize(windowHeight * 0.04);
    text("Well done! Your reaction score ：" + score, windowWidth * 0.5, windowHeight * 0.5);
  }
}

function drawCourt() {
  let wrate = windowWidth / 800;  
  let wratei = windowHeight / 600;

  stroke(300);
  strokeWeight(2 * wrate);
  fill(100, 50, 70);

  rect(35 * wrate, 85 * wratei, 730 * wrate, 430 * wratei);
  rect(50 * wrate, 100 * wratei, 700 * wrate, 400 * wratei);
  rect(50 * wrate, 150 * wratei, 700 * wrate, 300 * wratei);
  rect(200 * wrate, 150 * wratei, 400 * wrate, 300 * wratei);
  line(200 * wrate, 300 * wratei, 600 * wrate, 300 * wratei);

  push();
  translate(350 * wrate, 75 * wratei);
  stroke(0);
  strokeWeight(1 * wrate);
  noFill();

  let xwang = 0;
  let ywang = 0;
  let yCounter = 0;

  for (let netX = 0; netX < 51; netX += 5) {
    let xStart = netX * wrate;
    line(xStart, 0 + xwang * wratei, xStart, 454 * wratei - xwang * wratei);
    xwang += 4;
  }

  for (let netY = 0; netY < 450; netY += 5) {
    let yPos = netY * wratei;
    line(0, yPos, abs(ywang) * 6 * wrate + 1, yPos);
    yCounter++;
    if (ywang <= 7) ywang++;
    if (yCounter > 83) ywang -= 2;
  }

  stroke(100);
  strokeWeight(4 * wrate);
  line(50 * wrate, 40 * wratei, 50 * wrate, 410 * wratei);

  stroke(100, 40, 40);
  strokeWeight(8 * wrate);
  line(0, 0, 50 * wrate, 40 * wratei);
  line(0, 451 * wratei, 50 * wrate, 410 * wratei);
  pop();
}

function playRally() {
  if (direction) {
    ballX += i;
    ballY += p + k;

    let catHitX = catX + 280;
    let catHitY = catY - 140;

    if (
      abs(ballX - catHitX) < 60 &&
      abs(ballY - catHitY) < 60
    ) {
      direction = false;
      let targetY = constrain(ballY + random(-100, 100), 150, 450);
      p = constrain((targetY - ballY) * 0.03 + random(-0.3, 0.3), -5, 5);
      score++;
      if (hitSound.isLoaded()) hitSound.play();
    }
  } else {
    ballX -= i;
    ballY += p + k;

    let racketCenterX = racketPos.x + 100;
    let racketHeadY = racketPos.y - 140;

    if (
      abs(ballX - racketCenterX) < 60 &&
      abs(ballY - racketHeadY) < 60
    ) {
      direction = true;
      let catTargetY = ballY + random(-100, 100);
      p = constrain((catTargetY - ballY) * 0.03 + random(-0.3, 0.3), -5, 5);
      k = random(-0.6, 0.6); 
      score++;
      if (hitSound.isLoaded()) hitSound.play();
    }
  }


if (ballX < 0 || ballX > width || ballY < 100 || ballY > height - 100) {
  gameOver();
}


  drawBall(ballX, ballY - 10);
}

function drawBall(x, y) {
  push();
  translate(x, y);
  rotate(10 * frameCount);
  noStroke();
  fill(70, 70, 95);
  circle(0, 0, 30);
  stroke(255);
  strokeWeight(3);
  noFill();
  arc(-10, 0, 30, 30, 330, 40);
  arc(10, 0, 30, 30, 160, 210);
  pop();
}

function gameOver() {
  gameStarted = false;
  showGameOver = true;
  if (endSound && endSound.isLoaded()) {
    endSound.play();
  }
}

function mousePressed() {
  const racketW = 200;
  const racketH = 320;
  if (
    mouseX >= racketPos.x &&
    mouseX <= racketPos.x + racketW &&
    mouseY >= racketPos.y &&
    mouseY <= racketPos.y + racketH
  ) {
    dragging = true;
    offsetX = mouseX - racketPos.x;
    offsetY = mouseY - racketPos.y;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging) {
    racketPos.x = constrain(mouseX - offsetX, 0, width - 200);
    racketPos.y = constrain(mouseY - offsetY, 80, height - 130);
  }
}


// 不要被遮挡
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  racketPos = {
    x: windowWidth * 0.08,
    y: windowHeight * 0.62
  };
  catX = windowWidth * 0.82;
  catY = windowHeight * 0.82;
  angleSlider.position(windowWidth * 0.07, windowHeight * 0.89);
   linkImage.position(windowWidth * 0.015, windowHeight * 0.15);
}
