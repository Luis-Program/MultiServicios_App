import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterService'
})
export class FilterServicePipe implements PipeTransform {

  transform(value: any, arg: any) {
    const resultFilter = [];
    for (const object of value) {
      if (object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || String(object.fechaCreado).indexOf(arg) > -1
          || String(object.fechaHoraRealizar).indexOf(arg) > -1
          || String(object.fechaFinalizado).indexOf(arg) > -1) {
          resultFilter.push(object);
        }
    }
    return resultFilter;
  }

}
