import defaultValues from "../../appConstantValues.json" with {type: 'json'};
import {endOfToday, formatISO, isPast, toDate, isAfter, isBefore, endOfDay, min, endOfWeek} from "date-fns";

class Task{
    #title;
    #description;
    #dueDate;
    #completed;
    #priorityValue;
    static #accessedViaInstanceCreationMethod = false;
    static defaultDueDate = endOfToday();

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

    constructor(aDueDate, aPriorityValue, aTitle, aDescription){
        if (!Task.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateAnInstanceOfTaskWithoutInstanceCreationMethods);
        }
        Task.#accessedViaInstanceCreationMethod = false;
        this.#title         = aTitle;
        this.#description   = aDescription;
        const formattedDueDate = formatISO(aDueDate, {representation: defaultValues.formatISOOptions.representation,
                                                          format: defaultValues.formatISOOptions.format});                                                  
        this.#dueDate = formattedDueDate;
        
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

    isExpiredBy(aDate){
        return isAfter(aDate, this.getDueDate());
    }

    priorityEquals(aPriorityValue){
        return this.#priorityValue === aPriorityValue;
    }

    getTitle(){
        return this.#title.toString();
    }

    getDescription(){
        return this.#description.toString();
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

    getPriority(){
        return this.#priorityValue; //Es tipo primitivo asi que se pasa copia
    }

    dueDateIsEarlierThan(anotherTask){
        return anotherTask.dueDateIsAfter(Object.assign({},this.#dueDate));
    }
    
    dueDateIsAfter(anotherDueDate){
        return isAfter(this.#dueDate, anotherDueDate);
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

    constructor(aDueDate = Task.defaultDueDate, aPriorityValue = defaultValues.taskPriorities.defaultConcreteTaskPriorityValue, aTitle = defaultValues.defaultTaskTitle, aDescription = defaultValues.defaultDescriptionText){        
        if (!ConcreteTask.#accessedViaInstanceCreationMethod){
            throw new Error(defaultValues.errorMessages.cantCreateAnInstanceOfConcreteTaskWithoutInstanceCreationMethods);
        }
        ConcreteTask.#accessedViaInstanceCreationMethod = false;
        ConcreteTask.assertIsAValidDueDate(aDueDate, defaultValues.errorMessages.cantCreateTaskForThePastErrorMessage);
        ConcreteTask.assertIsAValidPriorityValue(aPriorityValue, defaultValues.errorMessages.cantCreateTaskWithInvalidPriorityValueErrorMessage);         
        super(aDueDate, aPriorityValue, aTitle, aDescription);        
    }

    addTask(aTask){
        return Task.createCompositeTask([aTask], this.getDueDate(), this.getPriority(), this.getTitle(), this.getDescription());
    }

    addTasks(aTaskList){
        return Task.createCompositeTask(aTaskList, this.getDueDate(), this.getPriority(), this.getTitle(), this.getDescription());
    }

    //Double dispatch methods
    addClassToContainerWith(aContainer, aDomRenderizer){
        aDomRenderizer.addConcreteTaskClassToContainer(aContainer);
    }

    renderWith(aDomRenderizer, anEditionHandler, aDeleteHandler){
        return aDomRenderizer.renderConcreteTask(this, anEditionHandler, aDeleteHandler);
    }

}

class CompositeTask extends Task{
    #tasks = [];
    #originalDueDate;
    static #accessedViaInstanceCreationMethod = false;

    static createWith(aDependentTasksList = [], aDueDate = Task.defaultDueDate, aPriorityValue = defaultValues.taskPriorities.defaultCompositeTaskPriorityValue, aTitle = defaultValues.defaultTaskTitle, aDescription = defaultValues.defaultDescriptionText){
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

    markAsCompleted(){
        if (!this.allComponentTasksAreComplete()){
            throw new Error(defaultValues.errorMessages.cantCompleteCompositeTaskUntilAllComponentTasksAreCompleted);
        }
        super.markAsCompleted();
    }

    allComponentTasksAreComplete(){
        return this.#tasks.every(task => task.isCompleted())
    }
    
    isCompleted(){
        if (this.allComponentTasksAreComplete()){
            super.markAsCompleted();
        }
        return super.isCompleted();
    }

    includesTask(aTask){
        return this.#tasks.includes(aTask);
    }

    getDueDate(){
        if (this.#tasks.length !== 0){
            return this.#tasks.reduce((earliestDueDateTask, currentTask) => min([earliestDueDateTask, currentTask.getDueDate()]),super.getDueDate());
        }
        return super.getDueDate();
    }

    addTask(aTask){
        this.#tasks.push(aTask);
    }

    addTasks(aTasksList){
        aTasksList.forEach(task => this.addTask(task));
    }

    removeTask(aTask){
        let initialLength = this.#tasks.length;
        this.#tasks = this.#tasks.filter(task => task !== aTask);
        if (this.#tasks.length === initialLength){
            throw new Error(defaultValues.errorMessages.taskNotPresentInCompositeTask);
        }
    }

    removeTasks(aTaskList){
        aTaskList.forEach(task => this.removeTask(task));
    }

    dependentsDo(callback){
        return this.#tasks.map(dependentTask => callback(dependentTask));
    }

    //Double dispatch methods
    addClassToContainerWith(aContainer, aDomRenderizer){
        aDomRenderizer.addCompositeTaskClassToContainer(aContainer);
    }

    renderWith(aDomRenderizer){
        return aDomRenderizer.renderCompositeTask(this);
    }
}

export {Task, CompositeTask, ConcreteTask};