var CONTEXT="";
var DESTINATIONS={};

///////////////////////////////////////////////////////////////////////////////
//Do nothing
function Identity(){return;};


///////////////////////////////////////////////////////////////////////////////
//Regex
function CombineMultiRegex(exprarray,joiner){
	var j="";var kl="";var kr="";
	if(joiner){
		j=joiner;kl="(";kr=")"
	}
	var regarray=exprarray.map(a=>new RegExp(a));
	regarray=regarray.map(a=>kl+a.source+kr);
	var comb=new RegExp(regarray.join(j),"g");
	return comb;
}

function CombineRegex(a,b){
	return CombineMultiRegex([a,b]);
}
function AlternateRegex(exprarray){
	return CombineMultiRegex(exprarray,"|");
}

function ForwardRegex(string){
	return CombineRegex(string,/[\d\D]*/);
}


///////////////////////////////////////////////////////////////////////////////
//URL MANIPULATION
//HEAD 			http://
//DOMAIN 		aaaa.bbb.com
//RELATIVEPATH	/folder1/folder2/
//IDENTIFIER 	page
//EXTENSION 	.html
//TAG			#etc
var domain = "pedropsi.github.io|combinatura.github.io";
var predomains=AlternateRegex(domain.split("|").map(d=>CombineRegex(/[\d\D]*/,d)));
var posdomains=AlternateRegex(domain.split("|").map(d=>CombineRegex(d,/[\d\D]*/)));
var idomain=CombineRegex(/^/,domain);

function Domains(){
	return idomain;
}

//PRIMARY

function pageTitle(){
	return document.title;
}

function pageURL(){
	return ""+window.location;
}

function pageConfig(url){
	if(typeof url==="undefined")
		return pageConfig(pageURL());
	else{
		return url.replace(/(.*\$)/,"").replace(url,"");
	}
}

function pageNoConfig(url){
	if(typeof url==="undefined")
		return pageNoConfig(pageURL());
	else{
		return url.replace(/(\$.*)/,"");
	}
}

