////////////////////////////////////////////////////////////////////////////////
// Game Preparation

var gameSelector='#puzzlescript-game';

function PrepareGame(){
	StopCapturingKeys(onKeyDown);ResumeCapturingKeys(OnKeyDownGame);
	window.scrollTo(0,0);
	AddGameBar();
	AddElement("<style>"+ReplaceColours(stylesheet,state.bgcolor,state.fgcolor)+"</style>",'head');//Colorise
	ConsoleAddMany([
			"Localsave is ON for "+pageTitle()+".",
			"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);
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
		ButtonHTML({txt:"Select level",attributes:{onclick:'RequestLevelSelector();',id:'LevelSelectorButton'}}),
		ButtonHTML({txt:"✉",attributes:{onclick:'RequestGameFeedback();',id:'FeedbackButton'}}),
		ButtonLinkHTML("Credits"),
		ButtonHTML({txt:"♫",attributes:{onclick:'ToggleCurrentSong();GameFocus();',id:'MuteButton'}}),
		ButtonHTML({txt:"◱",attributes:{onclick:'FullscreenToggle("'+targetIDsel+'");GameFocus();',id:'FullscreenButton'}}),
	].join("");
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(targetIDsel){
	var targetIDsel=targetIDsel||gameSelector;
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
	document.activeElement.blur();
	window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	keyActions=keyActionsGame;
};

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;
var savePermission=true;

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
			"To stop localsaving and erase all 2 cookies, please deselect 🖫."
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
	var sls=localStorage[DocumentURL()+"_solvedlevels"];
	if(sls)
		SolvedLevelScreens.levels=JSON.parse(sls).map(Number);
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

function Levels(){
	return LevelScreens().map(LevelNumber);
}

function LevelScreen(n){
	return LevelScreens()[n-1];
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

function LevelSolved(n){
	return LevelScreenSolved(LevelScreen(n));
}

function LevelScreenSolved(curlevel){
	return In(SolvedLevelScreens(),curlevel);
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
	var firstusolve=UnSolvedLevelScreens().filter(function(x){return x>=curlevel;})[0];
	var lastsolvebefore=UnlockedLevelScreens().filter(function(x){return x<firstusolve;});
	return lastsolvebefore[lastsolvebefore.length-1]+1;
}

function LastScreen(){return state.levels.length-1;};

function FinalLevelScreen(){
	var li=UnlockedLevelScreens(); return li[li.length-1];
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


var LevelLookahead=0;	//Max number of unsolved levels shown, in linear progression: 0 = all  /
var bossLevels=[]; 		//Require beating all previous levels to show up; all previous levels + itself to show levels afterwards

function UnlockedLevels(){
	if(LevelLookahead<1){
		return Levels();
	}else{
		var showlevels=SolvedLevelScreens().map(LevelNumber);
		var lvl=LevelNumber(FirstUnsolvedScreen());
		var lookahead=1;
		while(lookahead<=LevelLookahead&&lvl<=Levels().length){
			if(In(bossLevels,lvl)&&lookahead>1) //Don't reveal boss level until all previous levels are solved
				break;
			else if(!LevelSolved(lvl)){
				showlevels=showlevels.concat(lvl);
				if(In(bossLevels,lvl))          //Don't reveal more levels while boss level unsolved
					break;
				else
					lookahead++;
			}
			lvl++;
		}
		//console.log(showlevels);
		return showlevels.sort(function(a,b){return a>b;});
	}
}

function UnlockedLevelScreens(){
	return UnlockedLevels().map(LevelScreen);
}

// Level Selector

function LevelSelectorTitle(){
	if(UnlockedLevels().length!==LevelScreens().length)
		return "Access "+UnlockedLevels().length+" out of "+LevelScreens().length+" levels";
	else
		return "Access one of the "+LevelScreens().length+" levels"
}

function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var type="level";
		var DPOpts={
			questionname:LevelSelectorTitle(),
			qfield:"level",
			qchoices:UnlockedLevels().map(StarLevelNumber),
			defaultChoice:function(i,c){return Number(c)===LevelNumber(curlevel)}
		}
	}
	else{
		var type="checkpoint";
		var checkpointIndices=Object.keys(GetCheckpoints());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qfield:"level",
			qchoices:checkpointIndices.map(function(l){return (Number(l)+1)+"";}),
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
				qtargetid:gameSelector,
				shortcutExtras:extraShortcutsF,
				requireConnection:false,
				buttonSelector:"LevelSelectorButton"
			});
	}
	
	function extraShortcutsF(DP){
		return {
			"L":function(){Close(DP.qid)},
			"left":function(){ FocusPrev(function(bu){SelectLevel(UnstarLevel(bu.innerHTML))})},
			"right":function(){FocusNext(function(bu){SelectLevel(UnstarLevel(bu.innerHTML))})},
			"1":function(){DelayLevel(1)},
			"2":function(){DelayLevel(2)},
			"3":function(){DelayLevel(3)},
			"4":function(){DelayLevel(4)},
			"5":function(){DelayLevel(5)},
			"6":function(){DelayLevel(6)},
			"7":function(){DelayLevel(7)},
			"8":function(){DelayLevel(8)},
			"9":function(){DelayLevel(9)},
			"0":function(){DelayLevel(0)}
		}
	};
	
	OpenerCloser(RequestLevelSelector,RequestLevelSelectorIndeed,GameFocus);
}

