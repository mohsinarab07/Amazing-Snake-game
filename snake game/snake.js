// Set up initial variables
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = 'right';
let score = 0;
let gameInterval;
let gameStarted = false;

// Resize canvas based on screen size
function resizeCanvas() {
  const width = window.innerWidth > 500 ? 500 : window.innerWidth - 20;
  const height = window.innerHeight > 500 ? 500 : window.innerHeight - 20;
  canvas.width = width;
  canvas.height = height;
}

// Draw the snake
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Update the game logic
function updateGame() {
  const head = { ...snake[0] };
  
  // Move the snake in the current direction
  if (direction === 'up') head.y -= 1;
  if (direction === 'down') head.y += 1;
  if (direction === 'left') head.x -= 1;
  if (direction === 'right') head.x += 1;
  
  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    food = { x: Math.floor(Math.random() * canvas.width / gridSize), y: Math.floor(Math.random() * canvas.height / gridSize) };
  } else {
    snake.pop();  // Remove the tail
  }

  // Add the new head to the snake
  snake.unshift(head);

  // Check for collisions with walls or self
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || collisionWithSelf(head)) {
    clearInterval(gameInterval);
    alert("Game Over! Final Score: " + score);
    resetGame();
  }

  // Clear canvas and redraw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

// Detect collision with snake's own body
function collisionWithSelf(head) {
  return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

// Change direction based on key press
function changeDirection(event) {
  if (event.key === "ArrowUp" && direction !== 'down') {
    direction = 'up';
  } else if (event.key === "ArrowDown" && direction !== 'up') {
    direction = 'down';
  } else if (event.key === "ArrowLeft" && direction !== 'right') {
    direction = 'left';
  } else if (event.key === "ArrowRight" && direction !== 'left') {
    direction = 'right';
  }
}

// Start the game
function startGame() {
  if (gameStarted) return;  // Prevent starting multiple games

  gameStarted = true;
  score = 0;
  snake = [{ x: 10, y: 10 }];
  food = { x: 15, y: 15 };
  direction = 'right';
  scoreDisplay.textContent = `Score: ${score}`;
  
  gameInterval = setInterval(updateGame, 100);
  window.addEventListener("keydown", changeDirection);
  startBtn.disabled = true; // Disable start button during game
}

// Reset the game
function resetGame() {
  gameStarted = false;
  startBtn.disabled = false;
}

// Listen for start button click
startBtn.addEventListener("click", startGame);

// Resize the canvas on window resize
window.addEventListener("resize", resizeCanvas);
resizeCanvas();  // Initial resize
