/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */


import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signIn: "b2c_1_sign_in",
    resetPassword: "b2c_1_reset_password"
  },
  authorities: {
    signIn: {
      authority: "https://multiserviciosguate.b2clogin.com/multiserviciosguate.onmicrosoft.com/b2c_1_sign_in",
    },
    resetPassword: {
      authority: "https://multiserviciosguate.b2clogin.com/multiserviciosguate.onmicrosoft.com/b2c_1_reset_password"
    }
  },
  authorityDomain: "multiserviciosguate.b2clogin.com"
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: 'a05bc22a-7f5c-4fbe-8ef1-7fb58fca0b19', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signIn.authority, // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: 'http://localhost:4200/home', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        // console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
}

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  manager: {
    // endpoint: "https://api-manager-multiservicios.azurewebsites.net",
    endpoint: "http://localhost:5001",
    scopes: ["https://multiserviciosguate.onmicrosoft.com/api-manager/api-manager.read"],
  },
  employee: {
    // endpoint: "https://api-employee-multiservicios.azurewebsites.net",
    endpoint: "http://localhost:5002",
    scopes: ["https://multiserviciosguate.onmicrosoft.com/api-employee/api-employee.read"],
  },
  client: {
    // endpoint: "https://api-client-multiservicios.azurewebsites.net",
    endpoint: "http://localhost:5003",
    scopes: ["https://multiserviciosguate.onmicrosoft.com/api-client/api-client.read"],
  },
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: []
};
