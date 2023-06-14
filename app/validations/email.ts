// create assertion functions that validate the username
export function isValidEmail(email: unknown): asserts email is string {
  if (email === undefined || email === null) {
    throw new Error('Email is undefined');
  } else if (typeof email !== 'string') {
    throw new Error('Email is a wrong type');
  } else if (!hasValidLength(email)) {
    throw new Error('Email is too short');
  } else if (!isValidEmailFormat(email)) {
    throw new Error('Email is not in a valid format');
  }
}

function hasValidLength(email: string) {
  return email.length > 3;
}

function isValidEmailFormat(email: string) {
  // check through regex
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm.test(
    email
  );
}
