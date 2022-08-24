import { Municipio, MunicipioRelacionesAnidadas } from "./municipio.model";

// route: /
export interface Direccion {
  idDireccion: number,
  direccion: string,
  idMunicipio: number | null
}
export interface DireccionDropDown{
  idDireccion: number,
  direccion: string,
}

// route: /relaciones && /:idDireccion
export interface DireccionRelaciones extends Omit<Direccion, 'idMunicipio'> {
  Municipio: Municipio | null
}

export interface DireccionRelacionesAnidadas extends Omit<Direccion, 'idMunicipio'> {
  Municipio: MunicipioRelacionesAnidadas | null
}

export interface CreateDireccionDTO extends Omit<Direccion, 'idDireccion' | 'idMunicipio'> {
  idMunicipio: number
}

export interface UpdateDireccionDTO extends Partial<CreateDireccionDTO> { }
