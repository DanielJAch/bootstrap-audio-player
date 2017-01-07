'use strict';

// Minifies CSS files: https://github.com/gruntjs/grunt-contrib-cssmin

module.exports = {
  target: {
    files: {
      'dist/css/jquery.audioPlayer.min.css': [
        'dist/css/jquery.audioPlayer.css'
      ]
    }
  }
};