import defaultValues from "../appConstantValues.json" with {type: 'json'};
import {endOfToday, formatISO, isPast, toDate, min} from "date-fns";

class Task{
    #title;
    #description;
    #dueDate;
    #completed;
    #priorityValue;
    static #accessedViaInstanceCreationMethod = false;

    static isAValidDueDate(aDueDate){
        return !isPast(aDueDate);
    }

    static isAValidPriorityValue(aPriorityValue){
        return aPriorityValue >= defaultValues.taskPriorities.minPriorityValue && aPriorityValue <= defaultValues.taskPriorities.maxPriorityValue;
    }
    
    static assertIsAValidDueDate(aDueDate, errorMessage) {
        if (!this.isAValidDueDate(aDueDate)) {
            throw new Error(errorMessage);
        }
    }

    static assertIsAValidPriorityValue(aPriorityValue, errorMessage) {
        if (!this.isAValidPriorityValue(aPriorityValue)) {
            throw new Error(errorMessage);
        }
    }

    static createConcreteTask(aDueDate, aPriorityValue, aTitle, aDescription){
        Task.#accessedViaInstanceCreationMethod = true;    
        return ConcreteTask.createWith(aDueDate, aPriorityValue, aTitle, aDescription);
    }

    static createCompositeTask(dependentTasks, aDueDate, aPriorityValue, aTitle, aDescription){
        Task.#accessedViaInstanceCreationMethod = true;    
        return CompositeTask.createWith(dependentTasks, aDueDate, aPriorityValue, aTitle, aDescription);
    }

    static createWith(){
        throw new Error("Subclass should implement this!");
    }

    constructor(aDueDate, aPriorityValue, aTitle, aDescription){
        if (!Task.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateAnInstanceOfTaskWithoutInstanceCreationMethods);
        }
        Task.#accessedViaInstanceCreationMethod = false;
        this.#title         = aTitle;
        this.#description   = aDescription;
        if (aDueDate){
            const formattedDueDate = formatISO(aDueDate, {representation: defaultValues.formatISOOptions.representation,
                                                          format: defaultValues.formatISOOptions.format});                                                  
            this.#dueDate = formattedDueDate;
        }
        this.#priorityValue = aPriorityValue;
    }

    changeDueDate(aNewDueDate){
        this.constructor.assertIsAValidDueDate(aNewDueDate, defaultValues.errorMessages.cantChangeDueDateToThePast);
        const formattedDueDate = formatISO(aNewDueDate, {representation: defaultValues.formatISOOptions.representation,
                                                         format: defaultValues.formatISOOptions.format});
        this.#dueDate = formattedDueDate;
    }
    
    changePriority(aPriorityValue){
        this.constructor.assertIsAValidPriorityValue(aPriorityValue, defaultValues.errorMessages.cantChangePriorityToInvalidValueErrorMessage);
        this.#priorityValue = aPriorityValue;
    }

    markAsCompleted(){
        this.#completed = true;
    }

    isCompleted(){
        return this.#completed === true;
    }

    priorityEquals(aPriorityValue){
        return this.#priorityValue === aPriorityValue;
    }

    titleEquals(aTitle){
        return this.#title === aTitle;
    }

    descriptionEquals(aDescription){
        return this.#description === aDescription;
    }

    dueDateEquals(aDueDate){
        const formattedDueDate = formatISO(aDueDate, {representation: defaultValues.formatISOOptions.representation,
                                                        format: defaultValues.formatISOOptions.format});
        return this.#dueDate === formattedDueDate;
    }

    getDueDate(){
        return toDate(this.#dueDate);
    }

    dueDateIsEarlierThan(anotherTask){
        return anotherTask.dueDateIsAfter(Object.assign({},this.#dueDate));
    }
    
    dueDateIsAfter(anotherDueDate){
        return min([this.#dueDate, anotherDueDate]) === anotherDueDate;
    }

    changeTitle(newTitle){
        this.#title = newTitle;
    }

    changeDescription(newDescription){
        this.#description = newDescription;
    }
}

class ConcreteTask extends Task{
    static #accessedViaInstanceCreationMethod = false;

    static createWith(aDueDate, aPriorityValue, aTitle, aDescription){
        ConcreteTask.#accessedViaInstanceCreationMethod = true;
        return new ConcreteTask(aDueDate, aPriorityValue, aTitle, aDescription); 
    }


    constructor(aDueDate = toDate(endOfToday), aPriorityValue = defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, aTitle = defaultValues.defaultTaskTitle, aDescription = defaultValues.defaultDescriptionText){        
        if (!ConcreteTask.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateAnInstanceOfConcreteTaskWithoutInstanceCreationMethods);
        }
        ConcreteTask.#accessedViaInstanceCreationMethod = false;
        ConcreteTask.assertIsAValidDueDate(aDueDate, defaultValues.errorMessages.cantCreateTaskForThePastErrorMessage);
        ConcreteTask.assertIsAValidPriorityValue(aPriorityValue, defaultValues.errorMessages.cantCreateTaskWithInvalidPriorityValueErrorMessage);         
        super(aDueDate, aPriorityValue, aTitle, aDescription);        
    }
}

class CompositeTask extends Task{
    #tasks = [];

    static #accessedViaInstanceCreationMethod = false;

    static createWith(aDependentTasksList = [], aDueDate = CompositeTask.earliestDueDateTask(aDependentTasksList).getDueDate(), aPriorityValue = defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, aTitle=defaultValues.defaultTaskTitle, aDescription=defaultValues.defaultDescriptionText){
        CompositeTask.#accessedViaInstanceCreationMethod = true;
        return new CompositeTask(aDependentTasksList, aDueDate, aPriorityValue, aTitle, aDescription);
    }

    static earliestDueDateTask(aDependentTasksList){
        if (Array.isArray(aDependentTasksList) && aDependentTasksList.length === 0){
            return null;
        }
        return aDependentTasksList.reduce((earliest, currentTask) => earliest = earliest.dueDateIsEarlierThan(currentTask) ? earliest : currentTask);
    }

    constructor(aDependentTasksList, aDueDate, aPriorityValue, aTitle, aDescription){
        if (!CompositeTask.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateCompositeTasksWithoutInstanceCreationMethods);
        }
        CompositeTask.#accessedViaInstanceCreationMethod = false;
        CompositeTask.assertIsAValidDueDate(aDueDate, defaultValues.errorMessages.cantCreateTaskForThePastErrorMessage);
        CompositeTask.assertIsAValidPriorityValue(aPriorityValue, defaultValues.errorMessages.cantCreateTaskWithInvalidPriorityValueErrorMessage);
        super(aDueDate, aPriorityValue, aTitle, aDescription);
        aDependentTasksList.forEach(task => this.#tasks.push(task));
    }

    includesTask(aTask){
        return this.#tasks.includes(aTask);
    }
}

export {Task, CompositeTask, ConcreteTask};