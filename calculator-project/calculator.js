function anyOperandEndWithPoint() {
    return firstOperand.at(-1) == "." || secondOperand.at(-1) == ".";
}

function operationReady() {
    return firstOperand != "" && currentOperator != "" && secondOperand != "";
}

function sinParteEnteraEnOperandoActual() {
    return (cursor == firstOperandPosition && firstOperand == "") || (cursor == secondOperandPosition && secondOperand == "");
}

function puntoUsadoPreviamente() {
    return (cursor == firstOperandPosition && firstOperand.includes(".")) || (cursor == secondOperandPosition && secondOperand.includes("."));
}

function updateDisplay(){
    return resultDisplay.textContent = firstOperand + currentOperator + secondOperand;
}

function throwErrorMessage(errorMessage){
    return resultDisplay.textContent = errorMessage;
}

function cleanOperandsAndOperator() {
    firstOperand = "";
    currentOperator = "";
    secondOperand = "";
}

function clearOperation(){
    cleanResultDisplay();
    cleanOperandsAndOperator();
}

function cleanResultDisplay() {
    return resultDisplay.textContent = "";
}

function getNumber(operandString){
    if (operandString[0] == "("){
        return (-1)*Number(operandString.slice(2, operandString.length -1));
    }
    return Number(operandString);
}

function applyRuleOfSigns(){    
    if (currentOperator == "+" && secondOperand[0] == "-") {
        secondOperand = secondOperand.slice(1);
    }
    else if (currentOperator == "+" && secondOperand[0] != "-") {
        currentOperator = "-";
    }
    else if (currentOperator == "-" && secondOperand[0] != "-") {
        currentOperator = "+";
    }
}

function applyParentheses(){
    if (secondOperand[0] == "(") {
        secondOperand = secondOperand.slice(2, secondOperand.length - 1);
    }
    else if (secondOperand[0] != "-") {
        secondOperand = `(-${secondOperand})`;
    }
}

function convertToNegativeSecondOperand() {
    if (currentOperator == "+" || currentOperator == "-"){
        return applyRuleOfSigns();
    }
    return applyParentheses();        
}

function convertToNegativeFirstOperand() {
    if (firstOperand[0] == "-"){
        firstOperand = firstOperand.slice(1);
    } 
    else{
        firstOperand = `-${firstOperand}`;
    } 
}

function convertToNegativeCurrentOperand(){
    if (cursor == firstOperandPosition){
        convertToNegativeFirstOperand();
    }   
    else if (cursor == secondOperandPosition){
        convertToNegativeSecondOperand();
    } 
    return updateDisplay();
}

function operate(operator, operand1, operand2){
    const op1 = getNumber(operand1);
    const op2 = getNumber(operand2);
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
            return "Error: División por cero, presione clear para iniciar otra operación";
        case "^":
            return op1 ** op2;
        case "%":
            if (op2 != 0){
                return op1 % op2;
            }
            return "Error: División por cero, presione clear para iniciar otra operación";
        default:
            return "Operador inválido/No soportado";
    }
}

function updateDigit(event){
    const digit = event.target.textContent;
    if (resultDisplay.textContent == "Ingrese una operación:" || displayingResult){
        cleanResultDisplay();
        displayingResult = false;
    }
    if (currentOperator != ""){
        secondOperand += digit;
        cursor = secondOperandPosition;
    }
    else{
        firstOperand += digit;
        cursor = firstOperandPosition;
    }
    return updateDisplay();
}

function updateOperator(event){
    currentOperator = event.target.textContent;
    if (operationReady()){
        firstOperand = operate(currentOperator, firstOperand, secondOperand);
        secondOperand = "";
    }
    else if (displayingResult){
        firstOperand = resultDisplay.textContent;
    }
    else if (anyOperandEndWithPoint()){
        return throwErrorMessage(agregarOperandosDespuesDePuntoErrorMessage);    
    }
    return updateDisplay();
}

function updateResult(event){
    if (operationReady()){
        resultDisplay.textContent = operate(currentOperator, firstOperand, secondOperand);
        displayingResult = true;    
        cleanOperandsAndOperator();
    }
}

function usePoint(event){
    if (puntoUsadoPreviamente()){
        return throwErrorMessage(utilizarPuntoMasDeUnaVezErrorMessage);
    }
    if (sinParteEnteraEnOperandoActual()){
        return throwErrorMessage(usarPuntoSinParteEnteraErrorMessage);
    }
    if (cursor == firstOperandPosition){
        firstOperand += ".";
    }
    else if (cursor == secondOperandPosition){
        secondOperand += ".";
    }
    return updateDisplay();
}

const resultDisplay = document.querySelector("#display-text");
const getResultButton = document.querySelector("#get-result-button");
const operatorButtons = document.querySelectorAll(".operator-button");
const digitButtons = document.querySelectorAll(".digits");
const clearButton = document.querySelector("#clear-button");
const negButton = document.querySelector("#negation-button");
const pointButton = document.querySelector("#point");

let displayingResult = false;
let firstOperand = "";
let secondOperand = "";
let currentOperator = "";
const firstOperandPosition = 0;
const operatorPosition = 1;
const secondOperandPosition = 2;
let cursor = firstOperandPosition;

const utilizarPuntoMasDeUnaVezErrorMessage = `Error: No se permite usar operador punto más de una vez en un operando`;
const usarPuntoSinParteEnteraErrorMessage = "Error: No se permite agregar un punto sin antes ingresar una parte entera";
const agregarOperandosDespuesDePuntoErrorMessage = `Error: Debe introducir digitos en la parte decimal si utiliza ".""`;

operatorButtons.forEach(operatorButton => (operatorButton.addEventListener("click", updateOperator)));

digitButtons.forEach(digitButton => (digitButton.addEventListener("click", updateDigit)))

getResultButton.addEventListener("click", updateResult);

clearButton.addEventListener("click", clearOperation);

negButton.addEventListener("click", convertToNegativeCurrentOperand);
    
pointButton.addEventListener("click", usePoint);