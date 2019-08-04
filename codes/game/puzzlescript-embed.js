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
(function()
{
	function embed(element, id, config)
	{
		var canvas=document.getElementById("gameCanvas");
		canvas.onmousedown = function(){
			canvas.onmousedown = null;
			var gestureHandler = Mobile.enable(true);
		}
		
		//Try a fast load if possible
		if(typeof compile!=="undefined"){
			load_game(element, id);
		}
		else{
			window.addEventListener('load',function(event){
				load_game(element, id);
			});
		}
	}

	function load_game(element, id){
		var githubURL = 'https://api.github.com/gists/' + id;
		var githubHTTPClient = new XMLHttpRequest();

		githubHTTPClient.open('GET', githubURL);
		githubHTTPClient.onreadystatechange = function () {
			if (githubHTTPClient.readyState != 4) {
				return;
			}
			var result = JSON.parse(githubHTTPClient.responseText);
			if (githubHTTPClient.status === 403) {
				console.log("forbidden");
				displayError(403,result.message);
			} else if (githubHTTPClient.status !== 200 && githubHTTPClient.status !== 201) {
				console.log("not ok, not created");
				displayError(200,"HTTP Error " + githubHTTPClient.status + ' - ' + githubHTTPClient.statusText);
			} else {
				console.log("loaded");

				var result = JSON.parse(githubHTTPClient.responseText);
				var code = result["files"]["script.txt"]["content"];
				
					console.log("started");
					compile(["restart"], code);
					
					ListenOnce(['click','keydown','keypress','keyup'],PrepareGame);
				
			}
		}
		githubHTTPClient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		githubHTTPClient.send();
	}

	window.PuzzleScript = window.PuzzleScript || { embed: embed };

})();