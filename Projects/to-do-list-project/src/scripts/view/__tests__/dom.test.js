/**
 * @jest-environment jsdom
 */
import {CompositeTask, ConcreteTask, Task} from "../../domain/task.js";
import {Note} from "../../domain/notes.js";
import "../domRenderizer.js";
import { DomRenderizer } from "../domRenderizer.js";
import defaultValues from "../../../appConstantValues.json" with {type: "json"};
import { addDays, isSameDay, addYears } from "date-fns";
import { AppController } from "../../controllers/appController.js";
import { DomController } from "../../controllers/domController.js";
import   fs from 'fs';
import   path from 'path';

/*Esqueleto de un test:
describe('Funcionalidad: ', () => {
  test('Nombre test', () => {
    // Código del test

    });
});
*/
const taskTitles = ["Iniciar base de datos", "Instalar dependencias"];
const taskDescriptions = ["Configurar una base de datos con PostgreSQL con instrucciones recibidas por mail", "correr npm install en terminal"];
const taskDueDates = [addDays(new Date(), 5), addDays(new Date(), 2)];
const noteTitles = ["Nota mental: La niña sabe demasiado"];
const noteBodies = ["Yo sé que oyes mis pensamientos muchacho ñam ñam ñam"];

describe('Funcionalidad: renderizar una tarea contiene su título', () => {
  test('Contiene un método renderTask', () => {
    const dom = new DomRenderizer();
    expect(dom.renderTask).toBeDefined(); 
    });
  test('Tarea sin título al ser renderizada tiene elemento y clase esperada', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomRenderizer.taskTitleClass, DomRenderizer.elementsTagForTaskTitles); 
    });
  test('Tarea sin título al ser renderizada tiene título por default en elemento esperado', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassInfo(dom, task, DomRenderizer.taskTitleClass, defaultValues.defaultTaskTitle);
    });
  test('Tarea con título al ser renderizada tiene dicho título en elemento esperado', () => {
    const dom = new DomRenderizer();
    const title = taskTitles[0];
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, title);
    renderedTaskHasCorrectClassInfo(dom, task, DomRenderizer.taskTitleClass, title);
    });
});
describe('Funcionalidad: renderizar una tarea contiene su descripción', () => {
  test('Tarea sin descripción al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0]);
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomRenderizer.taskDescriptionsClass, DomRenderizer.elementsTagForTaskDescriptions);
    });
  test('Tarea sin descripción al ser renderizada contiene descripción por default', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0]);
    renderedTaskHasCorrectClassInfo(dom, task, DomRenderizer.taskDescriptionsClass, defaultValues.defaultDescriptionText);
    });
  test('Tarea con descripción al ser renderizada contiene esa descripción ', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
    renderedTaskHasCorrectClassInfo(dom, task, DomRenderizer.taskDescriptionsClass, taskDescriptions[0]);
    });
});
describe('Funcionalidad: renderizar una tarea contiene su dueDate', () => {
  test('Tarea sin dueDate al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomRenderizer.taskDueDateClass, DomRenderizer.elementsTagForTaskDueDate);
    });
   test('Tarea sin dueDate al ser renderizada contiene default dueDate', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectDueDate(dom, task, Task.defaultDueDate);
    });
   test('Tarea con dueDate al ser renderizada contiene su dueDate', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[0]);
    renderedTaskHasCorrectDueDate(dom, task, taskDueDates[0]);
    });
});

function renderedTaskHasCorrectDueDate(dom, task, expectedDueDate){
  const node = dom.renderTask(task).querySelector("." + DomRenderizer.taskDueDateClass);
  expect(node.getAttribute('name')).toBe('dueDate');
  const expectedDueDateInISOFormat = expectedDueDate.toISOString().split('T')[0];
  expect(node.getAttribute("value")).toBe(expectedDueDateInISOFormat); 
}

function renderedTaskHasCorrectPriorityValue(dom, task, expectedPriorityValue){
  const priorityValue = Number(dom.renderTask(task).querySelector("." + DomRenderizer.taskPriorityClass).getAttribute("value"));
  expect(priorityValue).toBe(expectedPriorityValue);
}

