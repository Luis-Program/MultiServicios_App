const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const {
  Op
} = require('sequelize');


class Tipo_ServicioService {

  constructor(){
  }

  async create(data) {
    const newTipo_Servicio = await models.Tipo_Servicio.create(data);
    return newTipo_Servicio;
  }

  async find() {
    const tipos_servicios = await models.Tipo_Servicio.findAll({
      where: {
        idTipoServicio: {
          [Op.lte]: 2
        }
      }
    });
    return tipos_servicios;
  }

  async findOne(idTipoServicio) {
    const tipo_servicio = await models.Tipo_Servicio.findByPk(idTipoServicio);
    if (!tipo_servicio) {
      throw boom.notFound('Tipo de servicio no encontrado...');
    }
    return tipo_servicio;
  }

  async update(idTipoServicio, changes) {
    const tipo_servicio = await this.findOne(idTipoServicio);
    const response = await tipo_servicio.update(changes);
    return response;
  }

  async delete(idTipoServicio) {
    const tipo_servicio = await this.findOne(idTipoServicio);
    await tipo_servicio.destroy();
    return { idTipoServicio };
  }

}

module.exports = Tipo_ServicioService;
