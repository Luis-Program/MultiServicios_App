const Joi = require('joi');

const idAnalisisRepuesto = Joi.number().integer();
const nombreRepuesto = Joi.string();

const getAnalisisRepuestoSchema = Joi.object({
  idAnalisisRepuesto: idAnalisisRepuesto.required(),
});

const getAnalisisRepuestoByName = Joi.object({
  nombreRepuesto: nombreRepuesto.required()
});

module.exports = {
  getAnalisisRepuestoSchema,
  getAnalisisRepuestoByName
}
