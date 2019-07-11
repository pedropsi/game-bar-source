//Override SFX cache
function OverrideSounds(){
	sfxCache={};
	for (var i in soundtracks){
		if(soundtracks[i].sfx){
			LoadTrack(i);
			sfxCache[soundtracks[i].sfx]=soundtracks[i];};
		}
	console.log("Sounds overriden");
}
 
 function LoadTrack(id){
	 if((typeof soundtracks!="undefined")&&(typeof soundtracks[id]!="undefined")){
		if(typeof soundtracks[id].sound=="undefined"){
			
		var endf=function(){return;};
		if((soundtracks[id].next)&&(soundtracks[soundtracks[id].next]))
			endf=function(){PlayTrack(soundtracks[id].next)};
			
		soundtracks[id].sound=new Howl({
										src: [soundtracks[id].src],
										volume: soundtracks[id].volume,
										onend:endf
									});
		
		console.log("loaded "+soundtracks[id].src);
		}
	}
};

 
 function PlayTrack(id){
	 if(typeof soundtracks!="undefined"){
		 if(typeof soundtracks[id]!="undefined")
			LoadTrack(id);
		if(typeof soundtracks[id].start!="undefined")
			soundtracks[id].sound.seek(soundtracks[id].start);
		else
			soundtracks[id].sound.seek(0);
		if(soundtracks[id].stopall)
			StopConcurrentTracks(id);	
		if(soundtracks[id].stopsame)
			soundtracks[id].sound.stop();	

		soundtracks[id].sound.play();
		console.log("playing "+soundtracks[id].src);
}};	

 function StopConcurrentTracks(id){
	for (var i in soundtracks){
		if((soundtracks[i].sound)&&(soundtracks[i].sound.playing()))
			soundtracks[i].sound.stop();
 }};


//Music
function OverrideMusic(){
	if(OverrideSounds)
		OverrideSounds();
	/*PlayTrack(1);*/
};