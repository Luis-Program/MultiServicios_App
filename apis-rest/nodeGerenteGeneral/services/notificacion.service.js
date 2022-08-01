const boom = require('@hapi/boom');
const {
  QueryTypes
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');

class NotificacionService {

  constructor() {}

  async create(data) {
    const newNotificacion = await models.Notificacion.create(data);
    return newNotificacion;
  }

  async find(idPersona) {
    const notificaciones = await models.Notificacion.findAll({
      include: ['Tipo_Notificacion'],
      where: {
        idPersona: idPersona
      }
    });
    return notificaciones;
  }

  async updateReadAllNotifications(idPersona) {
    await models.Notificacion.sequelize.query(`UPDATE MultiServicios.Notificacion SET visto = true WHERE idPersona = ${idPersona}`, {
      type: QueryTypes.UPDATE
    });
    return this.find();
  }

  async deleteAllNotifications(idPersona) {
    await models.Notificacion.sequelize.query(`DELETE FROM MultiServicios.Notificacion
    WHERE idPersona = ${idPersona}`, {
      type: QueryTypes.DELETE
    });
    return true;
  }

  async findOne(idNotificacion) {
    const notificacion = await models.Notificacion.findByPk(idNotificacion, {
      include: ['Tipo_Notificacion']
    });
    if (!notificacion) {
      throw boom.notFound('Notificacion no encontrado...');
    }
    return notificacion;
  }

  async update(idNotificacion, changes) {
    const notificacion = await this.findOne(idNotificacion);
    const response = await notificacion.update(changes);
    return response;
  }

  async delete(idNotificacion) {
    const notificacion = await this.findOne(idNotificacion);
    await notificacion.destroy();
    return {
      idNotificacion
    };
  }
  
}

module.exports = NotificacionService;
