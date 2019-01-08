PrependElement("<div id='puzzlescript-game'></div>"+'<div id="GameBW" class="gameNav" onclick="GoToLevelPrev()">Previous level</div><div id="GameFW" class="gameNav" onclick="GoToLevelNext()">Next level</div>',pageIdentifier());

function PrepareGame(){
	var p=NewDataPack();
	
	p.qid=FindData("game","preparegame");

	p.questionname="What is the password?";
	p.qfield="password";
	p.qtype=ShortAnswerHTML;
	p.qplaceholder="(top-secret)";
	p.action='RevealGame';
	
	var html= QuestionHTML(p);	
	OpenModal(html,p.qid,"puzzlescript-game");
}

function RevealGame(qid){
	window.scroll(0,0);
	var key=FindData("password",qid);
	var gameid=Unlock(qid,key);
	PuzzleScript.embed(document.getElementById('puzzlescript-game'),gameid); 
	Music();
	Close("preparegame");
	Close(qid);
}

//Music

function LoadTrack(id){
	if(typeof soundtracks!="undefined"){
	var id= id%soundtracks.length;
	var sound =new Howl({
		src: [soundtracks[id].src],
		volume: soundtracks[id].volume,
		onend: function(){LoadTrack(id+1);}
	});
	sound.once('load', function(){
		if(typeof soundtracks[id].start!="undefined")
			sound.seek(soundtracks[id].start);
		sound.play();
		Howler.volume(soundtracks[id].volume);
	});	
	};
	}

function Music(){
	LoadTrack(0);
}