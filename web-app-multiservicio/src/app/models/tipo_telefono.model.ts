// route: / && /:idTipoTelefono
export interface TipoTelefono {
  idTipoTelefono: number,
  tipo: string
}

export interface CreateTipoTelefonoDTO extends Omit<TipoTelefono, 'idTipoTelefono'> { }

export interface UpdateTipoTelefonoDTO extends Partial<CreateTipoTelefonoDTO> { }