function MaxLevelDigits(){
	if(MaxLevelDigits.m)
		return MaxLevelDigits.m;
	return MaxLevelDigits.m=Math.ceil(Math.log10(1+LevelScreens().length));
};

function StarLevelNumber(n){
	var m=n+"";
	var padding="0".repeat(MaxLevelDigits()-m.length);
	return padding+m+(LevelSolved(n)?"★":"");
}
function StarLevel(l){
	var n=LevelNumber(l);
	return StarLevelNumber(n);
}
function UnstarLevel(l){
	return Number(l.replace("★",""));
}

function LoadLevelFromDP(DP){
	var lvl=UnstarLevel(FindData('level',DP.qid));
	SelectLevel(lvl);
};

function SelectLevel(lvl){
	if(In(UnlockedLevels(),lvl))
		SelectUnlockedLevel(lvl);
	else
		console.log("Level "+lvl+" locked!");
}

function SelectUnlockedLevel(lvl){
	if(!HasCheckpoint()){
		//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
		lvl=lvl<2?0:(LevelScreens()[lvl-2]+1);
		GoToScreen(lvl);
	}
	else{
		GoToScreenCheckpoint(lvl);
	}
};


function GoToScreenCheckpoint(n){
	if(HasCheckpoint()){
		LoadCheckpoint(n);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};

function GoToScreen(lvl){
	curlevel=lvl;
	AdvanceLevel();
	canvasResize();
};

// Keyboard to Pick Level - records multiple digits within a 2000 ms timeframe to select the level

function IsUnlockedLevel(n){
	return In(UnlockedLevels(),Number(n));
}

function DelayLevel(n){
	clearTimeout(DelayLevel.timer);
	var t=Date.now();
	if((!DelayLevel.lastTime)||(t-DelayLevel.lastTime>2000)||!IsUnlockedLevel(DelayLevel.level+""+n)){ //Restart
		DelayLevel.level=""+n;
		DelayLevel.lastTime=Date.now();
		var n=Number(DelayLevel.level);
	}
	else{
		DelayLevel.level=DelayLevel.level+""+n;
		DelayLevel.lastTime=Date.now();
		var n=Number(DelayLevel.level);
	}
	
	FocusElement("choice-"+StarLevelNumber(n));
	
	DelayLevel.timer=setTimeout(function(){
		SelectUnlockedLevel(n);
		DelayLevel.lastTime=undefined;
		DelayLevel.level="";
	},2000);
}	
	

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
	SolvedLevelScreens.levels=[];
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
	70:function(){FullscreenToggle(ParentSelector(gameSelector))},		//F
	69:function(ev){			//E
		RequestGameFeedback();
		prevent(ev);//Avoid inputting the shortcut letter in the form
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
    if (In(keybuffer,key)){
    	return;
    }
	
	//Instruct the game
    if(lastDownTarget === canvas /*|| (window.Mobile && (lastDownTarget === window.Mobile.focusIndicator) )*/ ){
    	if (!In(keybuffer,key)){
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



////////////////////////////////////////////////////////////////////////////////
//Colorise game bar

var stylesheet="#GameBar,"+gameSelector+"{\
    --white:rgba(255,255,255,var(--t));         /*#FFF*/\
    --smokewhite:rgba(241,241,241,var(--t))    /*#f1f1f1*/;\
    --darkblue:rgba(7,0,112,var(--t))          /*#070070*/;\
    --blue:rgba(0,15,255,var(--t))             /*#000FFF*/;\
    --lightblue:rgba(25,130,237,var(--t))      /*#1982ed*/;\
    --turquoise:rgba(59,248,222,var(--t))      /*#3bf8de*/;\
    --green: rgba(70,244,111,var(--t))          /*#46f46f*/;\
    --yellow: rgba(240,248,175,var(--t))        /*#f0f8af*/;\
    --lightyellow:rgba(255,249,201,var(--t))   /*#fff9c9*/;\
}";

function ReplaceColours(stylesheet,BackgroundColour,ForegroundColour){
	var styleSheet=stylesheet;

	var PrimaryDark=ForegroundColour;
	var PrimaryLight=BackgroundColour;
	// Pick the most saturated colour as text colour
	if(Saturation(BackgroundColour)===0){
		PrimaryLight=ForegroundColour;
	}
	if(Saturation(ForegroundColour)===0){
		var PrimaryDark=BackgroundColour;
	}
	

	//Background
	var Lmax=Lightness(BackgroundColour);
	
	//Invert in case of dark background
	if(Lightness(BackgroundColour)<0.5){
		styleSheet=styleSheet.replace("rgba(255,255,255,var(--t))",	HEX(DarkenTo(PrimaryLight,-Lmax*0.50+0.950)).colour);
		styleSheet=styleSheet.replace("rgba(241,241,241,var(--t))",	HEX(DarkenTo(PrimaryLight,-Lmax*0.50+0.925)).colour);
	
		styleSheet=styleSheet.replace("rgba(7,0,112,var(--t))",		HEX(DarkenTo(PrimaryDark,(-Lmax*0.22+0.22))).colour);
		styleSheet=styleSheet.replace("rgba(0,15,255,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.40+0.40))).colour);
		styleSheet=styleSheet.replace("rgba(25,130,237,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.51+0.51))).colour);
		styleSheet=styleSheet.replace("rgba(59,248,222,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.89+0.89))).colour);
		styleSheet=styleSheet.replace("rgba(70,244,111,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.91+0.91))).colour);
		styleSheet=styleSheet.replace("rgba(240,248,175,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.93+0.93))).colour);
		styleSheet=styleSheet.replace("rgba(255,249,201,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.95+0.95))).colour);
	}
	else{
		styleSheet=styleSheet.replace("rgba(255,255,255,var(--t))",	HEX(LightenTo(PrimaryLight,0.925)).colour);
		styleSheet=styleSheet.replace("rgba(241,241,241,var(--t))",	HEX(LightenTo(PrimaryLight,0.900)).colour);

		styleSheet=styleSheet.replace("rgba(7,0,112,var(--t))",		HEX(LightenTo(PrimaryDark,(Lmax*0.22))).colour);
		styleSheet=styleSheet.replace("rgba(0,15,255,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.40))).colour);
		styleSheet=styleSheet.replace("rgba(25,130,237,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.51))).colour);
		styleSheet=styleSheet.replace("rgba(59,248,222,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.92))).colour);
		styleSheet=styleSheet.replace("rgba(70,244,111,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.93))).colour);
		styleSheet=styleSheet.replace("rgba(240,248,175,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.94))).colour);
		styleSheet=styleSheet.replace("rgba(255,249,201,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.95))).colour);
	}
		
	return styleSheet;
}




