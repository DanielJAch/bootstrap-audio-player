'use strict';

// compiles Less into CSS

module.exports = {
  development: {
    options: {
      paths: [
        'src/css/less',
        'src/css/less/**'
      ],
      // source maps make it easier to debug compiled CSS in DevTools
      sourceMap: true,
      sourceMapFilename: 'dist/css/jquery.audioPlayer.css.map',
      sourceMapURL: 'dist/css/jquery.audioPlayer.css.map',
      sourceMapBasepath: 'dist/css'
    },
    files: {
      'dist/css/jquery.audioPlayer.css': 'src/css/jquery.audioPlayer.less'
    }
  }
  // , production: {} (here if we need it)
};