describe('Funcionalidad: renderizar una tarea tiene su prioridad', () => {
  test('Tarea sin prioridad al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomRenderizer.taskPriorityClass, DomRenderizer.elementsTagForTaskPriority);
    });
  test('Tarea sin prioridad al ser renderizada contiene prioridad default', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectPriorityValue(dom, task, defaultValues.taskPriorities.defaultConcreteTaskPriorityValue);
    });
  test('Tarea con prioridad al ser renderizada contiene dicha prioridad', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.maxPriorityValue);
    renderedTaskHasCorrectPriorityValue(dom, task, defaultValues.taskPriorities.maxPriorityValue);
    });
});
describe('Funcionalidad: renderizar una tarea tiene clase que acorde a su estado', () => {
  test('Tarea incompleta al ser renderizada contiene clase esperada', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomRenderizer.incompleteTaskClass);
    expect(task.isCompleted()).toBeFalsy();
    });
  test('Tarea incompleta al ser renderizada contiene clase esperada y al ser completada pasa a tener la de tareas completas y dejar de tener la de incompletas', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomRenderizer.incompleteTaskClass);
    expect(task.isCompleted()).toBeFalsy();
    task.markAsCompleted();
    expect(task.isCompleted()).toBeTruthy();
    renderedTaskElementContainsClass(dom, task, DomRenderizer.completeTaskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomRenderizer.incompleteTaskClass);
    });
});
describe('Funcionalidad: renderizar una tarea tiene clase de tareas y específica', () => {
  test('ConcreteTask al ser renderizada contiene clase de tareas y clase para concreteTasks', () => {
    const dom = new DomRenderizer();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomRenderizer.taskCardClass);
    renderedTaskElementContainsClass(dom, task, DomRenderizer.concreteTaskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomRenderizer.compositeTaskClass);
    });
  test('CompositeTask al ser renderizada contiene clase de tareas y clase para compositeTasks', () => {
    const dom = new DomRenderizer();
    const task = Task.createCompositeTask([Task.createConcreteTask(addYears(new Date(), 100))]);
    renderedTaskElementContainsClass(dom, task, DomRenderizer.taskCardClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomRenderizer.concreteTaskClass);
    renderedTaskElementContainsClass(dom, task, DomRenderizer.compositeTaskClass);
    });
});
describe('Funcionalidad: renderizar una tarea tiene un navbar con botón de subtasks', () => {
  test('Renderizar composite task contiene navbar', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const navBar  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    expect(navBar).not.toBeNull();
    expect(navBar.tagName.toLowerCase()).toBe('nav');
  });
  test('CompositeTask con una concreteTask dependiente al ser renderizada contiene nav para botones con botón de subtasks', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const navBar  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    expect(subtasksButton).not.toBeNull();
    expect(subtasksButton.getAttribute('id')).toBe(DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    expect(subtasksButton.tagName.toLowerCase()).toBe('button');
    expect(subtasksButton.textContent).toBe(DomRenderizer.renderedTaskInfoNavBarSubtaskButtonTextContent);
  });
  test('concreteTask al ser renderizada contiene nav para botones con el de subtasks incluido', () => {
    let handlerExecuted = false;
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    expect(navBar).not.toBeNull();
    expect(navBar.tagName.toLowerCase()).toBe('nav');
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    expect(subtasksButton).not.toBeNull();
    expect(subtasksButton.getAttribute('id')).toBe(DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    expect(subtasksButton.tagName.toLowerCase()).toBe('button');
    expect(subtasksButton.textContent).toBe(DomRenderizer.renderedTaskInfoNavBarSubtaskButtonTextContent);
  });
});
describe('Funcionalidad: renderizar una tarea la agrega a pantalla', () => {
  test('click sobre concreteTask renderizada la agrega a content display', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const dom = new DomRenderizer();
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull(); 
    const renderedTask = dom.renderTask(concreteTask);
    const taskCard = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(taskCard);
    assertElementOfTaskTitleElementIsCorrect(taskCard, concreteTask);
    assertElementOfTaskDescriptionElementIsCorrect(taskCard, concreteTask);
    assertElementOfTaskDueDateIsCorrect(taskCard, concreteTask);
    assertElementOfTaskPriorityIsCorrect(taskCard, concreteTask);
  });
  test('click sobre compositeTask renderizada la agrega a content display', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0])
    const dom = new DomRenderizer();
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull(); 
    const renderedTask = dom.renderTask(compositeTask);
    const taskCard = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(taskCard);
    assertElementOfTaskTitleElementIsCorrect(taskCard, compositeTask);
    assertElementOfTaskDescriptionElementIsCorrect(taskCard, compositeTask);
    assertElementOfTaskDueDateIsCorrect(taskCard, compositeTask);
    assertElementOfTaskPriorityIsCorrect(taskCard, compositeTask);
  });
  test('click sobre compositeTask renderizada la agrega a content display y saca la que estaba antes', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0])
    const dom = new DomRenderizer();
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull(); 
    const renderCompositeTask = dom.renderTask(compositeTask);
    assertNotNullAndDefined(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass));
    const renderedTask = dom.renderTask(concreteTask);
    const taskCard = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(taskCard);
    assertElementOfTaskTitleElementIsCorrect(taskCard, concreteTask);
    assertElementOfTaskDescriptionElementIsCorrect(taskCard, concreteTask);
    assertElementOfTaskDueDateIsCorrect(taskCard, concreteTask);
    assertElementOfTaskPriorityIsCorrect(taskCard, concreteTask);
  });
});
describe('Funcionalidad: Tareas tienen contenedor para ubicar contenido de los distintos botones del navbar', () => {  
  test('concreteTask y compositeTask al ser renderizadas contienen taskComponentsContainer', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([anotherConcreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);

    expect(concreteTaskRendered.querySelector('#' + DomRenderizer.renderedTasksComponentsContainerID)).toBeDefined();
    expect(compositeTaskRendered.querySelector('#' + DomRenderizer.renderedTasksComponentsContainerID)).toBeDefined();
    expect(concreteTaskRendered.querySelector('#' + DomRenderizer.renderedTasksComponentsContainerID).tagName.toLowerCase()).toBe(DomRenderizer.containersElementTag);
    expect(compositeTaskRendered.querySelector('#' + DomRenderizer.renderedTasksComponentsContainerID).tagName.toLowerCase()).toBe(DomRenderizer.containersElementTag);
  });
});
describe('Funcionalidad: Botón subtask de navbar de CompositeTask renderizada muestra a sus dependientes como task resumes', () => {
  test('CompositeTask con una concreteTask dependiente al ser renderizada contiene nav para botones con botón de subtasks que al ser presionado pone dentro de tasksComponentsContainer a dependentsTaskContainer', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const navBar  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    expect(compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeNull();
    expect(taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeNull();
    subtasksButton.click();
    expect(taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeDefined();
  });
  test('CompositeTask con una concreteTask dependiente al ser renderizada contiene nav para botones con botón de subtasks que al ser presionado pone dentro de tasksComponentsContainer a dependentsTaskContainer con los task resumes de su dependiente', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const navBar  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    expect(compositeTaskRendered.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeNull();
    expect(taskComponentsContainer).not.toBeNull();
    expect(taskComponentsContainer).not.toBeUndefined();
    subtasksButton.click();
    expect(compositeTask).toBeInstanceOf(CompositeTask);
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    expect(dependentsTaskContainer).not.toBeNull();
    expect(dependentsTaskContainer).not.toBeUndefined();
    assertTaskResumeContentIsCorrect(dependentsTaskContainer.children[0], concreteTask);
    });
});
describe('Funcionalidad: Botón subtask de navbar de ConcreteTask renderizada muestra cartel de que no tiene dependientes y ofrece agregarlos con botón', () => {
    test('Concrete task al ser renderizada contiene nav para botones con botón de subtasks que al ser presionado muestra mensaje de que no contiene subtareas y ofrece agregarlas', () => {
      const dom = new DomRenderizer();
      const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
      const concreteTaskRendered = dom.renderTask(concreteTask);
      const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
      const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
      const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
      expect(concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeNull();
      assertNotNullAndDefined(taskComponentsContainer);
      subtasksButton.click();
      expect(concreteTask).toBeInstanceOf(ConcreteTask);
      const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
      assertNotNullAndDefined(dependentsTaskContainer);
      const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
      expect(dependentsTaskContainerOptions.tagName.toLowerCase()).toBe(DomRenderizer.containersElementTag);
      assertNotNullAndDefined(dependentsTaskContainerOptions);
      const textContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerID);
      const buttonToAddTasks = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
      expect(textContainer.tagName.toLowerCase()).toBe('p');
      expect(buttonToAddTasks.tagName.toLowerCase()).toBe('button');
      expect(textContainer.textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerContent);
      expect(buttonToAddTasks.textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksTextContent);
  });
  test('Concrete task al ser renderizada contiene nav para botones con botón de subtasks que al ser presionado muestra mensaje de que no contiene subtareas y ofrece agregarlas', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    expect(concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID)).toBeNull();
    assertNotNullAndDefined(taskComponentsContainer);
    subtasksButton.click();
    expect(concreteTask).toBeInstanceOf(ConcreteTask);
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    assertNotNullAndDefined(dependentsTaskContainer);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    expect(dependentsTaskContainerOptions.tagName.toLowerCase()).toBe(DomRenderizer.containersElementTag);
    assertNotNullAndDefined(dependentsTaskContainerOptions); 
    const textContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerID);
    const buttonToAddTasks = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    expect(textContainer.tagName.toLowerCase()).toBe('p');
    expect(buttonToAddTasks.tagName.toLowerCase()).toBe('button');
    expect(textContainer.textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerContent);
    expect(buttonToAddTasks.textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksTextContent);
  });
  test('Botón de addTask está dentro de un contenedor', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    assertNotNullAndDefined(buttonToAddTasksContainer); 
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    assertNotNullAndDefined(buttonToAddTasks); 
  });
  test('Botón de addTask al ser presionado agrega ul con otros dos botones dentro', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0];
    assertNotNullAndDefined(addExistingTaskButton);
    const createNewTaskButton = listContainerItems[1];
    assertNotNullAndDefined(createNewTaskButton);
    expect(listContainer.classList.contains(DomRenderizer.dropdownMenuClass)).toBeTruthy();
    expect(listContainer.tagName.toLowerCase()).toBe('ul');
    expect(listContainerItems[0].tagName.toLowerCase()).toBe('li');
    expect(listContainerItems[1].tagName.toLowerCase()).toBe('li');
    expect(listContainerItems[0].children[0].tagName.toLowerCase()).toBe('button');
    expect(listContainerItems[1].children[0].tagName.toLowerCase()).toBe('button');

    expect(listContainerItems[0].children[0].textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddExistingTasksButtonTextContent);
    expect(listContainerItems[1].children[0].textContent).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForCreateNewTasksButtonTextContent);

    expect(listContainerItems[0].children[0].getAttribute('id')).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButtonID);
    expect(listContainerItems[1].children[0].getAttribute('id')).toBe(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButtonID);
  });
  test('Botón de addTask al sacarle el mouse de su contenedor del addTaskButton se borra', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    let listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer); 
    const buttonToAddTasksContainerPosition = buttonToAddTasksContainer.getBoundingClientRect();
    buttonToAddTasksContainer.dispatchEvent(new MouseEvent('mouseover', {clientX: buttonToAddTasksContainerPosition.left+1, clientY: buttonToAddTasksContainerPosition.top + 1}));
    listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer); 

  });
  test('Botón de addNewTask al hacerle click muestra formulario de creación de tareas', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer); 
    const listContainerItems = listContainer.querySelectorAll('li');
    const createNewTaskButton = listContainerItems[1].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    expect(document.body.querySelector('#' + DomRenderizer.createFormDialogID)).toBeNull();
    createNewTaskButton.click();
    const taskCreationDialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    const taskCreationForm = taskCreationDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    assertNotNullAndDefined(taskCreationForm);
    assertNotNullAndDefined(taskCreationDialog);
    assertTaskCreationFormHasAllNeededFields(taskCreationForm);
    const cancelButton = taskCreationDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    const submitButton = taskCreationDialog.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    assertNotNullAndDefined(submitButton);
    assertNotNullAndDefined(cancelButton);
  });
  test('Cancel button close dialog when clicked', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer);
    const listContainerItems = listContainer.querySelectorAll('li');
    const createNewTaskButton = listContainerItems[1].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    expect(document.body.querySelector('#' + DomRenderizer.createFormDialogID)).toBeNull();
    createNewTaskButton.click();
    const taskCreationDialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    assertNotNullAndDefined(taskCreationDialog);
    const cancelButton = taskCreationDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    assertNotNullAndDefined(cancelButton);
    expect(taskCreationDialog.open).toBeTruthy();
    cancelButton.click();
    expect(taskCreationDialog.open).toBeFalsy();
  });
  test('Create task button delivers form info to app controller and closes dialog', () => {
    let taskFormInfo;
    const appController = {createTaskByFormInfo: (userData) => taskFormInfo = userData}
    const dom = new DomRenderizer(appController);
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    assertNotNullAndDefined(listContainer);
    const listContainerItems = listContainer.querySelectorAll('li');
    const createNewTaskButton = listContainerItems[1].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskCreationDialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    expect(taskCreationDialog).toBeNull();
    createNewTaskButton.click();
    taskCreationDialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    assertNotNullAndDefined(taskCreationDialog);
    const taskForm = document.body.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = taskForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    const cancelButton = taskCreationDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    fillTaskForm(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID));    
    assertNotNullAndDefined(submitButton);
    expect(taskCreationDialog.open).toBeTruthy();
    submitButton.click();
    //Testeando que esté dentro del from, que sea de tipo submit y que el método del form sea dialog sé por especificación HTML que el dialog se cerrará. No puedo usar dialog.open porque en jsdom el elemento HTMLDialog no está completamente implementado
    expect(submitButton.getAttribute('form')).toBe(DomRenderizer.formFieldsContainerID);
    expect(submitButton.getAttribute('type')).toBe('submit');
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID).getAttribute('method')).toBe('dialog');
    
    expect(taskFormInfo.title).toBe("taskTitle");
    expect(taskFormInfo.description).toBe("taskDescription");
    expect(taskFormInfo.dueDate).toBe(new Date().toISOString().split('T')[0]);
    expect(taskFormInfo.priorityValue).toBe(String(defaultValues.taskPriorities.minPriorityValue));
  });
  test('add existing task button display taskSearchingDialog', () => {
    let getAllTasksCalled = false;
    const appController = {getAllTasks: () => {
      getAllTasksCalled = true;
      return [];
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    assertNotNullAndDefined(taskSearchingDialog);
    expect(taskSearchingDialog.open).toBeTruthy();
  });
  test('add existing task button display taskSearchingDialog and calls appController asking for all tasks with task as parameter', () => {
    let getAllTasksCalled = false;
    let receivedTask;
    const appController = {getAllTasks: (task) => {
      getAllTasksCalled = true;
      receivedTask = task;
      return [];
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(getAllTasksCalled).toBeTruthy();
    expect(receivedTask).toBe(concreteTask);
  });
  test('add existing dialog has main content container', () => {
    let getAllTasksCalled = false;
    let receivedTask;
    const appController = {getAllTasks: (task) => {
      getAllTasksCalled = true;
      receivedTask = task;
      return [];
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    assertNotNullAndDefined(taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID));
  });  
  test('add existing dialog has main content container with list for tasks', () => {
    let getAllTasksCalled = false;
    let receivedTask;
    const appController = {getAllTasks: (task) => {
      getAllTasksCalled = true;
      receivedTask = task;
      return [];
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
  });
  test('add existing dialog has main content container with list for tasks with as many li as tasks returned by appController with searchingListItemID', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask]; 
    const appController = {getAllTasks: (task) => {
      return taskOptions;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    expect(Array.from(listItems).every(listItem => listItem.getAttribute('id') === DomRenderizer.searchingListItemID)).toBeTruthy();
    expect(listItems.length).toBe(taskOptions.length);
    assertNotNullAndDefined(listItems[0]);
    assertNotNullAndDefined(listItems[1]);
  });
  test('searchingListItemID has task title', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask]; 
    const appController = {getAllTasks: (task) => {
      return taskOptions;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    expect(listItems.length).toBe(taskOptions.length);
    assertElementOfTaskTitleElementIsCorrect(listItems[0], taskOptions[0]);
    assertElementOfTaskTitleElementIsCorrect(listItems[1], taskOptions[1]);
  });
  test('searchingListItemID has task description', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask]; 
    const appController = {getAllTasks: (task) => {
      return taskOptions;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    expect(listItems.length).toBe(taskOptions.length);
    assertElementOfTaskDescriptionElementIsCorrect(listItems[0], taskOptions[0]);
    assertElementOfTaskDescriptionElementIsCorrect(listItems[1], taskOptions[1]);
  });
  test('searchingListItemID has task due date', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask]; 
    const appController = {getAllTasks: (task) => {
      return taskOptions;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    expect(listItems.length).toBe(taskOptions.length);
    assertElementOfTaskDueDateIsCorrect(listItems[1], taskOptions[1], true);
    assertElementOfTaskDueDateIsCorrect(listItems[0], taskOptions[0], true);
});
  test('searchingListItemID has task priority', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask]; 
    const appController = {getAllTasks: (task) => {
      return taskOptions;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    expect(document.body.querySelector('#' + DomRenderizer.formFieldsContainerID)).toBeNull();
    let taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    expect(taskSearchingDialog).toBeNull();
    addExistingTaskButton.click();
    taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    assertNotNullAndDefined(serchingDialogMainContentContainer);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    expect(listItems.length).toBe(taskOptions.length);
    assertElementOfTaskPriorityIsCorrect(listItems[0], taskOptions[0], false);
    assertElementOfTaskPriorityIsCorrect(listItems[1], taskOptions[1], false);
  });
  test('click a task and press submit sends task to add to the appcontroller', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [anotherConcreteTask]; 
    let subtasksList;
    let taskToAddSubtasks;
    const appController = {
      getAllTasks: (task) => taskOptions,
      addSubtasksTo: (subtasks, task) => {
        subtasksList = subtasks;
        taskToAddSubtasks = task;
        return true;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(concreteTask);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    addExistingTaskButton.click();
    const taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    const submitButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogSubmitButtonID);
    assertNotNullAndDefined(submitButton);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    listItems[0].click();
    submitButton.click();
    expect(subtasksList).toEqual([anotherConcreteTask]);
    expect(taskToAddSubtasks).toEqual(concreteTask)
  });
  test('click tasks and press submit sends all pressed tasks to add to the appcontroller', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const subtasksOwner = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, 'subtasksOwner', 'a');
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask, oneMoreTask]; 
    let subtasksList;
    let taskToAddSubtasks;
    const appController = {
      getAllTasks: (task) => taskOptions,
      addSubtasksTo: (subtasks, task) => {
        subtasksList = subtasks;
        taskToAddSubtasks = task;
        return true;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(subtasksOwner);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    addExistingTaskButton.click();
    const taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    const submitButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogSubmitButtonID);
    assertNotNullAndDefined(submitButton);
    const listOfTaskToAdd = serchingDialogMainContentContainer.querySelector('ul');
    assertNotNullAndDefined(listOfTaskToAdd);
    const listItems = listOfTaskToAdd.querySelectorAll('li');
    listItems[0].click();
    listItems[2].click();
    submitButton.click();
    expect(subtasksList).toEqual([concreteTask, oneMoreTask]);
    expect(taskToAddSubtasks).toEqual(subtasksOwner);
  });
  test('add existing task dialog has cancel button', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const subtasksOwner = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, 'subtasksOwner', 'a');
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask, oneMoreTask]; 
    let subtasksList;
    let taskToAddSubtasks;
    const appController = {
      getAllTasks: (task) => taskOptions,
      addSubtasksTo: (subtasks, task) => {
        subtasksList = subtasks;
        taskToAddSubtasks = task;
        return true;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(subtasksOwner);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    addExistingTaskButton.click();
    const taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    const submitButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogSubmitButtonID);
    const cancelButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogCancelButtonID);
    assertNotNullAndDefined(submitButton);
    assertNotNullAndDefined(cancelButton);
  });
  test('press add existing task dialog cancel button close dialog', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const subtasksOwner = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, 'subtasksOwner', 'a');
    const anotherConcreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle', 'aDescription');
    const taskOptions = [concreteTask, anotherConcreteTask, oneMoreTask]; 
    let subtasksList;
    let taskToAddSubtasks;
    const appController = {
      getAllTasks: (task) => taskOptions,
      addSubtasksTo: (subtasks, task) => {
        subtasksList = subtasks;
        taskToAddSubtasks = task;
        return true;
      }
    };
    const dom = new DomRenderizer(appController);
    const concreteTaskRendered = dom.renderTask(subtasksOwner);
    const navBar  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTaskInfoNavBarID);
    const subtasksButton = navBar.querySelector('#' + DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
    const taskComponentsContainer  = concreteTaskRendered.querySelector("#" + DomRenderizer.renderedTasksComponentsContainerID);
    subtasksButton.click();
    const dependentsTaskContainer = taskComponentsContainer.querySelector("#" + DomRenderizer.renderedTaskDependentsTasksContainerID);
    const dependentsTaskContainerOptions = dependentsTaskContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
    const buttonToAddTasksContainer = dependentsTaskContainerOptions.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);
    const buttonToAddTasks = buttonToAddTasksContainer.querySelector('#' + DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID);
    buttonToAddTasks.click();
    const listContainer = buttonToAddTasksContainer.querySelector('.' + DomRenderizer.dropdownMenuClass);
    const listContainerItems = listContainer.querySelectorAll('li');
    const addExistingTaskButton = listContainerItems[0].children[0];
    addExistingTaskButton.click();
    const taskSearchingDialog = document.body.querySelector('#' + DomRenderizer.searchingTaskDialogID);
    const serchingDialogMainContentContainer = taskSearchingDialog.querySelector('#' + DomRenderizer.taskSearchingDialogMainContentContainerID); 
    const submitButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogSubmitButtonID);
    const cancelButton = serchingDialogMainContentContainer.querySelector('#' + DomRenderizer.searchingDialogCancelButtonID);
    expect(taskSearchingDialog.open).toBeTruthy();
    cancelButton.click();
    expect(taskSearchingDialog.open).toBeFalsy();
  });
});

