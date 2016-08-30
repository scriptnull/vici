var gulp = require('gulp')
var nodemon = require('gulp-nodemon')

gulp.task('dev', function () {
  nodemon({
    script: 'init.js',
    ext: 'js',
    env: {
      'VICI_PORT': 4454,
      'VICI_SECRET_TOKEN': 'super_simple_token',
      'VICI_YML_PATH': './vici.yml'
    }
  })
})
