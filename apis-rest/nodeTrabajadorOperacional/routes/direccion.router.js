const express = require('express');

const DireccionService = require('./../services/direccion.service');
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

module.exports = router;
