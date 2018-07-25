var CONTEXT="";
var DESTINATIONS={};

///////////////////////////////////////////////////////////////////////////////
//URL Manipulation

function CombineRegex(a,b){
	var pref=new RegExp(a);
	var suff=new RegExp(b);
	var comb=new RegExp(pref.source+suff.source,"g");
	return comb;
}

function pageTitle(){
	return document.getElementsByTagName("H1")[0].innerHTML;
}

function pageURL(){
	return ""+window.location;
}

function pageTag(url){
	if(typeof url==="undefined")
		return pageTag(pageURL());
	else
		return url.replace(/(.*#)/,"").replace(url,"").replace(/(\$.*)/,"");
}

function pageIdentifier(url){
	if(typeof url==="undefined")
		return pageIdentifier(pageURL());
	else
		return url.replace(/(#.*)/,"").replace(/(\/$)/,"").replace(/(.*\/)/,"").replace(".html","").replace(".htm","");
}

function SanitizeId(tex){
	return tex.replace(/^[^a-z]+|[^\w:.-]+/gi,"");
}

function SafeString(tex){
	return String(tex).replace(/[\<\>\=\+\-\(\)]/g,"");
}

///////////////////////////////////////////////////////////////////////////////
//Unique random identifier

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

// Read data stored in a form with id "targetid"

function getDataRecord(targetid) {
	var form = document.getElementById(targetid);
	var elements = form.elements; // all form elements

	var fields = Object.keys(elements).map(function(k) {
		if(elements[k].name !== undefined) {
			return elements[k].name;
			// special case for Edge's html collection
			}else if(elements[k].length > 0){
			return elements[k].item(0).name;
			}
		}).filter(function(item, pos, self) {
			return self.indexOf(item) == pos && item;
	});

	var data = {};

	fields.forEach(function(k){
		data[k] = elements[k].value;
		var str = ""; // declare empty string outside of loop to allow
					// it to be appended to for each item in the loop
		if(elements[k].type === "checkbox"){ // special case for Edge's html collection
			str = str + elements[k].checked + ", "; // take the string and append the current checked value to 
												// the end of it, along with a comma and a space
			data[k] = str.slice(0, -2); // remove the last comma and space 
										// from the  string to make the output 
										// prettier in the spreadsheet
		}
		else if(elements[k].length){
			for(var i = 0; i < elements[k].length; i++){
				if(elements[k].item(i).checked){
					str = str + elements[k].item(i).value + ", "; // same as above
					data[k] = str.slice(0, -2);
				}
			}
		}
	});

	// add form-specific values into the data
	data.formDataNameOrder = JSON.stringify(fields);

	return data;
}


// Sends data (Json) to a script in url "url"
function echoPureData(data,url){
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onreadystatechange = function() {
				console.log( xhr.status, xhr.statusText )
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

// Sends data from a form with id "source" and to a google doc in address of the form field "action", with sheet name "destinationSheet"
function echoDataRecord(source,destinationSheet){
	var data = getDataRecord(source);
	echoDataToSheet(data,source,destinationSheet);
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
// Transformer: Table Inverted
function MakeInvertedTable(dataarray){
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
	return "<table><tbody>\n"+dataarray.map(EnRow).reverse().join("\n")+"</tbody></table>";
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
	return "<table><tbody>\n"+dataarray.map(MakeComment).reverse().join("\n")+"</tbody></table>";
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

function SubmitButtonHTML(questionid){
	return '<div class="button" onclick="SubmitAnswer(\''+questionid+'\')">Submit</div>';
}

function MessageHTML(message){
	return "<h4 class='question'>"+message+"</h4>";
}

////////////////////////////////////////////////////////////////////////////////
// Datapack Components

var DATAPACKHISTORY=[];

function NewDataPack(){
var d={
	questionname:"???",			//Display name of the subquestion
	qfield:"question",			//Field name must be unique
	qvalue:"",					//Field value, by default
	qchoices:"",				//answer options list
	qtype:LongAnswerHTML,		//Format of question ---takes a Datapack as ony argument
	qdestination:'feedback',	//Name of data repository
	qplaceholder:"❤ Pedro PSI ❤",			//Placeholder answer

	qid:GenerateId(),			//Which is the id of the overarching question/form element?
	qtargetid:document.body.id,	//Where to introduce form in page?
	qdisplay:OpenFeedbackBalloon//Question display function ---takes a Datapack as ony argument
	}
	
	DATAPACKHISTORY.push(d);
	return d;
}


function ChoiceHTML(dataPack,qbehaviour){
	var choi="";
	for(var i in dataPack.qchoices)
		choi=choi+qbehaviour(dataPack.qchoices[i],dataPack);
	return '<div class="buttonrow">'+choi+'</div>';
}

function ChoicesButtonRowHTML(dataPack){
	function ChoicesButtonHTML(choice,dataPac){
		return '<div class="button" onclick="ToggleThis(event,this);ToggleData(\''+dataPac.qfield+'\',\''+choice+'\',\''+dataPac.qid+'\')">'+choice+'</div>';
	}
	return ChoiceHTML(dataPack,ChoicesButtonHTML)
}

function ExclusiveChoiceButtonRowHTML(dataPack){
	function ExclusiveChoiceButtonHTML(choice,dataPac){
		return '<div class="button" onclick="ToggleThisOnly(event,this);ToggleData(\''+dataPac.qfield+'\',\''+choice+'\',\''+dataPac.qid+'\')">'+choice+'</div>';
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
	var questiontitle=MessageHTML(dataPack.questionname);
	var answerfields=dataPack.qtype(dataPack);
	return questiontitle+answerfields;
}

function QuestionHTML(dataPackArray){
	if(typeof dataPackArray.qid !== "undefined") //Meaning it is a single subquestion unwrapped
		return QuestionHTML([dataPackArray]);
	var dataPack=dataPackArray[0];
	var QA=dataPackArray.map(SubQuestionHTML).join("");
	return '<div data-destination="'+dataPack.qdestination+'"id="'+dataPack.qid+'">'+QA+SubmitButtonHTML(dataPack.qid)+"</div>";
}


////////////////////////////////////////////////////////////////////////////////
// Balloons

function OpenMessageBalloon(dataPack){
	OpenBalloon(dataPack.questionname,dataPack.qid,dataPack.qtargetid);
}

function OpenSubmittedBalloon(targetid){
	OpenBalloon("Submitted. Thank you!",GenerateId(),targetid);
}

function OpenFeedbackBalloon(dataPack){
	var datap=dataPack;
	datap.qdestination="feedback";
//	datap.qid=SanitizeId(datap.questionname);
	var QA = QuestionHTML(datap);
	OpenBalloon(QA,datap.qid,datap.qtargetid)
}


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


function Close(targetid){
	var fading=document.getElementById(targetid);
	fading.classList.add("closing"); //Not working yet
	fading.remove();
}

function CloseThis(ev,thi,targetid){
	if(ev.target.id===thi.id)
		Close(targetid);
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
		siblings[i].classList.toggle("selected");}
		i++;
	}
}



////////////////////////////////////////////////////////////////////////////////
// Data finding and submission in forms

function SubmitData(dataObject,destination){
	var data =dataObject;
	data.formDataNameOrder=destination.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=destination.sheet;
	echoDataToSheetURL(data,destination.url,destination.sheet);
}

function SubmitAnswer(qid){

	var formtype=FindData("destination",qid);
	var destinationObject=GetDestination(formtype);
	var dataObject=(destinationObject.Data)(qid);

	SubmitData(dataObject,destinationObject);	
	Close(qid);
}

function FindData(field,id){
	var d=FindDataInNode(field,document.getElementById(id));
	if(typeof d==="undefined")
		return GetData(field,id);
	else
		return d;
};

function FindDataInNode(type,node){
	console.log(node);
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

function GetDatapack(id){
	var i=0;
	while(i<DATAPACKHISTORY.length){
		if(DATAPACKHISTORY[i].qid===id)
			return DATAPACKHISTORY[i];
		i++}
	return undefined
};

function GetData(field,id){
	return GetDatapack(id)[field];
};

function SetData(field,value,id){
	GetDatapack(id)[field]=value;
};

function ToggleData(field,value,id){
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

///////////////////////////////////////////////////////////////////////////////
// Form Validator

function SubmitForm(formid){
	var form = document.getElementById(formid);
	if(form.querySelector(":invalid")===null){
		echoDataRecord('Contact','Contact');
		OpenModal("#Success");
	}
	else
		OpenModal("#Failure");
	
}