function assertCanSelectAListItemByClickAndSubmitSendsThemToAppController(listItem, submitButton){
  listItem.click();
  submitButton.click();
}

function assertNotNullAndDefined(element){
  expect(element).not.toBeNull();
  expect(element).toBeDefined();
}

function assertElementOfTaskTitleElementIsCorrect(taskTitleElementsContainer, task){
  const taskTitleElement = taskTitleElementsContainer.querySelector(DomRenderizer.elementsTagForTaskTitles);
  assertNotNullAndDefined(taskTitleElement);
  expect(taskTitleElement.textContent).toBe(task.getTitle());
  assertHasTagName(taskTitleElement, DomRenderizer.elementsTagForTaskTitles);
}


function assertElementOfTaskDescriptionElementIsCorrect(taskDescriptionElementsContainer, task){
  const taskDescriptionElement = taskDescriptionElementsContainer.querySelector(DomRenderizer.elementsTagForTaskDescriptions);
  assertNotNullAndDefined(taskDescriptionElement);
  expect(taskDescriptionElement.textContent).toBe(task.getDescription());
  assertHasTagName(taskDescriptionElement, DomRenderizer.elementsTagForTaskDescriptions);
}


function assertElementOfTaskDueDateIsCorrect(taskDueDateElementsContainer, task, readonly = false){
  const taskDueDateElement = taskDueDateElementsContainer.querySelector(DomRenderizer.elementsTagForTaskDueDate);
  assertNotNullAndDefined(taskDueDateElement);
  expect(taskDueDateElement.getAttribute('value')).toBe(task.getDueDate());
  assertHasTagName(taskDueDateElement, DomRenderizer.elementsTagForTaskDueDate);
  expect(taskDueDateElement.getAttribute('type')).toBe('date');
  expect(taskDueDateElement.getAttribute('name')).toBe('dueDate');
  if (readonly){
    expect(taskDueDateElement.getAttribute('readonly')).toBeTruthy();
  }
}

