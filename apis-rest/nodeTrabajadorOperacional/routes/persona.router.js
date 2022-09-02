const express = require('express');

const PersonaService = require('./../services/persona.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getPersonaSchema,
  getPersonaBySchema,
  updatePersonaSchema
} = require('./../schemas/persona.schema');
const router = express.Router();
const passport = require('passport');
const service = new PersonaService();

router.get('/correo/:correo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaBySchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        correo
      } = req.params;
      const persona = await service.find(correo);
      res.json(persona);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const persona = await service.findOne(idPersona);
      res.json(persona);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const persona = await service.findAll();
      res.json(persona);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  validatorHandler(updatePersonaSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const body = req.body;
      const persona = await service.update(idPersona, body);
      res.json(persona);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
