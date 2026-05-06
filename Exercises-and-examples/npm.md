# Apunte npm: Package JSON

## Utilidad

Sirve para declarar dependencias y sus versiones requeridas para el proyecto actual, así al ejecutar `npm install` se instalan todas las necesarias. Cuando utilicemos un *module bundler* para empaquetar nuestra app y que esté lista para producción se usarán dichas dependencias.

## Crear un package.json

### Via questionnaire

Si ejecutás `npm init` en el directorio de tu proyecto te va a saltar un cuestionario por terminal para completar los campos básicos.

Si querés personalizar dicho cuestionario podés leer más en [¿Cómo crear un package json?](https://docs.npmjs.com/creating-a-package-json-file)

### Via manual

Si vamos al directorio del proyecto y ejecutamos `npm init --yes` nos generará un archivo `package.json` default con la información que se pudo extraer del directorio y con los valores de la configuración por default que tengamos en npm. Luego podemos modificar ese archivo agregándo la que necesitemos.

## Name & versioning

Son campos obligatorios.
`name` debe ser lowercase sin espacios y `version` tiene un string con las *[reglas de semántica para versiones](https://docs.npmjs.com/about-semantic-versioning)*, además podemos usar la *[calculadora](https://semver.npmjs.com/)* para ver si la expresión que hicimos representa las versiones que queremos del paquete.

## Definir config options para el comando init

Para hacerlo podemos ejecutar comandos con la siguiente sintaxis:

`npm set init-nombreCampo-nombreSubcampo "valorDefault"`

Luego cuando hagamos `npm init` vamos a tener esos valores que hayamos seteado.

## Separación de dependencias

- En `devDependencies` ponemos las que son necesarias solo en fase de desarrollo, como testing deps o linters.

- En `dependencies` ponemos las que son necesarias en todas las fases, tanto development como production.

## Instalando nuevos paquetes

Si al instalar un paquete usamos `npm install nombrePaquete --save` nuestro `package.json` se actualiza automáticamente con ese paquete.

Podemos añadir el tipo de dependencia, e.g.: `npm install nombrePaquete --save--dev`.

## Agregando scripts al package JSON

- Se agregan con una sintaxis `"nombre": "comandos sin npx al inicio"`

```json
{
  // ... other package.json stuff
  "scripts": {
    "build": "webpack",
    "dev": "webpack serve",
    "deploy": "git subtree push --prefix dist origin gh-pages"
  },
  // ... other package.json stuff
}
```

- Se ejecutan con `npm run <nombre>` en la terminal.

## Utilizando distintas configuraciones de webpack

Podemos tener múltiples archivos `webpack.config.js` para distintos perfiles. Estos se deben llamar `webpack.perfil.js` y para que *webpack* utilice esa configuración debemos agregar el flag `--config <scriptConfiguracion>`, por ejemplo:

```json
"build": "webpack --config webpack.prod.js",
"dev": "webpack serve --config webpack.dev.js"
```

En sus comandos podés usar otros scripts definidos previamente con `npm run <scriptName>`.

Si tenés un comando que llama a otro pero con un argumento adicional entonces podés definirlo como `"scriptReutilizado:nuevoArg": "npm run scriptReutilizado -- nuevoArg`

Como se ejecutan en terminal podés usar comandos de *bash*.

### Webpack merge

Podemos tener las configuraciones generales en un archivo `webpack.common.js` y las específicas de cada modo separadas, por ejemplo en `webpack.dev.js` y `webpack.prod.js`

Instalamos el paquete *webpack merge*

```js
npm install --save-dev webpack-merge
```

En las definiciones de los archivos `dev` y `prod` debemos usar `merge` con `webpack.common.js` del siguiente modo:

```js
 import { merge } from 'webpack-merge';
 import common from './webpack.common.js';

 export default merge(common, {
   mode: 'production',
   ...
 });
```

También debemos actualizar nuestro *scripts* en `package.json` especificándo qué comando usar para cada uno.

```js
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
```

## Definiendo scripts que se corran antes o después de un comando de npm

Si querés definir un *script*, o varios, a ejecutar antes de cada ejecución de un comando *C* tenés que llamarlo `preC`. En caso de querer que se corra después se llamaría `postC`.


