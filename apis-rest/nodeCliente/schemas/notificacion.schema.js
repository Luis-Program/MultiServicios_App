const Joi = require('joi');

const idNotificacion = Joi.number().integer();
const visto = Joi.boolean();
const idPersona = Joi.number().integer();

const updateNotificacionSchema = Joi.object({
  visto: visto,
});

const getNotificacionSchema = Joi.object({
  idNotificacion: idNotificacion.required(),
});

const getAllNotificacionSchema = Joi.object({
  idPersona: idPersona.required(),
});


module.exports = { updateNotificacionSchema, getNotificacionSchema, getAllNotificacionSchema }
