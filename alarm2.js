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
    helper.player.on('play', () => {
        console.log("Playing " + helper.status.track.track_resource.name + " by " + helper.status.track.artist_resource.name);
    });
    helper.player.on('pause', () => {
        console.log("Song paused");
    });
    helper.player.on('end', () => { });
    helper.player.on('track-will-change', track => {
        console.log("Song skipped");
    });
    helper.player.on('status-will-change', status => {});

    // Playback control. These methods return promises
    // helper.player.play('spotify:track:4uLU6hMCjMI75M1A2tKUQC');
    // helper.player.pause();
    helper.player.seekTo();
    // function skip(){
    //     return new Promise(function (fulfill, reject){
    //         helper.player.seek();
    //     });
    // }
    // skip();

    //version 1
    // function play(){
    //     return new Promise(function (fulfill, reject){
    //         helper.player.play('spotify:track:4uLU6hMCjMI75M1A2tKUQC', function(err, res){
    //             if(err) reject (err);
    //             else fulfill (res);
    //         });
    //     });
    // }
    // play();

    //version 2
    // function play(){
    //     helper.player.play('spotify:track:4uLU6hMCjMI75M1A2tKUQC', function(err, res){
    //         if(err) reject (err);
    //         else fulfill (res);
    //     });
    // }
    // play();

    //version 3
   //  helper.player.play('spotify:track:4uLU6hMCjMI75M1A2tKUQC', function(err, res){
   //     if(err) reject (err);
   //     else fulfill (res);
   // });




    // Get current playback status, including up to date playing position
    // console.log(helper.status);
    // 'status': {
    //    'track': ...,
    //    'shuffle': ...,
    //    'playing_position': ...
    //  }
});
