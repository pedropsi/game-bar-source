//////////////////////////////////////////////////////////////////////
//Form Types

var DESTINATION_HOF={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"identifier\",\"name\"]",
	sheet:"Hall of fame",
	name:"HOF",
	Data:function(qid){return {
		identifier:pageTitle(),
		name:FindData("name",qid)
		}}
	}

var who=GenerateId();	
var DESTINATON_FEEDBACK={
	url:"https://script.google.com/macros/s/AKfycbwB-a8j-INbkzTiQFJ55qETLYkdZrRvSg2s8urj9bPbG0XkBg9z/exec",
	headers:"[\"identifier\",\"context\",\"question\",\"answer\",\"name\"]",
	sheet:"Feedback",
	name:"feedback",
	Data:function(qid){
		return{
			identifier:document.body.id,
			context:String(GetContext()),
			question:FindData("questionname",qid),
			answer:FindData("qvalue",qid),
			name:who
			}}
}

var DESTINATION_GUESTBOOK={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"who\",\"identifier\",\"comment\"]",
	sheet:"Guestbook",
	name:"Guestbook",
	Data:function(qid){return {
		identifier:pageTitle(),
		comment:FindData("answer",qid),
		name:FindData("who",qid),
		}}
	}

DESTINATIONS[DESTINATION_HOF.name]=DESTINATION_HOF;
DESTINATIONS[DESTINATION_GUESTBOOK.name]=DESTINATION_GUESTBOOK;
DESTINATIONS[DESTINATON_FEEDBACK.name]=DESTINATON_FEEDBACK;

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


///////////////////////////////////////////////////////////////////////////////
// Guestbook

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