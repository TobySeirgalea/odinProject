/**
 * @jest-environment jsdom
 */
import {Task} from "../../domain/task.js";
import {Note} from "../../domain/notes.js";
import "../dom_controller.js";
import { DomController } from "../dom_controller.js";
import defaultValues from "../../../appConstantValues.json" with {type: "json"};
import { addDays, isSameDay } from "date-fns";

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
    const dom = new DomController();
    expect(dom.renderTask).toBeDefined(); 
    });
  test('Tarea sin título al ser renderizada tiene elemento y clase esperada', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomController.taskTitleClass, DomController.elementsTagForTaskTitles); 
    });
  test('Tarea sin título al ser renderizada tiene título por default en elemento esperado', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassInfo(dom, task, DomController.taskTitleClass, defaultValues.defaultTaskTitle);
    });
  test('Tarea con título al ser renderizada tiene dicho título en elemento esperado', () => {
    const dom = new DomController();
    const title = taskTitles[0];
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, title);
    renderedTaskHasCorrectClassInfo(dom, task, DomController.taskTitleClass, title);
    });
});
describe('Funcionalidad: renderizar una tarea contiene su descripción', () => {
  test('Tarea sin descripción al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0]);
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomController.taskDescriptionsClass, DomController.elementsTagForTaskDescriptions);
    });
  test('Tarea sin descripción al ser renderizada contiene descripción por default', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0]);
    renderedTaskHasCorrectClassInfo(dom, task, DomController.taskDescriptionsClass, defaultValues.defaultDescriptionText);
    });
  test('Tarea con descripción al ser renderizada contiene esa descripción ', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
    renderedTaskHasCorrectClassInfo(dom, task, DomController.taskDescriptionsClass, taskDescriptions[0]);
    });
});
describe('Funcionalidad: renderizar una tarea contiene su dueDate', () => {
  test('Tarea sin dueDate al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomController.taskDueDateClass, DomController.elementsTagForTaskDueDate);
    });
   test('Tarea sin dueDate al ser renderizada contiene default dueDate', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectDueDate(dom, task, Task.defaultDueDate);
    });
   test('Tarea con dueDate al ser renderizada contiene su dueDate', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask(taskDueDates[0]);
    renderedTaskHasCorrectDueDate(dom, task, taskDueDates[0]);
    });
});

function renderedTaskHasCorrectDueDate(dom, task, expectedDueDate){
  const nodeDateValue = dom.renderTask(task).querySelector("." + DomController.taskDueDateClass).getAttribute("value");
  expect(isSameDay(nodeDateValue, expectedDueDate)).toBeTruthy(); 
}

function renderedTaskHasCorrectPriorityValue(dom, task, expectedPriorityValue){
  const priorityValue = Number(dom.renderTask(task).querySelector("." + DomController.taskPriorityClass).getAttribute("value"));
  expect(priorityValue).toBe(expectedPriorityValue);
}

