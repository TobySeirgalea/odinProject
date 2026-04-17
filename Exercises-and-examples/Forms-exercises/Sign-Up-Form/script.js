function confirmPassword(event){
    const desiredPassword = passwordInput.value;
    const confirmedPassword = confirmPasswordInput.value;
    if (desiredPassword == confirmedPassword){
        confirmPasswordInput.setCustomValidity("");
    }
    else{
        confirmPasswordInput.setCustomValidity("Las contraseñas no coinciden.");
    }
}

function updateSatisfiedConstraints(event){
    const userDesiredInput = event.target.value;
    
    checkMinimumLength(userDesiredInput);

    checkAtLeastOneUpperCase(userDesiredInput);

    checkAtLeastOneLowerCase(userDesiredInput);

    checkAtLeastOneNumber(userDesiredInput);

    checkAtLeastOneSpecialSymbol(userDesiredInput);

    if (satifiedConstraints.every(elem => elem)){
        passwordInput.reportValidity();
    }
}

function checkAtLeastOneSpecialSymbol(userDesiredInput) {
    return checkIfInputMeetsCondition(userDesiredInput, 4, () => checkIfAny(userDesiredInput, isAnSpecialSymbol));
}

function checkIfInputMeetsCondition(userDesiredInput, conditionNumber, predicate) {
    const meetsCondition = predicate(userDesiredInput);
    if (!satifiedConstraints[conditionNumber] && meetsCondition) {
        passwordConstraints[conditionNumber].classList.add("correct");
        satifiedConstraints[conditionNumber] = true;
    }
    else if (!meetsCondition) {
        passwordConstraints[conditionNumber].classList.remove("correct");
        satifiedConstraints[conditionNumber] = false;
    }
}

function checkAtLeastOneNumber(userDesiredInput) {
    return checkIfInputMeetsCondition(userDesiredInput, 3, () => checkIfAny(userDesiredInput, isANumber));
}

function checkAtLeastOneLowerCase(userDesiredInput) {
    return checkIfInputMeetsCondition(userDesiredInput, 2, () => userDesiredInput.toLowerCase() !== userDesiredInput);
}

function checkAtLeastOneUpperCase(userDesiredInput) {
    return checkIfInputMeetsCondition(userDesiredInput, 1, () => userDesiredInput.toUpperCase() !== userDesiredInput);
}

function checkMinimumLength(userDesiredInput) {
    return checkIfInputMeetsCondition(userDesiredInput, 0, () => userDesiredInput.length >= 8);
}

function isANumber(symbol){
    return digits.includes(symbol);
}

function isAnSpecialSymbol(symbol){
    return specialSymbols.includes(symbol);
}

function checkIfAny(desiredPassword, predicate){
    let answer = false;
    for (let i = 0; i < desiredPassword.length; i++){
        answer |= predicate(desiredPassword[i]);
    }
    return answer;
}

let satifiedConstraints = [false, false, false, false, false];
const digits = ["1", "2","3","4","5","6","7","8","9","0"];
const specialSymbols = ["!","@", "#", "$", "%", "^", "&", "*", "(", ")","_", "+", "-", "=", "[", "<", ">","/", "?", "¿", "¡"];

const passwordConstraints = document.querySelectorAll(".password-constraint");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");

passwordInput.addEventListener("input", updateSatisfiedConstraints);

passwordInput.addEventListener("input", confirmPassword);

confirmPasswordInput.addEventListener("input", confirmPassword)
