const { Model, DataTypes } = require('sequelize');

const TIPO_NOTIFICACION_TABLE = 'Tipo_Notificacion';

const Tipo_NotificacionSchema =  {
  idTipoNotificacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  tipoNotificacion: {
    allowNull: false,
    type: DataTypes.STRING,
  }
}

class Tipo_Notificacion extends Model {

  static associate(models) {
    this.hasMany(models.Notificacion, {
      as: 'Notificacion',
      foreignKey: 'idTipoNotificacion'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_NOTIFICACION_TABLE,
      modelName: 'Tipo_Notificacion',
      timestamps: false
    }
  }
}

module.exports = { Tipo_Notificacion, Tipo_NotificacionSchema, TIPO_NOTIFICACION_TABLE };
