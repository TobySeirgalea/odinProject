function resizeGrid(){
    const requestedSize = prompt("Introduzca el tamaño deseado para la grilla (max: 100):");
    if (requestedSize <= 100){
        const container = document.querySelector(".container");
        document.querySelector("#page-content").removeChild(container);
        createGrid(requestedSize);
    }
    else{
        alert("Ha introducido un valor mayor a 100. Una grilla así consumiría demasiados recursos");
    }
}

function randomRGB(){
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function updateSquareColor(element){
    let previousOpacity = Number(element.style.opacity);
    if (element.style.backgroundColor == "white"){
        element.style.backgroundColor = randomRGB();
        element.style.opacity = "0.1";
    }
    else if (previousOpacity < 1) {
        console.log(previousOpacity);
        element.style.opacity = previousOpacity + 0.1;
    }
}


function createGrid(squares){
    const container = document.createElement("div");
    container.classList.add("container");
    const pixelsPerSquare = 960/squares;
    for (let i = 0; i < squares; i++){
        const squareDiv = document.createElement("div");
        for (let j = 0; j < squares; j++){
            const innerSquareDiv = document.createElement("div");
            innerSquareDiv.style.width = pixelsPerSquare + "px";
            innerSquareDiv.style.height = pixelsPerSquare + "px";
            innerSquareDiv.style.backgroundColor = "white";
            innerSquareDiv.addEventListener("mouseenter", (event) => updateSquareColor(event.target));
            squareDiv.appendChild(innerSquareDiv);
        }
    container.appendChild(squareDiv);
    }
    document.querySelector("#page-content").appendChild(container);
}

const sizeOfGridButton = document.createElement("button");
sizeOfGridButton.textContent = "Cambiar cantidad de bloques"
sizeOfGridButton.addEventListener("click", resizeGrid); 
document.querySelector("#page-content").appendChild(sizeOfGridButton);
createGrid(16);
