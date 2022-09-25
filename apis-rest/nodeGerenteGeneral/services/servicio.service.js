const boom = require('@hapi/boom');
const{ QueryTypes,
Op } = require('sequelize');
const {
  models
} = require('../libs/sequelize');


class ServicioService {

  constructor() {}

  async create(data) {
    const newServicio = await models.Servicio.create(data);
    const resp = this.findOne(newServicio.idServicio);
    return resp;
  }

  async find() {
    const servicios = await models.Servicio.findAll();
    return servicios;
  }

  async findAll() {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Trabajador',{
        association: 'Equipo',
        include: ['Persona', {
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }],
    });
    return servicios;
  }

  async findCompleted() {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Trabajador',{
        association: 'Equipo',
        include: ['Persona', {
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }],
      where: {
        estado: 'Servicio finalizado.'
      }
    });
    return servicios;
  }

  async findNotCompleted() {
    const servicios = await models.Servicio.findAll({
      include: ['Tipo_Servicio', 'Trabajador',{
        association: 'Equipo',
        include: ['Persona', {
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }],
      where: {
        fechaFinalizado: {
          [Op.is]: null
        }
      }
    });
    return servicios;
  }

  async findGraphics(){
    const data = await models.Servicio.sequelize.query("SELECT COUNT(fechaFinalizado) AS `serviciosCompletados`, COUNT(*) AS `cantidadServicios`, COUNT(idTrabajador) AS `serviciosAsignados` FROM MultiServicios.Servicio",
    { type : QueryTypes.SELECT });
    return data[0];
  }

  async findAmountByType(){
    let response = {
      preventivo : 0,
      correctivo : 0
    }
    const data = await models.Servicio.sequelize.query("SELECT t.tipoServicio, COUNT(*) AS 'cantidad' FROM MultiServicios.Servicio s INNER JOIN MultiServicios.Tipo_Servicio t ON t.idTipoServicio = s.idTipoServicio GROUP BY t.tipoServicio",
    { type : QueryTypes.SELECT });
    for (let index = 0; index < data.length; index++) {
      if (data[index].tipoServicio != 'Correctivo') {
        response.preventivo += data[index].cantidad;
      }else{
        response.correctivo += data[index].cantidad;
      }
    }
    return response;
  }

  async findOne(idServicio) {
    const servicio = await models.Servicio.findByPk(idServicio, {
      include: ['Tipo_Servicio', 'Trabajador', {
        association: 'Equipo',
        include: ['Persona', {
          association: 'Direccion',
          include: [{
            association: 'Municipio',
            include: [{
              association: 'Departamento',
              include: ['Pais']
            }]
          }]
        }]
      }],
    });
    if (!servicio) {
      throw boom.notFound('Servicio no encontrado...');
    }
    return servicio;
  }

  async update(idServicio, changes) {
    const servicio = await this.findOne(idServicio);
    const updated = await servicio.update(changes);
    const response = await this.findOne(updated.idServicio);
    return response;
  }

  async delete(idServicio) {
    const servicio = await this.findOne(idServicio);
    await servicio.destroy();
    return {
      idServicio
    };
  }

}

module.exports = ServicioService;
