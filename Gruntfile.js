module.exports = function(grunt) {
  var jsFiles = [
    'index.js',
    'Gruntfile.js',
    'client/**/*.js',
    'server/**/*.js',
    'libs/**/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    }
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint']);
};
