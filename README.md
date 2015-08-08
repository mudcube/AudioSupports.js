# AudioDetectSupport

```js
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

/// register your own formats
AudioDetectSupport.register(format, codec, base64);
```
