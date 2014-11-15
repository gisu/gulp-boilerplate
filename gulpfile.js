// Gulpfile
// ========

// Define the Default Static Files that you want to Move to your
// Distrubution Folder (like .htaccess, readme.txt etc.)
var firstFiles = {
  files: [
    // {src:''  , dest: ''},
    // {src:''  , dest: ''},
  ]
};

// Set the JS Files that you want to copy from 'bower-components'
// to your 'dist/' directory
var sources = {
  copyjs: [
    {src:'src/bower-components/jquery/jquery.js'}
    // {src:'src/bower-components/.js'}
  ]
};

// Set the Plugin Variables
var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    header      = require('gulp-header'),
    notify      = require('gulp-notify'),
    bump        = require('gulp-bump'),
    browserSync = require('browser-sync'),
    changed     = require('gulp-changed');


// Get some Data from the 'package.json'
var pkg = require('./package.json');

var config = {
  gitURL: pkg.repository.url,
  gitBranch: 'master',
  gitVersion: pkg.version
};

// Directory Routing
var targetDirBase    = pkg.directory.base;
var targetDirCSS     = pkg.directory.css;
var targetDirJS      = pkg.directory.js;
var targetDirCSSImg  = pkg.directory.cssimages;
var targetDirHTMLImg = pkg.directory.htmlimages;

// Define the Header for the Files
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


// --- Plugin Configuration --------------

// Browser Sync Task
gulp.task('browser-sync', function() {
  browserSync.init([
    targetDirCSS +'**/*.css',
    targetDirBase + '**/*.{html,php}',
    targetDirCSSImg + '**/*.{jpg,gif,png,svg}',
    targetDirJS + '**/*.js'],
  { options: {
      debugInfo: true,
      watchTask: true,
      ghostMode: {
        clicks : true,
        scroll : true,
        links  : true,
        forms  : true
      }
    },
    server: {
      baseDir  : targetDirBase
    },
    open: true
  });
});

// --- Copy Tasks --------------

// Copy Bower JS Files
gulp.task('copy-bower-js', function () {
  sources.copyjs.forEach(function(item) {
    gulp.src(item.src)
      .pipe(gulp.dest(targetDirJS));
  });
});

// Copy the Default Static Files
gulp.task('copy-static-files', function () {
  firstFiles.files.forEach(function(item) {
    gulp.src(item.src)
      .pipe(gulp.dest(targetDirBase + item.dest));
  });
});

// ---- Bump Config ---------------

// Update bower, component, npm at once:
gulp.task('bump', function(){
  gulp.src(['bower.json', 'package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump-minor', function(){
  gulp.src(['bower.json', 'package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump-major', function(){
  gulp.src(['bower.json', 'package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});

// Include the Header on the CSS File
gulp.task('banner-css', function(){
  gulp.src(targetDirCSS + '*.css')
  .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest(targetDirCSS));
});

// Internal Watch Task - Define the Directorys that need to be watched for changes
gulp.task('watch', function() {
  // xxxx
  // gulp.watch(['dir to watch with fileending'], ['the task that need to be started']);
});

// MAIN TASK BLOCK ------------------------------------------------------

// Initial Gulp Task - start with this Task to make the first Setup
// for your dist directory
gulp.task('init', [
  'copy-static-files',
  'copy-bower-js'
]);

// Default gulp Task 'gulp'
gulp.task('default', ['browser-sync', 'watch-bin']);

// Publish Task - Finalize your Dist Folder, minify the Files, check Code Quality etc.
gulp.task('publish',[
  'banner-css',
  'bump',
]);
