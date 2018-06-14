const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const connect = require('gulp-connect-php');
/**
* Refreshes the page after save file
*/
browserSync.init({
     server: "dist",
     browser: ["google chrome"]
});
/**
* converts the .scss files to css and stores,
* them in a new folder.
* also adds prefixes to certain commands, so that they,
* would work for other browsers and also for the last 2 versions.
*/
gulp.task('styles', function(done) {
	gulp.src('src/styles/*.scss')
	//.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 versions']
	}))
	.pipe(gulp.dest('dist/css'))
	browserSync.reload();
	done()
});
/**
* Runs the default gulp command.
* it watches for the changes in .scss files, index.html and .js files.
*/
gulp.task('default', function(done) {
	gulp.watch('src/styles/*.css', gulp.series('styles'))
	gulp.watch('src/index.html', gulp.series('copy-html'))
	gulp.watch('src/views/*.html', gulp.series('copy-html'))
	gulp.watch('src/scripts/*.js', gulp.series('scriptsApp'))
	gulp.watch('src/scripts/service/*.js', gulp.series('scriptsService'))
	gulp.watch('src/scripts/controllers/*.js', gulp.series('scriptsControllers'))
	gulp.watch('src/scripts/data/*.json', gulp.series('copy-data'))
	gulp.watch('src/scripts/php/*.php', gulp.series('copy-php'))
	connect.server();

	done()
});
/**
* Creates new .js files that are converted to ES 2015.
* also those files are saved in a different folder.
*/
gulp.task('scriptsControllers', function(done) {
	gulp.src('src/scripts/controllers/*.js')
	.pipe(babel( {
		plugins: ['transform-runtime'],
        presets: ['env']
    }))
    /**
	* Inserts globals, so that require would be difined in main js files.
	*/
	.pipe(browserify( {
		insertGlobals: true
	}))
	.pipe(gulp.dest('dist/scripts/controllers'))
	browserSync.reload();
	done()
});

gulp.task('scriptsApp', function(done) {
	gulp.src('src/scripts/*.js')
	.pipe(babel( {
		plugins: ['transform-runtime'],
        presets: ['env']
    }))
    /**
	* Inserts globals, so that require would be difined in main js files.
	*/
	//.pipe(browserify( {
		//insertGlobals: true
	//}))
	.pipe(gulp.dest('dist/scripts'))
	browserSync.reload();
	done()
});

gulp.task('scriptsService', function(done) {
	gulp.src('src/scripts/service/*.js')
	.pipe(babel( {
		plugins: ['transform-runtime'],
        presets: ['env']
    }))
    .on('error', () => {
		console.log("Error");
	})
    /**
	* Inserts globals, so that require would be difined in main js files.
	*/
	.pipe(browserify( {
		insertGlobals: true
	}))
	.on('error', () => {
		console.log("Error");
	})
	.pipe(gulp.dest('dist/scripts/service'))
	.on('error', () => {
		console.log("Error");
	})
	browserSync.reload();
	done()
});
/**
* Copies the index.html file to a dist folder on save.
*/
gulp.task('copy-html', function(done) {
	gulp.src('src/index.html')
	.pipe(gulp.dest('dist'))

	gulp.src('src/views/*.html')
	.pipe(gulp.dest('dist/views'))

	browserSync.reload();
	done()
});

gulp.task('copy-data', function(done) {
	gulp.src('src/scripts/data/*.json')
	.pipe(gulp.dest('dist/scripts/data'))
	browserSync.reload();
	done()
});

gulp.task('copy-php', function(done) {
	gulp.src('src/scripts/php/*.php')
	.pipe(gulp.dest('dist/scripts/php'))
	browserSync.reload();
	done()
});