describe('Funcionalidad: renderizar una tarea tiene su prioridad', () => {
  test('Tarea sin prioridad al ser renderizada contiene elemento y clase esperados', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomController.taskPriorityClass, DomController.elementsTagForTaskPriority);
    });
  test('Tarea sin prioridad al ser renderizada contiene prioridad default', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskHasCorrectPriorityValue(dom, task, defaultValues.taskPriorities.defaultConcreteTaskPriorityValue);
    });
  test('Tarea con prioridad al ser renderizada contiene dicha prioridad', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.maxPriorityValue);
    renderedTaskHasCorrectPriorityValue(dom, task, defaultValues.taskPriorities.maxPriorityValue);
    });
});
describe('Funcionalidad: renderizar una tarea tiene clase que acorde a su estado', () => {
  test('Tarea incompleta al ser renderizada contiene clase esperada', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomController.incompleteTaskClass);
    expect(task.isCompleted()).toBeFalsy();
    });
  test('Tarea incompleta al ser renderizada contiene clase esperada y al ser completada pasa a tener la de tareas completas y dejar de tener la de incompletas', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomController.incompleteTaskClass);
    expect(task.isCompleted()).toBeFalsy();
    task.markAsCompleted();
    expect(task.isCompleted()).toBeTruthy();
    renderedTaskElementContainsClass(dom, task, DomController.completeTaskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomController.incompleteTaskClass);
    });
});
describe('Funcionalidad: renderizar una tarea tiene clase de tareas y específica', () => {
  test('ConcreteTask al ser renderizada contiene clase de tareas y clase para concreteTasks', () => {
    const dom = new DomController();
    const task = Task.createConcreteTask();
    renderedTaskElementContainsClass(dom, task, DomController.taskClass);
    renderedTaskElementContainsClass(dom, task, DomController.concreteTaskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomController.compositeTaskClass);
    });
  test('CompositeTask al ser renderizada contiene clase de tareas y clase para compositeTasks', () => {
    const dom = new DomController();
    const task = Task.createCompositeTask();
    renderedTaskElementContainsClass(dom, task, DomController.taskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomController.concreteTaskClass);
    renderedTaskElementContainsClass(dom, task, DomController.compositeTaskClass);
    });
});
describe('Funcionalidad: renderizar una CompositeTask sin tareas dependientes elemento contenedor de estas', () => {
  test('CompositeTask al ser renderizada contiene container para dependents', () => {
    const dom = new DomController();
    const task = Task.createCompositeTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomController.dependentTaskContainerClass, DomController.containersElementTag);
    });
  test('CompositeTask con una concreteTask dependiente al ser renderizada contiene container para dependents con esta renderizada', () => {
    const dom = new DomController();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const concreteTaskRendered  = compositeTaskRendered.querySelector("." + DomController.dependentTaskContainerClass).querySelector("."+ DomController.concreteTaskClass);
    expect(compositeTaskRendered.querySelector("." + DomController.dependentTaskContainerClass)).toBeDefined();
    
    renderedTaskHasCorrectClassInfo(dom, compositeTask, DomController.taskTitleClass, taskTitles[1]);
    renderedTaskHasCorrectClassInfo(dom, compositeTask, DomController.taskDescriptionsClass, taskDescriptions[1]);
    renderedTaskHasCorrectDueDate(dom, compositeTask, taskDueDates[1]);
    renderedTaskHasCorrectPriorityValue(dom, compositeTask, defaultValues.taskPriorities.defaultCompositeTaskPriorityValue);

    renderedTaskHasCorrectClassInfo(dom, concreteTask, DomController.taskTitleClass, taskTitles[0]);
    renderedTaskHasCorrectClassInfo(dom, concreteTask, DomController.taskDescriptionsClass, taskDescriptions[0]);
    renderedTaskHasCorrectDueDate(dom, concreteTask, taskDueDates[0]);
    renderedTaskHasCorrectPriorityValue(dom, concreteTask, defaultValues.taskPriorities.defaultConcreteTaskPriorityValue);
  });
});

describe('Funcionalidad: renderizar una nota contiene su título', () => {
  test('Nota al ser renderizada contiene titulo', () => {
    const dom = new DomController();
    const note = new Note(noteTitles[0]);
    renderedNoteHasCorrectClassAndElementTag(dom, note, DomController.noteTitleClass, DomController.elementsTagForNotesTitles);
    renderedNoteHasCorrectClassInfo(dom, note, DomController.noteTitleClass, noteTitles[0]);
  });
});

describe('Funcionalidad: renderizar una nota contiene su cuerpo', () => {
  test('Nota al ser renderizada contiene cuerpo', () => {
    const dom = new DomController();
    const note = new Note(noteTitles[0], noteBodies[0]);
    renderedNoteHasCorrectClassAndElementTag(dom, note, DomController.noteBodyClass, DomController.elementsTagForNotesBodies);
    renderedNoteHasCorrectClassInfo(dom, note, DomController.noteBodyClass, noteBodies[0]);
  });
});

