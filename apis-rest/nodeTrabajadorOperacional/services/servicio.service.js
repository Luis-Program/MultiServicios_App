const boom = require('@hapi/boom');
const {
  QueryTypes,
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class ServicioService {

  constructor() {}

  async find(req) {
    const {
      idTrabajador
    } = req.params;
    const options = {
      include: ['Tipo_Servicio', {
        association: 'Equipo',
        include: [{
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }],
      where: {
        idTrabajador: idTrabajador
      }
    }
    const servicios = await models.Servicio.findAll(options);
    return servicios;
  }

  async findCompleted(idTrabajador) {
    const servicios = await models.Servicio.sequelize.query(`SELECT s.*, e.nombre, e.modelo, e.idDireccion, e.idPersona, t.tipoServicio FROM (MultiServicios.Servicio s
      INNER JOIN MultiServicios.Equipo e
      ON s.idEquipo = e.idEquipo)
      INNER JOIN MultiServicios.Tipo_Servicio t
      ON s.idTipoServicio = t.idTipoServicio
    WHERE s.idTrabajador = ${idTrabajador} AND s.fechaFinalizado IS NOT null`, {
      type: QueryTypes.SELECT
    });
    return servicios;
  }

  async findNotCompleted(idTrabajador) {
    const servicios = await models.Servicio.sequelize.query(`SELECT s.*, e.nombre, e.modelo, e.idDireccion, e.idPersona, t.tipoServicio FROM (MultiServicios.Servicio s
      INNER JOIN MultiServicios.Equipo e
      ON s.idEquipo = e.idEquipo)
      INNER JOIN MultiServicios.Tipo_Servicio t
      ON s.idTipoServicio = t.idTipoServicio
    WHERE s.idTrabajador = ${idTrabajador} AND s.fechaFinalizado IS null`, {
      type: QueryTypes.SELECT
    });
  return servicios;
  }

  async findWorkerServicesAmount(idTrabajador) {
    const response = await models.Servicio.sequelize.query(`SELECT COUNT(s.fechaFinalizado) AS 'finalizados',
    (COUNT(s.fechaCreado)-COUNT(s.fechaFinalizado)) AS 'pendientes' FROM MultiServicios.Persona p INNER JOIN  MultiServicios.Servicio s
    ON p.idPersona = s.idTrabajador WHERE s.idTrabajador = ${idTrabajador}`, {
      type: QueryTypes.SELECT
    });
    return response[0];
  }

  async findOne(idServicio) {
    const servicio = await models.Servicio.findByPk(idServicio, {
      include: ['Tipo_Servicio', {
        association: 'Equipo',
        include: [{
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }]
    });
    if (!servicio) {
      throw boom.notFound('Servicio no encontrado...');
    }
    return servicio;
  }

  async update(idServicio, changes) {
    const servicio = await this.findOne(idServicio);
    const update = await servicio.update(changes);
    const response = await this.findOne(update.idServicio);
    return response;
  }

}

module.exports = ServicioService;
