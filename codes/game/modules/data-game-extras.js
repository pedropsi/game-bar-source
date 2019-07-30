/////////////////////////////////////////////////////////////////////////////////////
// Save and Checkpoints, with permission

var curcheckpoint=0;
var savePermission=true;
ConsoleAddMany([
			"Autosave is ON for "+pageTitle()+".",
			"To stop saving and erase all 2 cookies, please deselect 🖫."
			]);
GetElement("AutosaveButton")


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

function DocumentURL(){
	if (typeof pageNoTag==="undefined")
		return document.URL;
	else
		return pageNoTag(document.URL);
}

function HasCheckpoint(){
	return void 0!==localStorage[DocumentURL()+"_checkpoint"];
}
function HasLevel(){
	return HasSave()&&void 0!==localStorage[DocumentURL()];
}
function HasSave(){
	return window.localStorage;
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
function SaveLevel(curlevel){
	if(savePermission){
		localStorage[DocumentURL()+"_solvedlevels"]=JSON.stringify(SolvedLevelIndices());
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
	return HasSave()&&(UnsaveLevel(),UnsaveCheckpoint())
}


function LoadLevel(){
	SolvedLevelIndices.levels=JSON.parse(localStorage[DocumentURL()+"_solvedlevels"]).map(Number);
	return curlevel=localStorage[DocumentURL()];
}
function LoadCheckpoint(n){
	var stack=GetCheckpointStack();
	if(typeof stack.dat=="undefined"){
			if(typeof n==="undefined")
				curcheckpoint=stack.length-1; //default to last checkpoint
			else{
				curcheckpoint=Math.min(Math.max(n,0),stack.length-1);
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
		s.pop()
	}
	return s;
};

function LoadSave(){
	if(HasLevel()){
		if(HasCheckpoint())
			LoadCheckpoint();
		return LoadLevel();}
}



////////////////////////////////////////////////////////////////////////////////
// Level navigation

function GoToLevel(lvl){
	SaveLevel(lvl);
	winning=false;
	timer=0;
	textMode=titleScreen=false;
	titleSelection=0<curlevel||null!==curlevelTarget?1:0;
	messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=false;
	titleMode=0;
	loadLevelFromState(state,lvl);
	canvasResize();
};

function isLevelMessage(lvl){
	return typeof state.levels[lvl].message !=="undefined"
}

function LevelType(level){
	return typeof level.message==="undefined";	
}




function LevelIndices(){
	if(LevelIndices.l!==undefined)
		return LevelIndices.l;
	else{
		var l=[];
		var i;
		for( i=0;i<state.levels.length;i++){
			if(LevelType(state.levels[i]))
				l.push(i);
		}
		return LevelIndices.l=l;
	}
}

function InLevelIndices(curlevel){
	return LevelIndices().indexOf(curlevel)!==-1;
}

function LastLevel(){
	return LevelIndices()[LevelIndices().length-1];
}

function isLastLevel(curlevel){return LastLevel()===curlevel};

function SolvedLevelIndices(){
	if(SolvedLevelIndices.levels===undefined){
		SolvedLevelIndices.levels=[];
	}
	return SolvedLevelIndices.levels;
}

function SortNumber(a,b){return a-b};

function AddToSolvedLevelIndices(curlevel){
	if(!InSolvedLevelIndices(curlevel)){
		SolvedLevelIndices.levels.push(Number(curlevel));
		SolvedLevelIndices.levels=SolvedLevelIndices.levels.sort(SortNumber);
	}
	return SolvedLevelIndices();
}

function InSolvedLevelIndices(curlevel){
	return SolvedLevelIndices().indexOf(curlevel)!==-1;
}

function UnSolvedLevelIndices(){
	return LevelIndices().filter(function(l){return SolvedLevelIndices().indexOf(l)===-1});
}

function FirstUnsolvedScreen(curlevel){
	if(UnSolvedLevelIndices().length===0)
		return 1+LevelIndices()[LevelIndices().length-1];
	else{
		var c=LevelIndices().indexOf(UnSolvedLevelIndices()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelIndices()[c-1];
	}
}

function NextUnsolvedScreen(curlevel){
	var firstusolve=UnSolvedLevelIndices().filter(x=>x>=curlevel)[0];
	var lastsolvebefore=LevelIndices().filter(x=>x<firstusolve);
	return lastsolvebefore[lastsolvebefore.length-1]+1;
}

function LastScreen(){return state.levels.length-1;};

function LastSolvedLevel(){var li=SolvedLevelIndices(); return li[li.length-1];};


function ClearSolvedLevelIndices(){
	console.log("levels solved cleared.");
	return SolvedLevelIndices.levels=[];
}

function SolvedAllLevels(){
	return LevelIndices().every(l=>SolvedLevelIndices().indexOf(l)>=0);
}

function LevelNumber(curlevel){
	return LevelIndices().filter(function(l){return l<curlevel}).length+1;
}

function MaxLevel(){
	MaxLevel.max=MaxLevel.max?Math.max(curlevel,MaxLevel.max):Number(curlevel);
	return MaxLevel.max;
}

function MaxCheckpoint(m){ 
	if(m===undefined){  //Getter
		var c=Number(curcheckpoint);
		MaxCheckpoint.max=MaxCheckpoint.max?Math.max(c,MaxCheckpoint.max):c;
	}
	else				//Setter (m)
		MaxCheckpoint.max=Number(m);
	return MaxCheckpoint.max;
}


function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var type="level";
		var DPOpts={
			questionname:"Access one of the "+LevelIndices().length+" levels",
			qfield:"level",
			qchoices:LevelIndices().map(l=>(LevelNumber(l)+(InSolvedLevelIndices(l)?"★":"")))
		}
	}
	else{
		var type="checkpoint";
		var checkpointIndices=Object.keys(GetCheckpointStack());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qfield:"level",
			qchoices:checkpointIndices.map(l=>(Number(l)+1)+"")
		}
	}
	RequestDataPack([
		['exclusivechoice',DPOpts]
	],
	{
		actionvalid:LoadLevelFromDP,
		actionText:"Go to "+type,
		qonsubmit:Identity,
		qdisplay:LaunchBalloon,
		qtargetid:'puzzlescript-game'
	});
}

function LoadLevelFromDP(DP){
	var lvl=FindData('level',DP.qid).replace("★","");
	lvl=Number(lvl);
	if(!HasCheckpoint()){
		//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
		var lvlpre=lvl<2?-1:LevelIndices()[lvl-2];
		GoToLevel(lvlpre+1);
	}
	else{
		GoToLevelCheckpoint(lvl-1);
	}
};


function GoToLevelCheckpoint(ncheckpoint){
	if(HasCheckpoint()){
		LoadCheckpoint(ncheckpoint);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};


////////////////////////////////////////////////////////////////////////////////
/// Game Bar

function GameBar(){
	var undo=!state.metadata.noundo?ButtonOnClickHTML('↶','checkKey({keyCode:85},!0)'):"";
	var restart=!state.metadata.norestart?ButtonOnClickHTML('↺','checkKey({keyCode:82},!0)'):"";
	
	var buttons=[
		ButtonLinkHTML("How to play?"),
		undo,
		restart,
		ButtonHTML({txt:"🖫",attributes:{onclick:'ToggleSavePermission(this)',class:savePermission?'selected':''}}),
		ButtonOnClickHTML("Select level",'RequestLevelSelector()'),
		ButtonOnClickHTML("< ^ > v",'RequestPlaylist();LoadPlaylistControls()'),
		ButtonOnClickHTML("✉",'RequestGameFeedback()'),
		ButtonLinkHTML("Credits"),
		ButtonHTML({txt:"♫",attributes:{onclick:'ToggleCurrentSong()',id:'MuteButton'}}),
		ButtonHTML({txt:"◱",attributes:{onclick:'ToggleFullscreen(".game-container")',id:'FullscreenButton'}}),
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

////////////////////////////////////////////////////////////////////////////////
/// Save permission

////////////////////////////////////////////////////////////////////////////////
/// Echo

function EchoLevelWin(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		echoPureData(leveldata,leveldataURL);
	}
}

function EchoCheckpoint(){
	if(AnalyticsClearance()){
		UpdateLevelCheckpointData(curlevel,checkpointsaver);
		echoPureData(leveldata,leveldataURL);
	}
	checkpointsaver++;
}

function EchoLevelClose(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		leveldata["winsequence"]="";
		leveldata["type"]="close";
		echoPureData(leveldata,leveldataURL);
	}
}

window.onunload=(function(){
	EchoLevelClose(curlevel);
})



////////////////////////////////////////////////////////////////////////////////
/// Level Data, recording moves

var leveldata={
	formDataNameOrder: "[\"name\",\"level\",\"identifier\",\"timing\",\"winsequence\",\"moves\",\"type\"]",
	formGoogleSendEmail: "",
	formGoogleSheetName: "leveltimes",
	identifier:document.body.id,
	level:"0",
	moves:"-",
	winsequence:"-",
	name: UserId(),
	timing: "0",
	type:"-"
};

var leveldataURL="https://script.google.com/macros/s/AKfycbwuyyGb7XP7H91GH_8tZrXh6y_fjbZg4vSxl6S8xvAAEdyoIHcS/exec";
var timeticker=Date.now();
var moveseq=[];
var winseq=[];

var checkpointsaver=0;

ResumeRecordingMovesPlaylist();
var recordingmoves;

function RegisterMove(mov){
	if(recordingmoves){
		var move=mov;
		switch(move){
			case 1:move=37;break;//<
			case 0:move=38;break;//^
			case 3:move=39;break;//>
			case 2:move=40;break;//v
			case 4:move=88;break;//X
		}
		var delta = ElapsedTime();
		moveseq.push([move,delta]);
		
		RegisterMovesPlaylist([move,delta],movesplaylist);
		
		switch(move){
			case 82:winseq=[];break;//R
			case 85:winseq.pop();break;//Z
			case 27:winseq=["Q"];break;//Q
			default: winseq.push([move,delta]);break
		}
	}
	else
		ResumeRecordingMovesPlaylist();
}
	
function UnRegisterMove(){
	if(recordingmoves){
		winseq.pop();
		moveseq.pop();
		/*RemoveLastMovesPlaylist();*/
	};
}
	
function ClearMoves(){
	moveseq=[];winseq=[];
	ClearMovesPlaylist(movesplaylist);
}

function ClearLevelRecord(){
	ClearMoves();
	timeticker=Date.now();
}

function ElapsedTime(){
	var timenow=Date.now();
	var elapsedtime = (timenow-timeticker);
	timeticker = timenow;
	return elapsedtime;
}

function UpdateLevelData(curlevel){
	var ws=winseq;
	var ms=moveseq;
	
	leveldata["timing"]=Math.floor(ms.reduce((x,y)=>(x+y[1]),0)/1000);
	leveldata["level"]=LevelNumber(curlevel);

	leveldata["moves"]=JSON.stringify(ms);
	leveldata["winsequence"]=JSON.stringify(ws);
	
	if(!AnalyticsInnerClearance(pageTitle())){
		leveldata["moves"]="---";
		leveldata["winsequence"]="---";
	}
	
	leveldata["type"]="win";
}

function UpdateLevelCheckpointData(curlevel,checkpointsaver){
	UpdateLevelData(curlevel);
	leveldata["type"]="checkpoint";
	leveldata["level"]=String(curlevel)+"»"+String(checkpointsaver);
	ClearMoves();
}




function ResumeRecordingMovesPlaylist(){
	if(recordingmoves!==true){
		ConsoleAddMPL("⏺ (recording started)");
		ResumeRecordingMovesPlaylist.continued=true;
	}
	else
		if(ResumeRecordingMovesPlaylist.continued!==true){
			ConsoleAddMPL("⏺ (recording going on)");
			ResumeRecordingMovesPlaylist.continued=true;
		}
	recordingmoves=true;
}
 
function PauseRecordingMovesPlaylist(){
	if (recordingmoves===undefined)
		ConsoleAddMPL("⏹ (recording hasn't started)");
	else if (recordingmoves===false)
		ConsoleAddMPL("⏹ (recording still paused)");
	else
		ConsoleAddMPL("⏹ (recording paused)");
	recordingmoves=false;
	ResumeRecordingMovesPlaylist.continued=false;
}

function RegisterMovesPlaylist(movedelta){
	ClearUnplayedMovesPlaylist(movesplaylist);
	PushMovesPlaylist(NewMPI(movedelta,{state:"played"}),movesplaylist);
}


////////////////////////////////////////////////////////////////////////////////
///Replaying Moves

function ParseMoves(movestring){
	var pattern1=/^\[(\[(27|37|38|39|40|82|85|88)\,[0-9]+\])(\,\[(27|37|38|39|40|82|85|88)\,[0-9]+\])*\]$/ig;
	var pattern2=/^((left|up|right|down|undo|restart|quit|[RZXQ<\^V>])\s*)+$/ig;
	if (movestring.match(pattern1)!==null)
		return JSON.parse(movestring);
	else
		return ParseTextualMoves(movestring);
}

function ParseTextualMoves(string){
	var movements=string.match(/(left|up|right|down|undo|restart|quit|[LURDRZXQ<\^V>])/ig);
	movements=movements.map(m=>m.replace(/quit|Q/ig,"27").replace(/undo|Z/ig,"85").replace(/left|</ig,"37").replace(/up|\^/ig,"38").replace(/right|>/ig,"39").replace(/down|v/ig,"40").replace(/restart|R/ig,"82"));
	movements=movements.map(n=>[Number(n),200]);
	return movements;
}

function UnParseMove(n){
	switch(n){
		case 27:return "quit";break;
		case 37:return ">";break;
		case 38:return "^";break;
		case 39:return "<";break;
		case 40:return "v";break;
		case 82:return "restart";break;
		case 85:return "undo";break;
		default:"???";
	}
}

function ConsoleAddMPL(messageHTML){
	if(ConsoleAddMPL.Playlist===undefined){
		if(document.getElementById("PlaylistBar")!==null)
			ConsoleAddMPL.Playlist=true
	}else
		ConsoleAdd(messageHTML);
}

var movesplaylist=[];
var maxdelay=500; //delay between moves
var mindelay=500; //delay between moves
var recordingmovesid;

/*
function ReplayParseMoves(movetext){
	return Replay(ParseMoves(movetext));
}

function Replay(movetimes){
	ClearMovesPlaylist(movesplaylist);
	movesplaylist=NewMovesPlaylist(movetimes);
	movesplaylist=ResumeMovesPlaylist(movesplaylist);
	return movesplaylist;
}
*/

//MovesPlaylist: Add and Remove Moves

function NewMPI(movetime,optionsObj){
	var newmpi={
		move:movetime[0],
		timedelta:movetime[1],
		time:0,
		id:0,//defined in optionsObj
		schid:0,
		state:"paused"
	};	
	return SetMPI(newmpi,optionsObj);
}

function SetMPI(mpi,optionsObj){
	return mpi=FuseObjects(mpi,optionsObj);
}


function NewMovesPlaylist(movetimes){
	var movesplaylist=movetimes.map(function(mt,i){return NewMPI(mt,{id:i})});
		movesplaylist=SetTimesMovesPlaylist(movesplaylist);
	return movesplaylist;
};

function ClearMovesPlaylist(movesplaylist){
	movesplaylist.map(function(mpi){clearTimeout(mpi.schid)});
	movesplaylist=[];
}

function SetTimesMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	var time=0;
	for (var i=0;i<m.length;i++){
		if(m[i].state=="paused"){
			time=time+Math.max(Math.min(m[i].timedelta,maxdelay),mindelay);
			m[i].time=time;
		}
	}
	return m;
}


function ClearUnplayedMovesPlaylist(movesplaylist){
	PauseMovesPlaylist(movesplaylist);
	if(MovesPlaylistState(movesplaylist)==="paused"){
		ConsoleAddMPL("↶ ⏺ (erasing previous record)");
		var found=false;
		for (var i=movesplaylist.length-1;i>0&&!found;i--){
			if(movesplaylist[i].state=="paused"){
				movesplaylist.pop();
			}
			else
				found=true;
		}
	}
	return movesplaylist;
}

function PushMovesPlaylist(mpi,movesplaylist){
	ClearUnplayedMovesPlaylist(movesplaylist);
	var lastid=movesplaylist.length>0?movesplaylist[movesplaylist.length-1].id+1:0;
	mpi.id=lastid;
	movesplaylist.push(mpi);
	//SetTimesMovesPlaylist(movesplaylist);
}

//MovesPlaylist: State
function MovesPlaylistState(movesplaylist){
	if(movesplaylist.some(mpi=>mpi.state==="scheduled"))
		return "scheduled";
	else if(movesplaylist.every(mpi=>(mpi.state==="played")||(mpi.state==="skipped")))
		return "ended";
	else
		return "paused";

}


//MovesPlaylist: Pause and Resume

function PauseMovesPlaylist(movesplaylist){
	if(MovesPlaylistState(movesplaylist)==="scheduled"){
		var m=movesplaylist.map(function(mpi){
			if(mpi.state=="scheduled"){
				clearTimeout(mpi.schid);
				mpi.state="paused";
			}
			return mpi;
		});
		ResumeRecordingMovesPlaylist();
		clearTimeout(recordingmovesid);
		ConsoleAddMPL("⏸ (playback paused)");
	}
	return m;
}

function ResumeMovesPlaylist(movesplaylist){
	if(MovesPlaylistState(movesplaylist)!=="scheduled"){
		var m=movesplaylist;
		m=SetTimesMovesPlaylist(m);
		PauseRecordingMovesPlaylist();	
		m=m.map(function(mpi){ScheduleMove(mpi,m);return mpi});
	ConsoleAddMPL("⏵ (playing moves)");
	}
	return m;
}

function ScheduleMove(mpi,movesplaylist){
	if(mpi.state=="paused"){
		mpi.schid=setTimeout(function(){PlayMove(mpi,movesplaylist)},mpi.time);
		mpi.state="scheduled";
	}
	if(mpi.id===movesplaylist[movesplaylist.length-1].id)
		recordingmovesid=setTimeout(ResumeRecordingMovesPlaylist,mpi.time+100);
	return mpi;
}


//MovesPlaylist: Skip , Unskip, Play and Unplay - Next Moves

function QuietCheckKey(move){
	PauseRecordingMovesPlaylist();
	checkKey({keyCode:move},!0);
}

function SkipMove(mpi,movesplaylist){
	PauseRecordingMovesPlaylist();
	var move=mpi.move;
	mpi.state="skipped";
	mpi.time=0;
	ConsoleAddMPL("⏭ skipping move: "+UnParseMove(move)+" of "+movesplaylist.length);
}

function UnSkipMove(mpi,movesplaylist){
	PauseRecordingMovesPlaylist();
	var move=mpi.move;
	mpi.state="paused";
	mpi.time=0;
	ConsoleAddMPL("⏭⏪︎ unskipping move: "+UnParseMove(move)+" of "+movesplaylist.length);
}

function PlayMove(mpi,movesplaylist){
	var move=mpi.move;
	QuietCheckKey(move);
	mpi.state="played";
	mpi.time=0;
	ConsoleAddMPL("⏵ playing move: "+UnParseMove(move)+" of "+movesplaylist.length);
}

function UnPlayMove(mpi,movesplaylist){
	PauseRecordingMovesPlaylist();
	var move=mpi.move;
	if(move!=85)
		QuietCheckKey(85);
	else
		QuietCheckKey(PreviousMove(mpi).move);
	mpi.state="paused";
	mpi.time=0;
	ConsoleAddMPL("⏪︎ unplaying move: "+UnParseMove(move)+" of "+movesplaylist.length);
}


function SkipMovesPlaylist(movesplaylist){
	PauseMovesPlaylist(movesplaylist);
	ConsoleAddMPL("⏩︎ (skip to next move)");
	
	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=0;i<m.length&&!found;i++){
		if(m[i].state=="paused"){
			found=true;
			SkipMove(m[i],m);
		}
	}
	return m;
}

