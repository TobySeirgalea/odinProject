import defaultValues from "../../appConstantValues.json" with {type: 'json'};

class Note{
    #title;
    #body;
    constructor(aTitle, aBody){
        this.assertNotEmptyTitleAndBody(aTitle, aBody);
        this.#title = aTitle;
        this.#body = aBody;
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
    
}

export {Note};