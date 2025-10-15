import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Length } from '../../config/form.config';
import { Timer } from '../models/timer';
import { TimeUtils } from '../utils/time.utils';
import { TimeValidator } from '../validators/time.validator';

export interface TimerFormNames {
  name: string;
  time: string;
  timer: string;
}

export const formNames: TimerFormNames = {
  name: 'name',
  time: 'time',
  timer: 'timer',
};

export abstract class TimerFactory {
  public static getAddForm(): FormGroup {
    return new FormGroup({
      [formNames.timer]: new FormControl(null, [Validators.maxLength(Length.maxTimerNameLength)]),
    });
  }

  public static getCreateForm(): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl('', [Validators.maxLength(Length.maxTimerNameLength)]),
      [formNames.time]: new FormControl(TimeUtils.getZeroTime(), [
        Validators.required,
        TimeValidator.greaterThanZero(),
      ]),
    });
  }

  public static getEditForm(timer: Timer): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(timer.name, [
        Validators.maxLength(Length.maxTimerNameLength),
      ]),
      [formNames.time]: new FormControl(TimeUtils.timeToDate(timer.time), [
        Validators.required,
        TimeValidator.greaterThanZero(),
      ]),
    });
  }

  public static getNameForm(timer: Timer): FormGroup {
    return new FormGroup({
      [formNames.name]: new FormControl(timer.name),
    });
  }

  public static getTimeForm(time: number): FormGroup {
    return new FormGroup({
      [formNames.time]: new FormControl(TimeUtils.timeToDate(time), [
        Validators.required,
        TimeValidator.greaterThanZero(),
      ]),
    });
  }
}
