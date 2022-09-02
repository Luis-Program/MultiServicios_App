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
      if (object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || (object.tipoServicio && object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1)
        || (object.fechaHoraRealizar && String(object.fechaHoraRealizar).replace("T", " ").indexOf(arg))
        || (object.fechaFinalizado && String(object.fechaFinalizado).replace("T", " ").indexOf(arg) > -1)
        || (rol === 'Gerente General' && object.Trabajador && String(object.Trabajador.nombre + " " + object.Trabajador.apellidos).toLowerCase().indexOf(arg.toLocaleLowerCase()) > -1)) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
