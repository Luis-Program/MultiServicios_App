const Joi = require('joi');

const idEmpresa = Joi.number().integer();
const nombre = Joi.string();
const nit = Joi.string();

const createEmpresaSchema = Joi.object({
  nombre: nombre.required(),
  nit: nit.required(),
});

const updateEmpresaSchema = Joi.object({
  nombre: nombre,
  nit: nit,
});

const getEmpresaSchema = Joi.object({
  idEmpresa: idEmpresa.required(),
});

module.exports = { createEmpresaSchema, updateEmpresaSchema, getEmpresaSchema }
