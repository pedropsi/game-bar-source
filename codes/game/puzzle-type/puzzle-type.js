///////////////////////////////////////////////////////////////////////////////
//Puzzle Type (c) Pedro PSI, 2019.
//All rights reserved
///////////////////////////////////////////////////////////////////////////////

function LoadGameHTML(){
	var frameHTML="<div class='game-supra-container'>\
	<div class='game-rotation-container'>\
		<div class='game-container'>\
			<div class='game' id='gameCanvas'>\
				<div class='top'>\
					<h1 class='goal'>Puzzle Type</h1>\
					<h2 class='credits'>by Pedro PSI (2019)</h1>\
				</div>\
				<div class='middle' id='letters'>\
					<div class='latters'>Start game</div>\
				</div>\
				<div class='bottom'>\
				</div>\
			</div>\
		</div>\
	</div>\
</div>";

	RemoveElement(".game-supra-container");
	PrependElement(frameHTML,".main");
}


///////////////////////////////////////////////////////////////////////////////
// Load the game bar & options

//PS links
function ObtainBGColor(){return window.getComputedStyle(document.body)["background-color"];}
function ObtainFGColor(){return window.getComputedStyle(document.body)["color"];}

function ObtainRestartAllowed(){return true;}
function ObtainUndoAllowed(){return true;}
function ObtainUndo(){Undo();}
function ObtainRestart(){ClearLetters();}

function ObtainNewGameCondition(){return SolvedLevelScreens().length<1};

function ObtainStateScreens(){return LevelGoals;}

var ObtainLevelLoader=LevelLoader;

function ResizeCanvas(){return ;}


var gameModules=[
"data-game-colours",
"data-game-extras",
"data-game-moves"
]

gameModules.map(LoaderInFolder("codes/game/modules"));

function P(){
	PrepareGame();
	ResumeCapturingKeys(CaptureComboKey);
	LoadGame();
	ObtainTitleScreenLoader();
};

LoadGameHTML();
LoadStyle(pageRoot()+"codes/game/game.css");
LoadStyle(pageRoot()+"codes/game/puzzle-type/puzzle-type.css");
DelayUntil(function(){return (typeof PrepareGame!=="undefined")},P);


///////////////////////////////////////////////////////////////////////////////
//Keybinding
function ObtainKeyActionsGame(){
	return {
		"A":InstructGameKeyF("A"),
		"B":InstructGameKeyF("B"),
		"C":InstructGameKeyF("C"),
		"D":InstructGameKeyF("D"),
		"E":InstructGameKeyF("E"),
		"F":InstructGameKeyF("F"),
		"G":InstructGameKeyF("G"),
		"H":InstructGameKeyF("H"),
		"I":InstructGameKeyF("I"),
		"J":InstructGameKeyF("J"),
		"K":InstructGameKeyF("K"),
		"L":InstructGameKeyF("L"),
		"M":InstructGameKeyF("M"),
		"N":InstructGameKeyF("N"),
		"O":InstructGameKeyF("O"),
		"P":InstructGameKeyF("P"),
		"Q":InstructGameKeyF("Q"),
		"R":InstructGameKeyF("R"),
		"S":InstructGameKeyF("S"),
		"T":InstructGameKeyF("T"),
		"U":InstructGameKeyF("U"),
		"V":InstructGameKeyF("V"),
		"W":InstructGameKeyF("W"),
		"X":InstructGameKeyF("X"),
		"Y":InstructGameKeyF("Y"),
		"Z":InstructGameKeyF("Z"),
		"Escape":InstructGameKeyF("Escape"),
		"Backspace":ObtainRestart,
		"Delete":ObtainRestart,
		"Shift R":ObtainRestart,
		"Shift U":ObtainUndo,
		"Spacebar":InstructGameKeyF("Enter"),
		"Enter":InstructGameKeyF("Enter"),
		"Left":InstructNothing,
		"Up":InstructNothing,
		"Right":InstructNothing,
		"Down":InstructNothing
	};
};

