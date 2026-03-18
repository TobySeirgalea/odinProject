function operate(operator, operand1, operand2){
    const op1 = Number(operand1);
    const op2 = Number(operand2);
    switch(operator){
        case "+":
            return op1 + op2;
        case "-":
            return op1 - op2;            
        case "*":
            return op1 * op2;
        case "/":
            if (op2 != 0){
                return op1 / op2;
            }
            return "Error división por cero";
        case "^":
            return op1 ** op2;
        case "%":
            if (op2 != 0){
                return op1 % op2;
            }
            return "Error división por cero";
        default:
            return "Operador inválido/No soportado";
    }
}

function isDigit(symbol){
    return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(symbol);
}

function isOperator(symbol){
    return ["+", "-", "*", "^", "/", "%"].includes(symbol);
}

function computeResult(event){
    if (currentOperation.operand0 != "" && currentOperation.operator != "" && currentOperation.operand1 != ""){
        currentOperation.result = operate(currentOperation.operator, currentOperation.operand0, currentOperation.operand1);
        currentOperation.operand0 = currentOperation.result;
        currentOperation.result = "";
        currentOperation.operand1 = "";
        currentOperation.operator = "";
        cursor = operatorPosition;
        updateDisplay();
    }
    else{
        resultDisplay.textContent = "Error, operación inválida";
    }
}

function updateDisplay(){
    resultDisplay.textContent = "";
    for (let field of ["operand0", "operator", "operand1"]){
        if (currentOperation[field] != undefined){
            resultDisplay.textContent += currentOperation[field];
        }
    }    
}

function updateOperationWithDigit(aDigit){
    if (cursor == firstOperandPosition){
        currentOperation.operand0 += aDigit; 
    }
    else if (cursor == operatorPosition){
        currentOperation.operand1 += aDigit;
        cursor = secondOperandPosition;
    }
}

function updateOperationWithOperator(operator){
    if (cursor == operatorPosition){
        currentOperation.operator = operator;
    }
    else if(cursor == firstOperandPosition || cursor == secondOperandPosition){
        if (cursor == secondOperandPosition){
            computeResult();
        }
        currentOperation.operator = operator;
        cursor = operatorPosition;
    }
    else{
        let errorMessage = "Solo puede reemplazar un operando con otro válido o un operador con otro válido";
        return resultDisplay.textContent= errorMessage;
    }

}

function negateOperand(){
    if (cursor == firstOperandPosition && currentOperation.operand0[0] != "-"){
        currentOperation.operand0 = `-${currentOperation.operand0}`;
    }
    else if (cursor == secondOperandPosition && currentOperation.operand1[0] != "-"){
        currentOperation.operand1 = `-${currentOperation.operand1}`;
    }
}

function updateInput(event){
    const userInput = event.target.textContent;
    if (isDigit(userInput)){
        updateOperationWithDigit(userInput);
    }
    else if (isOperator(userInput)){
        updateOperationWithOperator(userInput);
    }
    else if (userInput == "Neg" && (cursor == firstOperandPosition || cursor == secondOperandPosition)){
        negateOperand();
    }
    return updateDisplay();
}

function clear(){
    currentOperation = {operand0: "", operator: "", operand1: "", result: undefined};
    resultDisplay.textContent = "Ingrese una operación:";
    cursor = firstOperandPosition;
}

const resultDisplay = document.querySelector("#display-text");
const getResultButton = document.querySelector("#get-result-button");
const operatorButtons = document.querySelectorAll(".operator-button");
const digitButtons = document.querySelectorAll(".digits");
const clearButton = document.querySelector("#clear-button");
const firstOperandPosition = 0;
const secondOperandPosition = 2;
const operatorPosition = 1;

let currentOperation = {operand0: "", operator: "", operand1: "", result: undefined};
let cursor = firstOperandPosition;

clearButton.addEventListener("click", clear);

operatorButtons.forEach(operatorButton => (operatorButton.addEventListener("click", updateInput)));

digitButtons.forEach(digitButton => (digitButton.addEventListener("click", updateInput)))

getResultButton.addEventListener("click", computeResult);