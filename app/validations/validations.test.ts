import { nameIsValid, attendanceIsValid } from './validations';

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
