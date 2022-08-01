const Joi = require('joi');

const idNotificacion = Joi.number().integer();
const textoNotificacion = Joi.string().max(1000);
const notificacionId = Joi.number().integer();
const visto = Joi.boolean();
const idPersona = Joi.number().integer();
const idTipoNotificacion = Joi.number().integer();

const updateNotificacionSchema = Joi.object({
  textoNotificacion,
  notificacionId,
  visto: visto,
  idPersona,
  idTipoNotificacion,
});

const getNotificacionSchema = Joi.object({
  idNotificacion: idNotificacion.required(),
});

const getAllNotificacionSchema = Joi.object({
  idPersona: idPersona.required(),
});


module.exports = {
  updateNotificacionSchema,
  getNotificacionSchema,
  getAllNotificacionSchema
}
