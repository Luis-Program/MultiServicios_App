const { Model, DataTypes } = require('sequelize');
const { TIPO_PERSONA_TABLE } = require('./tipo_persona.model');

const PERSONA_TABLE = 'Persona';

const PersonaSchema =  {
  idPersona: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  apellidos: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  correo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  dpi: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  idTipoPersona: {
    field: 'idTipoPersona',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_PERSONA_TABLE,
      key: 'idTipoPersona'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Persona extends Model {

  static associate(models) {
    this.belongsTo(models.Tipo_Persona, {
      as: 'Tipo_Persona',
      foreignKey: 'idTipoPersona'
    });
    this.hasMany(models.Telefono,{
      as: 'Telefono',
      foreignKey: 'idPersona'
    });
    this.hasMany(models.Notificacion,{
      as: 'Notificacion',
      foreignKey: 'idPersona'
    });
    this.hasMany(models.Equipo,{
      as: 'Equipo',
      foreignKey: 'idPersona'
    });
    this.hasMany(models.Servicio,{
      as: 'Servicio',
      foreignKey: 'idTrabajador'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERSONA_TABLE,
      modelName: 'Persona',
      timestamps: false
    }
  }
}

module.exports = { Persona, PersonaSchema, PERSONA_TABLE };
