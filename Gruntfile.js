module.exports = function(grunt) {
  var jsFiles = [
    'app/**/*.js',
    'Gruntfile.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: jsFiles,
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    jscs: {
      src: jsFiles
    }
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint', 'jscs']);
};
