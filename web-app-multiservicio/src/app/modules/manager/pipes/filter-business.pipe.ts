import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBusiness'
})
export class FilterBusinessPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nit.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
