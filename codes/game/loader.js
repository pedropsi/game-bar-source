PrependElement("<div id='puzzlescript-game'></div>"+'<div id="GameBW" class="gameNav" onclick="GoToLevelPrev()">Previous level</div><div id="GameFW" class="gameNav" onclick="GoToLevelNext()">Next level</div>',pageIdentifier());

function PrepareGame(){
	RequestDataPack([
		['pass',{}],
		['plain',{questionname:'<p>The game is in closed beta.</p></p><a href="#" onclick="OpenModalPreOrder(\'Your email address (early bird discount entitlement).\')">Be notified when it is released!</a></p>'}]
		],
		{
		destination:"Keys",
		qonsubmit:RevealGame,
		qtargetid:"puzzlescript-game",
		thanksmessage:"Password submitted. Please turn on the sound & press F anytime while playing to provide live feedback!"
		});
}

function RevealGame(DP){
	window.scroll(0,0);
	var gid=FindData("game","preparegame");
	var key=FindData("answer",DP.qid);
	var gameid=Unlock(gid,key);
	console.log(gameid);
	PuzzleScript.embed(document.getElementById('puzzlescript-game'),gameid);
	

}
