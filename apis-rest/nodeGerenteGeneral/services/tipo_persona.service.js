const boom = require('@hapi/boom');
const {
  QueryTypes
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class Tipo_PersonaService {

  constructor() {}

  async create(data) {
    const newTipo_Persona = await models.Tipo_Persona.create(data);
    const resp = this.findOne(newTipo_Persona.idTipoPersona);
    return resp;
  }

  async findAll() {
      const tipos_personas = await models.Tipo_Persona.findAll();
      return tipos_personas;
  }

  async find() {
    const tipos_personas = await models.Tipo_Persona.findAll({
      include: ['Empresa'],
    });
    return tipos_personas;
  }

  async findAllDropdown() {
    const tipos_personas = await models.Persona.sequelize.query(`SELECT idTipoPersona, CONCAT(t.tipo,": ",e.nombre) AS tipo FROM MultiServicios.Tipo_Persona t
    INNER JOIN MultiServicios.Empresa e
    ON t.idEmpresa = e.idEmpresa`, {
      type: QueryTypes.SELECT
    });
    return tipos_personas;
  }

  async findOne(idTipoPersona) {
    const tipo_persona = await models.Tipo_Persona.findByPk(idTipoPersona, {
      include: ['Empresa'],
    });
    if (!tipo_persona) {
      throw boom.notFound('Tipo de persona no encontrado...');
    }
    return tipo_persona;
  }

  async update(idTipoPersona, changes) {
    const tipo_persona = await this.findOne(idTipoPersona);
    const response = await tipo_persona.update(changes);
    return response;
  }

  async delete(idTipoPersona) {
    const tipo_persona = await this.findOne(idTipoPersona);
    await tipo_persona.destroy();
    return {
      idTipoPersona
    };
  }

}

module.exports = Tipo_PersonaService;
