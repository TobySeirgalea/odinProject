function getComputerChoice(){
    return options[Math.floor(Math.random() * 3)];
}

function validHumanChoice(humanChoice){
    return options.includes(humanChoice);
}

function getHumanChoice(){
    let humanChoice; 
    first_try = true;
    mensaje = "Introduzca su elección:";
    while (!validHumanChoice(humanChoice)){
        humanChoice = prompt(mensaje).toLowerCase();
        if (first_try){
            mensaje = "El valor introducido no es válido \n" + mensaje;
            first_try = false;
        }
    }
    return humanChoice;
}


function isRock(choice){
    return choice == "rock";
}

function isScissors(choice){
    return choice == "scissors";
}

function isPaper(choice){
    return choice == "paper";
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

function playRound(humanChoice, computerChoice){
    if( humanChoice != computerChoice){
        roundResult = getRoundResult(humanChoice, computerChoice);
        if (roundResult == 1){
            humanScore += 1;
        }
        else if (roundResult == 2){
            computerScore += 1;
        }
    }else{ //Round withdraw;

    }
}

function playGame(){
    for(i=0; i<5; i++){
        playRound(getHumanChoice(), getComputerChoice());
    }
    if (humanScore > computerScore){
        console.log("Humano gana");
    }
    else if (computerScore > humanScore){
        console.log("Computadora gana");
    }
    else{
        console.log("Empate");
    }
}

const options = ["rock", "paper", "scissors"];
let humanScore = 0;
let computerScore = 0;

