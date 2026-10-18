import type { PipeTransform } from '@angular/core';

import { Pipe } from '@angular/core';

import { TimeUtils } from '@/app/core/utils/time.utils';

@Pipe({
  name: 'timerTime',
})
export class TimerTimePipe implements PipeTransform {
  public transform(time: number): string {
    const timeValue = TimeUtils.timeToDate(time);
    let result = '';
    const hours = timeValue.hour;

    if (hours > 0) {
      if (hours < 10) {
        result += '0';
      }
      result += timeValue.hour;
      result += ':';
    }

    if (timeValue.minute < 10) {
      result += '0';
    }
    result += timeValue.minute;
    result += ':';
    if (timeValue.second < 10) {
      result += '0';
    }
    result += timeValue.second;

    return result;
  }
}
