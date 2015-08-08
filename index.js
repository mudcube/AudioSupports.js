/*
	----------------------------------------------------------
	AudioDetectSupport : 2015-08-07 : https://mudcu.be
	----------------------------------------------------------
	https://github.com/mudcube/AudioDetectSupport
	----------------------------------------------------------
	Probably, Maybe, No... Absolutely!
	Detect what format Audio your browser supports.
	----------------------------------------------------------
	Currently detects: MP3 | Ogg Opus | Ogg Vorbis
	----------------------------------------------------------
	TEST FILES
	----------------------------------------------------------
		Ogg Opus:      176 chars
		Ogg Vorbis:    3,177 chars
		MP3:           306 chars
	----------------------------------------------------------
	USAGE
	----------------------------------------------------------
		AudioDetectSupport(function(audioSupport) {
			console.log(audioSupport);
			// audioSupport example:
			// 	 {
			// 		 'audio': true,
			// 		 'audioapi': true,
			// 		 'midiapi': true,
			// 		 'ogg': true,
			// 		 'ogg:vorbis': true,
			// 		 'ogg:opus': true,
			// 		 'mpeg': true,
			// 		 'mpeg:mp3': true
			// 	 }
		});
		------------------------------------------------------
		/// register your own formats
		AudioDetectSupport.register(format, codec, base64);

*/

var AudioDetectSupport = (function() { 'use strict';

	var tests = {};
	var supports = {}; // supported audio formats
	var pending = 0; // pending tests
	///
	function canPlayThrough(test) {
		var format = test.format;
		var codec = test.codec;
		var base64 = test.base64;
		///
		pending ++;
		///
		var audio = new Audio;
		audio.id = 'audio';
		audio.setAttribute('preload', 'auto');
		audio.setAttribute('autobuffer', true);
		audio.addEventListener('error', function() {
			hasSupport(false);
		}, false);
		audio.addEventListener('canplaythrough', function() {
			hasSupport(true);
		}, false);
		audio.src = 'data:audio/' + format + ';base64,' + base64;
		///
		var body = document.body;
		body.appendChild(audio);
		///
		function hasSupport(truthy) {
			if (!supports[format]) supports[format] = truthy;
			supports[format + ':' + codec] = truthy;
			body.removeChild(audio);
			pending --;
		};
	};
	
	function AudioDetectSupport(callback) {
		/// Audio
		if (detectAudio()) {
			detectAudioFormat(callback);
		} else {
			callback(supports);
		}

		/// Audio API
		detectWebAudio();

		/// MIDI API
		detectMIDI();
	};
	
	AudioDetectSupport.register = register;
	///
	register('mpeg', 'mp3', '/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	register('ogg', 'opus', 'T2dnUwACAAAAAAAAAAAAAAAAAAAAAEVP7KoBE09wdXNIZWFkAQEAD0SsAAAAAABPZ2dTAAAAAAAAAAAAAAAAAAABAAAAVewFUgEYT3B1c1RhZ3MIAAAAUmVjb3JkZXIAAAAAT2dnUwAEwAMAAAAAAAAAAAAAAgAAAHSiY8oBA/j//g==');
	register('ogg', 'vorbis', 'T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=');
	///
	return AudioDetectSupport;


	/* helpers */
	function detectAudio() {
		if (window.Audio) {
			return supports.audio = true;
		} else {
			return supports.audio = false;
		}
	};
	
	function detectAudioFormat(callback) {
		var audio = new Audio;

		/// see what we can learn from the browser
		var opus = audio.canPlayType('audio/ogg; codecs="opus"');
		opus = (opus === 'probably' || opus === 'maybe'); //- 'no' is better test?

		var vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
		vorbis = (vorbis === 'probably' || vorbis === 'maybe');

		var mp3 = audio.canPlayType('audio/mpeg');
		mp3 = (mp3 === 'probably' || mp3 === 'maybe');

		/// at this point we possibly maybe have support
		if (opus || vorbis || mp3) {

			if (mp3) canPlayThrough(tests['mpeg:mp3']);
			if (opus) canPlayThrough(tests['ogg:opus']);
			if (vorbis) canPlayThrough(tests['ogg:vorbis']);

			/// lets find out!
			var startTime = Date.now();
			var interval = setInterval(function() {
				var maxExecution = Date.now() - startTime > 5000;
				if (!pending || maxExecution) {
					clearInterval(interval);
					callback(supports);
				}
			}, 1);
		}
	};
	
	function detectWebAudio() {
		if (window.AudioContext || window.mozAudioContext || window.webkitAudioContext) {
			return supports.audioapi = true;
		} else {
			return supports.audioapi = false;
		}
	};
	
	function detectMIDI() {
		if (navigator.requestMIDIAccess) {
			var toString = Function.prototype.toString;
			var isNative = toString.call(navigator.requestMIDIAccess).indexOf('[native code]') !== -1;
			if (isNative) { // has native midi support
				return supports.midiapi = true;
			} else { // check for jazz plugin support
				for (var n = 0; navigator.plugins.length > n; n ++) {
					var plugin = navigator.plugins[n];
					if (plugin.name.indexOf('Jazz-Plugin') >= 0) {
						return supports.midiapi = true;
					}
				}
			}
		}
		///
		return supports.midiapi = false;
	};
	
	function register(format, codec, base64) {
		tests[format + ':' + codec] = {
			format: format,
			codec: codec,
			base64: base64
		};
	};

})();
