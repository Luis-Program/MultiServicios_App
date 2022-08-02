const Joi = require('joi');

const idEquipo = Joi.number().integer();
const nombre = Joi.string().max(150);
const modelo = Joi.string().max(100);
const estado = Joi.boolean();
const fechaUltimoServicio = Joi.date();
const periodoDeServicio = Joi.number().integer();
const preventivoActivo = Joi.boolean();
const idDireccion = Joi.number().integer();
const idPersona = Joi.number().integer();

const createEquipoSchema = Joi.object({
  nombre: nombre.required(),
  modelo: modelo,
  estado: estado.required(),
  fechaUltimoServicio: fechaUltimoServicio.required(),
  periodoDeServicio: periodoDeServicio.required(),
  preventivoActivo: preventivoActivo.required(),
  idDireccion: idDireccion.required(),
  idPersona: idPersona.required(),
});

const updateEquipoSchema = Joi.object({
  nombre: nombre,
  modelo: modelo,
  estado: estado,
  fechaUltimoServicio: fechaUltimoServicio,
  periodoDeServicio: periodoDeServicio,
  preventivoActivo: preventivoActivo,
  idDireccion: idDireccion,
  idPersona: idPersona,
});

const getEquipoSchema = Joi.object({
  idEquipo: idEquipo.required(),
});

module.exports = { createEquipoSchema, updateEquipoSchema, getEquipoSchema }
