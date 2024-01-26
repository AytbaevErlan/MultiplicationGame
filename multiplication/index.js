let num1, num2, correctAns;
let customerName;
let remainingLives = 3;
let timeLimit = 10;
let timer;
let currentLevel = 1; // Initialize the current level
let score = 0;

const questionEL = document.getElementById("question");
const inputEl = document.getElementById("input");
const formEl = document.getElementById("form");
const scoreEl = document.getElementById("score"); // Added this line
const livesEl = document.getElementById("lives");
const timerEl = document.getElementById("timer");
const changeNameButton = document.getElementById("changeNameButton");
const levelEl = document.getElementById("level"); // Added this line

// Retrieve the customer name from local storage, if available
customerName = localStorage.getItem("customerName");

// If no customer name is found, prompt for one
if (!customerName) {
    customerName = prompt("Please enter your name", "");
    localStorage.setItem("customerName", customerName);
}

startGame();

function startGame() {
    nextQuestion();

    if (!score) {
        score = 0;
    }

    scoreEl.innerText = `Score: ${score}`;
    livesEl.innerText = `Lives: ${remainingLives}`;
    updateLevel();

    formEl.addEventListener("submit", (event) => {
        event.preventDefault();

        const userAns = +inputEl.value;

        if (userAns === correctAns) {
            score++;

            if (score % 5 === 0) {
                currentLevel++;
                updateLevel();

                if (currentLevel == 2) {
                    timeLimit = 8;
                } else if (currentLevel == 3) {
                    timeLimit = 5;
                } else if (currentLevel >= 4) {
                    timeLimit = 3;
                }

            }

            clearTimeout(timer);
            updateLocalStorage();
            nextQuestion();
        } else {
            remainingLives--;

            if (remainingLives === 0) {
                alert("Game Over!");
                showGameOverModal();
            } else {
                updateLocalStorage();
            }
        }
    });

    function updateLocalStorage() {
        localStorage.setItem("score", JSON.stringify(score));
        localStorage.setItem("lives", JSON.stringify(remainingLives));
        localStorage.setItem("level", JSON.stringify(currentLevel)); // Corrected this line to use currentLevel
        scoreEl.innerText = `Score: ${score}`;
        livesEl.innerText = `Lives: ${remainingLives}`;
    }

    function resetGame() {
        remainingLives = 3;
        score = 0;
        currentLevel = 1; // Reset the level to 1
        updateLocalStorage();
        nextQuestion();
        hideGameOverModal();
    }

    changeNameButton.addEventListener("click", () => {
        customerName = prompt("Would you like to change your name? (Enter 'yes' to change)");
        localStorage.setItem("customerName", customerName);
        currentLevel++; // Increment the level
        updateLevel(); // Update the displayed level
        resetGame();
    });

    function nextQuestion() {
        clearTimeout(timer);
        num1 = Math.ceil(Math.random() * 10);
        num2 = Math.ceil(Math.random() * 10);
        correctAns = num1 * num2;
        updateQuestion();
        inputEl.value = "";
    }

    function updateLevel() {
        levelEl.innerText = `Level: ${currentLevel}`;
    }

    function updateQuestion() {
        questionEL.innerText = `What is ${num1} multiplied by ${num2}, ${customerName}?`;

        function countdown() {
            timeRemaining--;
            timerEl.innerText = `Time: ${timeRemaining}`;

            if (timeRemaining === 0) {
                showGameOverModal();
                remainingLives--;

                if (remainingLives === 0) {
                    alert("Game Over!");
                    resetGame();
                } else {
                    updateLocalStorage();
                    nextQuestion();
                }
            } else {
                timer = setTimeout(countdown, 1000);
            }
        }

        let timeRemaining = timeLimit;
        timerEl.innerText = `Time: ${timeRemaining}`;
        timer = setTimeout(countdown, 1000);
    }

}

function showGameOverModal() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "flex";
    localStorage.removeItem("score");

    setTimeout(() => {
        location.reload();
    }, 2000);
}

function hideGameOverModal() {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
}
document.getElementById("closeGameOver").addEventListener("click", function() {
    hideGameOverModal();
});