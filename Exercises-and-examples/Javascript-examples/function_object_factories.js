//Retornar otra función como resultado de una función:
  //Usamos que el scope de firstNumber es local al cuerpo de la función, entonces se puede usar en el cuerpo de la otra más interna también
function makeAddingFunction(firstNumber) {
  // firstNumber is scoped anywhere within makeAddingFunction,
  // including returnedFunction
  // any variables declared here will also be accessible within returnedFunction

  // we don't need to name the returned function
  // this is just to reference more easily in explanation
  return function returnedFunction(secondNumber) {
    // secondNumber is scoped only within returnedFunction
    return firstNumber + secondNumber;
  }
}

//instanceOf te dice si dentro de la prototype chain de un objeto hay un constructor prototype, no necesaria mente a instanceOf B si fue creado con el constructor B(), sino que también dará true si fue creado con algún constructor de la prototype chain de B, entonces en vez de indicarte el tipo te dice si a es de un tipo B o más débil.

//Factory functions: Refactorización de constructores
function User(name) { //Constructor, si no es invocado con new falla
  this.name = name;
  this.discordName = "@" + name;
}

function createUser(name) { //Factory function que te retorna el objeto, si necesidad de usar new.
  const discordName = "@" + name;
  return { name, discordName };
}

//¿Cómo tener private variables en JS?
function createUser(name) {
  const discordName = "@" + name;

  let reputation = 0;
  const getReputation = () => reputation;
  const giveReputation = () => { reputation++; };

  return { name, discordName, getReputation, giveReputation };
}

let toby = createUser("toby");
console.log(`toby:${toby}`);
toby.discordName = "toby12";
console.log(`toby.discordName = "toby12";`)
console.log(`toby:${toby}`);
//Usamos una Factory function, dentro de ella definimos una variable const, entonces ¿no podrá ser modificada? Falso, sí que se puede.

//Si solo cedemos setter y getters de una variable, pero no la variable, entonces cuando quieran acceder y modificar la variable sin el setter esto no tendrá efecto en el objeto
toby.reputation = 2;

console.log(`toby.reputation = 2;:${toby.reputation = 2}`);
console.log("toby no tiene reputation como atributo, por lo tanto se lo estamos agregando con valor cero. Luego cuando llamamos a toby.getReputation() lo que hace este es tomar el valor de la variable reputation de su scope, que es distinta a toby.reputation");
console.log(`toby.getReputation(): ${toby.getReputation()}`);
//Notar que reputation es tipo primitivo entonces se pasa por copia, ¿si se pasara por referencia ahí si que nos afectaría?

function createUser1(name) {
  const discordName = "@" + name;

  let reputation = {r1: 2, r2: 3};
  const getReputation = () => reputation;
  const giveReputation = () => { reputation++; };

  return { name, discordName, getReputation, giveReputation };
}

let toby1 = createUser1("toby1");
console.log(toby1);
//toby1.reputation.r1 = 99; //TypeError: Cannot set properties of undefined (setting 'r1')
console.log(`toby1.reputation: ${toby1.reputation}`, `toby1.getReputation():${toby1.getReputation()}`); //undefined, {r1: 2, r2:3}

function createPlayer(name, level) {
  const { getReputation, giveReputation } = createUser(name);

  const increaseLevel = () => { level++; };
  return { name, getReputation, giveReputation, increaseLevel };
}
//Creamos prototipos con factories y tenemos herencia
function createPlayer(name, level) {
  const user = createUser(name);

  const increaseLevel = () => { level++; };
  return Object.assign({}, user, { increaseLevel });
}

//Todos los objetos son public por defecto, así que si queremos preservar el encapsulamiento debemos usar modules, definiendo lo privado en el cuerpo de la Factory Function así no será accedido ni modificado desde fuera
const calculator = (() => {
  let lastResult; //No 

  const add = (a, b) => {
    lastResult = a + b;
    return lastResult;
  };
  const subtract = (a, b) => {
    lastResult = a - b;
    return lastResult;
  };
  const multiply = (a, b) => {
    lastResult = a * b;
    return lastResult;
  };
  const divide = (a, b) => {
    lastResult = a / b;
    return lastResult;
  };
  const getLastResult = () => lastResult;

  return { add, subtract, multiply, divide, getLastResult };
})();

console.log(calculator.add(3, 5)); // 8
console.log(calculator.subtract(6, 2)); // 4
console.log(calculator.getLastResult()); // 4
console.log(calculator.multiply(14, 5534)); // 77476

//Una IIFE (Immediately Invoked Function Expression) es simplemente:

//👉 una función que se define y se ejecuta en el mismo momento

(() => {
  console.log("Hola!");
})();

/*() => { ... } → es una función
(...)() → la ejecuta inmediatamente

💡 Es como decir: “creo esta función solo para usarla ahora mismo y después olvidarme de ella”.*/