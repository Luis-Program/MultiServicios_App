const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class Tipo_NotificacionService {

  constructor(){
  }

  async create(data) {
    const newTipoNotificacion = await models.Tipo_Notificacion.create(data);
    return newTipoNotificacion;
  }

  async find() {
    const tiposNotificaciones = await models.Tipo_Notificacion.findAll();
    return tiposNotificaciones;
  }

  async findOne(idTipoNotificacion) {
    const tipoNotificacion = await models.Tipo_Notificacion.findByPk(idTipoNotificacion);
    if (!tipoNotificacion) {
      throw boom.notFound('Tipo de notificacion no encontrado...');
    }
    return tipoNotificacion;
  }

  async update(idTipoNotificacion, changes) {
    const tipoNotificacion = await this.findOne(idTipoNotificacion);
    const response = await tipoNotificacion.update(changes);
    return response;
  }

  async delete(idTipoNotificacion) {
    const tipoNotificacion = await this.findOne(idTipoNotificacion);
    await tipoNotificacion.destroy();
    return { idTipoNotificacion };
  }

}

module.exports = Tipo_NotificacionService;