function assertElementOfTaskPriorityIsCorrect(taskPriorityElementsContainer, task, readonly = false){
  const taskPriorityElement = taskPriorityElementsContainer.querySelector(DomRenderizer.elementsTagForTaskPriority + `[class=${DomRenderizer.taskPriorityClass}]`);
  assertNotNullAndDefined(taskPriorityElement);
  expect(taskPriorityElement.getAttribute('value')).toBe(String(task.getPriority()));
  expect(taskPriorityElement.getAttribute('type')).toBe('range');
  assertHasTagName(taskPriorityElement, DomRenderizer.elementsTagForTaskPriority);
  if (readonly){
    expect(taskPriorityElement.getAttribute('readonly')).toBeTruthy();
  }
}

function assertHasTagName(element, tagName){
  expect(element.tagName.toLowerCase()).toBe(tagName);
}

describe('Funcionalidad: Tasks tienen botón de edición', () => {
  test('ConcreteTask tiene botón de edición', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createConcreteTask();
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    expect(taskEditButton).not.toBeNull();
    expect(taskEditButton.tagName.toLowerCase()).toBe('button');
    expect(taskEditButton.textContent).toBe(DomRenderizer.editTaskButtonTextContent);
  });
  test('CompositeTask tiene botón de edición', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    expect(taskEditButton).not.toBeNull();
    expect(taskEditButton.tagName.toLowerCase()).toBe('button');
    expect(taskEditButton.textContent).toBe(DomRenderizer.editTaskButtonTextContent);
  });
  test('Botón de edición añade dialog al clickearlo', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskEditButton.click();
    assertNotNullAndDefined(document.body.querySelector('dialog'));
  });
  test('Botón de edición añade y abre dialog al clickearlo ', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(editionDialog);
    expect(editionDialog.open).toBeTruthy();
  });
  test('Dialog contiene formulario con campos para editar tarea', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    assertTaskCreationFormHasAllNeededFields(editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID));
  });
  test('Dialog contiene cancel button', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(editionDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID));
  });
  test('cancel button al presionarlo cierra dialog', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    const cancelButton = editionDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    expect(editionDialog.open).toBeTruthy();
    cancelButton.click();
    expect(editionDialog.open).toBeFalsy();
  });
  test('Dialog contiene submit button', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(editionDialog.querySelector('#' + DomRenderizer.creationFormSubmitButtonID));
  });
  test('submit button al presionarlo envía mensaje de editTask a appController', () => {
    let taskToEdit;
    const appController = {
      editTask: (originalTask, fields) => taskToEdit = fields
    };
    const dom = new DomRenderizer(appController);
    const task = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')], taskDueDates[1]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    const submitButton = editionDialog.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    fillTaskForm(editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID));
    submitButton.click();
    expect(taskToEdit.title).not.toEqual(task.getTitle());
    expect(taskToEdit.description).not.toEqual(task.getDescription());
    expect(taskToEdit.dueDate).not.toEqual(task.getDueDate());
    expect(taskToEdit.priorityValue).not.toEqual(task.getPriority());
    expect(taskToEdit.title).toEqual("taskTitle");
    expect(taskToEdit.description).toEqual("taskDescription");
    expect(taskToEdit.dueDate).toEqual(new Date().toISOString().split('T')[0]);
    expect(taskToEdit.priorityValue).toEqual(String(defaultValues.taskPriorities.minPriorityValue));
  });
  test('Formulario inicia con información de la tarea cargada en los campos', () => {
    let taskToEdit;
    const appController = {
      editTask: (originalTask, fields) => taskToEdit = fields
    };
    const dom = new DomRenderizer(appController);
    const task = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    const editionDialog = document.body.querySelector('dialog');
    const form = editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(form.querySelector('#' + DomRenderizer.taskFormTitleInputID).textContent).toEqual(task.getTitle());
    expect(form.querySelector('#' + DomRenderizer.taskFormDescriptionInputID).textContent).toEqual(task.getDescription());
    expect(form.querySelector('#' + DomRenderizer.taskFormDueDateInputID).getAttribute('value')).toEqual(task.getDueDate());
    expect(form.querySelector('#' + DomRenderizer.taskFormPriorityValueSelectInputID).getAttribute('value')).toEqual(String(task.getPriority()));
  });
});
describe('Funcionalidad: Tasks tienen botón de borrado', () => {
  test('ConcreteTask tiene botón de borrado', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createConcreteTask();
    const renderedTask = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(taskDeleteButton).not.toBeNull();
    expect(taskDeleteButton.tagName.toLowerCase()).toBe('button');
    expect(taskDeleteButton.textContent).toBe(DomRenderizer.deleteTaskButtonTextContent);
  });
  test('CompositeTask tiene botón de borrado', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(taskDeleteButton).not.toBeNull();
    expect(taskDeleteButton.tagName.toLowerCase()).toBe('button');
    expect(taskDeleteButton.textContent).toBe(DomRenderizer.deleteTaskButtonTextContent);
  });
  test('Presionar botón de borrado muestra dialog', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(confirmationDialog);
    expect(confirmationDialog.open).toBeTruthy();
  });
  test('Dialog tiene botón de cancelar', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const cancelButton = confirmationDialog.querySelector('.' + DomRenderizer.cancelActionButtonClass);
    assertNotNullAndDefined(cancelButton);
    assertHasTagName(cancelButton, 'button');
  });
  test('Presionar botón de cancelar cierra dialog pero no saca tarea de contentDisplay', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    assertNotNullAndDefined(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass));
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const cancelButton = confirmationDialog.querySelector('.' + DomRenderizer.cancelActionButtonClass);
    cancelButton.click();
    expect(document.body.querySelector('dialog')).toBeNull();
    expect(confirmationDialog.open).toBeFalsy();
    assertNotNullAndDefined(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass));
  });
  test('Dialog tiene botón de confirmar', () => {
    const dom          = new DomRenderizer();
    const task         = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    assertNotNullAndDefined(confirmButton);
    assertHasTagName(confirmButton, 'button');
  });
  test('botón de confirmar al ser presionado manda deleteTask a appController', () => {
    let taskToDelete;
    const appController = {deleteTask: (task) => taskToDelete = task};
    const dom           = new DomRenderizer(appController);
    const task          = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask  = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    confirmButton.click();
    expect(taskToDelete).toEqual(task);
  });
  test('botón de confirmar al ser presionado también cierra dialog y lo saca del dom', () => {
    let taskToDelete;
    const appController = {deleteTask: (task) => taskToDelete = task};
    const dom           = new DomRenderizer(appController);
    const task          = Task.createCompositeTask([Task.createConcreteTask(addDays(new Date(), 4), defaultValues.taskPriorities.maxPriorityValue, 'a')]);
    const renderedTask  = dom.renderTask(task);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    expect(document.body.querySelector('dialog')).toBeNull();
    taskDeleteButton.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    confirmButton.click();
    expect(confirmationDialog.open).toBeFalsy();
    expect(document.body.querySelector('dialog')).toBeNull();
  });
});
describe('Funcionalidad: Tasks tienen botón de cerrar pestaña que la saca de content display', () => {
  test('click sobre task renderizada la agrega close button a content display', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const dom = new DomRenderizer();
    const renderedTask = dom.renderTask(concreteTask);
    const taskCard = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
    const closeButton = taskCard.querySelector('.' + DomRenderizer.closeButtonClass);
    assertNotNullAndDefined(closeButton);
    assertHasTagName(closeButton, 'button');
  });
  test('click sobre close button la saca del content display', () => {
    const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const dom = new DomRenderizer();
    const renderedTask = dom.renderTask(concreteTask);
    const taskCard = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
    const closeButton = taskCard.querySelector('.' + DomRenderizer.closeButtonClass);
    closeButton.click();
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull();
  });
});
describe('Funcionalidad: renderizar una nota contiene su título', () => {
  test('Nota al ser renderizada contiene titulo', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0]);
    renderedNoteHasCorrectClassAndElementTag(dom, note, DomRenderizer.noteTitleClass, DomRenderizer.elementsTagForNotesTitles);
    renderedNoteHasCorrectClassInfo(dom, note, DomRenderizer.noteTitleClass, noteTitles[0]);
  });
});
describe('Funcionalidad: renderizar una nota contiene su cuerpo', () => {
  test('Nota al ser renderizada contiene cuerpo', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    renderedNoteHasCorrectClassAndElementTag(dom, note, DomRenderizer.noteBodyClass, DomRenderizer.elementsTagForNotesBodies);
    renderedNoteHasCorrectClassInfo(dom, note, DomRenderizer.noteBodyClass, noteBodies[0]);
  });  
});
describe('Funcionalidad: renderizar una nota contiene su fecha de creación', () => {
  test('Nota al ser renderizada contiene fecha', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const dateElement = dom.renderNote(note).querySelector("." + DomRenderizer.noteDateClass);
    const todaysDateInBrowserFormat = new Date().toISOString().split('T')[0];
    expect(dateElement.textContent).toBe(todaysDateInBrowserFormat);
    expect(dateElement.tagName.toLowerCase()).toBe('input');
    expect(dateElement.getAttribute('type')).toBe('date');
    expect(dateElement.getAttribute('readonly')).toBeTruthy();
  });  
});
describe('Funcionalidad: renderizar una nota contiene botón de edición', () => {
  test('Contiene botón con id', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(button).not.toBeNull();
    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button.textContent).toBe(DomRenderizer.editNoteButtonTextContent);
  });
  test('Presionar botón ejecuta muestra dialog', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(editionDialog);
    expect(editionDialog.open).toBeTruthy();
  });
  test('Dialog tiene formulario para modificar nota', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const noteEditionForm = editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    assertNotNullAndDefined(noteEditionForm);
    assertNoteCreationFormHasAllNeededFields(noteEditionForm);
  });
  test('Dialog tiene formulario para modificar nota con datos de nota ya cargados', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const noteEditionForm = editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteEditionForm.querySelector('#' + DomRenderizer.noteFormTitleInputID).textContent).toBe(note.getTitle());
    expect(noteEditionForm.querySelector('#' + DomRenderizer.noteFormBodyInputID).textContent).toBe(note.getBody());
  });
  test('Dialog tiene boton de cancelar', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const cancelButton = editionDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    assertNotNullAndDefined(cancelButton);
    assertHasTagName(cancelButton, 'button');
  });
  test('Boton de cancelar al ser presionado cierra dialog', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const cancelButton = editionDialog.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    cancelButton.click();
    expect(editionDialog.open).toBeFalsy();
    expect(document.body.querySelector('dialog')).toBeNull();
  });
  test('Dialog tiene botón de submit', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const submitButton = editionDialog.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    assertNotNullAndDefined(submitButton);
    assertHasTagName(submitButton, 'button');
  });
  test('Submit button al ser presionado manda tarea a appcontroller', () => {
    let noteToEdit;
    let updatedData;
    const appController = {editNote: (note, newData) => {
        noteToEdit = note; 
        updatedData = newData;
      }
    };
    const dom = new DomRenderizer(appController);
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    expect(document.body.querySelector('dialog')).toBeNull();
    button.click();
    const editionDialog = document.body.querySelector('dialog');
    const submitButton = editionDialog.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    const noteEditionForm = editionDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    fillNoteForm(noteEditionForm);
    submitButton.click();
    expect(noteToEdit).toEqual(note);
    expect(updatedData.title).toBe('noteTitle');
    expect(updatedData.body).toBe('noteBody');
  });
});
describe('Funcionalidad: renderizar una nota contiene botón de borrado', () => {
  test('Contiene botón con id', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    expect(button).not.toBeNull();
    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button.textContent).toBe(DomRenderizer.deleteNoteButtonTextContent);
  });
  test('Presionar botón de borrado abre dialog', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    assertNotNullAndDefined(confirmationDialog);
    expect(confirmationDialog.open).toBeTruthy();
  });
  test('Dialog contiene boton de cancelar', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const cancelButton = confirmationDialog.querySelector('.' + DomRenderizer.cancelActionButtonClass);
    assertNotNullAndDefined(cancelButton);
    assertHasTagName(cancelButton, 'button');
  });
  test('Boton de cancelar al ser presionado cierra dialog y lo borra del dom', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const cancelButton = confirmationDialog.querySelector('.' + DomRenderizer.cancelActionButtonClass);
    expect(confirmationDialog.open).toBeTruthy();
    cancelButton.click();
    expect(confirmationDialog.open).toBeFalsy();
    expect(document.querySelector('dialog')).toBeNull();
  });
  test('Dialog contiene boton de confirmar', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    assertNotNullAndDefined(confirmButton);
    assertHasTagName(confirmButton, 'button');
  });
  test('Boton de confirmar al ser presionado envía nota a appcontroller', () => {
    let noteToDelete;
    const appController = {deleteNote: (note) => noteToDelete = note};
    const dom = new DomRenderizer(appController);
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    expect(confirmationDialog.open).toBeTruthy();
    confirmButton.click();
    expect(noteToDelete).toEqual(note);
  });
  test('Boton de confirmar al ser presionado también cierra dialog y lo saca del dom', () => {
    let noteToDelete;
    const appController = {deleteNote: (note) => noteToDelete = note};
    const dom = new DomRenderizer(appController);
    const note = new Note(noteTitles[0], noteBodies[0]);
    const renderedNote = dom.renderNote(note);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    const confirmationDialog = document.body.querySelector('dialog');
    const confirmButton = confirmationDialog.querySelector('.' + DomRenderizer.confirmActionButtonClass);
    expect(confirmationDialog.open).toBeTruthy();
    confirmButton.click();
    expect(confirmationDialog.open).toBeFalsy();
    expect(document.querySelector('dialog')).toBeNull();
  });
});
describe('Funcionalidad: Formulario de creación de contenido', () => {
  test('Contiene método para crear formulario', () => {
    const dom  = new DomRenderizer();
    expect(dom.createContentForm).toBeDefined();
  });
  test('Método para crear formulario retorna un HTMLDialog', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    expect(form.tagName.toLowerCase() === "dialog").toBeTruthy();
  });
  test('dialog contiene botón con opción de task', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    expect(form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID).tagName.toLowerCase() === "button").toBeTruthy();
  });
  test('dialog contiene botón con opción de note', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    expect(form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID).tagName.toLowerCase() === "button").toBeTruthy();
  });
  test('dialog contains forms container after task option is selected', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    let taskCreationForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(taskCreationForm).toBeNull();
    createTaskButton.click();
    taskCreationForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(taskCreationForm).not.toBeNull();
    expect(taskCreationForm).toBeDefined();
    expect(taskCreationForm).not.toBeNull();
    expect(taskCreationForm.tagName.toLowerCase() === 'form').toBeTruthy();
  });
  test('dialog contains forms container after note option is selected', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    let noteCreationForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteCreationForm).toBeNull();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    expect(noteCreationForm).toBeNull();
    createNoteButton.click();
    noteCreationForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteCreationForm).toBeDefined();
    expect(noteCreationForm).not.toBeNull();
    expect(noteCreationForm.tagName.toLowerCase() === 'form').toBeTruthy();
  });
  test('forms container after create task button is pressed contains all needed fields', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    let taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(taskForm).toBeNull();
    createTaskButton.click();
    taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(taskForm).toBeDefined();
    expect(taskForm).not.toBeNull();
    assertTaskCreationFormHasAllNeededFields(taskForm);
    assertContainerHasElement(taskForm, "button", DomRenderizer.creationFormSubmitButtonID);
  });
    test('forms container after create note button is pressed contains all needed fields', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteForm).toBeNull();
    createNoteButton.click();
    noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteForm).toBeDefined();
    expect(noteForm).not.toBeNull();
    assertNoteCreationFormHasAllNeededFields(noteForm);
    assertContainerHasElement(noteForm, 'button', DomRenderizer.creationFormSubmitButtonID);
  });
  test('Can change from note to task and the form fields also change', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(noteForm).toBeNull();
    createNoteButton.click();
    noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteForm).toBeDefined();
    expect(noteForm).not.toBeNull();
    assertNoteCreationFormHasAllNeededFields(noteForm);
    createTaskButton.click();
    let taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(taskForm).toBeDefined();
    expect(taskForm).not.toBeNull();
    assertTaskCreationFormHasAllNeededFields(taskForm);
  });
  test('Can change from task to note and the form fields also change', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    let taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(taskForm).toBeNull();
    createTaskButton.click();
    taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(taskForm).toBeDefined();
    expect(taskForm).not.toBeNull();
    assertTaskCreationFormHasAllNeededFields(taskForm);
    createNoteButton.click();
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteForm).toBeDefined(); 
    expect(noteForm).not.toBeNull();
    assertNoteCreationFormHasAllNeededFields(noteForm);
  });
  test('submit button doesnt appears until tasks options or notes is selected', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(form.querySelector("#" + DomRenderizer.creationFormSubmitButtonID)).toBeNull();
    expect(noteForm).toBeNull();
    createNoteButton.click();
    noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    expect(noteForm).toBeDefined(); 
    expect(noteForm).not.toBeNull();
    expect(form.querySelector("#" + DomRenderizer.creationFormSubmitButtonID)).toBeDefined();
  });
  test('submit button close dialog when is pressed', () => {
    const appController = {createTaskByFormInfo: (userData) => userData};
    const dom  = new DomRenderizer(appController);
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    let taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = taskForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton).not.toBeNull();
    fillTaskForm(taskForm);
    submitButton.click();
    expect(!form.open).toBeTruthy();
  });
  test('cancel button close dialog when is pressed', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    const cancelButton     = form.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    expect(cancelButton).toBeDefined();
    cancelButton.click();
    expect(!form.open).toBeTruthy();
  });
  test('when notes is selected, submitButton contains correct text', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = noteForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton).not.toBeNull();
    expect(submitButton.textContent === DomRenderizer.createNoteButtonText).toBeTruthy();
    expect(submitButton.getAttribute('type') === 'submit').toBeTruthy();
  });
  test('when notes is selected form contains just one submitButton', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    let noteForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = noteForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton).not.toBeNull();
    createNoteButton.click();
    expect(noteForm.querySelectorAll("#" + DomRenderizer.creationFormSubmitButtonID).length === 1).toBeTruthy();
  });
  test('when tasks is selected, submitButton contains correct text', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    let taskForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = taskForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent === DomRenderizer.createTaskButtonText).toBeTruthy();
    expect(submitButton.getAttribute('type') === 'submit').toBeTruthy();
  });
 test('when notes is selected form contains just one submitButton', () => {
    const dom  = new DomRenderizer();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    let notesForm = form.querySelector('#' + DomRenderizer.formFieldsContainerID);
    const submitButton = notesForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton).not.toBeNull();
    createNoteButton.click();
    expect(notesForm.querySelectorAll("#" + DomRenderizer.creationFormSubmitButtonID).length === 1).toBeTruthy();
  });
  test('can collect info from note form using appropiated handlers', () => {
    let noteInfo;
    const appController = {createNoteByFormInfo: (userData) => noteInfo = userData};
    const dom = new DomRenderizer(appController);
    const createButton = dom.renderCreateButton();
    createButton.click();
    const dialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    const createNoteButton = dialog.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    const noteForm = dialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    fillNoteForm(noteForm);
    const submitButton = noteForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(noteInfo.title).toBe('noteTitle');
    expect(noteInfo.body).toBe('noteBody');
  });
  test('can collect info from task form using appropiated handlers', () => {
    let taskInfo;
    const appController = {createTaskByFormInfo: (userData) => taskInfo = userData};
    const dom = new DomRenderizer(appController);
    const createButton = dom.renderCreateButton();
    createButton.click();
    const dialog = document.body.querySelector('#' + DomRenderizer.createFormDialogID);
    const createTaskButton = dialog.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    const taskForm = dialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
    fillTaskForm(taskForm);
    const submitButton = taskForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(taskInfo.title).toBe('taskTitle');
    expect(taskInfo.description).toBe('taskDescription');
    expect(taskInfo.dueDate).toBe(new Date().toISOString().split('T')[0]);
    expect(taskInfo.priorityValue).toBe(String(defaultValues.taskPriorities.minPriorityValue));
  });
});
describe('Funcionalidad: Task resumes', () => {
  test('DomRenderizer contiene método para hacer task resumes', () => {
    const aDomRenderizer = new DomRenderizer();
    expect(aDomRenderizer.renderTaskResume).toBeDefined();
  });
  test('Task resume de una tarea retorna contenedor con clase adecuada', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    expect(taskResume.classList.contains(DomRenderizer.tasksResumeClass)).toBeTruthy();
    expect(taskResume.tagName.toLowerCase()).toBe(DomRenderizer.containersElementTag);
  });
  test('Task resume de una tarea retorna contenedor que contiene checkbox', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    expect(checkbox).not.toBeNull();
    expect(checkbox.tagName.toLowerCase() === 'input').toBeTruthy();
    expect(checkbox.getAttribute("type")).toBe('checkbox');
  });
  test('Task resume de una tarea retorna contenedor con checkbox marcado si la tarea está completa', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    aTask.markAsCompleted();
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    expect(checkbox.checked).toBeTruthy();
  });
  test('Task resume de una tarea retorna contenedor con checkbox no marcado si la tarea no está completa', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    expect(aTask.isCompleted()).toBeFalsy();
    expect(checkbox.getAttribute('checked')).toBeFalsy();
  });
  test('Al marcar checkbox de una tarea incompleta esta pasa a estar completa', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask, () => true); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    expect(aTask.isCompleted()).toBeFalsy();
    expect(checkbox.checked).toBeFalsy();
    checkbox.click();
    expect(checkbox.checked).toBeTruthy();
    expect(aTask.isCompleted()).toBeTruthy();
  });
  test('Desmarcar checkbox de una tarea completa esta pasa a estar incompleta', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask, () => true); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    expect(aTask.isCompleted()).toBeFalsy();
    expect(checkbox.checked).toBeFalsy();
    checkbox.click();
    expect(checkbox.checked).toBeTruthy();
    expect(aTask.isCompleted()).toBeTruthy();
    checkbox.click();
    expect(checkbox.checked).toBeFalsy();
    expect(aTask.isCompleted()).toBeFalsy();
  });
  test('Task resume de una tarea retorna contenedor con task title', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const taskTitleElement = taskResume.querySelector('#' + DomRenderizer.tasksResumeTitleID); 
    expect(taskTitleElement).not.toBeNull();
    expect(taskTitleElement.tagName.toLowerCase() === 'p').toBeTruthy();
  });
  test('Task resume de una tarea retorna contenedor que en task title tiene el título de la tarea', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const taskTitleElement = taskResume.querySelector('#' + DomRenderizer.tasksResumeTitleID); 
    expect(taskTitleElement.textContent).toBe(aTask.getTitle());
  });
 test('Task resume de una tarea retorna contenedor que contiene priorityValue', () => {
    const aDomRenderizer = new DomRenderizer();
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask); 
    const priorityValueElement = taskResume.querySelector('#' + DomRenderizer.tasksResumePriorityValueID); 
    expect(priorityValueElement.textContent).toBe(String(aTask.getPriority()));
  }); 
  test('Task resume de una tarea retorna contenedor que al clickearlo ejecuta handler', () => {
    const aDomRenderizer = new DomRenderizer();
    let   handlerExecuted = false;
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask, () => handlerExecuted = true); 
    const priorityValueElement = taskResume.querySelector('#' + DomRenderizer.tasksResumePriorityValueID); 
    taskResume.click();
    expect(handlerExecuted).toBeTruthy();
  });
  test('Task resume de una tarea retorna contenedor que al clickearlo ejecuta handler y no cuando clickeamos checkbox', () => {
    const aDomRenderizer = new DomRenderizer();
    let   handlerExecuted = false;
    const aTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
    const taskResume = aDomRenderizer.renderTaskResume(aTask, () => handlerExecuted = true); 
    const priorityValueElement = taskResume.querySelector('#' + DomRenderizer.tasksResumePriorityValueID); 
    const checkbox = taskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    checkbox.click();
    expect(handlerExecuted).toBeFalsy();
    taskResume.click();
    expect(handlerExecuted).toBeTruthy();
  });
});
describe('Funcionalidad: Construir TasksTree', () => {
  test('Renderizer tiene método para construir taskTree', () => {
    const aDomRenderizer = new DomRenderizer();
    expect(aDomRenderizer.renderTaskTree).toBeDefined();
  });
  test('Renderizer añade task tree container al dom', () => {
    const aDomRenderizer = new DomRenderizer();
    aDomRenderizer.renderTaskTree([]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    assertNotNullAndDefined(taskTreeContainer);
    assertHasTagName(taskTreeContainer, DomRenderizer.containersElementTag);
  });
  test('Al recibir una tarea tiene un li dentro de la lista', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([task]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksListItem = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    assertNotNullAndDefined(tasksListItem[0]);
    assertHasTagName(tasksListItem[0], 'li');
    expect(tasksListItem.length).toBe(1);
  });
  test('Al recibir varias tareas tiene un li dentro de la lista por cada una', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([task, anotherTask, oneMoreTask]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksListItems = taskTreeContainer.querySelectorAll('li');
    assertNotNullAndDefined(tasksListItems[0]);
    assertNotNullAndDefined(tasksListItems[1]);
    assertNotNullAndDefined(tasksListItems[2]);
    assertHasTagName(tasksListItems[0], 'li');
    assertHasTagName(tasksListItems[1], 'li');
    assertHasTagName(tasksListItems[2], 'li');
    expect(tasksListItems.length).toBe(3);
  });
  test('con una sola tarea, dentro de li pone un details con un summary dentro', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([task]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    assertNotNullAndDefined(tasksDetails);
    assertHasTagName(tasksDetails, 'details');
    assertNotNullAndDefined(tasksDetails.querySelector('summary'));
  });
  test('dentro de cada summary pone task info apropiada', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const tasksForTaskTree = [task, anotherTask, oneMoreTask];
    aDomRenderizer.renderTaskTree(tasksForTaskTree);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksListItems = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    let i = 0;
    tasksListItems.forEach(listItem => {
      const summary = listItem.querySelector('details').querySelector('summary');
      assertElementOfTaskTitleElementIsCorrect(summary, tasksForTaskTree[i]);
      assertElementOfTaskDescriptionElementIsCorrect(summary, tasksForTaskTree[i]);
      assertElementOfTaskDueDateIsCorrect(summary, tasksForTaskTree[i]);
      assertElementOfTaskPriorityIsCorrect(summary, tasksForTaskTree[i]);
      i++;
    });
  });
  test('details de cada tarea inician como open', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const tasksForTaskTree = [task, anotherTask, oneMoreTask];
    aDomRenderizer.renderTaskTree(tasksForTaskTree);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksListItems = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    tasksListItems.forEach(listItem => {
      expect(listItem.querySelector('details').getAttribute('open')).toBeTruthy();
    });
  });
  test('task tree de composite task con una dependiente tiene dentro de details ul con un li', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTask = Task.createCompositeTask([task], taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const tasksListItemDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    assertNotNullAndDefined(tasksListItemDetails.querySelector('li'));    
  });
  test('task tree de composite task con varias dependientes tiene dentro de details ul con tantos li como dependientes', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const compositeTaskDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    const compositeTaskDetailsSubtasksListItems = compositeTaskDetails.querySelectorAll('li');
    expect(compositeTaskDetailsSubtasksListItems.length).toBe(3);
  });
  test('dentro de cada li de sus subtasks pone un details con un summary adentro', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const compositeTaskDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    const compositeTaskDetailsSubtasksList = compositeTaskDetails.querySelector('ul');
    const compositeTaskDetailsSubtasksListItems = compositeTaskDetailsSubtasksList.querySelectorAll('li');
    compositeTaskDetailsSubtasksListItems.forEach(subtaskListItem => {
      const details = subtaskListItem.querySelector('details');
      assertNotNullAndDefined(details);
      assertHasTagName(details, 'details');
      const summary = details.querySelector('summary');
      assertNotNullAndDefined(summary);
      assertHasTagName(summary, 'summary');
    });
  });
  test('dentro de cada summary de subtask pone task info adecuada', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('.' + DomRenderizer.taskTreeContainerClass);
    const compositeTaskDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    const compositeTaskDetailsSubtasksList = compositeTaskDetails.querySelector('ul');
    const compositeTaskDetailsSubtasksListItems = compositeTaskDetailsSubtasksList.querySelectorAll('li');
    let i = 0;
    compositeTaskDetailsSubtasksListItems.forEach(subtaskListItem => {
      const details = subtaskListItem.querySelector('details');
      assertElementOfTaskTitleElementIsCorrect(details, subtasks[i]);
      assertElementOfTaskDescriptionElementIsCorrect(details, subtasks[i]);
      assertElementOfTaskDueDateIsCorrect(details, subtasks[i]);
      assertElementOfTaskPriorityIsCorrect(details, subtasks[i]);
      i++;
    });
  });
  test('Task tree se añade a taskTreeContainer en html', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('#taskTreeContainer');
    const compositeTaskDetails = taskTreeContainer.querySelector('ul').querySelector('li').querySelector('details');
    const compositeTaskDetailsSubtasksList = compositeTaskDetails.querySelector('ul');
    const compositeTaskDetailsSubtasksListItems = compositeTaskDetailsSubtasksList.querySelectorAll('li');
    let i = 0;
    compositeTaskDetailsSubtasksListItems.forEach(subtaskListItem => {
      const details = subtaskListItem.querySelector('details');
      assertElementOfTaskTitleElementIsCorrect(details, subtasks[i]);
      assertElementOfTaskDescriptionElementIsCorrect(details, subtasks[i]);
      assertElementOfTaskDueDateIsCorrect(details, subtasks[i]);
      assertElementOfTaskPriorityIsCorrect(details, subtasks[i]);
      i++;
    });
    assertNotNullAndDefined(taskTreeContainer);
  });
  test('Click en una list item de una tarea concreteTask añade a contentDisplay su card', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([task]);
    const taskTreeContainer = document.body.querySelector('#taskTreeContainer');
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull();
    const taskListItem = taskTreeContainer.querySelector('ul').querySelector('li');
    taskListItem.querySelector('details').querySelector('summary').click();
    const contentDisplay = document.body.querySelector('#contentDisplay');
    const cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, task);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, task);
    assertElementOfTaskDueDateIsCorrect(cardView, task);
    assertElementOfTaskPriorityIsCorrect(cardView, task);
  });
  test('Click en una list item de una tarea compositeTask añade a contentDisplay su card', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('#taskTreeContainer');
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull();
    const taskListItems = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    taskListItems[0].querySelector('details').querySelector('summary').click();
    const contentDisplay = document.body.querySelector('#contentDisplay');
    const cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDueDateIsCorrect(cardView, compositeTask);
    assertElementOfTaskPriorityIsCorrect(cardView, compositeTask);
  });
  test('Click en una list item de una tarea añade a contentDisplay su card y al clickear otra lo saca para poner el de la suya', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, anotherTask, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('#taskTreeContainer');
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull();
    const taskListItems = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    taskListItems[0].querySelector('details').querySelector('summary').click();
    const contentDisplay = document.body.querySelector('#contentDisplay');
    let cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDueDateIsCorrect(cardView, compositeTask);
    assertElementOfTaskPriorityIsCorrect(cardView, compositeTask);
    taskListItems[1].querySelector('details').querySelector('summary').click();
    cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, task);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, task);
    assertElementOfTaskDueDateIsCorrect(cardView, task);
    assertElementOfTaskPriorityIsCorrect(cardView, task);
  });
  test('Click en una list item de una tarea añade a contentDisplay su card y al clickear otra lo saca para poner el de la suya pero siendo composite ambas', () => {
    const aDomRenderizer = new DomRenderizer();
    const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
    const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[1]);
    const oneMoreTask = Task.createCompositeTask([anotherTask], taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
    const subtasks = [task, oneMoreTask];
    const compositeTask = Task.createCompositeTask(subtasks, taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a', taskDescriptions[1]);
    aDomRenderizer.renderTaskTree([compositeTask]);
    const taskTreeContainer = document.body.querySelector('#taskTreeContainer');
    expect(document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass)).toBeNull();
    const taskListItems = taskTreeContainer.querySelector('ul').querySelectorAll('li');
    taskListItems[0].querySelector('details').querySelector('summary').click();
    const contentDisplay = document.body.querySelector('#contentDisplay');
    let cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, compositeTask);
    assertElementOfTaskDueDateIsCorrect(cardView, compositeTask);
    assertElementOfTaskPriorityIsCorrect(cardView, compositeTask);
    taskListItems[2].querySelector('details').querySelector('summary').click();
    cardView = contentDisplay.querySelector('.' + DomRenderizer.taskCardClass);
    assertNotNullAndDefined(cardView);
    assertElementOfTaskTitleElementIsCorrect(cardView, oneMoreTask);
    assertElementOfTaskDescriptionElementIsCorrect(cardView, oneMoreTask);
    assertElementOfTaskDueDateIsCorrect(cardView, oneMoreTask);
    assertElementOfTaskPriorityIsCorrect(cardView, oneMoreTask);
  });
});

