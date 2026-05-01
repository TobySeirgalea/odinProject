/*
Constructores
    -   No es obligatorio definir uno para cada clase, si uno no está definido se utiliza el primero que se encuentra en cadena de herencia
*/
class Person {
  constructor(name1) {
    this.name = name1; //al objeto instancia, en su atributo name pone name
  }
}

//Clases son sintax sugar, motor de method dispatch sigue haciendo: instancia → [[Prototype]] → Clase.prototype → Object.prototype → null


/*¿Qué es prototype?
Ahí van los métodos de la clase e instancias. Podés pensarlo como que clase = prototype + constructor
Las siguientes definiciones de persona son exactamente lo mismo solo que en la 2da usamos el sintax sugar de clases
*/ 

/*¿Algo que ver con factory functions?
No, en las factory function no tenés herencia. Los métodos son definidos particularmente para cada objeto que retorna la factory function en vez de estar agrupados en prototype y con definición compartida para todas las instancias. Cada objeto de factory es independiente de los demás. A una instancia particular sí que le puedo redefinir un método y que solo afecte a esa
*/
function Persona(nombre, edad) {
  this.nombre = nombre
  this.edad = edad
}

Persona.prototype.saludar = function () {
  console.log(`Hola, soy ${this.nombre}`)
}
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre
    this.edad = edad
  }

  saludar() {
    console.log(`Hola, soy ${this.nombre}`)
  }
}

const Persona = (nombre, edad) => {
    return {
        nombre,
        edad,
        saludar = () => {
        console.log(`Hola, soy ${nombre}`);
        },
  };
};
/*
| Forma                   | `this`     | Prototype   | Métodos compartidos | `new` |
| ----------------------- | ---------- | ----------- | ------------------- | ----- |
| Constructor + prototype | dinámico   | ✅          | ✅                  | ✅    |
| `class`                 | dinámico   | ✅ (interno)| ✅                  | ✅    |
| Factory (arrow)         | ❌ (léxico)| ❌          | ❌                  | ❌    |
*/

/*Using new on a class goes through the following steps:

    (If it's a derived class) The constructor body before the super() call is evaluated. This part should not access this because it's not yet initialized.
    (If it's a derived class) The super() call is evaluated, which initializes the parent class through the same process.
    The current class's fields are initialized.
    The constructor body after the super() call (or the entire body, if it's a base class) is evaluated.

Within the constructor body, you can access the object being created through this and access the class that is called with new through new.target*/


/*No es aconsejable subclasificar built-in

- Si superclase es extendida por creadores del lenguaje en un futuro, nuestra subclase pasaría a poder responder a esos nuevos métodos y con la implementación que sus creadores hayan usado alterando la semántica y comportamiento de nuestro objeto. E.g. un readOnlyMap que subclasifique Map y luego de un tiempo le añaden a Map un nuevo método de escritura. Deberíamos hacer overriding de ese método para evitarlo.
- Los métodos de instancia tienden a delegar a set minimal de primitivas para ser más óptimos. Si vos override/sobreescribis/overload un método x los demás que no hayas pisado y que tengan su implementación en la superclase dejarán de usar la implementación optimizada y pasarán a usar la tuya x, ya que this hará referencia a instancia en cuya clase pisaste ese método x.
- Métodos de creación de instancias llamados desde una subclase se castean a esa clase desde la que son invocados. Lo mismo con las factory staticas. Para evitar eso debemos override el constructor, así cuando se ejecuta instance.constructor[Symbol.species] nos da el de la clase que queremos en el objeto a retornar. En el ejemplo lo pisamos poniendo Array, así cuando map llame a instance.constructor[Symbol.species] obtiene el constructor de Array. 
All built-in implementations of [Symbol.species] return the this value, which is the current instance's constructor.

Es peligroso porque permite ejecución arbitraria de código. JS está buscando alternativas.
*/
class Array1 extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}
/*Mix-ins
No tenemos herencia múltiple pero podemos simularla del siguiente modo, con mix-ins:

Un mix-in es una función que recibe una clase con la funcionalidad que queremos agregar y retorna una subclase de esta con dicha funcionalidad

Como en JS un objeto puede tener un único prototype no tenemos forma de heredar de múltiples prototypes.

La idea es que el mixing nos permita ir poniendo clases con funcionalidades, que no se pisen, por encima de la actual, dotando al objeto de nuevos métodos.
*/
const calculatorMixin = (Base) =>
  class extends Base {
    calc() {}
  };

