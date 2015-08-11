# AudioDetectSupport

Quick and easy Audio format, and Audio feature detection.

```js
AudioDetectSupport(function(audioSupport) {

	console.log(audioSupport);

	// output:
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

/// register custom formats with this method (or create a pull-request)
AudioDetectSupport.register(format, codec, base64);
```
