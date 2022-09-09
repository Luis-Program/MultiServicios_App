import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBusiness',
  pure: false
})
export class FilterBusinessPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || (object.nit && object.nit.toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
