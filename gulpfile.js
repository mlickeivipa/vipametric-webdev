var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clip = require('gulp-clip-empty-files');
var del = require('del');

gulp.task('default', ['styles']);

gulp.task('styles:clean', function(callback) {
	del(['./web/stylesheets/build/**'], callback);
});

gulp.task('styles:build', ['styles:clean'], function() {
	return gulp.src('./stylesheets/src/**/*.scss')
		.pipe(clip())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest('./stylesheets/build'));
});

gulp.task('styles', ['styles:build']);