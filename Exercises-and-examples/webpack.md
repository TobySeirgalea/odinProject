# Webpack

## Entry

Indicás a partir de qué módulo/s debe construir el *dependency graph*. Por defecto es el `./src/index.js`.

```js
export default {
  entry: "./path/to/my/entry/file.js",
};
```

## Output

Indicás dónde poner el *bundle* construido, su nombre, etc.

```js
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./path/to/my/entry/file.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js",
  },
};
```

## Loaders

Permiten consumir otro tipo de archivos además de `.js` y `.json` convirtiéndolos en módulos y agregándolos al *dependency graph*.

- *test* identifica qué archivos deben ser transformados.
- *use* indica que *loader* se debe usar para ello.

```js
module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }],
  },
```

## Plugins

Deben ser importados al `webpack.config.js` y luego añadidos al arreglo de *plugins*

```js
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack"; // to access built-in plugins

export default {
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader" }],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

Podés usar las configuraciones específicas que provee cada *plugin* al crear una instancia de él.

## Mode

Permite definir pre-configuraciones, por ejemplo para modos `development` o `production`.

## Tree shaking

La idea de esta optimización es eliminar *dead code*. El código que se puede eliminar debe cumplir dos condiciones:

1. No ser invocado ni directamente ni indirectamente.
2. No tener efectos secundarios.

Caso contrario no se puede.

Esta información se encuentra en el *JSON package*, incluyendo `side-effects: false o side-effects: [arreglo de regex de archivos con side-effects, como los css]`.

De este modo permite traerse al *bundle* solamente el código utilizado realmente en el programa.

Si un archivo tiene efectos secundarios o sus exports son utilizados debemos incluirlo, también esto aplica en un nivel micro, permitiéndonos traer solo un fragmento de código de un archivo.

Se puede indicar que una función es libre de efectos secundarios utilizando los comentarios para poner una etiqueta:

```js
/* #__PURE__ */ double(55);
```

Solo si estamos en modo `production` ese código eliminado no estaŕa en el *bundle*, ya que este agrega `ModuleConcatenationPlugin` necesario para *tree shaking*.

