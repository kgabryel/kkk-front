import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyString'
})
export class EmptyStringPipe implements PipeTransform {

  transform(value: string | null, ...args: unknown[]): boolean {
    return value === null ? true : value.trim().length === 0;
  }
}
