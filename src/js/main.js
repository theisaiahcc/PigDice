var total = 0;
function rollDice() {
    get("dice").classList.remove("red");
    get("dice").value = "";
    setTimeout(function () {
        var num = generateNum();
        get("dice").value = "" + num;
        if (num == 1) {
            get("dice").classList.add("red");
            nextTurn();
        }
        else {
            total += num;
            displayTotal();
        }
    }, 400);
}
function generateNum() {
    return Math.floor(Math.random() * 6) + 1;
}
function passTurn() {
    var playerOne = get("player-one");
    if (playerOne.classList.contains("active")) {
        var currScore = parseInt(get("score-one").innerText);
        currScore += total;
        get("score-one").innerText = "" + currScore;
        if (scoreWins(currScore)) {
            get("message").innerText = "Player 1 wins!";
        }
        else {
            nextTurn();
        }
    }
    else {
        var currScore = parseInt(get("score-two").innerText);
        currScore += total;
        get("score-two").innerText = "" + currScore;
        if (scoreWins(currScore)) {
            get("message").innerText = "Player 2 wins!";
        }
        else {
            nextTurn();
        }
    }
}
function nextTurn() {
    if (nextTurn.caller != passTurn) {
        get("message").innerText = "You rolled a one. Switching players...";
    }
    else {
        get("message").innerText = "Switching players...";
    }
    get("new-game").disabled = true;
    get("roll").disabled = true;
    get("pass").disabled = true;
    setTimeout(changePlayers, 1150);
    function changePlayers() {
        var playerOne = get("player-one");
        var playerTwo = get("player-two");
        if (playerOne.classList.contains("active")) {
            playerOne.classList.remove("active");
            playerTwo.classList.add("active");
        }
        else {
            playerTwo.classList.remove("active");
            playerOne.classList.add("active");
        }
        total = 0;
        displayTotal();
        get("message").innerText = "";
        setTimeout(function () {
            get("new-game").disabled = false;
            get("roll").disabled = false;
            get("pass").disabled = false;
        }, 300);
    }
}
function get(id) {
    return document.getElementById(id);
}
window.onload = function () {
    get("roll").onclick = rollDice;
    get("pass").onclick = passTurn;
    get("new-game").onclick = newGame;
};
function displayTotal() {
    get("total").innerText = "" + total;
}
function newGame() {
    var playerOne = get("player-one");
    var playerTwo = get("player-two");
    playerTwo.classList.remove("active");
    playerOne.classList.add("active");
    get("score-one").innerText = "0";
    get("score-two").innerText = "0";
    total = 0;
    displayTotal();
    get("message").innerText = "";
}
function scoreWins(n) {
    return n > 100;
}
