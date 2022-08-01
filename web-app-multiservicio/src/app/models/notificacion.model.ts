import { TipoNotificacion } from "./tipo_notificacion.model";

export interface Notificacion {
  idNotificacion: number,
  textoNotificacion: string,
  notificacionId: number,
  visto: boolean,
  idPersona: number,
  idTipoNotificacion: number,
  Tipo_Notificacion: TipoNotificacion
}

export interface UpdateNotificacionDTO extends Partial<Notificacion> { }

