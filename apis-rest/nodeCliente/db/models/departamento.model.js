const { Model, DataTypes } = require('sequelize');
const { PAIS_TABLE } = require('./pais.model');

const DEPARTAMENTO_TABLE = 'Departamento';

const DepartamentoSchema =  {
  idDepartamento: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  codigo: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  idPais: {
    field: 'idPais',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: PAIS_TABLE,
      key: 'idPais'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Departamento extends Model {

  static associate(models) {
    this.belongsTo(models.Pais,{
      as: 'Pais',
      foreignKey: 'idPais'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DEPARTAMENTO_TABLE,
      modelName: 'Departamento',
      timestamps: false
    }
  }
}

module.exports = { Departamento, DepartamentoSchema, DEPARTAMENTO_TABLE };
