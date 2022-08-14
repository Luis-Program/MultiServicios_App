const Joi = require('joi');

const idTipoRepuesto = Joi.number().integer();
const tipo = Joi.string();

const createTipo_RepuestoSchema = Joi.object({
  tipo: tipo.required(),
});

const updateTipo_RepuestoSchema = Joi.object({
  tipo: tipo,
});

const getTipo_RepuestoSchema = Joi.object({
  idTipoRepuesto: idTipoRepuesto.required(),
});

module.exports = {
  createTipo_RepuestoSchema,
  updateTipo_RepuestoSchema,
  getTipo_RepuestoSchema
}
