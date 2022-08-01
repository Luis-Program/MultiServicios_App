const express = require('express');
const paisesRouter = require('./pais.router');
const departamentosRouter = require('./departamento.router');
const municipiosRouter = require('./municipio.router');
const direccionesRouter = require('./direccion.router');
const empresasRouter = require('./empresa.router');
const tiposPersonasRouter = require('./tipo_persona.router');
const tiposTelefonosRouter = require('./tipo_telefono.router');
const telefonosRouter = require('./telefono.router');
const personasRouter = require('./persona.router');
const tiposNotificacionesRouter = require('./tipo_notificacion.router');
const notificacionesRouter = require('./notificacion.router');
const equiposRouter = require('./equipo.router');
const tiposServiciosRouter = require('./tipo_servicio.router');
const serviciosRouter = require('./servicio.router');
const tiposRepuestosRouter = require('./tipo_repuesto.router');
const repuestosRouter = require('./repuesto.router');
const auditoriaServiciosRouter = require('./auditoria_servicio.router');
const analisisRepuestosRouter = require('./analisis_repuesto.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/paises', paisesRouter);
  router.use('/departamentos', departamentosRouter);
  router.use('/municipios', municipiosRouter);
  router.use('/direcciones', direccionesRouter);
  router.use('/empresas', empresasRouter);
  router.use('/tipospersonas', tiposPersonasRouter);
  router.use('/tipostelefonos', tiposTelefonosRouter);
  router.use('/telefonos', telefonosRouter);
  router.use('/personas', personasRouter);
  router.use('/tiposnotificaciones', tiposNotificacionesRouter);
  router.use('/notificaciones', notificacionesRouter);
  router.use('/equipos', equiposRouter);
  router.use('/tiposservicios', tiposServiciosRouter);
  router.use('/servicios', serviciosRouter);
  router.use('/tiposrepuestos', tiposRepuestosRouter);
  router.use('/repuestos', repuestosRouter);
  router.use('/auditoriaservicios', auditoriaServiciosRouter);
  router.use('/analisisrepuestos', analisisRepuestosRouter);
}

module.exports = routerApi;
