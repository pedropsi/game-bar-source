/*	
	Game Bar (c) Pedro PSI 2019
	MIT License 
	///////////////////////////////////////////////////////
	https://pedropsi.github.io/puzzlescript-game-bar#source
	
*/

var CONTEXT="";
var DESTINATIONS={};

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
function RandomChoice(v){return v[RandomInteger(v.length)]};


function GenerateId(){
	var preconsonants = "bcdfghjklmnpqrstvwxz";
	var preconsonants2 = "hjlnrs";
	var vowels = "aeiouyáéíóúàèìòùýäëïöüÿãõâêîôû";
	var posconsonants2 = "pkstm";
	var posconsonants = "bcdglmnrstxz";
				
	function PreSyllabe(){
		return RandomInteger(5)<=3?RandomChoice(preconsonants)+(RandomInteger(5)<=1?RandomChoice(preconsonants2):""):"";
	}
	function PosSyllabe(){
		return RandomInteger(5)<=3?RandomChoice(posconsonants)+(RandomInteger(5)<=1?RandomChoice(posconsonants2):""):"";
	}
	function MidSyllabe(){
		return RandomChoice(vowels)+(RandomInteger(5)<=2?RandomChoice(vowels):"");
	}
	function Syllabe(){
		return PreSyllabe()+MidSyllabe()+PosSyllabe();
	}
	return Syllabe()+Syllabe()+Syllabe()+Syllabe()+Syllabe();
};


////////////////////////////////////////////////////////////////////////////////
//Load styles

function LoadStyle(sourcename){
	var head= document.getElementsByTagName('head')[0];
	var styleelement= document.createElement('link');
	styleelement.href= sourcename.replace(".css","")+".css";
	styleelement.rel="stylesheet";
	styleelement.type="text/css";
	head.appendChild(styleelement);
}

function LoadStyleCode(sourcecode){
	var head= document.getElementsByTagName('head')[0];
	var styleelement= document.createElement('link');
	styleelement.rel="stylesheet";
	styleelement.type="text/css";
	styleelement.innerHTML=sourcecode;
	head.appendChild(styleelement);
}

///////////////////////////////////////////////////////////////////////////////
// DOM Manipulation

function MakeElement(html){
	var e=document.createElement("div");
	e.innerHTML=html;
	return e.firstChild;
}

HTMLTags=['!DOCTYPE','a','abbr','acronym','abbr','address','applet','embed','object','area','article','aside','audio','b','base','basefont','bdi','bdo','big','blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','colgroup','data','datalist','dd','del','details','dfn','dialog','dir','ul','div','dl','dt','em','embed','fieldset','figcaption','figure','figure','font','footer','form','frame','frameset','h1','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','label','input','legend','fieldset','li','link','main','map','mark','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','param','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','video','audio','span','strike','del','s','strong','style','sub','summary','details','sup','svg','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','video','audio','tt','u','ul','var','video','wbr'];

