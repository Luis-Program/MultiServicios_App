const boom = require('@hapi/boom');
const {
  models
} = require('../libs/sequelize');


class Analisis_RepuestoService {

  constructor() {}

  async find() {
    const analisisRepuestos = await models.Analisis_Repuesto.findAll();
    return analisisRepuestos;
  }

  async findOne(idAnalisisRepuesto) {
    const analisisRepuesto = await models.Analisis_Repuesto.findByPk(idAnalisisRepuesto);
    if (!analisisRepuesto) {
      throw boom.notFound('Analisis repuesto no encontrado...');
    }
    return analisisRepuesto;
  }

  async findAllByName(nombreRepuesto) {
    const response = await models.Analisis_Repuesto.findAll({
      where: {
        nombreRepuesto: nombreRepuesto
      }
    });
    return response;
  }
}

module.exports = Analisis_RepuestoService;