function NextMovesPlaylist(movesplaylist){
	PauseMovesPlaylist(movesplaylist);
	ConsoleAddMPL("⏩︎ (play next move)");

	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=0;i<m.length&&!found;i++){
		if(m[i].state=="paused"){
			time=time+Math.max(Math.min(m[i].timedelta,maxdelay),mindelay);
			m[i].time=time;
			found=true;
			ScheduleMove(m[i],m);
		}
	}
	return m;
}

function PreviousMovesPlaylist(movesplaylist){
	PauseMovesPlaylist(movesplaylist);

	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=m.length-1;i>=0&&!found;i--){
		if(m[i].state=="played"){
			found=true;
			UnPlayMove(m[i],m);
		}
		if(m[i].state=="skipped"){
			found=true;
			UnSkipMove(m[i],m);
		}
	}
	return m;
}


//MovesPlaylist: Seek

function FindMove(i,movesplaylist){
	return movesplaylist.find(function(mpi){return mpi.id===i;});
}


// MovesPlaylist Replay Speed

function ChangeReplaySpeed(movesplaylist,newinterval){
	ConsoleAddMPL(" speed change: 1 move /"+Math.floor(newinterval)+"ms");
	
	PauseMovesPlaylist(movesplaylist);
	maxdelay=newinterval;
	mindelay=newinterval;
	ResumeMovesPlaylist(movesplaylist);
}

