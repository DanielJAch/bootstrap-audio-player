(function($) {
  $.fn.audioPlayer = function(method, options) {
    var self = this;
    var settings = null;
    var randomEnabled = false;
    var repeatEnabled = false;
    var currentPlaylist = (!!self.data('playlist')) ? JSON.parse(self.data('playlist')) : null;
    var currentTrackIndex = null;
    var timer = null;
    var documentTitle = null;

    var defaultButtonStyles = {
      play: 'glyphicon glyphicon-play',
      pause: 'glyphicon glyphicon-pause',
      backward: 'glyphicon glyphicon-backward',
      forward: 'glyphicon glyphicon-forward',
      repeat: 'glyphicon glyphicon-repeat',
      random: 'glyphicon glyphicon-random'
    };

    var getPlayer = function() {
      var player = self.find('audio');

      if (player.length === 0) {
        console.log('Cannot find audio tag.');
        return null;
      }

      return player[0];
    };
    var setRandomEnabled = function(on) {
      var randomControl = self.find('#music-player-random');

      if (randomControl.length > 0) {
        randomEnabled = on;

        if (randomEnabled) {
          randomControl.removeClass('disabled');
        } else {
          randomControl.addClass('disabled');
        }
      } else {
        randomEnabled = false;
      }
    };
    var setRepeatEnabled = function(on) {
      var repeatControl = self.find('#music-player-repeat');

      if (repeatControl.length > 0) {
        repeatEnabled = on;

        if (repeatEnabled) {
          repeatControl.removeClass('disabled');
        } else {
          repeatControl.addClass('disabled');
        }
      } else {
        repeatEnabled = false;
      }
    };
    var setPlayerControlsEnabled = function() {
      if (!$.isArray(currentPlaylist) || currentPlaylist.length === 0) {
        self.find(
          '.' + settings.buttonStyles.play + ', ' +
          '.' + settings.buttonStyles.pause + ', ' +
          '.' + settings.buttonStyles.backward + ', ' +
          '.' + settings.buttonStyles.forward
        )
          .addClass('disabled');
      } else {
        self.find(
          '.' + settings.buttonStyles.play + ', ' +
          '.' + settings.buttonStyles.pause + ', ' +
          '.' + settings.buttonStyles.backward + ', ' +
          '.' + settings.buttonStyles.forward
        )
          .removeClass('disabled');
      }
    };
    var matchPlayerSource = function(trackUrl) {
      var player = getPlayer();
      var playerSource = (!player.src || player.src.length === 0) ? '' : player.src.toLowerCase();

      if (!trackUrl || trackUrl.length === 0) {
        trackUrl = '';
      } else {
        trackUrl = trackUrl.toLowerCase();
      }

      return (playerSource.toLowerCase().indexOf(trackUrl.toLowerCase()) > 0);
    };
    var loadPlayerSourceByIndex = function(index, forceReload) {
      var player = getPlayer();
      var track = currentPlaylist[index];

      currentTrackIndex = index;

      if (!matchPlayerSource(track.url) || forceReload) {
        player.pause();
        player.src = track.url;
        player.load();
        player.play();
      }

      self.data('track-index', currentTrackIndex);

      if ($.isFunction(settings.onChangeTrack)) {
        settings.onChangeTrack(currentTrackIndex, track);
      }
    };
    var play = function(index, forceReload) {
      var player = getPlayer();
      var button = self.find('.' + settings.buttonStyles.pause + ', .' + settings.buttonStyles.play);

      currentPlaylist = currentPlaylist || ((!!self.data('playlist')) ? JSON.parse(self.data('playlist')) : null);

      if (!player || !currentPlaylist || currentPlaylist.length === 0) {
        return;
      }

      if (index !== null && index !== undefined && !isNaN(index)) {
        if (index >= currentPlaylist.length) {
          if (!repeatEnabled) { return; }

          index = 0;
        } else if (index < 0) {
          index = currentPlaylist.length - 1;
        }

        loadPlayerSourceByIndex(index, forceReload);
      } else if (!player.src || player.src === '' || forceReload) {
        loadPlayerSourceByIndex(0, forceReload);
      }

      if (player.paused) {
        player.play();
      }

      button.addClass(settings.buttonStyles.pause);
      button.removeClass(settings.buttonStyles.play);
    };
    var pause = function() {
      var player = getPlayer();
      var button = self.find('.' + settings.buttonStyles.pause + ', .' + settings.buttonStyles.play);

      if (!player) {
        return;
      }

      if (!player.paused) {
        player.pause();
      }

      button.addClass(settings.buttonStyles.play);
      button.removeClass(settings.buttonStyles.pause);
    };
    var formatCurrentTrack = function() {
      if (!$.isArray(currentPlaylist) || currentPlaylist.length < 0) {
        return'';
      } else if (currentTrackIndex === null || currentTrackIndex === undefined || isNaN(currentTrackIndex) || currentTrackIndex >= currentPlaylist.length) {
        return '';
      }

      var track = currentPlaylist[currentTrackIndex];
      var trackName = (!track.trackName || track.trackName.length === 0) ? 'Unknown Track' : track.trackName;
      var artist = (!track.artistName || track.artistName.length === 0) ? '' : track.artistName;
      var album = (!track.albumName || track.albumName.length === 0) ? '' : track.albumName;

      if (artist.length > 0 && album.length > 0) {
        return '"' + trackName + '" by ' + artist + ' on "' + album + '"';
      }

      if (artist.length > 0) {
        return '"' + trackName + '" by ' + artist;
      }

      if (album.length > 0) {
        return '"' + trackName + '" on "' + album + '"';
      }

      return trackName.toUpperCase();
    };
    var clearPlaylist = function() {
      pause();

      currentPlaylist = [];
      self.data('playlist', null);

      setPlayerControlsEnabled();

      self.find('.music-player-timer').html(null);
      self.find('.progress-bar').attr('aria-valuenow', 0);
      self.find('.progress-bar').css('width', '0');
      self.find('.music-player-info').html(null);
    };
    var pageTitleMarquee = function () {
      documentTitle = documentTitle.substring(1) + documentTitle.substring(0, 1);
      $(document).prop('title', documentTitle);
    };
    var setButtonStyles = function() {
      if (!$.isPlainObject(settings.buttonStyles)) {
        settings.buttonStyles = { };
      }

      if ($.isPlainObject(settings.buttonStyles)) {
        $.extend(settings.buttonStyles, defaultButtonStyles);
      }
    };

    var methods = {
      playNext: function() {
        currentTrackIndex = parseInt(self.data('track-index') || 0);

        play(currentTrackIndex + 1, true);
      },
      playPrevious: function() {
        currentTrackIndex = parseInt(self.data('track-index') || 0);

        play(currentTrackIndex - 1, true);
      },
      playTrackAtIndex: function(index) {
        if (index === null || index === undefined) {
          pause();
          return;
        }

        play(index, false);
      },
      togglePlayPause: function() {
        var player = getPlayer();

        if (!player) {
          return;
        }

        if (!player.paused) {
          pause();
        } else {
          play(null, false);
        }
      },
      toggleRandom: function() { setRandomEnabled(!randomEnabled); },
      toggleRepeat: function() { setRepeatEnabled(!repeatEnabled); },
      setPlaylist: function(playlist) {
        if (!$.isArray(playlist) || playlist.length === 0) {
          clearPlaylist();
          return;
        }

        var trackMapper = $.isFunction(settings.trackMapper) ? settings.trackMapper : function(t) {
          return {
            trackName: t.trackName,
            url: t.url,
            artistName: t.artistName,
            albumName: t.albumName,
            trackDuration: t.duration,
            trackNumber: t.trackNumber
          };
        };

        currentPlaylist = $.map(playlist, trackMapper);

        self.data('playlist', JSON.stringify(currentPlaylist));

        setPlayerControlsEnabled();
      },
      appendPlaylist: function(playlist) {
        if (!$.isArray(playlist) || playlist.length === 0) {
          setPlayerControlsEnabled();
          return;
        }

        if (!$.isArray(currentPlaylist)) {
          currentPlaylist = [];
        }

        currentPlaylist.push(playlist);
        setPlayerControlsEnabled();
      }
    };

    if (typeof method === 'string') {
      if ($.isFunction(methods[method])) {
        settings = $.extend($.extend({}, $.fn.audioPlayer.defaultOptions), options);
        setButtonStyles();

        return methods[method].apply(self, Array.prototype.slice.call(arguments, 2));
      }

      $.error('Method ' + method + ' does not exist on jQuery.audioPlayer.');

      return null;
    } else {
      settings = $.extend($.extend({}, $.fn.audioPlayer.defaultOptions), method);
      setButtonStyles();
    }

    if (settings.compactMode && !self.hasClass('music-player-compact')) {
      self.addClass('music-player-compact');
    }

    if (!self.hasClass('music-player')) {
      var htmlPause = settings.allowPause ? '<span id="music-player-play" class="music-player-button ' + settings.buttonStyles.play + '"></span>' : '';
      var htmlPrevious = settings.showPrevious ? '<span id="music-player-backward" class="music-player-button ' + settings.buttonStyles.backward + '"></span>' : '';
      var htmlNext = settings.showNext ? '<span id="music-player-forward" class="music-player-button ' + settings.buttonStyles.forward + '"></span>' : '';
      var htmlNowPlayingInfo = settings.showNowPlayingInfo ? '<div class="music-player-now-playing"><div class="music-player-info"></div><div class="music-player-timer"></div></div>' : '';
      var htmlProgress = settings.showProgress ? '<div class="progress"><div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div></div>' : '';
      var htmlRandom = settings.allowRandom ? '<span id="music-player-random" class="music-player-button small-icon ' + settings.buttonStyles.random + '"></span>' : '';
      var htmlRepeat = settings.allowRepeat ? '<span id="music-player-repeat" class="music-player-button small-icon ' + settings.buttonStyles.repeat + '"></span>' : '';
      var htmlPlayer = '<audio></audio>';

      self.addClass('music-player');

      if (settings.compactMode) {
        self.append('<div class="music-player-controls">' + htmlPrevious + htmlPause + htmlNext + htmlProgress + htmlRandom + htmlRepeat + '</div>');
      } else {
        self.append('<div class="music-player-controls">' + htmlPrevious + htmlPause + htmlNext + htmlNowPlayingInfo + '</div>');
        self.append(htmlProgress);
        self.append('<div class="music-player-controls">' + htmlRandom + htmlRepeat + '</div>');
      }

      self.append(htmlPlayer);

      self.find('#music-player-play').bind('click', methods.togglePlayPause);
      self.find('#music-player-backward').bind('click', methods.playPrevious);
      self.find('#music-player-forward').bind('click', methods.playNext);
      self.find('#music-player-random').bind('click', methods.toggleRandom);
      self.find('#music-player-repeat').bind('click', methods.toggleRepeat);

      var audioPlayer = self.find('audio');

      audioPlayer.bind('ended', function(e) {
        currentPlaylist = (!!self.data('playlist')) ? JSON.parse(self.data('playlist')) : null;

        methods.playNext(e);
      });

      audioPlayer.bind('play', function() {
        timer = window.setInterval(function() {
          if (!!audioPlayer && audioPlayer.length === 1) {
            var duration = audioPlayer[0].duration;
            var currentTime = audioPlayer[0].currentTime;
            var percentComplete = (duration > 0) ? parseInt((currentTime / duration) * 100) : 0;
            var minutes = parseInt(currentTime / 60);
            var seconds = parseInt(currentTime % 60);

            self.find('.music-player-timer').html((minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds));
            self.find('.progress-bar').attr('aria-valuenow', percentComplete);
            self.find('.progress-bar').css('width', percentComplete + '%');
          } else {
            self.find('.music-player-timer').html('');
            self.find('.progress-bar').attr('aria-valuenow', 0);
            self.find('.progress-bar').css('width', '0');
          }

          if (settings.setPageTitleToNowPlaying) {
            pageTitleMarquee();
          }
        }, 100);

        currentPlaylist = (!!self.data('playlist')) ? JSON.parse(self.data('playlist')) : null;
        currentTrackIndex = parseInt(self.data('track-index'));

        var formattedTrack = documentTitle = formatCurrentTrack();

        documentTitle += '  ';

        if (settings.compactMode) {
          self.find('.music-player-controls').attr('title', formattedTrack);
        } else {
          self.find('.music-player-info').html(formattedTrack);
          self.find('.music-player-info').attr('title', formattedTrack);
        }

        self.find('#music-player-play').removeClass(settings.buttonStyles.play);
        self.find('#music-player-play').addClass(settings.buttonStyles.pause);
      });

      audioPlayer.bind('pause', function() {
        if (!!timer) {
          window.clearInterval(timer);
        }

        self.find('#music-player-play').removeClass(settings.buttonStyles.pause);
        self.find('#music-player-play').addClass(settings.buttonStyles.play);
      });

      audioPlayer.bind('error', function(e) {
        console.log('Error in Audio Player: ' + e.type);
      });

      audioPlayer.bind('stalled', function(e) {
        console.log('Error in Audio Player: ' + e.type);
      });

      if (settings.enableKeyboard) {
        $(window).bind('keyup', function(e) {
          // TODO: THIS CAN CAUSE PROBLEMS IF YOU TYPE SOMETHING IN A TEXT BOX OR OTHER EDITABLE AREA ON THE PAGE!
          if (e.keyCode === 32) {
            methods.togglePlayPause(e);
          }
        });
      }
    }

    setRandomEnabled(false);
    setRepeatEnabled(false);
    setPlayerControlsEnabled();

    return self;
  };

  $.fn.audioPlayer.defaultOptions = {
    showPrevious: true,
    showNext: true,
    allowPause: true,
    showNowPlayingInfo: true,
    showProgress: true,
    changeProgress: true,
    allowRandom: true,
    allowRepeat: true,
    enableKeyboard: true,
    setPageTitleToNowPlaying: false,
    compactMode: false
  };
}(jQuery));