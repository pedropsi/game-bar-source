//////////////////////////////////////////////////////////////////////
//Form Types

var DESTINATION_HOF={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"identifier\",\"name\",\"honour\"]",
	sheet:"Hall of fame",
	name:"HOF",
	Data:function(qid){return{
		identifier:pageTitle(),
		name:FindData("name",qid),
		honour:GetHonour()
		}}
	}

// Honour
if(!GetHonour){
	function GetHonour(){return HintsHonour()}; ///function to be overriden(customised for) in each game, otherwise blank
}

var who=UserId();	
var DESTINATION_FEEDBACK={
	url:"https://script.google.com/macros/s/AKfycbwB-a8j-INbkzTiQFJ55qETLYkdZrRvSg2s8urj9bPbG0XkBg9z/exec",
	headers:"[\"identifier\",\"context\",\"question\",\"answer\",\"name\",\"state\"]",
	sheet:"Feedback",
	name:"Feedback",
	Data:function(qid){
		return{
			identifier:document.body.id,
			context:String(CurLevelNumber()),
			question:GetElement(".question",qid).innerHTML,
			answer:FindData("answer",qid),
			name:who,
			state:FindData("snapshot",qid)==="yes"?PrintGameState():"---"
			}}
}

function AnonimiseBlank(name){
	if(name!==undefined&&SomeTextValidate(name))
		return name;
	else
		return "Anonymous fan "+RandomChoice("♩♬♪♬♫")+RandomChoice("♩♬♪♬♫")+RandomChoice("♩♬♪♬♫");
}

var DESTINATION_GUESTBOOK={
	url:DESTINATION_HOF.url,
	headers:"[\"name\",\"identifier\",\"comment\",\"id\"]",
	sheet:"Guestbook",
	name:"Guestbook",
	Data:function(qid){return{
		identifier:pageTitle(),
		comment:FindData("answer",qid),
		name:AnonimiseBlank(FindData("name",qid)),
		id:RequestMessageReply.currentid
		}}
	}

function commentID(){return "no comment yet!"};
var DESTINATION_COMMENT={
	url:DESTINATION_GUESTBOOK.url,
	headers:DESTINATION_GUESTBOOK.headers,
	sheet:DESTINATION_GUESTBOOK.sheet,
	name:"Comments",
	Data:function(qid){return{
		identifier:commentID(),
		comment:FindData("answer",qid),
		name:FindData("name",qid),
		}}
	}
	
var DESTINATION_SUBSCRIPTION={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"name\",\"address\"]",
	sheet:"Subscription",
	name:"Subscription",
	Data:function(qid){return{
		name:FindData("name",qid),
		address:FindData("address",qid)
		}}
	}

var DESTINATION_ORDER={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"address\"]",
	sheet:"Order",
	name:"Order",
	Data:function(qid){return{
		identifier:pageTitle(),
		address:FindData("address",qid)
		}}
	}

var DESTINATION_KEYS={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"key\"]",
	sheet:"Keys",
	name:"Keys",
	Data:function(qid){return{
		identifier:pageTitle(),
		key:FindData("answer",qid)
		}}
	}
	
var DESTINATION_PASS={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"name\",\"address\",\"account\"]",
	sheet:"Pass",
	name:"Pass",
	Data:function(qid){return{
		identifier:pageTitle(),
		name:FindData("name",qid),
		address:FindData("address",qid),
		account:FindData("answer",qid),
		type:FindData("type",qid)
		}}
	}

DESTINATIONS[DESTINATION_HOF.name]=DESTINATION_HOF;
DESTINATIONS[DESTINATION_GUESTBOOK.name]=DESTINATION_GUESTBOOK;
DESTINATIONS[DESTINATION_COMMENT.name]=DESTINATION_COMMENT;
DESTINATIONS[DESTINATION_FEEDBACK.name]=DESTINATION_FEEDBACK;
DESTINATIONS[DESTINATION_SUBSCRIPTION.name]=DESTINATION_SUBSCRIPTION;
DESTINATIONS[DESTINATION_ORDER.name]=DESTINATION_ORDER;
DESTINATIONS[DESTINATION_KEYS.name]=DESTINATION_KEYS;
DESTINATIONS[DESTINATION_PASS.name]=DESTINATION_PASS;

