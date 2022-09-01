import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterService',
  pure: false
})
export class FilterServicePipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Equipo.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
      if (object.Tipo_Servicio && object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
      if (object.fechaHoraRealizar && String(object.fechaHoraRealizar).replace("T", " ").indexOf(arg) > -1) {
        resultFilter.push(object);
      }
      if (object.fechaFinalizado && String(object.fechaFinalizado).replace("T", " ").indexOf(arg) > -1) {
        resultFilter.push(object);
      }
      if (object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
