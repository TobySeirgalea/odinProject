import defaultValues from "../appConstantValues.json" with {type: 'json'};
import { DomController } from "./view/dom_controller.js";

const app = new AppController();
const dom = new DomController(app);

const createButton = document.querySelector("#createButton");
createButton.addEventListener("click", (event) => {
    const form = dom.createContentForm();
    document.body.appendChild(form);
    form.showModal();
})