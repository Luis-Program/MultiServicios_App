const Joi = require('joi');

const idRepuesto = Joi.number().integer();
const nombre = Joi.string();
const cantidadDisponible = Joi.number().integer();
const limiteInferior = Joi.number().integer();
const idTipoRepuesto = Joi.number().integer();

const createRepuestoSchema = Joi.object({
  nombre: nombre.required(),
  cantidadDisponible: cantidadDisponible.required(),
  limiteInferior: limiteInferior.required(),
  idTipoRepuesto: idTipoRepuesto.required()
});

const updateRepuestoSchema = Joi.object({
  nombre: nombre,
  cantidadDisponible: cantidadDisponible,
  limiteInferior: limiteInferior,
  idTipoRepuesto: idTipoRepuesto
});

const getRepuestoSchema = Joi.object({
  idRepuesto: idRepuesto.required(),
});

module.exports = {
  createRepuestoSchema,
  getRepuestoSchema,
  updateRepuestoSchema
}
