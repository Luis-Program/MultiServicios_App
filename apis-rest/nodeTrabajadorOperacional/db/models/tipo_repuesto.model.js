const { Model, DataTypes } = require('sequelize');

const TIPO_REPUESTO_TABLE = 'Tipo_Repuesto';

const Tipo_RepuestoSchema =  {
  idTipoRepuesto: {
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

class Tipo_Repuesto extends Model {

  static associate(models) {
    this.hasMany(models.Repuesto,{
      as: 'Repuesto',
      foreignKey: 'idTipoRepuesto'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIPO_REPUESTO_TABLE,
      modelName: 'Tipo_Repuesto',
      timestamps: false
    }
  }
}

module.exports = { Tipo_Repuesto, Tipo_RepuestoSchema, TIPO_REPUESTO_TABLE };
