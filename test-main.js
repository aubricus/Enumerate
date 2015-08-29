var tests = [
    "spec/enumerate-amd-spec"
];

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: "/base",

  paths:{
        "jasmine": "spec/vendor/jasmine",
        "jquery": "spec/vendor/jquery/jquery",
        "underscore": "spec/vendor/underscore/underscore",
        "enumerate": "build/enumerate"
    },

    shim: {
        "jasmine/jasmine-jquery": {
            "deps": ["jquery"]
        },
    },

  deps: tests,

  callback: window.__karma__.start
});
