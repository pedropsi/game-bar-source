////////////////////////////////////////////////////////////////////////////////
// Echo

function EchoLevelData(leveldata){
	if(AnalyticsClearance()){
		EchoData(leveldata,leveldataURL);
	}
}

// Echo specifics
function EchoLevelWin(curlevel){
	var leveldata=UpdateLevelData(curlevel);
	EchoLevelData(leveldata);
}

function EchoCheckpoint(){
	var leveldata=UpdateLevelCheckpointData(curlevel);
	EchoLevelData(leveldata);
	ClearLevelRecord();
}

function EchoHint(lvl,hintN){
	var hintdata=UpdateHintData(lvl,hintN);
	EchoLevelData(hintdata);
}

function EchoLevelClose(curlevel){
	var leveldata=FuseObjects(UpdateLevelData(curlevel),{
		"winsequence":"-",
		"type":"close"});
	EchoLevelData(leveldata);
}

ListenOnce("unload",function(){EchoLevelClose(curlevel)});


////////////////////////////////////////////////////////////////////////////////
/// Level Data, recording moves

function LevelData(){
	return {
		formDataNameOrder:"[\"name\",\"level\",\"identifier\",\"timing\",\"winsequence\",\"moves\",\"type\"]",
		formGoogleSendEmail:"",
		formGoogleSheetName:"leveltimes",
		identifier:document.body.id,
		level:"0",
		moves:"-",
		winsequence:"-",
		name: UserId(),
		timing: "0",
		type:"-"
	}
};

var leveldataURL="https://script.google.com/macros/s/AKfycbwuyyGb7XP7H91GH_8tZrXh6y_fjbZg4vSxl6S8xvAAEdyoIHcS/exec";

function ClearLevelData(){
	ClearLevelRecord();
	ResetCheckpointIncrement();
}

function UpdateLevelData(curlevel){
	return FuseObjects(LevelData(),{
		"timing":LevelTime(),//Math.floor(ms.reduce(function(x,y){return (x+y[1])},0)/1000),
		"level":LevelNumber(curlevel),
		"moves":JSON.stringify(RegisterMove.moveseq),
		"winsequence":JSON.stringify(RegisterMove.winseq),
		"type":"win"
	});
}

function ClearLevelRecord(){
	ClearMoves();
	ResetLevelTime();
	ResetDeltaTime();
}


//Moves
function ClearMoves(){
	RegisterMove.moveseq=[];
	RegisterMove.winseq=[];
}

function RegisterMove(move){
	var delta = DeltaTime();
	
	if(!RegisterMove.moveseq)
		RegisterMove.moveseq=[];
	RegisterMove.moveseq.push([move,delta]);
	
	if(!RegisterMove.winseq)
		RegisterMove.winseq=[];
	
	switch(move){
		case 82:RegisterMove.winseq=[];break;//R
		case 85:RegisterMove.winseq.pop();break;//Z
		case 27:RegisterMove.winseq=["Q"];break;//Q
		default:RegisterMove.winseq.push([move,delta]);break
	}
}

//Timing
function DeltaTime(){
	if(!DeltaTime.last){
		ResetDeltaTime();
		return 0;
	}
	DeltaTime.delta=(Date.now()-DeltaTime.last);
	DeltaTime.last=Date.now();
	return DeltaTime.delta;
}

function ResetDeltaTime(){
	DeltaTime.last=Date.now();
}

function LevelTime(){
	if(!LevelTime.start){
		ResetLevelTime();
		return 0;
	}
	else
		return Date.now()-LevelTime.start; //Time difference in ms
}

function ResetLevelTime(){
	LevelTime.start=Date.now();
}

//Checkpoint
function CheckpointIncrement(){
	if(!CheckpointIncrement.n)
		ResetCheckpointIncrement();
	CheckpointIncrement.n++;
	return CheckpointIncrement.n;
}

function CheckpointString(curlevel){
	return String(curlevel)+"»"+String(CheckpointIncrement.n);
}

function ResetCheckpointIncrement(){
	return CheckpointIncrement.n=0;
}

function UpdateLevelCheckpointData(curlevel){
	CheckpointIncrement();
	return FuseObjects(UpdateLevelData(curlevel),{
		"type":"checkpoint",
		"level":CheckpointString(curlevel)
	});
}

//Hint
function UpdateHintData(lvl,hintN){
	return FuseObjects(LevelData(),{
		"type":"hint",
		"level":lvl,
		"timing":LevelTime(),
		"moves":hintN,
		"winsequence":"---"
	});
}