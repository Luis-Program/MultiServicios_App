import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDireccion'
})
export class FilterDireccionPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.direccion.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Municipio.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
