import { DomController} from "../domController";
import { Task         } from "../../domain/task";
import { DomRenderizer } from "../../view/domRenderizer";
import { AppController } from "../appController";

const renderedCreateButton = document.createElement('button');
renderedCreateButton.setAttribute('id', 'renderedCreateButton');

const renderedTask = document.createElement('div');
renderedTask.setAttribute('id', 'testRenderedTask');

describe('Funcionalidad: agrega tarea renderizada al contenedor apropiado', () => {
  test('agrega concreteTask renderizada', () => {
    const domRenderizer = {
     renderTask: jest.fn().mockReturnValue(renderedTask)
    };
    const task = Task.createConcreteTask();
    const domController = new DomController(new AppController(), domRenderizer);
    document.body.innerHTML = 
        `<div id="${DomController.tasksContainerID}"></div>`;
    domController.displayTask(task);
    const elementsAtCreateButtonLocation = document.querySelector(`#${DomController.tasksContainerID}`).children;
    expect(elementsAtCreateButtonLocation.length).toBe(1);
    expect(elementsAtCreateButtonLocation[0].tagName.toLowerCase()).toBe('div');
    expect(elementsAtCreateButtonLocation[0].getAttribute('id')).toBe('testRenderedTask');
    });
});


