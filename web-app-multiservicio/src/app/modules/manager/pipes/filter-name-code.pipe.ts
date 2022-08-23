import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNameCode'
})
export class FilterNameCodePipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || String(object.codigo).indexOf(arg) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
