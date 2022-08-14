export interface Analisis_Repuesto {
  idAnalisisRepuesto: number,
  nombreRepuesto: string,
  nombreTipo: string,
  cantidadAntes: number,
  cantidadDespues: number,
  diferenciaCantidades: number,
  fechaHora: Date,
  tipoAccion: string
}

export interface Graphics {
  amount: number,
  timedate: Date
}
