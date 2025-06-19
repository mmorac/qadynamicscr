import { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'e3188c9f-7dde-43cf-b4e2-76173455c75e', // Reemplaza con el Client ID de tu App Registration
    authority: 'https://login.microsoftonline.com/common', // "common" para cuentas personales y organizativas
    redirectUri: 'http://localhost:3000', // Debe coincidir con Azure
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'Calendars.Read'], // Permisos para leer perfil y calendario
};