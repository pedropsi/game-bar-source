console.log("I'm a service worker");

const preCacheName = "pre-cache-"+"PSI"+"-v4",
	oldCacheNumber="-v3",
	preCacheFiles = [
	"/",
	"cacher.js",
	
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
	"codes/game/modules/data-game-moves.js"];

///////////////////////////////////////////////////////////////////////////////
//Install
function PreCacheFiles(cache){
	return cache.addAll(preCacheFiles);
}

function PreCache(event){
	console.log("installing precache files");
	self.skipWaiting();
	caches.open(preCacheName).then(PreCacheFiles);
}

self.addEventListener("install",PreCache);

///////////////////////////////////////////////////////////////////////////////
//Activate
function DeleteCachedFile(filename){
	if(value.indexOf(oldCacheNumber)<0){
		caches.delete(filename);
	}
}

function DeleteOldCache(cacheNames){
	cacheNames.forEach(DeleteCachedFile);
	console.log("service worker activated");
	return;
}

function ActivateCache(event){
	event.waitUntil(caches.keys().then(DeleteOldCache));
}

self.addEventListener("activate",ActivateCache);

///////////////////////////////////////////////////////////////////////////////
//Fetch from cache, then network

function DynamicFetch(response){
	caches.cache("dynamic").cache(response.clone());
	return response;
}

function NetworkFallbackFetch(response){
	if(!response){
		return fetch(event.request).then(DynamicFetch);
	}
	return response;
}

function FetchCache(event){
	console.log("Fetching");
	console.log(event);
	event.respondWith(
		caches.match(event.request).then(NetworkFallbackFetch)
	);
}

self.addEventListener("fetch",FetchCache);