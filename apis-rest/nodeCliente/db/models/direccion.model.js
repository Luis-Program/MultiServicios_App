const { Model, DataTypes } = require('sequelize');
const { MUNICIPIO_TABLE } = require('./municipio.model');

const DIRECCION_TABLE = 'Direccion';

const DireccionSchema =  {
  idDireccion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  direccion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  idMunicipio: {
    field: 'idMunicipio',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: MUNICIPIO_TABLE,
      key: 'idMunicipio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Direccion extends Model {

  static associate(models) {
    this.belongsTo(models.Municipio,{
      as: 'Municipio',
      foreignKey: 'idMunicipio'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DIRECCION_TABLE,
      modelName: 'Direccion',
      timestamps: false
    }
  }
}

module.exports = { Direccion, DireccionSchema, DIRECCION_TABLE };
