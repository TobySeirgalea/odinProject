import { firstPageContent }     from "./starting.js";
import {displayMenuPageContent} from "./menu.js";
import {removeContentOfElement} from "./domManipulationHelpers.js";


const homeButton    = document.querySelector("#homeButton");
const menuButton    = document.querySelector("#menuButton");
const aboutButton   = document.querySelector("#aboutButton");
const contactButton = document.querySelector("#contactButton");
const content       = document.querySelector("#content");


firstPageContent(); 

homeButton.addEventListener("click", event => {
    removeContentOfElement(content);
    firstPageContent();
});

menuButton.addEventListener("click", (event) => {
    removeContentOfElement(content);
    displayMenuPageContent();
})
