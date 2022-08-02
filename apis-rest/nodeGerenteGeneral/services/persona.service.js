const boom = require('@hapi/boom');
const {
  QueryTypes
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');



class PersonaService {

  constructor() {}

  async create(data) {
    const newPersona = await models.Persona.create(data);
    const resp = this.findOne(newPersona.idPersona);
    return resp;
  }

  async find(correo) {
    if (correo) {
      const persona = await models.Persona.findOne({
        include: [{
          association: 'Tipo_Persona',
          include: ['Empresa']
        }],
        where: {
          correo: correo
        }
      });
      if (!persona) {
        throw boom.notFound('Persona no encontrada...');
      }
      return persona;
    } else {
      const personas = await models.Persona.findAll();
      return personas;
    }
  }

  async findPersonMLServices() {
    const maxServices = await models.Persona.sequelize.query("SELECT p.idPersona, count(*) AS 'cantidad' FROM (MultiServicios.Persona p INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona) INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo GROUP BY p.idPersona ORDER BY cantidad DESC LIMIT 1", {
      type: QueryTypes.SELECT
    });
    const idPersona = maxServices[0].idPersona;
    const cantidad = maxServices[0].cantidad;
    const personMax = await models.Persona.findByPk(idPersona);
    const minServices = await models.Persona.sequelize.query("SELECT p.idPersona AS 'minId', count(*) AS 'cantidad2' FROM (MultiServicios.Persona p INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona) INNER JOIN MultiServicios.Servicio s ON e.idEquipo = s.idEquipo GROUP BY p.idPersona ORDER BY cantidad2 ASC LIMIT 1", {
      type: QueryTypes.SELECT
    });
    const minId = minServices[0].minId;
    const cantidad2 = minServices[0].minId;
    const personMin = await models.Persona.findByPk(minId);
    return [{
      cantidadService: cantidad,
      persona: personMax,
    }, {
      cantidadService: cantidad2,
      persona: personMin,
    }];
  }

  async findAll() {
    const personas = await models.Persona.findAll({
      include: [{
        association: 'Tipo_Persona',
        include: ['Empresa']
      }],
    });
    return personas;
  }

  async findAllWorkers() {
    const trabajadores = await models.Persona.sequelize.query(`SELECT p.* FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona WHERE t.tipo = 'Trabajador de Operaciones'`, {
      type: QueryTypes.SELECT
    });
    return trabajadores;
  }

  async findAllClients() {
    const clientes = await models.Persona.sequelize.query(`SELECT p.* FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona
    WHERE t.tipo = 'Cliente'`, {
      type: QueryTypes.SELECT
    });
    return clientes;
  }

  async findAllWorkersWithServicesCount() {
    const trabajadores = await models.Persona.sequelize.query(`SELECT p.*, COUNT(s.idTrabajador) AS 'cantidad' FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) LEFT JOIN MultiServicios.Servicio s ON p.idPersona = s.idTrabajador
      WHERE t.tipo = 'Trabajador de Operaciones' GROUP BY p.idPersona`, {
      type: QueryTypes.SELECT
    });
    return trabajadores;
  }

  async findAmountEquipsMinMax() {
    let response = [];
    const responseMax = await models.Persona.sequelize.query(`SELECT p.*, COUNT(e.idPersona) AS 'cantidad' FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona
      WHERE t.tipo = 'Cliente' GROUP BY p.idPersona ORDER BY cantidad DESC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const responseMin = await models.Persona.sequelize.query(`SELECT p.*, COUNT(e.idPersona) AS 'cantidad' FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) INNER JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona
      WHERE t.tipo = 'Cliente' GROUP BY p.idPersona ORDER BY cantidad ASC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    response.push(
      responseMax[0],
      responseMin[0]
    )
    return response;
  }

  async findWorkerServicesAmount(idTrabajador) {
    const response = await models.Persona.sequelize.query(`SELECT COUNT(s.fechaFinalizado) AS 'finalizados',
    (COUNT(s.fechaCreado)-COUNT(s.fechaFinalizado)) AS 'pendientes' FROM MultiServicios.Persona p INNER JOIN  MultiServicios.Servicio s
    ON p.idPersona = s.idTrabajador WHERE idPersona = ${idTrabajador}`, {
      type: QueryTypes.SELECT
    });
    return response[0];
  }

  async findOne(data) {
    const {
      correo
    } = data;
    if (correo) {
      const persona = await models.Persona.find({
        include: [{
          association: 'Tipo_Persona',
          include: ['Empresa']
        }],
        where: {
          correo: correo
        }
      });
      if (!persona) {
        throw boom.notFound('Persona no encontrada...');
      }
      return persona;
    } else {
      const persona = await models.Persona.findByPk(data, {
        include: [{
          association: 'Tipo_Persona',
          include: ['Empresa']
        }],
      });
      if (!persona) {
        throw boom.notFound('Persona no encontrada...');
      }
      return persona;
    }
  }

  async update(idPersona, changes) {
    const persona = await this.findOne(idPersona);
    const response = await persona.update(changes);
    return response;
  }

  async delete(idPersona) {
    const persona = await this.findOne(idPersona);
    await persona.destroy();
    return {
      idPersona
    };
  }

}

module.exports = PersonaService;
