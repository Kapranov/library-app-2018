'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'library-app',
    environment,
    rootURL: '/',
    locationType: 'auto',

    // Initialize Firebase
    // Visit https://console.firebase.google.com/
    firebase: {
      apiKey: 'UPDATE-THIS-TO-YOUR-OWN-API-KEY',
      authDomain: 'UPDATE-THIS-TO-YOUR-OWN-FIREBASE-APP.firebaseapp.com',
      databaseURL: 'https://UPDATE-THIS-TO-YOUR-OWN-FIREBASE-APP.firebaseio.com',
      projectId: 'UPDATE-THIS-TO-YOUR-OWN-PROJECT-ID',
      storageBucket: 'UPDATE-THIS-TO-YOUR-OWN-FIREBASE-APP.appspot.com',
      messagingSenderId: 'UPDATE-THIS'
    },

    contentSecurityPolicy: {
      'script-src': "'self' 'unsafe-eval' apis.google.com",
      'frame-src': "'self' https://*.firebaseapp.com",
      'connect-src': "'self' wss://*.firebaseio.com https://*.googleapis.com"
    },

    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },

    APP: {}
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';

    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {

    ENV['ember-faker'] = {
      enabled: true
    };
  }

  return ENV;
};
