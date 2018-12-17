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
	
function GetHonour(){return " ";} //function to be overriden (customised for) in each game, otherwise blank
	
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
			answer:FindData("qvalue",qid),
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



//////////////////////////////////////////////////////////////////////
//Hall of Fame

function OpenModalHallOfFame(){
	var DP=NewDataPack();
	DP.questionname="Enter the Hall of Fame:";
	DP.qplaceholder="Your name or alias";
	DP.qfield="name";
	DP.qdestination="HOF";
	return OpenModal(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function OpenModalWinning(){
	var DP=NewDataPack();
	DP.questionname="As a winner, what would you tell Pedro PSI?";
	DP.qfield="qvalue";
	return OpenModal(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function RequestHallOfFame(){
	OpenModalWinning();
	OpenModalHallOfFame();
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
  
  var DP=NewDataPack();
  DP.qfield='qvalue';
  DP.qtargetid='puzzlescript-game';
  
  if(!HasBalloon(DP.qtargetid)){
	var levelindices=LevelIndices();
	if(TitleScreen()){
		DP.questionname="Your real-time feedback is much appreciated! Press F as soon as you start the first level to toggle these balloons.";
		DP.qdisplay=OpenMessageBalloon;
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
	DP.qdisplay(DP)
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
	var DP=NewDataPack();
	DP.qdestination='Guestbook';
	DP.questionname="Your message";
	DP.qfield="answer";
	var DP2=NewDataPack();
	DP2.qid=DP.qid;
	DP2.qdestination='Guestbook';
	DP2.qfield="who";
	DP2.qtype=ShortAnswerHTML;
	DP2.questionname="Your name";
	DP2.qplaceholder="or alias";
	return OpenModal(QuestionHTML([DP,DP2]),DP.qid,document.body.id);
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

	var DP=NewDataPack();
	DP.qdestination='Comments';
	DP.questionname="Your comment";
	DP.qfield="answer";

	var DP2=NewDataPack();
	DP2.qid=DP.qid;
	DP2.qdestination='Comments';
	DP2.qfield="who";
	DP2.qtype=ShortAnswerHTML;
	DP2.questionname="Your name";
	DP2.qplaceholder="or alias";
	return OpenModal(QuestionHTML([DP,DP2]),DP.qid,document.body.id);
}

//////////////////////////////////////////////////////////////////////
//Subscribe

function OpenModalSubscribe(){
	var DP=NewDataPack();
	DP.qdestination='Subscription';
	DP.questionname="Subscribe to be the first to know about Pedro PSI's next project!";
	DP.qtype=ShortAnswerHTML;
	DP.qfield="address";
	DP.qplaceholder="_______@___.___";

	var DP2=NewDataPack();
	DP2.qid=DP.qid;
	DP2.qdestination='Subscription';
	DP2.qfield="who";
	DP2.qtype=ShortAnswerHTML;
	DP2.questionname="Your name";
	DP2.qplaceholder="(optional)";
	
	return OpenModal(QuestionHTML([DP,DP2]),DP.qid,document.body.id);
}

//////////////////////////////////////////////////////////////////////
//Order

function OpenModalPreOrder(campaigntext){
	var DP=NewDataPack();
	DP.qdestination='Order';
	DP.questionname=campaigntext;
	DP.qtype=ShortAnswerHTML;
	DP.qfield="address";
	DP.qplaceholder="_______@___.___";
	
	return OpenModal(QuestionHTML(DP),DP.qid,document.body.id);
}