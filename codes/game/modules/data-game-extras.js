////////////////////////////////////////////////////////////////////////////////
// Game Preparation
function PrepareGame(){
	StopCapturingKeys(onKeyDown);ResumeCapturingKeys(OnKeyDownGame);
	window.scrollTo(0,0);
	AddGameBar();
	PlaylistStartPlay();
	GameFocus();	
}


////////////////////////////////////////////////////////////////////////////////
// Game Bar

function GameBar(targetIDsel){
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
		ButtonHTML({txt:"◱",attributes:{onclick:'ToggleFullscreen("'+targetIDsel+'");GameFocus();',id:'FullscreenButton'}}),
	].join("");
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(targetIDsel){
	var targetIDsel=targetIDsel||"#puzzlescript-game";
	var bar=GetElement("GameBar");
	if(bar!==null)
		bar.parentNode.removeChild(bar);
	var parentElement=GetElement(targetIDsel).parentElement;
	if(!parentElement.id)
		parentElement.id=GenerateId();
	AddAfterElement(GameBar(parentElement.id),targetIDsel)
}



/////////////////////////////////////////////////////////////////////////////////////
// Focus on Game Canvas
function GameFocus(DP){
	window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	keyActions=keyActionsGame;
};

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;

var savePermission=true;
ConsoleAddMany([
			"Localsave is ON for "+pageTitle()+".",
			"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);


function ToggleSavePermission(thi){
	if(thi)thi.classList.remove("selected");
	if(savePermission){
		savePermission=false;
		EraseLocalsave();
		ConsoleAdd("All 2 cookies erased for "+pageTitle()+": Localsave is OFF across sessions.");
	}
	else {
		savePermission=true;
		ConsoleAddMany([
			"Localsave is ON for "+pageTitle()+".",
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


// Localsave = save in local storage
function LocalsaveLevel(curlevel){
	if(savePermission){
		localStorage[DocumentURL()+"_solvedlevels"]=JSON.stringify(SolvedLevelScreens());
		return localStorage[DocumentURL()]=curlevel;
	}
	else
		EraseLocalsaveLevel();
};

function LocalsaveCheckpoints(newstack){
	if(savePermission)
		return localStorage[DocumentURL()+"_checkpoint"]=JSON.stringify(newstack);
	else
		EraseLocalsaveCheckpoints();
}

function EraseLocalsaveLevel(){
	return localStorage.removeItem(DocumentURL());
};

function EraseLocalsaveCheckpoints(){
	return localStorage.removeItem(DocumentURL()+"_checkpoint");
};

function EraseLocalsave(){
	return CanSaveLocally()&&(EraseLocalsaveLevel(),EraseLocalsaveCheckpoints());
}


// Load from memory
function LoadLevel(){
	SolvedLevelScreens.levels=JSON.parse(localStorage[DocumentURL()+"_solvedlevels"]).map(Number);
	return curlevel=localStorage[DocumentURL()];
}


function LocalloadCheckpoints(){
	var storeddata=localStorage[DocumentURL()+"_checkpoint"];
	var sta=storeddata?JSON.parse(storeddata):[];
	sta=sta.dat?[sta]:sta;	//data compatibility (converts single checkpoint to array if needed)
	return sta;
}

function GetCheckpoints(){
	if(GetCheckpoints.stack)
		return GetCheckpoints.stack;
	else
		return GetCheckpoints.stack=LocalloadCheckpoints();
}

function LoadCheckpoint(n){
	var stack=GetCheckpoints();

	if(n<stack.length)
		ConsoleAddOnce("Beware! Saving at a past checkpoint will erase former future progress...");
	
	curcheckpoint=Math.min(Math.max(n-1,0),stack.length-1); //decrement 1 unit
	return curlevelTarget=stack[curcheckpoint];
}


function PushSaveCheckpoint(levelTarget){
	var stack=GetCheckpoints();
	
	function EvacuateCheckpoints(stack,n){
		var s=stack;
		var i=s.length-1;
		while(n<i){
			i--;
			s.pop();
		}
		return s;
	};
	
	if(curcheckpoint+1<stack.length){
		stack=EvacuateCheckpoints(stack,curcheckpoint);
		ConsoleAdd("Saved in a past checkpoint. Future progress erased.")
	}
	
	stack=stack.concat([levelTarget]);
	curcheckpoint=stack.length-1;
	
	return GetCheckpoints.stack=stack;
}



function LoadGame(){
	if(HasLevel()){
		if(HasCheckpoint()){
			LoadLastCheckpoint();
		}
		return LoadLevel();
	}
}


// Preserve original level save format (within checkpoint stack)

function FormerLevel4Serialization() { //The original one
	var ret = {
		dat : Array.from(level.objects),
		width : level.width,
		height : level.height,
		oldflickscreendat: oldflickscreendat.concat([]),
		//New
		lvl:curlevel
	};
	return ret;
}




////////////////////////////////////////////////////////////////////////////////
// Level/Message Screen navigation

// Keep track of solved levels

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


// Level Selector

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
		var checkpointIndices=Object.keys(GetCheckpoints());
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
				qtargetid:'puzzlescript-game',
				shortcutExtras:extraShortcutsF
			});
	}
	
	function extraShortcutsF(DP){return {"L":function(){Close(DP.qid)}}};
	
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

function GoToLevelCheckpoint(n){
	if(HasCheckpoint()){
		LoadCheckpoint(n);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};

function GoToLevel(lvl){
	curlevel=lvl;
	AdvanceLevel();
	canvasResize();
};


// Level Progression

function StartLevelFromTitle(){
	if (titleSelection===0){//new game
		ResetLevel();
		ResetCheckpoints();
	}
	
	LoadLastCheckpoint();
	LoadLevelOrCheckpoint();
}

function ResetLevel(){
	curlevel=0;
	curlevelTarget=null;
}


function LoadLastCheckpoint(){
	if(HasCheckpoint()){
		var stack=GetCheckpoints();
		curcheckpoint=stack.length-1;
		curlevelTarget=stack[curcheckpoint];
	}
}

function ResetCheckpoints(){
	curcheckpoint=0;
	EraseLocalsaveCheckpoints();
	GetCheckpoints.stack=[];
}

function ResetGame(){
	EraseLocalsave();
	ClearSolvedLevelScreens();
	ResetLevel();
	ResetCheckpoints();
	goToTitleScreen();
	tryPlayEndGameSound();
}

function AdvanceLevel(){
	textMode=false;
	titleScreen=false;
	quittingMessageScreen=false;
	messageselected=false;
	LocalsaveLevel(curlevel);
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
	if ((typeof curlevelTarget!=="undefined")&&(curlevelTarget!==null)){
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		curlevelTarget=null;
	}
	else
		loadLevelFromState(state,curlevel);
}

// Preserve this function

function AdjustFlickscreen(){
	if (state!==undefined && state.metadata.flickscreen!==undefined){
		oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)];
	}
}


////////////////////////////////////////////////////////////////////////////////
//Key capturing

//Game keybinding profile
keyActionsGame={
	//Arrows & Spacebar
	32:function(ev){prevent(ev);InstructGame(ev)},
	37:function(ev){prevent(ev);InstructGame(ev)},
	38:function(ev){prevent(ev);InstructGame(ev)},
	39:function(ev){prevent(ev);InstructGame(ev)},
	40:function(ev){prevent(ev);InstructGame(ev)},
	//WASD
	65:function(ev){ev.keyCode=37;InstructGame(ev)},
	87:function(ev){ev.keyCode=38;InstructGame(ev)},
	68:function(ev){ev.keyCode=39;InstructGame(ev)},
	83:function(ev){ev.keyCode=40;InstructGame(ev)},	
	//Enter, C, X
	13:function(ev){ev.keyCode=88;InstructGame(ev)},	
	67:function(ev){ev.keyCode=88;InstructGame(ev)},	
	88:function(ev){ev.keyCode=88;InstructGame(ev)},
	// Z, U     
	90:function(ev){ev.keyCode=85;InstructGame(ev)},	
	85:InstructGame,	
	// R
	82:InstructGame,	
	// Esc
	27:InstructGame,
	70:function(ev){				//F
		RequestGameFeedback();
		prevent(ev);//Avoid inputting the letter F in the form
		},
	76:RequestLevelSelector, 	//L
	77:ToggleCurrentSong		//M
}

//Execute key instructions
function CheckRegisterKey(event){
	checkKey(event,true);
	RegisterMove(event.keyCode);
}


function InstructGame(event){
	var key=event.keyCode;
		
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


function OnKeyDownGame(event) {
	event = event || window.event;
	//Not inside other elements, such as feedback forms, etc...
	if(event.target.tagName!=="BODY")
		return;
	else if(keyActions[event.keyCode])
		keyActions[event.keyCode](event);
}




////////////////////////////////////////////////////////////////////////////////
// Custom sounds 

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