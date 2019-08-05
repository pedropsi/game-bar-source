/*	
	Game Bar by Pedro PSI 
	https://pedropsi.github.io/puzzlescript-game-bar#source
	///////////////////////////////////////////////////////////////////////////////
	
	MIT License
	
	
	Copyright (c) 2019 Pedro PSI
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice, the above URL and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
	
*/


var stylesheet="/*\
  Game Bar Theme by Pedro PSI\
  https://pedropsi.github.io/puzzlescript-game-bar#source\
  ///////////////////////////////////////////////////////////////////////////////\
  MIT License\
*/\
\
#gameCanvas{\
    position:unset;\
    max-height:96vh;\
    width:100%;\
}\
.game-container{\
    display:flex;\
    flex-direction:column;\
    align-items:center;\
    margin-bottom:unset\
}\
.game-container:fullscreen div{\
    height:calc(96vh);\
}\
.game-container:full-screen{\
    height:calc(96vh);\
}\
/*Styles*/\
:root{\
    --t:0.90;\
    --white:rgba(255,255,255,var(--t));         /*#FFF*/\
    --smokewhite:rgba(241,241,241,var(--t))    /*#f1f1f1*/;\
    --darkblue:rgba(7,0,112,var(--t))          /*#070070*/;\
    --blue:rgba(0,15,255,var(--t))             /*#000FFF*/;\
    --lightblue:rgba(25,130,237,var(--t))      /*#1982ed*/;\
    --turquoise:rgba(59,248,222,var(--t))      /*#3bf8de*/;\
    --green:rgba(70,244,111,var(--t))          /*#46f46f*/;\
    --yellow:rgba(240,248,175,var(--t))        /*#f0f8af*/;\
    --lightyellow:rgba(255,249,201,var(--t))   /*#fff9c9*/;\
  --font:Arial, sans-serif;\
  --duration:1s;\
    --scaling:2;\
    --basis-width:calc(1vw);\
    --basis-height:calc(1vh);\
    --w1 :var(--basis-width);\
    --w2 :calc(var(--w1)  * var(--scaling));\
    --w4 :calc(var(--w2)  * var(--scaling));\
    --w8 :calc(var(--w4)  * var(--scaling));\
    --w16:calc(var(--w8)  * var(--scaling));\
    --w32:calc(var(--w16) * var(--scaling));\
    --w64:calc(var(--w32) * var(--scaling));\
    --w-2:calc(var(--w1)  / var(--scaling));\
    --w-4:calc(var(--w-2) / var(--scaling));\
    --w-8:calc(var(--w-4) / var(--scaling));\
    --h1:var(--basis-height);\
    --h2 :calc(var(--h1)  * var(--scaling));\
    --h4 :calc(var(--h2)  * var(--scaling));\
    --h8 :calc(var(--h4)  * var(--scaling));\
    --h16:calc(var(--h8)  * var(--scaling));\
    --h32:calc(var(--h16) * var(--scaling));\
    --h64:calc(var(--h32) * var(--scaling));\
    --h-2:calc(var(--h1)  / var(--scaling));\
    --h-4:calc(var(--h-2) / var(--scaling));\
    --h-8:calc(var(--h-4) / var(--scaling));\
    --sharesize:calc((100vw - 43px)/100 + 15px);\
}\
\
@media only screen and (max-width:500px){\
    body{\
       word-break:break-all;\
    }\
}\
\
.balloon *, .buttonbar{\
    font-family:var(--font);\
    font-size:calc(10px + var(--w-2));\
    line-height:calc(12px + var(--w-2));\
    max-width:100%;\
    max-height:100%;\
    display:flex;\
    flex-direction:column;\
    align-items:stretch;\
    border-color:currentColor;\
    border-width:var(--h-2);\
    color:var(--darkblue);\
}\
\
.button:hover,.button:active,.button:focus,\
.button:hover a,.button:active a,.button:focus a,\
.selected{\
    color:var(--turquoise);\
    text-decoration-color:currentColor;\
    text-decoration-style:solid ;\
    background-color:var(--darkblue);\
    transition-duration:var(--duration);\
    cursor:pointer;\
    outline:none;\
}\
\
h4{\
    font-variant-caps:small-caps;\
    font-weight:bold;\
    max-width:100%;\
    font-size:calc(130% * var(--scaling));\
    line-height:calc(110% + 20% * var(--scaling));\
    margin-bottom:calc(var(--w1) * var(--scaling));\
    margin-top:calc(var(--w2) * var(--scaling));\
    text-decoration:underline;\
}\
h4{\
    --scaling:0.85;\
    text-decoration-color:var(--lightblue);\
}\
@media only screen and (max-width:250px){\
    h1, h2, h3, h4, h5, h6, p, table{\
        word-break:break-all;\
    }\
}\
::-selection{\
    background:var(--smokewhite);\
    color:var(--blue);\
}\
::-moz-selection{\
    background:var(--smokewhite);\
    color:var(--blue);\
}\
@media only screen and (max-width:350px){\
    .buttonbar{\
       word-break:break-all;\
    }\
}\
.button{\
    background-color:var(--smokewhite);\
    max-width:80%;\
    text-align:center;\
    color:var(--blue);\
    border-bottom-style:solid;\
    padding:var(--h-2) var(--w2) var(--h-2) var(--w2);\
    margin:var(--h1) var(--w2) var(--h1) var(--w1);\
    align-self:center;\
    font-weight:bold;\
    transition-duration:var(--duration);\
}\
.button a{\
    text-decoration:none;\
    color:inherit;\
    transition-duration:var(--duration);\
}\
.button:hover a{\
    background-color:transparent;\
    transition-duration:var(--duration);\
}\
\
.closer{\
    width:100%;\
    flex-direction:row;\
    justify-content:flex-end;\
}\
.closer .button{\
    border:unset;\
    padding:var(--h2) var(--w2) var(--h2) var(--w2);\
    margin:unset;\
    font-size:300%;\
}\
.balloon{\
    position:absolute;\
    bottom:var(--h16);\
    right:var(--w4);\
    max-width:80%;\
    max-height:80%;\
    animation:fadein var(--duration);\
}\
.baloon-content{\
    flex-direction:row;\
    justify-content:flex-start;\
    background-color:var(--white);\
    border-bottom:var(--h1) solid var(--turquoise);\
    padding:var(--h2) var(--w2) var(--h2) var(--w2);\
    align-items:center;\
}\
.baloon-content .avatar{\
    max-width:calc(var(--w4) + 30px);\
    background-color:var(--transparent);\
}\
.baloon-content .subtitle{\
  margin-left:var(--w1);\
    padding:var(--h1)  var(--w1)  var(--h1)  var(--w1);\
    min-width:calc(var(--w4) + 30px);\
    background-color:var(--smokewhite);\
}\
.buttonrow{\
    flex-direction:row;\
    flex-wrap:wrap;\
    margin-left:var(--w4);\
    margin-right:var(--w4);\
    justify-content:center;\
    align-items:flex-end;\
}\
.buttonrow .button{\
    font-size:100%;\
    margin:unset;\
    align-self:stretch;\
    background-color:var(--white);\
}\
.buttonrow .button:hover, .buttonrow .button:active{\
    background-color:var(--darkblue);\
    border-bottom-color:currentColor;\
    color:var(--turquoise);\
}\
\
.buttonbar{\
    margin-top:0;\
    justify-content:space-evenly;\
    flex-wrap:nowrap;\
    background-color:var(--white);\
    width:100%;\
    margin:unset\
}\
.buttonbar .button{\
    flex-grow:1;\
    border-bottom-width:var(--h-2);\
}\
.selected.button{\
    background-color:var(--blue);\
    border-color:currentColor;\
    color:var(--turquoise);\
}\
\
#Console{\
    pointer-events:none;\
  position:fixed;\
  top:0;\
  margin-top:var(--h1);\
  width:100%;\
  z-index:1000;\
    align-items:center;\
}\
#Console .message{\
    pointer-events:all;\
    background-color:var(--lightyellow);\
    color:var(--lightblue);\
    border-bottom:var(--h1) solid currentColor;\
    margin-bottom:var(--h2);\
    padding:var(--h1) var(--w2) var(--h1) var(--w2);\
    font-weight:bold;\
}\
.closing{\
    opacity:0;\
  transition:opacity var(--duration) ease-in-out;\
    -moz-transition:opacity var(--duration) ease-in-out;\
    -webkit-transition:opacity var(--duration) ease-in-out;\
    -o-transition:opacity var(--duration) ease-in-out;\
    -ms-transition:opacity var(--duration) ease-in-out;\
}\
.opening{\
    opacity:1;\
  transition:opacity var(--duration) ease-in-out;\
    -moz-transition:opacity var(--duration) ease-in-out;\
    -webkit-transition:opacity var(--duration) ease-in-out;\
    -o-transition:opacity var(--duration) ease-in-out;\
    -ms-transition:opacity var(--duration) ease-in-out;\
}";



