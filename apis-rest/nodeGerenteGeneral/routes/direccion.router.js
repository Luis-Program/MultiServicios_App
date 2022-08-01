const express = require('express');

const DireccionService = require('./../services/direccion.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createDireccionSchema,
  updateDireccionSchema,
  getDireccionSchema
} = require('./../schemas/direccion.schema');
const router = express.Router();
const passport = require('passport');
const service = new DireccionService();

router.get('/relaciones',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const direcciones = await service.find();
      res.json(direcciones);
    } catch (error) {
      next(error);
    }
  });

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const direcciones = await service.findAll();
      res.json(direcciones);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idDireccion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDireccionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idDireccion
      } = req.params;
      const direccion = await service.findOne(idDireccion);
      res.json(direccion);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createDireccionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newDireccion = await service.create(body);
      res.status(201).json(newDireccion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idDireccion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDireccionSchema, 'params'),
  validatorHandler(updateDireccionSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idDireccion
      } = req.params;
      const body = req.body;
      const direccion = await service.update(idDireccion, body);
      res.json(direccion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idDireccion',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDireccionSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idDireccion
      } = req.params;
      await service.delete(idDireccion);
      res.status(201).json({
        idDireccion
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
