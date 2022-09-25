const boom = require('@hapi/boom');
const {
  QueryTypes
} = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class DireccionService {

  constructor() {}

  async create(data) {
    const newDireccion = await models.Direccion.create(data);
    const resp = this.findOne(newDireccion.idDireccion);
    return resp;
  }

  async findAll() {
    const direcciones = await models.Direccion.findAll();
    return direcciones;
  }

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

  async findDropDown() {
    const direcciones = await models.Persona.sequelize.query(`SELECT d.idDireccion, CONCAT(m.nombre,": ",d.direccion) as direccion FROM MultiServicios.Direccion d
    INNER JOIN MultiServicios.Municipio m
    ON d.idMunicipio = m.idMunicipio`, {
      type: QueryTypes.SELECT
    });
    return direcciones;
  }

  async findOne(idDireccion) {
    const direccion = await models.Direccion.findByPk(idDireccion, {
      include: [{
        association: 'Municipio',
        include: [{
          association: 'Departamento',
          include: ['Pais']
        }]
      }]
    });
    if (!direccion) {
      throw boom.notFound('Direccion no encontrada...');
    }
    return direccion;
  }

  async update(idDireccion, changes) {
    const direccion = await this.findOne(idDireccion);
    const update = await direccion.update(changes);
    const response = await this.findOne(update.idDireccion);
    return response;
  }

  async delete(idDireccion) {
    const direccion = await this.findOne(idDireccion);
    await direccion.destroy();
    return {
      idDireccion
    };
  }

}

module.exports = DireccionService;
