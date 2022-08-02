const express = require('express');

const Analisis_RepuestoService = require('./../services/analisis_repuesto.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { getAnalisisRepuestoSchema, getAnalisisRepuestoByName} = require('./../schemas/analisis_repuesto.schema');
const router = express.Router();
const passport = require('passport');
const service = new Analisis_RepuestoService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const analisisRepuestos = await service.find();
      res.json(analisisRepuestos);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idAnalisisRepuesto',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAnalisisRepuestoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idAnalisisRepuesto
      } = req.params;
      const analisisRepuesto = await service.findOne(idAnalisisRepuesto);
      res.json(analisisRepuesto);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/nombrerepuesto/:nombreRepuesto',
  // passport.authenticate('oauth-bearer', {
  //   session: false
  // }),
  validatorHandler(getAnalisisRepuestoByName, 'params'),
  async (req, res, next) => {
    try {
      const {
        nombreRepuesto
      } = req.params;
      const analisisRepuestos = await service.findAllByName(nombreRepuesto);
      res.json(analisisRepuestos);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