beforeEach(() => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../../index.html'));  
  document.body.innerHTML = html;
});

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function mock() {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = jest.fn(function mock() {
    this.open = false;
  });
});

function assertTaskResumeContentIsCorrect(aTaskResume, aTask){
    const aDomRenderizer = new DomRenderizer();
    const priorityValueElement = aTaskResume.querySelector('#' + DomRenderizer.tasksResumePriorityValueID); 
    const checkbox = aTaskResume.querySelector('#' + DomRenderizer.tasksResumeCheckboxID); 
    const taskTitleElement = aTaskResume.querySelector('#' + DomRenderizer.tasksResumeTitleID); 
    expect(priorityValueElement).toBeDefined();
    expect(checkbox).toBeDefined();
    expect(taskTitleElement).toBeDefined();
    expect(checkbox.checked).toBe(aTask.isCompleted());
    expect(taskTitleElement.textContent).toBe(aTask.getTitle());
    expect(priorityValueElement.textContent).toBe(String(aTask.getPriority()));    
}

function fillNoteForm(form){
  form.querySelector('#' + DomRenderizer.noteFormTitleInputID).value = 'noteTitle';
  form.querySelector('#' + DomRenderizer.noteFormBodyInputID).value = 'noteBody';  
}

function fillTaskForm(form){
  form.querySelector("#" + DomRenderizer.taskFormTitleInputID).value = "taskTitle";
  form.querySelector("#" + DomRenderizer.taskFormDescriptionInputID).value = "taskDescription";
  form.querySelector("#" + DomRenderizer.taskFormDueDateInputID).value = new Date().toISOString().split('T')[0];
  form.querySelector("#" + DomRenderizer.taskFormPriorityValueSelectInputID).value = defaultValues.taskPriorities.minPriorityValue; 
}

