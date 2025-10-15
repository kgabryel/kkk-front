import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PasswordValidator } from '../validators/password.validator';

export interface ChangePasswordFormNames {
  oldPassword: string;
  newPassword: string;
  passwordRepeat: string;
}

export const formNames: ChangePasswordFormNames = {
  newPassword: 'password',
  oldPassword: 'oldPassword',
  passwordRepeat: 'passwordRepeat',
};

export abstract class ChangePasswordFormFactory {
  public static get(): FormGroup {
    return new FormGroup({
      [formNames.newPassword]: new FormControl('', [
        Validators.required,
        PasswordValidator.differentPasswords(formNames.oldPassword),
      ]),
      [formNames.oldPassword]: new FormControl('', [Validators.required]),
      [formNames.passwordRepeat]: new FormControl('', [
        Validators.required,
        PasswordValidator.samePasswords(formNames.newPassword),
      ]),
    });
  }
}