///////////////////////////////////////////////////////////////////////////////
//Do nothing
function Identity(){return;};

///////////////////////////////////////////////////////////////////////////////
//Join Objects, overwriting conflicting properties
function FuseObjects(object,extrapropertiesobject){
	var O=object;
	if(extrapropertiesobject===undefined)
		extrapropertiesobject={};
	var keys=Object.keys(extrapropertiesobject);
	for(var k in keys){
		O[keys[k]]=extrapropertiesobject[keys[k]];
	}
	return O;
}

///////////////////////////////////////////////////////////////////////////////
//Page auto index
function IDfy(s){
	return s.replace(/([^A-Za-z0-9\:\_\.])+/g,"-").replace(/\-$/g,"");
}


///////////////////////////////////////////////////////////////////////////////
//Unique random identifier

function RandomInteger(n){return Math.floor(Math.random() * n)};

function GenerateId(){
	return String(RandomInteger(999999999));
};




///////////////////////////////////////////////////////////////////////////////
// DOM Manipulation

function MakeElement(html){
	var e=document.createElement("div");
	e.innerHTML=html;
	return e.firstChild;
}

HTMLTags=['!DOCTYPE','a','abbr','acronym','abbr','address','applet','embed','object','area','article','aside','audio','b','base','basefont','bdi','bdo','big','blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','colgroup','data','datalist','dd','del','details','dfn','dialog','dir','ul','div','dl','dt','em','embed','fieldset','figcaption','figure','figure','font','footer','form','frame','frameset','h1','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','label','input','legend','fieldset','li','link','main','map','mark','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','param','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','video','audio','span','strike','del','s','strong','style','sub','summary','details','sup','svg','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','video','audio','tt','u','ul','var','video','wbr'];

