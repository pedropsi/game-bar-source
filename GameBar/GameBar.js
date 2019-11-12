//Dependecy Loaders

function LoadScriptFrom(source){
	var jsCode=document.createElement('script');
	jsCode.setAttribute('src',source.replace('.js','')+'.js');
	jsCode.setAttribute('type','text/javascript');
	jsCode.setAttribute('async',false);
	document.body.appendChild(jsCode);
}

function LoaderInFolderGB(folder){
	return function(sourcename){
		return LoadScriptFrom(folder+"/"+sourcename);
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
			setTimeout(D,100*(2**DelayUntil[n]));
		}
		else
			console.log("Timed out: ",n);
	}
}

function Local(){
	return /^file\:.*/.test(document.URL);
}

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

var VERSIONFOLDER="Versions/3.0/codes"; //"/"+"codes"; //

if(Local()) //Local vs online
	var FOLDER=".."+"/"+VERSIONFOLDER;
else
	var FOLDER="https://pedropsi.github.io/game-bar-source"+"/"+VERSIONFOLDER;


function LoadModule(module){
	function L(){return LoaderInFolderGB(FOLDER+"/"+"game/modules")(module)};
	return DelayUntil(precedences[module],L,module);
}

LoaderInFolderGB(FOLDER)("data-transfer");

DelayUntil(function(){typeof WrapElement!=="undefined"&&typeof gameSelector!=="undefined"},WrapGame);
function WrapGame(){
	WrapElement(ParentSelector(gameSelector),
	'<div class="game-supra-container">\
		<div class="game-rotation-container">\
			<div class="game-container">',
			'</div>\
		</div>\
	</div>');
}

puzzlescriptModules.map(LoadModule);


//Start the Bar

function GameBarLoad(){
	RemoveElement(".tab");
	PrepareGame();
	SupraStyle(gameSelector);
}


function SupraStyle(gameSelector){

	var stylesheet="\
			#gameCanvas{\
			position:unset;\
			max-height:96vh;\
			width:100%;\
		}\
		.game-container{\
			display:flex;\
			flex-direction:column;\
			align-items:center;\
			justify-content: space-between;\
			font-family:var(--font);\
		}\
		.game-container:fullscreen #gameCanvas{\
			height:calc(96vh);\
		}\
		.game-container:full-screen #gameCanvas{\
			height:calc(96vh);\
		}\
		@media only screen and (max-width:330px) {\
			.game-container:fullscreen #gameCanvas{\
				height:calc(94vh);\
			}\
			.game-container:full-screen #gameCanvas{\
				height:calc(94vh);\
			}\
		}";
	
	stylesheet=stylesheet.replace(/\#gameCanvas/g,gameSelector).replace(/\.game\-container/g,ParentSelector(gameSelector));
	AddElement("<style>"+stylesheet+"</style>",document.head);
}


function C(){return typeof PrepareGame!=="undefined";};
DelayUntil(C,GameBarLoad);

