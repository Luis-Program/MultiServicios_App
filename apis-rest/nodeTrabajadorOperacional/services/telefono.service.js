const {
  models
} = require('../libs/sequelize');


class TelefonoService {

  constructor() {}

  async find(idPersona) {
    const options = {
      include: ['Tipo_Telefono'],
      where: {
        idPersona: idPersona
      }
    }
    const telefonos = await models.Telefono.findAll(options);
    return telefonos;
  }

  async findOne(idTelefono) {
    const telefono = await models.Telefono.findOne({
      include: ['Tipo_Telefono'],
      where: {
        idTelefono: idTelefono
      }
    });
    return telefono;
  }

  async create(data) {
    const newTelefono = await models.Telefono.create(data);
    const resp = this.findOne(newTelefono.idTelefono)
    return resp;
  }

  async update(idTelefono, changes) {
    const telefono = await this.findOne(idTelefono);
    const response = await telefono.update(changes);
    return response;
  }

  async delete(idTelefono) {
    const telefono = await this.findOne(idTelefono);
    await telefono.destroy();
    return {
      idTelefono
    };
  }

}

module.exports = TelefonoService;
