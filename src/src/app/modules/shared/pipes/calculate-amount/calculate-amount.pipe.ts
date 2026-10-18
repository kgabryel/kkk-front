import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'calculateAmount'
})
export class CalculateAmountPipe implements PipeTransform {

  transform(value: number | null, ...args: number[]): string {
    if (value === null) {
      return '';
    }
    const calculatedAmount = value * args[0] ?? 1;
    if (calculatedAmount % 1 === 0) {
      return calculatedAmount.toFixed(0);
    }
    return calculatedAmount.toFixed(2);
  }
}
