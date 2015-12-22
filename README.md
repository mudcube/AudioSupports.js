# AudioSupports(...)

#### Probably, Maybe, No... Absolutely!

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

#### Register custom formats (or create a pull-request)

```js
AudioSupports.register(format, codec, base64);
```
