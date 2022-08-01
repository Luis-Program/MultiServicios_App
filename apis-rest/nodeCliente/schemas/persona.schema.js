const Joi = require('joi');

const idPersona = Joi.number().integer();
const nombre = Joi.string();
const apellidos = Joi.string();
const correo = Joi.string();
const dpi = Joi.string();
const idTipoPersona = Joi.number().integer().min(1);

const getPersonaSchema = Joi.object({
  idPersona: idPersona.required(),
});

const getPersonaBySchema = Joi.object({
  correo: correo.required(),
});

const updatePersonaSchema = Joi.object({
  nombre: nombre,
  apellidos: apellidos,
  correo: correo,
  dpi: dpi,
  idTipoPersona: idTipoPersona,
});

module.exports = {
  getPersonaSchema,
  getPersonaBySchema,
  updatePersonaSchema
}
