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

// Login
export interface PersonaRelacionesLogin extends Omit<Persona, 'idTipoPersona'> {
  Tipo_Persona : TipoPersonaRelaciones
}

// route: /correo/:correo && / API Trabajador
export interface PersonaRelaciones extends Persona {
  tipo: string | null,
  idEmpresa: number | null
  nombreEmpresa: string | null
  cantidad: number
}
// route: //:idPersona
export interface PersonaUna extends Omit<Persona, 'idTipoPersona'> {
  Tipo_Persona: TipoPersona | null
  Telefono: Telefono[],
  Notificacion: Notificacion[]
}

export interface Trabajadores extends Persona {
  tipo: string | null,
  idEmpresa: number | null
  nombreEmpresa: string | null
  cantidad: number
}

export interface TrabajadoresDropDown {
  idPersona: number,
  nombre: string
}

export interface TrabajadoresMinMaxServicios extends Persona{
  cantidad: number
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

