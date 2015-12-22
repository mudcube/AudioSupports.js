/*
	----------------------------------------------------------
	AudioSupports : 2015-12-22 : https://mudcu.be
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
*/

(function () { 'use strict';

	var supports = {};
	var tests = {};

	function AudioSupports() {
		detectAudio();
		detectMIDI();
		detectWebAudio();

		return detectAudioFormats().then(function () {
			return supports;
		});
	}


	/* synchronous detects */
	function detectAudio() {
		return supports.audio = self.Audio ? {} : false;
	}
	
	function detectWebAudio() {
		return supports.audioapi = AudioContext ? {} : false;
	}
	
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
		return supports.midiapi = false;
	}


	/* asynchronous detects */
	function detectAudioFormats() {
		return new Promise(function (resolve, reject) {
			if (!supports.audio) {
				return resolve();
			}

			/* max execution time */
			setTimeout(resolve, 5000);

			/* run tests */
			Promise.all([
				canPlayThrough(tests['mpeg_mp3']),
				canPlayThrough(tests['ogg_opus']),
				canPlayThrough(tests['ogg_vorbis'])
			]).then(resolve);
		});
	}

	function canPlayThrough(test) {
		return new Promise(function (resolve, reject) {
			var format = test.format;
			var codec = test.codec;
			var base64 = test.base64;
			
			var mime = 'audio/' + format + '; codecs="' + codec + '"';
			var src = 'data:' + mime + ';base64,' + base64;

			var audio = new Audio();
			if (!audio.canPlayType(mime).replace(/no/i, '')) {
				hasSupport(false);
				return;
			}

			audio.id = 'audio';
			audio.controls = false;
			audio.setAttribute('autobuffer', true);
			audio.setAttribute('preload', 'auto');
			audio.addEventListener('error', function onError(err) {
				if (createObjectURL && !audio.testedBlobURL) {
					audio.testedBlobURL = true; // workaround for https://code.google.com/p/chromium/issues/detail?id=544988&q=Cr%3DInternals-Media&colspec=ID%20Pri%20M%20Stars%20ReleaseBlock%20Cr%20Status%20Owner%20Summary%20OS%20Modified
					audio.src = createObjectURL(base64ToBlob(src));
				} else {
					audio.removeEventListener('error', onError);
					hasSupport(false);
				}
			});
			audio.addEventListener('canplaythrough', function onCanPlayThrough() {
				audio.removeEventListener('canplaythrough', onCanPlayThrough);
				hasSupport(true);
			});
			audio.src = src;
			audio.load();

			function hasSupport(truthy) {
				record(supports.audio, format, codec, truthy);
				
				if (!supports.audioapi) {
					resolve();
					return;
				}

				detectDecodeAudio(src).then(function () {
					record(supports.audioapi, format, codec, true);
					resolve();
				}, function (err) {
					record(supports.audioapi, format, codec, false);
					resolve();
				});
				
				function record(_supports, format, codec, truthy) {
					!supports[format] && (supports[format] = truthy);
					!supports[codec] && (supports[codec] = truthy);
					_supports[codec] = truthy;
				}
			}
		});
	}
	
	var audioContext;
	var AudioContext = self.AudioContext || self.mozAudioContext || self.webkitAudioContext;
	var createObjectURL = (self.URL || self.webkitURL || {}).createObjectURL;

	function detectDecodeAudio(src) {
		return new Promise(function (resolve, reject) {
			audioContext = audioContext || new AudioContext();
			audioContext.decodeAudioData(base64ToBuffer(src), resolve, reject);
			setTimeout(reject, 250); // chrome workaround https://code.google.com/p/chromium/issues/detail?id=424174
		});
	}

	/* base64 utils */
	function base64Mime(uri) {
		uri = uri.split(',');
		return uri[0].split(':')[1].split(';')[0];
	}

	function base64ToBuffer(uri) {
		uri = uri.split(',');
		var binary = atob(uri[1]);
		var buffer = new ArrayBuffer(binary.length);
		var uint = new Uint8Array(buffer);
		for (var n = 0; n < binary.length; n++) {
			uint[n] = binary.charCodeAt(n);
		}
		return buffer;
	}
	
	function base64ToBlob(uri) {
		return new Blob([base64ToBuffer(uri)], {
			type: base64Mime(uri)
		});
	}
	

	/* register formats */
	function register(format, codec, base64) {
		tests[format + '_' + codec] = {
			format: format,
			codec: codec,
			base64: base64
		};
	}


	/* formats */
	register('mpeg', 'mp3', '/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
	register('ogg', 'opus', 'T2dnUwACAAAAAAAAAAAAAAAAAAAAAEVP7KoBE09wdXNIZWFkAQEAD0SsAAAAAABPZ2dTAAAAAAAAAAAAAAAAAAABAAAAVewFUgEYT3B1c1RhZ3MIAAAAUmVjb3JkZXIAAAAAT2dnUwAEwAMAAAAAAAAAAAAAAgAAAHSiY8oBA/j//g==');
	register('ogg', 'vorbis', 'T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=');


	/* expose */
	self.AudioSupports = AudioSupports;
	self.AudioSupports.register = register;

})();
