DATAVERSION=5;

//Portable game bar
var Portable=False;

if(typeof RequestGameFeedback==="undefined"||typeof RequestHallOfFame==="undefined")
	Portable=True;

//Game Console
var GameConsole=function(){return pageIdentifier()==="game-console"};

function GameHackURL(){
	return "https://www.puzzlescript.net/editor.html?hack="+pageSearch("game");
}

////////////////////////////////////////////////////////////////////////////////
// Game data link defaults, for puzzlescript, overwritable

//Game selector
var gameSelector=gameSelector?gameSelector:'#gameCanvas';

//Game Options
if(typeof ObtainBGColor==="undefined")
	function ObtainBGColor(){return state.bgcolor;}

if(typeof ObtainFGColor==="undefined")
	function ObtainFGColor(){return state.fgcolor;}

if(typeof ObtainRestartAllowed==="undefined")
	function ObtainRestartAllowed(){return !state.metadata.norestart;}

if(typeof ObtainUndoAllowed==="undefined")
	function ObtainUndoAllowed(){return !state.metadata.noundo;}

if(typeof ObtainUndo==="undefined")
	function ObtainUndo(){
		PulseSelect("UndoButton");
		CheckRegisterKey({keyCode:85});}

if(typeof ObtainRestart==="undefined")
	function ObtainRestart(){
		PulseSelect("RestartButton");
		CheckRegisterKey({keyCode:82});}

if(typeof ObtainAction==="undefined")
	function ObtainAction(){
		CheckRegisterKey({keyCode:88});}

//Game display Options
if(typeof ObtainInitialScroll==="undefined")
	var ObtainInitialScroll=true;
//	var ObtainInitialScroll=false;

if(typeof ObtainInitialMessages==="undefined")
	var ObtainInitialMessages=true;
//	var ObtainInitialMessages=false;

if(typeof ObtainXYRotateCondition==="undefined")
	function ObtainXYRotateCondition(x,y){return x<y*1.05};
//	function ObtainXYRotateCondition(x,y){return false};

if(typeof ResizeCanvas==="undefined")
	function ResizeCanvas(){canvasResize();}

if(typeof titleScreen==="undefined")
	var titleScreen=true;

if(typeof ObtainSymbol==="undefined")
	function ObtainSymbol(name){
		var symbols={
			"how-to-play":IconHTML("M182 32 C 131 42,96 91,105 142 C 106 149,110 166,110 166 C 110 166,154 156,154 156 C 154 156,153 151,151 144 C 143 106,163 77,199 76 C 255 76,270 151,218 173 C 209 177,204 180,204 181 C 204 181,202 184,199 186 C 181 199,168 218,163 239 C 161 246,158 262,158 263 C 158 263,201 271,201 271 C 201 271,202 266,203 261 C 209 235,217 224,238 214 C 322 175,311 57,222 33 C 213 31,192 30,182 32 M155 304 C 118 318,127 372,167 372 C 203 372,217 326,187 307 C 178 302,164 300,155 304"),
			"credits":IconHTML("M178 0 C 34 15,-46 177,27 302 C 109 438,310 430,379 288 C 449 146,335 -15,178 0 M218 38 C 327 50,394 169,346 269 C 291 383,133 394,64 289 C -10 174,81 24,218 38 M185 78 C 104 88,56 172,87 248 C 117 320,209 344,273 297 C 284 289,310 260,309 257 C 308 256,273 229,271 229 C 271 229,267 233,263 238 C 232 280,183 286,148 252 C 89 195,156 98,230 132 C 244 139,253 146,267 167 L 271 171 274 169 C 275 168,284 162,293 155 L 310 143 308 141 C 282 104,259 87,224 80 C 217 78,192 77,185 78"),
			"undo":IconHTML("M216 78 C 174 84,137 106,112 139 L 106 148 100 145 C 97 144,87 139,77 134 C 58 125,58 125,58 127 C 58 127,64 153,71 184 C 78 215,84 241,85 242 C 85 244,194 194,194 192 C 194 191,185 186,173 181 C 161 175,152 170,152 170 C 151 168,164 155,170 150 C 221 110,293 122,328 177 C 339 194,343 211,344 237 L 345 248 355 247 C 360 247,371 246,379 246 L 394 246 394 240 C 394 192,379 153,348 122 C 313 88,262 71,216 78","400 400","0 -050"),
			"restart":IconHTML("M235 65 C 205 79,180 90,180 90 C 180 90,196 112,216 139 C 235 166,252 188,252 188 C 252 187,255 178,258 167 C 261 156,263 146,264 145 C 264 143,269 147,278 157 C 337 218,307 320,225 340 C 144 360,71 285,93 204 C 97 187,105 174,121 155 L 127 148 125 146 C 122 143,92 118,92 118 C 89 118,65 151,59 164 C 1 284,110 418,238 384 C 370 350,398 174,283 101 C 278 98,277 96,277 95 C 277 95,280 83,284 69 C 288 55,291 43,291 42 C 292 40,295 39,235 65"),
			"levelselector":IconHTML("M20 66 L 20 120 72 120 L 124 120 124 66 L 124 12 72 12 L 20 12 20 66 M147 66 L 147 120 200 120 L 252 120 252 66 L 252 12 200 12 L 147 12 147 66 M275 66 L 275 120 327 120 L 378 120 378 66 L 378 12 327 12 L 275 12 275 66 M87 66 L 87 83 72 83 L 57 83 57 66 L 57 50 72 50 L 87 50 87 66 M214 66 L 214 83 200 83 L 185 83 185 66 L 185 50 200 50 L 214 50 214 66 M341 66 L 341 83 327 83 L 312 83 312 66 L 312 50 327 50 L 341 50 341 66 M20 200 L 20 254 72 254 L 124 254 124 200 L 124 146 72 146 L 20 146 20 200 M147 200 L 147 254 200 254 L 252 254 252 200 L 252 146 200 146 L 147 146 147 200 M275 200 L 275 254 327 254 L 378 254 378 200 L 378 146 327 146 L 275 146 275 200 M87 200 L 87 216 72 216 L 57 216 57 200 L 57 183 72 183 L 87 183 87 200 M214 200 L 214 216 200 216 L 185 216 185 200 L 185 183 200 183 L 214 183 214 200 M341 200 L 341 216 327 216 L 312 216 312 200 L 312 183 327 183 L 341 183 341 200 M20 333 L 20 387 72 387 L 124 387 124 333 L 124 279 72 279 L 20 279 20 333 M147 333 L 147 387 200 387 L 252 387 252 333 L 252 279 200 279 L 147 279 147 333 M275 333 L 275 387 327 387 L 378 387 378 333 L 378 279 327 279 L 275 279 275 333 M87 333 L 87 349 72 349 L 57 349 57 333 L 57 316 72 316 L 87 316 87 333 M214 333 L 214 349 200 349 L 185 349 185 333 L 185 316 200 316 L 214 316 214 333 M341 333 L 341 349 327 349 L 312 349 312 333 L 312 316 327 316 L 341 316 341 333"),
			"fullscreen":IconHTML("M236 66 L 236 85 272 85 L 309 85 309 120 L 309 154 327 154 L 346 154 346 101 L 346 48 291 48 L 236 48 236 66 M38 142 L 38 200 57 200 L 75 200 75 160 L 75 121 112 121 L 148 121 148 102 L 148 84 93 84 L 38 84 38 142 M38 308 L 38 363 93 363 L 148 363 148 345 L 148 326 112 326 L 75 326 75 290 L 75 253 57 253 L 38 253 38 308 M272 290 L 272 326 236 326 L 199 326 199 345 L 199 363 254 363 L 309 363 309 308 L 309 253 291 253 L 272 253 272 290"),
			"save":IconHTML("M0 200 L 0 400 200 400 L 400 400 400 200 L 400 0 200 0 L 0 0 0 200 M56 99 L 56 165 200 165 L 344 165 344 99 L 344 34 355 34 L 365 34 365 200 L 365 365 355 365 L 344 365 344 277 L 344 189 200 189 L 56 189 56 277 L 56 365 45 365 L 34 365 34 200 L 34 34 45 34 L 56 34 56 99 M240 73 L 240 112 260 112 L 279 112 279 73 L 279 34 295 34 L 310 34 310 82 L 310 131 200 131 L 90 131 90 82 L 90 34 165 34 L 240 34 240 73 M310 294 L 310 365 200 365 L 90 365 90 294 L 90 223 200 223 L 310 223 310 294 M118 253 L 118 271 200 271 L 282 271 282 253 L 282 236 200 236 L 118 236 118 253 M118 296 L 118 313 200 313 L 282 313 282 296 L 282 279 200 279 L 118 279 118 296 M118 337 L 118 354 200 354 L 282 354 282 337 L 282 320 200 320 L 118 320 118 337"),
			"feedback":IconHTML("M7 139 L 7 274 200 274 L 393 274 393 139 L 393 4 200 4 L 7 4 7 139 M301 42 C 301 42,278 65,249 94 L 198 146 146 94 L 94 41 197 41 C 255 41,301 42,301 42 M355 140 L 355 237 200 237 L 44 237 44 142 L 44 47 121 123 L 197 200 276 121 C 319 78,355 42,355 42 C 355 42,355 86,355 140 M58 343 L 58 379 77 379 L 95 379 95 343 L 95 307 77 307 L 58 307 58 343 M304 343 L 304 379 322 379 L 341 379 341 343 L 341 307 322 307 L 304 307 304 343 M181 365 L 181 392 200 392 L 218 392 218 365 L 218 337 200 337 L 181 337 181 365"),
			"music":"♫",
			"more":"+",
			"hint":IconHTML("M240 122 L 154 209 152 207 C 128 190,88 188,59 203 C -16 240,-8 352,71 379 C 153 406,225 319,185 243 L 181 236 205 212 L 228 188 240 200 L 252 211 258 205 C 262 202,268 196,272 192 L 279 185 267 173 L 255 161 267 150 L 278 139 297 158 C 307 168,316 177,316 177 C 316 176,323 170,330 163 L 343 150 328 135 L 312 119 324 108 L 335 97 350 112 L 366 127 379 114 L 393 100 361 68 C 343 50,328 36,328 36 C 327 36,288 75,240 122 M118 234 C 162 248,172 305,136 333 C 100 363,44 336,44 288 C 44 250,82 222,118 234"),
			"keyboard":IconHTML("M0 88 L 0 177 200 177 L 400 177 400 88 L 400 0 200 0 L 0 0 0 88 M384 88 L 384 161 200 161 L 15 161 15 88 L 15 15 200 15 L 384 15 384 88 M30 41 L 30 53 42 53 L 55 53 55 41 L 55 29 42 29 L 30 29 30 41 M69 41 L 69 53 81 53 L 94 53 94 41 L 94 29 81 29 L 69 29 69 41 M108 41 L 108 53 121 53 L 133 53 133 41 L 133 29 121 29 L 108 29 108 41 M148 41 L 148 53 160 53 L 173 53 173 41 L 173 29 160 29 L 148 29 148 41 M187 41 L 187 53 199 53 L 212 53 212 41 L 212 29 199 29 L 187 29 187 41 M226 41 L 226 53 239 53 L 251 53 251 41 L 251 29 239 29 L 226 29 226 41 M266 41 L 266 53 278 53 L 291 53 291 41 L 291 29 278 29 L 266 29 266 41 M305 41 L 305 53 317 53 L 330 53 330 41 L 330 29 317 29 L 305 29 305 41 M344 41 L 344 53 357 53 L 369 53 369 41 L 369 29 357 29 L 344 29 344 41 M30 87 L 30 98 42 98 L 55 98 55 87 L 55 75 42 75 L 30 75 30 87 M69 87 L 69 98 81 98 L 94 98 94 87 L 94 75 81 75 L 69 75 69 87 M108 87 L 108 98 121 98 L 133 98 133 87 L 133 75 121 75 L 108 75 108 87 M148 87 L 148 98 160 98 L 173 98 173 87 L 173 75 160 75 L 148 75 148 87 M187 87 L 187 98 199 98 L 212 98 212 87 L 212 75 199 75 L 187 75 187 87 M226 87 L 226 98 239 98 L 251 98 251 87 L 251 75 239 75 L 226 75 226 87 M266 87 L 266 98 278 98 L 291 98 291 87 L 291 75 278 75 L 266 75 266 87 M305 87 L 305 98 317 98 L 330 98 330 87 L 330 75 317 75 L 305 75 305 87 M344 87 L 344 98 357 98 L 369 98 369 87 L 369 75 357 75 L 344 75 344 87 M30 134 L 30 147 53 147 L 77 147 77 134 L 77 121 53 121 L 30 121 30 134 M93 134 L 93 147 200 147 L 307 147 307 134 L 307 121 200 121 L 93 121 93 134 M322 134 L 322 147 346 147 L 369 147 369 134 L 369 121 346 121 L 322 121 322 134","400 180"),
			"wrench":IconHTML("M152 112 L 121 147 124 188 L 127 228 75 280 L 23 332 32 341 C 37 346,40 349,40 350 C 39 351,44 356,53 365 L 66 378 122 323 L 177 267 213 266 C 242 265,250 265,250 264 C 251 263,251 263,252 264 C 253 265,253 265,254 263 C 255 263,269 247,285 228 C 301 210,315 195,315 194 C 315 194,287 169,286 169 C 286 169,279 177,271 186 L 256 203 246 203 C 240 204,231 204,225 204 L 214 204 198 190 C 190 183,183 176,183 175 C 183 174,182 166,182 156 L 180 138 196 121 C 205 111,212 102,212 102 C 212 102,185 77,184 77 C 184 77,169 93,152 112")
			};
		if(!name)
			return symbols;
		else if(In(symbols,name.toLowerCase()))
			return symbols[name.toLowerCase()];
		else
			return name;
	}


