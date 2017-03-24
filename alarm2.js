const SpotifyWebHelper = require('spotify-web-helper');

const helper = SpotifyWebHelper();

helper.player.on('error', err => {
  if (error.message.match(/No user logged in/)) {
    // also fires when Spotify client quits
  } else {
    // other errors: /Cannot start Spotify/ and /Spotify is not installed/
  }
});
helper.player.on('ready', () => {

  // Playback events
  helper.player.on('play', () => { });
  helper.player.on('pause', () => { });
  helper.player.on('end', () => { });
  helper.player.on('track-will-change', track => {});
  helper.player.on('status-will-change', status => {});

  // Playback control. These methods return promises
  helper.player.play('spotify:track:4uLU6hMCjMI75M1A2tKUQC');
  helper.player.pause();
  helper.player.seek();

  // Get current playback status, including up to date playing position
  console.log(helper.status);
  // 'status': {
  //    'track': ...,
  //    'shuffle': ...,
  //    'playing_position': ...
  //  }

});
