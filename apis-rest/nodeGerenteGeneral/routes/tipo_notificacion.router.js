const express = require('express');

const Tipo_NotificacionService = require('./../services/tipo_notificacion.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createTipo_NotificacionSchema,
  updateTipo_NotificacionSchema,
  getTipo_NotificacionSchema
} = require('./../schemas/tipo_notificacion.schema');
const router = express.Router();
const passport = require('passport');
const service = new Tipo_NotificacionService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const tiposNotificaciones = await service.find();
      res.json(tiposNotificaciones);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idTipoNotificacion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_NotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoNotificacion
      } = req.params;
      const tipoNotificacion = await service.findOne(idTipoNotificacion);
      res.json(tipoNotificacion);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTipo_NotificacionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTipoNotificacion = await service.create(body);
      res.status(201).json(newTipoNotificacion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTipoNotificacion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_NotificacionSchema, 'params'),
  validatorHandler(updateTipo_NotificacionSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTipoNotificacion
      } = req.params;
      const body = req.body;
      const tipoNotificacion = await service.update(idTipoNotificacion, body);
      res.json(tipoNotificacion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTipoNotificacion',
  validatorHandler(getTipo_NotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoNotificacion
      } = req.params;
      await service.delete(idTipoNotificacion);
      res.status(201).json({
        idTipoNotificacion
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
