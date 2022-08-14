const Joi = require('joi');

const idEquipo = Joi.number().integer();
const estado = Joi.boolean();
const idPersona = Joi.number().integer();

const queryEquipoSchema = Joi.object({
  idPersona
});

const updateEquipoSchema = Joi.object({
  estado: estado,
});

const getEquipoSchema = Joi.object({
  idEquipo: idEquipo.required(),
});

module.exports = { updateEquipoSchema, getEquipoSchema, queryEquipoSchema }
