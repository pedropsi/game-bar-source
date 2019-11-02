console.log("I'm a service worker");

// Install 
self.addEventListener('install',function(event){
	console.log('install');
	event.waitUntil(
		caches.open('v3').then(function(cache){
			console.log("cached!");
			return cache.addAll([
				'./unlucky-unlock.html',
				'./codes/index.css',
				'./codes/communication.js',
				'./codes/data-transfer.js',
				'./codes/analytics.js',
				'./codes/game/game.css',
				'./codes/game/puzzlescript-embed.js',
				'./codes/game/puzzlescript/unlucky-unlock.js',
				"./codes/game/modules/globalVariables",
				"./codes/game/modules/debug_off",
				"./codes/game/modules/font.js",
				"./codes/game/modules/rng.js",
				"./codes/game/modules/riffwave.js",
				"./codes/game/modules/sfxr.js",
				"./codes/game/modules/codemirror.js",
				"./codes/game/modules/colors.js",
				"./codes/game/modules/graphics.js",
				"./codes/game/modules/engine.js",
				"./codes/game/modules/parser.js",
				"./codes/game/modules/compiler.js",
				"./codes/game/modules/inputoutput.js",
				"./codes/game/modules/mobile.js",
				"./codes/game/modules/data-game-colours.js",
				"./codes/game/modules/data-game-extras.js",
				"./codes/game/modules/data-game-overwrite.js",
				"./codes/game/modules/data-game-moves.js"
			]);
		})
	);
});

// Activate 
self.addEventListener('activate', function(event) {
    console.log('activate');
	var cacheKeeplist = ['v3'];

	event.waitUntil(
		caches.keys().then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if (cacheKeeplist.indexOf(key) === -1) {
					return caches.delete(key);
				}
			}));
		})
	);
});

// Listen for network requests from the main document
self.addEventListener('fetch',function(event){
	console.log('fetch');
	event.respondWith(
		caches.match(event.request).then(function(response){
			return response||fetch(event.request)
		})
	);
});


