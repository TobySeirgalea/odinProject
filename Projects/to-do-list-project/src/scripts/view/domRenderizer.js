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
    static tasksResumeClass = "tasksResume";
    static tasksResumeCheckboxID = "taskResumeCheckbox";
    static tasksResumeTitleID = "taskResumeTitle";
    static tasksResumePriorityValueID = 'tasksResumePriorityValue';
    static noteDateClass = "notesDate";
    static renderedTaskInfoNavBarID = "renderedTaskInfoNavBar";
    static renderedTaskInfoNavBarSubtaskButtonID = 'renderedTaskInfoNavBarSubtaskButton';
    static renderedTaskInfoNavBarSubtaskButtonTextContent = 'Subtasks';
    static renderedTasksComponentsContainerID = 'renderedTasksComponentsContainer';
    static renderedTaskDependentsTasksContainerID = 'renderedTaskDependentsTasksContainer';
    static taskResumePriorityValueElementsTag = 'p';
    static dependentsTaskContainerOptionsForConcreteTaskID = 'dependentsTaskContainerOptionsForConcreteTask';
    static dependentsTaskContainerOptionsForConcreteTaskTextContainerID = 'dependentsTaskContainerOptionsForConcreteTaskTextContainer'; 
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID = 'dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasks'; 
    static dependentsTaskContainerOptionsForConcreteTaskTextContainerContent = 'No contiene subtareas'; 
    static dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksTextContent = '¿Desea añadir una?'; 
    static dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID = 'dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainer';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksListOptionsID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksListOptions';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButtonID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButton';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButtonID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButton';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksListOptionsID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksListOptions';
    static dependentsTaskContainerOptionsForConcreteTaskButtonForAddExistingTasksButtonTextContent = 'Add existing tasks';
    static dependentsTaskContainerOptionsForConcreteTaskButtonForCreateNewTasksButtonTextContent = 'Create a new task to add';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButtonID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButton';
    static dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButtonID = 'dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButton';
    static dropdownMenuClass = 'dropdownMenuClass';
    static createFormDialogID = 'createFormDialog';
    static searchingTaskDialogID = 'searchingTaskDialog';
    static taskSearchingDialogMainContentContainerID = 'taskSearchingDialogMainContentContainer';
    static searchingListItemID = 'searchingListItem';
    static searchingListItemTitleElement = 'h3';
    static searchingListItemDescriptionElement = 'p';
    static searchingListItemDueDateElement = 'input';
    static searchingDialogSubmitButtonID = 'searchingDialogSubmitButton';
    static taskCardClass = 'taskCardClass';

    #appController;
    constructor(anAppController){
        this.#appController = anAppController;
    }

    renderCreateButton(){
        const createButton = document.createElement('button');
        createButton.setAttribute('id', DomRenderizer.createButtonID);
        createButton.textContent = DomRenderizer.createButtonText;
        createButton.addEventListener("click", (event) => this.createButtonHandler(event));
        return createButton;
    }

    createButtonHandler(event){
        const dialog = this.createContentForm();
        document.body.appendChild(dialog);
        return dialog.showModal();
    }

    createContentForm(){
        const formDialog     = document.createElement("dialog");
        const taskFormButton = document.createElement("button");
        const noteFormButton = document.createElement("button");
        const cancelButton   = document.createElement("button");
        
        formDialog.setAttribute('id', DomRenderizer.createFormDialogID);
        taskFormButton.setAttribute('id', DomRenderizer.taskOptionInCreateFormID);
        noteFormButton.setAttribute('id', DomRenderizer.noteOptionInCreateFormID);
        cancelButton.setAttribute('id', DomRenderizer.cancelCreationFormButtonID);

        taskFormButton.textContent = 'Task';
        noteFormButton.textContent = 'Note';
        cancelButton.textContent   = 'Cancel';

        taskFormButton.addEventListener("click", (event) => this.appendFormToContentCreationDialog(formDialog, this.renderTaskCreationForm()));
        noteFormButton.addEventListener("click", (event) => this.appendFormToContentCreationDialog(formDialog, this.renderNoteCreationForm()));
        cancelButton.addEventListener("click",   (event) => formDialog.remove());

        this.appendChildsToElement(formDialog, [taskFormButton, noteFormButton, cancelButton]);
        return formDialog;
    }

    appendFormToContentCreationDialog(contentCreationDialog, formToAppend){
        const currentDialogForm = contentCreationDialog.querySelector('#' + DomRenderizer.formFieldsContainerID);
        if (currentDialogForm){
            contentCreationDialog.removeChild(currentDialogForm);
        } 
        contentCreationDialog.appendChild(formToAppend);
    }

    submitNoteButtonHandler(event, form){
        return (this.#appController).createNoteByFormInfo(this.collectUserInputOfNoteForm(form));
    }

    submitTaskButtonHandler(event, form){
        return (this.#appController).createTaskByFormInfo(this.collectUserInputOfTaskForm(form));
    }

    renderNoteCreationForm(){
        return this.createNoteForm((event, form) => this.submitNoteButtonHandler(event, form));
    }

    createNoteForm(submitButtonOnClickHandler){
        const noteFormContainer = document.createElement('form');
        noteFormContainer.setAttribute('method', 'dialog');
        noteFormContainer.setAttribute('id', DomRenderizer.formFieldsContainerID);
        this.appendChildsToElement(noteFormContainer, [
            this.createFormInputElementWithLabel('input', DomRenderizer.noteFormTitleInputID, DomRenderizer.noteTitleLabelText,"text"),
            this.createFormInputElementWithLabel('textarea', DomRenderizer.noteFormBodyInputID, DomRenderizer.noteBodyLabelText, 'text')
        ]);
        noteFormContainer.appendChild(this.createSubmitButtonForNote(noteFormContainer, submitButtonOnClickHandler));
        return noteFormContainer;
    }

    createSubmitButtonWithMessage(message){
        const submitButton   = document.createElement("button");
        submitButton.setAttribute('id', DomRenderizer.creationFormSubmitButtonID);
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = message;
        submitButton.setAttribute('form', DomRenderizer.formFieldsContainerID);
        return submitButton;
    }

    createSubmitButtonForNote(form, onClickHandler){
        const button = this.createSubmitButtonWithMessage(DomRenderizer.createNoteButtonText);
        button.addEventListener("click", (event) => onClickHandler(event, form));
        return button;
    }

    createSubmitButtonForTask(form, onClickHandler){
        const button = this.createSubmitButtonWithMessage(DomRenderizer.createTaskButtonText);
        button.addEventListener("click", (event) => onClickHandler(event, form));
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

    renderTaskCreationForm(){
        return this.createTaskForm((event, form) => this.submitTaskButtonHandler(event, form));
    }

    createTaskForm(submitButtonOnClickHandler){
        const taskFormContainer = document.createElement('form');
        taskFormContainer.setAttribute("id", DomRenderizer.formFieldsContainerID);
        taskFormContainer.setAttribute('method', 'dialog');
        this.appendChildsToElement(taskFormContainer, [
            this.createFormInputElementWithLabel("input", DomRenderizer.taskFormTitleInputID, DomRenderizer.taskTitleLabelText,"text"),
            this.createFormInputElementWithLabel("textarea", DomRenderizer.taskFormDescriptionInputID, DomRenderizer.taskFormDescriptionLabelText, "text"),
            this.createInputDateField(),
            this.createFormInputElementWithLabel("select", DomRenderizer.taskFormPriorityValueSelectInputID, DomRenderizer.taskFormPriorityValueLabelText)
        ]);
        const selectElement = taskFormContainer.querySelector("#" + DomRenderizer.taskFormPriorityValueSelectInputID);
        this.appendChildsToElement(selectElement, this.generateOptionsForPriorityValues());
        
        taskFormContainer.appendChild(this.createSubmitButtonForTask(taskFormContainer, submitButtonOnClickHandler));
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

    renderTask(task){
        return task.renderWith(this);
    }

    createNoteBodyElement(note){
        const noteBodyElement = document.createElement(DomRenderizer.elementsTagForNotesBodies);
        this.addClassToClassListOf(noteBodyElement, DomRenderizer.noteBodyClass);
        noteBodyElement.textContent = note.getBody();
        return noteBodyElement;
    }

    renderNote(note){
        const noteContainer = document.createElement(DomRenderizer.containersElementTag);
        this.appendChildsToElement(noteContainer, [this.createTitleElement(note, DomRenderizer.noteTitleClass, DomRenderizer.elementsTagForNotesTitles), this.createNoteBodyElement(note), this.createNoteEditionButton(note), this.createNoteDeleteButton(note), this.createNoteDateElement(note)]);
        return noteContainer;
    }

    createNoteDateElement(note){
        const dateElement = document.createElement('input');
        dateElement.setAttribute('type', 'date');
        dateElement.setAttribute('readonly', 'true');
        dateElement.textContent = note.getDate();
        this.addClassToClassListOf(dateElement, DomRenderizer.noteDateClass);
        return dateElement;
    }

    createNoteEditionButton(note){
        const button = this.createButton(DomRenderizer.editNoteButtonID, DomRenderizer.editNoteButtonTextContent, (event) => this.noteEditionButtonHandler(event, note));
        return button;
    }

    fillFormWithNoteInfo(form, note){
        form.querySelector('#' + DomRenderizer.noteFormTitleInputID).textContent = note.getTitle();
        form.querySelector('#' + DomRenderizer.noteFormBodyInputID).textContent = note.getBody();
    }

    submitNoteEditionHandler(event, form, note){
        return this.#appController.editNote(note, this.collectUserInputOfNoteForm(form));
    }

    noteEditionButtonHandler(event, note){
        const editionDialog = document.createElement('dialog');
        const noteEditionForm = this.createNoteForm((event, form) => {
            this.submitNoteEditionHandler(event, form, note);
            
        });
        this.fillFormWithNoteInfo(noteEditionForm, note);
        const cancelButton = this.createButton(DomRenderizer.cancelCreationFormButtonID, '', (event) => {
            editionDialog.close();
            editionDialog.remove();
        });
        this.appendChildsToElement(editionDialog, [noteEditionForm, cancelButton]);
        document.body.appendChild(editionDialog);
        editionDialog.showModal();
    }

    noteDeleteButtonHandler(event, note){
        const confirmationDialog = document.createElement('dialog');
        const cancelButton = this.createButton('', '', () => {
            confirmationDialog.close(); 
            confirmationDialog.remove()
        }, DomRenderizer.cancelActionButtonClass);
        const confirmButton = this.createButton('', '', () => {
            this.#appController.deleteNote(note);
            confirmationDialog.close();
            confirmationDialog.remove();
        }, DomRenderizer.confirmActionButtonClass);
        this.appendChildsToElement(confirmationDialog, [cancelButton, confirmButton]);
        document.body.appendChild(confirmationDialog);
        confirmationDialog.showModal();
    }

    createNoteDeleteButton(note){
        const button = this.createButton(DomRenderizer.deleteNoteButtonID, DomRenderizer.deleteNoteButtonTextContent, (event) => this.noteDeleteButtonHandler(event, note));
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

    createTaskResumeCheckboxFor(aTask){
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', DomRenderizer.tasksResumeCheckboxID);
        checkbox.checked = aTask.isCompleted();
        checkbox.addEventListener('click', (event) => { //Este handler no se activa hasta que el estado del checkbox es actualizado. i.e. estaba con checked = false, hacés click, pasa a checked = true y ejecuta el handler.
            event.target.checked ? aTask.markAsCompleted() : aTask.markAsUncompleted(); 
        });
        return checkbox;
    }


    createResumeTaskTitleElementFor(aTask){
        const taskTitle = document.createElement('p');
        taskTitle.setAttribute('id', DomRenderizer.tasksResumeTitleID);
        taskTitle.textContent = aTask.getTitle();
        return taskTitle;
    }

    createResumePriorityValueElementFor(aTask){
        const priorityValue = document.createElement(DomRenderizer.taskResumePriorityValueElementsTag);
        priorityValue.setAttribute('id', DomRenderizer.tasksResumePriorityValueID)
        priorityValue.textContent = aTask.getPriority();
        return priorityValue;
    }

    renderTaskResume(aTask, onClickHandler){
        const resumeContainer = document.createElement(DomRenderizer.containersElementTag);
        const checkbox = this.createTaskResumeCheckboxFor(aTask);
        const taskTitle = this.createResumeTaskTitleElementFor(aTask);
        const priorityValue = this.createResumePriorityValueElementFor(aTask);

        resumeContainer.classList.add(DomRenderizer.tasksResumeClass);
        resumeContainer.addEventListener('click', (event) => {
            if (event.target != checkbox) onClickHandler(event, aTask);
        });

        this.appendChildsToElement(resumeContainer, [checkbox, taskTitle, priorityValue]);
        return resumeContainer;
    }
    static cancelActionButtonClass = 'cancelActionButtonClass';
    renderedTaskDeleteButtonHandler(task){
        const confirmationDialog = document.createElement('dialog');
        const cancelButton = this.createButton('', '', () => {
            confirmationDialog.close(); 
            confirmationDialog.remove()
        }, DomRenderizer.cancelActionButtonClass);
        const confirmButton = this.createButton('', '', () => {
            this.#appController.deleteTask(task);
            confirmationDialog.close();
            confirmationDialog.remove();
        }, DomRenderizer.confirmActionButtonClass);
        this.appendChildsToElement(confirmationDialog, [cancelButton, confirmButton]);
        document.body.appendChild(confirmationDialog);
        confirmationDialog.showModal();
    }

    submitTaskEditionButtonHandler(event, form, task){
        return this.#appController.editTask(task, this.collectUserInputOfTaskForm(form));
    }

    renderTaskEditionForm(task, dialog, submitButtonOnClickHandler){
        const editionForm = this.createTaskForm(submitButtonOnClickHandler);
        this.fillFormWithTaskInfo(editionForm, task);
        return editionForm;
    }

    fillFormWithTaskInfo(editionForm, task){
        editionForm.querySelector('#' + DomRenderizer.taskFormTitleInputID).textContent = task.getTitle();
        editionForm.querySelector('#' + DomRenderizer.taskFormDescriptionInputID).textContent = task.getDescription();
        editionForm.querySelector('#' + DomRenderizer.taskFormDueDateInputID).setAttribute('value', task.getDueDate());
        editionForm.querySelector('#' + DomRenderizer.taskFormPriorityValueSelectInputID).setAttribute('value', task.getPriority());
    }


    renderedTaskEditionButtonHandler(task){
        const editionDialog = document.createElement('dialog');
        document.body.appendChild(editionDialog); 
        editionDialog.appendChild(this.renderTaskEditionForm(task, editionDialog, (event, form) => this.submitTaskEditionButtonHandler(event, form, task)));
        editionDialog.appendChild(this.createButton(DomRenderizer.cancelCreationFormButtonID, '', (event) => editionDialog.close()));
        editionDialog.showModal();
    }

    renderConcreteTask(task){
        return this.renderSingleTask(task);
    }

    renderCompositeTask(task){
        return this.renderSingleTask(task);
    }

    createTaskInfoNavBar(task, taskContainer){
        const navBar = document.createElement('nav');
        navBar.setAttribute('id', DomRenderizer.renderedTaskInfoNavBarID);
        navBar.appendChild(this.createSubtasksNavBarButton(task, taskContainer));
        return navBar;
    }

    createSubtasksNavBarButton(task, taskContainer){
        const subtasksButton = document.createElement('button');
        subtasksButton.textContent = DomRenderizer.renderedTaskInfoNavBarSubtaskButtonTextContent;
        subtasksButton.setAttribute('id', DomRenderizer.renderedTaskInfoNavBarSubtaskButtonID);
        subtasksButton.addEventListener('click', (event) => this.subtasksNavBarButtonHandler(event, task, taskContainer));
        return subtasksButton;
    }

    createSearchingListItemFor(task, container){
        const titleElement = this.createTitleElement(task, DomRenderizer.taskTitleClass, DomRenderizer.elementsTagForTaskTitles);
        const descriptionElement = this.createDescriptionElement(task);
        const dueDateElement = this.createTaskDueDateElement(task);
        const priorityValueElement = this.createTaskPriorityElement(task);
        this.appendChildsToElement(container, [titleElement, descriptionElement, dueDateElement, priorityValueElement]);
    }

    addExistingTaskHandler(event, task){
        const selectedToAddTask = [];
        const searchTasksDialog = document.createElement('dialog');
        const mainContentContainer = document.createElement(DomRenderizer.containersElementTag);
        const listOfTaskToAdd = document.createElement('ul');
        const validExistingTaskToAdd = this.#appController.getAllTasks(task);
        validExistingTaskToAdd.forEach(validTaskToAdd => {
            const listItem = document.createElement('li');
            listItem.setAttribute('id', DomRenderizer.searchingListItemID);
            this.createSearchingListItemFor(validTaskToAdd, listItem);
            listItem.addEventListener('click', (event) => {
                selectedToAddTask.push(validTaskToAdd);
            });
            listOfTaskToAdd.appendChild(listItem);
        });


        searchTasksDialog.setAttribute('id', DomRenderizer.searchingTaskDialogID);
        mainContentContainer.setAttribute('id', DomRenderizer.taskSearchingDialogMainContentContainerID);

        const submitButton = this.createButton(DomRenderizer.searchingDialogSubmitButtonID, DomRenderizer.searchingDialogSubmitButtonTextContent, (event) => {
            this.#appController.addSubtasksTo(selectedToAddTask, task);
            searchTasksDialog.close();
        });
        const cancelButton = this.createButton(DomRenderizer.searchingDialogCancelButtonID, DomRenderizer.searchingDialogCancelButtonTextContent, () => searchTasksDialog.close());
        this.appendChildsToElement(mainContentContainer, [listOfTaskToAdd, submitButton, cancelButton]);
        searchTasksDialog.appendChild(mainContentContainer);
        document.body.appendChild(searchTasksDialog);
        searchTasksDialog.showModal();
    }

    static searchingDialogCancelButtonID = 'searchingDialogCancelButton';
    static searchingDialogSubmitButtonTextContent = '';
    static taskOfSearchingListPressed = '';
    static closeButtonClass = 'closeButtonClass';
    createTaskTreeOfConcreteTask(task){
        const taskList = document.createElement('ul');
        const listItem = document.createElement('li');
        const details = document.createElement('details');
        const summary = document.createElement('summary'); 
        
        details.setAttribute('open', true);
        summary.addEventListener('click', (event) => this.renderTask(task));
        summary.appendChild(this.createContainerWithTaskInfoElements(task, DomRenderizer.taskInTasksTreeClass, DomRenderizer.taskInTasksTreeID));
        details.appendChild(summary);
        listItem.appendChild(details);
        taskList.appendChild(listItem);
        return taskList;
    }

    createTaskTreeOfCompositeTask(task){
        const taskList = document.createElement('ul');
        const listItem = document.createElement('li');
        const details = document.createElement('details');
        const summary = document.createElement('summary'); 
        
        details.setAttribute('open', true);
        summary.addEventListener('click', (event) => this.renderTask(task));
        
        summary.appendChild(this.createContainerWithTaskInfoElements(task, DomRenderizer.taskInTasksTreeClass, DomRenderizer.taskInTasksTreeID));
        details.appendChild(summary);
        this.appendChildsToElement(details, task.dependentsDo(dependentTask => this.createTaskTree(dependentTask)));
        listItem.appendChild(details);
        taskList.appendChild(listItem);
        return taskList;
    }

    createTaskTree(task){
        return task.createTaskTreeWith(this);
    }

    renderTaskTree(tasks){
        const taskTreeContainer = document.createElement(DomRenderizer.containersElementTag);
        this.addClassToClassListOf(taskTreeContainer, DomRenderizer.taskTreeContainerClass);
        if (tasks.length > 0) {
            this.appendChildsToElement(taskTreeContainer, tasks.map(task => task.createTaskTreeWith(this)));
        }
        document.body.querySelector('#taskTreeContainer').appendChild(taskTreeContainer);
    }
    static taskInTasksTreeClass   = 'taskInTaskTreeClass';
    static taskInTasksTreeID      = 'taskInTaskTreeID';
    static taskTreeContainerClass = 'taskTreeContainer';

    createNewTaskHandler(event, task){
        const createNewTaskDialog = document.createElement('dialog');
        createNewTaskDialog.setAttribute('id', DomRenderizer.createFormDialogID);
        const taskCreationForm = this.renderTaskCreationForm();
        this.appendFormToContentCreationDialog(createNewTaskDialog, taskCreationForm);
        //if (document.body.querySelector('#' + DomRenderizer.createFormDialogID)) document.body.removeChild(document.body.querySelector('#' + DomRenderizer.createFormDialogID));  
        document.body.appendChild(createNewTaskDialog);
        const cancelButton = this.createButton(DomRenderizer.cancelCreationFormButtonID, 'Cancel', (event) => createNewTaskDialog.close());
        createNewTaskDialog.appendChild(cancelButton);
        createNewTaskDialog.showModal();
    }

    createListWith(listItems, listClass){
        const optionsList = document.createElement('ul');
        this.addClassToClassListOf(optionsList, listClass);
        for (const item of listItems){
            const listItem = document.createElement('li');
            listItem.appendChild(item);
            optionsList.appendChild(listItem);
        }
        return optionsList;
    }

    createDropdownMenu(displayedWhenElementIsClicked, withElementsAsOptions, toBeContainedOn){
        const dropdownMenu = this.createListWith(withElementsAsOptions, DomRenderizer.dropdownMenuClass);
        displayedWhenElementIsClicked.addEventListener('click', (event) => toBeContainedOn.appendChild(dropdownMenu));
        toBeContainedOn.addEventListener('mouseleave', (event) => {
            if (toBeContainedOn.querySelector('.' + DomRenderizer.dropdownMenuClass)) 
                toBeContainedOn.removeChild(dropdownMenu);
        });
    }

    subNavBarButtonHandlerForConcreteTask(task, dependentTasksContainer){
        const optionsContainer = document.createElement(DomRenderizer.containersElementTag);
        optionsContainer.setAttribute('id', DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskID);
        const textContentContainer = document.createElement('p');
        textContentContainer.textContent = DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerContent;
        textContentContainer.setAttribute('id', DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskTextContainerID);
        
        const addTaskButton = this.createButton(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksID, DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksTextContent);
        const addExistingTaskButton = this.createButton(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksAddExistingTaskButtonID, DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddExistingTasksButtonTextContent, (event) => this.addExistingTaskHandler(event, task));
        const createNewTaskButton = this.createButton(DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonToAddTasksCreateNewTaskButtonID, DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForCreateNewTasksButtonTextContent, (event) => this.createNewTaskHandler(event, task));
        
        const addTaskButtonContainer = document.createElement(DomRenderizer.containersElementTag);
        addTaskButtonContainer.appendChild(addTaskButton);
        addTaskButtonContainer.setAttribute('id', DomRenderizer.dependentsTaskContainerOptionsForConcreteTaskButtonForAddTasksContainerID);

        this.createDropdownMenu(addTaskButton, [addExistingTaskButton, createNewTaskButton], addTaskButtonContainer);
        
        this.appendChildsToElement(optionsContainer, [textContentContainer, addTaskButtonContainer]);
        dependentTasksContainer.appendChild(optionsContainer);
    }

    subNavBarButtonHandlerForCompositeTask(task, dependentTasksContainer){
        this.appendChildsToElement(dependentTasksContainer, task.dependentsDo(task => this.renderTaskResume(task)));
    }

    subtasksNavBarButtonHandler(event, task, taskContainer){
        const dependentTaskContainer  = document.createElement(DomRenderizer.containersElementTag);
        dependentTaskContainer.setAttribute('id', DomRenderizer.renderedTaskDependentsTasksContainerID);
        const taskComponentsContainer = taskContainer.querySelector('#' + DomRenderizer.renderedTasksComponentsContainerID);
        this.addClassToClassListOf(dependentTaskContainer, DomRenderizer.dependentTaskContainerClass);
        task.subNavBarButtonHandlerWith(this, dependentTaskContainer);        
        this.clearContentOfElementAndAppend(taskComponentsContainer, dependentTaskContainer);
    }

    clearContentOfElementAndAppend(elementToClear, elementToAppend){
        elementToClear.innerHTML = '';
        elementToClear.appendChild(elementToAppend);
    }

    createTaskDueDateElement(task){
        const dueDateElement      = document.createElement(DomRenderizer.elementsTagForTaskDueDate);
        dueDateElement.setAttribute("value", task.getDueDate());
        dueDateElement.setAttribute("type", "date");
        dueDateElement.setAttribute("name", 'dueDate');
        dueDateElement.setAttribute('readonly', true);
        this.addClassToClassListOf(dueDateElement, DomRenderizer.taskDueDateClass);
        return dueDateElement;
    }

    createTitleElement(task, className, elementsTag){
        const titleElement       = document.createElement(elementsTag);
        titleElement.textContent = task.getTitle();
        this.addClassToClassListOf(titleElement, className);
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

    createTasksComponentsContainer(){
        const taskComponentsContainer = document.createElement(DomRenderizer.containersElementTag);
        taskComponentsContainer.setAttribute('id', DomRenderizer.renderedTasksComponentsContainerID);
        return taskComponentsContainer;
    }

    static taskRenderClass = 'taskRenderClass';
    static taskRenderID    = 'taskRender';
    static closeButtonID   = 'closeButton';
    static confirmActionButtonClass = 'confirmActionButtonClass';
    renderSingleTask(task){
        const taskContainer = this.createContainerWithTaskInfoElements(task, DomRenderizer.taskCardClass, DomRenderizer.taskRenderID);        
        const editButton = this.createButton(DomRenderizer.editTaskButtonID, DomRenderizer.editTaskButtonTextContent, (event) => this.renderedTaskEditionButtonHandler(task)); 
        const deleteButton = this.createButton(DomRenderizer.deleteTaskButtonID, DomRenderizer.deleteTaskButtonTextContent, (event) => this.renderedTaskDeleteButtonHandler(task)); 
        const closeButton = this.createButton(DomRenderizer.closeButtonID, '', (event) => taskContainer.remove(), DomRenderizer.closeButtonClass);
        this.appendChildsToElement(taskContainer, [
            closeButton,
            editButton,
            deleteButton,
            this.createTaskInfoNavBar(task, taskContainer),
            this.createTasksComponentsContainer()
        ]);
        const currentTaskCardBeingDisplayed = document.body.querySelector('#contentDisplay').querySelector('.' + DomRenderizer.taskCardClass);
        if (currentTaskCardBeingDisplayed) currentTaskCardBeingDisplayed.remove(); 
        return document.body.querySelector('#contentDisplay').appendChild(taskContainer);
    }

    createContainerWithTaskInfoElements(task, containersClass, containersID){
        const container = document.createElement(DomRenderizer.containersElementTag);
        this.addClassToClassListOf(container, containersClass);
        container.setAttribute('id', containersID);
        if (task.isCompleted()){
            this.addClassToClassListOf(container, DomRenderizer.completeTaskClass);
            this.removeClassFromClassListOf(container, DomRenderizer.incompleteTaskClass);
        }
        else {
            this.addClassToClassListOf(container, DomRenderizer.incompleteTaskClass);
        }
        task.addClassToContainerWith(container, this);
        this.appendChildsToElement(container, [
            this.createTitleElement(task, DomRenderizer.taskTitleClass, DomRenderizer.elementsTagForTaskTitles),
            this.createDescriptionElement(task),
            this.createTaskDueDateElement(task), 
            this.createTaskPriorityElement(task)
        ]);
        return container;
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

    createButton(aButtonID, aButtonTextContent, anOnClickHandler = null, aClass = '') {
        const button = document.createElement('button'); 
        button.setAttribute('id', aButtonID);
        button.textContent = aButtonTextContent;
        if (anOnClickHandler){
            button.addEventListener('click', (event) => anOnClickHandler(event));
        }
        if (aClass.length > 0) this.addClassToClassListOf(button, aClass)
        return button;
    }
}

export {DomRenderizer};