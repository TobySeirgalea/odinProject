
class Storage{

    getAllTasks(){
        throw new Error('Subclass should implement it!');
    }

    getAllNotes(){
        throw new Error('Subclass should implement it!');
    }

    saveNote(){
        throw new Error('Subclass should implement it!');
    }

    saveTask(){
        throw new Error('Subclass should implement it!');
    }

    deleteTask(){
        throw new Error('Subclass should implement it!');
    }

    deleteNote(){
        throw new Error('Subclass should implement it!');
    }

    editTask(){
        throw new Error('Subclass should implement it!');
    }

    editNote(){
        throw new Error('Subclass should implement it!');
    }

    #findNote(){
        throw new Error('Subclass should implement it!');
    }

    #findTask(){
        throw new Error('Subclass should implement it!');
    }

    containsNote(){
        throw new Error('Subclass should implement it!');
    }

    containsTask(){
        throw new Error('Subclass should implement it!');
    }

    isAvailable(){
        throw new Error('Subclass should implement it!');
    }
}

class LocalStorage extends Storage{
    getAllTasks(){
        return this.#getItemsList('tasks');
    }

    getAllNotes(){
        return this.#getItemsList('notes');
    }

    saveNote(note){
        this.#saveItem(key, item);
    }

    saveTask(task){
        this.#saveItem('tasks', task);
    }

    deleteTask(task){
        return this.#deleteItem('tasks', task);
    }

    deleteNote(note){
        return this.#deleteItem('notes', note);
    }

    editTask(oldItem, updatedItem){
        return this.#editItem('tasks', oldItem, updatedItem);
    }

    editNote(oldItem, updatedItem){
        return this.#editItem('notes', oldItem, updatedItem);
    }

    containsNote(note){
        return this.#contains('notes', note);
    }

    containsTask(task){
        return this.#contains('tasks', task);
    }

    isAvailable(){
        let storage;
        try{
            storage = window['localStorage'];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(error){
            return (error instanceof DOMException &&
                error.name === "QuotaExceededError" && storage && storage.length !== 0
            );
        }
    }

    #saveItem(key, item){
        const itemsList = this.#getItemsList(key);
        itemsList.push(item);
        return this.#saveItemsList(key, itemsList);
    }

    #saveItemsList(key, itemsList){
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(itemsList));
    }

    #deleteItem(key, item){
        const itemsList = this.#getItemsList(key);
        itemsList.pop(item);
        return this.#saveItemsList(key, itemsList);
    }

    #editItem(key, oldItem, itemWithEditedValues){
        const allOtherItems = this.#withoutItem(key, oldItem);
        const newItemsList = allOtherItems.push(itemWithEditedValues);
        localStorage.removeItem(key);
        localStorage.setItem(key, newItemsList);
    }

    #withoutItem(key, item){
        const itemsList = this.#getItemsList(key);
        const allDifferentItems = itemsList.filter(savedItem => savedItem !== item)
        return allDifferentItems;
    }

    #getItemsList(key){
        return JSON.parse(localStorage.getItem(key));
    }

    #contains(key, item){
        const itemsList = this.#getItemsList(key);
        return itemsList.filter(savedItem => savedItem === item).length === 0;
    }
}

class notPersistentStorage extends Storage{
    #storage;
    constructor(){
        this.#storage = { 'notes': [], 'tasks': []};
    }
    getAllTasks(){
        return this.#storage['tasks'];
    }

    getAllNotes(){
        return this.#storage['notes'];
    }

    saveNote(note){
        this.#storage['notes'].push(item);
    }

    saveTask(task){
        this.#storage['tasks'].push(item);
    }

    deleteTask(task){
        return this.#storage['tasks'].pop(task);
    }

    deleteNote(note){
        return this.#storage['notes'].pop(note);
    }

    editTask(oldItem, updatedItem){
        return this.#storage['tasks'] = this.#storage['tasks'].filter(saved => saved !== oldItem).push(updatedItem);
    }

    editNote(oldItem, updatedItem){
        return this.#storage['notes'] = this.#storage['notes'].filter(saved => saved !== oldItem).push(updatedItem);
    }

    containsNote(note){
        return this.#contains('notes', note);
    }

    containsTask(task){
        return this.#contains('tasks', task);
    }

    #contains(key, item){
        return this.#storage[key].contains(item);
    }

    isAvailable(){
        return true;
    }
}

export { LocalStorage, notPersistentStorage };