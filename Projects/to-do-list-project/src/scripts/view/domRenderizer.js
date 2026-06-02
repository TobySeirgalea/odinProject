import defaultValues from "../../appConstantValues.json" with {type: "json"};
import {CompositeTask, ConcreteTask, Task} from "../domain/task.js";

class DomRenderizer {
    static elementsTagForTaskTitles       = "h3";
    static elementsTagForTaskDescriptions = "p";
    static elementsTagForTaskDueDate      = "input";
    static elementsTagForTaskPriority     = "input";
    static containersElementTag           = "div";
    static elementsTagForNotesTitles      = "h3";
    static elementsTagForNotesBodies      = "p";
    static createButtonID              = "createButton";    
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
    static formsContainerDialogID      = "formsContainerDialog";
    static taskOptionInCreateFormID    = "taskOptionInCreateForm";
    static noteOptionInCreateFormID    = "noteOptionInCreateForm";
    static formFieldsContainerID       = "formFieldsContainer";
    static taskFormTitleInputID        = "taskFormTitleInput";
    static formFieldContainerClass     = "formFieldContainer";
    static taskFormDescriptionInputID  = "formDescriptionInput";
    static taskFormDependentsInputID   = "formDependentsInput";
    static taskFormDueDateInputID      = "formDueDateInput";
    static noteFormTitleInputID        = "noteFormTitleInputID";
    static noteFormBodyInputID         = "noteFormBodyInput";
    static creationFormSubmitButtonID  = "creationFormSubmitButton";
    static cancelCreationFormButtonID  = "cancelCreationFormButton";
    static createNoteButtonText        = "Create note"; 
    static createTaskButtonText        = "Create task";
    static taskFormPriorityValueSelectInputID = "formPriorityValueInput";
    static taskTitleLabelText = "Title: ";
    static taskFormDescriptionLabelText = "Description: ";
    static taskFormDueDateLabelText = "Due date: ";
    static taskFormPriorityValueLabelText = "Priority value: ";
    static noteTitleLabelText = "Title: ";
    static noteBodyLabelText  = "Body: ";
    static createButtonText = "Create";
    static editNoteButtonID = 'editNoteButton';
    static editNoteButtonTextContent = "Edit note";
    static deleteNoteButtonTextContent = "Delete note";
    static deleteNoteButtonID = "deleteNoteButton";
    static editTaskButtonTextContent = "Edit task";
    static editTaskButtonID = "taskEditButtonID";
    static deleteTaskButtonID = 'deleteTaskButton';
    static deleteTaskButtonTextContent = 'Delete task';


    renderCreateButton(createButtonHandler){
        const createButton = document.createElement('button');
        createButton.setAttribute('id', DomRenderizer.createButtonID);
        createButton.textContent = DomRenderizer.createButtonText;
        createButton.addEventListener("click", (event) => createButtonHandler(event));
        return createButton;
    }

    createContentForm(taskHandler, noteHandler){
        const formDialog     = document.createElement("dialog");
        const taskFormButton = document.createElement("button");
        const noteFormButton = document.createElement("button");
        const cancelButton   = document.createElement("button");

        taskFormButton.setAttribute('id', DomRenderizer.taskOptionInCreateFormID);
        noteFormButton.setAttribute('id', DomRenderizer.noteOptionInCreateFormID);
        cancelButton.setAttribute('id', DomRenderizer.cancelCreationFormButtonID);

        taskFormButton.textContent = 'Task';
        noteFormButton.textContent = 'Note';
        cancelButton.textContent   = 'Cancel';

        taskFormButton.addEventListener("click", (event) => taskHandler(event));
        noteFormButton.addEventListener("click", (event) => noteHandler(event));
        cancelButton.addEventListener("click",   (event) => formDialog.remove());

        this.appendChildsToElement(formDialog, [taskFormButton, noteFormButton, cancelButton]);
        return formDialog;
    }

    renderNoteCreationForm(submitButtonHandler){
        const noteFormContainer = document.createElement('form');
        noteFormContainer.setAttribute('method', 'dialog');
        noteFormContainer.setAttribute('id', DomRenderizer.formFieldsContainer);
        this.appendChildsToElement(noteFormContainer, [
            this.createFormInputElementWithLabel('input', DomRenderizer.noteFormTitleInputID, DomRenderizer.noteTitleLabelText,"text"),
            this.createFormInputElementWithLabel('textarea', DomRenderizer.noteFormBodyInputID, DomRenderizer.noteBodyLabelText, 'text')
        ]);
        noteFormContainer.appendChild(this.createSubmitButtonForNote(submitButtonHandler, noteFormContainer));
        return noteFormContainer;
    }

    createSubmitButtonWithMessage(message){
        const submitButton   = document.createElement("button");
        submitButton.setAttribute('id', DomRenderizer.creationFormSubmitButtonID);
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = message;
        return submitButton;
    }

