const dialog        = document.getElementById("addBookDialog");
const addBookButton = document.getElementById("addBookButton");
const sendButton    = document.getElementById("sendFormButton");
const cancelButton  = document.getElementById("cancelFormButton");
class Library{
    #booksStorage;
    constructor(){
        this.#booksStorage = [];
    }

    addBookToLibrary(aBook){
        const bookID = crypto.randomUUID();
        this.#booksStorage.push(aBook);
    }

    removeBook(aBook){
        this.#booksStorage = this.#booksStorage.filter((aLibraryBook => !aBook.equals(aLibraryBook)));
    }

    forEachBook(aFunction){
        this.#booksStorage.forEach(aBookRegister => aFunction(aBookRegister));    
    }
}

//De momento parece una clase anémica, sin funcionalidad propia y que puede ser reemplazada por una estructura de datos
class Book{
    #id;
    #title;
    #author;
    #numberOfPages;
    #read;

    constructor(title, author, numberOfPages, read){
        this.#title         = title;
        this.#author        = author;
        this.#numberOfPages = numberOfPages;
        this.#read          = read;
        this.#id            = crypto.randomUUID();
    }

    getTitle(){
        return String(this.#title);
    }

    getAuthor(){
        return String(this.#author);
    }

    getNumberOfPages(){
        return String(this.#numberOfPages);
    }

    getId(){
        return String(this.#id);
    }

    changeReadStatus(){
        this.#read = !this.#read;
    }

    equals(anotherBook){
        return anotherBook instanceof Book && this.#title === anotherBook.getTitle() && this.#author === anotherBook.getAuthor() && this.#numberOfPages === anotherBook.getNumberOfPages();
    }  

    wasRead(){
        return String(this.#read);
    }

    getData(){
        return [this.getId(), this.getTitle(), this.getAuthor(), this.getNumberOfPages(), this.wasRead()];
    }

    accept(aVisitor){
        aVisitor.visitBook(this);
    }
}
class LibraryVisitor{
    #library;
    #columns;
    #tableBody;
    constructor(aLibrary, columns){
        this.#library = aLibrary;
        this.#columns = columns;
        this.#createTable(columns);
    }

    #createTable(columns) {
        const tableElement = document.createElement("table");
        tableElement.id = "libraryContentTable";
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        thead.appendChild(tr);
        for (let column of columns) {
            const th = document.createElement("th");
            th.textContent = column;
            tr.appendChild(th);
        }
        tableElement.appendChild(thead);
        this.#tableBody = document.createElement("tbody");
        this.#tableBody.id = "data-rows";
        tableElement.appendChild(this.#tableBody);
        document.body.appendChild(tableElement);
    }

    #cleanTable(){
        Array.from(this.#tableBody.childNodes).forEach(child => this.#tableBody.removeChild(child));
    }

    displayLibraryContent(){
        this.#cleanTable();
        this.#fillTable();
    }

    #fillTable(){
        this.#library.forEachBook(aBook =>  aBook.accept(this));
    }

    #createRemoveButton(book){
        const removeBookButton = document.createElement("button");
        const tdRemoveBook     = document.createElement("td");
        removeBookButton.addEventListener("click", (event) => {
            this.#library.removeBook(book);
            this.displayLibraryContent();
        });
        tdRemoveBook.appendChild(removeBookButton);
        return tdRemoveBook;    
    }
    
    #createChangeToReadButton(book){
        const changeReadStatusButton = document.createElement("button");
        const tdChangeStatus         = document.createElement("td");
        changeReadStatusButton.addEventListener("click", (event) => {
            book.changeReadStatus(book);
            this.displayLibraryContent();
        });
        tdChangeStatus.appendChild(changeReadStatusButton);
        return tdChangeStatus;
    }
    
    #createButtonsForBookRow(book, row){
        row.appendChild(this.#createRemoveButton(book));
        row.appendChild(this.#createChangeToReadButton(book));
    }

    #addBookDataToRow(aBook, aRow){
        aBook.getData().forEach(bookDatField => {
            const tableData = document.createElement("td");
            tableData.textContent = bookDatField;
            aRow.appendChild(tableData);
        });
    }

    visitBook(aBook){
        const newRow = document.createElement("tr");
        this.#addBookDataToRow(aBook, newRow);
        this.#createButtonsForBookRow(aBook, newRow);
        this.#tableBody.appendChild(newRow);        
    }
}

function closeDialogForm(){
    document.getElementById("addBookForm").reset();
    dialog.close();
}
const library       = new Library();
const table         = new LibraryVisitor(library, ["ID", "Title", "Author", "Number of pages", "¿read?"]);

sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const bookTitle     = document.getElementById("bookTitleInput").value;
    const bookAuthor    = document.getElementById("bookAuthorInput").value;
    const numberOfPages = document.getElementById("pagesNumberInput").value;
    const read        = (document.getElementById("readCheckbox").checked);
    library.addBookToLibrary(new Book(bookTitle, bookAuthor, numberOfPages, read));
    closeDialogForm();
    table.displayLibraryContent();
});
cancelButton.addEventListener("click", event => closeDialogForm());
addBookButton.addEventListener("click", event => addBookDialog.showModal());

