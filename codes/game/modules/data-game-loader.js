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
		
		return load_game(element, id);
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
				compile(["restart"], code);
				
				window.scrollTo(0,0);
				/////////////////////////////////////////////////////////////////////////////////////
				// Game bar
				if(typeof AddGameBar!=="undefined")
					AddGameBar();
			}
		}
		githubHTTPClient.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		githubHTTPClient.send();
	}

	window.PuzzleScript = window.PuzzleScript || { embed: embed };

})();