const Joi = require('joi');

const idPersona = Joi.number().integer();
const idServicio = Joi.number().integer();
const fechaHoraRealizar = Joi.date().allow(null);
const fechaCreado = Joi.date().allow(null);
const fechaFinalizado = Joi.date().allow(null);
const estado = Joi.string().allow(null);
const prioridad = Joi.string().max(20);
const fechaHoraAsignadoTrabajador = Joi.date().allow(null);
const idTipoServicio = Joi.number().integer();
const idEquipo = Joi.number().integer();
const idTrabajador = Joi.number().integer().allow(null);

const createServicioSchema = Joi.object({
  fechaHoraRealizar,
  fechaCreado: fechaCreado,
  fechaFinalizado: fechaFinalizado,
  estado: estado,
  prioridad: prioridad.required(),
  fechaHoraAsignadoTrabajador,
  idTipoServicio: idTipoServicio.required(),
  idEquipo: idEquipo.required(),
  idTrabajador
});

const getAllServicioSchema = Joi.object({
  idEquipo: idEquipo.required(),
});

const getAllServicioSchemaByIdPerson = Joi.object({
  idPersona: idPersona.required(),
});

const getServicioSchema = Joi.object({
  idServicio: idServicio.required(),
});

const paramIdEquipoSchema = Joi.object({
  idEquipo: idEquipo.required(),
});

module.exports = {
  getAllServicioSchema,
  getServicioSchema,
  createServicioSchema,
  paramIdEquipoSchema,
  getAllServicioSchemaByIdPerson
}
