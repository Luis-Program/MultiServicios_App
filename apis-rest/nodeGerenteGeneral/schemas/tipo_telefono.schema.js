const Joi = require('joi');

const idTipoTelefono = Joi.number().integer();
const tipo = Joi.string();

const createTipo_TelefonoSchema = Joi.object({
  tipo: tipo.required(),
});

const updateTipo_TelefonoSchema = Joi.object({
  tipo: tipo,
});

const getTipo_TelefonoSchema = Joi.object({
  idTipoTelefono: idTipoTelefono.required(),
});

module.exports = { createTipo_TelefonoSchema, updateTipo_TelefonoSchema, getTipo_TelefonoSchema }
