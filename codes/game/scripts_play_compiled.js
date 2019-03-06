var unitTesting=!1,curlevel=0,curlevelTarget=null,hasUsedCheckpoint=!1,curcheckpoint=0,levelEditorOpened=!1;
var levelindices;

function doSetupTitleScreenLevelContinue(){
	try{
		LoadSave()
		}
	catch(c){}}

function HasCheckpoint(){
	return void 0!==localStorage[document.URL+"_checkpoint"];
}
function HasLevel(){
	return HasSave()&&void 0!==localStorage[document.URL];
}
function HasSave(){
	return window.localStorage;
}

function SetCheckpointStack(newstack){
	maxcheckpoint=newstack.length;
	return localStorage[document.URL+"_checkpoint"]=JSON.stringify(newstack);
}
function GetCheckpointStack(){
	var stack= JSON.parse(localStorage[document.URL+"_checkpoint"]);
	maxcheckpoint=stack.length-1;
	return stack;
}
	
function SaveCheckpoint(levelTarget,isReloading){
	var newstack;
	if (HasCheckpoint()){
		var stack=GetCheckpointStack();
		if(typeof stack.dat==="undefined"){
			if(isReloading)
				stack.pop();
			newstack=EvacuateCheckpointStack(stack,curcheckpoint);
			newstack=stack.concat([levelTarget]);
		}
		else{
			if(isReloading)
				newstack=[levelTarget];
			else{
				newstack=[stack,levelTarget];
			}
		}
	}
	else
		newstack=[levelTarget];
	
	curcheckpoint=newstack.length-1;
	return SetCheckpointStack(newstack);
}
function SaveLevel(curlevel){
	return localStorage[document.URL]=curlevel;
};

function UnsaveCheckpoint(){
	return localStorage.removeItem(document.URL+"_checkpoint");
};
function UnsaveLevel(){
	return localStorage.removeItem(document.URL);
};
function UnsaveSave(){
	return HasSave()&&(UnsaveLevel(),UnsaveCheckpoint())
}

function LoadLevel(){
	return curlevel=localStorage[document.URL];
}
function LoadCheckpoint(n){
	var stack=GetCheckpointStack();
	if(typeof stack.dat=="undefined"){
			if(typeof n==="undefined")
				curcheckpoint=stack.length-1; //default to last checkpoint
			else{
				curcheckpoint=Math.min(Math.max(n,0),stack.length-1);
				stack=EvacuateCheckpointStack(stack,curcheckpoint);
		}
		curlevelTarget=stack[curcheckpoint];
	}
	else{
		curcheckpoint=0;
		curlevelTarget=stack;
	}
	var a=[],b;
	for(b in Object.keys(curlevelTarget.dat))
		a[b]=curlevelTarget.dat[b];
	return curlevelTarget.dat=new Int32Array(a)
}

function EvacuateCheckpointStack(stack,n){
	var s=stack;
	var i=s.length-1;
	while(n<i){
		i--;
		s.pop()
	}
	return s;
};

function LoadSave(){
	if(HasLevel()){
		if(HasCheckpoint())
			LoadCheckpoint();
		return LoadLevel();}
}


doSetupTitleScreenLevelContinue();

var verbose_logging=!1,throttle_movement=!1,cache_console_messages=!1,quittingTitleScreen=!1,quittingMessageScreen=!1,deltatime=17,timer=0,repeatinterval=150,autotick=0,autotickinterval=0,winning=!1,againing=!1,againinterval=150,norepeat_action=!1,oldflickscreendat=[],keybuffer=[],restarting=!1,messageselected=!1,textImages={},initLevel={width:5,height:5,layerCount:2,dat:[1,3,3,1,1,2,2,3,3,1,2,1,2,2,3,3,1,1,2,2,3,2,1,3,2,1,3,2,1,3,1,3,3,1,1,2,2,3,3,1,2,1,2,2,3,3,1,1,2,2],movementMask:[1,3,3,1,1,2,
2,3,3,1,2,1,2,2,3,3,1,1,2,2,3,2,1,3,2,1,3,2,1,3,1,3,3,1,1,2,2,3,3,1,2,1,2,2,3,3,1,1,2,2],rigidGroupIndexMask:[],rigidMovementAppliedMask:[],bannedGroup:[],colCellContents:[],rowCellContents:[]},level=initLevel;var canSetHTMLColors=!0,canDump=!1,canOpenEditor=!1,canYoutube=!0,IDE=!1;
function stripTags(a){var b=document.createElement("div");b.innerHTML=a;return b.textContent||b.innerText||""}
function consolePrint(a){}
function consoleCacheDump(a){}
function consoleError(a,b){var c=document.getElementById("errormessage");a=stripTags(a);c.innerHTML+=a+"<br>"}
function logErrorNoLine(a){var b=document.getElementById("errormessage");a=stripTags(a);b.innerHTML+=a+"<br>"}
function logBetaMessage(a){var b=document.getElementById("errormessage");a=stripTags(a);b.innerHTML+=a+"<br>"}
function clearInputHistory(){}
function pushInput(a){};
var font={a:[[0,0,0,0,0],[0,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[0,1,1,1,0]],b:[[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,1,0],[0,1,1,0,0]],c:[[0,0,0,0,0],[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[0,1,1,1,0]],d:[[0,0,0,1,0],[0,0,0,1,0],[0,1,1,1,0],[1,0,0,1,0],[0,1,1,0,0]],e:[[0,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,0,0],[0,1,1,0,0]],f:[[0,0,0,0,0],[0,0,1,1,0],[0,1,0,0,0],[1,1,1,0,0],[0,1,0,0,0]],g:[[0,1,1,0,0],[1,0,0,1,0],[0,1,1,1,0],[0,0,0,1,0],[0,1,1,0,0]],h:[[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[1,0,
0,1,0],[1,0,0,1,0]],i:[[0,0,1,0,0],[0,0,0,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],j:[[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0],[1,0,1,0,0],[0,1,0,0,0]],k:[[1,0,0,0,0],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0]],l:[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,1,0],[0,1,1,0,0]],m:[[0,0,0,0,0],[0,1,0,1,0],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1]],n:[[0,0,0,0,0],[0,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,0,1,0]],o:[[0,0,0,0,0],[0,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0],[0,1,1,0,0]],p:[[0,0,0,0,0],[0,1,1,0,0],[1,0,0,
1,0],[1,1,1,0,0],[1,0,0,0,0]],q:[[0,0,0,0,0],[0,1,1,0,0],[1,0,0,1,0],[0,1,1,1,0],[0,0,0,1,0]],r:[[0,0,0,0,0],[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],s:[[0,1,1,1,0],[1,0,0,0,0],[0,1,1,0,0],[0,0,0,1,0],[1,1,1,0,0]],t:[[0,1,0,0,0],[1,1,1,0,0],[0,1,0,0,0],[0,1,0,0,1],[0,0,1,1,0]],u:[[0,0,0,0,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,0,0]],v:[[0,0,0,0,0],[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],[1,0,0,0,0]],w:[[0,0,0,0,0],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[0,1,0,1,0]],x:[[0,0,0,0,0],[1,0,0,1,
0],[0,1,1,0,0],[0,1,1,0,0],[1,0,0,1,0]],y:[[1,0,0,1,0],[1,0,0,1,0],[0,1,1,1,0],[0,0,0,1,0],[1,1,1,0,0]],z:[[0,0,0,0,0],[1,1,1,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,0]],A:[[1,1,1,1,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],B:[[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0]],C:[[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],D:[[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],E:[[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,1]],F:[[1,1,1,1,1],
[1,0,0,0,0],[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0]],G:[[0,1,1,1,1],[1,0,0,0,0],[1,0,0,1,1],[1,0,0,0,1],[0,1,1,1,1]],H:[[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],I:[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],J:[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,0,0]],K:[[1,0,0,0,1],[1,0,1,1,0],[1,1,0,0,0],[1,0,1,1,0],[1,0,0,0,1]],L:[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],M:[[1,1,1,1,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1]],N:[[1,
0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],O:[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]],P:[[1,1,1,1,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0]],Q:[[1,1,1,1,1],[1,0,0,0,1],[1,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1]],R:[[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1]],S:[[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],T:[[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],U:[[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,
1]],V:[[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],W:[[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[0,1,0,1,0]],X:[[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],Y:[[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0]],Z:[[1,1,1,1,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],0:[[1,1,1,1,1],[1,0,0,1,1],[1,0,1,0,1],[1,1,0,0,1],[1,1,1,1,1]],1:[[1,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1]],2:[[1,1,1,1,1],[0,0,0,0,1],[1,1,1,1,1],[1,0,0,0,0],
[1,1,1,1,1]],3:[[1,1,1,1,0],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],4:[[1,0,0,0,0],[1,0,0,0,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0]],5:[[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],6:[[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],7:[[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0]],8:[[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],9:[[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,1,1,1,0]],".":[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],
[0,0,0,0,0],[0,0,1,0,0]],",":[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,1,1,0,0]],";":[[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,1,1,0,0]],":":[[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0]],"?":[[0,1,1,1,0],[1,0,0,0,1],[0,0,1,1,0],[0,0,1,0,0],[0,0,1,0,0]],"!":[[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,1,0,0]],"@":[[0,1,1,1,0],[1,0,0,0,1],[1,0,1,1,1],[1,0,0,0,0],[0,1,1,1,0]],"\u00a3":[[0,1,1,1,0],[0,1,0,0,1],[1,1,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],$:[[0,1,1,
1,1],[1,0,1,0,0],[0,1,1,1,0],[0,0,1,0,1],[1,1,1,1,0]],"%":[[1,1,0,0,1],[1,1,0,1,0],[0,0,1,0,0],[0,1,0,1,1],[1,0,0,1,1]],"^":[[0,0,1,0,0],[0,1,0,1,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],"&":[[0,1,1,0,0],[1,0,0,0,0],[0,1,0,1,1],[1,0,0,1,0],[0,1,1,0,0]],"*":[[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[0,0,0,0,0],[0,0,0,0,0]],"(":[[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,1,0]],")":[[0,1,0,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,0,0,0]],"+":[[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],
[0,0,1,0,0]],"-":[[0,0,0,0,0],[0,0,0,0,0],[0,1,1,1,0],[0,0,0,0,0],[0,0,0,0,0]],_:[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1]],"=":[[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0]]," ":[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],"{":[[0,0,1,1,0],[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,1,0]],"}":[[0,1,1,0,0],[0,0,1,0,0],[0,0,1,1,0],[0,0,1,0,0],[0,1,1,0,0]],"[":[[0,0,1,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,1,0]],"]":[[0,1,1,0,0],[0,0,1,0,0],
[0,0,1,0,0],[0,0,1,0,0],[0,1,1,0,0]],"'":[[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],'"':[[0,1,0,1,0],[0,1,0,1,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],"/":[[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0]],"\\":[[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]],"|":[[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],"<":[[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0]],">":[[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0]],"~":[[0,
0,0,0,0],[0,1,0,0,0],[1,0,1,0,1],[0,0,0,1,0],[0,0,0,0,0]],"`":[[0,1,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],"#":[[0,1,0,1,0],[1,1,1,1,1],[0,1,0,1,0],[1,1,1,1,1],[0,1,0,1,0]]};

/*
 Public Domain

 @example
 var rng = new RNG('Example');
 rng.random(40, 50);  // =>  42
 rng.uniform();       // =>  0.7972798995050903
 rng.normal();        // => -0.6698504543216376
 rng.exponential();   // =>  1.0547367609131555
 rng.poisson(4);      // =>  2
 rng.gamma(4);        // =>  2.781724687386858
*/
String.prototype.getBytes=function(){for(var a=[],b=0;b<this.length;b++){var c=this.charCodeAt(b),d=[];do d.push(c&255),c>>=8;while(0<c);a=a.concat(d.reverse())}return a};function RC4(a){this.s=Array(256);for(var b=this.j=this.i=0;256>b;b++)this.s[b]=b;a&&this.mix(a)}RC4.prototype._swap=function(a,b){var c=this.s[a];this.s[a]=this.s[b];this.s[b]=c};RC4.prototype.mix=function(a){a=a.getBytes();for(var b=0,c=0;c<this.s.length;c++)b+=this.s[c]+a[c%a.length],b%=256,this._swap(c,b)};
RC4.prototype.next=function(){this.i=(this.i+1)%256;this.j=(this.j+this.s[this.i])%256;this._swap(this.i,this.j);return this.s[(this.s[this.i]+this.s[this.j])%256]};function print_call_stack(){console.log(Error().stack)}
function RNG(a){this.seed=a;null==a?a=(Math.random()+Date.now()).toString():"function"===typeof a?(this.uniform=a,this.nextByte=function(){return~~(256*this.uniform())},a=null):"[object String]"!==Object.prototype.toString.call(a)&&(a=JSON.stringify(a));this._normal=null;this._state=a?new RC4(a):null}RNG.prototype.nextByte=function(){return this._state.next()};RNG.prototype.uniform=function(){for(var a=0,b=0;7>b;b++)a*=256,a+=this.nextByte();return a/(Math.pow(2,56)-1)};
RNG.prototype.random=function(a,b){if(null==a)return this.uniform();null==b&&(b=a,a=0);return a+Math.floor(this.uniform()*(b-a))};RNG.prototype.normal=function(){if(null!==this._normal){var a=this._normal;this._normal=null;return a}var a=this.uniform()||Math.pow(2,-53),b=this.uniform();this._normal=Math.sqrt(-2*Math.log(a))*Math.sin(2*Math.PI*b);return Math.sqrt(-2*Math.log(a))*Math.cos(2*Math.PI*b)};RNG.prototype.exponential=function(){return-Math.log(this.uniform()||Math.pow(2,-53))};
RNG.prototype.poisson=function(a){a=Math.exp(-(a||1));var b=0,c=1;do b++,c*=this.uniform();while(c>a);return b-1};RNG.prototype.gamma=function(a){var b=(1>a?1+a:a)-1/3,c=1/Math.sqrt(9*b);do{do var d=this.normal(),e=Math.pow(c*d+1,3);while(0>=e);var g=this.uniform(),d=Math.pow(d,2)}while(g>=1-0.0331*d*d&&Math.log(g)>=0.5*d+b*(1-e+Math.log(e)));return 1>a?b*e*Math.exp(this.exponential()/-a):b*e};
RNG.roller=function(a,b){var c=a.split(/(\d+)?d(\d+)([+-]\d+)?/).slice(1),d=parseFloat(c[0])||1,e=parseFloat(c[1]),g=parseFloat(c[2])||0;b=b||new RNG;return function(){for(var a=d+g,c=0;c<d;c++)a+=b.random(e);return a}};var FastBase64_chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",FastBase64_encLookup=[];function FastBase64_Init(){for(var a=0;4096>a;a++)FastBase64_encLookup[a]=FastBase64_chars[a>>6]+FastBase64_chars[a&63]}
function FastBase64_Encode(a){for(var b=a.length,c="",d=0;2<b;)n=a[d]<<16|a[d+1]<<8|a[d+2],c+=FastBase64_encLookup[n>>12]+FastBase64_encLookup[n&4095],b-=3,d+=3;if(0<b){var e=(a[d]&252)>>2,g=(a[d]&3)<<4;1<b&&(g|=(a[++d]&240)>>4);c+=FastBase64_chars[e];c+=FastBase64_chars[g];2==b&&(e=(a[d++]&15)<<2,e|=(a[d]&192)>>6,c+=FastBase64_chars[e]);1==b&&(c+="=");c+="="}return c}FastBase64_Init();function u32ToArray(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}
function u16ToArray(a){return[a&255,a>>8&255]}
function MakeRiff(a,b,c){var d=[],e=[];a={chunkId:[82,73,70,70],chunkSize:0,format:[87,65,86,69],subChunk1Id:[102,109,116,32],subChunk1Size:16,audioFormat:1,numChannels:1,sampleRate:a,byteRate:0,blockAlign:0,bitsPerSample:b,subChunk2Id:[100,97,116,97],subChunk2Size:0};a.byteRate=a.sampleRate*a.numChannels*a.bitsPerSample>>3;a.blockAlign=a.numChannels*a.bitsPerSample>>3;a.subChunk2Size=c.length;a.chunkSize=36+a.subChunk2Size;d=a.chunkId.concat(u32ToArray(a.chunkSize),a.format,a.subChunk1Id,u32ToArray(a.subChunk1Size),
u16ToArray(a.audioFormat),u16ToArray(a.numChannels),u32ToArray(a.sampleRate),u32ToArray(a.byteRate),u16ToArray(a.blockAlign),u16ToArray(a.bitsPerSample),a.subChunk2Id,u32ToArray(a.subChunk2Size),c);e="data:audio/wav;base64,"+FastBase64_Encode(d);return{dat:[],wav:d,header:a,dataURI:e}}"undefined"!=typeof exports&&(exports.RIFFWAVE=RIFFWAVE);var SOUND_VOL=0.25,SAMPLE_RATE=5512,BIT_DEPTH=8,SQUARE=0,SAWTOOTH=1,SINE=2,NOISE=3,TRIANGLE=4,BREAKER=5,SHAPES="square sawtooth sine noise triangle breaker".split(" "),AUDIO_CONTEXT;function checkAudioContextExists(){try{null==AUDIO_CONTEXT&&("undefined"!=typeof AudioContext?AUDIO_CONTEXT=new AudioContext:"undefined"!=typeof webkitAudioContext&&(AUDIO_CONTEXT=new webkitAudioContext))}catch(a){window.console.log(a)}}checkAudioContextExists();var masterVolume=1;
function Params(){var a={};a.wave_type=SQUARE;a.p_env_attack=0;a.p_env_sustain=0.3;a.p_env_punch=0;a.p_env_decay=0.4;a.p_base_freq=0.3;a.p_freq_limit=0;a.p_freq_ramp=0;a.p_freq_dramp=0;a.p_vib_strength=0;a.p_vib_speed=0;a.p_arp_mod=0;a.p_arp_speed=0;a.p_duty=0;a.p_duty_ramp=0;a.p_repeat_speed=0;a.p_pha_offset=0;a.p_pha_ramp=0;a.p_lpf_freq=1;a.p_lpf_ramp=0;a.p_lpf_resonance=0;a.p_hpf_freq=0;a.p_hpf_ramp=0;a.sound_vol=0.5;a.sample_rate=44100;a.bit_depth=8;return a}var rng,seeded=!1;
function frnd(a){return seeded?rng.uniform()*a:Math.random()*a}function rnd(a){return seeded?Math.floor(rng.uniform()*(a+1)):Math.floor(Math.random()*(a+1))}pickupCoin=function(){var a=Params();a.wave_type=Math.floor(frnd(SHAPES.length));3===a.wave_type&&(a.wave_type=0);a.p_base_freq=0.4+frnd(0.5);a.p_env_attack=0;a.p_env_sustain=frnd(0.1);a.p_env_decay=0.1+frnd(0.4);a.p_env_punch=0.3+frnd(0.3);if(rnd(1)){a.p_arp_speed=0.5+frnd(0.2);var b=(frnd(7)|1)+1,c=b+(frnd(7)|1)+2;a.p_arp_mod=+b/+c}return a};
laserShoot=function(){var a=Params();a.wave_type=rnd(2);a.wave_type===SINE&&rnd(1)&&(a.wave_type=rnd(1));a.wave_type=Math.floor(frnd(SHAPES.length));3===a.wave_type&&(a.wave_type=SQUARE);a.p_base_freq=0.5+frnd(0.5);a.p_freq_limit=a.p_base_freq-0.2-frnd(0.6);0.2>a.p_freq_limit&&(a.p_freq_limit=0.2);a.p_freq_ramp=-0.15-frnd(0.2);0===rnd(2)&&(a.p_base_freq=0.3+frnd(0.6),a.p_freq_limit=frnd(0.1),a.p_freq_ramp=-0.35-frnd(0.3));rnd(1)?(a.p_duty=frnd(0.5),a.p_duty_ramp=frnd(0.2)):(a.p_duty=0.4+frnd(0.5),
a.p_duty_ramp=-frnd(0.7));a.p_env_attack=0;a.p_env_sustain=0.1+frnd(0.2);a.p_env_decay=frnd(0.4);rnd(1)&&(a.p_env_punch=frnd(0.3));0===rnd(2)&&(a.p_pha_offset=frnd(0.2),a.p_pha_ramp=-frnd(0.2));rnd(1)&&(a.p_hpf_freq=frnd(0.3));return a};
explosion=function(){var a=Params();rnd(1)?(a.p_base_freq=0.1+frnd(0.4),a.p_freq_ramp=-0.1+frnd(0.4)):(a.p_base_freq=0.2+frnd(0.7),a.p_freq_ramp=-0.2-frnd(0.2));a.p_base_freq*=a.p_base_freq;0===rnd(4)&&(a.p_freq_ramp=0);0===rnd(2)&&(a.p_repeat_speed=0.3+frnd(0.5));a.p_env_attack=0;a.p_env_sustain=0.1+frnd(0.3);a.p_env_decay=frnd(0.5);0===rnd(1)&&(a.p_pha_offset=-0.3+frnd(0.9),a.p_pha_ramp=-frnd(0.3));a.p_env_punch=0.2+frnd(0.6);rnd(1)&&(a.p_vib_strength=frnd(0.7),a.p_vib_speed=frnd(0.6));0===rnd(2)&&
(a.p_arp_speed=0.6+frnd(0.3),a.p_arp_mod=0.8-frnd(1.6));return a};
birdSound=function(){var a=Params();if(1>frnd(10))return a.wave_type=Math.floor(frnd(SHAPES.length)),3===a.wave_type&&(a.wave_type=SQUARE),a.p_env_attack=0.4304400932967592+frnd(0.2)-0.1,a.p_env_sustain=0.15739346034252394+frnd(0.2)-0.1,a.p_env_punch=0.004488201744871758+frnd(0.2)-0.1,a.p_env_decay=0.07478075528212291+frnd(0.2)-0.1,a.p_base_freq=0.9865265720147687+frnd(0.2)-0.1,a.p_freq_limit=0+frnd(0.2)-0.1,a.p_freq_ramp=-0.2995018224359539+frnd(0.2)-0.1,0.5>frnd(1)&&(a.p_freq_ramp=0.1+frnd(0.15)),
a.p_freq_dramp=0.004598608156964473+frnd(0.1)-0.05,a.p_vib_strength=-0.2202799497929496+frnd(0.2)-0.1,a.p_vib_speed=0.8084998703158364+frnd(0.2)-0.1,a.p_arp_mod=0,a.p_arp_speed=0,a.p_duty=-0.9031808754347107+frnd(0.2)-0.1,a.p_duty_ramp=-0.8128699999808343+frnd(0.2)-0.1,a.p_repeat_speed=0.601486018931999+frnd(0.2)-0.1,a.p_pha_offset=-0.9424902314367765+frnd(0.2)-0.1,a.p_pha_ramp=-0.1055482222272056+frnd(0.2)-0.1,a.p_lpf_freq=0.9989765717851521+frnd(0.2)-0.1,a.p_lpf_ramp=-0.25051720626043017+frnd(0.2)-
0.1,a.p_lpf_resonance=0.32777871505494693+frnd(0.2)-0.1,a.p_hpf_freq=0.0023548750981756753+frnd(0.2)-0.1,a.p_hpf_ramp=-0.002375673204842568+frnd(0.2)-0.1,a;if(1>frnd(10))return a.wave_type=Math.floor(frnd(SHAPES.length)),3===a.wave_type&&(a.wave_type=SQUARE),a.p_env_attack=0.5277795946672003+frnd(0.2)-0.1,a.p_env_sustain=0.18243733568468432+frnd(0.2)-0.1,a.p_env_punch=-0.020159754546840117+frnd(0.2)-0.1,a.p_env_decay=0.1561353422051903+frnd(0.2)-0.1,a.p_base_freq=0.9028855606533718+frnd(0.2)-0.1,
a.p_freq_limit=-0.008842787837148716,a.p_freq_ramp=-0.1,a.p_freq_dramp=-0.012891241489551925,a.p_vib_strength=-0.17923136138403065+frnd(0.2)-0.1,a.p_vib_speed=0.908263385610142+frnd(0.2)-0.1,a.p_arp_mod=0.41690153355414894+frnd(0.2)-0.1,a.p_arp_speed=0.0010766233195860704+frnd(0.2)-0.1,a.p_duty=-0.8735363011184684+frnd(0.2)-0.1,a.p_duty_ramp=-0.7397985366747507+frnd(0.2)-0.1,a.p_repeat_speed=0.0591789344172107+frnd(0.2)-0.1,a.p_pha_offset=-0.9961184222777699+frnd(0.2)-0.1,a.p_pha_ramp=-0.08234769395850523+
frnd(0.2)-0.1,a.p_lpf_freq=0.9412475115697335+frnd(0.2)-0.1,a.p_lpf_ramp=-0.18261358925834958+frnd(0.2)-0.1,a.p_lpf_resonance=0.24541438107389477+frnd(0.2)-0.1,a.p_hpf_freq=-0.01831940280978611+frnd(0.2)-0.1,a.p_hpf_ramp=-0.03857383633171346+frnd(0.2)-0.1,a;if(1>frnd(10))return a.wave_type=Math.floor(frnd(SHAPES.length)),3===a.wave_type&&(a.wave_type=SQUARE),a.p_env_attack=0.4304400932967592+frnd(0.2)-0.1,a.p_env_sustain=0.15739346034252394+frnd(0.2)-0.1,a.p_env_punch=0.004488201744871758+frnd(0.2)-
0.1,a.p_env_decay=0.07478075528212291+frnd(0.2)-0.1,a.p_base_freq=0.9865265720147687+frnd(0.2)-0.1,a.p_freq_limit=0+frnd(0.2)-0.1,a.p_freq_ramp=-0.2995018224359539+frnd(0.2)-0.1,a.p_freq_dramp=0.004598608156964473+frnd(0.2)-0.1,a.p_vib_strength=-0.2202799497929496+frnd(0.2)-0.1,a.p_vib_speed=0.8084998703158364+frnd(0.2)-0.1,a.p_arp_mod=-0.46410459213693644+frnd(0.2)-0.1,a.p_arp_speed=-0.10955361249587248+frnd(0.2)-0.1,a.p_duty=-0.9031808754347107+frnd(0.2)-0.1,a.p_duty_ramp=-0.8128699999808343+frnd(0.2)-
0.1,a.p_repeat_speed=0.7014860189319991+frnd(0.2)-0.1,a.p_pha_offset=-0.9424902314367765+frnd(0.2)-0.1,a.p_pha_ramp=-0.1055482222272056+frnd(0.2)-0.1,a.p_lpf_freq=0.9989765717851521+frnd(0.2)-0.1,a.p_lpf_ramp=-0.25051720626043017+frnd(0.2)-0.1,a.p_lpf_resonance=0.32777871505494693+frnd(0.2)-0.1,a.p_hpf_freq=0.0023548750981756753+frnd(0.2)-0.1,a.p_hpf_ramp=-0.002375673204842568+frnd(0.2)-0.1,a;if(1<frnd(5))return a.wave_type=Math.floor(frnd(SHAPES.length)),3===a.wave_type&&(a.wave_type=SQUARE),rnd(1)?
(a.p_arp_mod=0.2697849293151393+frnd(0.2)-0.1,a.p_arp_speed=-0.3131172257760948+frnd(0.2)-0.1,a.p_base_freq=0.8090588299313949+frnd(0.2)-0.1,a.p_duty=-0.6210022920964955+frnd(0.2)-0.1,a.p_duty_ramp=-4.3441813553182567E-4+frnd(0.2)-0.1,a.p_env_attack=0.004321877246874195+frnd(0.2)-0.1,a.p_env_decay=0.1+frnd(0.2)-0.1,a.p_env_punch=0.061737781504416146+frnd(0.2)-0.1,a.p_env_sustain=0.4987252564798832+frnd(0.2)-0.1,a.p_freq_dramp=0.31700340314222614+frnd(0.2)-0.1,a.p_freq_limit=0+frnd(0.2)-0.1,a.p_freq_ramp=
-0.163380391341416+frnd(0.2)-0.1,a.p_hpf_freq=0.4709005021145149+frnd(0.2)-0.1,a.p_hpf_ramp=0.6924667290539194+frnd(0.2)-0.1,a.p_lpf_freq=0.8351398631384511+frnd(0.2)-0.1,a.p_lpf_ramp=0.36616557192873134+frnd(0.2)-0.1,a.p_lpf_resonance=-0.08685777111664439+frnd(0.2)-0.1,a.p_pha_offset=-0.036084571580025544+frnd(0.2)-0.1,a.p_pha_ramp=-0.014806445085568108+frnd(0.2)-0.1,a.p_repeat_speed=-0.8094368475518489+frnd(0.2)-0.1,a.p_vib_speed=0.4496665457171294+frnd(0.2)-0.1,a.p_vib_strength=0.23413762515532424+
frnd(0.2)-0.1):(a.p_arp_mod=-0.35697118026766184+frnd(0.2)-0.1,a.p_arp_speed=0.3581140690559588+frnd(0.2)-0.1,a.p_base_freq=1.3260897696157528+frnd(0.2)-0.1,a.p_duty=-0.30984900436710694+frnd(0.2)-0.1,a.p_duty_ramp=-0.0014374759133411626+frnd(0.2)-0.1,a.p_env_attack=0.3160357835682254+frnd(0.2)-0.1,a.p_env_decay=0.1+frnd(0.2)-0.1,a.p_env_punch=0.24323114016870148+frnd(0.2)-0.1,a.p_env_sustain=0.4+frnd(0.2)-0.1,a.p_freq_dramp=0.2866475886237244+frnd(0.2)-0.1,a.p_freq_limit=0+frnd(0.2)-0.1,a.p_freq_ramp=
-0.10956352368742976+frnd(0.2)-0.1,a.p_hpf_freq=0.20772718017889846+frnd(0.2)-0.1,a.p_hpf_ramp=0.1564090637378835+frnd(0.2)-0.1,a.p_lpf_freq=0.6021372770637031+frnd(0.2)-0.1,a.p_lpf_ramp=0.24016227139979027+frnd(0.2)-0.1,a.p_lpf_resonance=-0.08787383821160144+frnd(0.2)-0.1,a.p_pha_offset=-0.381597686151701+frnd(0.2)-0.1,a.p_pha_ramp=-2.481687661373495E-4+frnd(0.2)-0.1,a.p_repeat_speed=0.07812112809425686+frnd(0.2)-0.1,a.p_vib_speed=-0.13648848579133943+frnd(0.2)-0.1,a.p_vib_strength=0.0018874158972302657+
frnd(0.2)-0.1),a;a.wave_type=Math.floor(frnd(SHAPES.length));if(1===a.wave_type||3===a.wave_type)a.wave_type=2;a.p_base_freq=0.85+frnd(0.15);a.p_freq_ramp=0.3+frnd(0.15);a.p_env_attack=0+frnd(0.09);a.p_env_sustain=0.2+frnd(0.3);a.p_env_decay=0+frnd(0.1);a.p_duty=frnd(2)-1;a.p_duty_ramp=Math.pow(frnd(2)-1,3);a.p_repeat_speed=0.5+frnd(0.1);a.p_pha_offset=-0.3+frnd(0.9);a.p_pha_ramp=-frnd(0.3);a.p_arp_speed=0.4+frnd(0.6);a.p_arp_mod=0.8+frnd(0.1);a.p_lpf_resonance=frnd(2)-1;a.p_lpf_freq=1-Math.pow(frnd(1),
3);a.p_lpf_ramp=Math.pow(frnd(2)-1,3);0.1>a.p_lpf_freq&&-0.05>a.p_lpf_ramp&&(a.p_lpf_ramp=-a.p_lpf_ramp);a.p_hpf_freq=Math.pow(frnd(1),5);a.p_hpf_ramp=Math.pow(frnd(2)-1,5);return a};
pushSound=function(){var a=Params();a.wave_type=Math.floor(frnd(SHAPES.length));2===a.wave_type&&a.wave_type++;0===a.wave_type&&(a.wave_type=NOISE);a.p_base_freq=0.1+frnd(0.4);a.p_freq_ramp=0.05+frnd(0.2);a.p_env_attack=0.01+frnd(0.09);a.p_env_sustain=0.01+frnd(0.09);a.p_env_decay=0.01+frnd(0.09);a.p_repeat_speed=0.3+frnd(0.5);a.p_pha_offset=-0.3+frnd(0.9);a.p_pha_ramp=-frnd(0.3);a.p_arp_speed=0.6+frnd(0.3);a.p_arp_mod=0.8-frnd(1.6);return a};
powerUp=function(){var a=Params();rnd(1)?a.wave_type=SAWTOOTH:a.p_duty=frnd(0.6);a.wave_type=Math.floor(frnd(SHAPES.length));3===a.wave_type&&(a.wave_type=SQUARE);rnd(1)?(a.p_base_freq=0.2+frnd(0.3),a.p_freq_ramp=0.1+frnd(0.4),a.p_repeat_speed=0.4+frnd(0.4)):(a.p_base_freq=0.2+frnd(0.3),a.p_freq_ramp=0.05+frnd(0.2),rnd(1)&&(a.p_vib_strength=frnd(0.7),a.p_vib_speed=frnd(0.6)));a.p_env_attack=0;a.p_env_sustain=frnd(0.4);a.p_env_decay=0.1+frnd(0.4);return a};
hitHurt=function(){result=Params();result.wave_type=rnd(2);result.wave_type===SINE&&(result.wave_type=NOISE);result.wave_type===SQUARE&&(result.p_duty=frnd(0.6));result.wave_type=Math.floor(frnd(SHAPES.length));result.p_base_freq=0.2+frnd(0.6);result.p_freq_ramp=-0.3-frnd(0.4);result.p_env_attack=0;result.p_env_sustain=frnd(0.1);result.p_env_decay=0.1+frnd(0.2);rnd(1)&&(result.p_hpf_freq=frnd(0.3));return result};
jump=function(){result=Params();result.wave_type=SQUARE;result.wave_type=Math.floor(frnd(SHAPES.length));3===result.wave_type&&(result.wave_type=SQUARE);result.p_duty=frnd(0.6);result.p_base_freq=0.3+frnd(0.3);result.p_freq_ramp=0.1+frnd(0.2);result.p_env_attack=0;result.p_env_sustain=0.1+frnd(0.3);result.p_env_decay=0.1+frnd(0.2);rnd(1)&&(result.p_hpf_freq=frnd(0.3));rnd(1)&&(result.p_lpf_freq=1-frnd(0.6));return result};
blipSelect=function(){result=Params();result.wave_type=rnd(1);result.wave_type=Math.floor(frnd(SHAPES.length));3===result.wave_type&&(result.wave_type=rnd(1));result.wave_type===SQUARE&&(result.p_duty=frnd(0.6));result.p_base_freq=0.2+frnd(0.4);result.p_env_attack=0;result.p_env_sustain=0.1+frnd(0.1);result.p_env_decay=frnd(0.2);result.p_hpf_freq=0.1;return result};
random=function(){result=Params();result.wave_type=Math.floor(frnd(SHAPES.length));result.p_base_freq=Math.pow(frnd(2)-1,2);rnd(1)&&(result.p_base_freq=Math.pow(frnd(2)-1,3)+0.5);result.p_freq_limit=0;result.p_freq_ramp=Math.pow(frnd(2)-1,5);0.7<result.p_base_freq&&0.2<result.p_freq_ramp&&(result.p_freq_ramp=-result.p_freq_ramp);0.2>result.p_base_freq&&-0.05>result.p_freq_ramp&&(result.p_freq_ramp=-result.p_freq_ramp);result.p_freq_dramp=Math.pow(frnd(2)-1,3);result.p_duty=frnd(2)-1;result.p_duty_ramp=
Math.pow(frnd(2)-1,3);result.p_vib_strength=Math.pow(frnd(2)-1,3);result.p_vib_speed=frnd(2)-1;result.p_env_attack=Math.pow(frnd(2)-1,3);result.p_env_sustain=Math.pow(frnd(2)-1,2);result.p_env_decay=frnd(2)-1;result.p_env_punch=Math.pow(frnd(0.8),2);0.2>result.p_env_attack+result.p_env_sustain+result.p_env_decay&&(result.p_env_sustain+=0.2+frnd(0.3),result.p_env_decay+=0.2+frnd(0.3));result.p_lpf_resonance=frnd(2)-1;result.p_lpf_freq=1-Math.pow(frnd(1),3);result.p_lpf_ramp=Math.pow(frnd(2)-1,3);0.1>
result.p_lpf_freq&&-0.05>result.p_lpf_ramp&&(result.p_lpf_ramp=-result.p_lpf_ramp);result.p_hpf_freq=Math.pow(frnd(1),5);result.p_hpf_ramp=Math.pow(frnd(2)-1,5);result.p_pha_offset=Math.pow(frnd(2)-1,3);result.p_pha_ramp=Math.pow(frnd(2)-1,3);result.p_repeat_speed=frnd(2)-1;result.p_arp_speed=frnd(2)-1;result.p_arp_mod=frnd(2)-1;return result};var generators=[pickupCoin,laserShoot,explosion,powerUp,hitHurt,jump,blipSelect,pushSound,random,birdSound],generatorNames="pickupCoin laserShoot explosion powerUp hitHurt jump blipSelect pushSound random birdSound".split(" ");
generateFromSeed=function(a){rng=new RNG(a/100|0);var b=generators[a%100%generators.length];seeded=!0;b=b();b.seed=a;seeded=!1;return b};function SoundEffect(a,b){this._buffer=AUDIO_CONTEXT.createBuffer(1,a,b)}SoundEffect.prototype.getBuffer=function(){return this._buffer.getChannelData(0)};
SoundEffect.prototype.play=function(){var a=AUDIO_CONTEXT.createBufferSource(),b=AUDIO_CONTEXT.createBiquadFilter(),c=AUDIO_CONTEXT.createBiquadFilter(),d=AUDIO_CONTEXT.createBiquadFilter();a.buffer=this._buffer;a.connect(b);b.frequency.value=1600;c.frequency.value=1600;d.frequency.value=1600;b.connect(c);c.connect(d);d.connect(AUDIO_CONTEXT.destination);b=AUDIO_CONTEXT.currentTime;"undefined"!=typeof a.start?a.start(b):a.noteOn(b);a.onended=function(){d.disconnect()}};
SoundEffect.MIN_SAMPLE_RATE=22050;
"undefined"==typeof AUDIO_CONTEXT&&(SoundEffect=function(a,b){this._sample_rate=b;this._buffer=Array(a);this._audioElement=null},SoundEffect.prototype.getBuffer=function(){this._audioElement=null;return this._buffer},SoundEffect.prototype.play=function(){if(this._audioElement)this._audioElement.cloneNode(!1).play();else{for(var a=0;a<this._buffer.length;a++)this._buffer[a]=255&Math.floor(128*Math.max(0,Math.min(this._buffer[a]+1,2)));a=MakeRiff(this._sample_rate,BIT_DEPTH,this._buffer);this._audioElement=
new Audio;this._audioElement.src=a.dataURI;this._audioElement.play()}},SoundEffect.MIN_SAMPLE_RATE=1);
SoundEffect.generate=function(a){function b(){c=0;d=100/(a.p_base_freq*a.p_base_freq+0.001);e=Math.floor(d);g=100/(a.p_freq_limit*a.p_freq_limit+0.001);h=1-0.01*Math.pow(a.p_freq_ramp,3);l=1E-6*-Math.pow(a.p_freq_dramp,3);p=0.5-0.5*a.p_duty;m=5E-5*-a.p_duty_ramp;u=0<=a.p_arp_mod?1-0.9*Math.pow(a.p_arp_mod,2):1+10*Math.pow(a.p_arp_mod,2);A=Math.floor(2E4*Math.pow(1-a.p_arp_speed,2)+32);1==a.p_arp_speed&&(A=0)}var c,d,e,g,h,l,p,m,u,A;b();var D=0,E=0,J=0.1*Math.pow(a.p_lpf_freq,3),C=1+1E-4*a.p_lpf_ramp,
v=5/(1+20*Math.pow(a.p_lpf_resonance,2))*(0.01+J);0.8<v&&(v=0.8);var k=0,r=0.1*Math.pow(a.p_hpf_freq,2),w=1+3E-4*a.p_hpf_ramp,q=0,F=0.01*Math.pow(a.p_vib_speed,2),R=0.5*a.p_vib_strength,Q=0,K=0,T=0,S=[Math.floor(a.p_env_attack*a.p_env_attack*1E5),Math.floor(a.p_env_sustain*a.p_env_sustain*1E5),Math.floor(a.p_env_decay*a.p_env_decay*1E5)],X=S[0]+S[1]+S[2],wa=0,ga=1020*Math.pow(a.p_pha_offset,2);0>a.p_pha_offset&&(ga=-ga);var Ma=1*Math.pow(a.p_pha_ramp,2);0>a.p_pha_ramp&&(Ma=-Ma);for(var ja=Math.abs(Math.floor(ga)),
Ra=0,Za=[],L=0;1024>L;++L)Za[L]=0;for(var U=[],L=0;32>L;++L)U[L]=2*Math.random()-1;var ka=Math.floor(2E4*Math.pow(1-a.p_repeat_speed,2)+32);0==a.p_repeat_speed&&(ka=0);for(var ua=2*a.sound_vol,ua=Math.exp(a.sound_vol)-1,G=0,Sa=0,xa=Math.floor(44100/a.sample_rate),oa=0,ja=Math.ceil(X/xa),X=a.sample_rate<SoundEffect.MIN_SAMPLE_RATE?new SoundEffect(4*ja,SoundEffect.MIN_SAMPLE_RATE):new SoundEffect(ja,a.sample_rate),ya=X.getBuffer(),Ab=0;;++Ab){0!=ka&&++c>=ka&&b();0!=A&&Ab>=A&&(A=0,d*=u);h+=l;d*=h;d>
g&&(d=g);ja=d;0<R&&(q+=F,ja=d*(1+Math.sin(q)*R));e=Math.floor(ja);8>e&&(e=8);p+=m;0>p&&(p=0);0.5<p&&(p=0.5);T++;if(T>S[K]){T=1;for(K++;3>K&&0===S[K];)K++;if(3===K)break}Q=0===K?T/S[0]:1===K?1+2*Math.pow(1-T/S[1],1)*a.p_env_punch:1-T/S[2];ga+=Ma;ja=Math.abs(Math.floor(ga));1023<ja&&(ja=1023);0!=w&&(r*=w,1E-5>r&&(r=1E-5),0.1<r&&(r=0.1));for(var Z=0,Bb=0;8>Bb;++Bb){L=0;wa++;if(wa>=e&&(wa%=e,a.wave_type===NOISE))for(L=0;32>L;++L)U[L]=2*Math.random()-1;L=wa/e;if(a.wave_type===SQUARE)L=L<p?0.5:-0.5;else if(a.wave_type===
SAWTOOTH)L=1-2*L;else if(a.wave_type===SINE)L=Math.sin(2*L*Math.PI);else if(a.wave_type===NOISE)L=U[Math.floor(32*wa/e)];else if(a.wave_type===TRIANGLE)L=Math.abs(1-2*L)-1;else if(a.wave_type===BREAKER)L=Math.abs(1-L*L*2)-1;else throw new Exception("bad wave type! "+a.wave_type);var ba=D,J=J*C;0>J&&(J=0);0.1<J&&(J=0.1);1!=a.p_lpf_freq?(E+=(L-D)*J,E-=E*v):(D=L,E=0);D+=E;k+=D-ba;L=k-=k*r;Za[Ra&1023]=L;L+=Za[Ra-ja+1024&1023];Ra=Ra+1&1023;Z+=L*Q}G+=Z;++Sa>=xa&&(Sa=0,Z=G/xa,G=0,Z=Z/8*masterVolume,Z*=ua,
ya[oa++]=Z,a.sample_rate<SoundEffect.MIN_SAMPLE_RATE&&(ya[oa++]=Z,ya[oa++]=Z,ya[oa++]=Z))}0<xa&&(Z=G/xa/8*masterVolume,Z*=ua,ya[oa++]=Z,a.sample_rate<SoundEffect.MIN_SAMPLE_RATE&&(ya[oa++]=Z,ya[oa++]=Z,ya[oa++]=Z));return X};if("undefined"!=typeof exports){var RIFFWAVE=require("./riffwave").RIFFWAVE;exports.Params=Params;exports.generate=generate}var sfxCache={},cachedSeeds=[],CACHE_MAX=50;
function cacheSeed(a){if(a in sfxCache)return sfxCache[a];var b=generateFromSeed(a);b.sound_vol=SOUND_VOL;b.sample_rate=SAMPLE_RATE;b.bit_depth=BIT_DEPTH;b=SoundEffect.generate(b);sfxCache[a]=b;for(cachedSeeds.push(a);cachedSeeds.length>CACHE_MAX;)a=cachedSeeds[0],cachedSeeds=cachedSeeds.slice(1),delete sfxCache[a];return b}function playSound(a){checkAudioContextExists();unitTesting||cacheSeed(a).play()};

(function(a){if("object"==typeof exports&&"object"==typeof module)module.exports=a();else{if("function"==typeof define&&define.amd)return define([],a);this.CodeMirror=a()}})
(function(){function a(f,t){if(!(this instanceof a))return new a(f,t);this.options=t=t||{};for(var s in yd)t.hasOwnProperty(s)||(t[s]=yd[s]);D(t);var z=t.value;"string"==typeof z&&(z=new la(z,t.mode));this.doc=z;var ea=this.display=new b(f,z);ea.wrapper.CodeMirror=this;m(this);l(this);t.lineWrapping&&(this.display.wrapper.className+=
" CodeMirror-wrap");t.autofocus&&!Oc&&pa(this);this.state={keyMaps:[],overlays:[],modeGen:0,overwrite:!1,focused:!1,suppressEdits:!1,pasteIncoming:!1,cutIncoming:!1,draggingText:!1,highlight:new Pc};za&&setTimeout(Da(Ea,this,!0),20);Le(this);var c=this;Na(this,function(){c.curOp.forceUpdate=!0;zd(c,z);t.autofocus&&!Oc||Ta()==ea.input?setTimeout(Da(Qc,c),20):Rc(c);for(var f in ob)if(ob.hasOwnProperty(f))ob[f](c,t[f],Ad);for(f=0;f<Sc.length;++f)Sc[f](c)})}function b(f,t){var a=this.input=H("textarea",
null,null,"position: absolute; padding: 0; width: 1px; height: 1em; outline: none");sa?a.style.width="1000px":a.setAttribute("wrap","off");Cb&&(a.style.border="1px solid black");a.setAttribute("autocorrect","off");a.setAttribute("autocapitalize","off");a.setAttribute("spellcheck","false");this.inputDiv=H("div",[a],null,"overflow: hidden; position: relative; width: 3px; height: 0px;");this.scrollbarH=H("div",[H("div",null,null,"height: 100%; min-height: 1px")],"CodeMirror-hscrollbar");this.scrollbarV=
H("div",[H("div",null,null,"min-width: 1px")],"CodeMirror-vscrollbar");this.scrollbarFiller=H("div",null,"CodeMirror-scrollbar-filler");this.gutterFiller=H("div",null,"CodeMirror-gutter-filler");this.lineDiv=H("div",null,"CodeMirror-code");this.selectionDiv=H("div",null,null,"position: relative; z-index: 1");this.cursorDiv=H("div",null,"CodeMirror-cursors");this.measure=H("div",null,"CodeMirror-measure");this.lineMeasure=H("div",null,"CodeMirror-measure");this.lineSpace=H("div",[this.measure,this.lineMeasure,
this.selectionDiv,this.cursorDiv,this.lineDiv],null,"position: relative; outline: none");this.mover=H("div",[H("div",[this.lineSpace],"CodeMirror-lines")],null,"position: relative");this.sizer=H("div",[this.mover],"CodeMirror-sizer");this.heightForcer=H("div",null,null,"position: absolute; height: "+Oa+"px; width: 1px;");this.gutters=H("div",null,"CodeMirror-gutters");this.lineGutter=null;this.scroller=H("div",[this.sizer,this.heightForcer,this.gutters],"CodeMirror-scroll");this.scroller.setAttribute("tabIndex",
"-1");this.wrapper=H("div",[this.inputDiv,this.scrollbarH,this.scrollbarV,this.scrollbarFiller,this.gutterFiller,this.scroller],"CodeMirror");Db&&(this.gutters.style.zIndex=-1,this.scroller.style.paddingRight=0);Cb&&(a.style.width="0px");sa||(this.scroller.draggable=!0);Tc&&(this.inputDiv.style.height="1px",this.inputDiv.style.position="absolute");Db&&(this.scrollbarH.style.minHeight=this.scrollbarV.style.minWidth="18px");f.appendChild?f.appendChild(this.wrapper):f(this.wrapper);this.viewFrom=this.viewTo=
t.first;this.view=[];this.externalMeasured=null;this.lastSizeC=this.viewOffset=0;this.lineNumWidth=this.lineNumInnerWidth=this.lineNumChars=this.updateLineNumbers=null;this.prevInput="";this.pollingFast=this.alignWidgets=!1;this.poll=new Pc;this.cachedCharWidth=this.cachedTextHeight=this.cachedPaddingH=null;this.inaccurateSelection=!1;this.maxLine=null;this.maxLineLength=0;this.maxLineChanged=!1;this.wheelDX=this.wheelDY=this.wheelStartX=this.wheelStartY=null;this.shift=!1}function c(f){f.doc.mode=
a.getMode(f.options,f.doc.modeOption);d(f)}function d(f){f.doc.iter(function(f){f.stateAfter&&(f.stateAfter=null);f.styles&&(f.styles=null)});f.doc.frontier=f.doc.first;Eb(f,100);f.state.modeGen++;f.curOp&&va(f)}function e(f){var t=$a(f.display),a=f.options.lineWrapping,z=a&&Math.max(5,f.display.scroller.clientWidth/Fb(f.display)-3);return function(b){if(ab(f.doc,b))return 0;var c=0;if(b.widgets)for(var d=0;d<b.widgets.length;d++)b.widgets[d].height&&(c+=b.widgets[d].height);return a?c+(Math.ceil(b.text.length/
z)||1)*t:c+t}}function g(f){var t=f.doc,a=e(f);t.iter(function(f){var t=a(f);t!=f.height&&Fa(f,t)})}function h(f){var t=Pa[f.options.keyMap].style;f.display.wrapper.className=f.display.wrapper.className.replace(/\s*cm-keymap-\S+/g,"")+(t?" cm-keymap-"+t:"")}function l(f){f.display.wrapper.className=f.display.wrapper.className.replace(/\s*cm-s-\S+/g,"")+f.options.theme.replace(/(^|\s)\s*/g," cm-s-");Gb(f)}function p(f){m(f);va(f);setTimeout(function(){v(f)},20)}function m(f){var t=f.display.gutters,
a=f.options.gutters;bb(t);for(var z=0;z<a.length;++z){var b=a[z],c=t.appendChild(H("div",null,"CodeMirror-gutter "+b));"CodeMirror-linenumbers"==b&&(f.display.lineGutter=c,c.style.width=(f.display.lineNumWidth||1)+"px")}t.style.display=z?"":"none";t=t.offsetWidth;f.display.sizer.style.marginLeft=t+"px";z&&(f.display.scrollbarH.style.left=f.options.fixedGutter?t+"px":0)}function u(f){if(0==f.height)return 0;for(var t=f.text.length,a,z=f;a=cb(z,!0);)a=a.find(0,!0),z=a.from.line,t+=a.from.ch-a.to.ch;
for(z=f;a=cb(z,!1);)a=a.find(0,!0),t-=z.text.length-a.from.ch,z=a.to.line,t+=z.text.length-a.to.ch;return t}function A(f){var t=f.display;f=f.doc;t.maxLine=I(f,f.first);t.maxLineLength=u(t.maxLine);t.maxLineChanged=!0;f.iter(function(f){var a=u(f);a>t.maxLineLength&&(t.maxLineLength=a,t.maxLine=f)})}function D(f){var t=ha(f.gutters,"CodeMirror-linenumbers");-1==t&&f.lineNumbers?f.gutters=f.gutters.concat(["CodeMirror-linenumbers"]):-1<t&&!f.lineNumbers&&(f.gutters=f.gutters.slice(0),f.gutters.splice(t,
1))}function E(f){var t=f.display.scroller;return{clientHeight:t.clientHeight,barHeight:f.display.scrollbarV.clientHeight,scrollWidth:t.scrollWidth,clientWidth:t.clientWidth,barWidth:f.display.scrollbarH.clientWidth,docHeight:Math.round(f.doc.height+Bd(f.display))}}function J(f,t){t||(t=E(f));var a=f.display,z=t.docHeight+Oa,b=t.scrollWidth>t.clientWidth,c=z>t.clientHeight;c?(a.scrollbarV.style.display="block",a.scrollbarV.style.bottom=b?Hb(a.measure)+"px":"0",a.scrollbarV.firstChild.style.height=
Math.max(0,z-t.clientHeight+(t.barHeight||a.scrollbarV.clientHeight))+"px"):(a.scrollbarV.style.display="",a.scrollbarV.firstChild.style.height="0");b?(a.scrollbarH.style.display="block",a.scrollbarH.style.right=c?Hb(a.measure)+"px":"0",a.scrollbarH.firstChild.style.width=t.scrollWidth-t.clientWidth+(t.barWidth||a.scrollbarH.clientWidth)+"px"):(a.scrollbarH.style.display="",a.scrollbarH.firstChild.style.width="0");b&&c?(a.scrollbarFiller.style.display="block",a.scrollbarFiller.style.height=a.scrollbarFiller.style.width=
Hb(a.measure)+"px"):a.scrollbarFiller.style.display="";b&&f.options.coverGutterNextToScrollbar&&f.options.fixedGutter?(a.gutterFiller.style.display="block",a.gutterFiller.style.height=Hb(a.measure)+"px",a.gutterFiller.style.width=a.gutters.offsetWidth+"px"):a.gutterFiller.style.display="";Me&&0===Hb(a.measure)&&(a.scrollbarV.style.minWidth=a.scrollbarH.style.minHeight=Ne?"18px":"12px",z=function(t){(t.target||t.srcElement)!=a.scrollbarV&&(t.target||t.srcElement)!=a.scrollbarH&&ca(f,Cd)(t)},N(a.scrollbarV,
"mousedown",z),N(a.scrollbarH,"mousedown",z))}function C(f,t,a){var z=a&&null!=a.top?a.top:f.scroller.scrollTop,z=Math.floor(z-f.lineSpace.offsetTop),b=a&&null!=a.bottom?a.bottom:z+f.wrapper.clientHeight,z=db(t,z),b=db(t,b);if(a&&a.ensure){var c=a.ensure.from.line;a=a.ensure.to.line;if(c<z)return{from:c,to:db(t,Ga(I(t,c))+f.wrapper.clientHeight)};if(Math.min(a,t.lastLine())>=b)return{from:db(t,Ga(I(t,a))-f.wrapper.clientHeight),to:a}}return{from:z,to:b}}function v(f){var t=f.display,a=t.view;if(t.alignWidgets||
t.gutters.firstChild&&f.options.fixedGutter){for(var z=r(t)-t.scroller.scrollLeft+f.doc.scrollLeft,b=t.gutters.offsetWidth,c=z+"px",d=0;d<a.length;d++)if(!a[d].hidden){f.options.fixedGutter&&a[d].gutter&&(a[d].gutter.style.left=c);var e=a[d].alignable;if(e)for(var g=0;g<e.length;g++)e[g].style.left=c}f.options.fixedGutter&&(t.gutters.style.left=z+b+"px")}}function k(f,t){return String(f.lineNumberFormatter(t+f.firstLineNumber))}function r(f){return f.scroller.getBoundingClientRect().left-f.sizer.getBoundingClientRect().left}
function w(f,t,a){for(var z=f.display.viewFrom,b=f.display.viewTo,c,d=C(f.display,f.doc,t),e=!0;;e=!1){var g=f.display.scroller.clientWidth,O;O=f;var h=d,l=a;a=O.display;var V=O.doc;if(a.wrapper.offsetWidth)if(!l&&h.from>=a.viewFrom&&h.to<=a.viewTo&&0==Dd(O))O=void 0;else{var p;p=O;if(p.options.lineNumbers){var m=p.doc,r=k(p.options,m.first+m.size-1),m=p.display;if(r.length!=m.lineNumChars){var v=m.measure.appendChild(H("div",[H("div",r)],"CodeMirror-linenumber CodeMirror-gutter-elt")),u=v.firstChild.offsetWidth,
v=v.offsetWidth-u;m.lineGutter.style.width="";m.lineNumInnerWidth=Math.max(u,m.lineGutter.offsetWidth-v);m.lineNumWidth=m.lineNumInnerWidth+v;m.lineNumChars=m.lineNumInnerWidth?r.length:-1;m.lineGutter.style.width=m.lineNumWidth+"px";r=m.gutters.offsetWidth;m.scrollbarH.style.left=p.options.fixedGutter?r+"px":0;m.sizer.style.marginLeft=r+"px";p=!0}else p=!1}else p=!1;p&&Ua(O);p=F(O);u=V.first+V.size;m=Math.max(h.from-O.options.viewportMargin,V.first);r=Math.min(u,h.to+O.options.viewportMargin);a.viewFrom<
m&&20>m-a.viewFrom&&(m=Math.max(V.first,a.viewFrom));a.viewTo>r&&20>a.viewTo-r&&(r=Math.min(u,a.viewTo));Va&&(m=Uc(O.doc,m),r=Ed(O.doc,r));h=m!=a.viewFrom||r!=a.viewTo||a.lastSizeC!=a.wrapper.clientHeight;V=O;u=V.display;0==u.view.length||m>=u.viewTo||r<=u.viewFrom?(u.view=cc(V,m,r),u.viewFrom=m):(u.viewFrom>m?u.view=cc(V,m,u.viewFrom).concat(u.view):u.viewFrom<m&&(u.view=u.view.slice(Ib(V,m))),u.viewFrom=m,u.viewTo<r?u.view=u.view.concat(cc(V,u.viewTo,r)):u.viewTo>r&&(u.view=u.view.slice(0,Ib(V,
r))));u.viewTo=r;a.viewOffset=Ga(I(O.doc,a.viewFrom));O.display.mover.style.top=a.viewOffset+"px";V=Dd(O);if(h||0!=V||l){l=Ta();4<V&&(a.lineDiv.style.display="none");R(O,a.updateLineNumbers,p);4<V&&(a.lineDiv.style.display="");l&&Ta()!=l&&l.offsetHeight&&l.focus();bb(a.cursorDiv);bb(a.selectionDiv);h&&(a.lastSizeC=a.wrapper.clientHeight,Eb(O,400));O=O.display;a=O.lineDiv.offsetTop;for(l=0;l<O.view.length;l++)if(h=O.view[l],!h.hidden&&(Db?(p=h.node.offsetTop+h.node.offsetHeight,V=p-a,a=p):(V=h.node.getBoundingClientRect(),
V=V.bottom-V.top),p=h.line.height-V,2>V&&(V=$a(O)),0.001<p||-0.001>p))if(Fa(h.line,V),q(h.line),h.rest)for(V=0;V<h.rest.length;V++)q(h.rest[V]);O=!0}else O=void 0}else Ua(O),O=void 0;if(!O)break;c=!0;f.display.maxLineChanged&&!f.options.lineWrapping&&(O=f,a=O.display,l=a.maxLine.text.length,l=Vc(O,dc(O,a.maxLine),l,void 0).left,a.maxLineChanged=!1,l=Math.max(0,l+3),h=Math.max(0,a.sizer.offsetLeft+l+Oa-a.scroller.clientWidth),a.sizer.style.minWidth=l+"px",h<O.doc.scrollLeft&&pb(O,Math.min(a.scroller.scrollLeft,
h),!0));O=E(f);Wc(f);a=f;l=O;a.display.sizer.style.minHeight=a.display.heightForcer.style.top=l.docHeight+"px";a.display.gutters.style.height=Math.max(l.docHeight,l.clientHeight-Oa)+"px";J(f,O);if(e&&f.options.lineWrapping&&g!=f.display.scroller.clientWidth)a=!0;else if(a=!1,t&&null!=t.top&&(t={top:Math.min(O.docHeight-Oa-O.clientHeight,t.top)}),d=C(f.display,f.doc,t),d.from>=f.display.viewFrom&&d.to<=f.display.viewTo)break}f.display.updateLineNumbers=null;c&&(da(f,"update",f),f.display.viewFrom==
z&&f.display.viewTo==b||da(f,"viewportChange",f,f.display.viewFrom,f.display.viewTo));return c}function q(f){if(f.widgets)for(var t=0;t<f.widgets.length;++t)f.widgets[t].height=f.widgets[t].node.offsetHeight}function F(f){for(var t=f.display,a={},z={},b=t.gutters.firstChild,c=0;b;b=b.nextSibling,++c)a[f.options.gutters[c]]=b.offsetLeft,z[f.options.gutters[c]]=b.offsetWidth;return{fixedPos:r(t),gutterTotalWidth:t.gutters.offsetWidth,gutterLeft:a,gutterWidth:z,wrapperWidth:t.wrapper.clientWidth}}function R(f,
t,a){function z(t){var a=t.nextSibling;sa&&qb&&f.display.currentWheelTarget==t?t.style.display="none":t.parentNode.removeChild(t);return a}for(var b=f.display,c=f.options.lineNumbers,d=b.lineDiv,e=d.firstChild,g=b.view,b=b.viewFrom,h=0;h<g.length;h++){var l=g[h];if(!l.hidden)if(l.node){for(;e!=l.node;)e=z(e);e=c&&null!=t&&t<=b&&l.lineNumber;l.changes&&(-1<ha(l.changes,"gutter")&&(e=!1),Q(f,l,b,a));e&&(bb(l.lineNumber),l.lineNumber.appendChild(document.createTextNode(k(f.options,b))));e=l.node.nextSibling}else{var p=
wa(f,l,b,a);d.insertBefore(p,e)}b+=l.size}for(;e;)e=z(e)}function Q(f,t,a,z){for(var b=0;b<t.changes.length;b++){var c=t.changes[b];if("text"==c){var c=t,d=c.text.className,e=T(f,c);c.text==c.node&&(c.node=e.pre);c.text.parentNode.replaceChild(e.pre,c.text);c.text=e.pre;e.bgClass!=c.bgClass||e.textClass!=c.textClass?(c.bgClass=e.bgClass,c.textClass=e.textClass,S(c)):d&&(c.text.className=d)}else if("gutter"==c)X(f,t,a,z);else if("class"==c)S(t);else if("widget"==c){c=t;d=z;c.alignable&&(c.alignable=
null);for(var e=c.node.firstChild,g=void 0;e;e=g)g=e.nextSibling,"CodeMirror-linewidget"==e.className&&c.node.removeChild(e);ga(c,d)}}t.changes=null}function K(f){f.node==f.text&&(f.node=H("div",null,null,"position: relative"),f.text.parentNode&&f.text.parentNode.replaceChild(f.node,f.text),f.node.appendChild(f.text),Db&&(f.node.style.zIndex=2));return f.node}function T(f,t){var a=f.display.externalMeasured;return a&&a.line==t.line?(f.display.externalMeasured=null,t.measure=a.measure,a.built):Fd(f,
t)}function S(f){var t=f.bgClass?f.bgClass+" "+(f.line.bgClass||""):f.line.bgClass;t&&(t+=" CodeMirror-linebackground");if(f.background)t?f.background.className=t:(f.background.parentNode.removeChild(f.background),f.background=null);else if(t){var a=K(f);f.background=a.insertBefore(H("div",null,t),a.firstChild)}f.line.wrapClass?K(f).className=f.line.wrapClass:f.node!=f.text&&(f.node.className="");f.text.className=(f.textClass?f.textClass+" "+(f.line.textClass||""):f.line.textClass)||""}function X(f,
a,s,z){a.gutter&&(a.node.removeChild(a.gutter),a.gutter=null);var b=a.line.gutterMarkers;if(f.options.lineNumbers||b){var c=K(a),c=a.gutter=c.insertBefore(H("div",null,"CodeMirror-gutter-wrapper","position: absolute; left: "+(f.options.fixedGutter?z.fixedPos:-z.gutterTotalWidth)+"px"),a.text);!f.options.lineNumbers||b&&b["CodeMirror-linenumbers"]||(a.lineNumber=c.appendChild(H("div",k(f.options,s),"CodeMirror-linenumber CodeMirror-gutter-elt","left: "+z.gutterLeft["CodeMirror-linenumbers"]+"px; width: "+
f.display.lineNumInnerWidth+"px")));if(b)for(a=0;a<f.options.gutters.length;++a){s=f.options.gutters[a];var d=b.hasOwnProperty(s)&&b[s];d&&c.appendChild(H("div",[d],"CodeMirror-gutter-elt","left: "+z.gutterLeft[s]+"px; width: "+z.gutterWidth[s]+"px"))}}}function wa(f,a,s,z){var b=T(f,a);a.text=a.node=b.pre;b.bgClass&&(a.bgClass=b.bgClass);b.textClass&&(a.textClass=b.textClass);S(a);X(f,a,s,z);ga(a,z);return a.node}function ga(f,a){Ma(f.line,f,a,!0);if(f.rest)for(var s=0;s<f.rest.length;s++)Ma(f.rest[s],
f,a,!1)}function Ma(f,a,s,z){if(f.widgets){var b=K(a),c=0;for(f=f.widgets;c<f.length;++c){var d=f[c],e=H("div",[d.node],"CodeMirror-linewidget");d.handleMouseEvents||(e.ignoreEvents=!0);var g=d,h=e,l=s;if(g.noHScroll){(a.alignable||(a.alignable=[])).push(h);var k=l.wrapperWidth;h.style.left=l.fixedPos+"px";g.coverGutter||(k-=l.gutterTotalWidth,h.style.paddingLeft=l.gutterTotalWidth+"px");h.style.width=k+"px"}g.coverGutter&&(h.style.zIndex=5,h.style.position="relative",g.noHScroll||(h.style.marginLeft=
-l.gutterTotalWidth+"px"));z&&d.above?b.insertBefore(e,a.gutter||a.text):b.appendChild(e);da(d,"redraw")}}}function ja(f){return B(f.line,f.ch)}function Ra(f,a){return 0>P(f,a)?a:f}function Za(f,a){return 0>P(f,a)?f:a}function L(f,a){this.ranges=f;this.primIndex=a}function U(f,a){this.anchor=f;this.head=a}function ka(f,a){var s=f[a];f.sort(function(f,a){return P(f.from(),a.from())});a=ha(f,s);for(s=1;s<f.length;s++){var z=f[s],b=f[s-1];if(0<=P(b.to(),z.from())){var c=Za(b.from(),z.from()),d=Ra(b.to(),
z.to()),z=b.empty()?z.from()==z.head:b.from()==b.head;s<=a&&--a;f.splice(--s,2,new U(z?d:c,z?c:d))}}return new L(f,a)}function ua(f,a){return new L([new U(f,a||f)],0)}function G(f,a){if(a.line<f.first)return B(f.first,0);var s=f.first+f.size-1;if(a.line>s)return B(s,I(f,s).text.length);var s=I(f,a.line).text.length,z=a.ch,s=null==z||z>s?B(a.line,s):0>z?B(a.line,0):a;return s}function Sa(f,a){return a>=f.first&&a<f.first+f.size}function xa(f,a,s,z){return f.cm&&f.cm.display.shift||f.extend?(f=a.anchor,
z&&(a=0>P(s,f),a!=0>P(z,f)?(f=s,s=z):a!=0>P(s,z)&&(s=z)),new U(f,s)):new U(z||s,s)}function oa(f,a,s,z){ba(f,new L([xa(f,f.sel.primary(),a,s)],0),z)}function ya(f,a,s){for(var z=[],b=0;b<f.sel.ranges.length;b++)z[b]=xa(f,f.sel.ranges[b],a[b],null);a=ka(z,f.sel.primIndex);ba(f,a,s)}function Ab(f,a,s,z){var b=f.sel.ranges.slice(0);b[a]=s;ba(f,ka(b,f.sel.primIndex),z)}function Z(f,a){var s={ranges:a.ranges,update:function(a){this.ranges=[];for(var t=0;t<a.length;t++)this.ranges[t]=new U(G(f,a[t].anchor),
G(f,a[t].head))}};$(f,"beforeSelectionChange",f,s);f.cm&&$(f.cm,"beforeSelectionChange",f.cm,s);return s.ranges!=a.ranges?ka(s.ranges,s.ranges.length-1):a}function Bb(f,a,s){var z=f.history.done,b=W(z);b&&b.ranges?(z[z.length-1]=a,ec(f,a,s)):ba(f,a,s)}function ba(f,a,s){ec(f,a,s);a=f.sel;var z=f.cm?f.cm.curOp.id:NaN,b=f.history,c=s&&s.origin,d;if(!(d=z==b.lastOp)&&(d=c)&&(d=b.lastSelOrigin==c)&&!(d=b.lastModTime==b.lastSelTime&&b.lastOrigin==c)){d=W(b.done);var e=c.charAt(0);d="*"==e||"+"==e&&d.ranges.length==
a.ranges.length&&d.somethingSelected()==a.somethingSelected()&&new Date-f.history.lastSelTime<=(f.cm?f.cm.options.historyEventDelay:500)}d?b.done[b.done.length-1]=a:fc(a,b.done);b.lastSelTime=+new Date;b.lastSelOrigin=c;b.lastOp=z;s&&!1!==s.clearRedo&&Gd(b.undone)}function ec(f,a,s){if(Aa(f,"beforeSelectionChange")||f.cm&&Aa(f.cm,"beforeSelectionChange"))a=Z(f,a);var z=0>P(a.primary().head,f.sel.primary().head)?-1:1;Hd(f,Id(f,a,z,!0));s&&!1===s.scroll||!f.cm||eb(f.cm)}function Hd(f,a){a.equals(f.sel)||
(f.sel=a,f.cm&&(f.cm.curOp.updateInput=f.cm.curOp.selectionChanged=f.cm.curOp.cursorActivity=!0),da(f,"cursorActivity",f))}function Jd(f){Hd(f,Id(f,f.sel,null,!1),rb)}function Id(f,a,s,z){for(var b,c=0;c<a.ranges.length;c++){var d=a.ranges[c],e=gc(f,d.anchor,s,z),g=gc(f,d.head,s,z);if(b||e!=d.anchor||g!=d.head)b||(b=a.ranges.slice(0,c)),b[c]=new U(e,g)}return b?ka(b,a.primIndex):a}function gc(f,a,s,z){var b=!1,c=a,d=s||1;f.cantEdit=!1;a:for(;;){var e=I(f,c.line);if(e.markedSpans)for(var g=0;g<e.markedSpans.length;++g){var h=
e.markedSpans[g],l=h.marker;if((null==h.from||(l.inclusiveLeft?h.from<=c.ch:h.from<c.ch))&&(null==h.to||(l.inclusiveRight?h.to>=c.ch:h.to>c.ch))){if(z&&($(l,"beforeCursorEnter"),l.explicitlyCleared))if(e.markedSpans){--g;continue}else break;if(l.atomic){g=l.find(0>d?-1:1);if(0==P(g,c)&&(g.ch+=d,0>g.ch?g=g.line>f.first?G(f,B(g.line-1)):null:g.ch>e.text.length&&(g=g.line<f.first+f.size-1?B(g.line+1,0):null),!g)){if(b){if(!z)return gc(f,a,s,!0);f.cantEdit=!0;return B(f.first,0)}b=!0;g=a;d=-d}c=g;continue a}}}return c}}
function Wc(f){for(var a=f.display,s=f.doc,b=document.createDocumentFragment(),c=document.createDocumentFragment(),d=0;d<s.sel.ranges.length;d++){var e=s.sel.ranges[d],g=e.empty();if(g||f.options.showCursorWhenSelecting){var h=f,l=b,k=Qa(h,e.head,"div"),p=l.appendChild(H("div","\u00a0","CodeMirror-cursor"));p.style.left=k.left+"px";p.style.top=k.top+"px";p.style.height=Math.max(0,k.bottom-k.top)*h.options.cursorHeight+"px";k.other&&(h=l.appendChild(H("div","\u00a0","CodeMirror-cursor CodeMirror-secondarycursor")),
h.style.display="",h.style.left=k.other.left+"px",h.style.top=k.other.top+"px",h.style.height=0.85*(k.other.bottom-k.other.top)+"px")}g||Oe(f,e,c)}f.options.moveInputWithCursor&&(s=Qa(f,s.sel.primary().head,"div"),d=a.wrapper.getBoundingClientRect(),e=a.lineDiv.getBoundingClientRect(),f=Math.max(0,Math.min(a.wrapper.clientHeight-10,s.top+e.top-d.top)),s=Math.max(0,Math.min(a.wrapper.clientWidth-10,s.left+e.left-d.left)),a.inputDiv.style.top=f+"px",a.inputDiv.style.left=s+"px");Ha(a.cursorDiv,b);Ha(a.selectionDiv,
c)}function Oe(f,a,s){function b(f,a,t,s){0>a&&(a=0);g.appendChild(H("div",null,"CodeMirror-selected","position: absolute; left: "+f+"px; top: "+a+"px; width: "+(null==t?k-f:t)+"px; height: "+(s-a)+"px"))}function c(a,t,s){var d=I(e,a),ea=d.text.length,qa,g;Pe(Ia(d),t||0,null==s?ea:s,function(c,e,ra){var h=hc(f,B(a,c),"div",d,"left"),ma,bc;c==e?(ma=h,ra=bc=h.left):(ma=hc(f,B(a,e-1),"div",d,"right"),"rtl"==ra&&(ra=h,h=ma,ma=ra),ra=h.left,bc=ma.right);null==t&&0==c&&(ra=l);3<ma.top-h.top&&(b(ra,h.top,
null,h.bottom),ra=l,h.bottom<ma.top&&b(ra,h.bottom,null,ma.top));null==s&&e==ea&&(bc=k);if(!qa||h.top<qa.top||h.top==qa.top&&h.left<qa.left)qa=h;if(!g||ma.bottom>g.bottom||ma.bottom==g.bottom&&ma.right>g.right)g=ma;ra<l+1&&(ra=l);b(ra,ma.top,bc-ra,ma.bottom)});return{start:qa,end:g}}var d=f.display,e=f.doc,g=document.createDocumentFragment(),h=Kd(f.display),l=h.left,k=d.lineSpace.offsetWidth-h.right,d=a.from();a=a.to();if(d.line==a.line)c(d.line,d.ch,a.ch);else{var p=I(e,d.line),h=I(e,a.line),h=Ja(p)==
Ja(h),d=c(d.line,d.ch,h?p.text.length+1:null).end;a=c(a.line,h?0:null,a.ch).start;h&&(d.top<a.top-2?(b(d.right,d.top,null,d.bottom),b(l,a.top,a.left,a.bottom)):b(d.right,d.top,a.left-d.right,d.bottom));d.bottom<a.top&&b(l,d.bottom,null,a.top)}s.appendChild(g)}function ic(f){if(f.state.focused){var a=f.display;clearInterval(a.blinker);var s=!0;a.cursorDiv.style.visibility="";0<f.options.cursorBlinkRate&&(a.blinker=setInterval(function(){a.cursorDiv.style.visibility=(s=!s)?"":"hidden"},f.options.cursorBlinkRate))}}
function Eb(f,a){f.doc.mode.startState&&f.doc.frontier<f.display.viewTo&&f.state.highlight.set(a,Da(Qe,f))}function Qe(f){var a=f.doc;a.frontier<a.first&&(a.frontier=a.first);if(!(a.frontier>=f.display.viewTo)){var s=+new Date+f.options.workTime,b=Jb(a.mode,Kb(f,a.frontier));Na(f,function(){a.iter(a.frontier,Math.min(a.first+a.size,f.display.viewTo+500),function(c){if(a.frontier>=f.display.viewFrom){var d=c.styles;c.styles=Ld(f,c,b,!0);for(var e=!d||d.length!=c.styles.length,g=0;!e&&g<d.length;++g)e=
d[g]!=c.styles[g];e&&fb(f,a.frontier,"text");c.stateAfter=Jb(a.mode,b)}else Xc(f,c.text,b),c.stateAfter=0==a.frontier%5?Jb(a.mode,b):null;++a.frontier;if(+new Date>s)return Eb(f,f.options.workDelay),!0})})}}function Re(f,a,s){for(var b,c,d=f.doc,e=s?-1:a-(f.doc.mode.innerMode?1E3:100);a>e;--a){if(a<=d.first)return d.first;var g=I(d,a-1);if(g.stateAfter&&(!s||a<=d.frontier))return a;g=Ka(g.text,null,f.options.tabSize);if(null==c||b>g)c=a-1,b=g}return c}function Kb(f,a,s){var b=f.doc,c=f.display;if(!b.mode.startState)return!0;
var d=Re(f,a,s),e=d>b.first&&I(b,d-1).stateAfter,e=e?Jb(b.mode,e):Se(b.mode);b.iter(d,a,function(s){Xc(f,s.text,e);s.stateAfter=d==a-1||0==d%5||d>=c.viewFrom&&d<c.viewTo?Jb(b.mode,e):null;++d});s&&(b.frontier=d);return e}function Bd(f){return f.mover.offsetHeight-f.lineSpace.offsetHeight}function Kd(f){if(f.cachedPaddingH)return f.cachedPaddingH;var a=Ha(f.measure,H("pre","x")),a=window.getComputedStyle?window.getComputedStyle(a):a.currentStyle;return f.cachedPaddingH={left:parseInt(a.paddingLeft),
right:parseInt(a.paddingRight)}}function Md(f,a){if(a>=f.display.viewFrom&&a<f.display.viewTo)return f.display.view[Ib(f,a)];var s=f.display.externalMeasured;if(s&&a>=s.lineN&&a<s.lineN+s.size)return s}function dc(f,a){var s=Y(a),b=Md(f,s);b&&!b.text?b=null:b&&b.changes&&Q(f,b,s,F(f));if(!b){var c;c=Ja(a);b=Y(c);c=f.display.externalMeasured=new Nd(f.doc,c,b);c.lineN=b;b=c.built=Fd(f,c);c.text=b.pre;Ha(f.display.lineMeasure,b.pre);b=c}a:if(c=b,c.line==a)s={map:c.measure.map,cache:c.measure.cache};
else{for(var d=0;d<c.rest.length;d++)if(c.rest[d]==a){s={map:c.measure.maps[d],cache:c.measure.caches[d]};break a}for(d=0;d<c.rest.length;d++)if(Y(c.rest[d])>s){s={map:c.measure.maps[d],cache:c.measure.caches[d],before:!0};break a}s=void 0}return{line:a,view:b,rect:null,map:s.map,cache:s.cache,before:s.before,hasHeights:!1}}function Vc(f,a,s,b){a.before&&(s=-1);var c=s+(b||""),d;if(a.cache.hasOwnProperty(c))d=a.cache[c];else{a.rect||(a.rect=a.view.text.getBoundingClientRect());if(!a.hasHeights){var e=
a.view,g=a.rect,h=f.options.lineWrapping,l=h&&f.display.scroller.clientWidth;if(!e.measure.heights||h&&e.measure.width!=l){var k=e.measure.heights=[];if(h)for(e.measure.width=l,e=e.text.firstChild.getClientRects(),h=0;h<e.length-1;h++){var l=e[h],p=e[h+1];2<Math.abs(l.bottom-p.bottom)&&k.push((l.bottom+p.top)/2-g.top)}k.push(g.bottom-g.top)}a.hasHeights=!0}var g=b,k=a.map,m,r,q;for(b=0;b<k.length;b+=3){var v=k[b],u=k[b+1];if(s<v)r=0,q=1,d="left";else if(s<u)r=s-v,q=r+1;else if(b==k.length-3||s==u&&
k[b+3]>s)q=u-v,r=q-1,s>=u&&(d="right");if(null!=r){m=k[b+2];v==u&&g==(m.insertLeft?"left":"right")&&(d=g);if("left"==g&&0==r)for(;b&&k[b-2]==k[b-3]&&k[b-1].insertLeft;)m=k[(b-=3)+2],d="left";if("right"==g&&r==u-v)for(;b<k.length-3&&k[b+3]==k[b+4]&&!k[b+5].insertLeft;)m=k[(b+=3)+2],d="right";break}}if(3==m.nodeType){for(;r&&Lb(a.line.text.charAt(v+r));)--r;for(;v+q<u&&Lb(a.line.text.charAt(v+q));)++q;if(fa&&0==r&&q==u-v)s=m.parentNode.getBoundingClientRect();else if(na&&f.options.lineWrapping){var w=
Mb(m,r,q).getClientRects();s=w.length?w["right"==g?w.length-1:0]:Od}else s=Mb(m,r,q).getBoundingClientRect()}else 0<r&&(d=g="right"),s=f.options.lineWrapping&&1<(w=m.getClientRects()).length?w["right"==g?w.length-1:0]:m.getBoundingClientRect();!fa||r||s&&(s.left||s.right)||(s=(m=m.parentNode.getClientRects()[0])?{left:m.left,right:m.left+Fb(f.display),top:m.top,bottom:m.bottom}:Od);m=(s.bottom+s.top)/2-a.rect.top;r=a.view.measure.heights;for(b=0;b<r.length-1&&!(m<r[b]);b++);f=b?r[b-1]:0;m=r[b];d=
{left:("right"==d?s.right:s.left)-a.rect.left,right:("left"==d?s.left:s.right)-a.rect.left,top:f,bottom:m};s.left||s.right||(d.bogus=!0);d.bogus||(a.cache[c]=d)}return{left:d.left,right:d.right,top:d.top,bottom:d.bottom}}function Pd(f){if(f.measure&&(f.measure.cache={},f.measure.heights=null,f.rest))for(var a=0;a<f.rest.length;a++)f.measure.caches[a]={}}function Qd(f){f.display.externalMeasure=null;bb(f.display.lineMeasure);for(var a=0;a<f.display.view.length;a++)Pd(f.display.view[a])}function Gb(f){Qd(f);
f.display.cachedCharWidth=f.display.cachedTextHeight=f.display.cachedPaddingH=null;f.options.lineWrapping||(f.display.maxLineChanged=!0);f.display.lineNumChars=null}function Yc(f,a,s,b){if(a.widgets)for(var c=0;c<a.widgets.length;++c)if(a.widgets[c].above){var d=Nb(a.widgets[c]);s.top+=d;s.bottom+=d}if("line"==b)return s;b||(b="local");a=Ga(a);a="local"==b?a+f.display.lineSpace.offsetTop:a-f.display.viewOffset;if("page"==b||"window"==b)f=f.display.lineSpace.getBoundingClientRect(),a+=f.top+("window"==
b?0:window.pageYOffset||(document.documentElement||document.body).scrollTop),b=f.left+("window"==b?0:window.pageXOffset||(document.documentElement||document.body).scrollLeft),s.left+=b,s.right+=b;s.top+=a;s.bottom+=a;return s}function Rd(f,a,s){if("div"==s)return a;var b=a.left;a=a.top;"page"==s?(b-=window.pageXOffset||(document.documentElement||document.body).scrollLeft,a-=window.pageYOffset||(document.documentElement||document.body).scrollTop):"local"!=s&&s||(s=f.display.sizer.getBoundingClientRect(),
b+=s.left,a+=s.top);f=f.display.lineSpace.getBoundingClientRect();return{left:b-f.left,top:a-f.top}}function hc(f,a,s,b,c){b||(b=I(f.doc,a.line));var d=b;a=a.ch;b=Vc(f,dc(f,b),a,c);return Yc(f,d,b,s)}function Qa(f,a,s,b,c){function d(a,t){var e=Vc(f,c,a,t?"right":"left");t?e.left=e.right:e.right=e.left;return Yc(f,b,e,s)}function e(f,a){var t=g[a],s=t.level%2;f==Zc(t)&&a&&t.level<g[a-1].level?(t=g[--a],f=$c(t)-(t.level%2?0:1),s=!0):f==$c(t)&&a<g.length-1&&t.level<g[a+1].level&&(t=g[++a],f=Zc(t)-t.level%
2,s=!1);return s&&f==t.to&&f>t.from?d(f-1):d(f,s)}b=b||I(f.doc,a.line);c||(c=dc(f,b));var g=Ia(b);a=a.ch;if(!g)return d(a);var h=ad(g,a),h=e(a,h);null!=Ob&&(h.other=e(a,Ob));return h}function Sd(f,a){var s=0;a=G(f.doc,a);f.options.lineWrapping||(s=Fb(f.display)*a.ch);var b=I(f.doc,a.line),c=Ga(b)+f.display.lineSpace.offsetTop;return{left:s,right:s,top:c,bottom:c+b.height}}function jc(f,a,s,b){f=B(f,a);f.xRel=b;s&&(f.outside=!0);return f}function bd(f,a,s){var b=f.doc;s+=f.display.viewOffset;if(0>
s)return jc(b.first,0,!0,-1);var c=db(b,s),d=b.first+b.size-1;if(c>d)return jc(b.first+b.size-1,I(b,d).text.length,!0,1);0>a&&(a=0);for(b=I(b,c);;)if(c=Te(f,b,c,a,s),d=(b=cb(b,!1))&&b.find(0,!0),b&&(c.ch>d.from.ch||c.ch==d.from.ch&&0<c.xRel))c=Y(b=d.to.line);else return c}function Te(f,a,s,b,c){function d(b){b=Qa(f,B(s,b),"line",a,l);g=!0;if(e>b.bottom)return b.left-h;if(e<b.top)return b.left+h;g=!1;return b.left}var e=c-Ga(a),g=!1,h=2*f.display.wrapper.clientWidth,l=dc(f,a),k=Ia(a),m=a.text.length;
c=kc(a);var p=lc(a),r=d(c),q=g,v=d(p),u=g;if(b>v)return jc(s,p,u,1);for(;;){if(k?p==c||p==cd(a,c,1):1>=p-c){k=b<r||b-r<=v-b?c:p;for(b-=k==c?r:v;Lb(a.text.charAt(k));)++k;return jc(s,k,k==c?q:u,-1>b?-1:1<b?1:0)}var w=Math.ceil(m/2),A=c+w;if(k)for(var A=c,S=0;S<w;++S)A=cd(a,A,1);S=d(A);if(S>b){p=A;v=S;if(u=g)v+=1E3;m=w}else c=A,r=S,q=g,m-=w}}function $a(f){if(null!=f.cachedTextHeight)return f.cachedTextHeight;if(null==gb){gb=H("pre");for(var a=0;49>a;++a)gb.appendChild(document.createTextNode("x")),
gb.appendChild(H("br"));gb.appendChild(document.createTextNode("x"))}Ha(f.measure,gb);a=gb.offsetHeight/50;3<a&&(f.cachedTextHeight=a);bb(f.measure);return a||1}function Fb(f){if(null!=f.cachedCharWidth)return f.cachedCharWidth;var a=H("span","xxxxxxxxxx"),s=H("pre",[a]);Ha(f.measure,s);a=a.getBoundingClientRect();a=(a.right-a.left)/10;2<a&&(f.cachedCharWidth=a);return a||10}function sb(f){f.curOp={viewChanged:!1,startHeight:f.doc.height,forceUpdate:!1,updateInput:null,typing:!1,changeObjs:null,cursorActivity:!1,
selectionChanged:!1,updateMaxLine:!1,scrollLeft:null,scrollTop:null,scrollToPos:null,id:++Ue};mc++||(Wa=[])}function tb(f){var a=f.curOp,s=f.doc,b=f.display;f.curOp=null;a.updateMaxLine&&A(f);if(a.viewChanged||a.forceUpdate||null!=a.scrollTop||a.scrollToPos&&(a.scrollToPos.from.line<b.viewFrom||a.scrollToPos.to.line>=b.viewTo)||b.maxLineChanged&&f.options.lineWrapping){var c=w(f,{top:a.scrollTop,ensure:a.scrollToPos},a.forceUpdate);f.display.scroller.offsetHeight&&(f.doc.scrollTop=f.display.scroller.scrollTop)}!c&&
a.selectionChanged&&Wc(f);c||a.startHeight==f.doc.height||J(f);null!=a.scrollTop&&b.scroller.scrollTop!=a.scrollTop&&(c=Math.max(0,Math.min(b.scroller.scrollHeight-b.scroller.clientHeight,a.scrollTop)),b.scroller.scrollTop=b.scrollbarV.scrollTop=s.scrollTop=c);null!=a.scrollLeft&&b.scroller.scrollLeft!=a.scrollLeft&&(c=Math.max(0,Math.min(b.scroller.scrollWidth-b.scroller.clientWidth,a.scrollLeft)),b.scroller.scrollLeft=b.scrollbarH.scrollLeft=s.scrollLeft=c,v(f));if(a.scrollToPos){a:{s=G(f.doc,a.scrollToPos.from);
b=G(f.doc,a.scrollToPos.to);c=a.scrollToPos.margin;for(null==c&&(c=0);;){var d=!1,e=Qa(f,s),g=b&&b!=s?Qa(f,b):e,g=nc(f,Math.min(e.left,g.left),Math.min(e.top,g.top)-c,Math.max(e.left,g.left),Math.max(e.bottom,g.bottom)+c),h=f.doc.scrollTop,l=f.doc.scrollLeft;null!=g.scrollTop&&(Pb(f,g.scrollTop),1<Math.abs(f.doc.scrollTop-h)&&(d=!0));null!=g.scrollLeft&&(pb(f,g.scrollLeft),1<Math.abs(f.doc.scrollLeft-l)&&(d=!0));if(!d){s=e;break a}}s=void 0}a.scrollToPos.isCursor&&f.state.focused&&(b=s,c=f.display,
d=c.sizer.getBoundingClientRect(),s=null,0>b.top+d.top?s=!0:b.bottom+d.top>(window.innerHeight||document.documentElement.clientHeight)&&(s=!1),null==s||Ve||(b=H("div","\u200b",null,"position: absolute; top: "+(b.top-c.viewOffset-f.display.lineSpace.offsetTop)+"px; height: "+(b.bottom-b.top+Oa)+"px; left: "+b.left+"px; width: 2px;"),f.display.lineSpace.appendChild(b),b.scrollIntoView(s),f.display.lineSpace.removeChild(b)))}a.selectionChanged&&ic(f);f.state.focused&&a.updateInput&&Ea(f,a.typing);s=
a.maybeHiddenMarkers;b=a.maybeUnhiddenMarkers;if(s)for(c=0;c<s.length;++c)s[c].lines.length||$(s[c],"hide");if(b)for(c=0;c<b.length;++c)b[c].lines.length&&$(b[c],"unhide");var k;--mc||(k=Wa,Wa=null);if(a.changeObjs){for(c=0;c<a.changeObjs.length;c++)$(f,"change",f,a.changeObjs[c]);$(f,"changes",f,a.changeObjs)}a.cursorActivity&&$(f,"cursorActivity",f);if(k)for(c=0;c<k.length;++c)k[c]()}function Na(f,a){if(f.curOp)return a();sb(f);try{return a()}finally{tb(f)}}function ca(f,a){return function(){if(f.curOp)return a.apply(f,
arguments);sb(f);try{return a.apply(f,arguments)}finally{tb(f)}}}function aa(f){return function(){if(this.curOp)return f.apply(this,arguments);sb(this);try{return f.apply(this,arguments)}finally{tb(this)}}}function ta(f){return function(){var a=this.cm;if(!a||a.curOp)return f.apply(this,arguments);sb(a);try{return f.apply(this,arguments)}finally{tb(a)}}}function Nd(f,a,s){for(var b=this.line=a,c;b=cb(b,!1);)b=b.find(1,!0).line,(c||(c=[])).push(b);this.size=(this.rest=c)?Y(W(this.rest))-s+1:1;this.node=
this.text=null;this.hidden=ab(f,a)}function cc(f,a,s){var b=[],c;for(c=a;c<s;)a=new Nd(f.doc,I(f.doc,c),c),c+=a.size,b.push(a);return b}function va(f,a,b,c){null==a&&(a=f.doc.first);null==b&&(b=f.doc.first+f.doc.size);c||(c=0);var d=f.display;c&&b<d.viewTo&&(null==d.updateLineNumbers||d.updateLineNumbers>a)&&(d.updateLineNumbers=a);f.curOp.viewChanged=!0;if(a>=d.viewTo)Va&&Uc(f.doc,a)<d.viewTo&&Ua(f);else if(b<=d.viewFrom)Va&&Ed(f.doc,b+c)>d.viewFrom?Ua(f):(d.viewFrom+=c,d.viewTo+=c);else if(a<=d.viewFrom&&
b>=d.viewTo)Ua(f);else if(a<=d.viewFrom){var e=oc(f,b,b+c,1);e?(d.view=d.view.slice(e.index),d.viewFrom=e.lineN,d.viewTo+=c):Ua(f)}else if(b>=d.viewTo)(e=oc(f,a,a,-1))?(d.view=d.view.slice(0,e.index),d.viewTo=e.lineN):Ua(f);else{var e=oc(f,a,a,-1),g=oc(f,b,b+c,1);e&&g?(d.view=d.view.slice(0,e.index).concat(cc(f,e.lineN,g.lineN)).concat(d.view.slice(g.index)),d.viewTo+=c):Ua(f)}if(f=d.externalMeasured)b<f.lineN?f.lineN+=c:a<f.lineN+f.size&&(d.externalMeasured=null)}function fb(f,a,b){f.curOp.viewChanged=
!0;var c=f.display,d=f.display.externalMeasured;d&&a>=d.lineN&&a<d.lineN+d.size&&(c.externalMeasured=null);a<c.viewFrom||a>=c.viewTo||(f=c.view[Ib(f,a)],null!=f.node&&(f=f.changes||(f.changes=[]),-1==ha(f,b)&&f.push(b)))}function Ua(f){f.display.viewFrom=f.display.viewTo=f.doc.first;f.display.view=[];f.display.viewOffset=0}function Ib(f,a){if(a>=f.display.viewTo)return null;a-=f.display.viewFrom;if(0>a)return null;for(var b=f.display.view,c=0;c<b.length;c++)if(a-=b[c].size,0>a)return c}function oc(f,
a,b,c){var d=Ib(f,a),e=f.display.view;if(!Va)return{index:d,lineN:b};for(var g=0,h=f.display.viewFrom;g<d;g++)h+=e[g].size;if(h!=a){if(0<c){if(d==e.length-1)return null;a=h+e[d].size-a;d++}else a=h-a;b+=a}for(;Uc(f.doc,b)!=b;){if(d==(0>c?0:e.length-1))return null;b+=c*e[d-(0>c?1:0)].size;d+=c}return{index:d,lineN:b}}function Dd(f){f=f.display.view;for(var a=0,b=0;b<f.length;b++){var c=f[b];c.hidden||c.node&&!c.changes||++a}return a}function pc(f){f.display.pollingFast||f.display.poll.set(f.options.pollInterval,
function(){dd(f);f.state.focused&&pc(f)})}function Qb(f){function a(){dd(f)||b?(f.display.pollingFast=!1,pc(f)):(b=!0,f.display.poll.set(60,a))}var b=!1;f.display.pollingFast=!0;f.display.poll.set(20,a)}function dd(f){var a=f.display.input,b=f.display.prevInput,c=f.doc;if(!f.state.focused||We(a)||qc(f)||f.options.disableInput)return!1;var d=a.value;if(d==b&&!f.somethingSelected())return!1;if(na&&!fa&&f.display.inputHasSelection===d)return Ea(f),!1;var e=!f.curOp;e&&sb(f);f.display.shift=!1;for(var g=
0,h=Math.min(b.length,d.length);g<h&&b.charCodeAt(g)==d.charCodeAt(g);)++g;for(var h=d.slice(g),l=ub(h),k=f.state.pasteIncoming&&1<l.length&&c.sel.ranges.length==l.length,m=c.sel.ranges.length-1;0<=m;m--){var p=c.sel.ranges[m],r=p.from(),q=p.to();g<b.length?r=B(r.line,r.ch-(b.length-g)):f.state.overwrite&&p.empty()&&!f.state.pasteIncoming&&(q=B(q.line,Math.min(I(c,q.line).text.length,q.ch+W(l).length)));var v=f.curOp.updateInput,r={from:r,to:q,text:k?[l[m]]:l,origin:f.state.pasteIncoming?"paste":
f.state.cutIncoming?"cut":"+input"};vb(f.doc,r);da(f,"inputRead",f,r);if(h&&!f.state.pasteIncoming&&f.options.electricChars&&f.options.smartIndent&&100>p.head.ch&&(!m||c.sel.ranges[m-1].head.line!=p.head.line)&&(r=f.getModeAt(p.head).electricChars))for(q=0;q<r.length;q++)if(-1<h.indexOf(r.charAt(q))){rc(f,p.head.line,"smart");break}}eb(f);f.curOp.updateInput=v;f.curOp.typing=!0;1E3<d.length||-1<d.indexOf("\n")?a.value=f.display.prevInput="":f.display.prevInput=d;e&&tb(f);f.state.pasteIncoming=f.state.cutIncoming=
!1;return!0}function Ea(f,a){var b,c,d=f.doc;f.somethingSelected()?(f.display.prevInput="",b=d.sel.primary(),c=(b=Td&&(100<b.to().line-b.from().line||1E3<(c=f.getSelection()).length))?"-":c||f.getSelection(),f.display.input.value=c,f.state.focused&&sc(f.display.input),na&&!fa&&(f.display.inputHasSelection=c)):a||(f.display.prevInput=f.display.input.value="",na&&!fa&&(f.display.inputHasSelection=null));f.display.inaccurateSelection=b}function pa(f){"nocursor"==f.options.readOnly||Oc&&Ta()==f.display.input||
f.display.input.focus()}function ed(f){f.state.focused||(pa(f),Qc(f))}function qc(f){return f.options.readOnly||f.doc.cantEdit}function Le(f){function a(){f.state.focused&&setTimeout(Da(pa,f),0)}function b(){null==h&&(h=setTimeout(function(){h=null;g.cachedCharWidth=g.cachedTextHeight=g.cachedPaddingH=Rb=null;f.setSize()},100))}function c(){Ud(document.body,g.wrapper)?setTimeout(c,5E3):Xa(window,"resize",b)}function d(a){La(f,a)||fd(a)}function e(a){g.inaccurateSelection&&(g.prevInput="",g.inaccurateSelection=
!1,g.input.value=f.getSelection(),sc(g.input));"cut"==a.type&&(f.state.cutIncoming=!0)}var g=f.display;N(g.scroller,"mousedown",ca(f,Cd));za?N(g.scroller,"dblclick",ca(f,function(a){if(!La(f,a)){var t=hb(f,a);!t||gd(f,a,"gutterClick",!0,da)||ib(f.display,a)||(ia(a),a=hd(f.doc,t),oa(f.doc,a.anchor,a.head))}})):N(g.scroller,"dblclick",function(a){La(f,a)||ia(a)});N(g.lineSpace,"selectstart",function(f){ib(g,f)||ia(f)});id||N(g.scroller,"contextmenu",function(a){Vd(f,a)});N(g.scroller,"scroll",function(){g.scroller.clientHeight&&
(Pb(f,g.scroller.scrollTop),pb(f,g.scroller.scrollLeft,!0),$(f,"scroll",f))});N(g.scrollbarV,"scroll",function(){g.scroller.clientHeight&&Pb(f,g.scrollbarV.scrollTop)});N(g.scrollbarH,"scroll",function(){g.scroller.clientHeight&&pb(f,g.scrollbarH.scrollLeft)});N(g.scroller,"mousewheel",function(a){Wd(f,a)});N(g.scroller,"DOMMouseScroll",function(a){Wd(f,a)});N(g.scrollbarH,"mousedown",a);N(g.scrollbarV,"mousedown",a);N(g.wrapper,"scroll",function(){g.wrapper.scrollTop=g.wrapper.scrollLeft=0});var h;
N(window,"resize",b);setTimeout(c,5E3);N(g.input,"keyup",ca(f,Xd));N(g.input,"input",function(){na&&!fa&&f.display.inputHasSelection&&(f.display.inputHasSelection=null);Qb(f)});N(g.input,"keydown",ca(f,Yd));N(g.input,"keypress",ca(f,Zd));N(g.input,"focus",Da(Qc,f));N(g.input,"blur",Da(Rc,f));f.options.dragDrop&&(N(g.scroller,"dragstart",function(a){if(za&&(!f.state.draggingText||100>+new Date-$d))fd(a);else if(!La(f,a)&&!ib(f.display,a)&&(a.dataTransfer.setData("Text",f.getSelection()),a.dataTransfer.setDragImage&&
!ae)){var t=H("img",null,null,"position: fixed; left: 0; top: 0;");t.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";Ba&&(t.width=t.height=1,f.display.wrapper.appendChild(t),t._top=t.offsetTop);a.dataTransfer.setDragImage(t,0,0);Ba&&t.parentNode.removeChild(t)}}),N(g.scroller,"dragenter",d),N(g.scroller,"dragover",d),N(g.scroller,"drop",ca(f,Xe)));N(g.scroller,"paste",function(a){ib(g,a)||(f.state.pasteIncoming=!0,pa(f),Qb(f))});N(g.input,"paste",function(){f.state.pasteIncoming=
!0;Qb(f)});N(g.input,"cut",e);N(g.input,"copy",e);Tc&&N(g.sizer,"mouseup",function(){Ta()==g.input&&g.input.blur();pa(f)})}function ib(f,a){for(var b=a.target||a.srcElement;b!=f.wrapper;b=b.parentNode)if(!b||b.ignoreEvents||b.parentNode==f.sizer&&b!=f.mover)return!0}function hb(f,a,b,c){var d=f.display;if(!b&&(b=a.target||a.srcElement,b==d.scrollbarH||b==d.scrollbarV||b==d.scrollbarFiller||b==d.gutterFiller))return null;var e,g,d=d.lineSpace.getBoundingClientRect();try{e=a.clientX-d.left,g=a.clientY-
d.top}catch(h){return null}a=bd(f,e,g);var l;c&&1==a.xRel&&(l=I(f.doc,a.line).text).length==a.ch&&(c=Ka(l,l.length,f.options.tabSize)-l.length,a=B(a.line,Math.round((e-Kd(f.display).left)/Fb(f.display))-c));return a}function Cd(f){if(!La(this,f)){var a=this.display;a.shift=f.shiftKey;if(ib(a,f))sa||(a.scroller.draggable=!1,setTimeout(function(){a.scroller.draggable=!0},100));else if(!gd(this,f,"gutterClick",!0,da)){var b=hb(this,f);window.focus();switch(be(f)){case 1:b?Ye(this,f,b):(f.target||f.srcElement)==
a.scroller&&ia(f);break;case 2:sa&&(this.state.lastMiddleDown=+new Date);b&&oa(this.doc,b);setTimeout(Da(pa,this),20);ia(f);break;case 3:id&&Vd(this,f)}}}}function Ye(f,a,b){setTimeout(Da(ed,f),0);var c=+new Date,d;tc&&tc.time>c-400&&0==P(tc.pos,b)?d="triple":uc&&uc.time>c-400&&0==P(uc.pos,b)?(d="double",tc={time:c,pos:b}):(d="single",uc={time:c,pos:b});c=f.doc.sel;f.options.dragDrop&&Ze&&!qc(f)&&"single"==d&&-1<c.contains(b)&&c.somethingSelected()?$e(f,a,b):af(f,a,b,d,!1)}function $e(f,a,b){var c=
f.display,d=ca(f,function(e){sa&&(c.scroller.draggable=!1);f.state.draggingText=!1;Xa(document,"mouseup",d);Xa(c.scroller,"drop",d);10>Math.abs(a.clientX-e.clientX)+Math.abs(a.clientY-e.clientY)&&(ia(e),oa(f.doc,b),pa(f),za&&!fa&&setTimeout(function(){document.body.focus();pa(f)},20))});sa&&(c.scroller.draggable=!0);f.state.draggingText=d;c.scroller.dragDrop&&c.scroller.dragDrop();N(document,"mouseup",d);N(c.scroller,"drop",d)}function af(f,a,b,c,d){function e(a){if(0!=P(q,a))if(q=a,"rect"==c){var t=
[],d=f.options.tabSize,g=Ka(I(k,b.line).text,b.ch,d),ea=Ka(I(k,a.line).text,a.ch,d),qa=Math.min(g,ea),g=Math.max(g,ea),ea=Math.min(b.line,a.line);for(a=Math.min(f.lastLine(),Math.max(b.line,a.line));ea<=a;ea++){var h=I(k,ea).text,l=ce(h,qa,d);qa==g?t.push(new U(B(ea,l),B(ea,l))):h.length>l&&t.push(new U(B(ea,l),B(ea,ce(h,g,d))))}t.length||t.push(new U(b,b));ba(k,ka(r.ranges.slice(0,p).concat(t),p),vc)}else t=m,d=t.anchor,qa=a,"single"!=c&&(a="double"==c?hd(k,a):new U(B(a.line,0),G(k,B(a.line+1,0))),
0<P(a.anchor,d)?(qa=a.head,d=Za(t.from(),a.anchor)):(qa=a.anchor,d=Ra(t.to(),a.head))),t=r.ranges.slice(0),t[p]=new U(G(k,d),qa),ba(k,ka(t,p),vc)}function g(a){var t=++u,b=hb(f,a,!0,"rect"==c);if(b)if(0!=P(b,q)){ed(f);e(b);var s=C(l,k);(b.line>=s.to||b.line<s.from)&&setTimeout(ca(f,function(){u==t&&g(a)}),150)}else{var d=a.clientY<v.top?-20:a.clientY>v.bottom?20:0;d&&setTimeout(ca(f,function(){u==t&&(l.scroller.scrollTop+=d,g(a))}),50)}}function h(a){u=Infinity;ia(a);pa(f);Xa(document,"mousemove",
w);Xa(document,"mouseup",A);k.history.lastSelOrigin=null}var l=f.display,k=f.doc;ia(a);var m,p,r=k.sel;d?(p=k.sel.contains(b),m=-1<p?k.sel.ranges[p]:new U(b,b)):m=k.sel.primary();a.altKey?(c="rect",d||(m=new U(b,b)),b=hb(f,a,!0,!0),p=-1):"double"==c?(a=hd(k,b),m=f.display.shift||k.extend?xa(k,m,a.anchor,a.head):a):"triple"==c?(a=new U(B(b.line,0),G(k,B(b.line+1,0))),m=f.display.shift||k.extend?xa(k,m,a.anchor,a.head):a):m=xa(k,m,b);d?-1<p?Ab(k,p,m,vc):(p=k.sel.ranges.length,ba(k,ka(k.sel.ranges.concat([m]),
p),{scroll:!1,origin:"*mouse"})):(p=0,ba(k,new L([m],0),vc));var q=b,v=l.wrapper.getBoundingClientRect(),u=0,w=ca(f,function(f){(na&&!bf?f.buttons:be(f))?g(f):h(f)}),A=ca(f,h);N(document,"mousemove",w);N(document,"mouseup",A)}function gd(f,a,b,c,d){try{var e=a.clientX,g=a.clientY}catch(h){return!1}if(e>=Math.floor(f.display.gutters.getBoundingClientRect().right))return!1;c&&ia(a);c=f.display;var k=c.lineDiv.getBoundingClientRect();if(g>k.bottom||!Aa(f,b))return jd(a);g-=k.top-c.viewOffset;for(k=0;k<
f.options.gutters.length;++k){var l=c.gutters.childNodes[k];if(l&&l.getBoundingClientRect().right>=e)return e=db(f.doc,g),d(f,b,f,e,f.options.gutters[k],a),jd(a)}}function Xe(f){var a=this;if(!La(a,f)&&!ib(a.display,f)){ia(f);za&&($d=+new Date);var b=hb(a,f,!0),c=f.dataTransfer.files;if(b&&!qc(a))if(c&&c.length&&window.FileReader&&window.File){var d=c.length,e=Array(d),g=0;f=function(f,c){var z=new FileReader;z.onload=function(){e[c]=z.result;if(++g==d){b=G(a.doc,b);var f={from:b,to:b,text:ub(e.join("\n")),
origin:"paste"};vb(a.doc,f);Bb(a.doc,ua(b,wb(f)))}};z.readAsText(f)};for(var h=0;h<d;++h)f(c[h],h)}else if(a.state.draggingText&&-1<a.doc.sel.contains(b))a.state.draggingText(f),setTimeout(Da(pa,a),20);else try{if(e=f.dataTransfer.getData("Text")){var k=a.state.draggingText&&a.listSelections();ec(a.doc,ua(b,b));if(k)for(h=0;h<k.length;++h)wc(a.doc,"",k[h].anchor,k[h].head,"drag");a.replaceSelection(e,"around","paste");pa(a)}}catch(l){}}}function Pb(f,a){2>Math.abs(f.doc.scrollTop-a)||(f.doc.scrollTop=
a,Sb||w(f,{top:a}),f.display.scroller.scrollTop!=a&&(f.display.scroller.scrollTop=a),f.display.scrollbarV.scrollTop!=a&&(f.display.scrollbarV.scrollTop=a),Sb&&w(f),Eb(f,100))}function pb(f,a,b){(b?a==f.doc.scrollLeft:2>Math.abs(f.doc.scrollLeft-a))||(a=Math.min(a,f.display.scroller.scrollWidth-f.display.scroller.clientWidth),f.doc.scrollLeft=a,v(f),f.display.scroller.scrollLeft!=a&&(f.display.scroller.scrollLeft=a),f.display.scrollbarH.scrollLeft!=a&&(f.display.scrollbarH.scrollLeft=a))}function Wd(f,
a){var b=a.wheelDeltaX,c=a.wheelDeltaY;null==b&&a.detail&&a.axis==a.HORIZONTAL_AXIS&&(b=a.detail);null==c&&a.detail&&a.axis==a.VERTICAL_AXIS?c=a.detail:null==c&&(c=a.wheelDelta);var d=f.display,e=d.scroller;if(b&&e.scrollWidth>e.clientWidth||c&&e.scrollHeight>e.clientHeight){if(c&&qb&&sa){var g=a.target,h=d.view;a:for(;g!=e;g=g.parentNode)for(var k=0;k<h.length;k++)if(h[k].node==g){f.display.currentWheelTarget=g;break a}}!b||Sb||Ba||null==Ca?(c&&null!=Ca&&(g=c*Ca,h=f.doc.scrollTop,k=h+d.wrapper.clientHeight,
0>g?h=Math.max(0,h+g-50):k=Math.min(f.doc.height,k+g+50),w(f,{top:h,bottom:k})),20>xc&&(null==d.wheelStartX?(d.wheelStartX=e.scrollLeft,d.wheelStartY=e.scrollTop,d.wheelDX=b,d.wheelDY=c,setTimeout(function(){if(null!=d.wheelStartX){var f=e.scrollLeft-d.wheelStartX,a=e.scrollTop-d.wheelStartY,f=a&&d.wheelDY&&a/d.wheelDY||f&&d.wheelDX&&f/d.wheelDX;d.wheelStartX=d.wheelStartY=null;f&&(Ca=(Ca*xc+f)/(xc+1),++xc)}},200)):(d.wheelDX+=b,d.wheelDY+=c))):(c&&Pb(f,Math.max(0,Math.min(e.scrollTop+c*Ca,e.scrollHeight-
e.clientHeight))),pb(f,Math.max(0,Math.min(e.scrollLeft+b*Ca,e.scrollWidth-e.clientWidth))),ia(a),d.wheelStartX=null)}}function yc(f,a,b){if("string"==typeof a&&(a=zc[a],!a))return!1;f.display.pollingFast&&dd(f)&&(f.display.pollingFast=!1);var c=f.display.shift,d=!1;try{qc(f)&&(f.state.suppressEdits=!0),b&&(f.display.shift=!1),d=a(f)!=de}finally{f.display.shift=c,f.state.suppressEdits=!1}return d}function ee(f){var a=f.state.keyMaps.slice(0);f.options.extraKeys&&a.push(f.options.extraKeys);a.push(f.options.keyMap);
return a}function fe(f,a){var b=kd(f.options.keyMap),c=b.auto;clearTimeout(ge);c&&!cf(a)&&(ge=setTimeout(function(){kd(f.options.keyMap)==b&&(f.options.keyMap=c.call?c.call(null,f):c,h(f))},50));var d=df(a,!0),e=!1;if(!d)return!1;e=ee(f);if(e=a.shiftKey?Ac("Shift-"+d,e,function(a){return yc(f,a,!0)})||Ac(d,e,function(a){if("string"==typeof a?/^go[A-Z]/.test(a):a.motion)return yc(f,a)}):Ac(d,e,function(a){return yc(f,a)}))ia(a),ic(f),da(f,"keyHandled",f,d,a);return e}function ef(f,a,b){var c=Ac("'"+
b+"'",ee(f),function(a){return yc(f,a,!0)});c&&(ia(a),ic(f),da(f,"keyHandled",f,"'"+b+"'",a));return c}function Yd(f){ed(this);if(!La(this,f)){za&&27==f.keyCode&&(f.returnValue=!1);var a=f.keyCode;this.display.shift=16==a||f.shiftKey;var b=fe(this,f);Ba&&(ld=b?a:null,!b&&88==a&&!Td&&(qb?f.metaKey:f.ctrlKey)&&this.replaceSelection("",null,"cut"))}}function Xd(f){La(this,f)||16!=f.keyCode||(this.doc.sel.shift=!1)}function Zd(f){if(!La(this,f)){var a=f.keyCode,b=f.charCode;Ba&&a==ld?(ld=null,ia(f)):
(Ba&&(!f.which||10>f.which)||Tc)&&fe(this,f)||(a=String.fromCharCode(null==b?a:b),ef(this,f,a)||(na&&!fa&&(this.display.inputHasSelection=null),Qb(this)))}}function Qc(f){"nocursor"!=f.options.readOnly&&(f.state.focused||($(f,"focus",f),f.state.focused=!0,-1==f.display.wrapper.className.search(/\bCodeMirror-focused\b/)&&(f.display.wrapper.className+=" CodeMirror-focused"),f.curOp||(Ea(f),sa&&setTimeout(Da(Ea,f,!0),0))),pc(f),ic(f))}function Rc(f){f.state.focused&&($(f,"blur",f),f.state.focused=!1,
f.display.wrapper.className=f.display.wrapper.className.replace(" CodeMirror-focused",""));clearInterval(f.display.blinker);setTimeout(function(){f.state.focused||(f.display.shift=!1)},150)}function Vd(f,a){function b(){if(null!=d.input.selectionStart){var a=d.input.value="\u200b"+(f.somethingSelected()?d.input.value:"");d.prevInput="\u200b";d.input.selectionStart=1;d.input.selectionEnd=a.length}}function c(){d.inputDiv.style.position="relative";d.input.style.cssText=h;fa&&(d.scrollbarV.scrollTop=
d.scroller.scrollTop=g);pc(f);if(null!=d.input.selectionStart){na&&!fa||b();clearTimeout(md);var a=0,t=function(){"\u200b"==d.prevInput&&0==d.input.selectionStart?ca(f,zc.selectAll)(f):10>a++?md=setTimeout(t,500):Ea(f)};md=setTimeout(t,200)}}if(!La(f,a,"contextmenu")){var d=f.display;if(!ib(d,a)&&!ff(f,a)){var e=hb(f,a),g=d.scroller.scrollTop;if(e&&!Ba){f.options.resetSelectionOnContextMenu&&-1==f.doc.sel.contains(e)&&ca(f,ba)(f.doc,ua(e),rb);var h=d.input.style.cssText;d.inputDiv.style.position=
"absolute";d.input.style.cssText="position: fixed; width: 30px; height: 30px; top: "+(a.clientY-5)+"px; left: "+(a.clientX-5)+"px; z-index: 1000; background: "+(na?"rgba(255, 255, 255, .05)":"transparent")+"; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";pa(f);Ea(f);f.somethingSelected()||(d.input.value=d.prevInput=" ");na&&!fa&&b();if(id){fd(a);var k=function(){Xa(window,"mouseup",k);setTimeout(c,20)};N(window,"mouseup",k)}else setTimeout(c,
50)}}}}function ff(f,a){return Aa(f,"gutterContextMenu")?gd(f,a,"gutterContextMenu",!1,$):!1}function he(f,a){if(0>P(f,a.from))return f;if(0>=P(f,a.to))return wb(a);var b=f.line+a.text.length-(a.to.line-a.from.line)-1,c=f.ch;f.line==a.to.line&&(c+=wb(a).ch-a.to.ch);return B(b,c)}function nd(f,a){for(var b=[],c=0;c<f.sel.ranges.length;c++){var d=f.sel.ranges[c];b.push(new U(he(d.anchor,a),he(d.head,a)))}return ka(b,f.sel.primIndex)}function ie(f,a,b){return f.line==a.line?B(b.line,f.ch-a.ch+b.ch):
B(b.line+(f.line-a.line),f.ch)}function je(f,a,b){a={canceled:!1,from:a.from,to:a.to,text:a.text,origin:a.origin,cancel:function(){this.canceled=!0}};b&&(a.update=function(a,b,t,c){a&&(this.from=G(f,a));b&&(this.to=G(f,b));t&&(this.text=t);void 0!==c&&(this.origin=c)});$(f,"beforeChange",f,a);f.cm&&$(f.cm,"beforeChange",f.cm,a);return a.canceled?null:{from:a.from,to:a.to,text:a.text,origin:a.origin}}function vb(f,a,b){if(f.cm){if(!f.cm.curOp)return ca(f.cm,vb)(f,a,b);if(f.cm.state.suppressEdits)return}if(Aa(f,
"beforeChange")||f.cm&&Aa(f.cm,"beforeChange"))if(a=je(f,a,!0),!a)return;if(b=ke&&!b&&gf(f,a.from,a.to))for(var c=b.length-1;0<=c;--c)le(f,{from:b[c].from,to:b[c].to,text:c?[""]:a.text});else le(f,a)}function le(f,a){if(1!=a.text.length||""!=a.text[0]||0!=P(a.from,a.to)){var b=nd(f,a);me(f,a,b,f.cm?f.cm.curOp.id:NaN);Tb(f,a,b,od(f,a));var c=[];xb(f,function(f,b){b||-1!=ha(c,f.history)||(ne(f.history,a),c.push(f.history));Tb(f,a,null,od(f,a))})}}function Bc(f,a,b){if(!f.cm||!f.cm.state.suppressEdits){for(var c=
f.history,d,e=f.sel,g="undo"==a?c.done:c.undone,h="undo"==a?c.undone:c.done,k=0;k<g.length&&(d=g[k],b?!d.ranges||d.equals(f.sel):d.ranges);k++);if(k!=g.length){for(c.lastOrigin=c.lastSelOrigin=null;;)if(d=g.pop(),d.ranges){fc(d,h);if(b&&!d.equals(f.sel)){ba(f,d,{clearRedo:!1});return}e=d}else break;b=[];fc(e,h);h.push({changes:b,generation:c.generation});c.generation=d.generation||++c.maxGeneration;c=Aa(f,"beforeChange")||f.cm&&Aa(f.cm,"beforeChange");for(k=d.changes.length-1;0<=k;--k){var l=d.changes[k];
l.origin=a;if(c&&!je(f,l,!1)){g.length=0;break}b.push(pd(f,l));e=k?nd(f,l,null):W(g);Tb(f,l,e,oe(f,l));f.cm&&eb(f.cm);var m=[];xb(f,function(f,a){a||-1!=ha(m,f.history)||(ne(f.history,l),m.push(f.history));Tb(f,l,null,oe(f,l))})}}}}function pe(f,a){f.first+=a;f.sel=new L(qd(f.sel.ranges,function(f){return new U(B(f.anchor.line+a,f.anchor.ch),B(f.head.line+a,f.head.ch))}),f.sel.primIndex);f.cm&&va(f.cm,f.first,f.first-a,a)}function Tb(f,a,b,c){if(f.cm&&!f.cm.curOp)return ca(f.cm,Tb)(f,a,b,c);if(a.to.line<
f.first)pe(f,a.text.length-1-(a.to.line-a.from.line));else if(!(a.from.line>f.lastLine())){if(a.from.line<f.first){var d=a.text.length-1-(f.first-a.from.line);pe(f,d);a={from:B(f.first,0),to:B(a.to.line+d,a.to.ch),text:[W(a.text)],origin:a.origin}}d=f.lastLine();a.to.line>d&&(a={from:a.from,to:B(d,I(f,d).text.length),text:[a.text[0]],origin:a.origin});a.removed=Ub(f,a.from,a.to);b||(b=nd(f,a,null));f.cm?hf(f.cm,a,c):rd(f,a,c);ec(f,b,rb)}}function hf(f,a,b){var c=f.doc,d=f.display,g=a.from,h=a.to,
k=!1,l=g.line;f.options.lineWrapping||(l=Y(Ja(I(c,g.line))),c.iter(l,h.line+1,function(f){if(f==d.maxLine)return k=!0}));-1<c.sel.contains(a.from,a.to)&&(f.curOp.cursorActivity=!0);rd(c,a,b,e(f));f.options.lineWrapping||(c.iter(l,g.line+a.text.length,function(f){var a=u(f);a>d.maxLineLength&&(d.maxLine=f,d.maxLineLength=a,d.maxLineChanged=!0,k=!1)}),k&&(f.curOp.updateMaxLine=!0));c.frontier=Math.min(c.frontier,g.line);Eb(f,400);b=a.text.length-(h.line-g.line)-1;g.line!=h.line||1!=a.text.length||qe(f.doc,
a)?va(f,g.line,h.line+1,b):fb(f,g.line,"text");(Aa(f,"change")||Aa(f,"changes"))&&(f.curOp.changeObjs||(f.curOp.changeObjs=[])).push({from:g,to:h,text:a.text,removed:a.removed,origin:a.origin})}function wc(f,a,b,c,d){c||(c=b);if(0>P(c,b)){var e=c;c=b;b=e}"string"==typeof a&&(a=ub(a));vb(f,{from:b,to:c,text:a,origin:d})}function nc(f,a,b,c,d){var e=f.display,g=$a(f.display);0>b&&(b=0);var h=f.curOp&&null!=f.curOp.scrollTop?f.curOp.scrollTop:e.scroller.scrollTop,k=e.scroller.clientHeight-Oa,l={},m=
f.doc.height+Bd(e),p=b<g,g=d>m-g;b<h?l.scrollTop=p?0:b:d>h+k&&(b=Math.min(b,(g?m:d)-k),b!=h&&(l.scrollTop=b));f=f.curOp&&null!=f.curOp.scrollLeft?f.curOp.scrollLeft:e.scroller.scrollLeft;h=e.scroller.clientWidth-Oa;a+=e.gutters.offsetWidth;c+=e.gutters.offsetWidth;e=e.gutters.offsetWidth;b=a<e+10;a<f+e||b?(b&&(a=0),l.scrollLeft=Math.max(0,a-10-e)):c>h+f-3&&(l.scrollLeft=c+10-h);return l}function Cc(f,a,b){null==a&&null==b||Dc(f);null!=a&&(f.curOp.scrollLeft=(null==f.curOp.scrollLeft?f.doc.scrollLeft:
f.curOp.scrollLeft)+a);null!=b&&(f.curOp.scrollTop=(null==f.curOp.scrollTop?f.doc.scrollTop:f.curOp.scrollTop)+b)}function eb(f){Dc(f);var a=f.getCursor(),b=a,c=a;f.options.lineWrapping||(b=a.ch?B(a.line,a.ch-1):a,c=B(a.line,a.ch+1));f.curOp.scrollToPos={from:b,to:c,margin:f.options.cursorScrollMargin,isCursor:!0}}function Dc(a){var b=a.curOp.scrollToPos;if(b){a.curOp.scrollToPos=null;var c=Sd(a,b.from),d=Sd(a,b.to),b=nc(a,Math.min(c.left,d.left),Math.min(c.top,d.top)-b.margin,Math.max(c.right,d.right),
Math.max(c.bottom,d.bottom)+b.margin);a.scrollTo(b.scrollLeft,b.scrollTop)}}function rc(a,b,c,d){var e=a.doc,g;null==c&&(c="add");"smart"==c&&(a.doc.mode.indent?g=Kb(a,b):c="prev");var h=a.options.tabSize,k=I(e,b),l=Ka(k.text,null,h);k.stateAfter&&(k.stateAfter=null);var m=k.text.match(/^\s*/)[0],p;if(!d&&!/\S/.test(k.text))p=0,c="not";else if("smart"==c&&(p=a.doc.mode.indent(g,k.text.slice(m.length),k.text),p==de)){if(!d)return;c="prev"}"prev"==c?p=b>e.first?Ka(I(e,b-1).text,null,h):0:"add"==c?p=
l+a.options.indentUnit:"subtract"==c?p=l-a.options.indentUnit:"number"==typeof c&&(p=l+c);p=Math.max(0,p);d="";g=0;if(a.options.indentWithTabs)for(c=Math.floor(p/h);c;--c)g+=h,d+="\t";g<p&&(d+=re(p-g));if(d!=m)wc(a.doc,d,B(b,0),B(b,m.length),"+input");else for(c=0;c<e.sel.ranges.length;c++)if(a=e.sel.ranges[c],a.head.line==b&&a.head.ch<m.length){g=B(b,m.length);Ab(e,c,new U(g,g));break}k.stateAfter=null}function Ec(a,b,c,d){var e=b,g=b,h=a.doc;"number"==typeof b?g=I(h,Math.max(h.first,Math.min(b,
h.first+h.size-1))):e=Y(b);if(null!=e&&d(g,e))fb(a,e,c);else return null;return g}function Fc(a,b){for(var c=a.doc.sel.ranges,d=[],e=0;e<c.length;e++){for(var g=b(c[e]);d.length&&0>=P(g.from,W(d).to);){var h=d.pop();if(0>P(h.from,g.from)){g.from=h.from;break}}d.push(g)}Na(a,function(){for(var b=d.length-1;0<=b;b--)wc(a.doc,"",d[b].from,d[b].to,"+delete");eb(a)})}function sd(a,b,c,d,e){function g(b){var d=(e?cd:se)(l,k,c,!0);if(null==d){if(b=!b)b=h+c,b<a.first||b>=a.first+a.size?b=p=!1:(h=b,b=l=I(a,
b));if(b)k=e?(0>c?lc:kc)(l):0>c?l.text.length:0;else return p=!1}else k=d;return!0}var h=b.line,k=b.ch;b=c;var l=I(a,h),p=!0;if("char"==d)g();else if("column"==d)g(!0);else if("word"==d||"group"==d){var m=null;d="group"==d;for(var r=!0;!(0>c)||g(!r);r=!1){var q=l.text.charAt(k)||"\n",q=Gc(q)?"w":d&&"\n"==q?"n":!d||/\s/.test(q)?null:"p";!d||r||q||(q="s");if(m&&m!=q){0>c&&(c=1,g());break}q&&(m=q);if(0<c&&!g(!r))break}}b=gc(a,B(h,k),b,!0);p||(b.hitSide=!0);return b}function te(a,b,c,d){var e=a.doc,g=
b.left,h;"page"==d?(d=Math.min(a.display.wrapper.clientHeight,window.innerHeight||document.documentElement.clientHeight),h=b.top+c*(d-(0>c?1.5:0.5)*$a(a.display))):"line"==d&&(h=0<c?b.bottom+3:b.top-3);for(;;){var k=bd(a,g,h);if(!k.outside)break;if(0>c?0>=h:h>=e.height){k.hitSide=!0;break}h+=5*c}return k}function hd(a,b){var c=I(a,b.line).text,d=b.ch,e=b.ch;if(c){(0>b.xRel||e==c.length)&&d?--d:++e;for(var g=c.charAt(d),g=Gc(g)?Gc:/\s/.test(g)?function(a){return/\s/.test(a)}:function(a){return!/\s/.test(a)&&
!Gc(a)};0<d&&g(c.charAt(d-1));)--d;for(;e<c.length&&g(c.charAt(e));)++e}return new U(B(b.line,d),B(b.line,e))}function M(f,b,c,d){a.defaults[f]=b;c&&(ob[f]=d?function(a,f,b){b!=Ad&&c(a,f,b)}:c)}function kd(a){return"string"==typeof a?Pa[a]:a}function Vb(a,b,c,d,e){if(d&&d.shared)return jf(a,b,c,d,e);if(a.cm&&!a.cm.curOp)return ca(a.cm,Vb)(a,b,c,d,e);var g=new jb(a,e);e=P(b,c);d&&Hc(d,g);if(0<e||0==e&&!1!==g.clearWhenEmpty)return g;g.replacedWith&&(g.collapsed=!0,g.widgetNode=H("span",[g.replacedWith],
"CodeMirror-widget"),d.handleMouseEvents||(g.widgetNode.ignoreEvents=!0),d.insertLeft&&(g.widgetNode.insertLeft=!0));if(g.collapsed){if(ue(a,b.line,b,c,g)||b.line!=c.line&&ue(a,c.line,b,c,g))throw Error("Inserting collapsed marker partially overlapping an existing one");Va=!0}g.addToHistory&&me(a,{from:b,to:c,origin:"markText"},a.sel,NaN);var h=b.line,k=a.cm,l;a.iter(h,c.line+1,function(a){k&&g.collapsed&&!k.options.lineWrapping&&Ja(a)==k.display.maxLine&&(l=!0);g.collapsed&&h!=b.line&&Fa(a,0);var f=
new Ic(g,h==b.line?b.ch:null,h==c.line?c.ch:null);a.markedSpans=a.markedSpans?a.markedSpans.concat([f]):[f];f.marker.attachLine(a);++h});g.collapsed&&a.iter(b.line,c.line+1,function(b){ab(a,b)&&Fa(b,0)});g.clearOnEnter&&N(g,"beforeCursorEnter",function(){g.clear()});g.readOnly&&(ke=!0,(a.history.done.length||a.history.undone.length)&&a.clearHistory());g.collapsed&&(g.id=++kf,g.atomic=!0);if(k){l&&(k.curOp.updateMaxLine=!0);if(g.collapsed)va(k,b.line,c.line+1);else if(g.className||g.title||g.startStyle||
g.endStyle)for(d=b.line;d<=c.line;d++)fb(k,d,"text");g.atomic&&Jd(k.doc);da(k,"markerAdded",k,g)}return g}function jf(a,b,c,d,e){d=Hc(d);d.shared=!1;var g=[Vb(a,b,c,d,e)],h=g[0],k=d.widgetNode;xb(a,function(a){k&&(d.widgetNode=k.cloneNode(!0));g.push(Vb(a,G(a,b),G(a,c),d,e));for(var f=0;f<a.linked.length;++f)if(a.linked[f].isParent)return;h=W(g)});return new Jc(g,h)}function Ic(a,b,c){this.marker=a;this.from=b;this.to=c}function Wb(a,b){if(a)for(var c=0;c<a.length;++c){var d=a[c];if(d.marker==b)return d}}
function od(a,b){var c=Sa(a,b.from.line)&&I(a,b.from.line).markedSpans,d=Sa(a,b.to.line)&&I(a,b.to.line).markedSpans;if(!c&&!d)return null;var e=b.from.ch,g=b.to.ch,h=0==P(b.from,b.to);if(c)for(var k=0,l;k<c.length;++k){var p=c[k],m=p.marker;if(null==p.from||(m.inclusiveLeft?p.from<=e:p.from<e)||p.from==e&&!("bookmark"!=m.type||h&&p.marker.insertLeft)){var r=null==p.to||(m.inclusiveRight?p.to>=e:p.to>e);(l||(l=[])).push(new Ic(m,p.from,r?null:p.to))}}c=l;if(d)for(var k=0,q;k<d.length;++k)if(l=d[k],
p=l.marker,null==l.to||(p.inclusiveRight?l.to>=g:l.to>g)||l.from==g&&"bookmark"==p.type&&(!h||l.marker.insertLeft))m=null==l.from||(p.inclusiveLeft?l.from<=g:l.from<g),(q||(q=[])).push(new Ic(p,m?null:l.from-g,null==l.to?null:l.to-g));d=q;h=1==b.text.length;q=W(b.text).length+(h?e:0);if(c)for(g=0;g<c.length;++g)if(k=c[g],null==k.to)(l=Wb(d,k.marker),l)?h&&(k.to=null==l.to?null:l.to+q):k.to=e;if(d)for(g=0;g<d.length;++g)k=d[g],null!=k.to&&(k.to+=q),null==k.from?(l=Wb(c,k.marker),l||(k.from=q,h&&(c||
(c=[])).push(k))):(k.from+=q,h&&(c||(c=[])).push(k));c&&(c=ve(c));d&&d!=c&&(d=ve(d));e=[c];if(!h){var h=b.text.length-2,v;if(0<h&&c)for(g=0;g<c.length;++g)null==c[g].to&&(v||(v=[])).push(new Ic(c[g].marker,null,null));for(g=0;g<h;++g)e.push(v);e.push(d)}return e}function ve(a){for(var b=0;b<a.length;++b){var c=a[b];null!=c.from&&c.from==c.to&&!1!==c.marker.clearWhenEmpty&&a.splice(b--,1)}return a.length?a:null}function oe(a,b){var c;if(c=b["spans_"+a.id]){for(var d=0,e=[];d<b.text.length;++d)e.push(lf(c[d]));
c=e}else c=null;d=od(a,b);if(!c)return d;if(!d)return c;for(e=0;e<c.length;++e){var g=c[e],h=d[e];if(g&&h){var k=0;a:for(;k<h.length;++k){for(var l=h[k],p=0;p<g.length;++p)if(g[p].marker==l.marker)continue a;g.push(l)}}else h&&(c[e]=h)}return c}function gf(a,b,c){var d=null;a.iter(b.line,c.line+1,function(a){if(a.markedSpans)for(var f=0;f<a.markedSpans.length;++f){var b=a.markedSpans[f].marker;!b.readOnly||d&&-1!=ha(d,b)||(d||(d=[])).push(b)}});if(!d)return null;a=[{from:b,to:c}];for(b=0;b<d.length;++b){c=
d[b];for(var e=c.find(0),g=0;g<a.length;++g){var h=a[g];if(!(0>P(h.to,e.from)||0<P(h.from,e.to))){var k=[g,1],l=P(h.from,e.from),p=P(h.to,e.to);(0>l||!c.inclusiveLeft&&!l)&&k.push({from:h.from,to:e.from});(0<p||!c.inclusiveRight&&!p)&&k.push({from:e.to,to:h.to});a.splice.apply(a,k);g+=k.length-1}}}return a}function we(a){var b=a.markedSpans;if(b){for(var c=0;c<b.length;++c)b[c].marker.detachLine(a);a.markedSpans=null}}function xe(a,b){if(b){for(var c=0;c<b.length;++c)b[c].marker.attachLine(a);a.markedSpans=
b}}function ye(a,b){var c=a.lines.length-b.lines.length;if(0!=c)return c;var c=a.find(),d=b.find(),e=P(c.from,d.from)||(a.inclusiveLeft?-1:0)-(b.inclusiveLeft?-1:0);return e?-e:(c=P(c.to,d.to)||(a.inclusiveRight?1:0)-(b.inclusiveRight?1:0))?c:b.id-a.id}function cb(a,b){var c=Va&&a.markedSpans,d;if(c)for(var e,g=0;g<c.length;++g)e=c[g],e.marker.collapsed&&null==(b?e.from:e.to)&&(!d||0>ye(d,e.marker))&&(d=e.marker);return d}function ue(a,b,c,d,e){a=I(a,b);if(a=Va&&a.markedSpans)for(b=0;b<a.length;++b){var g=
a[b];if(g.marker.collapsed){var h=g.marker.find(0),k=P(h.from,c)||(g.marker.inclusiveLeft?-1:0)-(e.inclusiveLeft?-1:0),l=P(h.to,d)||(g.marker.inclusiveRight?1:0)-(e.inclusiveRight?1:0);if(!(0<=k&&0>=l||0>=k&&0<=l)&&(0>=k&&0<(P(h.to,c)||(g.marker.inclusiveRight?1:0)-(e.inclusiveLeft?-1:0))||0<=k&&0>(P(h.from,d)||(g.marker.inclusiveLeft?-1:0)-(e.inclusiveRight?1:0))))return!0}}}function Ja(a){for(var b;b=cb(a,!0);)a=b.find(-1,!0).line;return a}function Uc(a,b){var c=I(a,b),d=Ja(c);return c==d?b:Y(d)}
function Ed(a,b){if(b>a.lastLine())return b;var c=I(a,b),d;if(!ab(a,c))return b;for(;d=cb(c,!1);)c=d.find(1,!0).line;return Y(c)+1}function ab(a,b){var c=Va&&b.markedSpans;if(c)for(var d,e=0;e<c.length;++e)if(d=c[e],d.marker.collapsed&&(null==d.from||!d.marker.widgetNode&&0==d.from&&d.marker.inclusiveLeft&&td(a,b,d)))return!0}function td(a,b,c){if(null==c.to)return b=c.marker.find(1,!0),td(a,b.line,Wb(b.line.markedSpans,c.marker));if(c.marker.inclusiveRight&&c.to==b.text.length)return!0;for(var d,
e=0;e<b.markedSpans.length;++e)if(d=b.markedSpans[e],d.marker.collapsed&&!d.marker.widgetNode&&d.from==c.to&&(null==d.to||d.to!=c.from)&&(d.marker.inclusiveLeft||c.marker.inclusiveRight)&&td(a,b,d))return!0}function Nb(a){if(null!=a.height)return a.height;Ud(document.body,a.node)||Ha(a.cm.display.measure,H("div",[a.node],null,"position: relative"));return a.height=a.node.offsetHeight}function mf(a,b,c,d){var e=new Kc(a,c,d);e.noHScroll&&(a.display.alignWidgets=!0);Ec(a,b,"widget",function(b){var c=
b.widgets||(b.widgets=[]);null==e.insertAt?c.push(e):c.splice(Math.min(c.length-1,Math.max(0,e.insertAt)),0,e);e.line=b;ab(a.doc,b)||(c=Ga(b)<a.doc.scrollTop,Fa(b,b.height+Nb(e)),c&&Cc(a,null,e.height),a.curOp.forceUpdate=!0);return!0});return e}function ze(f,b,c,d,e,g){var h=c.flattenSpans;null==h&&(h=f.options.flattenSpans);var k=0,l=null,p=new Lc(b,f.options.tabSize),m;for(""==b&&c.blankLine&&c.blankLine(d);!p.eol();){p.pos>f.options.maxHighlightLength?(h=!1,g&&Xc(f,b,d,p.pos),p.pos=b.length,m=
null):m=c.token(p,d);if(f.options.addModeClass){var r=a.innerMode(c,d).mode.name;r&&(m="m-"+(m?r+" "+m:r))}h&&l==m||(k<p.start&&e(p.start,l),k=p.start,l=m);p.start=p.pos}for(;k<p.pos;)f=Math.min(p.pos,k+5E4),e(f,l),k=f}function Ld(a,b,c,d){var e=[a.state.modeGen];ze(a,b.text,a.doc.mode,c,function(a,f){e.push(a,f)},d);for(c=0;c<a.state.overlays.length;++c){var g=a.state.overlays[c],h=1,k=0;ze(a,b.text,g.mode,!0,function(a,f){for(var b=h;k<a;){var c=e[h];c>a&&e.splice(h,1,a,e[h+1],c);h+=2;k=Math.min(a,
c)}if(f)if(g.opaque)e.splice(b,h-b,a,f),h=b+2;else for(;b<h;b+=2)c=e[b+1],e[b+1]=c?c+" "+f:f})}return e}function Ae(a,b){b.styles&&b.styles[0]==a.state.modeGen||(b.styles=Ld(a,b,b.stateAfter=Kb(a,Y(b))));return b.styles}function Xc(a,b,c,d){var e=a.doc.mode,g=new Lc(b,a.options.tabSize);g.start=g.pos=d||0;for(""==b&&e.blankLine&&e.blankLine(c);!g.eol()&&g.pos<=a.options.maxHighlightLength;)e.token(g,c),g.start=g.pos}function Be(a,b){if(!a)return null;for(;;){var c=a.match(/(?:^|\s+)line-(background-)?(\S+)/);
if(!c)break;a=a.slice(0,c.index)+a.slice(c.index+c[0].length);var d=c[1]?"bgClass":"textClass";null==b[d]?b[d]=c[2]:RegExp("(?:^|s)"+c[2]+"(?:$|s)").test(b[d])||(b[d]+=" "+c[2])}if(/^\s*$/.test(a))return null;c=b.cm.options.addModeClass?nf:of;return c[a]||(c[a]=a.replace(/\S+/g,"cm-$&"))}function Fd(a,b){var c=H("span",null,null,sa?"padding-right: .1px":null),c={pre:H("pre",[c]),content:c,col:0,pos:0,cm:a};b.measure={};for(var d=0;d<=(b.rest?b.rest.length:0);d++){var e=d?b.rest[d-1]:b.line,g;c.pos=
0;c.addToken=pf;(na||sa)&&a.getOption("lineWrapping")&&(c.addToken=qf(c.addToken));var h;if(null!=ud)h=ud;else{h=Ha(a.display.measure,document.createTextNode("A\u062eA"));var k=Mb(h,0,1).getBoundingClientRect();h=k.left==k.right?!1:ud=3>Mb(h,1,2).getBoundingClientRect().right-k.right}h&&(g=Ia(e))&&(c.addToken=rf(c.addToken,g));c.map=[];a:{h=c;var k=Ae(a,e),l=e.markedSpans,e=e.text,p=0;if(l)for(var m=e.length,r=0,q=1,v="",u=void 0,w=0,A=void 0,S=void 0,B=void 0,D=void 0,X=void 0;;){if(w==r){for(var A=
S=B=D="",X=null,w=Infinity,F=[],E=0;E<l.length;++E){var C=l[E],G=C.marker;C.from<=r&&(null==C.to||C.to>r)?(null!=C.to&&w>C.to&&(w=C.to,S=""),G.className&&(A+=" "+G.className),G.startStyle&&C.from==r&&(B+=" "+G.startStyle),G.endStyle&&C.to==w&&(S+=" "+G.endStyle),G.title&&!D&&(D=G.title),G.collapsed&&(!X||0>ye(X.marker,G))&&(X=C)):C.from>r&&w>C.from&&(w=C.from);"bookmark"==G.type&&C.from==r&&G.widgetNode&&F.push(G)}if(X&&(X.from||0)==r&&(Ce(h,(null==X.to?m+1:X.to)-r,X.marker,null==X.from),null==X.to))break a;
if(!X&&F.length)for(E=0;E<F.length;++E)Ce(h,0,F[E])}if(r>=m)break;for(F=Math.min(m,w);;){if(v){E=r+v.length;X||(C=E>F?v.slice(0,F-r):v,h.addToken(h,C,u?u+A:A,B,r+C.length==w?S:"",D));if(E>=F){v=v.slice(F-r);r=F;break}r=E;B=""}v=e.slice(p,p=k[q++]);u=Be(k[q++],h)}}else for(var q=1;q<k.length;q+=2)h.addToken(h,e.slice(p,p=k[q]),Be(k[q+1],h))}0==c.map.length&&c.map.push(0,0,c.content.appendChild(sf(a.display.measure)));0==d?(b.measure.map=c.map,b.measure.cache={}):((b.measure.maps||(b.measure.maps=[])).push(c.map),
(b.measure.caches||(b.measure.caches=[])).push({}))}$(a,"renderLine",a,b.line,c.pre);return c}function pf(a,b,c,d,e,g){if(b){var h=a.cm.options.specialChars,k=!1;if(h.test(b))for(var l=document.createDocumentFragment(),p=0;;){h.lastIndex=p;var m=h.exec(b),r=m?m.index-p:b.length-p;if(r){var q=document.createTextNode(b.slice(p,p+r));fa?l.appendChild(H("span",[q])):l.appendChild(q);a.map.push(a.pos,a.pos+r,q);a.col+=r;a.pos+=r}if(!m)break;p+=r+1;"\t"==m[0]?(q=a.cm.options.tabSize,m=q-a.col%q,q=l.appendChild(H("span",
re(m),"cm-tab")),a.col+=m):(q=a.cm.options.specialCharPlaceholder(m[0]),fa?l.appendChild(H("span",[q])):l.appendChild(q),a.col+=1);a.map.push(a.pos,a.pos+1,q);a.pos++}else{a.col+=b.length;var l=document.createTextNode(b);a.map.push(a.pos,a.pos+b.length,l);fa&&(k=!0);a.pos+=b.length}if(c||d||e||k)return b=c||"",d&&(b+=d),e&&(b+=e),d=H("span",[l],b),g&&(d.title=g),a.content.appendChild(d);a.content.appendChild(l)}}function qf(a){function b(a){for(var f=" ",c=0;c<a.length-2;++c)f+=c%2?" ":"\u00a0";return f+
" "}return function(c,d,e,g,h,k){a(c,d.replace(/ {3,}/g,b),e,g,h,k)}}function rf(a,b){return function(c,d,e,g,h,k){e=e?e+" cm-force-border":"cm-force-border";for(var l=c.pos,p=l+d.length;;){for(var m=0;m<b.length;m++){var r=b[m];if(r.to>l&&r.from<=l)break}if(r.to>=p)return a(c,d,e,g,h,k);a(c,d.slice(0,r.to-l),e,g,null,k);g=null;d=d.slice(r.to-l);l=r.to}}}function Ce(a,b,c,d){if(c=!d&&c.widgetNode)a.map.push(a.pos,a.pos+b,c),a.content.appendChild(c);a.pos+=b}function qe(a,b){return 0==b.from.ch&&0==
b.to.ch&&""==W(b.text)&&(!a.cm||a.cm.options.wholeLineUpdateBefore)}function rd(a,b,c,d){function e(a,f,c){a.text=f;a.stateAfter&&(a.stateAfter=null);a.styles&&(a.styles=null);null!=a.order&&(a.order=null);we(a);xe(a,c);f=d?d(a):1;f!=a.height&&Fa(a,f);da(a,"change",a,b)}var g=b.from,h=b.to,k=b.text,l=I(a,g.line),p=I(a,h.line),m=W(k),r=c?c[k.length-1]:null,q=h.line-g.line;if(qe(a,b)){for(var v=0,u=[];v<k.length-1;++v)u.push(new kb(k[v],c?c[v]:null,d));e(p,p.text,r);q&&a.remove(g.line,q);u.length&&
a.insert(g.line,u)}else if(l==p)if(1==k.length)e(l,l.text.slice(0,g.ch)+m+l.text.slice(h.ch),r);else{u=[];for(v=1;v<k.length-1;++v)u.push(new kb(k[v],c?c[v]:null,d));u.push(new kb(m+l.text.slice(h.ch),r,d));e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null);a.insert(g.line+1,u)}else if(1==k.length)e(l,l.text.slice(0,g.ch)+k[0]+p.text.slice(h.ch),c?c[0]:null),a.remove(g.line+1,q);else{e(l,l.text.slice(0,g.ch)+k[0],c?c[0]:null);e(p,m+p.text.slice(h.ch),r);v=1;for(u=[];v<k.length-1;++v)u.push(new kb(k[v],c?
c[v]:null,d));1<q&&a.remove(g.line+1,q-1);a.insert(g.line+1,u)}da(a,"change",a,b)}function Xb(a){this.lines=a;this.parent=null;for(var b=0,c=0;b<a.length;++b)a[b].parent=this,c+=a[b].height;this.height=c}function Yb(a){this.children=a;for(var b=0,c=0,d=0;d<a.length;++d){var e=a[d],b=b+e.chunkSize(),c=c+e.height;e.parent=this}this.size=b;this.height=c;this.parent=null}function xb(a,b,c){function d(a,f,e){if(a.linked)for(var g=0;g<a.linked.length;++g){var h=a.linked[g];if(h.doc!=f){var k=e&&h.sharedHist;
if(!c||k)b(h.doc,k),d(h.doc,a,k)}}}d(a,null,!0)}function zd(a,b){if(b.cm)throw Error("This document is already in use.");a.doc=b;b.cm=a;g(a);c(a);a.options.lineWrapping||A(a);a.options.mode=b.modeOption;va(a)}function I(a,b){b-=a.first;if(0>b||b>=a.size)throw Error("There is no line "+(b+a.first)+" in the document.");for(var c=a;!c.lines;)for(var d=0;;++d){var e=c.children[d],g=e.chunkSize();if(b<g){c=e;break}b-=g}return c.lines[b]}function Ub(a,b,c){var d=[],e=b.line;a.iter(b.line,c.line+1,function(a){a=
a.text;e==c.line&&(a=a.slice(0,c.ch));e==b.line&&(a=a.slice(b.ch));d.push(a);++e});return d}function vd(a,b,c){var d=[];a.iter(b,c,function(a){d.push(a.text)});return d}function Fa(a,b){var c=b-a.height;if(c)for(var d=a;d;d=d.parent)d.height+=c}function Y(a){if(null==a.parent)return null;var b=a.parent;a=ha(b.lines,a);for(var c=b.parent;c;b=c,c=c.parent)for(var d=0;c.children[d]!=b;++d)a+=c.children[d].chunkSize();return a+b.first}function db(a,b){var c=a.first;a:do{for(var d=0;d<a.children.length;++d){var e=
a.children[d],g=e.height;if(b<g){a=e;continue a}b-=g;c+=e.chunkSize()}return c}while(!a.lines);for(d=0;d<a.lines.length;++d){e=a.lines[d].height;if(b<e)break;b-=e}return c+d}function Ga(a){a=Ja(a);for(var b=0,c=a.parent,d=0;d<c.lines.length;++d){var e=c.lines[d];if(e==a)break;else b+=e.height}for(a=c.parent;a;c=a,a=c.parent)for(d=0;d<a.children.length&&(e=a.children[d],e!=c);++d)b+=e.height;return b}function Ia(a){var b=a.order;null==b&&(b=a.order=tf(a.text));return b}function Mc(a){this.done=[];
this.undone=[];this.undoDepth=Infinity;this.lastModTime=this.lastSelTime=0;this.lastOrigin=this.lastSelOrigin=this.lastOp=null;this.generation=this.maxGeneration=a||1}function pd(a,b){var c={from:ja(b.from),to:wb(b),text:Ub(a,b.from,b.to)};De(a,c,b.from.line,b.to.line+1);xb(a,function(a){De(a,c,b.from.line,b.to.line+1)},!0);return c}function Gd(a){for(;a.length;)if(W(a).ranges)a.pop();else break}function me(a,b,c,d){var e=a.history;e.undone.length=0;var g=+new Date,h,k;if(k=e.lastOp==d||e.lastOrigin==
b.origin&&b.origin&&("+"==b.origin.charAt(0)&&a.cm&&e.lastModTime>g-a.cm.options.historyEventDelay||"*"==b.origin.charAt(0)))e.lastOp==d?(Gd(e.done),h=W(e.done)):e.done.length&&!W(e.done).ranges?h=W(e.done):1<e.done.length&&!e.done[e.done.length-2].ranges?(e.done.pop(),h=W(e.done)):h=void 0,k=h;if(k){var l=W(h.changes);0==P(b.from,b.to)&&0==P(b.from,l.to)?l.to=wb(b):h.changes.push(pd(a,b))}else for((h=W(e.done))&&h.ranges||fc(a.sel,e.done),h={changes:[pd(a,b)],generation:e.generation},e.done.push(h);e.done.length>
e.undoDepth;)e.done.shift(),e.done[0].ranges||e.done.shift();e.done.push(c);e.generation=++e.maxGeneration;e.lastModTime=e.lastSelTime=g;e.lastOp=d;e.lastOrigin=e.lastSelOrigin=b.origin;l||$(a,"historyAdded")}function fc(a,b){var c=W(b);c&&c.ranges&&c.equals(a)||b.push(a)}function De(a,b,c,d){var e=b["spans_"+a.id],g=0;a.iter(Math.max(a.first,c),Math.min(a.first+a.size,d),function(c){c.markedSpans&&((e||(e=b["spans_"+a.id]={}))[g]=c.markedSpans);++g})}function lf(a){if(!a)return null;for(var b=0,
c;b<a.length;++b)a[b].marker.explicitlyCleared?c||(c=a.slice(0,b)):c&&c.push(a[b]);return c?c.length?c:null:a}function yb(a,b,c){for(var d=0,e=[];d<a.length;++d){var g=a[d];if(g.ranges)e.push(c?L.prototype.deepCopy.call(g):g);else{var g=g.changes,h=[];e.push({changes:h});for(var k=0;k<g.length;++k){var l=g[k],p;h.push({from:l.from,to:l.to,text:l.text});if(b)for(var m in l)(p=m.match(/^spans_(\d+)$/))&&-1<ha(b,Number(p[1]))&&(W(h)[m]=l[m],delete l[m])}}}return e}function Ee(a,b,c,d){c<a.line?a.line+=
d:b<a.line&&(a.line=b,a.ch=0)}function Fe(a,b,c,d){for(var e=0;e<a.length;++e){var g=a[e],h=!0;if(g.ranges){g.copied||(g=a[e]=g.deepCopy(),g.copied=!0);for(var k=0;k<g.ranges.length;k++)Ee(g.ranges[k].anchor,b,c,d),Ee(g.ranges[k].head,b,c,d)}else{for(k=0;k<g.changes.length;++k){var l=g.changes[k];if(c<l.from.line)l.from=B(l.from.line+d,l.from.ch),l.to=B(l.to.line+d,l.to.ch);else if(b<=l.to.line){h=!1;break}}h||(a.splice(0,e+1),e=0)}}}function ne(a,b){var c=b.from.line,d=b.to.line,e=b.text.length-
(d-c)-1;Fe(a.done,c,d,e);Fe(a.undone,c,d,e)}function jd(a){return null!=a.defaultPrevented?a.defaultPrevented:!1==a.returnValue}function be(a){var b=a.which;null==b&&(a.button&1?b=1:a.button&2?b=3:a.button&4&&(b=2));qb&&a.ctrlKey&&1==b&&(b=3);return b}function da(a,b){function c(a){return function(){a.apply(null,e)}}var d=a._handlers&&a._handlers[b];if(d){var e=Array.prototype.slice.call(arguments,2);Wa||(++mc,Wa=[],setTimeout(uf,0));for(var g=0;g<d.length;++g)Wa.push(c(d[g]))}}function uf(){--mc;
var a=Wa;Wa=null;for(var b=0;b<a.length;++b)a[b]()}function La(a,b,c){$(a,c||b.type,a,b);return jd(b)||b.codemirrorIgnore}function Aa(a,b){var c=a._handlers&&a._handlers[b];return c&&0<c.length}function zb(a){a.prototype.on=function(a,f){N(this,a,f)};a.prototype.off=function(a,f){Xa(this,a,f)}}function Pc(){this.id=null}function ce(a,b,c){for(var d=0,e=0;;){var g=a.indexOf("\t",d);-1==g&&(g=a.length);var h=g-d;if(g==a.length||e+h>=b)return d+Math.min(h,b-e);e+=g-d;e+=c-e%c;d=g+1;if(e>=b)return d}}
function re(a){for(;Nc.length<=a;)Nc.push(W(Nc)+" ");return Nc[a]}function W(a){return a[a.length-1]}function ha(a,b){for(var c=0;c<a.length;++c)if(a[c]==b)return c;return-1}function qd(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=b(a[d],d);return c}function Ge(a,b){var c;Object.create?c=Object.create(a):(c=function(){},c.prototype=a,c=new c);b&&Hc(b,c);return c}function Hc(a,b){b||(b={});for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b}function Da(a){var b=Array.prototype.slice.call(arguments,
1);return function(){return a.apply(null,b)}}function He(a){for(var b in a)if(a.hasOwnProperty(b)&&a[b])return!1;return!0}function Lb(a){return 768<=a.charCodeAt(0)&&vf.test(a)}function H(a,b,c,d){a=document.createElement(a);c&&(a.className=c);d&&(a.style.cssText=d);if("string"==typeof b)a.appendChild(document.createTextNode(b));else if(b)for(c=0;c<b.length;++c)a.appendChild(b[c]);return a}function bb(a){for(var b=a.childNodes.length;0<b;--b)a.removeChild(a.firstChild);return a}function Ha(a,b){return bb(a).appendChild(b)}
function Ud(a,b){if(a.contains)return a.contains(b);for(;b=b.parentNode;)if(b==a)return!0}function Ta(){return document.activeElement}function Hb(a){if(null!=Rb)return Rb;var b=H("div",null,null,"width: 50px; height: 50px; overflow-x: scroll");Ha(a,b);b.offsetWidth&&(Rb=b.offsetHeight-b.clientHeight);return Rb||0}function sf(a){if(null==wd){var b=H("span","\u200b");Ha(a,H("span",[b,document.createTextNode("x")]));0!=a.firstChild.offsetHeight&&(wd=1>=b.offsetWidth&&2<b.offsetHeight&&!Db)}return wd?
H("span","\u200b"):H("span","\u00a0",null,"display: inline-block; width: 1px; margin-right: -1px")}function Pe(a,b,c,d){if(!a)return d(b,c,"ltr");for(var e=!1,g=0;g<a.length;++g){var h=a[g];if(h.from<c&&h.to>b||b==c&&h.to==b)d(Math.max(h.from,b),Math.min(h.to,c),1==h.level?"rtl":"ltr"),e=!0}e||d(b,c,"ltr")}function Zc(a){return a.level%2?a.to:a.from}function $c(a){return a.level%2?a.from:a.to}function kc(a){return(a=Ia(a))?Zc(a[0]):0}function lc(a){var b=Ia(a);return b?$c(W(b)):a.text.length}function Ie(a,
b){var c=I(a.doc,b),d=Ja(c);d!=c&&(b=Y(d));d=(c=Ia(d))?c[0].level%2?lc(d):kc(d):0;return B(b,d)}function ad(a,b){Ob=null;for(var c=0,d;c<a.length;++c){var e=a[c];if(e.from<b&&e.to>b)return c;if(e.from==b||e.to==b)if(null==d)d=c;else{var g;g=e.level;var h=a[d].level,k=a[0].level;g=g==k?!0:h==k?!1:g<h;if(g)return e.from!=e.to&&(Ob=d),c;e.from!=e.to&&(Ob=c);break}}return d}function xd(a,b,c,d){if(!d)return b+c;do b+=c;while(0<b&&Lb(a.text.charAt(b)));return b}function cd(a,b,c,d){var e=Ia(a);if(!e)return se(a,
b,c,d);var g=ad(e,b),h=e[g];for(b=xd(a,b,h.level%2?-c:c,d);;){if(b>h.from&&b<h.to)return b;if(b==h.from||b==h.to){if(ad(e,b)==g)return b;h=e[g+c];return 0<c==h.level%2?h.to:h.from}h=e[g+=c];if(!h)return null;b=0<c==h.level%2?xd(a,h.to,-1,d):xd(a,h.from,1,d)}}function se(a,b,c,d){b+=c;if(d)for(;0<b&&Lb(a.text.charAt(b));)b+=c;return 0>b||b>a.text.length?null:b}var Sb=/gecko\/\d/i.test(navigator.userAgent),za=/MSIE \d/.test(navigator.userAgent),Db=za&&(null==document.documentMode||8>document.documentMode),
fa=za&&(null==document.documentMode||9>document.documentMode),bf=za&&(null==document.documentMode||10>document.documentMode),wf=/Trident\/([7-9]|\d{2,})\./.test(navigator.userAgent),na=za||wf,sa=/WebKit\//.test(navigator.userAgent),xf=sa&&/Qt\/\d+\.\d+/.test(navigator.userAgent),yf=/Chrome\//.test(navigator.userAgent),Ba=/Opera\//.test(navigator.userAgent),ae=/Apple Computer/.test(navigator.vendor),Tc=/KHTML\//.test(navigator.userAgent),Me=/Mac OS X 1\d\D([7-9]|\d\d)\D/.test(navigator.userAgent),
Ne=/Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent),Ve=/PhantomJS/.test(navigator.userAgent),Cb=/AppleWebKit/.test(navigator.userAgent)&&/Mobile\/\w+/.test(navigator.userAgent),Oc=Cb||/Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent),qb=Cb||/Mac/.test(navigator.platform),zf=/win/i.test(navigator.platform),lb=Ba&&navigator.userAgent.match(/Version\/(\d*\.\d*)/);lb&&(lb=Number(lb[1]));lb&&15<=lb&&(Ba=!1,sa=!0);var Je=qb&&(xf||Ba&&(null==lb||12.11>lb)),id=Sb||
na&&!fa,ke=!1,Va=!1,B=a.Pos=function(a,b){if(!(this instanceof B))return new B(a,b);this.line=a;this.ch=b},P=a.cmpPos=function(a,b){return a.line-b.line||a.ch-b.ch};L.prototype={primary:function(){return this.ranges[this.primIndex]},equals:function(a){if(a==this)return!0;if(a.primIndex!=this.primIndex||a.ranges.length!=this.ranges.length)return!1;for(var b=0;b<this.ranges.length;b++){var c=this.ranges[b],d=a.ranges[b];if(0!=P(c.anchor,d.anchor)||0!=P(c.head,d.head))return!1}return!0},deepCopy:function(){for(var a=
[],b=0;b<this.ranges.length;b++)a[b]=new U(ja(this.ranges[b].anchor),ja(this.ranges[b].head));return new L(a,this.primIndex)},somethingSelected:function(){for(var a=0;a<this.ranges.length;a++)if(!this.ranges[a].empty())return!0;return!1},contains:function(a,b){b||(b=a);for(var c=0;c<this.ranges.length;c++){var d=this.ranges[c];if(0<=P(b,d.from())&&0>=P(a,d.to()))return c}return-1}};U.prototype={from:function(){return Za(this.anchor,this.head)},to:function(){return Ra(this.anchor,this.head)},empty:function(){return this.head.line==
this.anchor.line&&this.head.ch==this.anchor.ch}};var Od={left:0,right:0,top:0,bottom:0},gb,Ue=0,uc,tc,$d=0,xc=0,Ca=null;na?Ca=-0.53:Sb?Ca=15:yf?Ca=-0.7:ae&&(Ca=-1/3);var ge,ld=null,md,wb=a.changeEnd=function(a){return a.text?B(a.from.line+a.text.length-1,W(a.text).length+(1==a.text.length?a.from.ch:0)):a.to};a.prototype={constructor:a,posFromMouse:function(a){return hb(this,a,!0)},focus:function(){window.focus();pa(this);Qb(this)},setOption:function(a,b){var c=this.options,d=c[a];if(c[a]!=b||"mode"==
a)c[a]=b,ob.hasOwnProperty(a)&&ca(this,ob[a])(this,b,d)},getOption:function(a){return this.options[a]},getDoc:function(){return this.doc},addKeyMap:function(a,b){this.state.keyMaps[b?"push":"unshift"](a)},removeKeyMap:function(a){for(var b=this.state.keyMaps,c=0;c<b.length;++c)if(b[c]==a||"string"!=typeof b[c]&&b[c].name==a)return b.splice(c,1),!0},addOverlay:aa(function(f,b){var c=f.token?f:a.getMode(this.options,f);if(c.startState)throw Error("Overlays may not be stateful.");this.state.overlays.push({mode:c,
modeSpec:f,opaque:b&&b.opaque});this.state.modeGen++;va(this)}),removeOverlay:aa(function(a){for(var b=this.state.overlays,c=0;c<b.length;++c){var d=b[c].modeSpec;if(d==a||"string"==typeof a&&d.name==a){b.splice(c,1);this.state.modeGen++;va(this);break}}}),indentLine:aa(function(a,b,c){"string"!=typeof b&&"number"!=typeof b&&(b=null==b?this.options.smartIndent?"smart":"prev":b?"add":"subtract");Sa(this.doc,a)&&rc(this,a,b,c)}),indentSelection:aa(function(a){for(var b=this.doc.sel.ranges,c=-1,d=0;d<
b.length;d++){var e=b[d];if(e.empty())e.head.line>c&&(rc(this,e.head.line,a,!0),c=e.head.line,d==this.doc.sel.primIndex&&eb(this));else for(var g=Math.max(c,e.from().line),c=e.to(),c=Math.min(this.lastLine(),c.line-(c.ch?0:1))+1;g<c;++g)rc(this,g,a)}}),getTokenAt:function(a,b){var c=this.doc;a=G(c,a);for(var d=Kb(this,a.line,b),e=this.doc.mode,c=I(c,a.line),c=new Lc(c.text,this.options.tabSize);c.pos<a.ch&&!c.eol();){c.start=c.pos;var g=e.token(c,d)}return{start:c.start,end:c.pos,string:c.current(),
type:g||null,state:d}},getTokenTypeAt:function(a){a=G(this.doc,a);var b=Ae(this,I(this.doc,a.line)),c=0,d=(b.length-1)/2;a=a.ch;if(0==a)return b[2];for(;;){var e=c+d>>1;if((e?b[2*e-1]:0)>=a)d=e;else if(b[2*e+1]<a)c=e+1;else return b[2*e+2]}},getModeAt:function(f){var b=this.doc.mode;return b.innerMode?a.innerMode(b,this.getTokenAt(f).state).mode:b},getHelper:function(a,b){return this.getHelpers(a,b)[0]},getHelpers:function(a,b){var c=[];if(!mb.hasOwnProperty(b))return mb;var d=mb[b],e=this.getModeAt(a);
if("string"==typeof e[b])d[e[b]]&&c.push(d[e[b]]);else if(e[b])for(var g=0;g<e[b].length;g++){var h=d[e[b][g]];h&&c.push(h)}else e.helperType&&d[e.helperType]?c.push(d[e.helperType]):d[e.name]&&c.push(d[e.name]);for(g=0;g<d._global.length;g++)h=d._global[g],h.pred(e,this)&&-1==ha(c,h.val)&&c.push(h.val);return c},getStateAfter:function(a,b){var c=this.doc;a=Math.max(c.first,Math.min(null==a?c.first+c.size-1:a,c.first+c.size-1));return Kb(this,a+1,b)},cursorCoords:function(a,b){var c;c=this.doc.sel.primary();
c=null==a?c.head:"object"==typeof a?G(this.doc,a):a?c.from():c.to();return Qa(this,c,b||"page")},charCoords:function(a,b){return hc(this,G(this.doc,a),b||"page")},coordsChar:function(a,b){a=Rd(this,a,b||"page");return bd(this,a.left,a.top)},lineAtHeight:function(a,b){a=Rd(this,{top:a,left:0},b||"page").top;return db(this.doc,a+this.display.viewOffset)},heightAtLine:function(a,b){var c=!1,d=this.doc.first+this.doc.size-1;a<this.doc.first?a=this.doc.first:a>d&&(a=d,c=!0);d=I(this.doc,a);return Yc(this,
d,{top:0,left:0},b||"page").top+(c?this.doc.height-Ga(d):0)},defaultTextHeight:function(){return $a(this.display)},defaultCharWidth:function(){return Fb(this.display)},setGutterMarker:aa(function(a,b,c){return Ec(this,a,"gutter",function(a){var f=a.gutterMarkers||(a.gutterMarkers={});f[b]=c;!c&&He(f)&&(a.gutterMarkers=null);return!0})}),clearGutter:aa(function(a){var b=this,c=b.doc,d=c.first;c.iter(function(c){c.gutterMarkers&&c.gutterMarkers[a]&&(c.gutterMarkers[a]=null,fb(b,d,"gutter"),He(c.gutterMarkers)&&
(c.gutterMarkers=null));++d})}),addLineClass:aa(function(a,b,c){return Ec(this,a,"class",function(a){var f="text"==b?"textClass":"background"==b?"bgClass":"wrapClass";if(a[f]){if(RegExp("(?:^|\\s)"+c+"(?:$|\\s)").test(a[f]))return!1;a[f]+=" "+c}else a[f]=c;return!0})}),removeLineClass:aa(function(a,b,c){return Ec(this,a,"class",function(a){var f="text"==b?"textClass":"background"==b?"bgClass":"wrapClass",d=a[f];if(d)if(null==c)a[f]=null;else{var e=d.match(RegExp("(?:^|\\s+)"+c+"(?:$|\\s+)"));if(!e)return!1;
var g=e.index+e[0].length;a[f]=d.slice(0,e.index)+(e.index&&g!=d.length?" ":"")+d.slice(g)||null}else return!1;return!0})}),addLineWidget:aa(function(a,b,c){return mf(this,a,b,c)}),removeLineWidget:function(a){a.clear()},lineInfo:function(a){if("number"==typeof a){if(!Sa(this.doc,a))return null;var b=a;a=I(this.doc,a);if(!a)return null}else if(b=Y(a),null==b)return null;return{line:b,handle:a,text:a.text,gutterMarkers:a.gutterMarkers,textClass:a.textClass,bgClass:a.bgClass,wrapClass:a.wrapClass,widgets:a.widgets}},
getViewport:function(){return{from:this.display.viewFrom,to:this.display.viewTo}},addWidget:function(a,b,c,d,e){var g=this.display;a=Qa(this,G(this.doc,a));var h=a.bottom,k=a.left;b.style.position="absolute";g.sizer.appendChild(b);if("over"==d)h=a.top;else if("above"==d||"near"==d){var l=Math.max(g.wrapper.clientHeight,this.doc.height),p=Math.max(g.sizer.clientWidth,g.lineSpace.clientWidth);("above"==d||a.bottom+b.offsetHeight>l)&&a.top>b.offsetHeight?h=a.top-b.offsetHeight:a.bottom+b.offsetHeight<=
l&&(h=a.bottom);k+b.offsetWidth>p&&(k=p-b.offsetWidth)}b.style.top=h+"px";b.style.left=b.style.right="";"right"==e?(k=g.sizer.clientWidth-b.offsetWidth,b.style.right="0px"):("left"==e?k=0:"middle"==e&&(k=(g.sizer.clientWidth-b.offsetWidth)/2),b.style.left=k+"px");c&&(a=nc(this,k,h,k+b.offsetWidth,h+b.offsetHeight),null!=a.scrollTop&&Pb(this,a.scrollTop),null!=a.scrollLeft&&pb(this,a.scrollLeft))},triggerOnKeyDown:aa(Yd),triggerOnKeyPress:aa(Zd),triggerOnKeyUp:aa(Xd),execCommand:function(a){if(zc.hasOwnProperty(a))return zc[a](this)},
findPosH:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var g=0;for(a=G(this.doc,a);g<b&&(a=sd(this.doc,a,e,c,d),!a.hitSide);++g);return a},moveH:aa(function(a,b){var c=this;c.extendSelectionsBy(function(d){return c.display.shift||c.doc.extend||d.empty()?sd(c.doc,d.head,a,b,c.options.rtlMoveVisually):0>a?d.from():d.to()},nb)}),deleteH:aa(function(a,b){var c=this.doc;this.doc.sel.somethingSelected()?c.replaceSelection("",null,"+delete"):Fc(this,function(d){var e=sd(c,d.head,a,b,!1);return 0>a?{from:e,
to:d.head}:{from:d.head,to:e}})}),findPosV:function(a,b,c,d){var e=1;0>b&&(e=-1,b=-b);var g=0;for(a=G(this.doc,a);g<b&&(a=Qa(this,a,"div"),null==d?d=a.left:a.left=d,a=te(this,a,e,c),!a.hitSide);++g);return a},moveV:aa(function(a,b){var c=this,d=this.doc,e=[],g=!c.display.shift&&!d.extend&&d.sel.somethingSelected();d.extendSelectionsBy(function(h){if(g)return 0>a?h.from():h.to();var k=Qa(c,h.head,"div");null!=h.goalColumn&&(k.left=h.goalColumn);e.push(k.left);var l=te(c,k,a,b);"page"==b&&h==d.sel.primary()&&
Cc(c,null,hc(c,l,"div").top-k.top);return l},nb);if(e.length)for(var h=0;h<d.sel.ranges.length;h++)d.sel.ranges[h].goalColumn=e[h]}),toggleOverwrite:function(a){if(null==a||a!=this.state.overwrite)(this.state.overwrite=!this.state.overwrite)?this.display.cursorDiv.className+=" CodeMirror-overwrite":this.display.cursorDiv.className=this.display.cursorDiv.className.replace(" CodeMirror-overwrite",""),$(this,"overwriteToggle",this,this.state.overwrite)},hasFocus:function(){return Ta()==this.display.input},
scrollTo:aa(function(a,b){null==a&&null==b||Dc(this);null!=a&&(this.curOp.scrollLeft=a);null!=b&&(this.curOp.scrollTop=b)}),getScrollInfo:function(){var a=this.display.scroller,b=Oa;return{left:a.scrollLeft,top:a.scrollTop,height:a.scrollHeight-b,width:a.scrollWidth-b,clientHeight:a.clientHeight-b,clientWidth:a.clientWidth-b}},scrollIntoView:aa(function(a,b){null==a?(a={from:this.doc.sel.primary().head,to:null},null==b&&(b=this.options.cursorScrollMargin)):"number"==typeof a?a={from:B(a,0),to:null}:
null==a.from&&(a={from:a,to:null});a.to||(a.to=a.from);a.margin=b||0;if(null!=a.from.line)Dc(this),this.curOp.scrollToPos=a;else{var c=nc(this,Math.min(a.from.left,a.to.left),Math.min(a.from.top,a.to.top)-a.margin,Math.max(a.from.right,a.to.right),Math.max(a.from.bottom,a.to.bottom)+a.margin);this.scrollTo(c.scrollLeft,c.scrollTop)}}),setSize:aa(function(a,b){function c(a){return"number"==typeof a||/^\d+$/.test(String(a))?a+"px":a}null!=a&&(this.display.wrapper.style.width=c(a));null!=b&&(this.display.wrapper.style.height=
c(b));this.options.lineWrapping&&Qd(this);this.curOp.forceUpdate=!0;$(this,"refresh",this)}),operation:function(a){return Na(this,a)},refresh:aa(function(){var a=this.display.cachedTextHeight;va(this);Gb(this);this.scrollTo(this.doc.scrollLeft,this.doc.scrollTop);(null==a||0.5<Math.abs(a-$a(this.display)))&&g(this);$(this,"refresh",this)}),swapDoc:aa(function(a){var b=this.doc;b.cm=null;zd(this,a);Gb(this);Ea(this);this.scrollTo(a.scrollLeft,a.scrollTop);da(this,"swapDoc",this,b);return b}),getInputField:function(){return this.display.input},
getWrapperElement:function(){return this.display.wrapper},getScrollerElement:function(){return this.display.scroller},getGutterElement:function(){return this.display.gutters}};zb(a);var yd=a.defaults={},ob=a.optionHandlers={},Ad=a.Init={toString:function(){return"CodeMirror.Init"}};M("value","",function(a,b){a.setValue(b)},!0);M("mode",null,function(a,b){a.doc.modeOption=b;c(a)},!0);M("indentUnit",2,c,!0);M("indentWithTabs",!1);M("smartIndent",!0);M("tabSize",4,function(a){d(a);Gb(a);va(a)},!0);M("specialChars",
/[\t\u0000-\u0019\u00ad\u200b\u2028\u2029\ufeff]/g,function(a,b){a.options.specialChars=RegExp(b.source+(b.test("\t")?"":"|\t"),"g");a.refresh()},!0);M("specialCharPlaceholder",function(a){var b=H("span","\u2022","cm-invalidchar");b.title="\\u"+a.charCodeAt(0).toString(16);return b},function(a){a.refresh()},!0);M("electricChars",!0);M("rtlMoveVisually",!zf);M("wholeLineUpdateBefore",!0);M("theme","default",function(a){l(a);p(a)},!0);M("keyMap","default",h);M("extraKeys",null);M("lineWrapping",!1,
function(a){a.options.lineWrapping?(a.display.wrapper.className+=" CodeMirror-wrap",a.display.sizer.style.minWidth=""):(a.display.wrapper.className=a.display.wrapper.className.replace(" CodeMirror-wrap",""),A(a));g(a);va(a);Gb(a);setTimeout(function(){J(a)},100)},!0);M("gutters",[],function(a){D(a.options);p(a)},!0);M("fixedGutter",!0,function(a,b){a.display.gutters.style.left=b?r(a.display)+"px":"0";a.refresh()},!0);M("coverGutterNextToScrollbar",!1,J,!0);M("lineNumbers",!1,function(a){D(a.options);
p(a)},!0);M("firstLineNumber",1,p,!0);M("lineNumberFormatter",function(a){return a},p,!0);M("showCursorWhenSelecting",!1,Wc,!0);M("resetSelectionOnContextMenu",!0);M("readOnly",!1,function(a,b){"nocursor"==b?(Rc(a),a.display.input.blur(),a.display.disabled=!0):(a.display.disabled=!1,b||Ea(a))});M("disableInput",!1,function(a,b){b||Ea(a)},!0);M("dragDrop",!0);M("cursorBlinkRate",530);M("cursorScrollMargin",0);M("cursorHeight",1);M("workTime",100);M("workDelay",100);M("flattenSpans",!0,d,!0);M("addModeClass",
!1,d,!0);M("pollInterval",100);M("undoDepth",200,function(a,b){a.doc.history.undoDepth=b});M("historyEventDelay",1250);M("viewportMargin",10,function(a){a.refresh()},!0);M("maxHighlightLength",1E4,d,!0);M("moveInputWithCursor",!0,function(a,b){b||(a.display.inputDiv.style.top=a.display.inputDiv.style.left=0)});M("tabindex",null,function(a,b){a.display.input.tabIndex=b||""});M("autofocus",null);var Ke=a.modes={},Zb=a.mimeModes={};a.defineMode=function(b,c){a.defaults.mode||"null"==b||(a.defaults.mode=
b);if(2<arguments.length){c.dependencies=[];for(var d=2;d<arguments.length;++d)c.dependencies.push(arguments[d])}Ke[b]=c};a.defineMIME=function(a,b){Zb[a]=b};a.resolveMode=function(b){if("string"==typeof b&&Zb.hasOwnProperty(b))b=Zb[b];else if(b&&"string"==typeof b.name&&Zb.hasOwnProperty(b.name)){var c=Zb[b.name];"string"==typeof c&&(c={name:c});b=Ge(c,b);b.name=c.name}else if("string"==typeof b&&/^[\w\-]+\/[\w\-]+\+xml$/.test(b))return a.resolveMode("application/xml");return"string"==typeof b?{name:b}:
b||{name:"null"}};a.getMode=function(b,c){c=a.resolveMode(c);var d=Ke[c.name];if(!d)return a.getMode(b,"text/plain");d=d(b,c);if($b.hasOwnProperty(c.name)){var e=$b[c.name],g;for(g in e)e.hasOwnProperty(g)&&(d.hasOwnProperty(g)&&(d["_"+g]=d[g]),d[g]=e[g])}d.name=c.name;c.helperType&&(d.helperType=c.helperType);if(c.modeProps)for(g in c.modeProps)d[g]=c.modeProps[g];return d};a.defineMode("null",function(){return{token:function(a){a.skipToEnd()}}});a.defineMIME("text/plain","null");var $b=a.modeExtensions=
{};a.extendMode=function(a,b){var c=$b.hasOwnProperty(a)?$b[a]:$b[a]={};Hc(b,c)};a.defineExtension=function(b,c){a.prototype[b]=c};a.defineDocExtension=function(a,b){la.prototype[a]=b};a.defineOption=M;var Sc=[];a.defineInitHook=function(a){Sc.push(a)};var mb=a.helpers={};a.registerHelper=function(b,c,d){mb.hasOwnProperty(b)||(mb[b]=a[b]={_global:[]});mb[b][c]=d};a.registerGlobalHelper=function(b,c,d,e){a.registerHelper(b,c,e);mb[b]._global.push({pred:d,val:e})};var Jb=a.copyState=function(a,b){if(!0===
b)return b;if(a.copyState)return a.copyState(b);var c={},d;for(d in b){var e=b[d];e instanceof Array&&(e=e.concat([]));c[d]=e}return c},Se=a.startState=function(a,b,c){return a.startState?a.startState(b,c):!0};a.innerMode=function(a,b){for(;a.innerMode;){var c=a.innerMode(b);if(!c||c.mode==a)break;b=c.state;a=c.mode}return c||{mode:a,state:b}};var zc=a.commands={selectAll:function(a){a.setSelection(B(a.firstLine(),0),B(a.lastLine()),rb)},singleSelection:function(a){a.setSelection(a.getCursor("anchor"),
a.getCursor("head"),rb)},killLine:function(a){Fc(a,function(b){if(b.empty()){var c=I(a.doc,b.head.line).text.length;return b.head.ch==c&&b.head.line<a.lastLine()?{from:b.head,to:B(b.head.line+1,0)}:{from:b.head,to:B(b.head.line,c)}}return{from:b.from(),to:b.to()}})},deleteLine:function(a){Fc(a,function(b){return{from:B(b.from().line,0),to:G(a.doc,B(b.to().line+1,0))}})},delLineLeft:function(a){Fc(a,function(a){return{from:B(a.from().line,0),to:a.from()}})},undo:function(a){a.undo()},redo:function(a){a.redo()},
undoSelection:function(a){a.undoSelection()},redoSelection:function(a){a.redoSelection()},goDocStart:function(a){a.extendSelection(B(a.firstLine(),0))},goDocEnd:function(a){a.extendSelection(B(a.lastLine()))},goLineStart:function(a){a.extendSelectionsBy(function(b){return Ie(a,b.head.line)},nb)},goLineStartSmart:function(a){a.extendSelectionsBy(function(b){var c=Ie(a,b.head.line),d=a.getLineHandle(c.line),e=Ia(d);return e&&0!=e[0].level?c:(d=Math.max(0,d.text.search(/\S/)),B(c.line,b.head.line==c.line&&
b.head.ch<=d&&b.head.ch?0:d))},nb)},goLineEnd:function(a){a.extendSelectionsBy(function(b){b=b.head.line;for(var c,d=I(a.doc,b);c=cb(d,!1);)d=c.find(1,!0).line,b=null;c=(c=Ia(d))?c[0].level%2?kc(d):lc(d):d.text.length;return B(null==b?Y(d):b,c)},nb)},goLineRight:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,"div").top+5;return a.coordsChar({left:a.display.lineDiv.offsetWidth+100,top:b},"div")},nb)},goLineLeft:function(a){a.extendSelectionsBy(function(b){b=a.charCoords(b.head,
"div").top+5;return a.coordsChar({left:0,top:b},"div")},nb)},goLineUp:function(a){a.moveV(-1,"line")},goLineDown:function(a){a.moveV(1,"line")},goPageUp:function(a){a.moveV(-1,"page")},goPageDown:function(a){a.moveV(1,"page")},goCharLeft:function(a){a.moveH(-1,"char")},goCharRight:function(a){a.moveH(1,"char")},goColumnLeft:function(a){a.moveH(-1,"column")},goColumnRight:function(a){a.moveH(1,"column")},goWordLeft:function(a){a.moveH(-1,"word")},goGroupRight:function(a){a.moveH(1,"group")},goGroupLeft:function(a){a.moveH(-1,
"group")},goWordRight:function(a){a.moveH(1,"word")},delCharBefore:function(a){a.deleteH(-1,"char")},delCharAfter:function(a){a.deleteH(1,"char")},delWordBefore:function(a){a.deleteH(-1,"word")},delWordAfter:function(a){a.deleteH(1,"word")},delGroupBefore:function(a){a.deleteH(-1,"group")},delGroupAfter:function(a){a.deleteH(1,"group")},indentAuto:function(a){a.indentSelection("smart")},indentMore:function(a){a.indentSelection("add")},indentLess:function(a){a.indentSelection("subtract")},insertTab:function(a){a.replaceSelection("\t")},
defaultTab:function(a){a.somethingSelected()?a.indentSelection("add"):a.execCommand("insertTab")},transposeChars:function(a){Na(a,function(){for(var b=a.listSelections(),c=0;c<b.length;c++){var d=b[c].head,e=I(a.doc,d.line).text;0<d.ch&&d.ch<e.length-1&&a.replaceRange(e.charAt(d.ch)+e.charAt(d.ch-1),B(d.line,d.ch-1),B(d.line,d.ch+1))}})},newlineAndIndent:function(a){Na(a,function(){for(var b=a.listSelections().length,c=0;c<b;c++){var d=a.listSelections()[c];a.replaceRange("\n",d.anchor,d.head,"+input");
a.indentLine(d.from().line+1,null,!0);eb(a)}})},toggleOverwrite:function(a){a.toggleOverwrite()}},Pa=a.keyMap={};Pa.basic={Left:"goCharLeft",Right:"goCharRight",Up:"goLineUp",Down:"goLineDown",End:"goLineEnd",Home:"goLineStartSmart",PageUp:"goPageUp",PageDown:"goPageDown",Delete:"delCharAfter",Backspace:"delCharBefore","Shift-Backspace":"delCharBefore",Tab:"defaultTab","Shift-Tab":"indentAuto",Enter:"newlineAndIndent",Insert:"toggleOverwrite",Esc:"singleSelection"};Pa.pcDefault={"Ctrl-A":"selectAll",
"Ctrl-D":"deleteLine","Ctrl-Z":"undo","Shift-Ctrl-Z":"redo","Ctrl-Y":"redo","Ctrl-Home":"goDocStart","Ctrl-Up":"goDocStart","Ctrl-End":"goDocEnd","Ctrl-Down":"goDocEnd","Ctrl-Left":"goGroupLeft","Ctrl-Right":"goGroupRight","Alt-Left":"goLineStart","Alt-Right":"goLineEnd","Ctrl-Backspace":"delGroupBefore","Ctrl-Delete":"delGroupAfter","Ctrl-S":"save","Ctrl-F":"find","Ctrl-G":"findNext","Shift-Ctrl-G":"findPrev","Shift-Ctrl-F":"replace","Shift-Ctrl-R":"replaceAll","Ctrl-[":"indentLess","Ctrl-]":"indentMore",
"Ctrl-U":"undoSelection","Shift-Ctrl-U":"redoSelection","Alt-U":"redoSelection",fallthrough:"basic"};Pa.macDefault={"Cmd-A":"selectAll","Cmd-D":"deleteLine","Cmd-Z":"undo","Shift-Cmd-Z":"redo","Cmd-Y":"redo","Cmd-Up":"goDocStart","Cmd-End":"goDocEnd","Cmd-Down":"goDocEnd","Alt-Left":"goGroupLeft","Alt-Right":"goGroupRight","Cmd-Left":"goLineStart","Cmd-Right":"goLineEnd","Alt-Backspace":"delGroupBefore","Ctrl-Alt-Backspace":"delGroupAfter","Alt-Delete":"delGroupAfter","Cmd-S":"save","Cmd-F":"find",
"Cmd-G":"findNext","Shift-Cmd-G":"findPrev","Cmd-Alt-F":"replace","Shift-Cmd-Alt-F":"replaceAll","Cmd-[":"indentLess","Cmd-]":"indentMore","Cmd-Backspace":"delLineLeft","Cmd-U":"undoSelection","Shift-Cmd-U":"redoSelection",fallthrough:["basic","emacsy"]};Pa.emacsy={"Ctrl-F":"goCharRight","Ctrl-B":"goCharLeft","Ctrl-P":"goLineUp","Ctrl-N":"goLineDown","Alt-F":"goWordRight","Alt-B":"goWordLeft","Ctrl-A":"goLineStart","Ctrl-E":"goLineEnd","Ctrl-V":"goPageDown","Shift-Ctrl-V":"goPageUp","Ctrl-D":"delCharAfter",
"Ctrl-H":"delCharBefore","Alt-D":"delWordAfter","Alt-Backspace":"delWordBefore","Ctrl-K":"killLine","Ctrl-T":"transposeChars"};Pa["default"]=qb?Pa.macDefault:Pa.pcDefault;var Ac=a.lookupKey=function(a,b,c){function d(b){b=kd(b);var e=b[a];if(!1===e)return"stop";if(null!=e&&c(e))return!0;if(b.nofallthrough)return"stop";b=b.fallthrough;if(null==b)return!1;if("[object Array]"!=Object.prototype.toString.call(b))return d(b);for(e=0;e<b.length;++e){var g=d(b[e]);if(g)return g}return!1}for(var e=0;e<b.length;++e){var g=
d(b[e]);if(g)return"stop"!=g}},cf=a.isModifierKey=function(a){a=Ya[a.keyCode];return"Ctrl"==a||"Alt"==a||"Shift"==a||"Mod"==a},df=a.keyName=function(a,b){if(Ba&&34==a.keyCode&&a["char"])return!1;var c=Ya[a.keyCode];if(null==c||a.altGraphKey)return!1;a.altKey&&(c="Alt-"+c);if(Je?a.metaKey:a.ctrlKey)c="Ctrl-"+c;if(Je?a.ctrlKey:a.metaKey)c="Cmd-"+c;!b&&a.shiftKey&&(c="Shift-"+c);return c};a.fromTextArea=function(b,c){function d(){b.value=p.getValue()}c||(c={});c.value=b.value;!c.tabindex&&b.tabindex&&
(c.tabindex=b.tabindex);!c.placeholder&&b.placeholder&&(c.placeholder=b.placeholder);if(null==c.autofocus){var e=Ta();c.autofocus=e==b||null!=b.getAttribute("autofocus")&&e==document.body}if(b.form&&(N(b.form,"submit",d),!c.leaveSubmitMethodAlone)){var g=b.form,h=g.submit;try{var k=g.submit=function(){d();g.submit=h;g.submit();g.submit=k}}catch(l){}}b.style.display="none";var p=a(function(a){b.parentNode.insertBefore(a,b.nextSibling)},c);p.save=d;p.getTextArea=function(){return b};p.toTextArea=function(){d();
b.parentNode.removeChild(p.getWrapperElement());b.style.display="";b.form&&(Xa(b.form,"submit",d),"function"==typeof b.form.submit&&(b.form.submit=h))};return p};var Lc=a.StringStream=function(a,b){this.pos=this.start=0;this.string=a;this.tabSize=b||8;this.lineStart=this.lastColumnPos=this.lastColumnValue=0};Lc.prototype={eol:function(){return this.pos>=this.string.length},sol:function(){return this.pos==this.lineStart},peek:function(){return this.string.charAt(this.pos)||void 0},next:function(){if(this.pos<
this.string.length)return this.string.charAt(this.pos++)},eat:function(a){var b=this.string.charAt(this.pos);if("string"==typeof a?b==a:b&&(a.test?a.test(b):a(b)))return++this.pos,b},eatWhile:function(a){for(var b=this.pos;this.eat(a););return this.pos>b},eatSpace:function(){for(var a=this.pos;/[\s\u00a0]/.test(this.string.charAt(this.pos));)++this.pos;return this.pos>a},skipToEnd:function(){this.pos=this.string.length},skipTo:function(a){a=this.string.indexOf(a,this.pos);if(-1<a)return this.pos=
a,!0},backUp:function(a){this.pos-=a},column:function(){this.lastColumnPos<this.start&&(this.lastColumnValue=Ka(this.string,this.start,this.tabSize,this.lastColumnPos,this.lastColumnValue),this.lastColumnPos=this.start);return this.lastColumnValue-(this.lineStart?Ka(this.string,this.lineStart,this.tabSize):0)},indentation:function(){return Ka(this.string,null,this.tabSize)-(this.lineStart?Ka(this.string,this.lineStart,this.tabSize):0)},match:function(a,b,c){if("string"==typeof a){var d=function(a){return c?
a.toLowerCase():a},e=this.string.substr(this.pos,a.length);if(d(e)==d(a))return!1!==b&&(this.pos+=a.length),!0}else{if((a=this.string.slice(this.pos).match(a))&&0<a.index)return null;a&&!1!==b&&(this.pos+=a[0].length);return a}},current:function(){return this.string.slice(this.start,this.pos)},hideFirstChars:function(a,b){this.lineStart+=a;try{return b()}finally{this.lineStart-=a}}};var jb=a.TextMarker=function(a,b){this.lines=[];this.type=b;this.doc=a};zb(jb);jb.prototype.clear=function(){if(!this.explicitlyCleared){var a=
this.doc.cm,b=a&&!a.curOp;b&&sb(a);if(Aa(this,"clear")){var c=this.find();c&&da(this,"clear",c.from,c.to)}for(var d=c=null,e=0;e<this.lines.length;++e){var g=this.lines[e],h=Wb(g.markedSpans,this);a&&!this.collapsed?fb(a,Y(g),"text"):a&&(null!=h.to&&(d=Y(g)),null!=h.from&&(c=Y(g)));for(var k=g,l=g.markedSpans,p=h,m=void 0,r=0;r<l.length;++r)l[r]!=p&&(m||(m=[])).push(l[r]);k.markedSpans=m;null==h.from&&this.collapsed&&!ab(this.doc,g)&&a&&Fa(g,$a(a.display))}if(a&&this.collapsed&&!a.options.lineWrapping)for(e=
0;e<this.lines.length;++e)g=Ja(this.lines[e]),h=u(g),h>a.display.maxLineLength&&(a.display.maxLine=g,a.display.maxLineLength=h,a.display.maxLineChanged=!0);null!=c&&a&&this.collapsed&&va(a,c,d+1);this.lines.length=0;this.explicitlyCleared=!0;this.atomic&&this.doc.cantEdit&&(this.doc.cantEdit=!1,a&&Jd(a.doc));a&&da(a,"markerCleared",a,this);b&&tb(a)}};jb.prototype.find=function(a,b){null==a&&"bookmark"==this.type&&(a=1);for(var c,d,e=0;e<this.lines.length;++e){var g=this.lines[e],h=Wb(g.markedSpans,
this);if(null!=h.from&&(c=B(b?g:Y(g),h.from),-1==a))return c;if(null!=h.to&&(d=B(b?g:Y(g),h.to),1==a))return d}return c&&{from:c,to:d}};jb.prototype.changed=function(){var a=this.find(-1,!0),b=this,c=this.doc.cm;a&&c&&Na(c,function(){var d=a.line,e=Y(a.line);if(e=Md(c,e))Pd(e),c.curOp.selectionChanged=c.curOp.forceUpdate=!0;c.curOp.updateMaxLine=!0;ab(b.doc,d)||null==b.height||(e=b.height,b.height=null,(e=Nb(b)-e)&&Fa(d,d.height+e))})};jb.prototype.attachLine=function(a){if(!this.lines.length&&this.doc.cm){var b=
this.doc.cm.curOp;b.maybeHiddenMarkers&&-1!=ha(b.maybeHiddenMarkers,this)||(b.maybeUnhiddenMarkers||(b.maybeUnhiddenMarkers=[])).push(this)}this.lines.push(a)};jb.prototype.detachLine=function(a){this.lines.splice(ha(this.lines,a),1);!this.lines.length&&this.doc.cm&&(a=this.doc.cm.curOp,(a.maybeHiddenMarkers||(a.maybeHiddenMarkers=[])).push(this))};var kf=0,Jc=a.SharedTextMarker=function(a,b){this.markers=a;this.primary=b;for(var c=0,d=this;c<a.length;++c)a[c].parent=this,N(a[c],"clear",function(){d.clear()})};
zb(Jc);Jc.prototype.clear=function(){if(!this.explicitlyCleared){this.explicitlyCleared=!0;for(var a=0;a<this.markers.length;++a)this.markers[a].clear();da(this,"clear")}};Jc.prototype.find=function(a,b){return this.primary.find(a,b)};var Kc=a.LineWidget=function(a,b,c){if(c)for(var d in c)c.hasOwnProperty(d)&&(this[d]=c[d]);this.cm=a;this.node=b};zb(Kc);Kc.prototype.clear=function(){var a=this.cm,b=this.line.widgets,c=this.line,d=Y(c);if(null!=d&&b){for(var e=0;e<b.length;++e)b[e]==this&&b.splice(e--,
1);b.length||(c.widgets=null);var g=Nb(this);Na(a,function(){var b=-g;Ga(c)<(a.curOp&&a.curOp.scrollTop||a.doc.scrollTop)&&Cc(a,null,b);fb(a,d,"widget");Fa(c,Math.max(0,c.height-g))})}};Kc.prototype.changed=function(){var a=this.height,b=this.cm,c=this.line;this.height=null;var d=Nb(this)-a;d&&Na(b,function(){b.curOp.forceUpdate=!0;Ga(c)<(b.curOp&&b.curOp.scrollTop||b.doc.scrollTop)&&Cc(b,null,d);Fa(c,c.height+d)})};var kb=a.Line=function(a,b,c){this.text=a;xe(this,b);this.height=c?c(this):1};zb(kb);
kb.prototype.lineNo=function(){return Y(this)};var of={},nf={};Xb.prototype={chunkSize:function(){return this.lines.length},removeInner:function(a,b){for(var c=a,d=a+b;c<d;++c){var e=this.lines[c];this.height-=e.height;var g=e;g.parent=null;we(g);da(e,"delete")}this.lines.splice(a,b)},collapse:function(a){a.push.apply(a,this.lines)},insertInner:function(a,b,c){this.height+=c;this.lines=this.lines.slice(0,a).concat(b).concat(this.lines.slice(a));for(a=0;a<b.length;++a)b[a].parent=this},iterN:function(a,
b,c){for(b=a+b;a<b;++a)if(c(this.lines[a]))return!0}};Yb.prototype={chunkSize:function(){return this.size},removeInner:function(a,b){this.size-=b;for(var c=0;c<this.children.length;++c){var d=this.children[c],e=d.chunkSize();if(a<e){var g=Math.min(b,e-a),h=d.height;d.removeInner(a,g);this.height-=h-d.height;e==g&&(this.children.splice(c--,1),d.parent=null);if(0==(b-=g))break;a=0}else a-=e}25>this.size-b&&(1<this.children.length||!(this.children[0]instanceof Xb))&&(c=[],this.collapse(c),this.children=
[new Xb(c)],this.children[0].parent=this)},collapse:function(a){for(var b=0;b<this.children.length;++b)this.children[b].collapse(a)},insertInner:function(a,b,c){this.size+=b.length;this.height+=c;for(var d=0;d<this.children.length;++d){var e=this.children[d],g=e.chunkSize();if(a<=g){e.insertInner(a,b,c);if(e.lines&&50<e.lines.length){for(;50<e.lines.length;)a=e.lines.splice(e.lines.length-25,25),a=new Xb(a),e.height-=a.height,this.children.splice(d+1,0,a),a.parent=this;this.maybeSpill()}break}a-=
g}},maybeSpill:function(){if(!(10>=this.children.length)){var a=this;do{var b=a.children.splice(a.children.length-5,5),b=new Yb(b);if(a.parent){a.size-=b.size;a.height-=b.height;var c=ha(a.parent.children,a);a.parent.children.splice(c+1,0,b)}else c=new Yb(a.children),c.parent=a,a.children=[c,b],a=c;b.parent=a.parent}while(10<a.children.length);a.parent.maybeSpill()}},iterN:function(a,b,c){for(var d=0;d<this.children.length;++d){var e=this.children[d],g=e.chunkSize();if(a<g){g=Math.min(b,g-a);if(e.iterN(a,
g,c))return!0;if(0==(b-=g))break;a=0}else a-=g}}};var Af=0,la=a.Doc=function(a,b,c){if(!(this instanceof la))return new la(a,b,c);null==c&&(c=0);Yb.call(this,[new Xb([new kb("",null)])]);this.first=c;this.scrollTop=this.scrollLeft=0;this.cantEdit=!1;this.cleanGeneration=1;this.frontier=c;c=B(c,0);this.sel=ua(c);this.history=new Mc(null);this.id=++Af;this.modeOption=b;"string"==typeof a&&(a=ub(a));rd(this,{from:c,to:c,text:a});ba(this,ua(c),rb)};la.prototype=Ge(Yb.prototype,{constructor:la,iter:function(a,
b,c){c?this.iterN(a-this.first,b-a,c):this.iterN(this.first,this.first+this.size,a)},insert:function(a,b){for(var c=0,d=0;d<b.length;++d)c+=b[d].height;this.insertInner(a-this.first,b,c)},remove:function(a,b){this.removeInner(a-this.first,b)},getValue:function(a){var b=vd(this,this.first,this.first+this.size);return!1===a?b:b.join(a||"\n")},setValue:ta(function(a){var b=B(this.first,0),c=this.first+this.size-1;vb(this,{from:b,to:B(c,I(this,c).text.length),text:ub(a),origin:"setValue"},!0);ba(this,
ua(b))}),replaceRange:function(a,b,c,d){b=G(this,b);c=c?G(this,c):b;wc(this,a,b,c,d)},getRange:function(a,b,c){a=Ub(this,G(this,a),G(this,b));return!1===c?a:a.join(c||"\n")},getLine:function(a){return(a=this.getLineHandle(a))&&a.text},getLineHandle:function(a){if(Sa(this,a))return I(this,a)},getLineNumber:function(a){return Y(a)},getLineHandleVisualStart:function(a){"number"==typeof a&&(a=I(this,a));return Ja(a)},lineCount:function(){return this.size},firstLine:function(){return this.first},lastLine:function(){return this.first+
this.size-1},clipPos:function(a){return G(this,a)},getCursor:function(a){var b=this.sel.primary();return null==a||"head"==a?b.head:"anchor"==a?b.anchor:"end"==a||"to"==a||!1===a?b.to():b.from()},listSelections:function(){return this.sel.ranges},somethingSelected:function(){return this.sel.somethingSelected()},setCursor:ta(function(a,b,c){a=G(this,"number"==typeof a?B(a,b||0):a);ba(this,ua(a,null),c)}),setSelection:ta(function(a,b,c){var d=G(this,a);a=G(this,b||a);ba(this,ua(d,a),c)}),extendSelection:ta(function(a,
b,c){oa(this,G(this,a),b&&G(this,b),c)}),extendSelections:ta(function(a,b){for(var c=[],d=0;d<a.length;d++)c[d]=G(this,a[d]);ya(this,c)}),extendSelectionsBy:ta(function(a,b){ya(this,qd(this.sel.ranges,a),b)}),setSelections:ta(function(a,b,c){if(a.length){for(var d=0,e=[];d<a.length;d++)e[d]=new U(G(this,a[d].anchor),G(this,a[d].head));null==b&&(b=Math.min(a.length-1,this.sel.primIndex));ba(this,ka(e,b),c)}}),addSelection:ta(function(a,b,c){var d=this.sel.ranges.slice(0);d.push(new U(G(this,a),G(this,
b||a)));ba(this,ka(d,d.length-1),c)}),getSelection:function(a){for(var b=this.sel.ranges,c,d=0;d<b.length;d++){var e=Ub(this,b[d].from(),b[d].to());c=c?c.concat(e):e}return!1===a?c:c.join(a||"\n")},getSelections:function(a){for(var b=[],c=this.sel.ranges,d=0;d<c.length;d++){var e=Ub(this,c[d].from(),c[d].to());!1!==a&&(e=e.join(a||"\n"));b[d]=e}return b},replaceSelection:ta(function(a,b,c){for(var d=[],e=0;e<this.sel.ranges.length;e++)d[e]=a;this.replaceSelections(d,b,c||"+input")}),replaceSelections:function(a,
b,c){for(var d=[],e=this.sel,g=0;g<e.ranges.length;g++){var h=e.ranges[g];d[g]={from:h.from(),to:h.to(),text:ub(a[g]),origin:c}}if(g=b)if(g="end"!=b){g=[];c=a=B(this.first,0);for(e=0;e<d.length;e++){var k=d[e],h=ie(k.from,a,c),l=ie(wb(k),a,c);a=k.to;c=l;"around"==b?(k=this.sel.ranges[e],k=0>P(k.head,k.anchor),g[e]=new U(k?l:h,k?h:l)):g[e]=new U(h,h)}g=new L(g,this.sel.primIndex)}b=g;for(g=d.length-1;0<=g;g--)vb(this,d[g]);b?Bb(this,b):this.cm&&eb(this.cm)},undo:ta(function(){Bc(this,"undo")}),redo:ta(function(){Bc(this,
"redo")}),undoSelection:ta(function(){Bc(this,"undo",!0)}),redoSelection:ta(function(){Bc(this,"redo",!0)}),setExtending:function(a){this.extend=a},getExtending:function(){return this.extend},historySize:function(){for(var a=this.history,b=0,c=0,d=0;d<a.done.length;d++)a.done[d].ranges||++b;for(d=0;d<a.undone.length;d++)a.undone[d].ranges||++c;return{undo:b,redo:c}},clearHistory:function(){this.history=new Mc(this.history.maxGeneration)},markClean:function(){this.cleanGeneration=this.changeGeneration(!0)},
changeGeneration:function(a){a&&(this.history.lastOp=this.history.lastOrigin=null);return this.history.generation},isClean:function(a){return this.history.generation==(a||this.cleanGeneration)},getHistory:function(){return{done:yb(this.history.done),undone:yb(this.history.undone)}},setHistory:function(a){var b=this.history=new Mc(this.history.maxGeneration);b.done=yb(a.done.slice(0),null,!0);b.undone=yb(a.undone.slice(0),null,!0)},markText:function(a,b,c){return Vb(this,G(this,a),G(this,b),c,"range")},
setBookmark:function(a,b){var c={replacedWith:b&&(null==b.nodeType?b.widget:b),insertLeft:b&&b.insertLeft,clearWhenEmpty:!1,shared:b&&b.shared};a=G(this,a);return Vb(this,a,a,c,"bookmark")},findMarksAt:function(a){a=G(this,a);var b=[],c=I(this,a.line).markedSpans;if(c)for(var d=0;d<c.length;++d){var e=c[d];(null==e.from||e.from<=a.ch)&&(null==e.to||e.to>=a.ch)&&b.push(e.marker.parent||e.marker)}return b},findMarks:function(a,b){a=G(this,a);b=G(this,b);var c=[],d=a.line;this.iter(a.line,b.line+1,function(e){if(e=
e.markedSpans)for(var g=0;g<e.length;g++){var h=e[g];d==a.line&&a.ch>h.to||null==h.from&&d!=a.line||d==b.line&&h.from>b.ch||c.push(h.marker.parent||h.marker)}++d});return c},getAllMarks:function(){var a=[];this.iter(function(b){if(b=b.markedSpans)for(var c=0;c<b.length;++c)null!=b[c].from&&a.push(b[c].marker)});return a},posFromIndex:function(a){var b,c=this.first;this.iter(function(d){d=d.text.length+1;if(d>a)return b=a,!0;a-=d;++c});return G(this,B(c,b))},indexFromPos:function(a){a=G(this,a);var b=
a.ch;if(a.line<this.first||0>a.ch)return 0;this.iter(this.first,a.line,function(a){b+=a.text.length+1});return b},copy:function(a){var b=new la(vd(this,this.first,this.first+this.size),this.modeOption,this.first);b.scrollTop=this.scrollTop;b.scrollLeft=this.scrollLeft;b.sel=this.sel;b.extend=!1;a&&(b.history.undoDepth=this.history.undoDepth,b.setHistory(this.getHistory()));return b},linkedDoc:function(a){a||(a={});var b=this.first,c=this.first+this.size;null!=a.from&&a.from>b&&(b=a.from);null!=a.to&&
a.to<c&&(c=a.to);b=new la(vd(this,b,c),a.mode||this.modeOption,b);a.sharedHist&&(b.history=this.history);(this.linked||(this.linked=[])).push({doc:b,sharedHist:a.sharedHist});b.linked=[{doc:this,isParent:!0,sharedHist:a.sharedHist}];return b},unlinkDoc:function(b){b instanceof a&&(b=b.doc);if(this.linked)for(var c=0;c<this.linked.length;++c)if(this.linked[c].doc==b){this.linked.splice(c,1);b.unlinkDoc(this);break}if(b.history==this.history){var d=[b.id];xb(b,function(a){d.push(a.id)},!0);b.history=
new Mc(null);b.history.done=yb(this.history.done,d);b.history.undone=yb(this.history.undone,d)}},iterLinkedDocs:function(a){xb(this,a)},getMode:function(){return this.mode},getEditor:function(){return this.cm}});la.prototype.eachLine=la.prototype.iter;var Bf=["iter","insert","remove","copy","getEditor"],ac;for(ac in la.prototype)la.prototype.hasOwnProperty(ac)&&0>ha(Bf,ac)&&(a.prototype[ac]=function(a){return function(){return a.apply(this.doc,arguments)}}(la.prototype[ac]));zb(la);var ia=a.e_preventDefault=
function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},Cf=a.e_stopPropagation=function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},fd=a.e_stop=function(a){ia(a);Cf(a)},N=a.on=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent?a.attachEvent("on"+b,c):(a=a._handlers||(a._handlers={}),(a[b]||(a[b]=[])).push(c))},Xa=a.off=function(a,b,c){if(a.removeEventListener)a.removeEventListener(b,c,!1);else if(a.detachEvent)a.detachEvent("on"+b,c);else if(a=a._handlers&&
a._handlers[b])for(b=0;b<a.length;++b)if(a[b]==c){a.splice(b,1);break}},$=a.signal=function(a,b){var c=a._handlers&&a._handlers[b];if(c)for(var d=Array.prototype.slice.call(arguments,2),e=0;e<c.length;++e)c[e].apply(null,d)},Wa,mc=0,Oa=30,de=a.Pass={toString:function(){return"CodeMirror.Pass"}},rb={scroll:!1},vc={origin:"*mouse"},nb={origin:"+move"};Pc.prototype.set=function(a,b){clearTimeout(this.id);this.id=setTimeout(b,a)};var Ka=a.countColumn=function(a,b,c,d,e){null==b&&(b=a.search(/[^\s\u00a0]/),
-1==b&&(b=a.length));d=d||0;for(e=e||0;;){var g=a.indexOf("\t",d);if(0>g||g>=b)return e+(b-d);e+=g-d;e+=c-e%c;d=g+1}},Nc=[""],sc=function(a){a.select()};Cb?sc=function(a){a.selectionStart=0;a.selectionEnd=a.value.length}:na&&(sc=function(a){try{a.select()}catch(b){}});[].indexOf&&(ha=function(a,b){return a.indexOf(b)});[].map&&(qd=function(a,b){return a.map(b)});var Df=/[\u00df\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,Gc=a.isWordChar=function(a){return/\w/.test(a)||"\u0080"<
a&&(a.toUpperCase()!=a.toLowerCase()||Df.test(a))},vf=/[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/,
Mb;Mb=document.createRange?function(a,b,c){var d=document.createRange();d.setEnd(a,c);d.setStart(a,b);return d}:function(a,b,c){var d=document.body.createTextRange();d.moveToElementText(a.parentNode);d.collapse(!0);d.moveEnd("character",c);d.moveStart("character",b);return d};za&&(Ta=function(){try{return document.activeElement}catch(a){return document.body}});var Ze=function(){if(fa)return!1;var a=H("div");return"draggable"in a||"dragDrop"in a}(),Rb,wd,ud,ub=a.splitLines=3!="\n\nb".split(/\n/).length?
function(a){for(var b=0,c=[],d=a.length;b<=d;){var e=a.indexOf("\n",b);-1==e&&(e=a.length);var g=a.slice(b,"\r"==a.charAt(e-1)?e-1:e),h=g.indexOf("\r");-1!=h?(c.push(g.slice(0,h)),b+=h+1):(c.push(g),b=e+1)}return c}:function(a){return a.split(/\r\n?|\n/)},We=window.getSelection?function(a){try{return a.selectionStart!=a.selectionEnd}catch(b){return!1}}:function(a){try{var b=a.ownerDocument.selection.createRange()}catch(c){}return b&&b.parentElement()==a?0!=b.compareEndPoints("StartToEnd",b):!1},Td=
function(){var a=H("div");if("oncopy"in a)return!0;a.setAttribute("oncopy","return;");return"function"==typeof a.oncopy}(),Ya={3:"Enter",8:"Backspace",9:"Tab",13:"Enter",16:"Shift",17:"Ctrl",18:"Alt",19:"Pause",20:"CapsLock",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"PrintScrn",45:"Insert",46:"Delete",59:";",61:"=",91:"Mod",92:"Mod",93:"Mod",107:"=",109:"-",127:"Delete",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",
219:"[",220:"\\",221:"]",222:"'",63232:"Up",63233:"Down",63234:"Left",63235:"Right",63272:"Delete",63273:"Home",63275:"End",63276:"PageUp",63277:"PageDown",63302:"Insert"};a.keyNames=Ya;(function(){for(var a=0;10>a;a++)Ya[a+48]=Ya[a+96]=String(a);for(a=65;90>=a;a++)Ya[a]=String.fromCharCode(a);for(a=1;12>=a;a++)Ya[a+111]=Ya[a+63235]="F"+a})();var Ob,tf=function(){function a(b){return 247>=b?c.charAt(b):1424<=b&&1524>=b?"R":1536<=b&&1773>=b?d.charAt(b-1536):1774<=b&&2220>=b?"r":8192<=b&&8203>=b?"w":
8204==b?"b":"L"}function b(a,c,d){this.level=a;this.from=c;this.to=d}var c="bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN",d="rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm",
e=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,g=/[stwN]/,h=/[LRr]/,k=/[Lb1n]/,l=/[1n]/;return function(c){if(!e.test(c))return!1;for(var d=c.length,p=[],m=0,r;m<d;++m)p.push(a(c.charCodeAt(m)));for(var m=0,q="L";m<d;++m)r=p[m],"m"==r?p[m]=q:q=r;m=0;for(q="L";m<d;++m)r=p[m],"1"==r&&"r"==q?p[m]="n":h.test(r)&&(q=r,"r"==r&&(p[m]="R"));m=1;for(q=p[0];m<d-1;++m)r=p[m],"+"==r&&"1"==q&&"1"==p[m+1]?p[m]="1":","!=r||q!=p[m+1]||"1"!=q&&"n"!=q||(p[m]=q),q=r;for(m=0;m<d;++m)if(r=p[m],","==r)p[m]="N";else if("%"==
r){for(q=m+1;q<d&&"%"==p[q];++q);var s=m&&"!"==p[m-1]||q<d&&"1"==p[q]?"1":"N";for(r=m;r<q;++r)p[r]=s;m=q-1}m=0;for(q="L";m<d;++m)r=p[m],"L"==q&&"1"==r?p[m]="L":h.test(r)&&(q=r);for(m=0;m<d;++m)if(g.test(p[m])){for(q=m+1;q<d&&g.test(p[q]);++q);r="L"==(q<d?p[q]:"L");s="L"==(m?p[m-1]:"L")||r?"L":"R";for(r=m;r<q;++r)p[r]=s;m=q-1}for(var q=[],v,m=0;m<d;)if(k.test(p[m])){r=m;for(++m;m<d&&k.test(p[m]);++m);q.push(new b(0,r,m))}else{var u=m,s=q.length;for(++m;m<d&&"L"!=p[m];++m);for(r=u;r<m;)if(l.test(p[r])){u<
r&&q.splice(s,0,new b(1,u,r));u=r;for(++r;r<m&&l.test(p[r]);++r);q.splice(s,0,new b(2,u,r));u=r}else++r;u<m&&q.splice(s,0,new b(1,u,m))}1==q[0].level&&(v=c.match(/^\s+/))&&(q[0].from=v[0].length,q.unshift(new b(0,0,v[0].length)));1==W(q).level&&(v=c.match(/\s+$/))&&(W(q).to-=v[0].length,q.push(new b(0,d-v[0].length,d)));q[0].level!=W(q).level&&q.push(new b(q[0].level,d,d));return q}}();a.version="4.0.3";return a});

colorPalettesAliases={1:"mastersystem",2:"gameboycolour",3:"amiga",4:"arnecolors",5:"famicom",6:"atari",7:"pastel",8:"ega",9:"amstrad",10:"proteus_mellow",11:"proteus_rich",12:"proteus_night",13:"c64",14:"whitingjp"};

colorPalettes={mastersystem:{black:"#000000",white:"#FFFFFF",grey:"#555555",darkgrey:"#555500",lightgrey:"#AAAAAA",gray:"#555555",darkgray:"#555500",lightgray:"#AAAAAA",red:"#FF0000",darkred:"#AA0000",lightred:"#FF5555",brown:"#AA5500",darkbrown:"#550000",lightbrown:"#FFAA00",orange:"#FF5500",yellow:"#FFFF55",green:"#55AA00",darkgreen:"#005500",lightgreen:"#AAFF00",blue:"#5555AA",lightblue:"#AAFFFF",darkblue:"#000055",purple:"#550055",pink:"#FFAAFF"},gameboycolour:{black:"#000000",white:"#FFFFFF",
grey:"#7F7F7C",darkgrey:"#3E3E44",lightgrey:"#BAA7A7",gray:"#7F7F7C",darkgray:"#3E3E44",lightgray:"#BAA7A7",red:"#A7120C",darkred:"#880606",lightred:"#BA381F",brown:"#57381F",darkbrown:"#3E2519",lightbrown:"#8E634B",orange:"#BA4B32",yellow:"#C0BA6F",green:"#517525",darkgreen:"#385D12",lightgreen:"#6F8E44",blue:"#5D6FA7",lightblue:"#8EA7A7",darkblue:"#4B575D",purple:"#3E3E44",pink:"#BA381F"},amiga:{black:"#000000",white:"#FFFFFF",grey:"#BBBBBB",darkgrey:"#333333",lightgrey:"#FFEEDD",gray:"#BBBBBB",
darkgray:"#333333",lightgray:"#FFEEDD",red:"#DD1111",darkred:"#990000",lightred:"#FF4422",brown:"#663311",darkbrown:"#331100",lightbrown:"#AA6644",orange:"#FF6644",yellow:"#FFDD66",green:"#448811",darkgreen:"#335500",lightgreen:"#88BB77",blue:"#8899DD",lightblue:"#BBDDEE",darkblue:"#666688",purple:"#665555",pink:"#997788"},arnecolors:{black:"#000000",white:"#FFFFFF",grey:"#9d9d9d",darkgrey:"#697175",lightgrey:"#cccccc",gray:"#9d9d9d",darkgray:"#697175",lightgray:"#cccccc",red:"#be2633",darkred:"#732930",
lightred:"#e06f8b",brown:"#a46422",darkbrown:"#493c2b",lightbrown:"#eeb62f",orange:"#eb8931",yellow:"#f7e26b",green:"#44891a",darkgreen:"#2f484e",lightgreen:"#a3ce27",blue:"#1d57f7",lightblue:"#B2DCEF",darkblue:"#1B2632",purple:"#342a97",pink:"#de65e2"},famicom:{black:"#000000",white:"#ffffff",grey:"#7c7c7c",darkgrey:"#080808",lightgrey:"#bcbcbc",gray:"#7c7c7c",darkgray:"#080808",lightgray:"#bcbcbc",red:"#f83800",darkred:"#881400",lightred:"#f87858",brown:"#AC7C00",darkbrown:"#503000",lightbrown:"#FCE0A8",
orange:"#FCA044",yellow:"#F8B800",green:"#00B800",darkgreen:"#005800",lightgreen:"#B8F8B8",blue:"#0058F8",lightblue:"#3CBCFC",darkblue:"#0000BC",purple:"#6644FC",pink:"#F878F8"},atari:{black:"#000000",white:"#FFFFFF",grey:"#909090",darkgrey:"#404040",lightgrey:"#b0b0b0",gray:"#909090",darkgray:"#404040",lightgray:"#b0b0b0",red:"#A03C50",darkred:"#700014",lightred:"#DC849C",brown:"#805020",darkbrown:"#703400",lightbrown:"#CB9870",orange:"#CCAC70",yellow:"#ECD09C",green:"#58B06C",darkgreen:"#006414",
lightgreen:"#70C484",blue:"#1C3C88",lightblue:"#6888C8",darkblue:"#000088",purple:"#3C0080",pink:"#B484DC"},pastel:{black:"#000000",white:"#FFFFFF",grey:"#3e3e3e",darkgrey:"#313131",lightgrey:"#9cbcbc",gray:"#3e3e3e",darkgray:"#313131",lightgray:"#9cbcbc",red:"#f56ca2",darkred:"#a63577",lightred:"#ffa9cf",brown:"#b58c53",darkbrown:"#787562",lightbrown:"#B58C53",orange:"#EB792D",yellow:"#FFe15F",green:"#00FF4F",darkgreen:"#2b732c",lightgreen:"#97c04f",blue:"#0f88d3",lightblue:"#00fffe",darkblue:"#293a7b",
purple:"#ff6554",pink:"#eb792d"},ega:{black:"#000000",white:"#ffffff",grey:"#555555",darkgrey:"#555555",lightgrey:"#aaaaaa",gray:"#555555",darkgray:"#555555",lightgray:"#aaaaaa",red:"#ff5555",darkred:"#aa0000",lightred:"#ff55ff",brown:"#aa5500",darkbrown:"#aa5500",lightbrown:"#ffff55",orange:"#ff5555",yellow:"#ffff55",green:"#00aa00",darkgreen:"#00aaaa",lightgreen:"#55ff55",blue:"#5555ff",lightblue:"#55ffff",darkblue:"#0000aa",purple:"#aa00aa",pink:"#ff55ff"},proteus_mellow:{black:"#3d2d2e",white:"#ddf1fc",
grey:"#9fb2d4",darkgrey:"#7b8272",lightgrey:"#a4bfda",gray:"#9fb2d4",darkgray:"#7b8272",lightgray:"#a4bfda",red:"#9d5443",darkred:"#8c5b4a",lightred:"#94614c",brown:"#89a78d",darkbrown:"#829e88",lightbrown:"#aaae97",orange:"#d1ba86",yellow:"#d6cda2",green:"#75ac8d",darkgreen:"#8fa67f",lightgreen:"#8eb682",blue:"#88a3ce",lightblue:"#a5adb0",darkblue:"#5c6b8c",purple:"#d39fac",pink:"#c8ac9e"},proteus_night:{black:"#010912",white:"#fdeeec",grey:"#051d40",darkgrey:"#091842",lightgrey:"#062151",gray:"#051d40",
darkgray:"#091842",lightgray:"#062151",red:"#ad4576",darkred:"#934765",lightred:"#ab6290",brown:"#61646b",darkbrown:"#3d2d2d",lightbrown:"#8393a0",orange:"#0a2227",yellow:"#0a2541",green:"#75ac8d",darkgreen:"#0a2434",lightgreen:"#061f2e",blue:"#0b2c79",lightblue:"#809ccb",darkblue:"#08153b",purple:"#666a87",pink:"#754b4d"},proteus_rich:{black:"#6f686f",white:"#d1b1e2",grey:"#b9aac1",darkgrey:"#8e8b84",lightgrey:"#c7b5cd",gray:"#b9aac1",darkgray:"#8e8b84",lightgray:"#c7b5cd",red:"#a11f4f",darkred:"#934765",
lightred:"#c998ad",brown:"#89867d",darkbrown:"#797f75",lightbrown:"#ab9997",orange:"#ce8c5c",yellow:"#f0d959",green:"#75bc54",darkgreen:"#599d79",lightgreen:"#90cf5c",blue:"#8fd0ec",lightblue:"#bcdce7",darkblue:"#0b2c70",purple:"#9b377f",pink:"#cd88e5"},amstrad:{black:"#000000",white:"#ffffff",grey:"#7f7f7f",darkgrey:"#636363",lightgrey:"#afafaf",gray:"#7f7f7f",darkgray:"#636363",lightgray:"#afafaf",red:"#ff0000",darkred:"#7f0000",lightred:"#ff7f7f",brown:"#ff7f00",darkbrown:"#7f7f00",lightbrown:"#ffff00",
orange:"#ff007f",yellow:"#ffff7f",green:"#01ff00",darkgreen:"#007f00",lightgreen:"#7fff7f",blue:"#0000ff",lightblue:"#7f7fff",darkblue:"#00007f",purple:"#7f007f",pink:"#ff7fff"},c64:{black:"#000000",white:"#ffffff",grey:"#6C6C6C",darkgrey:"#444444",lightgrey:"#959595",gray:"#6C6C6C",darkgray:"#444444",lightgray:"#959595",red:"#68372B",darkred:"#3f1e17",lightred:"#9A6759",brown:"#433900",darkbrown:"#221c02",lightbrown:"#6d5c0d",orange:"#6F4F25",yellow:"#B8C76F",green:"#588D43",darkgreen:"#345129",
lightgreen:"#9AD284",blue:"#6C5EB5",lightblue:"#70A4B2",darkblue:"#352879",purple:"#6F3D86",pink:"#b044ac"},whitingjp:{black:"#202527",white:"#eff8fd",grey:"#7b7680",darkgrey:"#3c3b44",lightgrey:"#bed0d7",gray:"#7b7680",darkgray:"#3c3b44",lightgray:"#bed0d7",red:"#bd194b",darkred:"#6b1334",lightred:"#ef2358",brown:"#b52e1c",darkbrown:"#681c12",lightbrown:"#e87b45",orange:"#ff8c10",yellow:"#fbd524",green:"#36bc3c",darkgreen:"#317610",lightgreen:"#8ce062",blue:"#3f62c6",lightblue:"#57bbe0",darkblue:"#2c2fa0",
purple:"#7037d9",pink:"#ec2b8f"}};

var reg_color_names=/(black|white|darkgray|lightgray|gray|grey|darkgrey|lightgrey|red|darkred|lightred|brown|darkbrown|lightbrown|orange|yellow|green|darkgreen|lightgreen|blue|lightblue|darkblue|purple|pink|transparent)\s*/,reg_color=/(black|white|gray|darkgray|lightgray|grey|darkgrey|lightgrey|red|darkred|lightred|brown|darkbrown|lightbrown|orange|yellow|green|darkgreen|lightgreen|blue|lightblue|darkblue|purple|pink|transparent|#(?:[0-9a-f]{3}){1,2})\s*/;
function createSprite(a,b,c,d){void 0===c&&(c=[state.bgcolor,state.fgcolor]);a=makeSpriteCanvas(a);var e=a.getContext("2d");e.clearRect(0,0,cellwidth,cellheight);var g=b[0].length,h=b.length,l=~~(cellwidth/(g+(d|0))),p=d=~~(cellheight/(h+(d|0)));"scanline"in state.metadata&&(p=Math.ceil(d/2));e.fillStyle=state.fgcolor;for(var m=0;m<g;m++)for(var u=0;u<h;u++){var A=b[m][u];if(0<=A){var D=m*l|0,E=u*d|0;e.fillStyle=c[A];e.fillRect(E,D,l,p)}}return a}

function regenText(a,b){textImages={};for(var c in font)font.hasOwnProperty(c)&&(textImages[c]=createSprite("char"+c,font[c],void 0,1))}

var spriteimages;

function regenSpriteImages(){if(textMode)regenText();else if(levelEditorOpened&&(textImages.s=createSprite("chars",font.s,void 0)),0!==state.levels.length){spriteimages=[];for(var a=0;a<sprites.length;a++)void 0!=sprites[a]&&(spriteimages[a]=createSprite(a.toString(),sprites[a].dat,sprites[a].colors));canOpenEditor&&generateGlyphImages()}}

var glyphImagesCorrespondance,glyphImages,glyphHighlight,glyphHighlightResize,glyphPrintButton,glyphMouseOver,glyphSelectedIndex=0,editorRowCount=1,canvasdict={};

function makeSpriteCanvas(a){var b;a in canvasdict?b=canvasdict[a]:(b=document.createElement("canvas"),canvasdict[a]=b);b.width=cellwidth;b.height=cellheight;return b}

function generateGlyphImages(){if(0!==cellwidth&&0!==cellheight){glyphImagesCorrespondance=[];glyphImages=[];for(var a in state.glyphDict)if(1==a.length&&state.glyphDict.hasOwnProperty(a)){var b=state.glyphDict[a],c=makeSpriteCanvas("C"+a),d=c.getContext("2d");glyphImagesCorrespondance.push(a);for(var e=0;e<b.length;e++){var g=b[e];-1!==g&&d.drawImage(spriteimages[g],0,0)}glyphImages.push(c)}glyphHighlight=makeSpriteCanvas("highlight");d=glyphHighlight.getContext("2d");d.fillStyle="#FFFFFF";d.fillRect(0,
0,cellwidth,1);d.fillRect(0,0,1,cellheight);d.fillRect(0,cellheight-1,cellwidth,1);d.fillRect(cellwidth-1,0,1,cellheight);glyphPrintButton=textImages.s;glyphHighlightResize=makeSpriteCanvas("highlightresize");d=glyphHighlightResize.getContext("2d");d.fillStyle="#FFFFFF";a=cellwidth/2-1|0;b=cellheight/2-1|0;c=cellheight-b-1-a;d.fillRect(a,0,cellwidth-a-1-a,cellheight);d.fillRect(0,b,cellwidth,c);glyphMouseOver=makeSpriteCanvas();d=glyphMouseOver.getContext("2d");d.fillStyle="yellow";d.fillRect(0,0,
cellwidth,2);d.fillRect(0,0,2,cellheight);d.fillRect(0,cellheight-2,cellwidth,2);d.fillRect(cellwidth-2,0,2,cellheight)}}

var canvas,ctx,x,y,cellwidth,cellheight,magnification,xoffset,yoffset;window.addEventListener("resize",canvasResize,!1);canvas=document.getElementById("gameCanvas");ctx=canvas.getContext("2d");y=x=0;

function glyphCount(){var a=0,b;for(b in state.glyphDict)1==b.length&&state.glyphDict.hasOwnProperty(b)&&a++;return a}

function redraw(){
	if(0!==cellwidth&&0!==cellheight)
		if(void 0===spriteimages&&regenSpriteImages(),textMode){
			ctx.fillStyle=state.bgcolor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			for(var a=0;a<titleWidth;a++)
				for(var b=0;b<titleHeight;b++){
					var c=titleImage[b].charAt(a);
					if(c in textImages){
						var d=textImages[c];
						ctx.drawImage(d,xoffset+a*cellwidth,yoffset+b*cellheight)
						}
				}
		}
		else{
			ctx.fillStyle=state.bgcolor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			
			var c=0,e=screenwidth,g=0,h=screenheight;
			levelEditorOpened?(a=glyphCount(),editorRowCount=Math.ceil(a/(screenwidth-1)),e-=2,h-=2+editorRowCount):flickscreen?(a=getPlayerPositions(),0<a.length?(e=a[0],c=e/level.height|0,e=e%level.height|0,e=e/screenheight|0,c=(c/screenwidth|0)*screenwidth,g=e*screenheight,e=Math.min(c+screenwidth,level.width),h=Math.min(g+screenheight,level.height),oldflickscreendat=[c,g,e,h]):0<oldflickscreendat.length&&(c=oldflickscreendat[0],g=oldflickscreendat[1],e=oldflickscreendat[2],h=oldflickscreendat[3])):zoomscreen&&(a=getPlayerPositions(),0<a.length?(e=a[0],c=e/level.height|0,e=e%level.height|0,c=Math.max(Math.min(c-(screenwidth/2|0),level.width-screenwidth),0),g=Math.max(Math.min(e-(screenheight/2|0),level.height-screenheight),0),e=Math.min(c+screenwidth,level.width),h=Math.min(g+screenheight,level.height),oldflickscreendat=[c,g,e,h]):0<oldflickscreendat.length&&(c=oldflickscreendat[0],g=oldflickscreendat[1],e=oldflickscreendat[2],h=oldflickscreendat[3]));
			
			for(a=c;a<e;a++)
				for(b=g;b<h;b++)
					for(var l=level.getCellInto(b+a*level.height,_o12),p=0;p<state.objectCount;p++)
						0!=l.get(p)&&(d=spriteimages[p],ctx.drawImage(d,xoffset+(a-c)*cellwidth,yoffset+(b-g)*cellheight));
					levelEditorOpened&&drawEditorIcons()
		}
}

function drawEditorIcons(){var a=glyphImages.length-0;ctx.drawImage(glyphPrintButton,xoffset-cellwidth,yoffset-cellheight*(1+editorRowCount));mouseCoordY===-1-editorRowCount&&-1===mouseCoordX&&ctx.drawImage(glyphMouseOver,xoffset-cellwidth,yoffset-cellheight*(1+editorRowCount));for(var b=editorRowCount-(-mouseCoordY-2)-1,c=mouseCoordX+(screenwidth-1)*b,d=0;d<a;d++){var e=glyphImages[0+d],g=d%(screenwidth-1),b=d/(screenwidth-1)|0;ctx.drawImage(e,xoffset+g*cellwidth,yoffset+b*cellheight-cellheight*
(1+editorRowCount));0<=mouseCoordX&&mouseCoordX<screenwidth-1&&c===d&&ctx.drawImage(glyphMouseOver,xoffset+g*cellwidth,yoffset+b*cellheight-cellheight*(1+editorRowCount));d===glyphSelectedIndex&&ctx.drawImage(glyphHighlight,xoffset+g*cellwidth,yoffset+b*cellheight-cellheight*(1+editorRowCount))}-1<=mouseCoordX&&-1<=mouseCoordY&&mouseCoordX<screenwidth-1&&mouseCoordY<screenheight-1-editorRowCount&&(-1==mouseCoordX||-1==mouseCoordY||mouseCoordX==screenwidth-2||mouseCoordY===screenheight-2-editorRowCount?
ctx.drawImage(glyphHighlightResize,xoffset+mouseCoordX*cellwidth,yoffset+mouseCoordY*cellheight):ctx.drawImage(glyphHighlight,xoffset+mouseCoordX*cellwidth,yoffset+mouseCoordY*cellheight))}

var lastDownTarget,oldcellwidth=0,oldcellheight=0,oldtextmode=-1,oldfgcolor=-1,forceRegenImages=!1;

function canvasResize(){
	canvas.width=canvas.parentNode.clientWidth;
	canvas.height=canvas.parentNode.clientHeight;
	screenwidth=level.width;screenheight=level.height;
	if(void 0!==state)
		if(flickscreen=void 0!==state.metadata.flickscreen,zoomscreen=void 0!==state.metadata.zoomscreen,levelEditorOpened){
			screenwidth+=2;
			var a=glyphCount();
			editorRowCount=Math.ceil(a/(screenwidth-1));
			screenheight+=2+editorRowCount
		}
		else 
			flickscreen?(screenwidth=state.metadata.flickscreen[0],screenheight=state.metadata.flickscreen[1]):zoomscreen&&(screenwidth=state.metadata.zoomscreen[0],screenheight=state.metadata.zoomscreen[1]);
		textMode&&(screenwidth=titleWidth,screenheight=titleHeight);
		cellwidth=canvas.width/screenwidth;
		cellheight=canvas.height/screenheight;
		var b=a=5;
		textMode&&(b=a=6);
		cellwidth=a*~~(cellwidth/a);
		cellheight=b*~~(cellheight/b);
		yoffset=xoffset=0;
		cellwidth>cellheight?(cellwidth=cellheight,xoffset=(canvas.width-cellwidth*screenwidth)/2,yoffset=(canvas.height-cellheight*screenheight)/2):(cellheight=cellwidth,yoffset=(canvas.height-cellheight*screenheight)/2,xoffset=(canvas.width-cellwidth*screenwidth)/2);
		magnification=cellwidth/a*5|0;levelEditorOpened&&!textMode&&(xoffset+=cellwidth,yoffset+=cellheight*(1+editorRowCount));
		cellwidth|=0;
		cellheight|=0;
		xoffset|=0;
		yoffset|=0;
		if(oldcellwidth!=cellwidth||oldcellheight!=cellheight||oldtextmode!=textMode||oldfgcolor!=state.fgcolor||forceRegenImages)
			forceRegenImages=!1,regenSpriteImages();
		oldcellheight=cellheight;
		oldcellwidth=cellwidth;
		oldtextmode=textMode;oldfgcolor=state.fgcolor;
		redraw()};

var RandomGen=new RNG,intro_template="..................................;..................................;..................................;......Puzzle Script Terminal......;..............v 1.F...............;..................................;..................................;..................................;.........insert cartridge.........;..................................;..................................;..................................;..................................".split(";"),
messagecontainer_template="..................................;..................................;..................................;..................................;..................................;..................................;..................................;..................................;..................................;..................................;..........X to continue...........;..................................;..................................".split(";"),titletemplate_firstgo=
"..................................;..................................;..................................;..................................;..................................;..................................;..........#.start game.#..........;..................................;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),titletemplate_select0="..................................;..................................;..................................;..................................;..................................;...........#.new game.#...........;..................................;.............continue.............;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),
titletemplate_select1="..................................;..................................;..................................;..................................;..................................;.............new game.............;..................................;...........#.continue.#...........;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),titletemplate_firstgo_selected=
"..................................;..................................;..................................;..................................;..................................;..................................;###########.start game.###########;..................................;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),titletemplate_select0_selected="..................................;..................................;..................................;..................................;..................................;############.new game.############;..................................;.............continue.............;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),
titletemplate_select1_selected="..................................;..................................;..................................;..................................;..................................;.............new game.............;..................................;############.continue.############;..................................;.arrow keys to move...............;.X to action,....................;.F to provide feedback............;.Z to undo, R to restart..........".split(";"),titleImage=
[],titleWidth=titletemplate_select1[0].length,titleHeight=titletemplate_select1.length,textMode=!0,titleScreen=!0,titleMode=0,titleSelection=0,titleSelected=!1;

function unloadGame(){state=introstate;level=new Level(0,5,5,2,null);level.objects=new Int32Array(0);generateTitleScreen();canvasResize();redraw()}

function generateTitleScreen(){titleMode=0<curlevel||null!==curlevelTarget?1:0;if(0===state.levels.length)titleImage=intro_template;else{var a="PuzzleScript Game";void 0!==state.metadata.title&&(a=state.metadata.title);titleImage=0===titleMode?titleSelected?deepClone(titletemplate_firstgo_selected):deepClone(titletemplate_firstgo):0===titleSelection?titleSelected?deepClone(titletemplate_select0_selected):deepClone(titletemplate_select0):titleSelected?deepClone(titletemplate_select1_selected):deepClone(titletemplate_select1);

var b="noaction"in state.metadata,c="noundo"in state.metadata,d="norestart"in state.metadata;c&&d?titleImage[11]="..................................":c?titleImage[11]=".R to restart.....................":d&&(titleImage[11]=".Z to undo.....................");b&&(titleImage[10]=".X to select......................");for(b=0;b<titleImage.length;b++)titleImage[b]=titleImage[b].replace(/\./g," ");c=titleImage[0].length;d=wordwrap(a,titleImage[0].length);for(b=0;b<d.length;b++){var e=d[b],g=(c-e.length)/
2|0,a=titleImage[1+b];titleImage[1+b]=a.slice(0,g)+e+a.slice(g+e.length)}if(void 0!==state.metadata.author)for(d=wordwrap("by "+state.metadata.author,titleImage[0].length),b=0;b<d.length;b++)e=d[b]+" ",e.length>c&&(e=e.slice(0,c)),a=titleImage[3+b],titleImage[3+b]=a.slice(0,c-e.length)+e}}

var introstate={title:"2D Whale World",attribution:"increpare",objectCount:2,metadata:[],levels:[],bgcolor:"#000000",fgcolor:"#FFFFFF"},state=introstate;

function deepClone(a){if(!a)return a;var b;[Number,String,Boolean].forEach(function(c){a instanceof c&&(b=c(a))});if("undefined"==typeof b)if("[object Array]"===Object.prototype.toString.call(a))b=[],a.forEach(function(a,c,g){b[c]=deepClone(a)});else if("object"==typeof a)if(a.nodeType&&"function"==typeof a.cloneNode)b=a.cloneNode(!0);else if(a.prototype)b=a;else if(a instanceof Date)b=new Date(a);else{b={};for(var c in a)b[c]=deepClone(a[c])}else b=a;return b}

function wordwrap(a,b){b=b||75;return a?a.match(RegExp(".{1,"+b+"}(\\s|$)"+("|.{"+b+"}|.+$"),"g")):a}var splitMessage=[];

function drawMessageScreen(){titleMode=0;textMode=!0;titleImage=deepClone(messagecontainer_template);for(var a=0;a<titleImage.length;a++)titleImage[a]=titleImage[a].replace(/\./g," ");var b=titleImage[9],c=titleImage[10];titleImage[10]=b;var d=titleImage[0].length,e;e=""===messagetext?state.levels[curlevel].message.trim():messagetext;splitMessage=wordwrap(e,titleImage[0].length);var g=5-(splitMessage.length/2|0);0>g&&(g=0);e=Math.min(splitMessage.length,12);for(a=0;a<e;a++){var h=splitMessage[a],
l=g+a,p=(d-h.length)/2|0,m=titleImage[l];titleImage[l]=m.slice(0,p)+h+m.slice(p+h.length)}d=10;10<=e&&(d=12>e?e+1:12);titleImage[d]=quittingMessageScreen?b:c;canvasResize()}

var loadedLevelSeed=0;

function loadLevelFromLevelDat(a,b,c){
	null==c&&(c=(Math.random()+Date.now()).toString());
	loadedLevelSeed=c;
	RandomGen=new RNG(loadedLevelSeed);
	forceRegenImages=!0;titleScreen=!1;
	titleMode=0<curlevel||null!==curlevelTarget?1:0;titleSelection=0<curlevel||null!==curlevelTarget?1:0;againing=titleSelected=!1;
	void 0===b?(consolePrint("Trying to access a level that doesn't exist.",!0),goToTitleScreen()):(void 0===b.message?(titleMode=0,textMode=!1,level=b.clone(),RebuildLevelArrays(),void 0!==a&&(void 0!==a.metadata.flickscreen?oldflickscreendat=[0,0,Math.min(a.metadata.flickscreen[0],level.width),Math.min(a.metadata.flickscreen[1],level.height)]:void 0!==a.metadata.zoomscreen&&(oldflickscreendat=[0,0,Math.min(a.metadata.zoomscreen[0],level.width),Math.min(a.metadata.zoomscreen[1],level.height)])),backups=[],restartTarget=backupLevel(),keybuffer=[],"run_rules_on_level_start"in a.metadata&&processInput(-1,!0)):(tryPlayShowMessageSound(),drawMessageScreen(),canvasResize()),clearInputHistory())}

function loadLevelFromStateTarget(a,b,c,d){
	curlevel=b;
	curlevelTarget=c;
	void 0===c.message&&tryPlayStartLevelSound();
	loadLevelFromLevelDat(a,a.levels[b],d);
	restoreLevel(c);
	restartTarget=c}
	
function loadLevelFromState(a,b,c){
	var d=a.levels[b];
	curlevel=b;
	curlevelTarget=null;
	void 0!==d&&void 0===d.message&&tryPlayStartLevelSound();
	loadLevelFromLevelDat(a,d,c)}

var sprites=[{color:"#423563",dat:[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]]},{color:"#252342",dat:[[0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],[0,1,1,1,0],[0,1,0,1,0]]}];generateTitleScreen();0<titleMode&&(titleSelection=1);canvasResize();
function tryPlaySimpleSound(a){void 0!==state.sfx_Events[a]&&playSound(state.sfx_Events[a])}
function tryPlayTitleSound(){tryPlaySimpleSound("titlescreen")}
function tryPlayStartGameSound(){tryPlaySimpleSound("startgame")}

function tryPlayEndGameSound(){tryPlaySimpleSound("endgame")}function tryPlayCancelSound(){tryPlaySimpleSound("cancel")}function tryPlayStartLevelSound(){tryPlaySimpleSound("startlevel")}function tryPlayEndLevelSound(){tryPlaySimpleSound("endlevel")}function tryPlayUndoSound(){tryPlaySimpleSound("undo")}function tryPlayRestartSound(){tryPlaySimpleSound("restart")}function tryPlayShowMessageSound(){tryPlaySimpleSound("showmessage")}

function tryPlayCloseMessageSound(){tryPlaySimpleSound("closemessage")}
var backups=[],restartTarget;
function backupLevel(){return{dat:new Int32Array(level.objects),width:level.width,height:level.height,oldflickscreendat:oldflickscreendat.concat([])}}
function level4Serialization(){return{dat:Array.from(level.objects),width:level.width,height:level.height,oldflickscreendat:oldflickscreendat.concat([])}}

function setGameState(a,b,c){
	oldflickscreendat=[];
	autotick=timer=0;
	messageselected=againing=winning=!1;
	STRIDE_MOV=a.STRIDE_MOV;
	STRIDE_OBJ=a.STRIDE_OBJ;
	sfxCreateMask=new BitVec(STRIDE_OBJ);
	sfxDestroyMask=new BitVec(STRIDE_OBJ);
	void 0===b&&(b=["restart"]);
	(0===state.levels.length||0===a.levels.length)&&0<b.length&&"rebuild"===b[0]&&(b=["restart"]);
	void 0===c&&(c=null);
	RandomGen=new RNG(c);
	state=a;
	window.console.log("setting game state :D ");
	"rebuild"!==b[0]&&(backups=[]);
	sprites=[];
	for(var d in state.objects)
		state.objects.hasOwnProperty(d)&&(a=state.objects[d],sprites[a.id]={colors:a.colors,dat:a.spritematrix});
	void 0!==state.metadata.realtime_interval?(autotick=0,autotickinterval=1E3*state.metadata.realtime_interval):autotickinterval=autotick=0;
	repeatinterval=void 0!==state.metadata.key_repeat_interval?1E3*state.metadata.key_repeat_interval:150;
	againinterval=void 0!==state.metadata.again_interval?1E3*state.metadata.again_interval:150;throttle_movement&&0===autotickinterval&&logWarning("throttle_movement is designed for use in conjunction with realtime_interval. Using it in other situations makes games gross and unresponsive, broadly speaking.  Please don't.");
	norepeat_action=void 0!==state.metadata.norepeat_action;
	switch(b[0]){
		case "restart":if(!0==restarting){
			logWarning('A "restart" command is being triggered in the "run_rules_on_level_start" section of level creation, which would cause an infinite loop if it was actually triggered, but it\'s being ignored, so it\'s not.');break}
			winning=!1;
			timer=0;
			titleScreen=!0;
			tryPlayTitleSound();
			textMode=!0;
			titleSelection=0<curlevel||null!==curlevelTarget?1:0;messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=!1;
			titleMode=0;
			if(0<curlevel||null!==curlevelTarget)
				titleMode=1;
			generateTitleScreen();
			break;
		case "loadLevel":d=b[1];
			curlevel=e;
			winning=!1;
			timer=0;
			textMode=titleScreen=!1;
			titleSelection=0<curlevel||null!==curlevelTarget?1:0;
			messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=!1;
			titleMode=0;
			loadLevelFromState(state,d,c);
			break;
		case "levelline":c=b[1];
			for(var e=state.levels.length-1;0<=e;e--)
				if(state.levels[e].lineNumber<=c+1){
					curlevel=e;
					winning=!1;
					timer=0;
					textMode=titleScreen=!1;
					titleSelection=0<curlevel||null!==curlevelTarget?1:0;
					messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=!1;
					titleMode=0;
					loadLevelFromState(state,e);
					break}
	}
	"rebuild"!==b[0]&&clearInputHistory();
	canvasResize();
	canYoutube&&"youtube"in state.metadata&&(b=state.metadata.youtube,b="https://www.youtube.com/embed/"+b+"?autoplay=1&loop=1&playlist="+b,ifrm=document.createElement("IFRAME"),ifrm.setAttribute("src",b),ifrm.style.visibility="hidden",ifrm.style.width="500px",ifrm.style.height="500px",ifrm.style.position="absolute",ifrm.style.top="-1000px",ifrm.style.left="-1000px",document.body.appendChild(ifrm))
}

function RebuildLevelArrays(){level.movements=new Int32Array(level.n_tiles*STRIDE_MOV);level.rigidMovementAppliedMask=[];level.rigidGroupIndexMask=[];level.rowCellContents=[];level.colCellContents=[];level.mapCellContents=new BitVec(STRIDE_OBJ);_movementVecs=[new BitVec(STRIDE_MOV),new BitVec(STRIDE_MOV),new BitVec(STRIDE_MOV)];_o1=new BitVec(STRIDE_OBJ);_o2=new BitVec(STRIDE_OBJ);_o2_5=new BitVec(STRIDE_OBJ);_o3=new BitVec(STRIDE_OBJ);_o4=new BitVec(STRIDE_OBJ);_o5=new BitVec(STRIDE_OBJ);_o6=new BitVec(STRIDE_OBJ);
_o7=new BitVec(STRIDE_OBJ);_o8=new BitVec(STRIDE_OBJ);_o9=new BitVec(STRIDE_OBJ);_o10=new BitVec(STRIDE_OBJ);_o11=new BitVec(STRIDE_OBJ);_o12=new BitVec(STRIDE_OBJ);_m1=new BitVec(STRIDE_MOV);_m2=new BitVec(STRIDE_MOV);_m3=new BitVec(STRIDE_MOV);for(var a=0;a<level.height;a++)level.rowCellContents[a]=new BitVec(STRIDE_OBJ);for(a=0;a<level.width;a++)level.colCellContents[a]=new BitVec(STRIDE_OBJ);for(a=0;a<level.n_tiles;a++)level.rigidMovementAppliedMask[a]=new BitVec(STRIDE_MOV),level.rigidGroupIndexMask[a]=
new BitVec(STRIDE_MOV)}var messagetext="";

function restoreLevel(a){oldflickscreendat=a.oldflickscreendat.concat([]);level.objects=new Int32Array(a.dat);if(level.width!==a.width||level.height!==a.height)level.width=a.width,level.height=a.height,level.n_tiles=a.width*a.height,RebuildLevelArrays();else{for(a=0;a<level.n_tiles;a++)level.movements[a]=0,level.rigidMovementAppliedMask[a]=0,level.rigidGroupIndexMask[a]=0;for(a=0;a<level.height;a++)level.rowCellContents[a].setZero();for(a=0;a<level.width;a++)level.colCellContents[a].setZero()}againing=!1;
level.commandQueue=[]}var zoomscreen=!1,flickscreen=!1,screenwidth=0,screenheight=0;function DoRestart(a){!0!==restarting&&(restarting=!0,!0!==a&&"norestart"in state.metadata||(!1===a&&backups.push(backupLevel()),verbose_logging&&consolePrint("--- restarting ---",!0),restoreLevel(restartTarget),tryPlayRestartSound(),"run_rules_on_level_start"in state.metadata&&processInput(-1,!0),level.commandQueue=[],restarting=!1))}

function backupDiffers(){if(0==backups.length)return!0;for(var a=backups[backups.length-1],b=0;b<level.objects.length;b++)if(level.objects[b]!==a.dat[b])return!0;return!1}

function DoUndo(a,b){if(levelEditorOpened||!("noundo"in state.metadata&&!0!==a)){verbose_logging&&consolePrint("--- undoing ---",!0);if(b)for(;!1==backupDiffers();)backups.pop();0<backups.length&&(restoreLevel(backups[backups.length-1]),backups=backups.splice(0,backups.length-1),a||tryPlayUndoSound())}}

function getPlayerPositions(){var a=[],b=state.playerMask;for(i=0;i<level.n_tiles;i++)level.getCellInto(i,_o11),b.anyBitsInCommon(_o11)&&a.push(i);return a}

function getLayersOfMask(a){for(var b=[],c=0;c<state.objectCount;c++)a.get(c)&&b.push(state.objects[state.idDict[c]].layer);return b}

function moveEntitiesAtIndex(a,b,c){var d=level.getCell(a);d.iand(b);b=getLayersOfMask(d);for(var d=level.getMovements(a),e=0;e<b.length;e++)d.ishiftor(c,5*b[e]);level.setMovements(a,d)}

function startMovement(a){for(var b=getPlayerPositions(),c=0;c<b.length;c++)moveEntitiesAtIndex(b[c],state.playerMask,a);return b}var dirMasksDelta={1:[0,-1],2:[0,1],4:[-1,0],8:[1,0],15:[0,0],16:[0,0],3:[0,0]},dirMaskName={1:"up",2:"down",4:"left",8:"right",15:"?",16:"action",3:"no"},seedsToPlay_CanMove=[],seedsToPlay_CantMove=[];

function repositionEntitiesOnLayer(a,b,c){var d=dirMasksDelta[c],e=d[0],g=d[1],h=a/level.height|0,l=a%level.height,p=level.width-1,m=level.height-1;if(0===h&&0>e||h===p&&0<e||0===l&&0>g||l===m&&0<g)return!1;d=a+d[1]+d[0]*level.height;b=state.layerMasks[b];e=level.getCellInto(d,_o7);g=level.getCellInto(a,_o8);if(b.anyBitsInCommon(e)&&16!=c)return!1;for(c=0;c<state.sfx_MovementMasks.length;c++)h=state.sfx_MovementMasks[c],h.objectMask.anyBitsInCommon(g)&&level.getMovements(a).anyBitsInCommon(h.directionMask)&&
-1===seedsToPlay_CanMove.indexOf(h.seed)&&seedsToPlay_CanMove.push(h.seed);c=g.clone();g.iclear(b);c.iand(b);e.ior(c);level.setCell(a,g);level.setCell(d,e);a=d%level.height;level.colCellContents[d/level.height|0].ior(c);level.rowCellContents[a].ior(c);level.mapCellContents.ior(c);return!0}

function repositionEntitiesAtCell(a){var b=level.getMovements(a);if(b.iszero())return!1;for(var c=!1,d=0;d<level.layerCount;d++){var e=b.getshiftor(31,5*d);0!==e&&repositionEntitiesOnLayer(a,d,e)&&(b.ishiftclear(e,5*d),c=!0)}level.setMovements(a,b);return c}
function Level(a,b,c,d,e){this.lineNumber=a;this.width=b;this.height=c;this.n_tiles=b*c;this.objects=e;this.layerCount=d;this.commandQueue=[]}

Level.prototype.clone=function(){var a=new Level(this.lineNumber,this.width,this.height,this.layerCount,null);a.objects=new Int32Array(this.objects);return a};
Level.prototype.getCell=function(a){return new BitVec(this.objects.subarray(a*STRIDE_OBJ,a*STRIDE_OBJ+STRIDE_OBJ))};
Level.prototype.getCellInto=function(a,b){for(var c=0;c<STRIDE_OBJ;c++)b.data[c]=this.objects[a*STRIDE_OBJ+c];return b};
Level.prototype.setCell=function(a,b){for(var c=0;c<b.data.length;++c)this.objects[a*STRIDE_OBJ+c]=b.data[c]};

var _movementVecs,_movementVecIndex=0;

Level.prototype.getMovements=function(a){var b=_movementVecs[_movementVecIndex];_movementVecIndex=(_movementVecIndex+1)%_movementVecs.length;for(var c=0;c<STRIDE_MOV;c++)b.data[c]=this.movements[a*STRIDE_MOV+c];return b};
Level.prototype.setMovements=function(a,b){for(var c=0;c<b.data.length;++c)this.movements[a*STRIDE_MOV+c]=b.data[c]};

var ellipsisPattern=["ellipsis"];

function BitVec(a){this.data=new Int32Array(a);return this}
BitVec.prototype.cloneInto=function(a){for(var b=0;b<this.data.length;++b)a.data[b]=this.data[b];return a};
BitVec.prototype.clone=function(){return new BitVec(this.data)};
BitVec.prototype.iand=function(a){for(var b=0;b<this.data.length;++b)this.data[b]&=a.data[b]};
BitVec.prototype.ior=function(a){for(var b=0;b<this.data.length;++b)this.data[b]|=a.data[b]};
BitVec.prototype.iclear=function(a){for(var b=0;b<this.data.length;++b)this.data[b]&=~a.data[b]};
BitVec.prototype.ibitset=function(a){this.data[a>>5]|=1<<(a&31)};
BitVec.prototype.ibitclear=function(a){this.data[a>>5]&=~(1<<(a&31))};
BitVec.prototype.get=function(a){return 0!==(this.data[a>>5]&1<<(a&31))};
BitVec.prototype.getshiftor=function(a,b){var c=b&31,d=this.data[b>>5]>>>c;c&&(d|=this.data[(b>>5)+1]<<32-c);return d&a};
BitVec.prototype.ishiftor=function(a,b){var c=b&31;this.data[b>>5]|=a<<c;c&&(this.data[(b>>5)+1]|=a>>32-c)};
BitVec.prototype.ishiftclear=function(a,b){var c=b&31;this.data[b>>5]&=~(a<<c);c&&(this.data[(b>>5)+1]&=~(a>>32-(b&31)))};
BitVec.prototype.equals=function(a){if(this.data.length!==a.data.length)return!1;for(var b=0;b<this.data.length;++b)if(this.data[b]!==a.data[b])return!1;return!0};
BitVec.prototype.setZero=function(){for(var a=0;a<this.data.length;++a)this.data[a]=0};
BitVec.prototype.iszero=function(){for(var a=0;a<this.data.length;++a)if(this.data[a])return!1;return!0};
BitVec.prototype.bitsSetInArray=function(a){for(var b=0;b<this.data.length;++b)if((this.data[b]&a[b])!==this.data[b])return!1;return!0};
BitVec.prototype.bitsClearInArray=function(a){for(var b=0;b<this.data.length;++b)if(this.data[b]&a[b])return!1;return!0};
BitVec.prototype.anyBitsInCommon=function(a){return!this.bitsClearInArray(a.data)};

function Rule(a){this.direction=a[0];this.patterns=a[1];this.hasReplacements=a[2];this.lineNumber=a[3];this.isEllipsis=a[4];this.groupNumber=a[5];this.isRigid=a[6];this.commands=a[7];this.isRandom=a[8];this.cellRowMasks=a[9];this.cellRowMatches=[];for(a=0;a<this.patterns.length;a++)this.cellRowMatches.push(this.generateCellRowMatchesFunction(this.patterns[a],this.isEllipsis[a]))}

Rule.prototype.generateCellRowMatchesFunction=function(a,b){if(!1==b){for(var c=dirMasksDelta[this.direction],d=c[0],e=c[1],c=a.length,d="var d = "+e+"+"+d+"*level.height;\n",e=1===STRIDE_OBJ?"":"*"+STRIDE_OBJ,g=0;g<STRIDE_OBJ;++g)d+="var cellObjects"+g+" = level.objects[i"+e+(g?"+"+g:"")+"];\n";e=1===STRIDE_MOV?"":"*"+STRIDE_MOV;for(g=0;g<STRIDE_MOV;++g)d+="var cellMovements"+g+" = level.movements[i"+e+(g?"+"+g:"")+"];\n";d+="return "+a[0].generateMatchString("0_");for(e=1;e<c;e++)d+="&&cellRow["+
e+"].matches((i+"+e+"*d))";d+=";";return d in matchCache?matchCache[d]:matchCache[d]=new Function("cellRow","i",d)}c=dirMasksDelta[this.direction];d=c[0];e=c[1];c=a.length;d="var d = "+e+"+"+d+"*level.height;\nvar result = [];\n";d+="if(cellRow[0].matches(i)";for(e=1;a[e]!==ellipsisPattern;e++)d+="&&cellRow["+e+"].matches((i+"+e+"*d))";e++;d+=") {\n";d+="\tfor (var k=kmin;k<kmax;k++) {\n";d+="\t\tif(cellRow["+e+"].matches((i+d*(k+"+(e-1)+")))";for(e++;e<c;e++)d+="&&cellRow["+e+"].matches((i+d*(k+"+
(e-1)+")))";d+="){\n";d+="\t\t\tresult.push([i,k]);\n";d+="\t\t}\n";d+="\t}\n";d+="}\n";d+="return result;";return d in matchCache?matchCache[d]:matchCache[d]=new Function("cellRow","i","kmax","kmin",d)};

Rule.prototype.toJSON=function(){return[this.direction,this.patterns,this.hasReplacements,this.lineNumber,this.isEllipsis,this.groupNumber,this.isRigid,this.commands,this.isRandom,this.cellRowMasks]};

var STRIDE_OBJ=1,STRIDE_MOV=1;

function CellPattern(a){this.objectsPresent=a[0];this.objectsMissing=a[1];this.anyObjectsPresent=a[2];this.movementsPresent=a[3];this.movementsMissing=a[4];this.matches=this.generateMatchFunction();this.replacement=a[5]}function CellReplacement(a){this.objectsClear=a[0];this.objectsSet=a[1];this.movementsClear=a[2];this.movementsSet=a[3];this.movementsLayerMask=a[4];this.randomEntityMask=a[5];this.randomDirMask=a[6]}var matchCache={};

CellPattern.prototype.generateMatchString=function(){for(var a="(true",b=0;b<Math.max(STRIDE_OBJ,STRIDE_MOV);++b){var c="cellObjects"+b,d="cellMovements"+b,e=this.objectsPresent.data[b],g=this.objectsMissing.data[b],h=this.movementsPresent.data[b],l=this.movementsMissing.data[b];e&&(a=e&e-1?a+("\t\t&& (("+c+"&"+e+")==="+e+")\n"):a+("\t\t&& ("+c+"&"+e+")\n"));g&&(a+="\t\t&& !("+c+"&"+g+")\n");h&&(a=h&h-1?a+("\t\t&& (("+d+"&"+h+")==="+h+")\n"):a+("\t\t&& ("+d+"&"+h+")\n"));l&&(a+="\t\t&& !("+d+"&"+
l+")\n")}for(c=0;c<this.anyObjectsPresent.length;c++){a+="\t\t&& (0";for(b=0;b<STRIDE_OBJ;++b)(d=this.anyObjectsPresent[c].data[b])&&(a+="|(cellObjects"+b+"&"+d+")");a+=")"}return a+"\t)"};

CellPattern.prototype.generateMatchFunction=function(){var a,b="",c=1===STRIDE_OBJ?"":"*"+STRIDE_OBJ;for(a=0;a<STRIDE_OBJ;++a)b+="\tvar cellObjects"+a+" = level.objects[i"+c+(a?"+"+a:"")+"];\n";c=1===STRIDE_MOV?"":"*"+STRIDE_MOV;for(a=0;a<STRIDE_MOV;++a)b+="\tvar cellMovements"+a+" = level.movements[i"+c+(a?"+"+a:"")+"];\n";b+="return "+this.generateMatchString()+";";return b in matchCache?matchCache[b]:matchCache[b]=new Function("i",b)};

CellPattern.prototype.toJSON=function(){return[this.movementMask,this.cellMask,this.nonExistenceMask,this.moveNonExistenceMask,this.moveStationaryMask,this.randomDirOrEntityMask,this.movementsToRemove]};var _o1,_o2,_o2_5,_o3,_o4,_o5,_o6,_o7,_o8,_o9,_o10,_o11,_o12,_m1,_m2,_m3;

CellPattern.prototype.replace=function(a,b){var c=this.replacement;if(null===c)return!1;var d=c.randomEntityMask,e=c.randomDirMask,g=c.objectsSet.cloneInto(_o1),h=c.objectsClear.cloneInto(_o2),l=c.movementsSet.cloneInto(_m1),p=c.movementsClear.cloneInto(_m2);p.ior(c.movementsLayerMask);if(!d.iszero()){for(var m=[],u=0;u<32*STRIDE_OBJ;u++)d.get(u)&&m.push(u);d=m[Math.floor(RandomGen.uniform()*m.length)];m=state.objects[state.idDict[d]];g.ibitset(d);h.ior(state.layerMasks[m.layer]);p.ishiftor(31,5*
m.layer)}if(!e.iszero())for(d=0;d<level.layerCount;d++)e.get(5*d)&&(m=Math.floor(4*RandomGen.uniform()),l.ibitset(m+5*d));e=level.getCellInto(b,_o2_5);d=level.getMovements(b);m=e.cloneInto(_o3);u=d.cloneInto(_m3);e.iclear(h);e.ior(g);d.iclear(p);d.ior(l);g=!1;p=l=0;if(a.isRigid){l=state.groupNumber_to_RigidGroupIndex[a.groupNumber];l++;h=new BitVec(STRIDE_MOV);for(p=0;p<level.layerCount;p++)h.ishiftor(l,5*p);h.iand(c.movementsLayerMask);l=level.rigidGroupIndexMask[b]||new BitVec(STRIDE_MOV);p=level.rigidMovementAppliedMask[b]||
new BitVec(STRIDE_MOV);h.bitsSetInArray(l.data)||c.movementsLayerMask.bitsSetInArray(p.data)||(l.ior(h),p.ior(c.movementsLayerMask),g=!0)}c=!1;m.equals(e)&&u.equals(d)&&!g||(c=!0,g&&(level.rigidGroupIndexMask[b]=l,level.rigidMovementAppliedMask[b]=p),g=e.cloneInto(_o4),g.iclear(m),sfxCreateMask.ior(g),g=m.cloneInto(_o5),g.iclear(e),sfxDestroyMask.ior(g),level.setCell(b,e),level.setMovements(b,d),d=b%level.height,level.colCellContents[b/level.height|0].ior(e),level.rowCellContents[d].ior(e),level.mapCellContents.ior(e));
return c};

function DoesCellRowMatchWildCard(a,b,c,d,e){void 0===e&&(e=0);var g=b[0];if(g.matches(c)){g=dirMasksDelta[a];a=g[0]*level.height;for(var h=g[1],l=1;l<b.length;l+=1)if(c=c+h+a,g=b[l],g===ellipsisPattern){for(;e<d;e++){for(var p=c,p=(p+(h+a)*e+level.n_tiles)%level.n_tiles,m=l+1;m<b.length;m++){g=b[m];if(!g.matches(p))break;p=p+h+a}if(m>=b.length)return!0}break}else if(!g.matches(c))break}return!1}

function DoesCellRowMatch(a,b,c,d){var e=b[0];if(e.matches(c)){e=dirMasksDelta[a];a=e[0]*level.height;for(var g=e[1],h=b.length,l=1;l<h&&(c=c+g+a,e=b[l],e===ellipsisPattern&&(c+=(g+a)*d),e.matches(c));l++);if(l>=b.length)return!0}return!1}

function matchCellRow(a,b,c,d){var e=[];if(!d.bitsSetInArray(level.mapCellContents.data))return e;var g=0,h=level.width,l=0,p=level.height,m=c.length;switch(a){case 1:l+=m-1;break;case 2:p-=m-1;break;case 4:g+=m-1;break;case 8:h-=m-1;break;default:window.console.log("EEEP "+a)}if(2<a)for(a=l;a<p;a++){if(d.bitsSetInArray(level.rowCellContents[a].data))for(m=g;m<h;m++){var u=m*level.height+a;b(c,u)&&e.push(u)}}else for(m=g;m<h;m++)if(d.bitsSetInArray(level.colCellContents[m].data))for(a=l;a<p;a++)u=
m*level.height+a,b(c,u)&&e.push(u);return e}

function matchCellRowWildCard(a,b,c,d){var e=[];if(!d.bitsSetInArray(level.mapCellContents.data))return e;var g=0,h=level.width,l=0,p=level.height,m=c.length-1;switch(a){case 1:l+=m-1;break;case 2:p-=m-1;break;case 4:g+=m-1;break;case 8:h-=m-1;break;default:window.console.log("EEEP2 "+a)}if(2<a)for(var u=l;u<p;u++){if(d.bitsSetInArray(level.rowCellContents[u].data))for(var A=g;A<h;A++){var D=A*level.height+u,E;4===a?E=A-m+2:8===a?E=level.width-(A+m)+1:window.console.log("EEEP2 "+a);e.push.apply(e,
b(c,D,E,0))}}else for(A=g;A<h;A++)if(d.bitsSetInArray(level.colCellContents[A].data))for(u=l;u<p;u++)D=A*level.height+u,2===a?E=level.height-(u+m)+1:1===a?E=u-m+2:window.console.log("EEEP2 "+a),e.push.apply(e,b(c,D,E,0));return e}function generateTuples(a){for(var b=[[]],c=0;c<a.length;c++){for(var d=a[c],e=[],g=0;g<d.length;g++)for(var h=d[g],l=0;l<b.length;l++){var p=b[l].concat([h]);e.push(p)}b=e}return b}var rigidBackups=[];

function commitPreservationState(a){var b={ruleGroupIndex:a,objects:new Int32Array(level.objects),movements:new Int32Array(level.movements),rigidGroupIndexMask:level.rigidGroupIndexMask.concat([]),rigidMovementAppliedMask:level.rigidMovementAppliedMask.concat([]),bannedGroup:level.bannedGroup.concat([]),commandQueue:level.commandQueue.concat([])};return rigidBackups[a]=b}

function restorePreservationState(a){level.objects=new Int32Array(a.objects);level.movements=new Int32Array(a.movements);level.rigidGroupIndexMask=a.rigidGroupIndexMask.concat([]);level.rigidMovementAppliedMask=a.rigidMovementAppliedMask.concat([]);level.commandQueue=a.commandQueue.concat([]);sfxCreateMask.setZero();sfxDestroyMask.setZero();consolePrint("Rigid movement application failed, rolling back")}

Rule.prototype.findMatches=function(){for(var a=[],b=this.cellRowMasks,c=0;c<this.patterns.length;c++){var d=this.patterns[c],e=this.cellRowMatches[c],d=this.isEllipsis[c]?matchCellRowWildCard(this.direction,e,d,b[c]):matchCellRow(this.direction,e,d,b[c]);if(0===d.length)return[];a.push(d)}return a};
Rule.prototype.directional=function(){for(var a=0;a<state.rules.length;a++)for(var b=state.rules[a],c=0,d=0;d<b.length;d++)if(this.lineNumber===b[d].lineNumber&&c++,1<c)return!0;return!1};

Rule.prototype.applyAt=function(a,b,c){if(c){var d=!0;for(c=0;c<this.patterns.length;c++)if(this.isEllipsis[c]){if(!1===DoesCellRowMatchWildCard(this.direction,this.patterns[c],b[c][0],b[c][1]+1,b[c][1])){d=!1;break}}else if(!1===DoesCellRowMatch(this.direction,this.patterns[c],b[c])){d=!1;break}if(!1===d)return!1}var d=!1,e=a[0]*level.height;a=a[1];for(c=0;c<this.patterns.length;c++)for(var g=this.patterns[c],h=this.isEllipsis[c]?b[c][0]:b[c],l=0;l<g.length;l++){var p=g[l];p===ellipsisPattern?h+=
(a+e)*b[c][1]:(d=p.replace(this,h)||d,h=h+a+e)}verbose_logging&&d&&(b=dirMaskName[this.direction],this.directional()||(b=""),consolePrint('<font color="green">Rule <a onclick="jumpToLine('+this.lineNumber+');"  href="javascript:void(0);">'+this.lineNumber+"</a> "+b+" applied.</font>"));return d};

Rule.prototype.tryApply=function(){var a=dirMasksDelta[this.direction],b=this.findMatches();if(0===b.length)return!1;var c=!1;if(this.hasReplacements)for(var d=generateTuples(b),e=0;e<d.length;e++)c=this.applyAt(a,d[e],0<e)||c;0<b.length&&this.queueCommands();return c};

Rule.prototype.queueCommands=function(){for(var a=this.commands,b=0;b<a.length;b++){var c=a[b];if(!(0<=level.commandQueue.indexOf(c[0]))){level.commandQueue.push(c[0]);if(verbose_logging){var d=this.lineNumber;consolePrint('<font color="green">Rule <a onclick="jumpToLine('+d.toString()+');"  href="javascript:void(0);">'+d.toString()+"</a> triggers command "+c[0]+".</font>")}"message"===c[0]&&(messagetext=c[1])}}};

function showTempMessage(){keybuffer=[];textMode=!0;messageselected=quittingMessageScreen=titleScreen=!1;tryPlayShowMessageSound();drawMessageScreen();canvasResize()}

function applyRandomRuleGroup(a){for(var b=[],c=0;c<a.length;c++){var d=a[c],d=d.findMatches();if(0<d.length)for(var d=generateTuples(d),e=0;e<d.length;e++){var g=d[e];b.push([c,g])}}if(0===b.length)return!1;b=b[Math.floor(RandomGen.uniform()*b.length)];c=b[0];d=a[c];a=dirMasksDelta[d.direction];g=b[1];a=d.applyAt(a,g,!1);d.queueCommands();return a}

function applyRuleGroup(a){if(a[0].isRandom)return applyRandomRuleGroup(a);for(var b=!1,c=!0,d=0;c;){d++;if(200<d){logErrorCacheable("Got caught looping lots in a rule group :O",a[0].lineNumber,!0);break}for(var c=!1,e=0;e<a.length;e++)c=a[e].tryApply()||c;c&&(b=!0)}return b}

function applyRules(a,b,c,d){for(var e=0<c,g=0;c<a.length;){if(!d||!d[c])var h=a[c],e=applyRuleGroup(h)||e;if(e&&void 0!==b[c]){if(c=b[c],e=!1,g++,200<g){h=a[c];logErrorCacheable("got caught in an endless startloop...endloop vortex, escaping!",h[0].lineNumber,!0);break}}else if(c++,c===a.length&&e&&void 0!==b[c]&&(c=b[c],e=!1,g++,200<g)){h=a[c];logErrorCacheable("got caught in an endless startloop...endloop vortex, escaping!",h[0].lineNumber,!0);break}}}

function resolveMovements(a){for(var b=!0;b;)for(b=!1,a=0;a<level.n_tiles;a++)b=repositionEntitiesAtCell(a)||b;var c=!1;for(a=0;a<level.n_tiles;a++){var b=level.getCellInto(a,_o6),d=level.getMovements(a);if(!d.iszero()){var e=level.rigidMovementAppliedMask[a];if(0!==e&&(d.iand(e),!d.iszero()))for(e=0;e<level.layerCount;e++)if(0!==d.getshiftor(31,5*e)){c=level.rigidGroupIndexMask[a].getshiftor(31,5*e);c--;c=level.bannedGroup[state.rigidGroupIndex_to_GroupIndex[c]]=!0;break}for(e=0;e<state.sfx_MovementFailureMasks.length;e++){var g=
state.sfx_MovementFailureMasks[e];g.objectMask.anyBitsInCommon(b)&&d.anyBitsInCommon(g.directionMask)&&-1===seedsToPlay_CantMove.indexOf(g.seed)&&seedsToPlay_CantMove.push(g.seed)}}for(e=0;e<STRIDE_MOV;e++)level.movements[e+a*STRIDE_MOV]=0;level.rigidGroupIndexMask[a]=0;level.rigidMovementAppliedMask[a]=0}return c}

var sfxCreateMask=null,sfxDestroyMask=null;

function calculateRowColMasks(){for(var a=0;a<level.mapCellContents.length;a++)level.mapCellContents[a]=0;for(a=0;a<level.width;a++)level.colCellContents[a].setZero();for(a=0;a<level.height;a++)level.rowCellContents[a].setZero();for(a=0;a<level.width;a++)for(var b=0;b<level.height;b++){var c=level.getCellInto(b+a*level.height,_o9);level.mapCellContents.ior(c);level.rowCellContents[b].ior(c);level.colCellContents[a].ior(c)}}

function processInput(a,b,c){
	againing=!1;
	verbose_logging&&(-1===a?consolePrint("Turn starts with no input."):(consolePrint("======================="),consolePrint("Turn starts with input of "+["up","left","down","right","action"][a]+".")));
	var d=backupLevel(),e=[];
	if(4>=a){
		if(0<=a){
			switch(a){
				case 0:a=1;break;
				case 1:a=4;break;
				case 2:a=2;break;
				case 3:a=8;break;
				case 4:a=16
			}
		e=startMovement(a)
		}
		var g=0;
		level.bannedGroup=[];
		rigidBackups=[];
		level.commandQueue=[];
		var h=0,l=!1,p=commitPreservationState();
		sfxCreateMask.setZero();
		sfxDestroyMask.setZero();
		seedsToPlay_CanMove=[];
		seedsToPlay_CantMove=[];
		calculateRowColMasks();
		do l=!1,g++,verbose_logging&&consolePrint("applying rules"),applyRules(state.rules,state.loopPoint,h,level.bannedGroup),resolveMovements()?(l=!0,restorePreservationState(p)):(verbose_logging&&consolePrint("applying late rules"),applyRules(state.lateRules,state.lateLoopPoint,0)),h=0;
		while(50>g&&l);
		50<=g&&consolePrint("looped through 50 times, gave up.  too many loops!");
		if(0<e.length&&void 0!==state.metadata.require_player_movement){
			h=!1;
			for(g=0;g<e.length;g++)
				if(l=level.getCell(e[g]),state.playerMask.bitsClearInArray(l.data)){
					h=!0;
					break
				}
				if(!1===h)
					return verbose_logging&&(consolePrint("require_player_movement set, but no player movement detected, so cancelling turn."),consoleCacheDump()),backups.push(d),DoUndo(!0,!1),!1
		}
		if(0<=level.commandQueue.indexOf("cancel"))
			return verbose_logging&&(consoleCacheDump(),consolePrint("CANCEL command executed, cancelling turn.",!0)),backups.push(d),messagetext="",DoUndo(!0,!1),tryPlayCancelSound(),!1;
		if(0<=level.commandQueue.indexOf("restart"))
			return verbose_logging&&(consolePrint("RESTART command executed, reverting to restart state."),consoleCacheDump()),backups.push(d),messagetext="",DoRestart(!0),!0;
		if(c&&0<=level.commandQueue.indexOf("win"))
			return!0;
		h=!1;
		for(g=0;g<level.objects.length;g++)
			if(level.objects[g]!==d.dat[g]){
				if(c)
					return verbose_logging&&consoleCacheDump(),backups.push(d),DoUndo(!0,!1),!0;-1!==a&&backups.push(d);
				h=!0;
				break
			}
		if(c)
			return verbose_logging&&consoleCacheDump(),!1;
		for(g=0;g<seedsToPlay_CantMove.length;g++)
			playSound(seedsToPlay_CantMove[g]);
		for(g=0;g<seedsToPlay_CanMove.length;g++)
			playSound(seedsToPlay_CanMove[g]);
		for(g=0;g<state.sfx_CreationMasks.length;g++)
			a=state.sfx_CreationMasks[g],sfxCreateMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		for(g=0;g<state.sfx_DestructionMasks.length;g++)
			a=state.sfx_DestructionMasks[g],sfxDestroyMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		for(g=0;g<level.commandQueue.length;g++)
			a=level.commandQueue[g],"f"===a.charAt(1)&&tryPlaySimpleSound(a),!1===unitTesting?"message"===a&&showTempMessage():messagetext="";
		!1!==textMode||void 0!==b&&!1!==b||(verbose_logging&&consolePrint("Checking win condition."),checkWin());
		winning||(0<=level.commandQueue.indexOf("checkpoint")&&(EchoCheckpoint(),verbose_logging&&consolePrint("CHECKPOINT command executed, saving current state to the restart state."),restartTarget=level4Serialization(),hasUsedCheckpoint=!0,SaveCheckpoint(restartTarget),SaveLevel(curlevel)),0<=level.commandQueue.indexOf("again")&&h&&(b=verbose_logging,g=messagetext,verbose_logging=!1,processInput(-1,!0,!0)?((verbose_logging=b)&&consolePrint("AGAIN command executed, with changes detected - will execute another turn."),againing=!0,timer=0):(verbose_logging=b)&&consolePrint("AGAIN command not executed, it wouldn't make any changes."),verbose_logging=b,messagetext=g));level.commandQueue=[]
	}
	verbose_logging&&consoleCacheDump();
	winning&&(againing=!1);
	return h

	}
	
function checkWin(){if(!levelEditorOpened)if(0<=level.commandQueue.indexOf("win"))consolePrint("Win Condition Satisfied"),DoWin();else{var a=!1;if(0<state.winconditions.length)for(var a=!0,b=0;b<state.winconditions.length;b++){var c=state.winconditions[b],d=c[1],e=c[2],g=!0;switch(c[0]){case -1:for(c=0;c<level.n_tiles;c++){var h=level.getCellInto(c,_o10);if(!d.bitsClearInArray(h.data)&&!e.bitsClearInArray(h.data)){g=!1;break}}break;case 0:for(var l=!1,c=0;c<level.n_tiles;c++)if(h=level.getCellInto(c,
_o10),!d.bitsClearInArray(h.data)&&!e.bitsClearInArray(h.data)){l=!0;break}!1===l&&(g=!1);break;case 1:for(c=0;c<level.n_tiles;c++)if(h=level.getCellInto(c,_o10),!d.bitsClearInArray(h.data)&&e.bitsClearInArray(h.data)){g=!1;break}}!1===g&&(a=!1)}a&&(consolePrint("Win Condition Satisfied"),DoWin())}}


////////////////////////////////////////////////////////////////////////////////
/// Level Data, recording moves

var leveldata={
	formDataNameOrder: "[\"name\",\"level\",\"identifier\",\"timing\",\"winsequence\",\"moves\",\"type\"]",
	formGoogleSendEmail: "",
	formGoogleSheetName: "leveltimes",
	identifier:document.body.id,
	level:"0",
	moves:"-",
	winsequence:"-",
	name: UserId(),
	timing: "0",
	type:"-"
};

var leveldataURL="https://script.google.com/macros/s/AKfycbwuyyGb7XP7H91GH_8tZrXh6y_fjbZg4vSxl6S8xvAAEdyoIHcS/exec";
var timeticker=Date.now();
var moveseq=[];
var winseq=[];
var maxlevel=Number(curlevel);
var maxcheckpoint=Number(curcheckpoint);
var checkpointsaver=0;
var recordingmoves=true;

function RegisterMove(mov){
	if(recordingmoves){
		var move=mov;
		switch(move){
			case 1:move=37;break;//<
			case 0:move=38;break;//^
			case 3:move=39;break;//>
			case 2:move=40;break;//v
			case 4:move=88;break;//X
		}
		var delta = ElapsedTime();
		moveseq.push([move,delta]);
		switch(move){
			case 82:winseq=[];break;//R
			case 85:winseq.pop();break;//Z
			case 27:winseq=["Q"];break;//Q
			default: winseq.push([move,delta]);break
		}
	}
}
	
function UnRegisterMove(){
	if(recordingmoves){
		winseq.pop();
		moveseq.pop();
	};
}
	
function ClearMoves(){
	moveseq=[];winseq=[];
}

function ClearLevelRecord(){
	ClearMoves();
	timeticker=Date.now();
}

function ElapsedTime(){
	var timenow=Date.now();
	var elapsedtime = (timenow-timeticker);
	timeticker = timenow;
	return elapsedtime;
}

function UpdateLevelData(curlevel){
	var ws=winseq;
	var ms=moveseq;
	
	leveldata["timing"]=Math.floor(ms.reduce((x,y)=>(x+y[1]),0)/1000);
	leveldata["level"]=LevelNumber(curlevel);

	leveldata["moves"]=JSON.stringify(ms);
	leveldata["winsequence"]=JSON.stringify(ws);
	
	if(!AnalyticsInnerClearance(pageTitle())){
		leveldata["moves"]="---";
		leveldata["winsequence"]="---";
	}
	
	leveldata["type"]="win";
}

function UpdateLevelCheckpointData(curlevel,checkpointsaver){
	UpdateLevelData(curlevel);
	leveldata["type"]="checkpoint";
	leveldata["level"]=String(curlevel)+"."+String(checkpointsaver);
	ClearMoves();
}


////////////////////////////////////////////////////////////////////////////////
///Replaying Moves

function ParseMoves(movestring){
	return JSON.parse(movestring);
}

var movesplaylist=[];
var maxdelay=500; //delay between moves
var mindelay=500; //delay between moves
var recordingmovesid;


function ReplayParseMoves(movetext){
	return Replay(ParseMoves(movetext));
}

function ClearMovesPlaylist(){
	movesplaylist.map(function(mpi){clearTimeout(mpi.schid)});
	movesplaylist=[];
}

function Replay(movetimes){
	ClearMovesPlaylist();
	movesplaylist=NewMovesPlaylist(movetimes);
	movesplaylist=ResumeMovesPlaylist(movesplaylist);
	return movesplaylist;
}

function NewMovesPlaylist(movetimes){
	var movesplaylist=movetimes.map(function(movetime,i){
		return {
			move:movetime[0],
			timedelta:movetime[1],
			time:0,
			id:i,
			schid:0,
			state:"paused"
			};	
		});
	movesplaylist=SetTimesMovesPlaylist(movesplaylist);
	return movesplaylist;
};

function SetTimesMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	var time=0;
	for (var i=0;i<m.length;i++){
		if(m[i].state=="paused"){
			time=time+Math.max(Math.min(m[i].timedelta,maxdelay),mindelay);
			m[i].time=time;
		}
	}
	return m;
}

function PauseMovesPlaylist(movesplaylist){
	var m=movesplaylist.map(function(mpi){
		if(mpi.state=="scheduled"){
			clearTimeout(mpi.schid);
			mpi.state="paused";
		}
		return mpi;
		});

	recordingmoves=true;
	clearTimeout(recordingmovesid);

	return m;
}

function ResumeMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	m=SetTimesMovesPlaylist(m);
	recordingmoves=false;	
	m=m.map(function(mpi){ScheduleMove(mpi,m);return mpi})
	console.log("Replay Scheduled");
	return m;
}

function ScheduleMove(mpi,movesplaylist){
	if(mpi.state=="paused"){
		mpi.schid=setTimeout(function(){PlayMove(mpi,movesplaylist)},mpi.time);
		mpi.state="scheduled";
	}
	if(mpi.id===movesplaylist[movesplaylist.length-1].id)
		recordingmovesid=setTimeout(function(){recordingmoves=true;},mpi.time+100);
	return mpi;
}

function SkipMove(mpi,movesplaylist){
	var move=mpi.move;
	var message= mpi.id+" of "+movesplaylist.length;
	mpi.state="skipped";
	mpi.time=0;
	console.log("skipping:",move,message);
}

function UnSkipMove(mpi,movesplaylist){
	var move=mpi.move;
	var message= mpi.id+" of "+movesplaylist.length;
	mpi.state="paused";
	mpi.time=0;
	console.log("unskipping move:",move,message);
}

function PlayMove(mpi,movesplaylist){
	var move=mpi.move;
	var message= mpi.id+" of "+movesplaylist.length;
	checkKey({keyCode:move},!0);
	mpi.state="played";
	mpi.time=0;
	console.log("move:",move,message);
}

function UnPlayMove(mpi,movesplaylist){
	var move=mpi.move;
	var message= mpi.id+" of "+movesplaylist.length;
	if(move!=85)
		checkKey({keyCode:85},!0);
	else
		checkKey({keyCode:PreviousMove(mpi).move},!0);
	mpi.state="paused";
	mpi.time=0;
	console.log("unplaying move:",move,message);
}

function FindMove(i,movesplaylist){
	return movesplaylist.find(function(mpi){return mpi.id===i;});
}

function SkipMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=0;i<m.length&&!found;i++){
		if(m[i].state=="paused"){
			found=true;
			SkipMove(m[i],m);
		}
	}
	return m;
}

function NextMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=0;i<m.length&&!found;i++){
		if(m[i].state=="paused"){
			time=time+Math.max(Math.min(m[i].timedelta,maxdelay),mindelay);
			m[i].time=time;
			found=true;
			ScheduleMove(m[i],m);
		}
	}
	return m;
}

function PreviousMovesPlaylist(movesplaylist){
	var m=movesplaylist;
	var found=false;
	var time=0;

	for (var i=m.length-1;i>=0&&!found;i--){
		if(m[i].state=="played"){
			found=true;
			UnPlayMove(m[i],m);
		}
		if(m[i].state=="skipped"){
			found=true;
			UnSkipMove(m[i],m);
		}
	}
	return m;
}

function ChangeReplaySpeed(movesplaylist,newinterval){
	PauseMovesPlaylist(movesplaylist);
	maxdelay=newinterval;
	mindelay=newinterval;
	ResumeMovesPlaylist(movesplaylist);
}

function FasterReplaySpeed(movesplaylist){
	ChangeReplaySpeed(movesplaylist,maxdelay*0.9)
}

function SlowerReplaySpeed(movesplaylist){
	ChangeReplaySpeed(movesplaylist,maxdelay/0.9)
}

////////////////////////////////////////////////////////////////////////////////
// Replay Interface

function RequestPlaylist(){
	RequestDataPack([
		['answer',{
			questionname:"Moves playlist:",
			qplaceholder:"[[move1,time1],[move2,time2],...]",
			qvalidator:PlaylistValidator
		}]
	],
	{
		actionvalid:LoadPlaylistFromDP,
		qdisplay:LaunchBalloon,
		qtargetid:'puzzlescript-game',
		qonsubmit:Identity
	});
}

function PlaylistValidator(DF){
	var pattern=/\[(\[(27|37|38|39|40|82|85|88)\,[0-9]+\])(\,\[(27|37|38|39|40|82|85|88)\,[0-9]+\])*\]/ig
	var errormessage="Please verify the moves playlist!";
	return PatternValidatorGenerator(pattern,errormessage)(DF);
}

function LoadPlaylistFromDP(DP){
	var moves=FindData('answer',DP.qid);
	movesplaylist=NewMovesPlaylist(ParseMoves(moves));
};

function DownLoadPlaylist(movesplaylist){
	DownLoadPlaylist.counter=DownLoadPlaylist.counter?DownLoadPlaylist.counter+1:1;
	var mpl=movesplaylist.map(function(mpi){return [mpi.move,mpi.timedelta];});
	Download(JSON.stringify(mpl), pageIdentifier()+"playlist-"+DownLoadPlaylist.counter+".txt","text/js");
}

////////////////////////////////////////////////////////////////////////////////
// Level navigation

function GoToLevel(lvl){

	curlevel=lvl;
	winning=!1;
	timer=0;
	textMode=titleScreen=!1;
	titleSelection=0<curlevel||null!==curlevelTarget?1:0;
	messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=!1;
	titleMode=0;
	loadLevelFromState(state,lvl);
	canvasResize();
	clearInputHistory();
	UpdateGameNav();
	
};

function isLevelMessage(lvl){
	return typeof state.levels[lvl].message !=="undefined"
}

function LevelType(level){
	return typeof level.message==="undefined";	
}

function LevelIndices(){
	var l=[];
	var i;
	for( i=0;i<state.levels.length;i++){
		if(LevelType(state.levels[i]))
			l.push(i);
	}
	return levelindices=l;
}

function LevelNumber(curlevel){
	if(levelindices===undefined)
		levelindices=LevelIndices();
	return levelindices.filter(function(l){return l<=curlevel}).length;
}

function UpdateGameNav(){
	if(!(curlevel<maxlevel||curcheckpoint<maxcheckpoint)){
		maxlevel=Math.max(curlevel,maxlevel);
		maxcheckpoint=Math.max(curcheckpoint,maxcheckpoint);
		DeactivateButton("GameFW");
	}
	else
		ActivateButton("GameFW");
	
	if(curlevel==0){
		DeactivateButton("GameBW");
	}
	else
		ActivateButton("GameBW");		
}

function ActivateButton(id){
	var b=document.getElementById(id);
	b.className = b.className.replace(/active/g, "");
	b.className = b.className+" active";
}

function DeactivateButton(id){
	var b=document.getElementById(id);
	b.className = b.className.replace(/active/g, "");
}

function RequestLevelSelector(){
	var solvedLevelIndices=LevelIndices().filter(lvl=>lvl<=maxlevel).map(LevelNumber);
	RequestDataPack([
		['exclusivechoice',{
			questionname:"Solved levels ("+solvedLevelIndices.length+"/"+LevelIndices().length+")",
			qfield:"level",
			qchoices:solvedLevelIndices
		}]
	],
	{
		actionvalid:LoadLevelFromDP,
		actionText:"Go to level",
		qonsubmit:Identity,
		qdisplay:LaunchBalloon,
		qtargetid:'puzzlescript-game',
		executeChoice:function(id,choice){
			RequestLevelSelector.chosenlevel=choice;
			console.log(choice);
		}
	});
}

function LoadLevelFromDP(DP){
	//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
	var lvl=FindData('level',DP.qid);
	var lvlpre=LevelIndices()[Math.max(lvl-2,0)];
	GoToLevel(lvlpre+1);
};

function GoToLevelNext(){
	if(HasCheckpoint()){
		GoToLevelCheckpoint(curcheckpoint+1);
	}
	else{
		if(curlevel<maxlevel){
			GoToLevel(curlevel+1);
			}
		if(curlevel==(state.levels.length-1)&&isLevelMessage(curlevel)){
			DoWin();
		}
	}
}

function GoToLevelPrev(){
	if(HasCheckpoint()){
		GoToLevelCheckpoint(curcheckpoint-1);
	}
	else{
		if(curlevel>0){
			GoToLevel(curlevel-1);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
/// Echo

function EchoLevelWin(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		echoPureData(leveldata,leveldataURL);
	}
}

function EchoCheckpoint(){
	if(AnalyticsClearance()){
		UpdateLevelCheckpointData(curlevel,checkpointsaver);
		echoPureData(leveldata,leveldataURL);
	}
	checkpointsaver++;
}

function EchoLevelClose(curlevel){
	if(AnalyticsClearance()){
		UpdateLevelData(curlevel);
		leveldata["winsequence"]="";
		leveldata["type"]="close";
		echoPureData(leveldata,leveldataURL);
	}
}

window.onunload=(function(){
	EchoLevelClose(curlevel);
})

function DoWin() {
            if (!winning) {
				EchoLevelWin(curlevel);
				if(typeof customLevelInfo!= "undefined")customLevelInfo(); 
                if (againing = !1, tryPlayEndLevelSound(), unitTesting)	return void nextLevel();
                winning = !0, timer = 0
            }
        }

function GoToLevelCheckpoint(ncheckpoint){
	if(HasCheckpoint()){
		LoadCheckpoint(ncheckpoint);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		UpdateGameNav();
}};

		
function nextLevel(){
	ClearLevelRecord();
	againing=!1;
	messagetext="";
	state&&state.levels&&curlevel>state.levels.length&&(curlevel=state.levels.length-1);
	if(titleScreen)
		0===titleSelection&&(curlevel=0,curlevelTarget=null),null!==curlevelTarget?loadLevelFromStateTarget(state,curlevel,curlevelTarget):loadLevelFromState(state,curlevel);
	else if(hasUsedCheckpoint&&(curlevelTarget=null,hasUsedCheckpoint=!1),curlevel<state.levels.length-1){
		curlevel++;
		messageselected=quittingMessageScreen=titleScreen=textMode=!1;
		null!==curlevelTarget?loadLevelFromStateTarget(state,curlevel,curlevelTarget):loadLevelFromState(state,curlevel);
	}
	else{
		try{
			UnsaveSave()
		}
		catch(a){}
		curlevel=0;
		curlevelTarget=null;
		goToTitleScreen();
		RequestHallOfFame();
		tryPlayEndGameSound()
	}
	try{
		if(HasSave())
			if(SaveLevel(curlevel),null!==curlevelTarget){
				restartTarget=level4Serialization();
				SaveCheckpoint(restartTarget,true)
			}
			else UnsaveCheckpoint()
	}
	catch(c){}
	void 0!==state&&void 0!==state.metadata.flickscreen&&(oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)]);
	canvasResize();
	clearInputHistory();
	UpdateGameNav();
	
}
	
function goToTitleScreen(){againing=!1;messagetext="";textMode=titleScreen=!0;doSetupTitleScreenLevelContinue();titleSelection=0<curlevel||null!==curlevelTarget?1:0;generateTitleScreen()};var compiling=!1,errorStrings=[],errorCount=0;

function logErrorCacheable(a,b,c){if(compiling||c){if(void 0===b)return logErrorNoLine(a);a='<a onclick="jumpToLine('+b.toString()+');"  href="javascript:void(0);"><span class="errorTextLineNumber"> line '+b.toString()+'</span></a> : <span class="errorText">'+a+"</span>";0<=errorStrings.indexOf(a)&&!c||(consolePrint(a),errorStrings.push(a),errorCount++)}}

function logError(a,b,c){if(compiling||c){if(void 0===b)return logErrorNoLine(a);a='<a onclick="jumpToLine('+b.toString()+');"  href="javascript:void(0);"><span class="errorTextLineNumber"> line '+b.toString()+'</span></a> : <span class="errorText">'+a+"</span>";0<=errorStrings.indexOf(a)&&!c||(consolePrint(a,!0),errorStrings.push(a),errorCount++)}}

function logWarning(a,b,c){if(compiling||c){if(void 0===b)return logErrorNoLine(a);a='<a onclick="jumpToLine('+b.toString()+');"  href="javascript:void(0);"><span class="errorTextLineNumber"> line '+b.toString()+'</span></a> : <span class="warningText">'+a+"</span>";0<=errorStrings.indexOf(a)&&!c||(consolePrint(a,!0),errorStrings.push(a))}}

function logErrorNoLine(a,b){if(compiling||b){var c='<span class="errorText">'+a+"</span>";0<=errorStrings.indexOf(c)&&!b||(consolePrint(c,!0),errorStrings.push(c));errorCount++}}

function logBetaMessage(a,b){if(compiling||b){var c='<span class="betaText">'+a+"</span>";0<=errorStrings.indexOf(c)&&!b||(consoleError(c),errorStrings.push(c))}}

function blankLineHandle(a){"levels"===a.section?0<a.levels[a.levels.length-1].length&&a.levels.push([]):"objects"===a.section&&(a.objects_section=0)}

var codeMirrorFn=function(){
	function a(a,b){if(void 0!==a.objects[b])return logError('Object "'+b.toUpperCase()+'" defined multiple times.',a.lineNumber),"ERROR";for(var c=0;c<a.legend_synonyms.length;c++){var d=a.legend_synonyms[c];d[0]==b&&logError('Name "'+b.toUpperCase()+'" already in use.',a.lineNumber)}for(c=0;c<a.legend_aggregates.length;c++)d=a.legend_aggregates[c],d[0]==b&&logError('Name "'+b.toUpperCase()+'" already in use.',a.lineNumber);for(c=0;c<a.legend_properties.length;c++)d=a.legend_properties[c],d[0]==b&&logError('Name "'+b.toUpperCase()+'" already in use.',a.lineNumber)}

	var b="objects legend sounds collisionlayers rules winconditions levels".split(" "),c="sfx0 sfx1 sfx2 sfx3 sfx4 sfx5 sfx6 sfx7 sfx8 sfx9 sfx10 cancel checkpoint restart win message again".split(" "),d=/[\w]+\s*/,e=/\d+\b/,g=/(objects|collisionlayers|legend|sounds|rules|winconditions|levels)(?![\w])\s*/,h=/[\=]+/,l=/[^\(]+/,p=/[ \,]*/,m=/(move|action|create|destroy|cantmove|undo|restart|titlescreen|startgame|cancel|endgame|startlevel|endlevel|showmessage|closemessage|sfx0|sfx1|sfx2|sfx3|sfx4|sfx5|sfx6|sfx7|sfx8|sfx9|sfx10)\s+/,
	u=/^(action|up|down|left|right|\^|v|\<|\>|forward|moving|stationary|parallel|perpendicular|horizontal|orthogonal|vertical|no|randomdir|random)$/,A=/^(startloop|endloop)$/,D=/^(up|down|left|right|horizontal|vertical|orthogonal|late|rigid)$/,E=/\s*(up|down|left|right|horizontal|vertical|orthogonal)\s*/,J=/^(all|any|no|some)$/,C="checkpoint objects collisionlayers legend sounds rules ... winconditions levels | [ ] up down left right late rigid ^ v > < no randomdir random horizontal vertical any all no some moving stationary parallel perpendicular action message".split(" ");
	return{
		copyState:function(a){var b={},c;for(c in a.objects)if(a.objects.hasOwnProperty(c)){var d=a.objects[c];b[c]={colors:d.colors.concat([]),lineNumber:d.lineNumber,spritematrix:d.spritematrix.concat([])}}d=[];for(c=0;c<a.collisionLayers.length;c++)d.push(a.collisionLayers[c].concat([]));var e=[],g=[],h=[],l=[],m=[],p=[];for(c=0;c<a.legend_synonyms.length;c++)e.push(a.legend_synonyms[c].concat([]));for(c=0;c<a.legend_aggregates.length;c++)g.push(a.legend_aggregates[c].concat([]));for(c=0;c<a.legend_properties.length;c++)h.push(a.legend_properties[c].concat([]));
for(c=0;c<a.sounds.length;c++)l.push(a.sounds[c].concat([]));for(c=0;c<a.levels.length;c++)m.push(a.levels[c].concat([]));for(c=0;c<a.winconditions.length;c++)p.push(a.winconditions[c].concat([]));return{lineNumber:a.lineNumber,objects:b,collisionLayers:d,commentLevel:a.commentLevel,section:a.section,visitedSections:a.visitedSections.concat([]),objects_candname:a.objects_candname,objects_section:a.objects_section,objects_spritematrix:a.objects_spritematrix.concat([]),tokenIndex:a.tokenIndex,legend_synonyms:e,
legend_aggregates:g,legend_properties:h,sounds:l,rules:a.rules.concat([]),names:a.names.concat([]),winconditions:p,abbrevNames:a.abbrevNames.concat([]),metadata:a.metadata.concat([]),levels:m,STRIDE_OBJ:a.STRIDE_OBJ,STRIDE_MOV:a.STRIDE_MOV}},blankLine:function(a){"levels"===a.section&&0<a.levels[a.levels.length-1].length&&a.levels.push([])},token:function(v,k){var r=v.string,w=v.sol();w&&(v.string=v.string.toLowerCase(),k.tokenIndex=0);v.eatWhile(/[ \t]/);var q=v.peek();if("("===q&&-4!==k.tokenIndex)v.next(),
k.commentLevel++;else if(")"===q&&(v.next(),0<k.commentLevel&&(k.commentLevel--,0===k.commentLevel)))return"comment";if(0<k.commentLevel){for(;;){v.eatWhile(/[^\(\)]+/);if(v.eol())break;q=v.peek();"("===q?k.commentLevel++:")"===q&&k.commentLevel--;v.next();if(0===k.commentLevel)break}return"comment"}v.eatWhile(/[ \t]/);if(w&&v.eol())return blankLineHandle(k);if(w&&v.match(h,!0))return"EQUALSBIT";if(v.match(g,!0)){k.section=v.string.slice(0,v.pos).trim();0<=k.visitedSections.indexOf(k.section)&&logError('cannot duplicate sections (you tried to duplicate "'+
k.section.toUpperCase()+'").',k.lineNumber);k.visitedSections.push(k.section);q=b.indexOf(k.section);0==q?(k.objects_section=0,1<k.visitedSections.length&&logError('section "'+k.section.toUpperCase()+'" must be the first section',k.lineNumber)):-1==k.visitedSections.indexOf(b[q-1])&&(-1===q?logError('no such section as "'+k.section.toUpperCase()+'".',k.lineNumber):logError('section "'+k.section.toUpperCase()+'" is out of order, must follow  "'+b[q-1].toUpperCase()+'".',k.lineNumber));if("sounds"===
k.section){for(var F in k.objects)k.objects.hasOwnProperty(F)&&k.names.push(F);for(q=0;q<k.legend_synonyms.length;q++)F=k.legend_synonyms[q][0],k.names.push(F);for(q=0;q<k.legend_aggregates.length;q++)F=k.legend_aggregates[q][0],k.names.push(F);for(q=0;q<k.legend_properties.length;q++)F=k.legend_properties[q][0],k.names.push(F)}else if("levels"===k.section){for(F in k.objects)k.objects.hasOwnProperty(F)&&1==F.length&&k.abbrevNames.push(F);for(q=0;q<k.legend_synonyms.length;q++)1==k.legend_synonyms[q][0].length&&
k.abbrevNames.push(k.legend_synonyms[q][0]);for(q=0;q<k.legend_aggregates.length;q++)1==k.legend_aggregates[q][0].length&&k.abbrevNames.push(k.legend_aggregates[q][0])}return"HEADER"}void 0===k.section&&logError('must start with section "OBJECTS"',k.lineNumber);if(v.eol())return null;switch(k.section){case "objects":F=function(){var a=w?v.match(d,!0):v.match(/[^\s\()]+\s*/,!0);if(null==a)return v.match(l,!0),0<v.pos&&logWarning('Unknown junk in object section (possibly: sprites have to be 5 pixels wide and 5 pixels high exactly. Or maybe: the main names for objects have to be words containing only the letters a-z0.9 - if you want to call them something like ",", do it in the legend section).',
k.lineNumber),"ERROR";a=a[0].trim();if(void 0!==k.objects[a])return logError('Object "'+a.toUpperCase()+'" defined multiple times.',k.lineNumber),"ERROR";for(var b=0;b<k.legend_synonyms.length;b++)k.legend_synonyms[b][0]==a&&logError('Name "'+a.toUpperCase()+'" already in use.',k.lineNumber);0<=C.indexOf(a)&&logWarning('You named an object "'+a.toUpperCase()+"\", but this is a keyword. Don't do that!",k.lineNumber);w?(k.objects_candname=a,k.objects[k.objects_candname]={lineNumber:k.lineNumber,colors:[],
spritematrix:[]}):(a=[a,k.objects_candname],a.lineNumber=k.lineNumber,k.legend_synonyms.push(a));k.objects_section=1;return"NAME"};w&&2==k.objects_section&&(k.objects_section=3);w&&1==k.objects_section&&(k.objects_section=2);switch(k.objects_section){case 0:case 1:return k.objects_spritematrix=[],F();case 2:k.tokenIndex=0;q=v.match(reg_color,!0);if(null==q)return q=v.match(d,!0)||v.match(l,!0),logError("Was looking for color for object "+k.objects_candname.toUpperCase()+', got "'+q+'" instead.',k.lineNumber),
null;void 0===k.objects[k.objects_candname].colors?k.objects[k.objects_candname].colors=[q[0].trim()]:k.objects[k.objects_candname].colors.push(q[0].trim());q=q[0].trim().toLowerCase();return q in colorPalettes.arnecolors?"COLOR COLOR-"+q.toUpperCase():"transparent"===q?"COLOR FADECOLOR":"COLOR";case 3:q=v.eat(/[.\d]/);r=k.objects_spritematrix;if(void 0===q){if(0===r.length)return F();logError("Unknown junk in spritematrix for object "+k.objects_candname.toUpperCase()+".",k.lineNumber);v.match(l,
!0);return null}w&&r.push("");var R=k.objects[k.objects_candname];r[r.length-1]+=q;if(5<r[r.length-1].length)return logError("Sprites must be 5 wide and 5 high.",k.lineNumber),v.match(l,!0),null;R.spritematrix=k.objects_spritematrix;5===r.length&&5==r[r.length-1].length&&(k.objects_section=0);return"."!==q?(F=parseInt(q),F>=R.colors.length?(logError("Trying to access color number "+F+" from the color palette of sprite "+k.objects_candname.toUpperCase()+", but there are only "+R.colors.length+" defined in it.",
k.lineNumber),"ERROR"):isNaN(F)?(logError('Invalid character "'+q+'" in sprite for '+k.objects_candname.toUpperCase(),k.lineNumber),"ERROR"):"COLOR BOLDCOLOR COLOR-"+R.colors[F].toUpperCase()):"COLOR FADECOLOR";default:window.console.logError("EEK shouldn't get here.")}break;case "sounds":if(w){var Q=!0,r=l.exec(v.string)[0].split(/\s/).filter(function(a){return""!==a});r.push(k.lineNumber);k.sounds.push(r)}K=v.match(m,!0);if(null!==K)return"SOUNDVERB";K=v.match(E,!0);if(null!==K)return"DIRECTION";
K=v.match(e,!0);if(null!==K)return k.tokenIndex++,"SOUND";K=v.match(/[^\[\|\]\s]*/,!0);if(null!==K&&(q=K[0].trim(),0<=k.names.indexOf(q)))return"NAME";K=v.match(l,!0);logError('unexpected sound token "'+K+'".',k.lineNumber);v.match(l,!0);return"ERROR";case "collisionlayers":w&&(k.collisionLayers.push([]),k.tokenIndex=0);q=v.match(d,!0);if(null===q)return q=v.pos,v.match(p,!0),v.pos==q&&(logError("error detected - unexpected character "+v.peek(),k.lineNumber),v.next()),null;var K=q[0].trim(),T=function(a){a=
a.toLowerCase();if(a in k.objects)return[a];for(var b=0;b<k.legend_synonyms.length;b++){var c=k.legend_synonyms[b];if(c[0]===a)return T(c[1])}for(b=0;b<k.legend_aggregates.length;b++)if(c=k.legend_aggregates[b],c[0]===a)return logError('"'+a+'" is an aggregate (defined using "and"), and cannot be added to a single layer because its constituent objects must be able to coexist.',k.lineNumber),[];for(b=0;b<k.legend_properties.length;b++)if(c=k.legend_properties[b],c[0]===a)return[].concat.apply([],c.slice(1).map(T));
logError('Cannot add "'+K.toUpperCase()+'" to a collision layer; it has not been declared.',k.lineNumber);return[]};"background"===K?(0<k.collisionLayers.length&&0<k.collisionLayers[k.collisionLayers.length-1].length&&logError("Background must be in a layer by itself.",k.lineNumber),k.tokenIndex=1):0!==k.tokenIndex&&logError("Background must be in a layer by itself.",k.lineNumber);r=T(K);if(0===k.collisionLayers.length)return logError("no layers found.",k.lineNumber),"ERROR";F=[];for(q=0;q<r.length;q++)for(K=
r[q],R=0;R<=k.collisionLayers.length-1;R++)0<=k.collisionLayers[R].indexOf(K)&&R!=k.collisionLayers.length-1&&F.push(R);if(0<F.length){R='Object "'+K.toUpperCase()+'" included in multiple collision layers ( layers ';for(q=0;q<F.length;q++)R+=F[q]+", ";R+=k.collisionLayers.length-1;logWarning(R+"). You should fix this!",k.lineNumber)}k.collisionLayers[k.collisionLayers.length-1]=k.collisionLayers[k.collisionLayers.length-1].concat(r);return 0<r.length?"NAME":"ERROR";case "legend":if(w){q=v.string.replace("=",
" = ");q=l.exec(q)[0];r=q.split(/\s/).filter(function(a){return""!==a});Q=!0;0<r.length&&(K=r[0].toLowerCase(),0<=C.indexOf(K)&&logWarning('You named an object "'+K.toUpperCase()+"\", but this is a keyword. Don't do that!",k.lineNumber),2<=r.indexOf(K,2)&&(logError("You can't define object "+K.toUpperCase()+" in terms of itself!",k.lineNumber),Q=!1),a(k,K));if(Q)if(3>r.length)Q=!1;else if("="!==r[1])Q=!1;else if(3===r.length)q=[r[0],r[2].toLowerCase()],q.lineNumber=k.lineNumber,k.legend_synonyms.push(q);
else if(0===r.length%2)Q=!1;else if(q=r[3].toLowerCase(),"and"===q){T=function(a){a=a.toLowerCase();if(a in k.objects)return[a];for(var b=0;b<k.legend_synonyms.length;b++){var c=k.legend_synonyms[b];if(c[0]===a)return T(c[1])}for(b=0;b<k.legend_aggregates.length;b++)if(c=k.legend_aggregates[b],c[0]===a)return[].concat.apply([],c.slice(1).map(T));for(b=0;b<k.legend_properties.length;b++)if(c=k.legend_properties[b],c[0]===a){logError("Cannot define an aggregate (using 'and') in terms of properties (something that uses 'or').",
k.lineNumber);Q=!1;break}return[a]};for(q=5;q<r.length;q+=2)if("and"!==r[q].toLowerCase()){Q=!1;break}if(Q){F=[r[0]].concat(T(r[2])).concat(T(r[4]));for(q=6;q<r.length;q+=2)F=F.concat(T(r[q]));F.lineNumber=k.lineNumber;k.legend_aggregates.push(F)}}else if("or"===q){T=function(a){a=a.toLowerCase();if(a in k.objects)return[a];for(var b=0;b<k.legend_synonyms.length;b++){var c=k.legend_synonyms[b];if(c[0]===a)return T(c[1])}for(b=0;b<k.legend_aggregates.length;b++)c=k.legend_aggregates[b],c[0]===a&&(logError("Cannot define a property (using 'or') in terms of aggregates (something that uses 'and').",
k.lineNumber),Q=!1);for(b=0;b<k.legend_properties.length;b++)if(c=k.legend_properties[b],c[0]===a)return[].concat.apply([],c.slice(1).map(T));return[a]};for(q=5;q<r.length;q+=2)if("or"!==r[q].toLowerCase()){Q=!1;break}if(Q){F=[r[0]].concat(T(r[2])).concat(T(r[4]));for(q=6;q<r.length;q+=2)F.push(r[q].toLowerCase());F.lineNumber=k.lineNumber;k.legend_properties.push(F)}}else Q=!1;if(!1===Q)return logError("incorrect format of legend - should be one of A = B, A = B or C ( or D ...), A = B and C (and D ...)",
k.lineNumber),v.match(l,!0),"ERROR";k.tokenIndex=0}if(0===k.tokenIndex)return v.match(/[^=]*/,!0),k.tokenIndex++,"NAME";if(1===k.tokenIndex)return v.next(),v.match(/\s*/,!0),k.tokenIndex++,"ASSSIGNMENT";q=v.match(d,!0);if(null===q)return logError("Something bad's happening in the LEGEND",k.lineNumber),v.match(l,!0),"ERROR";K=q[0].trim();if(0===k.tokenIndex%2){if(!1===function(a){a=a.toLowerCase();if(a in k.objects)return!0;for(var b=0;b<k.legend_aggregates.length;b++){var c=k.legend_aggregates[b];
if(c[0]===a)return!0}for(b=0;b<k.legend_properties.length;b++)if(c=k.legend_properties[b],c[0]===a)return!0;for(b=0;b<k.legend_synonyms.length;b++)if(c=k.legend_synonyms[b],c[0]===a)return!0;return!1}(K))return logError('Cannot reference "'+K.toUpperCase()+'" in the LEGEND section; it has not been defined yet.',k.lineNumber),k.tokenIndex++,"ERROR";k.tokenIndex++;return"NAME"}k.tokenIndex++;return"LOGICWORD";case "rules":w&&(F=l.exec(v.string)[0],k.rules.push([F,k.lineNumber,r]),k.tokenIndex=0);if(-4===
k.tokenIndex)return v.skipToEnd(),"MESSAGE";if(v.match(/\s*\-\>\s*/,!0))return"ARROW";if("["===q||"|"===q||"]"===q||"+"===q)return"+"!==q&&(k.tokenIndex=1),v.next(),v.match(/\s*/,!0),"BRACKET";q=v.match(/[^\[\|\]\s]*/,!0)[0].trim();if(0===k.tokenIndex&&A.exec(q))return"BRACKET";if(0===k.tokenIndex&&D.exec(q)||1===k.tokenIndex&&u.exec(q))return v.match(/\s*/,!0),"DIRECTION";if(0<=k.names.indexOf(q)){if(w)return logError("Identifiers cannot appear outside of square brackets in rules, only directions can.",
k.lineNumber),"ERROR";v.match(/\s*/,!0);return"NAME"}if("..."===q||"rigid"===q||"random"===q)return"DIRECTION";if(0<=c.indexOf(q))return"message"===q&&(k.tokenIndex=-4),"COMMAND";logError('Name "'+q+'", referred to in a rule, does not exist.',k.lineNumber);return"ERROR";case "winconditions":w&&(q=l.exec(v.string)[0].split(/\s/).filter(function(a){return""!==a}),q.push(k.lineNumber),k.winconditions.push(q),k.tokenIndex=-1);k.tokenIndex++;q=v.match(/\s*\w+\s*/);if(null===q)return logError("incorrect format of win condition.",
k.lineNumber),v.match(l,!0),"ERROR";q=q[0].trim();if(0===k.tokenIndex)return J.exec(q)?"LOGICWORD":"ERROR";if(2===k.tokenIndex)return"on"!=q?"ERROR":"LOGICWORD";if(1===k.tokenIndex||3===k.tokenIndex)return-1===k.names.indexOf(q)?(logError('Error in win condition: "'+q.toUpperCase()+'" is not a valid object name.',k.lineNumber),"ERROR"):"NAME";break;case "levels":if(w){if(v.match(/\s*message\s*/,!0))return k.tokenIndex=1,q=["\n",r.slice(v.pos).trim(),k.lineNumber],0==k.levels[k.levels.length-1].length?
k.levels.splice(k.levels.length-1,0,q):k.levels.push(q),"MESSAGE_VERB";q=v.match(l,!1)[0].trim();k.tokenIndex=2;r=k.levels[k.levels.length-1];"\n"==r[0]?k.levels.push([k.lineNumber,q]):(0==r.length&&r.push(k.lineNumber),r.push(q),1<r.length&&q.length!=r[1].length&&logWarning("Maps must be rectangular, yo (In a level, the length of each row must be the same).",k.lineNumber))}else if(1==k.tokenIndex)return v.skipToEnd(),"MESSAGE";if(2===k.tokenIndex&&!v.eol()){q=v.peek();v.next();if(0<=k.abbrevNames.indexOf(q))return"LEVEL";
logError('Key "'+q.toUpperCase()+'" not found. Do you need to add it to the legend, or define a new object?',k.lineNumber);return"ERROR"}break;default:if(w&&(k.tokenIndex=0),0==k.tokenIndex){if(q=v.match(/\s*\w+\s*/),null!==q){q=q[0].trim();if(w)if(0<="title author homepage background_color text_color key_repeat_interval realtime_interval again_interval flickscreen zoomscreen color_palette youtube".split(" ").indexOf(q)){if("youtube"===q||"author"===q||"title"===q)v.string=r;r=v.match(l,!1);null!=
r?(k.metadata.push(q),k.metadata.push(r[0].trim())):logError('MetaData "'+q+'" needs a value.',k.lineNumber);k.tokenIndex=1}else if(0<="run_rules_on_level_start norepeat_action require_player_movement debug verbose_logging throttle_movement noundo noaction norestart scanline".split(" ").indexOf(q))k.metadata.push(q),k.metadata.push("true"),k.tokenIndex=-1;else return logError("Unrecognised stuff in metadata section.",k.lineNumber),"ERROR";else if(-1==k.tokenIndex)return logError('MetaData "'+q+'" has no parameters.',
k.lineNumber),"ERROR";return"METADATA"}}else return v.match(l,!0),"METADATATEXT"}if(v.eol())return null;if(!v.eol())return v.next(),null},startState:function(){return{objects:{},lineNumber:0,commentLevel:0,section:"",visitedSections:[],objects_candname:"",objects_section:0,objects_spritematrix:[],collisionLayers:[],tokenIndex:0,legend_synonyms:[],legend_aggregates:[],legend_properties:[],sounds:[],rules:[],names:[],winconditions:[],metadata:[],abbrevNames:[],levels:[[]],subsection:""}}}};

window.CodeMirror.defineMode("puzzle",codeMirrorFn);

function isColor(a){a=a.trim();return a in colorPalettes.arnecolors||/^#([0-9A-F]{3}){1,2}$/i.test(a)||"transparent"===a?!0:!1}function colorToHex(a,b){b=b.trim();return b in a?a[b]:b}

function generateSpriteMatrix(a){
	for(var b=[],c=0;	c<a.length;c++){
		for(var d=[],e=0;e<a.length;e++){
			var g=a[c].charAt(e);
			"."==g?d.push(-1):d.push(g)
		}
		b.push(d)
	}
return b}

var debugMode,colorPalette;

function generateExtraMembers(a){0===a.collisionLayers.length&&logError("No collision layers defined.  All objects need to be in collision layers.");a.idDict={};for(var b=0,c=0;c<a.collisionLayers.length;c++)for(var d=0;d<a.collisionLayers[c].length;d++){var e=a.collisionLayers[c][d];if(e in a.objects){var g=a.objects[e];g.layer=c;g.id=b;a.idDict[b]=e;b++}}a.objectCount=b;d=a.collisionLayers.length;c=[];for(b=0;b<d;b++)c.push(-1);STRIDE_OBJ=Math.ceil(a.objectCount/32)|0;STRIDE_MOV=Math.ceil(d/5)|
0;a.STRIDE_OBJ=STRIDE_OBJ;a.STRIDE_MOV=STRIDE_MOV;throttle_movement=verbose_logging=debugMode=!1;colorPalette=colorPalettes.arnecolors;for(b=0;b<a.metadata.length;b+=2){var h=a.metadata[b],d=a.metadata[b+1];"color_palette"===h?(d in colorPalettesAliases&&(d=colorPalettesAliases[d]),void 0===colorPalettes[d]?logError('Palette "'+d+'" not found, defaulting to arnecolors.',0):colorPalette=colorPalettes[d]):"debug"===h?cache_console_messages=debugMode=!0:"verbose_logging"===h?cache_console_messages=verbose_logging=
!0:"throttle_movement"===h&&(throttle_movement=!0)}for(e in a.objects)if(a.objects.hasOwnProperty(e))for(g=a.objects[e],10<g.colors.length&&logError("a sprite cannot have more than 10 colors.  Why you would want more than 10 is beyond me.",g.lineNumber+1),b=0;b<g.colors.length;b++)d=g.colors[b],isColor(d)?(d=colorToHex(colorPalette,d),g.colors[b]=d):(logError('Invalid color specified for object "'+e+'", namely "'+g.colors[b]+'".',g.lineNumber+1),g.colors[b]="#ff00ff");for(e in a.objects)a.objects.hasOwnProperty(e)&&
(g=a.objects[e],0==g.colors.length&&(logError('color not specified for object "'+e+'".',g.lineNumber),g.colors=["#ff00ff"]),0===g.spritematrix.length?g.spritematrix=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]:(5===g.spritematrix.length&&5===g.spritematrix[0].length&&5===g.spritematrix[1].length&&5===g.spritematrix[2].length&&5===g.spritematrix[3].length&&5===g.spritematrix[4].length||logWarning("Sprite graphics must be 5 wide and 5 high exactly.",g.lineNumber),g.spritematrix=generateSpriteMatrix(g.spritematrix)));
var l={};for(e in a.objects)if(a.objects.hasOwnProperty(e)){var g=a.objects[e],p=c.concat([]);p[g.layer]=g.id;l[e]=p}for(g=!0;g;){g=!1;for(b=0;b<a.legend_synonyms.length;b++){var m=a.legend_synonyms[b],h=m[0],d=m[1];h in l&&void 0!==l[h]||void 0===l[d]||(g=!0,l[h]=l[d])}for(b=0;b<a.legend_aggregates.length;b++){for(var m=a.legend_aggregates[b],h=m[0],p=m.slice(1),u=!0,d=0;d<p.length;d++)if(void 0===l[p[d]]){u=!1;break}if(!(h in l&&void 0!==l[h])&&u){p=c.concat([]);for(d=1;d<m.length;d++)e=m[d],g=
a.objects[e],void 0==g&&logError("Object not found with name "+e,a.lineNumber),-1==p[g.layer]?p[g.layer]=g.id:void 0===g.layer?logError('Object "'+e.toUpperCase()+'" has been defined, but not assigned to a layer.',m.lineNumber):(u=e.toUpperCase(),g=a.idDict[p[g.layer]].toUpperCase(),u!==g&&logError('Trying to create an aggregate object (defined in the legend) with both "'+u+'" and "'+g+"\", which are on the same layer and therefore can't coexist.",m.lineNumber));g=!0;l[m[0]]=p}}}a.glyphDict=l;l={};
for(b=0;b<a.legend_aggregates.length;b++)d=a.legend_aggregates[b],l[d[0]]=d.slice(1);a.aggregatesDict=l;c={};for(b=0;b<a.legend_properties.length;b++)d=a.legend_properties[b],c[d[0]]=d.slice(1);a.propertiesDict=c;g={};for(b=0;b<a.legend_synonyms.length;b++)d=a.legend_synonyms[b],h=d[0],p=d[1],p in l?l[h]=l[p]:p in c?c[h]=c[p]:h!==p&&(g[h]=p);a.synonymsDict=g;for(d=!0;d;){d=!1;for(e in g)g.hasOwnProperty(e)&&(p=g[e],p in c?(delete g[e],c[e]=c[p],d=!0):p in l?(delete l[e],l[e]=l[p],d=!0):p in g&&(g[e]=
g[p]));for(e in c)if(c.hasOwnProperty(e))for(m=c[e],b=0;b<m.length;b++){p=m[b];if(p in g)m[b]=g[p],d=!0;else if(p in c){m.splice(b,1);u=c[p];for(d=0;d<u.length;d++){var A=u[d];-1===m.indexOf(A)&&m.push(A)}d=!0}p in l&&logError('Trying to define property "'+e.toUpperCase()+'" in terms of aggregate "'+p.toUpperCase()+'".')}for(e in l)if(l.hasOwnProperty(e))for(m=l[e],b=0;b<m.length;b++){p=m[b];if(p in g)m[b]=g[p],d=!0;else if(p in l){m.splice(b,1);u=l[p];for(d=0;d<u.length;d++)A=u[d],-1===m.indexOf(A)&&
m.push(A);d=!0}p in c&&logError('Trying to define aggregate "'+e.toUpperCase()+'" in terms of property "'+p.toUpperCase()+'".')}}a.propertiesSingleLayer={};for(h in c)if(c.hasOwnProperty(h)){m=c[h];e=!0;for(b=1;b<m.length;b++)if(a.objects[m[b-1]].layer!==a.objects[m[b]].layer){e=!1;break}e&&(a.propertiesSingleLayer[h]=a.objects[m[0]].layer)}void 0===a.idDict[0]&&0<a.collisionLayers.length&&logError("You need to have some objects defined");void 0===a.objects.background?"background"in a.synonymsDict?
(e=a.synonymsDict.background,g=a.objects[e],h=g.id,e=g.layer):"background"in a.propertiesDict?(e=a.propertiesDict.background[0],g=a.objects[e],h=g.id,e=g.layer):"background"in a.aggregatesDict?(g=a.objects[a.idDict[0]],h=g.id,e=g.layer,logError("background cannot be an aggregate (declared with 'and'), it has to be a simple type, or property (declared in terms of others using 'or').")):(g=a.objects[a.idDict[0]],h=g.id,e=g.layer,logError("you have to define something to be the background")):(h=a.objects.background.id,
e=a.objects.background.layer);a.backgroundid=h;a.backgroundlayer=e}Level.prototype.calcBackgroundMask=function(a){void 0===a.backgroundlayer&&logError("you have to have a background layer");for(var b=a.layerMasks[a.backgroundlayer],c=0;c<this.n_tiles;c++){var d=this.getCell(c);d.iand(b);if(!d.iszero())return d}d=new BitVec(STRIDE_OBJ);d.ibitset(a.backgroundid);return d};

function levelFromString(a,b){var c=a.layerMasks[a.backgroundlayer],d=new Level(b[0],b[1].length,b.length-1,a.collisionLayers.length,null);d.objects=new Int32Array(d.width*d.height*STRIDE_OBJ);for(var e=0;e<d.width;e++)for(var g=0;g<d.height;g++){var h=b[g+1].charAt(e);0==h.length&&(h=b[g+1].charAt(b[g+1].length-1));var l=a.glyphDict[h];void 0==l&&(void 0===a.propertiesDict[h]?logError('Error, symbol "'+h+'", used in map, not found.',b[0]+g):logError('Error, symbol "'+h+"\" is defined using 'or', and therefore ambiguous - it cannot be used in a map. Did you mean to define it in terms of 'and'?",
b[0]+g));for(var h=new BitVec(STRIDE_OBJ),l=l.concat([]),p=0;p<d.layerCount;p++)0<=l[p]&&h.ibitset(l[p]);for(l=0;l<STRIDE_OBJ;++l)d.objects[STRIDE_OBJ*(e*d.height+g)+l]=h.data[l]}g=d.calcBackgroundMask(a);for(e=0;e<d.n_tiles;e++)l=d.getCell(e),c.anyBitsInCommon(l)||l.ior(g),d.setCell(e,l);return d}

function levelsToArray(a){for(var b=a.levels,c=[],d=0;d<b.length;d++){var e=b[d];if(0!=e.length){if("\n"==e[0]){var g={message:e[1]};splitMessage=wordwrap(g.message,intro_template[0].length);12<splitMessage.length&&logWarning("Message too long to fit on screen.",e[2])}else g=levelFromString(a,e);c.push(g)}}a.levels=c}

var directionaggregates={horizontal:["left","right"],vertical:["up","down"],moving:["up","down","left","right","action"],orthogonal:["up","down","left","right"],perpendicular:["^","v"],parallel:["<",">"]},relativeDirections="^ v < > horizontal vertical".split(" "),simpleAbsoluteDirections=["up","down","left","right"],simpleRelativeDirections=["^","v","<",">"],reg_directions_only=/^(\>|\<|\^|v|up|down|left|right|moving|stationary|no|randomdir|random|horizontal|vertical|orthogonal|perpendicular|parallel|action)$/,
commandwords="sfx0 sfx1 sfx2 sfx3 sfx4 sfx5 sfx6 sfx7 sfx8 sfx9 sfx10 cancel checkpoint restart win message again".split(" ");

function directionalRule(a){for(var b=0;b<a.lhs.length;b++){var c=a.lhs[b];if(1<c.length)return!0;for(var d=0;d<c.length;d++)for(var e=c[d],g=0;g<e.length;g+=2)if(0<=relativeDirections.indexOf(e[g]))return!0}for(b=0;b<a.rhs.length;b++){c=a.rhs[b];if(1<c.length)return!0;for(d=0;d<c.length;d++)for(e=c[d],g=0;g<e.length;g+=2)if(0<=relativeDirections.indexOf(e[g]))return!0}return!1}

function findIndexAfterToken(a,b,c){a=a.toLowerCase();for(var d=0,e=0;e<=c;e++)var g=b[e],d=a.indexOf(g,d)+g.length;return d}

function processRuleString(a,b,c){var d=a[0],e=a[1],g=a[2],d=d.replace(/\[/g," [ ").replace(/\]/g," ] ").replace(/\|/g," | ").replace(/\-\>/g," -> "),d=d.trim();"+"===d[0]&&(d=d.substring(0,1)+" "+d.substring(1,d.length));var h=d.split(/\s/).filter(function(a){return""!==a});0==h.length&&logError("Spooky error!  Empty line passed to rule function.",e);var l=0,p=[],m=null,u=[],A=!1,D=!1,E=[],d=[],J=!1,C=!1,v=e;a=[];var k=!1;if(1===h.length){if("startloop"===h[0])return b={bracket:1};if("endloop"===
h[0])return b={bracket:-1}}-1==h.indexOf("->")&&logError("A rule has to have an arrow in it.  There's no arrow here! Consider reading up about rules - you're clearly doing something weird",e);for(var r=0;r<h.length;r++){var w=h[r];switch(l){case 0:"+"===w?v===e?(0==c.length&&logError('The "+" symbol, for joining a rule with the group of the previous rule, needs a previous rule to be applied to.'),0!==r&&logError('The "+" symbol, for joining a rule with the group of the previous rule, must be the first symbol on the line '),
v=c[c.length-1].groupNumber):logError('Two "+"s ("append to previous rule group" symbol) applied to the same rule.',e):w in directionaggregates?p=p.concat(directionaggregates[w]):"late"===w?J=!0:"rigid"===w?C=!0:"random"===w?k=!0:0<=simpleAbsoluteDirections.indexOf(w)?p.push(w):0<=simpleRelativeDirections.indexOf(w)?logError('You cannot use relative directions ("^v<>") to indicate in which direction(s) a rule applies.  Use absolute directions indicators (Up, Down, Left, Right, Horizontal, or Vertical, for instance), or, if you want the rule to apply in all four directions, do not specify directions',
e):"["==w?(0==p.length&&(p=p.concat(directionaggregates.orthogonal)),l=1,r--):logError("The start of a rule must consist of some number of directions (possibly 0), before the first bracket, specifying in what directions to look (with no direction specified, it applies in all four directions).  It seems you've just entered \""+w.toUpperCase()+'".',e);break;case 1:"["==w?(0<u.length&&logError('Error, malformed cell rule - encountered a "["" before previous bracket was closed',e),A=!0,m=[]):reg_directions_only.exec(w)?
1==m.length%2?logError("Error, an item can only have one direction/action at a time, but you're looking for several at once!",e):A?m.push(w):logWarning("Invalid syntax. Directions should be placed at the start of a rule.",e):"|"==w?1==m.length%2?logError("In a rule, if you specify a force, it has to act on an object.",e):(u.push(m),m=[]):"]"===w?(1==m.length%2?"..."===m[0]?logError("Cannot end a rule with ellipses.",e):logError("In a rule, if you specify a force, it has to act on an object.",e):(u.push(m),
m=[]),D?d.push(u):E.push(u),u=[],A=!1):"->"===w?(D&&logError('Error, you can only use "->" once in a rule; it\'s used to separate before and after states.',e),0<u.length?logError('Encountered an unexpected "->" inside square brackets.  It\'s used to separate states, it has no place inside them >:| .',e):D=!0):0<=b.names.indexOf(w)?A?0==m.length%2?(m.push(""),m.push(w)):1==m.length%2&&m.push(w):logWarning("Invalid token "+w.toUpperCase()+". Object names should only be used within cells (square brackets).",
e):"..."===w?A?(m.push(w),m.push(w)):logWarning("Invalid syntax, ellipses should only be used within cells (square brackets).",e):0<=commandwords.indexOf(w)?(!1===D&&logError("Commands cannot appear on the left-hand side of the arrow.",e),"message"===w?(r=findIndexAfterToken(g,h,r),r=g.substring(r).trim(),""===r&&(r=" "),a.push([w,r]),r=h.length):a.push([w])):logError('Error, malformed cell rule - was looking for cell contents, but found "'+w+'".  What am I supposed to do with this, eh, please tell me that.',
e)}}if(E.length!=d.length)0<a.length&&0==d.length||logError("Error, when specifying a rule, the number of matches (square bracketed bits) on the left hand side of the arrow must equal the number on the right",e);else for(r=0;r<E.length;r++)E[r].length!=d[r].length&&logError("In a rule, each pattern to match on the left must have a corresponding pattern on the right of equal length (number of cells).",e),0==E[r].length&&logError("You have an totally empty pattern on the left-hand side.  This will match *everything*.  You certainly don't want this.");
0==E.length&&logError("This rule refers to nothing.  What the heck? :O",e);b={directions:p,lhs:E,rhs:d,lineNumber:e,late:J,rigid:C,groupNumber:v,commands:a,randomRule:k};!1===directionalRule(b)&&(b.directions=["up"]);for(r=0;r<a.length;r++)c=a[r][0],"restart"===c?(1<a.length||0<d.length)&&logError("The RESTART command can only appear by itself on the right hand side of the arrow.",e):"cancel"===c&&(1<a.length||0<d.length)&&logError("The CANCEL command can only appear by itself on the right hand side of the arrow.",
e);return b}function deepCloneHS(a){return a.map(function(a){return a.map(function(a){return a.slice()})})}function deepCloneRule(a){return{direction:a.direction,lhs:deepCloneHS(a.lhs),rhs:deepCloneHS(a.rhs),lineNumber:a.lineNumber,late:a.late,rigid:a.rigid,groupNumber:a.groupNumber,commands:a.commands,randomRule:a.randomRule}}
function rulesToArray(a){for(var b=a.rules,c=[],d=[],e=0;e<b.length;e++){var g=b[e][1],h=processRuleString(b[e],a,c);void 0!==h.bracket?d.push([g,h.bracket]):c.push(h)}a.loops=d;d=[];for(e=0;e<c.length;e++)for(b=c[e],g=b.directions,h=0;h<g.length;h++){var l=g[h];if(l in directionaggregates&&directionalRule(b))for(var l=directionaggregates[l],p=0;p<l.length;p++){var m=deepCloneRule(b);m.direction=l[p];d.push(m)}else m=deepCloneRule(b),m.direction=l,d.push(m)}for(e=0;e<d.length;e++)b=d[e],convertRelativeDirsToAbsolute(b),
rewriteUpLeftRules(b),atomizeAggregates(a,b),rephraseSynonyms(a,b);c=[];for(e=0;e<d.length;e++)b=d[e],c=c.concat(concretizeMovingRule(a,b,b.lineNumber));d=[];for(e=0;e<c.length;e++)b=c[e],d=d.concat(concretizePropertyRule(a,b,b.lineNumber));a.rules=d}function containsEllipsis(a){for(var b=0;b<a.lhs.length;b++)for(var c=0;c<a.lhs[b].length;c++)if("..."===a.lhs[b][c][1])return!0;return!1}
function rewriteUpLeftRules(a){if(!containsEllipsis(a)){if("up"==a.direction)a.direction="down";else if("left"==a.direction)a.direction="right";else return;for(var b=0;b<a.lhs.length;b++)a.lhs[b].reverse(),0<a.rhs.length&&a.rhs[b].reverse()}}function getPropertiesFromCell(a,b){for(var c=[],d=0;d<b.length;d+=2){var e=b[d+1];"random"!=b[d]&&e in a.propertiesDict&&c.push(e)}return c}
function getMovings(a,b){for(var c=[],d=0;d<b.length;d+=2){var e=b[d],g=b[d+1];e in directionaggregates&&c.push([g,e])}return c}function concretizePropertyInCell(a,b,c){for(var d=0;d<a.length;d+=2)a[d+1]===b&&"random"!==a[d]&&(a[d+1]=c)}function concretizeMovingInCell(a,b,c,d){for(var e=0;e<a.length;e+=2)a[e]===b&&a[e+1]===c&&(a[e]=d)}function concretizeMovingInCellByAmbiguousMovementName(a,b,c){for(var d=0;d<a.length;d+=2)a[d]===b&&(a[d]=c)}
function expandNoPrefixedProperties(a,b){for(var c=[],d=0;d<b.length;d+=2){var e=b[d],g=b[d+1];if("no"===e&&g in a.propertiesDict)for(var g=a.propertiesDict[g],h=0;h<g.length;h++){var l=g[h];c.push(e);c.push(l)}else c.push(e),c.push(g)}return c}
function concretizePropertyRule(a,b,c){for(var d=0;d<b.lhs.length;d++)for(var e=b.lhs[d],g=0;g<e.length;g++)e[g]=expandNoPrefixedProperties(a,e[g]),0<b.rhs.length&&(b.rhs[d][g]=expandNoPrefixedProperties(a,b.rhs[d][g]));e={};for(g=0;g<b.rhs.length;g++)for(var d=b.lhs[g],h=b.rhs[g],l=0;l<h.length;l++)for(var p=getPropertiesFromCell(a,d[l]),m=getPropertiesFromCell(a,h[l]),u=0;u<m.length;u++){var A=m[u];-1==p.indexOf(A)&&(e[A]=!0)}b=[b];for(var D=!0;D;)for(D=!1,d=0;d<b.length;d++){h=b[d];m=!1;for(g=
0;g<h.lhs.length&&!m;g++)for(p=h.lhs[g],l=0;l<p.length&&!m;l++)for(var u=p[l],E=getPropertiesFromCell(a,u),u=0;u<E.length;++u)if(A=E[u],!a.propertiesSingleLayer.hasOwnProperty(A)||!0===e[A]){for(var E=a.propertiesDict[A],D=m=!0,J=0;J<E.length;J++){var u=E[J],C=deepCloneRule(h);C.propertyReplacement={};for(var v in h.propertyReplacement)if(h.propertyReplacement.hasOwnProperty(v)){var k=h.propertyReplacement[v];C.propertyReplacement[v]=[k[0],k[1]]}concretizePropertyInCell(C.lhs[g][l],A,u);0<C.rhs.length&&
concretizePropertyInCell(C.rhs[g][l],A,u);void 0===C.propertyReplacement[A]?C.propertyReplacement[A]=[u,1]:C.propertyReplacement[A][1]+=1;b.push(C)}break}m&&(b.splice(d,1),d--)}for(d=0;d<b.length;d++)if(h=b[d],void 0!==h.propertyReplacement)for(A in h.propertyReplacement)if(h.propertyReplacement.hasOwnProperty(A)&&(g=h.propertyReplacement[A],u=g[0],1===g[1]))for(g=0;g<h.rhs.length;g++)for(v=h.rhs[g],l=0;l<v.length;l++)concretizePropertyInCell(v[l],A,u);A="";for(d=0;d<b.length;d++)for(h=b[d],delete b.propertyReplacement,
g=0;g<h.rhs.length;g++)for(p=h.rhs[g],l=0;l<p.length;l++)for(u=p[l],E=getPropertiesFromCell(a,u),u=0;u<E.length;u++)e.hasOwnProperty(E[u])&&(A=E[u]);0<A.length&&logError('This rule has a property on the right-hand side, "'+A.toUpperCase()+"\", that can't be inferred from the left-hand side.  (either for every property on the right there has to be a corresponding one on the left in the same cell, OR, if there's a single occurrence of a particular property name on the left, all properties of the same name on the right are assumed to be the same).",
c);return b}

function concretizeMovingRule(a,b,c){var d;b=[b];for(var e=!0;e;)for(var e=!1,g=0;g<b.length;g++){var h=b[g];d=!1;for(var l=0;l<h.lhs.length;l++)for(var p=h.lhs[l],m=0;m<p.length;m++){var u=p[m],u=getMovings(a,u);if(0<u.length)for(var e=d=!0,A=u[0][0],u=u[0][1],D=directionaggregates[u],E=0;E<D.length;E++){var J=D[E],C=deepCloneRule(h);C.movingReplacement={};for(var v in h.movingReplacement)if(h.movingReplacement.hasOwnProperty(v)){var k=h.movingReplacement[v];C.movingReplacement[v]=[k[0],k[1],k[2]]}concretizeMovingInCell(C.lhs[l][m],
u,A,J);0<C.rhs.length&&concretizeMovingInCell(C.rhs[l][m],u,A,J);void 0===C.movingReplacement[A]?C.movingReplacement[A]=[J,1,u]:C.movingReplacement[A][1]+=1;b.push(C)}}d&&(b.splice(g,1),g--)}for(g=0;g<b.length;g++)if(h=b[g],void 0!==h.movingReplacement){p={};for(A in h.movingReplacement)if(h.movingReplacement.hasOwnProperty(A)){var r=h.movingReplacement[A];v=r[0];l=r[1];r=r[2];p[r]=r in p||1!==l?"INVALID":v;if(1===l)for(l=0;l<h.rhs.length;l++)for(d=h.rhs[l],m=0;m<d.length;m++)e=d[m],concretizeMovingInCell(e,
r,A,v)}for(r in p)if(p.hasOwnProperty(r)&&"INVALID"!==r)for(v=p[r],l=0;l<h.rhs.length;l++)for(d=h.rhs[l],m=0;m<d.length;m++)e=d[m],concretizeMovingInCellByAmbiguousMovementName(e,r,v)}A="";for(g=0;g<b.length;g++)for(h=b[g],delete b.movingReplacement,l=0;l<h.rhs.length;l++)for(p=h.rhs[l],m=0;m<p.length;m++)u=p[m],u=getMovings(a,u),0<u.length&&(A=u[0][1]);0<A.length&&logError('This rule has an ambiguous movement on the right-hand side, "'+A+"\", that can't be inferred from the left-hand side.  (either for every ambiguous movement associated to an entity on the right there has to be a corresponding one on the left attached to the same entity, OR, if there's a single occurrence of a particular ambiguous movement on the left, all properties of the same movement attached to the same object on the right are assumed to be the same (or something like that)).",
c);return b}function rephraseSynonyms(a,b){for(var c=0;c<b.lhs.length;c++)for(var d=b.lhs[c],e=b.rhs[c],g=0;g<d.length;g++){for(var h=d[g],l=1;l<h.length;l+=2){var p=h[l];p in a.synonymsDict&&(h[l]=a.synonymsDict[h[l]])}if(0<b.rhs.length)for(h=e[g],l=1;l<h.length;l+=2)p=h[l],p in a.synonymsDict&&(h[l]=a.synonymsDict[h[l]])}}

function atomizeAggregates(a,b){for(var c=0;c<b.lhs.length;c++)for(var d=b.lhs[c],e=0;e<d.length;e++){var g=d[e];atomizeCellAggregates(a,g,b.lineNumber)}for(c=0;c<b.rhs.length;c++)for(d=b.rhs[c],e=0;e<d.length;e++)g=d[e],atomizeCellAggregates(a,g,b.lineNumber)}

function atomizeCellAggregates(a,b,c){for(var d=0;d<b.length;d+=2){var e=b[d],g=b[d+1];if(g in a.aggregatesDict)for("no"===e&&logError("You cannot use 'no' to exclude the aggregate object "+g.toUpperCase()+" (defined using 'AND'), only regular objects, or properties (objects defined using 'OR').  If you want to do this, you'll have to write it out yourself the long way.",c),e=a.aggregatesDict[g],b[d+1]=e[0],g=1;g<e.length;g++)b.push(b[d]),b.push(e[g])}}

function convertRelativeDirsToAbsolute(a){for(var b=a.direction,c=0;c<a.lhs.length;c++)for(var d=a.lhs[c],e=0;e<d.length;e++){var g=d[e];absolutifyRuleCell(b,g)}for(c=0;c<a.rhs.length;c++)for(d=a.rhs[c],e=0;e<d.length;e++)g=d[e],absolutifyRuleCell(b,g)}var relativeDirs="^ v < > parallel perpendicular".split(" "),relativeDict={right:"up down left right horizontal vertical".split(" "),up:"left right down up vertical horizontal".split(" "),down:"right left up down vertical horizontal".split(" "),left:"down up right left horizontal vertical".split(" ")};

function absolutifyRuleCell(a,b){for(var c=0;c<b.length;c+=2){var d=relativeDirs.indexOf(b[c]);0<=d&&(b[c]=relativeDict[a][d])}}var dirMasks={up:1,down:2,left:4,right:8,moving:15,no:3,randomdir:5,random:18,action:16,"":0};

function rulesToMask(a){for(var b=a.collisionLayers.length,c=[],d=0;d<b;d++)c.push(null);for(d=0;d<a.rules.length;d++)for(var e=a.rules[d],g=0;g<e.lhs.length;g++)for(var h=e.lhs[g],l=e.rhs[g],p=0;p<h.length;p++){for(var m=h[p],u=c.concat([]),A=new BitVec(STRIDE_OBJ),D=new BitVec(STRIDE_OBJ),E=[],J=new BitVec(STRIDE_MOV),C=new BitVec(STRIDE_MOV),v=new BitVec(STRIDE_MOV),k=0;k<m.length;k+=2){var r=m[k];if("..."===r){A=ellipsisPattern;if(2!==m.length)logError("You can't have anything in with an ellipsis. Sorry.",
e.lineNumber);else if(0===p||p===h.length-1)logError("There's no point in putting an ellipsis at the very start or the end of a rule",e.lineNumber);else if(0<e.rhs.length){var w=l[p];2===w.length&&"..."===w[0]||logError("An ellipsis on the left must be matched by one in the corresponding place on the right.",e.lineNumber)}break}else if("random"===r){logError("'random' cannot be matched on the left-hand side, it can only appear on the right",e.lineNumber);continue}var q=m[k+1],F=a.objects[q],R=a.objectMasks[q],
w=F?F.layer|0:a.propertiesSingleLayer[q];"undefined"===typeof w&&logError("Oops!  "+q.toUpperCase()+" not assigned to a layer.",e.lineNumber);if("no"===r)D.ior(R);else{var Q=u[w];null!==Q&&logError("Rule matches object types that can't overlap: \""+q.toUpperCase()+'" and "'+Q.toUpperCase()+'".',e.lineNumber);u[w]=q;F?(A.ior(R),v.ishiftor(31,5*w)):E.push(R);"stationary"===r?C.ishiftor(31,5*w):J.ishiftor(dirMasks[r],5*w)}}if(0<e.rhs.length)for(w=l[p],k=h[p],"..."===w[0]&&"..."!==k[0]&&logError("An ellipsis on the right must be matched by one in the corresponding place on the left.",
e.lineNumber),k=0;k<w.length;k+=2)"..."===w[k]&&2!==w.length&&logError("You can't have anything in with an ellipsis. Sorry.",e.lineNumber);if(A===ellipsisPattern)h[p]=ellipsisPattern;else if(h[p]=new CellPattern([A,D,E,J,C,null]),0!==e.rhs.length){for(var D=l[p],E=c.concat([]),C=c.concat([]),m=new BitVec(STRIDE_OBJ),K=new BitVec(STRIDE_OBJ),T=new BitVec(STRIDE_MOV),S=new BitVec(STRIDE_MOV),X=new BitVec(STRIDE_MOV),wa=new BitVec(STRIDE_OBJ),ga=new BitVec(STRIDE_MOV),Ma=new BitVec(STRIDE_MOV),k=0;k<
D.length;k+=2){r=D[k];q=D[k+1];if("..."===r)break;else if("random"===r){if(q in a.objectMasks)for(wa.ior(a.objectMasks[q]),r=a.propertiesDict.hasOwnProperty(q)?a.propertiesDict[q]:[q],F=0;F<r.length;F++)q=r[F],w=a.objects[q].layer|0,Q=E[w],null!==Q&&(R=q.toUpperCase(),Q=Q.toUpperCase(),R!==Q&&logWarning("This rule may try to spawn a "+R+" with random, but also requires a "+Q+" be here, which is on the same layer - they shouldn't be able to coexist!",e.lineNumber)),C[w]=q;else logError('You want to spawn a random "'+
q.toUpperCase()+"\", but I don't know how to do that",e.lineNumber);continue}F=a.objects[q];R=a.objectMasks[q];w=F?F.layer|0:a.propertiesSingleLayer[q];"no"==r?m.ior(R):(Q=E[w],null===Q&&(Q=C[w]),null!==Q&&logError("Rule matches object types that can't overlap: \""+q.toUpperCase()+'" and "'+Q.toUpperCase()+'".',e.lineNumber),E[w]=q,0<r.length&&ga.ishiftor(31,5*w),Q=a.layerMasks[w],F&&(K.ibitset(F.id),m.ior(Q),X.ishiftor(31,5*w)),"stationary"===r&&T.ishiftor(31,5*w),"randomdir"===r?Ma.ishiftor(dirMasks[r],
5*w):S.ishiftor(dirMasks[r],5*w))}A.bitsSetInArray(K.data)||m.ior(A);J.bitsSetInArray(S.data)||T.ior(J);for(k=0;k<b;k++)null!==u[k]&&null===E[k]&&(m.ior(a.layerMasks[k]),ga.ishiftor(31,5*k));v.iclear(X);ga.ior(v);if(m||K||T||S||ga)h[p].replacement=new CellReplacement([m,K,T,S,ga,wa,Ma])}}}function cellRowMasks(a){var b=[];a=a[1];for(var c=0;c<a.length;c++){for(var d=a[c],e=new BitVec(STRIDE_OBJ),g=0;g<d.length;g++)d[g]!==ellipsisPattern&&e.ior(d[g].objectsPresent);b.push(e)}return b}

function collapseRules(a){for(var b=0;b<a.length;b++)for(var c=a[b],d=0;d<c.length;d++){for(var e=c[d],g=[0,[],0<e.rhs.length,e.lineNumber],h=[],l=0;l<e.lhs.length;l++)h.push(!1);g[0]=dirMasks[e.direction];for(l=0;l<e.lhs.length;l++){for(var p=e.lhs[l],m=0;m<p.length;m++)p[m]===ellipsisPattern&&(h[l]&&logError("You can't use two ellipses in a single cell match pattern.  If you really want to, please implement it yourself and send me a patch :) ",e.lineNumber),h[l]=!0);g[1][l]=p}g.push(h);g.push(e.groupNumber);
g.push(e.rigid);g.push(e.commands);g.push(e.randomRule);g.push(cellRowMasks(g));c[d]=new Rule(g)}matchCache={}}

function ruleGroupRandomnessTest(a){if(0!==a.length)for(var b=a[0].lineNumber,c=1;c<a.length;c++){var d=a[c];d.lineNumber!==b&&d.randomRule&&logError("A rule-group can only be marked random by the first rule",d.lineNumber)}}

function arrangeRulesByGroupNumber(a){for(var b={},c={},d=0;d<a.rules.length;d++){var e=a.rules[d],g=b;e.late&&(g=c);void 0==g[e.groupNumber]&&(g[e.groupNumber]=[]);g[e.groupNumber].push(e)}var d=[],h;for(h in b)b.hasOwnProperty(h)&&(e=b[h],ruleGroupRandomnessTest(e),d.push(e));b=[];for(h in c)c.hasOwnProperty(h)&&(e=c[h],ruleGroupRandomnessTest(e),b.push(e));a.rules=d;a.lateRules=b}

function checkNoLateRulesHaveMoves(a){for(var b=0;b<a.lateRules.length;b++)for(var c=a.lateRules[b],d=0;d<c.length;d++)for(var e=c[d],g=0;g<e.patterns.length;g++)for(var h=e.patterns[g],l=0;l<h.length;l++){var p=h[l];if(p!==ellipsisPattern){var m=p.movementsPresent;if(!p.movementsMissing.iszero()||!m.iszero()){logError("Movements cannot appear in late rules.",e.lineNumber);return}if(null!=p.replacement&&(m=p.replacement.movementsSet,!p.replacement.movementsClear.iszero()||!m.iszero())){logError("Movements cannot appear in late rules.",
e.lineNumber);return}}}}

function generateRigidGroupList(a){for(var b=[],c=[],d=[],e=[],g=0;g<a.rules.length;g++){for(var h=a.rules[g],l=!1,p=0;p<h.length;p++)h[p].isRigid&&(l=!0);if(e[g]=l)h=h[0].groupNumber,l=b.length,c[g]=l,d[h]=l,b.push(g)}30<b.length&&logError("There can't be more than 30 rigid groups (rule groups containing rigid members).",rules[0][0][3]);a.rigidGroups=e;a.rigidGroupIndex_to_GroupIndex=b;a.groupNumber_to_RigidGroupIndex=d;a.groupIndex_to_RigidGroupIndex=c}

function getMaskFromName(a,b){
	var c=new BitVec(STRIDE_OBJ);
	if(b in a.objects){
		var d=a.objects[b];
		c.ibitset(d.id)
	}
	if(b in a.aggregatesDict)
		for(var e=a.aggregatesDict[b],g=0;g<e.length;g++)
			d=e[g],d=a.objects[d],c.ibitset(d.id);
		if(b in a.propertiesDict)
			for(e=a.propertiesDict[b],g=0;g<e.length;g++)
				d=e[g],d=a.objects[d],c.ibitset(d.id);
		b in a.synonymsDict&&(d=a.synonymsDict[b],d=a.objects[d],c.ibitset(d.id));
		c.iszero()&&logErrorNoLine("error, didn't find any object called player, either in the objects section, or the legends section. there must be a player!");
return c}

function generateMasks(a){
	a.playerMask=getMaskFromName(a,"player");
	for(var b=[],c=a.collisionLayers.length,d=0;d<c;d++){
		for(var e=new BitVec(STRIDE_OBJ),g=0;g<a.objectCount;g++){
			var h=a.idDict[g],l=a.objects[h];
			l.layer==d&&e.ibitset(l.id)
		}
		b.push(e)
	}
	a.layerMasks=b;
	b={};
	for(h in a.objects)
		a.objects.hasOwnProperty(h)&&(l=a.objects[h],b[h]=new BitVec(STRIDE_OBJ),b[h].ibitset(l.id));
	l=a.legend_synonyms.concat(a.legend_properties);
	l.sort(function(a,b){return a.lineNumber-b.lineNumber});
	for(c=0;c<l.length;c++)
		if(d=l[c],2==d.length)
			b[d[0]]=b[d[1]];
		else{
			e=new BitVec(STRIDE_OBJ);
			for(g=1;g<d.length;g++)
				h=d[g],e.ior(b[h]);
			b[d[0]]=e
		}
	a.objectMasks=b
	}
	
function checkObjectsAreLayered(a){for(var b in a.objects)if(a.objects.hasOwnProperty(b)){for(var c=!1,d=0;d<a.collisionLayers.length;d++){for(var e=a.collisionLayers[d],g=0;g<e.length;g++)if(e[g]===b){c=!0;break}if(c)break}!1===c&&(c=a.objects[b],logError('Object "'+b.toUpperCase()+'" has been defined, but not assigned to a layer.',c.lineNumber))}}

function twiddleMetaData(a){for(var b={},c=0;c<a.metadata.length;c+=2){var d=a.metadata[c+1];b[a.metadata[c]]=d}void 0!==b.flickscreen&&(d=b.flickscreen,c=d.split("x"),c=[parseInt(c[0]),parseInt(c[1])],b.flickscreen=c);void 0!==b.zoomscreen&&(d=b.zoomscreen,c=d.split("x"),c=[parseInt(c[0]),parseInt(c[1])],b.zoomscreen=c);a.metadata=b}

function processWinConditions(a){for(var b=[],c=0;c<a.winconditions.length;c++){var d=a.winconditions[c];if(0==d.length)return;var e=0;switch(d[0]){case "no":e=-1;break;case "all":e=1}var g=d[d.length-1],h=d[1],d=5==d.length?d[3]:"background",l=0,p=0;h in a.objectMasks?l=a.objectMasks[h]:logError('unwelcome term "'+h+'" found in win condition. Win conditions objects have to be objects or properties (defined using "or", in terms of other properties)',g);d in a.objectMasks?p=a.objectMasks[d]:logError('unwelcome term "'+
d+'" found in win condition. Win conditions objects have to be objects or properties (defined using "or", in terms of other properties)',g);b.push([e,l,p,g])}a.winconditions=b}function printCellRow(a){for(var b="[ ",c=0;c<a.length;c++){0<c&&(b+="| ");for(var d=a[c],e=0;e<d.length;e+=2)var g=d[e],h=d[e+1],b="..."===g?b+(g+" "):b+(g+" "+h+" ")}return b+"] "}

function printRule(a){var b="(<a onclick=\"jumpToLine('"+a.lineNumber.toString()+'\');"  href="javascript:void(0);">'+a.lineNumber+"</a>) "+a.direction.toString().toUpperCase()+" ";a.rigid&&(b="RIGID "+b+" ");a.randomRule&&(b="RANDOM "+b+" ");a.late&&(b="LATE "+b+" ");for(var c=0;c<a.lhs.length;c++)var d=a.lhs[c],b=b+printCellRow(d);b+="-> ";for(c=0;c<a.rhs.length;c++)d=a.rhs[c],b+=printCellRow(d);for(c=0;c<a.commands.length;c++)d=a.commands[c],b=1===d.length?b+d[0].toString():b+"("+d[0].toString()+
", "+d[1].toString()+") ";return b}function printRules(a){for(var b="<br>Rule Assembly : ("+a.rules.length+" rules )<br>===========<br>",c=0,d=-1,e=0;e<a.rules.length;e++){var g=a.rules[e];c<a.loops.length&&a.loops[c][0]<g.lineNumber&&(b+="STARTLOOP<br>",c++,c<a.loops.length&&(d=a.loops[c][0],c++));-1!==d&&d<g.lineNumber&&(b+="ENDLOOP<br>",d=-1);b+=printRule(g)+"<br>"}-1!==d&&(b+="ENDLOOP<br>");consolePrint(b+"===========<br>")}

function removeDuplicateRules(a){console.log("rule count before = "+a.rules.length);for(var b={},c=-1,d=a.rules.length-1;0<=d;d--){var e=a.rules[d],g=e.groupNumber;g!==c&&(b={});c=printRule(e);b.hasOwnProperty(c)?a.rules.splice(d,1):b[c]=!0;c=g}console.log("rule count after = "+a.rules.length)}

function generateLoopPoints(a){var b={},c=!0,d=0,e=0;1===a.loops.length%2&&logErrorNoLine("have to have matching number of  'startLoop' and 'endLoop' loop points.");for(var g=0;g<a.loops.length;g++)for(var h=a.loops[g],d=0;d<a.rules.length;d++){var l=a.rules[d],l=l[0],l=l.lineNumber;if(c){if(l>=h[0]){e=d;c=!1;-1===h[1]&&logErrorNoLine("Need have to have matching number of  'startLoop' and 'endLoop' loop points.");break}}else if(l>=h[0]){d-=1;b[d]=e;c=!0;1===h[1]&&logErrorNoLine("Need have to have matching number of  'startLoop' and 'endLoop' loop points.");
break}}!1===c&&(d=a.rules.length,b[d]=e);a.loopPoint=b;b={};c=!0;for(g=0;g<a.loops.length;g++)for(h=a.loops[g],d=0;d<a.lateRules.length;d++)if(l=a.lateRules[d],l=l[0],l=l.lineNumber,c){if(l>=h[0]){e=d;c=!1;-1===h[1]&&logErrorNoLine("Need have to have matching number of  'startLoop' and 'endLoop' loop points.");break}}else if(l>=h[0]){d-=1;b[d]=e;c=!0;1===h[1]&&logErrorNoLine("Need have to have matching number of  'startLoop' and 'endLoop' loop points.");break}!1===c&&(d=a.lateRules.length,b[d]=e);
a.lateLoopPoint=b}var soundEvents="titlescreen startgame cancel endgame startlevel undo restart endlevel showmessage closemessage sfx0 sfx1 sfx2 sfx3 sfx4 sfx5 sfx6 sfx7 sfx8 sfx9 sfx10".split(" "),soundMaskedEvents=["create","destroy","move","cantmove","action"],soundVerbs=soundEvents.concat(soundMaskedEvents);function validSeed(a){return null!==/^\s*\d+\s*$/.exec(a)}

var soundDirectionIndicatorMasks={up:1,down:2,left:4,right:8,horizontal:12,vertical:3,orthogonal:15,___action____:16},soundDirectionIndicators="up down left right horizontal vertical orthogonal ___action____".split(" ");

function generateSoundData(a){for(var b={},c=[],d=[],e=[],g=[],h=0;h<a.sounds.length;h++){var l=a.sounds[h];if(!(1>=l.length)){var p=l[l.length-1];if(2===l.length)logError("incorrect sound declaration.",p);else if(0<=soundEvents.indexOf(l[0])){4<l.length&&logError("too much stuff to define a sound event.",p);var m=l[1];validSeed(m)?(void 0!==b[l[0]]&&logWarning(l[0].toUpperCase()+" already declared.",p),b[l[0]]=l[1]):logError('Expecting sfx data, instead found "'+l[1]+'".',p)}else{var u=l[0].trim(),
A=l[1].trim(),D=l.slice(2,l.length-2);0<D.length&&"move"!==A&&"cantmove"!==A&&logError("incorrect sound declaration.",p);"action"===A&&(A="move",D=["___action____"]);0==D.length&&(D=["orthogonal"]);m=l[l.length-2];u in a.aggregatesDict?logError('cannot assign sound events to aggregate objects (declared with "and"), only to regular objects, or properties, things defined in terms of "or" ("'+u+'").',p):u in a.objectMasks||logError('Object "'+u+'" not found.',p);for(var l=a.objectMasks[u],E=0,J=0;J<
D.length;J++){D[J]=D[J].trim();var C=D[J];-1===soundDirectionIndicators.indexOf(C)?logError('Was expecting a direction, instead found "'+C+'".',p):E|=soundDirectionIndicatorMasks[C]}u=[u];for(J=!0;J;)for(J=!1,D=0;D<u.length;D++)if(C=u[D],C in a.synonymsDict)u[D]=a.synonymsDict[C],J=!0;else if(C in a.propertiesDict){J=!0;C=a.propertiesDict[C];u.splice(D,1);D--;for(var v=0;v<C.length;v++)u.push(C[v])}if("move"===A||"cantmove"===A)for(J=0;J<u.length;J++)D=a.objects[u[J]].layer,C=new BitVec(STRIDE_MOV),
C.ishiftor(E,5*D),D={objectMask:l,directionMask:C,seed:m},"move"===A?e.push(D):g.push(D);validSeed(m)||logError('Expecting sfx data, instead found "'+m+'".',p);switch(A){case "create":D={objectMask:l,seed:m};c.push(D);break;case "destroy":D={objectMask:l,seed:m},d.push(D)}}}}a.sfx_Events=b;a.sfx_CreationMasks=c;a.sfx_DestructionMasks=d;a.sfx_MovementMasks=e;a.sfx_MovementFailureMasks=g}

function formatHomePage(a){a.bgcolor="background_color"in a.metadata?colorToHex(colorPalette,a.metadata.background_color):"#000000";a.fgcolor="text_color"in a.metadata?colorToHex(colorPalette,a.metadata.text_color):"#FFFFFF";!1===isColor(a.fgcolor)&&logError("text_color in incorrect format - found "+a.fgcolor+", but I expect a color name (like 'pink') or hex-formatted color (like '#1412FA').");!1===isColor(a.bgcolor)&&logError("background_color in incorrect format - found "+a.bgcolor+", but I expect a color name (like 'pink') or hex-formatted color (like '#1412FA').");
if(canSetHTMLColors&&("background_color"in a.metadata&&(document.body.style.backgroundColor=a.bgcolor),"text_color"in a.metadata)){var b=document.getElementById("separator");null!=b&&(b.style.color=a.fgcolor);for(var b=document.getElementsByTagName("a"),c=0;c<b.length;c++)b[c].style.color=a.fgcolor;b=document.getElementsByTagName("h1");for(c=0;c<b.length;c++)b[c].style.color=a.fgcolor}"homepage"in a.metadata&&(b=a.metadata.homepage,b=b.replace("http://",""),b=b.replace("https://",""),a.metadata.homepage=
b)}var MAX_ERRORS=5;

function loadFile(a){window.console.log("loadFile");var b=new codeMirrorFn,c=b.startState();a=a.split("\n");for(var d=0;d<a.length;d++){var e=a[d];c.lineNumber=d+1;e=new CodeMirror.StringStream(e,4);do if(b.token(e,c),errorCount>MAX_ERRORS){consolePrint("too many errors, aborting compilation");return}while(!1===e.eol())}delete c.lineNumber;generateExtraMembers(c);generateMasks(c);levelsToArray(c);rulesToArray(c);removeDuplicateRules(c);debugMode&&printRules(c);rulesToMask(c);arrangeRulesByGroupNumber(c);collapseRules(c.rules);
collapseRules(c.lateRules);checkNoLateRulesHaveMoves(c);generateRigidGroupList(c);processWinConditions(c);checkObjectsAreLayered(c);twiddleMetaData(c);generateLoopPoints(c);generateSoundData(c);formatHomePage(c);delete c.commentLevel;delete c.names;delete c.abbrevNames;delete c.objects_candname;delete c.objects_section;delete c.objects_spritematrix;delete c.section;delete c.subsection;delete c.tokenIndex;delete c.visitedSections;delete c.loops;return c}

var ifrm;

function compile(a,b,c){
	matchCache={};
	forceRegenImages=!0;
	void 0===a&&(a=["restart"]);
	void 0===c&&(c=null);
	lastDownTarget=canvas;
	void 0===b&&(b=window.form1.code.editorreference.getValue()+"\n");
	!0===canDump&&(compiledText=b);
	errorCount=0;compiling=!0;errorStrings=[];
	consolePrint("=================================");
	try{var d=loadFile(b)}
	finally{compiling=!1}
	if(!(errorCount>MAX_ERRORS)){
		if(0<errorCount)
			consoleError('<span class="systemMessage">Errors detected during compilation, the game may not work correctly.</span>');
		else{
			for(var e=b=0;e<d.rules.length;e++)
				b+=d.rules[e].length;
			for(e=0;e<d.lateRules.length;e++)
				b+=d.lateRules[e].length;
			"restart"==a[0]?consolePrint('<span class="systemMessage">Successful Compilation, generated '+b+" instructions.</span>"):consolePrint('<span class="systemMessage">Successful live recompilation, generated '+b+" instructions.</span>")
		}
		setGameState(d,a,c);
		clearInputHistory();
		consoleCacheDump()
	}
}
	
function qualifyURL(a){var b=document.createElement("a");b.href=a;return b.href};var keyRepeatTimer=0,keyRepeatIndex=0,input_throttle_timer=0,lastinput=-100,dragging=!1,rightdragging=!1,columnAdded=!1;

function selectText(a,b){b=b||window.event;var c=document.getElementById(a);if(b&&(b.ctrlKey||b.metaKey))c=["console"].concat(c.innerHTML.split("<br>")),c=levelFromString(state,c),loadLevelFromLevelDat(state,c,null),canvasResize();else if(document.selection){var d=document.body.createTextRange();d.moveToElementText(c);d.select()}else window.getSelection&&(d=document.createRange(),d.selectNode(c),window.getSelection().addRange(d))}function recalcLevelBounds(){}

function arrCopy(a,b,c,d,e){for(;e--;)c[d++]=a[b]++}function adjustLevel(a,b,c){backups.push(backupLevel());var d=a.clone();a.width+=b;a.height+=c;a.n_tiles=a.width*a.height;a.objects=new Int32Array(a.n_tiles*STRIDE_OBJ);b=new BitVec(STRIDE_OBJ);b.ibitset(state.backgroundid);for(c=0;c<a.n_tiles;++c)a.setCell(c,b);a.movements=new Int32Array(a.objects.length);columnAdded=!0;RebuildLevelArrays();return d}

function addLeftColumn(){for(var a=adjustLevel(level,1,0),b=1;b<level.width;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d-level.height))}}function addRightColumn(){for(var a=adjustLevel(level,1,0),b=0;b<level.width-1;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d))}}

function addTopRow(){for(var a=adjustLevel(level,0,1),b=0;b<level.width;++b)for(var c=1;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d-b-1))}}function addBottomRow(){for(var a=adjustLevel(level,0,1),b=0;b<level.width;++b)for(var c=0;c<level.height-1;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d-b))}}

function removeLeftColumn(){if(!(1>=level.width))for(var a=adjustLevel(level,-1,0),b=0;b<level.width;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d+level.height))}}function removeRightColumn(){if(!(1>=level.width))for(var a=adjustLevel(level,-1,0),b=0;b<level.width;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d))}}

function removeTopRow(){if(!(1>=level.height))for(var a=adjustLevel(level,0,-1),b=0;b<level.width;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d+b+1))}}function removeBottomRow(){if(!(1>=level.height))for(var a=adjustLevel(level,0,-1),b=0;b<level.width;++b)for(var c=0;c<level.height;++c){var d=b*level.height+c;level.setCell(d,a.getCell(d+b))}}

function matchGlyph(a,b){for(var c=-1,d,e=0;e<b.length;++e){var g=b[e][0],h=b[e][1],l=b[e][2];if(h.bitsSetInArray(a.data)){for(var p=0,m=0;m<32*STRIDE_OBJ;++m)l.get(m)&&a.get(m)&&p++,h.get(m)&&a.get(m)&&p++;p>c&&(c=p,d=g)}}if(0<c)return d;logErrorNoLine("Wasn't able to approximate a glyph value for some tiles, using '.' as a placeholder.",!0);return"."}var htmlEntityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;"},selectableint=0;

function printLevel(){var a=[],b;for(b in state.glyphDict)if(state.glyphDict.hasOwnProperty(b)&&1===b.length){for(var c=state.glyphDict[b],d=new BitVec(STRIDE_OBJ),e=0;e<c.length;e++){var g=c[e];0<=g&&d.ibitset(g)}e=d.clone();d.iclear(state.layerMasks[state.backgroundlayer]);a.push([b,d,e])}selectableint++;e="selectable"+selectableint;b='Printing level contents:<br><br><span id="'+e+'" onclick="selectText(\''+e+"',event)\">";cache_console_messages=!1;for(d=0;d<level.height;d++){for(e=0;e<level.width;e++)c=
level.getCell(d+e*level.height),c=matchGlyph(c,a),c in htmlEntityMap&&(c=htmlEntityMap[c]),b+=c;d<level.height-1&&(b+="<br>")}consolePrint(b+"</span><br><br>",!0)}

function levelEditorClick(a,b){if(-2>=mouseCoordY){var c=mouseCoordX+(screenwidth-1)*(editorRowCount-(-mouseCoordY-2)-1);-1===mouseCoordX?printLevel():0<=mouseCoordX&&c<glyphImages.length&&(glyphSelectedIndex=c,redraw())}else if(-1<mouseCoordX&&-1<mouseCoordY&&mouseCoordX<screenwidth-2&&mouseCoordY<screenheight-2-editorRowCount){for(var d=state.glyphDict[glyphImagesCorrespondance[glyphSelectedIndex]],c=new BitVec(STRIDE_OBJ),e=0;e<d.length;e++){var g=d[e];0<=g&&c.ibitset(g)}c.bitsClearInArray(state.layerMasks[state.backgroundlayer].data)&&
c.ibitset(state.backgroundid);d=mouseCoordY+mouseCoordX*level.height;level.getCell(d).equals(c)||(!1===anyEditsSinceMouseDown&&(anyEditsSinceMouseDown=!0,backups.push(backupLevel())),level.setCell(d,c),redraw())}else b&&(-1===mouseCoordX?(addLeftColumn(),canvasResize()):mouseCoordX===screenwidth-2&&(addRightColumn(),canvasResize()),-1===mouseCoordY?(addTopRow(),canvasResize()):mouseCoordY===screenheight-2-editorRowCount&&(addBottomRow(),canvasResize()))}

function levelEditorRightClick(a,b){if(-2===mouseCoordY)mouseCoordX<=glyphImages.length&&(glyphSelectedIndex=mouseCoordX,redraw());else if(-1<mouseCoordX&&-1<mouseCoordY&&mouseCoordX<screenwidth-2&&mouseCoordY<screenheight-2-editorRowCount){var c=mouseCoordY+mouseCoordX*level.height,d=new BitVec(STRIDE_OBJ);d.ibitset(state.backgroundid);level.setCell(c,d);redraw()}else b&&(-1===mouseCoordX?(removeLeftColumn(),canvasResize()):mouseCoordX===screenwidth-2&&(removeRightColumn(),canvasResize()),-1===mouseCoordY?
(removeTopRow(),canvasResize()):mouseCoordY===screenheight-2-editorRowCount&&(removeBottomRow(),canvasResize()))}var anyEditsSinceMouseDown=!1;

function onMouseDown(a){
if(0===a.button&&!a.ctrlKey&&!a.metaKey){lastDownTarget=a.target;keybuffer=[];if(a.target===canvas&&(setMouseCoord(a),dragging=!0,rightdragging=!1,levelEditorOpened))return anyEditsSinceMouseDown=!1,levelEditorClick(a,!0);rightdragging=dragging=!1}else if((2===a.button||0===a.button&&(a.ctrlKey||a.metaKey))&&"gameCanvas"===a.target.id&&(dragging=!1,rightdragging=!0,levelEditorOpened))return levelEditorRightClick(a,!0)}

function rightClickCanvas(a){return prevent(a)}

function onMouseUp(a){rightdragging=dragging=!1}

function onKeyDown(a){
	a=a||window.event;
	if((a.target)&&["INPUT","TEXTAREA","DIV"].indexOf(a.target.tagName)>0){return;}//Escape unrelated keypresses
	!IDE&&-1<[32,37,38,39,40].indexOf(a.keyCode)&&prevent(a);
	0<=keybuffer.indexOf(a.keyCode)||((lastDownTarget===canvas||window.Mobile&&lastDownTarget===window.Mobile.focusIndicator)&&-1===keybuffer.indexOf(a.keyCode)&&(keybuffer.splice(keyRepeatIndex,0,a.keyCode),keyRepeatTimer=0,checkKey(a,!0)),!0===canDump&&(74===a.keyCode&&(a.ctrlKey||a.metaKey)?(dumpTestCase(),prevent(a)):75===a.keyCode&&(a.ctrlKey||a.metaKey)&&(makeGIF(),prevent(a))))
}

function relMouseCoords(a){var b=0,c=0,d=0,e=0,d=this;do b+=d.offsetLeft-d.scrollLeft,c+=d.offsetTop-d.scrollTop;while(d=d.offsetParent);d=a.pageX-b;e=a.pageY-c;return{x:d,y:e}}HTMLCanvasElement.prototype.relMouseCoords=relMouseCoords;function onKeyUp(a){a=a||window.event;a=keybuffer.indexOf(a.keyCode);0<=a&&(keybuffer.splice(a,1),keyRepeatIndex>=a&&keyRepeatIndex--)}function onMyFocus(a){keybuffer=[];keyRepeatTimer=keyRepeatIndex=0}

function onMyBlur(a){keybuffer=[];keyRepeatTimer=keyRepeatIndex=0}var mouseCoordX=0,mouseCoordY=0;function setMouseCoord(a){a=canvas.relMouseCoords(a);mouseCoordX=a.x-xoffset;mouseCoordY=a.y-yoffset;mouseCoordX=Math.floor(mouseCoordX/cellwidth);mouseCoordY=Math.floor(mouseCoordY/cellheight)}

function mouseMove(a){levelEditorOpened&&(setMouseCoord(a),dragging?levelEditorClick(a,!1):rightdragging&&levelEditorRightClick(a,!1),redraw())}

function mouseOut(){}

document.addEventListener("mousedown",onMouseDown,!1);
document.addEventListener("mouseup",onMouseUp,!1);
document.addEventListener("keydown",onKeyDown,!1);
document.addEventListener("keyup",onKeyUp,!1);
window.addEventListener("focus",onMyFocus,!1);
window.addEventListener("blur",onMyBlur,!1);

function prevent(a){a.preventDefault&&a.preventDefault();a.stopImmediatePropagation&&a.stopImmediatePropagation();a.stopPropagation&&a.stopPropagation();return a.returnValue=!1}



function checkKey(a,b){
	if(!winning){
		var c=-1;
		var fdb=true;//F
		switch(a.keyCode){
			case 65:case 37:c=1;RegisterMove(c);break;
			case 38:case 87:c=0;RegisterMove(c);break;
			case 68:case 39:c=3;RegisterMove(c);break;
			case 83:case 40:c=2;RegisterMove(c);break;
			case 13:case 32:case 67:case 88:if(!1===norepeat_action||b)c=4,RegisterMove(c);else return;break;
			case 85:case 90:if(!1===textMode)return RegisterMove(85),pushInput("undo"),DoUndo(!1,!0),canvasResize(),prevent(a);break;
			case 82:if(!1===textMode&&b)return RegisterMove(82),pushInput("restart"),DoRestart(),canvasResize(),prevent(a);break;
			case 27:if(!1===titleScreen)return RegisterMove(27),goToTitleScreen(),tryPlayTitleSound(),canvasResize(),prevent(a);break;
			case 69:if(canOpenEditor)return b&&(levelEditorOpened=!levelEditorOpened,!1===levelEditorOpened&&printLevel(),restartTarget=backupLevel(),canvasResize()),prevent(a);break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:if(levelEditorOpened&&b)return c=9,49<=a.keyCode&&(c=a.keyCode-49),c<glyphImages.length?glyphSelectedIndex=c:consolePrint("Trying to select tile outside of range in level editor.",!0),canvasResize(),prevent(a);break	
			case 70:RequestGameFeedback();//F is for Feedback!
			default:fdb=false;//F
		}
		if(fdb)UnRequestGameFeedback();//F
		if(throttle_movement&&0<=c&&3>=c){
			if(lastinput==c&&input_throttle_timer<repeatinterval){
				UnRegisterMove();return;}
			lastinput=c;
			input_throttle_timer=0
		}
		if(textMode){
			if(0!==state.levels.length)
				if(titleScreen)
					if(0===titleMode)
						4===c&&b&&!1===titleSelected&&(tryPlayStartGameSound(),titleSelected=!0,messageselected=!1,timer=0,quittingTitleScreen=!0,generateTitleScreen(),canvasResize());
					else if(4==c&&b)!1===titleSelected&&(tryPlayStartGameSound(),titleSelected=!0,messageselected=!1,timer=0,quittingTitleScreen=!0,generateTitleScreen(),redraw());else{if(0===c||2===c)titleSelection=0===c?0:1,generateTitleScreen(),redraw()}else 4==c&&b&&(unitTesting?nextLevel():!1===messageselected&&(messageselected=!0,timer=0,quittingMessageScreen=!0,tryPlayCloseMessageSound(),titleScreen=!1,drawMessageScreen()))}else if(!againing&&0<=c)return 4===c&&"noaction"in state.metadata||(pushInput(c),processInput(c)&&redraw()),prevent(a)
}}
			

			
			
			
			
function update(){
	timer+=deltatime;
	input_throttle_timer+=deltatime;
	quittingTitleScreen&&0.3<timer/1E3&&(quittingTitleScreen=!1,nextLevel());
	againing&&timer>againinterval&&0==messagetext.length&&processInput(-1)&&(redraw(),autotick=keyRepeatTimer=0);
	quittingMessageScreen&&0.15<timer/1E3&&(quittingMessageScreen=!1,""===messagetext?nextLevel():(messagetext="",titleScreen=textMode=!1,titleMode=0<curlevel||null!==curlevelTarget?1:0,titleSelected=!1,titleSelection=0,canvasResize(),checkWin()));
	winning&&0.5<timer/1E3&&(winning=!1,nextLevel());
	if(0<keybuffer.length){
		keyRepeatTimer+=deltatime;
		var a=throttle_movement?repeatinterval:repeatinterval/Math.sqrt(keybuffer.length);
		keyRepeatTimer>a&&(keyRepeatTimer=0,keyRepeatIndex=(keyRepeatIndex+1)%keybuffer.length,checkKey({keyCode:keybuffer[keyRepeatIndex]},!1))
	}
	0<autotickinterval&&!(textMode||levelEditorOpened||againing||winning)&&(autotick+=deltatime,autotick>autotickinterval&&(autotick=0,pushInput("tick"),processInput(-1)&&redraw()))
	}

setInterval(function(){update()},deltatime);




window.Mobile={};Mobile.hasTouch=function(){var a;if("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch)a=!0;return a};Mobile.enable=function(a){if(a||Mobile.hasTouch()&&!Mobile._instance)Mobile._instance=new Mobile.GestureHandler,Mobile._instance.bindEvents(),Mobile._instance.bootstrap();return Mobile._instance};

window.Mobile.GestureHandler=function(){this.initialize.apply(this,arguments)};

Mobile.log=function(a){document.getElementsByTagName("h1")[0].innerHTML=""+Math.random().toString().substring(4,1)+"-"+a};
Mobile.debugDot=function(a){var b;b="border-radius: 50px;width: 5px;height: 5px;background: red;position: absolute;left: "+a.touches[0].clientX+"px;top: "+a.touches[0].clientY+"px;";a=document.createElement("div");a.setAttribute("style",b);document.getElementsByTagName("body")[0].appendChild(a)};


(function(a){var b={action:88,left:37,right:39,up:38,down:40,undo:85,restart:82,quit:27};a.initialize=function(){this.firstPos={x:0,y:0};this.setTabAnimationRatio=this.setTabAnimationRatio.bind(this);this.setMenuAnimationRatio=this.setMenuAnimationRatio.bind(this);this.repeatTick=this.repeatTick.bind(this);this.isFocused=!0};a.setFocusElement=function(a){this.focusElement=a;this.isFocused=!1;this.buildFocusIndicator()};a.bindEvents=function(){window.addEventListener("touchstart",this.onTouchStart.bind(this));
window.addEventListener("touchend",this.onTouchEnd.bind(this));window.addEventListener("touchmove",this.onTouchMove.bind(this))};a.bootstrap=function(){this.showTab();this.isAudioSupported()||this.disableAudio();this.disableSelection()};a.onTouchStart=function(a){this.isTouching||(this.handleFocusChange(a),this.isFocused&&"A"!==a.target.tagName.toUpperCase()&&(this.mayBeSwiping=this.isTouching=!0,this.gestured=!1,this.swipeDirection=void 0,this.swipeDistance=0,this.startTime=(new Date).getTime(),
this.firstPos.x=a.touches[0].clientX,this.firstPos.y=a.touches[0].clientY))};a.onTouchEnd=function(a){this.isFocused&&this.isTouching&&(this.gestured||0===a.touches.length&&this.handleTap(),0===a.touches.length&&(this.isTouching=!1,this.endRepeatWatcher()))};a.onTouchMove=function(a){if(this.isFocused)return this.isSuccessfulSwipe()?(this.handleSwipe(this.swipeDirection,this.touchCount),this.gestured=!0,this.mayBeSwiping=!1,this.beginRepeatWatcher(a)):this.mayBeSwiping?this.swipeStep(a):this.isRepeating&&
this.repeatStep(a),prevent(a),!1};a.handleFocusChange=function(a){this.focusElement&&(this.isFocused=this.isTouchInsideFocusElement(a),this.setFocusIndicatorVisibility(this.isFocused))};a.isTouchInsideFocusElement=function(a){var b;if(!a.touches||!a.touches[0])return!1;b=this.absoluteElementPosition(this.focusElement);return a.touches[0].clientX<b.left||a.touches[0].clientY<b.top||a.touches[0].clientX>b.left+this.focusElement.clientWidth||a.touches[0].clientY>b.top+this.focusElement.clientHeight?
!1:!0};a.setFocusIndicatorVisibility=function(a){var b;b="visible";a||(b="hidden");this.focusIndicator.setAttribute("style","visibility: "+b+";")};a.absoluteElementPosition=function(a){var b,e;b={top:a.offsetTop||0,left:a.offsetLeft||0};e=document.getElementsByTagName("body")[0];for(b.top-=e.scrollTop||0;;){a=a.offsetParent;if(!a)break;b.top+=a.offsetTop||0;b.left+=a.offsetLeft||0}return b};a.beginRepeatWatcher=function(a){var b;if(!this.repeatInterval){this.isRepeating=!0;b=1E3*state.metadata.key_repeat_interval;
if(isNaN(b)||!b)b=150;this.repeatInterval=setInterval(this.repeatTick,b);this.recenter(a)}};a.endRepeatWatcher=function(){this.repeatInterval&&(clearInterval(this.repeatInterval),delete this.repeatInterval,this.isRepeating=!1)};a.repeatTick=function(){this.isTouching&&this.handleSwipe(this.direction,this.touchCount)};a.recenter=function(a){this.firstPos.x=a.touches[0].clientX;this.firstPos.y=a.touches[0].clientY};a.isSuccessfulSwipe=function(){var a;this.mayBeSwiping&&void 0!==this.swipeDirection&&
50<=this.swipeDistance&&(a=!0);return a};a.swipeStep=function(a){var b,e;this.mayBeSwiping&&((b={x:a.touches[0].clientX,y:a.touches[0].clientY},e=(new Date).getTime(),a=a.touches.length,this.swipeDistance=this.cardinalDistance(this.firstPos,b),this.swipeDirection)?1E3<e-this.startTime&&(this.mayBeSwiping=!1):10<this.swipeDistance&&(this.swipeDirection=this.dominantDirection(this.firstPos,b),this.touchCount=a))};a.repeatStep=function(a){var b;b={x:a.touches[0].clientX,y:a.touches[0].clientY};50<=this.cardinalDistance(this.firstPos,
b)&&(this.swipeDirection=this.dominantDirection(this.firstPos,b),this.recenter(a))};a.cardinalDistance=function(a,b){var e,g;e=Math.abs(a.x-b.x);g=Math.abs(a.y-b.y);return Math.max(e,g)};a.dominantDirection=function(a,b){var e,g,h;e=b.x-a.x;g=b.y-a.y;h="x";Math.abs(g)>Math.abs(e)&&(h="y");return"x"===h?0<e?"right":"left":0<g?"down":"up"};a.handleSwipe=function(a,b){1===b?this.emitKeydown(this.swipeDirection):1<b&&this.toggleMenu()};a.handleTap=function(){this.emitKeydown("action")};a.emitKeydown=
function(a){a={keyCode:b[a]};this.fakeCanvasFocus();onKeyDown(a);onKeyUp(a)};a.fakeCanvasFocus=function(){var a;a=document.getElementById("gameCanvas");onMouseDown({button:0,target:a})};a.toggleMenu=function(){this.isMenuVisible?this.hideMenu():this.showMenu()};a.showMenu=function(){this.menuElem||this.buildMenu();this.getAnimatables().menu.animateUp();this.isMenuVisible=!0;this.hideTab()};a.hideMenu=function(){this.menuElem&&this.getAnimatables().menu.animateDown();this.isMenuVisible=!1;this.showTab()};
a.getAnimatables=function(){this._animatables||(this._animatables={tab:Animatable("tab",0.1,this.setTabAnimationRatio),menu:Animatable("menu",0.1,this.setMenuAnimationRatio)});return this._animatables};a.showTab=function(){this.tabElem||this.buildTab();this.getAnimatables().tab.animateDown()};a.hideTab=function(){this.tabElem&&this.tabElem.setAttribute("style","display: none;");this.getAnimatables().tab.animateUp()};a.buildTab=function(){var a=this,b,e;b=document.createElement("div");b.innerHTML=
'<div class="tab">\n  <div class="tab-affordance"></div>\n  <div class="tab-icon">\n    <div class="slice"></div>\n    <div class="slice"></div>\n  </div>\n</div>';e=b.children[0];b=function(b){b.stopPropagation();a.showMenu()};this.tabAffordance=e.getElementsByClassName("tab-affordance")[0];this.tabElem=e.getElementsByClassName("tab-icon")[0];this.tabAffordance.addEventListener("touchstart",b);this.tabElem.addEventListener("touchstart",b);document.getElementsByTagName("body")[0].appendChild(e)};
a.buildMenu=function(){var a=this,b,e;b=document.createElement("div");b.innerHTML=this.buildMenuString(state);this.menuElem=b.children[0];this.closeElem=this.menuElem.getElementsByClassName("close")[0];e=function(b){b.stopPropagation();a.hideMenu()};this.closeAffordance=this.menuElem.getElementsByClassName("close-affordance")[0];b=this.menuElem.getElementsByClassName("close")[0];this.closeAffordance.addEventListener("touchstart",e);b.addEventListener("touchstart",e);(b=this.menuElem.getElementsByClassName("undo")[0])&&
b.addEventListener("touchstart",function(b){b.stopPropagation();a.emitKeydown("undo")});(b=this.menuElem.getElementsByClassName("restart")[0])&&b.addEventListener("touchstart",function(b){b.stopPropagation();a.emitKeydown("restart")});this.menuElem.getElementsByClassName("quit")[0].addEventListener("touchstart",function(b){b.stopPropagation();a.emitKeydown("quit")});document.getElementsByTagName("body")[0].appendChild(this.menuElem)};a.buildMenuString=function(a){var b,e;e=a.metadata.noundo;a=a.metadata.norestart;
b=3;e&&(b-=1);a&&(b-=1);b=['<div class="mobile-menu item-count-'+b+'">','  <div class="close-affordance"></div>','  <div class="close">','    <div class="slice"></div>','    <div class="slice"></div>',"  </div>"];e||b.push('  <div class="undo button">Undo</div>');a||b.push('  <div class="restart button">Restart</div>');b=b.concat(['  <div class="quit button">Quit to Menu</div>','  <div class="clear"></div>',"</div>"]);return b.join("\n")};a.buildFocusIndicator=function(){this.focusIndicator=document.createElement("DIV");
this.focusIndicator.setAttribute("class","tapFocusIndicator");this.focusIndicator.setAttribute("style","visibility: hidden;");this.focusElement.parentNode.appendChild(this.focusIndicator)};a.setTabAnimationRatio=function(a){a=Math.round(1E3*a)/1E3;0.999<=a?this.tabAffordance.setAttribute("style","display: none;"):this.tabAffordance.setAttribute("style","display: block;");this.tabElem.setAttribute("style","opacity: "+(1-a)+"; width: "+(66*a+18*(1-a))+"px;")};a.setMenuAnimationRatio=function(a){var b;
a=Math.round(1E3*a)/1E3;0.001>=a?this.closeAffordance.setAttribute("style","display: none;"):this.closeAffordance.setAttribute("style","display: block;");b=-18*a+-66*(1-a);a="opacity: "+a+";";this.closeElem.setAttribute("style","left: "+(b-4)+"px; "+a+" width: "+-b+"px;");this.menuElem.setAttribute("style",a)};a.disableAudio=function(){window.playSeed=function(){}};a.isAudioSupported=function(){var a=!0;"undefined"!==typeof webkitAudioContext&&(a=!1);return a};a.disableSelection=function(){var a;
a=document.getElementsByTagName("body")[0];a.setAttribute("class",a.getAttribute("class")+" disable-select")}})(window.Mobile.GestureHandler.prototype);window.Animator=function(){this.initialize.apply(this,arguments)};

(function(a){a.initialize=function(){this._animations={};this.tick=this.tick.bind(this)};a.animate=function(a,c){this._animations[a]=c;this.wakeup()};a.wakeup=function(){this._isAnimating||(this._isAnimating=!0,this.tick())};a.tick=function(){var a,c,d,e;e=[];d=!0;for(a in this._animations){if(!this._animations.hasOwnProperty(a))return;(c=this._animations[a]())?e.push(a):d=!1}if(d){for(;0<e.length;e++)delete this._isAnimating[e[0]];this._isAnimating=!1}else requestAnimationFrame(this.tick)}})(window.Animator.prototype);


window.Animator.getInstance=function(){window.Animator._instance||(window.Animator._instance=new window.Animator);return window.Animator._instance};

function Animatable(a,b,c){function d(){var a;g+=b;1<=g&&(a=!0,g=1);c(g);return a}function e(){var a;g-=b;0>=g&&(a=!0,g=0);c(g);return a}var g;g=0;return{animateUp:function(){Animator.getInstance().animate(a,d)},animateDown:function(){Animator.getInstance().animate(a,e)}}}

(function(){var a=["ms","moz","webkit","o"],b,c;for(b=0;b<a.length&&!window.requestAnimationFrame;b++)window.requestAnimationFrame=window[a[b]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[a[b]+"CancelAnimationFrame"],window.cancelAnimationFrame||(window.cancelAnimationFrame=window[a[b]+"CancelRequestAnimationFrame"]);window.requestAnimationFrame||(c=0,window.requestAnimationFrame=function(a,b){var g,h,l;g=(new Date).getTime();h=Math.max(0,16-(g-c));l=window.setTimeout(function(){a(g+
h)},h);c=g+h;return l});

window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})})();




/*
 * Add gesture support for mobile devices.
 */

window.Mobile = {};

//stolen from https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
Mobile.hasTouch = function() {
    var bool;
    if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)     {
      bool = true;
    } else {
      /*
      //don't know what's happening with this, so commented it out
      var query = ['@media (',prefixes.join('touch-enabled),    ('),'heartz',')','{#modernizr{top:9px;position:absolute}}'].join('');
      testStyles(query, function( node ) {
        bool = node.offsetTop === 9;
      });*/
    }
    return bool;
}

Mobile.enable = function (force) {
    if (force || Mobile.hasTouch() && !Mobile._instance) {
        Mobile._instance = new Mobile.GestureHandler();
        Mobile._instance.bindEvents();
        Mobile._instance.bootstrap();
    }
    return Mobile._instance;
};

window.Mobile.GestureHandler = function () {
    this.initialize.apply(this, arguments);
};

Mobile.log = function (message) {
    var h1;
    h1 = document.getElementsByTagName('h1')[0];
    h1.innerHTML = "" + Math.random().toString().substring(4, 1) + "-" + message;
};

Mobile.debugDot = function (event) {
    var dot, body, style

    style = 'border-radius: 50px;' +
        'width: 5px;' +
        'height: 5px;' +
        'background: red;' +
        'position: absolute;' +
        'left: ' + event.touches[0].clientX + 'px;' +
        'top: ' + event.touches[0].clientY + 'px;';
    dot = document.createElement('div');
    dot.setAttribute('style', style);
    body = document.getElementsByTagName('body')[0];
    body.appendChild(dot);
};

(function (proto) {
    'use strict';

    // Minimum range to begin looking at the swipe direction, in pixels
    var SWIPE_THRESHOLD = 10;
    // Distance in pixels required to complete a swipe gesture.
    var SWIPE_DISTANCE = 50;
    // Time in milliseconds to complete the gesture.
    var SWIPE_TIMEOUT = 1000;
    // Time in milliseconds to repeat a motion if still holding down,
    // ... and not specified in state.metadata.key_repeat_interval.
    var DEFAULT_REPEAT_INTERVAL = 150;

    // Lookup table mapping action to keyCode.
    var CODE = {
        action:  88, // x
        left:    37, // left arrow
        right:   39, // right arrow
        up:      38, // up arrow
        down:    40, // down arrow
        undo:    85, // u
        restart: 82, // r
        quit:    27, //  escape
        feedback:70 //  f
    }

    var TAB_STRING = [
        '<div class="tab">',
        '  <div class="tab-affordance"></div>',
        '  <div class="tab-icon">',
        '    <div class="slice"></div>',
        '    <div class="slice"></div>',
        '  </div>',
        '</div>'
    ].join("\n");

    /** Bootstrap Methods **/

    proto.initialize = function () {
        this.firstPos = { x: 0, y: 0 };
        this.setTabAnimationRatio = this.setTabAnimationRatio.bind(this);
        this.setMenuAnimationRatio = this.setMenuAnimationRatio.bind(this);
        this.repeatTick = this.repeatTick.bind(this);
        this.isFocused = true;
    };

    // assign the element that will allow tapping to toggle focus.
    proto.setFocusElement = function (focusElement) {
        this.focusElement = focusElement;
        this.isFocused = false;
        this.buildFocusIndicator();
    };

    proto.bindEvents = function () {
        window.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
		document.getElementById('puzzlescript-game').addEventListener('touchmove', function(e){e.preventDefault()}); //PEDROPSI prevent scroll fix 
    };

    proto.bootstrap = function () {
        this.showTab();
        if (!this.isAudioSupported()) {
            this.disableAudio();
        }
        this.disableSelection();
    };

    /** Event Handlers **/

    proto.onTouchStart = function (event) {
        if (this.isTouching) {
            return;
        }

        // Handle focus changes used in editor.
        this.handleFocusChange(event);
        if (!this.isFocused) {
            return;
        }

        if (event.target.tagName.toUpperCase() === 'A') {
            return;
        }
        this.isTouching = true;

        this.mayBeSwiping = true;
        this.gestured = false;

        this.swipeDirection = undefined;
        this.swipeDistance = 0;
        this.startTime = new Date().getTime();

        this.firstPos.x = event.touches[0].clientX;
        this.firstPos.y = event.touches[0].clientY;
    };

    proto.onTouchEnd = function (event) {
        if (!this.isFocused) {
            return;
        }
        if (!this.isTouching) {
            // If we're here, the menu event handlers had probably
            // canceled the touchstart event.
            return;
        }
        if (!this.gestured) {
            if (event.touches.length === 0) {
                this.handleTap();
            }
        }

        // The last finger to be removed from the screen lets us know
        // we aren't tracking anything.
        if (event.touches.length === 0) {
            this.isTouching = false;
            this.endRepeatWatcher();
        }
    };

    proto.onTouchMove = function (event) {
        if (!this.isFocused) {
            return;
        }
        if (this.isSuccessfulSwipe()) {
            this.handleSwipe(this.swipeDirection, this.touchCount);
            this.gestured = true;
            this.mayBeSwiping = false;
            this.beginRepeatWatcher(event);
        } else if (this.mayBeSwiping) {
            this.swipeStep(event);
        } else if (this.isRepeating) {
            this.repeatStep(event);
        }

        prevent(event);
        return false;
    };

    proto.handleFocusChange = function (event) {
        if (!this.focusElement) {
            return;
        }

        this.isFocused = this.isTouchInsideFocusElement(event);
        this.setFocusIndicatorVisibility(this.isFocused);
    };

    proto.isTouchInsideFocusElement = function (event) {
        var canvasPosition;

        if (!event.touches || !event.touches[0]) {
            return false;
        }
        canvasPosition = this.absoluteElementPosition(this.focusElement);

        if (event.touches[0].clientX < canvasPosition.left ||
            event.touches[0].clientY < canvasPosition.top) {
            return false;
        }

        if (event.touches[0].clientX > canvasPosition.left + this.focusElement.clientWidth ||
            event.touches[0].clientY > canvasPosition.top + this.focusElement.clientHeight) {
            return false;
        }

        return true;
    };

    proto.setFocusIndicatorVisibility = function (isVisible) {
        var visibility;

        visibility = 'visible';
        if (!isVisible) {
            visibility = 'hidden';
        }
        this.focusIndicator.setAttribute('style', 'visibility: ' + visibility + ';');
    };

    proto.absoluteElementPosition = function (element) {
        var position, body;

        position = {
            top: element.offsetTop || 0,
            left: element.offsetLeft || 0
        };
        body = document.getElementsByTagName('body')[0];
        position.top -= body.scrollTop || 0;

        while (true) {
            element = element.offsetParent;
            if (!element) {
                break;
            }
            position.top += element.offsetTop || 0;
            position.left += element.offsetLeft || 0;
        }

        return position;
    };

    proto.beginRepeatWatcher = function (event) {
        var repeatIntervalMilliseconds;
        if (this.repeatInterval) {
            return;
        }
        this.isRepeating = true;
        repeatIntervalMilliseconds = state.metadata.key_repeat_interval * 1000;
        if (isNaN(repeatIntervalMilliseconds) || !repeatIntervalMilliseconds) {
            repeatIntervalMilliseconds = DEFAULT_REPEAT_INTERVAL;
        }
        this.repeatInterval = setInterval(this.repeatTick, repeatIntervalMilliseconds);
        this.recenter(event);
    };

    proto.endRepeatWatcher = function () {
        if (this.repeatInterval) {
            clearInterval(this.repeatInterval);
            delete this.repeatInterval;
            this.isRepeating = false;
        }
    };

    proto.repeatTick = function () {
        if (this.isTouching) {
            this.handleSwipe(this.direction, this.touchCount);
        }
    };

    // Capture the location to consider the gamepad center.
    proto.recenter = function (event) {
        this.firstPos.x = event.touches[0].clientX;
        this.firstPos.y = event.touches[0].clientY;
    }

    /** Detection Helper Methods **/

    proto.isSuccessfulSwipe = function () {
        var isSuccessful;

        if (this.mayBeSwiping &&
            this.swipeDirection !== undefined &&
            this.swipeDistance >= SWIPE_DISTANCE) {
            isSuccessful = true;
        }

        return isSuccessful;
    };

    // Examine the current state to see what direction they're swiping and
    // if the gesture can still be considered a swipe.
    proto.swipeStep = function (event) {
        var currentPos, distance, currentTime;
        var touchCount;

        if (!this.mayBeSwiping) {
            return;
        }

        currentPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        currentTime = new Date().getTime();
        touchCount = event.touches.length;

        this.swipeDistance = this.cardinalDistance(this.firstPos, currentPos);
        if (!this.swipeDirection) {
            if (this.swipeDistance > SWIPE_THRESHOLD) {
                // We've swiped far enough to decide what direction we're swiping in.
                this.swipeDirection = this.dominantDirection(this.firstPos, currentPos);
                this.touchCount = touchCount;
            }
        } else if (distance < SWIPE_DISTANCE) {
            // Now that they've committed to the swipe, look for misfires...

            direction = this.dominantDirection(this.firstPos, currentPos);
            // Cancel the swipe if the direction changes.
            if (direction !== this.swipeDirection) {
                this.mayBeSwiping = false;
            }
            // If they're changing touch count at this point, it's a misfire.
            if (touchCount < this.touchCount) {
                this.mayBeSwiping = false;
            }
        } else if (currentTime - this.startTime > SWIPE_TIMEOUT) {
            // Cancel the swipe if they took too long to finish.
            this.mayBeSwiping = false;
        }
    };

    proto.repeatStep = function (event) {
        var currentPos, distance, currentTime;
        var newDistance, direction;

        currentPos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };

        newDistance = this.cardinalDistance(this.firstPos, currentPos);

        if (newDistance >= SWIPE_DISTANCE) {
            this.swipeDirection = this.dominantDirection(this.firstPos, currentPos);
            this.recenter(event);
        }
    };

    // Find the distance traveled by the swipe along compass directions.
    proto.cardinalDistance = function (firstPos, currentPos) {
        var xDist, yDist;

        xDist = Math.abs(firstPos.x - currentPos.x);
        yDist = Math.abs(firstPos.y - currentPos.y);

        return Math.max(xDist, yDist);
    };

    // Decide which direction the touch has moved farthest.
    proto.dominantDirection = function (firstPos, currentPos) {
        var dx, dy;
        var dominantAxis, dominantDirection;

        dx = currentPos.x - firstPos.x;
        dy = currentPos.y - firstPos.y;

        dominantAxis = 'x';
        if (Math.abs(dy) > Math.abs(dx)) {
            dominantAxis = 'y';
        }

        if (dominantAxis === 'x') {
            if (dx > 0) {
                dominantDirection = 'right';
            } else {
                dominantDirection = 'left';
            }
        } else {
            if (dy > 0) {
                dominantDirection = 'down';
            } else {
                dominantDirection = 'up';
            }
        }

        return dominantDirection;
    };

    /** Action Methods **/

    // Method to be called when we've detected a swipe and some action
    // is called for.
    proto.handleSwipe = function (direction, touchCount) {
        if (touchCount === 1) {
            this.emitKeydown(this.swipeDirection);
        } else if (touchCount > 1) {
            // Since this was a multitouch gesture, open the menu.
            this.toggleMenu();
        }
    };

    proto.handleTap = function () {
        this.emitKeydown('action');
    };

    // Fake out keypresses to achieve the desired effect.
    proto.emitKeydown = function (input) {
        var event;

        event = { keyCode: CODE[input] };

        this.fakeCanvasFocus();
        // Press, then release key.
        onKeyDown(event);
        onKeyUp(event);
    };

    proto.fakeCanvasFocus = function () {
        var canvas;

        canvas = document.getElementById('gameCanvas');
        onMouseDown({
            button: 0,
            target: canvas
        });
    };

    proto.toggleMenu = function () {
        if (this.isMenuVisible) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    };

    proto.showMenu = function () {
        if (!this.menuElem) {
            this.buildMenu();
        }
        this.getAnimatables().menu.animateUp();
        this.isMenuVisible = true;
        this.hideTab();
    };

    proto.hideMenu = function () {
        if (this.menuElem) {
            this.getAnimatables().menu.animateDown();
        }
        this.isMenuVisible = false;
        this.showTab();
    };

    proto.getAnimatables = function () {
        var self = this;
        if (!this._animatables) {
            this._animatables = {
                tab: Animatable('tab', 0.1, self.setTabAnimationRatio),
                menu: Animatable('menu', 0.1, self.setMenuAnimationRatio)
            }
        }
        return this._animatables;
    };

    proto.showTab = function () {
        if (!this.tabElem) {
            this.buildTab();
        }
        this.getAnimatables().tab.animateDown();
    };

    proto.hideTab = function () {
        if (this.tabElem) {
            this.tabElem.setAttribute('style', 'display: none;');
        }
        this.getAnimatables().tab.animateUp();
    };

    proto.buildTab = function () {
        var self = this;
        var tempElem, body;
        var openCallback;
        var tabElem;
        var assemblyElem;

        tempElem = document.createElement('div');
        tempElem.innerHTML = TAB_STRING;
        assemblyElem = tempElem.children[0];

        openCallback = function (event) {
            event.stopPropagation();
            self.showMenu();
        };
        this.tabAffordance = assemblyElem.getElementsByClassName('tab-affordance')[0];
        this.tabElem = assemblyElem.getElementsByClassName('tab-icon')[0];

        this.tabAffordance.addEventListener('touchstart', openCallback);
        this.tabElem.addEventListener('touchstart', openCallback);

        body = document.getElementsByTagName('body')[0];
        body.appendChild(assemblyElem);
    };

    proto.buildMenu = function () {
        var self = this;
        var tempElem, body;
        var undo, restart, feedback, quit;
        var closeTab;
        var closeCallback;

        tempElem = document.createElement('div');
        tempElem.innerHTML = this.buildMenuString(state);
        this.menuElem = tempElem.children[0];
        this.closeElem = this.menuElem.getElementsByClassName('close')[0];

        closeCallback = function (event) {
            event.stopPropagation();
            self.hideMenu();
        };
        this.closeAffordance = this.menuElem.getElementsByClassName('close-affordance')[0];
        closeTab = this.menuElem.getElementsByClassName('close')[0];
        this.closeAffordance.addEventListener('touchstart', closeCallback);
        closeTab.addEventListener('touchstart', closeCallback);

        undo = this.menuElem.getElementsByClassName('undo')[0];
        if (undo) {
            undo.addEventListener('touchstart', function (event) {
                event.stopPropagation();
                self.emitKeydown('undo');
            });
        }
        restart = this.menuElem.getElementsByClassName('restart')[0];
        if (restart) {
            restart.addEventListener('touchstart', function (event) {
                event.stopPropagation();
                self.emitKeydown('restart');
            });
        }

        feedback = this.menuElem.getElementsByClassName('feedback')[0];
        if (feedback) {
            feedback.addEventListener('touchstart', function (event) {
                event.stopPropagation();
                self.emitKeydown('feedback');
            });
        }

        quit = this.menuElem.getElementsByClassName('quit')[0];
        quit.addEventListener('touchstart', function (event) {
            event.stopPropagation();
            self.emitKeydown('quit');
        });

        body = document.getElementsByTagName('body')[0];
        body.appendChild(this.menuElem);
    };

    proto.buildMenuString = function (state) {
    // Template for the menu.
        var itemCount, menuLines;
        var noUndo, noRestart;

        noUndo = state.metadata.noundo;
        noRestart = state.metadata.norestart;

        itemCount = 3;
        if (noUndo) {
            itemCount -= 1;
        }
        if (noRestart) {
            itemCount -= 1;
        }

        menuLines = [
            '<div class="mobile-menu item-count-' + itemCount + '">',
            '  <div class="close-affordance"></div>',
            '  <div class="close">',
            '    <div class="slice"></div>',
            '    <div class="slice"></div>',
            '  </div>'
        ];

        if (!noUndo) {
            menuLines.push('  <div class="undo p-button">Undo</div>');
        }
        if (!noRestart) {
            menuLines.push('  <div class="restart p-button">Restart</div>');
        }
        menuLines = menuLines.concat([
			'  <div class="feedback p-button">Give feedback</div>',
            '  <div class="quit p-button">Quit to Menu</div>',
            '  <div class="clear"></div>',
            '</div>'
        ]);

        return menuLines.join("\n");
    };

    proto.buildFocusIndicator = function () {
        var focusElementParent;
        this.focusIndicator = document.createElement('DIV');
        this.focusIndicator.setAttribute('class', 'tapFocusIndicator');
        this.focusIndicator.setAttribute('style', 'visibility: hidden;');

        focusElementParent = this.focusElement.parentNode;
        focusElementParent.appendChild(this.focusIndicator);
    };

    proto.setTabAnimationRatio = function (ratio) {
        var LEFT = 18;
        var RIGHT = 48 + 18;
        var size, opacityString;
        var style;

        // Round away any exponents that might appear.
        ratio = Math.round((ratio) * 1000) / 1000;
        if (ratio >= 0.999) {
            this.tabAffordance.setAttribute('style', 'display: none;');
        } else {
            this.tabAffordance.setAttribute('style', 'display: block;');
        }
        size = RIGHT * ratio + LEFT * (1 - ratio);
        opacityString = 'opacity: ' + (1 - ratio) + ';';
        style = opacityString + ' ' +
            'width: ' + size + 'px;';
        this.tabElem.setAttribute('style', style);
    };

    proto.setMenuAnimationRatio = function (ratio) {
        var LEFT = -48 - 18;
        var RIGHT = -18;
        var size, opacityString;
        var style;

        // Round away any exponents that might appear.
        ratio = Math.round((ratio) * 1000) / 1000;
        if (ratio <= 0.001) {
            this.closeAffordance.setAttribute('style', 'display: none;');
        } else {
            this.closeAffordance.setAttribute('style', 'display: block;');
        }
        size = RIGHT * ratio + LEFT * (1 - ratio);
        opacityString = 'opacity: ' + ratio + ';';
        style = 'left: ' + (size - 4) + 'px; ' +
            opacityString + ' ' +
            'width: ' + (-size) + 'px;';
        this.closeElem.setAttribute('style', style);

        this.menuElem.setAttribute('style', opacityString);
    };

    /** Audio Methods **/

    proto.disableAudio = function () {
        // Overwrite the playseed function to disable it.
        window.playSeed = function () {};
    };

    proto.isAudioSupported = function () {
        var isAudioSupported = true;

        if (typeof webkitAudioContext !== 'undefined') {
            // We may be on Mobile Safari, which throws up
            // 'Operation not Supported' alerts when we attempt to
            // play Audio elements with "data:audio/wav;base64"
            // encoded HTML5 Audio elements.
            //
            // Switching to MP3 encoded audio may be the way we have
            // to go to get Audio working on mobile devices.
            //
            // e.g. https://github.com/rioleo/webaudio-api-synthesizer
            isAudioSupported = false;
        }

        return isAudioSupported;
    };

    /** Other HTML5 Stuff **/

    proto.disableSelection = function () {
        var body;
        body = document.getElementsByTagName('body')[0];
        body.setAttribute('class', body.getAttribute('class') + ' disable-select');
    };

}(window.Mobile.GestureHandler.prototype));

window.Animator = function () {
    this.initialize.apply(this, arguments);
};

(function (proto) {
    proto.initialize = function () {
        this._animations = {};
        this.tick = this.tick.bind(this);
    };

    proto.animate = function (key, tick) {
        this._animations[key] = tick;
        this.wakeup();
    };

    proto.wakeup = function () {
        if (this._isAnimating) {
            return;
        }
        this._isAnimating = true;
        this.tick();
    };

    proto.tick = function () {
        var key;
        var isFinished, allFinished;
        var toRemove, index;

        toRemove = [];
        allFinished = true;
        for (key in this._animations) {
            if (!this._animations.hasOwnProperty(key)) {
                return;
            }
            isFinished = this._animations[key]();
            if (!isFinished) {
                allFinished = false;
            } else {
                toRemove.push(key);
            }
        }

        if (!allFinished) {
            requestAnimationFrame(this.tick);
        } else {
            for (index = 0; index < toRemove.length; toRemove++) {
                delete this._isAnimating[toRemove[index]];
            }
            this._isAnimating = false;
        }
    };

}(window.Animator.prototype));

window.Animator.getInstance = function () {
    if (!window.Animator._instance) {
        window.Animator._instance = new window.Animator();
    }
    return window.Animator._instance;
};

function Animatable(key, increment, update) {
    var ratio;
    var handles;

    handles = {
        animateUp: function () {
            Animator.getInstance().animate(key, tickUp);
        },
        animateDown: function () {
            Animator.getInstance().animate(key, tickDown);
        }
    };

    ratio = 0;

    function tickUp () {
        var isFinished;
        ratio += increment;
        if (ratio >= 1.0) {
            isFinished = true;
            ratio = 1;
        }
        update(ratio);
        return isFinished;
    };

    function tickDown () {
        var isFinished;
        ratio -= increment;
        if (ratio <= 0.0) {
            isFinished = true;
            ratio = 0;
        }
        update(ratio);
        return isFinished;
    };

    return handles;
};


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    'use strict';

    var VENDORS = ['ms', 'moz', 'webkit', 'o'];
    var index, lastTime;

    for (index = 0; index < VENDORS.length && !window.requestAnimationFrame; index++) {
        window.requestAnimationFrame = window[VENDORS[index] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[VENDORS[index] + 'CancelAnimationFrame'];
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = window[VENDORS[index] + 'CancelRequestAnimationFrame'];
        }
    }

    if (!window.requestAnimationFrame) {
        lastTime = 0;
        window.requestAnimationFrame = function(callback, element) {
            var currTime, timeToCall, id;

            currTime = new Date().getTime();
            timeToCall = Math.max(0, 16 - (currTime - lastTime));
            id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