function IsTagClassID(parentIDsel){
	var classID=parentIDsel.replace(/^\..*/,"").replace(/^\#.*/,"")!==parentIDsel;
	if(classID)
		return true;
	else
		return HTMLTags.indexOf(parentIDsel)>=0;
}

// Add new element to page, under a parent element
function GetElement(parentIDsel){
	if(IsTagClassID(parentIDsel))
		return document.querySelector(parentIDsel);
	else
		return document.getElementById(parentIDsel);
};

// Add new element to page, under a parent element
function AddElement(html,parentIDsel){
	var e=MakeElement(html);
	var p=GetElement(parentIDsel);
	p.appendChild(e);
};

function PrependElement(html,parentIDsel){
	var e=MakeElement(html);
	var p=GetElement(parentIDsel);
	p.insertAdjacentElement('afterbegin', e);
};

// Add new element to page, after a sibling element
function AddAfterElement(html,selector){
	var s=document.querySelectorAll(selector);
	var e;
	for(var i=0;i<s.length;i++){
		e=document.createElement("div");
		e.innerHTML=html;
		s[i].insertAdjacentElement('afterend',e.firstChild)};
};

// Replace parent element contents with new element
function ReplaceElement(html,parentID){
	var p=GetElement(parentIDsel);
	p.innerHTML=html;
};


// Add HTML Data from external source to page
function OverwriteData(source,destinationID,Transform){	
	var data = LoadData(source);
	if(Transform){
		data = Transform(data);
	}
	ReplaceElement(data,destinationID);
};

// Add HTML Data from external source to page
function RefreshData(source,destinationID,Transform){	
	RefreshData[destinationID]=function(){OverwriteData(source,destinationID,Transform)};
	RefreshData[destinationID]();
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

//////////////////////////////////////////////////
// Scroll into

function ScrollInto(elementIDsel){
  var e = GetElement(elementIDsel);
  e.scrollIntoView();
}


////////////////////////////////////////////////////////////////////////////////
// Element Generator

function ReadAttributes(attributesObj){
	return Object.keys(attributesObj).map(k=>k+"='"+attributesObj[k]+"'").join(" ");
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
	return ButtonHTML({tag:"span",txt:"&times;",attributes:{class:"closer",onclick:'Close(\"'+targetid+'\")'}});
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

		qtype:PlainHTML,				//Format of question :receives a DataField
		qplaceholder:"❤ Pedro PSI ❤",	//Placeholder answer

		qsubmittable:true, 				//whether the element expects submission (true) or merely presents information (false)
		qrequired:true,					
		qvalidator:IdentityValidator,	//Receives a DataField
		qerrorcustom:''
	}
}

function DefaultDataPack(){
	return {
		fields:[],

		qid:GenerateId(),				//id
		
		destination:'Feedback',			//Name of data repository

		action:'CheckSubmit', 			//action on submit :receives a qid
		actionvalid:SubmitValidAnswer,	//action on valid submit: receives a DataPack
		actionText:'Submit',			//text to display instead of "Submit"
		
		qtargetid:document.body.id,		//Where to introduce form in page?
		qdisplay:LaunchModal,			//Question display function :receives a DataPack

		qonsubmit:LaunchThanksModal,	//Next modal on successful submit: receives a DataPack
		qonclose:Identity,				//Next modal on close (defaults to nothing): receives a DataPack
		thanksmessage:"Submitted. Thank you!"
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
		message:NewDataField({
			action:'Close',
			destination:'',
			qtype:LongAnswerHTML,
			qdisplay:LaunchThanksModal}),
		email:NewDataField({
			qtype:ShortAnswerHTML,
			qfield:"address",
			qplaceholder:"_______@___.___",
			qvalidator:EmailValidator,
			}),
		name:NewDataField({
			qrequired:false,
			qvalidator:NameValidator,
			qfield:"name",
			qtype:ShortAnswerHTML,
			questionname:"Your name",
			qplaceholder:"(optional)"}),
		answer:NewDataField({
			qfield:"answer",
			qtype:LongAnswerHTML,
			qvalidator:SomeTextValidator}),
		exclusivechoice:NewDataField({
			qfield:'answer',
			questionname:"Which one?",
			qchoices:["on","off"],
			qtype:ExclusiveChoiceButtonRowHTML}),
		multiplechoice:NewDataField({
			qfield:'answer',
			questionname:"Which ones?",
			qchoices:["1","2","3","4","5"],
			qtype:ChoicesButtonRowHTML}),
		pass:NewDataField({
			questionname:"What is the password?",
			qfield:'answer',
			qtype:ShortAnswerHTML,
			qvalidator:SomeTextValidator,
			qplaceholder:"(top-secret)"}),
		snapshot:NewDataField({
			questionname:"Attach a snapshot?",
			qfield:'snapshot',
			qtype:ExclusiveChoiceButtonRowHTML,
			qchoices:["no","yes"]}),
		secret:NewDataField({
			questionname:"",
			qsubmittable:false})
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
	return {fields:NamedFieldArray.map(ndf=>CustomDataField(ndf[0],ndf[1]))};
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
		
		FocusOn("#"+DP.qid+" textarea, "+"#"+DP.qid+" input"); //First question
		
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

function ChoicesButtonRowHTML(dataField){
	function ChoicesButtonHTML(choice,dataFiel,i){
		var args='(\''+dataFiel.qfield+'\',\''+choice+'\',\''+dataFiel.pid+'\')';
		return ButtonOnClickHTML(choice,'ToggleThis(event,this);ToggleData'+args);
	};
	//console.log(dataField.qfield);console.log(dataField.pid);console.log(GetDefaultData(dataField.qfield,dataField.pid));
	ClearData(dataField.qfield,dataField.pid);
	return ChoiceHTML(dataField,ChoicesButtonHTML)
}

function ExclusiveChoiceButtonRowHTML(dataField){
	function ExclusiveChoiceButtonHTML(choice,dataFiel,i){
		var selected="";
		var args='(\''+dataFiel.qfield+'\',\''+choice+'\',\''+dataFiel.pid+'\')';
		if(i==='0')
			selected=' selected" onload="SetData'+args; //Default option
		return '<div class="button'+selected+'" onclick="ToggleThisOnly(event,this);SwitchData'+args+'">'+choice+'</div>';
	};
	//console.log(dataField.qfield);console.log(dataField.pid);
	ClearData(dataField.qfield,dataField.pid);
	return ChoiceHTML(dataField,ExclusiveChoiceButtonHTML)
}

function ShortAnswerHTML(dataField){
	return "<input data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"'></input>";
}

function LongAnswerHTML(dataField){
	return "<textarea data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"'></textarea>";
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
	if(Fields.some(dp=>dp.qsubmittable))
		SubmissionButton=SubmitButtonHTML(DP);
	return '<div id="'+DP.qid+'">'+SubQuestions+SubmissionButton+"</div>";
}



////////////////////////////////////////////////////////////////////////////////
// Balloons

function LaunchThanksBalloon(DP){
	RequestDataPack(
		[['plain',{questionname:DP.thanksmessage,destination:""}]],
		{qtargetid:DP.qtargetid,qdisplay:LaunchBalloon});
}

function LaunchBalloon(DP){
	OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function BalloonHTML(avatarsrc,content,id){
	var b='<div class="balloon" id='+id+'>'+CloseButtonHTML(id)+'<img class="avatar" src="'+avatarsrc+'"/><div class="subtitle">'+content+'</div></div>';
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
// Toggling class & buttons

function ToggleClass(selector,clas){
	GetElement(selector).classList.toggle(clas);
}

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

////////////////////////////////////////////////////////////////////////////////
// Data submission in forms

function SubmitData(dataObject,destination){
	var data =dataObject;
	data.formDataNameOrder=destination.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=destination.sheet;
	SUBMISSIONHISTORY.push(data);
	echoPureData(data,destination.url);
}

function InvalidateAnswer(DF){
	var validator=DF.qvalidator(DF);
	var errorid="error-"+DF.qid;
	CloseElementNow(errorid);
	FocusElement(DF.qid);
	var invalid=(DF.qrequired&&!validator.valid);
	if(invalid)
		AddAfterElement(ErrorHTML(validator.error,errorid),"#"+DF.qid);
	return invalid;
}


function SubmitValidAnswer(DP){
	var formtype=FindData("destination",DP.qid);
	var destinationObject=GetDestination(formtype);
	var dataObject=(destinationObject.Data)(DP.qid);
	SubmitData(dataObject,destinationObject);
}


function SubmitAnswerSet(DP){
	var invalidation=DP.fields.map(InvalidateAnswer);
	if(!invalidation.some(x=>x===true)){
		DP.actionvalid(DP),CloseAndContinue(DP);
	}
}

function CheckSubmit(qid){
	var DP=GetDataPack(qid);
	if(typeof DP!=="undefined"){
		SubmitAnswerSet(DP);
	};
}

var SUBMISSIONHISTORY=[];

function PreviousSubmission(field){
	var s=SUBMISSIONHISTORY.filter(datasub=>((typeof datasub[field])!=="undefined"));
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
		var fis=DP.fields.filter(f=>(f.qfield===field));
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
// Global Data Transmission Variables


function GetDestination(dname){
	return DESTINATIONS[dname];
}

///////////////////////////////////////////////////////////////////////////////
// Modals

function ModalHTML(content,id,type){
	var t=type?(" "+type):"";
	return'<div class="modal'+t+'" id="'+id+'" onclick="CloseThis(event,this,\''+id+'\')">\
	        <div class="modal-content">\
	        	'+CloseButtonHTML(id)+'\
				'+content+'\
			</div>\
		</div>';
}

function OpenModal(content,id,targetid){
	AddElement(ModalHTML(content,id),targetid);
}

function OpenMessageModal(message,id,targetid){
	var qid=id?id:GenerateId();
	var targetid=targetid?targetid:document.body.id;
	OpenModal(MessageHTML(message)+OkButtonHTML(qid),qid,targetid);
}

/*Modal self-laucher for questions (datapacks)*/
function LaunchModal(DP){
	OpenModal(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function LaunchThanksModal(DP){
	RequestDataPack(
		[['plain',{questionname:DP.thanksmessage,destination:""}]],
		{qtargetid:DP.qtargetid,qdisplay:LaunchModal});
	
}


///////////////////////////////////////////////////////////////////////////////
// Form Validators and Modifiers

// Pattern Validator Generator
function PatternValidatorGenerator(pattern,errormessage){
	function ValidatorFunction(DF){
		var string=FindData(DF.qfield,DF.qid);
		if((typeof string!=="undefined")&&(string.match(pattern)!==null))
			return {valid:true,error:"none"}
		else if(DF.qerrorcustom!=='')
			return {valid:false,error:DF.qerrorcustom}
		else
			return {valid:false,error:errormessage}
		};
	return ValidatorFunction;
}

// Form Validators

function IdentityValidator(DF){return {valid:true,error:"no errors"};}

function EmailValidator(DF){
	var pattern=/(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?\.)+[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ig;
	var errormessage="Please verify your e-mail address!";
	return PatternValidatorGenerator(pattern,errormessage)(DF);
}

function SomeTextValidator(DF){
	var pattern=/[\d\w]/;
	var errormessage="Please write something!";
	return PatternValidatorGenerator(pattern,errormessage)(DF);
}

function NameValidator(DF){
	var pattern=/[\d\w][\d\w]+/;
	var errormessage="Please write at least 2 alphanumerics!";
	return PatternValidatorGenerator(pattern,errormessage)(DF);
}

// Utility
function SomeTextValidate(name){
	var pattern=/[\d\w]/;
	return name.match(pattern)!==null;
}


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

function ConsoleAdd(messageHTML,duration){
	
	if(GetElement("Console")===null)
		ConsoleLoad();
	
	var delay=duration?Math.max(1000,duration):9000;
	var mID="c-"+GenerateId();//random id
	AddElement(ConsoleMessageHTML(messageHTML,mID),"Console");
	setTimeout(function(){CloseElement(mID)},duration);
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

//DataPack integration in console
function LaunchConsoleMessage(DP){
	ConsoleAdd(QuestionHTML(DP));
}


///////////////////////////////////////////////////////////////////////////////
//Music Control

//Playlist
function Playlist(i){
	if(typeof Playlist.p==="undefined"){
		Playlist.p=document.getElementsByTagName('audio');
		Playlist.l=Playlist.p.length;
	}
	if(typeof i ==="undefined"){
		return Playlist.p;
	}
	else{
		Playlist.current=i%Playlist.l;
		return Playlist.p[Playlist.current];
	}
}

Playlist.ConsoleAdd=function(message){ConsoleAdd(message,1500)};

function PlaylistLoad(){
	document.addEventListener('click',PlaylistStartPlay);
}

function PlaylistStartPlay(){
	document.removeEventListener('click',PlaylistStartPlay);
	PlaySong(Playlist(0));
	console.log("Music on");
}


//Song
function PlaySong(song){
	if((typeof song!=="undefined")&&song.paused){
		song.play();
		song.addEventListener('ended',PlayNextF(song));
		
		window.addEventListener("blur", PlaylistSleep);
		//console.log("Now playing: "+song);
	}
}

function PauseSong(song){
	if((typeof song!=="undefined")&&!song.paused){
		song.pause();
		Playlist.ConsoleAdd("Music paused...");
		
		window.removeEventListener("blur", PlaylistSleep);
	}
}

function ResumeSong(song){
	if((typeof song!=="undefined")&&song.paused){
		song.play();
		Playlist.ConsoleAdd("Resumed playing ♫♪♪ "+NameSong(song));
		
		window.addEventListener("blur", PlaylistSleep);
	}
}

function NameSong(song){
	return pageRelativePath(song.src).replace(/.*\//,"").replace(/\.mp3$/,"").replace(/\.wav$/,"").replace(/\.ogg$/,"").replace(/\%20/g," ");
}

function PlayNextF(song){
	return function(){
		PlaySong(Playlist(Playlist.current+1));
		song.removeEventListener('ended',PlayNextF);
		console.log("Finished playing: "+song);
	}
}


//Player

function CurrentSong(){
	return Playlist.p[Playlist.current];
}

function ToggleCurrentSong(thi){

	if(thi)thi.classList.remove("selected");

	var song=CurrentSong();
	if(typeof song==="undefined")
		Playlist.ConsoleAdd("Error: can't find the jukebox...");
	else if(song.paused){
		ResumeSong(song);
	}
	else {
		PauseSong(song);
		if(thi)thi.classList.add("selected");
	}
}

function PlaylistSleep(){
	if(!Playlist.sleep){
		Playlist.sleep=true;
		PauseSong(CurrentSong());
		window.addEventListener("focus", PlaylistAwaken);
	}
}

function PlaylistAwaken(){
	if(Playlist.sleep){
		Playlist.sleep=false;
		ResumeSong(CurrentSong());
		window.removeEventListener("focus", PlaylistAwaken);
	}
}


PlaylistLoad();



///////////////////////////////////////////////////////////////////////////////
//Fullscreen

function FullscreenAllowed(){
	return (document.exitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen||document.msExitFullscreen||(document.webkitFullscreenElement&&document.webkitExitFullscreen)||false)!==false;
}

function FullscreenOpen(targetIDsel){
	var e = GetElement(targetIDsel);
	var f;
	if(f=e.requestFullscreen){
		e.requestFullscreen();
	} else if(f=e.mozRequestFullScreen){ /* Firefox */
		e.mozRequestFullScreen();
	} else if(f=e.webkitRequestFullscreen){ /* Chrome, Safari and Opera */
		e.webkitRequestFullscreen();
	} else if(f=e.msRequestFullscreen){ /* IE/Edge */
		e.msRequestFullscreen();
	} 
	
	//Place the console correctly
	if(f)
		ConsoleLoad(targetIDsel);
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
	
	if(f) ConsoleLoad();
}

function ToggleFullscreen(targetIDsel,thi){
	if(FullscreenAllowed()){
		if(thi)thi.classList.toggle("selected");
	
		if(document.fullscreenElement||document.webkitFullscreenElement){
			FullscreenClose();
		}
		else{
			FullscreenOpen(targetIDsel);
		}
	}
	else
		Playlist.ConsoleAdd("Fullscreen: Please contact Pedro PSI to add your browser, not yet supported!");
};


///////////////////////////////////////////////////////////////////////////////
//Focus
function FocusOn(targetIDsel){
	var firstelement=GetElement(targetIDsel);
	if(firstelement&&firstelement[0])
		firstelement[0].focus();
}












/////////////////////////////////////////////////////////////////////////////////////
// Save and Checkpoints

var curcheckpoint=0;

function DocumentURL(){
	if (typeof pageNoTag==="undefined")
		return document.URL;
	else
		return pageNoTag(document.URL);
}

function HasCheckpoint(){
	return void 0!==localStorage[DocumentURL()+"_checkpoint"];
}
function HasLevel(){
	return HasSave()&&void 0!==localStorage[DocumentURL()];
}
function HasSave(){
	return window.localStorage;
}

function SetCheckpointStack(newstack){
	MaxCheckpoint(newstack.length);
	return localStorage[DocumentURL()+"_checkpoint"]=JSON.stringify(newstack);
}
function GetCheckpointStack(){
	var stack= JSON.parse(localStorage[DocumentURL()+"_checkpoint"]);
	MaxCheckpoint(stack.length-1);
	return stack;
}
	
function SaveCheckpoint(levelTarget,isReloading){
	var newstack;
	if (HasCheckpoint()){
		var stack=GetCheckpointStack();
		if(typeof stack.dat==="undefined"){
			if(isReloading)
				stack.pop();
			newstack=EvacuateCheckpointStack(stack,curcheckpoint);
			newstack=stack.concat([levelTarget]);
		}
		else{
			if(isReloading)
				newstack=[levelTarget];
			else{
				newstack=[stack,levelTarget];
			}
		}
	}
	else
		newstack=[levelTarget];
	
	curcheckpoint=newstack.length-1;
	return SetCheckpointStack(newstack);
}
function SaveLevel(curlevel){
	console.log("saved:"+curlevel);
	console.log(SolvedLevelIndices());
	localStorage[DocumentURL()+"_solvedlevels"]=JSON.stringify(SolvedLevelIndices());
	return localStorage[DocumentURL()]=curlevel;
};

function UnsaveCheckpoint(){
	return localStorage.removeItem(DocumentURL()+"_checkpoint");
};
function UnsaveLevel(){
	return localStorage.removeItem(DocumentURL());
};
function UnsaveSave(){
	return HasSave()&&(UnsaveLevel(),UnsaveCheckpoint())
}


function LoadLevel(){
	SolvedLevelIndices.levels=JSON.parse(localStorage[DocumentURL()+"_solvedlevels"]).map(Number);
	return curlevel=localStorage[DocumentURL()];
}
function LoadCheckpoint(n){
	var stack=GetCheckpointStack();
	if(typeof stack.dat=="undefined"){
			if(typeof n==="undefined")
				curcheckpoint=stack.length-1; //default to last checkpoint
			else{
				curcheckpoint=Math.min(Math.max(n,0),stack.length-1);
				stack=EvacuateCheckpointStack(stack,curcheckpoint);
		}
		curlevelTarget=stack[curcheckpoint];
	}
	else{
		curcheckpoint=0;
		curlevelTarget=stack;
	}
	var a=[],b;
	for(b in Object.keys(curlevelTarget.dat))
		a[b]=curlevelTarget.dat[b];
	return curlevelTarget.dat=new Int32Array(a)
}

function EvacuateCheckpointStack(stack,n){
	var s=stack;
	var i=s.length-1;
	while(n<i){
		i--;
		s.pop()
	}
	return s;
};

function LoadSave(){
	if(HasLevel()){
		if(HasCheckpoint())
			LoadCheckpoint();
		return LoadLevel();}
}



////////////////////////////////////////////////////////////////////////////////
// Level navigation

function GoToLevel(lvl){
	SaveLevel(lvl);
	winning=!1;
	timer=0;
	textMode=titleScreen=!1;
	titleSelection=0<curlevel||null!==curlevelTarget?1:0;
	messageselected=quittingTitleScreen=quittingMessageScreen=titleSelected=!1;
	titleMode=0;
	loadLevelFromState(state,lvl);
	canvasResize();
	clearInputHistory();
};

function isLevelMessage(lvl){
	return typeof state.levels[lvl].message !=="undefined"
}

function LevelType(level){
	return typeof level.message==="undefined";	
}

function LevelIndices(){
	if(LevelIndices.l!==undefined)
		return LevelIndices.l;
	else{
		var l=[];
		var i;
		for( i=0;i<state.levels.length;i++){
			if(LevelType(state.levels[i]))
				l.push(i);
		}
		return LevelIndices.l=l;
	}
}

function InLevelIndices(curlevel){
	return LevelIndices().indexOf(curlevel)!==-1;
}

function isLastLevel(curlevel){return LevelIndices()[LevelIndices().length-1]===curlevel};

function SolvedLevelIndices(){
	if(SolvedLevelIndices.levels===undefined){
		SolvedLevelIndices.levels=[];
	}
	return SolvedLevelIndices.levels;
}

function SortNumber(a,b){return a-b};

function AddToSolvedLevelIndices(curlevel){
	if(!InSolvedLevelIndices(curlevel)){
		SolvedLevelIndices.levels.push(Number(curlevel));
		SolvedLevelIndices.levels=SolvedLevelIndices.levels.sort(SortNumber);
	}
	return SolvedLevelIndices();
}

function InSolvedLevelIndices(curlevel){
	return SolvedLevelIndices().indexOf(curlevel)!==-1;
}

function UnSolvedLevelIndices(){
	return LevelIndices().filter(function(l){return SolvedLevelIndices().indexOf(l)===-1});
}

function FirstUnsolvedLevel(curlevel){
	if(UnSolvedLevelIndices().length===0)
		return 1+LevelIndices()[LevelIndices().length-1];
	else{
		var c=LevelIndices().indexOf(UnSolvedLevelIndices()[0]);
		if(c===0)
			return 0;
		else
			return 1+LevelIndices()[c-1];
	}
}

function NextUnsolvedLevel(curlevel){
	var firstusolve=UnSolvedLevelIndices().filter(x=>x>=curlevel)[0];
	var lastsolvebefore=LevelIndices().filter(x=>x<firstusolve);
	return lastsolvebefore[lastsolvebefore.length-1]+1;
}

function ClearSolvedLevelIndices(){
	console.log("levels solved cleared.");
	return SolvedLevelIndices.levels=[];
}

function SolvedLevelsAll(){
	return LevelIndices().every(l=>SolvedLevelIndices().indexOf(l)>=0);
}

function LevelNumber(curlevel){
	return LevelIndices().filter(function(l){return l<curlevel}).length+1;
}

function MaxLevel(){
	MaxLevel.max=MaxLevel.max?Math.max(curlevel,MaxLevel.max):Number(curlevel);
	return MaxLevel.max;
}

function MaxCheckpoint(m){ 
	if(m===undefined){  //Getter
		var c=Number(curcheckpoint);
		MaxCheckpoint.max=MaxCheckpoint.max?Math.max(c,MaxCheckpoint.max):c;
	}
	else				//Setter (m)
		MaxCheckpoint.max=Number(m);
	return MaxCheckpoint.max;
}


function RequestLevelSelector(){
	if(!HasCheckpoint()){
		var type="level";
		var DPOpts={
			questionname:"Access one of the "+LevelIndices().length+" levels",
			qfield:"level",
			qchoices:LevelIndices().map(l=>(LevelNumber(l)+(InSolvedLevelIndices(l)?"★":"")))
		}
	}
	else{
		var type="checkpoint";
		var checkpointIndices=Object.keys(GetCheckpointStack());
		var DPOpts={
			questionname:"Reached checkpoints:",
			qfield:"level",
			qchoices:checkpointIndices.map(l=>(Number(l)+1)+"")
		}
	}
	RequestDataPack([
		['exclusivechoice',DPOpts]
	],
	{
		actionvalid:LoadLevelFromDP,
		actionText:"Go to "+type,
		qonsubmit:Identity,
		qdisplay:LaunchBalloon,
		qtargetid:'#game'
	});
}

function LoadLevelFromDP(DP){
	var lvl=FindData('level',DP.qid).replace("★","");
	lvl=Number(lvl);
	if(!HasCheckpoint()){
		//Goes to exactly after the level prior to the chosen one, to read all useful messages, including level title
		var lvlpre=lvl<2?-1:LevelIndices()[lvl-2];
		GoToLevel(lvlpre+1);
	}
	else{
		GoToLevelCheckpoint(lvl-1);
	}
};


function GoToLevelCheckpoint(ncheckpoint){
	if(HasCheckpoint()){
		LoadCheckpoint(ncheckpoint);
		loadLevelFromStateTarget(state,curlevel,curlevelTarget);
		canvasResize();
}};


////////////////////////////////////////////////////////////////////////////////
/// Game Bar

function GameBar(targetIDsel){
	var undo=!state.metadata.noundo?ButtonOnClickHTML('↶','checkKey({keyCode:85},!0)'):"";
	var restart=!state.metadata.norestart?ButtonOnClickHTML('↺','checkKey({keyCode:82},!0)'):"";
	
	var buttons=[
		/*ButtonLinkHTML("How to play?"),*/
		undo,
		restart,
		ButtonOnClickHTML("Select level",'RequestLevelSelector()'),
		/*ButtonLinkHTML("Credits"),*/
		ButtonOnClickHTML("♫",'ToggleCurrentSong(this)'),
		ButtonOnClickHTML("◱",'ToggleFullscreen("'+targetIDsel+'",this)')
	].join("")
	
	return ButtonBar(buttons,"GameBar");
}

function AddGameBar(targetIDsel){
	var targetIDsel=targetIDsel||"#puzzlescript-game";
	var bar=GetElement("GameBar");
	if(bar!==null)
		bar.parentNode.removeChild(bar);
	AddAfterElement(GameBar(targetIDsel),targetIDsel)
}




////////////////////////////////////////////////////////////////////////////////
//Overwrites

//Fallback values in case of indefinition
if(!state||!state.metadata)
	var state={levels:false,metadata:{flickscreen:false}};
if(!curlevelTarget)
	var curlevelTarget=null;
if(!hasUsedCheckpoint)
	var hasUsedCheckpoint=false;
if(!sfxCreateMask)
	var sfxCreateMask={ior:Identity,anyBitsInCommon:Identity,setZero:Identity};
if(!sfxDestroyMask)
	var sfxDestroyMask={ior:Identity,anyBitsInCommon:Identity,setZero:Identity};
if(!clearInputHistory)
	var clearInputHistory =Identity;


function doSetupTitleScreenLevelContinue(){
	try{LoadSave()}
	catch(c){}}
doSetupTitleScreenLevelContinue()

function DoWin() {
	console.log("won");
	if (!winning) {
		AddToSolvedLevelIndices(curlevel);SaveLevel(curlevel);
		if(typeof customLevelInfo!= "undefined")customLevelInfo(); 
		if (againing = !1, tryPlayEndLevelSound(), unitTesting)	return void nextLevel();
		winning = !0, timer = 0
	}
}


function nextLevel(){
	againing=!1;
	messagetext="";
	state&&state.levels&&curlevel>state.levels.length&&(curlevel=state.levels.length-1);
	if(titleScreen)
		0===titleSelection&&(curlevel=0,curlevelTarget=null),null!==curlevelTarget?loadLevelFromStateTarget(state,curlevel,curlevelTarget):loadLevelFromState(state,curlevel);
	else if(hasUsedCheckpoint&&(curlevelTarget=null,hasUsedCheckpoint=!1),(curlevel<state.levels.length-1)&&!SolvedLevelsAll()){
		if(isLevelMessage(curlevel))
			curlevel++;
		else if(isLastLevel(curlevel))
			curlevel=FirstUnsolvedLevel(curlevel);
		else
			curlevel=NextUnsolvedLevel(curlevel);
		console.log("moved");
		messageselected=quittingMessageScreen=titleScreen=textMode=!1;
		null!==curlevelTarget?loadLevelFromStateTarget(state,curlevel,curlevelTarget):loadLevelFromState(state,curlevel);
	}
	else{
		try{
			UnsaveSave()
		}
		catch(a){}
		if(SolvedLevelsAll()) RequestHallOfFame();
		curlevel=0;
		curlevelTarget=null;
		goToTitleScreen();
		tryPlayEndGameSound();
	}
	try{
		if(HasSave())
			if(null!==curlevelTarget){
				restartTarget=level4Serialization();
				SaveCheckpoint(restartTarget,true)
			}
			else UnsaveCheckpoint()
	}
	catch(c){}
	void 0!==state&&void 0!==state.metadata.flickscreen&&(oldflickscreendat=[0,0,Math.min(state.metadata.flickscreen[0],level.width),Math.min(state.metadata.flickscreen[1],level.height)]);
	
	SaveLevel(curlevel);
	
	canvasResize();
	clearInputHistory();
}


function processInput(a,b,c){
	againing=!1;
	verbose_logging&&(-1===a?consolePrint("Turn starts with no input."):(consolePrint("======================="),consolePrint("Turn starts with input of "+["up","left","down","right","action"][a]+".")));
	var d=backupLevel(),e=[];
	if(4>=a){
		if(0<=a){
			switch(a){
				case 0:a=1;break;
				case 1:a=4;break;
				case 2:a=2;break;
				case 3:a=8;break;
				case 4:a=16
			}
		e=startMovement(a)
		}
		var g=0;
		level.bannedGroup=[];
		rigidBackups=[];
		level.commandQueue=[];
		var h=0,l=!1,p=commitPreservationState();
		
		sfxCreateMask.setZero();
		sfxDestroyMask.setZero();
		
		seedsToPlay_CanMove=[];
		seedsToPlay_CantMove=[];
		calculateRowColMasks();
		do l=!1,g++,verbose_logging&&consolePrint("applying rules"),applyRules(state.rules,state.loopPoint,h,level.bannedGroup),resolveMovements()?(l=!0,restorePreservationState(p)):(verbose_logging&&consolePrint("applying late rules"),applyRules(state.lateRules,state.lateLoopPoint,0)),h=0;
		while(50>g&&l);
		50<=g&&consolePrint("looped through 50 times, gave up.  too many loops!");
		if(0<e.length&&void 0!==state.metadata.require_player_movement){
			h=!1;
			for(g=0;g<e.length;g++)
				if(l=level.getCell(e[g]),state.playerMask.bitsClearInArray(l.data)){
					h=!0;
					break
				}
				if(!1===h)
					return verbose_logging&&(consolePrint("require_player_movement set, but no player movement detected, so cancelling turn."),consoleCacheDump()),backups.push(d),DoUndo(!0,!1),!1
		}
		if(0<=level.commandQueue.indexOf("cancel"))
			return verbose_logging&&(consoleCacheDump(),consolePrint("CANCEL command executed, cancelling turn.",!0)),backups.push(d),messagetext="",DoUndo(!0,!1),tryPlayCancelSound(),!1;
		if(0<=level.commandQueue.indexOf("restart"))
			return verbose_logging&&(consolePrint("RESTART command executed, reverting to restart state."),consoleCacheDump()),backups.push(d),messagetext="",DoRestart(!0),!0;
		if(c&&0<=level.commandQueue.indexOf("win"))
			return!0;
		h=!1;
		for(g=0;g<level.objects.length;g++)
			if(level.objects[g]!==d.dat[g]){
				if(c)
					return verbose_logging&&consoleCacheDump(),backups.push(d),DoUndo(!0,!1),!0;-1!==a&&backups.push(d);
				h=!0;
				break
			}
		if(c)
			return verbose_logging&&consoleCacheDump(),!1;
		for(g=0;g<seedsToPlay_CantMove.length;g++)
			playSound(seedsToPlay_CantMove[g]);
		for(g=0;g<seedsToPlay_CanMove.length;g++)
			playSound(seedsToPlay_CanMove[g]);
		
		for(g=0;g<state.sfx_CreationMasks.length;g++)
			a=state.sfx_CreationMasks[g],sfxCreateMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		for(g=0;g<state.sfx_DestructionMasks.length;g++)
			a=state.sfx_DestructionMasks[g],sfxDestroyMask.anyBitsInCommon(a.objectMask)&&playSound(a.seed);
		
		
		for(g=0;g<level.commandQueue.length;g++)
			a=level.commandQueue[g],"f"===a.charAt(1)&&tryPlaySimpleSound(a),!1===unitTesting?"message"===a&&showTempMessage():messagetext="";
		!1!==textMode||void 0!==b&&!1!==b||(verbose_logging&&consolePrint("Checking win condition."),checkWin());
		winning||(0<=level.commandQueue.indexOf("checkpoint")&&(verbose_logging&&consolePrint("CHECKPOINT command executed, saving current state to the restart state."),restartTarget=level4Serialization(),hasUsedCheckpoint=!0,SaveCheckpoint(restartTarget),SaveLevel(curlevel)),0<=level.commandQueue.indexOf("again")&&h&&(b=verbose_logging,g=messagetext,verbose_logging=!1,processInput(-1,!0,!0)?((verbose_logging=b)&&consolePrint("AGAIN command executed, with changes detected - will execute another turn."),againing=!0,timer=0):(verbose_logging=b)&&consolePrint("AGAIN command not executed, it wouldn't make any changes."),verbose_logging=b,messagetext=g));level.commandQueue=[]
	}
	verbose_logging&&consoleCacheDump();
	winning&&(againing=!1);
	return h
}


/////////////////////////////////////////////////////////////////////////////////////
// Initialise

var containerID="#game";
AddGameBar(containerID);
LoadStyle("GameBar.css");


