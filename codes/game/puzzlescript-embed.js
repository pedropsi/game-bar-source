(function()
{
	function embed(element, id, config)
	{
		var canvas,
			settings =
			{
				engine: "codes/game/scripts_play_compiled.js"
			};

		extend(settings, config);
		clear_children(element);
		canvas = create_game_canvas(element, settings);

		return load_engine(element, id, settings, function(){
			window.canSetHTMLColors = false;
			if (document.documentElement && document.documentElement.ontouchstart !== undefined){
				canvas.onmousedown = function(){
					canvas.onmousedown = null;
					var gestureHandler = Mobile.enable(true);
					gestureHandler.setFocusElement(canvas);
				}
				load_game(element, id, settings);
			}
			else{
				load_game(element, id, settings);
			}
		});
	}

	function create_game_canvas(element, id, settings){
		var canvas = document.createElement("canvas");
		canvas.id = "gameCanvas";
		element.appendChild(canvas);
		return canvas;
	}

	function load_engine(element, id, settings, onload){
		var script = document.createElement("script");
		script.setAttribute("src", settings.engine);
		script.addEventListener('load', onload, false);
		document.body.appendChild(script);
		return script;
	}

	function load_game(element, id, settings, callback){
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
				compile(["restart"], code);
				
				window.scrollTo(0,0);
				/////////////////////////////////////////////////////////////////////////////////////
				// Music hook
				if(typeof OverrideMusic!=="undefined")
					OverrideMusic();
				/////////////////////////////////////////////////////////////////////////////////////
				// Game bar
				if(typeof AddGameBar!=="undefined")
					AddGameBar();
			}
		}
		githubHTTPClient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		githubHTTPClient.send();
	}

	function extend(target, object){
		if (typeof object !== 'undefined'){
			for (var key in object){
				target[key] = object[key];
			}
		}
		return target;
	}

	function auto_embed(){
		var element = document.querySelector("*[data-puzzlescript]");
		if (element != null){
			var config = { };
			if (element.dataset.puzzlescriptJs != undefined){
				config.engine = element.dataset.puzzlescriptJs;
			}
			embed(element, element.dataset.puzzlescript, config);
		}
	}

	window.PuzzleScript = window.PuzzleScript || { embed: embed };
	window.addEventListener("load", auto_embed);
	
})();

function clear_children(element){
	while (element.lastChild){
		element.removeChild(element.lastChild);
	}
}

if(typeof displayError==="undefined")
	displayError=console.log;

PrependElement('<div class="game-container"><div id="puzzlescript-game" class="game"></div></div>',"body");