function IsTag(selector){
	return HTMLTags.indexOf(selector)>=0;
}
function IsClass(selector){
	return selector.replace(/^\./,"")!==selector;
}
function IsID(selector){
	return selector.replace(/^\#/,"")!==selector;
}

function IsQuerySelector(selector){
	return IsID(selector)||IsClass(selector)||IsTag(selector);
}

function ParentSelector(targetIDsel){
	var parentElement=GetElement(targetIDsel).parentElement;
	if(!parentElement.id)
		parentElement.id=GenerateId();
	return parentElement.id;
}

// Get element based on selectors: .class, #id, idsring, or the element itself
function GetElement(selector){
	if(typeof selector==="string"){
		if(IsQuerySelector(selector))
			return document.querySelector(selector);
		else
			return document.getElementById(selector);
	}
	else
		return selector; //in case the actual element is given in the beginning
};

// Add new element to page, under a parent element
function AddElement(html,parentIDsel){
	var e=MakeElement(html);
	var p=GetElement(parentIDsel);
	p.appendChild(e);
};

// Add new element to page, after a sibling element
function AddAfterElement(html,selector){
	var s=GetElement(selector);
	var e=document.createElement("div");
	e.innerHTML=html;
	s.insertAdjacentElement('afterend',e.firstChild);
};

// Replace parent element contents with new element
function ReplaceElement(html,parentID){
	var p=GetElement(parentIDsel);
	p.innerHTML=html;
};



// Remove Children
function RemoveChildren(parentID){
	ReplaceElement(parentID,"")
}

// Remove Element
function RemoveElement(elementIDsel){
	var e=GetElement(elementIDsel);
	if(e!==null){
		e.parentNode.removeChild(e);
	}
}




////////////////////////////////////////////////////////////////////////////////
// Element Generator

function ReadAttributes(attributesObj){
	function Attrib(k){return k+"='"+attributesObj[k]+"'";};
	return Object.keys(attributesObj).map(Attrib).join(" ");
}

function ElementHTML(optionsObj){
	var tag=optionsObj.tag?optionsObj.tag:"div";
	var attributes=(optionsObj.attributes)?' '+ReadAttributes(optionsObj.attributes):'';	//attributes is an Object
	var txt=optionsObj.txt?optionsObj.txt:"???";
	return "<"+tag+attributes+">"+txt+"</"+tag+">"		//txt and tag
};


// Basic Elements
function ButtonHTML(optionsObj){
	var o=optionsObj?optionsObj:{};
	o.tag=o.tag?o.tag:"div";			//defaults to div
	if(!o.attributes)
		o.attributes={class:"button"}
	else if(!o.attributes['class'])
		o.attributes['class']="button"
	else
		o.attributes['class']=o.attributes['class'].replace(/\s*button/g,"")+" button";
	o.txt=o.txt?o.txt:"???";
	return ElementHTML(o)
};

function AHTML(title,ref){
	return ElementHTML({tag:"a",txt:title,attributes:{href:ref}});
}


// Basic Buttons

function ButtonOnClickHTML(title,onclicktxt){
	return ButtonHTML({txt:title,attributes:{onclick:onclicktxt}});
}

function ButtonLinkHTML(title){
	return ButtonHTML({tag:"a",txt:title,attributes:{href:'#'+IDfy(title),onclick:'FullscreenClose()'}});
}

function CloseButtonHTML(targetid){
	return "<div class='closer'>"+ButtonHTML({tag:"span",txt:"&times;",attributes:{onclick:'Close(\"'+targetid+'\")'}})+"</div>";
	//return '<span class="button closer" onclick="Close(\''+targetid+'\')">&times;</span>'
}

function OkButtonHTML(targetid){
	return ButtonOnClickHTML("OK",'Close(\"'+targetid+'\")');
}
function SubmitButtonHTML(DP){
	return ButtonOnClickHTML(DP.actionText,DP.action+"(\""+DP.qid+"\")");
}

function MessageHTML(message){
	return "<h4 class='question'>"+message+"</h4>";
}

function ErrorHTML(message,id){
	return "<div class='error' id='"+id+"'><p>"+message+"</p></div>";
}

function PlainMessageHTML(message){
	return message;
}

//Button Bar
function ButtonBar(buttonshtml,id){return '<div id="'+id+'" class="buttonbar buttonrow">'+buttonshtml+'</div>'};

////////////////////////////////////////////////////////////////////////////////
// DataField and DataPack system : default DataField (customisable), many of which constitute a DataPack 

function DefaultDataField(){
	return {
		questionname:"???",				//Display name of the field question
		qfield:"question",				//Field name must be unique
		qvalue:"",						//Field value, by default

		qid:GenerateId(),				//id of the field question
		
		qchoices:"",					//answer options list
		executeChoice:Identity,			//immediate changes on toggle receives (id, choice)
		defaultChoice:DefaultChoice,	//choice formatting, based on itself

		qtype:PlainHTML,				//Format of question :receives a DataField
		qplaceholder:"❤ Pedro PSI ❤",	//Placeholder answer

		qsubmittable:true, 				//whether the element expects submission (true) or merely presents information (false)
		qrequired:true,					
		qvalidator:IdentityValidator,	//Receives a DataField
		qerrorcustom:''
	}
}

function DefaultChoice(index,choicetxt){return String(index)===String(0);}//choicetxt gives this function flexibility

function DefaultDataPack(){
	return {
		fields:[],

		qid:GenerateId(),				//id
		
		action:'CheckSubmit', 			//action on submit :receives a qid
		actionvalid:Identity,	//action on valid submit: receives a DataPack
		actionText:'Submit',			//text to display instead of "Submit"
		
		qtargetid:document.body.id,		//Where to introduce form in page?
		qdisplay:LaunchBalloon,			//Question display function :receives a DataPack

		qonsubmit:Identity,	//Next modal on successful submit: receives a DataPack
		qonclose:Identity,				//Next modal on close (defaults to nothing): receives a DataPack
		thanksmessage:"Submitted. Thank you!",
		
		shortcuts:DPShortcutDefauts,	//Base shortcuts (all else is deleted)
		shortcutExtras:function(DP){return {};}	//Extended shortcuts, to use ad-hoc
	}
}

function NewDataField(obj){
	var DF=DefaultDataField();
	return FuseObjects(DF,obj);
}

function DataFieldTypes(type){
	var DFTypes={
		plain:NewDataField({
			qsubmittable:false
		}),
		exclusivechoice:NewDataField({
			qfield:'answer',
			questionname:"Which one?",
			qchoices:["on","off"],
			qtype:ExclusiveChoiceButtonRowHTML})
	}
	if(typeof type==="undefined")
		return DFTypes;
	else
		if(type==='alias')
			return CustomDataField('name',{qplaceholder:"or alias"});
		else
			return DFTypes[type];
}

function CustomDataField(type,obj){
	var DF=DataFieldTypes(type);
	return FuseObjects(DF,obj);
}

var DATAPACKHISTORY=[];

function DPHistoryAdd(DF){
	DATAPACKHISTORY.push(DF);
}


function UpdateDataPack(DP,obj){
	return FuseObjects(DP,obj);
}

function NewDataPack(obj){
	return UpdateDataPack(DefaultDataPack(),obj);
}

function NewDataPackFields(NamedFieldArray){
	function CusDaFiel(ndf){return CustomDataField(ndf[0],ndf[1])};
	return {fields:NamedFieldArray.map(CusDaFiel)};
}

function RequestDataPack(NamedFieldArray,Options){
	if(NamedFieldArray.length<1)
		return;
	else{
		var o=Options;
		if(typeof o==="undefined")
			o={};
		var DP=NewDataPack(NewDataPackFields(NamedFieldArray));
		DP=UpdateDataPack(DP,o);
		DP.fields=DP.fields.map(function(f){var fi=f;fi.pid=DP.qid;return fi});
		DPHistoryAdd(DP);
		
		DP.qdisplay(DP);

		FocusElement("#"+DP.qid+" textarea, "+"#"+DP.qid+" input"); //First question
		SetDatapackShortcuts(DP);

		
		return DP;
	}
};


// DataField HTML Components

function PlainHTML(dataField){
	return PlainMessageHTML(dataField.questionname);
}

function ChoiceHTML(dataField,buttontype){
	var choi="";
	var clear='onload="ClearData(\''+dataField.qfield+'\',\''+dataField.pid+'\')" ';
	for(var i in dataField.qchoices)
		choi=choi+buttontype(dataField.qchoices[i],dataField,i);
	return '<div class="buttonrow" '+clear+'id="'+dataField.qid+'">'+choi+'</div>';
}


function ExclusiveChoiceButtonRowHTML(dataField){
	function ExclusiveChoiceButtonHTML(choice,dataFiel,i){
		var selected="";
		var args='(\''+dataFiel.qfield+'\',\''+choice+'\',\''+dataFiel.pid+'\')';
		//console.log(i,choice,typeof i);
		if(dataFiel.defaultChoice(i,choice)){
			selected=' selected" onload="SetData'+args; //Default option
			SetData(dataFiel.qfield,choice,dataFiel.pid);//Actualy choose it
		}
		return '<div class="button'+selected+'" onclick="ToggleThisOnly(event,this);SwitchData'+args+'">'+choice+'</div>';
	};
	//console.log(dataField.qfield);console.log(dataField.pid);
	ClearData(dataField.qfield,dataField.pid);
	return ChoiceHTML(dataField,ExclusiveChoiceButtonHTML)
}

function SubQuestionHTML(dataField){
	var qname=dataField.questionname;
	var questiontitle="";
	if(qname!==""&&dataField.qtype!==PlainHTML)
		questiontitle=MessageHTML(qname);
	var answerfields=dataField.qtype(dataField);
	return questiontitle+answerfields;
}


// DataPack HTML Components

function QuestionHTML(DP){
	var Fields=DP.fields;
	//!!! Outgrow for simple DP
	var SubQuestions=Fields.map(SubQuestionHTML).join("");
	var SubmissionButton="";
	if(Fields.some(function(dp){return dp.qsubmittable}))
		SubmissionButton=SubmitButtonHTML(DP);
	return '<div id="'+DP.qid+'">'+SubQuestions+SubmissionButton+"</div>";
}



////////////////////////////////////////////////////////////////////////////////
// Balloons


function LaunchBalloon(DP){
	OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function BalloonHTML(avatarsrc,content,id){
	var b='<div class="balloon" id='+id+'>'+CloseButtonHTML(id)+'<div class="baloon-content"><img class="avatar" src="'+avatarsrc+'"/><div class="subtitle">'+content+'</div></div></div>';
	return b;
}

function OpenBalloon(content,id,targetid){
	AddElement(BalloonHTML("images/logo.png",content,id),targetid);
}

function CloseBalloonIn(targetid){
	var ballon=GetElement(targetid).querySelector(".balloon");
	if(ballon){
		Close(ballon.id);
	}
}

function HasBalloon(targetid){
	var i=GetElement(targetid);
	return (i.querySelector(".balloon")!==null);
}

////////////////////////////////////////////////////////////////////////////////
// Opener & Closer Functions with focus option, 
// -> to use within Datapack RequestFunctions
function FocusAndResetFunction(RequestF,FocusF){
	return function(){
		if(RequestF.id)
			RequestF.id=undefined;
		FocusF();
	};
};

function OpenerCloser(RequestF,ContinueF,FocusF){
	if(RequestF.id){ //Close on second click
		var i=RequestF.id; //Retrieves unique id for the request window/balloon/modal
		Close(i);
		FocusAndResetFunction(RequestF,FocusF)();
	}
	else{
		RequestF.id=GenerateId(); //Generates unique id for the request window/balloon/modal
		ContinueF();
	}
}

////////////////////////////////////////////////////////////////////////////////
// Toggling class & buttons

function ToggleThis(ev,thi){
	if(ev.target.id===thi.id)
		thi.classList.toggle("selected");
}

function ToggleThisOnly(ev,thi){
	var siblings=thi.parentNode.childNodes;
	var i=0;
	while (i<siblings.length){
		if(siblings[i]!==thi){
		siblings[i].classList.remove("selected");}
		else{
		siblings[i].classList.remove("selected");
		siblings[i].classList.toggle("selected");}
		i++;
	}
}

// Select, Deselect and Toggle - given selector or element itself

function Select(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e){
		e.classList.remove(clas);
		e.classList.add(clas);
	}
}

function Deselect(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.remove(clas);
}

function Toggle(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.toggle(clas);
}

////////////////////////////////////////////////////////////////////////////////
// Closing functions


function CloseElement(targetIDsel){
	var fading=GetElement(targetIDsel);
	if(fading!==null){
		fading.classList.add("closing");
		setTimeout(function(){fading.remove();},1000);
	}
}

function CloseElementNow(targetIDsel){
	var fading=GetElement(targetIDsel);
	if(fading!==null){
		fading.remove();
	}
}

function CloseThis(ev,thi,targetIDsel){
	if(ev.target.id===thi.id)
		Close(targetIDsel);
}

function Close(targetid){
	//First tries to find the next item to open, then closes
	if(typeof GetDataPack(targetid)!=="undefined"){
		var ClosingF=FindData("qonclose",targetid);
		if(typeof ClosingF!=="undefined")
			ClosingF(GetDataPack(targetid));
	}
	CloseElement(targetid);
}

function CloseAndContinue(DP){
	var NextF=DP.qonsubmit;
	if(typeof NextF!=="undefined")
		NextF(DP);
	CloseElement(DP.qid);
}

////////////////////////////////////////////////////////////////////////////////
// Focus functions

function FocusElement(targetIDsel){
	var focussing=GetElement(targetIDsel);
	if(focussing!==null){
		focussing.focus();	
	}
};


///////////////////////////////////////////////////////////////////////////////
//Event Listeners

function ListenOnce(ev,fun,target){
	target=target?target:window; //Improve the defaults
	if(typeof ev==="string") //Defaults to array in case a single string is
		ev=[ev];
	function F(){
		fun();
		ev.map(function(e){target.removeEventListener(e,F)})
	}
	ev.map(function(e){target.addEventListener(e,F)})
}


////////////////////////////////////////////////////////////////////////////////
// Data submission in forms

function SubmitAnswerSet(DP){
	DP.actionvalid(DP);
	CloseAndContinue(DP);
}

function CheckSubmit(qid){
	var DP=GetDataPack(qid);
	if(typeof DP!=="undefined"){
		SubmitAnswerSet(DP);
	};
}

var SUBMISSIONHISTORY=[];

function PreviousSubmission(field){
	var s=SUBMISSIONHISTORY.filter(function(datasub){return ((typeof datasub[field])!=="undefined")});
	if(s.length>0)
		return s[s.length-1][field];
	else
		return undefined;
}

////////////////////////////////////////////////////////////////////////////////
// Data finding in forms

function FindData(field,pid){
	var e=document.getElementById(pid);
	var d;
	if(e===null)
		d=PreviousSubmission(field);
	else{
		d=FindDataInNode(field,e);
		if(d===undefined){
			d=GetDefaultData(field,pid);
			if(d===undefined)
				d=PreviousSubmission(field);
		}
	}
	return d;
};

function FindDataInNode(type,node){
	//console.log(node);
	if(typeof node==="null")
		return undefined;
	else if(NodeHasData(type,node)){
		return NodeGetData(type,node);
	}
	else{
		var children= node.childNodes;
		var i=0;
		while((typeof children[i]!=="undefined")){
			if(typeof FindDataInNode(type,children[i])!=="undefined"){
				return FindDataInNode(type,children[i]);}
			i++;
		}
		return undefined
	}
}

function NodeHasData(field,node){
	return (typeof node.dataset!=="undefined")&&(typeof node.dataset[field]!=="undefined");
}

function NodeGetData(field,node){
	if((["INPUT","TEXTAREA"].indexOf(node.tagName)>=0)&&typeof node.dataset[field]!=="undefined")
		return (node.value)
	else
		return (node.dataset[field]);
}


function OverwriteDataField(field,id,newdata){
	OverwriteDataInNode(field,document.getElementById(id),newdata);
};

function OverwriteDataInNode(type,node,newdata){
	//console.log(node);
	if(typeof node==="null")
		return undefined;
	else if(NodeHasData(type,node)){
		return NodeOverwriteData(type,node,newdata);
	}
	else{
		var children= node.childNodes;
		var i=0;
		while((typeof children[i]!=="undefined")){
			if(typeof FindDataInNode(type,children[i])!=="undefined"){
				return OverwriteDataInNode(type,children[i],newdata);}
			i++;
		}
		return undefined
	}
}

function NodeOverwriteData(field,node,newdata){
	if((["INPUT","TEXTAREA"].indexOf(node.tagName)>=0)&&typeof node.dataset[field]!=="undefined")
		return (node.value=newdata);
	else
		return (node.dataset[field]=newdata);
}

///////////////////////

function GetDataPack(id){
	var i=0;
	while(i<DATAPACKHISTORY.length){
		if(DATAPACKHISTORY[i].qid===id)
			return DATAPACKHISTORY[i];
		i++}
	return undefined
};

function GetDefaultData(field,id){
	var DP=GetDataPack(id);
	var data=DP[field];
	if(data!==undefined)
		return data;
	else{
		data=GetFieldValue(field,id);
		if(data!==undefined)
			return data;
		return PreviousSubmission(field)
	}
};

function SetData(field,value,id){
	//console.log(field,value,id);
	var DP=GetDataPack(id);
	if(DP!==undefined)
		GetDataPack(id)[field]=value;
};

function ClearData(field,id){
	SetData(field,"",id);
};

function GetField(field,parentid){
	var DP=GetDataPack(parentid)
	if(DP!==undefined){
		var fis=DP.fields.filter(function(f){return (f.qfield===field)});
		if(fis.length>0)
			return fis[0];
	}
}

function GetFieldValue(field,parentid){
	var fi=GetField(field,parentid);
	if(fi!==undefined)
		return	fi.qvalue;
}

function ChoiceExecute(field,value,id){
	GetField(field,id).executeChoice(id,value); //Not dynamically updated. And why should it be?
};

function ToggleData(field,value,id){
	ChoiceExecute(field,value,id);
	var data=GetDefaultData(field,id);
	if(typeof data==="undefined")
		SetData(field,value,id);
	else{
		if(data.replace(" "+value,"").replace(value,"")===data)
			SetData(field,data+" "+value,id)
		else
			SetData(field,data.replace(" "+value,"").replace(value,""),id)
	}
}

function SwitchData(field,value,id){
	ChoiceExecute(field,value,id);
	SetData(field,value,id);
}



///////////////////////////////////////////////////////////////////////////////
// Form Validators and Modifiers

// Form Validators

function IdentityValidator(DF){return {valid:true,error:"no errors"};}


///////////////////////////////////////////////////////////////////////////////
//Message Console 

var consolebuffer=[];
var consolemax=3;

function ConsoleClear(){
	RemoveChildren("Console");
}

function ConsoleRemove(mID){
	RemoveElement(mID);
	var i=consolebuffer.indexOf(mID);
	if(i>=0)
		consolebuffer.splice(i,1)
}

function ConsoleMessageHTML(message,mID){
	return '<div class="message" id='+mID+'>'+message+'</div>';
}

function TextReadDuration(textstring){ //by counting number of words, 200ms per word (tagscount but won't hopefully have too many spaces)
	return Math.min(Math.max(1000,(textstring.split(" ").length)*250),10000);
}

function ConsoleAdd(messageHTML,wait,duration){
	
	if(GetElement("Console")===null)
		ConsoleLoad();
	
	var duration=duration?Math.max(1000,duration):TextReadDuration(messageHTML);
	var wait=wait?wait:0;
	var mID="c-"+GenerateId();//random id
	setTimeout(function(){AddElement(ConsoleMessageHTML(messageHTML,mID),"Console")},wait)
	setTimeout(function(){CloseElement(mID)},duration+wait);
	consolebuffer.push(mID);
	while(consolebuffer.length>consolemax){
		ConsoleRemove(consolebuffer[0]);
	}
}

function ConsoleLoad(selector){
	var selector=selector||'.main';
	RemoveElement("Console");
	AddElement('<div id="Console"></div>',selector);
}

function ConsoleAddMany(messagesArray){
	var delay=0;
	for (var i=0;i<messagesArray.length;i++){
		ConsoleAdd(messagesArray[i],delay);
		delay=delay+TextReadDuration(messagesArray[i]);
	}
}

function ConsoleAddOnce(messageHTML,wait,duration){
	if(!ConsoleAddOnce.messages)
		ConsoleAddOnce.messages=[];
	
	if(ConsoleAddOnce.messages.indexOf(messageHTML)<0){
		ConsoleAdd(messageHTML,wait,duration)
		ConsoleAddOnce.messages.push(messageHTML);
	}	
}

//DataPack integration in console
function LaunchConsoleMessage(DP){
	ConsoleAdd(QuestionHTML(DP));
}

function LaunchConsoleThanks(DP){
	ConsoleAdd(DP.thanksmessage);
}



///////////////////////////////////////////////////////////////////////////////
//Fullscreen

function FullscreenAllowed(){
	return (document.exitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen||document.msExitFullscreen||(document.webkitFullscreenElement&&document.webkitExitFullscreen)||false)!==false;
}

function FullscreenActivate(browserprefix){
	function Deactivate(){
		if(!(document.fullscreenElement||document.webkitFullscreenElement))
			Deselect("FullscreenButton");
		}
	//If a change is detected within the next 512 ms, trigger the button
	[0,1,2,4,8,16,32,64,128,256,512].map(function(timedelay){
		setTimeout(function(){ListenOnce(browserprefix,Deactivate,document)},timedelay);
	});
	return
};

function FullscreenOpen(targetIDsel){
	var e = GetElement(targetIDsel);
	var f;
	if(f=e.requestFullscreen){
		e.requestFullscreen();
		FullscreenActivate("fullscreenchange");
	} else if(f=e.mozRequestFullScreen){ /* Firefox */
		e.mozRequestFullScreen();
		FullscreenActivate("mozfullscreenchange");
	} else if(f=e.webkitRequestFullscreen){ /* Chrome, Safari and Opera */
		e.webkitRequestFullscreen();
		FullscreenActivate("webkitfullscreenchange");
	} else if(f=e.msRequestFullscreen){ /* IE/Edge */
		e.msRequestFullscreen();
		FullscreenActivate("msfullscreenchange");
	} 
	
	//Place the console correctly
	if(f){
		Select("FullscreenButton");
		ConsoleLoad(targetIDsel);
	};	
}

function FullscreenClose(){
	var f;
	if(document.fullscreenElement){
		if(f=document.exitFullscreen){
			document.exitFullscreen();
		} else if(f=document.mozCancelFullScreen){ /* Firefox */
			document.mozCancelFullScreen();
		} else if(f=document.webkitExitFullscreen){ /* Chrome, Safari and Opera */
			document.webkitExitFullscreen();
		} else if(f=document.msExitFullscreen){ /* IE */
			document.msExitFullscreen();
		}
	}
	if(document.webkitFullscreenElement&&document.webkitExitFullscreen){ /*Edge*/
		document.webkitExitFullscreen();
		f=true;
	}
	
	if(f) {
		Deselect("FullscreenButton");
		ConsoleLoad();
	};
}

function ToggleFullscreen(targetIDsel){
	if(FullscreenAllowed()){
		if(document.fullscreenElement||document.webkitFullscreenElement){
			FullscreenClose();
		}
		else{
			FullscreenOpen(targetIDsel);
		}
	}
	else
		ConsoleAdd("Fullscreen: Please inform Pedro PSI that your browser is not yet supported!");
};


///////////////////////////////////////////////////////////////////////////////
//Keyboard Shortcuts

var keyActions={}//By default, there are no shortcuts

function KeyLookup(key){
	return KeyCodes[(""+key).toLowerCase()];
}

var KeyCodes={
	'none':0,
	'break':3,
	'backspace':8,
	'tab':9,
	'clear':12,
	'enter':13,
	'shift':16,
	'ctrl':17,
	'alt':18,
	'pause':19,
	'caps lock':20,
	'escape':27,
	'spacebar':32,
	'page up':33,
	'page down':34,
	'end':35,
	'home':36,
	'left':37,
	'up':38,
	'right':39,
	'down':40,
	'select':41,
	'print':42,
	'execute':43,
	'print screen':44,
	'insert':45,
	'delete':46,
	'help':47,
	'0':48,
	'1':49,
	'2':50,
	'3':51,
	'4':52,
	'5':53,
	'6':54,
	'7':55,
	'8':56,
	'9':57,
	'ß':63,
	'a':65,
	'b':66,
	'c':67,
	'd':68,
	'e':69,
	'f':70,
	'g':71,
	'h':72,
	'i':73,
	'j':74,
	'k':75,
	'l':76,
	'm':77,
	'n':78,
	'o':79,
	'p':80,
	'q':81,
	'r':82,
	's':83,
	't':84,
	'u':85,
	'v':86,
	'w':87,
	'x':88,
	'y':89,
	'z':90
}


function OnKeyDownDefault(event) {
	event = event || window.event;

	if(keyActions[event.keyCode])
		keyActions[event.keyCode](event);
}

function StopCapturingKeys(OnKeyDown){
	var OnKeyDown=StopCapturingKeys.last?StopCapturingKeys.last:OnKeyDown;
	document.removeEventListener('keydown',OnKeyDown);
}
function ResumeCapturingKeys(OnKeyDown){
	var OnKeyDown=OnKeyDown?OnKeyDown:OnKeyDownDefault;
	StopCapturingKeys.last=OnKeyDown;
	document.addEventListener('keydown',OnKeyDown);
}

function SetShortcut(key,Action){
	var key=(typeof key==="string")?KeyLookup(key):key;
	keyActions[key]=Action;
}
function DeleteShortcut(key){
	var key=(typeof key==="string")?KeyLookup(key):key;
	delete keyActions[key];
}

//Multiple shortcuts
function AddShortcuts(keyActionsNew){
	var keys=Object.keys(keyActionsNew);
	for(var k in keys){
		//console.log(keys[k],keyActionsNew[keys[k]].toSource());
		SetShortcut(keys[k],keyActionsNew[keys[k]]);
	}
}

function OverwriteShortcuts(keyActionsNew){
	keyActions={};
	AddShortcuts(keyActionsNew);
}

//Datapack Integration
function SetDatapackShortcuts(DP){
	OverwriteShortcuts(DP.shortcuts(DP));
	AddShortcuts(DP.shortcutExtras(DP));
}

function DPShortcutDefauts(DP){
	return {
		"escape":function(){Close(DP.qid);},
		"enter":function(){CheckSubmit(DP.qid);},
		"tab":function(){console.log("tab shortcut - TODO");}
	}
};














////////////////////////////////////////////////////////////////////////////////
// Game Bar

////////////////////////////////////////////////////////////////////////////////
// Game Bar

function GameBar(targetIDsel){
	var undo=!state.metadata.noundo?ButtonOnClickHTML('↶','CheckRegisterKey({keyCode:85});GameFocus();'):"";
	var restart=!state.metadata.norestart?ButtonOnClickHTML('↺','CheckRegisterKey({keyCode:82});GameFocus();'):"";
	
	var buttons=[
		//ButtonLinkHTML("How to play?"),
		undo,
		restart,
		ButtonOnClickHTML("Select level",'RequestLevelSelector()'),
		//ButtonLinkHTML("Credits"),
		//ButtonHTML({txt:"♫",attributes:{onclick:'ToggleCurrentSong();GameFocus();',id:'MuteButton'}}),
		ButtonHTML({txt:"◱",attributes:{onclick:'ToggleFullscreen("'+targetIDsel+'");GameFocus();',id:'FullscreenButton'}}),
	].join("");
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(targetIDsel){
	var targetIDsel=targetIDsel||"#puzzlescript-game";
	var bar=GetElement("GameBar");
	if(bar!==null)
		bar.parentNode.removeChild(bar);
	var parentElement=GetElement(targetIDsel).parentElement;
	if(!parentElement.id)
		parentElement.id=GenerateId();
	AddAfterElement(GameBar(parentElement.id),targetIDsel)
}


/////////////////////////////////////////////////////////////////////////////////////
// Focus on Game Canvas
function GameFocus(DP){
	window.Mobile.GestureHandler.prototype.fakeCanvasFocus();
	keyActions=keyActionsGame;
};

/////////////////////////////////////////////////////////////////////////////////////
// Save permissions

var curcheckpoint=0;
var savePermission=true;


/////////////////////////////////////////////////////////////////////////////////////
// Save Level & Checkpoint

function DocumentURL(){
	if (typeof pageNoTag==="undefined")
		return document.URL;
	else
		return pageNoTag(document.URL);
}
function CanSaveLocally(){
	return window.localStorage;
}
function HasCheckpoint(){
	return void 0!==localStorage[DocumentURL()+"_checkpoint"];
}
function HasLevel(){
	return CanSaveLocally()&&void 0!==localStorage[DocumentURL()];
}


// Localsave = save in local storage
function LocalsaveLevel(curlevel){
	if(savePermission){
		localStorage[DocumentURL()+"_solvedlevels"]=JSON.stringify(SolvedLevelScreens());
		return localStorage[DocumentURL()]=curlevel;
	}
	else
		EraseLocalsaveLevel();
};

function LocalsaveCheckpoints(newstack){
	if(savePermission)
		return localStorage[DocumentURL()+"_checkpoint"]=JSON.stringify(newstack);
	else
		EraseLocalsaveCheckpoints();
}

function EraseLocalsaveLevel(){
	return localStorage.removeItem(DocumentURL());
};

function EraseLocalsaveCheckpoints(){
	return localStorage.removeItem(DocumentURL()+"_checkpoint");
};

function EraseLocalsave(){
	return CanSaveLocally()&&(EraseLocalsaveLevel(),EraseLocalsaveCheckpoints());
}


// Load from memory
function LoadLevel(){
	SolvedLevelScreens.levels=JSON.parse(localStorage[DocumentURL()+"_solvedlevels"]).map(Number);
	return curlevel=localStorage[DocumentURL()];
}


function LocalloadCheckpoints(){
	var storeddata=localStorage[DocumentURL()+"_checkpoint"];
	var sta=storeddata?JSON.parse(storeddata):[];
	sta=sta.dat?[sta]:sta;	//data compatibility (converts single checkpoint to array if needed)
	return sta;
}

function GetCheckpoints(){
	if(GetCheckpoints.stack)
		return GetCheckpoints.stack;
	else
		return GetCheckpoints.stack=LocalloadCheckpoints();
}

function LoadCheckpoint(n){
	var stack=GetCheckpoints();

	if(n<stack.length)
		ConsoleAddOnce("Beware! Saving at a past checkpoint will erase former future progress...");
	
	curcheckpoint=Math.min(Math.max(n-1,0),stack.length-1); //decrement 1 unit
	return curlevelTarget=stack[curcheckpoint];
}


function PushSaveCheckpoint(levelTarget){
	var stack=GetCheckpoints();
	
	function EvacuateCheckpoints(stack,n){
		var s=stack;
		var i=s.length-1;
		while(n<i){
			i--;
			s.pop();
		}
		return s;
	};
	
	if(curcheckpoint+1<stack.length){
		stack=EvacuateCheckpoints(stack,curcheckpoint);
		ConsoleAdd("Saved in a past checkpoint. Future progress erased.")
	}
	
	stack=stack.concat([levelTarget]);
	curcheckpoint=stack.length-1;
	
	return GetCheckpoints.stack=stack;
}



function LoadGame(){
	if(HasLevel()){
		if(HasCheckpoint()){
			LoadLastCheckpoint();
		}
		return LoadLevel();
	}
}


// Preserve original level save format (within checkpoint stack)

function FormerLevel4Serialization() { //The original one
	var ret = {
		dat : Array.from(level.objects),
		width : level.width,
		height : level.height,
		oldflickscreendat: oldflickscreendat.concat([]),
		//New
		lvl:curlevel
	};
	return ret;
}




////////////////////////////////////////////////////////////////////////////////
// Level/Message Screen navigation

// Keep track of solved levels

function ScreenMessage(lvl){
	return typeof state.levels[lvl].message !=="undefined"
}

function ScreenType(level){
	return typeof level.message==="undefined";	
}

function LevelScreens(){
	if(LevelScreens.l!==undefined)
		return LevelScreens.l;
	else{
		var l=[];
		for(var i=0;i<state.levels.length;i++){
			if(ScreenType(state.levels[i]))
				l.push(i);
		}
		return LevelScreens.l=l;
	}
}

function SolvedLevelScreens(){
	if(SolvedLevelScreens.levels===undefined)
		SolvedLevelScreens.levels=[];
	return SolvedLevelScreens.levels;
}

function AddToSolvedScreens(curlevel){
	function SortNumber(a,b){return a-b};
	if(!ScreenMessage(curlevel)&&!LevelScreenSolved(curlevel)){
		SolvedLevelScreens.levels.push(Number(curlevel));
		SolvedLevelScreens.levels=SolvedLevelScreens.levels.sort(SortNumber);
	}
	return SolvedLevelScreens();
}

function LevelScreenSolved(curlevel){
	return SolvedLevelScreens().indexOf(curlevel)>=0
}

function UnSolvedLevelScreens(){
	return LevelScreens().filter(function(l){return !LevelScreenSolved(l)});
}

function FirstUnsolvedScreen(curlevel){
	if(UnSolvedLevelScreens().length===0)
		return 1+LevelScreens()[LevelScreens().length-1];
	else{
		var c=LevelScreens().indexOf(UnSolvedLevelScreens()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelScreens()[c-1];
	}
}

function NextUnsolvedScreen(curlevel){
	var firstusolve=UnSolvedLevelScreens().filter(x=>x>=curlevel)[0];
	var lastsolvebefore=LevelScreens().filter(x=>x<firstusolve);
	return lastsolvebefore[lastsolvebefore.length-1]+1;
}

function LastScreen(){return state.levels.length-1;};

function FinalLevelScreen(){
	var li=LevelScreens(); return li[li.length-1];
};

function ClearSolvedLevelScreens(){
	return SolvedLevelScreens.levels=[];
}

function SolvedAllLevels(){
	return LevelScreens().every(LevelScreenSolved);
}

function LevelNumber(curlevel){
	return LevelScreens().filter(function(l){return l<curlevel}).length+1;
}


// Level Selector

function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var type="level";
		var DPOpts={
			questionname:"Access one of the "+LevelScreens().length+" levels",
			qfield:"level",
			qchoices:LevelScreens().map(StarLevel),
			defaultChoice:function(i,c){return Number(c)===LevelNumber(curlevel)}
		}
	}
	else{
		var type="checkpoint";
		var checkpointIndices=Object.keys(GetCheckpoints());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qfield:"level",
			qchoices:checkpointIndices.map(l=>(Number(l)+1)+""),
			defaultChoice:function(i,c){return Number(c)===checkpointIndices.length}
		}
	}
	
	function RequestLevelSelectorIndeed(){
		RequestDataPack([
				['exclusivechoice',DPOpts]
			],
			{
				actionvalid:LoadLevelFromDP,
				actionText:"Go to "+type,
				qid:RequestLevelSelector.id,
				qonsubmit:FocusAndResetFunction(RequestLevelSelector,GameFocus),
				qonclose:FocusAndResetFunction(RequestLevelSelector,GameFocus),
				qdisplay:LaunchBalloon,
				qtargetid:ParentSelector("GameBar"),
				shortcutExtras:extraShortcutsF
			});
	}
	
	function extraShortcutsF(DP){return {"L":function(){Close(DP.qid)}}};
	
	OpenerCloser(RequestLevelSelector,RequestLevelSelectorIndeed,GameFocus);

}

