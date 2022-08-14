const {
  models
} = require('../libs/sequelize');
const {
  Op
} = require('sequelize');

class Tipo_ServicioService {

  constructor() {}

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
}
module.exports = Tipo_ServicioService;
