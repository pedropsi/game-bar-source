console.log("I'm a service worker");

function AppIdentifier(){
	return document.location.pathname.replace(/\.html/,"");
}

function PathJS(){
	return PathHTML().replace(".html",".js");
}


const preCacheName = "pre-cache-"+AppIdentifier()+"-v1",
    preCacheFiles = [
	"/",
	"cacher.js",
	AppIdentifier()+".html",
	"codes/index.cs",
	"codes/communication.js",
	"codes/data-transfer.js",
	"codes/analytics.js",
	"codes/game/game.css",
	"codes/game/puzzlescript-embed.js",
	"codes/game/puzzlescript"+AppIdentifier()+".js",
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


self.addEventListener("install",event=>{
    console.log("installing precache files");
	self.skipWaiting();
	caches.open(preCacheName).then(function(cache){
		return cache.addAll(preCacheFiles);
	});
});

self.addEventListener("activate",event=>{
	event.waitUntil(
		caches.keys().then(cacheNames=>{
			cacheNames.forEach(value=>{
				if(value.indexOf("-v0")< 0){
					caches.delete(value);
				}
			});
			console.log("service worker activated");
			return;
		})
	);
});


self.addEventListener("fetch",event=>{
	event.respondWith(
		caches.match(event.request).then(response=>{
			if(!response){
				//network fetch
				return fetch(event.request)
				then(response=>{
					caches.cache("dynamic").cache(response.clone());
					return response;
				});
			}
			return response;
		})
	);
});


/*)
// Install 
self.addEventListener('install',function(event){
	console.log('install');
	event.waitUntil(
		caches.open('v4').then(function(cache){
			console.log("cached!");
			return cache.addAll([
				'./cacher.js',
				
				'.'+PathHTML(),
				'./codes/index.css',
				'./codes/communication.js',
				'./codes/data-transfer.js',
				'./codes/analytics.js',
				'./codes/game/game.css',
				'./codes/game/puzzlescript-embed.js',
				
				'./codes/game/puzzlescript'+PathJS(),
				
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
self.addEventListener('activate',function(event){
    console.log('activate');
	var cacheKeeplist = ['v4'];

	event.waitUntil(
		caches.keys().then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if(cacheKeeplist.indexOf(key)=== -1){
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


*/