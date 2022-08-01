const express = require('express');

const RepuestoService = require('./../services/repuesto.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getRepuestoSchema,
  updateRepuestoSchema
} = require('./../schemas/repuesto.schema');
const router = express.Router();
const passport = require('passport');
const service = new RepuestoService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const repuestos = await service.find();
      res.json(repuestos);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getRepuestoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idRepuesto
      } = req.params;
      const repuesto = await service.findOne(idRepuesto);
      res.json(repuesto);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getRepuestoSchema, 'params'),
  validatorHandler(updateRepuestoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idRepuesto
      } = req.params;
      const body = req.body;
      const repuesto = await service.update(idRepuesto, body);
      res.json(repuesto);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
