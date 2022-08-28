import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTypePerson',
  pure: false
})
export class FilterTypePersonPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Empresa.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
