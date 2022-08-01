export interface Pais {
  idPais: number,
  nombre: string,
  codigo: number
}

export interface CreatePaisDTO extends Omit<Pais, 'idPais'> { }

export interface UpdatePaisDTO extends Partial<CreatePaisDTO> { }
