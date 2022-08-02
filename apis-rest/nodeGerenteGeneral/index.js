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
const port = process.env.PORT || 5001;

app.use(express.json());

const whitelist = ['http://localhost:4200'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No Permitido.'));
    }
  }
}
app.use(cors(options));
app.use(passport.initialize());
passport.use(bearerStrategy);

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(ormErroHandler);


app.listen(port, () => {
  console.log(`Mi port: ${port}.`);
});
