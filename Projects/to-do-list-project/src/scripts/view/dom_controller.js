import defaultValues from "../../appConstantValues.json" with {type: "json"};
import {CompositeTask, ConcreteTask, Task} from "../domain/task.js";

class DomController {
    static elementsTagForTaskTitles       = "h3";
    static elementsTagForTaskDescriptions = "p";
    static elementsTagForTaskDueDate      = "input";
    static elementsTagForTaskPriority     = "input";
    static containersElementTag           = "div";
    static elementsTagForNotesTitles      = "h3";
    static elementsTagForNotesBodies      = "p";
    
    static taskTitleClass              = "taskTitle";
    static taskDescriptionsClass       = "taskDescription";
    static taskDueDateClass            = "taskDueDate";
    static taskPriorityClass           = "taskPriority";
    static incompleteTaskClass         = "incompleteTask";
    static concreteTaskClass           = "concreteTask";
    static compositeTaskClass          = "compositeTask";
    static dependentTaskContainerClass = "dependentTaskContainer";
    static noteTitleClass              = "noteTitle";
    static noteBodyClass               = "noteBody";

    static taskOptionInCreateFormID    = "taskOptionInCreateForm";
    static noteOptionInCreateFormID    = "noteOptionInCreateForm";
    static formFieldsContainer         = "formFieldsContainer";
    static taskFormTitleInputID        = "taskFormTitleInput";
    static formFieldContainerClass     = "formFieldContainer";
    static taskFormDescriptionInputID  = "formDescriptionInput";
    static taskFormDependentsInputID   = "formDependentsInput";
    static taskFormDueDateInputID      = "formDueDateInput";
    static noteFormTitleInputID        = "noteFormTitleInputID";
    static noteFormBodyInputID         = "noteFormBodyInput";
    static creationFormSubmitButtonID  = "creationFormSubmitButton";
    static cancelCreationFormButtonID  = "cancelCreationFormButton";
    static taskFormPriorityValueSelectInputID = "formPriorityValueInput";
    
    createContentForm(){
        const formContainer  = document.createElement("dialog");
        const form           = document.createElement("form");
        const taskFormButton = document.createElement("button");
        const noteFormButton = document.createElement("button");
        const cancelButton   = document.createElement("button");

        taskFormButton.setAttribute('id', DomController.taskOptionInCreateFormID);
        noteFormButton.setAttribute('id', DomController.noteOptionInCreateFormID);
        cancelButton.setAttribute('id', DomController.cancelCreationFormButtonID);
        form.setAttribute("method", "dialog");

        taskFormButton.textContent = 'Task';
        noteFormButton.textContent = 'Note';
        cancelButton.textContent   = 'Cancel';

        taskFormButton.addEventListener("click", (event) => this.showTaskCreationForm(form, formContainer));
        noteFormButton.addEventListener("click", (event) => this.showNoteCreationForm(form, formContainer));
        cancelButton.addEventListener("click", (event) => formContainer.remove());

        this.appendChildsToElement(formContainer, [taskFormButton, noteFormButton, form, cancelButton]);
        return formContainer;
    }

    submitCreationForm(form, event, formDialog){
        event.preventDefault();
        const data = new FormData(form);
        console.log(data);
        form.submit();
    }

    ensureElementIsEmptyInside(element){
        element.innerHTML = '';
    }

    createSubmitButtonFor(form, formContainer){
        const submitButton   = document.createElement("button");
        submitButton.textContent = 'Create';
        submitButton.setAttribute('id', DomController.creationFormSubmitButtonID);
        submitButton.setAttribute('type', 'submit');
        submitButton.addEventListener("click", (event) => this.submitCreationForm(form, event, formContainer));
        formContainer.appendChild(submitButton);
    }

    showNoteCreationForm(form, formContainer){
        let noteFormContainer = this.createIfNotDefined(form, DomController.formFieldsContainer, 'form');
        this.ensureElementIsEmptyInside(noteFormContainer);
        noteFormContainer.setAttribute('id', DomController.formFieldsContainer);
        this.appendChildsToElement(noteFormContainer, [
            this.createFormInputElementWithLabel('input', DomController.noteFormTitleInputID, "text"),
            this.createFormInputElementWithLabel('textarea', DomController.noteFormBodyInputID, 'text')
        ]);
        form.appendChild(noteFormContainer);
        this.ensureToHaveSubmitButton(form, formContainer);
    }

    createFormInputElementWithLabel(elementsTag, elementsID, elementsInputType=null){
        let fieldContainer = document.createElement("div");
        let label          = document.createElement("label");
        const element      = document.createElement(elementsTag);
        
        fieldContainer.classList.add(DomController.formFieldContainerClass);
        
        label.setAttribute("for", elementsID);
        element.setAttribute("id", elementsID);
        if (elementsInputType) element.setAttribute("type", elementsInputType);
        
        this.appendChildsToElement(fieldContainer, [label, element]);
        return fieldContainer;
    }

    createIfNotDefined(container, elementID, elementsTag){
        let definition = container.querySelector("#" + elementID);
        if (!definition){
            definition = document.createElement(elementsTag);
            definition.setAttribute("id", elementID);
        }
        return definition;
    }

