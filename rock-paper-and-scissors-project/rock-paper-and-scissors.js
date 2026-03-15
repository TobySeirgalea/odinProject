function getComputerChoice(){
    return options[Math.floor(Math.random() * 3)];
}

function validHumanChoice(humanChoice){
    return options.includes(humanChoice);
}

function isRock(choice){
    return choice == "Rock";
}

function isScissors(choice){
    return choice == "Scissors";
}

function isPaper(choice){
    return choice == "Paper";
}

function humanWins(humanChoice, computerChoice){
    if ((isRock(humanChoice) && isScissors(computerChoice)) 
        || (isScissors(humanChoice) && isPaper(computerChoice))
    || (isPaper(humanChoice) && isRock(computerChoice))){
        return 1;
    }
    return 0;
}

function getRoundResult(humanChoice, computerChoice){
    let roundResult;
    if (humanWins(humanChoice, computerChoice)){
        return 1;
    }
    return 2;
}

function updateScore(playerToUpdateScore){
    if (playerToUpdateScore == "Jugador"){
        humanScoreParagraph.textContent = "Puntaje jugador: " + humanScore; 
    }
    else if (playerToUpdateScore == "Computadora"){
        computerScoreParagraph.textContent = "Puntaje computadora: " + computerScore;
    }
}

function informarGanador(){
    return (computerScore == 5) ? alert("Computador ha ganado") : alert("Has ganado");
}

function reiniciarJuego(){
    humanScore = 0;
    computerScore = 0;
    computerScoreParagraph.textContent = "Puntaje computadora: 0";
    humanScoreParagraph.textContent = "Puntaje jugador: 0";
    roundResultParagraph.textContent = "Resultado de ronda: "
}

function updateRoundResult(humanChoice, computerChoice, ganadorRonda){
    roundResultParagraph.textContent = "Resultado de ronda => Elección jugador: " + humanChoice + "| Elección computadora: " + computerChoice + "| Ganador de ronda: " + ganadorRonda;
}

function playRound(humanChoice, computerChoice){
    let ganadorRonda = "Ninguno";
    if( humanChoice != computerChoice){
        roundResult = getRoundResult(humanChoice, computerChoice);
        if (roundResult == 1){
            humanScore += 1;
            ganadorRonda = "Jugador"
        }
        else if (roundResult == 2){
            computerScore += 1;
            ganadorRonda = "Computadora";
        }
    }
    updateScore(ganadorRonda);
    updateRoundResult(humanChoice, computerChoice, ganadorRonda);
    if (computerScore == 5 || humanScore == 5){
        informarGanador();
        reiniciarJuego();
    }
}

const options = ["Rock", "Paper", "Scissors"];
let humanScore = 0;
let computerScore = 0;
const humanScoreParagraph = document.querySelector("#humanScore");
const computerScoreParagraph = document.querySelector("#computerScore");
const roundResultParagraph = document.querySelector("#roundResult");
const playerSelectionButtons = document.querySelectorAll("button");

for (const button of playerSelectionButtons){
    button.addEventListener("click", (event) => playRound(button.textContent, getComputerChoice()));
}