function FasterReplaySpeed(movesplaylist){
	ChangeReplaySpeed(movesplaylist,maxdelay*0.9)
}

function SlowerReplaySpeed(movesplaylist){
	ChangeReplaySpeed(movesplaylist,maxdelay/0.9)
}

////////////////////////////////////////////////////////////////////////////////
// Replay Interface

function RequestPlaylist(){
	RequestDataPack([
		['answer',{
			questionname:"Moves playlist:",
			qplaceholder:"><^^>>>ZvvvvR    or: [[move1,time1 (ms)],[move2,time2 (ms)],...] with possible moves: 27,37,38,39,40,82,85,88",
			qvalidator:PlaylistValidator
		}]
	],
	{
		actionvalid:LoadPlaylistFromDP,
		qdisplay:LaunchBalloon,
		qtargetid:'puzzlescript-game',
		qonsubmit:Identity
	});
}

function PlaylistValidator(DF){
	var pattern=/^((\[(\[(27|37|38|39|40|82|85|88)\,[0-9]+\])(\,\[(27|37|38|39|40|82|85|88)\,[0-9]+\])*\])|(((left|up|right|down|undo|restart|quit|[LURDRZXQ<\^V>])\s*)+))$/ig;
	var errormessage="Please verify the moves playlist!";
	return PatternValidatorGenerator(pattern,errormessage)(DF);
}

