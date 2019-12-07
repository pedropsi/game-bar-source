////////////////////////////////////////////////////////////////////////////////
//Game Bar Loader (c) by Pedro PSI, 2019
//MIT License
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//Dependency Loaders

//Glocal Files
function Local(){
	return /^file\:.*/.test(document.URL);
}
function JoinPath(path,subpath){
	return path.replace(/\\*$/,"")+"/"+subpath.replace(/^\\*/,"");
}
function GlocalPath(urlpath,relativepath){
if(Local())
	var u="..";
else
	var u=urlpath;
return JoinPath(u,relativepath);
}

function LoadScriptFrom(source){
	var jsCode=document.createElement('script');
	jsCode.setAttribute('src',source.replace('.js','')+'.js');
	jsCode.setAttribute('type','text/javascript');
	jsCode.setAttribute('async',false);
	document.body.appendChild(jsCode);
}

function LoadStyle(sourcename){
	var head=document.getElementsByTagName('head')[0];
	
	//Load
	var styleelement=document.createElement('link');
	styleelement.href=sourcename.replace(".css","")+".css";
	styleelement.rel="stylesheet";
	styleelement.type="text/css";
	head.appendChild(styleelement);	
}

function LoaderInFolderGB(folder){
	return function(sourcename){
		return LoadScriptFrom(JoinPath(folder,sourcename));
	}
}

function DelayUntil(Condition,F,i){
	var n=Condition.name+F.name+(i?i:0);
	
	if(!DelayUntil[n])
		DelayUntil[n]=0;
	DelayUntil[n]++;

	if(Condition()){
		DelayUntil[n]=0;
		return F();
	}
	else{
		console.log(DelayUntil[n]);
		
		if(DelayUntil[n]<10){
			function D(){return DelayUntil(Condition,F,i);};
			setTimeout(D,100*(Math.pow(2,DelayUntil[n])));
		}
		else
			console.log("Timed out: ",n);
	}
}


////////////////////////////////////////////////////////////////////////////////
// Load the Game Bar
var puzzlescriptModules=[
	"data-game-colours",
	"data-game-extras",
	"data-game-overwrite"
]

var precedences={
	"data-game-colours":function(){return typeof GetElement!=="undefined";},
	"data-game-extras":function(){return typeof Saturation!=="undefined";},
	"data-game-overwrite":function(){return typeof LoadGame!=="undefined";}
}

var VERSIONFOLDER="codes"; 
FOLDER=GlocalPath("https://pedropsi.github.io/game-bar-source",VERSIONFOLDER);

function LoadModule(module){
	function L(){return LoaderInFolderGB(JoinPath(FOLDER,"game/modules"))(module)};
	return DelayUntil(precedences[module],L,module);
}
function LoadLaterModules(){
	puzzlescriptModules.map(LoadModule);
}


//Load PS modules 
function CC(){return typeof RemoveElement!=="undefined";};
LoaderInFolderGB(FOLDER)("data-transfer");
DelayUntil(CC,LoadLaterModules);


//Start the Bar
function GameBarLoad(){
	RemoveElement(".tab");
	PrepareGame();
}
function C(){return typeof PrepareGame!=="undefined";};
DelayUntil(C,GameBarLoad);


//Check everything loaded properly after 10 seconds
function NotAllLoaded(){
	if(!CC()||puzzlescriptModules.map(function(m){return !precedences[m]()}).some(Identity))
		alert("Not all game bar modules loaded properly. Please file an issue at: https://github.com/pedropsi/game-bar-source/issues");
}
setTimeout(NotAllLoaded,10000);