    showTaskCreationForm(form, formContainer){
        let taskFormContainer = this.createIfNotDefined(form, DomController.formFieldsContainer, 'form');
        this.ensureElementIsEmptyInside(taskFormContainer);
        taskFormContainer.setAttribute("id", DomController.formFieldsContainer);
        this.appendChildsToElement(taskFormContainer, [
            this.createFormInputElementWithLabel("input", DomController.taskFormTitleInputID, "text"),
            this.createFormInputElementWithLabel("textarea", DomController.taskFormDescriptionInputID, "text"),
            this.createFormInputElementWithLabel("input", DomController.taskFormDueDateInputID, "date"),
            this.createFormInputElementWithLabel("select", DomController.taskFormPriorityValueSelectInputID)
        ]);
        const selectElement = taskFormContainer.querySelector("#" + DomController.taskFormPriorityValueSelectInputID);
        this.appendChildsToElement(selectElement, this.generateOptionsForPriorityValues());
        
        form.appendChild(taskFormContainer);
        this.ensureToHaveSubmitButton(form, formContainer);
    }

    ensureToHaveSubmitButton(form, formContainer) {
        if (!formContainer.querySelector("#" + DomController.creationFormSubmitButtonID)) {
            this.createSubmitButtonFor(form, formContainer);
        }
    }

    generateOptionsForPriorityValues(){
        const options = [];
        for (let priorityValue = defaultValues.taskPriorities.minPriorityValue; priorityValue < defaultValues.taskPriorities.maxPriorityValue; priorityValue += defaultValues.taskPriorities.step){
            let option = document.createElement("option");
            option.setAttribute("value", priorityValue);
            options.push(option);
        }
        return options;
    }

    renderTask(task){
        return task.renderWith(this);
    }

    createNoteBodyElement(note){
        const noteBodyElement = document.createElement(DomController.elementsTagForNotesBodies);
        this.addClassToClassListOf(noteBodyElement, DomController.noteBodyClass);
        noteBodyElement.textContent = note.getBody();
        return noteBodyElement;
    }

    renderNote(note){
        const noteContainer = document.createElement(DomController.containersElementTag);
        this.appendChildsToElement(noteContainer, [this.createTitleElement(note, DomController.elementsTagForNotesTitles, DomController.noteTitleClass), this.createNoteBodyElement(note)]);
        return noteContainer;
    }

    renderConcreteTask(task){
        return this.renderSingleTask(task);
    }

    renderCompositeTask(task){
        const mainTaskContainer = this.renderSingleTask(task);
        const dependentTaskContainer = document.createElement(DomController.containersElementTag);
        this.addClassToClassListOf(dependentTaskContainer, DomController.dependentTaskContainerClass);
        this.appendChildsToElement(dependentTaskContainer, task.dependentsDo(task => this.renderTask(task)));
        mainTaskContainer.appendChild(dependentTaskContainer);
        return mainTaskContainer;
    }

    createTaskDueDateElement(task){
        const dueDateElement      = document.createElement(DomController.elementsTagForTaskDueDate);
        dueDateElement.setAttribute("value", task.getDueDate());
        dueDateElement.setAttribute("type", "date");
        this.addClassToClassListOf(dueDateElement, DomController.taskDueDateClass);
        return dueDateElement;
    }

    createTitleElement(toDoElement, elementTag, elementClass){
        const titleElement       = document.createElement(elementTag);
        titleElement.textContent = toDoElement.getTitle();
        this.addClassToClassListOf(titleElement, elementClass);
        return titleElement;
    }

    createDescriptionElement(task){
        const descriptionElement  = document.createElement(DomController.elementsTagForTaskDescriptions);
        descriptionElement.textContent = task.getDescription();
        this.addClassToClassListOf(descriptionElement, DomController.taskDescriptionsClass);
        return descriptionElement;
    }

    createTaskPriorityElement(task){
        const taskPriorityElement = document.createElement(DomController.elementsTagForTaskPriority);
        taskPriorityElement.setAttribute("type", "range");
        taskPriorityElement.setAttribute("value", task.getPriority());
        this.addClassToClassListOf(taskPriorityElement, DomController.taskPriorityClass);
        return taskPriorityElement;
    }

    renderSingleTask(task){
        const taskContainer = document.createElement(DomController.containersElementTag);        
        if (task.isCompleted()){
            this.addClassToClassListOf(taskContainer, DomController.completeTaskClass);
            this.removeClassFromClassListOf(taskContainer, DomController.incompleteTaskClass);
        }
        else{
            this.addClassToClassListOf(taskContainer, DomController.incompleteTaskClass);
        }
        task.addClassToContainerWith(taskContainer, this);
        this.addClassToClassListOf(taskContainer, DomController.taskClass);
        
        this.appendChildsToElement(taskContainer, [this.createTitleElement(task, DomController.elementsTagForTaskTitles, DomController.taskTitleClass), this.createDescriptionElement(task), this.createTaskDueDateElement(task), this.createTaskPriorityElement(task)]);
        return taskContainer;
    }

    appendChildsToElement(element, childsArray){
        childsArray.forEach(child => element.appendChild(child));
    }

    addClassToClassListOf(element, classToAdd){
        element.classList.add(classToAdd);
    }

    removeClassFromClassListOf(element, classToRemove){
        element.classList.remove(classToRemove);
    }

    addConcreteTaskClassToContainer(aContainer){
        this.addClassToClassListOf(aContainer, DomController.concreteTaskClass);
    }

    addCompositeTaskClassToContainer(aContainer){
        this.addClassToClassListOf(aContainer, DomController.compositeTaskClass);
    }
}

export {DomController};