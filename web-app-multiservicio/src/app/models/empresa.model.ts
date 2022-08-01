import { TipoPersona } from "./tipo_persona.model"

export interface Empresa {
  idEmpresa: number,
  nombre: string,
  nit: string | null
}

export interface EmpresaRelaciones extends Empresa {
  Tipo_Persona: TipoPersona[]
}

export interface MinMaxEmpresa {
  empresa: string,
  cantidad: number
}

export interface CreateEmpresaDTO extends Omit<Empresa, 'idEmpresa'> { }

export interface UpdateEmpresaDTO extends Partial<CreateEmpresaDTO> { }