function MaxLevelDigits(){
	if(MaxLevelDigits.m)
		return MaxLevelDigits.m;
	return MaxLevelDigits.m=Math.ceil(Math.log10(1+LevelScreens().length));
};
function StarLevel(l){
	var n=LevelNumber(l)+"";
	var padding="0".repeat(MaxLevelDigits()-n.length);
	return padding+n+(LevelScreenSolved(l)?"★":"");
}
function UnstarLevel(l){
	return Number(l.replace("★",""));
}

function LoadLevelFromDP(DP){
	var lvl=UnstarLevel(FindData('level',DP.qid));
	if(!HasCheckpoint()){
		//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
		lvl=lvl<2?0:(LevelScreens()[lvl-2]+1);
		GoToLevel(lvl);
	}
	else{
		GoToLevelCheckpoint(lvl);
	}
};

function GoToLevelCheckpoint(n){
	if(HasCheckpoint()){
		LoadCheckpoint(n);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};

function GoToLevel(lvl){
	curlevel=lvl;
	AdvanceLevel();
	canvasResize();
};


// Level Progression

function StartLevelFromTitle(){
	if (titleSelection===0){//new game
		ResetLevel();
		ResetCheckpoints();
	}
	
	LoadLastCheckpoint();
	LoadLevelOrCheckpoint();
}

function ResetLevel(){
	curlevel=0;
	curlevelTarget=null;
}


function LoadLastCheckpoint(){
	if(HasCheckpoint()){
		var stack=GetCheckpoints();
		curcheckpoint=stack.length-1;
		curlevelTarget=stack[curcheckpoint];
	}
}

function ResetCheckpoints(){
	curcheckpoint=0;
	EraseLocalsaveCheckpoints();
	GetCheckpoints.stack=[];
}

function ResetGame(){
	EraseLocalsave();
	ClearSolvedLevelScreens();
	ResetLevel();
	ResetCheckpoints();
	goToTitleScreen();
	tryPlayEndGameSound();
}

function AdvanceLevel(){
	textMode=false;
	titleScreen=false;
	quittingMessageScreen=false;
	messageselected=false;
	LocalsaveLevel(curlevel);
	LoadLevelOrCheckpoint();
}

function AdvanceUnsolvedScreen(){
	if(ScreenMessage(curlevel)&&curlevel<FinalLevelScreen()){
		//console.log("from message");
		curlevel++;
	}
	else if(curlevel>=FinalLevelScreen()||!NextUnsolvedScreen(curlevel)){
		//console.log("from last level");
		curlevel=FirstUnsolvedScreen(curlevel);
	}
	else{
		//console.log("from anywhere in the middle");
		curlevel=NextUnsolvedScreen(curlevel);
	}		
	AdvanceLevel();	
}

function AdvanceEndScreen(){
	if(curlevel>=FinalLevelScreen())
		curlevel++;
	else
		curlevel=FinalLevelScreen()+1;
	
	AdvanceLevel();		
}

function LoadLevelOrCheckpoint(){
	if ((typeof curlevelTarget!=="undefined")&&(curlevelTarget!==null)){
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		curlevelTarget=null;
	}
	else
		loadLevelFromState(state,curlevel);
}

// Preserve this function

function AdjustFlickscreen(){
	if (state!==undefined && state.metadata.flickscreen!==undefined){
		oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)];
	}
}


