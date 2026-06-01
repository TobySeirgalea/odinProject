export default {
  testEnvironment: 'jsdom',  // Si pruebas código que usa DOM
  transform: {
    '^.+\\.js$': 'babel-jest',  // Usa Babel para transformar archivos JS
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js'],  // Busca en __tests__ o archivos .test.js

};