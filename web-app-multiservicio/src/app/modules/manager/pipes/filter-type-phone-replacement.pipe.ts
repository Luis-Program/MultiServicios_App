import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTypePhoneReplacement',
  pure: false
})
export class FilterTypePhoneReplacementPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }
}
