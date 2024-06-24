(function () {
	'use strict';

	const gulp = require('gulp');
	const plumber = require('gulp-plumber');
	const uglify = require('gulp-uglify');
	const concat = require('gulp-concat');
	const cssmin = require('gulp-clean-css');
	const less = require('gulp-less');

	const arr = [
//admin
		{
			name: 'admin', file: [
			'public/app/admin/*.js',
			'public/app/admin/main/**/*.js',
			'public/app/admin/showPdf/**/*.js',
			'public/app/admin/userError/**/*.js'
		]
		},
		{name: 'adminUser', file: ['public/app/admin/user/**/*.js', 'public/app/admin/userAction/**/*.js']},
//draft
		{name: 'adminDraft', file: 'public/app/admin/drafts/**/*.js'},

//client
		{
			name: 'client', file: [
			'public/app/client/app.js',
			'public/app/client/main/**/*.js',
			'public/app/client/selectColumns/**/*.js',
			'public/app/client/showPdf/**/*.js'
		]
		},
		{name: 'actor', file: 'public/app/client/actor/**/*.js'},
		{name: 'article', file: 'public/app/client/article/**/*.js'},
		{name: 'movie', file: 'public/app/client/movie/**/*.js'},

		{name: 'common', file: 'public/app/common/**/*.js'},
//		{name: 'clientLibrary', file: 'public/app/clientLibrary/**/*.js'}
	];
//
	let lessArr = [
		{name: 'app-less', file: ['public/app/less/**/*.less', '!public/app/less/login.less']},
		{name: 'login-less', file: 'public/app/less/login.less'}
	];

	/** DEV tasks - scripts **/
	for (let i = 0; i < arr.length; i++) {
		gulp.task(arr[i].name + '-dev', () => {
			return gulp.src(arr[i].file)
				.pipe(require('gulp-jshint')())
				.pipe(concat(arr[i].name + '.min.js'))
				.pipe(gulp.dest('./public/dist'))
				.pipe(require('gulp-livereload')());
		});
	}

	/** DEV tasks - less **/
	for (let i = 0; i < lessArr.length; i++) {
		gulp.task(lessArr[i].name + '-dev', () => {
			return gulp.src(lessArr[i].file)
				.pipe(less())
				.pipe(concat(lessArr[i].name + '.min.css'))
				.pipe(gulp.dest('./public/dist/css'))
				.pipe(require('gulp-livereload')());
		});
	}

	/** PRODUCTION tasks - scripts **/
	for (let i = 0; i < arr.length; i++) {
		gulp.task(arr[i].name, ()=> {
			return gulp.src(arr[i].file)
				.pipe(uglify({mangle: false}))
				.pipe(concat(arr[i].name + '.min.js'))
				.pipe(gulp.dest('./public/dist'));
		});
	}

	/** PRODUCTION tasks - less **/
	for (let i = 0; i < lessArr.length; i++) {
		gulp.task(lessArr[i].name, () => {
			return gulp.src(lessArr[i].file)
				.pipe(plumber())
				.pipe(less())
				.pipe(cssmin())
				.pipe(concat(lessArr[i].name + '.min.css'))
				.pipe(gulp.dest('./public/dist/css'))
				.pipe(plumber.stop());
		});
	}

	/** Task - pug **/
	gulp.task('pug', () => gulp.src(['public/app/**/*.pug', 'server/views/*.pug']));

	/** Task - clean **/
	gulp.task('clean', () => gulp.src('./public/dist/*').pipe(require('gulp-clean')()));

	///** Task - remove files **/
	//gulp.task('removeFiles', () => gulp.src('./public/app/**/*.js').pipe(require('gulp-clean')()));

	/** Task - watch **/
	gulp.task('watch', () => {
		//require('gulp-livereload').listen();
		require('gulp-livereload').listen(35730, function (err) {
			if (err) {
				console.log(err);
			}
		});
		for (let i = 0; i < arr.length; i++) {
			gulp.watch(arr[i].file, {usePolling: true}, gulp.parallel(arr[i].name + '-dev'));
		}
		for (let i = 0; i < lessArr.length; i++) {
			gulp.watch(lessArr[i].file, {usePolling: true}, gulp.parallel(lessArr[i].name + '-dev'));
		}

		gulp.watch(['public/app/**/*.pug', 'server/views/*.pug'], gulp.parallel('pug')).on('change', file => {
			gulp.src(file).pipe(require('gulp-livereload')());
		});
	});


	let taskDev = []; // tasks for DEV
	let task = []; // tasks for PRODUCTION
	for (let i = 0; i < lessArr.length; i++) {
		taskDev.push(lessArr[i].name + '-dev');
		task.push(lessArr[i].name);
	}
	for (let i = 0; i < arr.length; i++) {
		taskDev.push(arr[i].name + '-dev');
		task.push(arr[i].name);
	}
	let env = process.env.NODE_ENV || 'dev';
	if (env === 'dev') {
		gulp.task('default', gulp.series('clean', gulp.parallel(taskDev), 'watch'));
	} else {
		gulp.task('default', gulp.parallel(task));
		//gulp.task('default', gulp.series(gulp.parallel(task), 'removeFiles'));
	}


}());
