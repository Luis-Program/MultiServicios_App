const express = require('express');

const PaisService = require('./../services/pais.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createPaisSchema,
  updatePaisSchema,
  getPaisSchema
} = require('./../schemas/pais.schema');
const router = express.Router();
const passport = require('passport');
const service = new PaisService();

router.get('/',
  async (req, res, next) => {
    try {
      const pais = await service.find(req.query);
      res.json(pais);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idPais',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPaisSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPais
      } = req.params;
      const pais = await service.findOne(idPais);
      res.json(pais);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createPaisSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newPais = await service.create(body);
      res.status(201).json(newPais);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idPais',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPaisSchema, 'params'),
  validatorHandler(updatePaisSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idPais
      } = req.params;
      const body = req.body;
      const pais = await service.update(idPais, body);
      res.json(pais);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idPais',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPaisSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPais
      } = req.params;
      await service.delete(idPais);
      res.status(201).json({
        idPais
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
