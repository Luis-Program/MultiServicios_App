const Joi = require('joi');

const idRepuesto = Joi.number().integer();
const cantidadDisponible = Joi.number().integer();

const updateRepuestoSchema = Joi.object({
  cantidadDisponible: cantidadDisponible,
});

const getRepuestoSchema = Joi.object({
  idRepuesto: idRepuesto.required(),
});

module.exports = {
  getRepuestoSchema,
  updateRepuestoSchema
}
