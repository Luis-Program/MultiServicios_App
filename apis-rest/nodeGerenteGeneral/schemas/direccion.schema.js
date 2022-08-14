const Joi = require('joi');

const idDireccion = Joi.number().integer();
const Direccion = Joi.string();
const idMunicipio = Joi.number().integer();

const createDireccionSchema = Joi.object({
  Direccion: Direccion.required(),
  idMunicipio: idMunicipio.required(),
});

const updateDireccionSchema = Joi.object({
  Direccion: Direccion,
  idMunicipio,
});

const getDireccionSchema = Joi.object({
  idDireccion: idDireccion.required(),
});

module.exports = { createDireccionSchema, updateDireccionSchema, getDireccionSchema }