function ObtainKeyActionsGameBar(){
	return {
	// Game bar menus
	"Shift E"			:RequestGameFeedback,
	"Shift F"			:RequestGameFullscreen,
	"Shift H"			:RequestHint,
	"Shift L"			:RequestLevelSelector, 
	"Shift M"			:ToggleCurrentSong
	};
};

function InstructNothing(){
	return function(ev){
		ev.preventDefault();
		ForbidCaret();
	}
}

function InstructGameKeyF(key){
	return function(ev){
		ev.preventDefault();
		
		function Action(){return GameAction(key);}
		
		Throttle(Action,100,"Action");
	}
}

function LevelAction(key){
	if(key==="Escape"){
		ObtainTitleScreenLoader();
		return;
	 }	
	
	if(key==="Enter"){
		ForbidCaret();return;
	}
	else
		LevelActions[CurLevelName()](key);
	
	UpdateLevel();
	CheckWin();	
}

function TitleScreenAction(key){
	if(key!=="Escape")StartLevelFromTitle();
}

function GameAction(key){
	
	if(BlockInput.blocked)
		return;
	
	if(TitleScreen())
		TitleScreenAction(key)
	else
		LevelAction(key)
	
	GameFocus();
};

function BlockInput(duration){
	var duration=duration||1000;
	BlockInput.blocked=true;
	function UnblockInput(){BlockInput.blocked=false;}
	setTimeout(UnblockInput,duration);
}

function ForbidCaret(){
	PulseSelect(".caret","forbidden",500);
}

///////////////////////////////////////////////////////////////////////////////
//Levels & Actions
var LevelGoals=[
	"Direct",
	"Reverse",
	"Alternate",
	"Second",
	"Follow",
	"Oppose",
	"Rise",
	"Vowels",
	"Falls"
	];

var LevelActions={
	"Direct":Direct,
	"Reverse":function(L){
		InputLetterBefore(L);
	},
	"Oppose":function(A){
		var Z=NumberLetter(25-LetterNumber(A)); 
		InputLetter(Z);		
	},
	"Rise":function(L){
		var M=NumberLetter(LetterNumber(L)+1); 
		InputLetter(M);
	},
	"Second":function Second(L){
		if(!Second.n)
			Second.n=0;
		Second.n++;
		
		if(Second.n%2===0)
			DeleteLetterBefore();
		
		InputLetter(L);
},
	"Vowels":function Vowels(A){
		if(!Vowels.n)
			Vowels.n=0;
		
		var n=0;
		switch(A){
			case "A":n=n+0;break;
			case "E":n=n+1;break;
			case "I":n=n+2;break;
			case "O":n=n+3;break;
			case "U":n=n+4;break;
			default:
				InputLetter(A);
				return;
		}
		
		Vowels.n=(Vowels.n+n)%5+1;
		
		switch(Vowels.n){
			case 1:InputLetter("A");break;
			case 2:InputLetter("E");break;
			case 3:InputLetter("I");break;
			case 4:InputLetter("O");break;
			case 5:InputLetter("U");break;
		}
	},
	"Alternate":function (L){
		if(CycleNext(["end","begin"])==="begin"){
			InputLetter(L);
			Caret(-1);
		}else{
			InputLetterBefore(L);
			Caret(Letters().length);
		}
	},
	"Follow":function (L){
		if(Letters.array.length>=1){
			var last=Last(Letters.array);
			DeleteLetterAfter();
			InputLetter(L);
			InputLetter(last);
		}
		else
			InputLetter(L);
	},
	"Falls":function (L){
		function LetterDown(Z){
			return NumberLetter(LetterNumber(Z)-1);
		}
		Letters.array=Letters.array.map(LetterDown);
		InputLetter(L);
	}
}

function Direct(L){
		InputLetter(L);
};


///////////////////////////////////////////////////////////////////////////////
//Manage letters and carets

function Letters(letter,beginning,deleteletter){
	if(!Letters.array)
		Letters.array=[];

	if(!letter)
		return Letters.array;
	
	if(!deleteletter){
		if(!beginning){
			Letters.array.push(letter);
			Caret(Letters.array.length);
		}
		else{
			Letters.array.unshift(letter);
			Caret(-1);
		}
	}
	else{
		if(!beginning){
			Letters.array.pop();
			Caret(Letters.array.length);
		}
		else{
			Letters.array.shift();
			Caret(-1);
		}
	}
	
	return Letters.array;
}

