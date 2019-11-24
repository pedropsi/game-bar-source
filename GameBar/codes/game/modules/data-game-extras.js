DATAVERSION=5;

//Portable game bar
var Portable=False;
if(typeof RequestGameFeedback==="undefined"||typeof RequestHallOfFame==="undefined")
	Portable=True;


////////////////////////////////////////////////////////////////////////////////
// Game data link defaults, for puzzlescript, overwritable

//Game selector
var gameSelector=gameSelector?gameSelector:'#gameCanvas';

//Game Options
if(typeof ObtainBGColor==="undefined")
	function ObtainBGColor(){return state.bgcolor;}

if(typeof ObtainFGColor==="undefined")
	function ObtainFGColor(){return state.fgcolor;}

if(typeof ObtainRestartAllowed==="undefined")
	function ObtainRestartAllowed(){return !state.metadata.norestart;}

if(typeof ObtainUndoAllowed==="undefined")
	function ObtainUndoAllowed(){return !state.metadata.noundo;}

if(typeof ObtainUndo==="undefined")
	function ObtainUndo(){CheckRegisterKey({keyCode:85});}

if(typeof ObtainRestart==="undefined")
	function ObtainRestart(){CheckRegisterKey({keyCode:82});}

//Game display Options
if(typeof ObtainInitialScroll==="undefined")
	var ObtainInitialScroll=true;
//	var ObtainInitialScroll=false;

if(typeof ObtainInitialMessages==="undefined")
	var ObtainInitialMessages=true;
//	var ObtainInitialMessages=false;

if(typeof ObtainXYRotateCondition==="undefined")
	function ObtainXYRotateCondition(x,y){return x<y*1.05};
//	function ObtainXYRotateCondition(x,y){return false};

if(typeof ResizeCanvas==="undefined")
	function ResizeCanvas(){canvasResize();}

if(typeof titleScreen==="undefined")
	var titleScreen=true;



//Game and Level Navigation
if(typeof ObtainLevelLookahead==="undefined")
	function ObtainLevelLookahead(){return 0; //Max number of unsolved levels shown, in linear progression. Example: 0 = all, 1 =1, 2=2, etc...
	};

if(typeof ObtainGateLevels==="undefined")
	function ObtainGateLevels(){return []; //Gated "boss" levels require beating all previous levels to show up; all previous levels + itself to show levels afterwards. Example: [] = no gate levels, [2,5] = levels 2 and 5 are gate levels.
	};

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

if(typeof ObtainLevelTitle==="undefined")
	function ObtainLevelTitle(lvl){
		if(HasCheckpoint())
			return "Select checkpoint "+lvl;
		else
			return LevelGatedTitle(lvl);
	}
