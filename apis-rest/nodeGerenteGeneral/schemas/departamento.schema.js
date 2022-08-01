const Joi = require('joi');

const idDepartamento = Joi.number().integer();
const nombre = Joi.string();
const codigo = Joi.number().integer();
const idPais = Joi.number().integer();

const createDepartamentoSchema = Joi.object({
  nombre: nombre.required(),
  codigo: codigo.required(),
  idPais: idPais.required(),
});

const updateDepartamentoSchema = Joi.object({
  nombre: nombre,
  codigo: codigo,
  idPais,
});

const getDepartamentoSchema = Joi.object({
  idDepartamento: idDepartamento.required(),
});

module.exports = { createDepartamentoSchema, updateDepartamentoSchema, getDepartamentoSchema }
