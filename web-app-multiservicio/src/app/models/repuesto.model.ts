import { TipoRepuesto } from "./tipo_repuesto.model";
// route: / && /:idRepuesto
export interface Repuesto {
  idRepuesto: number,
  nombre: string,
  cantidadDisponible: number,
  limiteInferior: number,
  idTipoRepuesto: number | null,
}

export interface RepuestoRelaciones extends Omit<Repuesto, 'idTipoRepuesto'> {
  Tipo_Repuesto: TipoRepuesto | null,
}

export interface CreateRepuestoDTO extends Omit<Repuesto, 'idRepuesto' | 'idTipoRepuesto'> {
  idTipoRepuesto: number
}

export interface UpdateRepuestoDTO extends Partial<CreateRepuestoDTO> { }
