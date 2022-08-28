import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAudit'
})
export class FilterAuditPipe implements PipeTransform {

  transform(value: any, arg: string) {
    const resultFilter = [];
    arg = arg.trim();
    for (const object of value) {
      if (String(object.fechaHora).replace("T"," ").indexOf(arg) > -1
        || object.tipoServicio.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.prioridad.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombreEquipo.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombreCliente.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.dpiCliente.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || String(object.fechaHoraCreado).replace("T"," ").indexOf(arg) > -1
        || object.empresaCliente.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.empresaClienteNit.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || String(object.fechaHoraFinalizado).replace("T"," ").indexOf(arg) > -1
        || object.estado.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.nombreTrabajador.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || object.dpiTrabajador.toLowerCase().indexOf(arg.toLowerCase()) > -1
        || String(object.fechaHoraAsignadoTrabajador).replace("T"," ").indexOf(arg) > -1
        || String(object.fechaHoraRealizar).replace("T"," ").indexOf(arg) > -1) {
        resultFilter.push(object);
      }
    }
    return resultFilter;
  }

}
