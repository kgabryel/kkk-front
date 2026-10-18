import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateAmount',
  standalone: true,
})
export class CalculateAmountPipe implements PipeTransform {
  public transform(value: number | null, quantity: number | null): string {
    if (value === null) {
      return '';
    }
    const calculatedAmount = value * (quantity ?? 1);

    if (calculatedAmount % 1 === 0) {
      return calculatedAmount.toFixed(0);
    }

    return calculatedAmount.toFixed(2);
  }
}
