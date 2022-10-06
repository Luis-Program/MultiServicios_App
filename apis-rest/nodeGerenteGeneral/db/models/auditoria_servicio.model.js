const { Model, DataTypes } = require('sequelize');

const AUDITORIA_SERVICIO_TABLE = 'Auditoria_Servicio';

const Auditoria_ServicioSchema =  {
  idAuditoriaServicio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  fechaHora: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  idServicio: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  tipoServicio: {
    allowNull: false,
    type: DataTypes.STRING
  },
  prioridad: {
    allowNull: false,
    type: DataTypes.STRING
  },
  nombreEquipo: {
    allowNull: false,
    type: DataTypes.STRING
  },
  modeloEquipo: {
    allowNull: false,
    type: DataTypes.STRING
  },
  nombreCliente: {
    allowNull: false,
    type: DataTypes.STRING
  },
  dpiCliente: {
    allowNull: false,
    type: DataTypes.STRING
  },
  fechaHoraCreado: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  empresaCliente: {
    allowNull: false,
    type: DataTypes.STRING
  },
  empresaClienteNit: {
    allowNull: true,
    type: DataTypes.STRING
  },
  fechaHoraFinalizado: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  nombreTrabajador: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  dpiTrabajador: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  fechaHoraAsignadoTrabajador: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  fechaHoraRealizar: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  observaciones: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  }

class Auditoria_Servicio extends Model {

  static associate() {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AUDITORIA_SERVICIO_TABLE,
      modelName: 'Auditoria_Servicio',
      timestamps: false
    }
  }
}

module.exports = { Auditoria_Servicio, Auditoria_ServicioSchema, AUDITORIA_SERVICIO_TABLE };
