const { Model, DataTypes } = require('sequelize');
const { TIPO_SERVICIO_TABLE } = require('./tipo_servicio.model');
const { EQUIPO_TABLE } = require('./equipo.model');
const { PERSONA_TABLE } = require('./persona.model');

const SERVICIO_TABLE = 'Servicio';

const ServicioSchema =  {
  idServicio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  fechaHoraRealizar: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  fechaCreado: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  fechaFinalizado: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  estado: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  prioridad: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  fechaHoraAsignadoTrabajador: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  idTipoServicio: {
    field: 'idTipoServicio',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: TIPO_SERVICIO_TABLE,
      key: 'idTipoServicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  idEquipo: {
    field: 'idEquipo',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: EQUIPO_TABLE,
      key: 'idEquipo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  idTrabajador: {
    field: 'idTrabajador',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: PERSONA_TABLE,
      key: 'idTrabajador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }
}

class Servicio extends Model {

  static associate(models) {
    this.belongsTo(models.Tipo_Servicio,{
      as: 'Tipo_Servicio',
      foreignKey: 'idTipoServicio'
    });
    this.belongsTo(models.Equipo,{
      as: 'Equipo',
      foreignKey: 'idEquipo'
    });
    this.belongsTo(models.Persona,{
      as: 'Trabajador',
      foreignKey: 'idTrabajador'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SERVICIO_TABLE,
      modelName: 'Servicio',
      timestamps: false
    }
  }
}

module.exports = { Servicio, ServicioSchema, SERVICIO_TABLE };
