export interface Timer {
  id: number;
  time: number;
  name: string | null;
}

export interface FullTimer extends Timer {
  leftTime: number;
  running: boolean;
}
