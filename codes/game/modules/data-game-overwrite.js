//doSetupTitleScreenLevelContinue - Level selector - start saving a stack of checkpoints
function doSetupTitleScreenLevelContinue(){	LoadGame();};

doSetupTitleScreenLevelContinue()

//DoWin - Level selector - keep track of solved levels and echo win
function DoWin() {
	if (!winning) {
		EchoLevelWin(curlevel);
		AddToSolvedScreens(curlevel);
		LocalsaveLevel(curlevel);
		if(typeof customLevelInfo!= "undefined")customLevelInfo();
		if (againing = false, tryPlayEndLevelSound(), unitTesting){
			return void nextLevel();
		}
		winning = true, timer = 0
	}
}

//nextLevel - Level selector - non-linear level navigation "jumping"
function nextLevel(){
	againing=false;
	messagetext="";
	
	curlevel=Math.min(curlevel,LastScreen()?LastScreen():curlevel);
	
	if (titleScreen)
		StartLevelFromTitle();
	else {
		if(!SolvedAllLevels())
			AdvanceUnsolvedScreen();
		else if(curlevel<LastScreen())
			AdvanceEndScreen();
		else{
			RequestHallOfFame();
			ResetGame();
		}
	}
	
	AdjustFlickscreen();
	canvasResize();
}


//level4Serialization - save a full checkpoint stack and echo
function level4Serialization() { //Intercept
	EchoCheckpoint();
	
	var stack=GetCheckpoints();
	console.log("restarting",restarting,stack);
	
	setTimeout(function(){
		console.log("saving...",stack);
		if(!restarting)
			stack=PushSaveCheckpoint(restartTarget)
		LocalsaveCheckpoints(stack);
		LocalsaveLevel(curlevel);
	},500)
	
	return FormerLevel4Serialization();
}


//playSound - custom sound effects, if available
function playSound(seed) {
	if (Muted())
		return;
	
	var sounds=GetElements('.sound');
	if(sounds.length>0)
		PlaySound(FindSoundName(seed),sounds);
	else{
		checkAudioContextExists();
		if (unitTesting) return;
		var sound = cacheSeed(seed);
		sound.play();
	}
}