LoadAsync("cacher",".");
ServiceWorker();

function PuzzlescriptPage(id){
	
	ConsoleAdd("Loading "+pageTitle()+"...");
	
	// Load the Game
	if(!id)
		LoaderInFolder("codes/game/puzzlescript")(pageIdentifier());
	else
		LoadExternalGame(id);

	if(!PuzzlescriptPage.modules){
		PuzzlescriptPage.modules=true;

		// Add the game container to the page 
		PreAddElement('<div id="puzzlescript-game" class="game">\
						<canvas id="gameCanvas"></canvas>\
					</div>',
			"body");
		
		WrapElement("puzzlescript-game",
			'<div class="game-supra-container">\
				<div class="game-rotation-container">\
					<div class="game-container">',
					'</div>\
				</div>\
			</div>');
		
		
		// Load the Styles
		LoadStyle(pageRoot()+"codes/game/game.css");
	
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
	
	}
}

// External loads, when needed
function LoadExternalGame(id){
	var url='https://api.github.com/gists/'+id;	
	function CompileReplace(data){
		if(data==="")
			return;
		var data=JSON.parse(data);
		sourceCode = data["files"]["script.txt"]["content"];
		CompileGame();
	}
	LoadData(url,CompileReplace,"application/x-www-form-urlencoded");
}

// Enable mobile
function EnableMobile(){Mobile.enable(true);}

// Compile the game
function CompileGame(){
	compile(["restart"], sourceCode);
	
	DelayUntil(function(){return (typeof PrepareGame!=="undefined");},PrepareGame);
	ListenOnce('mousedown',EnableMobile,GetElement("gameCanvas"));
}

function LoadPuzzlescriptGame(id){
	PuzzlescriptPage(id);

	DelayUntil(function(){return (typeof compile!=="undefined")&&(typeof sourceCode!=="undefined");},CompileGame);
	
}


if(pageSearch("game")!=="")
	LoadPuzzlescriptGame(pageSearch("game"));
else if(pageTitle()!=="Game Console")
	LoadPuzzlescriptGame();