function LoadPlaylistFromDP(DP){
	var moves=FindData('answer',DP.qid);
	movesplaylist=NewMovesPlaylist(ParseMoves(moves));
};

function DownLoadPlaylist(movesplaylist){
	ConsoleAddMPL("⏏ downloading...");
	
	DownLoadPlaylist.counter=DownLoadPlaylist.counter?DownLoadPlaylist.counter+1:1;
	var mpl=movesplaylist.map(function(mpi){return [mpi.move,mpi.timedelta];});
	Download(JSON.stringify(mpl), pageIdentifier()+"playlist-"+DownLoadPlaylist.counter+".txt","text/js");
}

function LoadPlaylistControls(){
	if(document.getElementById("PlaylistBar")===null)
		AddAfterElement(PlaylistBar(),"#GameBar");
}

function PlaylistBar(){
	var buttons=[
			['⏺','ResumeRecordingMovesPlaylist()'],
			['⏹','PauseRecordingMovesPlaylist()'],
	/*🔄*/	['↺','RequestPlaylist()'],
			['⏵','ResumeMovesPlaylist(movesplaylist)'],
			['⏸','PauseMovesPlaylist(movesplaylist)'],
			['⏩︎','NextMovesPlaylist(movesplaylist)'],
	/*⏭️*/	['⏭','SkipMovesPlaylist(movesplaylist)'],
			['⏪︎','PreviousMovesPlaylist(movesplaylist)'],
	/*⏏️*/	['⏏','DownLoadPlaylist(movesplaylist)']
		];
	buttons=buttons.map(b=>ButtonOnClickHTML(b[0],b[1])).join("");
	return ButtonBar(buttons,"PlaylistBar");
}



