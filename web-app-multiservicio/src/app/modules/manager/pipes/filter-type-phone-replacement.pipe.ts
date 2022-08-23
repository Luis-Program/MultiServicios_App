import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTypePhoneReplacement'
})
export class FilterTypePhoneReplacementPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }
}
