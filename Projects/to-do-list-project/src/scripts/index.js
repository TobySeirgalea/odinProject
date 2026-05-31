import defaultValues from "../appConstantValues.json" with {type: 'json'};
import { DomController } from "./view/dom_controller.js";

const dom = new DomController()


const createButton = document.querySelector("#createButton");
createButton.addEventListener("click", (event) => {
    const form = dom.createContentForm();
    document.body.appendChild(form);
    form.showModal();
})