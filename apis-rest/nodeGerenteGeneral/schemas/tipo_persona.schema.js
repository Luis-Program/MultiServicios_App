const Joi = require('joi');

const idTipoPersona = Joi.number().integer();
const tipo = Joi.string();
const idEmpresa = Joi.number().integer();

const getTipo_PersonaTipoSchema = Joi.object({
  tipo,
});

const createTipo_PersonaSchema = Joi.object({
  tipo: tipo.required(),
  idEmpresa: idEmpresa.required(),
});

const updateTipo_PersonaSchema = Joi.object({
  tipo: tipo,
  idEmpresa,
});

const getTipo_PersonaSchema = Joi.object({
  idTipoPersona: idTipoPersona.required(),
});

module.exports = {
  createTipo_PersonaSchema,
  updateTipo_PersonaSchema,
  getTipo_PersonaSchema,
  getTipo_PersonaTipoSchema
}
