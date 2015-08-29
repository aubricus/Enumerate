// Karma configuration

module.exports = function(config) {
  config.set({

    basePath: "./",

    frameworks: ['jasmine', 'requirejs'],

    files: [
      {pattern: 'spec/vendor/**/*.js', included: false, served: true},
      {pattern: 'build/enumerate.js', included: false, served: true},
      {pattern: 'spec/**/*-amd-spec.js', included: false, served: true},

      "test-main.js"
    ],

    exclude: [
    ],

    reporters: ["dots"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false
  });
};
