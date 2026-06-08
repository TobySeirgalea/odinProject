import { Task, ConcreteTask, CompositeTask } from "../domain/task.js";
import { Note } from "../domain/notes.js";
import { LocalStorage, notPersistentStorage } from "../persistence/storage.js";
import { DomController } from "./domController.js";
export class AppController{
    #storage;
    #dom;
    constructor(){
        this.#dom     = new DomController(this);
        this.#storage = new LocalStorage(this);
        if (!this.#storage.isAvailable()){
            const wantsToContinue = this.#dom.informUserAndAskIfWantsToContinue();
            this.#storage = new notPersistentStorage();
        }        
    }

    deleteNote(formFieldsAndData){
        const noteReplica = new Note(formFieldsAndData.title, formFieldsAndData.description);
        this.#storage.deleteNote(noteReplica);
    }

    deleteTask(taskToDelete){
        this.#storage.deleteTask(taskToDelete);
    }

    editNote(oldFieldsAndData, formFieldsAndData){
        const oldNote     = new Note(oldFieldsAndData.title, oldFieldsAndData.description);
        const updatedNote = new Note(formFieldsAndData.title, formFieldsAndData.description);

        this.#storage.editNote(oldNote, updatedNote);
    }

    editTask(oldFieldsAndData, formFieldsAndData){
        const oldTaskReplica = Task.createConcreteTask(oldFieldsAndData.dueDate, oldFieldsAndData.priorityValue, oldFieldsAndData.title, oldFieldsAndData.description);
        const updatedTask    = Task.createConcreteTask(formFieldsAndData.dueDate, formFieldsAndData.priorityValue, formFieldsAndData.title, formFieldsAndData.description);

        this.#storage.editTask(oldTaskReplica, updatedTask);
    }

    createNoteByFormInfo(formFieldsAndData){
        const note = new Note(formFieldsAndData.title, formFieldsAndData.body);
        this.#dom.renderNote(note);
        this.#storage.saveNote(note);
    }
    
    createTaskByFormInfo(formFieldsAndData){
        const task = Task.createConcreteTask(formFieldsAndData.dueDate, formFieldsAndData.priorityValue, formFieldsAndData.title, formFieldsAndData.description);
        this.#dom.renderTask(task);
        this.#storage.saveTask(task);
    }

    displayTasks(){
        const savedTasks = this.#storage.getAllTasks();
        savedTasks.forEach(task => this.#dom.displayTask(task));
    }

    displayNotes(){
        const savedNotes = this.#storage.getAllNotes();
        savedNotes.forEach(note => this.#dom.displayNote(note));
    }

    getAllTasks(){

    }

    addSubtasksTo(){
        
    }
}