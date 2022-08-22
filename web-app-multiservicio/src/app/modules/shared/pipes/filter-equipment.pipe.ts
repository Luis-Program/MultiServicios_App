import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEquipment'
})
export class FilterEquipmentPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || object.modelo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
