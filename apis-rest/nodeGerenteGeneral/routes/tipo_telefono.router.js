const express = require('express');

const Tipo_TelefonoService = require('./../services/tipo_telefono.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createTipo_TelefonoSchema,
  updateTipo_TelefonoSchema,
  getTipo_TelefonoSchema
} = require('./../schemas/tipo_telefono.schema');
const router = express.Router();
const passport = require('passport');
const service = new Tipo_TelefonoService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const tipoTelefono = await service.find(req.query);
      res.json(tipoTelefono);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idTipoTelefono',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_TelefonoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoTelefono
      } = req.params;
      const tipoTelefono = await service.findOne(idTipoTelefono);
      res.json(tipoTelefono);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTipo_TelefonoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTipoTelefono = await service.create(body);
      res.status(201).json(newTipoTelefono);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTipoTelefono',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_TelefonoSchema, 'params'),
  validatorHandler(updateTipo_TelefonoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTipoTelefono
      } = req.params;
      const body = req.body;
      const tipoTelefono = await service.update(idTipoTelefono, body);
      res.json(tipoTelefono);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTipoTelefono',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_TelefonoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoTelefono
      } = req.params;
      await service.delete(idTipoTelefono);
      res.status(201).json({
        idTipoTelefono
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
