const {
  models
} = require('../libs/sequelize');

class DireccionService {

  constructor() {}

  async find() {
    const direcciones = await models.Direccion.findAll({
      include: [{
        association: 'Municipio',
        include: [{
          association: 'Departamento',
          include: ['Pais']
        }]
      }]
    });
    return direcciones;
  }
}

module.exports = DireccionService;
