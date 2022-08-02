const Joi = require('joi');

const idNotificacion = Joi.number().integer();
const textoNotificacion = Joi.string().max(1000);
const notificacionId = Joi.number().integer();
const visto = Joi.boolean();
const idPersona = Joi.number().integer();
const idTipoNotificacion = Joi.number().integer();

const createNotificacionSchema = Joi.object({
  textoNotificacion: textoNotificacion.required(),
  notificacionId: notificacionId.required(),
  visto: false,
  idPersona: idPersona.required(),
  idTipoNotificacion: idTipoNotificacion.required(),
});

const updateNotificacionSchema = Joi.object({
  textoNotificacion: textoNotificacion,
  notificacionId: notificacionId,
  visto: visto,
  idPersona: idPersona,
  idTipoNotificacion: idTipoNotificacion,
});

const getNotificacionSchema = Joi.object({
  idNotificacion: idNotificacion.required(),
});

const getNotificacionByIdPersonSchema = Joi.object({
  idPersona: idPersona.required(),
});

module.exports = {
  createNotificacionSchema,
  updateNotificacionSchema,
  getNotificacionSchema,
  getNotificacionByIdPersonSchema
}
