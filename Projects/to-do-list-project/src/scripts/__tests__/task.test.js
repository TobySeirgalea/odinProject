import {Task, CompositeTask, ConcreteTask} from "../task.js";
import defaultValues from "../../appConstantValues.json" with {type: 'json'};
import {endOfTomorrow, formatISO, addYears, addDays, toDate, startOfYesterday, min, endOfYesterday} from "date-fns";
/*Esqueleto de un test:
describe('Funcionalidad: ', () => {
  test('Nombre test', () => {
    // Código del test

    });
});
*/

const taskTitles = ["Lavar ropa", "Cerrar redes sociales", "Dar de comer al perro"];
const taskDescriptions = ["Usar modo eco y jabón para ropa blanca", "Eliminar mis cuentas de Instagram y Twitter"];
const invalidDate = -1;
const taskDueDates = [invalidDate, toDate(addYears(new Date(), 5)), toDate(addDays(new Date(), 4))];
const tasksMocks = [Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0])];

//Task tests
describe('Funcionalidad: Crear una tarea', () => {
    test('Se puede crear tarea', () => {
        let task = Task.createConcreteTask();
        expect(task).toBeDefined();
    });
});
describe('Funcionalidad: Las tareas tienen título', () => {
    test('Tarea creada con un título tiene ese título', () => {
        let task = tasksMocks[0];
        expect(task.titleEquals(taskTitles[0])).toBeTruthy();
    });

    test('Tarea creada con un título al ser consultada por otro título retorna false', () => {
        let task = tasksMocks[0];
        expect(task.titleEquals(taskTitles[1])).toBeFalsy();
    });

    test('Tarea creada sin título tiene título default', () => {
        let task = Task.createConcreteTask();
        expect(task.titleEquals(defaultValues.defaultTaskTitle)).toBeTruthy();
    });

});
describe('Funcionalidad: Las tareas pueden cambiar de título', () => {
    test('Tarea creada con un título puede ser cambiada de titulo', () => {
        let task = tasksMocks[0];
        expect(task.titleEquals(taskTitles[0])).toBeTruthy();
        expect(task.titleEquals(taskTitles[1])).toBeFalsy();
        task.changeTitle(taskTitles[1]);
        expect(task.titleEquals(taskTitles[1])).toBeTruthy();
        expect(task.titleEquals(taskTitles[0])).toBeFalsy();
    });
});
describe('Funcionalidad: Las tareas pueden tener descripción', () => {
    test('Tarea puede ser creada con una descripción', () => {
        let task = tasksMocks[0];
        expect(task).toBeDefined();
    });

    test('Tarea creada con una descripción tiene esa descripción', () => {
        let task = tasksMocks[0];
        expect(task.descriptionEquals(taskDescriptions[0])).toBeTruthy();
    });

    test('Tarea creada con una descripción tiene esa descripción y no otra', () => {
        let task = tasksMocks[0];
        expect(task.descriptionEquals(taskDescriptions[0])).toBeTruthy();
        expect(task.descriptionEquals(taskDescriptions[1])).toBeFalsy();
    });

    test('Tarea creada sin descripción tiene descripción por default', () => {
        let task = Task.createConcreteTask();
        expect(task.descriptionEquals(defaultValues.defaultDescriptionText)).toBeTruthy();
    });
});
describe('Funcionalidad: Las tareas pueden cambiar de descripción', () => {
    test('Tarea creada con una descripción puede ser cambiada de descripción', () => {
        let task = tasksMocks[0];
        expect(task.descriptionEquals(taskDescriptions[0])).toBeTruthy();
        expect(task.descriptionEquals(taskDescriptions[1])).toBeFalsy();
        task.changeDescription(taskDescriptions[1]);
        expect(task.descriptionEquals(taskDescriptions[1])).toBeTruthy();
        expect(task.descriptionEquals(taskDescriptions[0])).toBeFalsy();
    });
});
describe('Funcionalidad: Las tareas pueden tener fecha límite', () => {
    test('Tarea puede ser creada con una fecha límite', () => {
        let task = tasksMocks[0];
        expect(task).toBeDefined();
    });
    test('Tarea creada con una fecha tiene esa fecha pero en formato ISO8061', () => {
        let task = tasksMocks[0];
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();
    });
    test('Tarea creada con una descripción tiene esa descripción y no otra', () => {
        let task = tasksMocks[0];
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();
        expect(task.dueDateEquals(taskDueDates[2])).toBeFalsy();
    });

    test('Tarea creada con una fecha límite puede modificarla', () => {
        let task = tasksMocks[0];
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();
        expect(task.dueDateEquals(taskDueDates[2])).toBeFalsy();
        task.changeDueDate(taskDueDates[2]);
        expect(task.dueDateEquals(taskDueDates[2])).toBeTruthy();
        expect(task.dueDateEquals(taskDueDates[1])).toBeFalsy();
        task.changeDueDate(taskDueDates[1]);
        expect(task.dueDateEquals(taskDueDates[2])).toBeFalsy();
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();

    });

    test('Tarea no puede ser creada con fecha límite pasada', () => {
        const createTaskForThePast = () => Task.createConcreteTask(toDate(startOfYesterday), defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
        expect(createTaskForThePast).toThrow(new Error(defaultValues.errorMessages.cantCreateTaskForThePastErrorMessage));     
    });
    test('Modificar fecha límite a una pasada lanza error', () => {
        const task = tasksMocks[0];
        const pastDate = toDate(endOfYesterday());
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();
        expect(task.dueDateEquals(pastDate)).toBeFalsy();
        const changeDueDateToPast = () => task.changeDueDate(pastDate);
        expect(changeDueDateToPast).toThrow(new Error(defaultValues.errorMessages.cantChangeDueDateToThePast));
        expect(task.dueDateEquals(taskDueDates[1])).toBeTruthy();
        expect(task.dueDateEquals(pastDate)).toBeFalsy();
    });


});
describe('Funcionalidad: Las tareas pueden ser marcadas como completadas', () => {
    test('Tarea tiene método para marcar como completada', () => {
        let task = tasksMocks[0];
        expect(task).toHaveProperty('markAsCompleted');
    });
    test('Tarea por defecto está marcada como no completa', () => {
        let task = tasksMocks[0];
        expect(task.isCompleted()).toBeFalsy();
    });
    test('Tarea no completa puede ser marcada como completa', () => {
        let task = tasksMocks[0];
        expect(task.isCompleted()).toBeFalsy();
        task.markAsCompleted()
        expect(task.isCompleted()).toBeTruthy();
    });
});
describe('Funcionalidad: Las tareas pueden ser creadas con prioridad', () => {
    test('Tarea creada con prioridad retorna true al ser consultada por esa prioridad', () => {
        let priorityValue = Math.round(defaultValues.taskPriorities.maxPriorityValue / 2);
        let task = Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        expect(task.priorityEquals(priorityValue)).toBeTruthy();
    });
    test('Tarea creada con prioridad retorna true al ser consultada por esa prioridad y false por cualquiera distinta', () => {
        let priorityValue = Math.round(defaultValues.taskPriorities.maxPriorityValue / 2);
        let aDistincPriorityValue = getADifferentPriorityValueFrom(priorityValue);
        let task = Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        expect(task.priorityEquals(priorityValue)).toBeTruthy();
        expect(task.priorityEquals(aDistincPriorityValue)).toBeFalsy();
    });

    test('Tarea creada con prioridad inválida lanza error', () => {
        let priorityValue = defaultValues.taskPriorities.maxPriorityValue + defaultValues.taskPriorities.step;
        let createTaskWithInvalidPriority = () => Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        expect(createTaskWithInvalidPriority).toThrow(new Error(defaultValues.errorMessages.cantCreateTaskWithInvalidPriorityValueErrorMessage));
    });

    test('Tarea puede cambiar su prioridad', () => {
        let priorityValue = defaultValues.taskPriorities.minPriorityValue;
        let aDifferentPriorityValue = getADifferentPriorityValueFrom(priorityValue);
        let task = Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        expect(task.priorityEquals(priorityValue)).toBeTruthy();
        expect(task.priorityEquals(aDifferentPriorityValue)).toBeFalsy();
        task.changePriority(aDifferentPriorityValue);
        expect(task.priorityEquals(aDifferentPriorityValue)).toBeTruthy();
        expect(task.priorityEquals(priorityValue)).toBeFalsy();
    });
    test('Cambiar prioridad a valor inválido lanza error', () => {
        let priorityValue = defaultValues.taskPriorities.minPriorityValue;
        let task = Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        const changeToInvalidPriority = () => task.changePriority(defaultValues.taskPriorities.maxPriorityValue + defaultValues.taskPriorities.step);
        expect(changeToInvalidPriority).toThrow(new Error(defaultValues.errorMessages.cantChangePriorityToInvalidValueErrorMessage));
        expect(task.priorityEquals(priorityValue)).toBeTruthy();
    });
});

//Una forma de generar otro priorityValue válido
function getADifferentPriorityValueFrom(aPriorityValue){
    const nextPriorityValue = aPriorityValue + defaultValues.taskPriorities.step;
    const prevPriorityValue = aPriorityValue - defaultValues.taskPriorities.step;
    const maxPriorityValue  = defaultValues.taskPriorities.maxPriorityValue;
    const minPriorityValue  = defaultValues.taskPriorities.minPriorityValue;
    if (inRange(nextPriorityValue, minPriorityValue, maxPriorityValue)){
        return nextPriorityValue;
    }
    if (inRange(prevPriorityValue, minPriorityValue, maxPriorityValue)){
        return prevPriorityValue;
    }
}

function inRange(aValue, minInclusive, maxInclusive){
    return aValue >= minInclusive && aValue <= maxInclusive; 
}

//Composite tasks tests

describe('Funcionalidad: Podemos crear composite tasks', () => {
    test('Existe método creación instancia en clase task para composite task', () => {
        expect(Task.createCompositeTask).toBeDefined();
    });
    test('Crear composite task con una tarea interna la tiene', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
        let compositeTask = Task.createCompositeTask([task]);
        expect(compositeTask.includesTask(task)).toBeTruthy();
    });
    test('Crear composite task con una tarea interna la tiene y no tiene otra con la que no fue creada', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
        let anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[0]);
        let compositeTask = Task.createCompositeTask([task], taskDueDates[1]);
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeFalsy();
    });
    test('Crear composite task con varias tareas internas las tiene y no tiene otra con la que no fue creada', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
        let anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[0]);
        let oneMoreTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[0]);
        let compositeTask = Task.createCompositeTask([task, oneMoreTask], taskDueDates[1]);
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(oneMoreTask)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeFalsy();
    });
    test('Crear composite task con una tarea sin método de creación de instancias lanza error', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]);
        expect(() => new CompositeTask(task)).toThrow(new Error(defaultValues.errorMessages.cantCreateCompositeTasksWithoutInstanceCreationMethods));
    });
    test('Crear composite task con varias tareas sin método de creación de instancias lanza error', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0], );
        let anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[0]);
        expect(() => new CompositeTask([task, anotherTask])).toThrow(new Error(defaultValues.errorMessages.cantCreateCompositeTasksWithoutInstanceCreationMethods));
    });
    test('Crear composite task sin tareas y sin método de creación de instancias lanza error', () => {
        expect(() => new CompositeTask()).toThrow(new Error(defaultValues.errorMessages.cantCreateCompositeTasksWithoutInstanceCreationMethods));
    });
});

