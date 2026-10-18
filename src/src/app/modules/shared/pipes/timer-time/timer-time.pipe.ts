import {Pipe, PipeTransform} from '@angular/core';
import {TimeUtils} from '../../../../core/utils/time.utils';

@Pipe({
  name: 'timerTime'
})
export class TimerTimePipe implements PipeTransform {
  transform(time: number, ...args: unknown[]): string {
    const timeValue = TimeUtils.timeToDate(time);
    let result = '';
    let hours = timeValue.getHours();
    if (hours > 0) {
      if (hours < 10) {
        result += '0';
      }
      result += timeValue.getHours();
      result += ':';
    }

    if (timeValue.getMinutes() < 10) {
      result += '0';
    }
    result += timeValue.getMinutes();
    result += ':';
    if (timeValue.getSeconds() < 10) {
      result += '0';
    }
    result += timeValue.getSeconds();
    return result;
  }
}
