const { Model, DataTypes } = require('sequelize');

const ANALISIS_REPUESTO_TABLE = 'Analisis_Repuesto';

const Analisis_RepuestoSchema =  {
  idAnalisisRepuesto: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombreRepuesto: {
    allowNull: false,
    type: DataTypes.STRING
  },
  nombreTipo: {
    allowNull: false,
    type: DataTypes.STRING
  },
  cantidadAntes: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  cantidadDespues: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  diferenciaCantidades: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  fechaHora: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  tipoAccion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  }

class Analisis_Repuesto extends Model {

  static associate() {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ANALISIS_REPUESTO_TABLE,
      modelName: 'Analisis_Repuesto',
      timestamps: false
    }
  }
}

module.exports = { Analisis_Repuesto, Analisis_RepuestoSchema, ANALISIS_REPUESTO_TABLE };
