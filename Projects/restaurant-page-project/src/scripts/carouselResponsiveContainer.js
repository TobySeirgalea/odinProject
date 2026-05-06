import "../styles/carouselResponsiveContainer.css";

function createHorizontalCarouselResponsiveContainer(listOfItems){
    const container = document.createElement("div");
    const list = document.createElement("ul");
    for (const item of listOfItems){
        const itemContainer = document.createElement("li");
        itemContainer.classList.add("horizontalCarouselItem")
        itemContainer.appendChild(item);
        const subtitle = document.createElement("h3");
        subtitle.textContent = item.alt;
        itemContainer.appendChild(subtitle);
        list.appendChild(itemContainer);
    }
    container.appendChild(list);
    container.classList.add("horizontalCarouselContainer");
    list.classList.add("horizontalCarouselList");
    
    return container;
}

export {createHorizontalCarouselResponsiveContainer};