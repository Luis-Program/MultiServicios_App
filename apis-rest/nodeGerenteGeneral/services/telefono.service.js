const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class TelefonoService {

  constructor(){
  }

  async create(data) {
    const newTelefono = await models.Telefono.create(data);
    const resp = this.findOne(newTelefono.idTelefono);
    return resp;
  }

  async find() {
    const telefonos = await models.Telefono.findAll();
    return telefonos;
  }

  async findAll() {
    const telefonos = await models.Telefono.findAll({
      include: ['Tipo_Telefono','Persona'],
    });
    return telefonos;
  }

  async findOne(idTelefono) {
    const telefono = await models.Telefono.findByPk(idTelefono,{
      include: ['Tipo_Telefono','Persona'],
    });
    if (!telefono) {
      throw boom.notFound('Telefono no encontrado...');
    }
    return telefono;
  }

  async update(idTelefono, changes) {
    const telefono = await this.findOne(idTelefono);
    const phone = await telefono.update(changes);
    const response = await this.findOne(phone.idTelefono);
    return response;
  }

  async delete(idTelefono) {
    const telefono = await this.findOne(idTelefono);
    await telefono.destroy();
    return { idTelefono };
  }

}

module.exports = TelefonoService;
