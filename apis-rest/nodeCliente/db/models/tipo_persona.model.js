const { Model, DataTypes } = require('sequelize');
const { EMPRESA_TABLE } = require('./empresa.model');

const TIPO_PERSONA_TABLE = 'Tipo_Persona';

const Tipo_PersonaSchema =  {
  idTipoPersona: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  tipo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  idEmpresa: {
    field: 'idEmpresa',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: EMPRESA_TABLE,
      key: 'idEmpresa'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Tipo_Persona extends Model {

  static associate(models) {
    this.belongsTo(models.Empresa,{
      as: 'Empresa',
      foreignKey: 'idEmpresa'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_PERSONA_TABLE,
      modelName: 'Tipo_Persona',
      timestamps: false
    }
  }
}

module.exports = { Tipo_Persona, Tipo_PersonaSchema, TIPO_PERSONA_TABLE };
