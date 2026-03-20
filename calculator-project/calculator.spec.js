const fs = require('fs');
const path = require('path');

// La lectura del HTML sí puede estar afuera (no depende del DOM)
const html = fs.readFileSync(
  path.resolve(__dirname, './calculator.html'),
  'utf8'
);

beforeEach(() => {
  document.documentElement.innerHTML = html;
  jest.resetModules();
  require('./calculator.js');
});

describe('Mensaje inicial', () => {
  test('Mensaje inicial es solicitud de que usuario ingrese una operación', () => {
    const resultDisplay = document.querySelector("#display-text");
    expect(resultDisplay.textContent).toBe("Ingrese una operación:");
  });
});

describe('Click en un digito se ve por pantalla', () => {
  test('click en digito 1 lo muestra por pantalla', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");

    digitButtons[0].click();

    expect(resultDisplay.textContent).toBe("1");
  });
});

describe('Click en varios digitos seguidos se ven por pantalla', () => {
  test('click en digito 1 lo muestra por pantalla', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");

    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();

    expect(resultDisplay.textContent).toBe("123");
  });
});

describe('Click en varios digitos seguidos y luego en un operador se ven por pantalla', () => {
  test('click en digito 1 lo muestra por pantalla', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons[0].click();

    expect(resultDisplay.textContent).toBe("123+");
  });
});

describe('Click en varios operadores solo considera el último', () => {
  test('Clickeamos todos los operadores y vemos que solo quede el último', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());

    expect(resultDisplay.textContent).toBe("123%");
  });
});

describe('Tras un operador los digitos siguientes también se muestran por pantalla', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    
    expect(resultDisplay.textContent).toBe("123%123");
  });
});

describe('Presionar = realiza la operación y muestra resultado por pantalla', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    expect(resultDisplay.textContent).toBe("123%123");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("0");    
  });
});

describe('Presionar un digito tras obtener un resultado de una operación muestra solo el nuevo digito', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    expect(resultDisplay.textContent).toBe("123%123");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("0");    
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("4");    
  });
});

describe('Presionar un operador tras obtener un resultado de una operación muestra el resultado y el operador a su lado', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    expect(resultDisplay.textContent).toBe("123%123");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("0");    
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("4");    
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("4+");    
  });
});

describe('Presionar un operador tras obtener un resultado de una operación muestra el resultado y permite realizar otra operación usandolo', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    operatorButtons.forEach((btn) => btn.click());
    digitButtons[0].click();
    digitButtons[1].click();
    digitButtons[2].click();
    expect(resultDisplay.textContent).toBe("123%123");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("0");    
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("4");    
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("4+");
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("4+1");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("5");    
  });
});

describe('Tras ingresar una operación, si se ingresa otro operador, se resuelve la primera y se usa como primer operando ese resultado', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    digitButtons[1].click();
    operatorButtons[0].click();
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+1");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("3+");
  });
});

describe('Presionar clear limpia el display', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    digitButtons[1].click();
    operatorButtons[0].click();
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+1");
    clearButton.click();
    expect(resultDisplay.textContent).toBe("");
});
});

describe('Borra datos ingresados previamente y no los usa en operaciones tras el clear', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    digitButtons[1].click();
    operatorButtons[0].click();
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+1");
    clearButton.click();
    expect(resultDisplay.textContent).toBe("");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("");
});
});

describe('Dividir por cero imprime error', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    digitButtons[1].click();
    operatorButtons[3].click();
    digitButtons[9].click();
    expect(resultDisplay.textContent).toBe("2/0");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("Error: División por cero, presione clear para iniciar otra operación");
});
});


describe('Neg convierte a negativo el primer operando', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    negButton.click();
    expect(resultDisplay.textContent).toBe("-2");
});
});

describe('Neg convierte a positivo a primer operando negativo', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    negButton.click();
    expect(resultDisplay.textContent).toBe("-2");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2");
});
});

describe('Neg convierte a negativo a segundo operando positivo', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2+4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2-4");
});
});

describe('Neg convierte a negativo a segundo operando positivo cambiando signo de operacion', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2+4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2-4");
});
});

describe('Neg convierte a suma operacion de segundo operando negativo', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2+4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2-4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2+4");
});
});

describe('Neg agrega paréntesis en producto con segundo operando positivo', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[2].click();
    expect(resultDisplay.textContent).toBe("2*");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2*4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2*(-4)");
});
});

describe('Neg sobre uno que ya tenía paréntesis se lo saca', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[2].click();
    expect(resultDisplay.textContent).toBe("2*");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2*4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2*(-4)");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2*4");
});
});

describe('Neg agrega paréntesis en producto con segundo operando positivo y calcula bien', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[2].click();
    expect(resultDisplay.textContent).toBe("2*");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2*4");
    negButton.click();
    expect(resultDisplay.textContent).toBe("2*(-4)");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("-8");    
});
});

describe('Punto se muestra en pantalla', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    const pointButton = document.querySelector("#point");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    pointButton.click();
    expect(resultDisplay.textContent).toBe("2.");
});
});

describe('No se permite usar operador luego de un punto', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    const pointButton = document.querySelector("#point");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    pointButton.click();
    expect(resultDisplay.textContent).toBe("2.");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe(`Error: Debe introducir digitos en la parte decimal si utiliza ".""`);
});
});

describe('No se permite usar operador punto más de una vez en un operando', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    const pointButton = document.querySelector("#point");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    pointButton.click();
    expect(resultDisplay.textContent).toBe("2.");
    pointButton.click();
    expect(resultDisplay.textContent).toBe(`Error: No se permite usar operador punto más de una vez en un operando`);
});
});

describe('Permite operar entre punto flotante y entero', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    const pointButton = document.querySelector("#point");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    pointButton.click();
    expect(resultDisplay.textContent).toBe("2.");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2.2");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("2.2+");
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("2.2+1");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("3.2");
});
});

describe('No se permite agregar punto si no hay parte entera antes', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    const pointButton = document.querySelector("#point");
    pointButton.click();
    expect(resultDisplay.textContent).toBe("Error: No se permite agregar un punto sin antes ingresar una parte entera");
});
});

describe('Tras obtener resultado si ingreso operador, uso resultado como primer operando', () => {
  test('', () => {
    const resultDisplay = document.querySelector("#display-text");
    const digitButtons = document.querySelectorAll(".digits");
    const operatorButtons = document.querySelectorAll(".operator-button");
    const getResultButton = document.querySelector("#get-result-button");
    const clearButton = document.querySelector("#clear-button");
    const negButton = document.querySelector("#negation-button");
    digitButtons[1].click();
    expect(resultDisplay.textContent).toBe("2");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("2+");
    digitButtons[3].click();
    expect(resultDisplay.textContent).toBe("2+4");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("6");
    operatorButtons[0].click();
    expect(resultDisplay.textContent).toBe("6+");
    digitButtons[0].click();
    expect(resultDisplay.textContent).toBe("6+1");
    getResultButton.click();
    expect(resultDisplay.textContent).toBe("7");
});
});