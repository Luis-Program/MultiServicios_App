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

  async findAllGraphic(idPersona) {
    const pendientes = await models.Persona.sequelize.query(`SELECT count(idServicio) as pendientes FROM (MultiServicios.Equipo e
      INNER JOIN MultiServicios.Servicio s
      ON e.idEquipo = s.idEquipo)
      WHERE e.idPersona = ${idPersona} AND s.fechaFinalizado IS NULL`, {
      type: QueryTypes.SELECT
    });
    const finalizados = await models.Persona.sequelize.query(`SELECT count(idServicio) as finalizados FROM (MultiServicios.Equipo e
      INNER JOIN MultiServicios.Servicio s
      ON e.idEquipo = s.idEquipo)
      WHERE e.idPersona = ${idPersona} AND s.fechaFinalizado IS NOT NULL`, {
      type: QueryTypes.SELECT
    });
    return {pendientes: pendientes[0].pendientes, finalizados : finalizados[0].finalizados};
  }

  async findOneGraphic(idEquipo) {
    const finalizados = await models.Persona.sequelize.query(`SELECT count(idServicio) AS finalizados FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s
    ON e.idEquipo = s.idEquipo
    WHERE e.idEquipo = ${idEquipo} AND s.fechaFinalizado IS NOT NULL`, {
      type: QueryTypes.SELECT
    });
    const pendientes = await models.Persona.sequelize.query(`SELECT count(idServicio) AS pendientes FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s
    ON e.idEquipo = s.idEquipo
    WHERE e.idEquipo = ${idEquipo} AND s.fechaFinalizado IS NULL`, {
      type: QueryTypes.SELECT
    });
    return {pendientes: pendientes[0].pendientes, finalizados : finalizados[0].finalizados};
  }

  async findCompleted(idEquipo) {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Trabajador'],
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
      include: ['Tipo_Servicio', 'Trabajador'],
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
      include: ['Tipo_Servicio','Trabajador','Equipo'],
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
