var gulp = require('gulp');
var less = require('gulp-less');
var gutil = require('gulp-util');
var path = require('path');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var stringify = require('stringify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var livereload = require('gulp-livereload');

var dependencies = ['q', 'lodash'];

gulp.task('vendors', function() {
	return browserify()
		.require(dependencies)
		.bundle()
		.on('error', gutil.log)
		.pipe(source('vendors.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./public/dist/js'));
});

gulp.task('js:dev', function() {
	buildJs('development');
});

gulp.task('js:prod', function() {
	buildJs('production');
});

function buildJs(env) {
	var b = browserify('./src/client/app.js', {
			debug: true
		})
		.external(dependencies)
		.transform(stringify(['.html']))
		.bundle()
		.on('error', gutil.log)
		.pipe(source('app.js'));

	if(env === 'production') {
		b = b.pipe(buffer())
		 .pipe(uglify());
	}

	b.pipe(gulp.dest('./public/dist/js/'));
}

gulp.task('less', function() {
	return gulp.src(['./src/client/app.less'])
		.pipe(less({
			paths: ['./src/client/pages/']
		}))
		.on('error', function(e) {
			gutil.log(e.message);
			this.emit('end');
		})
		.pipe(gulp.dest('./public/dist/css'))
		.pipe(livereload());
});

gulp.task('startServer', function() {
	nodemon({
		watch: ['src/server/*', 'app.js'],
		script: 'app.js',
		env: {
			NODE_ENV: 'development'
		},
	});
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('./src/client/**/*.less', ['less']);
	gulp.watch([
		'./public/index.html',
		'./src/client/**/*.js',
		'./src/client/**/*.html',
	], ['js:dev']);
});

gulp.task('production', ['less', 'vendors', 'js:prod']);
gulp.task('default', ['less', 'vendors', 'js:dev', 'startServer', 'watch']);