    createSubmitButtonForNote(submitButtonHandler, form){
        const button = this.createSubmitButtonWithMessage(DomRenderizer.createNoteButtonText);
        button.addEventListener("click", (event) => submitButtonHandler(event, form));
        return button;
    }

    createSubmitButtonForTask(submitButtonHandler, form){
        const button = this.createSubmitButtonWithMessage(DomRenderizer.createTaskButtonText);
        button.addEventListener("click", (event) => submitButtonHandler(event, form));
        return button;
    }

    collectUserInputOfNoteForm(form){
        return {
            title: form.querySelector('#' + DomRenderizer.noteFormTitleInputID).value,
            body: form.querySelector('#' + DomRenderizer.noteFormBodyInputID).value
        };
    }

    collectUserInputOfTaskForm(form){
        return {
            title: form.querySelector('#' + DomRenderizer.taskFormTitleInputID).value,
            description: form.querySelector('#' + DomRenderizer.taskFormDescriptionInputID).value,
            dueDate: form.querySelector('#' + DomRenderizer.taskFormDueDateInputID).value,
            priorityValue: form.querySelector('#' + DomRenderizer.taskFormPriorityValueSelectInputID).value
        }
    }

    createInputDateField(){
        const dateInputField = this.createFormInputElementWithLabel('input', DomRenderizer.taskFormDueDateInputID, DomRenderizer.taskFormDueDateLabelText, "date");
        const input = dateInputField.querySelector('#' + DomRenderizer.taskFormDueDateInputID);
        input.setAttribute('min', this.todaysDateAsString());
        input.setAttribute('value', this.todaysDateAsString());
        return dateInputField;
    }

    todaysDateAsString(){
        return new Date().toISOString().split('T')[0];
    }

    createFormInputElementWithLabel(elementsTag, elementsID, labelTextContent, elementsInputType=null){
        const fieldContainer = document.createElement("div");
        const label          = document.createElement("label");
        const element      = document.createElement(elementsTag);
        
        fieldContainer.classList.add(DomRenderizer.formFieldContainerClass);
        
        label.textContent = labelTextContent;
        label.setAttribute("for", elementsID);
        element.setAttribute("id", elementsID);
        if (elementsInputType) element.setAttribute("type", elementsInputType);
        
        this.appendChildsToElement(fieldContainer, [label, element]);
        return fieldContainer;
    }

    renderTaskCreationForm(submitButtonHandler){
        const taskFormContainer = document.createElement('form');
        taskFormContainer.setAttribute("id", DomRenderizer.formFieldsContainer);
        taskFormContainer.setAttribute('method', 'dialog');
        this.appendChildsToElement(taskFormContainer, [
            this.createFormInputElementWithLabel("input", DomRenderizer.taskFormTitleInputID, DomRenderizer.taskTitleLabelText,"text"),
            this.createFormInputElementWithLabel("textarea", DomRenderizer.taskFormDescriptionInputID, DomRenderizer.taskFormDescriptionLabelText, "text"),
            this.createInputDateField(),
            this.createFormInputElementWithLabel("select", DomRenderizer.taskFormPriorityValueSelectInputID, DomRenderizer.taskFormPriorityValueLabelText)
        ]);
        const selectElement = taskFormContainer.querySelector("#" + DomRenderizer.taskFormPriorityValueSelectInputID);
        this.appendChildsToElement(selectElement, this.generateOptionsForPriorityValues());
        
        taskFormContainer.appendChild(this.createSubmitButtonForTask(submitButtonHandler, taskFormContainer));
        return taskFormContainer;
    }

    generateOptionsForPriorityValues(){
        const options = [];
        for (let priorityValue = defaultValues.taskPriorities.minPriorityValue; priorityValue < defaultValues.taskPriorities.maxPriorityValue; priorityValue += defaultValues.taskPriorities.step){
            let option = document.createElement("option");
            option.setAttribute("value", priorityValue);
            option.textContent = priorityValue;
            options.push(option);
        }
        return options;
    }

    renderTask(task, editionHandler, deleteHandler){
        return task.renderWith(this, editionHandler, deleteHandler);
    }

    createNoteBodyElement(note){
        const noteBodyElement = document.createElement(DomRenderizer.elementsTagForNotesBodies);
        this.addClassToClassListOf(noteBodyElement, DomRenderizer.noteBodyClass);
        noteBodyElement.textContent = note.getBody();
        return noteBodyElement;
    }

    renderNote(note, editionHandler, deleteHandler){
        const noteContainer = document.createElement(DomRenderizer.containersElementTag);
        this.appendChildsToElement(noteContainer, [this.createTitleElement(note, DomRenderizer.elementsTagForNotesTitles, DomRenderizer.noteTitleClass), this.createNoteBodyElement(note), this.createNoteEditionButton(editionHandler), this.createNoteDeleteButton(deleteHandler)]);
        return noteContainer;
    }

