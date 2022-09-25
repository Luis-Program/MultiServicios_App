const express = require('express');
const telefonosRouter = require('./telefono.router');
const personasRouter = require('./persona.router');
const notificacionesRouter = require('./notificacion.router');
const serviciosRouter = require('./servicio.router');
const repuestosRouter = require('./repuesto.router');
const direccionesRouter = require('./direccion.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/telefonos', telefonosRouter);
  router.use('/personas', personasRouter);
  router.use('/notificaciones', notificacionesRouter);
  router.use('/servicios', serviciosRouter);
  router.use('/repuestos', repuestosRouter);
  router.use('/direcciones', direccionesRouter);
}

module.exports = routerApi;
