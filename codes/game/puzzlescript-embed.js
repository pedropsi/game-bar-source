// Add the game container to the page 
PreAddElement('\
<div class="game-supra-container">\
	<div class="game-rotation-container">\
		<div class="game-container">\
			<div id="puzzlescript-game" class="game">\
				<canvas id="gameCanvas"></canvas>\
			</div>\
		</div>\
	</div>\
</div>',"body");

ConsoleAdd("Loading "+pageTitle()+"...");

LoadStyle(pageRoot()+"codes/game/game.css");

// Load the Game
LoaderInFolder("codes/game/puzzlescript")(pageIdentifier())

// Load the Puzzlescript engine
var puzzlescriptModules=[
//Puzzlescript modules
"globalVariables",
"debug_off",
"font",
"rng",
"riffwave",
"sfxr",
"codemirror",
"colors",
"graphics",
"engine",
"parser",
"compiler",
"inputoutput",
"mobile",
//Extras
"data-game-colours",
"data-game-extras",
"data-game-overwrite",
"data-game-moves"
]

puzzlescriptModules.map(LoaderInFolder("codes/game/modules"));

// Enable mobile
function EnableMobile(){Mobile.enable(true);}

// Compile the game
function CompileGame(){
	compile(["restart"], sourceCode);
	DelayUntil(function(){return (typeof PrepareGame!=="undefined");},PrepareGame);
	ListenOnce('mousedown',EnableMobile,GetElement("gameCanvas"));
}

function LoadPuzzlescriptGame(){
	DelayUntil(function(){return (typeof compile!=="undefined")&&(typeof sourceCode!=="undefined");},CompileGame);
}

LoadPuzzlescriptGame();