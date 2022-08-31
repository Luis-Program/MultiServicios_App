const boom = require('@hapi/boom');
const {
  models
} = require('../libs/sequelize');


class PersonaService {

  constructor() {}

  async find(correo) {
    const persona = await models.Persona.findOne({
      include: [{
        association: 'Tipo_Persona',
        include: ['Empresa']
      }],
      where: {
        correo: correo
      }
    });
    if (!persona) {
      throw boom.notFound('Persona no encontrada...');
    }
    return persona;
  }

  async findOne(idPersona) {
      const persona = await models.Persona.findByPk(idPersona, {
        include: [{
          association: 'Tipo_Persona',
          include: ['Empresa']
        }]
      });
      if (!persona) {
        throw boom.notFound('Persona no encontrada...');
      }
      return persona;
  }

  async update(idPersona, changes) {
    const persona = await this.findOne(idPersona);
    const updated = await persona.update(changes);
    const response = await this.findOne(updated.idPersona);
    return response;
  }

}

module.exports = PersonaService;
