import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterService'
})
export class FilterServicePipe implements PipeTransform {

  transform(value: any, arg: string) {
    const rol = localStorage.getItem("rol");
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.Tipo_Servicio.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || String(object.fechaCreado).replace("T", " ").indexOf(arg) > -1
        || String(object.fechaHoraRealizar).replace("T", " ").indexOf(arg) > -1
        || String(object.fechaFinalizado).replace("T", " ").indexOf(arg) > -1
        || (rol === "Gerente General" && String(object.fechaHoraAsignadoTrabajador).replace("T", " ").indexOf(arg) > -1)) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