//////////////////////////////////////////////////////////////////////
//Hall of Fame

function RequestHallOfFame(){
	
	if(/game\-console/.test(pageURL()))
		return;
	
	RequestDataPack([
	['alias',{
		questionname:"Enter the Hall of Fame:",
		qplaceholder:"Your name or alias",
		qrequired:true,
		qerrorcustom:"The Hall of Fame's guards ask for at least 2 alphanumerics!"}
	]],
	{
		destination:"HOF",
		qonclose:RequestModalWinnerMessage,
		qonsubmit:RequestModalWinnerMessage
	});
	
}

function RequestModalWinnerMessage(previousDP){
	
	function DestinationChoice(choice){
		if(choice==="Public message in Guestbook")
			return "Guestbook";
		else
			return "Feedback";
	}
	
	RequestDataPack([
		['answer',{
			questionname:"As a winner, what would you tell Pedro PSI?",
		}],
		['exclusivechoice',{
			questionname:"",
			qfield:"whence",
			qchoices:["Private message","Public message in Guestbook"],
			executeChoice:function(choice,id){
				SetData("destination",DestinationChoice(choice),id);
			}
		}]
	],
	{
		thanksmessage:"Thank you for your message.",
		qonclose:GameFocus,
		qonsubmit:GameFocus,
		findDestination:function(DP){return DestinationChoice(FindData("whence",DP.qid));}
	}
	);
	
}


//////////////////////////////////////////////////////
// Real time Feedback Requests

