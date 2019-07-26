// Add the game container to the page
PrependElement('<div class="game-container"><div id="puzzlescript-game" class="game"><canvas id="gameCanvas"></canvas></div></div>',"body");

// Load all Puzzlescript Modules & Cartridge
var puzzlescriptModules=[
/*Puzzlescript modules*/
"globalVariables",
"debug_off",
"font",
"rng",
"riffwave",
"sfxr",
"codemirror",
"colors",
"graphics",
"engine",
"parser",
"compiler",
"inputoutput",

/*Modified touch module*/
"mobile",

/*Extras*/
"data-game-extras",

/*Load game cartridge*/
"data-game-loader"
]

puzzlescriptModules.map(LoaderInFolder("codes/game/modules"));