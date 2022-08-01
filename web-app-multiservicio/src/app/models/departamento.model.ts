import { Pais } from "./pais.model";

export interface Departamento {
  idDepartamento: number,
  nombre: string,
  codigo: number,
  idPais: number | null
}
// route: /relaciones && /:idDepartamento
export interface DepartamentoRelaciones extends Omit<Departamento, 'idPais'> {
  Pais: Pais | null
}

export interface CreateDepartamentoDTO extends Omit<Departamento, 'idDepartamento' | 'idPais'> {
  idPais: number
}

export interface UpdateDepartamentoDTO extends Partial<CreateDepartamentoDTO> { }
