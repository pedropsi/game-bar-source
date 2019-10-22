// Add the game container to the page  <img src="images/splash.png" alt="Loading...">
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

// Load the Puzzlescript engine
var puzzlescriptModules=[
/*Puzzlescript modules*/
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
/*Extras*/
"data-game-colours",
"data-game-extras",
"data-game-overwrite",
"data-game-moves",
"data-game-example"
]

puzzlescriptModules.map(LoaderInFolder("codes/game/modules"));


// Compile the game
function CompileGame(sourceCode){
	compile(["restart"], sourceCode);
	ListenOnce(['click','keydown','keypress','keyup'],PrepareGame);
}

// Load an offline example
function LoadGameExample(){CompileGame(sourceCodeExample);};

// Load from network
function LoadGameFromID(id){
	var githubURL = 'https://api.github.com/gists/' + id;
			
	function ProcessGame(gamedata){
		if(gamedata===""){
			ConsoleAdd("Offline! Loading a local game example, for testing...");
			LoadGameExample();
		}
		else{
			var code=JSON.parse(gamedata)["files"]["script.txt"]["content"];
			CompileGame(code);
		}
	}
	
	LoadDataTry(githubURL,ProcessGame);
}

// Enable mobile
function EnableMobile(){Mobile.enable(true);}
ListenOnce('mousedown',EnableMobile,GetElement("gameCanvas"));

// Embed
window["PuzzleScript"]=window["PuzzleScript"]||{embed:embed};

function embed(target,id){
	function LoadGame(){
		LoadGameFromID(id);
	};
	
	function LoadGameSlowly(){setTimeout(LoadGame,1000);}
	
	if(Online())
		ListenOnce('load',LoadGame);
	else{
		ConsoleAdd(pageTitle()+" will load as soon as back online.");
		ListenOnce('load',LoadGameExample);
		ListenOnce("online",LoadGameSlowly)
	}
}
