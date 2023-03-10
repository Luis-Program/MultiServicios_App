const Joi = require('joi');

const idServicio = Joi.number().integer();
const fechaFinalizado = Joi.date();
const idTrabajador = Joi.number().integer();
const observaciones = Joi.string().max(500);

const updateServicioSchema = Joi.object({
  fechaFinalizado: fechaFinalizado,
  observaciones : observaciones.required()
});

const getAllServicioSchema = Joi.object({
  idTrabajador: idTrabajador.required(),
});

const getServicioSchema = Joi.object({
  idServicio: idServicio.required(),
});

const paramIdTrabajadorSchema = Joi.object({
  idTrabajador: idTrabajador.required(),
});

module.exports = {
  getAllServicioSchema,
  getServicioSchema,
  updateServicioSchema,
  paramIdTrabajadorSchema
}
