const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class RepuestoService {

  constructor(){
  }

  async create(data) {
    const newRepuesto = await models.Repuesto.create(data);
    const resp = this.findOne(newRepuesto.idRepuesto);
    return resp;
  }

  async find() {
    const repuestos = await models.Repuesto.findAll({
      include: ['Tipo_Repuesto']
    });
    return repuestos;
  }

  async findOne(idRepuesto) {
    const repuesto = await models.Repuesto.findByPk(idRepuesto, {
      include: ['Tipo_Repuesto']
    });
    if (!repuesto) {
      throw boom.notFound('Repuesto no encontrado...');
    }
    return repuesto;
  }

  async update(idRepuesto, changes) {
    const repuesto = await this.findOne(idRepuesto);
    const response = await repuesto.update(changes);
    return response;
  }

  async delete(idRepuesto) {
    const repuesto = await this.findOne(idRepuesto);
    await repuesto.destroy();
    return { idRepuesto };
  }

}

module.exports = RepuestoService;
