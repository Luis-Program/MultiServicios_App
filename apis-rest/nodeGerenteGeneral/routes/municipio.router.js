const express = require('express');

const MunicipioService = require('./../services/municipio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createMunicipioSchema,
  updateMunicipioSchema,
  getMunicipioSchema
} = require('./../schemas/municipio.schema');
const router = express.Router();
const passport = require('passport');
const service = new MunicipioService();

router.get('/relaciones',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const municipios = await service.find();
      res.json(municipios);
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
      const municipios = await service.findAll();
      res.json(municipios);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idMunicipio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getMunicipioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idMunicipio
      } = req.params;
      const municipio = await service.findOne(idMunicipio);
      res.json(municipio);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createMunicipioSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newMunicipio = await service.create(body);
      res.status(201).json(newMunicipio);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idMunicipio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getMunicipioSchema, 'params'),
  validatorHandler(updateMunicipioSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idMunicipio
      } = req.params;
      const body = req.body;
      const municipio = await service.update(idMunicipio, body);
      res.json(municipio);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idMunicipio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getMunicipioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idMunicipio
      } = req.params;
      await service.delete(idMunicipio);
      res.status(201).json({
        idMunicipio
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
