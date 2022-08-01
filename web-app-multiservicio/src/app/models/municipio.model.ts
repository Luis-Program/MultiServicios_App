import { Departamento, DepartamentoRelaciones } from "./departamento.model";

// route: /
export interface Municipio {
  idMunicipio: number,
  nombre: string,
  codigo: number,
  idDepartamento: number | null
}
// route: /relaciones && /:idMunicipio
export interface MunicipioRelaciones extends Omit<Municipio, 'idDepartamento'> {
  Departamento: Departamento | null
}

export interface MunicipioRelacionesAnidadas extends Omit<Municipio, 'idDepartamento'> {
  Departamento: DepartamentoRelaciones | null
}

export interface CreateMunicipioDTO extends Omit<Municipio, 'idMunicipio' | 'idDepartamento'> {
  idDepartamento: number
}

export interface UpdateMunicipioDTO extends Partial<CreateMunicipioDTO> { }