describe('Funcionalidad: earliestDueDateTask', () => {
    test('método de clase earliestDueDateTask definido', () => {
        expect(CompositeTask.earliestDueDateTask).toBeDefined();
    });
    test('earliestDueDateTask de lista vacía retorna null', () => {
        expect(CompositeTask.earliestDueDateTask([])).toBeNull();
    });
    test('earliestDueDateTask de lista con una tarea retorna dicha tarea', () => {
        const task = Task.createConcreteTask(taskDueDates[1], 0, taskTitles[0], taskDescriptions[0]);
        expect(CompositeTask.earliestDueDateTask([task])).toBe(task);
    });
    test('earliestDueDateTask de lista con dos tareas retorna la de dueDate más cercana', () => {
        const task = Task.createConcreteTask(taskDueDates[1], 0, taskTitles[0], taskDescriptions[0]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], 0, taskTitles[0], taskDescriptions[0]);
        expect(CompositeTask.earliestDueDateTask([task, anotherTask])).toBe(anotherTask);
    });
});

describe('Funcionalidad: No se puede crear una instancia de Task', () => {
    test('Llamar new Task() lanza error', () => {
        expect(()=> new Task()).toThrow(new Error(defaultValues.errorMessages.cantCreateAnInstanceOfTaskWithoutInstanceCreationMethods));
    });
});
describe('Funcionalidad: No se puede crear una instancia de ConcreteTask si no es vía métodos de creación de instancias de Task', () => {
    test('Llamar new ConcreteTask() lanza error', () => {
        expect(()=> new ConcreteTask()).toThrow(new Error(defaultValues.errorMessages.cantCreateAnInstanceOfConcreteTaskWithoutInstanceCreationMethods));
    });
});
