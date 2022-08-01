const Joi = require('joi');

const idTelefono = Joi.number().integer();
const numero = Joi.number().min(10000000).max(99999999);
const idPersona = Joi.number().integer();
const idTipoTelefono = Joi.number().integer();

const createTelefonoSchema = Joi.object({
  numero: numero.required(),
  idPersona: idPersona.required(),
  idTipoTelefono: idTipoTelefono.required(),
});

const updateTelefonoSchema = Joi.object({
  numero: numero,
  idPersona: idPersona,
  idTipoTelefono: idTipoTelefono,
});

const getTelefonoSchema = Joi.object({
  idPersona: idPersona.required(),
});

const getTelefonoByIdTelefonoSchema = Joi.object({
  idTelefono: idTelefono.required(),
});

module.exports = {
  createTelefonoSchema,
  updateTelefonoSchema,
  getTelefonoSchema,
  getTelefonoByIdTelefonoSchema
}
