function add7(number){
    return number + 7;
}
console.log(add7(10));

function multiply(number, factor){
    return number * factor;
}

console.log(multiply(3,2));

function capitalize(string){
    firstLetterUpperCase = string[0].toUpperCase(); 
    restOfStringLowerCase = string.slice(1, string.length).toLowerCase(); 
    return  firstLetterUpperCase + restOfStringLowerCase;
}

console.log(capitalize("abcd"));
console.log(capitalize("ABCD"));
console.log(capitalize("aBcD"));

function lastLetter(string){
    return string[string.length-1];
}


console.log(lastLetter("ab"));
console.log(lastLetter("a"));
console.log(lastLetter(""));