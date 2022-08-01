const express = require('express');

const EmpresaService = require('../services/empresa.service.js');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createEmpresaSchema,
  updateEmpresaSchema,
  getEmpresaSchema
} = require('./../schemas/empresa.schema');
const router = express.Router();
const passport = require('passport');
const service = new EmpresaService();

router.get('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const empresa = await service.find(req.query);
      res.json(empresa);
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
      const empresas = await service.findAllWithRelations();
      res.json(empresas);
    } catch (error) {
      next(error);
    }
  });

router.get('/maxminclientesempresa',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  async (req, res, next) => {
    try {
      const empresa = await service.findMinMaxClient(req.query);
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  });

router.get('/:idEmpresa',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEmpresaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEmpresa
      } = req.params;
      const empresa = await service.findOne(idEmpresa);
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(createEmpresaSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newEmpresa = await service.create(body);
      res.status(201).json(newEmpresa);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:idEmpresa',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEmpresaSchema, 'params'),
  validatorHandler(updateEmpresaSchema, 'body'),
  async (req, res, next) => {
    try {
      const {
        idEmpresa
      } = req.params;
      const body = req.body;
      const empresa = await service.update(idEmpresa, body);
      res.json(empresa);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:idEmpresa',
  passport.authenticate('oauth-bearer', {
    session: false
  }),
  validatorHandler(getEmpresaSchema, 'params'),
  async (req, res, next) => {
    try {
      const {
        idEmpresa
      } = req.params;
      await service.delete(idEmpresa);
      res.status(201).json({
        idEmpresa
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
