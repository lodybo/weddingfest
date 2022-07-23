import { nameIsValid, attendanceIsValid, potluckIsValid } from './validations';

test('Name validator fails if name is not a string or an empty string', () => {
  expect(nameIsValid(undefined)).toBe(false);
  expect(nameIsValid(200)).toBe(false);
  expect(nameIsValid({})).toBe(false);
  expect(nameIsValid([])).toBe(false);
  expect(nameIsValid('')).toBe(false);
});

test('Name validator succeeds if name is a non empty string', () => {
  expect(nameIsValid('Kaylee Rosalina')).toBe(true);
});

test('Attendance validator fails if attendance is not a string or not a boolean value', () => {
  expect(attendanceIsValid(undefined)).toBe(false);
  expect(attendanceIsValid('')).toBe(false);
  expect(attendanceIsValid('Hello World!')).toBe(false);
});

test('Attendance validator succeeds if attendance is a stringified boolean value', () => {
  expect(attendanceIsValid('true')).toBe(true);
  expect(attendanceIsValid('false')).toBe(true);
});

test('Potluck validator fails if potluck is not a string or not a stringified array', () => {
  expect(potluckIsValid(undefined)).toBe(false);
  expect(potluckIsValid({})).toBe(false);
  expect(potluckIsValid([])).toBe(false);
  expect(potluckIsValid(1)).toBe(false);
});

test('Potluck validator succeeds if potluck is a stringified boolean value', () => {
  expect(potluckIsValid('[]')).toBe(true);
  expect(potluckIsValid('Bread,Cheese,Ham')).toBe(true);
});
