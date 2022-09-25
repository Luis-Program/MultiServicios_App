const express = require('express');

const NotificacionService = require('./../services/notificacion.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  updateNotificacionSchema,
  getNotificacionSchema,
  getAllNotificacionSchema
} = require('./../schemas/notificacion.schema');
const router = express.Router();
const passport = require('passport');
const service = new NotificacionService();

router.get('/persona/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllNotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const notificaciones = await service.find(idPersona);
      res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  });

router.get('/visto/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllNotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const done = await service.updateReadAllNotifications(idPersona);
      res.json(done);
    } catch (error) {
      next(error);
    }
  });

router.patch('/:idNotificacion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getNotificacionSchema, 'params'),
  validatorHandler(updateNotificacionSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idNotificacion
      } = req.params;
      const body = req.body;
      const notificacion = await service.update(idNotificacion, body);
      res.json(notificacion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/eliminar/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllNotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const done = await service.deleteAllNotifications(idPersona);
      res.json(done);
    } catch (error) {
      next(error);
    }
  });

router.patch('/:idNotificacion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getNotificacionSchema, 'params'),
  validatorHandler(updateNotificacionSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idNotificacion
      } = req.params;
      const body = req.body;
      const notificacion = await service.update(idNotificacion, body);
      res.json(notificacion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idNotificacion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getNotificacionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idNotificacion
      } = req.params;
      await service.delete(idNotificacion);
      res.status(201).json({
        idNotificacion
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
