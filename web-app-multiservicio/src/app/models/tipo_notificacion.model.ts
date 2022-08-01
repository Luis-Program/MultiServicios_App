export interface TipoNotificacion {
  idTipoNotificacion: number,
  tipoNotificacion: string
}

export interface UpdateTipoNotificacionDTO extends Omit<TipoNotificacion, 'idTipoNotificacion'> { }
