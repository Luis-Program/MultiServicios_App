const express = require('express');

const PersonaService = require('./../services/persona.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createPersonaSchema,
  updatePersonaSchema,
  getPersonaSchema,
  getPersonaBySchema,
  getTrabajadorServiciosSchema
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

router.get('/workersdropdown',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const trabajadores = await service.findAllWorkersDropDown();
      res.json(trabajadores);
    } catch (error) {
      next(error);
    }
  }
);


/***
 * Obtiene todos las personas para el dropdown telefono
 */
router.get('/dropdown',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const personas = await service.findAllPersonDropdown();
      res.json(personas);
    } catch (error) {
      next(error);
    }
  }
);

/***
 * Obtiene los trabajadores con la cantidad de servicios
 */
router.get('/trabajadores',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const trabajadores = await service.findAllWorkersWithServicesCount();
      res.json(trabajadores);
    } catch (error) {
      next(error);
    }
  }
);

/***
 * Obtiene todos los clientes
 */
router.get('/clientes',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const clientes = await service.findAllClients();
      res.json(clientes);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Trae los clientes con mayor y menor cantidad de equipos
 */
router.get('/personasminmaxequipos',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const trabajadores = await service.findAmountEquipsMinMax();
      res.json(trabajadores);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Ségun idTrabajador trae los servicios finalizados y pendientes
 */
router.get('/trabajador/:idTrabajador',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getTrabajadorServiciosSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idTrabajador
      } = req.params;
      const trabajadores = await service.findWorkerServicesAmount(idTrabajador);
      res.json(trabajadores);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/relaciones',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const personas = await service.findAll();
      res.json(personas);
    } catch (error) {
      next(error);
    }
  });

/**
 * Trae los trabajadores con la mayor y menor cantidad de servicios
 */
router.get('/personaservices',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const personas = await service.findPersonMLServices();
      res.json(personas);
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
      const personas = await service.find();
      res.json(personas);
    } catch (error) {
      next(error);
    }
  });

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

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createPersonaSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newPersona = await service.create(body);
      res.status(201).json(newPersona);
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
  }
);

router.delete('/:idPersona',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getPersonaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idPersona
      } = req.params;
      await service.delete(idPersona);
      res.status(201).json({
        idPersona
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
