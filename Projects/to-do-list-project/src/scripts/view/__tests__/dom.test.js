/**
 * @jest-environment jsdom
 */
import {Task} from "../../domain/task.js";
import {Note} from "../../domain/notes.js";
import "../domRenderizer.js";
import { DomRenderizer } from "../domRenderizer.js";
import defaultValues from "../../../appConstantValues.json" with {type: "json"};
import { addDays, isSameDay } from "date-fns";
import { AppController } from "../../controllers/appController.js";

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
  const nodeDateValue = dom.renderTask(task).querySelector("." + DomRenderizer.taskDueDateClass).getAttribute("value");
  expect(isSameDay(nodeDateValue, expectedDueDate)).toBeTruthy(); 
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
    renderedTaskElementContainsClass(dom, task, DomRenderizer.taskClass);
    renderedTaskElementContainsClass(dom, task, DomRenderizer.concreteTaskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomRenderizer.compositeTaskClass);
    });
  test('CompositeTask al ser renderizada contiene clase de tareas y clase para compositeTasks', () => {
    const dom = new DomRenderizer();
    const task = Task.createCompositeTask();
    renderedTaskElementContainsClass(dom, task, DomRenderizer.taskClass);
    renderedTaskElementDoesntContainsClass(dom, task, DomRenderizer.concreteTaskClass);
    renderedTaskElementContainsClass(dom, task, DomRenderizer.compositeTaskClass);
    });
});
describe('Funcionalidad: renderizar una CompositeTask sin tareas dependientes elemento contenedor de estas', () => {
  test('CompositeTask al ser renderizada contiene container para dependents', () => {
    const dom = new DomRenderizer();
    const task = Task.createCompositeTask();
    renderedTaskHasCorrectClassAndElementTag(dom, task, DomRenderizer.dependentTaskContainerClass, DomRenderizer.containersElementTag);
    });
  test('CompositeTask con una concreteTask dependiente al ser renderizada contiene container para dependents con esta renderizada', () => {
    const dom = new DomRenderizer();
    const concreteTask = Task.createConcreteTask(taskDueDates[0], defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, taskTitles[0], taskDescriptions[0]);
    const compositeTask = Task.createCompositeTask([concreteTask], taskDueDates[1], defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, taskTitles[1], taskDescriptions[1]);
    const compositeTaskRendered = dom.renderTask(compositeTask);
    const concreteTaskRendered  = compositeTaskRendered.querySelector("." + DomRenderizer.dependentTaskContainerClass).querySelector("."+ DomRenderizer.concreteTaskClass);
    expect(compositeTaskRendered.querySelector("." + DomRenderizer.dependentTaskContainerClass)).toBeDefined();
    
    renderedTaskHasCorrectClassInfo(dom, compositeTask, DomRenderizer.taskTitleClass, taskTitles[1]);
    renderedTaskHasCorrectClassInfo(dom, compositeTask, DomRenderizer.taskDescriptionsClass, taskDescriptions[1]);
    renderedTaskHasCorrectDueDate(dom, compositeTask, taskDueDates[1]);
    renderedTaskHasCorrectPriorityValue(dom, compositeTask, defaultValues.taskPriorities.defaultCompositeTaskPriorityValue);

    renderedTaskHasCorrectClassInfo(dom, concreteTask, DomRenderizer.taskTitleClass, taskTitles[0]);
    renderedTaskHasCorrectClassInfo(dom, concreteTask, DomRenderizer.taskDescriptionsClass, taskDescriptions[0]);
    renderedTaskHasCorrectDueDate(dom, concreteTask, taskDueDates[0]);
    renderedTaskHasCorrectPriorityValue(dom, concreteTask, defaultValues.taskPriorities.defaultConcreteTaskPriorityValue);
  });
});

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
test('ConcreteTask tiene botón de edición y ejecuta handler al clickearlo', () => {
    let handlerExecuted  = false;
    const dom            = new DomRenderizer();
    const task           = Task.createConcreteTask();
    const renderedTask   = dom.renderTask(task, () => handlerExecuted = true);
    const taskEditButton = renderedTask.querySelector('#' + DomRenderizer.editTaskButtonID);
    taskEditButton.click();
    expect(handlerExecuted).toBeTruthy();
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
  test('ConcreteTask tiene botón de borrado y ejecuta handler al clickearlo', () => {
    let handlerExecuted  = false;
    const dom            = new DomRenderizer();
    const task           = Task.createConcreteTask();
    const renderedTask   = dom.renderTask(task, () => true, () => handlerExecuted = true);
    const taskDeleteButton = renderedTask.querySelector('#' + DomRenderizer.deleteTaskButtonID);
    taskDeleteButton.click();
    expect(handlerExecuted).toBeTruthy();
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
  test('Presionar botón ejecuta handler', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    let   handlerExecuted = false;
    const renderedNote = dom.renderNote(note, () => handlerExecuted = true);
    const button = renderedNote.querySelector('#' + DomRenderizer.editNoteButtonID); 
    button.click();
    expect(handlerExecuted).toBeTruthy();
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
  test('Presionar botón ejecuta handler', () => {
    const dom = new DomRenderizer();
    const note = new Note(noteTitles[0], noteBodies[0]);
    let   handlerExecuted = false;
    const renderedNote = dom.renderNote(note, () => true , () => handlerExecuted = true);
    const button = renderedNote.querySelector('#' + DomRenderizer.deleteNoteButtonID); 
    button.click();
    expect(handlerExecuted).toBeTruthy();
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
    let returnedForm; 
    const form = dom.createContentForm(() => returnedForm = dom.renderTaskCreationForm(), () => true);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(returnedForm).toBeUndefined();
    createTaskButton.click();
    expect(returnedForm).toBeDefined();
    expect(returnedForm.tagName.toLowerCase() === 'form').toBeTruthy();
  });
  test('dialog contains forms container after note option is selected', () => {
    const dom  = new DomRenderizer();
    let returnedForm;
    const form = dom.createContentForm(() => true, () => returnedForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    expect(returnedForm).toBeUndefined();
    createNoteButton.click();
    expect(returnedForm).toBeDefined();
    expect(returnedForm.tagName.toLowerCase() === 'form').toBeTruthy();
  });
  test('forms container after create task button is pressed contains all needed fields', () => {
    const dom  = new DomRenderizer();
    let taskForm;
    const form = dom.createContentForm(() =>  taskForm = dom.renderTaskCreationForm(), () => true);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(taskForm).toBeUndefined();
    createTaskButton.click();
    expect(taskForm).toBeDefined();
    assertTaskCreationFormHasAllNeededFields(taskForm);
    assertContainerHasElement(taskForm, "button", DomRenderizer.creationFormSubmitButtonID);
  });
    test('forms container after create note button is pressed contains all needed fields', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    const form = dom.createContentForm(() => true, () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    expect(noteForm).toBeUndefined();
    createNoteButton.click();
    expect(noteForm).toBeDefined();
    assertNoteCreationFormHasAllNeededFields(noteForm);
    assertContainerHasElement(noteForm, 'button', DomRenderizer.creationFormSubmitButtonID);
  });
  test('Can change from note to task and the form fields also change', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    let taskForm;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(), () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(noteForm).toBeUndefined();
    createNoteButton.click();
    expect(noteForm).toBeDefined(); 
    assertNoteCreationFormHasAllNeededFields(noteForm);
    expect(taskForm).toBeUndefined();
    createTaskButton.click();
    expect(taskForm).toBeDefined();
    assertTaskCreationFormHasAllNeededFields(taskForm);
  });
  test('Can change from task to note and the form fields also change', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    let taskForm;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(), () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(taskForm).toBeUndefined();
    createTaskButton.click();
    expect(taskForm).toBeDefined();
    assertTaskCreationFormHasAllNeededFields(taskForm);
    expect(noteForm).toBeUndefined();
    createNoteButton.click();
    expect(noteForm).toBeDefined(); 
    assertNoteCreationFormHasAllNeededFields(noteForm);
  });
  test('submit button doesnt appears until tasks options or notes is selected', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    const form = dom.createContentForm(() => true, () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    expect(form.querySelector("#" + DomRenderizer.creationFormSubmitButtonID)).toBeNull();
    expect(noteForm).toBeUndefined();
    createNoteButton.click();
    expect(noteForm).toBeDefined(); 
    expect(form.querySelector("#" + DomRenderizer.creationFormSubmitButtonID)).toBeDefined();
  });
  test('submit button close dialog when is pressed', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    let taskForm;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(() => form.remove()), () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    const submitButton = taskForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    fillTaskForm(taskForm);
    submitButton.click();
    expect(!form.open).toBeTruthy();
  });
  test('cancel button close dialog when is pressed', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    let taskForm;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(), () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    const cancelButton     = form.querySelector('#' + DomRenderizer.cancelCreationFormButtonID);
    expect(cancelButton).toBeDefined();
    cancelButton.click();
    expect(!form.open).toBeTruthy();
  });
  test('when notes is selected, submitButton contains correct text', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    const form = dom.createContentForm(() => true, () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    const submitButton = noteForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent === DomRenderizer.createNoteButtonText).toBeTruthy();
    expect(submitButton.getAttribute('type') === 'submit').toBeTruthy();
  });
  test('when notes is selected form contains just one submitButton', () => {
    const dom  = new DomRenderizer();
    let noteForm;
    const form = dom.createContentForm(() => true, () => noteForm = dom.renderNoteCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    const submitButton = noteForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    createNoteButton.click();
    expect(noteForm.querySelectorAll("#" + DomRenderizer.creationFormSubmitButtonID).length === 1).toBeTruthy();
  });
  test('when tasks is selected, submitButton contains correct text', () => {
    const dom  = new DomRenderizer();
    let taskForm;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(), () => true);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    const submitButton = taskForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    expect(submitButton.textContent === DomRenderizer.createTaskButtonText).toBeTruthy();
    expect(submitButton.getAttribute('type') === 'submit').toBeTruthy();
  });
 test('when notes is selected form contains just one submitButton', () => {
    const dom  = new DomRenderizer();
    let notesForm;
    const form = dom.createContentForm(() => true, () => notesForm = dom.renderTaskCreationForm());
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    const submitButton = notesForm.querySelector("#" + DomRenderizer.creationFormSubmitButtonID); 
    expect(submitButton).toBeDefined();
    createNoteButton.click();
    expect(notesForm.querySelectorAll("#" + DomRenderizer.creationFormSubmitButtonID).length === 1).toBeTruthy();
  });
  test('after filling a task and pressing submit button handler is executed', () => {
    const dom  = new DomRenderizer();
    let taskForm;
    let handlerExecuted = false;
    const form = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm((event, form) => handlerExecuted = true), () => true);
    const createTaskButton = form.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    fillTaskForm(taskForm);
    const submitButton = taskForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(handlerExecuted).toBeTruthy();
  });
  test('after filling a note and pressing submit button handler is executed', () => {
    const dom  = new DomRenderizer();
    let notesForm;
    let handlerExecuted = false;
    const form = dom.createContentForm(() => true, () => notesForm = dom.renderNoteCreationForm((event, form) => handlerExecuted = true));
    const createNoteButton = form.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    fillNoteForm(notesForm);
    const submitButton = notesForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(handlerExecuted).toBeTruthy();
  });
  test('rendered create button executes handler', () => {
    const dom = new DomRenderizer();
    let executed = false;
    const createButton = dom.renderCreateButton(() => executed = true);
    createButton.click();
    expect(executed).toBeTruthy();
  });
  test('can collect info from note form using appropiated handlers', () => {
    const dom = new DomRenderizer();
    let noteInfo;
    let noteForm;
    let dialog;
    const createButton = dom.renderCreateButton(() => dialog = dom.createContentForm(() => true, () => noteForm = dom.renderNoteCreationForm(() => noteInfo = dom.collectUserInputOfNoteForm(noteForm))));
    createButton.click();
    const createNoteButton = dialog.querySelector('#' + DomRenderizer.noteOptionInCreateFormID);
    createNoteButton.click();
    fillNoteForm(noteForm);
    const submitButton = noteForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(noteInfo.title).toBe('noteTitle');
    expect(noteInfo.body).toBe('noteBody');
  });
  test('can collect info from task form using appropiated handlers', () => {
    const dom = new DomRenderizer();
    let taskInfo;
    let taskForm;
    let dialog;
    const createButton = dom.renderCreateButton(() => dialog = dom.createContentForm(() => taskForm = dom.renderTaskCreationForm(() => taskInfo = dom.collectUserInputOfTaskForm(taskForm)), () => true));
    createButton.click();
    const createTaskButton = dialog.querySelector('#' + DomRenderizer.taskOptionInCreateFormID);
    createTaskButton.click();
    fillTaskForm(taskForm);
    const submitButton = taskForm.querySelector('#' + DomRenderizer.creationFormSubmitButtonID);
    submitButton.click();
    expect(taskInfo.title).toBe('taskTitle');
    expect(taskInfo.description).toBe('taskDescription');
    expect(taskInfo.dueDate).toBe(new Date().toISOString().split('T')[0]);
    expect(taskInfo.priorityValue).toBe(String(defaultValues.taskPriorities.minPriorityValue));
  });
});

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