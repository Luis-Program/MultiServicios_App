const express = require('express');

const ServicioService = require('./../services/servicio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  getServicioSchema,
  createServicioSchema,
  paramIdEquipoSchema,
  getAllServicioSchemaByIdPerson
} = require('./../schemas/servicio.schema');
const router = express.Router();
const passport = require('passport');
const service = new ServicioService();

router.get('/idpersona/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllServicioSchemaByIdPerson, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const servicios = await service.findAll(idPersona);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/idequipo/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const servicios = await service.find(idEquipo);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  router.get('/completados/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const servicios = await service.findCompleted(idEquipo);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  router.get('/graficapenfin/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getAllServicioSchemaByIdPerson, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      const servicios = await service.findAllGraphic(idPersona);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  router.get('/graficaequipo/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const servicios = await service.findOneGraphic(idEquipo);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

  router.get('/pendientes/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(paramIdEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const servicios = await service.findNotCompleted(idEquipo);
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idServicio
      } = req.params;
      const servicio = await service.findOne(idServicio);
      res.json(servicio);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createServicioSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newServicio = await service.create(body);
      res.status(201).json(newServicio);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getServicioSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idServicio
      } = req.params;
      await service.delete(idServicio);
      res.status(201).json({
        idServicio
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
