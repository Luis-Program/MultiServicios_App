const boom = require('@hapi/boom');
const {
  models
} = require('../libs/sequelize');


class DepartamentoService {

  constructor() {}

  async create(data) {
    const newDepartamento = await models.Departamento.create(data);
    const resp = this.findOne(newDepartamento.idDepartamento);
    return resp;
  }

  async findAll() {
    const departamentos = await models.Departamento.findAll();
    return departamentos;
  }

  async findAllRelations() {
    const departamentos = await models.Departamento.findAll({
      include: ['Pais']
    });
    return departamentos;
  }

  async findOne(idDepartamento) {
    const departamento = await models.Departamento.findByPk(idDepartamento, {
      include: ['Pais']
    });
    if (!departamento) {
      throw boom.notFound('Departamento no encontrado...');
    }
    return departamento;
  }

  async update(idDepartamento, changes) {
    const departamento = await this.findOne(idDepartamento);
    const response = await departamento.update(changes);
    return response;
  }

  async delete(idDepartamento) {
    const departamento = await this.findOne(idDepartamento);
    await departamento.destroy();
    return {
      idDepartamento
    };
  }

}

module.exports = DepartamentoService;
