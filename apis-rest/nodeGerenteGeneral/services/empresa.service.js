const boom = require('@hapi/boom');
const QueryTypes = require('sequelize');
const {
  models
} = require('../libs/sequelize');

class EmpresaService {

  constructor() {}

  async create(data) {
    const newEmpresa = await models.Empresa.create(data);
    const resp = this.findOne(newEmpresa.idEmpresa);
    return resp;
  }

  async find() {
    const empresas = await models.Empresa.findAll();
    return empresas;
  }

  async findAllWithRelations(){
    const empresas = await models.Empresa.findAll({
      include: ['Tipo_Persona']
    });
    return empresas;
  }

  async findMinMaxClient() {
    let response = []
    const max = await models.Empresa.sequelize.query(`SELECT e.nombre AS 'empresa', COUNT(p.idPersona) AS 'cantidad'
    FROM (MultiServicios.Empresa e LEFT JOIN MultiServicios.Tipo_Persona t
    ON e.idEmpresa = t.idEmpresa) LEFT JOIN MultiServicios.Persona p
    ON t.idTipoPersona = p.idTipoPersona
    WHERE t.tipo = 'Cliente'
    GROUP BY e.nombre
    ORDER BY cantidad DESC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    const min = await models.Empresa.sequelize.query(`SELECT e.nombre AS 'empresa', COUNT(p.idPersona) AS 'cantidad' FROM (MultiServicios.Empresa e INNER JOIN MultiServicios.Tipo_Persona t ON e.idEmpresa = t.idEmpresa) LEFT JOIN MultiServicios.Persona p ON t.idTipoPersona = p.idTipoPersona WHERE t.tipo = 'Cliente' GROUP BY e.nombre ORDER BY cantidad ASC LIMIT 1`, {
      type: QueryTypes.SELECT
    });
    response[0] = max[0][0];
    response[1] = min[0][0];
    return response;
  }

  async findOne(idEmpresa) {
    const empresa = await models.Empresa.findByPk(idEmpresa, {
      include: ['Tipo_Persona']
    });
    if (!empresa) {
      throw boom.notFound('Empresa no encontrada...');
    }
    return empresa;
  }

  async update(idEmpresa, changes) {
    const empresa = await this.findOne(idEmpresa);
    const response = await empresa.update(changes);
    return response;
  }

  async delete(idEmpresa) {
    const empresa = await this.findOne(idEmpresa);
    await empresa.destroy();
    return {
      idEmpresa
    };
  }

}

module.exports = EmpresaService;