////////////////////////////////////////////////////////////////////////////////
//Key capturing

//Game keybinding profile
keyActionsGame={
	//Arrows & Spacebar
	32:function(ev){prevent(ev);InstructGame(ev)},
	37:function(ev){prevent(ev);InstructGame(ev)},
	38:function(ev){prevent(ev);InstructGame(ev)},
	39:function(ev){prevent(ev);InstructGame(ev)},
	40:function(ev){prevent(ev);InstructGame(ev)},
	//WASD
	65:function(ev){ev.keyCode=37;InstructGame(ev)},
	87:function(ev){ev.keyCode=38;InstructGame(ev)},
	68:function(ev){ev.keyCode=39;InstructGame(ev)},
	83:function(ev){ev.keyCode=40;InstructGame(ev)},	
	//Enter, C, X
	13:function(ev){ev.keyCode=88;InstructGame(ev)},	
	67:function(ev){ev.keyCode=88;InstructGame(ev)},	
	88:function(ev){ev.keyCode=88;InstructGame(ev)},
	// Z, U     
	90:function(ev){ev.keyCode=85;InstructGame(ev)},	
	85:InstructGame,	
	// R
	82:InstructGame,	
	// Esc
	27:InstructGame,
	76:RequestLevelSelector 	//L
}

//Execute key instructions
function CheckRegisterKey(event){
	checkKey(event,true);
}


