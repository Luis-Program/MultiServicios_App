const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const passport = require('passport');

const { logErrors, errorHandler, boomErrorHandler, ormErroHandler } = require('./middlewares/error.handler');

const config = require('./auth/auth.config.json');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

const optionsAuth = {
  identityMetadata: `https://${config.credentials.tenantName}.b2clogin.com/${config.credentials.tenantName}.onmicrosoft.com/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
  clientID: config.credentials.clientID,
  audience: config.credentials.clientID,
  policyName: config.policies.policyName,
  isB2C: config.settings.isB2C,
  validateIssuer: config.settings.validateIssuer,
  loggingLevel: config.settings.loggingLevel,
  passReqToCallback: config.settings.passReqToCallback
}

const bearerStrategy = new BearerStrategy(optionsAuth, (token, done) => {
  done(null, {}, token);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());
app.use(passport.initialize());
passport.use(bearerStrategy);

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(ormErroHandler);


app.listen(port);
