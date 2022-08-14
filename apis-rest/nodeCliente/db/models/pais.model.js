const { Model, DataTypes } = require('sequelize');

const PAIS_TABLE = 'Pais';

const PaisSchema =  {
  idPais: {
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
  }
}

class Pais extends Model {

  static associate(models) {
    this.hasMany(models.Departamento, {
      as: 'Departamento',
      foreignKey: 'idPais'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PAIS_TABLE,
      modelName: 'Pais',
      timestamps: false
    }
  }
}

module.exports = { Pais, PaisSchema, PAIS_TABLE };
