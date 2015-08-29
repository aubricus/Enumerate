var gulp   = require("gulp");
var umd    = require("gulp-umd");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var jshint = require("gulp-jshint");
var run    = require("gulp-run");

var karma = require("karma");
var KarmaServer = karma.Server;

var _ = require("underscore");

var umdConfig = {
    exports: function(file) { return "exports"; },
    dependencies: function(file) {
        return [
            {
                name: "_",
                amd: "underscore",
                cjs: "underscore",
                global: "_",

            }
        ];
    },
};

function doUmd () {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(umd(umdConfig));
};

function getKarmaServer (done, options) {
    var defaults = { configFile: __dirname + "/karma.conf.js" };
    var config = _.extend({}, defaults, options || {});

    return new KarmaServer(config, done);
};

gulp.task("lint", function() {
    return gulp.src("src/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("umd", function() {
    return doUmd()
        .pipe(gulp.dest("build"));
});

gulp.task("node-main", function() {
    return doUmd()
        .pipe(rename('index.js'))
        .pipe(gulp.dest("./"));
});

gulp.task("minify", function() {
    return doUmd()
        .pipe(uglify())
        .pipe(concat("enumerate.min.js"))
        .pipe(gulp.dest("build"));
});

gulp.task("bundle", ["umd"], function() {
    return gulp.src([
        "build/enumerate.js",
        "vendor/underscore/underscore.js"
    ])
    .pipe(uglify())
    .pipe(concat("enumerate.bundled.min.js"))
    .pipe(gulp.dest("build"));
});

gulp.task("tdd", function(done) {
    gulp.watch("src/enumerate.js", ["umd"]);
    getKarmaServer(done).start();
});

gulp.task("test-browser", function(done) {
    getKarmaServer(done, {singleRun: true}).start();
});

gulp.task("test-node", function() {
    return run("jasmine").exec();
});

gulp.task("test-amd", function(done) {
    getKarmaServer(done, {
        singleRun: true,
        configFile: __dirname + "/karma.amd.conf.js"
    })
    .start();
});

gulp.task("publish-npm", function(done) {
    return run("npm publish").exec();
});

gulp.task("publish-bower", function() {
    return run("bower register enumerate git://github.com/aubricus/Enumerate.git").exec();
})

gulp.task("test", ["test-browser", "test-node", "test-amd"]);

gulp.task("build", ["umd", "node-main", "minify", "bundle"]);

gulp.task("publish", ["publish-npm", "publish-bower"]);

gulp.task("default", ["build", "test"]);

