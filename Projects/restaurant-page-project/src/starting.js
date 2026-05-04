import imagenLuigis  from "./imagenPpal.webp";
import imagenVinos   from "./vinos.png";
import imagenHuerta  from "./huerta.png";
import imagenRecetas from "./recipes.png";
import imagenItalia  from "./ambiente.png";
import "./starting.css";
import "./mainStyles.css";
import "./style-normalize.css";
import {createElement, appendChildsToElement, createImage} from "./domManipulationHelpers.js";

function firstPageContent(){
    const contentDiv = document.querySelector("#content");
    const pageTitle  = createElement("h1", "Luigi's", "", "");
    const subtitle   = createElement("h2", "Auténtica comida italiana", "", "");
    const mainContentContainer = createElement("div", "", "mainContentContainer", "");
    
    const titlesContainer = createElement("div", "", "titlesContainer", "");
    
    appendChildsToElement(titlesContainer, [pageTitle, subtitle]);
    
    const divCaracteristicas = createElement("div", "", "caracteristicasContainer", "");
    
    const nombreRestaurante = createElement("p", "Luigi's", "nombreRestaurante", "");
    
    const caracteristicasContainer = createElement("div", "", "placeDescriptionContainer", "");
    
    const tituloCaracteristicas = createElement("h3", "Un pedacito de Italia en Springfield", "tituloCaracteristicas", "");
    
    appendChildsToElement(caracteristicasContainer, [nombreRestaurante, tituloCaracteristicas, divCaracteristicas]);
    
    const imagenPrincipal = createImage(imagenLuigis, "Logo Luigi's");
    
    appendChildsToElement(mainContentContainer, [titlesContainer, imagenPrincipal]);

    appendChildsToElement(divCaracteristicas, [
        crearCaracteristica("Ingredientes frescos", "Los ingredientes más frescos obtenidos de nuestra huerta, sin pasar por procesos químicos", imagenHuerta, "logo de huerta"),
        crearCaracteristica("Recetas tradicionales", "Solo utilizamos recetas tradicionales italianas pasadas de generación en generación", imagenRecetas, "logo de recetas"),
        crearCaracteristica("Vinos 100% italianos", "Contamos con una colección de los mejores vinos traídos directamente desde la Toscana italiana", imagenVinos, "logo vinos"),
        crearCaracteristica("Ambiente acogedor", "Con la decoración de nuestro restaurante se va a sentir como si estuviera en la mismísima Italia", imagenItalia, "logo ambiente")
    ])

    appendChildsToElement(contentDiv, [mainContentContainer, caracteristicasContainer]);
}

function crearCaracteristica(titulo, contenido, imagen, descripcionImagen){
    const container = createElement("div", "", "", "caracteristica");
    const tituloCaracteristica = createElement("h4", titulo, "", "");
    const parrafoContenido = createElement("p", contenido, "", "");
    const imagenCaracteristica = createImage(imagen, descripcionImagen);
    appendChildsToElement(container, [imagenCaracteristica, tituloCaracteristica, parrafoContenido]);
    return container;
}

export{firstPageContent};