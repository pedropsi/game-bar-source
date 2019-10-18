function Whitelist(){ //Sort descending by expected number of submissions
	return [
		/^https\:\/\/[^\#\^\~\\\/\|\.\:\;\,\s\?\=\}\{\[\]\&\'\"\@\!]*\.itch\.io\/.*/,
		/^https\:\/\/(www\.)?puzzlescript\.net\/play\.html\?p\=.*/,
		/^https\:\/\/(www\.)?puzzlescript\.net\/editor\.html\?hack\=.*/,
		/^https\:\/\/[^\#\^\~\\\/\|\.\:\;\,\s\?\=\}\{\[\]\&\'\"\@\!]*\.github\.io\/.*/i,
		/^http\:\/\/htmlpreview\.github\.io\/\?https\:\/\/raw\.githubusercontent\.com\/ThatScar\/PuzzleScript\/.*/i,
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