import { Persona } from "./persona.model"
import { TipoTelefono } from "./tipo_telefono.model"

// route: / && /:idTelefono
export interface Telefono {
  idTelefono: number,
  numero: number,
  idPersona: number,
  idTipoTelefono: number | null
}

export interface TelefonoRelacionTipoTelefono extends Telefono {
  Tipo_Telefono: TipoTelefono | null
}

export interface TelefonoRelaciones extends Omit<Telefono, 'idPersona' | 'idTipoTelefono'> {
  Persona: Persona,
  Tipo_Telefono: TipoTelefono | null
}

export interface CreateTelefonoDTO extends Omit<Telefono, 'idTelefono' | 'idTipoTelefono'> {
  idTipoTelefono: number
}

export interface UpdateTelefonoDTO extends Partial<CreateTelefonoDTO> { }
