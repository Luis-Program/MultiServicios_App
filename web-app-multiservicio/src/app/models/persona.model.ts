import { Notificacion } from "./notificacion.model"
import { Telefono } from "./telefono.model"
import { TipoPersona, TipoPersonaRelaciones } from "./tipo_persona.model"

export interface Persona {
  idPersona: number,
  nombre: string,
  apellidos: string,
  correo: string,
  dpi: string,
  idTipoPersona: number | null
}

export interface PersonaDropdown {
  idPersona:number,
  nombre: string
}

// route: /correo/:correo && / API Trabajador
export interface PersonaRelaciones extends Omit<Persona, 'idTipoPersona'> {
  Tipo_Persona: TipoPersonaRelaciones | null
}
// route: //:idPersona
export interface PersonaUna extends Omit<Persona, 'idTipoPersona'> {
  Tipo_Persona: TipoPersona | null
  Telefono: Telefono[],
  Notificacion: Notificacion[]
}

export interface Trabajadores extends Persona {
  cantidad: number
}

export interface TrabajadoresDropDown {
  idPersona: number,
  nombre: string
}

export interface TrabajadoresMinMaxServicios {
  cantidadService: number,
  persona: Persona
}

export interface ServiciosFinalizadosPendientes {
  finalizados: number,
  pendientes: number
}

export interface Clientes extends Trabajadores { }

export interface CreatePersonaDTO extends Omit<Persona, 'idPersona' | 'idTipoPersona'> {
  idTipoPersona: number
}

export interface UpdatePersonaDTO extends Partial<CreatePersonaDTO> { }

