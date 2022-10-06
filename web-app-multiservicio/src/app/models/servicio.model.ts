import { EquipoRelacionesAnidadas } from "./equipo.model"
import { Persona } from "./persona.model"
import { TipoServicio } from "./tipo_servicio.model"

// route: / && /:idServicio
export interface Servicio {
  idServicio: number,
  fechaHoraRealizar: Date | null,
  fechaCreado: Date | null,
  fechaFinalizado: Date | null,
  estado: string | null,
  prioridad: string,
  observaciones: string | null,
  fechaHoraAsignadoTrabajador: Date | null,
  idTipoServicio: number | null,
  idEquipo: number,
  idTrabajador: number | null
}

export interface ServicioCliente extends Servicio {
  Tipo_Servicio: TipoServicio,
  Trabajador: Persona
}

export interface ServiciosFinalizadosPendientesTrabajador {
  finalizados: number,
  pendientes: number
}

export interface ServicioGraficaClientes {
  pendientes: number,
  finalizados: number
}

export interface ServiciosCantidad {
  serviciosCompletados: number,
  cantidadServicios: number,
  serviciosAsignados: number
}

export interface ServiciosCantidadPorTipoServicio {
  preventivo: number,
  correctivo: number
}

export interface ServiciosCantidadCompAsigSinAsignar extends ServiciosCantidad {
  serviciosPendientes: number,
  serviciosSinAsignar: number
}

export interface ServicioRelaciones extends Omit<Servicio, 'idTipoServicio' | 'idEquipo' | 'idTrabajador'> {
  Tipo_Servicio: TipoServicio | null,
  Equipo: EquipoRelacionesAnidadas,
  Trabajador: Persona | null
}

export interface ServicioTrabajador extends Servicio {
  nombre: string,
  modelo: string,
  idDireccion: number | null,
  idPersona: number,
  tipoServicio: string
}

export interface CreateServicioDTO extends Omit<Servicio, 'idServicio' | 'idTipoServicio'> {
  idTipoServicio: number
}

export interface UpdateServicioDTO extends Partial<CreateServicioDTO> { }
