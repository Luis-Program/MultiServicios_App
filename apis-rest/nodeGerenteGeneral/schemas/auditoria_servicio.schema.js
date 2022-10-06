const Joi = require('joi');

const idAuditoriaServicio = Joi.number().integer();

const getAuditoria_ServicioSchema = Joi.object({
  idAuditoriaServicio: idAuditoriaServicio.required(),
});

module.exports = { getAuditoria_ServicioSchema }
