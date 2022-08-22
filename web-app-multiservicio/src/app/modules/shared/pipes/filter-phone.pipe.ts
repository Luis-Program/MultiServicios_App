import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPhone'
})
export class FilterPhonePipe implements PipeTransform {

  transform(value: any, arg: any) {
    const rol = localStorage.getItem("rol");
    const resultFilter = [];
    for (const object of value) {
      if (rol && rol === "Gerente General") {
        if (String(object.numero).indexOf(arg) > -1
        || object.Tipo_Telefono.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Tipo_Telefono.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          resultFilter.push(object);
        }
      } else {
        if (String(object.numero).indexOf(arg) > -1
          || object.Tipo_Telefono.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          resultFilter.push(object);
        }
      }
    }
    return resultFilter;
  }

}
