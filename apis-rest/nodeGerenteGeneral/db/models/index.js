const { Pais, PaisSchema } = require('./pais.model');
const { Departamento, DepartamentoSchema } = require('./departamento.model');
const { Municipio, MunicipioSchema } = require('./municipio.model');
const { Direccion, DireccionSchema } = require('./direccion.model');
const { Empresa, EmpresaSchema } = require('./empresa.model');
const { Tipo_Persona, Tipo_PersonaSchema } = require('./tipo_persona.model');
const { Tipo_Telefono, Tipo_TelefonoSchema } = require('./tipo_telefono.model');
const { Telefono, TelefonoSchema } = require('./telefono.model');
const { Persona, PersonaSchema } = require('./persona.model');
const { Tipo_Notificacion, Tipo_NotificacionSchema } = require('./tipo_notificacion.model');
const { Notificacion, NotificacionSchema } = require('./notificacion.model');
const { Equipo, EquipoSchema } = require('./equipo.model');
const { Tipo_Servicio, Tipo_ServicioSchema } = require('./tipo_servicio.model');
const { Servicio, ServicioSchema } = require('./servicio.model');
const { Tipo_Repuesto, Tipo_RepuestoSchema } = require('./tipo_repuesto.model');
const { Repuesto, RepuestoSchema } = require('./repuesto.model');
const { Auditoria_Servicio, Auditoria_ServicioSchema } = require('./auditoria_servicio.model');
const { Analisis_Repuesto, Analisis_RepuestoSchema } = require('./analisis_repuesto.model');

function setupModels(sequelize){
  Pais.init(PaisSchema, Pais.config(sequelize));
  Departamento.init(DepartamentoSchema, Departamento.config(sequelize));
  Municipio.init(MunicipioSchema, Municipio.config(sequelize));
  Direccion.init(DireccionSchema, Direccion.config(sequelize));
  Empresa.init(EmpresaSchema, Empresa.config(sequelize));
  Tipo_Persona.init(Tipo_PersonaSchema, Tipo_Persona.config(sequelize));
  Tipo_Telefono.init(Tipo_TelefonoSchema, Tipo_Telefono.config(sequelize));
  Telefono.init(TelefonoSchema, Telefono.config(sequelize));
  Persona.init(PersonaSchema, Persona.config(sequelize));
  Tipo_Notificacion.init(Tipo_NotificacionSchema, Tipo_Notificacion.config(sequelize));
  Notificacion.init(NotificacionSchema, Notificacion.config(sequelize));
  Equipo.init(EquipoSchema, Equipo.config(sequelize));
  Tipo_Servicio.init(Tipo_ServicioSchema, Tipo_Servicio.config(sequelize));
  Servicio.init(ServicioSchema, Servicio.config(sequelize));
  Tipo_Repuesto.init(Tipo_RepuestoSchema, Tipo_Repuesto.config(sequelize));
  Repuesto.init(RepuestoSchema, Repuesto.config(sequelize));
  Auditoria_Servicio.init(Auditoria_ServicioSchema, Auditoria_Servicio.config(sequelize));
  Analisis_Repuesto.init(Analisis_RepuestoSchema, Analisis_Repuesto.config(sequelize));

  Pais.associate(sequelize.models);
  Departamento.associate(sequelize.models);
  Municipio.associate(sequelize.models);
  Direccion.associate(sequelize.models);
  Empresa.associate(sequelize.models);
  Tipo_Persona.associate(sequelize.models);
  Tipo_Telefono.associate(sequelize.models);
  Telefono.associate(sequelize.models);
  Persona.associate(sequelize.models);
  Tipo_Notificacion.associate(sequelize.models);
  Notificacion.associate(sequelize.models);
  Equipo.associate(sequelize.models);
  Tipo_Servicio.associate(sequelize.models);
  Servicio.associate(sequelize.models);
  Tipo_Repuesto.associate(sequelize.models);
  Repuesto.associate(sequelize.models);
  Auditoria_Servicio.associate(sequelize.models);
  Analisis_Repuesto.associate(sequelize.models);
}

module.exports = setupModels;
