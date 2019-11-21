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
	rgbatxt=rgbatxt.replace(/rgba?/g,"").replace(/[\(\)\s]+/g,"");
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
	var n=LightnessNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=Math.min(Math.max(c[2]*n,0),1);
  colour.colour=c;
  return colour;
} 

function Darken(colour,n){
	var n=LightnessNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=(n===0?1:Math.min(Math.max(c[2]/n,0),1));
  colour.colour=c;
  return colour;
} 

function LightenTo(colour,n){
	var n=LightnessNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function DarkenTo(colour,n){
	var n=LightnessNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[2]=1-Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function Saturate(colour,n){
	var n=SaturationNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=Math.min(Math.max(c[1]*n,0),1);
  colour.colour=c;
  return colour;
} 

function Desaturate(colour,n){
	var n=SaturationNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=(n===0?1:Math.min(Math.max(c[1]/n,0),1));
  colour.colour=c;
  return colour;
} 

function SaturateTo(colour,n){
	var n=SaturationNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[1]=Math.min(Math.max(n,0),1);
  colour.colour=c;
  return colour;
} 

function Huen(colour,n){
  var n=HueNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=(c[0]+n)%360;
  colour.colour=c;
  return colour;
} 

function Dehuen(colour,n){
  var n=HueNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=(c[0]-n)%360;
  colour.colour=c;
  return colour;
} 

function HueTo(colour,n){	
  var n=HueNumber(n);
  var colour=HSL(colour);
  var c=colour.colour;
  c[0]=n%360;
  colour.colour=c;
  return colour;
} 

//Accept pure numbers or extract parameter from another colour
function HueNumber(n){
	if(typeof n!=="number")
		return HSL(n).colour[0];
	else
		return n;
}

function SaturationNumber(n){
	if(typeof n!=="number")
		return HSL(n).colour[1];
	else
		return n;
}

function LightnessNumber(n){
	if(typeof n!=="number")
		return HSL(n).colour[2];
	else
		return n;
}



///////////////////////////////////////////////////////////////////////////////
//Names Colours

var ColourNames=[
[0,71,186,'Absolute Zero'],
[176,191,26,'Acid green'],
[125,186,232,'Aero'],
[201,255,230,'Aero blue'],
[179,133,191,'African violet'],
[115,161,194,'Air superiority blue'],
[237,235,224,'Alabaster'],
[240,247,255,'Alice blue'],
[196,97,15,'Alloy orange'],
[240,222,204,'Almond'],
[230,43,79,'Amaranth'],
[158,43,105,'Amaranth'],
[242,156,186,'Amaranth pink'],
[171,38,79,'Amaranth purple'],
[212,33,46,'Amaranth red'],
[59,122,87,'Amazon'],
[255,191,0,'Amber'],
[255,125,0,'Amber'],
[153,102,204,'Amethyst'],
[163,199,56,'Android green'],
[204,148,117,'Antique brass'],
[102,92,31,'Antique bronze'],
[145,92,130,'Antique fuchsia'],
[133,28,46,'Antique ruby'],
[250,235,214,'Antique white'],
[0,128,0,'Ao'],
[140,181,0,'Apple green'],
[250,207,176,'Apricot'],
[0,255,255,'Aqua'],
[128,255,212,'Aquamarine'],
[209,255,20,'Arctic lime'],
[74,84,33,'Army green'],
[143,150,120,'Artichoke'],
[232,214,107,'Arylide yellow'],
[179,191,181,'Ash gray'],
[135,168,107,'Asparagus'],
[255,153,102,'Atomic tangerine'],
[166,41,41,'Auburn'],
[252,237,0,'Aureolin'],
[87,130,3,'Avocado'],
[0,128,255,'Azure'],
[240,255,255,'Azure'],
[138,207,240,'Baby blue'],
[161,201,242,'Baby blue eyes'],
[245,194,194,'Baby pink'],
[255,255,250,'Baby powder'],
[255,145,176,'Baker-Miller pink'],
[250,232,181,'Banana Mania'],
[217,23,133,'Barbie Pink'],
[125,10,3,'Barn red'],
[133,133,130,'Battleship grey'],
[189,212,230,'Beau blue'],
[158,130,112,'Beaver'],
[245,245,219,'Beige'],
[46,89,148,'Bdazzled blue'],
[156,38,66,'Big dip o’ruby'],
[255,227,196,'Bisque'],
[61,43,31,'Bistre'],
[150,112,23,'Bistre brown'],
[201,224,13,'Bitter lemon'],
[191,255,0,'Bitter lime'],
[255,112,94,'Bittersweet'],
[191,79,82,'Bittersweet shimmer'],
[0,0,0,'Black'],
[61,13,3,'Black bean'],
[28,23,18,'Black chocolate'],
[59,46,46,'Black coffee'],
[84,97,112,'Black coral'],
[59,61,54,'Black olive'],
[191,176,179,'Black Shadows'],
[255,235,204,'Blanched almond'],
[166,112,99,'Blast-off bronze'],
[48,140,232,'Bleu de France'],
[171,230,237,'Blizzard blue'],
[250,240,191,'Blond'],
[102,0,0,'Blood red'],
[0,0,255,'Blue'],
[31,117,255,'Blue'],
[0,148,176,'Blue'],
[0,135,189,'Blue'],
[0,23,168,'Blue'],
[51,51,153,'Blue'],
[3,71,255,'Blue'],
[163,163,209,'Blue bell'],
[102,153,204,'Blue-gray'],
[13,153,186,'Blue-green'],
[5,79,64,'Blue-green'],
[92,173,237,'Blue jeans'],
[18,97,128,'Blue sapphire'],
[138,43,227,'Blue-violet'],
[115,102,189,'Blue-violet'],
[77,26,128,'Blue-violet'],
[79,115,166,'Blue yonder'],
[61,105,232,'Bluetiful'],
[222,92,130,'Blush'],
[120,69,59,'Bole'],
[227,217,201,'Bone'],
[0,107,79,'Bottle green'],
[135,64,64,'Brandy'],
[204,64,84,'Brick red'],
[102,255,0,'Bright green'],
[217,145,240,'Bright lilac'],
[194,33,71,'Bright maroon'],
[26,115,209,'Bright navy blue'],
[255,171,28,'Bright yellow'],
[255,84,163,'Brilliant rose'],
[250,97,128,'Brink pink'],
[0,66,38,'British racing green'],
[204,128,51,'Bronze'],
[135,84,10,'Brown'],
[176,110,77,'Brown sugar'],
[28,77,61,'Brunswick green'],
[122,181,97,'Bud green'],
[240,219,130,'Buff'],
[128,0,33,'Burgundy'],
[222,184,135,'Burlywood'],
[161,122,115,'Burnished brown'],
[204,84,0,'Burnt orange'],
[232,115,82,'Burnt sienna'],
[138,51,36,'Burnt umber'],
[189,51,163,'Byzantine'],
[112,41,99,'Byzantium'],
[84,105,115,'Cadet'],
[94,158,161,'Cadet blue'],
[168,179,194,'Cadet blue'],
[145,163,176,'Cadet grey'],
[0,107,61,'Cadmium green'],
[237,135,46,'Cadmium orange'],
[227,0,33,'Cadmium red'],
[255,245,0,'Cadmium yellow'],
[166,122,92,'Café au lait'],
[74,54,33,'Café noir'],
[163,194,173,'Cambridge blue'],
[194,153,107,'Camel'],
[240,186,204,'Cameo pink'],
[255,255,153,'Canary'],
[255,240,0,'Canary yellow'],
[255,8,0,'Candy apple red'],
[227,112,122,'Candy pink'],
[0,191,255,'Capri'],
[89,38,33,'Caput mortuum'],
[196,31,59,'Cardinal'],
[0,204,153,'Caribbean green'],
[150,0,23,'Carmine'],
[214,0,64,'Carmine'],
[255,166,201,'Carnation pink'],
[179,28,28,'Carnelian'],
[87,161,212,'Carolina blue'],
[237,145,33,'Carrot orange'],
[0,87,64,'Castleton green'],
[112,54,66,'Catawba'],
[201,89,74,'Cedar Chest'],
[171,224,176,'Celadon'],
[0,122,166,'Celadon blue'],
[46,133,125,'Celadon green'],
[179,255,255,'Celeste'],
[36,107,207,'Celtic blue'],
[222,48,99,'Cerise'],
[0,122,166,'Cerulean'],
[41,82,191,'Cerulean blue'],
[110,156,194,'Cerulean frost'],
[28,171,214,'Cerulean'],
[0,122,166,'CG blue'],
[224,61,48,'CG red'],
[247,232,207,'Champagne'],
[242,222,207,'Champagne pink'],
[54,69,79,'Charcoal'],
[36,43,43,'Charleston green'],
[230,143,171,'Charm pink'],
[222,255,0,'Chartreuse'],
[128,255,0,'Chartreuse'],
[255,184,196,'Cherry blossom pink'],
[148,69,54,'Chestnut'],
[222,112,161,'China pink'],
[168,82,110,'China rose'],
[171,56,31,'Chinese red'],
[133,97,135,'Chinese violet'],
[255,179,0,'Chinese yellow'],
[122,64,0,'Chocolate'],
[209,105,31,'Chocolate'],
[255,166,0,'Chrome yellow'],
[153,130,122,'Cinereous'],
[227,66,51,'Cinnabar'],
[204,97,125,'Cinnamon Satin'],
[227,209,10,'Citrine'],
[158,168,31,'Citron'],
[128,23,51,'Claret'],
[0,71,171,'Cobalt blue'],
[209,105,31,'Cocoa brown'],
[112,79,56,'Coffee'],
[186,217,235,'Columbia Blue'],
[247,130,120,'Congo pink'],
[140,145,171,'Cool grey'],
[184,115,51,'Copper'],
[217,138,102,'Copper'],
[173,112,105,'Copper penny'],
[204,110,82,'Copper red'],
[153,102,102,'Copper rose'],
[255,56,0,'Coquelicot'],
[255,128,79,'Coral'],
[247,130,120,'Coral pink'],
[138,64,69,'Cordovan'],
[250,237,92,'Corn'],
[99,148,237,'Cornflower blue'],
[255,247,219,'Cornsilk'],
[46,46,135,'Cosmic cobalt'],
[255,247,232,'Cosmic latte'],
[130,97,61,'Coyote brown'],
[255,189,217,'Cotton candy'],
[255,252,209,'Cream'],
[219,20,61,'Crimson'],
[158,28,51,'Crimson'],
[245,245,245,'Cultured'],
[0,255,255,'Cyan'],
[0,184,235,'Cyan'],
[89,66,125,'Cyber grape'],
[255,212,0,'Cyber yellow'],
[245,112,161,'Cyclamen'],
[102,102,153,'Dark blue-gray'],
[102,66,33,'Dark brown'],
[92,56,84,'Dark byzantium'],
[38,66,140,'Dark cornflower blue'],
[0,140,140,'Dark cyan'],
[84,105,120,'Dark electric blue'],
[184,135,10,'Dark goldenrod'],
[0,51,33,'Dark green'],
[0,99,0,'Dark green'],
[26,36,33,'Dark jungle green'],
[189,184,107,'Dark khaki'],
[71,61,51,'Dark lava'],
[84,74,79,'Dark liver'],
[84,61,56,'Dark liver'],
[140,0,140,'Dark magenta'],
[74,92,36,'Dark moss green'],
[84,107,46,'Dark olive green'],
[255,140,0,'Dark orange'],
[153,51,204,'Dark orchid'],
[3,191,61,'Dark pastel green'],
[48,26,51,'Dark purple'],
[140,0,0,'Dark red'],
[232,150,122,'Dark salmon'],
[143,189,143,'Dark sea green'],
[61,20,20,'Dark sienna'],
[140,191,214,'Dark sky blue'],
[71,61,140,'Dark slate blue'],
[46,79,79,'Dark slate gray'],
[23,115,69,'Dark spring green'],
[0,207,209,'Dark turquoise'],
[148,0,212,'Dark violet'],
[0,112,61,'Dartmouth green'],
[84,84,84,'Davy grey'],
[217,51,135,'Deep cerise'],
[250,214,166,'Deep champagne'],
[186,79,71,'Deep chestnut'],
[0,74,74,'Deep jungle green'],
[255,20,148,'Deep pink'],
[255,153,51,'Deep saffron'],
[0,191,255,'Deep sky blue'],
[74,99,107,'Deep Space Sparkle'],
[125,94,97,'Deep taupe'],
[20,97,189,'Denim'],
[33,66,181,'Denim blue'],
[194,153,107,'Desert'],
[237,201,176,'Desert sand'],
[105,105,105,'Dim gray'],
[31,143,255,'Dodger blue'],
[214,23,105,'Dogwood rose'],
[150,112,23,'Drab'],
[0,0,156,'Duke blue'],
[240,222,186,'Dutch white'],
[224,168,94,'Earth yellow'],
[84,92,79,'Ebony'],
[194,179,128,'Ecru'],
[28,28,28,'Eerie black'],
[97,64,82,'Eggplant'],
[240,235,214,'Eggshell'],
[15,51,166,'Egyptian blue'],
[125,250,255,'Electric blue'],
[0,255,0,'Electric green'],
[112,0,255,'Electric indigo'],
[204,255,0,'Electric lime'],
[191,0,255,'Electric purple'],
[143,0,255,'Electric violet'],
[79,199,120,'Emerald'],
[107,48,130,'Eminence'],
[28,77,61,'English green'],
[181,130,148,'English lavender'],
[171,74,82,'English red'],
[204,71,74,'English vermillion'],
[87,61,92,'English violet'],
[0,255,64,'Erin'],
[150,199,163,'Eton blue'],
[194,153,107,'Fallow'],
[128,23,23,'Falu red'],
[181,51,138,'Fandango'],
[222,82,133,'Fandango pink'],
[245,0,161,'Fashion fuchsia'],
[230,171,112,'Fawn'],
[77,92,84,'Feldgrau'],
[79,120,66,'Fern green'],
[107,84,31,'Field drab'],
[255,84,112,'Fiery rose'],
[179,33,33,'Firebrick'],
[207,33,41,'Fire engine red'],
[232,92,74,'Fire opal'],
[227,89,33,'Flame'],
[237,219,130,'Flax'],
[33,107,214,'Flickr Blue'],
[250,0,130,'Flickr Pink'],
[163,0,110,'Flirt'],
[255,250,240,'Floral white'],
[20,245,237,'Fluorescent blue'],
[94,166,120,'Forest green'],
[0,69,33,'Forest green'],
[33,140,33,'Forest green'],
[166,122,92,'French beige'],
[133,110,77,'French bistre'],
[0,115,186,'French blue'],
[252,64,145,'French fuchsia'],
[135,97,143,'French lilac'],
[158,252,56,'French lime'],
[212,115,212,'French mauve'],
[252,107,158,'French pink'],
[199,43,71,'French raspberry'],
[245,74,138,'French rose'],
[120,181,255,'French sky blue'],
[135,5,207,'French violet'],
[232,54,166,'Frostbite'],
[255,0,255,'Fuchsia'],
[194,84,194,'Fuchsia'],
[204,56,122,'Fuchsia purple'],
[199,66,117,'Fuchsia rose'],
[227,133,0,'Fulvous'],
[135,66,31,'Fuzzy Wuzzy'],
[219,219,219,'Gainsboro'],
[227,156,15,'Gamboge'],
[0,128,102,'Generic viridian'],
[247,247,255,'Ghost white'],
[97,130,181,'Glaucous'],
[171,145,179,'Glossy grape'],
[0,171,102,'GO green'],
[166,125,0,'Gold'],
[212,176,56,'Gold'],
[255,214,0,'Gold'],
[230,191,138,'Gold'],
[133,117,79,'Gold Fusion'],
[153,102,20,'Golden brown'],
[252,194,0,'Golden poppy'],
[255,222,0,'Golden yellow'],
[217,166,33,'Goldenrod'],
[102,102,102,'Granite gray'],
[168,227,161,'Granny Smith apple'],
[128,128,128,'Gray'],
[191,191,191,'Gray'],
[0,255,0,'Green'],
[28,171,120,'Green'],
[0,128,0,'Green'],
[0,168,120,'Green'],
[0,158,107,'Green'],
[0,173,66,'Green'],
[0,166,79,'Green'],
[102,176,51,'Green'],
[18,99,181,'Green-blue'],
[41,135,199,'Green-blue'],
[0,153,102,'Green-cyan'],
[166,245,51,'Green Lizard'],
[110,173,161,'Green Sheen'],
[173,255,46,'Green-yellow'],
[240,232,145,'Green-yellow'],
[168,153,135,'Grullo'],
[41,51,56,'Gunmetal'],
[69,107,207,'Han blue'],
[82,23,250,'Han purple'],
[232,214,107,'Hansa yellow'],
[64,255,0,'Harlequin'],
[217,145,0,'Harvest gold'],
[255,122,0,'Heat Wave'],
[222,115,255,'Heliotrope'],
[171,153,168,'Heliotrope gray'],
[245,0,161,'Hollywood cerise'],
[240,255,240,'Honeydew'],
[0,110,176,'Honolulu blue'],
[74,120,107,'Hooker green'],
[255,28,207,'Hot magenta'],
[255,105,181,'Hot pink'],
[54,94,59,'Hunter green'],
[112,166,209,'Iceberg'],
[252,247,94,'Icterine'],
[48,145,120,'Illuminating emerald'],
[237,41,56,'Imperial red'],
[179,237,92,'Inchworm'],
[77,82,110,'Independence'],
[18,135,8,'India green'],
[204,92,92,'Indian red'],
[227,168,87,'Indian yellow'],
[74,0,130,'Indigo'],
[0,64,107,'Indigo dye'],
[0,46,166,'International Klein Blue'],
[255,79,0,'International orange'],
[186,23,13,'International orange'],
[191,54,43,'International orange'],
[89,79,207,'Iris'],
[179,69,107,'Irresistible'],
[245,240,237,'Isabelline'],
[179,255,255,'Italian sky blue'],
[255,255,240,'Ivory'],
[0,168,107,'Jade'],
[247,222,125,'Jasmine'],
[166,10,94,'Jazzberry jam'],
[51,51,51,'Jet'],
[245,201,23,'Jonquil'],
[189,217,87,'June bud'],
[41,171,135,'Jungle green'],
[77,186,23,'Kelly green'],
[59,176,158,'Keppel'],
[232,245,140,'Key lime'],
[194,176,145,'Khaki'],
[240,230,140,'Light khaki'],
[135,46,23,'Kobe'],
[232,158,196,'Kobi'],
[107,69,36,'Kobicha'],
[54,66,48,'Kombu green'],
[79,38,130,'KSU purple'],
[214,201,222,'Languid lavender'],
[38,97,156,'Lapis lazuli'],
[255,255,102,'Laser lemon'],
[168,186,158,'Laurel green'],
[207,15,33,'Lava'],
[181,125,219,'Lavender'],
[230,230,250,'Lavender'],
[204,204,255,'Lavender blue'],
[255,240,245,'Lavender blush'],
[196,194,209,'Lavender gray'],
[125,252,0,'Lawn green'],
[255,247,0,'Lemon'],
[255,250,204,'Lemon chiffon'],
[204,161,28,'Lemon curry'],
[252,255,0,'Lemon glacier'],
[245,235,191,'Lemon meringue'],
[255,245,79,'Lemon yellow'],
[255,255,158,'Lemon yellow'],
[84,89,166,'Liberty'],
[173,217,230,'Light blue'],
[240,128,128,'Light coral'],
[148,204,235,'Light cornflower blue'],
[224,255,255,'Light cyan'],
[199,173,128,'Light French beige'],
[250,250,209,'Light goldenrod yellow'],
[212,212,212,'Light gray'],
[143,237,143,'Light green'],
[255,217,176,'Light orange'],
[196,204,224,'Light periwinkle'],
[255,181,194,'Light pink'],
[255,161,122,'Light salmon'],
[33,179,171,'Light sea green'],
[135,207,250,'Light sky blue'],
[120,135,153,'Light slate gray'],
[176,196,222,'Light steel blue'],
[255,255,224,'Light yellow'],
[199,163,199,'Lilac'],
[173,153,171,'Lilac Luster'],
[191,255,0,'Lime'],
[0,255,0,'Lime'],
[51,204,51,'Lime green'],
[26,89,5,'Lincoln green'],
[250,240,230,'Linen'],
[194,153,107,'Lion'],
[222,112,161,'Liseran purple'],
[107,161,219,'Little boy blue'],
[102,77,71,'Liver'],
[184,110,41,'Liver'],
[107,46,31,'Liver'],
[153,115,87,'Liver chestnut'],
[102,153,204,'Livid'],
[255,189,135,'Macaroni and Cheese'],
[204,51,54,'Madder Lake'],
[255,0,255,'Magenta'],
[245,84,166,'Magenta'],
[201,31,122,'Magenta'],
[209,64,125,'Magenta'],
[255,0,143,'Magenta'],
[158,69,117,'Magenta haze'],
[171,240,209,'Magic mint'],
[247,245,255,'Magnolia'],
[191,64,0,'Mahogany'],
[250,237,92,'Maize'],
[242,199,74,'Maize'],
[97,79,219,'Majorelle blue'],
[10,217,82,'Malachite'],
[150,153,171,'Manatee'],
[242,122,71,'Mandarin'],
[252,191,3,'Mango'],
[255,130,66,'Mango Tango'],
[115,194,102,'Mantis'],
[135,0,133,'Mardi Gras'],
[235,163,33,'Marigold'],
[194,33,71,'Maroon'],
[128,0,0,'Maroon'],
[176,48,97,'Maroon'],
[224,176,255,'Mauve'],
[145,94,110,'Mauve taupe'],
[240,153,171,'Mauvelous'],
[71,171,204,'Maximum blue'],
[48,191,191,'Maximum blue green'],
[171,171,230,'Maximum blue purple'],
[94,140,48,'Maximum green'],
[217,230,79,'Maximum green yellow'],
[115,51,128,'Maximum purple'],
[217,33,33,'Maximum red'],
[166,59,120,'Maximum red purple'],
[250,250,56,'Maximum yellow'],
[242,186,74,'Maximum yellow red'],
[77,145,64,'May green'],
[115,194,250,'Maya blue'],
[102,222,171,'Medium aquamarine'],
[0,0,204,'Medium blue'],
[227,5,43,'Medium candy apple red'],
[176,64,54,'Medium carmine'],
[242,230,171,'Medium champagne'],
[186,84,212,'Medium orchid'],
[148,112,219,'Medium purple'],
[61,179,112,'Medium sea green'],
[122,105,237,'Medium slate blue'],
[0,250,153,'Medium spring green'],
[71,209,204,'Medium turquoise'],
[199,20,133,'Medium violet-red'],
[247,184,120,'Mellow apricot'],
[247,222,125,'Mellow yellow'],
[255,186,173,'Melon'],
[212,176,56,'Metallic gold'],
[10,125,140,'Metallic Seaweed'],
[156,125,56,'Metallic Sunburst'],
[227,0,125,'Mexican pink'],
[125,212,230,'Middle blue'],
[140,217,204,'Middle blue green'],
[140,115,191,'Middle blue purple'],
[140,135,128,'Middle grey'],
[77,140,87,'Middle green'],
[171,191,97,'Middle green yellow'],
[217,130,181,'Middle purple'],
[230,143,115,'Middle red'],
[166,84,84,'Middle red purple'],
[255,235,0,'Middle yellow'],
[237,176,117,'Middle yellow red'],
[112,38,112,'Midnight'],
[26,26,112,'Midnight blue'],
[0,74,84,'Midnight green'],
[255,196,13,'Mikado yellow'],
[255,217,232,'Mimi pink'],
[227,250,135,'Mindaro'],
[54,115,125,'Ming'],
[245,219,79,'Minion yellow'],
[61,181,138,'Mint'],
[245,255,250,'Mint cream'],
[153,255,153,'Mint green'],
[186,181,120,'Misty moss'],
[255,227,224,'Misty rose'],
[150,112,23,'Mode beige'],
[140,163,153,'Morning blue'],
[138,153,92,'Moss green'],
[48,186,143,'Mountain Meadow'],
[153,122,140,'Mountbatten pink'],
[23,69,59,'MSU green'],
[196,74,140,'Mulberry'],
[199,79,156,'Mulberry'],
[255,219,89,'Mustard'],
[48,120,115,'Myrtle green'],
[214,82,130,'Mystic'],
[173,66,120,'Mystic maroon'],
[245,173,199,'Nadeshiko pink'],
[250,217,94,'Naples yellow'],
[255,222,173,'Navajo white'],
[0,0,128,'Navy blue'],
[26,115,209,'Navy blue'],
[69,102,255,'Neon blue'],
[56,255,20,'Neon green'],
[214,130,128,'New York pink'],
[115,115,115,'Nickel'],
[163,222,237,'Non-photo blue'],
[232,255,219,'Nyanza'],
[79,66,181,'Ocean Blue'],
[71,191,145,'Ocean green'],
[204,120,33,'Ochre'],
[66,48,46,'Old burgundy'],
[207,181,59,'Old gold'],
[252,245,230,'Old lace'],
[120,105,120,'Old lavender'],
[102,48,71,'Old mauve'],
[191,128,130,'Old rose'],
[133,133,130,'Old silver'],
[128,128,0,'Olive'],
[107,143,36,'Olive Drab'],
[61,51,31,'Olive Drab'],
[181,179,92,'Olive green'],
[153,186,115,'Olivine'],
[54,56,56,'Onyx'],
[168,194,189,'Opal'],
[184,133,166,'Opera mauve'],
[255,128,0,'Orange'],
[255,117,56,'Orange'],
[255,89,0,'Orange'],
[255,166,0,'Orange'],
[255,158,0,'Orange peel'],
[255,105,31,'Orange-red'],
[255,84,74,'Orange-red'],
[250,92,61,'Orange soda'],
[245,189,31,'Orange-yellow'],
[247,214,105,'Orange-yellow'],
[217,112,214,'Orchid'],
[242,189,204,'Orchid pink'],
[227,156,209,'Orchid'],
[46,56,59,'Outer space'],
[255,110,74,'Outrageous Orange'],
[128,0,33,'Oxblood'],
[0,33,71,'Oxford blue'],
[133,23,23,'OU Crimson red'],
[28,168,201,'Pacific blue'],
[0,102,0,'Pakistan green'],
[105,41,97,'Palatinate purple'],
[189,212,230,'Pale aqua'],
[156,196,227,'Pale cerulean'],
[250,217,222,'Pale pink'],
[250,230,250,'Pale purple'],
[201,191,186,'Pale silver'],
[237,235,189,'Pale spring bud'],
[120,23,74,'Pansy purple'],
[0,156,125,'Paolo Veronese green'],
[255,240,214,'Papaya whip'],
[230,61,97,'Paradise pink'],
[79,199,120,'Paris Green'],
[222,166,163,'Pastel pink'],
[128,0,128,'Patriarch'],
[84,105,120,'Payne grey'],
[255,230,181,'Peach'],
[255,204,163,'Peach'],
[255,217,186,'Peach puff'],
[209,227,48,'Pear'],
[184,105,163,'Pearly purple'],
[204,204,255,'Periwinkle'],
[194,204,230,'Periwinkle'],
[224,43,43,'Permanent Geranium Lake'],
[28,56,186,'Persian blue'],
[0,166,148,'Persian green'],
[51,18,122,'Persian indigo'],
[217,143,89,'Persian orange'],
[247,128,191,'Persian pink'],
[112,28,28,'Persian plum'],
[204,51,51,'Persian red'],
[255,41,163,'Persian rose'],
[237,89,0,'Persimmon'],
[140,168,184,'Pewter Blue'],
[222,0,255,'Phlox'],
[0,15,138,'Phthalo blue'],
[18,54,36,'Phthalo green'],
[46,38,135,'Picotee blue'],
[194,10,79,'Pictorial carmine'],
[252,222,230,'Piggy pink'],
[0,120,112,'Pine green'],
[41,46,36,'Pine tree'],
[255,191,204,'Pink'],
[214,71,148,'Pink'],
[252,115,252,'Pink flamingo'],
[255,222,245,'Pink lace'],
[217,179,209,'Pink lavender'],
[247,143,166,'Pink Sherbet'],
[148,196,115,'Pistachio'],
[230,227,227,'Platinum'],
[143,69,133,'Plum'],
[222,161,222,'Plum'],
[89,69,179,'Plump Purple'],
[92,163,148,'Polished Pine'],
[135,97,143,'Pomp and Power'],
[191,79,97,'Popstar'],
[255,89,54,'Portland Orange'],
[176,224,230,'Powder blue'],
[245,128,38,'Princeton orange'],
[112,28,28,'Prune'],
[0,48,84,'Prussian blue'],
[222,0,255,'Psychedelic purple'],
[204,135,153,'Puce'],
[99,64,23,'Pullman Brown'],
[255,117,23,'Pumpkin'],
[97,0,128,'Purple'],
[128,0,128,'Purple'],
[158,0,196,'Purple'],
[161,33,240,'Purple'],
[150,120,181,'Purple mountain majesty'],
[79,82,128,'Purple navy'],
[255,79,217,'Purple pizzazz'],
[156,82,181,'Purple Plum'],
[153,79,173,'Purpureus'],
[66,107,148,'Queen blue'],
[232,204,214,'Queen pink'],
[166,166,166,'Quick Silver'],
[143,59,89,'Quinacridone magenta'],
[255,54,94,'Radical Red'],
[36,33,36,'Raisin black'],
[250,171,97,'Rajah'],
[227,10,92,'Raspberry'],
[145,94,110,'Raspberry glace'],
[179,69,107,'Raspberry rose'],
[214,138,89,'Raw Sienna'],
[130,102,69,'Raw umber'],
[255,51,204,'Razzle dazzle rose'],
[227,38,107,'Razzmatazz'],
[140,79,133,'Razzmic Berry'],
[102,51,153,'Rebecca Purple'],
[255,0,0,'Red'],
[237,33,77,'Red'],
[242,0,61,'Red'],
[196,3,51,'Red'],
[237,41,56,'Red'],
[237,28,36,'Red'],
[255,38,18,'Red'],
[255,84,74,'Red-orange'],
[255,105,31,'Red-orange'],
[255,69,0,'Red-orange'],
[227,0,120,'Red-purple'],
[252,59,74,'Red Salsa'],
[199,20,133,'Red-violet'],
[191,69,143,'Red-violet'],
[145,43,61,'Red-violet'],
[163,89,82,'Redwood'],
[0,36,135,'Resolution blue'],
[120,117,150,'Rhythm'],
[0,64,64,'Rich black'],
[0,10,18,'Rich black'],
[0,3,3,'Rich black'],
[69,77,56,'Rifle green'],
[0,204,204,'Robin egg blue'],
[138,128,128,'Rocket metallic'],
[130,138,150,'Roman silver'],
[255,0,128,'Rose'],
[250,66,158,'Rose bonbon'],
[158,94,112,'Rose Dust'],
[102,71,69,'Rose ebony'],
[227,38,54,'Rose madder'],
[255,102,204,'Rose pink'],
[171,153,168,'Rose quartz'],
[194,31,87,'Rose red'],
[143,92,92,'Rose taupe'],
[171,79,82,'Rose vale'],
[102,0,10,'Rosewood'],
[212,0,0,'Rosso corsa'],
[189,143,143,'Rosy brown'],
[0,36,102,'Dark royal blue'],
[64,105,224,'Light royal blue'],
[120,82,168,'Royal purple'],
[250,217,94,'Royal yellow'],
[207,69,117,'Ruber'],
[209,0,87,'Rubine red'],
[224,18,94,'Ruby'],
[156,18,31,'Ruby red'],
[168,28,8,'Rufous'],
[128,69,28,'Russet'],
[102,145,102,'Russian green'],
[51,23,77,'Russian violet'],
[184,64,13,'Rust'],
[217,43,66,'Rusty red'],
[5,56,38,'Sacramento State green'],
[140,69,18,'Saddle brown'],
[255,120,0,'Safety orange'],
[255,102,0,'Blaze orange'],
[237,209,3,'Safety yellow'],
[245,196,48,'Saffron'],
[189,184,138,'Sage'],
[36,41,122,'St. Patrick blue'],
[250,128,115,'Salmon'],
[255,145,163,'Salmon pink'],
[194,179,128,'Sand'],
[150,112,23,'Sand dune'],
[245,163,97,'Sandy brown'],
[79,125,41,'Sap green'],
[15,82,186,'Sapphire'],
[0,102,166,'Sapphire blue'],
[46,92,161,'Sapphire'],
[204,161,54,'Satin sheen gold'],
[255,36,0,'Scarlet'],
[255,145,176,'Schauss pink'],
[255,217,0,'School bus yellow'],
[102,255,102,'Screamin Green'],
[46,140,87,'Sea green'],
[0,255,204,'Sea green'],
[51,20,20,'Seal brown'],
[255,245,237,'Seashell'],
[255,186,0,'Selective yellow'],
[112,66,20,'Sepia'],
[138,120,92,'Shadow'],
[120,140,166,'Shadow blue'],
[0,158,97,'Shamrock green'],
[143,212,0,'Sheen green'],
[217,135,148,'Shimmering Blush'],
[94,166,120,'Shiny Shamrock'],
[252,15,191,'Shocking pink'],
[255,112,255,'Shocking pink'],
[135,46,23,'Sienna'],
[191,191,191,'Silver'],
[201,191,186,'Silver'],
[171,168,173,'Silver'],
[171,171,171,'Silver chalice'],
[196,173,173,'Silver pink'],
[191,194,194,'Silver sand'],
[204,64,10,'Sinopia'],
[255,56,84,'Sizzling Red'],
[255,219,0,'Sizzling Sunrise'],
[0,115,115,'Skobeloff'],
[135,207,235,'Sky blue'],
[117,214,235,'Sky blue'],
[207,112,176,'Sky magenta'],
[107,89,204,'Slate blue'],
[112,128,143,'Slate gray'],
[41,150,23,'Slimy green'],
[199,64,135,'Smitten'],
[15,13,8,'Smoky black'],
[255,250,250,'Snow'],
[138,56,66,'Solid pink'],
[117,117,117,'Sonic silver'],
[28,41,82,'Space cadet'],
[128,117,51,'Spanish bistre'],
[0,112,184,'Spanish blue'],
[209,0,71,'Spanish carmine'],
[153,153,153,'Spanish gray'],
[0,145,79,'Spanish green'],
[232,97,0,'Spanish orange'],
[247,191,191,'Spanish pink'],
[230,0,38,'Spanish red'],
[0,255,255,'Spanish sky blue'],
[77,41,130,'Spanish violet'],
[0,128,92,'Spanish viridian'],
[166,252,0,'Spring bud'],
[135,255,41,'Spring Frost'],
[0,255,128,'Spring green'],
[237,235,189,'Spring green'],
[0,122,184,'Star command blue'],
[69,130,181,'Steel blue'],
[204,51,204,'Steel pink'],
[94,138,140,'Steel Teal'],
[250,217,94,'Stil de grain yellow'],
[227,217,112,'Straw'],
[145,79,117,'Sugar Plum'],
[255,204,51,'Sunglow'],
[227,171,87,'Sunray'],
[250,214,166,'Sunset'],
[207,107,168,'Super pink'],
[168,56,48,'Sweet Brown'],
[209,181,140,'Tan'],
[217,153,107,'Tan'],
[242,133,0,'Tangerine'],
[227,112,122,'Tango pink'],
[250,77,69,'Tart Orange'],
[71,61,51,'Taupe'],
[140,133,138,'Taupe gray'],
[209,240,191,'Tea green'],
[247,130,120,'Tea rose'],
[245,194,194,'Tea rose'],
[0,128,128,'Teal'],
[54,117,135,'Teal blue'],
[207,51,117,'Telemagenta'],
[204,87,0,'Tawny'],
[227,115,92,'Terra cotta'],
[217,191,217,'Thistle'],
[222,112,161,'Thulian pink'],
[252,138,171,'Tickle Me Pink'],
[10,186,181,'Tiffany Blue'],
[219,214,209,'Timberwolf'],
[237,230,0,'Titanium yellow'],
[255,99,71,'Tomato'],
[0,117,94,'Tropical rain forest'],
[0,115,207,'True Blue'],
[28,5,179,'Trypan Blue'],
[61,143,222,'Tufts blue'],
[222,171,135,'Tumbleweed'],
[64,224,209,'Turquoise'],
[0,255,240,'Turquoise blue'],
[161,214,181,'Turquoise green'],
[138,153,92,'Turtle green'],
[250,214,166,'Tuscan'],
[112,79,56,'Tuscan brown'],
[125,71,71,'Tuscan red'],
[166,122,92,'Tuscan tan'],
[191,153,153,'Tuscany'],
[138,74,107,'Twilight lavender'],
[102,3,61,'Tyrian purple'],
[0,51,171,'UA blue'],
[217,0,77,'UA red'],
[18,10,143,'Ultramarine'],
[64,102,245,'Ultramarine blue'],
[255,112,255,'Ultra pink'],
[252,107,133,'Ultra red'],
[99,82,71,'Umber'],
[255,222,201,'Unbleached silk'],
[92,145,230,'United Nations blue'],
[255,255,102,'Unmellow yellow'],
[0,69,33,'UP Forest green'],
[122,18,18,'UP maroon'],
[173,33,41,'Upsdell red'],
[176,219,245,'Uranian blue'],
[0,79,153,'USAFA blue'],
[102,66,41,'Van Dyke brown'],
[242,230,171,'Vanilla'],
[242,143,168,'Vanilla ice'],
[196,179,89,'Vegas gold'],
[199,8,20,'Venetian red'],
[66,179,173,'Verdigris'],
[227,66,51,'Vermilion'],
[217,56,31,'Vermilion'],
[161,33,240,'Veronica'],
[143,0,255,'Violet'],
[128,0,255,'Violet'],
[150,61,128,'Violet'],
[135,0,176,'Violet'],
[237,130,237,'Violet'],
[51,74,179,'Violet-blue'],
[117,110,199,'Violet-blue'],
[247,84,148,'Violet-red'],
[64,130,110,'Viridian'],
[0,150,153,'Viridian green'],
[158,28,54,'Vivid burgundy'],
[0,204,255,'Vivid sky blue'],
[255,161,138,'Vivid tangerine'],
[158,0,255,'Vivid violet'],
[204,255,0,'Volt'],
[0,66,66,'Warm black'],
[245,222,179,'Wheat'],
[255,255,255,'White'],
[163,173,209,'Wild blue yonder'],
[212,112,163,'Wild orchid'],
[255,66,163,'Wild Strawberry'],
[252,107,133,'Wild watermelon'],
[166,84,3,'Windsor tan'],
[115,46,56,'Wine'],
[102,48,71,'Wine dregs'],
[255,0,125,'Winter Sky'],
[87,135,125,'Wintergreen Dream'],
[201,161,219,'Wisteria'],
[194,153,107,'Wood brown'],
[237,237,10,'Xanthic'],
[115,135,120,'Xanadu'],
[13,3,15,'Xiketic'],
[15,77,145,'Yale Blue'],
[255,255,0,'Yellow'],
[252,232,130,'Yellow'],
[240,204,0,'Yellow'],
[255,212,0,'Yellow'],
[255,222,0,'Yellow'],
[255,240,0,'Yellow'],
[255,255,51,'Yellow'],
[153,204,51,'Yellow-green'],
[196,227,133,'Yellow-green'],
[48,179,26,'Yellow-green'],
[255,173,66,'Yellow Orange'],
[255,148,5,'Yellow Orange'],
[255,247,0,'Yellow Sunshine'],
[46,79,143,'YInMn Blue'],
[0,20,168,'Zaffre'],
[56,166,143,'Zomp']
]


function NamedColour(colorstring){
	var rgb=RGB(Colour(colorstring)).colour;
	var c=ColourNames.sort(function(a,b){ //Minimise Error
		A=(Math.pow(a[0]-rgb[0],2)+Math.pow(a[1]-rgb[1],2)+Math.pow(a[2]-rgb[2],2));
		B=(Math.pow(b[0]-rgb[0],2)+Math.pow(b[1]-rgb[1],2)+Math.pow(b[2]-rgb[2],2));
		
		if(A>B)
			return 1;
		if(A<B)
			return -1;
		else
			return 0;
	})
	return c[0][3];
}
