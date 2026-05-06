import "../styles/menu.css";
import "../styles/style-normalize.css";
import "../styles/mainStyles.css";
import { appendChildsToElement, createElement, createImage } from "./domManipulationHelpers.js";
import pastasImage  from "../images/pastas.webp";
import pizzasImage  from "../images/pizzas.jpg";
import vinosImage   from "../images/wines.png";
import cafesImage   from "../images/coffees.jpeg";
import postresImage from "../images/desserts.jpeg";
import pastasLogo   from "../logos/pastasLogo.png";
import pizzasLogo   from "../logos/pizzaLogo.png";
import coffeeLogo   from "../logos/coffeeLogo.png";
import winesLogo    from "../logos/winesLogo.png";
import dessertsLogo from "../logos/dessertsLogo.png";


function addSidebar(menuCategories){
    const sidebarContainer = createElement("div", "", "", "sideBar");
    const nav = createElement("nav", "", "", "");
    sidebarContainer.appendChild(nav);
    for (const menuCategory of menuCategories){
        const logoContent = createElement("div", "", "", "sideBarLogoContentContainer");
        appendChildsToElement(logoContent, [menuCategory.icon, createElement("p", menuCategory.categoryName, "", "buttonCategoryName")])
        const categoryButton = createElement("button", "", "", "categoryNavButton");
        categoryButton.appendChild(logoContent);
        const categoryContainer = document.querySelector("#" + menuCategory.categoryName + "Container");
        categoryButton.addEventListener("click", (event) => {
            categoryContainer.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
            categoryContainer.classList.add("zoom");
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
        const priceValueText  = createElement("p", String(price) + "$", "", "");
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
    const contentContainer     = createElement("div", "", "", "contentContainer");
    const menuOptionsContainer = createElement("div", "", "", "rowDenseGrid");
    
    const pastas  = [
        {name: "Spaghetti alla Carbonara", price: 12 },
        {name: "Fettuccine Alfredo", price: 13 },
        {name: "Penne all'Arrabbiata", price: 11 },
        {name: "Lasagna alla Bolognese", price: 14 },
        {name: "Tagliatelle al Ragù", price: 13 },
        {name: "Ravioli di Ricotta e Spinaci", price: 15 },
        {name: "Tortellini in Brodo", price: 14 },
        {name: "Spaghetti alle Vongole", price: 16 },
        {name: "Pappardelle ai Funghi Porcini", price: 17 },
        {name: "Gnocchi al Pesto", price: 13 },
        {name: "Linguine al Limone", price: 12 },
        {name: "Orecchiette con Cime di Rapa", price: 14 },
        {name: "Farfalle al Salmone", price: 16 },
        {name: "Rigatoni alla Norma", price: 13 },
        {name: "Spaghetti Aglio e Olio", price: 10 },
        {name: "Cannelloni Ricotta e Spinaci", price: 15 },
        {name: "Penne alla Vodka", price: 14 },
        {name: "Lasagna Vegetariana", price: 13 },
        {name: "Tagliolini al Tartufo", price: 20 },
        {name: "Fusilli al Pomodoro", price: 11 },
        {name: "Ravioli di Carne", price: 16 },
        {name: "Spaghetti al Nero di Seppia", price: 18 },
        {name: "Trofie al Pesto Genovese", price: 15 },
        {name: "Paccheri al Ragù di Mare", price: 19 },
        {name: "Ziti al Forno", price: 14 },
        {name: "Gnocchi alla Sorrentina", price: 14 },
        {name: "Spaghetti alle Polpette", price: 15 },
        {name: "Linguine ai Frutti di Mare", price: 18 },
        {name: "Penne con Pollo e Funghi", price: 14 },
        {name: "Fettuccine ai Gamberi", price: 17 },
        {name: "Ravioli al Tartufo", price: 21 },
        {name: "Tagliatelle al Salmone", price: 16 },
        {name: "Spaghetti al Pomodoro e Basilico", price: 11 },
        {name: "Fusilli al Pesto Rosso", price: 13 },
        {name: "Rigatoni con Salsiccia", price: 15 },
        {name: "Lasagna ai Funghi", price: 14 },
        {name: "Pappardelle al Cinghiale", price: 18 },
        {name: "Tortellini alla Panna", price: 15 },
        {name: "Orecchiette con Broccoli", price: 13 },
        {name: "Spaghetti alla Amatriciana", price: 14 },
        {name: "Linguine al Pesto e Pomodorini", price: 14 },
        {name: "Ravioli di Zucca", price: 15 },
        {name: "Farfalle Primavera", price: 13 },
        {name: "Penne al Gorgonzola", price: 14 },
        {name: "Tagliatelle ai Frutti di Bosco (dulce)", price: 12 },
        {name: "Gnocchi al Burro e Salvia", price: 13 },
        {name: "Spaghetti con Tonno", price: 12 },
        {name: "Rigatoni al Forno con Mozzarella", price: 15 },
        {name: "Lasagna al Salmone", price: 17 },
        {name: "Fettuccine al Pesto con Pollo", price: 15 }
    ];
    const pizzas  = [{name: "Mozzarella",   price: 500},
                     {name: "Pizza Margherita", price: 10 },
                     {name: "Pizza Marinara", price: 9 },
                     {name: "Pizza Napolitana", price: 11 },
                     {name: "Pizza Quattro Formaggi", price: 13 },
                     {name: "Pizza Prosciutto e Funghi", price: 14 },
                     {name: "Pizza Diavola", price: 13 },
                     {name: "Pizza Capricciosa", price: 14 },
                     {name: "Pizza Quattro Stagioni", price: 15 },
                     {name: "Pizza Vegetariana", price: 12 },
                     {name: "Pizza Calabrese", price: 13 },
                     {name: "Pizza con Salame", price: 12 },
                     {name: "Pizza con Jamón y Queso", price: 11 },
                     {name: "Pizza Pepperoni", price: 13 },
                     {name: "Pizza con Anchoas", price: 12 },
                     {name: "Pizza Bianca", price: 11 },
                     {name: "Pizza al Pesto", price: 13 },
                     {name: "Pizza con Rúcula y Parmesano", price: 14 },
                     {name: "Pizza con Champiñones", price: 12 },
                     {name: "Pizza con Salchicha Italiana", price: 14 },
                     {name: "Pizza Mediterránea", price: 14 },
                     {name: "Pizza de Mariscos", price: 16 },
                     {name: "Pizza con Espinaca y Ricotta", price: 13 },
                     {name: "Pizza con Tomates Secos", price: 13 },
                     {name: "Pizza con Pollo Alfredo", price: 15 },
                     {name: "Pizza con Carne Molida", price: 14 },
                     {name: "Pizza con Bacon", price: 14 },
                     {name: "Pizza Suprema", price: 16 },
                     {name: "Pizza con Aceitunas Negras", price: 12 },
                     {name: "Pizza con Queso de Cabra", price: 15 },
                     {name: "Pizza con Trufa", price: 20 },
                     {name: "Pizza de Jamón Serrano", price: 16 },
                     {name: "Pizza con Berenjenas", price: 13 },
                     {name: "Pizza con Calabacín", price: 13 },
                     {name: "Pizza con Atún", price: 12 },
                     {name: "Pizza con Huevo", price: 12 },
                     {name: "Pizza Carbonara", price: 14 },
                     {name: "Pizza con Cebolla Caramelizada", price: 13 },
                     {name: "Pizza con Pollo y Champiñones", price: 14 },
                     {name: "Pizza con Mozzarella Extra", price: 12 },
                     {name: "Pizza con Queso Azul", price: 14 },
                     {name: "Pizza con Salmón Ahumado", price: 17 },
                     {name: "Pizza con Rúcula y Prosciutto", price: 16 }
    ];
    const vinos   = [{ name: "Chianti Classico", price: 15 },
                     { name: "Brunello di Montalcino", price: 45 },
                     { name: "Barolo", price: 50 },
                     { name: "Barbaresco", price: 45 },
                     { name: "Amarone della Valpolicella", price: 55 },
                     { name: "Valpolicella Classico", price: 18 },
                     { name: "Prosecco", price: 12 },
                     { name: "Lambrusco", price: 10 },
                     { name: "Montepulciano d'Abruzzo", price: 14 },
                     { name: "Nero d'Avola", price: 16 },
                     { name: "Primitivo di Manduria", price: 20 },
                     { name: "Soave", price: 13 },
                     { name: "Verdicchio dei Castelli di Jesi", price: 15 },
                     { name: "Franciacorta", price: 30 },
                     { name: "Gavi di Gavi", price: 18 },
                     { name: "Dolcetto d'Alba", price: 17 },
                     { name: "Aglianico del Vulture", price: 22 },
                     { name: "Taurasi", price: 35 },
                     { name: "Fiano di Avellino", price: 20 },
                     { name: "Greco di Tufo", price: 19 },
                     { name: "Falerno del Massico", price: 25 },
                     { name: "Etna Rosso", price: 28 },
                     { name: "Etna Bianco", price: 24 },
                     { name: "Rosso di Montalcino", price: 25 },
                     { name: "Vino Nobile di Montepulciano", price: 30 },
                     { name: "Super Tuscan (Tignanello)", price: 80 },
                     { name: "Sassicaia", price: 250 },
                     { name: "Ornellaia", price: 200 },
                     { name: "Valpolicella Ripasso", price: 22 },
                     { name: "Lugana", price: 16 },
                     { name: "Cannonau di Sardegna", price: 18 },
                     { name: "Vermentino di Gallura", price: 17 },
                     { name: "Trebbiano d'Abruzzo", price: 14 },
                     { name: "Marsala", price: 20 },
                     { name: "Vin Santo", price: 35 },
                     { name: "Passito di Pantelleria", price: 40 },
                     { name: "Sagrantino di Montefalco", price: 35 },
                     { name: "Lagrein", price: 22 },
                     { name: "Teroldego Rotaliano", price: 20 },
                     { name: "Pinot Grigio delle Venezie", price: 12 },
                     { name: "Ribolla Gialla", price: 18 },
                     { name: "Arneis", price: 17 },
                     { name: "Falanghina", price: 15 },
                     { name: "Negroamaro", price: 16 },
                     { name: "Cerasuolo d'Abruzzo", price: 14 },
                     { name: "Timorasso", price: 28 },
                     { name: "Garganega", price: 13 },
                     { name: "Brachetto d'Acqui", price: 18 },
                     { name: "Moscato d'Asti", price: 14 },
                     { name: "Alta Langa Spumante", price: 35 }];
    const cafes   = [
  { name: "Espresso", price: 2 },
  { name: "Doppio Espresso", price: 3 },
  { name: "Ristretto", price: 2 },
  { name: "Lungo", price: 2.5 },
  { name: "Cappuccino", price: 4 },
  { name: "Caffè Latte", price: 4 },
  { name: "Latte Macchiato", price: 4.5 },
  { name: "Caffè Macchiato", price: 3 },
  { name: "Caffè Americano", price: 3 },
  { name: "Caffè Corretto", price: 5 },
  { name: "Mocha", price: 4.5 },
  { name: "Marocchino", price: 4 },
  { name: "Shakerato", price: 4 },
  { name: "Affogato al Caffè", price: 5 },
  { name: "Cioccolata Calda", price: 4 },
  { name: "Orzo (café de cebada)", price: 3 },
  { name: "Ginseng Latte", price: 4 },
  { name: "Granita al Caffè", price: 4 },
  { name: "Cornetto", price: 3 },
  { name: "Cornetto alla Crema", price: 3.5 },
  { name: "Cornetto al Cioccolato", price: 3.5 },
  { name: "Cornetto Integrale", price: 3 },
  { name: "Bombolone", price: 4 },
  { name: "Crostata", price: 4 },
  { name: "Crostata di Marmellata", price: 4 },
  { name: "Crostata di Ricotta", price: 4.5 },
  { name: "Biscotti Cantucci", price: 3 },
  { name: "Biscotti Amaretti", price: 3 },
  { name: "Sfogliatella", price: 4 },
  { name: "Babà al Rum", price: 5 },
  { name: "Panna Cotta", price: 5 },
  { name: "Cannoli Siciliani", price: 5 },
  { name: "Panettone (porción)", price: 4 },
  { name: "Pandoro (porción)", price: 4 },
  { name: "Focaccia Dolce", price: 4 },
  { name: "Focaccia Salada", price: 4 },
  { name: "Tramezzino", price: 5 },
  { name: "Panini", price: 6 },
  { name: "Toast Italiano", price: 5 },
  { name: "Mini Calzone", price: 5 },
  { name: "Brioches con Gelato", price: 6 },
  { name: "Crema al Caffè", price: 4 },
  { name: "Spremuta d'Arancia", price: 4 },
  { name: "Limonata Italiana", price: 3.5 }
];
    const postres = [
  { name: "Tiramisù", price: 6 },
  { name: "Panna Cotta", price: 5 },
  { name: "Cannoli Siciliani", price: 5 },
  { name: "Gelato (cono chico)", price: 4 },
  { name: "Gelato (cono grande)", price: 6 },
  { name: "Sorbetto", price: 4 },
  { name: "Zabaglione", price: 5 },
  { name: "Cassata Siciliana", price: 6 },
  { name: "Semifreddo", price: 5 },
  { name: "Affogato al Caffè", price: 5 },
  { name: "Pandoro (porción)", price: 4 },
  { name: "Torta Caprese", price: 6 },
  { name: "Torta della Nonna", price: 5 },
  { name: "Crostata di Marmellata", price: 4 },
  { name: "Crostata di Ricotta", price: 5 },
  { name: "Crostata di Frutta", price: 5 },
  { name: "Babà al Rum", price: 5 },
  { name: "Sfogliatella", price: 4 },
  { name: "Biscotti Cantucci", price: 3 },
  { name: "Biscotti Amaretti", price: 3 },
  { name: "Profiteroles", price: 6 },
  { name: "Millefoglie", price: 6 },
  { name: "Struffoli", price: 5 },
  { name: "Zeppole", price: 5 },
  { name: "Crema Catalana (estilo italiano)", price: 5 },
  { name: "Budino al Cioccolato", price: 4 },
  { name: "Budino alla Vaniglia", price: 4 },
  { name: "Granita Siciliana", price: 4 },
  { name: "Gelato al Pistacchio", price: 5 },
  { name: "Gelato alla Nocciola", price: 5 },
  { name: "Gelato al Cioccolato", price: 5 },
  { name: "Gelato alla Fragola", price: 5 },
  { name: "Tartufo Gelato", price: 6 },
  { name: "Coppa Amarena", price: 6 },
  { name: "Coppa al Cioccolato", price: 6 },
  { name: "Coppa Stracciatella", price: 6 },
  { name: "Ricotta con Miele", price: 4 },
  { name: "Ricotta con Frutti di Bosco", price: 5 },
  { name: "Frittelle Dolci", price: 4 },
  { name: "Ciambella Italiana", price: 4 },
  { name: "Torta di Ricotta", price: 5 },
  { name: "Torta al Limone", price: 5 },
  { name: "Torta al Cioccolato", price: 5 },
  { name: "Torta alle Mandorle", price: 5 },
  { name: "Amaretti Morbidi", price: 4 },
  { name: "Bignè alla Crema", price: 4 },
  { name: "Bignè al Cioccolato", price: 4 },
  { name: "Crema al Mascarpone", price: 5 },
  { name: "Dolce al Pistacchio", price: 6 }
];
    
    const menuCategoriesList = [{icon: createImage(pastasLogo, "Logo pastas", "https://www.flaticon.com/free-icons/pasta"),
                                 image: createImage(pastasImage, "Imagen de pastas", "https://www.flickr.com/photos/bognarreni/4734116924/in/photolist-8dkA2A-dKsmiG-bybUnE-bBcrHt-e5X6ya-aqBKjV-baPicn-7xB2uE"),
                                 categoryName: "Pastas", 
                                 categoryOptions: pastas},
                                {icon: createImage(pizzasLogo, "Logo pizzas", "https://www.flaticon.com/free-icons/pizza"),
                                 image: createImage(pizzasImage, "Imagen de pizzas", "https://www.italianpizzasecrets.com/ebirtegh/2021/08/What-Is-Real-Italian-Pizza.jpg"),
                                 categoryName: "Pizzas",  
                                 categoryOptions: pizzas},
                                {icon: createImage(winesLogo, "Logo vinos", "https://www.flaticon.com/free-icons/wine"),
                                 image: createImage(vinosImage, "Imagen de unos vinos italianos", "https://www.vino.com/en/italianwines"), 
                                 categoryName: "Vinos",   
                                 categoryOptions: vinos},
                                {icon: createImage(coffeeLogo, "Logo cafés", "https://www.flaticon.com/free-icons/food"),
                                 image: createImage(cafesImage, "Imagen de cafés", "https://www.istockphoto.com/es/foto/collage-de-caf%C3%A9-de-varios-tipos-de-bebidas-de-caf%C3%A9-gm1191266099-338007961"), 
                                 categoryName: "Café",    
                                 categoryOptions: cafes},
                                {icon: createImage(dessertsLogo, "Logo postres", "https://www.flaticon.com/free-icons/dessert"),
                                 image: createImage(postresImage, "Imagen de postres italianos", "https://www.shutterstock.com/es/image-photo/pastry-bakery-store-shop-assisi-umbria-1659064990?dd_referrer=https%3A%2F%2Fwww.google.com%2F"), 
                                 categoryName: "Postres",
                                 categoryOptions: postres},
                                ];

    fillMenuWithOptions(menuOptionsContainer, menuCategoriesList);
    const content = document.querySelector("#content");
    contentContainer.appendChild(menuOptionsContainer);
    content.appendChild(contentContainer);
    contentContainer.appendChild(addSidebar(menuCategoriesList));
}


export {displayMenuPageContent};