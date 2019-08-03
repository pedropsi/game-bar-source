//////////////////////////////////////////////////////////////////////
//Form Types

var DESTINATION_HOF={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"identifier\",\"name\",\"honour\"]",
	sheet:"Hall of fame",
	name:"HOF",
	Data:function(qid){return {
		identifier:pageTitle(),
		name:FindData("name",qid),
		honour:GetHonour()
		}}
	}

if (typeof(GetHonour)==="undefined"){
	function GetHonour(){return " ";} //function to be overriden (customised for) in each game, otherwise blank
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
			context:String(LevelNumber(curlevel)),
			question:FindData("questionname",qid),
			answer:FindData("answer",qid),
			name:who,
			state:FindData("snapshot",qid)?PrintGameState():"---"
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
	Data:function(qid){return {
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
	Data:function(qid){return {
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
	Data:function(qid){return {
		name:FindData("name",qid),
		address:FindData("address",qid)
		}}
	}

var DESTINATION_ORDER={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"address\"]",
	sheet:"Order",
	name:"Order",
	Data:function(qid){return {
		identifier:pageTitle(),
		address:FindData("address",qid)
		}}
	}

var DESTINATION_KEYS={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"key\"]",
	sheet:"Keys",
	name:"Keys",
	Data:function(qid){return {
		identifier:pageTitle(),
		key:FindData("answer",qid)
		}}
	}
	
var DESTINATION_PASS={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"name\",\"address\",\"account\"]",
	sheet:"Pass",
	name:"Pass",
	Data:function(qid){return {
		identifier:pageTitle(),
		name:FindData("name",qid),
		address:FindData("address",qid),
		account:FindData("answer",qid),
		type:FindData("type",qid)
		}}
	}
	
/*
var DESTINATION_RATING={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"identifier\",\"rating\"]",
	sheet:"Rating",
	name:"Rating",
	Data:function(qid){
		return{
			identifier:pageTitle(),
			rating:document.querySelector("#"+qid+" #rate-it").value
			}}
}
DESTINATIONS[DESTINATION_RATING.name]=DESTINATION_RATING;
*/

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
	
	RequestDataPack([
		['answer',{
			questionname:"As a winner, what would you tell Pedro PSI?",
		}],
		['exclusivechoice',{
			questionname:"",
			qfield:"whence",
			qchoices:["Private message","Public message in Guestbook"],
			executeChoice:function(id,choice){
				if(choice==="Public message in Guestbook"){
					SetData("destination","Guestbook",id);
				}
				else {
					SetData("destination","Feedback",id);
				}
			}
		}]
	],
	{
		thanksmessage:"Thank you for your message.",
		qonclose:GameFocus,
		qonsubmit:GameFocus
	}
	);
	
}


//////////////////////////////////////////////////////
// Real time Feedback Requests

function RequestGameFeedback(){

	if(!RequestGameFeedback.requests)
		RequestGameFeedback.requests=[];
	
  function RequestGameFeedbackIndeed(){
	  
	function RecordAndLaunchThanksBalloon(DP){
		function RecordFeedback(curlevel){RequestGameFeedback.requests.push(curlevel);}
		RecordFeedback(curlevel);
		LaunchConsoleThanks(DP);
		FocusAndResetFunction(RequestGameFeedback,GameFocus)();};
	
	var DPsettingsObj={
		qid:RequestGameFeedback.id,
		qtargetid:'puzzlescript-game',
		qdisplay:LaunchBalloon,
		qonsubmit:RecordAndLaunchThanksBalloon,
		qonclose:FocusAndResetFunction(RequestGameFeedback,GameFocus),
		thanksmessage:"★ Thank you for your feedback! ★",
		shortcutExtras:extraShortcutsF
	};
	
	function extraShortcutsF(DP){return {
		"F":function(){Close(DP.qid)
		}}}
	
	var DFsettingsObj={};
	var DFSnapshot=['snapshot',{}];
	  
	function HasFeedback(curlevel){return RequestGameFeedback.requests.indexOf(curlevel)>=0;};
	function InTitleScreen(){return titleScreen}
	
	if(InTitleScreen()){
		DFsettingsObj.questionname="Your real-time feedback is much appreciated! As soon as you start the first level, press F or click the Feedback button below.";
		RequestDataPack([['plain',DFsettingsObj]],DPsettingsObj);
	}
	else if(HasFeedback(curlevel)){
		DFsettingsObj.questionname="Any further comments on level"+LevelNumber(curlevel)+"?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}
	else if(!ScreenMessage(curlevel)){
		DFsettingsObj.questionname="What do you think of level "+LevelNumber(curlevel)+", so far?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}
	else{
		DFsettingsObj.questionname="Any other comments or ideas?";
		RequestDataPack([['answer',DFsettingsObj],DFSnapshot],DPsettingsObj);
	}
  }
    
  OpenerCloser(RequestGameFeedback,RequestGameFeedbackIndeed,GameFocus);

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
		/*,qonsubmit:function(DP){LaunchThanksModal(DP);RefreshData["guestbook-area"]()}*/
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
		/*,qonsubmit:function(DP){LaunchThanksModal(DP);RefreshData["guestbook-area"]()}*/
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
	if(pageIdentifier()!=="burokku-konekuta"&&!inConfig("📰»"))
		RequestDataPack([["plain",{
		questionname:"<b>Pedro PSI's <em>news service</em>:</b><a href='burokku-konekuta.html' target='_blank'> Burokku Konekuta がリリースされました!</a>"}]],{
			qdisplay:LaunchConsoleMessage});
		activateConfig("📰»");
};

News();

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
			questionname:"Your email (to receive the key)"
		}]],
		{
			thanksmessage:"Your request is being processed - please allow 1-2 business days.",
			destination:'Pass'
			}
		)
}


//////////////////////////////////////////////////////////////////////
//Analytics

function RequestAnalytics(){
	var yes="Yes. Let Pedro PSI learn (and find bugs) faster.";
	var no ="No. Pedro PSI must learn by other means.";
	RequestDataPack([
		['exclusivechoice',{
			questionname:"Would you share (anonymous) gameplay analytics with Pedro PSI?",
			qfield:"answer2",
			qchoices:[no,yes]
		}]
	],
	{
		action:'Close',
		destination:'',
		executeChoice:function(id,choice){
			if(choice===yes){
				AnalyticsClearance=function(){return true;};
				console.log("yes!!!");
			}
			else {
				AnalyticsClearance=function(){return false;} //Default option
				console.log("noooo!");
			}
		}
	});
}
