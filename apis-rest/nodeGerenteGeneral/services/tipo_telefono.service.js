const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class Tipo_TelefonoService {

  constructor(){
  }

  async create(data) {
    const newTipoTelefono = await models.Tipo_Telefono.create(data);
    return newTipoTelefono;
  }

  async find() {
    const tiposTelefonos = await models.Tipo_Telefono.findAll();
    return tiposTelefonos;
  }

  async findOne(idTipoTelefono) {
    const tipoTelefono = await models.Tipo_Telefono.findByPk(idTipoTelefono);
    if (!tipoTelefono) {
      throw boom.notFound('Tipo de telefono no encontrado...');
    }
    return tipoTelefono;
  }

  async update(idTipoTelefono, changes) {
    const tipoTelefono = await this.findOne(idTipoTelefono);
    const response = await tipoTelefono.update(changes);
    return response;
  }

  async delete(idTipoTelefono) {
    const tipoTelefono = await this.findOne(idTipoTelefono);
    await tipoTelefono.destroy();
    return { idTipoTelefono };
  }

}

module.exports = Tipo_TelefonoService;
