import { Time } from '../models/time';

export class TimeUtils {
  public static dateToTime(timeValue: Time): number {
    let time = 0;
    time += timeValue.second;
    time += 60 * timeValue.minute;
    time += 60 * 60 * timeValue.hour;

    return time;
  }

  public static getZeroTime(): Time {
    return { hour: 0, minute: 0, second: 0 };
  }

  public static timeToDate(time: number): Time {
    const totalSeconds = Math.floor(time);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hour: hours, minute: minutes, second: seconds };
  }
}
