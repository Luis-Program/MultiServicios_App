const Joi = require('joi');

const idMunicipio = Joi.number().integer();
const nombre = Joi.string();
const codigo = Joi.number().integer();
const idDepartamento = Joi.number().integer();

const createMunicipioSchema = Joi.object({
  nombre: nombre.required(),
  codigo: codigo.required(),
  idDepartamento: idDepartamento.required(),
});

const updateMunicipioSchema = Joi.object({
  nombre: nombre,
  codigo: codigo,
  idDepartamento,
});

const getMunicipioSchema = Joi.object({
  idMunicipio: idMunicipio.required(),
});

module.exports = { createMunicipioSchema, updateMunicipioSchema, getMunicipioSchema }
