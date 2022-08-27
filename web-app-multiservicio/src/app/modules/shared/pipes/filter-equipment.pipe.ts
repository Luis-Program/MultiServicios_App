import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEquipment'
})
export class FilterEquipmentPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const rol = localStorage.getItem("rol");
    const resultFilter = [];
    for (const object of value) {
      if (rol === "Gerente General") {
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.modelo.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.Persona.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.Persona.apellidos.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          resultFilter.push(object);
        }
      } else {
        const estado = (object.estado) ? "Activado" : "Desactivado";
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
