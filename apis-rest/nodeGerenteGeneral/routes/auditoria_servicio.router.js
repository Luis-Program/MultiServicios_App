const express = require('express');

const Auditoria_ServicioService = require('./../services/auditoria_servicio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const getAuditoria_ServicioSchema = require('./../schemas/auditoria_servicio.schema');
const router = express.Router();
const passport = require('passport');
const service = new Auditoria_ServicioService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const auditoriaServicios = await service.find();
      res.json(auditoriaServicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idAuditoriaServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAuditoria_ServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idAuditoriaServicio
      } = req.params;
      const auditoriaServicio = await service.findOne(idAuditoriaServicio);
      res.json(auditoriaServicio);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
