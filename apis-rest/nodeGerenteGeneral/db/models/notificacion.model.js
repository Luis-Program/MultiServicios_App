const { Model, DataTypes } = require('sequelize');
const { PERSONA_TABLE } = require('./persona.model');
const { TIPO_NOTIFICACION_TABLE } = require('./tipo_notificacion.model');

const NOTIFICACION_TABLE = 'Notificacion';

const NotificacionSchema =  {
  idNotificacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  textoNotificacion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  notificacionId: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  visto: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  idPersona: {
    field: 'idPersona',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PERSONA_TABLE,
      key: 'idPersona'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  idTipoNotificacion: {
    field: 'idTipoNotificacion',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_NOTIFICACION_TABLE,
      key: 'idTipoNotificacion'
    },
    onUpdate: 'SET NULL',
    onDelete: 'CASCADE'
  }
}

class Notificacion extends Model {

  static associate(models) {
    this.belongsTo(models.Persona,{
      as: 'Persona',
      foreignKey: 'idPersona'
    });
    this.belongsTo(models.Tipo_Notificacion,{
      as: 'Tipo_Notificacion',
      foreignKey: 'idTipoNotificacion'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTIFICACION_TABLE,
      modelName: 'Notificacion',
      timestamps: false
    }
  }
}

module.exports = { Notificacion, NotificacionSchema, NOTIFICACION_TABLE };
