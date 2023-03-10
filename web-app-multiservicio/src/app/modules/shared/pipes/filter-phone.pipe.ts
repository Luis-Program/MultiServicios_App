import { Pipe, PipeTransform } from '@angular/core';
import { getRol } from '../local-storage/localStorage';

@Pipe({
  name: 'filterPhone',
  pure: false
})
export class FilterPhonePipe implements PipeTransform {

  transform(value: any, arg: string) {
    const rol = getRol();
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (rol && rol === "Gerente General") {
        if (String(object.numero).indexOf(arg) > -1
        || (object.Persona.nombre + object.Persona.apellidos).replace(/ /g, "").toLowerCase().indexOf(arg.toLowerCase().replace(/ /g, "")) > -1
        || (object.Tipo_Telefono && object.Tipo_Telefono.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
          resultFilter.push(object);
        }
      } else {
        if (String(object.numero).indexOf(arg) > -1
          || (object.Tipo_Telefono && object.Tipo_Telefono.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
          resultFilter.push(object);
        }
      }
    }
    return resultFilter;
  }

}