function InstructGame(event){
	var key=event.keyCode;
		
	//Avoid repetition?
    if (keybuffer.indexOf(key)>=0) {
    	return;
    }
	
	//Instruct the game
    if(lastDownTarget === canvas /*|| (window.Mobile && (lastDownTarget === window.Mobile.focusIndicator) )*/ ){
    	if (keybuffer.indexOf(key)===-1) {
    		keybuffer.splice(keyRepeatIndex,0,key);
	    	keyRepeatTimer=0;
	    	CheckRegisterKey(event);
		}
	}
}


function OnKeyDownGame(event) {
	event = event || window.event;
	//Not inside other elements, such as feedback forms, etc...
	if(event.target.tagName!=="BODY")
		return;
	else if(keyActions[event.keyCode])
		keyActions[event.keyCode](event);
}












////////////////////////////////////////////////////////////////////////////////
//Overwritten PS functions
function doSetupTitleScreenLevelContinue(){	LoadGame();};

doSetupTitleScreenLevelContinue()

//DoWin - Level selector - keep track of solved levels 
function DoWin() {
	if (!winning) {
		AddToSolvedScreens(curlevel);
		LocalsaveLevel(curlevel);
		if(typeof customLevelInfo!= "undefined")customLevelInfo();
		if (againing = false, tryPlayEndLevelSound(), unitTesting){
			ClearLevelRecord();
			return void nextLevel();
		}
		winning = true, timer = 0
	}
}

