import defaultValues from "../../appConstantValues.json" with {type: 'json'};

class Note{
    #title;
    #body;
    #date;
    constructor(aTitle, aBody){
        this.assertNotEmptyTitleAndBody(aTitle, aBody);
        this.#title = aTitle;
        this.#body = aBody;
        this.#date = new Date();
    }

    assertNotEmptyTitleAndBody(aTitle, aBody) {
        if (!aTitle && !aBody) {
            throw new Error(defaultValues.errorMessages.cantCreateAnEmptyNote);
        }
    }

    changeBody(aNewBody){
        this.#body = aNewBody;
    }

    changeTitle(aNewTitle){
        this.#title = aNewTitle;
    }

    bodyEquals(aBody){
        return this.#body === aBody;
    }

    titleEquals(aTitle){
        return this.#title === aTitle;
    }

    getTitle(){
        return String(this.#title);
    }

    getBody(){
        return String(this.#body);
    }

    getDate(){
        return this.#date.toISOString().split('T')[0];
    }
}

export {Note};