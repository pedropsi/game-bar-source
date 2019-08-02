////////////////////////////////////////////////////////////////////////////////
/// Game Preparation
function PrepareGame(){
	document.removeEventListener('keydown',onKeyDown);
	ResumeCapturingKeys();
	window.scrollTo(0,0);
	AddGameBar();
	PlaylistStartPlay();
	GameFocus();	
}


////////////////////////////////////////////////////////////////////////////////
/// Game Bar

function GameBar(){
	var undo=!state.metadata.noundo?ButtonOnClickHTML('↶','CheckRegisterKey({keyCode:85});GameFocus();'):"";
	var restart=!state.metadata.norestart?ButtonOnClickHTML('↺','CheckRegisterKey({keyCode:82});GameFocus();'):"";
	
	var buttons=[
		ButtonHTML({txt:"🖫",attributes:{onclick:'ToggleSavePermission(this);GameFocus();',class:savePermission?'selected':''}}),
		ButtonLinkHTML("How to play?"),
		undo,
		restart,
		//ButtonOnClickHTML("< ^ > v",'RequestPlaylist();LoadPlaylistControls()'),
		ButtonOnClickHTML("Select level",'RequestLevelSelector()'),
		ButtonOnClickHTML("✉",'RequestGameFeedback()'),
		ButtonLinkHTML("Credits"),
		ButtonHTML({txt:"♫",attributes:{onclick:'ToggleCurrentSong();GameFocus();',id:'MuteButton'}}),
		ButtonHTML({txt:"◱",attributes:{onclick:'ToggleFullscreen(".game-container");GameFocus();',id:'FullscreenButton'}}),
	].join("")
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(idorselector){
	var idorselector=idorselector||"#puzzlescript-game";
	var bar=document.getElementById("GameBar");
	if(bar!==null)
		bar.parentNode.removeChild(bar);
	AddAfterElement(GameBar(),idorselector)
}


/////////////////////////////////////////////////////////////////////////////////////
// Focus on Game Canvas
function GameFocus(DP){
	window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	ResumeCapturingKeys();
};

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;
var savePermission=true;
ConsoleAddMany([
			"Autosave is ON for "+pageTitle()+".",
			"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);


function ToggleSavePermission(thi){
	if(thi)thi.classList.remove("selected");
	if(savePermission){
		savePermission=false;
		UnsaveSave();
		ConsoleAdd("All 2 cookies erased for "+pageTitle()+": Autosave is OFF across sessions.");
	}
	else {
		savePermission=true;
		ConsoleAddMany([
			"Autosave is ON for "+pageTitle()+".",
			"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);
		if(thi)thi.classList.add("selected");
	}	
}

/////////////////////////////////////////////////////////////////////////////////////
// Save Level & Checkpoint

function DocumentURL(){
	if (typeof pageNoTag==="undefined")
		return document.URL;
	else
		return pageNoTag(document.URL);
}
function CanSaveLocally(){
	return window.localStorage;
}
function HasCheckpoint(){
	return void 0!==localStorage[DocumentURL()+"_checkpoint"];
}
function HasLevel(){
	return CanSaveLocally()&&void 0!==localStorage[DocumentURL()];
}

// Checkpoint Save

function MaxCheckpoint(m){ 
	if(m===undefined){  //Getter
		var c=Number(curcheckpoint);
		MaxCheckpoint.max=MaxCheckpoint.max?Math.max(c,MaxCheckpoint.max):c;
	}
	else				//Setter (m)
		MaxCheckpoint.max=Number(m);
	return MaxCheckpoint.max;
}

function SetCheckpointStack(newstack){
	MaxCheckpoint(newstack.length);
	if(savePermission)
		return localStorage[DocumentURL()+"_checkpoint"]=JSON.stringify(newstack);
	else
		UnsaveCheckpoint();
}
function GetCheckpointStack(){
	var stack= JSON.parse(localStorage[DocumentURL()+"_checkpoint"]);
	MaxCheckpoint(stack.length-1);
	return stack;
}
	
function SaveCheckpoint(levelTarget,isReloading){
	var newstack;
	if (HasCheckpoint()){
		var stack=GetCheckpointStack();
		if(typeof stack.dat==="undefined"){
			if(isReloading)
				stack.pop();
			newstack=EvacuateCheckpointStack(stack,curcheckpoint);
			newstack=stack.concat([levelTarget]);
		}
		else{
			if(isReloading)
				newstack=[levelTarget];
			else{
				newstack=[stack,levelTarget];
			}
		}
	}
	else
		newstack=[levelTarget];
	
	curcheckpoint=newstack.length-1;
	return SetCheckpointStack(newstack);
}


// Level Save
function SaveLevel(curlevel){
	if(savePermission){
		localStorage[DocumentURL()+"_solvedlevels"]=JSON.stringify(SolvedLevelScreens());
		return localStorage[DocumentURL()]=curlevel;
	}
	else
		UnsaveLevel();
};

function UnsaveCheckpoint(){
	return localStorage.removeItem(DocumentURL()+"_checkpoint");
};
function UnsaveLevel(){
	return localStorage.removeItem(DocumentURL());
};
function UnsaveSave(){
	return CanSaveLocally()&&(UnsaveLevel(),UnsaveCheckpoint());
}


function LoadLevel(){
	SolvedLevelScreens.levels=JSON.parse(localStorage[DocumentURL()+"_solvedlevels"]).map(Number);
	return curlevel=localStorage[DocumentURL()];
}
function LoadCheckpoint(n){
	var stack=GetCheckpointStack();
	if(typeof stack.dat=="undefined"){
			if(typeof n==="undefined")
				curcheckpoint=stack.length-1; //default to last checkpoint
			else{
				curcheckpoint=Math.min(Math.max(n-1,0),stack.length-1);
				stack=EvacuateCheckpointStack(stack,curcheckpoint);
		}
		curlevelTarget=stack[curcheckpoint];
	}
	else{
		curcheckpoint=0;
		curlevelTarget=stack;
	}
	var a=[],b;
	for(b in Object.keys(curlevelTarget.dat))
		a[b]=curlevelTarget.dat[b];
	return curlevelTarget.dat=new Int32Array(a)
}

function EvacuateCheckpointStack(stack,n){
	var s=stack;
	var i=s.length-1;
	while(n<i){
		i--;
		s.pop();
	}
	return s;
};

function LoadSave(){
	if(HasLevel()){
		if(HasCheckpoint())
			LoadCheckpoint();
		return LoadLevel();
	}
}


////////////////////////////////////////////////////////////////////////////////
// Level/Message Screen navigation

function ScreenMessage(lvl){
	return typeof state.levels[lvl].message !=="undefined"
}

function ScreenType(level){
	return typeof level.message==="undefined";	
}

function LevelScreens(){
	if(LevelScreens.l!==undefined)
		return LevelScreens.l;
	else{
		var l=[];
		for(var i=0;i<state.levels.length;i++){
			if(ScreenType(state.levels[i]))
				l.push(i);
		}
		return LevelScreens.l=l;
	}
}

function SolvedLevelScreens(){
	if(SolvedLevelScreens.levels===undefined)
		SolvedLevelScreens.levels=[];
	return SolvedLevelScreens.levels;
}

function AddToSolvedScreens(curlevel){
	function SortNumber(a,b){return a-b};
	if(!ScreenMessage(curlevel)&&!LevelScreenSolved(curlevel)){
		SolvedLevelScreens.levels.push(Number(curlevel));
		SolvedLevelScreens.levels=SolvedLevelScreens.levels.sort(SortNumber);
	}
	return SolvedLevelScreens();
}

function LevelScreenSolved(curlevel){
	return SolvedLevelScreens().indexOf(curlevel)>=0
}

function UnSolvedLevelScreens(){
	return LevelScreens().filter(function(l){return !LevelScreenSolved(l)});
}

function FirstUnsolvedScreen(curlevel){
	if(UnSolvedLevelScreens().length===0)
		return 1+LevelScreens()[LevelScreens().length-1];
	else{
		var c=LevelScreens().indexOf(UnSolvedLevelScreens()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelScreens()[c-1];
	}
}

function NextUnsolvedScreen(curlevel){
	var firstusolve=UnSolvedLevelScreens().filter(x=>x>=curlevel)[0];
	var lastsolvebefore=LevelScreens().filter(x=>x<firstusolve);
	return lastsolvebefore[lastsolvebefore.length-1]+1;
}

function LastScreen(){return state.levels.length-1;};

function FinalLevelScreen(){
	var li=LevelScreens(); return li[li.length-1];
};

function ClearSolvedLevelScreens(){
	return SolvedLevelScreens.levels=[];
}

function SolvedAllLevels(){
	return LevelScreens().every(LevelScreenSolved);
}

function LevelNumber(curlevel){
	return LevelScreens().filter(function(l){return l<curlevel}).length+1;
}



function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var type="level";
		var DPOpts={
			questionname:"Access one of the "+LevelScreens().length+" levels",
			qfield:"level",
			qchoices:LevelScreens().map(StarLevel),
			defaultChoice:function(i,c){return Number(c)===LevelNumber(curlevel)}
		}
	}
	else{
		var type="checkpoint";
		var checkpointIndices=Object.keys(GetCheckpointStack());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qfield:"level",
			qchoices:checkpointIndices.map(l=>(Number(l)+1)+""),
			defaultChoice:function(i,c){return Number(c)===checkpointIndices.length}
		}
	}
	
	function RequestLevelSelectorIndeed(){
		RequestDataPack([
				['exclusivechoice',DPOpts]
			],
			{
				actionvalid:LoadLevelFromDP,
				actionText:"Go to "+type,
				qid:RequestLevelSelector.id,
				qonsubmit:FocusAndResetFunction(RequestLevelSelector,GameFocus),
				qonclose:FocusAndResetFunction(RequestLevelSelector,GameFocus),
				qdisplay:LaunchBalloon,
				qtargetid:'puzzlescript-game'
			});
	}
	
	//StopCapturingKeys();
	OpenerCloser(RequestLevelSelector,RequestLevelSelectorIndeed,GameFocus);
}

function MaxLevelDigits(){
	if(MaxLevelDigits.m)
		return MaxLevelDigits.m;
	return MaxLevelDigits.m=Math.ceil(Math.log10(1+LevelScreens().length));
};
function StarLevel(l){
	var n=LevelNumber(l)+"";
	var padding="0".repeat(MaxLevelDigits()-n.length);
	return padding+n+(LevelScreenSolved(l)?"★":"");
}
function UnstarLevel(l){
	return Number(l.replace("★",""));
}

function LoadLevelFromDP(DP){
	var lvl=UnstarLevel(FindData('level',DP.qid));
	if(!HasCheckpoint()){
		//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
		lvl=lvl<2?0:(LevelScreens()[lvl-2]+1);
		GoToLevel(lvl);
	}
	else{
		GoToLevelCheckpoint(lvl);
	}
};

function GoToLevelCheckpoint(ncheckpoint){
	if(HasCheckpoint()){
		LoadCheckpoint(ncheckpoint);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};

function GoToLevel(lvl){
	curlevel=lvl;
	AdvanceLevel();
	canvasResize();
};



////////////////////////////////////////////////////////////////////////////////
// Overwrite Helpers


function StartLevelFromTitle(){
	if (titleSelection===0){//new game
		ResetLevel();
	}
	LoadLevelOrCheckpoint();
}

function ResetLevel(){
	curlevel=0;
	curlevelTarget=null;
}

function ResetGame(){
	UnsaveSave();
	ClearSolvedLevelScreens();
	ResetLevel();
	goToTitleScreen();
	tryPlayEndGameSound();
}

function AdvanceLevel(){
	textMode=false;
	titleScreen=false;
	quittingMessageScreen=false;
	messageselected=false;
	SaveLevel(curlevel);
	LoadLevelOrCheckpoint();
}

function AdvanceUnsolvedScreen(){
	if(ScreenMessage(curlevel)&&curlevel<FinalLevelScreen()){
		//console.log("from message");
		curlevel++;
	}
	else if(curlevel>=FinalLevelScreen()||!NextUnsolvedScreen(curlevel)){
		//console.log("from last level");
		curlevel=FirstUnsolvedScreen(curlevel);
	}
	else{
		//console.log("from anywhere in the middle");
		curlevel=NextUnsolvedScreen(curlevel);
	}		
	AdvanceLevel();	
}

function AdvanceEndScreen(){
	if(curlevel>=FinalLevelScreen())
		curlevel++;
	else
		curlevel=FinalLevelScreen()+1;
	
	AdvanceLevel();		
}

function LoadLevelOrCheckpoint(){
	if (curlevelTarget!==null){
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		//curlevelTarget=null;
	}
	else
		loadLevelFromState(state,curlevel);
}

function RefreshCheckpoint(){
	if(CanSaveLocally()){
		if(null!==curlevelTarget){
			restartTarget=level4Serialization();
			SaveCheckpoint(restartTarget,true)
		}
		else UnsaveCheckpoint();
	}
}

function AdjustFlickscreen(){
	if (state!==undefined && state.metadata.flickscreen!==undefined){
		oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)];
	}
}


//onKeyDown
function CheckRegisterKey(event){
	checkKey(event,true);
	RegisterMove(event.keyCode);
}

function OnKeyDown(event) {
	event = event || window.event;
	var key=event.keyCode;

	//console.log(event);
	
	//Not inside other elements, such as feedback forms, etc...
	if(event.target.tagName!=="BODY")
		return;
	
	//Prevent arrows/space from scrolling page
	if (([32, 37, 38, 39, 40].indexOf(key) > -1)) {
		prevent(event);
	}

	//Feedback
	if (key===70){//F
		RequestGameFeedback();
		prevent(event);	//Avoid inputting F in the form
		return;		
	}

	//Select Level
	if (key===76){//L
		RequestLevelSelector();
		return;
	}

	//Pause/Unpause music
	if (key===77){//M
		ToggleCurrentSong();
		return;
	}

	//Avoid repetition?
    if (keybuffer.indexOf(key)>=0) {
    	return;
    }
	
	//Instruct the game
    if(lastDownTarget === canvas /*|| (window.Mobile && (lastDownTarget === window.Mobile.focusIndicator) )*/ ){
    	if (keybuffer.indexOf(key)===-1) {
    		keybuffer.splice(keyRepeatIndex,0,key);
	    	keyRepeatTimer=0;
	    	CheckRegisterKey(event);
		}
	}
}

function StopCapturingKeys(){
	document.removeEventListener('keydown',OnKeyDown);
}
function ResumeCapturingKeys(){
	document.addEventListener('keydown',OnKeyDown);
}


////////////////////////////////////////////////////////////////////////////////
//Overwritings - Level selector

//doSetupTitleScreenLevelContinue - Level selector - start saving a stack of checkpoints
function doSetupTitleScreenLevelContinue(){
	try{LoadSave()}
	catch(c){}}
doSetupTitleScreenLevelContinue()

//DoWin - Level selector - update
function DoWin() {
	if (!winning) {
		EchoLevelWin(curlevel);
		AddToSolvedScreens(curlevel);
		SaveLevel(curlevel);
		if(typeof customLevelInfo!= "undefined")customLevelInfo();
		if (againing = false, tryPlayEndLevelSound(), unitTesting){
			ClearLevelRecord();
			return void nextLevel();
		}
		winning = true, timer = 0
	}
}

//nextLevel - Level selector - go to level
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
	
	RefreshCheckpoint();
	AdjustFlickscreen();
	canvasResize();
}


////////////////////////////////////////////////////////////////////////////////
//Overwritings - Keyboard Input

//onKeyDown - custom shortcuts and avoiding other input problems





function processInput(a,b,c){
	againing=false;
	verbose_logging&&(-1===a?consolePrint("Turn starts with no input."):(consolePrint("======================="),consolePrint("Turn starts with input of "+["up","left","down","right","action"][a]+".")));
	var d=backupLevel(),e=[];
	if(4>=a){
		if(0<=a){
			switch(a){
				case 0:a=1;break;
				case 1:a=4;break;
				case 2:a=2;break;
				case 3:a=8;break;
				case 4:a=16
			}
		e=startMovement(a)
		}
		var g=0;
		level.bannedGroup=[];
		rigidBackups=[];
		level.commandQueue=[];
		var h=0,l=false,p=commitPreservationState();
		sfxCreateMask.setZero();
		sfxDestroyMask.setZero();
		seedsToPlay_CanMove=[];
		seedsToPlay_CantMove=[];
		calculateRowColMasks();
		do l=false,g++,verbose_logging&&consolePrint("applying rules"),applyRules(state.rules,state.loopPoint,h,level.bannedGroup),resolveMovements()?(l=true,restorePreservationState(p)):(verbose_logging&&consolePrint("applying late rules"),applyRules(state.lateRules,state.lateLoopPoint,0)),h=0;
		while(50>g&&l);
		50<=g&&consolePrint("looped through 50 times, gave up.  too many loops!");
		if(0<e.length&&void 0!==state.metadata.require_player_movement){
			h=false;
			for(g=0;g<e.length;g++)
				if(l=level.getCell(e[g]),state.playerMask.bitsClearInArray(l.data)){
					h=true;
					break
				}
				if(!1===h)
					return verbose_logging&&(consolePrint("require_player_movement set, but no player movement detected, so cancelling turn."),consoleCacheDump()),backups.push(d),DoUndo(!0,!1),!1
		}
		if(0<=level.commandQueue.indexOf("cancel"))
			return verbose_logging&&(consoleCacheDump(),consolePrint("CANCEL command executed, cancelling turn.",!0)),backups.push(d),messagetext="",DoUndo(!0,!1),tryPlayCancelSound(),!1;
		if(0<=level.commandQueue.indexOf("restart"))
			return verbose_logging&&(consolePrint("RESTART command executed, reverting to restart state."),consoleCacheDump()),backups.push(d),messagetext="",DoRestart(!0),!0;
		if(c&&0<=level.commandQueue.indexOf("win"))
			return true;
		h=false;
		for(g=0;g<level.objects.length;g++)
			if(level.objects[g]!==d.dat[g]){
				if(c)
					return verbose_logging&&consoleCacheDump(),backups.push(d),DoUndo(!0,!1),!0;-1!==a&&backups.push(d);
				h=true;
				break
			}
		if(c)
			return verbose_logging&&consoleCacheDump(),!1;
		for(g=0;g<seedsToPlay_CantMove.length;g++)
			playSound(seedsToPlay_CantMove[g]);
		for(g=0;g<seedsToPlay_CanMove.length;g++)
			playSound(seedsToPlay_CanMove[g]);
		for(g=0;g<state.sfx_CreationMasks.length;g++)
			a=state.sfx_CreationMasks[g],sfxCreateMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		for(g=0;g<state.sfx_DestructionMasks.length;g++)
			a=state.sfx_DestructionMasks[g],sfxDestroyMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		for(g=0;g<level.commandQueue.length;g++)
			a=level.commandQueue[g],"f"===a.charAt(1)&&tryPlaySimpleSound(a),!1===unitTesting?"message"===a&&showTempMessage():messagetext="";
		false!==textMode||void 0!==b&&!1!==b||(verbose_logging&&consolePrint("Checking win condition."),checkWin());
		winning||(0<=level.commandQueue.indexOf("checkpoint")&&(EchoCheckpoint(),verbose_logging&&consolePrint("CHECKPOINT command executed, saving current state to the restart state."),restartTarget=level4Serialization(),hasUsedCheckpoint=true,SaveCheckpoint(restartTarget),SaveLevel(curlevel)),0<=level.commandQueue.indexOf("again")&&h&&(b=verbose_logging,g=messagetext,verbose_logging=false,processInput(-1,!0,!0)?((verbose_logging=b)&&consolePrint("AGAIN command executed, with changes detected - will execute another turn."),againing=true,timer=0):(verbose_logging=b)&&consolePrint("AGAIN command not executed, it wouldn't make any changes."),verbose_logging=b,messagetext=g));level.commandQueue=[]
	}
	verbose_logging&&consoleCacheDump();
	winning&&(againing=false);
	return h
}


////////////////////////////////////////////////////////////////////////////////
//Overwritings - Sound 

//playSound - custom sound effects, if available
function playSound(seed) {
	if (!Muted())
		PlaySound(FindSoundName(seed));
}

function FindSoundName(seed){ //Finds the sound name which overwrites the PS seed
	var seedname=String(seed);
	if(!FindSoundName.names)
		FindSoundName.names={};
	var nameObj=FindSoundName.names;
	if(nameObj[seedname])
		return nameObj[seedname];
	else{
		var sounds=GetElements(".sound");
		var found=false;
		var i=0;
		var nob={}
		while(!found&&i<sounds.length){
			if(sounds[i].dataset.sfx===seedname){
				found=true;
				nob[seedname]=sounds[i].id;
				FindSoundName.names=FuseObjects(FindSoundName.names,nob);
			};
			i++;
		}
		if(found)
			return sounds[i-1].id;
		else
			return seedname;
	}
}