function assertContainerHasElement(container, elementsTag, elementsID){
  const element = container.querySelector("#" + elementsID); 
  expect(element).not.toBeNull();
  expect(element).not.toBeUndefined();
  expect(element.tagName.toLowerCase()).toBe(elementsTag);
}

function assertNoteCreationFormHasAllNeededFields(formFieldsContainer){
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.noteFormTitleInputID, "input", DomRenderizer.noteTitleLabelText, "text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.noteFormBodyInputID, "textarea", DomRenderizer.noteBodyLabelText, "text")).toBeTruthy();
}

function assertTaskCreationFormHasAllNeededFields(formFieldsContainer){
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.taskFormTitleInputID, "input", DomRenderizer.taskTitleLabelText,"text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.taskFormDescriptionInputID, "textarea", DomRenderizer.taskFormDescriptionLabelText, "text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.taskFormDueDateInputID, "input", DomRenderizer.taskFormDueDateLabelText, "date")).toBeTruthy();
  assertDefaultDueDateValueIsToday(formFieldsContainer);
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomRenderizer.taskFormPriorityValueSelectInputID, "select", DomRenderizer.taskFormPriorityValueLabelText)).toBeTruthy();
  assertSelectHasCorrectOptionsAndTextContent(formFieldsContainer);
}

