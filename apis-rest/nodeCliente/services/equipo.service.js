const boom = require('@hapi/boom');
const {
  QueryTypes
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class EquipoService {

  constructor() {}

  async find(idPersona) {
    const equipos = await models.Equipo.findAll({
      include: [{
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        },
        {
          association: 'Servicio',
          include: ['Tipo_Servicio', 'Trabajador']
        }
      ],
      where: {
        idPersona: idPersona
      }
    });
    return equipos;
  }

  async findActiveInactive(idPersona) {
    const response = await models.Persona.sequelize.query(`SELECT COUNT(s.fechaFinalizado) AS 'finalizados',
    (COUNT(s.fechaCreado)-COUNT(s.fechaFinalizado)) AS 'pendientes' FROM (MultiServicios.Persona p
    INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona) INNER JOIN MultiServicios.Servicio s
    ON e.idEquipo = s.idEquipo WHERE p.idPersona = ${idPersona}`, {
      type: QueryTypes.SELECT
    });
    return response[0];
  }

  async findAllActiveInactiveByIdPersona(idPersona) {
    const response = await models.Equipo.sequelize.query(`SELECT estado, COUNT(*) AS 'cantidad'
    FROM MultiServicios.Equipo WHERE idPersona = ${idPersona} GROUP BY estado`, {
      type: QueryTypes.SELECT
    });
    return response;
  }


  async findEquipmentWithMoreLessServices(idPersona) {
    const equipmentMax = await models.Equipo.sequelize.query(`SELECT e.*,  COUNT(s.idServicio) AS cantidad FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo WHERE e.idPersona = ${idPersona}
    GROUP BY e.idEquipo ORDER BY cantidad DESC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const equipmentMin = await models.Equipo.sequelize.query(`SELECT e.*,  COUNT(s.idServicio) AS cantidad FROM MultiServicios.Equipo e
    INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo WHERE e.idPersona = ${idPersona}
    GROUP BY e.idEquipo ORDER BY cantidad ASC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    return {equipmentMax: equipmentMax[0], equipmentMin: equipmentMin[0]};
  }

  async findOne(idEquipo) {
    const equipo = await models.Equipo.findByPk(idEquipo, {
      include: [{
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        },
        {
          association: 'Servicio',
          include: ['Tipo_Servicio', 'Trabajador']
        }
      ]
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

}

module.exports = EquipoService;
