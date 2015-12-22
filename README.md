# AudioSupports(...)

#### Probably, Maybe, No... Absolutely!

*This handy little method detects Audio formats and features your browser supports.*

```js
AudioSupports(function (supports) {

});
```

#### An example output would be:

```js
	 {
		 'audio': { // these are supported on new Audio()
			 'vorbis': true,
			 'opus': true,
			 'mp3': true
		 },
		 'audioapi': { // these are supported on new AudioContext()
			 'vorbis': true,
			 'opus': true,
			 'mp3': true
		 },
		 'midiapi': true,
		 'vorbis': true, // these are supported either on Audio() or AudioContext()
		 'opus': true,
		 'mp3': true
	 }
```

#### Register custom formats:

```js
AudioSupports.register(format, codec, base64);
```