//Game and Level Navigation
if(typeof ObtainLevelLookahead==="undefined")
	function ObtainLevelLookahead(){return 0; //Max number of unsolved levels shown, in linear progression. Example: 0 = all, 1 =1, 2=2, etc...
	};

if(typeof ObtainGateLevels==="undefined")
	function ObtainGateLevels(){return []; //Gated "boss" levels require beating all previous levels to show up; all previous levels + itself to show levels afterwards. Example: [] = no gate levels, [2,5] = levels 2 and 5 are gate levels.
	};

if(typeof ObtainStateScreens==="undefined")
	function ObtainStateScreens(){return state.levels;}

if(typeof ObtainNewGameCondition==="undefined")
	function ObtainNewGameCondition(){return titleSelection===0}

if(typeof ObtainLevelLoader==="undefined")
	function ObtainLevelLoader(){loadLevelFromState(state,curlevel)};

if(typeof ObtainLevelTransition==="undefined")
	function ObtainLevelTransition(){
		textMode=false;
		titleScreen=false;
		quittingMessageScreen=false;
		messageselected=false;
	}

if(typeof ObtainTitleScreenLoader==="undefined")
	function ObtainTitleScreenLoader(){goToTitleScreen()};

if(typeof ObtainPlayEndGameSound==="undefined")
	function ObtainPlayEndGameSound(){tryPlayEndGameSound()};

if(typeof ObtainLevelTitle==="undefined")
	function ObtainLevelTitle(lvl){
		if(!lvl)
			return "";
		if(HasCheckpoint())
			return "Select checkpoint "+lvl;
		else
			return LevelGatedTitle(lvl);
	}
