const Joi = require('joi');

const idTipoNotificacion = Joi.number().integer();
const tipoNotificacion = Joi.string().max(45);

const createTipo_NotificacionSchema = Joi.object({
  tipoNotificacion: tipoNotificacion.required(),
});

const updateTipo_NotificacionSchema = Joi.object({
  tipoNotificacion: tipoNotificacion,
});

const getTipo_NotificacionSchema = Joi.object({
  idTipoNotificacion: idTipoNotificacion.required(),
});

module.exports = {
  createTipo_NotificacionSchema,
  updateTipo_NotificacionSchema,
  getTipo_NotificacionSchema
}
