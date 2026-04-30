//Destructuring
const obj = { a: 1, b: 2 };

// equivalent of doing
// const a = obj.a;
// const b = obj.b;
const { a, b } = obj;

const array = [1, 2, 3, 4, 5];

// equivalent of doing
// const zerothEle = array[0];
// const firstEle = array[1];
const [zerothEle, firstEle] = array;
const numbers = [];
({ a: numbers[0], b: numbers[1] } = obj);
// The properties `a` and `b` are assigned to properties of `numbers`

/*Note: The parentheses ( ... ) around the assignment statement are required when using object literal destructuring without a declaration.

{ a, b } = { a: 1, b: 2 } is not valid stand-alone syntax, as the { a, b } on the left-hand side is considered a block and not an object literal according to the rules of expression statements. However, ({ a, b } = { a: 1, b: 2 }) is valid, as is const { a, b } = { a: 1, b: 2 }.*/

//Default value en destructuring es valor que se usa cuando propiedad no presente o undefined
const { x = console.log("hey") } = { x: 2 };
// Does not log anything, because `x` is defined and there's no need to evaluate the default value. Pero en el siguiente si:
const {z = console.log("hey")} = {w: 2};
//...rest captura en la variable rest un arreglo (si el objeto original es un arreglo) o un objeto (si el original es un objeto) de elementos. Es útil para funciones varíadicas usándo ...args
const { k, ...others } = { a: 1, b: 2, c: 3 };
console.log(others); // { b: 2, c: 3 }

const [first, ...others2] = [1, 2, 3];
console.log(others2); // [2, 3]

//Destructuring de más elementos que los disponibles inicializa a undefined los sobrantes
const foo = ["one", "two"];

const [red, yellow, green, blue] = foo;
console.log(red); // "one"
console.log(yellow); // "two"
console.log(green); // undefined
console.log(blue); // undefined

//Esto permite también one liner swapping
let i = 1;
let j = 3;

[i, j] = [j, i];
console.log(i); // 3
console.log(j); // 1

const arr = [1, 2, 3];
[arr[2], arr[1]] = [arr[1], arr[2]];
console.log(arr); // [1, 3, 2]

//Si dejás un hueco sin nada se interpreta como que ese valor no se asigne a ninguna variable. Como un [a, _, b] en Python
function f() {
  return [1, 2, 3];
}

const [g, , h] = f();
console.log(g); // 1
console.log(h); // 3

const [c] = f();
console.log(c); // 1

const [e, l, ...{ length }] = [1, 2, 3];
console.log(e, l, length); // 1 2 1
/*
[ ... ] → destructuring de array (por posición)
{ ... } → destructuring de objeto (por propiedades)
... → agrupa lo que sobra
Los arrays también son objetos, por eso tienen propiedades como length
const resto = [3];
console.log(resto.length); // 1
*/

//Array destructuring calls the iterable protocol of the right-hand side. Therefore, any iterable, not necessarily arrays, can be destructured.
const [a, b] = new Map([
  [1, 2],
  [3, 4],
]);
console.log(a, b); // [1, 2] [3, 4]

/* Symbol.iterator
Es una propiedad especial de JavaScript.
Si un objeto la tiene, se vuelve iterable (como un array o string).

Eso permite hacer cosas como:

for (const x of obj) { ... }
👉 *[Symbol.iterator]()
El * indica que es una función generadora.
Un generador puede “pausar” su ejecución con yield.
👉 yield
Produce valores uno por uno, en lugar de todos juntos.
Cada vez que alguien pide el siguiente valor, el generador continúa.
🔄 2. ¿Qué hace este iterador?

Este código:

for (const v of [0, 1, 2, 3]) {
  console.log(v);
  yield v;
}

Hace dos cosas cada vez que se pide un valor:

Imprime el número (console.log)
Lo devuelve (yield)*/

//Genera nuevo objeto, 10 y 5 son los default values de aa y bb que toman valores de a y b por destructuring
const { a: aa = 10, b: bb = 5 } = { a: 3 };

console.log(aa); // 3
console.log(bb); // 5

//Unpack args en funciones 
const user = {
  id: 42,
  displayName: "jdoe",
  fullName: {
    firstName: "Jane",
    lastName: "Doe",
  },
};

function userId({ id }) { //Del objeto que recibimos nos quedamos con el atributo id
  return id;
}

console.log(userId(user)); // 42
//Podemos renombrarlo con : nuevo_nombre para usar ese nuevo nombre en cuerpo de función
function userDisplayName({ displayName: dname }) {
  return dname;
}

console.log(userDisplayName(user)); // "jdoe"

//También podemos poner default values a funciones que por definición de default value se usa si no se le asigna ningun valor en los parámetros de la llamada
function drawChart({
  size = "big",
  coords = { x: 0, y: 0 },
  radius = 25,
} = {}) {
  console.log(size, coords, radius);
  // do some chart drawing
}

drawChart({
  coords: { x: 18, y: 30 },
  radius: 30,
});

/*
Computed object property names and destructuring

Computed property names, like on object literals, can be used with destructuring.
*/
const key = "z";
const { [key]: foo } = { z: "bar" };

console.log(foo); // "bar"

//When deconstructing an object, if a property is not accessed in itself, it will continue to look up along the prototype chain.