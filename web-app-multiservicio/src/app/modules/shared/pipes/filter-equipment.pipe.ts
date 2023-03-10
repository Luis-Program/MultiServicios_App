import { Pipe, PipeTransform } from '@angular/core';
import { getRol } from '../local-storage/localStorage';

@Pipe({
  name: 'filterEquipment',
  pure: false
})
export class FilterEquipmentPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const rol = getRol();
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (rol === "Gerente General") {
        const estado = (object.estado ? 'Activo' : 'Inactivo');
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.modelo.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || estado.toLocaleLowerCase().indexOf(arg.toLowerCase()) > -1
          || (object.Persona.nombre + object.Persona.apellidos).replace(/ /g, "").toLowerCase().indexOf(arg.toLowerCase().replace(/ /g, "")) > -1) {
          resultFilter.push(object);
        }
      } else {
        const estado = (object.estado) ? "Activo" : "Inactivo";
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.modelo.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || estado.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          resultFilter.push(object);
        }
      }

    }
    return resultFilter;
  }

}
