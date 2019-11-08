var CACHE_VERSION=3;

var CURRENT_CACHES={
	main: 'PSI-cache-v' + CACHE_VERSION
};

var preCacheFiles=[
	"/",
	/*"cacher.js",*/
	
	"abxtract-tractx"+".html",
	"blockworks"+".html",
	"burokku-konekuta"+".html",
	"gravirinth"+".html",
	"platformer-template"+".html",
	"pmgrp"+".html",
	"unlucky-unlock"+".html",
	"skilleblokker"+".html",
	"tetrastrophe"+".html",
	"tiaradventur"+".html",
	"whirlpuzzle"+".html",
	
	"codes/index.css",
	"codes/communication.js",
	"codes/data-transfer.js",
	"codes/analytics.js",
	"codes/game/game.css",
	"codes/game/puzzlescript-embed.js",
	
	"codes/game/puzzlescript/"+"abxtract-tractx"+".js",
	"codes/game/puzzlescript/"+"blockworks"+".js",
	"codes/game/puzzlescript/"+"burokku-konekuta"+".js",
	"codes/game/puzzlescript/"+"gravirinth"+".js",
	"codes/game/puzzlescript/"+"platformer-template"+".js",
	"codes/game/puzzlescript/"+"pmgrp"+".js",
	"codes/game/puzzlescript/"+"unlucky-unlock"+".js",
	"codes/game/puzzlescript/"+"skilleblokker"+".js",
	"codes/game/puzzlescript/"+"tetrastrophe"+".js",
	"codes/game/puzzlescript/"+"tiaradventur"+".js",
	"codes/game/puzzlescript/"+"whirlpuzzle"+".js",
	
	"codes/game/modules/globalVariables",
	"codes/game/modules/debug_off",
	"codes/game/modules/font.js",
	"codes/game/modules/rng.js",
	"codes/game/modules/riffwave.js",
	"codes/game/modules/sfxr.js",
	"codes/game/modules/codemirror.js",
	"codes/game/modules/colors.js",
	"codes/game/modules/graphics.js",
	"codes/game/modules/engine.js",
	"codes/game/modules/parser.js",
	"codes/game/modules/compiler.js",
	"codes/game/modules/inputoutput.js",
	"codes/game/modules/mobile.js",
	"codes/game/modules/data-game-colours.js",
	"codes/game/modules/data-game-extras.js",
	"codes/game/modules/data-game-overwrite.js",
	"codes/game/modules/data-game-moves.js"
		];

self.addEventListener('activate', function(event){
	var expectedCacheNames=Object.values(CURRENT_CACHES);

	// Active worker won't be treated as activated until promise
	// resolves successfully.
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cacheName){
					if (!expectedCacheNames.includes(cacheName)){
						console.log('Deleting out of date cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});



self.addEventListener("install",function(event){
		console.log("installing precache files");
	self.skipWaiting();
	caches.open(CURRENT_CACHES.main).then(function(cache){
		return cache.addAll(preCacheFiles);
	});
});



self.addEventListener("fetch",function(event){
	console.log("Fetching");
	console.log(event);
	event.respondWith(
		caches.match(event.request).then(function(response){
			if(!response){
				//network fetch
				return fetch(event.request).then(function(response){
					caches.cache("dynamic").cache(response.clone());
					return response;
				});
			}
			return response;
		})
	);
});
*/