export interface ChangePasswordError {
  oldPassword: Map<string, string>,
  newPassword: Map<string, string>,
  passwordRepeat: Map<string, string>
}

export const changePasswordError: ChangePasswordError = {
  oldPassword: new Map([
    ['required', 'Hasło jest wymagane.']
  ]),
  newPassword: new Map([
    ['required', 'Hasło jest wymagane.'],
    ['differentPasswords', 'Hasło musi być inne od aktualnego.']
  ]),
  passwordRepeat: new Map([
    ['required', 'Hasło jest wymagane.'],
    ['samePasswords', 'Hasła muszą być takie same.']
  ])
};
