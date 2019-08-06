// Add the game container to the page
PrependElement('<div class="game-container"><div id="puzzlescript-game" class="game"><canvas id="gameCanvas"></canvas></div></div>',"body");

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
"data-game-extras",
"data-game-overwrite",
"data-game-moves"
]

puzzlescriptModules.map(LoaderInFolder("codes/game/modules"));


// Load the game
(function(){
	
	function embed(element, id){
		
		ListenOnce('mousedown',function(){var gestureHandler = Mobile.enable(true);},GetElement("gameCanvas"));
		
		function LoadGame(){load_game(id);}
		
		function FastLoad(){
			if(typeof compile!=="undefined")
				LoadGame();
			else
				ListenOnce('load',LoadGame);
		}
		
		function SlowLoad(){setTimeout(LoadGame,1000);}
		
		if(Online())
			FastLoad();
		else{
			ConsoleAdd(pageTitle()+" will load as soon as back online.");
			ListenOnce("online",SlowLoad)
		}
	}
	
	
	function load_game(id){
		var githubURL = 'https://api.github.com/gists/' + id;
		var githubHTTPClient = new XMLHttpRequest();
		githubHTTPClient.open('GET', githubURL);
		githubHTTPClient.onreadystatechange = function (){
			if (githubHTTPClient.readyState != 4){
				return;
			}
			var result = githubHTTPClient.responseText;
			
			function LoadOnline(){
				if (githubHTTPClient.status === 403){
					ConsoleAdd("Error loading the game: <b>forbidden</b>");
					console.log(403,result.message);
				}
				else if (githubHTTPClient.status !== 200 && githubHTTPClient.status !== 201){
					ConsoleAdd("Error loading the game: <b>not created</b>");
					console.log(200,"HTTP Error " + githubHTTPClient.status + ' - ' + githubHTTPClient.statusText);
				}
				else{
					result = JSON.parse(result);
					var code = result["files"]["script.txt"]["content"];
					ConsoleAdd(pageTitle()+" loaded.");				
					compile(["restart"], code);
					
					ListenOnce(['click','keydown','keypress','keyup'],PrepareGame);
				}
			}
			
			if(result===""){
				ConsoleAdd("Offline! Please reconnect, then refresh the page!");
			}
			else
				LoadOnline();
						
		}
		githubHTTPClient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		githubHTTPClient.send();
	}

	window.PuzzleScript = window.PuzzleScript ||{ embed: embed };

})();