function RequestGameFeedback(){

	if(!RequestGameFeedback.requests)
		RequestGameFeedback.requests=[];
	  
	function RecordAndLaunchThanksBalloon(DP){
		RequestGameFeedback.requests.push(CurrentScreen());
		LaunchConsoleThanks(DP);
		FocusAndResetFunction(RequestGameFeedback,GameFocus)();};
	
	var DPsettingsObj={
		qtargetid:ParentSelector(gameSelector),
		qdisplay:LaunchBalloon,
		qonsubmit:RecordAndLaunchThanksBalloon,
		qonclose:FocusAndResetFunction(RequestGameFeedback,GameFocus),
		shortcutExtras:FuseObjects(ObtainKeyActionsGameBar?ObtainKeyActionsGameBar():{},{"E":CloseFeedback}),
		thanksmessage:"★ Thank you for your feedback! ★",
		buttonSelector:"FeedbackButton",
	};
	
	var DFsettingsObj={};
	var DFSnapshot=['snapshot',{}];
	  
	function HasFeedback(){return In(RequestGameFeedback.requests,CurrentScreen());};
	
	if(CurrentDatapack()&&CurrentDatapack().buttonSelector==="FeedbackButton")
		CloseCurrentDatapack();
	else if(TitleScreen()){
		DFsettingsObj.questionname="<p>Press ✉ or <kbd>E</kbd> as soon as you start the game to Email Pedro PSI real-time feedback. Much appreciated!</p>";
		RequestDataPack([['plain',DFsettingsObj]],DPsettingsObj);
	}
	else if(HasFeedback()){
		DFsettingsObj.questionname="Any further comments on level"+CurLevelNumber()+"?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}
	else if(!ScreenMessage(CurrentScreen())){
		DFsettingsObj.questionname="What do you think of level "+CurLevelNumber()+", so far?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}
	else{
		DFsettingsObj.questionname="Comments or ideas?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}

}

function CloseFeedback(){
	if(CurrentDatapack().buttonSelector==="FeedbackButton")
		CloseCurrentDatapack();
	GameFocus();
}

function PrintGameState(){
	return document.getElementById("gameCanvas").toDataURL();
}

///////////////////////////////////////////////////////////////////////////////
// Guestbook & Comments

function RequestGuestbook(){
	RequestDataPack([
		['answer',{
			questionname:"Your message",
			thanksmessage:"Thank you for your message in the Guestbook!"}],
		['alias',{}]
	],{
		destination:'Guestbook'
		}
	)
}

function RequestMessageReply(nid){
	RequestMessageReply.currentid=nid;
	RequestDataPack([
		['answer',{
			questionname:"Your polite reply",
			qplaceholder:"I concur/beg to differ ...",
			thanksmessage:"Your reply has been posted! Thank you."}],
		['alias',{}]
	],{
		destination:'Guestbook'
		}
	)
}


function commentAddress(e){
	var f=1;
	var title=e;
	while(f!=0&&f<=100){
		f++;
		title=title.nextSibling;
		if(title.tagName==="H3"){f=0}
	}
	return title.innerText;
}



function RequestComment(title,elemsubtitle){
	commentID=function(){return title+": "+commentAddress(elemsubtitle);}; 	//redefine this global function dynamically
	
	RequestDataPack([
		['answer',{
			questionname:"Your comment"
		}],
		['alias',{}]
	],{
		destination:'Comments'
	});
}

//////////////////////////////////////////////////////////////////////
//Subscribe

function OpenModalSubscribe(){
	RequestDataPack([
		['email',{
			destination:'Subscription',
			questionname:"Subscribe to be the first to know about Pedro PSI's next project!",
			thanksmessage:"Thank you for subscribing!"
		}],
		['name',{}]],
		{
			destination:'Subscription'}
		)
	}

//////////////////////////////////////////////////////////////////////
//Order

function OpenModalPreOrder(campaigntext){
	
	RequestDataPack([['email',{questionname:campaigntext}]],{
			destination:'Order',
			thanksmessage:"Your booking was placed. Thank you!"
		});
}


//////////////////////////////////////////////////////////////////////
//News
function News(){
	if(pageIdentifier()!=="skilleblokker"&&!inConfig("📰»"))
		ConsoleAdd("<b>Pedro PSI's <em>news service</em>:<a href='skilleblokker.html' target='_blank'>Skilleblokker</a> spillet utgitt!");
	activateConfig("📰»");
};

//News();

//////////////////////////////////////////////////////////////////////
//Media Pass

function RequestMediaPass(){
	RequestDataPack([
		['name',{
			qrequired:true,
			questionname:"What's your name?",
			qplaceholder:"(real or artistic name)"}],
		['answer',{
			questionname:"Through which channels do you intend to review this game?",
			qplaceholder:"e.g. which blog, magazine, youtube channel, twitch account, etc..."}],
		['email',{
			questionname:"Your email(to receive the key)"
		}]],
		{
			thanksmessage:"Your request is being processed - please allow 1-2 business days.",
			destination:'Pass'
			}
		)
}

//////////////////////////////////////////////////////////////////////
//PWA Install

function RequestPWAInstall(){
	RequestDataPack([
		['exclusivechoice',{
			questionname:"Add "+pageTitle()+" to your homescreen Apps?",
			qchoices:["Maybe later...","Yes, please!"],
			executeChoice:InstallPWAMaybe,
			qsubmittable:false
			}],
		['plain',{
			questionname:"Why? Easy accessible, even offline (beta). All feedback welcome!"
			}]],
		{
			qdisplay:LaunchConsoleMessage
		}
	)
}

var installPWAEvent=false;
window.addEventListener('beforeinstallprompt',function(e){
	installPWAEvent=e;
	RequestPWAInstall();
});

function InstallPWAMaybe(choice,id){
	if(choice==="Yes, please!"){
		if(!installPWAEvent.prompt){
			ConsoleAdd("Sorry, your browser is unable to ask for PWA installation - reporting back to Pedro PSI...");
			RegisterPWA('BrowserCannot');
		}
		else{
			installPWAEvent.prompt();
			installPWAEvent.userChoice.then(function(choiceResult){
				if(choiceResult.outcome==='accepted'){
					RegisterPWA('Install');
				}else{
					RegisterPWA('Dismiss');
				}
				deferredPrompt = null;
			});
		}
	}
	CloseCurrentDatapack();
}

window.addEventListener('appinstalled',function(event){
	ConsoleAdd(pageTitle()+" added to the homescreen. Enjoy!");
});
