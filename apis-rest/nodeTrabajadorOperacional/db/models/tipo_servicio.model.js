const { Model, DataTypes } = require('sequelize');

const TIPO_SERVICIO_TABLE = 'Tipo_Servicio';

const Tipo_ServicioSchema =  {
  idTipoServicio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  tipoServicio: {
    allowNull: false,
    type: DataTypes.STRING,
  }
}

class Tipo_Servicio extends Model {

  static associate(models) {
    this.hasMany(models.Servicio,{
      as: 'Servicio',
      foreignKey: 'idTipoServicio'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_SERVICIO_TABLE,
      modelName: 'Tipo_Servicio',
      timestamps: false
    }
  }
}

module.exports = { Tipo_Servicio, Tipo_ServicioSchema, TIPO_SERVICIO_TABLE };
