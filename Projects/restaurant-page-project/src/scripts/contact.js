import { appendChildsToElement, createElement, createImage } from "./domManipulationHelpers.js";
import littleItaly from "../images/littleItaly.png";
import mapIconImage from "../logos/mapa.png";
import phoneIconImage from "../logos/telefono.png";
import clockIconImage from "../logos/reloj.png";
import "../styles/contact.css";
import "../styles/mainStyles.css";

function displayContactInfoContent(){

    const mapIcon = createImage(mapIconImage , "a map icon", "https://www.flaticon.es/iconos-gratis/mapa");
    const phoneIcon = createImage(phoneIconImage, "a phone icon", "https://www.flaticon.es/iconos-gratis/telefono");
    const clockIcon = createImage(clockIconImage, "a clock icon", "https://www.flaticon.es/iconos-gratis/ocioso");

    const horariosLuigis = "";
    const luigisNumber = "";
    const luigisAddress = "Calle falsa 123";

    const contactContainer = createElement("div", "", "", "flexColumn flexCentered");
    const littleItalyImageContainer = createElement("div", "", "", "imageContainer");
    const littleItalyImage = createImage(littleItaly , "Spingfield's little Italy photo");
    appendChildsToElement(littleItalyImageContainer, [createElement("p", "Spingfield's little Italy", "", "flexColumn flexCentered fontTangerine"), littleItalyImage]);
    const sectionTitle     = createElement("h2", "Dónde nos encontramos", "", "sectionTitle");
    const contactInfoContainer = createElement("div", "", "", "contactInfoContainer flexCentered");
    const contactInfoList = createElement("ul", "", "", "contactInfoList noListIcons noPadding");
    appendChildsToElement(contactInfoList, [createContactInfoField(mapIcon, "Dirección:", luigisAddress), 
                                            createContactInfoField(phoneIcon, "Teléfono:", luigisNumber),
                                            createContactInfoField(clockIcon, "Horarios:", horariosLuigis)
    ]);
    appendChildsToElement(contactInfoContainer, [createElement("h3", "Datos de contacto", "", "contactDataTitle"), contactInfoList])
    const contactContent = createElement("div", "", "", "contactContent flexRow flexCentered flexWrap shadow");
    appendChildsToElement(contactContent, [contactInfoContainer, littleItalyImageContainer]);
    appendChildsToElement(contactContainer, [sectionTitle, contactContent]);

    document.querySelector("#content").appendChild(contactContainer);
}

function createContactInfoField(fieldIcon, fieldName, fieldValue){
    const field = createElement("li", "", "", "contactInfoField flexRow");
    appendChildsToElement(field, [fieldIcon, createElement("p", fieldName, "", ""), createElement("p", fieldValue, "", "")]);
    return field;
}

export {displayContactInfoContent};