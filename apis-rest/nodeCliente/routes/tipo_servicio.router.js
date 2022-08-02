const express = require('express');

const Tipo_ServicioService = require('./../services/tipo_servicio.service');
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

module.exports = router;
