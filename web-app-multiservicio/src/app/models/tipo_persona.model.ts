import { Empresa } from "./empresa.model"

// route: /
export interface TipoPersona {
  idTipoPersona: number,
  tipo: string,
  idEmpresa: number | null
}
// route: /relaciones && /:idTipoPersona
export interface TipoPersonaRelaciones extends Omit<TipoPersona, 'idEmpresa'> {
  Empresa: Empresa | null
}

export interface CreateTipoPersonaDTO extends Omit<TipoPersona, 'idTipoPersona' | 'idEmpresa'> {
  idEmpresa: number
}

export interface UpdateTipoPersonaDTO extends Partial<CreateTipoPersonaDTO> { }
