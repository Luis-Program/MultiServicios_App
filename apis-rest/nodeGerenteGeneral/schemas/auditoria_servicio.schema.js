const Joi = require('joi');

const idAuditoriaServicio = Joi.number().integer();

// const limit = Joi.number().integer();
// const offset = Joi.number().integer();

// const queryAuditoria_ServicioSchema = Joi.object({
//   limit,
//   offset,
// });

const getAuditoria_ServicioSchema = Joi.object({
  idAuditoriaServicio: idAuditoriaServicio.required(),
});

module.exports = { getAuditoria_ServicioSchema }
