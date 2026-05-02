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