const randomizerMixin = (Base) =>
  class extends Base {
    randomize() {}
  };
/*Otra forma de usarlos es sin herencia, mediante Object.assign que copia los campos y métodos del segundo parámetro al primero, sobreescribiendolo si ya están definidos*/
class Dog {
  constructor(name) {
    this.name = name;
  }
}

const dogFunctionality = {
  bark: () => console.log("Woof!"),
  wagTail: () => console.log("Wagging my tail!"),
  play: () => console.log("Playing!"),
};

Object.assign(Dog.prototype, dogFunctionality);
/*Todas las instancias de Dog tendrán esas funcionalidades porque se las agregamos al prototipo*/

//Private

//Sintaxis:
class ClassWithPrivate {
  #privateField;
  #privateFieldWithInitializer = 42;

  #privateMethod() {
    // …

    //Si querés acceder a un campo privado como #privatedField usás:
    this.#privateField;
  }

  static #privateStaticField;
  static #privateStaticFieldWithInitializer = 42;

  static #privateStaticMethod() {
    // …
  }
}
/*
Static = Métodos de clase
No static = Métodos de instancia

# Indica private
Podés tenér métodos (de clase o instancia), campos (fields), getters/setters que pueden ser privados o publicos, ortogonalmente pueden ser static o no static

Un constructor no puede ser private. Trazando paralelismo con lo visto en ISW1 un constructor(parametrosConstructor) sería el initialize de Smalltalk que se llama automáticamente tras crear instancia de una clase con new Class(parametrosConstructor).

Si querés que solo puedan construirse instancias con un método específico de la clase en vez de con el estánda de new ClassName(attrs) que ejecuta el constructor(attrs) como inicialización podés hacer lo siguiente para simular constructores privados
*/

class PrivateConstructor {
  static #isInternalConstructing = false;

  constructor() {
    if (!PrivateConstructor.#isInternalConstructing) {
      throw new TypeError("PrivateConstructor is not constructable");
    }
    PrivateConstructor.#isInternalConstructing = false;
    // More initialization logic
  }

  static create() {
    PrivateConstructor.#isInternalConstructing = true;
    const instance = new PrivateConstructor();
    return instance;
  }
}

new PrivateConstructor(); // TypeError: PrivateConstructor is not constructable
PrivateConstructor.create(); // PrivateConstructor {}
/*
No podés referirte a un campo o método privado desde fuera de la definición de la clase, i.e. class A {...definición clase...}

El this en javascript es como el self de Smalltalk, cuando no encontrás la definición de un método en tu clase, vas a buscar en tus super clase (aquella a la que extendés) si lo encontrás allí y en su definición tiene la palabra this, ese this hace referencia al llamador, que sería la instancia de la subclase si es un método de instancia (instancia.metodoCuyaDefiniciónEstaEnSuperClase) o la subclase si es uno de clase/static (Clase.métodoCuyaDefiniciónEstaEnSuperClase)

Si querés ver si un objeto tiene un campo privado podés hacer #campoPrivado in objeto

Los elementos privados no forman parte de la herencia de prototipos

Las instancias buscan en su clase la definición de sus métodos
*/

//Esta sintaxis es válida, podés en vez de usar class NombreClase extends NombreOtraClase reemplazar NombreOtraClase con una declaración de una que será anónima
class Stamper extends class {
  // A base class whose constructor returns the object it's given
  constructor(obj) {
    return obj;
  }
} {
  // This declaration will "stamp" the private field onto the object
  // returned by the base class constructor
  #stamp = 42;
  static getStamp(obj) {
    return obj.#stamp;
  }
}

const obj = {};
new Stamper(obj);
// `Stamper` calls `Base`, which returns `obj`, so `obj` is
// now the `this` value. `Stamper` then defines `#stamp` on `obj`

console.log(obj); // In some dev tools, it shows {#stamp: 42}
console.log(Stamper.getStamp(obj)); // 42
console.log(obj instanceof Stamper); // false

// You cannot stamp private elements twice
new Stamper(obj); // Error: Initializing an object twice is an error with private fields

//Podés definir una clase sin constructor, el method dispatch va a usar el de la primer superclase que lo tenga definido en su cadena de herencia. Las instancias de esa clase sin constructor tendrán los campos de esta también, pero nada de lo privado de la super.

//a instanceof B te dice true si el a tiene B.prototype en su cadena de prototype