//without configs
function pageTag(url){
	if(typeof url==="undefined")
		return pageTag(pageURL());
	else
		return pageNoConfig(url).replace(/(.*#)/,"").replace(url,"");
}

function pageNoTag(url){
	if(typeof url==="undefined")
		return pageNoTag(pageURL());
	else{
		if(pageTag(url)==="")
			return url.replace("#","");
		else
			return url.replace(ForwardRegex(pageTag(url)),"").replace("#","");
	}
}

function pageIdentifier(url){
	if(typeof url==="undefined")
		return pageIdentifier(pageURL());
	else{
		var urlAfter=pageNoTag(url).replace(/(.*\/)/,"");
		if(isMaybeRoot(urlAfter))
			return ""
		else
			return urlAfter.replace(".html","").replace(".htm","");
	}
}

function pageNoHead(url){
	if(typeof url==="undefined")
		return pageNoHead(pageURL());
	else
		return url.replace(/[\w\d]*\:(\/\/+)/g,"");
}

function pageHead(url){
	if(typeof url==="undefined")
		return pageHead(pageURL());
	else
		return url.replace(pageNoHead(url),"");
}

function pageAfterOwnDomain(url){
	if(typeof url==="undefined")
		return pageAfterOwnDomain(pageURL());
	else
		return url.replace(predomains,"").replace(/^\//,"");
}

function isMaybeRoot(urlAfter){
	return (urlAfter.replace(".htm","")===urlAfter)&&(urlAfter.replace(".","")!==urlAfter)
}
function isSingleton(urlAfter){
	return (urlAfter.replace("/","")===urlAfter)
}
function pageRelativePath(url){
	if(typeof url==="undefined")
		return pageRelativePath(pageURL());
	else{
		var urlAfter=pageNoHead(pageAfterOwnDomain(url));
		if(isSingleton(urlAfter)){
			if(isMaybeRoot(urlAfter))
				return "";
			else
				return urlAfter;
		}
		else
			return urlAfter.replace(/\/*$/,"/").replace(/^([\d\w]+\.)+([\d\w]*)/,"").replace(/\/*$/,"").replace(/^\//,"");
	}
}

function pageRoot(url){
	if(typeof url==="undefined")
		return pageRoot(pageURL());
	else{
		return url.replace(pageRelativePath(url),"");
	}
}

function pageIdentifierExtension(url){
	if(typeof url==="undefined")
		return pageIdentifierExtension(pageURL());
	else{
		return url.replace(url.replace(ForwardRegex(pageIdentifier(url)),""),"");
	}
}


function pageAbsolute(url){
	if(typeof url==="undefined")
		return pageAbsolute(pageURL());
	else{
		return pageRoot(url)+pageIdentifierExtension(url);
	}
}


//SECONDARY

function isRelativeLink(url){
	return pageRelativePath(url)===url;
}

function isFileLink(url){
	return pageHead(url)==="file:///";
}

function isLocalLink(url){
	return isRelativeLink(url)||isFileLink(url);
}

function isInOwnDomain(url){
	return url.replace(predomains,"")!==url;
}

function isIntraPageLink(url){
	var inpage=url.replace(/^#/,"");
	return url!=inpage;
}

function isExtraPageLink(url){
	return !isIntraPageLink(url);
}

function isInnerLink(url){
	return isExtraPageLink(url)&&(isLocalLink(url)||isInOwnDomain(url));
}

function isOuterLink(url){
	return isExtraPageLink(url)&&!(isLocalLink(url)||isInOwnDomain(url));
}

function isAbsolutableLink(url){
	return isExtraPageLink(url)&&(isRelativeLink(url)||isInOwnDomain(url));
}





///////////////////////////////////////////////////////////////////////////////
//Unique random identifier
var UID=""
function UserId(){
	if (UID==="")
		UID=GenerateId();
	return UID;
}

function GenerateId(){
	var preconsonants = "bcdfghjklmnpqrstvwxz";
	var preconsonants2 = "hjlnrs";
	var vowels = "aeiouyáéíóúàèìòùýäëïöüÿãõâêîôû";
	var posconsonants2 = "pkstm";
	var posconsonants = "bcdglmnrstxz";
				
	function RandomInteger(n){return Math.floor(Math.random() * n)};
	function RandomChoice(v){return v[RandomInteger(v.length)]};
	
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


///////////////////////////////////////////////////////////////////////////////
// Data transmission

// Sends data (Json) to a script in url "url"
function echoPureData(data,url){
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
				console.log( xhr.status, xhr.statusText);
				console.log(xhr.responseText);
				return;
			};
			// url encode form data for sending as post data
			var encoded = Object.keys(data).map(function(k) {
				return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
			}).join('&')
			xhr.send(encoded);	
}

// Sends data to a google doc in address of the form field "action", with sheet name "destinationSheet"
function echoDataToSheetURL(data,url,destinationSheet){
	data.formGoogleSheetName = destinationSheet; 
	echoPureData(data,url);	
}

// Sends data to a google doc in address of the form field "action", with sheet name "destinationSheet"
function echoDataToSheet(data,source,destinationSheet){
	echoDataToSheetURL(data,document.getElementById(source).action,destinationSheet);  
}

///////////////////////////////////////////////////////////////////////////////
//Data Reception

//Fetch data from url
function LoadData(url)
{
	var data;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                data = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
	return data;
};

//Load and Replace Variables

var VARIABLES={};
var VARIABLEKEYS=[];
var REPLACEMENTS;

function ClearVariables(){
	VARIABLEKEYS=[];
	VARIABLES={}
}

function LoadVariables(url){
	var variables=LoadData(url).split("\r\n");
	variables.shift();
	variables=variables.map(x=>x.split("\t"));
	for(var i in variables){
		VARIABLES[variables[i][0]]=variables[i][1];
		VARIABLEKEYS.push(variables[i][0]);
	}
	return VARIABLES;
}

function Replacements(){
	function ReplaceVariable(variable){
		return function(s){return s.replace(CombineRegex(CombineRegex(/\«/,variable),/\»/),VARIABLES[variable])};
	}
	REPLACEMENTS=VARIABLEKEYS.map(ReplaceVariable);
}

function TextReplaceOnce(txt){
	var R=REPLACEMENTS.slice();
	R.unshift(txt);
	return R.reduce((txt, f) => f(txt));
}

function TextReplacerCMS(txt){
	return txt.replace(/\«([^\»\«]+?)\:([^\»\«]+?)\»/g,function (match,param,action) {
		switch (action.toLowerCase()){
			case "load":
				return CMSItemProperty(CMSItemCurrent(),param);break;
			default:
				return match
		}
	})
}

function TextReplacerCombined(txt){
	return TextReplacerCMS(TextReplaceOnce(txt))
}

function TextReplacer(txt){
	var newtext= TextReplacerCombined(txt)
	while(newtext!=TextReplacerCombined(newtext))
		newtext=TextReplacerCombined(newtext);
	return newtext;
}

// CMS

var CMS_BODY;
var CMS_HEAD;

function LoadCMS(url){
	var variables=LoadData(url).split("\r\n");
	variables=variables.map(x=>x.split("\t"));
	CMS_HEAD=variables[0];
	CMS_HEAD=CMS_HEAD.map(x=>x.toLowerCase());
	variables.shift();
	CMS_BODY=variables;
}

//Obtain the Property by name of an item
function CMSItemProperty(cmsitem, property){
	var prop=property.toLowerCase();
	var i=CMS_HEAD.indexOf(prop);
	var p=cmsitem[i];
/*    Switch[p,
        "Date", ReadDate,
        "Update", ReadRSSDate,
        "Year" | "Month" | "Day", UnNumberer,
        _, ToString]@
       First[p]]]]];
	 */
	 return p;
}

function CMSItemCurrent(){
	for(var i in CMS_BODY)
		if(CMSItemProperty(CMS_BODY[i],"link")===pageIdentifier())
			return CMS_BODY[i];
	return undefined;
}


// Add new element to page, under a parent element
function AddElement(html,parentID){
	var e=document.createElement("div");
	e.innerHTML=html;
	document.getElementById(parentID).appendChild(e);
};

function PrependElement(html,parentID){
	var e=document.createElement("div");
	e.innerHTML=html;
	var p=document.getElementById(parentID);
	p.insertBefore(e,p.firstChild);
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
	document.getElementById(parentID).innerHTML=html;
};

// Add HTML Data from external source to page
function InjectData(source,destinationID,Transform){	
	var data = LoadData(source);
	if(Transform){
		data = Transform(data);
	}
	AddElement(data,destinationID);
};

// Add HTML Data from external source to page
function OverwriteData(source,destinationID,Transform){	
	var data = LoadData(source);
	if(Transform){
		data = Transform(data);
	}
	ReplaceElement(data,destinationID);
};

//////////////////////////////////////////////////
// Scroll into

function ScrollInto(elementSelector) {
  var e = document.querySelector(elementSelector);
  e.scrollIntoView();
}


//////////////////////////////////////////////////
// Safe string loading
function SafeString(tex){
	return String(tex).replace(/[\<\>\=\+\-\(\)]/g,"");
}


//////////////////////////////////////////////////
// Transformer: Table
function MakeTable(dataarray){
	function EnRow(dataline){
		var datalin = dataline.map(
			function(x){
				var y = SafeString(x);
				if(y!="")
					y="\t\t<td>"+SafeString(x)+"</td>";
				return y;
			});
		var dtl = datalin.join("\n");
		if(dtl!="\n")
			dtl="\t<tr>\n"+dtl+"</tr>";
		return 	dtl;
	};
	return "<table><tbody>\n"+dataarray.map(EnRow).join("\n")+"</tbody></table>";
}

function MakeGuestbook(dataarray){
	function MakeComment(dataline){
		if(dataline[0]==="") return "";
		var date="<div class='date'>"+SafeString(dataline[0])+"</div>";
		var c="<p class='quote'>"+SafeString(dataline[3])+"</p>";
		var a="<span class='author'>"+SafeString(dataline[2])+"</span>";
		var o="<span class='subject'>, on "+SafeString(dataline[1])+"</span>";
		var html="<div class='comment'><div>"+c+"<p>"+a+o+"</p></div>"+date+"</div>";
		return 	html;
	};
	return "<table><tbody>\n"+dataarray.map(MakeComment).join("\n")+"</tbody></table>";
}


//Update Page with most recent edit

function UpdatePost(UPDATEPATH,LOADID){
	OverwriteData(UPDATEPATH+pageIdentifier()+".txt",LOADID,TextReplacer);
}

function StartCMS(){
	ClearVariables();
	LoadCMS("cms/CMS.txt");
	LoadVariables("cms/Text.txt");
	LoadVariables("cms/Variables.txt");
	Replacements();
}


function RefreshPost(){
	var LOADID="markdown";
	var UPDATEPATH="cms/updated/";
	
	if(document.getElementById(LOADID)!==null){
		var data=LoadData(UPDATEPATH+pageIdentifier()+".txt");
		if( typeof data !=="undefined"){
			StartCMS();
			UpdatePost(UPDATEPATH,LOADID);
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// Save Data

LOADID="markdown";

// Download
// https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function Download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function SaveUpdatedPage(){
	var edited=GetPageEdit();
	Download(edited, pageIdentifier()+".txt","text/html");
}

function GetPageEdit(){
	var edited=PageEditNode().innerHTML;
	/*edited=edited.replace("</p>","</p>\n");*/
	return edited;
}

function PageEditNode(){
	return document.getElementById(LOADID);
}

///////////////////////////////////////////////////////////////////////////////
// Edit Page Contents

function OpenPageEditNode(){
	PageEditNode().setAttribute("contenteditable",true);
/*	var htmlAsText=document.createTextNode(GetPageEdit());
	htmlAsText.data=htmlAsText.data.replace("/><","/>\n\n\n<");
	var node = PageEditNode();
	node.setAttribute("contenteditable",true);
	node.innerHTML="";
	node.appendChild(htmlAsText);*/
}

function ClosePageEditNode(){
	PageEditNode().removeAttribute("contenteditable");
	/*var node = PageEditNode();
	node.removeAttribute("contenteditable");
	node.innerHTML=DecodeHTML(GetPageEdit());*/
}

function DecodeHTML(encodedStr){
	var parser = new DOMParser;
	var dom = parser.parseFromString(
		'<!doctype html><body>' + encodedStr,
		'text/html');

	return dom.body.textContent;
}

ToggleEdit=function(){
	if(PageEditNode().contentEditable==="true"){
		ClosePageEditNode();
		SaveUpdatedPage();
	}
	else
		OpenPageEditNode();
}

document.onkeydown=function(e){
	 // Cmd + Q -> Save
	 if (e.keyCode == 81 && e.ctrlKey){
		  ToggleEdit();
     }
	 // Esc -> Don't save
	 else if (e.keyCode == 27 ){
		  ClosePageEditNode();
     };
};


////////////////////////////////////////////////////////////////////////////////
// Basic Buttons

function CloseButtonHTML(targetid){
	return '<span class="button closer" onclick="Close(\''+targetid+'\')">&times;</span>'
}

function OkButtonHTML(targetid){
	return '<div class="button" onclick="Close(\''+targetid+'\')">OK</div>';
}

function SubmitButtonHTML(datapack){
	return '<div class="button" onclick="'+datapack.action+'(\''+datapack.qid+'\')">Submit</div>';
}

function MessageHTML(message){
	return "<h4 class='question'>"+message+"</h4>";
}

function ErrorHTML(message){
	return "<div class='error'><p>"+message+"</p></div>";
}

////////////////////////////////////////////////////////////////////////////////
// Datapack System : default datapack, from which Datapack types are derived, each in turn can be Custom-ised 

function DefaultDataPack(){
var DP={
	questionname:"???",			//Display name of the subquestion
	qfield:"question",			//Field name must be unique
	qvalue:"",					//Field value, by default
	qchoices:"",				//answer options list
	executeChoice:Identity,		//immediate changes on toggle receives (id, choice)
	
	qtype:LongAnswerHTML,		//Format of question ---takes a Datapack as ony argument
	destination:'Feedback',	//Name of data repository
	qplaceholder:"❤ Pedro PSI ❤",			//Placeholder answer

	action:'SubmitAndNext', //action on submit ---takes a Datapack id as ony argument
	
	qid:GenerateId(),			//Which is the id of the overarching question/form element?
	qtargetid:document.body.id,	//Where to introduce form in page?
	qdisplay:LaunchModal,//Question display function ---takes a Datapack (or datapack array) as ony argument

	qrequired:true,
	qvalidator:function(DP){return {valid:true,error:"no errors"};},//Receives an DP
	qerrorcustom:'',
	qanswerformatter:Identity,//Receives a DP
	
	qonsubmit:LaunchThanksModal,//Next modal on successful submit: Receives a DP
	qonclose:Identity,//Next modal on close (defaults to nothing): Receives a DP
	
	thanksmessage:"Submitted. Thank you!"
	}
	
	return DP;
}

var DATAPACKHISTORY=[];

function DPHistoryAdd(DP){
	DATAPACKHISTORY.push(DP);//To be improved
}


function NewDataPack(obj){
	var DP=DefaultDataPack();
	var keys=Object.keys(obj);
	for(var k in keys){
		DP[keys[k]]=obj[keys[k]];
	}
	return DP;
}


function DataPackTypes(type){
	var DPTypes={
		normal:NewDataPack({}),
		message:NewDataPack({
			action:'Close',
			destination:'',
			qdisplay:LaunchThanksModal}),
		email:NewDataPack({
			qtype:ShortAnswerHTML,
			qfield:"address",
			qplaceholder:"_______@___.___",
			qvalidator:EmailValidator,
			}),
		name:NewDataPack({
			qrequired:false,
			qvalidator:NameValidator,
			qfield:"name",
			qtype:ShortAnswerHTML,
			questionname:"Your name",
			qplaceholder:"(optional)"}),
		answer:NewDataPack({
			qfield:"answer",
			thanksmessage:"Submitted. Thank you!",
			qvalidator:SomeTextValidator}),
		exclusivechoice:NewDataPack({
			qfield:'answer',
			questionname:"Which one?",
			qchoices:["on","off"],
			qtype:ExclusiveChoiceButtonRowHTML,
			thanksmessage:"Submitted. Thank you!"}),
		multiplechoice:NewDataPack({
			qfield:'answer',
			questionname:"Which ones?",
			qchoices:["1","2","3","4","5"],
			qtype:ChoicesButtonRowHTML,
			thanksmessage:"Submitted. Thank you!"})

		//multiplechoice
	}
	if(typeof type==="undefined")
		return DPTypes;
	else
		if(type==='alias')
			return CustomDataPack('name',{qplaceholder:"or alias"});
		else
			return DPTypes[type];

}

function CustomDataPack(type,obj){
	var DP=DataPackTypes(type);
	if(obj===undefined)
		obj={};
	var keys=Object.keys(obj);
	for(var k in keys){
		DP[keys[k]]=obj[keys[k]];
	}
	return DP;
}

// Datapack Series

function RequestMultiDatapack(NameDataPackObjArray){
	var ndpa=NameDataPackObjArray;
	if(NameDataPackObjArray.length<1)
		return;
	else{
		var DP=CustomDataPack(ndpa[0][0],ndpa[0][1]);
		var lastqid=DP.qid;
		var dparray=[];
		var DisplayF=DP.qdisplay;
		while(ndpa.length>0){
			DP=CustomDataPack(ndpa[0][0],ndpa[0][1]);
			DP.qid=lastqid;
			DPHistoryAdd(DP);
			dparray.push(DP);
			ndpa.shift();
			lastqid=DP.qid;
		}
		return DisplayF(dparray);
	}
}

function RequestDatapack(TypeOrArray,obj){
	if(typeof TypeOrArray==="object"&&typeof obj==="undefined")
		RequestMultiDatapack(TypeOrArray)
	else
		RequestMultiDatapack([[TypeOrArray,obj]])
}

// Datapack Components

function ChoiceHTML(dataPack,buttontype){
	var choi="";
	for(var i in dataPack.qchoices)
		choi=choi+buttontype(dataPack.qchoices[i],dataPack,i);
	return '<div class="buttonrow">'+choi+'</div>';
}

function ChoicesButtonRowHTML(dataPack){
	function ChoicesButtonHTML(choice,dataPac,i){
		var selected="";
		if(i==='0')
			selected=" selected";
		return '<div class="button'+selected+'" onclick="ToggleThis(event,this);ToggleData(\''+dataPac.qfield+'\',\''+choice+'\',\''+dataPac.qid+'\')">'+choice+'</div>';
	}
	return ChoiceHTML(dataPack,ChoicesButtonHTML)
}

function ExclusiveChoiceButtonRowHTML(dataPack){
	function ExclusiveChoiceButtonHTML(choice,dataPac,i){
		var selected="";
		if(i==='0')
			selected=" selected";
		return '<div class="button'+selected+'" onclick="ToggleThisOnly(event,this);SwitchData(\''+dataPac.qfield+'\',\''+choice+'\',\''+dataPac.qid+'\')">'+choice+'</div>';
	}
	return ChoiceHTML(dataPack,ExclusiveChoiceButtonHTML)
}

function ShortAnswerHTML(dataPack){
	return "<input data-"+dataPack.qfield+"='' placeholder='"+dataPack.qplaceholder+"'></input>";
}

function LongAnswerHTML(dataPack){
	return "<textarea data-"+dataPack.qfield+"='' placeholder='"+dataPack.qplaceholder+"'></textarea>";
}


function SubQuestionHTML(dataPack){
	var qname=dataPack.questionname;
	var questiontitle="";
	if(qname!=="")
		questiontitle=MessageHTML(qname);
	var answerfields=dataPack.qtype(dataPack);
	return questiontitle+answerfields;
}

function QuestionHTML(dataPackArray){
	if(typeof dataPackArray.qid !== "undefined") //Meaning it is a single subquestion unwrapped
		return QuestionHTML([dataPackArray]);
	var dataPack=dataPackArray[0];
	var QA=dataPackArray.map(SubQuestionHTML).join("");
	return '<div id="'+dataPack.qid+'">'+QA+SubmitButtonHTML(dataPack)+"</div>";
}


////////////////////////////////////////////////////////////////////////////////
// Balloons

function LaunchMessageBalloon(dataPack){
	OpenBalloon(dataPack.questionname,dataPack.qid,dataPack.qtargetid);
}

function LaunchThanksBalloon(dataPack){
	OpenBalloon(dataPack.thanksmessage,dataPack.qid,dataPack.qtargetid);
}

function LaunchFeedbackBalloon(DP){
	if(Array.isArray(DP))
		OpenBalloon(QuestionHTML(DP),DP[0].qid,DP[0].qtargetid);
	else
		OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}
	/*
function LaunchFeedbackBalloon(dataPack){
	var datap=dataPack;
	datap.destination="Feedback";
	var QA = QuestionHTML(datap);
	OpenBalloon(QA,datap.qid,datap.qtargetid)
}*/


function BalloonHTML(avatarsrc,content,id){
	return '\
		<div class="balloon" id='+id+'>\
			'+CloseButtonHTML(id)+'\
			<img class="avatar" src="'+avatarsrc+'"/>\
			<div class="subtitle">'+content+'</div>\
		</div>';
}

function OpenBalloon(content,id,targetid){
	AddElement(BalloonHTML("images/logo.png",content,id),targetid);
}

function CloseBalloonIn(targetid){
	var ballon=document.getElementById(targetid).querySelector(".balloon");
	if(ballon){
		Close(ballon.id);
	}
}

function HasBalloon(targetid){
	var i=document.getElementById(targetid);
	return (i.querySelector(".balloon")!==null);
}


function ToggleThis(ev,thi){
	if(ev.target.id===thi.id)
		thi.classList.toggle("selected");
}

function ToggleThisOnly(ev,thi){
	var siblings=thi.parentNode.childNodes;
	var i=0;
	while (i<siblings.length){
		if (siblings[i]!==thi){
		siblings[i].classList.remove("selected");}
		else{
		siblings[i].classList.remove("selected");
		siblings[i].classList.toggle("selected");}
		i++;
	}
}


// Closing functions

function CloseElement(targetid){
	var fading=document.getElementById(targetid);
	fading.classList.add("closing"); //Not working yet
	fading.remove();
}

function CloseThis(ev,thi,targetid){
	if(ev.target.id===thi.id)
		Close(targetid);
}

function Close(targetid){
	//First tries to find the next item to open, then closes
	if(typeof GetDatapack(targetid)!=="undefined"){
		var ClosingF=FindData("qonclose",targetid);
		if(typeof ClosingF!=="undefined")
			ClosingF(GetDatapack(targetid));
	}
	CloseElement(targetid);
}

function CloseNext(targetid){
	if(typeof GetDatapack(targetid)!=="undefined"){
		var NextF=FindData("qonsubmit",targetid);
		if(typeof NextF!=="undefined")
			NextF(GetDatapack(targetid));
	}
	CloseElement(targetid);
}


////////////////////////////////////////////////////////////////////////////////
// Data submission in forms

function SubmitData(dataObject,destination){
	var data =dataObject;
	data.formDataNameOrder=destination.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=destination.sheet;
	SUBMISSIONHISTORY.push(data);
	echoDataToSheetURL(data,destination.url,destination.sheet);
}

function SubmitAnswer(DP){
	
	var validator=DP.qvalidator(DP);
	console.log(validator);
	if(DP.qrequired&&!validator.valid){
		AddAfterElement(ErrorHTML(validator.error),"#"+DP.qid);
	}
	else{
		var formtype=FindData("destination",DP.qid);
		var destinationObject=GetDestination(formtype);
		var dataObject=(destinationObject.Data)(DP.qid);

		SubmitData(dataObject,destinationObject);
		CloseNext(DP.qid);
	}
}

function SubmitAndNext(qid){
	var DP=GetDatapack(qid);
	if(typeof DP!=="undefined"){
		console.log(DP);
		SubmitAnswer(DP);
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

function FindData(field,id){
	var e=document.getElementById(id);
	if(e===null)
		return PreviousSubmission(field);
	else{
		var d=FindDataInNode(field,e);
		if(typeof d==="undefined")
			return GetData(field,id);
		else
			return d;
	}
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

function GetDatapack(id){
	var i=0;
	while(i<DATAPACKHISTORY.length){
		if(DATAPACKHISTORY[i].qid===id)
			return DATAPACKHISTORY[i];
		i++}
	return undefined
};

function GetData(field,id){
	var data=GetDatapack(id)[field];
	if(typeof data==="undefined")
		return	PreviousSubmission(field)
	else
		return data;
};

function SetData(field,value,id){
	GetDatapack(id)[field]=value;
};

function ChoiceExecute(value,id){
	FindData("executeChoice",id)(id,value);
};

function ToggleData(field,value,id){
	ChoiceExecute(value,id);
	if(typeof GetData(field,id)==="undefined")
		SetData(field,value,id)
	else{
		a=GetData(field,id);
		if(a.replace(value,"")===a)
			SetData(field,a+" "+value,id)
		else
			SetData(field,a.replace(value,""),id)
	}
}

function SwitchData(field,value,id){
	ChoiceExecute(value,id);
	SetData(field,value,id);
}

///////////////////////////////////////////////////////////////////////////////
// Global Data Transmission Variables

function SetContext(context){
	CONTEXT=context;
}
function GetContext(){
	return CONTEXT;
}

function GetDestination(dname){
	return DESTINATIONS[dname];
}

///////////////////////////////////////////////////////////////////////////////
// Modals

function ModalHTML(content,id){
	return'\
		<div class="modal" id="'+id+'" onclick="CloseThis(event,this,\''+id+'\')">\
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
	if(Array.isArray(DP))
		OpenModal(QuestionHTML(DP),DP[0].qid,DP[0].qtargetid);
	else
		OpenModal(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function LaunchThanksModal(DP){
	var qid=GenerateId();
	OpenModal(MessageHTML(DP.thanksmessage)+OkButtonHTML(qid),qid,DP.qtargetid);
}

///////////////////////////////////////////////////////////////////////////////
// Form Validators and Modifiers

function EmailValidator(DP){
	var em=FindData("address",DP.qid);
	var pattern=/(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?\.)+[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ig
	if((typeof em!=="undefined")&&(em.match(pattern)!==null))
		return {valid:true,error:"none"}
	else
		return {valid:false,error:"Please verify your e-mail address!"}
}

function SomeTextValidate(name){
	var pattern=/[\d\w]/;
	return name.match(pattern)!==null;
}

function SomeTextValidator(DP){
	var em=FindData("answer",DP.qid);
	if((typeof em!=="undefined")&&SomeTextValidate(em))
		return {valid:true,error:"none"}
	else
		return {valid:false,error:"Please write something!",}
}

function NameValidator(DP){
	var em=FindData("name",DP.qid);
	var pattern=/[\d\w][\d\w]+/;
	if((typeof em!=="undefined")&&(em.match(pattern)!==null))
		return {valid:true,error:"none"}
	else if (DP.qerrorcustom!=='')
		return {valid:false,error:DP.qerrorcustom}
	else
		return {valid:false,error:"Please write at least 2 alphanumerics!"}
}