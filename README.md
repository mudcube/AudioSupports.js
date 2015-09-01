# AudioSupports

Quick and easy Audio format, and Audio feature detection.

```js
AudioSupports(function(supports) {

	console.log(supports);

	// output:
	// 	 {
	// 		 'audio': true,
	// 		 'audioapi': true,
	// 		 'midiapi': true,
	// 		 'ogg': true,
	// 		 'ogg_vorbis': true,
	// 		 'ogg_opus': true,
	// 		 'mpeg': true,
	// 		 'mpeg_mp3': true
	// 	 }
});

/// register custom formats with this method (or create a pull-request)
AudioSupports.register(format, codec, base64);
```
