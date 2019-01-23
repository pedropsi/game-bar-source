/////////////// Replay utilities

function ParseMoves(movestring){
	return JSON.parse(movestring);
}

function Replay(movetimes){
	var time=0;
	
	function PlayMove(move){
		checkKey({keyCode:move},!1);
		console.log("move:",move);
	}
	
	for (var i=0;i<movetimes.length;i++){
		if(i!==0)
			time=time+movetimes[i][1];
		setTimeout(PlayMove(movetimes[i][0]),time);
		console.log(time);
	}
}