//defining variables and names for elements
var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");
let a1 = new Audio('/assets/game-ball-tap.wav')
let a2 =new Audio('/assets/game-bonus.wav')

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "P1";
const rod2Name = "P2";

//ball speed and width and height
let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 2,
  ballSpeedY = 2;

let gameOn = false;

let windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;


//This function defines the player name and maximum score from local storage.
(function () {
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);

  if (rod === "null" || maxScore === "null") {
    alert("This is the first time you are playing this game. LET'S START");
    maxScore = 0;
    rod = "Rod1";
  } else {
    alert(rod + " has maximum score of " + maxScore * 100);
  }

  resetBoard(rod);
})();

//this function defines reset Board
function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

  // Lossing player gets the ball
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = 2;
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = -2;
  }

  score = 0;
  gameOn = false;
}

//to store wins to local server
function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(movement);
  resetBoard(rod);

  alert(
    rod +
      " wins with a score of " +
      score * 100 +
      ". Max score is: " +
      maxScore * 100
  );
}

//event listeners to play game buttons are A,D to move and Enter to start
window.addEventListener("keypress", function () {
  let rodSpeed = 20;

  let rodRect = rod1.getBoundingClientRect();

  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (event.code === "Enter") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      movement = setInterval(function () {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        rod1X = rod1.getBoundingClientRect().x;
        rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX; // Reverses the direction
        }

        // It specifies the center of the ball on the viewport
        let ballPos = ballX + ballDia / 2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;
          a1.play();
          

          // Check if the game ends
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            a2.play();
            storeWin(rod2Name, score);
           
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;
          a1.play();
          

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            a2.play();
            storeWin(rod1Name, score);
           
          }
        }
      }, 10);
    }
  }
});
