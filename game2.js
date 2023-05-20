document.addEventListener('DOMContentLoaded', () => {

    // Add event listener for keydown event
    document.addEventListener("keydown", (event) => {
    // Check if the pressed key is an arrow key
    if (event.key.includes("Arrow")) {
        event.preventDefault(); // Prevent default scrolling behavior
    }
    });
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    // Set up initial game variables
    const gridSize = 20;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;

    let snake = [
        { x: 6, y: 4 },
        { x: 5, y: 4 },
        { x: 4, y: 4 }
    ];
    let food = generateFood();

    let dx = 1;
    let dy = 0;

    let score = 0;

    const gameContainer = document.querySelector('.game-container');
    const gameOverMessage = document.querySelector('.game-over-message');
    const restartButton = document.querySelector('.restart-button');

    // Handle keyboard arrow key presses
    document.addEventListener('keydown', changeDirection);

    function changeDirection(event) {
        const keyPressed = event.keyCode;
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingLeft = dx === -1;
        const goingRight = dx === 1;

        if (keyPressed === 37 && !goingRight) {
            dx = -1;
            dy = 0;
        }

        if (keyPressed === 38 && !goingDown) {
            dx = 0;
            dy = -1;
        }

        if (keyPressed === 39 && !goingLeft) {
            dx = 1;
            dy = 0;
        }

        if (keyPressed === 40 && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    function drawSnake() {
        snake.forEach(drawSnakePart);
    }

    function drawSnakePart(snakePart) {
        context.fillStyle = 'green';
        context.fillRect(
            snakePart.x * gridSize,
            snakePart.y * gridSize,
            gridSize,
            gridSize
        );
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            // Snake ate the food, generate a new food position and increase score
            food = generateFood();
            score++;
        } else {
            // Remove the tail segment to maintain snake length
            snake.pop();
        }
    }

    function generateFood() {
        return {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    }

    function drawFood() {
        context.fillStyle = 'red';
        context.fillRect(
            food.x * gridSize,
            food.y * gridSize,
            gridSize,
            gridSize
        );
    }

    function drawScore() {
        context.fillStyle = 'black';
        context.font = '20px Arial';
        context.fillText('Score: ' + score, 20, 40);
    }

    function checkCollision() {
        const head = snake[0];

        // Check if the snake hits the walls
        if (
            head.x < 0 ||
            head.x >= gridWidth ||
            head.y < 0 ||
            head.y >= gridHeight
        ) {
            return true;
        }

        // Check if the snake hits its own body
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }

        return false;
    }

    function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawGame() {
        clearCanvas();
        drawSnake();
        drawFood();
        drawScore();

        if (checkCollision()) {
            clearInterval(gameInterval);
            displayGameOverMessage();
        }

        moveSnake();
    }

    function displayGameOverMessage() {
        gameOverMessage.textContent = 'Game Over!'
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
    }

    function restartGame() {
        snake = [
            { x: 6, y: 4 },
            { x: 5, y: 4 },
            { x: 4, y: 4 }
        ];
        food = generateFood();
        score = 0;

        dx = 1;
        dy = 0;

        gameOverMessage.style.display = 'none';
        restartButton.style.display = 'none';

        gameInterval = setInterval(drawGame, 150);
    }

    restartButton.addEventListener('click', restartGame);

    let gameInterval = setInterval(drawGame, 150);
});