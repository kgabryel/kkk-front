import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../validators/password.validator';

export interface ChangePasswordFormNames {
  oldPassword: string,
  newPassword: string,
  passwordRepeat: string
}

export const formNames: ChangePasswordFormNames = {
  oldPassword: 'oldPassword',
  newPassword: 'password',
  passwordRepeat: 'passwordRepeat'
};

export abstract class ChangePasswordFormFactory {
  public static get(): FormGroup {
    return new FormGroup({
      [formNames.oldPassword]: new FormControl('', [Validators.required]),
      [formNames.newPassword]: new FormControl('', [
        Validators.required, PasswordValidator.differentPasswords(formNames.oldPassword)
      ]),
      [formNames.passwordRepeat]: new FormControl('', [
        Validators.required, PasswordValidator.samePasswords(formNames.newPassword)
      ])
    });
  }
}