//nextLevel - Level selector - non-linear level navigation "jumping"
function nextLevel(){
	againing=false;
	messagetext="";
	
	curlevel=Math.min(curlevel,LastScreen()?LastScreen():curlevel);
	
	if (titleScreen)
		StartLevelFromTitle();
	else {
		if(!SolvedAllLevels())
			AdvanceUnsolvedScreen();
		else if(curlevel<LastScreen())
			AdvanceEndScreen();
		else{
			RequestHallOfFame();
			ResetGame();
		}
	}
	
	AdjustFlickscreen();
	canvasResize();
}


//level4Serialization - save a full checkpoint stack 
function level4Serialization() { //Intercept
	
	var stack=GetCheckpoints();
	console.log("restarting",restarting,stack);
	
	setTimeout(function(){
		console.log("saving...",stack);
		if(!restarting)
			stack=PushSaveCheckpoint(restartTarget)
		LocalsaveCheckpoints(stack);
		LocalsaveLevel(curlevel);
	},500)
	
	return FormerLevel4Serialization();
}



////////////////////////////////////////////////////////////////////////////////
// Adding the bar and its behaviours

function LoadGameBar(gameSelector){
	StopCapturingKeys(onKeyDown);ResumeCapturingKeys(OnKeyDownGame);
	AddGameBar(gameSelector);
	GameFocus();	
}


////////////////////////////////////////////////////////////////////////////////
//Load stylesheet

function LoadStyle(styleSheet,gameSelector){
	if(!IsQuerySelector(gameSelector))
		gameSelector="#"+gameSelector;
	
	var stylesheet=styleSheet.replace(/\#gameCanvas/g,gameSelector).replace(/\.game\-container/g,"#"+ParentSelector(gameSelector));
	
	AddElement("<style>"+stylesheet+"</style>",'head');
}


////////////////////////////////////////////////////////////////////////////////
// Locate your game here:
var gameSelector="#gameCanvas";
LoadGameBar(gameSelector);
LoadStyle(stylesheet,gameSelector);
