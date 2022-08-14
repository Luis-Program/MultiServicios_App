const express = require('express');

const TelefonoService = require('./../services/telefono.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getTelefonoSchema,
  updateTelefonoSchema,
  createTelefonoSchema,
  getTelefonoByIdTelefonoSchema
} = require('./../schemas/telefono.schema');
const router = express.Router();
const passport = require('passport');
const service = new TelefonoService();

router.get('/idPersona/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTelefonoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const telefonos = await service.find(idPersona);
      res.json(telefonos);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTelefonoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTelefono = await service.create(body);
      res.status(201).json(newTelefono);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTelefono',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTelefonoByIdTelefonoSchema, 'params'),
  validatorHandler(updateTelefonoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTelefono
      } = req.params;
      const body = req.body;
      const telefono = await service.update(idTelefono, body);
      res.json(telefono);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTelefono',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTelefonoByIdTelefonoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTelefono
      } = req.params;
      await service.delete(idTelefono);
      res.status(201).json({
        idTelefono
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
