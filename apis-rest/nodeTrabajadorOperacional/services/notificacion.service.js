const boom = require('@hapi/boom');
const {
  models
} = require('../libs/sequelize');
const {
  QueryTypes
} = require('sequelize');

class NotificacionService {

  constructor() {}

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

  async findOne(idNotificacion) {
    const notificacion = await models.Notificacion.findByPk(idNotificacion, {
      include: ['Tipo_Notificacion']
    });
    if (!notificacion) {
      throw boom.notFound('Notificacion no encontrado...');
    }
    return notificacion;
  }

  async findOneUpdate(idNotificacion) {
    const notificacion = await models.Notificacion.findByPk(idNotificacion);
    if (!notificacion) {
      throw boom.notFound('Notificacion no encontrado...');
    }
    return notificacion;
  }

  async update(idNotificacion, changes) {
    const notificacion = await this.findOneUpdate(idNotificacion);
    const response = await notificacion.update(changes);
    return response;
  }

  async deleteAllNotifications(idPersona) {
    await models.Notificacion.sequelize.query(`DELETE FROM MultiServicios.Notificacion
    WHERE idPersona = ${idPersona}`, {
      type: QueryTypes.DELETE
    });
    return true;
  }

  async delete(idNotificacion) {
    const notificacion = await this.findOneUpdate(idNotificacion);
    await notificacion.destroy();
    return {
      idNotificacion
    };
  }

}

module.exports = NotificacionService;
