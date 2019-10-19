////////////////////////////////////////////////////////////////////////////////
//Puzzlescript overwrite

//doSetupTitleScreenLevelContinue - Level selector - start saving a stack of checkpoints
function doSetupTitleScreenLevelContinue(){	LoadGame();};

doSetupTitleScreenLevelContinue()

//DoWin - Level selector - keep track of solved levels and echo win
function DoWin() {
	if (!winning) {
		MarkWonLevel();
		ObtainPlayEndLevelSound();
		againing = false;
		if (unitTesting){
			return void nextLevel();
		}
		winning = true, timer = 0
	}
}

//nextLevel
function nextLevel(){
	againing=false;
	messagetext="";
	
	NextLevel();
	
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
	
	//Play if memorised
	if(playSound[seed]){
		function P(){PlaySound(playSound[seed])};
		Throttle(P,500,seed);
		return;
	}

	//Play if overwritten
	var sounds=GetElements('.sound');	
	if(sounds){
		sounds=sounds.filter(function(s){return s.dataset.sfx===String(seed)});
		if(sounds.length>0){
			playSound[seed]=sounds[0].src; //memorise
			PlaySound(playSound[seed]);
			return;
		}
	}

	//Default play if not played before
	checkAudioContextExists();
	if (unitTesting) return;
	var sound = cacheSeed(seed);
	sound.play();
}


// Preserve this function as is
function AdjustFlickscreen(){
	if (state!==undefined && state.metadata.flickscreen!==undefined){
		oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)];
	}
}



////////////////////////////////////////////////////////////////////////////////
// Game data link defaults, for puzzlescript, overwritable

//Game Options
if(typeof ObtainBGColor==="undefined")
	function ObtainBGColor(){return state.bgcolor;}

if(typeof ObtainFGColor==="undefined")
	function ObtainFGColor(){return state.fgcolor;}

if(typeof ObtainUndo==="undefined")
	function ObtainUndo(){return !state.metadata.noundo;}

if(typeof ObtainRestart==="undefined")
	function ObtainRestart(){return !state.metadata.norestart;}


//Game and Level Navigation
if(typeof ObtainStateScreens==="undefined")
	function ObtainStateScreens(){return state.levels;}

if(typeof ObtainNewGameCondition==="undefined")
	function ObtainNewGameCondition(){return titleSelection===0}

if(typeof ObtainLevelLoader==="undefined")
	function ObtainLevelLoader(){loadLevelFromState(state,curlevel)};

if(typeof ObtainLevelTransition==="undefined")
	function ObtainLevelTransition(){
		textMode=false;
		titleScreen=false;
		quittingMessageScreen=false;
		messageselected=false;
	}

if(typeof ObtainTitleScreenLoader==="undefined")
	function ObtainTitleScreenLoader(){goToTitleScreen()};

if(typeof ObtainPlayEndGameSound==="undefined")
	function ObtainPlayEndGameSound(){tryPlayEndGameSound()};

if(typeof ObtainPlayEndLevelSound==="undefined")
	function ObtainPlayEndLevelSound(){tryPlayEndLevelSound()};