const Joi = require('joi');

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
  fechaCreado: fechaHoraRealizar,
  fechaFinalizado: fechaFinalizado,
  estado: estado,
  prioridad: prioridad.required(),
  fechaHoraAsignadoTrabajador: fechaHoraAsignadoTrabajador,
  idTipoServicio: idTipoServicio.required(),
  idEquipo: idEquipo.required(),
  idTrabajador: idTrabajador
});

const updateServicioSchema = Joi.object({
  fechaHoraRealizar: fechaHoraRealizar,
  fechaCreado: fechaCreado,
  fechaFinalizado: fechaFinalizado,
  estado: estado,
  prioridad: prioridad,
  fechaHoraAsignadoTrabajador: fechaHoraAsignadoTrabajador,
  idTipoServicio: idTipoServicio,
  idEquipo: idEquipo,
  idTrabajador: idTrabajador
});

const getServicioSchema = Joi.object({
  idServicio: idServicio.required(),
});

module.exports = {
  getServicioSchema,
  updateServicioSchema,
  createServicioSchema,
}
