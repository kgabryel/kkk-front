import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyString',
  standalone: true,
})
export class EmptyStringPipe implements PipeTransform {
  public transform(value: string | null): boolean {
    return value === null ? true : value.trim().length === 0;
  }
}
