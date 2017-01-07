'use strict';

var loadGruntTasks = require('load-grunt-tasks');
var loadGruntConfigs = require('load-grunt-configs');

module.exports = function(grunt) {
  // Load grunt tasks automatically
  loadGruntTasks(grunt);

  var options = {
    config: {
      src: './grunt/*.js'
    },
    eslint: {
      target: ['bin/jquery.audioPlayer.js']
    },
    pkg: grunt.file.readJSON('package.json')
  };

  var configs = loadGruntConfigs(grunt, options);

  // Project configuration.
  grunt.initConfig(configs);

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-force-task');

  grunt.registerTask('default', 'build');
};