////////////////////////////////////////////////////////////////////////////////
//Overwrites

function doSetupTitleScreenLevelContinue(){
	try{LoadSave()}
	catch(c){}}
doSetupTitleScreenLevelContinue()

function DoWin() {
	if (!winning) {
		EchoLevelWin(curlevel);AddToSolvedLevelIndices(curlevel);SaveLevel(curlevel);
		if(typeof customLevelInfo!= "undefined")customLevelInfo();
		if (againing = false, tryPlayEndLevelSound(), unitTesting){
			ClearLevelRecord();
			return void nextLevel();
		}
		winning = true, timer = 0
	}
}


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

function AdvanceScreen(){
	if(isLevelMessage(curlevel)&&curlevel<LastLevel()){
		console.log("from message");
		curlevel++;
	}
	else if(isLastLevel(curlevel)||(isLevelMessage(curlevel)&&curlevel>LastLevel())){
		console.log("from last level");
		curlevel=FirstUnsolvedScreen(curlevel);
	}
	else{
		console.log("from anywhere in the middle");
		curlevel=NextUnsolvedScreen(curlevel);
	}		
	AdvanceLevel();	
}

function AdvanceEndScreen(){
	if(curlevel>=LastSolvedLevel())
		curlevel++;
	else
		curlevel=LastSolvedLevel()+1;
	
	AdvanceLevel();		
}

