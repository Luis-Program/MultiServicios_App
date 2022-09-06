import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterService',
  pure: false
})
export class FilterServicePipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    const rol = localStorage.getItem("rol");
    arg = arg.trim();
    for (const object of value) {
      switch (rol) {
        case 'Trabajador Operacional':
          if (object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
            || (object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (String(formatDate(object.fechaCreado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (object.fechaHoraRealizar && String(formatDate(object.fechaHoraRealizar, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (object.fechaFinalizado && String(formatDate(object.fechaFinalizado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
            resultFilter.push(object);
          }
          break;
        case 'Gerente General':
          if (object.Equipo.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
            || (object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (object.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || String(formatDate(object.fechaCreado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1
            || (object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)
            || (object.fechaHoraRealizar && String(formatDate(object.fechaHoraRealizar, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (object.fechaFinalizado && String(formatDate(object.fechaFinalizado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
            resultFilter.push(object);
          }
          break;
        case 'Cliente':
          if (object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
            || (object.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || String(formatDate(object.fechaCreado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1
            || (object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)
            || (object.fechaHoraRealizar && String(formatDate(object.fechaHoraRealizar, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)
            || (object.fechaFinalizado && String(formatDate(object.fechaFinalizado, 'medium', 'es')).toLowerCase().indexOf(arg.toLowerCase()) > -1)) {
            resultFilter.push(object);
          }
          break;
        default:
          resultFilter.push(object);
          break;
      }
    }
    return resultFilter;
  }

}
