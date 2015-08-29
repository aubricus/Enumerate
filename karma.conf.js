// Karma configuration

module.exports = function(config) {
  config.set({

    basePath: "./",

    frameworks: ["jasmine"],

    files: [
      "spec/vendor/underscore/underscore.js",
      "spec/vendor/jquery/jquery.js",
      "spec/vendor/jasmine/jasmine-jquery.js",
      "spec/**/*-spec.js",
      "build/enumerate.js"
    ],

    exclude: [
      "spec/**/*-node-spec.js",
      "spec/**/*-amd-spec.js"
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
