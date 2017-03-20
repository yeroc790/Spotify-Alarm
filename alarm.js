//in Spotify Settings, "Allow Spotify to be opened from the web" has to be enabled
var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
var prompt = require('prompt');

//
// ### function stop ()
// Stops input coming in from stdin
//
prompt.stop = function () {
    if (prompt.stopped || !prompt.started) {
        return;
    }

    stdin.destroy();
    prompt.emit('stop');
    prompt.stopped = true;
    prompt.started = false;
    prompt.paused = false;
    return prompt;
}

//input
var stdin = process.openStdin();

var alarmSet = false;

function startAlarm(){
    console.log("Good morning!");
    spotify.unpause(function(err, res){
        if (err) {
            return console.error(err);
        }
    });
}

function setAlarm(minutes){
    if(minutes>=1){
        setTimeout(startAlarm,(1000*60*minutes));
        console.log("-- Alarm Set --");
    }else if(minutes<1){
        console.log("-- Error setting alarm --");
    }
}

//returns number of minutes to wait
function getTimeInput(){
    var prompt2 = require('prompt');
    prompt2.start();
    prompt2.get(['hours', 'minutes'], function(err, result){
        if(err){
            return console.err(err);
        }

        console.log('hours: ' + result.hours);
        console.log('minutes: ' + result.minutes);
        var minutes = (result.hours*60)+result.minutes;
        setAlarm(minutes);
    });
    prompt2.stop;
}

//main logic flow
//explicitly called once, then recursively until quit is called? sure...that sounds like a plan
menu();
prompt.start();
var action;
function menu(){
    console.log("Please enter an action: (info, pause, play, alarm, quit)");
    prompt.get(['action'], function(err, result){
        action = result.action;
        console.log(action);
        if(result.action=='info'){
            console.log("info");
        }else if(result.action=='pause'){
            spotify.pause(function(err, res){});
        }else if(result.action=='play'){
            spotify.unpause(function(err, res){});
        }else if(result.action=='alarm'){
            var minutes = getTimeInput();
        }else if(result.action=='quit'){
            console.log("\n...Shutting down...");
        }else if(result.action=='test'){
            console.log("test");
        }else{
            console.log("Action is not supported, try again");
        }

        // if(result.action!='quit')
        //     menu();
        // prompt.stop;
    });
    // console.log(action);
    //test
}

function test(){

}
