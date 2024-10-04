import { backend } from 'declarations/backend';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const highScoresList = document.getElementById('highScoresList');

canvas.width = 800;
canvas.height = 400;

const player = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    jumping: false,
    jumpHeight: 100,
    jumpSpeed: 5
};

let obstacles = [];
let score = 0;
let gameLoop;
let obstacleSpeed = 5;

const platypusImage = new Image();
platypusImage.src = 'https://images.unsplash.com/photo-1631629571979-1c82e81c7cee?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawPlatypus() {
    ctx.drawImage(platypusImage, canvas.width - 200, 50, 150, 100);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (player.jumping) {
        player.y -= player.jumpSpeed;
        if (player.y <= canvas.height - player.height - player.jumpHeight) {
            player.jumping = false;
        }
    } else if (player.y < canvas.height - player.height) {
        player.y += player.jumpSpeed;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= obstacleSpeed;
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 30,
            width: 30,
            height: 30
        });
    }

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    if (checkCollision()) {
        gameOver();
        return;
    }

    score++;
    scoreElement.textContent = score;

    drawPlayer();
    drawObstacles();
    drawPlatypus();
}

function checkCollision() {
    return obstacles.some(obstacle => 
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
    backend.addScore(score);
    updateHighScores();
}

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    highScoresList.innerHTML = '';
    highScores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        highScoresList.appendChild(li);
    });
}

function startGame() {
    player.y = canvas.height - player.height;
    obstacles = [];
    score = 0;
    scoreElement.textContent = '0';
    gameOverElement.classList.add('hidden');
    gameLoop = setInterval(updateGame, 1000 / 60);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !player.jumping && player.y === canvas.height - player.height) {
        player.jumping = true;
    }
});

restartButton.addEventListener('click', startGame);

updateHighScores();
startGame();
