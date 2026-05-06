import "../styles/about.css";
import { appendChildsToElement, createElement, createImage, createImagesContainer} from "./domManipulationHelpers.js";
import {createHorizontalCarouselResponsiveContainer} from "./carouselResponsiveContainer.js";

import luigisFirstRestaurant from "../images/luigisEvol1.jpeg";
import luigisFirstRestaurantRenovation from "../images/liugisEvol2.webp";
import luigisActualRestaurant from "../images/LuigiActualRestaurant.webp";
import luigisActualRestaurantsFirstRenovation from "../images/liugisEvol3.webp";
import luigisActualRestaurantsFirstRenovationFullOfCars from "../images/luigisEvol2.webp"; 

import peopleAtLuigisRestaurantPhoto from "../images/luigis1.webp";
import datingAtLuigisRestaurant from "../images/luigis2.jpg";
import luigiPlayingMusic from "../images/luigis3.jpg";
import luigisWithPizzaPortion from "../images/luigis5.webp";
import luigisPublicity from "../images/luigis4.jpg";

import mammaRisotto from "../images/luigisMother.png";
import salvatore from "../images/secondChef.webp";
import salsaMaestro from "../images/salsaMan.webp";
import luigiImage from "../images/luigi-Risotto.webp";

const luigisChefBio = "Luigi Risotto, el carismático chef y dueño de su restaurante italiano, ha conquistado a Springfield con su pasión por la cocina tradicional. Nacido en Italia y formado entre recetas familiares, Luigi llevó consigo los sabores auténticos de su tierra, combinando técnicas clásicas con su inconfundible estilo teatral. \n En su cocina, cada plato es una celebración: desde pastas caseras hasta salsas cocinadas con paciencia y dedicación. Con su famosa frase “¡Mamma mia!”, Luigi no solo sirve comida, sino una experiencia llena de sabor, humor y calidez. \n Hoy, su restaurante es un punto de encuentro en Springfield, donde locales y visitantes disfrutan de la auténtica hospitalidad italiana bajo la atenta mirada de un chef que vive y respira su oficio.";

const luigisRestaurantEvolution = [
    createImage(luigisFirstRestaurant, "Nuestro primer restaurante", ""),
    createImage(luigisFirstRestaurantRenovation, "Tras su renovación", ""),
    createImage(luigisActualRestaurant, "Restaurante actual en primer dia tras mudanza", ""),
    createImage(luigisActualRestaurantsFirstRenovation, "Restaurante actual tras su renovación", ""),
    createImage(luigisActualRestaurantsFirstRenovationFullOfCars, "Hoy en día", "")
];

const staffMembersInfo = [
    {photo: mammaRisotto, name: "Mamma Risotto"},
    {photo: salvatore, name: "Salvatore"},
    {photo: salsaMaestro, name: "Salsa's specialist"}
];

const luigisRestaurantPhotos = [
    createImage(luigiPlayingMusic, "Luigi tocando el acordeón"),
    createImage(datingAtLuigisRestaurant, "A couple dating at Luigi's restaurant"),
    createImage(peopleAtLuigisRestaurantPhoto, "Restaurante lleno"),
    createImage(luigisWithPizzaPortion, "Luigi con una porción de pizza"),
    createImage(luigisPublicity, "Publicidad de Luigi's"),
]

function displayAboutPage(){
    const contentContainer = createElement("div", "", "", "aboutContentContainer");
    appendChildsToElement(contentContainer, [
        restaurantPhotosComponent(),
        chefBio(),
        staffMembersComponent(staffMembersInfo),
        restaurantEvolutionComponent()
    ]);
    const content = document.querySelector("#content");

    content.appendChild(contentContainer);
}

function restaurantEvolutionComponent(){
    const restaurantHistoryContainer = createElement("div", "", "", "sectionContainer");
    const sectionTitle = createElement("h2", "Conozca nuestra historia", "", "sectionTitle");
    const sectionContent = createHorizontalCarouselResponsiveContainer(luigisRestaurantEvolution);

    appendChildsToElement(restaurantHistoryContainer, [sectionTitle, sectionContent]);
    return restaurantHistoryContainer;
}

function chefBio(){
    return createSectionContainer("Conozca a nuestro chef", createImage(luigiImage, "Imagen de Luigi Risotto"), "Luigi Risotto", luigisChefBio);
}

function restaurantPhotosComponent(){
    return createImagesContainer(luigisRestaurantPhotos, "restaurantPhotosContainer")
}

function createStaffCard(image, name){
    const staffCardContainer = createElement("div", "", "", "staffMemberCard");
    appendChildsToElement(staffCardContainer, [
        createImage(image, name + ", staff member photo"),
        createElement("h3", name, "", "")
    ]);
    return staffCardContainer;
}

function staffMembersComponent(staffMembersInfo){
    const container = createElement("div", "", "", "staffMembersContainer");
    const sectionTitle = createElement("h2", "Conozca al staff", "", "sectionTitle");
    const staffPhotosContainer = createImagesContainer(staffMembersInfo.map(data => createStaffCard(data.photo, data.name)), "staffPhotosContainer");
    
    appendChildsToElement(container, [sectionTitle, staffPhotosContainer]);
    
    return container;
}




function createSectionContainer(title, image, subtitleText, paragraphText){
    const container = createElement("div", "", "", "sectionContainer");
    const boxTitle  = createElement("h2", title, "", "sectionTitle");
    const imageAndSubtitle = createElement("div", "", "", "imageAndSubtitle");
    const subtitle = createElement("h3", subtitleText, "", "");
    appendChildsToElement(imageAndSubtitle, [image, subtitle]);
    const contentBox = createElement("div", "", "", "contentBox");
    appendChildsToElement(contentBox, [imageAndSubtitle, createElement("p", paragraphText, "", "")]);
    appendChildsToElement(container, [boxTitle, contentBox]);
    return container;
}






export {displayAboutPage};