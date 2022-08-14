const { Model, DataTypes } = require('sequelize');
const { TIPO_TELEFONO_TABLE } = require('./tipo_telefono.model');
const { PERSONA_TABLE } = require('./persona.model');

const TELEFONO_TABLE = 'Telefono';

const TelefonoSchema =  {
  idTelefono: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  numero: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  idPersona: {
    field: 'idPersona',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PERSONA_TABLE,
      key: 'idPersona'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  idTipoTelefono: {
    field: 'idTipoTelefono',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_TELEFONO_TABLE,
      key: 'idTipoTelefono'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Telefono extends Model {

  static associate(models) {
    this.belongsTo(models.Persona,{
      as: 'Persona',
      foreignKey: 'idPersona'
    });
    this.belongsTo(models.Tipo_Telefono,{
      as: 'Tipo_Telefono',
      foreignKey: 'idTipoTelefono'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TELEFONO_TABLE,
      modelName: 'Telefono',
      timestamps: false
    }
  }
}

module.exports = { Telefono, TelefonoSchema, TELEFONO_TABLE };
