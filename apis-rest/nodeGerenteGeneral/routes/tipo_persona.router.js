const express = require('express');

const Tipo_PersonaService = require('./../services/tipo_persona.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createTipo_PersonaSchema,
  updateTipo_PersonaSchema,
  getTipo_PersonaSchema,
  getTipo_PersonaTipoSchema
} = require('./../schemas/tipo_persona.schema');
const router = express.Router();
const passport = require('passport');
const service = new Tipo_PersonaService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_PersonaTipoSchema, 'query'),
  async (req, res, next) => {
    try {
      const {
        tipo
      } = req.query;
      const tipos_personas = await service.findAll(tipo);
      res.json(tipos_personas);
    } catch (error) {
      next(error);
    }
  });

router.get('/relaciones',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const tipos_personas = await service.find();
      res.json(tipos_personas);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idTipoPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_PersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoPersona
      } = req.params;
      const tipo_persona = await service.findOne(idTipoPersona);
      res.json(tipo_persona);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createTipo_PersonaSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newTipo_Persona = await service.create(body);
      res.status(201).json(newTipo_Persona);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idTipoPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_PersonaSchema, 'params'),
  validatorHandler(updateTipo_PersonaSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idTipoPersona
      } = req.params;
      const body = req.body;
      const tipo_persona = await service.update(idTipoPersona, body);
      res.json(tipo_persona);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idTipoPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTipo_PersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTipoPersona
      } = req.params;
      await service.delete(idTipoPersona);
      res.status(201).json({
        idTipoPersona
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
