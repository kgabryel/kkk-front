export interface Month {
  value: number;
  key: string;
  disabled: boolean;
}

export const months: Month[] = [
  {value: 1, key: 'Styczeń', disabled: false},
  {value: 2, key: 'Luty', disabled: false},
  {value: 3, key: 'Marzec', disabled: false},
  {value: 4, key: 'Kwiecień', disabled: false},
  {value: 5, key: 'Maj', disabled: false},
  {value: 6, key: 'Czerwiec', disabled: false},
  {value: 7, key: 'Lipiec', disabled: false},
  {value: 8, key: 'Sierpień', disabled: false},
  {value: 9, key: 'Wrzesień', disabled: false},
  {value: 10, key: 'Październik', disabled: false},
  {value: 11, key: 'Listopad', disabled: false},
  {value: 12, key: 'Grudzień', disabled: false}
];