function assertDefaultDueDateValueIsToday(formFieldsContainer){
  const todaysDate = new Date().toISOString().split('T')[0];
  expect(String(formFieldsContainer.querySelector('#' + DomRenderizer.taskFormDueDateInputID).value) === String(todaysDate)).toBeTruthy();
}

function assertSelectHasCorrectOptionsAndTextContent(formFieldsContainer) {
  const select = formFieldsContainer.querySelector('#' + DomRenderizer.taskFormPriorityValueSelectInputID);
  const options = select.options;
  const possiblePriorityValues = getPossiblePriorityValues();
  let allSelectValuesAreValidPriorityValues = true;
  for (const option of options) {
    allSelectValuesAreValidPriorityValues &= possiblePriorityValues.includes(Number(option.value)) && option.value == option.textContent;
  }
  expect(allSelectValuesAreValidPriorityValues).toBeTruthy();
}

function getPossiblePriorityValues() {
  const possiblePriorityValues = [];
  for (let priorityValue = defaultValues.taskPriorities.minPriorityValue; priorityValue < defaultValues.taskPriorities.maxPriorityValue; priorityValue += defaultValues.taskPriorities.step) {
    possiblePriorityValues.push(priorityValue);
  }
  return possiblePriorityValues;
}

function hasInputElementWithLabelFor(form, id, inputElementTag, labelText, type=null){
  let satisfied = false;
  for (const container of form.children){
    for (const child of container.children){
      let label = container.children[0];
      let input = container.children[1];
      satisfied |= (elementHasTag(input, inputElementTag) && elementHasID(input, id) && (input.getAttribute("type") === type || null)) &&(elementHasTag(label, "label") && label.getAttribute("for") === id) && elementHasTextContent(label, labelText);
    }
  }
  return satisfied;
}

