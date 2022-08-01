const Joi = require('joi');

const idTipoServicio = Joi.number().integer();
const tipoServicio = Joi.string().max(100);

const createTipo_ServicioSchema = Joi.object({
  tipoServicio: tipoServicio.required(),
});

const updateTipo_ServicioSchema = Joi.object({
  tipoServicio: tipoServicio,
});

const getTipo_ServicioSchema = Joi.object({
  idTipoServicio: idTipoServicio.required(),
});

module.exports = {
  createTipo_ServicioSchema,
  updateTipo_ServicioSchema,
  getTipo_ServicioSchema
}
