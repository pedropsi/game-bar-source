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
	Close("preparegame");
	Close(qid);
}


//Music

var sound;

function LoadTrack(id,soundtracks){
	if(typeof soundtracks!="undefined"){
		
		if(typeof id =="number")
			var id= id%soundtracks.length;
		
		if(sound)
			sound.stop();
		
		sound =new Howl({
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
	
	/*function LoadSound(id){
	if(typeof soundeffects!="undefined"){
		
		soundeffect =new Howl({
			src: [soundeffects[id].src],
			volume: soundeffects[id].volume}
		});
	
		sound.once('load', function(){
			sound.play();
			Howler.volume(soundeffects[id].volume);
		});	
		};*/

function OverrideMusic(){
	if(OverrideSounds)
		OverrideSounds();
	
	LoadTrack(0);
}