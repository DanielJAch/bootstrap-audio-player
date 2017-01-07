'use strict';

module.exports = {
  options: {

  },
  audioPlayer: {
    options: {
      banner: '/*! jquery.audioPlayer <%= pkg.version %> ~ (c) 2009-<%= grunt.template.today("yyyy") %> <%= pkg.organization %> ~ <%= pkg.license %> License */\n'
    },
    files: {
      'dist/bin/jquery.audioPlayer.min.js': ['src/js/jquery.audioPlayer.js']
    }
  }
};