else if(ObtainLevelTitle==="Previous") //Case for title specified in message before the level
	function ObtainLevelTitle(lvl){
		var title= ObtainStateScreens()[LevelScreen(lvl)-1].message;
		title=title.replace(/^[\-\"\_\:\'\s\n]*(level\s*\d*)*[\-\"\_\:\'\s\n]*/im,"").replace(/[\-\"\_\:\'\s\n]*$/im,"");
		return title.replace(/[\-][\-\s]?/gi," ");
	}

//Read move defaults
if(typeof ObtainIsUndoMove==="undefined")
	function ObtainIsUndoMove(move){return move==="Z"}

if(typeof ObtainIsRestartMove==="undefined")
	function ObtainIsRestartMove(move){return move==="R"}

if(typeof ObtainReadMove==="undefined")
	function ObtainReadMove(move){
		switch (move) {
			case 27:return "Q";break;
			case 37:return "A";break;
			case 38:return "W";break;
			case 39:return "D";break;
			case 40:return "S";break;
			case 82:return "R";break;
			case 88:return "X";break;
			case 85:return "Z";break;
			default: return move;break;
		}
	};

//Keybinding defaults
if(typeof ObtainKeyActionsGameBar==="undefined")
	ObtainKeyActionsGameBar=KeyActionsGameBar;

if(typeof ObtainGameAction==="undefined")
	function ObtainGameAction(key){
		Context(gameSelector)[ComboKeystring(key)]();
		GameFocus();
	}

//On-screen keyboard
if(typeof ObtainKeyboardAllowed==="undefined")
	var ObtainKeyboardAllowed=false;

if(typeof ObtainKeyboardKeys==="undefined")
	var ObtainKeyboardKeys=GameKeyboardKeys;

if(typeof ObtainKeyboardLauncher==="undefined")
	function ObtainKeyboardLauncher(){
		return LaunchBalloon;
	}

if(typeof ObtainKeyboardTarget==="undefined")
	function ObtainKeyboardTarget(){
		return ".game-container";
	}



////////////////////////////////////////////////////////////////////////////////
//Hooks to Pedro PSI main site

var HasGameFeedback=True;
if(typeof RequestGameFeedback==="undefined"){
	var RequestGameFeedback=Identity;
	HasGameFeedback=False;
}

var HasHOF=True;
if(typeof RequestHallOfFame==="undefined"){
	var RequestHallOfFame=Identity;
	HasHOF=False;
}

if(typeof RegisterMove==="undefined")
	var RegisterMove=Identity;

//Record
if(typeof ClearLevelRecord==="undefined")
	var ClearLevelRecord=Identity;

if(typeof ClearSolvedLevelScreens==="undefined")
	var ClearSolvedLevelScreens=Identity;

if(typeof EchoLevelWin==="undefined")
	var EchoLevelWin=Identity;

if(typeof EchoSelect==="undefined")
	var EchoSelect=Identity;

if(typeof EchoHint==="undefined")
	var EchoHint=Identity;


////////////////////////////////////////////////////////////////////////////////
// Game Preparation

function WrapGame(){
	WrapElement('<div class="game-supra-container">\
					<div class="game-rotation-container">\
						<div class="game-container">\
						</div>\
					</div>\
				</div>',
				ParentSelector(gameSelector),
				".game-container");
				
	ConsoleLoad(".game-rotation-container");
}


function PrepareGame(){
	var bar=GetElement("GameBar");
	WrapGame();
	
	if(Portable()){
		var FOLDER=GlocalPath("https://pedropsi.github.io/game-bar-source","codes");
		LoadStyle(JoinPath(FOLDER,"game/game.css"));
		LoadStyle(JoinPath(FOLDER,"game/game-bar-pages.css"));
		LoadStyle(JoinPath(FOLDER,"index.css"));
		
		if(ObtainInitialMessages)
			ConsoleAddMany([
				"Puzzlescript Game bar loaded!",
				"Issues? Suggestions? Head to pedropsi.github.io/game-bar."
			//	"Localsave is ON for "+pageTitle()+".",
			//	"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);
	}
	else
		LoadStyle(pageRoot()+"codes/game/game.css");

	setTimeout(ResizeCanvas,250);
			
	if(!bar){
		
		if(typeof onKeyDown!=="undefined")
			StopCapturingKeys(onKeyDown);
		ResumeCapturingKeys(CaptureComboKey);
		
		AddElement("<style>"+ReplaceColours(stylesheet,ObtainBGColor(),ObtainFGColor())+"</style>",'head');//Colorise
		AddGameBar();
		
		ListenOnce('click',PlaylistStartPlay,gameSelector);
		ListenOnce('touchstart',RequestKeyboard,gameSelector);
		
		if(ObtainInitialScroll)
			ScrollInto(gameSelector);
		
		GameFocus();
		
		Shout("GameBar");
	}
}


////////////////////////////////////////////////////////////////////////////////
// Game Bar

function UndoButton(){
	if(ObtainUndoAllowed())
		return ButtonHTML({txt:'↶',attributes:{
			onclick:'UndoAndFocus();',
			onmousedown:'AutoRepeat(UndoAndFocus,250);',
			ontouchstart:'AutoRepeat(UndoAndFocus,250);',
			onmouseup:'AutoStop(UndoAndFocus);',
			ontouchend:'AutoStop(UndoAndFocus);',
			ontouchcancel:'AutoStop(UndoAndFocus);',
			id:'UndoButton'
			}});
	else
		return "";
}

function RestartButton(){
	if(ObtainRestartAllowed())
		return ButtonHTML({txt:'↺',attributes:{
			onclick:'ObtainRestart();GameFocus();',
			id:'RestartButton'
		}});
	else
		return "";
}

function FeedbackButton(){
	if(HasGameFeedback())
		return ButtonHTML({txt:"✉",attributes:{onclick:'RequestGameFeedback();',id:'FeedbackButton'}});
	else
		return "";
}

function MuteButton(){
	if(Playlist().length<1)
		return "";
	else{
		canYoutube=false;
		return ButtonHTML({txt:"♫",attributes:{onclick:'ToggleCurrentSong();GameFocus();',id:'MuteButton'}});
	}
}

function KeyboardButton(){
	if(ObtainKeyboardAllowed)
		return ButtonHTML({txt:"🖮",attributes:{onclick:'RequestKeyboard();',id:'KeyboardButton'}})
	else
		return "";
}


function GameBar(){
	
	var buttons=[
		ButtonHTML({txt:"🖫",attributes:{onclick:'ToggleSavePermission(this);GameFocus();',class:savePermission?'selected':'',id:'SaveButton'}}),
		ButtonLinkHTML("How to play?"),
		HiddenHTML('HintButton'),
		UndoButton(),
		RestartButton(),
		KeyboardButton(),
		ButtonHTML({txt:"Select level",attributes:{onclick:'RequestLevelSelector();',id:'LevelSelectorButton'}}),
		FeedbackButton(),
		ButtonLinkHTML("Credits"),
		MuteButton(),
		ButtonHTML({txt:"◱",attributes:{onclick:'RequestGameFullscreen();GameFocus();',id:'FullscreenButton'}}),
	].join("");
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(){
	RemoveElement("GameBar");
	if(Portable())
		AddElement(GameBar(),ParentSelector(gameSelector));
	else
		AddElement(GameBar(),".game-container");
}


/////////////////////////////////////////////////////////////////////////////////////
// Focus on Game Canvas
function GameFocus(DP){
	document.activeElement.blur();
	if(window.Mobile)
		window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	setTimeout(function(){FocusElement(gameSelector);},100);
};

function UndoAndFocus(){
	ObtainUndo();
	GameFocus();
}

////////////////////////////////////////////////////////////////////////////////
// Screen rotation

function GameRotation(){
	var x=window.innerWidth;
	var y=window.innerHeight;
	
	if(ObtainXYRotateCondition(x,y))
		SelectSimple('.game-rotation-container','rotate90');
	else
		Deselect('.game-rotation-container','rotate90');
	
	ResizeCanvas();
}

GameRotation();
Listen('resize',GameRotation);

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;
var savePermission=true;

function ToggleSavePermission(thi){
	Deselect(thi);
	if(savePermission){
		savePermission=false;
		EraseLocalsave();
		ConsoleAdd("All 2 cookies erased for "+pageTitle()+": Localsave is OFF across sessions.");
	}
	else 
		ActivateSavePermission(thi);
}

function ActivateSavePermission(thi){
	savePermission=true;
	Localsave();
	ConsoleAddMany([
		"Localsave is ON for "+pageTitle()+".",
		"To stop localsaving and erase all 2 cookies, please deselect 🖫."
		]);
	Select(thi);
}

/////////////////////////////////////////////////////////////////////////////////////
// Current Level

if(typeof curlevel==="undefined")
	var curlevel=0;

function CurrentScreen(s){
	if(typeof s==="undefined")
		return curlevel;
	else
		return curlevel=s;
}


/////////////////////////////////////////////////////////////////////////////////////
// Save Level & Checkpoint

if(typeof ObtainStorageURL==="undefined")
	function ObtainStorageURL(){
		if (typeof pageNoTag==="undefined")
			return document.URL;
		else
			return pageNoTag(document.URL);
	}

function LocalStorageName(name){
	if (name)
		return ObtainStorageURL()+"_"+name.toLowerCase();
	else
		return ObtainStorageURL();
}
function LocalStorage(name,set,TransformF){ //Getter-setter
	if(!set){
		var data=localStorage[LocalStorageName(name)];
		if(!data)
			return [];
		data=JSON.parse(data);
		
		if(data['data']){ //unwrap capsule
			var vers=data['vers'];
			data=data['data'];
			if(!vers||vers<DATAVERSION) //legacy conversion
				data=LegacyConversion(name,data,vers);
		}		
		
		if(TransformF&&data.length)
			data=data.map(TransformF);
		return data;
	}
	else{
		if(name==="")
			var capsule=set; //no capsule, for compatibility
		else 
			var capsule={  //wrap in capsule
				'data':set,
				'vers':DATAVERSION,
				'name':name
			};
	}
		return localStorage[LocalStorageName(name)]=JSON.stringify(capsule);
}

function LegacyConversion(name,data,vers){
	var Converter=LegacyConversion[name];
	if(!Converter)
		return data;
	else
		return Converter(data,vers);
}

function ArrayRemap(wrongarray,rightarray){
	var i=0;
	var j=0;
	var newarray=[];
	while(i<wrongarray.length){
		if(In(rightarray,wrongarray[i])){
			newarray.push(wrongarray[i]);
			j=rightarray.indexOf(wrongarray[i])+1;
		}
		else{
			newarray.push(rightarray[j])
			j++;
		}
		i++;
	}
	return newarray;
}

LegacyConversion["solvedlevels"]=function(solvedlevels,vers){

	if(!vers||vers<5)	 					//Previous data format;
		solvedlevels=solvedlevels.map(LevelNumber);
	
	if(solvedlevels.some(ScreenMessage))	//Case of added/removed interlevel messages;
		solvedlevels=ArrayRemap(solvedlevels,Levels());
	
	return solvedlevels;
};

LegacyConversion["checkpoint"]=function(sta,vers){
	if(!vers||vers<5)
		if(sta.dat)
			return [sta];
	return sta;
};

function CanSaveLocally(){
	return window.localStorage;
}
function HasCheckpoint(){
	return LocalStorage("checkpoint").length>0;
}
function HasLevel(){
	return CanSaveLocally()&&!(LocalStorage("").length===0);
}


// Localsave = save in local storage
function LocalsaveLevel(curscreen){
	if(savePermission){
		LocalStorage("solvedlevels",SolvedLevels());
		return LocalStorage("",curscreen);
	}
	else
		EraseLocalsaveLevel();
};

function LocalsaveCheckpoints(newstack){
	if(savePermission)
		return LocalStorage("checkpoint",newstack);
	else
		EraseLocalsaveCheckpoints();
}

function LocalsaveHints(){
	if(savePermission&&Hints())
		LocalStorage("hintsused",Hints.used);
}
	
function Localsave(){
	LocalsaveLevel(CurrentScreen());
	LocalsaveHints();
	//LocalsaveCheckpoints();
}	

function EraseLocalStorage(name){
	return localStorage.removeItem(LocalStorageName(name));
}

function EraseLocalsaveLevel(){
	EraseLocalStorage("solvedlevels");
	return EraseLocalStorage("");
};

function EraseLocalsaveCheckpoints(){
	return EraseLocalStorage("checkpoint");
};

function EraseLocalsaveHints(){
	return EraseLocalStorage("hintsused");
}

function EraseLocalsave(){
	return CanSaveLocally()&&(EraseLocalsaveLevel(),EraseLocalsaveCheckpoints(),EraseLocalsaveHints());
}


// Load from memory
function LoadLevel(){
	SolvedLevels.levels=LocalStorage("solvedlevels",undefined,Number);
	return CurrentScreen(LocalStorage(""));
}

function LocalloadCheckpoints(){
	return LocalStorage("checkpoint");
}

function LoadHints(){
	return Hints.used=LocalStorage("hintsused",undefined,Number);
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
		lvl:CurrentScreen()
	};
	return ret;
}


////////////////////////////////////////////////////////////////////////////////
// Winning Logic (non-linear level navigation "jumping")

function MarkWonLevel(){
	EchoLevelWin(CurrentScreen());
	AddToSolvedScreens(CurrentScreen());
	LocalsaveLevel(CurrentScreen());
	
	if(typeof RegisterLevelHonour!=="undefined")
		RegisterLevelHonour();
}

function NextLevel(){
	var curscreen=Math.min(CurrentScreen(),LastScreen()?LastScreen():CurrentScreen());
	CurrentScreen(curscreen);
	
	if (TitleScreen())
		StartLevelFromTitle();
	else {
		if(!SolvedAllLevels())
			AdvanceUnsolvedScreen();
		else if(curscreen<LastScreen())
			AdvanceEndScreen();
		else{
			RequestHallOfFame();
			ResetGame();
		}
	}
}

function TitleScreen(t){
	if(typeof t==="undefined")
		return titleScreen;
	else
		return titleScreen=t?true:false;
}

////////////////////////////////////////////////////////////////////////////////
// Level/Message Screen navigation

// Keep track of solved levels

function ScreenMessage(lvl){
	return typeof ObtainStateScreens()[lvl].message !=="undefined"
}

function ScreenType(level){
	return typeof level.message==="undefined";	
}

function LevelScreens(){
	if(LevelScreens.l!==undefined)
		return LevelScreens.l;
	else{
		var l=[];
		for(var i=0;i<ObtainStateScreens().length;i++){
			if(ScreenType(ObtainStateScreens()[i]))
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

function SolvedLevels(){
	if(SolvedLevels.levels===undefined)
		SolvedLevels.levels=[];
	return SolvedLevels.levels;
}

function AddToSolvedScreens(curscreen){
	function SortNumber(a,b){return a-b};
	if(!ScreenMessage(curscreen)&&!LevelScreenSolved(curscreen)){
		SolvedLevels.levels.push(LevelNumber(curscreen));
		SolvedLevels.levels=SolvedLevels.levels.sort(SortNumber);
	}
	return SolvedLevels();
}

function LevelSolved(n){
	return LevelScreenSolved(LevelScreen(n));
}

function LevelScreenSolved(curscreen){
	return In(SolvedLevels(),LevelNumber(curscreen));
}

function UnSolvedLevelScreens(){
	return LevelScreens().filter(function(l){return !LevelScreenSolved(l)});
}

function FirstUnsolvedScreen(){
	if(UnSolvedLevelScreens().length===0)
		return 1+LevelScreens()[MaxLevel()-1];
	else{
		var c=LevelScreens().indexOf(UnSolvedLevelScreens()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelScreens()[c-1];
	}
}

function NextUnsolvedScreen(curscreen){
	var firstusolve=UnSolvedLevelScreens().filter(function(x){return x>=curscreen;})[0];
	var lastsolvebefore=UnlockedLevelScreens().filter(function(x){return x<firstusolve;});
	return Last(lastsolvebefore)+1;
}

function LastScreen(){return ObtainStateScreens().length-1;};

function FinalLevelScreen(){
	var li=UnlockedLevelScreens(); 
	return Last(li);
};

function ClearSolvedLevelScreens(){
	return SolvedLevels.levels=[];
}

function SolvedAllLevels(){
	return LevelScreens().every(LevelScreenSolved);
}

function LevelNumber(curscreen){
	return LevelScreens().filter(function(l){return l<curscreen}).length+1;
}

function CurLevelNumber(){
	return LevelNumber(CurrentScreen());
}


function UnlockedLevels(){
	var LevelLookahead=ObtainLevelLookahead();
	var gateLevels=ObtainGateLevels(); 
	
	if(LevelLookahead<1){
		return Levels();
	}else{
		var showlevels=SolvedLevels();
		var lvl=LevelNumber(FirstUnsolvedScreen());
		var lookahead=1;
		while(lookahead<=LevelLookahead&&lvl<=Levels().length){
			if(In(gateLevels,lvl)&&lookahead>1) //Don't reveal gate level until all previous levels are solved
				break;
			else if(!LevelSolved(lvl)){
				showlevels=showlevels.concat(lvl);
				if(In(gateLevels,lvl))          //Don't reveal more levels while gate level unsolved
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

function MaxLevel(){
	return LevelScreens().length;
}


//Level Title
function LevelTitle(lvl){
	var leveltitles=LevelLoadedTitles();
	if(!leveltitles||!leveltitles[lvl-1])
		return UnnamedLevelTitle(lvl)
	else
		return leveltitles[lvl-1];
}

function UnnamedLevelTitle(lvl){
	return "Select level "+LevelNumberFromTotal(lvl);
}

function LevelGatedTitle(lvl){
	var LevelLookahead=ObtainLevelLookahead();
	if(In(ObtainGateLevels(),lvl)&&!SolvedAllLevelsBefore(lvl))
		return "Level locked: all previous levels required.";
	else if(LevelLookahead>0&&!SolvedRequiredLevelsBefore(lvl,LevelLookahead))
		return "Level locked: all but "+(LevelLookahead-1)+" earlier levels required.";
	else
		return LevelTitle(lvl);
}

function LevelsBefore(lvl,howmany){
	return Levels().filter(function(l){return lvl-howmany<=l&&l<lvl});
}

function SolvedAllLevelsBefore(lvl){
	return LevelsBefore(lvl,lvl).every(function(lvl){return In(SolvedLevels(),lvl)});
}

function SolvedRequiredLevelsBefore(lvl,howmany){
	return LevelsBefore(lvl,lvl).length-LevelsBefore(lvl,lvl).filter(function(lvl){return In(SolvedLevels(),lvl)}).length<howmany;
}


// Level Selector

function ChosenLevelDescription(){
	var DP=CurrentDatapack();
	if(DP){
		var l=FindData("level",CurrentDatapack().qid);
		if(l)
			return ChosenLevelDescription.last=ObtainLevelTitle(UnstarLevel(l));
	}
	
	if(ChosenLevelDescription.last)
		return ChosenLevelDescription.last;
	else
		return ObtainLevelTitle(CurLevelNumber());
}

function LevelSelectorMessage(){
	if(UnlockedLevels().length!==MaxLevel())
		return "Select from "+UnlockedLevels().length+" out of "+MaxLevel()+" levels";
	else
		return "Select one of the "+MaxLevel()+" levels";
}

function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var DPOpts={
			questionname:ChosenLevelDescription(),
			qchoices:UnlockedLevels().map(StarLevelNumber),
			defaultChoice:function(i,c){return UnstarLevel(c)===CurLevelNumber()}
		}
	}
	else{
		var checkpointIndices=Object.keys(GetCheckpoints());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qchoices:checkpointIndices.map(function(l){return (Number(l)+1)+"";}),
			defaultChoice:function(i,c){return Number(c)===checkpointIndices.length}
		}
	}
	
	var LevelSelectorShortcuts=FuseObjects(ObtainKeyActionsGameBar(),{
		"L":CloseLevelSelector,
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
	});
	
	RequestDataPack([
			['exclusivechoice',FuseObjects(DPOpts,{
				qsubmittable:false,
				qfield:"level",
				qclass:"level-selector",
				executeChoice:ChooseLevelClose
			})]
		],
		{
			action:LoadFromLevelSelectorButton,
			qonsubmit:CloseLevelSelector,
			qonclose:GameFocus,
			qdisplay:LaunchBalloon,
			qtargetid:".game-container",
			shortcutExtras:LevelSelectorShortcuts,
			requireConnection:false,
			buttonSelector:"LevelSelectorButton",
			spotlight:gameSelector
	});
}

function CloseLevelSelector(){
	if(CurrentDatapack().buttonSelector==="LevelSelectorButton")
		CloseCurrentDatapack();
	GameFocus();
}


function MaxLevelDigits(){
	if(MaxLevelDigits.m)
		return MaxLevelDigits.m;
	return MaxLevelDigits.m=Math.ceil(Math.log10(1+MaxLevel()));
};

function PadLevelNumber(n){
	var m=n+"";
	return "0".repeat(MaxLevelDigits()-m.length)+m;
}

function LevelHintStar(n){
	var star="★";
	if(Hints()&&UsedHints(n)!==0)
		star="☆";
	return LevelSolved(n)?star:"";
}

function StarLevelNumber(n){
	return PadLevelNumber(n)+LevelHintStar(n);
}

function StarLevel(l){
	var n=LevelNumber(l);
	return StarLevelNumber(n);
}
function UnstarLevel(l){
	return Number(l.replace("★","").replace("☆",""));
}

function UpdateAccessLevelMessage(){
	ReplaceChildren(ChosenLevelDescription(),".question");
}

Listen("Set level",UpdateAccessLevelMessage);

function LevelNumberFromTotal(lvl){
	return PadLevelNumber(lvl)+"/"+MaxLevel()+LevelHintStar(lvl)
}

function UpdateLevelSelectorButton(lvl){
	if(!lvl)
		lvl=CurLevelNumber(); 
	if(TitleScreen())
		var leveltext="Select level";
	else if(lvl<=MaxLevel())
		var leveltext="Level "+LevelNumberFromTotal(lvl)
	else
		var leveltext="★ All levels ★";
	ReplaceChildren(leveltext,"LevelSelectorButton");
}

function LoadFromLevelSelectorButton(qid){
	var levelChoice=FindData("level",qid);
	ChooseLevelClose(levelChoice,qid);
}

function ChooseLevelClose(choice,pid){
	ChooseLevel(choice);
	Close(pid);
	setTimeout(GameFocus,100);
};

function ChooseLevel(choice){
	SelectLevel(UnstarLevel(choice));
};

function SelectLevel(lvl){
	if(HasCheckpoint())
		GoToScreenCheckpoint(lvl);
	else if(In(UnlockedLevels(),lvl))
		SelectUnlockedLevel(lvl);
	else
		console.log("Level "+lvl+" locked!");
}

function SelectUnlockedLevel(lvl){
	//Don't return to same level
	if(lvl===CurLevelNumber()&&!TitleScreen())
		return console.log("stay in lvl ",lvl);
		
	//Go to exactly after the level prior to the chosen one, to read all useful messages, including level title
	var n=lvl<2?0:(LevelScreens()[lvl-2]+1);
	GoToScreen(n);
	
	EchoSelect(lvl,"level");
};


function GoToScreenCheckpoint(n){
	LoadCheckpoint(n);
	loadLevelFromStateTarget(state,CurrentScreen(),curlevelTarget);
	ResizeCanvas();
	
	EchoSelect(n,"checkpoint");
};

function GoToScreen(lvl){
	CurrentScreen(lvl);
	AdvanceLevel();
	ResizeCanvas();
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
	
}	
	

// Level Progression

function StartLevelFromTitle(){
	if(ObtainNewGameCondition()){//new game
		ResetLevel();
		ResetCheckpoints();
	}
	
	LoadLastCheckpoint();
	LoadLevelOrCheckpoint();
}

function ResetLevel(){
	CurrentScreen(0);
	curlevelTarget=null;
	ClearSolvedLevelScreens();
	ClearLevelRecord();
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
	ObtainTitleScreenLoader();
	ObtainPlayEndGameSound();
	ClearLevelRecord();
	UpdateLevelSelectorButton()
}

function AdvanceLevel(){
	ObtainLevelTransition();
	LocalsaveLevel(CurrentScreen());
	LoadLevelOrCheckpoint();
	ClearLevelRecord();
	UpdateLevelSelectorButton();
}

function AdvanceUnsolvedScreen(){
	var curscreen=CurrentScreen();
	if(ScreenMessage(curscreen)&&curscreen<FinalLevelScreen()){
		//console.log("from message");
		CurrentScreen(curscreen+1);
	}
	else if(curscreen>=FinalLevelScreen()||!NextUnsolvedScreen(curscreen)){
		//console.log("from last level");
		CurrentScreen(FirstUnsolvedScreen());
	}
	else{
		//console.log("from anywhere in the middle");
		CurrentScreen(NextUnsolvedScreen(curscreen));
	}		
	AdvanceLevel();	
}

function AdvanceEndScreen(){
	if(CurrentScreen()>=FinalLevelScreen())
		CurrentScreen(CurrentScreen()+1);
	else
		CurrentScreen(FinalLevelScreen()+1);
	
	AdvanceLevel();		
}

function LoadLevelOrCheckpoint(){
	if ((typeof curlevelTarget!=="undefined")&&(curlevelTarget!==null)){
		loadLevelFromStateTarget(state,CurrentScreen(),curlevelTarget);
		curlevelTarget=null;
	}
	else
		ObtainLevelLoader();
}



////////////////////////////////////////////////////////////////////////////////
//Key capturing

function KeyActionsGameBar(){
	return {
	// Game bar menus
	"E"			:RequestGameFeedback,
	"F"			:RequestGameFullscreen,
	"H"			:RequestHint,
	"K"			:ObtainKeyboardAllowed?RequestKeyboard:Identity, 
	"L"			:RequestLevelSelector, 
	"M"			:ToggleCurrentSong
	};
}

//Game keybinding profile
if(typeof ObtainKeyActionsGame==="undefined"){
	
	function ObtainKeyActionsGame(){
		return {
			//Arrows
			"left"		:InstructGameKeyF(37),
			"up"		:InstructGameKeyF(38),
			"right"		:InstructGameKeyF(39),
			"down"		:InstructGameKeyF(40),
			"W"			:InstructGameKeyF(37),
			"A"			:InstructGameKeyF(38),
			"S"			:InstructGameKeyF(39),
			"D"			:InstructGameKeyF(40),
			//Action / Select
			"enter"		:InstructGameKeyF(88),
			"C"			:InstructGameKeyF(88),
			"X"			:InstructGameKeyF(88),
			"spacebar"	:InstructGameKeyF(88),
			// Undo     
			"Z"			:InstructGameKeyF(85),
			"U"			:InstructGameKeyF(85),
			/*"backspace"	:InstructGameKeyF(85),*/
			// Restart
			"R"			:InstructGameKeyF(82),
			// Quit
			"escape"	:InstructGameKeyF(27),
			"Q"			:InstructGameKeyF(27)
		};
	}
	
	function InstructGameKeyF(newkey){
		return function(ev){ev.keyCode=newkey;InstructGame(ev)}
	}
	
	function InstructGame(event){
		event.preventDefault();
		var key=event.keyCode;
	
		//Avoid repetition?
		if (In(keybuffer,key))
			return;
		
		//Instruct the game
		if (!In(keybuffer,key)){
			keybuffer.splice(keyRepeatIndex,0,key);
			keyRepeatTimer=0;
			CheckRegisterKey(event);
			}
	}
	
		//Execute key instructions
	function CheckRegisterKey(event){
		checkKey(event,true);
		RegisterMove(event.keyCode);
	}
		
}


//Keybind to game element
var FullShortcuts=FuseObjects(ObtainKeyActionsGameBar(),ObtainKeyActionsGame());
OverwriteShortcuts(gameSelector,FullShortcuts);


function RequestGameFullscreen(){
	FullscreenToggle(".game-supra-container");
	setTimeout(GameRotation,500);
}




////////////////////////////////////////////////////////////////////////////////
//Colorise game bar

var stylesheet=".game-supra-container{\
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

////////////////////////////////////////////////////////////////////////////////
//Load Level Titles

function LevelLoadedTitles(){
	return LevelLoadedTitles.titles||false;
}

function ParseLevelTitleParagraph(hintparagraph){
	var titleline=hintparagraph.replace(/\n.*/mgi,""); //remove all but the first line
		titleline=titleline.replace(/(?:\-\-?.*)/i,""); //remove comments : ----etc....

	var title=titleline.replace(/(?:^level\s*)/i,""); //isolate level title and subsequent info
	if(titleline===title)
		return "";
	
	title=title.replace(/(?:\brequire\:.*)/i,""); //remove required conditions info
	title=ParseNoTrailingWhitespace(title); //remove whitespace
	title=ParseDenumberLine(title); //remove numeric indicator after "level"
	title=ParseNoTrailingWhitespace(title); //remove whitespace
	
	return title;
}

function ParseLevelTitlesFromHintsFile(hintdata){
	var titlesperlevel=HintParagraphArray(hintdata);
	return titlesperlevel.map(ParseLevelTitleParagraph);
}

////////////////////////////////////////////////////////////////////////////////
//Hints

ListenOnce("GameBar",LoadHintsFile);

function Hints(lvl){
	if(!Hints.cached){
		return false;
	}
	
	if(lvl===undefined)
		return Hints.cached;
	else
		return Hints.cached[lvl-1];
}

function LoadHintsFile(){
	if(!Hints.cached){
		
		if(isFileLink(pageURL()))
			Hints.path="https://pedropsi.github.io/hints/";
		else
			Hints.path="hints/";
		
		LoadData(Hints.path+pageIdentifierSimple()+".txt",LoadHintData);
	}
}

function LoadHintData(hintdata){
	if(hintdata===""){
		console.log("no hints found.");
	}
	else{
		Hints.cached=ParseHintsFile(hintdata);
		LevelLoadedTitles.titles=ParseLevelTitlesFromHintsFile(hintdata);
		if(Hints.cached.every(function(h){return h.length<1}))//If no hints inside the file, don't show thr button
			return Hints.cached=false;
		if(Hints.cached){
			if(LoadHints().length===0)
				Hints.used=Hints.cached.map(function(x){return 0}); //will add 1s progressively as used
			ShowHintButton();
		}
	}
}

function ShowHintButton(){
	ReplaceElement(HintButton(),"HintButton")
	Show("HintButton");
	Deselect("HintButton");
}

function HintDisplay(reference){
	var fullpath=Hints.path+pageIdentifierSimple()+"/"+reference.replace(/\s*/,"");
	if(IsImageReference(fullpath)){
		var parentid=GenerateId();
		LoadImage(fullpath,parentid);
		return "<div class='hint' id='"+parentid+"'>"+PlaceholderImageHTML()+"</div>";
	}
	return "<div class='hint'><p>"+reference+"</p></div>";
}

function HintParagraphArray(hintstxt){
	var hintsperlevel=hintstxt.split(/(?:\n\s*)(?:\n\s*)+/); //Two or more newlines separate level items. Lines starting by level... are ignored
	return hintsperlevel.filter(function(h){return h!=="";}); //ignore empty blocks
}

function ParseDenumberLine(hintline){ //Remove numeric indicators, optionally split by full stops
	return hintline.replace(/^(\d+)(\.\d+)*\s*/,"");
}

function ParseNoTrailingWhitespace(hintline){ //Remove numeric indicators, optionally split by full stops
	return hintline.replace(/^\s*/,"").replace(/\s*$/,"");
}


function ParseHintsFile(hintstxt){//ignore most whitespace at junctions

	hintsperlevel=HintParagraphArray(hintstxt);
	
	function ParseHintParagraph(hintparagraph){ //One hint per line
		var hintslines=hintparagraph.replace(/(?:^level.*)/i,"");
		hintslines=hintslines.split(/\n\s*/);
		
		hintslines=hintslines.map(ParseDenumberLine);
		hintslines=hintslines.filter(function(l){return l!==""});
		
		return hintslines;
	}
	
	hintsperlevel=hintsperlevel.map(ParseHintParagraph);
	
	for(var i=hintsperlevel.length;i<Levels().length;i++)
		hintsperlevel[i]=[];
	
	return hintsperlevel;
}



function CurrentLevelHints(){
	return Hints(CurLevelNumber());
}

function SeeHint(lvl,hintN){
	if(UsedHints(lvl)<hintN&&Hints(lvl).length>=hintN&&!LevelSolved(lvl)){
		Hints.used[lvl-1]=hintN;
		LocalsaveHints();
		EchoHint(lvl,hintN);
	}
}

function AvailableHints(lvl){
	if(lvl===undefined) //Global
		return Levels().map(AvailableHints).reduce(Accumulate);
	else				//In particular level
		return	Hints(lvl).length;
}

function UsedHints(lvl){
	if(lvl===undefined) //Global
		return Levels().map(UsedHints).reduce(Accumulate);
	else				//In particular level
		return	Hints.used[lvl-1];
}

function HintProgress(lvl,hintN){
	var a=AvailableHints(lvl);
	return "★".repeat(hintN)+"☆".repeat(Math.max(a-hintN,0));
}

function HintButton(){
	return ButtonHTML({txt:"⚿",attributes:{onclick:'RequestHint();',id:'HintButton'}});	
}

function CloseHint(){
	if(CurrentDatapack().buttonSelector==="HintButton")
		CloseCurrentDatapack();
	GameFocus();
}

function RequestNextHint(){
	CycleNextBounded(CurrentLevelHints());
	CloseHint();
	setTimeout(RequestHint,500);
}

function RequestPrevHint(){
	CyclePrevBounded(CurrentLevelHints());
	CloseHint();
	setTimeout(RequestHint,500);	
}


RequestHint["tips-welcome"]=[
			"<p>Welcome to the <b>Hint Service</b>.</p><p>Press <b>⚿</b> or <kbd>H</kbd> anytime to reveal a hint!</p>",
			"You got this! Now go ahead and play!"
]

if(HasHOF()){
	RequestHint["tips-welcome"].splice(1,0,"Please note that <b>Hall of Fame</b> entries now count how many hints are used!");
}

RequestHint["tips-interlevel"]=[
			"Just relax and have fun!",
			"Remember to pause once in a while!",
			"If you like this game, share it with your friends!",
			"Open the level selector with <kbd>L</kbd>, then type a <kbd>number</kbd>.",
			"Go Fullscreen by pressing ◱ or <kbd>F</kbd>!",
			"Play or pause the music by pressing ♫ or <kbd>M</kbd>!"
]

if(HasGameFeedback()){
	RequestHint["tips-interlevel"].splice(1,0,"Email Pedro PSI feedback by pressing ✉ or <kbd>E</kbd>, anytime!");
}


function RequestHint(){
	if(!Hints())
		return console.log("hints file not found");
	
	if(!RequestHint.requested||TitleScreen()){
		RequestHint.requested=Hints().map(function(hl){return hl.map(function(x){return false;})});
		var tip=CycleNextBounded(RequestHint["tips-welcome"]);
		var DFOpts={questionname:tip};
		var DPFields=[['plain',DFOpts]];
	}
	else if(ScreenMessage(CurrentScreen())){
		var tip=CycleNext(RequestHint["tips-interlevel"]);
		var DFOpts={questionname:"<b>General tip:</b> "+HintDisplay(tip)};
		var DPFields=[['plain',DFOpts]];
	}
	else{
		var curlevelHints=CurrentLevelHints();
		
		if(curlevelHints.length===0) //Substitute for no hints
			curlevelHints=["Sorry! No hints for this level... but you can do it!"];
		
		var tip=CycleStay(curlevelHints);
		tip=HintDisplay(tip);
		
		var p=CyclePosition(curlevelHints);
		SeeHint(CurLevelNumber(),p+1);
		
		var navichoices=["◀","OK","▶"];
		var naviactions={
			"◀":RequestPrevHint,
			"▶":RequestNextHint,
			"OK":CloseHint
		};

		if(p===0){
			navichoices.shift();
			delete naviactions["◀"];
		}
		if(p===curlevelHints.length-1){
			navichoices.pop();
			delete naviactions["▶"];
		}
		
		var DFOpts={questionname:tip};
		var DFHintCounter={questionname:"<b>"+HintProgress(CurLevelNumber(),p+1)+"</b>"};
		var DPFields=[
			['plain',DFHintCounter],
			['plain',DFOpts],
			['navi',{
				qchoices:navichoices,
				executeChoice:function(choice,pid){
					if(In(naviactions,choice))
						naviactions[choice]();
				}
			}]
		];
		
	}
	
	RequestDataPack(DPFields,{
		actionvalid:CloseHint,
		qonsubmit:CloseHint,
		qonclose:GameFocus,
		qdisplay:LaunchAvatarBalloon,
		qtargetid:".game-container",
		requireConnection:false,
		shortcutExtras:FuseObjects(ObtainKeyActionsGameBar(),{"H":CloseHint}),
		buttonSelector:"HintButton",
		spotlight:gameSelector
	});
}


//Hints Honours
	
function HintsHonour(){
	if(!Hints())
		return "";
	else if(UsedHints()===0)
		return "no hints ★";
	else{
		var h=UsedHints();
		if(h===1)
			return "1 hint ☆";
		else if(h<=AvailableHints()/7)
			return h+" hints ☆";
		else
			return h+" hints  ";
	}
}

//Onscreen keyboard

function RequestKeyboard(){
	
	if(!ObtainKeyboardAllowed)
		return;
	
	var DPOpts={
		executeChoice:ObtainGameAction,
		qchoices:ObtainKeyboardKeys()
	}
	
	var Shortcuts=ObtainKeyActionsGameBar();
	
	RequestDataPack([
			['keyboard',DPOpts]
		],
		{
			action:console.log,
			qonsubmit:Identity,
			qonclose:GameFocusAndRestartUndoButtons,
			qdisplay:ObtainKeyboardLauncher(),
			qtargetid:ObtainKeyboardTarget(),
			shortcutExtras:Shortcuts,
			requireConnection:false,
			buttonSelector:"KeyboardButton",
			spotlight:gameSelector,
			closeonblur:false,
			layer:-1
	});
	
	function HideButtons(){
		ReplaceElement(HiddenHTML("RestartButton"),"RestartButton");
		ReplaceElement(HiddenHTML("UndoButton"),"UndoButton");
	}
	
	HideButtons();
}

function GameFocusAndRestartUndoButtons(){
	GameFocus();
	
	function RestoreButtons(){
		ReplaceElement(RestartButton(),"RestartButton");
		ReplaceElement(UndoButton(),"UndoButton");
	}
	
	setTimeout(RestoreButtons,100); //Needed
}

function GameKeyboardKeys(){
	return [["↶","↺"]]; // Undo and Restart
}

