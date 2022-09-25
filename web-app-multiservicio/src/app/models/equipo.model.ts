import { Direccion, DireccionRelacionesAnidadas } from "./direccion.model"
import { Persona } from "./persona.model"
import { ServicioCliente } from "./servicio.model"

export interface Equipo {
  idEquipo: number,
  nombre: string,
  modelo: string,
  estado: boolean,
  fechaUltimoServicio: Date,
  periodoDeServicio: number,
  preventivoActivo: boolean,
  idDireccion: number | null,
  idPersona: number
}

export interface EquipoDropDown {
  idEquipo: number,
  nombre: string
}

export interface EquipoCantidad extends Equipo {
  cantidad: number
}

// route: / && /:idEquipo
export interface EquipoRelaciones extends Omit<Equipo, 'idDireccion' | 'idPersona'> {
  Direccion: Direccion | null,
  Persona: Persona
}

export interface EquipoRelacionesAnidadas extends Omit<Equipo, 'idDireccion' | 'idPersona'> {
  Direccion: DireccionRelacionesAnidadas | null,
  Persona: Persona
}

// API Cliente, route: /
export interface EquipoCliente extends Equipo {
  Direccion: DireccionRelacionesAnidadas | null,
  Servicio: ServicioCliente[]
}

export interface EquipoClienteServicios {
  finalizados: number,
  pendientes: number
}

export interface EquipoActivoInactivo {
  estado: boolean,
  cantidad: number
}

export interface UnEquipoServicios {
  completada: number,
  pendiente: number
}

export interface EquipoMaxMinCliente {
  equipmentMax: EquipoCantidad,
  equipmentMin: EquipoCantidad
}

export interface CreateEquipoDTO extends Omit<Equipo, 'idEquipo' | 'idDireccion'> {
  idDireccion: number
}

export interface UpdateEquipoDTO extends Partial<CreateEquipoDTO> { }
