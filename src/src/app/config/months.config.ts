export interface Month {
  value: number;
  key: string;
  disabled: boolean;
}

export const months: Month[] = [
  { disabled: false, key: 'Styczeń', value: 1 },
  { disabled: false, key: 'Luty', value: 2 },
  { disabled: false, key: 'Marzec', value: 3 },
  { disabled: false, key: 'Kwiecień', value: 4 },
  { disabled: false, key: 'Maj', value: 5 },
  { disabled: false, key: 'Czerwiec', value: 6 },
  { disabled: false, key: 'Lipiec', value: 7 },
  { disabled: false, key: 'Sierpień', value: 8 },
  { disabled: false, key: 'Wrzesień', value: 9 },
  { disabled: false, key: 'Październik', value: 10 },
  { disabled: false, key: 'Listopad', value: 11 },
  { disabled: false, key: 'Grudzień', value: 12 },
];
