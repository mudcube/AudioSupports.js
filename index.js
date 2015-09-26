/*
	----------------------------------------------------------
	AudioSupports : 2015-09-25 : https://mudcu.be
	----------------------------------------------------------
	https://github.com/mudcube/AudioSupports
	----------------------------------------------------------
	Probably, Maybe, No... Absolutely!
	Determine audio formats and features your browser supports.
	----------------------------------------------------------
	TEST FILES - can these be smaller?
	----------------------------------------------------------
		Ogg Opus:      176-bytes
		Ogg Vorbis:    3,177-bytes
		MP3:           306-bytes
	----------------------------------------------------------
	USAGE
	----------------------------------------------------------
		AudioSupports(function(audioSupport) {
			console.log(audioSupport);
			// audioSupport example:
			// 	 {
			// 		 'audio': true,
			// 		 'audio_api': true,
			// 		 'midi_api': true,
			// 		 'ogg': true,
			// 		 'ogg_vorbis': true,
			// 		 'ogg_opus': true,
			// 		 'mpeg': true,
			// 		 'mpeg_mp3': true
			// 	 }
		});
		------------------------------------------------------
		/// register your own formats
		AudioSupports.register(format, codec, base64);

*/

(function() { 'use strict';

	var pending = 0; // pending tests
	var supports = {}; // supported audio formats
	var tests = {};
	///	
	self.AudioSupports = function(callback) {
		/* audio */
		if (detectAudio()) {
			detectAudioFormats(callback);
		} else {
			callback(supports);
		}

		/* audio api */
		detectWebAudio();

		/* midi api */
		detectMIDI();
	};
	///
	self.AudioSupports.register = register;
	///
	register('mpeg', 'mp3', '/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	register('ogg', 'opus', 'T2dnUwACAAAAAAAAAAAAAAAAAAAAAEVP7KoBE09wdXNIZWFkAQEAD0SsAAAAAABPZ2dTAAAAAAAAAAAAAAAAAAABAAAAVewFUgEYT3B1c1RhZ3MIAAAAUmVjb3JkZXIAAAAAT2dnUwAEwAMAAAAAAAAAAAAAAgAAAHSiY8oBA/j//g==');
	register('ogg', 'vorbis', 'T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=');

	/* detect audio */
	function detectAudio() {
		if (self.Audio) {
			return supports.audio = true;
		} else {
			return supports.audio = false;
		}
	};
	
	/* detect audio api */
	function detectWebAudio() {
		if (self.AudioContext || self.mozAudioContext || self.webkitAudioContext) {
			return supports.audio_api = true;
		} else {
			return supports.audio_api = false;
		}
	};

	/* detect midi api */
	function detectMIDI() {
		if (navigator.requestMIDIAccess) {
			var toString = Function.prototype.toString;
			var isNative = toString.call(navigator.requestMIDIAccess).indexOf('[native code]') !== -1;
			if (isNative) { // has native midi support
				return supports.midi_api = true;
			} else { // check for jazz plugin support
				for (var n = 0; navigator.plugins.length > n; n ++) {
					var plugin = navigator.plugins[n];
					if (plugin.name.indexOf('Jazz-Plugin') >= 0) {
						return supports.midi_api = true;
					}
				}
			}
		}
		///
		return supports.midi_api = false;
	};
	
	/* detect formats */
	function detectAudioFormats(callback) {
		var audio = new Audio;
 		var opus = !!audio.canPlayType('audio/ogg; codecs="opus"').replace(/no/i, '');
		var vorbis = !!audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/i, '');
		var mp3 = !!audio.canPlayType('audio/mpeg').replace(/no/i, '');

		/// at this point we possibly maybe have support
		if (opus || vorbis || mp3) {

			mp3 && canPlayThrough(tests['mpeg_mp3']);
			opus && canPlayThrough(tests['ogg_opus']);
			vorbis && canPlayThrough(tests['ogg_vorbis']);

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

	function canPlayThrough(test) {
		var format = test.format;
		var codec = test.codec;
		var base64 = test.base64;
		///
		pending ++;
		///
		var audio = new Audio;
		audio.id = 'audio';
		audio.autobuffer = true;
		audio.controls = false;
		audio.preload = 'auto';
		audio.addEventListener('error', function() {
			hasSupport(false);
		}, false);
		audio.addEventListener('canplaythrough', function() {
			hasSupport(true);
		}, false);
		audio.src = 'data:audio/' + format + ';base64,' + base64;
		audio.load();
		///
		function hasSupport(truthy) {
			if (!supports[format]) supports[format] = truthy;
			supports[format + '_' + codec] = truthy;
			pending --;
		};
	};

	/* register formats */
	function register(format, codec, base64) {
		tests[format + '_' + codec] = {
			format: format,
			codec: codec,
			base64: base64
		};
	};
	
	/* expose */
	self.AudioSupports = AudioSupports;

})();
