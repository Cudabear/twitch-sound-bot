var irc = require('irc');
var sounds = require('play-sound')({});
var settings = {
	channels: ['#cudabear'],
	server: 'irc.twitch.tv',
	port: 6667,
	secure: false,
	nick: 'your_bot_nick',
	password: 'your_bot_oauth'
}
var soundRequesters = [ ];

var burns = [
	'is a dick',
	'is a noob',
	'is horrible at clues',
	'dies a lot',
	'cant pvp to save his life',
	'is a terrible streamer',
	'is a horrible person',
	'will never make it big',
	'will never get max cape',
	'got pked for his entire bank',
	'died to jad in 2017'
]

var client = new irc.Client(settings.server, settings.nick, {
	channels: [settings.channels + " " + settings.password],
	debug: false,
	port: settings.port,
	password: settings.password,
	username: settings.nick
});

client.addListener('error', function(message){
	console.log('error: ', message);
});

client.addListener('join', function(channel, who){
	console.log('who joined? ', who);
});

client.addListener('message#cudabear', function(from, message){
	if(message.indexOf('bot, play sound:') > -1){
		var parts = message.split(':');
		client.say(settings.channels[0], 'Heres where I\'d play:' + parts[1]);
	}else if(message.indexOf('roast ') > -1){
		var parts = message.split(' ');
		var randomIndex = Math.round(Math.random()*(burns.length-1));
		client.say(settings.channels[0], parts[1] + ' ' + burns[randomIndex]);
	}else if(message.indexOf('play ') > -1){
		var parts = message.split(' ');

		var requesterExists = false;
		var timeSinceLastRequest = 1000000;
		soundRequesters.forEach(function(requester){
			if(requester.name === from){
				requesterExists = requester;
				timeSinceLastRequest = (new Date()).getTime() - requesterExists.requestTime.getTime();
			}
		});

		if(!requesterExists){
			requesterExists = {
				name: from,
				requestTime: new Date()
			};

			soundRequesters.push(requesterExists);
		}

		
		if(timeSinceLastRequest > 30*1000){
			if(parts[1] == 'wasted'){
				sounds.play('sfx/wasted.wav');
			}else if(parts[1] == 'trombone'){
				sounds.play('sfx/trombone.mp3');
			}else if(parts[1] == 'airhorn'){
				sounds.play('sfx/airhorn.mp3');
			}else if(parts[1] == 'xfiles'){
				sounds.play('sfx/xfiles.wav');
			}else if(parts[1] == 'wow'){
				sounds.play('sfx/wow.mp3');
			}else if(parts[1] == 'sad'){
				sounds.play('sfx/sad.wav');
			}else if(parts[1] == 'ground'){
				sounds.play('sfx/ground.wav');
			}else if(parts[1] == 'numberone'){
				sounds.play('sfx/numberone.wav');
			}
		}else{
			client.say(settings.channels[0], from + ' please wait ' + Math.round(((30*1000 - timeSinceLastRequest)/1000)) + ' seconds before playing more sounds');
		}
	}
});