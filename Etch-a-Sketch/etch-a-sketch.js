function resizeGrid(){
    const requestedSize = prompt("Introduzca el tamaño deseado para la grilla (max: 100):");
    if (requestedSize <= 100){
        const container = document.querySelector(".container");
        document.querySelector("body").removeChild(container);
        createGrid(requestedSize);
    }
    else{
        alert("Ha introducido un valor mayor a 100. Una grilla así consumiría demasiados recursos");
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
            innerSquareDiv.classList.add("square-div");
            innerSquareDiv.addEventListener("mouseenter", (event) => event.target.classList.add("mouseOver"));
            innerSquareDiv.addEventListener("mouseleave", (event) => event.target.classList.remove("mouseOver"));
            squareDiv.appendChild(innerSquareDiv);
        }
    container.appendChild(squareDiv);
    }
    document.querySelector("body").appendChild(container);
}

const sizeOfGridButton = document.createElement("button");
sizeOfGridButton.textContent = "Cambiar cantidad de bloques"
sizeOfGridButton.addEventListener("click", resizeGrid); 
document.querySelector("body").appendChild(sizeOfGridButton);
createGrid(16);
