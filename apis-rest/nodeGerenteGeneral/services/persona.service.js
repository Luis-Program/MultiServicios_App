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
    const response = await models.Persona.create(data);
    const persona = await this.findOne(response.idPersona);
    if (persona.Tipo_Persona.tipo === "Gerente General") {
      const answer = await models.Persona.sequelize.query(`SELECT p.*, t.*,e.nombre AS nombreEmpresa, count(0) AS cantidad FROM (MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
        INNER JOIN MultiServicios.Empresa e
        ON t.idEmpresa = e.idEmpresa WHERE p.idPersona = ${response.idPersona}
        GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      return answer[0];
    } else if (persona.Tipo_Persona.tipo === "Cliente") {
      const answer = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(e.idEquipo) AS 'cantidad' FROM ((MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
        LEFT JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona)
        INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
        WHERE  t.tipo = 'Cliente'  GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      const personIndex = answer.findIndex(
        (res) => res.idPersona === response.idPersona);
      return answer[personIndex];
    } else {
      const answer = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(s.idTrabajador) AS 'cantidad' FROM ((MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) LEFT JOIN MultiServicios.Servicio s ON p.idPersona = s.idTrabajador)
        INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
        WHERE t.tipo = 'Trabajador Operacional' AND p.idPersona = ${response.idPersona} GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      return answer[0];
    }
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
    const maxServices = await models.Persona.sequelize.query(`SELECT p.*,count(s.idTrabajador) AS 'cantidad' FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Servicio s
    ON p.idPersona = s.idTrabajador
    GROUP BY p.idPersona ORDER BY cantidad DESC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const minServices = await models.Persona.sequelize.query(`SELECT p.*,count(s.idTrabajador) AS 'cantidad' FROM MultiServicios.Persona p
    LEFT JOIN MultiServicios.Servicio s
    ON p.idPersona = s.idTrabajador
    GROUP BY p.idPersona ORDER BY cantidad ASC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    return [maxServices[0], minServices[0]];
  }

  async findAllWorkers() {
    const trabajadores = await models.Persona.sequelize.query(`SELECT p.* FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona WHERE t.tipo = 'Trabajador de Operaciones'`, {
      type: QueryTypes.SELECT
    });
    return trabajadores;
  }

  async findAllWorkersDropDown() {
    const trabajadores = await models.Persona.sequelize.query(`SELECT p.idPersona, CONCAT(p.nombre," ",p.apellidos,". Trabajos: ",COUNT(s.idTrabajador)) as nombre FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) LEFT JOIN MultiServicios.Servicio s ON p.idPersona = s.idTrabajador
      WHERE t.tipo = 'Trabajador Operacional' GROUP BY p.idPersona`, {
      type: QueryTypes.SELECT
    });
    return trabajadores;
  }

  async findAllPersonDropdown() {
    const clientes = await models.Persona.sequelize.query(`SELECT idPersona, CONCAT(nombre," ",apellidos) AS 	nombre FROM MultiServicios.Persona`, {
      type: QueryTypes.SELECT
    });
    return clientes;
  }

  async findAllClients() {
    const clientes = await models.Persona.sequelize.query(`SELECT p.idPersona, CONCAT(p.nombre," ",p.apellidos) AS 	nombre FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona
    WHERE t.tipo = 'Cliente'`, {
      type: QueryTypes.SELECT
    });
    return clientes;
  }

  async findAll() {
    const personas = await models.Persona.sequelize.query(`SELECT p.*, t.*,e.nombre AS nombreEmpresa, count(0) AS cantidad FROM (MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
      INNER JOIN MultiServicios.Empresa e
      ON t.idEmpresa = e.idEmpresa
      GROUP BY p.idPersona`, {
      type: QueryTypes.SELECT
    });
    return personas;
  }

  async findAllClientsEquipments() {
    const clientes = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(e.idEquipo) AS 'cantidad' FROM ((MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
      LEFT JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona)
      INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
      WHERE  t.tipo = 'Cliente'  GROUP BY p.idPersona`, {
      type: QueryTypes.SELECT
    });
    return clientes;
  }

  async findAllWorkersWithServicesCount() {
    const trabajadores = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(s.idTrabajador) AS 'cantidad' FROM ((MultiServicios.Persona p
      INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) LEFT JOIN MultiServicios.Servicio s ON p.idPersona = s.idTrabajador)
      INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
      WHERE t.tipo = 'Trabajador Operacional' GROUP BY p.idPersona`, {
      type: QueryTypes.SELECT
    });
    return trabajadores;
  }

  async findAmountEquipsMinMax() {
    const responseMax = await models.Persona.sequelize.query(`SELECT p.*, COUNT(e.idEquipo) AS 'cantidad' FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Equipo e
    ON p.idPersona = e.idPersona
    GROUP BY p.idPersona ORDER BY cantidad DESC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const responseMin = await models.Persona.sequelize.query(`SELECT p.*, COUNT(e.idEquipo) AS 'cantidad' FROM MultiServicios.Persona p
    INNER JOIN MultiServicios.Tipo_Persona t
    ON p.idTipoPersona = t.idTipoPersona
    LEFT JOIN MultiServicios.Equipo e
    ON p.idPersona = e.idPersona
    WHERE t.tipo = "Cliente"
    GROUP BY p.idPersona ORDER BY cantidad ASC LIMIT 1;`, {
      type: QueryTypes.SELECT
    });
    return [responseMax[0], responseMin[0]];
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

  async findOneRelations(data) {
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

  async update(idPersona, changes) {
    const persona = await this.findOne(idPersona);
    const response = await persona.update(changes);
    return response;
  }

  async updateManger(idPersona, changes) {
    const persona = await this.findOne(idPersona);
    const re = await persona.update(changes);
    const response = await this.findOne(re.idPersona);
    if (response.Tipo_Persona.tipo === "Gerente General") {
      const answer = await models.Persona.sequelize.query(`SELECT p.*, t.*,e.nombre AS nombreEmpresa, count(0) AS cantidad FROM (MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
        INNER JOIN MultiServicios.Empresa e
        ON t.idEmpresa = e.idEmpresa WHERE p.idPersona = ${response.idPersona}
        GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      return answer[0];
    } else if (response.Tipo_Persona.tipo === "Cliente") {
      const answer = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(e.idEquipo) AS 'cantidad' FROM ((MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona)
        LEFT JOIN MultiServicios.Equipo e ON p.idPersona = e.idPersona)
        INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
        WHERE  t.tipo = 'Cliente'  GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      const personIndex = answer.findIndex(
        (res) => res.idPersona === response.idPersona);
      return answer[personIndex];
    } else {
      const answer = await models.Persona.sequelize.query(`SELECT p.*,t.*,em.nombre AS nombreEmpresa, COUNT(s.idTrabajador) AS 'cantidad' FROM ((MultiServicios.Persona p
        INNER JOIN MultiServicios.Tipo_Persona t ON p.idTipoPersona = t.idTipoPersona) LEFT JOIN MultiServicios.Servicio s ON p.idPersona = s.idTrabajador)
        INNER JOIN MultiServicios.Empresa em  ON t.idEmpresa = em.idEmpresa
        WHERE t.tipo = 'Trabajador Operacional' AND p.idPersona = ${response.idPersona} GROUP BY p.idPersona`, {
        type: QueryTypes.SELECT
      });
      return answer[0];
    }
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
