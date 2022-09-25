const Joi = require('joi');

const idDireccion = Joi.number().integer();
const direccion = Joi.string();
const idMunicipio = Joi.number().integer();

const createDireccionSchema = Joi.object({
  direccion: direccion.required(),
  idMunicipio: idMunicipio.required(),
});

const updateDireccionSchema = Joi.object({
  direccion: direccion,
  idMunicipio,
});

const getDireccionSchema = Joi.object({
  idDireccion: idDireccion.required(),
});

module.exports = { createDireccionSchema, updateDireccionSchema, getDireccionSchema }
