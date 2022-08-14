const { Model, DataTypes } = require('sequelize');
const { DIRECCION_TABLE } = require('./direccion.model');
const { PERSONA_TABLE } = require('./persona.model');

const EQUIPO_TABLE = 'Equipo';

const EquipoSchema =  {
  idEquipo: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  modelo: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  estado: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  fechaUltimoServicio: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  periodoDeServicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  preventivoActivo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  idDireccion: {
    field: 'idDireccion',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: DIRECCION_TABLE,
      key: 'idDireccion'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
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
  }
}

class Equipo extends Model {

  static associate(models) {
    this.belongsTo(models.Direccion,{
      as: 'Direccion',
      foreignKey: 'idDireccion'
    });
    this.belongsTo(models.Persona,{
      as: 'Persona',
      foreignKey: 'idPersona'
    });
    this.hasMany(models.Servicio,{
      as: 'Servicio',
      foreignKey: 'idEquipo'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EQUIPO_TABLE,
      modelName: 'Equipo',
      timestamps: false
    }
  }
}

module.exports = { Equipo, EquipoSchema, EQUIPO_TABLE };
