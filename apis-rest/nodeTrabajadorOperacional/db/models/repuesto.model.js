const { Model, DataTypes } = require('sequelize');
const { TIPO_REPUESTO_TABLE } = require('./tipo_repuesto.model');

const REPUESTO_TABLE = 'Repuesto';

const RepuestoSchema =  {
  idRepuesto: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  cantidadDisponible: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  limiteInferior: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  idTipoRepuesto: {
    field: 'idTipoRepuesto',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_REPUESTO_TABLE,
      key: 'idTipoRepuesto'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Repuesto extends Model {

  static associate(models) {
    this.belongsTo(models.Tipo_Repuesto,{
      as: 'Tipo_Repuesto',
      foreignKey: 'idTipoRepuesto'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REPUESTO_TABLE,
      modelName: 'Repuesto',
      timestamps: false
    }
  }
}

module.exports = { Repuesto, RepuestoSchema, REPUESTO_TABLE };
