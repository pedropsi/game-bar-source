console.log("I'm a service worker");

// Install 
self.addEventListener('install',function(event){
	console.log('install');
	event.waitUntil(
		caches.open('v2').then(function(cache){
			console.log("cached!");
			return cache.addAll([
				'./unlucky-unlock.html',
				'./codes/index.css',
				'./codes/communication.js',
				'./codes/analytics.js',
				'./codes/game/game.css',
				'./codes/game/puzzlescript-embed.js',
				'./codes/game/puzzlescript/unlucky-unlock.js',
				"./codes/game/modules/globalVariables",
				"./codes/game/modules/debug_off",
				"./codes/game/modules/font",
				"./codes/game/modules/rng",
				"./codes/game/modules/riffwave",
				"./codes/game/modules/sfxr",
				"./codes/game/modules/codemirror",
				"./codes/game/modules/colors",
				"./codes/game/modules/graphics",
				"./codes/game/modules/engine",
				"./codes/game/modules/parser",
				"./codes/game/modules/compiler",
				"./codes/game/modules/inputoutput",
				"./codes/game/modules/mobile",
				"./codes/game/modules/data-game-colours",
				"./codes/game/modules/data-game-extras",
				"./codes/game/modules/data-game-overwrite",
				"./codes/game/modules/data-game-moves"
			]);
		})
	);
});

// Activate 
self.addEventListener('activate', function(event) {
    console.log('activate');
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


