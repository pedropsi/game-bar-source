
function G_CountObtained(){
var so=state.objects; //Global game state	
var Orbindices=[so.gotorb1.id,so.gotorb2.id,so.gotorb3.id,so.gotorb4.id];//Four types of orbs
	var G_Orbs=0;
	function hasOrb(cellindex){
		var f=0;
		for(var i=0;i<Orbindices.length;i++)
			if(level.getCell(cellindex).get(Orbindices[i]))
				f=1;
		return f}

	for(var j=0;j<level.n_tiles;j++){
		if(hasOrb(j))
			G_Orbs++;
	}
	return G_Orbs;
}


function G_CountSteps(){
var so=state.objects; //Global game state	
var NumberIndices=[so.n0.id,so.n1.id,so.n2.id,so.n3.id,so.n4.id,so.n5.id,so.n6.id,so.n7.id,so.n8.id,so.n9.id]; //Numerals 0 to 9
	var G_Steps="";
	function hasNumber(cellindex){
		var f="";
		for(var i=0;i<NumberIndices.length;i++)
			if(level.getCell(cellindex).get(NumberIndices[i]))
				f=String(NumberIndices[i]-NumberIndices[0]);
		return f}

	for(var j=0;j<level.n_tiles;j++){
		if(hasNumber(j)!="")
			G_Steps=G_Steps+hasNumber(j); //The order of tiles numbering is left to right too.
	}
	return G_Steps;
}

function G_Counters(){
	return [G_CountObtained(),G_CountSteps()];
}

//Hook to HOF
function GetHonour(){
	var g=G_Counters();
	var h="";
	for(var i=1;i<=g[0];i++)
		h=h+"★";
	h=h+" ("+g[1]+" steps)";
	return h;
}


//Playlist
/*var p="media/gravirinth/music/";*/
var ps="media/gravirinth/sound/";
var soundtracks={
/*		1:{src:p+'Stellardrone - Light Years - 03 Eternity.mp3',volume:0.25,start:0,next:2,stopall:true},
		2:{src:p+'Stellardrone - Light Years - 07 Comet Halley.mp3',volume:0.25,start:5,next:3,sfx:22586308,stopall:true,play:function(){PlayTrack(2)}},
		3:{src:p+'Stellardrone - A Moment Of Stillness - 02 Billions And Billions.mp3',volume:0.25,start:5,next:4,stopall:true},
		4:{src:p+'Stellardrone - A Moment Of Stillness - 05 Twilight.mp3',volume:0.25,start:5,next:5,stopall:true},
		5:{src:p+'Stellardrone - Between The Rings - 05 Between The Rings.mp3',volume:0.25,start:5,next:1,stopall:true},*/
		left:	{src:ps+'left.mp3',		volume:0.3,sfx:13614108},
		up:		{src:ps+'up.mp3',		volume:0.3,sfx:25636708},
		right:	{src:ps+'right.mp3',	volume:0.3,sfx:79636308},
		down:	{src:ps+'down.mp3',		volume:0.3,sfx:76346108},
		orb:	{src:ps+'orb.mp3',		volume:0.3,sfx:50758708},
		type:	{src:ps+'type.mp3',		volume:0.1,sfx:27763708},
		light:	{src:ps+'light.mp3',	volume:0.3,sfx:40605508},
		save:	{src:ps+'save.mp3',		volume:0.1,sfx:4002908},
		undo:	{src:ps+'undo.mp3',		volume:0.1,sfx:85375308},
		restart:{src:ps+'restart.mp3',	volume:0.1,sfx:35446108}
	/* 20449708 endplay */
}

ListenOnce('load',function(){LoadSounds(soundtracks,"puzzlescript-game")});
