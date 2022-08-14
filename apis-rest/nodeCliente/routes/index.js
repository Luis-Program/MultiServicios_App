const express = require('express');
const telefonosRouter = require('./telefono.router');
const personasRouter = require('./persona.router');
const notificacionesRouter = require('./notificacion.router');
const serviciosRouter = require('./servicio.router');
const equiposRouter = require('./equipo.router');
const tiposServiciosRouter = require('./tipo_servicio.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/telefonos', telefonosRouter);
  router.use('/personas', personasRouter);
  router.use('/notificaciones', notificacionesRouter);
  router.use('/servicios', serviciosRouter);
  router.use('/equipos', equiposRouter);
  router.use('/tiposservicios', tiposServiciosRouter);
}

module.exports = routerApi;
