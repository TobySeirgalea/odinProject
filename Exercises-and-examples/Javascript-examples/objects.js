function Book(title, author, pages, readed){
    if (!new.target){
        throw Error("Para crear una nueva instancia tenés que llamarlo con el keyword 'new'");
    }
    this.title  = title;
    this.author = author;
    this.pages  = pages;
    this.readed = readed;

    this.info = function info(){
        return `${this.title} by ${this.author}, ${this.pages}, ${readed}`;
    }
}

const hobbit = new Book("The Hobbit", "J.R.R. Tolkien", "295", "not read yet");
console.log(hobbit.info());

console.log(Object.prototype.hasOwnProperty("valueOf"));
console.log(hobbit.hasOwnProperty("valueOf"));
console.log(Object.getPrototypeOf(Object.prototype));

function Person(name) {
  this.name = name;
}

Person.prototype.sayName = function() {
  console.log(`Hello, I'm ${this.name}!`);
};

function Player(name, marker) {
  this.name = name;
  this.marker = marker;
}

Player.prototype.getMarker = function() {
  console.log(`My marker is "${this.marker}"`);
};

Object.getPrototypeOf(Player.prototype); // returns Object.prototype

// Now make `Player` objects inherit from `Person`
Object.setPrototypeOf(Player.prototype, Person.prototype);
Object.getPrototypeOf(Player.prototype); // returns Person.prototype

const player1 = new Player("steve", "X");
const player2 = new Player("also steve", "O");

player1.sayName(); // Hello, I'm steve!
player2.sayName(); // Hello, I'm also steve!

player1.getMarker(); // My marker is "X"
player2.getMarker(); // My marker is "O"

//Prototype chain debe ser establecida antes de crear instancias para evitar problemas de performance. Se hace con setPrototypeOf


let car = {
    brand: 'Honda',
    getBrand: function () {
        return this.brand;
    }
}

console.log(car.getBrand()); // Honda

let brand = car.getBrand;

console.log(brand()); // undefined

//You get undefined instead of "Honda" because when you call a method without specifying its object, JavaScript sets this to the global object in non-strict mode and undefined in the strict mode. To fix this issue, you can use the bind() method of the Function.prototype object. The bind() method creates a new function whose the this keyword is set to a specified value

let brand = car.getBrand.bind(car);
console.log(brand()); // Honda