    createNoteEditionButton(editionHandler){
        const button = this.createButtonWithIDAndTextContent(DomRenderizer.editNoteButtonID, DomRenderizer.editNoteButtonTextContent);
        button.addEventListener('click', (event) => editionHandler(event));
        return button;
    }

    createNoteDeleteButton(deleteHandler){
        const button = this.createButtonWithIDAndTextContent(DomRenderizer.deleteNoteButtonID, DomRenderizer.deleteNoteButtonTextContent);
        button.addEventListener('click', (event) => deleteHandler(event));
        return button;
    }

    createButtonWithIDAndTextContent(id, textContent){
        const button = document.createElement('button');
        button.setAttribute('id', id);
        button.textContent = textContent;
        return button;
    }

    createButtonForTask(task, buttonID, buttonTextContent, clickHandler){
        const button = document.createElement('button');
        button.textContent = buttonTextContent;
        button.setAttribute('id', buttonID);
        button.addEventListener('click', (event) => clickHandler(event, task));
        return button;
    }

    renderConcreteTask(task, editionHandler, deleteHandler){
        const renderedTask = this.renderSingleTask(task);
        const editButton = this.createButtonForTask(task, DomRenderizer.editTaskButtonID, DomRenderizer.editTaskButtonTextContent, editionHandler);
        const deleteButton = this.createButtonForTask(task, DomRenderizer.deleteTaskButtonID, DomRenderizer.deleteTaskButtonTextContent, deleteHandler);
        this.appendChildsToElement(renderedTask, [editButton, deleteButton]);
        return renderedTask;
    }

    renderCompositeTask(task){
        const mainTaskContainer = this.renderSingleTask(task);
        const dependentTaskContainer = document.createElement(DomRenderizer.containersElementTag);
        this.addClassToClassListOf(dependentTaskContainer, DomRenderizer.dependentTaskContainerClass);
        this.appendChildsToElement(dependentTaskContainer, task.dependentsDo(task => this.renderTask(task)));
        mainTaskContainer.appendChild(dependentTaskContainer);
        return mainTaskContainer;
    }

    createTaskDueDateElement(task){
        const dueDateElement      = document.createElement(DomRenderizer.elementsTagForTaskDueDate);
        dueDateElement.setAttribute("value", task.getDueDate());
        dueDateElement.setAttribute("type", "date");
        this.addClassToClassListOf(dueDateElement, DomRenderizer.taskDueDateClass);
        return dueDateElement;
    }

    createTitleElement(toDoElement, elementTag, elementClass){
        const titleElement       = document.createElement(elementTag);
        titleElement.textContent = toDoElement.getTitle();
        this.addClassToClassListOf(titleElement, elementClass);
        return titleElement;
    }

    createDescriptionElement(task){
        const descriptionElement  = document.createElement(DomRenderizer.elementsTagForTaskDescriptions);
        descriptionElement.textContent = task.getDescription();
        this.addClassToClassListOf(descriptionElement, DomRenderizer.taskDescriptionsClass);
        return descriptionElement;
    }

    createTaskPriorityElement(task){
        const taskPriorityElement = document.createElement(DomRenderizer.elementsTagForTaskPriority);
        taskPriorityElement.setAttribute("type", "range");
        taskPriorityElement.setAttribute("value", task.getPriority());
        this.addClassToClassListOf(taskPriorityElement, DomRenderizer.taskPriorityClass);
        return taskPriorityElement;
    }

    renderSingleTask(task){
        const taskContainer = document.createElement(DomRenderizer.containersElementTag);        
        if (task.isCompleted()){
            this.addClassToClassListOf(taskContainer, DomRenderizer.completeTaskClass);
            this.removeClassFromClassListOf(taskContainer, DomRenderizer.incompleteTaskClass);
        }
        else{
            this.addClassToClassListOf(taskContainer, DomRenderizer.incompleteTaskClass);
        }
        task.addClassToContainerWith(taskContainer, this);
        this.addClassToClassListOf(taskContainer, DomRenderizer.taskClass);
        
        this.appendChildsToElement(taskContainer, [this.createTitleElement(task, DomRenderizer.elementsTagForTaskTitles, DomRenderizer.taskTitleClass), this.createDescriptionElement(task), this.createTaskDueDateElement(task), this.createTaskPriorityElement(task)]);
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
        this.addClassToClassListOf(aContainer, DomRenderizer.concreteTaskClass);
    }

    addCompositeTaskClassToContainer(aContainer){
        this.addClassToClassListOf(aContainer, DomRenderizer.compositeTaskClass);
    }
}

export {DomRenderizer};