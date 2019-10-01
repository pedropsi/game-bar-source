//Helpers

function LoadAsync(sourcename,folder){
	var head= document.head;
	var script= document.createElement('script');
	var ext='.js';
	var folder=((folder+"/").replace(/\/\//,"/"))||"codes/"
	if(sourcename.replace(".txt","")!=sourcename){
		ext="";
	}
	script.src= folder+sourcename+ext;
	script.async= false;
	
	head.appendChild(script);
}

function LoaderInFolder(folder){
	return function(sourcename){return LoadAsync(sourcename,folder)};
}

// Load the Game Bar
var puzzlescriptModules=[
"data-game-colours",
"data-game-extras",
"data-game-overwrite"
]

LoaderInFolder("../codes")("data-transfer");
puzzlescriptModules.map(LoaderInFolder("../codes/game/modules"));

function GameBarLoad(){
	RemoveElement(".tab");
	PrepareGame();
}

window.addEventListener('load',GameBarLoad);

