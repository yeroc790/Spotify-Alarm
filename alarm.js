//in Spotify Settings, "Allow Spotify to be opened from the web" has to be enabled
var nodeSpotifyWebHelper = require('node-spotify-webhelper');
var spotify = new nodeSpotifyWebHelper.SpotifyWebHelper();
var prompt = require('prompt');
var colors = require('colors/safe');

// prompt.message = colors.cyan("Question");
// prompt.delimiter = colors.cyan(":");
prompt.message = null;

//setting up some prompts
var basicPrompt = {
    properties: {
        action: {
            pattern: /^[a-zA-Z]+$/,
            message: 'Action must only contain letters',
            required: true,
            description: colors.cyan("Enter an action")
        }
    }
};

//pattern uses javascript regular expressions
var timePrompt = {
    properties: {
        time: {
            pattern: /^([1-9]|1[0-2]):([0-5][0-9])[ap]m$/,
            message: 'Please enter a time in the following format (H)H:MM(am/pm)',
            required: true,
            description: colors.cyan("Enter a time")
        }
    }
}

//-- start basic functions --
var alarm = { //will be set to have the value of the timeout call
    "script": null,
    "hour": 0,
    "minute": 0,
    "am": true
};
var alarmSet = false;

function setAlarm(arg){
    console.log("\nWhat time would you like to wake up? (H)H:MM(am/pm)");
    prompt.get(timePrompt, function(err, result){
        var time = result.time.split(":"); //so timeArr[0]: '8' and timeArr[1]: '54pm'
        var newHour = Number(time[0]);
        var newMin = Number(time[1].substring(0,2)); // 05 gets set to 5
        var amPm = time[1].substring(2);

        //for output later
        var hour = String(newHour);
        var min = String(newMin);

        //converts to military time
        if(amPm == 'pm'){
            newHour += 12;
        }

        if(newHour==12){
            if(amPm=='am'){
                newHour = 0;
            }
        }

        var now = new Date();
        var nowHour = now.getHours();
        var nowMin = now.getMinutes();
        var diffMin = newMin - nowMin;
        var diffHour = newHour - nowHour;

        if(diffHour<0){
            diffHour += 24;
        }

        if(diffMin<0){
            if(diffHour==0)
                diffHour = 24;
            diffMin += 60;
            diffHour --;
        }

        var minutes = (diffHour*60)+diffMin;

        if(minutes>=0){
            alarm.script = setTimeout(function(){
                console.log("\n\nGood morning!");
                unpause();
                alarmSet = false;
            },(1000*60*minutes));
            alarm.hour = newHour;
            alarm.minute = newMin;
            if(amPm=='am')
                alarm.am = true;
            else
                alarm.am = false;
            alarmSet = true;
            console.log("-- Alarm set to " + hour + ":" + min + " --");
            console.log("That is " + diffHour + " hours and " + diffMin + " minutes from now");
        }else if(minutes<0){
            console.log("-- Error setting alarm --");
            alarmSet = false;
        }
        if(arg=='menu')
            menu();
    });
}

function cancelAlarm(arg){
    var am;
    if(alarm.am)
        am = "am";
    else
        am = "pm";
    console.log("\nAlarm already set to " + alarm.hour + ":" + alarm.minute + am + ", cancel it? (yes/no)");
    prompt.get(['answer'], function(err, result){
        if(result.answer=='yes'){
            clearTimeout(alarm.script);
            console.log("\n-- Alarm cancelled --");
            alarmSet = false;
        }else{
            console.log("\nOk I'll leave the alarm on")
        }

        if(arg=='menu')
            menu();
    });
}

function pause(arg){
    spotify.pause(function(err, res){
        if(err){
            return console.error(err);
        }
    });
    if(arg=='menu')
        menu();
}

function unpause(arg){
    spotify.unpause(function(err, res){
        if(err){
            return console.error(err);
        }
    });
    if(arg=='menu')
        menu();
}

function info(arg){
    spotify.getStatus(function (err, res) {
        if (err) {
            return console.error(err);
        }

        artist = res.track.artist_resource;
        track = res.track.track_resource;

        if((artist==null)&&(track==null)){
            console.info('\nNot currently playing anything\n');
        }else{
            console.info('\nCurrently playing:', artist.name, '-', track.name + '\n');
        }

        if(arg=='menu')
            menu();
    });
}
//-- end basic functions --

//main logic flow
//explicitly called once, then recursively until quit is called? sure...that sounds like a plan
//should check if spotify-web-helper.exe is running, and not either launch Spotify or not accept commands
menu();
prompt.start();
var action;
function menu(){
    console.log("\nPlease enter an action: (info, pause, play, alarm, quit)");
    prompt.get(basicPrompt, function(err, result){
        action = result.action;

        switch (action){
            case 'info':
                info('menu');
                break;
            case 'pause':
                pause('menu');
                break;
            case 'play':
                unpause('menu');
                break;
            case 'alarm':
                if(alarmSet==false)
                    setAlarm('menu');
                else
                    cancelAlarm('menu');
                break;
            case 'quit':
                console.log('\n...Shutting down...');
                break;
            default:
                console.log('\nAction is not supported');
                menu();
                break;
        }
    });
}
