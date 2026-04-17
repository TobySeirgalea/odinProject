function userEntersValidInput(userInput){
    return (userInput != null && !Number.isNaN(Number(userInput)) && userInput !== "") ? true : false; 
}

function sumInput(){
    const userInput = [];
    let input = prompt("Ingrese un número");
    while(userEntersValidInput(input)){
        userInput.push(Number(input));
        input = prompt("Ingrese un número");
    }
    return userInput.reduce(
        (sum, currElem) => {
            return sum + currElem
        }, 0);
}


function getMaxSubSum(arr){
    max = 0;
    currMaxContinuos = 0;
    currMaxNonContinuos = 0;
    for (const elem of arr){
      currMaxContinuos = Math.max(currMaxContinuos + elem, elem); //Extender el anterior o iniciar uno nuevo
      currMaxNonContinuos = Math.max(currMaxNonContinuos, elem);
      max  = Math.max(max, currMaxContinuos, currMaxNonContinuos);
    }
  return max;
}


const container = document.getElementById("container");
const paragraph = document.createElement("p");
const h3 = document.createElement("h3");
const div = document.createElement("div");
const h1 = document.createElement("h1");
const innerParagraph = document.createElement("p");


paragraph.textContent = "Hey I'm red!";
paragraph.style.backgroundColor = "red";
h3.style.color = "blue";
h3.textContent = "I'm a blue h3!";
div.style.border = "2px solid black";
div.style.backgroundColor = "pink";
h1.textContent = "I'm in a div";
innerParagraph.textContent = "ME TOO!"

div.appendChild(h1);
div.appendChild(innerParagraph);
container.appendChild(paragraph);
container.appendChild(h3);
container.appendChild(div);


function helloWorld(){
    alert("Hello, World!");
}
const btn = document.getElementById("btn");
//Otra forma: btn = document.querySelector("#btn"); acá sí que tenés que usar . para class y # para id como en css.
btn.addEventListener("click", helloWorld);
btn.addEventListener("click", function (e){
    console.log(e);
});
/*The e parameter in that callback function contains an object that references the event itself. Within that object you have access to many useful properties and methods (functions that live inside an object) such as which mouse button or key was pressed, or information about the event’s target - the DOM node that was clicked. There’s nothing magical about e as a name or where it comes from. JavaScript knows the parameter is an event because an event listener callback takes an Event object by definition. When the callback is run, the event handler passes in its own reference to the event. */


// Método 3: Solo nos permite ponerle una función al evento, mientras que con addEventListener podemos poner varias.
const btn2 = document.querySelector("#btn2");
btn2.onclick = () => alert("Hello World");