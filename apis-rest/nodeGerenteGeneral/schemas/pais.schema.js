const Joi = require('joi');

const idPais = Joi.number().integer();
const nombre = Joi.string();
const codigo = Joi.number();

const createPaisSchema = Joi.object({
  nombre: nombre.required(),
  codigo: codigo.required(),
});

const updatePaisSchema = Joi.object({
  nombre: nombre,
  codigo: codigo,
});

const getPaisSchema = Joi.object({
  idPais: idPais.required(),
});

module.exports = { createPaisSchema, updatePaisSchema, getPaisSchema }
