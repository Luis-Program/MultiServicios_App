const Joi = require('joi');

const idPersona = Joi.number().integer();
const nombre = Joi.string();
const apellidos = Joi.string();
const correo = Joi.string();
const dpi = Joi.string();
const idTipoPersona = Joi.number().integer().min(1);
const idTrabajador = Joi.number().integer();

const getPersonaBySchema = Joi.object({
  correo: correo.required(),
});

const createPersonaSchema = Joi.object({
  nombre: nombre.required(),
  apellidos: apellidos.required(),
  correo: correo.required(),
  dpi: dpi.required(),
  idTipoPersona: idTipoPersona.required(),
});

const updatePersonaSchema = Joi.object({
  nombre: nombre,
  apellidos: apellidos,
  correo: correo,
  dpi: dpi,
  idTipoPersona: idTipoPersona,
});

const getPersonaSchema = Joi.object({
  idPersona: idPersona.required(),
});

const getTrabajadorServiciosSchema = Joi.object({
  idTrabajador: idTrabajador.required(),
});
module.exports = {
  getPersonaBySchema,
  createPersonaSchema,
  updatePersonaSchema,
  getPersonaSchema,
  getTrabajadorServiciosSchema
}
