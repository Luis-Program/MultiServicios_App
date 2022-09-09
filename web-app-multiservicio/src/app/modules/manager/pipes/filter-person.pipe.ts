import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPerson',
  pure: false
})
export class FilterPersonPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.replace(/ /g, "").trim();
    for (const object of value) {
      if ((object.nombre + object.apellidos).replace(/ /g, "").toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.dpi.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.correo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
