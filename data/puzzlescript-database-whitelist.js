function Whitelist(){ //Sort descending by expected number of submissions
	return [
		/^https\:\/\/[^\#\^\~\\\/\|\.\:\;\,\s\?\=\}\{\[\]\&\'\"\@\!]*\.itch\.io\/.*/,
		/^https\:\/\/(www\.)?puzzlescript\.net\/play\.html\?p\=.*/,
		/^https\:\/\/(www\.)?puzzlescript\.net\/editor\.html\?hack\=.*/,
		/^https\:\/\/[^\#\^\~\\\/\|\.\:\;\,\s\?\=\}\{\[\]\&\'\"\@\!]*\.github\.io\/.*/i,
		/^http\:\/\/htmlpreview\.github\.io\/\?https\:\/\/raw\.githubusercontent\.com\/.*/i,
		/^https\:\/\/[^\#\^\~\\\/\|\.\:\;\,\s\?\=\}\{\[\]\&\'\"\@\!]*\.github\.io\/.*/i,
		/^https\:\/\/(www\.)?increpare\.com\/.*/,
		/^https?\:\/\/(www\.)?draknek\.org\/.*/,
		/^https\:\/\/(www\.)?newgrounds\.com\/portal\/view\/.*/,
		/^https?\:\/\/(www\.)?jackkutilek\.com\/puzzlescript\/.*/,
		/^https\:\/\/(www\.)?sokobond\.com\/.*/,
		/^https\:\/\/(www\.)?streamingcolour\.com\/liveapps\/puzzlescript\/.*/,
		/^https\:\/\/(www\.)?struct\.ca\/games\/.*/,
		/^https\:\/\/benjamindav\.is\/.*/,
		/^https\:\/\/axaxaxas\.herokuapp\.com\/games\/.*/
	];
}

var KnownAuthors={
	"unblock":"NOA Cube Studio",
	"dis pontibus II remix":"NOA Cube Studio",
	"Rose":"Jared Piers",
	"Im too far gone":"Jack Lance",
	"skeleton assembler 2":"Ethan Clark",
	"Cannonclobber":"Jere Majava",
	"Grunt work of the revolution":"Giles Graham"
}

var AuthorAliases={
	"Jere":"Jere Majava",
	"jjmajava":"Jere Majava",
	"nooa majava":"Jere Majava",
	"octoConnors":"Connorses",
	"octoConnors":"Connorses",
	"Connorses [Loneship Games]":"Connorses",
	"Connorses/Loneship Games":"Connorses",
	"Connorses / Loneship Games":"Connorses",
	"copyright of Stuart Burfield":"Stuart Burfield",
	"https:soundcloud.comridlaa":"Rosa Francesca",
	"Tom Hermans @Auroriax":"Auroriax (Tom Hermans)",
	"Tom Hermans [@Auroriax]":"Auroriax (Tom Hermans)",
	"Auroriax Tom H.":"Auroriax (Tom Hermans)",
	"Auroriax":"Auroriax (Tom Hermans)",
	"Ricky":"Ricky Cruz",
	"Para":"Parachor",
	"pAAraK_or":"Parachor",
	"pAA-raK_or":"Parachor",
	"@dennishcau":"Dennis Au",
	"TophWells":"Toph Wells"
}

function KnownAuthor(title){
	if(In(KnownAuthors,title))
		return KnownAuthors[title];
	else
		return "undefined";
}