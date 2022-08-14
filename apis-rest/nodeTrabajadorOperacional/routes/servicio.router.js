const express = require('express');
const ServicioService = require('./../services/servicio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  updateServicioSchema,
  getServicioSchema,
  getAllServicioSchema,
  paramIdTrabajadorSchema
} = require('./../schemas/servicio.schema');
const router = express.Router();
const passport = require('passport');
const service = new ServicioService();

router.get('/idTrabajador/:idTrabajador',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const servicios = await service.find(req);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/trabajador/:idTrabajador',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTrabajador
      } = req.params;
      const servicios = await service.findWorkerServicesAmount(idTrabajador);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  router.get('/completados/:idTrabajador',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdTrabajadorSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTrabajador
      } = req.params;
      const servicios = await service.findCompleted(idTrabajador);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/pendientes/:idTrabajador',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdTrabajadorSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTrabajador
      } = req.params;
      const servicios = await service.findNotCompleted(idTrabajador);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idServicio
      } = req.params;
      const servicio = await service.findOne(idServicio);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getServicioSchema, 'params'),
  validatorHandler(updateServicioSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idServicio
      } = req.params;
      const body = req.body;
      const servicio = await service.update(idServicio, body);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
