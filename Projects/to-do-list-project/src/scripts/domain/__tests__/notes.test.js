import defaultValues from "../../../appConstantValues.json" with {type: 'json'};
import {Note} from "../notes.js";

const noteTitles = ["Distracciones del día", "Ideas"];
const noteBodies = ["Buscar resultados Europa League"];

describe('Funcionalidad: Crear nota', () => {
  test('Puede crear nota', () => {
    expect(new Note(noteTitles[0])).toBeDefined();
    });
  test('No se puede crear una nota sin body ni título', () =>{
    expect(() => new Note()).toThrow(new Error(defaultValues.errorMessages.cantCreateAnEmptyNote));
  });
});
describe('Funcionalidad: Notas pueden tener título', () => {
  test('Puede crear nota con un título', () => {
    let note = new Note(noteTitles[0]); 
    expect(note.titleEquals(noteTitles[0])).toBeTruthy();
    });

  test('Se puede cambiar título de una nota ya creada', () => {
    let note = new Note(noteTitles[0]); 
    expect(note.titleEquals(noteTitles[0])).toBeTruthy();
    expect(note.titleEquals(noteTitles[1])).toBeFalsy();
    note.changeTitle(noteTitles[1]);
    expect(note.titleEquals(noteTitles[1])).toBeTruthy();
    expect(note.titleEquals(noteTitles[0])).toBeFalsy();
    });
});

describe('Funcionalidad: Notas pueden tener cuerpo', () => {
  test('Puede crear nota con un título y cuerpo', () => {
    let note = new Note(noteTitles[0], noteBodies[0]); 
    expect(note.bodyEquals(noteBodies[0])).toBeTruthy();
  });
  test('Puede crear nota con un título y cuerpo y luego cambiar el cuerpo', () => {
    let note = new Note(noteTitles[0], noteBodies[0]); 
    expect(note.bodyEquals(noteBodies[0])).toBeTruthy();
    expect(note.bodyEquals(noteBodies[1])).toBeFalsy();
    note.changeBody(noteBodies[1]);
    expect(note.bodyEquals(noteBodies[1])).toBeTruthy();
    expect(note.bodyEquals(noteBodies[0])).toBeFalsy();
  });
  test('Nota puede devolver su titulo', () => {
    let note = new Note(noteTitles[0], noteBodies[0]); 
    expect(note.titleEquals(note.getTitle())).toBeTruthy();
    expect(note.getTitle() === noteTitles[0]).toBeTruthy();
  });
  test('Nota puede devolver su cuerpo', () => {
    let note = new Note(noteTitles[0], noteBodies[0]); 
    expect(note.bodyEquals(note.getBody())).toBeTruthy();
    expect(note.getBody() === noteBodies[0]).toBeTruthy();
  });
  

});
