const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class Tipo_RepuestoService {

  constructor(){
  }

  async create(data) {
    const newTipoRepuesto = await models.Tipo_Repuesto.create(data);
    return newTipoRepuesto;
  }

  async find() {
    const tiposRepuestos = await models.Tipo_Repuesto.findAll();
    return tiposRepuestos;
  }

  async findOne(idTipoRepuesto) {
    const tipoRepuesto = await models.Tipo_Repuesto.findByPk(idTipoRepuesto);
    if (!tipoRepuesto) {
      throw boom.notFound('Tipo de repuesto no encontrado...');
    }
    return tipoRepuesto;
  }

  async update(idTipoRepuesto, changes) {
    const tipoRepuesto = await this.findOne(idTipoRepuesto);
    const response = await tipoRepuesto.update(changes);
    return response;
  }

  async delete(idTipoRepuesto) {
    const tipoRepuesto = await this.findOne(idTipoRepuesto);
    await tipoRepuesto.destroy();
    return { idTipoRepuesto };
  }

}

module.exports = Tipo_RepuestoService;
