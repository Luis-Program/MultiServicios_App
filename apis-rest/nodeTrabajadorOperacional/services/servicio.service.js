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
    const servicios = await models.Servicio.findAll({
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
        idTrabajador: idTrabajador,
        fechaFinalizado: {
          [Op.ne]: null
        }
      }
    });
    return servicios;
  }

  async findNotCompleted(idTrabajador) {
    const servicios = await models.Servicio.findAll({
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
        idTrabajador: idTrabajador,
        fechaFinalizado: {
          [Op.is]: null
        }
      }
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
    const response = await servicio.update(changes);
    return response;
  }

}

module.exports = ServicioService;
