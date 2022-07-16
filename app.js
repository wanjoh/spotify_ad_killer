const credentials = require('./credentials/1');
const express = require('express');
const path = require('path');
var request = require('request');
const { setTimeout } = require('timers');
var exec = require('child_process').exec;

const id = credentials.CLIENT_ID;
const secret = credentials.CLIENT_SECRET;
const token = credentials.token;

//currently_playing_type


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


// app.use(function (req, res, next) {
//     const err = new Error('Pokušali ste da učitate stranicu koja ne postoji: ' + req.url);
//     err.status = 404;

//     next(err);
// });
s = id.toString() + ':' + secret.toString();
console.log(s);
var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer(id+':'+secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
};


var ad_kill = function () {   
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
      
            var options = {
                url: 'https://api.spotify.com/v1/me/player',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                //console.log(body);
                if(body != null){
                    // console.log(body.currently_playing_type);
                    // console.log(body.currently_playing_type == "ad");
                    
                    if(body.currently_playing_type == "ad"){
                        console.log("reklama");
                        exec('pkill spotify',
                        function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                        exec('spotify',
                        function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                        //play();
                        setTimeout(ad_kill, 60000);
                    }else{
                        console.log(body.item.duration_ms);
                        console.log(body.progress_ms);
                        time_left = body.item.duration_ms - body.progress_ms;
                        console.log(time_left);
                        setTimeout(ad_kill, time_left + 10);
                    }
                }
                else setTimeout(ad_kill, 60000);
            });
        }
    });
}


ad_kill();
module.exports = app;