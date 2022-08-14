const { Model, DataTypes } = require('sequelize');

const EMPRESA_TABLE = 'Empresa';

const EmpresaSchema =  {
  idEmpresa: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  nit: {
    allowNull: true,
    type: DataTypes.STRING,
  }
}

class Empresa extends Model {

  static associate(models) {
    this.hasMany(models.Tipo_Persona, {
      as: 'Tipo_Persona',
      foreignKey: 'idEmpresa'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EMPRESA_TABLE,
      modelName: 'Empresa',
      timestamps: false
    }
  }
}

module.exports = { Empresa, EmpresaSchema, EMPRESA_TABLE };
