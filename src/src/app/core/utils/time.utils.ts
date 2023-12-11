export class TimeUtils {
  public static timeToDate(time: number): Date {
    let date = new Date();
    date.setHours(0, 0, 0);
    date.setTime(date.getTime() + time * 1000);
    return date;
  }

  public static dateToTime(date: Date): number {
    let time = 0;
    time += date.getSeconds();
    time += 60 * date.getMinutes();
    time += 60 * 60 * date.getHours();
    return time;
  }

  public static getZeroTime(): Date {
    const time = new Date();
    time.setHours(0, 0, 0);
    return time;
  }
}
