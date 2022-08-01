const express = require('express');

const EquipoService = require('./../services/equipo.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  updateEquipoSchema,
  getEquipoSchema,
  queryEquipoSchema
} = require('./../schemas/equipo.schema');
const router = express.Router();
const passport = require('passport');
const {
  getPersonaSchema
} = require('../schemas/persona.schema');
const service = new EquipoService();

router.get('/idpersona/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(queryEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const equipos = await service.find(idPersona);
      res.json(equipos);
    } catch (error) {
      next(error);
    }
  });

/**
 * Obtencion de los servicios pendientes y finalizados por idEquipo
 */
router.get('/servicios/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const equipo = await service.findActiveInactive(idPersona);
      res.json(equipo);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Trae la cantidad de equipos activos e inactivos por idPersona
 */
router.get('/cantidadactivoinactivo/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const equipos = await service.findAllActiveInactiveByIdPersona(idPersona);
      res.json(equipos);
    } catch (error) {
      next(error);
    }
  });

/**
 * Obtencion de los equipos con más y menos servicios
 */
router.get('/equipomenormayorserivicios/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const response = await service.findEquipmentWithMoreLessServices(idPersona);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const equipo = await service.findOne(idEquipo);
      res.json(equipo);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEquipoSchema, 'params'),
  validatorHandler(updateEquipoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const body = req.body;
      const equipo = await service.update(idEquipo, body);
      res.json(equipo);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
