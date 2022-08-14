const boom = require('@hapi/boom');
const QueryTypes = require('sequelize');
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
    const response = await models.Analisis_Repuesto.sequelize.query(`SELECT cantidadDespues as amount, fechaHora as timedate FROM MultiServicios.Analisis_Repuesto WHERE nombreRepuesto = "${nombreRepuesto}"`,
    { type : QueryTypes.SELECT });
    return response[0];
  }
}

module.exports = Analisis_RepuestoService;
