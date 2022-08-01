export interface TipoRepuesto {
  idTipoRepuesto: number,
  tipo: string
}

export interface CreateTipoRepuestoDTO extends Omit<TipoRepuesto, 'idTipoRepuesto'> { }

export interface UpdateTipoRepuestoDTO extends Partial<CreateTipoRepuestoDTO> { }

