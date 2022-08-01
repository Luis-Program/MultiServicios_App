const { Model, DataTypes } = require('sequelize');

const TIPO_TELEFONO_TABLE = 'Tipo_Telefono';

const Tipo_TelefonoSchema =  {
  idTipoTelefono: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  tipo: {
    allowNull: false,
    type: DataTypes.STRING,
  }
}

class Tipo_Telefono extends Model {

  static associate(models) {
    this.hasMany(models.Telefono, {
      as: 'Telefono',
      foreignKey: 'idTipoTelefono'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_TELEFONO_TABLE,
      modelName: 'Tipo_Telefono',
      timestamps: false
    }
  }
}

module.exports = { Tipo_Telefono, Tipo_TelefonoSchema, TIPO_TELEFONO_TABLE };
