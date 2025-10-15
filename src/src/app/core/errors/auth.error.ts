export interface AuthErrors {
  email: Map<string, string>;
  password: Map<string, string>;
  passwordRepeat: Map<string, string>;
}

export const authErrors: AuthErrors = {
  email: new Map([
    ['required', 'E-mail jest wymagany.'],
    ['email', 'E-mail ma zły format.'],
  ]),
  password: new Map([['required', 'Hasło jest wymagane.']]),
  passwordRepeat: new Map([
    ['required', 'Hasło jest wymagane.'],
    ['samePasswords', 'Hasła muszą być takie same.'],
  ]),
};
