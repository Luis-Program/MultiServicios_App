const express = require('express');

const ServicioService = require('./../services/servicio.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createServicioSchema,
  updateServicioSchema,
  getServicioSchema
} = require('./../schemas/servicio.schema');
const router = express.Router();
const passport = require('passport');
const service = new ServicioService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const servicios = await service.find();
      res.json(servicios);
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
      const servicios = await service.findAll();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/completados',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const servicios = await service.findCompleted();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

router.get('/pendientes',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const servicios = await service.findNotCompleted();
      res.json(servicios);
    } catch (error) {
      next(error);
    }
  });

/**
 * Obtencion de la cantidad de servicios completados, asignados, pendientes de asignar
 */
router.get('/cantidadservicios',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const data = await service.findGraphics();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

/**
 * Obtener cantidad de servicios por tipo :> [preventivo & correctivo]
 */
router.get('/cantidadportiposervicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const data = await service.findAmountByType();
      res.json(data);
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

router.patch('/:idServicio',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getServicioSchema, 'params'),
  validatorHandler(updateServicioSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idServicio
      } = req.params;
      const body = req.body;
      const servicio = await service.update(idServicio, body);
      res.json(servicio);
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
