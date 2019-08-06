////////////////////////////////////////////////////////////////////////////////
/// Echo

function EchoLevelWin(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		EchoData(leveldata,leveldataURL);
	}
}

function EchoCheckpoint(){
	if(AnalyticsClearance()){
		UpdateLevelCheckpointData(curlevel,checkpointsaver);
		EchoData(leveldata,leveldataURL);
	}
	checkpointsaver++;
}

function EchoLevelClose(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		leveldata["winsequence"]="";
		leveldata["type"]="close";
		EchoData(leveldata,leveldataURL);
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
			case 65:move=37;break;//<
			case 87:move=38;break;//^
			case 68:move=39;break;//>
			case 83:move=40;break;//v
			case 13:case 32:case 67:move=88;break;//X
			case 90:move=85;break;//Z
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
		qonsubmit:Identity,
		requireConnection:false
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
