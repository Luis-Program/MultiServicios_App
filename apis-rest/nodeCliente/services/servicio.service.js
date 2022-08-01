const boom = require('@hapi/boom');
const {
  QueryTypes,
  Op
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');

class ServicioService {

  constructor() {}

  async create(data) {
    const newServicio = await models.Servicio.create(data);
    const resp = this.findOne(newServicio.idServicio)
    return resp;
  }

  async findAll(idPersona) {
    // Query to obtain by idPersona
    const response = await models.Persona.sequelize.query(`SELECT s.* FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona) INNER JOIN MultiServicios.Servicio s
      ON e.idEquipo = s.idEquipo WHERE p.idPersona = ${idPersona}`, {
      type: QueryTypes.SELECT
    });
    return response;
  }

  async find(idEquipo) {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Equipo', 'Trabajador'],
      where: {
        idEquipo: idEquipo
      }
    });
    return servicios;
  }

  async findCompleted(idEquipo) {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Equipo', 'Trabajador'],
      where: {
        idEquipo: idEquipo,
        fechaFinalizado: {
          [Op.ne]: null
        }
      }
    });
    return servicios;
  }

  async findNotCompleted(idEquipo) {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Equipo', 'Trabajador'],
      where: {
        idEquipo: idEquipo,
        fechaFinalizado: {
          [Op.is]: null
        }
      }
    });
    return servicios;
  }

  async findOne(idServicio) {
    const servicio = await models.Servicio.findByPk(idServicio, {
      include: ['Tipo_Servicio', 'Equipo', 'Trabajador'],
    });
    if (!servicio) {
      throw boom.notFound('Servicio no encontrado...');
    }
    return servicio;
  }

  async findOneDelete(idServicio) {
    const servicio = await models.Servicio.findByPk(idServicio);
    if (!servicio) {
      throw boom.notFound('Servicio no encontrado...');
    }
    return servicio;
  }

  async delete(idServicio) {
    const servicio = await this.findOneDelete(idServicio);
    await servicio.destroy();
    return {
      idServicio
    };
  }


}

module.exports = ServicioService;
