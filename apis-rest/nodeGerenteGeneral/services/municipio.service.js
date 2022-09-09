const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class MunicipioService {

  constructor(){
  }

  async create(data) {
    const newMunicipio = await models.Municipio.create(data);
    const resp = this.findOne(newMunicipio.idMunicipio);
    return resp;
  }

  async findAll() {
    const municipios = await models.Municipio.findAll();
    return municipios;
  }

  async find() {
    const municipios = await models.Municipio.findAll({
      include: [{
        association: 'Departamento',
        include: ['Pais']
      }],
    });
    return municipios;
  }

  async findOne(idMunicipio) {
    const municipio = await models.Municipio.findByPk(idMunicipio, {
      include: [{
        association: 'Departamento',
        include: ['Pais']
      }],
    });
    if (!municipio) {
      throw boom.notFound('Municipio no encontrado...');
    }
    return municipio;
  }

  async update(idMunicipio, changes) {
    const municipio = await this.findOne(idMunicipio);
    const update = await municipio.update(changes);
    const response = await this.findOne(update.idMunicipio);
    return response;
  }

  async delete(idMunicipio) {
    const municipio = await this.findOne(idMunicipio);
    await municipio.destroy();
    return { idMunicipio };
  }

}

module.exports = MunicipioService;
