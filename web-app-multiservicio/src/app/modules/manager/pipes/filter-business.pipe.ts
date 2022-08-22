import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBusiness'
})
export class FilterBusinessPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
