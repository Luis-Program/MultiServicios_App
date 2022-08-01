const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class PaisService {

  constructor(){
  }

  async create(data) {
    const newPais = await models.Pais.create(data);
    return newPais;
  }

  async find() {
    const paises = await models.Pais.findAll();
    return paises;
  }

  async findOne(idPais) {
    const pais = await models.Pais.findByPk(idPais);
    if (!pais) {
      throw boom.notFound('Pais no encontrado...');
    }
    return pais;
  }

  async update(idPais, changes) {
    const pais = await this.findOne(idPais);
    const response = await pais.update(changes);
    return response;
  }

  async delete(idPais) {
    const pais = await this.findOne(idPais);
    await pais.destroy();
    return { idPais };
  }

}

module.exports = PaisService;
