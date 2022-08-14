const express = require('express');

const DepartamentoService = require('./../services/departamento.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createDepartamentoSchema,
  updateDepartamentoSchema,
  getDepartamentoSchema
} = require('./../schemas/departamento.schema');
const router = express.Router();
const passport = require('passport');
const service = new DepartamentoService();

router.get('/relaciones',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const departamentos = await service.findAllRelations();
      res.json(departamentos);
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
      const departamentos = await service.findAll();
      res.json(departamentos);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idDepartamento',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDepartamentoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idDepartamento
      } = req.params;
      const departamento = await service.findOne(idDepartamento);
      res.json(departamento);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createDepartamentoSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newDepartamento = await service.create(body);
      res.status(201).json(newDepartamento);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idDepartamento',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDepartamentoSchema, 'params'),
  validatorHandler(updateDepartamentoSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idDepartamento
      } = req.params;
      const body = req.body;
      const departamento = await service.update(idDepartamento, body);
      res.json(departamento);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idDepartamento',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getDepartamentoSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idDepartamento
      } = req.params;
      await service.delete(idDepartamento);
      res.status(201).json({
        idDepartamento
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
