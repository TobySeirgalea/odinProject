

export class DomController{
    static tasksContainerID = 'tasksContainer';
    
    #renderizer;
    #appController;
    constructor(appController, domRenderizer){
        this.#renderizer    = domRenderizer;
        this.#appController = appController;
    }

    displayTask(task){
        document.body.querySelector('#' + DomController.tasksContainerID).appendChild(this.#renderizer.renderTask(task, () => true, () => true));
    }

    
};