function elementHasTextContent(element, textContent){
  return element.textContent === textContent;
}

function elementHasID(element, id){
  return element.getAttribute('id', id);
}

function elementHasTag(element, tag){
  return element.tagName.toLowerCase() === tag;
}

//Test helpers
function renderedTaskElementDoesntContainsClass(dom, task, className){
  expect(dom.renderTask(task).classList.contains(className)).toBeFalsy();
}

function renderedTaskElementContainsClass(dom, task, className){
  expect(dom.renderTask(task).classList.contains(className)).toBeTruthy();
}

function renderedTaskHasCorrectClassInfo(dom, task, className, expected) {
  expect(dom.renderTask(task).querySelector("." + className).textContent === expected).toBeTruthy();
}

function renderedTaskHasCorrectClassAndElementTag(dom, task, className, tag) {
  expect((dom.renderTask(task).querySelector("." + className).tagName).toLowerCase() === tag).toBeTruthy();
}

function renderedNoteHasCorrectClassInfo(dom, note, className, expected) {
  expect(dom.renderNote(note).querySelector("." + className).textContent === expected).toBeTruthy();
}

function renderedNoteHasCorrectClassAndElementTag(dom, note, className, tag) {
  expect((dom.renderNote(note).querySelector("." + className).tagName).toLowerCase() === tag).toBeTruthy();
}