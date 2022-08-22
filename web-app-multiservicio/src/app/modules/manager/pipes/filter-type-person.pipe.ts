import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTypePerson'
})
export class FilterTypePersonPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Empresa.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
