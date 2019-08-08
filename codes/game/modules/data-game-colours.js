///////////////////////////////////////////////////////////////////////////////
//Colour spaces

//RGB & HEX
function RGB_HEX(hexstring){
	var HEX=hexstring.replace("#","");
	var l=HEX.length;
	if(l===3||l===6){
		var R=(l===3?HEX[0]:HEX.slice(0,2));
		var G=(l===3?HEX[1]:HEX.slice(2,4));
		var B=(l===3?HEX[2]:HEX.slice(4,6));
		return [To256(R),To256(G),To256(B)];
	}
	else
		return [0,0,0];
};

function To256(AA){
	if(AA.length>=2)
		return ToDecimal(AA[0])*16+ToDecimal(AA[1])
	else if (AA.length==1)
		return ToDecimal(AA[0])
	else
		return 0;
}

var HEXDECIMAL=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

function ToDecimal(A){
	var n=HEXDECIMAL.indexOf(String(A).toUpperCase());
	return (n===-1)?0:n;
}

function HEX_RGB(rgbArray){
	var rgbA=rgbArray.slice(0,3).map(ToHexadecimal);
	return "#"+rgbA.join("");
}

function ToHexadecimal(deci){
	var deci=Math.round(deci);
	var big=(deci/16-deci/16%1)%16;
	var sma=(deci-big*16)%16;
	return HEXDECIMAL[big]+HEXDECIMAL[sma];
}


//HSL
function Lightness(R,G,B){//256
	if(typeof G==="undefined"){
		var colour=RGB(R).colour;
		var R=colour[0];
		var G=colour[1];
		var B=colour[2];
	}
	var L=(Math.max(R,G,B)+Math.min(R,G,B))/2/256;
  return (L*1000-(L*1000)%1)/1000;
}

function Hue(R,G,B){//256
	if(typeof G==="undefined"){
		var colour=RGB(R).colour;
		var R=colour[0];
		var G=colour[1];
		var B=colour[2];
	}

	if((R==B)&&(G==B))
		return 0;
	if(((R>G)&&(G>=B))||((R>=G)&&(G>B)))
		return 60*((G-B)/(R-B));
	else if((G>R)&&(R>=B))
		return 60*(2-(R-B)/(G-B));
	else if((G>=B)&&(B>R))
		return 60*(2+(B-R)/(G-R));
	else if((B>G)&&(G>R))
		return 60*(4-(G-R)/(B-R));
	else if((B>R)&&(R>=G))
		return 60*(4+(R-G)/(B-G));
	else if((R>=B)&&(B>G))  
		return 60*(6-(B-G)/(R-G));
	else
		return 0;
}

function Chroma(R,G,B){
	if(typeof G==="undefined"){
		var colour=RGB(R).colour;
		var R=colour[0];
		var G=colour[1];
		var B=colour[2];
	}
  return (Math.max(R,G,B)-Math.min(R,G,B));
}

function Saturation(R,G,B){//256
	if(typeof G==="undefined"){
		var colour=RGB(R).colour;
		var R=colour[0];
		var G=colour[1];
		var B=colour[2];
	}
	var  L=Lightness(R,G,B);
	if(0<L&&L<1){
    var S=Chroma(R,G,B)/256/(1-Math.abs(2*L-1));
    return S;
  }
	else
		return 0;
}

function HSL_RGB(RGB){
	var R=RGB[0];
	var G=RGB[1];
	var B=RGB[2];
	return [Hue(R,G,B),Saturation(R,G,B),Lightness(R,G,B)];
}


function RGB_HSL(HSL){
  var H=HSL[0];
  var S=HSL[1];
  var L=HSL[2];

  var C=(1-Math.abs(2*L-1))*S;
  var H6=(H/60)%6;
  var X=C*(1-Math.abs(H6%2-1));
  var M=L-C/2;
  var R,G,B;

  switch(Math.floor(H6)){
    case 0:R=C,G=X,B=0; break;
    case 1:R=X,G=C,B=0; break;
  case 2:R=0,G=C,B=X; break;
    case 3:R=0,G=X,B=C; break;
    case 4:R=X,G=0,B=C; break;
    case 5:R=C,G=0,B=X; break;
  }

  return [Math.round((R+M)*255),
          Math.round((G+M)*255),
          Math.round((B+M)*255)];
}


//Colour Manipulation
function ColourExtract(rgbatxt){
		var ntxt=rgbatxt.match(/([\d]+\,)+([\d]+)/);
		var RGBAorHSL=ntxt[0].split(",").map(Number);
		return RGBAorHSL;
}

