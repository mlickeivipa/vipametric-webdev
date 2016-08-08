var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var clip = require('gulp-clip-empty-files');
var del = require('del');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var rename = require('gulp-rename');
var include = require("gulp-include");
var _ = require('lodash');

gulp.task('default', ['styles', 'javascript', 'design']);
gulp.task('clean', ['styles:clean', 'javascript:clean', 'design:clean']);

gulp.task('styles', ['styles:build']);
gulp.task('styles:build', ['styles:clean'], function() {
	return gulp.src('./web/src/stylesheets/**/*.scss')
		.pipe(clip())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],
			cascade: false
		}))
		.pipe(gulp.dest('./web/build/stylesheets'));
});
gulp.task('styles:clean', function(callback) {
	del(['./web/build/stylesheets/'], callback);
});

gulp.task('javascript', ['javascript:build']);
gulp.task('javascript:build', ['javascript:clean'], function() {
	return gulp.src(['./web/src/javascript/**/*.js', '!./web/src/javascript/config/**/*'])
		.pipe(include({
			extensions: "js",
			includePaths: [
				"./web/src/javascript"
			]
		}))
		.pipe(gulp.dest('./web/build/javascript'));
});
gulp.task('javascript:clean', function(callback) {
	del(['./web/build/javascript'], callback);
});

gulp.task('design', ['design:build']);
gulp.task('design:build', ['design:clean'], function() {
	return gulp.src('./web/src/design/**/*')
		.pipe(gulp.dest('./web/build/design'));
});
gulp.task('design:clean', function(callback) {
	del(['./web/build/design'], callback);
});

gulp.task('iconfont', function(){
	return gulp.src('./font-glyphs/src/icons/*.svg')
		.pipe(iconfont({
			fontName: 'glyph-font', // required
			appendCodepoints: true, // recommended option
			startCodepoint: 0xF101,
			fontHeight: 150
		}))
		.on('codepoints', function(codepoints, options) {
			codepoints = _.map(codepoints, function(codepoint) {
				return {
					name: codepoint.name,
					codepoint: codepoint.codepoint.toString(16).toLowerCase()
				};
			});
			gulp.src('./font-glyphs/src/templates/_iconfont.scsstpl')
				.pipe(consolidate('lodash', {
					glyphs: codepoints
				}))
				.pipe(rename('_font-glyph-entities.scss'))
				.pipe(gulp.dest('./web/src/stylesheets/config/'));
		})
		.pipe(gulp.dest('./web/src/design/fonts/glyph-lib/'));
});