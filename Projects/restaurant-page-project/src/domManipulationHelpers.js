function appendChildsToElement(element, childs){
    for (const child of childs){
        element.appendChild(child);
    }
}

function createElement(tagAsString, elementsTextContent, elementID, classes){
    const element = document.createElement(tagAsString);
    element.textContent = elementsTextContent;
    element.id = elementID;
    if (classes){
        const classesToAdd = classes.split(" ");
        for (const aClass of classesToAdd){
            element.classList.add(aClass);
        }
    }
    return element;
}

function createImage(image, altText){
    const newImage = new Image();
    newImage.alt = altText;
    newImage.src = image;
    return newImage;
}

function removeContentOfElement(element){
    element.innerHTML = "";
}

export{createElement, createImage, appendChildsToElement, removeContentOfElement};