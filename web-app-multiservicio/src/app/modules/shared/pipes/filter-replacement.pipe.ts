import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterReplacement'
})
export class FilterReplacementPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const rol = localStorage.getItem("rol");
    const resultFilter = [];
    for (const object of value) {
      if (rol && rol === "Gerente General") {
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || String(object.cantidadDisponible).indexOf(arg) > -1
          || String(object.limiteInferior).indexOf(arg) > -1) {
          resultFilter.push(object);
        }
      } else {
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || String(object.cantidadDisponible).indexOf(arg) > -1) {
          resultFilter.push(object);
        }
      }
    }
    return resultFilter;
  }

}
