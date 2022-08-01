export interface Auditoria_servicio {
  idAuditoriaServicio: number,
  fechaHora: Date,
  idServicio: number,
  tipoServicio: string,
  prioridad: string,
  nombreEquipo: string,
  nombreCliente: string,
  dpiCliente: string,
  fechaHoraCreado: Date,
  empresaCliente: string,
  empresaClienteNit: string | null,
  fechaHoraFinalizado: Date | null,
  estado: string,
  nombreTrabajador: string | null,
  dpiTrabajador: string | null,
  fechaHoraAsignadoTrabajador: Date | null,
  fechaHoraRealizar: Date | null
}
