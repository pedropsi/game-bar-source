//////////////////////////////////////////////////////////////////////
//Form Types

var DESTINATION_HOF={
	url:"https://script.google.com/macros/s/AKfycbzgwZUKFmuNQin6Kq4-kTMBSZtz9TapE6kxpZyk7p2tRaanLD1w/exec",
	headers:"[\"identifier\",\"name\"]",
	sheet:"Hall of fame",
	name:"HOF",
	Data:function(qid){return {
		identifier:document.getElementsByTagName("H1")[0].innerHTML,
		name:FindData("answer",qid),
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
			question:FindData("question",qid),
			answer:FindData("answer",qid),
			name:who
			}}
}

DESTINATIONS[DESTINATION_HOF.name]=DESTINATION_HOF;
DESTINATIONS[DESTINATON_FEEDBACK.name]=DESTINATON_FEEDBACK;

//////////////////////////////////////////////////////////////////////
//Hall of Fame

function HallOfFameHTML(id){
	return "<div data-destination='HOF'>"+MessageHTML("Enter the Hall of Fame:")+ShortAnswerHTML("Your name",id)+"</div>";
}

function RequestHallOfFame(){
	var id=GenerateId();
	var target="puzzlescript-game";
	OpenModal(HallOfFameHTML(id),id,target);
}


//////////////////////////////////////////////////////
// Real time Feedback Requests

var feedbackRequests;

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
  var targetid="puzzlescript-game";
   
  var currlevel=Number(curlevel);
  var lastlevel=PreviousLevelIndex(currlevel);

  SetContext(lastlevel);
 
  function TitleScreen(){
	return titleScreen||!lastlevel}
  
  if(!feedbackRequests)
	  feedbackRequests=[];
    
  if(!HasBalloon(targetid)){
	var levelindices=LevelIndices();
	if(TitleScreen())
		OpenMessageBalloon("Your real-time feedback is much appreciated! Press F as soon as you start the first level to toggle these balloons.",targetid)
	else if(HasFeedback(currlevel)&&HasFeedback(lastlevel))
		OpenFeedbackBalloon("Any further comments?","",targetid)
	else if(lastlevel===currlevel){
		OpenFeedbackBalloon("What do you think of this level so far?)","",targetid);
		feedbackRequests.push(currlevel);
	}
	else if(!HasFeedback(lastlevel+1)){
		OpenFeedbackBalloon("How did you feel after beating the previous level?",["amazed","amused","annoyed","bored","clever","confused","disappointed","excited","exhausted","frustrated","happy","hooked","lucky","proud","surprised"],targetid);
		feedbackRequests.push(lastlevel+1);
		feedbackRequests.push(currlevel);
	}
	else if(currlevel>levelindices[levelindices.length-1]){
		OpenFeedbackBalloon("Thank you for playing "+state.metadata.title+"! Would you like to leave a public Testimonial?","",targetid);
		feedbackRequests.push(currlevel);
	}
	else
		OpenFeedbackBalloon("Any further comments?","",targetid)
  }
  else{
	  CloseBalloonIn(targetid);
  }
}

