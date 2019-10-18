var TA_Obtained=[0,0,0];

function TA_CountObtained(){
	var TiaraIndex=35;
	var TiaraBrokenIndex=36;
	var SecretIndex=38;
	var M=8; //Multiplicity in counters
	var T=0;
	var TB=0;
	var S=0;
	for(var i=0;i<level.n_tiles;i++){
		if(level.getCell(i).get(TiaraIndex))
			T++;
		if(level.getCell(i).get(TiaraBrokenIndex))
			TB++;
		if(level.getCell(i).get(SecretIndex))
			S++;
	}
	TA_Obtained=[(T-T%M)/M,(TB-TB%M)/M,(S-S%M)/M];
}

//Hook to in-game winning
var RegisterLevelHonour=TA_CountObtained;

//Hook to HOF
function GetHonour(){
	var h="";
	for(var i=1;i<=TA_Obtained[0];i++)
		h=h+"★";
	if(TA_Obtained[2]>0)
		h=h+" ❤";
	return h;
}