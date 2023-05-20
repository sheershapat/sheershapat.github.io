// Represents the Tic Tac Toe game board
var board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

// Defines the winning combinations
var winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// The human player is represented by 'X', and the AI by 'O'
var humanPlayer = 'X';
var aiPlayer = 'O';

// The entry point for the game
function startGame() {
  // Add event listeners to the game board cells
  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', cellClickHandler, false);
  }
}

// Event handler for cell click
function cellClickHandler(event) {
  var cellIndex = event.target.getAttribute('data-index');
  if (board[cellIndex] === ' ') {
    // Update the board with the human player's move
    board[cellIndex] = humanPlayer;
    event.target.innerText = humanPlayer;

    if (!checkGameOver()) {
      // If the game is not over, let the AI make a move
      makeAIMove();
    }
  }
}

// The AI makes a move
function makeAIMove() {
  var bestScore = -Infinity;
  var bestMove;

  for (var i = 0; i < board.length; i++) {
    if (board[i] === ' ') {
      board[i] = aiPlayer;
      var score = minimax(board, 0, false);
      board[i] = ' ';

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  board[bestMove] = aiPlayer;
  var cells = document.getElementsByClassName('cell');
  cells[bestMove].innerText = aiPlayer;

  checkGameOver();
}

// Minimax algorithm
function minimax(board, depth, isMaximizingPlayer) {
  var scores = {
    X: -10,
    O: 10,
    tie: 0
  };

  if (checkWin(humanPlayer)) {
    return scores.X - depth;
  } else if (checkWin(aiPlayer)) {
    return scores.O - depth;
  } else if (isBoardFull()) {
    return scores.tie;
  }

  if (isMaximizingPlayer) {
    var bestScore = -Infinity;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = aiPlayer;
        var score = minimax(board, depth + 1, false);
        board[i] = ' ';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    var bestScore = Infinity;
    for (var i = 0; i < board.length; i++) {
      if (board[i] === ' ') {
        board[i] = humanPlayer;
        var score = minimax(board, depth + 1, true);
        board[i] = ' ';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Checks if the game is over
function checkGameOver() {
  if (checkWin(humanPlayer)) {
    alert('You win!');
    resetGame();
    return true;
  } else if (checkWin(aiPlayer)) {
    alert('You lose!');
    resetGame();
    return true;
  } else if (isBoardFull()) {
    alert('It\'s a tie!');
    resetGame();
    return true;
  }
  return false;
}

// Checks if a player has won
function checkWin(player) {
  for (var i = 0; i < winningCombinations.length; i++) {
    var combo = winningCombinations[i];
    if (
      board[combo[0]] === player &&
      board[combo[1]] === player &&
      board[combo[2]] === player
    ) {
      return true;
    }
  }
  return false;
}

// Checks if the board is full
function isBoardFull() {
  return board.every(function (cell) {
    return cell !== ' ';
  });
}

// Resets the game
function resetGame() {
  board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
  }
}

// Start the game when the page is loaded
window.addEventListener('load', startGame, false);