/////////////// Replay utilities

function ParseMoves(movestring){
	var moves=movestring.replace(/\</g,"37»").replace(/\>/g,"39»").replace(/\^/g,"38»").replace(/v/g,"40»").replace(/X/g,"88»").replace(/Z/g,"85»").replace(/R/g,"82»").split("»");
	moves.pop();
	moves=moves.map(x=>Number(x));
	return moves;
}

function Replay(movestring){
	var moves=ParseMoves(movestring);
	var intervalID = window.setInterval(ReplayOneMove,1000);
	
	function ReplayOneMove() {
		if(moves.length<1){
			window.clearInterval(intervalID);
		}
		else{
			var move=moves[moves.length-1];
			checkKey({keyCode:move},!1);
			moves.pop();
			console.log(move);
		}
  }
}