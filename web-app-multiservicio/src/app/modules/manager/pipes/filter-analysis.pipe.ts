import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAnalysis'
})
export class FilterAnalysisPipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.nombreRepuesto.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || object.nombreTipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || object.tipoAccion.toLowerCase().indexOf(arg.toLowerCase()) > -1
      || String(object.cantidadAntes).indexOf(arg) > -1
      || String(object.cantidadDespues).indexOf(arg) > -1
      || String(object.diferenciaCantidades).indexOf(arg) > -1
      || String(object.fechaHora).indexOf(arg) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
