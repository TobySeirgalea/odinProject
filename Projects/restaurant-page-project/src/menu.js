import "./menu.css";
import "./style-normalize.css";
import "./mainStyles.css";
import { appendChildsToElement, createElement, createImage } from "./domManipulationHelpers.js";
import pastasImage  from "./pastas.webp";
import pizzasImage  from "./pizzas.jpg";
import vinosImage   from "./wines.png";
import cafesImage   from "./coffees.jpeg";
import postresImage from "./desserts.jpeg";


function addSidebar(menuCategories){
    const sidebarContainer = createElement("div", "", "", "sideBar");
    const nav = createElement("nav", "", "", "");
    sidebarContainer.appendChild(nav);
    for (const menuCategory of menuCategories){
        const categoryButton = createElement("button", menuCategory.categoryName, "", "categoryNavButton");
        const categoryContainer = document.querySelector("#" + menuCategory.categoryName + "Container");
        categoryButton.addEventListener("click", (event) => {
            categoryContainer.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
        });
        nav.appendChild(categoryButton);
    }
    return sidebarContainer;
}

function fillMenuWithOptions(menuContainer, menuCategoriesList){
    for (const menuCategory of menuCategoriesList){
        addACategoryToTheMenu(menuContainer, menuCategory.image, menuCategory.categoryName, createCategoryOptions(menuCategory.categoryOptions));
    }
}

function createCategoryOptions(namePriceTuplesList){
    const optionsList = [];
    for (const {name, price} of namePriceTuplesList){
        const optionContainer = createElement("li", "", "", "optionContainer");
        const nameText        = createElement("p", String(name), "", "");
        const priceValueText  = createElement("p", String(price), "", "");
        appendChildsToElement(optionContainer, [nameText, priceValueText]);
        optionsList.push(optionContainer);
    }
    return optionsList;
}

function addACategoryToTheMenu(menuContainer, image, categoryName, categoryOptions){
    const categoryContainer    = createElement("div", "", categoryName + "Container", "categoryContainer");
    const categoryTitle        = createElement("h3", categoryName, "", "categoryTitle");
    const categoryOptionsList  = createElement("ul", "", "", "categoryOptionsList");
    appendChildsToElement(categoryOptionsList, categoryOptions);
    appendChildsToElement(categoryContainer, [image, categoryTitle, categoryOptionsList]);
    menuContainer.appendChild(categoryContainer);
}

function displayMenuPageContent(){
    const menuOptionsContainer = createElement("div", "", "", "rowDenseGrid");
    
    const pastas  = [{name: "Spaghetti con salsa bolognesa",    price: 400}, {name: "Rissotto", price: 500}];
    const pizzas  = [{name: "Mozzarella",   price: 500}];
    const vinos   = [{name: "Toscana 1917", price: 900}];
    const cafes   = [{name: "Capucchino",   price: 15 }];
    const postres = [{name: "Panetonne",    price: 50 }];
    
    const menuCategoriesList = [{image: createImage(pastasImage,  "Imagen de pastas"),               categoryName: "Pastas",            categoryOptions: pastas},
                                {image: createImage(pizzasImage,  "Imagen de pizzas"),               categoryName: "Pizzas",  categoryOptions: pizzas},
                                {image: createImage(vinosImage,   "Imagen de unos vinos italianos"), categoryName: "Vinos",   categoryOptions: vinos},
                                {image: createImage(cafesImage,   "Imagen de cafés"),                categoryName: "Café",    categoryOptions: cafes},
                                {image: createImage(postresImage, "Imagen de postres italianos"),    categoryName: "Postres", categoryOptions: postres},
                                ];

    fillMenuWithOptions(menuOptionsContainer, menuCategoriesList);
    appendChildsToElement(document.querySelector("#content"), [menuOptionsContainer, addSidebar(menuCategoriesList)]);
}

export {displayMenuPageContent};