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