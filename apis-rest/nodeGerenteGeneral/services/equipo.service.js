const boom = require('@hapi/boom');
const QueryTypes = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class EquipoService {

  constructor() {}

  async create(data) {
    const newEquipo = await models.Equipo.create(data);
    const resp = this.findOne(newEquipo.idEquipo);
    return resp;
  }

  async find() {
    const equipos = await models.Equipo.findAll({
      include: ['Persona', {
        association: 'Direccion',
        include: [{
          association: 'Municipio',
          include: [{
            association: 'Departamento',
            include: ['Pais']
          }]
        }]
      }]
    });
    return equipos;
  }

  async findAll() {
    const equipos = await models.Equipo.findAll();
    return equipos;
  }

  async findOneCompletedPendent(idEquipo) {
    const servicesCompleted = await models.Equipo.sequelize.query(`SELECT COUNT(*) AS 'cantidadCompletada' FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo WHERE ISNULL (s.fechaFinalizado) AND e.idEquipo = ${idEquipo}
    LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const completada = servicesCompleted[0][0].cantidadCompletada;
    const servicesPening = await models.Equipo.sequelize.query(`SELECT COUNT(*) AS cantidadPendiente FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo WHERE NOT (ISNULL (s.fechaFinalizado)) AND e.idEquipo = ${idEquipo}
    LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const pendiente = servicesPening[0][0].cantidadPendiente;
    return {
      completada,
      pendiente
    };
  }

  async findAllActiveInactive() {
    const response = await models.Equipo.sequelize.query("SELECT estado, COUNT(*) AS 'cantidad' FROM MultiServicios.Equipo GROUP BY estado", {
      type: QueryTypes.SELECT
    });
    return response;
  }

  async findOne(idEquipo) {
    const equipo = await models.Equipo.findByPk(idEquipo, {
      include: ['Persona', {
        association: 'Direccion',
        include: [{
          association: 'Municipio',
          include: [{
            association: 'Departamento',
            include: ['Pais']
          }]
        }]
      }]
    });
    if (!equipo) {
      throw boom.notFound('Equipo no encontrado...');
    }
    return equipo;
  }

  async update(idEquipo, changes) {
    const equipo = await this.findOne(idEquipo);
    const response = await equipo.update(changes);
    return response;
  }

  async delete(idEquipo) {
    const equipo = await this.findOne(idEquipo);
    await equipo.destroy();
    return {
      idEquipo
    };
  }

}

module.exports = EquipoService;
