
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