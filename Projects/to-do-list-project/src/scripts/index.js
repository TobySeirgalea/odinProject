import   defaultValues   from "../appConstantValues.json" with {type: 'json'};
import { DomRenderizer } from "./view/domRenderizer.js";
import { AppController } from "./controllers/appController.js";
import { Task } from "./domain/task.js";
import { addDays } from "date-fns";
const dom = new DomRenderizer();

const task = Task.createConcreteTask(addDays(new Date(), 4), 0, 'Titulo', 'description');
const compositeTask = Task.createCompositeTask([task], addDays(new Date(), 5), 0, 'Composite', 'ACompositeTask');
const doubleCompositeTask = Task.createCompositeTask([compositeTask], addDays(new Date(), 5), 0, 'Double composite', 'a double');
document.body.appendChild(dom.renderTask(doubleCompositeTask));
document.body.appendChild(dom.renderTask(task));
document.body.appendChild(dom.renderCreateButton());

const app = new AppController();
