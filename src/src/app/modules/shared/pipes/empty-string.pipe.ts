import type { PipeTransform } from '@angular/core';

import { Pipe } from '@angular/core';

@Pipe({
  name: 'emptyString',
})
export class EmptyStringPipe implements PipeTransform {
  public transform(value: string | null): boolean {
    return value === null ? true : value.trim().length === 0;
  }
}
