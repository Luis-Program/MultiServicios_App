import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterReplacement',
  pure: false
})
export class FilterReplacementPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const rol = localStorage.getItem("rol");
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (rol && rol === "Gerente General") {
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.Tipo_Repuesto.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || String(object.cantidadDisponible).indexOf(arg) > -1
          || String(object.limiteInferior).indexOf(arg) > -1) {
          resultFilter.push(object);
        }
      } else {
        if (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || String(object.cantidadDisponible).indexOf(arg) > -1
          || object.Tipo_Repuesto.tipo.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
          resultFilter.push(object);
        }
      }
    }
    return resultFilter;
  }

}
