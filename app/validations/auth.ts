export type AuthErrors = {
  name?: string;
  email?: string;
  password?: string;
  verifyPassword?: string;
  existingUser?: string;
};

export type ChangePasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  verifyPassword?: string;
  passwordMismatch?: string;
};

type Registration = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  verifyPassword: FormDataEntryValue | null;
};

type Login = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

type ResetPassword = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  verifyPassword: FormDataEntryValue | null;
};

type ChangePassword = {
  currentPassword: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
  verifyPassword: FormDataEntryValue | null;
  passwordMismatch?: string;
};

export const nameIsValid = (name: any): name is string =>
  typeof name === 'string' && name !== '';

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const emailIsValid = (email: any): email is string =>
  typeof email === 'string' && email !== '' && emailRegex.test(email);

export const passwordIsValid = (password: any): password is string =>
  typeof password === 'string' && password !== '' && password.length >= 6;

export function validateRegistrationForm({
  name,
  email,
  password,
  verifyPassword,
}: Registration) {
  const errors: AuthErrors = {};

  if (!nameIsValid(name)) {
    errors.name =
      'Er is geen naam ingevuld, zo kunnen we niet zien wie je bent.';
  }

  if (!emailIsValid(email)) {
    errors.email = 'Er is geen geldig e-mailadres ingevuld.';
  }

  if (!passwordIsValid(password)) {
    errors.password = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (!passwordIsValid(verifyPassword)) {
    errors.verifyPassword = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (password !== verifyPassword) {
    errors.verifyPassword = 'De wachtwoorden komen niet overeen.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}

export function validateLoginForm({ email, password }: Login) {
  const errors: AuthErrors = {};

  if (!emailIsValid(email)) {
    errors.email = 'Er is geen geldig e-mailadres ingevuld.';
  }

  if (!passwordIsValid(password)) {
    errors.password = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}

export function validateResetPasswordForm({
  email,
  password,
  verifyPassword,
}: ResetPassword) {
  const errors: AuthErrors = {};

  if (!emailIsValid(email)) {
    errors.email = 'Er is geen geldig e-mailadres ingevuld.';
  }

  if (!passwordIsValid(password)) {
    errors.password = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (!passwordIsValid(verifyPassword)) {
    errors.verifyPassword = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (password !== verifyPassword) {
    errors.verifyPassword = 'De wachtwoorden komen niet overeen.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}

export function validateChangePasswordForm({
  currentPassword,
  newPassword,
  verifyPassword,
  passwordMismatch,
}: ChangePassword) {
  const errors: ChangePasswordErrors = {};

  if (!passwordIsValid(currentPassword)) {
    errors.currentPassword = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (!passwordIsValid(newPassword)) {
    errors.newPassword = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (!passwordIsValid(verifyPassword)) {
    errors.verifyPassword = 'Er is geen geldig wachtwoord ingevuld.';
  }

  if (newPassword !== verifyPassword) {
    errors.passwordMismatch = 'De wachtwoorden komen niet overeen.';
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return undefined;
}
