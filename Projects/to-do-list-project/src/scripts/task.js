import defaultValues from "../appConstantValues.json" with {type: 'json'};
import {endOfToday, formatISO, isPast, toDate, min} from "date-fns";


class Task{
    #title;
    #description;
    #dueDate;
    #completed;
    #priorityValue;
    static #accessedViaInstanceCreationMethod = false;

    static createConcreteTask(aDueDate, aPriorityValue, aTitle, aDescription){
        Task.#accessedViaInstanceCreationMethod = true;    
        return ConcreteTask.createWith(aDueDate, aPriorityValue, aTitle, aDescription);
    }

    static createCompositeTask(dependentTasks, aDueDate, aPriorityValue, aTitle, aDescription){
        Task.#accessedViaInstanceCreationMethod = true;    
        return CompositeTask.createWith(dependentTasks, aDueDate, aPriorityValue, aTitle, aDescription);
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

    static createWith(){
        throw new Error("Subclass should implement this!");
    }

    assertIsAValidDueDate(aDueDate, errorMessage) {
        throw new Error("Subclass should implement this!");
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

    isAValidPriorityValue(aPriorityValue){
        throw new Error("Subclass should implement this!");
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
//aDueDate, aPriorityValue, aTitle, aDescription
    constructor(aDueDate = toDate(endOfToday), aPriorityValue = defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, aTitle = defaultValues.defaultTaskTitle, aDescription = defaultValues.defaultDescriptionText){        
        if (!ConcreteTask.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateAnInstanceOfConcreteTaskWithoutInstanceCreationMethods);
        }
        ConcreteTask.#accessedViaInstanceCreationMethod = false;
        ConcreteTask.assertIsAValidDueDate(aDueDate, defaultValues.errorMessages.cantCreateTaskForThePastErrorMessage);
        ConcreteTask.assertIsAValidPriorityValue(aPriorityValue, defaultValues.errorMessages.cantCreateTaskWithInvalidPriorityValueErrorMessage);         
        super(aDueDate, aPriorityValue, aTitle, aDescription);        
    }

    static createWith(aDueDate, aPriorityValue, aTitle, aDescription){
        ConcreteTask.#accessedViaInstanceCreationMethod = true;
        return new ConcreteTask(aDueDate, aPriorityValue, aTitle, aDescription); 
    }

    static assertIsAValidDueDate(aDueDate, errorMessage) {
        if (isPast(aDueDate)) {
            throw new Error(errorMessage);
        }
    }

    static assertIsAValidPriorityValue(aPriorityValue, errorMessage) {
        if (!ConcreteTask.isAValidPriorityValue(aPriorityValue)) {
            throw new Error(errorMessage);
        }
    }

    static isAValidPriorityValue(aPriorityValue){
        return aPriorityValue >= defaultValues.taskPriorities.minPriorityValue && aPriorityValue <= defaultValues.taskPriorities.maxPriorityValue;
    }
}

class CompositeTask extends Task{
    #tasks = [];

    static #accessedViaInstanceCreationMethod = false;
//dependentTasks, aDueDate, aPriorityValue, aTitle, aDescription
    static createWith(aDependentTasksList = [], aDueDate = CompositeTask.earliestDueDateTask(aDependentTasksList).getDueDate(), aPriorityValue = defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, aTitle=defaultValues.defaultTaskTitle, aDescription=defaultValues.defaultDescriptionText){
        CompositeTask.#accessedViaInstanceCreationMethod = true;
        return new CompositeTask(aDependentTasksList, aDueDate, aPriorityValue, aTitle, aDescription);
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

    static earliestDueDateTask(aDependentTasksList){
        if (Array.isArray(aDependentTasksList) && aDependentTasksList.length === 0){
            return null;
        }
        return aDependentTasksList.reduce((earliest, currentTask) => earliest = earliest.dueDateIsEarlierThan(currentTask) ? earliest : currentTask);
    }

    static assertIsAValidDueDate(aDueDate, errorMessage){

    }
    static assertIsAValidPriorityValue(aPriorityValue, errorMessage){

    }

    includesTask(aTask){
        return this.#tasks.includes(aTask);
    }
}

export {Task, CompositeTask, ConcreteTask};