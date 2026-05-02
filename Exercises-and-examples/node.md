# Node.js

Es una implementación de *CommonJS*, especificación de un ecosistema para Javascript fuera del navegador.

## ¿Cómo usarlo para incorporar librerias?

En vez de tener que hacer

```HTML
<script src="node_modules/ruta/a/libreria/archivo.js"></script>
```

por cada una que necesitemos, podemos cargarla directo en el archivo JS del siguiente modo:

```JS
var libName = require('libName');
```

ahorrándonos tener que escribir la ruta al `node_modules`. Esto no es compatible en el navegador (sin acceso al *file system*), pero para eso usamos un **JavaScript module bundler** para crear una versión compatible.

## Module bundler

Algunos *modules bundlers* conocidos son:

- [Browserify](http://browserify.org/).
- [webpack](https://webpack.github.io/).

Al ejecutarlo sobre un archivo, este reemplazará todos nuestros `require(...);` con lo necesario para juntar todo en un sólo archivo que por defecto es `dist/main.js`.

Ejemplo con webpack:

```bash
./node_modules/.bin/webpack index.js --mode=development
```

El argumento de modo es necesario para mantener el código legible en vez de en la versión minimizada de `mode=production`.
Luego en nuestro `index.html` ponemos:

```HTML
<script src="dist/main.js"></script>
```

Cada vez que modifiques el archivo que acabás de empaquetar (`index.js`, en este ejemplo) tenés que volver a ejecutar el webpack.

Si querés podés usar un `.config` en el directorio root del proyecto llamado `webpack.config.js` como el siguiente:

```JS
// webpack.config.js  
import path from "node:path";

export default = {  
  mode: 'development',  
  entry: './src/index.js',  
  output: {  
    filename: 'main.js',  
    publicPath: path,resolve(import.meta.dirname, "dist"),
    clean: true,
  },
};
```

Así solo tenemos que ingresar:

```bash
$./node_modules/.bin/webpack
```

Por cada modificación.

Ahora por cada nueva biblioteca que queramos añadir alcanza con poner:

```js
libName = require(libName);
```

Los *bundled files* van a para al directorio `dist` de *distribution*, el cual se utiliza a la hora del *deploy* del sitio. En cambio es en el directorio `src` donde escribimos el código.

### Añadiendo HTML

Para empaquetar el *html* podemos usar un plugin.

```bash
npm install --save-dev html-webpack-plugin
```

Agregando al `webpack.config.js` lo siguiente:

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
...
export default{
    ...
    ,
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/nombreArchivo.html",
        }),
    ],    
}
```

El *webpack* solo se encarga de linkear el HTML con el JS.

### Añadiendo CSS

Instalamos los siguientes paquetes:

- *css-loader* lee los archivos css que importemos en uno de js y almacena su resultado en un string.
- *style-loader* usa ese string para añadir el código de js que aplica esos estilos.

```bash
npm install --save-dev style-loader css-loader
```

Agregando al `webpack.config.js` lo siguiente que indica que si se encuentra un archivo que termine con .css lo procese con los de use.

```js
export default{
    ...
    ],
    module: {
        rules : [
            {
            test; /\.css$/i,
            use: ["style-loader", "css-loader"]
            },
        ],
    },
};
```

Luego importás tu CSS a tu módulo JS donde se use, en lugar de al HTML: 

```js
// src/index.js
import "./styles.css";
```

### Optimizando imagenes

- Si importás las imágenes en el CSS usando `url()`: El *css-loader* se encarga de la optimización.
- Si lo hacés en el HTML:

Hay que instalar *html-loader* `npm install --save-dev html-loader` y añadir al *webpack.config.js*:

```js
// webpack.config.js
{
  test: /\.html$/i,
  use: ["html-loader"],
}
```

- Si lo hacés en el JS: Usando una *asset/resource* rule.

```js
// webpack.config.js
{
  test: /\.(png|svg|jpg|jpeg|gif)$/i,
  type: "asset/resource",
}
```

Y en el módulo que la uses lo importás:

```js
// src/index.js
import odinImage from "./odin.png";
```

### Source map

Si queremos que cualquier mensaje de error referencie nuestro código y no la versión ya empaquetada debemos usar un *source map*.

```js
},
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
```

## Transpilación

*Transpilar*: Convertir código de un lenguaje a otro similar.

En *CSS* tenemos entre los más populares:

- [Sass](http://sass-lang.com/).
- [Less](http://lesscss.org/).
- [Stylus](http://stylus-lang.com/).

Para *JavaScript* tenemos:

- [TypeScript](http://www.typescriptlang.org/).
- [babel](https://babeljs.io/), convierte JS de última generación a una versión más compatible con todos los browsers.
- [CoffeScript](http://coffeescript.org/).

## Task runners

Son herramientas que permite automatizar las partes del proceso de *build* como minimización de código, empaquetado, optimización de imágenes, correr tests, etc.

Task runnes más populares:

- Scripting en Node.
- [Grunt](https://gruntjs.com/).
- [Gulp](https://gulpjs.com/).

```Json
//package.json
"scripts": {  
    "test": "echo \"Error: no test specified\" && exit 1",  
    "build": "webpack --progress --mode=production",  
    "watch": "webpack --progress --watch" 
  },  
```

Para ejecutar cada *script* basta con correr `$ npm run nombreScript`, en nuestro ejemplo los nombres de los scripts son build, watch y test.

Para ahorrarnos tener que recargar podemos usar *live reloading* con `$ npm install webpack-dev-server --save-dev` e iniciar el *dev server* con `$ npm run server` así con cada cambio en `index.js` se hace el rebuild del bundled JS y recarga el browser. Por defecto solo recarga los archivos cuyas modificaciones hayan afectado a nuestro `index.js`, así que el HTML lo ignora, para poder añadir que también esté en los *watched files* usamos `npx webpack serve`.
