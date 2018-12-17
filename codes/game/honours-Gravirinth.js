
function G_CountObtained(){
var Orbindices=[255,256,257,258];//Four types of orbs
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
var NumberIndices=[259,260,261,262,263,264,265,266,267,268]; //Numerals 0 to 9
	var G_Steps="";
	function hasNumber(cellindex){
		var f="";
		for(var i=0;i<NumberIndices.length;i++)
			if(level.getCell(cellindex).get(NumberIndices[i]))
				f=String(NumberIndices[i]-259);
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