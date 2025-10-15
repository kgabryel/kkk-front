export interface ChangePasswordError {
  oldPassword: Map<string, string>;
  newPassword: Map<string, string>;
  passwordRepeat: Map<string, string>;
}

const requiredPassword = 'Hasło jest wymagane.';

export const changePasswordError: ChangePasswordError = {
  newPassword: new Map([
    ['required', requiredPassword],
    ['differentPasswords', 'Hasło musi być inne od aktualnego.'],
  ]),
  oldPassword: new Map([['required', requiredPassword]]),
  passwordRepeat: new Map([
    ['required', requiredPassword],
    ['samePasswords', 'Hasła muszą być takie same.'],
  ]),
};
