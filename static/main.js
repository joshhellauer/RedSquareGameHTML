document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("canvas-container");
  const canvas = document.getElementById("sig-canvas");
  const newGame = document.getElementById("new-game-button");
  const displayWidth = container.clientWidth;
  const displayHeight = container.clientHeight;
  //
  let gameSquaresArr = [];
  let gameOver = false;
  let gameRunning = false;
  let redMoving = true; // boolean for if the player is holding the red square
  let lastMousePos = { x: 0, y: 0 };
  let speedMultiplier = 1;
  let speedMultiplierApplied = false;
  //
  const AMOUNT_OF_ENEMIES = 4;
  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";
  canvas.width = displayWidth;
  canvas.height = displayHeight;
  const ctx = canvas.getContext("2d");

  class GameSquare {
    constructor(x, y, width, height, color, velocityX, velocityY) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.velocityX = velocityX;
      this.velocityY = velocityY;
    }
    // only called for red
    updateRed(mousePos) {
      //ctx.clearRect(this.x, this.y, this.width, this.height);
      this.x = mousePos.x;
      this.y = mousePos.y;
    }
    //only called for blues
    update() {
      //ctx.clearRect(this.x, this.y, this.width, this.height);
      // check if we need to change dirn
      if (
        parseInt(stopwatch.textContent.split(":")[2], 10) >= 5 &&
        !speedMultiplierApplied
      ) {
        speedMultiplier += 3;
        speedMultiplierApplied = true;
      }
      if (this.x <= 0) this.velocityX = Math.random() + 4 + speedMultiplier;
      else if (this.x + this.width >= canvas.width)
        this.velocityX = Math.random() - 5 - speedMultiplier;
      if (this.y <= 0) this.velocityY = Math.random() + 4 + speedMultiplier;
      else if (this.y + this.width >= canvas.height)
        this.velocityY = Math.random() - 5 - speedMultiplier;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    containsPosition(mousePos) {
      if (
        mousePos.x <= gameSquaresArr[0].x + gameSquaresArr[0].width &&
        mousePos.x >= gameSquaresArr[0].x &&
        mousePos.y >= gameSquaresArr[0].y &&
        mousePos.y <= gameSquaresArr[0].y + gameSquaresArr[0].height
      ) {
        return true;
      }
    }
  }

  canvas.addEventListener("click", (event) => {
    const mousePos = getMousePosition(canvas, event);
    lastMousePos = mousePos;
    if (gameSquaresArr[0].containsPosition(mousePos) && !gameRunning) {
      startTime = Date.now();
      running = true;
      updateStopwatch();
      // Update the stopwatch every second
      setInterval(updateStopwatch, 10);

      redMoving = true;
      gameRunning = true;
      console.log("game runng");
    }
  });

  canvas.addEventListener("mousemove", (event) => {
    if (gameRunning && redMoving) {
      lastMousePos = getMousePosition(canvas, event);
    }
  });

  newGame.addEventListener("click", initialize);

  let startTime;
  // Start button click event
  canvas.addEventListener("click", () => {
    if (!gameRunning) {
      startTime = Date.now();
      running = true;
      updateStopwatch();
      // Update the stopwatch every second
      setInterval(updateStopwatch, 10);
    }
  });

  function getMousePosition(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }

  function updateStopwatch() {
    if (gameRunning) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const hours = Math.floor(elapsedTime / 3600000);
      const minutes = Math.floor((elapsedTime % 3600000) / 60000);
      const seconds = Math.floor((elapsedTime % 60000) / 1000);
      const milliseconds = Math.floor((elapsedTime % 1000) / 10);
      stopwatch.textContent = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(
        milliseconds
      ).padStart(2, "0")}`;
    }
  }

  function initialize() {
    // push the player square first
    speedMultiplier = 1;
    speedMultiplierApplied = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameSquaresArr = [];
    gameOver = false;
    gameRunning = false;
    gameSquaresArr.push(
      new GameSquare(canvas.width / 2, canvas.width / 2, 50, 50, "red", 0, 0)
    );
    const blueSquareData = [
      {
        x: 0,
        y: 0,
        width: 60,
        height: 25,
      },
      {
        width: 50,
        height: 60,
        x: canvas.width - 50,
        y: 0,
      },
      {
        width: 50,
        height: 50,
        x: 0,
        y: canvas.height - 50,
      },
      {
        width: 25,
        height: 60,
        x: canvas.height - 25,
        y: canvas.height - 60,
      },
    ];
    for (let i = 0; i < AMOUNT_OF_ENEMIES; i++) {
      const x = (i % 2) * canvas.width;
      const y = (i % 2) * canvas.width;
      gameSquaresArr.push(
        new GameSquare(
          blueSquareData[i].x,
          blueSquareData[i].y,
          blueSquareData[i].width,
          blueSquareData[i].height,
          "blue",
          Math.random() * 4 - 1,
          Math.random() * 4 - 1
        )
      );
    }
    for (let square of gameSquaresArr) {
      square.draw();
    }
  }
  initialize();
  // create blue squares and animate

  let lastUpdateTime = 0;
  const updateInterval = 16; // Update every 16 milliseconds (approximately 60 FPS)

  function checkGameOver() {
    const redSquare = gameSquaresArr[0];
    for (let i = 1; i < gameSquaresArr.length; i++) {
      const otherSquare = gameSquaresArr[i];

      if (
        redSquare.x < otherSquare.x + otherSquare.width &&
        redSquare.x + redSquare.width > otherSquare.x &&
        redSquare.y < otherSquare.y + otherSquare.height &&
        redSquare.y + redSquare.height > otherSquare.y
      ) {
        gameRunning = false;
        gameOver = true;
        console.log("game over");
      }
    }
  }

  function animate(currentTime) {
    requestAnimationFrame(animate);
    if (gameRunning) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (
        redMoving &&
        gameRunning &&
        currentTime - lastUpdateTime >= updateInterval
      ) {
        gameSquaresArr[0].updateRed(lastMousePos);
        gameSquaresArr[0].draw();
        lastUpdateTime = currentTime;
      }
      for (let i = 1; i < gameSquaresArr.length; i++) {
        gameSquaresArr[i].update();
        gameSquaresArr[i].draw();
      }
      checkGameOver();
    } else if (gameOver) {
      ctx.font = "48px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(
        "GAME OVER",
        canvas.width / 2 - 100,
        canvas.height / 2 - 100
      );
      ctx.fillText(
        `You lasted: ${parseInt(
          stopwatch.textContent.split(":")[2],
          10
        )} seconds`,
        canvas.width / 2 - 200,
        canvas.height / 2 - 50,
        400
      );
    }
  }
  animate(performance.now());
});