else if(ObtainLevelTitle==="Previous") //Case for title specified in message before the level
	function ObtainLevelTitle(lvl){
		var title= ObtainStateScreens()[LevelScreen(lvl)-1].message;
		title=title.replace(/^[\-\"\_\:\'\s\n]*(level\s*\d*)*[\-\"\_\:\'\s\n]*/im,"").replace(/[\-\"\_\:\'\s\n]*$/im,"");
		return title.replace(/[\-][\-\s]?/gi," ");
	}

//Read move defaults
if(typeof ObtainIsUndoMove==="undefined")
	function ObtainIsUndoMove(move){return move==="Z"}

if(typeof ObtainIsRestartMove==="undefined")
	function ObtainIsRestartMove(move){return move==="R"}

if(typeof ObtainReadMove==="undefined")
	function ObtainReadMove(move){
		switch (move) {
			case 27:return "Q";break;
			case 37:return "A";break;
			case 38:return "W";break;
			case 39:return "D";break;
			case 40:return "S";break;
			case 82:return "R";break;
			case 88:return "X";break;
			case 85:return "Z";break;
			default: return move;break;
		}
	};

//Keybinding defaults
if(typeof ObtainKeyActionsGameBar==="undefined")
	ObtainKeyActionsGameBar=KeyActionsGameBar;

if(typeof ObtainGameAction==="undefined")
	function ObtainGameAction(key){
		Context(gameSelector)[ComboKeystring(key)]();
		GameFocus();
	}

//On-screen keyboard
if(typeof ObtainKeyboardAllowed==="undefined")
	var ObtainKeyboardAllowed=false;

if(typeof ObtainKeyboardKeys==="undefined")
	var ObtainKeyboardKeys=GameKeyboardKeys;

if(typeof ObtainKeyboardLauncher==="undefined")
	function ObtainKeyboardLauncher(){
		return LaunchBalloon;
	}

if(typeof ObtainKeyboardTarget==="undefined")
	function ObtainKeyboardTarget(){
		return ".game-container";
	}


var ObtainInterlevelMessage=False;
if(!Portable())
	ObtainInterlevelMessage=True;
if(GameConsole())
	ObtainInterlevelMessage=False;

if(typeof ObtainMainKey==="undefined")
	function ObtainMainKey(action){
		if(!action)
			return {
				"undo":"Z",
				"restart":"R",
				"feedback":"E",
				"fullscreen":"F",
				"hint":"H",
				"keyboard":"K",
				"levelselector":"L",
				"music":"M"
			}
		else
			return ObtainMainKey()[action.toLowerCase()];
	}

function ObtainActionTooltip(action){
	if(!action)
		return {
			"credits":"Credits",
			"how-to-play":"How to play?",
			"save":"Save permissions",
			"undo":"Undo",
			"restart":"Restart",
			"feedback":"E-mail feedback",
			"fullscreen":"Fullscreen",
			"hint":"Hints",
			"keyboard":"Keyboard on screen",
			"music":"Music toggle",
			"wrench":"Hack this game",
			"more":"More games by the same author"
		}
	else
		return ObtainActionTooltip()[action.toLowerCase()];
}

////////////////////////////////////////////////////////////////////////////////
//Hooks to Pedro PSI main site

var HasGameFeedback=True;
if(typeof RequestGameFeedback==="undefined"||GameConsole()){
	var RequestGameFeedback=Identity;
	HasGameFeedback=False;
}

var HasHOF=True;
if(typeof RequestHallOfFame==="undefined"){
	var RequestHallOfFame=Identity;
	HasHOF=False;
}

if(typeof RegisterMove==="undefined")
	var RegisterMove=Identity;

//Record
if(typeof ClearLevelRecord==="undefined")
	var ClearLevelRecord=Identity;

if(typeof ClearSolvedLevelScreens==="undefined")
	var ClearSolvedLevelScreens=Identity;

if(typeof EchoLevelWin==="undefined")
	var EchoLevelWin=Identity;

if(typeof EchoSelect==="undefined")
	var EchoSelect=Identity;

if(typeof EchoHint==="undefined")
	var EchoHint=Identity;


////////////////////////////////////////////////////////////////////////////////
// Game Preparation

function WrapGame(){
	WrapElement('<div class="game-supra-container">\
					<div class="game-rotation-container">\
						<div class="game-container">\
						</div>\
					</div>\
				</div>',
				ParentSelector(gameSelector),
				".game-container");
				
	ConsoleLoad(".game-rotation-container");
}


function PrepareGame(){
	var bar=GetElement("GameBar");
	WrapGame();

	if(Portable()){
		var FOLDER=GlocalPath("https://pedropsi.github.io/game-bar-source","codes");
		LoadStyle(JoinPath(FOLDER,"game/game.css"));
		LoadStyle(JoinPath(FOLDER,"game/game-bar-pages.css"));
		LoadStyle(JoinPath(FOLDER,"index.css"));
		
		if(ObtainInitialMessages)
			ConsoleAddMany([
				"Puzzlescript Game bar loaded!",
				"Issues? Suggestions? Head to pedropsi.github.io/game-bar."
			//	"Localsave is ON for "+pageTitle()+".",
			//	"To stop saving and erase all 2 cookies, please deselect "+ObtainSymbol("Save")+"."
			]);
	}


	[250,500,1000,2000,4000,8000].map(function(t){
		setTimeout(ResizeCanvas,t);
	});
	
	if(!bar){
		
		if(typeof onKeyDown!=="undefined")
			StopCapturingKeys(onKeyDown);
		ResumeCapturingKeys(CaptureComboKey);
		
		AddElement("<style>"+ReplaceColours(Stylesheet(),ObtainBGColor(),ObtainFGColor())+"</style>",'head');//Colorise
		AddGameBar();
		
		ListenOnce('click',PlaylistStartPlay,gameSelector);
		ListenOnce('touchstart',RequestKeyboard,gameSelector);
		
		if(ObtainInitialScroll)
			ScrollInto(gameSelector);
		
		GameFocus();
		
		Shout("GameBar");
	}
}


////////////////////////////////////////////////////////////////////////////////
// Game Bar

function GameBarTypewriterBanner(action){
	var k=ObtainMainKey(action);
	if(k)
		k=" ["+k+"]";
	else
		k="";
	return 'TypewriterBanner(this,\"'+ObtainActionTooltip(action)+k+'\",\"'+action+'\")';
}

function GameBarCancelTypewriterBanner(action){
	return 'CancelTypewriterBanner(this,ObtainSymbol(\"'+action+'\"),\"'+action+'\")';
}

function GameBarButtonHTML(action,attribs){
	var TWB=GameBarTypewriterBanner(action);
	var UnTWB=GameBarCancelTypewriterBanner(action);
	return ButtonHTML({
		txt:ObtainSymbol(action),
		attributes:FuseObjects(attribs,{
			onmouseover:TWB,
			onfocus:TWB,
			onmouseout:UnTWB,
			onblur:UnTWB,
			id:Capitalise(action)+'Button'
		})
	});
}
function GameBarButtonLinkHTML(title,action){
	var TWB=GameBarTypewriterBanner(action);
	var UnTWB=GameBarCancelTypewriterBanner(action);
	return ButtonLinkHTML(title,ObtainSymbol(action),{
			onmouseover:TWB,
			onfocus:TWB,
			onmouseout:UnTWB,
			onblur:UnTWB,
			id:Capitalise(action)+'Button'
		})
};

function ShowButton(ButtonNameF){
	var nameButton=FunctionName(ButtonNameF);
	ReplaceElement(ButtonNameF(),nameButton);
	Show(nameButton);
	Deselect(nameButton);
}

function SaveButton(){
	return GameBarButtonHTML('save',{
		onclick:'ToggleSavePermission(this);GameFocus();',
		class:savePermission?'selected':''
	})
};

function UndoButton(){
	if(ObtainUndoAllowed())
		return GameBarButtonHTML('undo',{
			onclick:'UndoAndFocus();',
			onmousedown:'AutoRepeat(UndoAndFocus,250);',
			ontouchstart:'AutoRepeat(UndoAndFocus,250);',
			onmouseup:'AutoStop(UndoAndFocus);',
			ontouchend:'AutoStop(UndoAndFocus);',
			ontouchcancel:'AutoStop(UndoAndFocus);'
		})
	else
		return "";
}

function RestartButton(){
	if(ObtainRestartAllowed())
		return GameBarButtonHTML('restart',{onclick:'ObtainRestart();GameFocus();'});
	else
		return "";
}

function FeedbackButton(){
	if(HasGameFeedback())
		return GameBarButtonHTML("feedback",{onclick:'RequestGameFeedback();'});
	else
		return "";
}

function MusicButton(){
	if(Playlist().length<1)
		return "";
	else{
		canYoutube=false;
		return GameBarButtonHTML("music",{onclick:'ToggleCurrentSong();GameFocus();'});
	}
}

function KeyboardButton(){
	if(ObtainKeyboardAllowed)
		return GameBarButtonHTML("keyboard",{onclick:'RequestKeyboard();'})
	else
		return "";
}

function WrenchButton(){
	if(GameConsole())
		return GameBarButtonHTML("wrench",{onclick:'Navigate(GameHackURL());'})
	else
		return "";
}

if(typeof ObtainLevelSelectorAllowed==="undefined")
	function ObtainLevelSelectorAllowed(){
		return MaxLevel()>1;
	}

function LevelselectorButton(){
	if(ObtainLevelSelectorAllowed())
		return ButtonHTML({txt:"Level selector",attributes:{onclick:'RequestLevelSelector();',id:"LevelselectorButton"}});
	else
		return "";
}

function FullscreenButton(){
	return GameBarButtonHTML("fullscreen",{onclick:'RequestGameFullscreen();GameFocus();'});
}

function GameBar(){
	
	var buttons=[
		SaveButton(),
		GameBarButtonLinkHTML("How to play?","how-to-play"),
		HiddenHTML('HintButton'),
		UndoButton(),
		RestartButton(),
		KeyboardButton(),
		LevelselectorButton(),
		FeedbackButton(),
		GameBarButtonLinkHTML("Credits","credits"),
		WrenchButton(),
		HiddenHTML('MoreButton'),
		MusicButton(),
		FullscreenButton()
	].join("");
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(){
	RemoveElement("GameBar");
	if(Portable())
		AddElement(GameBar(),ParentSelector(gameSelector));
	else
		AddElement(GameBar(),".game-container");
}


/////////////////////////////////////////////////////////////////////////////////////
// Focus on Game Canvas
function GameFocus(DP){
	document.activeElement.blur();
	if(window.Mobile)
		window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	setTimeout(function(){FocusElement(gameSelector);},100);
};

function UndoAndFocus(){
	ObtainUndo();
	GameFocus();
}

////////////////////////////////////////////////////////////////////////////////
// Screen rotation

function GameRotation(){
	var x=window.innerWidth;
	var y=window.innerHeight;
	
	if(ObtainXYRotateCondition(x,y))
		Class('.game-rotation-container','rotate90');
	else
		Declass('.game-rotation-container','rotate90');
	
	ResizeCanvas();
	setTimeout(ResizeCanvas,1000);
}

GameRotation();
Listen('resize',GameRotation);

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;
var savePermission=true;

function ToggleSavePermission(thi){
	Deselect(thi);
	if(savePermission){
		savePermission=false;
		EraseLocalsave();
		ConsoleAdd("All 2 cookies erased for "+pageTitle()+": Localsave is OFF across sessions.");
	}
	else 
		ActivateSavePermission(thi);
}

function ActivateSavePermission(thi){
	savePermission=true;
	Localsave();
	ConsoleAddMany([
		"Localsave is ON for "+pageTitle()+".",
		"To stop localsaving and erase all 2 cookies, please deselect "+ObtainSymbol("Save")+"."
		]);
	Select(thi);
}

/////////////////////////////////////////////////////////////////////////////////////
// Current Level

if(typeof curlevel==="undefined")
	var curlevel=0;

function CurrentScreen(s){
	if(typeof s==="undefined")
		return curlevel;
	else
		return curlevel=s;
}


/////////////////////////////////////////////////////////////////////////////////////
// Save Level & Checkpoint

if(typeof ObtainStorageURL==="undefined")
	function ObtainStorageURL(){
		if (typeof pageNoTag==="undefined")
			return document.URL;
		else
			return pageNoTag(document.URL);
	}

function LocalStorageName(name){
	if (name)
		return ObtainStorageURL()+"_"+name.toLowerCase();
	else
		return ObtainStorageURL();
}
function LocalStorage(name,set,TransformF){ //Getter-setter
	if(!set){
		var data=localStorage[LocalStorageName(name)];
		if(!data)
			return [];
		data=JSON.parse(data);
		
		if(data['data']){ //unwrap capsule
			var vers=data['vers'];
			data=data['data'];
			if(!vers||vers<DATAVERSION) //legacy conversion
				data=LegacyConversion(name,data,vers);
		}		
		
		if(TransformF&&data.length)
			data=data.map(TransformF);
		return data;
	}
	else{
		if(name==="")
			var capsule=set; //no capsule, for compatibility
		else 
			var capsule={  //wrap in capsule
				'data':set,
				'vers':DATAVERSION,
				'name':name
			};
	}
		return localStorage[LocalStorageName(name)]=JSON.stringify(capsule);
}

function LegacyConversion(name,data,vers){
	var Converter=LegacyConversion[name];
	if(!Converter)
		return data;
	else
		return Converter(data,vers);
}

function ArrayRemap(wrongarray,rightarray){
	var i=0;
	var j=0;
	var newarray=[];
	while(i<wrongarray.length){
		if(In(rightarray,wrongarray[i])){
			newarray.push(wrongarray[i]);
			j=rightarray.indexOf(wrongarray[i])+1;
		}
		else{
			newarray.push(rightarray[j])
			j++;
		}
		i++;
	}
	return newarray;
}

LegacyConversion["solvedlevels"]=function(solvedlevels,vers){

	if(!vers||vers<5)	 					//Previous data format;
		solvedlevels=solvedlevels.map(LevelNumber);
	
	if(solvedlevels.some(IsScreenMessage))	//Case of added/removed interlevel messages;
		solvedlevels=ArrayRemap(solvedlevels,Levels());
	
	return solvedlevels;
};

LegacyConversion["checkpoint"]=function(sta,vers){
	if(!vers||vers<5)
		if(sta.dat)
			return [sta];
	return sta;
};

function CanSaveLocally(){
	return window.localStorage;
}
function HasCheckpoint(){
	return LocalStorage("checkpoint").length>0;
}
function HasLevel(){
	return CanSaveLocally()&&!(LocalStorage("").length===0);
}


// Localsave = save in local storage
function LocalsaveLevel(curscreen){
	if(savePermission){
		LocalStorage("solvedlevels",SolvedLevels());
		return LocalStorage("",curscreen);
	}
	else
		EraseLocalsaveLevel();
};

function LocalsaveCheckpoints(newstack){
	if(savePermission)
		return LocalStorage("checkpoint",newstack);
	else
		EraseLocalsaveCheckpoints();
}

function LocalsaveHints(){
	if(savePermission&&Hints())
		LocalStorage("hintsused",Hints.used);
}
	
function Localsave(){
	LocalsaveLevel(CurrentScreen());
	LocalsaveHints();
	//LocalsaveCheckpoints();
}	

function EraseLocalStorage(name){
	return localStorage.removeItem(LocalStorageName(name));
}

function EraseLocalsaveLevel(){
	EraseLocalStorage("solvedlevels");
	return EraseLocalStorage("");
};

function EraseLocalsaveCheckpoints(){
	return EraseLocalStorage("checkpoint");
};

function EraseLocalsaveHints(){
	return EraseLocalStorage("hintsused");
}

function EraseLocalsave(){
	return CanSaveLocally()&&(EraseLocalsaveLevel(),EraseLocalsaveCheckpoints(),EraseLocalsaveHints());
}


// Load from memory
function LoadLevel(){
	SolvedLevels.levels=LocalStorage("solvedlevels",undefined,Number);
	return CurrentScreen(LocalStorage(""));
}

function LocalloadCheckpoints(){
	return LocalStorage("checkpoint");
}

function LoadHints(){
	return Hints.used=LocalStorage("hintsused",undefined,Number);
}

function GetCheckpoints(){
	if(GetCheckpoints.stack)
		return GetCheckpoints.stack;
	else
		return GetCheckpoints.stack=LocalloadCheckpoints();
}

function LoadCheckpoint(n){
	var stack=GetCheckpoints();

	if(n<stack.length)
		ConsoleAddOnce("Beware! Saving at a past checkpoint will erase former future progress...");
	
	curcheckpoint=Min(Max(n-1,0),stack.length-1); //decrement 1 unit
	return curlevelTarget=stack[curcheckpoint];
}


function PushSaveCheckpoint(levelTarget){
	var stack=GetCheckpoints();
	
	function EvacuateCheckpoints(stack,n){
		var s=stack;
		var i=s.length-1;
		while(n<i){
			i--;
			s.pop();
		}
		return s;
	};
	
	if(curcheckpoint+1<stack.length){
		stack=EvacuateCheckpoints(stack,curcheckpoint);
		ConsoleAdd("Saved in a past checkpoint. Future progress erased.")
	}
	
	stack=stack.concat([levelTarget]);
	curcheckpoint=stack.length-1;
	
	return GetCheckpoints.stack=stack;
}



function LoadGame(){
	if(HasLevel()){
		if(HasCheckpoint()){
			LoadLastCheckpoint();
		}
		return LoadLevel();
	}
}


// Preserve original level save format (within checkpoint stack)

function FormerLevel4Serialization() { //The original one
	var ret = {
		dat : Array.from(level.objects),
		width : level.width,
		height : level.height,
		oldflickscreendat: oldflickscreendat.concat([]),
		//New
		lvl:CurrentScreen()
	};
	return ret;
}


////////////////////////////////////////////////////////////////////////////////
// Winning Logic (non-linear level navigation "jumping")

function MarkWonScreen(screen){
	var screen=screen||CurrentScreen();
	
	EchoLevelWin(screen);
	AddToSolvedScreens(screen);
	LocalsaveLevel(screen);
	
	if(typeof RegisterLevelHonour!=="undefined")
		RegisterLevelHonour();
}

function NextLevel(){
	var curscreen=Min(CurrentScreen(),LastScreen()?LastScreen():CurrentScreen());
	CurrentScreen(curscreen);
	
	HideLevelMessage();
	
	if (TitleScreen())
		StartLevelFromTitle();
	else {
		if(!SolvedAllLevels())
			AdvanceUnsolvedScreen();
		else if(curscreen<LastScreen())
			AdvanceEndScreen();
		else{
			RequestHallOfFame();
			ResetGame();
		}
	}
}

function TitleScreen(t){
	if(typeof t==="undefined")
		return titleScreen;
	else
		return titleScreen=t?true:false;
}

////////////////////////////////////////////////////////////////////////////////
// Level/Message Screen navigation

// Keep track of solved levels

function ScreenMessage(lvlscreen){
	return ObtainStateScreens()[lvlscreen].message;
}
function CurrentScreenMessage(){
	return ScreenMessage(CurrentScreen());
}

function IsScreenMessage(lvlscreen){
	return typeof ScreenMessage(lvlscreen)!=="undefined"
}

function ScreenType(level){
	return typeof level.message==="undefined";	
}

function LevelScreens(){
	if(LevelScreens.l!==undefined)
		return LevelScreens.l;
	else{
		var l=[];
		for(var i=0;i<ObtainStateScreens().length;i++){
			if(ScreenType(ObtainStateScreens()[i]))
				l.push(i);
		}
		return LevelScreens.l=l;
	}
}

function Levels(){
	return LevelScreens().map(LevelNumber);
}

function LevelScreen(n){
	return LevelScreens()[n-1];
}

function SolvedLevels(){
	if(SolvedLevels.levels===undefined)
		SolvedLevels.levels=[];
	return SolvedLevels.levels;
}

function AddToSolvedScreens(curscreen){
	function SortNumber(a,b){return a-b};
	if(!IsScreenMessage(curscreen)&&!LevelScreenSolved(curscreen)){
		SolvedLevels.levels.push(LevelNumber(curscreen));
		SolvedLevels.levels=SolvedLevels.levels.sort(SortNumber);
	}
	return SolvedLevels();
}

function LevelSolved(n){
	return LevelScreenSolved(LevelScreen(n));
}

function LevelScreenSolved(curscreen){
	return In(SolvedLevels(),LevelNumber(curscreen));
}

function UnSolvedLevelScreens(){
	return LevelScreens().filter(function(l){return !LevelScreenSolved(l)});
}

function FirstUnsolvedScreen(){
	if(UnSolvedLevelScreens().length===0)
		return 1+LevelScreens()[MaxLevel()-1];
	else{
		var c=LevelScreens().indexOf(UnSolvedLevelScreens()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelScreens()[c-1];
	}
}

function NextUnsolvedScreen(curscreen){
	var firstusolve=UnSolvedLevelScreens().filter(function(x){return x>=curscreen;})[0];
	var lastsolvebefore=UnlockedLevelScreens().filter(function(x){return x<firstusolve;});
	return Last(lastsolvebefore)+1;
}

function LastScreen(){return ObtainStateScreens().length-1;};

function FinalLevelScreen(){
	var li=UnlockedLevelScreens(); 
	return Last(li);
};

function ClearSolvedLevelScreens(){
	return SolvedLevels.levels=[];
}

function SolvedAllLevels(){
	return LevelScreens().every(LevelScreenSolved);
}

function LevelNumber(curscreen){
	return LevelScreens().filter(function(l){return l<curscreen}).length+1;
}

function CurLevelNumber(){
	return LevelNumber(CurrentScreen());
}


function UnlockedLevels(){
	var LevelLookahead=ObtainLevelLookahead();
	var gateLevels=ObtainGateLevels(); 
	
	if(LevelLookahead<1){
		return Levels();
	}else{
		var showlevels=SolvedLevels();
		var lvl=LevelNumber(FirstUnsolvedScreen());
		var lookahead=1;
		while(lookahead<=LevelLookahead&&lvl<=Levels().length){
			if(In(gateLevels,lvl)&&lookahead>1) //Don't reveal gate level until all previous levels are solved
				break;
			else if(!LevelSolved(lvl)){
				showlevels=showlevels.concat(lvl);
				if(In(gateLevels,lvl))		  //Don't reveal more levels while gate level unsolved
					break;
				else
					lookahead++;
			}
			lvl++;
		}
		//console.log(showlevels);
		return showlevels.sort(function(a,b){return a>b;});
	}
}

function UnlockedLevelScreens(){
	return UnlockedLevels().map(LevelScreen);
}

function MaxLevel(){
	return LevelScreens().length;
}


//Level Title
function LevelTitle(lvl){
	var leveltitles=LevelLoadedTitles();
	if(!leveltitles||!leveltitles[lvl-1])
		return UnnamedLevelTitle(lvl)
	else
		return leveltitles[lvl-1];
}

function UnnamedLevelTitle(lvl){
	return "Select level "+LevelNumberFromTotal(lvl);
}

function LevelGatedTitle(lvl){
	var LevelLookahead=ObtainLevelLookahead();
	if(In(ObtainGateLevels(),lvl)&&!SolvedAllLevelsBefore(lvl))
		return "Level locked: all previous levels required.";
	else if(LevelLookahead>0&&!SolvedRequiredLevelsBefore(lvl,LevelLookahead))
		return "Level locked: all but "+(LevelLookahead-1)+" earlier levels required.";
	else
		return LevelTitle(lvl);
}

function LevelsBefore(lvl,howmany){
	return Levels().filter(function(l){return lvl-howmany<=l&&l<lvl});
}

function SolvedAllLevelsBefore(lvl){
	return LevelsBefore(lvl,lvl).every(function(lvl){return In(SolvedLevels(),lvl)});
}

function SolvedRequiredLevelsBefore(lvl,howmany){
	return LevelsBefore(lvl,lvl).length-LevelsBefore(lvl,lvl).filter(function(lvl){return In(SolvedLevels(),lvl)}).length<howmany;
}


// Level Selector

function ChosenLevelDescription(){
	var DP=CurrentDatapack();
	if(DP){
		var l=FindData("level",CurrentDatapack().qid);
		if(l)
			return ChosenLevelDescription.last=ObtainLevelTitle(UnstarLevel(l));
	}
	
	if(ChosenLevelDescription.last)
		return ChosenLevelDescription.last;
	else
		return ObtainLevelTitle(CurLevelNumber());
}

function LevelSelectorMessage(){
	if(UnlockedLevels().length!==MaxLevel())
		return "Select from "+UnlockedLevels().length+" out of "+MaxLevel()+" levels";
	else
		return "Select one of the "+MaxLevel()+" levels";
}

function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var DPOpts={
			questionname:ChosenLevelDescription(),
			qchoices:UnlockedLevels().map(StarLevelNumber),
			defaultChoice:function(i,c){return UnstarLevel(c)===CurLevelNumber()}
		}
	}
	else{
		var checkpointIndices=Object.keys(GetCheckpoints());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qchoices:checkpointIndices.map(function(l){return (Number(l)+1)+"";}),
			defaultChoice:function(i,c){return Number(c)===checkpointIndices.length}
		}
	}
	
	var LevelSelectorShortcuts=FuseObjects(ObtainKeyActionsGameBar(),{
		"1":function(){DelayLevel(1)},
		"2":function(){DelayLevel(2)},
		"3":function(){DelayLevel(3)},
		"4":function(){DelayLevel(4)},
		"5":function(){DelayLevel(5)},
		"6":function(){DelayLevel(6)},
		"7":function(){DelayLevel(7)},
		"8":function(){DelayLevel(8)},
		"9":function(){DelayLevel(9)},
		"0":function(){DelayLevel(0)}
	});
	
	LevelSelectorShortcuts[ObtainMainKey("levelselector")]=CloseLevelSelector;
	
	RequestDataPack([
			['exclusivechoice',FuseObjects(DPOpts,{
				qsubmittable:false,
				qfield:"level",
				qclass:"level-selector",
				executeChoice:ChooseLevelClose,
				qtype:ExclusiveChoiceSectionsHTML(LevelSections())
			})]
		],
		{
			action:LoadFromLevelSelectorButton,
			qonsubmit:CloseLevelSelector,
			qonclose:GameFocus,
			qdisplay:LaunchBalloon,
			qtargetid:".game-container",
			shortcutExtras:LevelSelectorShortcuts,
			requireConnection:false,
			buttonSelector:"LevelselectorButton",
			spotlight:gameSelector
	});
}

function CloseLevelSelector(){
	if(CurrentDatapack().buttonSelector==="LevelselectorButton")
		CloseCurrentDatapack();
	GameFocus();
}


function MaxLevelDigits(){
	if(MaxLevelDigits.m)
		return MaxLevelDigits.m;
	return MaxLevelDigits.m=Ceiling(Math.log10(1+MaxLevel()));
};

function PadLevelNumber(n){
	return PadLeft(String(n),"0",MaxLevelDigits());
}

function LevelHintStar(n){
	var star="★";
	if(Hints()&&UsedHints(n)!==0)
		star="☆";
	return LevelSolved(n)?star:"";
}

function StarLevelNumber(n){
	return PadLevelNumber(n)+LevelHintStar(n);
}

function StarLevel(l){
	var n=LevelNumber(l);
	return StarLevelNumber(n);
}
function UnstarLevel(l){
	return Number(l.replace("★","").replace("☆",""));
}

function UpdateAccessLevelMessage(){
	ReplaceChildren(ChosenLevelDescription(),".question");
}

Listen("Set level",UpdateAccessLevelMessage);

function LevelNumberFromTotal(lvl){
	return PadLevelNumber(lvl)+"/"+MaxLevel()+LevelHintStar(lvl)
}

function UpdateLevelSelectorButton(lvl){
	if(!lvl)
		lvl=CurLevelNumber(); 
	if(TitleScreen())
		var leveltext="Select level";
	else if(lvl<=MaxLevel())
		var leveltext="Level "+LevelNumberFromTotal(lvl)
	else
		var leveltext="★ All levels ★";
	ReplaceChildren(leveltext,"LevelselectorButton");
}

function LoadFromLevelSelectorButton(qid){
	var levelChoice=FindData("level",qid);
	ChooseLevelClose(levelChoice,qid);
}

function ChooseLevelClose(choice,pid){
	ChooseLevel(choice);
	Close(pid);
	setTimeout(GameFocus,100);
};

function ChooseLevel(choice){
	SelectLevel(UnstarLevel(choice));
};

function SelectLevel(lvl){
	if(HasCheckpoint())
		GoToScreenCheckpoint(lvl);
	else if(In(UnlockedLevels(),lvl))
		SelectUnlockedLevel(lvl);
	else
		console.log("Level "+lvl+" locked!");
}

function SelectUnlockedLevel(lvl){
	//Don't return to same level
	if(lvl===CurLevelNumber()&&!TitleScreen())
		return console.log("stay in lvl ",lvl);
		
	//Go to exactly after the level prior to the chosen one, to read all useful messages, including level title
	var n=lvl<2?0:(LevelScreens()[lvl-2]+1);
	GoToScreen(n);
	
	EchoSelect(lvl,"level");
};


function GoToScreenCheckpoint(n){
	LoadCheckpoint(n);
	loadLevelFromStateTarget(state,CurrentScreen(),curlevelTarget);
	ResizeCanvas();
	
	EchoSelect(n,"checkpoint");
};

function GoToScreen(lvl){
	CurrentScreen(lvl);
	AdvanceLevel();
	ResizeCanvas();
};

// Keyboard to Pick Level - records multiple digits within a 2000 ms timeframe to select the level

function IsUnlockedLevel(n){
	return In(UnlockedLevels(),Number(n));
}

function DelayLevel(n){
	clearTimeout(DelayLevel.timer);
	var t=Date.now();
	if((!DelayLevel.lastTime)||(t-DelayLevel.lastTime>2000)||!IsUnlockedLevel(DelayLevel.level+""+n)){ //Restart
		DelayLevel.level=""+n;
		DelayLevel.lastTime=Date.now();
		var n=Number(DelayLevel.level);
	}
	else{
		DelayLevel.level=DelayLevel.level+""+n;
		DelayLevel.lastTime=Date.now();
		var n=Number(DelayLevel.level);
	}
	
	FocusElement("choice-"+StarLevelNumber(n));
	
}	
	

// Level Progression

function StartLevelFromTitle(){
	if(ObtainNewGameCondition()){//new game
		ResetLevel();
		ResetCheckpoints();
	}
	
	LoadLastCheckpoint();
	LoadLevelOrCheckpoint();
}

function ResetLevel(){
	CurrentScreen(0);
	curlevelTarget=null;
	ClearSolvedLevelScreens();
	ClearLevelRecord();
}


function LoadLastCheckpoint(){
	if(HasCheckpoint()){
		var stack=GetCheckpoints();
		curcheckpoint=stack.length-1;
		curlevelTarget=stack[curcheckpoint];
	}
}

function ResetCheckpoints(){
	curcheckpoint=0;
	EraseLocalsaveCheckpoints();
	GetCheckpoints.stack=[];
}

function ResetGame(){
	EraseLocalsave();
	ClearSolvedLevelScreens();
	ResetLevel();
	ResetCheckpoints();
	ObtainTitleScreenLoader();
	ObtainPlayEndGameSound();
	ClearLevelRecord();
	UpdateLevelSelectorButton()
}

function AdvanceLevel(){
	ObtainLevelTransition();
	LocalsaveLevel(CurrentScreen());
	LoadLevelOrCheckpoint();
	ClearLevelRecord();
	UpdateLevelSelectorButton();
}

function AdvanceUnsolvedScreen(){
	var curscreen=CurrentScreen();
	if(IsScreenMessage(curscreen)&&curscreen<FinalLevelScreen()){
		//console.log("from message");
		CurrentScreen(curscreen+1);
	}
	else if(curscreen>=FinalLevelScreen()||!NextUnsolvedScreen(curscreen)){
		//console.log("from last level");
		CurrentScreen(FirstUnsolvedScreen());
	}
	else{
		//console.log("from anywhere in the middle");
		CurrentScreen(NextUnsolvedScreen(curscreen));
	}		
	AdvanceLevel();	
}

function AdvanceEndScreen(){
	if(CurrentScreen()>=FinalLevelScreen())
		CurrentScreen(CurrentScreen()+1);
	else
		CurrentScreen(FinalLevelScreen()+1);
	
	AdvanceLevel();		
}

function LoadLevelOrCheckpoint(){
	if ((typeof curlevelTarget!=="undefined")&&(curlevelTarget!==null)){
		loadLevelFromStateTarget(state,CurrentScreen(),curlevelTarget);
		curlevelTarget=null;
	}
	else
		ObtainLevelLoader();
}



////////////////////////////////////////////////////////////////////////////////
//Key capturing

function KeyActionsGameBar(){
	var KAGB={};
		KAGB[ObtainMainKey("feedback")]=RequestGameFeedback;
		KAGB[ObtainMainKey("fullscreen")]=RequestGameFullscreen;
		KAGB[ObtainMainKey("hint")]=RequestHint;
		KAGB[ObtainMainKey("keyboard")]=ObtainKeyboardAllowed?RequestKeyboard:Identity;
		KAGB[ObtainMainKey("levelselector")]=ObtainLevelSelectorAllowed?RequestLevelSelector:Identity;
		KAGB[ObtainMainKey("music")]=ToggleCurrentSong;
	return KAGB;
}

//Game keybinding profile
if(typeof ObtainKeyActionsGame==="undefined"){
	
	function ObtainKeyActionsGame(){
		return {
			//Arrows
			"left"		:InstructGameKeyF(37),
			"up"		:InstructGameKeyF(38),
			"right"		:InstructGameKeyF(39),
			"down"		:InstructGameKeyF(40),
			"W"			:InstructGameKeyF(37),
			"A"			:InstructGameKeyF(38),
			"S"			:InstructGameKeyF(39),
			"D"			:InstructGameKeyF(40),
			//Action / Select
			"enter"		:ObtainAction,	//InstructGameKeyF(88),
			"C"			:ObtainAction,	//InstructGameKeyF(88),
			"X"			:ObtainAction,	//InstructGameKeyF(88),
			"spacebar"	:ObtainAction,	//InstructGameKeyF(88),
			// Undo	 
			"Z"			:ObtainUndo,	//InstructGameKeyF(85),
			"U"			:ObtainUndo,	//InstructGameKeyF(85),
			/*"backspace"	:InstructGameKeyF(85),*/
			// Restart
			"R"			:ObtainRestart,	//InstructGameKeyF(82),
			// Quit
			"escape"	:InstructGameKeyF(27),
			"Q"			:InstructGameKeyF(27)
		};
	}
	
	function InstructGameKeyF(newkey){
		return function(ev){ev.keyCode=newkey;InstructGame(ev)}
	}
	
	function InstructGame(event){
		event.preventDefault();
		var key=event.keyCode;
	
		//Avoid repetition?
		if (In(keybuffer,key))
			return;
		
		//Instruct the game
		if (!In(keybuffer,key)){
			keybuffer.splice(keyRepeatIndex,0,key);
			keyRepeatTimer=0;
			CheckRegisterKey(event);
			}
	}
	
		//Execute key instructions
	function CheckRegisterKey(event){
		checkKey(event,true);
		RegisterMove(event.keyCode);
	}
		
}


//Keybind to game element
var FullShortcuts=FuseObjects(ObtainKeyActionsGameBar(),ObtainKeyActionsGame());
OverwriteShortcuts(ParentSelector(gameSelector),FullShortcuts);


function RequestGameFullscreen(){
	FullscreenToggle(".game-supra-container");
	setTimeout(GameRotation,500);
}




////////////////////////////////////////////////////////////////////////////////
//Colorise game bar

function Stylesheet(){return".game-supra-container{\
	--white:rgba(255,255,255,var(--t));			/*#FFF*/\
	--smokewhite:rgba(241,241,241,var(--t))		/*#f1f1f1*/;\
	--darkblue:rgba(7,0,112,var(--t))			/*#070070*/;\
	--blue:rgba(0,15,255,var(--t))				/*#000FFF*/;\
	--lightblue:rgba(25,130,237,var(--t))		/*#1982ed*/;\
	--turquoise:rgba(59,248,222,var(--t))		/*#3bf8de*/;\
	--green: rgba(70,244,111,var(--t))			/*#46f46f*/;\
	--lightgreen:rgba(12,252,189,var(--t))				   ;\
	--yellow: rgba(240,248,175,var(--t))		/*#f0f8af*/;\
	--lightyellow:rgba(255,249,201,var(--t))	/*#fff9c9*/;\
	--beije:rgba(255,240,229,var(--t))					   ;\
	--bgcolour:"+ObtainBGColor()+"	/*#fff9c9*/;\
	--fgcolour:"+ObtainFGColor()+"	/*#fff9c9*/;\
	}";
}


function ReplaceColours(stylesheet,BackgroundColour,ForegroundColour){
	var styleSheet=stylesheet;
	var Lmax=Lightness(BackgroundColour);
	
	var PrimaryDark=(ForegroundColour=ObtainFGColor());
	var PrimaryLight=(BackgroundColour=ObtainBGColor());
	
	// Pick the most saturated colour as text colour
	if(Saturation(BackgroundColour)===0){
		PrimaryLight=ForegroundColour;
	}
	if(Saturation(ForegroundColour)===0){
		PrimaryDark=BackgroundColour;
	}
	
	//Invert in case of dark background
	if(Lightness(BackgroundColour)<0.5){
		styleSheet=styleSheet.replace("rgba(255,255,255,var(--t))",	HEX(DarkenTo(PrimaryLight,-Lmax*0.50+0.950)).colour);
		styleSheet=styleSheet.replace("rgba(241,241,241,var(--t))",	HEX(DarkenTo(PrimaryLight,-Lmax*0.50+0.925)).colour);

		styleSheet=styleSheet.replace("rgba(7,0,112,var(--t))",		HEX(DarkenTo(PrimaryDark,(-Lmax*0.22+0.22))).colour);
		styleSheet=styleSheet.replace("rgba(0,15,255,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.40+0.40))).colour);
		styleSheet=styleSheet.replace("rgba(25,130,237,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.51+0.51))).colour);
		styleSheet=styleSheet.replace("rgba(59,248,222,var(--t))",	HEX(DarkenTo(PrimaryDark, -Lmax*0.65+0.65 )).colour);
		styleSheet=styleSheet.replace("rgba(70,244,111,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.91+0.91))).colour);
		styleSheet=styleSheet.replace("rgba(12,252,189,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.92+0.92))).colour);
		styleSheet=styleSheet.replace("rgba(240,248,175,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.93+0.93))).colour);
		styleSheet=styleSheet.replace("rgba(255,249,201,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.95+0.95))).colour);
		styleSheet=styleSheet.replace("rgba(255,240,229,var(--t))",	HEX(DarkenTo(PrimaryDark,(-Lmax*0.97+0.97))).colour);
		
	}
	else{
		styleSheet=styleSheet.replace("rgba(255,255,255,var(--t))",	HEX(LightenTo(PrimaryLight,0.925)).colour);
		styleSheet=styleSheet.replace("rgba(241,241,241,var(--t))",	HEX(LightenTo(PrimaryLight,0.900)).colour);

		styleSheet=styleSheet.replace("rgba(7,0,112,var(--t))",		HEX(LightenTo(PrimaryDark,(Lmax*0.22))).colour);
		styleSheet=styleSheet.replace("rgba(0,15,255,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.40))).colour);
		styleSheet=styleSheet.replace("rgba(25,130,237,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.51))).colour);
		styleSheet=styleSheet.replace("rgba(59,248,222,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.92))).colour);
		styleSheet=styleSheet.replace("rgba(70,244,111,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.93))).colour);
		styleSheet=styleSheet.replace("rgba(12,252,189,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.92))).colour);
		styleSheet=styleSheet.replace("rgba(240,248,175,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.94))).colour);
		styleSheet=styleSheet.replace("rgba(255,249,201,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.95))).colour);
		styleSheet=styleSheet.replace("rgba(255,240,229,var(--t))",	HEX(LightenTo(PrimaryDark,(Lmax*0.97))).colour);
	}
		
	return styleSheet;
}

////////////////////////////////////////////////////////////////////////////////
//Load Level Info

function LevelInfo(){
	return LevelInfo.info||false;
}

function LevelLoadedTitles(){
	if(!LevelLoadedTitles.titles){
		if(!LevelInfo())
			return false;
		else
			return LevelLoadedTitles.titles=LevelInfo().map(function(x){return x.title});
	}
	else
		return LevelLoadedTitles.titles;
}

function LevelSections(){
	if(!LevelSections.sections){
		if(!LevelInfo())
			return false;
		else{
			LevelSections.sections=[];
			var s;
			for(var i=0;i<LevelInfo().length;i++){
				if(s=LevelInfo()[i].section)
					LevelSections.sections.push({section:s,number:i+1});
			}
			return LevelSections.sections;
		}
	}
	else
		return LevelSections.sections;
}

function ExtractLevelLine(hintparagraph){
	var titleline=hintparagraph.replace(/\n.*/mgi,""); //remove all but the first line
		titleline=titleline.replace(/(?:\-\-?.*)/i,""); //remove comments : ----etc....

	var title=titleline.replace(/(?:^level\s*)/i,""); //isolate level title and subsequent info
	if(titleline===title)
		return "";
	
	return title;
}

function ParseAssignLevelInfo(hintparagraph){
	var info={};
	var titleline=ExtractLevelLine(hintparagraph);
	
	var unclockconditions=titleline.replace(/.*\brequire\:/i,"");
	if(unclockconditions!==titleline)
		info["unlock"]=ParseNoTrailingWhitespace(unclockconditions);
	
	titleline=titleline.replace(/\brequire\:.*/i,""); //remove unlock conditions
	
	var section=titleline.replace(/.*\§\s*/g,"");
	if(section!==titleline)
		info["section"]=ParseNoTrailingWhitespace(section);

	titleline=titleline.replace(/\§.*/g,"");//remove section

	var title=ParseNoTrailingWhitespace(titleline);
		title=ParseDenumberLine(title);
		title=ParseNoTrailingWhitespace(title);
	if(title)
		info["title"]=title;

	return info;
}


function ParseLevelInfo(hintdata){
	var titlesperlevel=HintParagraphArray(hintdata);
	return titlesperlevel.map(ParseAssignLevelInfo);
}

////////////////////////////////////////////////////////////////////////////////
//Hints

ListenOnce("GameBar",LoadHintsFile);

function Hints(lvl){
	if(!Hints.cached){
		return false;
	}
	
	if(lvl===undefined)
		return Hints.cached;
	else
		return Hints.cached[lvl-1];
}

function LoadHintsFile(){
	if(!GameConsole()&&!Hints.cached){
		
		if(isFileLink(pageURL()))
			Hints.path="https://pedropsi.github.io/hints/";
		else
			Hints.path="hints/";
		
		LoadData(Hints.path+pageIdentifierSimple()+".txt",LoadHintData);
	}
}

function LoadHintData(hintdata){
	if(hintdata===""){
		console.log("no hints found.");
	}
	else{
		Hints.cached=ParseHintsFile(hintdata);
		LevelInfo.info=ParseLevelInfo(hintdata);
		if(Hints.cached.every(function(h){return h.length<1}))//If no hints inside the file, don't show thr button
			return Hints.cached=false;
		if(Hints.cached){
			if(LoadHints().length===0)
				Hints.used=Hints.cached.map(function(x){return 0}); //will add 1s progressively as used
			ShowButton(HintButton);
		}
	}
}

function HintDisplay(reference){
	var fullpath=Hints.path+pageIdentifierSimple()+"/"+reference.replace(/\s*/,"");
	if(IsImageReference(fullpath)){
		var parentid=GenerateId();
		LoadImage(fullpath,parentid);
		return "<div class='hint' id='"+parentid+"'>"+PlaceholderImageHTML()+"</div>";
	}
	return "<div class='hint'><p>"+reference+"</p></div>";
}

function HintParagraphArray(hintstxt){
	var hintsperlevel=hintstxt.split(/(?:\n\s*)(?:\n\s*)+/); //Two or more newlines separate level items. Lines starting by level... are ignored
	return hintsperlevel.filter(function(h){return h!=="";}); //ignore empty blocks
}

function ParseDenumberLine(hintline){ //Remove numeric indicators, optionally split by full stops
	return hintline.replace(/^(\d+)(\.\d+)*\s*/,"");
}

function ParseNoTrailingWhitespace(hintline){ //Remove numeric indicators, optionally split by full stops
	return hintline.replace(/^\s*/,"").replace(/\s*$/,"");
}


function ParseHintsFile(hintstxt){//ignore most whitespace at junctions

	hintsperlevel=HintParagraphArray(hintstxt);
	
	function ParseHintParagraph(hintparagraph){ //One hint per line
		var hintslines=hintparagraph.replace(/(?:^level.*)/i,"");
		hintslines=hintslines.split(/\n\s*/);
		
		hintslines=hintslines.map(ParseDenumberLine);
		hintslines=hintslines.filter(function(l){return l!==""});
		
		return hintslines;
	}
	
	hintsperlevel=hintsperlevel.map(ParseHintParagraph);
	
	for(var i=hintsperlevel.length;i<Levels().length;i++)
		hintsperlevel[i]=[];
	
	return hintsperlevel;
}



function CurrentLevelHints(){
	return Hints(CurLevelNumber());
}

function SeeHint(lvl,hintN){
	if(UsedHints(lvl)<hintN&&Hints(lvl).length>=hintN&&!LevelSolved(lvl)){
		Hints.used[lvl-1]=hintN;
		LocalsaveHints();
		EchoHint(lvl,hintN);
	}
}

function AvailableHints(lvl){
	if(lvl===undefined) //Global
		return Levels().map(AvailableHints).reduce(Accumulate);
	else				//In particular level
		return	Hints(lvl).length;
}

function UsedHints(lvl){
	if(lvl===undefined) //Global
		return Levels().map(UsedHints).reduce(Accumulate);
	else				//In particular level
		return	Hints.used[lvl-1];
}

function HintProgress(lvl,hintN){
	var a=AvailableHints(lvl);
	return "★".repeat(hintN)+"☆".repeat(Max(a-hintN,0));
}

function HintButton(){
	return GameBarButtonHTML("hint",{onclick:'RequestHint();'});	
}

function CloseHint(){
	if(CurrentDatapack().buttonSelector==="HintButton")
		CloseCurrentDatapack();
	GameFocus();
}

function RequestNextHint(){
	CycleNextBounded(CurrentLevelHints());
	CloseHint();
	setTimeout(RequestHint,500);
}

function RequestPrevHint(){
	CyclePrevBounded(CurrentLevelHints());
	CloseHint();
	setTimeout(RequestHint,500);	
}


RequestHint["tips-welcome"]=[
			"<p>Welcome to the <b>Hint Service</b>.</p><p>Press <b>"+ObtainSymbol("hint")+"</b> or <kbd>"+ObtainMainKey("hint")+"</kbd> anytime to reveal a hint!</p>",
			"You got this! Now go ahead and play!"
]

if(HasHOF()){
	RequestHint["tips-welcome"].splice(1,0,"Please note that <b>Hall of Fame</b> entries now count how many hints are used!");
}

RequestHint["tips-interlevel"]=[
			"Just relax and have fun!",
			"Remember to pause once in a while!",
			"If you like this game, share it with your friends!",
			"Open the level selector with <kbd>"+ObtainMainKey("levelselector")+"</kbd>, then type a <kbd>number</kbd>.",
			"Go Fullscreen by pressing "+ObtainSymbol("Fullscreen")+" or <kbd>"+ObtainMainKey("fullscreen")+"</kbd>!",
			"Play or pause the music by pressing "+ObtainSymbol("music")+" or <kbd>"+ObtainMainKey("music")+"</kbd>!"
]

if(HasGameFeedback()){
	RequestHint["tips-interlevel"].splice(1,0,"Email Pedro PSI feedback by pressing "+ObtainSymbol("feedback")+" or <kbd>"+ObtainMainKey("feedback")+"</kbd>, anytime!");
}


function RequestHint(){
	if(!Hints())
		return console.log("hints file not found");
	
	if(!RequestHint.requested||TitleScreen()){
		RequestHint.requested=Hints().map(function(hl){return hl.map(function(x){return false;})});
		var tip=CycleNextBounded(RequestHint["tips-welcome"]);
		var DFOpts={questionname:tip};
		var DPFields=[['plain',DFOpts]];
	}
	else if(IsScreenMessage(CurrentScreen())){
		var tip=CycleNext(RequestHint["tips-interlevel"]);
		var DFOpts={questionname:"<b>General tip:</b> "+HintDisplay(tip)};
		var DPFields=[['plain',DFOpts]];
	}
	else{
		var curlevelHints=CurrentLevelHints();
		
		if(curlevelHints.length===0) //Substitute for no hints
			curlevelHints=["Sorry! No hints for this level... but you can do it!"];
		
		var tip=CycleStay(curlevelHints);
		tip=HintDisplay(tip);
		
		var p=CyclePosition(curlevelHints);
		SeeHint(CurLevelNumber(),p+1);
		
		var navichoices=["◀","OK","▶"];
		var naviactions={
			"◀":RequestPrevHint,
			"▶":RequestNextHint,
			"OK":CloseHint
		};

		if(p===0){
			navichoices.shift();
			delete naviactions["◀"];
		}
		if(p===curlevelHints.length-1){
			navichoices.pop();
			delete naviactions["▶"];
		}
		
		var DFOpts={questionname:tip};
		var DFHintCounter={questionname:"<b>"+HintProgress(CurLevelNumber(),p+1)+"</b>"};
		var DPFields=[
			['plain',DFHintCounter],
			['plain',DFOpts],
			['navi',{
				qchoices:navichoices,
				executeChoice:function(choice,pid){
					if(In(naviactions,choice))
						naviactions[choice]();
				}
			}]
		];
		
	}
	
	RequestDataPack(DPFields,{
		actionvalid:CloseHint,
		qonsubmit:CloseHint,
		qonclose:GameFocus,
		qdisplay:LaunchAvatarBalloon,
		qtargetid:".game-container",
		requireConnection:false,
		shortcutExtras:FuseObjects(ObtainKeyActionsGameBar(),{"H":CloseHint}),
		buttonSelector:"HintButton",
		spotlight:gameSelector
	});
}


//Hints Honours
	
function HintsHonour(){
	if(!Hints())
		return "";
	else if(UsedHints()===0)
		return "no hints ★";
	else{
		var h=UsedHints();
		if(h===1)
			return "1 hint ☆";
		else if(h<=AvailableHints()/7)
			return h+" hints ☆";
		else
			return h+" hints  ";
	}
}

//Onscreen keyboard

function RequestKeyboard(){
	
	if(!ObtainKeyboardAllowed)
		return;
	
	var DFOpts={
		executeChoice:ObtainGameAction,
		qchoices:ObtainKeyboardKeys(),
		qchoicesViewF:ObtainSymbol
	}
	
	var Shortcuts=ObtainKeyActionsGameBar();
	
	RequestDataPack([
			['keyboard',DFOpts]
		],
		{
			action:console.log,
			qonsubmit:Identity,
			qonclose:GameFocusAndRestartUndoButtons,
			qdisplay:ObtainKeyboardLauncher(),
			qtargetid:ObtainKeyboardTarget(),
			shortcutExtras:Shortcuts,
			requireConnection:false,
			buttonSelector:"KeyboardButton",
			spotlight:gameSelector,
			closeonblur:false,
			layer:-1
	});
	
	function HideButtons(){
		ReplaceElement(HiddenHTML("RestartButton"),"RestartButton");
		ReplaceElement(HiddenHTML("UndoButton"),"UndoButton");
	}
	
	HideButtons();
}

function GameFocusAndRestartUndoButtons(){
	GameFocus();
	
	function RestoreButtons(){
		ReplaceElement(RestartButton(),"RestartButton");
		ReplaceElement(UndoButton(),"UndoButton");
	}
	
	setTimeout(RestoreButtons,100); //Needed
}

function GameKeyboardKeys(){
	return [["undo","restart"]]; // Undo and Restart
}



////////////////////////////////////////////////////////////////////////////////
//Better inter-level messages
function ShowLevelMessage(lvlscreen){
	if(!lvlscreen)
		lvlscreen=CurrentScreen();
	
	HideLevelMessage();
	AppendElement("<div class='game-message-container'><div class='game-message'><p>"+CurrentScreenMessage()+"</p></div></div>",gameSelector);
	GameFocus();
}

function HideLevelMessage(){
	RemoveElements('.game-message-container');
}


////////////////////////////////////////////////////////////////////////////////
//Related games
function MoreButton(){
	return GameBarButtonHTML("more",{onclick:'RequestMore();'});	
}

ListenOnce("LoadPGD",function(){ShowButton(MoreButton)});

function RequestMore(){
	if(!GameEntryData)
		return;
	var id=pageSearch("game");
	var data=GameEntryData["game-console.html?game="+id];
	if(!id||!data)
		return;
	
	var author=data["author-consensus"];
	function SameAuthor(au){
		return function(d){
			var d=GameEntryData[d];
			return In(d["author-consensus"],au)||In(au,d["author-consensus"]);
		}
	}
	var games=GameEntryData.list.filter(SameAuthor(author)).map(function(id){return GameDropDownButtonHTML(id,false)});
	var DPFields=[
			['plain',{questionname:"More games by: <b>"+author+"</b>"}],
			['plain',{questionname:games.join("\n")}],
		];

	RequestDataPack(DPFields,{
		qonclose:GameFocus,
		qdisplay:LaunchAvatarBalloon,
		qtargetid:".game-container",
		requireConnection:false,
		shortcutExtras:ObtainKeyActionsGameBar(),
		buttonSelector:"MoreButton",
		spotlight:gameSelector
	});
}

