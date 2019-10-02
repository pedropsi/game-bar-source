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

function SupraStyle(gameSelector){

	var stylesheet="\
			#gameCanvas{\
			position:unset;\
			max-height:96vh;\
			width:100%;\
		}\
		.game-container{\
			display:flex;\
			flex-direction:column;\
			align-items:center;\
			justify-content: space-between;\
			font-family:var(--font);\
		}\
		.game-container:fullscreen #gameCanvas{\
			height:calc(96vh);\
		}\
		.game-container:full-screen #gameCanvas{\
			height:calc(96vh);\
		}\
		@media only screen and (max-width:330px) {\
			.game-container:fullscreen #gameCanvas{\
				height:calc(94vh);\
			}\
			.game-container:full-screen #gameCanvas{\
				height:calc(94vh);\
			}\
		}";
	
	stylesheet=stylesheet.replace(/\#gameCanvas/g,gameSelector).replace(/\.game\-container/g,ParentSelector(gameSelector));
	AddElement("<style>"+stylesheet+"</style>",document.head);
}

// Load the Game Bar
var puzzlescriptModules=[
"data-game-colours",
"data-game-extras",
"data-game-overwrite"
]

if(navigator.onLine){
	LoaderInFolder("https://pedropsi.github.io/game-bar/codes")("data-transfer");
	puzzlescriptModules.map(LoaderInFolder("https://pedropsi.github.io/game-bar/codes/game/modules"));
}
else{
	LoaderInFolder("../codes")("data-transfer");
	puzzlescriptModules.map(LoaderInFolder("../codes/game/modules"));
}

function GameBarLoad(){
	RemoveElement(".tab");
	PrepareGame();
	SupraStyle(gameSelector);
}

window.addEventListener('load',GameBarLoad);

