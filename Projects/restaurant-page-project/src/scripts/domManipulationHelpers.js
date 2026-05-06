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

function createImagesContainer(images, className){
    const container = createElement("div", "", "", className);
    appendChildsToElement(container, images);
    return container;
}


function createImage(image, altText, attributionLink){
    const newImage = new Image();
    newImage.alt = altText;
    newImage.src = image;
    if (attributionLink){
        const attribution = document.createElement("a", "", "", "");
        attribution.href = attributionLink;
        newImage.appendChild(attribution);
    }
    return newImage;
}

function removeContentOfElement(element){
    element.innerHTML = "";
}

export{createElement, createImage, appendChildsToElement, removeContentOfElement, createImagesContainer};