describe('Funcionalidad: Mostrar formulario de creación de contenido', () => {
  test('Contiene método para crear formulario', () => {
    const dom  = new DomController();
    expect(dom.createContentForm).toBeDefined();
  });
  test('Método para crear formulario retorna un HTMLDialog', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    expect(form.tagName.toLowerCase() === "dialog").toBeTruthy();
  });
  test('dialog contiene botón con opción de task', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    expect(form.querySelector('#' + DomController.taskOptionInCreateFormID).tagName.toLowerCase() === "button").toBeTruthy();
  });
  test('dialog contiene botón con opción de note', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    expect(form.querySelector('#' + DomController.noteOptionInCreateFormID).tagName.toLowerCase() === "button").toBeTruthy();
  });
  test('dialog contains forms container after task option is selected', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createTaskButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('dialog contains forms container after note option is selected', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createNoteButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('forms container after create task button is pressed contains all needed fields', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createTaskButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer);
    const formFieldsContainer = form.querySelector("#" + DomController.formFieldsContainer);
    assertTaskCreationFormHasAllNeededFields(formFieldsContainer);
    assertContainerHasElement(form, "button", DomController.creationFormSubmitButtonID);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
    test('forms container after create note button is pressed contains all needed fields', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createNoteButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer);
    const formFieldsContainer = form.querySelector("#" + DomController.formFieldsContainer);
    assertNoteCreationFormHasAllNeededFields(formFieldsContainer);
    assertContainerHasElement(form, 'button', DomController.creationFormSubmitButtonID);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('Can change from note to task and the form fields also change', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createNoteButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer); 
    const formFieldsContainer = form.querySelector("#" + DomController.formFieldsContainer);
    assertNoteCreationFormHasAllNeededFields(formFieldsContainer);
    createTaskButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer); 
    assertTaskCreationFormHasAllNeededFields(formFieldsContainer);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('Can change from task to note and the form fields also change', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createTaskButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer); 
    const formFieldsContainer = form.querySelector("#" + DomController.formFieldsContainer);
    assertTaskCreationFormHasAllNeededFields(formFieldsContainer);
    createNoteButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer);
    assertNoteCreationFormHasAllNeededFields(formFieldsContainer);
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('submit button doesnt appears until tasks options or notes is selected', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    expect(form.querySelector("#" + DomController.creationFormSubmitButtonID)).toBeNull();
    assertFormContainerUndefined(form, DomController.formFieldsContainer);
    createTaskButton.click();
    assertFormContainerDefined(form, DomController.formFieldsContainer); 
    expect(form.querySelector("#" + DomController.creationFormSubmitButtonID)).toBeDefined();
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('submit button close dialog when is pressed', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    createTaskButton.click();
    const submitButton = form.querySelector("#" + DomController.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    fillTaskForm(form, DomController.formFieldsContainer);
    submitButton.click();
    expect(!form.open).toBeTruthy();
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
  test('submit button close dialog when is pressed', () => {
    const dom  = new DomController();
    const form = dom.createContentForm();
    const createNoteButton = form.querySelector('#' + DomController.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomController.taskOptionInCreateFormID);
    assertContainerHasElement(form, 'button', DomController.cancelCreationFormButtonID);
    form.querySelector("#" + DomController.cancelCreationFormButtonID).click();
    expect(!form.open).toBeTruthy();
    form.remove(form.querySelector("#" + DomController.formFieldsContainer));
  });
});

function fillTaskForm(form, formsFieldsContainerID){
  const formFieldsContainer = form.querySelector("#" + formsFieldsContainerID);
  formFieldsContainer.querySelector("#" + DomController.taskFormTitleInputID).value = "taskTitle";
  formFieldsContainer.querySelector("#" + DomController.taskFormDescriptionInputID).value = "taskDescription";
  formFieldsContainer.querySelector("#" + DomController.taskFormDueDateInputID).value = new Date();
  formFieldsContainer.querySelector("#" + DomController.taskFormPriorityValueSelectInputID).value = defaultValues.taskPriorities.minPriorityValue; 
}

function assertContainerHasElement(container, elementsTag, elementsID){
  const element = container.querySelector("#" + elementsID); 
  expect(element).not.toBeNull();
  expect(element).not.toBeUndefined();
  expect(element.tagName.toLowerCase()).toBe(elementsTag);
}

function assertFormContainerUndefined(form, containerID){
  let formFieldsContainer = form.querySelector("#" + containerID); 
  expect(formFieldsContainer).toBeNull();
}

function assertFormContainerDefined(form, containerID){
  assertContainerHasElement(form, 'form', containerID);
}

function assertNoteCreationFormHasAllNeededFields(formFieldsContainer){
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.noteFormTitleInputID, "input", "text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.noteFormBodyInputID, "textarea", "text")).toBeTruthy();
}

function assertTaskCreationFormHasAllNeededFields(formFieldsContainer){
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.taskFormTitleInputID, "input", "text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.taskFormDescriptionInputID, "textarea", "text")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.taskFormDueDateInputID, "input", "date")).toBeTruthy();
  expect(hasInputElementWithLabelFor(formFieldsContainer, DomController.taskFormPriorityValueSelectInputID, "select")).toBeTruthy();
}

function hasInputElementWithLabelFor(form, id, inputElementTag, type=null){
  let satisfied = 0;
  for (const container of form.children){
    for (const child of container.children){
      satisfied += (child.tagName.toLowerCase() === inputElementTag && child.getAttribute("id") === id && (child.getAttribute("type") === type || null));
      satisfied += (child.tagName.toLowerCase() === "label" && child.getAttribute("for") === id);
    }
  }
  return satisfied === 2;
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