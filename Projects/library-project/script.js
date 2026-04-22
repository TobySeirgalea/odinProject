let myLibrary = [];
const dialog        = document.getElementById("addBookDialog");
const addBookButton = document.getElementById("addBookButton");
const sendButton    = document.getElementById("sendFormButton");
const cancelButton  = document.getElementById("cancelFormButton");
const table         = document.getElementById("libraryContentTable");
const tableRows     = document.getElementById("data-rows");

function Book(id, title, author, numberOfPages, readed){
    if (!new.target){
        throw Error("Debe ser llamado con 'new'");
    }
    this.id            = id;
    this.title         = title;
    this.author        = author;
    this.numberOfPages = numberOfPages;
    this.readed        = readed;
}

function addBookToLibrary(title, author, numberOfPages, readed){
    const id   = crypto.randomUUID();
    const book = new Book(id, title, author, numberOfPages, readed);
    myLibrary.push(book);
}

function cleanTable(){
    Array.from(tableRows.childNodes).forEach(child => tableRows.removeChild(child));
}

function createTableRowWithBookData(book){
    const newRow = document.createElement("tr");
    for (field in book){
        let tableData = document.createElement("td");
        tableData.textContent = book[field];
        newRow.appendChild(tableData);
    }
    return newRow;
}

function createButtonsForBookRow(book, row){
    const removeBookButton       = document.createElement("button");
    const changeReadStatusButton = document.createElement("button");
    
    removeBookButton.addEventListener("click", (event) => removeBook(book));
    changeReadStatusButton.addEventListener("click", (event) => changeReadStatus(book));
    
    row.appendChild(document.createElement("td").appendChild(removeBookButton));
    row.appendChild(document.createElement("td").appendChild(changeReadStatusButton));
}


function displayLibraryContent(){
    cleanTable();
    myLibrary.forEach(book => {
        const newRow = createTableRowWithBookData(book);
        createButtonsForBookRow(book, newRow);
        tableRows.appendChild(newRow);
    })
}

function changeReadStatus(book){
    book.readed = (book.readed === "read") ? "not read" : "read";
    displayLibraryContent();    
}

function removeBook(book){
    myLibrary =  myLibrary.filter(libraryBook => libraryBook.id !== book.id);
    displayLibraryContent();
}

function closeDialogForm(){
    document.getElementById("addBookForm").reset();
    dialog.close();
}

sendButton.addEventListener("click", (event) => {
    event.preventDefault();
    const bookTitle     = document.getElementById("bookTitleInput").value;
    const bookAuthor    = document.getElementById("bookAuthorInput").value;
    const numberOfPages = document.getElementById("pagesNumberInput").value;
    const readed        = (document.getElementById("readCheckbox").checked) ? "read" : "not read";
    addBookToLibrary(bookTitle, bookAuthor, numberOfPages, readed);
    closeDialogForm();
    displayLibraryContent();
});
cancelButton.addEventListener("click", event => closeDialogForm());
addBookButton.addEventListener("click", event => addBookDialog.showModal());