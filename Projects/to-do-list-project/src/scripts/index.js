import   defaultValues   from "../appConstantValues.json" with {type: 'json'};
import { DomRenderizer } from "./view/domRenderizer.js";
import { AppController } from "./controllers/appController.js";

const app = new AppController();
