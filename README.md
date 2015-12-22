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
		 'audio': true,
		 'audioapi': true,
		 'midiapi': true,
		 'ogg': true,
		 'ogg_vorbis': true,
		 'ogg_opus': true,
		 'mpeg': true,
		 'mpeg_mp3': true
	 }
```

#### Register custom formats:

```js
AudioSupports.register(format, codec, base64);
```
