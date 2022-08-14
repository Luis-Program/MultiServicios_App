const boom = require('@hapi/boom');
const {
  models
} = require('../libs/sequelize');


class Auditoria_ServicioService {

  constructor() {}

  async find() {
    const auditoriaServicios = await models.Auditoria_Servicio.findAll();
    return auditoriaServicios;
  }

  async findOne(idAuditoriaServicio) {
    const auditoriaServicio = await models.Auditoria_Servicio.findByPk(idAuditoriaServicio);
    if (!auditoriaServicio) {
      throw boom.notFound('Auditoria servicio no encontrado...');
    }
    return auditoriaServicio;
  }
}

module.exports = Auditoria_ServicioService;
