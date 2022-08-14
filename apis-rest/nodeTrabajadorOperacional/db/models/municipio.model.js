const { Model, DataTypes } = require('sequelize');
const { DEPARTAMENTO_TABLE } = require('./departamento.model');

const MUNICIPIO_TABLE = 'Municipio';

const MunicipioSchema =  {
  idMunicipio: {
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
  idDepartamento: {
    field: 'idDepartamento',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: DEPARTAMENTO_TABLE,
      key: 'idDepartamento'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Municipio extends Model {

  static associate(models) {
    this.belongsTo(models.Departamento,{
      as: 'Departamento',
      foreignKey: 'idDepartamento'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MUNICIPIO_TABLE,
      modelName: 'Municipio',
      timestamps: false
    }
  }
}

module.exports = { Municipio, MunicipioSchema, MUNICIPIO_TABLE };
