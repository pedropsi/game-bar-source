PrependElement("<div id='puzzlescript-game'></div>"+'<div id="GameBW" class="gameNav" onclick="GoToLevelPrev()">Previous level</div><div id="GameFW" class="gameNav" onclick="GoToLevelNext()">Next level</div>',pageIdentifier());

function PrepareGame(){
	var DP=NewDataPack({	
		qdestination:"Keys",
		
		qid:FindData("game","preparegame"),
		questionname:"What is the password?",
		
		qfield:"answer",
		qtype:ShortAnswerHTML,
		qplaceholder:"(top-secret)",
		action:'RevealGame',
		qtargetid:"puzzlescript-game",
		qonclose:CloseTeaser,
		
		thanksmessage:"Password submitted. Please turn on the sound & press F anytime while playing to provide live feedback!"
		
		});
	
	DP.qdisplay(DP);
}

function RevealGame(qid){
	window.scroll(0,0);
	var key=FindData("answer",qid);
	var gameid=Unlock(qid,key);
	
	if(AnalyticsClearance())
		SubmitAndNext(qid);
	
	PuzzleScript.embed(document.getElementById('puzzlescript-game'),gameid);
}

function CloseTeaser(iddummy){
	Close("teaser");
}
