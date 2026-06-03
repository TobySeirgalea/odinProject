import {Task, CompositeTask, ConcreteTask} from "../task.js";
import defaultValues from "../../../appConstantValues.json" with {type: 'json'};
import {endOfTomorrow, formatISO, addYears, addDays, toDate, startOfYesterday, min, endOfYesterday, endOfDay, endOfToday, startOfDay, add} from "date-fns";
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
const tasksMocks = [
    Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0], taskDescriptions[0]), 
    Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2], 'Darle doguis con leche'), 
    Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1])
];

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
    test('Le puedo pedir a una tarea su título', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[0]);
        expect(task.getTitle()).toBe(taskTitles[0]);
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

    test('Tarea puede devolver su descripción', () => {
        let task = tasksMocks[0];
        expect(task.getDescription() === taskDescriptions[0]).toBeTruthy();
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
describe('Funcionalidad: Las tareas pueden ser marcadas como incompletas', () => {
    test('Tarea tiene método para marcar como incompleta', () => {
        let task = tasksMocks[0];
        expect(task).toHaveProperty('markAsUncompleted');
    });
    test('Tarea completa puede ser marcada como incompleta', () => {
        let task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
        expect(task.isCompleted()).toBeFalsy();
        task.markAsCompleted();
        expect(task.isCompleted()).toBeTruthy();
        task.markAsUncompleted();
        expect(task.isCompleted()).toBeFalsy();
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
    test('Tarea puede informar su prioridad', () => {
        let priorityValue = defaultValues.taskPriorities.minPriorityValue;
        let task = Task.createConcreteTask(taskDueDates[1], priorityValue, taskTitles[0], taskDescriptions[0]);
        expect(task.priorityEquals(task.getPriority(priorityValue))).toBeTruthy();
    });
});
describe('Funcionalidad: Las tareas se vencen pasada su fecha límite', () => {
    test('Una tarea que vence en el futuro no está vencida', () => {
        const task = tasksMocks[0];
        expect(task.isExpiredBy(endOfToday())).toBeFalsy();
    });
    test('Una tarea que vence al siguiente día de su dueDate', () => {
        let testDate = endOfToday();
        const task = Task.createConcreteTask(testDate, defaultValues.taskPriorities.maxPriorityValue, taskTitles[0], taskDescriptions[0], testDate);
        expect(task.isExpiredBy(startOfDay(testDate))).toBeFalsy();
        expect(task.isExpiredBy(toDate(addDays(testDate, 1)))).toBeTruthy(); 
        expect(task.isExpiredBy(toDate(endOfDay(testDate)))).toBeTruthy(); 
    });
});
describe('Funcionalidad: Al añadir una tarea a otra se convierte en compositeTask con el mismo contenido', () => {
    test('añadir tarea a otra', () => {
        const task = tasksMocks[0];
        const anotherTask = tasksMocks[1];
        const compositeTask = task.addTask(anotherTask);
        expect(compositeTask.getTitle()).toBe(task.getTitle());
        expect(compositeTask.descriptionEquals(task.getDescription())).toBeTruthy();
        expect(compositeTask.dueDateEquals(task.getDueDate())).toBeTruthy();
        expect(compositeTask.priorityEquals(task.getPriority())).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
    });
    test('añadir varias tareas a otra', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.minPriorityValue, 'A title', taskDescriptions[1]);
        const anotherTask = tasksMocks[1];
        const oneMoreTask = tasksMocks[2];
        const compositeTask = task.addTasks([anotherTask, oneMoreTask]);
        expect(compositeTask.getTitle()).toBe(task.getTitle());
        expect(compositeTask.descriptionEquals(task.getDescription())).toBeTruthy();
        expect(compositeTask.dueDateEquals(task.getDueDate())).toBeTruthy();
        expect(compositeTask.priorityEquals(task.getPriority())).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(compositeTask.includesTask(oneMoreTask)).toBeTruthy();
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
describe('Funcionalidad: Vencimiento de CompositeTask ', () => {
    test('CompositeTask sin tareas no vence hasta su fecha de vencimiento propia', () => {
        const compositeTask = Task.createCompositeTask([], taskDueDates[1]);
        expect(compositeTask.isExpiredBy(endOfToday())).toBeFalsy();
        expect(compositeTask.isExpiredBy(endOfDay(taskDueDates[1]))).toBeTruthy();
    });
    test('CompositeTask sin fecha límite pero con una tarea con fecha límite adquiere su fecha límite', () => {
        const task          = Task.createConcreteTask(taskDueDates[2]); //Tarea que vence antes que padre
        const compositeTask = Task.createCompositeTask([task]);
        expect(compositeTask.isExpiredBy(endOfDay(taskDueDates[2]))).toBeTruthy();
        expect(task.isExpiredBy(endOfDay(taskDueDates[2]))).toBeTruthy();
    });
    test('CompositeTask con fecha límite pero con una tarea con fecha límite previa, adquiere su fecha límite', () => {
        const task          = Task.createConcreteTask(taskDueDates[2]); //Tarea que vence antes que padre
        const compositeTask = Task.createCompositeTask([task], taskDueDates[1]);
        expect(compositeTask.isExpiredBy(endOfDay(taskDueDates[2]))).toBeTruthy();
        expect(task.isExpiredBy(endOfDay(taskDueDates[2]))).toBeTruthy();
        expect(compositeTask.isExpiredBy(endOfDay(taskDueDates[1]))).toBeTruthy();
    });
    test('CompositeTask con fecha límite pero con una compositeTask con tarea con fecha límite previa, ambas adquieren su fecha límite', () => {
        const earliestDate = toDate(addDays(new Date(), 1));
        const task                 = Task.createConcreteTask(earliestDate); //Tarea que vence antes que padre
        const anotherCompositeTask = Task.createCompositeTask([task], taskDueDates[2]);
        const compositeTask        = Task.createCompositeTask([anotherCompositeTask], taskDueDates[1]);
        
        expect(compositeTask.isExpiredBy(endOfDay(earliestDate))).toBeTruthy();
        expect(anotherCompositeTask.isExpiredBy(endOfDay(earliestDate))).toBeTruthy();
        expect(task.isExpiredBy(endOfDay(earliestDate))).toBeTruthy();
    });
});
describe('Funcionalidad: No se puede completar una composite task hasta que se terminan todas las internas', () => {
    test('CompositeTask sin tarea completa no puede ser completada', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue);
        const compositeTask = Task.createCompositeTask([task]);
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
    });

    test('CompositeTask con su unica tarea completa puede ser marcada como completada', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue);
        const compositeTask = Task.createCompositeTask([task]);
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        task.markAsCompleted();
        expect(task.isCompleted()).toBeTruthy();
        compositeTask.markAsCompleted();
        expect(compositeTask.isCompleted()).toBeTruthy();
    });

    test('CompositeTask con varias tareas completas puede ser marcada como completada', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'aTitle');
        const anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue);        
        const compositeTask = Task.createCompositeTask([task, anotherTask]);
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        task.markAsCompleted();
        expect(task.isCompleted()).toBeTruthy();
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        anotherTask.markAsCompleted();
        expect(anotherTask.isCompleted()).toBeTruthy();
        compositeTask.markAsCompleted();
        expect(compositeTask.isCompleted()).toBeTruthy();
    });

    test('CompositeTask pasa a estar completa cuando todas sus tareas están completas y se consulta si está completa aunque no se haya marcado como completa', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue);
        const anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'title');        
        const compositeTask = Task.createCompositeTask([task, anotherTask]);
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        task.markAsCompleted();
        expect(task.isCompleted()).toBeTruthy();
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        anotherTask.markAsCompleted();
        expect(anotherTask.isCompleted()).toBeTruthy();
        expect(compositeTask.isCompleted()).toBeTruthy();
    });

    test('CompositeTask lanza error al intentar se marcada como completa cuando no tiene todas sus subtareas completas y responde que está incompleta', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue);
        const anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1]);        
        const compositeTask = Task.createCompositeTask([task, anotherTask]);
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        task.markAsCompleted();
        expect(task.isCompleted()).toBeTruthy();
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
        expect(anotherTask.isCompleted()).toBeFalsy();
        expect(compositeTask.isCompleted()).toBeFalsy();
        expect(() => compositeTask.markAsCompleted()).toThrow(new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted));
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
        const anotherTask = Task.createConcreteTask(taskDueDates[2], 0, taskTitles[1], taskDescriptions[0]);
        expect(CompositeTask.earliestDueDateTask([task, anotherTask])).toBe(anotherTask);
    });
    test('earliestDueDateTask de lista con tres tareas retorna la de dueDate más cercana que está en el medio', () => {
        const task = Task.createConcreteTask(taskDueDates[1], 0, taskTitles[0], taskDescriptions[0]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], 0, taskTitles[1], taskDescriptions[0]);
        const oneMoreTask = Task.createConcreteTask(toDate(addDays(new Date(), 1)));
        expect(CompositeTask.earliestDueDateTask([task, oneMoreTask, anotherTask])).toStrictEqual(oneMoreTask);
    });
    test('earliestDueDateTask de lista con tres tareas retorna la de dueDate más cercana que está en el inicio', () => {
        const task = Task.createConcreteTask(taskDueDates[1], 0, taskTitles[0], taskDescriptions[0]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], 0, taskTitles[1], taskDescriptions[0]);
        const oneMoreTask = Task.createConcreteTask(toDate(addDays(new Date(), 1)));
        expect(CompositeTask.earliestDueDateTask([oneMoreTask, task, anotherTask])).toStrictEqual(oneMoreTask);
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
describe('Funcionalidad: Agregar tareas', () => {
    test('CompositeTask tiene método addTask', () => {
        const task = Task.createCompositeTask([tasksMocks[1]]);
        expect(task.addTask).toBeDefined();
    });
    test('CompositeTask al agregarle una tarea la tiene entre sus tareas', () => {
        const task          = Task.createConcreteTask();
        const compositeTask = Task.createCompositeTask([tasksMocks[1]], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, 'a');
        compositeTask.addTask(task);
        expect(compositeTask.includesTask(task)).toBeTruthy();
    });
    test('CompositeTask tiene método addTasks', () => {
        const task = Task.createCompositeTask([tasksMocks[1]]);
        expect(task.addTasks).toBeDefined();
    });
    test('CompositeTask puede agregar arreglo de tareas', () => {
        const oneTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'a');
        const anotherTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'b');
        const taskNotIncluided = Task.createConcreteTask();
        const compositeTask = Task.createCompositeTask([tasksMocks[1]]);
        compositeTask.addTasks([oneTask, anotherTask]);
        expect(compositeTask.includesTask(tasksMocks[1])).toBeTruthy();
        expect(compositeTask.includesTask(oneTask)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(compositeTask.includesTask(taskNotIncluided)).toBeFalsy();
    });
    test('CompositeTask al agregarle una tarea que vence antes que ella actualiza su vencimiento', () => {
        const task          = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a');
        const compositeTask = Task.createCompositeTask([Task.createConcreteTask(addYears(new Date(), 100), defaultValues.taskPriorities.minPriorityValue, 'b')], taskDueDates[1]);
        compositeTask.addTask(task);
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(task.isExpiredBy(taskDueDates[2])).toBeTruthy();
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeTruthy();
    });
    test('CompositeTask al agregarle una tarea que vence antes que ella actualiza su vencimiento y al agregarle luego una que ven ce después mantiene vencimiento más cercano', () => {
        const task           = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.minPriorityValue, 'a');
        const laterDueDate   = toDate(addDays(taskDueDates[2], 4));
        const anotherTask    = Task.createConcreteTask(laterDueDate, defaultValues.taskPriorities.minPriorityValue, 'b'); 
        const compositeTask  = Task.createCompositeTask([Task.createConcreteTask(addYears(new Date(), 100))], taskDueDates[1]);
        compositeTask.addTask(anotherTask);
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(anotherTask.isExpiredBy(laterDueDate)).toBeTruthy();
        expect(compositeTask.isExpiredBy(laterDueDate)).toBeTruthy();
        compositeTask.addTask(task);
        expect(task.isExpiredBy(taskDueDates[2])).toBeTruthy();
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeTruthy();
        expect(compositeTask.isExpiredBy(laterDueDate)).toBeTruthy();
    }); 
});
describe('Funcionalidad: Borrar tareas de una CompositeTask', () => {
    test('CompositeTask tiene método removeTask', () => {
        const compositeTask = Task.createCompositeTask([Task.createConcreteTask(addYears(new Date(), 100))]);
        expect(compositeTask.removeTask).toBeDefined();
    });
    test('CompositeTask puede remover una tarea con la que fue creado', () => {
        const task = Task.createConcreteTask();
        const compositeTask = Task.createCompositeTask([task], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, 'a');
        expect(compositeTask.includesTask(task)).toBeTruthy();
        compositeTask.removeTask(task);
        expect(compositeTask.includesTask(task)).toBeFalsy();
    });
    test('CompositeTask puede remover una tarea con la que fue creado y mantener las demás', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'a');
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'b');
        const compositeTask = Task.createCompositeTask([task, anotherTask]);
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        compositeTask.removeTask(task);
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(compositeTask.includesTask(task)).toBeFalsy();
    });
    test('Eliminar tarea que no está en CompositeTask lanza error', () => {
        const task = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'a');
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'b');
        const compositeTask = Task.createCompositeTask([task]);
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeFalsy();
        expect(() => compositeTask.removeTask(anotherTask)).toThrow(new Error(defaultValues.errorMessages.taskNotPresentInCompositeTask));
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeFalsy();
    });
    test('CompositeTask tiene método removeTasks', () => {
        const compositeTask = Task.createCompositeTask([Task.createConcreteTask(addYears(new Date(), 100), defaultValues.taskPriorities.minPriorityValue, 'a')]);
        expect(compositeTask.removeTasks).toBeDefined();
    });
    test('CompositeTask que actualizó su dueDate por una tarea incorporada la recupera una vez esta se elimina', () => {
        const task = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'a');
        let   compositeTask = Task.createCompositeTask([task], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, 'b');
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeTruthy();
        compositeTask = compositeTask.removeTask(task);
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeFalsy();
        expect(compositeTask.isExpiredBy(taskDueDates[1])).toBeTruthy();
    });
        test('CompositeTask que actualizó su dueDate por una tarea incorporada la recupera una vez esta se elimina', () => {
        const task = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'b');
        const laterDueDate = addDays(taskDueDates[2], 3);
        const anotherTask = Task.createConcreteTask();
        let   compositeTask = Task.createCompositeTask([task, anotherTask], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, 'a');
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeTruthy();
        compositeTask = compositeTask.removeTasks([task, anotherTask]);
        expect(compositeTask.isExpiredBy(taskDueDates[2])).toBeFalsy();
        expect(compositeTask.isExpiredBy(laterDueDate)).toBeFalsy();
        expect(compositeTask.isExpiredBy(taskDueDates[1])).toBeTruthy();
    }); 
    test('CompositeTask puede eliminar tareas y quedarse con otras', () => {
        const task = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'b');
        const laterDueDate = addDays(taskDueDates[2], 3);
        const anotherTask = Task.createConcreteTask();
        let   compositeTask = Task.createCompositeTask([task, anotherTask, tasksMocks[1]], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, 'a');
        expect(compositeTask.includesTask(task)).toBeTruthy();
        expect(compositeTask.includesTask(anotherTask)).toBeTruthy();
        expect(compositeTask.includesTask(tasksMocks[1])).toBeTruthy();
        compositeTask = compositeTask.removeTasks([task, anotherTask]);
        expect(compositeTask.includesTask(task)).toBeFalsy();
        expect(compositeTask.includesTask(anotherTask)).toBeFalsy();
        expect(compositeTask.includesTask(tasksMocks[1])).toBeTruthy();
    }); 
    
});
describe('Funcionalidad: Crear una composite task sin tareas dependientes es una concreteTask', () => {
    test('Crear compositeTask con arreglo vacio de tareas crea una concreteTask', () => {
        const compositeTask = Task.createCompositeTask([], taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'Title', 'Description');
        expect(compositeTask instanceof CompositeTask).toBeFalsy();
        expect(compositeTask instanceof ConcreteTask).toBeTruthy();
    });
    test('Crear compositeTask sin arreglo de tareas crea una concreteTask', () => {
        const compositeTask = Task.createCompositeTask();
        expect(compositeTask instanceof CompositeTask).toBeFalsy();
        expect(compositeTask instanceof ConcreteTask).toBeTruthy();
    });
    test('Crear compositeTask con arreglo de una tarea pero borrarsela la convierte en una concreteTask con misma info', () => {
        const task = Task.createConcreteTask(addYears(new Date(), 100), defaultValues.taskPriorities.maxPriorityValue, 'a');
        let compositeTask = Task.createCompositeTask([task], taskDueDates[1]);
        expect(compositeTask instanceof CompositeTask).toBeTruthy();
        expect(compositeTask instanceof ConcreteTask).toBeFalsy();
        compositeTask = compositeTask.removeTask(task);
        expect(compositeTask instanceof CompositeTask).toBeFalsy();
        expect(compositeTask instanceof ConcreteTask).toBeTruthy();
    });
    test('Crear compositeTask con arreglo de varias tareas pero borrarselas la convierte en una concreteTask con misma info', () => {
        const task = Task.createConcreteTask(addYears(new Date(), 100));
        let compositeTask = Task.createCompositeTask([task, tasksMocks[1]], taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[1]);
        expect(compositeTask instanceof CompositeTask).toBeTruthy();
        expect(compositeTask instanceof ConcreteTask).toBeFalsy();
        compositeTask = compositeTask.removeTasks([task, tasksMocks[1]]);
        expect(compositeTask instanceof CompositeTask).toBeFalsy();
        expect(compositeTask instanceof ConcreteTask).toBeTruthy();
    });
});
describe('Restricción: No se permiten ciclos en dependientes', () => {
    test('Intenta agregar a tarea padre lanza error', () => {
        const anotherCompositeTask = Task.createCompositeTask([tasksMocks[1]]);
        const compositeTask = Task.createCompositeTask([anotherCompositeTask], taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'Title', 'Description');

        expect(() => anotherCompositeTask.addTask(compositeTask)).toThrow(new Error(defaultValues.errorMessages.cantHaveCiclesInDependencesErrorMessage));
    });
    test('Intenta agregar a tarea y formar grafo triangulo lanza error', () => {
        const oneMoreComposite = Task.createCompositeTask([tasksMocks[0]]);
        const anotherCompositeTask = Task.createCompositeTask([tasksMocks[1], oneMoreComposite]);
        const compositeTask = Task.createCompositeTask([anotherCompositeTask], taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, 'Title', 'Description');
        expect(() => oneMoreComposite.addTask(compositeTask)).toThrow(new Error(defaultValues.errorMessages.cantHaveCiclesInDependencesErrorMessage));
    });
});
describe('Restricción: No se permite tener en una compositeTask tareas con mismo título', () => {
    test('Crear composite con dependiente de su mismo titulo da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
        expect(() => Task.createCompositeTask([concreteTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0])).toThrow(new Error(defaultValues.errorMessages.cantHaveDependentsTasksWithOwnTitle));
    });
    test('Crear composite con dependientes que coincidan en titulo da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[1], taskDescriptions[1]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0]);
        expect(() => Task.createCompositeTask([concreteTask, anotherTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2], taskDescriptions[0])).toThrow(new Error(defaultValues.errorMessages.cantHaveTaskWithTheSameTitleInDependents));
    }); 
    test('Agregar a composite una con su mismo titulo da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0]);
        const compositeTask = Task.createCompositeTask([anotherTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2], taskDescriptions[0]);
        expect(() => compositeTask.addTask(concreteTask)).toThrow(new Error(defaultValues.errorMessages.cantAddATaskWithTheSameTitle));
    });
    test('Agregar a composite varias tareas con una de su mismo titulo da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0]);
        const compositeTask = Task.createCompositeTask([anotherTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2], taskDescriptions[0]);
        expect(() => compositeTask.addTasks([concreteTask, anotherTask])).toThrow(defaultValues.errorMessages.cantAddATaskWithTheSameTitle);
    });
    test('Agregar a composite tarea con mismo titulo de una dependiente pero distinto al de la tarea composite da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2], taskDescriptions[0]);
        const compositeTask = Task.createCompositeTask([anotherTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0]);
        expect(() => compositeTask.addTask(concreteTask)).toThrow(defaultValues.errorMessages.cantAddTaskWithTheSameTitleOfADependent);
    });
    test('Agregar a composite tareas con mismo titulo pero distinto al de la tarea composite da error', () => {
        const concreteTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.minPriorityValue, taskTitles[2], taskDescriptions[1]);
        const anotherTask = Task.createConcreteTask(taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, 'a', taskDescriptions[0]);
        const oneMoreTask = Task.createConcreteTask(taskDueDates[1], defaultValues.taskPriorities.maxPriorityValue, taskTitles[2])
        const compositeTask = Task.createCompositeTask([anotherTask], taskDueDates[2], defaultValues.taskPriorities.maxPriorityValue, taskTitles[1], taskDescriptions[0]);
        expect(() => compositeTask.addTasks([concreteTask, oneMoreTask])).toThrow(defaultValues.errorMessages.cantAddTasksWithTheSameTitle);
    }); 
});