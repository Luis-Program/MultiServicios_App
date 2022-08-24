const express = require('express');

const EquipoService = require('./../services/equipo.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createEquipoSchema,
  updateEquipoSchema,
  getEquipoSchema
} = require('./../schemas/equipo.schema');
const router = express.Router();
const passport = require('passport');
const service = new EquipoService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const equipos = await service.findAll();
      res.json(equipos);
    } catch (error) {
      next(error);
    }
  });

  router.get('/dropdown',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const equipos = await service.findAllDropDown();
      res.json(equipos);
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
      const equipos = await service.find();
      res.json(equipos);
    } catch (error) {
      next(error);
    }
  });

/**
 * Trae la cantidad de equipos activos e inactivos
 */
router.get('/cantidadactivoinactivo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const equipos = await service.findAllActiveInactive();
      res.json(equipos);
    } catch (error) {
      next(error);
    }
  });

/**
 * Obtencion de los servicios pendientes y completados por idEquipo
 */
router.get('/servicioscompen/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      const response = await service.findOneCompletedPendent(idEquipo);
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

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createEquipoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newEquipo = await service.create(body);
      res.status(201).json(newEquipo);
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

router.delete('/:idEquipo',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEquipoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEquipo
      } = req.params;
      await service.delete(idEquipo);
      res.status(201).json({
        idEquipo
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
