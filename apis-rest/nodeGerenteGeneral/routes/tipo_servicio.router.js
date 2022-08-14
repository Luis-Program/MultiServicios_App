const express = require('express');

const Tipo_ServicioService = require('./../services/tipo_servicio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createTipo_ServicioSchema,
  updateTipo_ServicioSchema,
  getTipo_ServicioSchema
} = require('./../schemas/tipo_servicio.schema');
const router = express.Router();
const passport = require('passport');
const service = new Tipo_ServicioService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const tipos_servicios = await service.find();
      res.json(tipos_servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idTipoServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_ServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoServicio
      } = req.params;
      const tipo_servicio = await service.findOne(idTipoServicio);
      res.json(tipo_servicio);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTipo_ServicioSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTipo_Servicio = await service.create(body);
      res.status(201).json(newTipo_Servicio);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTipoServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_ServicioSchema, 'params'),
  validatorHandler(updateTipo_ServicioSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTipoServicio
      } = req.params;
      const body = req.body;
      const tipo_servicio = await service.update(idTipoServicio, body);
      res.json(tipo_servicio);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTipoServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_ServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoServicio
      } = req.params;
      await service.delete(idTipoServicio);
      res.status(201).json({
        idTipoServicio
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
