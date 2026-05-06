import { firstPageContent }     from "./starting.js";
import {displayMenuPageContent} from "./menu.js";
import {removeContentOfElement} from "./domManipulationHelpers.js";
import { displayAboutPage } from "./about.js";
import { displayContactInfoContent } from "./contact.js";


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

aboutButton.addEventListener("click", (event) => {
    removeContentOfElement(content);
    displayAboutPage();
})

contactButton.addEventListener("click", (event) => {
    removeContentOfElement(content);
    displayContactInfoContent();
})