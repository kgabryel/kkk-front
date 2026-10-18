import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PasswordValidator} from '../validators/password.validator';

export interface AuthFormNames {
  username: string,
  email: string,
  password: string,
  passwordRepeat: string
}

export const formNames: AuthFormNames = {
  username: 'username',
  email: 'email',
  password: 'password',
  passwordRepeat: 'passwordRepeat'
};

export abstract class AuthFormFactory {
  public static getLoginForm(): FormGroup {
    return new FormGroup({
      [formNames.username]: new FormControl('', [Validators.required, Validators.email]),
      [formNames.password]: new FormControl('', [Validators.required])
    });
  }

  public static getRegisterForm(): FormGroup {
    return new FormGroup({
      [formNames.email]: new FormControl('', [
        Validators.required, Validators.email
      ]),
      [formNames.password]: new FormControl('', [Validators.required]),
      [formNames.passwordRepeat]: new FormControl('', [
        Validators.required, PasswordValidator.samePasswords(formNames.password)
      ])
    });
  }

  public static getResetPasswordForm(): FormGroup {
    return new FormGroup({
      [formNames.email]: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public static getChangePasswordForm(): FormGroup {
    return new FormGroup({
      [formNames.password]: new FormControl('', [Validators.required]),
      [formNames.passwordRepeat]: new FormControl('', [
        Validators.required,
        PasswordValidator.samePasswords(formNames.password)
      ])
    });
  }
}
