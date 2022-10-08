import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAudit'
})
export class FilterAuditPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombreEquipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombreCliente.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || String(formatDate(object.fechaHoraCreado, 'medium', 'es')).toLowerCase().indexOf(arg) > -1
        || (object.nombreTrabajador && object.nombreTrabajador.toLowerCase().indexOf(arg.toLowerCase()) > -1)
        || object.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resultFilter.push(object);
      }
    }
    // for (const object of value) {
    //   console.log(object['title'])
    //   if (object['title'].toLowerCase().indexOf(arg.toLowerCase()) > -1) {
    //     resultFilter.push(object);
    //   }
    // }
    return resultFilter;
  }

}