function Colour(colour){
	if(!colour){
		return {space:'RGB',colour:[0,0,0]};
  }
  else if(!colour.colour){
    return Colour({colour:colour});
  }
  else if(!colour.space){
		var c=colour.colour;
		if(typeof c==="string"){
			c=c.toLowerCase();
			if(c.replace("rgb","")!==c)
				return {space:'RGB',colour:CompelRGB(ColourExtract(c))};
			else if(c.replace("hsl","")!==c){
				return {space:'HSL',colour:CompelHSL(ColourExtract(c))};
			}else
				return {space:'HEX',colour:CompelHEX(c)};
		}
		else if(typeof c==="object"){
			c.push[0];c.push[0];c.push[0];
			if(c[0]>=0&&c[1]>=0&&c[2]>=0&&c[0]<360&&c[1]<=1&&c[2]<=1)
				return {space:'HSL',colour:CompelHSL(c)};
			else
				return {space:'RGB',colour:CompelRGB(c)};
		} 
    return {space:'RGB',colour:[0,0,0]};			
	}
	else
    return colour;
}

function CompelHEX(hexstring){
	var hexstring=hexstring.replace("#","");
	if(hexstring.length===0){
		return "#000000";
  }

  if(hexstring.length<3){
		hexstring=hexstring+"0".repeat(3-hexstring.length);
  }

	if(hexstring.length===3){
		hexstring=hexstring[0]+"0"+hexstring[1]+"0"+hexstring[2]+"0";
  }
	else{
		hexstring=(hexstring+"000000").slice(0,6);
  }
	return "#"+hexstring;
}

function CompelRGB(rgbarray){
	var rgbarray=rgbarray;
	if(rgbarray.length===3){
		function RBGBind(n){return Math.max(Math.min(n,255.999999999),0);};
		return rgbarray.map(RBGBind);
	}
	else{
		rgbarray.push(0);rgbarray.push(0);rgbarray.push(0);
		return CompelRGB(rgbarray.slice(0,3));
	}
}

function CompelHSL(rgbarray){
	var rgbarray=rgbarray;
	if(rgbarray.length===3){
		rgbarray[0]=Math.max(Math.min(rgbarray[0],359.999999999),0);
		rgbarray[1]=Math.max(Math.min(rgbarray[1],1),0);
		rgbarray[2]=Math.max(Math.min(rgbarray[2],1),0);
		return rgbarray;
	}
	else{
		rgbarray.push(0);rgbarray.push(0);rgbarray.push(0);
		return CompelRGB(rgbarray.slice(0,3));
	}
}


function RGB(colour){
	var colour=Colour(colour);
	if(colour.space==="RGB"){
	  return colour;
	} else if(colour.space==="HEX"){
		colour.colour=RGB_HEX(colour.colour);
	} else if(colour.space==="HSL"){
		colour.colour=RGB_HSL(colour.colour);
	} else
		console.log("Colour space not supported",colour);
	
	colour.space="RGB";
	return colour;
}

function HEX(colour){
	var colour=Colour(colour);
	if(colour.space==="HEX")
		return colour;
	else{
		colour.colour=HEX_RGB(RGB(colour).colour);
		colour.space="HEX";
		return colour;	
	}
}

function HSL(colour){
	var colour=Colour(colour);
	if(colour.space==="HSL")
		return colour;
	else{
		colour.colour=HSL_RGB(RGB(colour).colour);
		colour.space="HSL";
		return colour;	
	}
}

// Colour modification

function Lighten(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=Math.min(Math.max(c[2]*n,0),1);
  colour.colour=c;
  return colour;
} 

function Darken(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=(n===0?1:Math.min(Math.max(c[2]/n,0),1));
  colour.colour=c;
  return colour;
} 

function LightenTo(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function DarkenTo(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=1-Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function Saturate(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=Math.min(Math.max(c[1]*n,0),1);
  colour.colour=c;
  return colour;
} 

function Desaturate(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=(n===0?1:Math.min(Math.max(c[1]/n,0),1));
  colour.colour=c;
  return colour;
} 

function SaturateTo(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function Huen(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=(c[0]+n)%360;
  colour.colour=c;
  return colour;
} 

function Dehuen(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=(c[0]-n)%360;
  colour.colour=c;
  return colour;
} 

function HueTo(colour,n){
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=n%360;
  colour.colour=c;
  return colour;
} 