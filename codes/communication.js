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
			context:String(GetContext()),
			question:FindData("questionname",qid),
			answer:FindData("answer",qid),
			name:who,
			state:PrintGameState()
			}}
}

function AnonimiseBlank(name){
	if(SomeTextValidate(name))
		return name;
	else
		return "Anonymous Pedro PSI fan";
}

var DESTINATION_GUESTBOOK={
	url:DESTINATION_HOF.url,
	headers:"[\"name\",\"identifier\",\"comment\"]",
	sheet:"Guestbook",
	name:"Guestbook",
	Data:function(qid){return {
		identifier:pageTitle(),
		comment:FindData("answer",qid),
		name:AnonimiseBlank(FindData("name",qid)),
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
			qfield:"answer2",
			qchoices:["Private message","Public message in Guestbook"]
		}]
	],
	{
		thanksmessage:"Thank you for your message.",
		executeChoice:function(id,choice){
			if(choice==="Public message in Guestbook")
				SetData("destination","Guestbook",id);
			else 
				SetData("destination","Feedback",id);
		}
	}
	);
}


//////////////////////////////////////////////////////
// Real time Feedback Requests

var feedbackRequests;

function LevelNumber(levelframe){
	return LevelIndices().indexOf(levelframe)+1;
} 

function PreviousLevelIndex(level){
	var levelindices=LevelIndices();
	while(levelindices[levelindices.length-1]>level){
		levelindices.pop();
	}
	return levelindices.length?levelindices[levelindices.length-1]:0
}

function HasFeedback(level){
	return feedbackRequests.indexOf(level)>=0;
}
function UnRequestGameFeedback(){
	var targetid="puzzlescript-game";
	CloseBalloonIn(targetid);
}

function RequestGameFeedback(){
   
  var currlevel=Number(curlevel);
  var lastlevel=PreviousLevelIndex(currlevel);

  SetContext(LevelNumber(lastlevel));
 
  function TitleScreen(){
	return titleScreen||!lastlevel}
  
  if(!feedbackRequests)
	  feedbackRequests=[];
  
  var DPsettingsObj={
		qtargetid:'puzzlescript-game',
		qdisplay:LaunchBalloon,
		qonsubmit:LaunchThanksBalloon,
		thanksmessage:"★ Thank you for your feedback! ★"
		};
	
	var DFsettingsObj={};

  if(!HasBalloon(DPsettingsObj.qtargetid)){
	var levelindices=LevelIndices();
	if(TitleScreen()){
		DFsettingsObj.questionname="Your real-time feedback is much appreciated! Press F as soon as you start the first level to toggle these balloons.";
		RequestDataPack([['plain',DFsettingsObj]],DPsettingsObj);
	}
	else if(HasFeedback(currlevel)&&HasFeedback(lastlevel)){
		DFsettingsObj.questionname="Any further comments?";
		RequestDataPack([['answer',DFsettingsObj]],DPsettingsObj);
	}
	else if(lastlevel===currlevel){
		DFsettingsObj.questionname="What do you think of this level so far?";
		RequestDataPack([['answer',DFsettingsObj]],DPsettingsObj);
		feedbackRequests.push(currlevel);
	}
	else if(!HasFeedback(lastlevel+1)){
		DFsettingsObj.questionname="How did you feel after beating the previous level?";
		DFsettingsObj.qchoices=["amazed","amused","annoyed","bored","clever","confused","disappointed","excited","exhausted","frustrated","happy","hooked","lucky","proud","surprised"];
		DFsettingsObj.qtype=ChoicesButtonRowHTML;
		feedbackRequests.push(lastlevel+1);
		feedbackRequests.push(currlevel);
		RequestDataPack([['multiplechoice',DFsettingsObj]],DPsettingsObj);
	}
	else if(currlevel>levelindices[levelindices.length-1]){
		DFsettingsObj.questionname="Thank you for playing "+state.metadata.title+"! Would you like to leave a public Testimonial?";
		feedbackRequests.push(currlevel);
		RequestDataPack([['answer',DFsettingsObj]],DPsettingsObj);
	}
	else{
		DFsettingsObj.questionname="Any further comments?";
		RequestDataPack([['answer',DFsettingsObj]],DPsettingsObj);
	}
  }
  else{
	  CloseBalloonIn(DPsettingsObj.qtargetid);
  }
}

function PrintGameState(){
	return document.getElementById("gameCanvas").toDataURL();
}

///////////////////////////////////////////////////////////////////////////////
// Guestbook & Comments

function RequestGuestbook(){
	RequestDataPack([
		['answer',{
			destination:'Guestbook',
			questionname:"Your message",
			thanksmessage:"Thank you for your message in the Guestbook!"}],
		['alias',{
			destination:'Guestbook'}]
	])
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
			destination:'Comments',
			questionname:"Your comment"
		}],
		['alias',{
			destination:'Comments'
		}]
	]);
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
		['name',{
			destination:'Subscription'
		}]])
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
	if(pageIdentifier()!=="gravirinth"&&!inConfig("📰»"))
		RequestDataPack([["plain",{
		questionname:"<b>Pedro PSI's latest news:</b><a href='gravirinth.html' target='_blank'> Gravirinth about to be released!</a>"}]],{
			qdisplay:LaunchConsoleMessage});
		activateConfig("📰»");
};

News();

//////////////////////////////////////////////////////////////////////
//Media Pass

function RequestMediaPass(){
	RequestDataPack([
		['name',{
			destination:'Pass',
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
