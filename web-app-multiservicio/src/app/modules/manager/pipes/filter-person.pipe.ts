import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPerson'
})
export class FilterPersonPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.apellidos.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.dpi.indexOf(arg) > -1
        || object.correo.indexOf(arg) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