function Caret(position){
	if(!Caret.array)
		Caret.array=[Letters().length]; //after last one

	if(typeof position==="undefined")
		return Caret.array;
	else
		Caret.array=[position];	
}

function DrawCaret(){
	var p=Caret()[0];
	
	if(p===-1)
		PreAddElement(CaretHTML(),"#letters");
	if(p===Letters().length)
		AddElement(CaretHTML(),"#letters");
}

function LetterHTML(L){
	return "<div class='letter'>"+L+"</div>"
}

function CaretHTML(){
	return "<div class='letter caret'> </div>"
}


function ClearLetters(){
	Letters.array=[];
	Caret(0);
	UpdateLevel();
}

function DrawLetters(){
	var letters=Letters().map(LetterHTML).join("\n");
	ReplaceElement(letters,"#letters");
}

function UpdateLevel(){
	UpdateLevelSecretly();
	SaveLevelState();
}
	
function UpdateLevelSecretly(){
	DrawLetters();
	DrawCaret();
}


function InputLetterBefore(letter){
	Letters(letter,true);
}

function InputLetter(letter){
	Letters(letter,false);
}

//Letters Delete
function DeleteLetterBefore(){
	Letters("any",true,true);
}

function DeleteLetterAfter(){
	Letters("any",false,true);
}


//Letters and Numbers
function LetterNumber(A){
	return (A.charCodeAt()-65)%26;
}
function NumberLetter(n){
	return String.fromCharCode(((n%26)+26)%26+65);
}


///////////////////////////////////////////////////////////////////////////////
//Game execution

function ObtainTitleScreenLoader(){
	if(!TitleScreen())
		PlaySound("media/puzzle-type/sound/startgame.mp3");
	TitleScreen(true);
	ReplaceElement("<div class='top'><div class='title'></div><div class='credits'></div></div>",".top");
	ReplaceElement("Puzzle Type",".title");
	ReplaceElement("by Pedro PSI (2019)",".credits");
	if(CurLevelNumber()>1||SolvedLevelScreens().length>0)
		Letters.array="CONTINUE".split("");
	else
		Letters.array="START".split("");
	UpdateLevel();
	
};

function LevelLoader(){
	TitleScreen(false);
	ReplaceElement("<div class='top'><div class='goal'></div></div>",".top");
	ClearLetters();
	ReplaceElement(CurLevelName(),".goal");
	UndoClear();
}

function CurLevelName(){return LevelGoals[CurrentScreen()]};//placeholder


function CheckWin(){
	
	var win=CurLevelName().toUpperCase()===Letters().join("").toUpperCase();
	
	if(win){
		PlaySound("media/puzzle-type/sound/win"+RandomChoice("123")+".mp3");
		MarkWonLevel();
		BlockInput(1100);
		setTimeout(NextLevel,1000);
		UndoClear();
	}
}

function ObtainPlayEndGameSound(){
	PlaySound("media/puzzle-type/sound/wingame.mp3");
}


///////////////////////////////////////////////////////////////////////////////
//Undo
function Undo(){
	if(!Undo.backups)
		SaveLevelState();
	
	if(Undo.backups.length>=2){
		var u=Undo.backups.pop(); //Pop the current state
		LoadLevelState(Last(Undo.backups));
	}
}

function SaveLevelState(){
	if(!Undo.backups)
		UndoClear();
	Undo.backups.push(LevelState());
}

function LoadLevelState(levelstate){
	Letters.array=Clone(levelstate['letters']);
	Caret(levelstate['caret']);
	UpdateLevelSecretly();
}

function UndoClear(){
	Undo.backups=[LevelZeroState()];
} 

function LevelZeroState(){
	var state={
		'letters':[],
		'caret':0
	};
	return state;
}

function LevelState(){
	var state={
		'letters':Clone(Letters()),
		'caret':Caret()[0]
	};
	return state;
}



