//////////////////////////////////////////////////////////////////////
//Form Types

var DESTINATION_HOF={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"identifier\",\"name\",\"honour\"]",
	sheet:"Hall of fame",
	name:"HOF",
	Data:function(qid){return {
		identifier:pageTitle(),
		name:FindData("who",qid),
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
	name:"feedback",
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

var DESTINATION_GUESTBOOK={
	url:DESTINATION_HOF.url,
	headers:"[\"who\",\"identifier\",\"comment\"]",
	sheet:"Guestbook",
	name:"Guestbook",
	Data:function(qid){return {
		identifier:pageTitle(),
		comment:FindData("answer",qid),
		name:FindData("who",qid),
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
		name:FindData("who",qid),
		}}
	}
	
var DESTINATION_SUBSCRIPTION={
	url:DESTINATION_FEEDBACK.url,
	headers:"[\"name\",\"address\"]",
	sheet:"Subscription",
	name:"Subscription",
	Data:function(qid){return {
		name:FindData("who",qid),
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


//////////////////////////////////////////////////////////////////////
//Hall of Fame

function RequestHallOfFame(){
	RequestDatapack('alias',{
		questionname:"Enter the Hall of Fame:",
		qplaceholder:"Your name or alias",
		qrequired:true,
		qerrorcustom:"The Hall of Fame's guards ask for at least 2 alphanumerics!",
		qdestination:"HOF",
		qonclose:RequestModalWinnerMessage,
		qonsubmit:RequestModalWinnerMessage
		});
}

function RequestModalWinnerMessage(dpdummy){
	RequestDatapack('answer',{
		questionname:"As a winner, what would you tell Pedro PSI?",
		thanksmessage:"Thank you for your message."
		});
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
  
  var DP=NewDataPack({
		qfield:'answer',
		qtargetid:'puzzlescript-game',
		qdisplay:LaunchFeedbackBalloon,
		qonsubmit:LaunchThanksBalloon
		});
    
  if(!HasBalloon(DP.qtargetid)){
	var levelindices=LevelIndices();
	if(TitleScreen()){
		DP.questionname="Your real-time feedback is much appreciated! Press F as soon as you start the first level to toggle these balloons.";
		DP.qdisplay=LaunchMessageBalloon;
	}
	else if(HasFeedback(currlevel)&&HasFeedback(lastlevel)){
		DP.questionname="Any further comments?";
	}
	else if(lastlevel===currlevel){
		DP.questionname="What do you think of this level so far?";
		feedbackRequests.push(currlevel);
	}
	else if(!HasFeedback(lastlevel+1)){
		DP.questionname="How did you feel after beating the previous level?";
		DP.qchoices=["amazed","amused","annoyed","bored","clever","confused","disappointed","excited","exhausted","frustrated","happy","hooked","lucky","proud","surprised"];
		DP.qtype=ChoicesButtonRowHTML;
		feedbackRequests.push(lastlevel+1);
		feedbackRequests.push(currlevel);
	}
	else if(currlevel>levelindices[levelindices.length-1]){
		DP.questionname="Thank you for playing "+state.metadata.title+"! Would you like to leave a public Testimonial?";
		feedbackRequests.push(currlevel);
	}
	else{
		DP.questionname="Any further comments?";
	}
	DP.qdisplay(DP);
  }
  else{
	  CloseBalloonIn(DP.qtargetid);
  }
}

function PrintGameState(){
	return document.getElementById("gameCanvas").toDataURL();
}

///////////////////////////////////////////////////////////////////////////////
// Guestbook & Comments

function RequestGuestbook(){
	RequestDatapack([
		['answer',{
			qdestination:'Guestbook',
			questionname:"Your message",
			thanksmessage:"Thank you for your message in the Guestbook!"}],
		['alias',{
			qdestination:'Guestbook'}]
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
	
	RequestDatapack([
		['answer',{
			qdestination:'Comments',
			questionname:"Your comment"
		}],
		['alias',{
			qdestination:'Comments'
		}]
	]);
}

//////////////////////////////////////////////////////////////////////
//Subscribe

function OpenModalSubscribe(){
	RequestDatapack([
		['email',{
			qdestination:'Subscription',
			questionname:"Subscribe to be the first to know about Pedro PSI's next project!",
			thanksmessage:"Thank you for subscribing!"
		}],
		['name',{
			qdestination:'Subscription'
		}]])
	}

//////////////////////////////////////////////////////////////////////
//Order

function OpenModalPreOrder(campaigntext){
	
	RequestDatapack('email',{
			qdestination:'Order',
			questionname:campaigntext,
			thanksmessage:"Your booking was placed. Thank you!"
		});
}