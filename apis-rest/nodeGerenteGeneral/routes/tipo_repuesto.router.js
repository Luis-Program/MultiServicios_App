const express = require('express');

const Tipo_RepuestoService = require('./../services/tipo_repuesto.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getTipo_RepuestoSchema,
  createTipo_RepuestoSchema,
  updateTipo_RepuestoSchema
} = require('./../schemas/tipo_repuesto.schema');
const router = express.Router();
const passport = require('passport');
const service = new Tipo_RepuestoService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const tiposRepuestos = await service.find();
      res.json(tiposRepuestos);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idTipoRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_RepuestoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoRepuesto
      } = req.params;
      const tipoRepuesto = await service.findOne(idTipoRepuesto);
      res.json(tipoRepuesto);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTipo_RepuestoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTipoRepuesto = await service.create(body);
      res.status(201).json(newTipoRepuesto);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTipoRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_RepuestoSchema, 'params'),
  validatorHandler(updateTipo_RepuestoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTipoRepuesto
      } = req.params;
      const body = req.body;
      const tipoRepuesto = await service.update(idTipoRepuesto, body);
      res.json(tipoRepuesto);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTipoRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_RepuestoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoRepuesto
      } = req.params;
      await service.delete(idTipoRepuesto);
      res.status(201).json({
        idTipoRepuesto
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
