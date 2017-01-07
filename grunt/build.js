'use strict';

module.exports = function (grunt) {
  var devTasks = [];

  if (grunt.option('no-eslint')) {
    console.log('Skipping "force:eslint" task');
  } else {
    devTasks.push('force:eslint');
  }

  devTasks.push('less');
  devTasks.push('cssmin');
  devTasks.push('concat');
  devTasks.push('uglify');

  grunt.registerTask('build', devTasks);

  return {};
};