function LoadLevelOrCheckpoint(){
	if (curlevelTarget!==null){
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		curlevelTarget=null;
		hasUsedCheckpoint=false;
	}
	else
		loadLevelFromState(state,curlevel);
}

function RefreshCheckpoint(){
	if(HasSave()){
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

function nextLevel(){
	againing=false;
	messagetext="";
	
	curlevel=Math.min(curlevel,LastScreen()?LastScreen():curlevel);
	
	if (titleScreen)
		StartLevelFromTitle();
	else {
		if(!SolvedAllLevels())
			AdvanceScreen();
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

function checkKey(a,b){
	if(!winning){
		var c=-1;
		var fdb=true;//F
		switch(a.keyCode){
			case 65:case 37:c=1;RegisterMove(c);break;
			case 38:case 87:c=0;RegisterMove(c);break;
			case 68:case 39:c=3;RegisterMove(c);break;
			case 83:case 40:c=2;RegisterMove(c);break;
			case 13:case 32:case 67:case 88:if(!1===norepeat_action||b)c=4,RegisterMove(c);else return;break;
			case 85:case 90:if(!1===textMode)return RegisterMove(85),pushInput("undo"),DoUndo(!1,!0),canvasResize(),prevent(a);break;
			case 82:if(!1===textMode&&b)return RegisterMove(82),pushInput("restart"),DoRestart(),canvasResize(),prevent(a);break;
			case 27:if(!1===titleScreen)return RegisterMove(27),goToTitleScreen(),tryPlayTitleSound(),canvasResize(),prevent(a);break;
			case 69:if(canOpenEditor)return b&&(levelEditorOpened=!levelEditorOpened,!1===levelEditorOpened&&printLevel(),restartTarget=backupLevel(),canvasResize()),prevent(a);break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:if(levelEditorOpened&&b)return c=9,49<=a.keyCode&&(c=a.keyCode-49),c<glyphImages.length?glyphSelectedIndex=c:consolePrint("Trying to select tile outside of range in level editor.",!0),canvasResize(),prevent(a);break	
			case 70:RequestGameFeedback();//F is for Feedback!
			default:fdb=false;//F
		}
		if(fdb)UnRequestGameFeedback();//F
		if(throttle_movement&&0<=c&&3>=c){
			if(lastinput==c&&input_throttle_timer<repeatinterval){
				UnRegisterMove();return;}
			lastinput=c;
			input_throttle_timer=0
		}
		if(textMode){
			if(0!==state.levels.length)
				if(titleScreen)
					if(0===titleMode)
						4===c&&b&&!1===titleSelected&&(tryPlayStartGameSound(),titleSelected=true,messageselected=false,timer=0,quittingTitleScreen=true,generateTitleScreen(),canvasResize());
					else if(4==c&&b)!1===titleSelected&&(tryPlayStartGameSound(),titleSelected=true,messageselected=false,timer=0,quittingTitleScreen=true,generateTitleScreen(),redraw());else{if(0===c||2===c)titleSelection=0===c?0:1,generateTitleScreen(),redraw()}else 4==c&&b&&(unitTesting?nextLevel():!1===messageselected&&(messageselected=true,timer=0,quittingMessageScreen=true,tryPlayCloseMessageSound(),titleScreen=false,drawMessageScreen()))}else if(!againing&&0<=c)return 4===c&&"noaction"in state.metadata||(pushInput(c),processInput(c)&&redraw()),prevent(a)
}}

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
			returntrue;
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