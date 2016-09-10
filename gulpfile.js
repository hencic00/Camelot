'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () //Compajla vse scss fajle
{
	return gulp.src('./resources/sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass:watch', function () //Listen for chnages is sass.
{
	gulp.watch('./resources/sass/**/*.scss', ['sass']);
});