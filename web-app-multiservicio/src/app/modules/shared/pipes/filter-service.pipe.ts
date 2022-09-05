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
    // console.log(arg);
    for (const object of value) {
      switch (rol) {
        case 'Trabajador Operacional':
          if (object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
            resultFilter.push(object);
          }
        break;
        case 'Gerente General':
          if (object.Equipo.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
          || (object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
          || (object.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1)
          || String(formatDate(object.fechaCreado, 'medium', 'en')).toLowerCase().indexOf(arg) > -1
          || (object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)
          || (object.fechaHoraRealizar && String(formatDate(object.fechaHoraRealizar, 'medium', 'en')).toLowerCase().indexOf(arg) > -1)
          || (object.fechaFinalizado && String(formatDate(object.fechaFinalizado, 'medium', 'en')).toLowerCase().indexOf(arg) > -1)
            // object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
            // || (object.Equipo.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            // || (object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
            // || (object.fechaHoraRealizar && String(object.fechaHoraRealizar).replace("T", " ").indexOf(arg))
            // || (object.fechaFinalizado && String(object.fechaFinalizado).replace("T", " ").indexOf(arg) > -1)
            // || (object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)
            // (object.fechaFinalizado && String(formatDate(object.fechaFinalizado, 'medium', 'en')).toLowerCase().indexOf(arg) > -1)
            ) {
            resultFilter.push(object);
          }
        break;
        default:
          resultFilter.push(object);
          break;
      }

      // if (object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
      //   || (rol === 'Trabajador Operacional' && object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      //   || (rol === 'Gerente General' && object.Equipo.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      //   || (rol === 'Trabajador Operacional' && object.tipoServicio && object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      //   || (rol === 'Gerente General' && object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
      //   || (object.fechaHoraRealizar && String(object.fechaHoraRealizar).replace("T", " ").indexOf(arg))
      //   || (object.fechaFinalizado && String(object.fechaFinalizado).replace("T", " ").indexOf(arg) > -1)
      //   || (rol === 'Gerente General' && object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)) {
      //   resultFilter.push(object);
      // }
    }
    return resultFilter;
  }

}
