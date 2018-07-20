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


/*
(*Get cms items that match a particular filter*)
CMSFilter[cms_, filter_, n_] := 
  Cases[cms, Replace[CMSHeader[], filter, {1}], 1, n];
CMSFilter[cms_, filter_] := CMSFilter[cms, filter, Infinity];
CMSFilter[filter_] := CMSFilter[CMS[], filter];

(*Create those filters*)
MakeFilter[type_, inclusions_] := {Except[type] -> _, 
   type -> inclusions};
MakeFilterExclude[type_, exclusions_] := 
  MakeFilter[type, Except[exclusions | type]];
MakeFilter[type_] := MakeFilterExclude[type, ""];

(*Get all first items with distinct properties*)
CMSUnique[cms_, properties_List] := Module[{p, F, finalcms},
   p = Function[x, 
      Position[CMSHeader[], x] // 
       If[# === {}, Sequence @@ {}, #[[1, 1]]] &] /@ properties;
   F = #[[p]] &;
   finalcms = 
    If[MemberQ[F[First[#]], ""], Sequence @@ {}, First[#]] & /@ 
     GatherBy[cms, F];
   Reverse@SortBy[finalcms, F]
   ];
CMSUnique[cms_, property_String] := CMSUnique[cms, {property}];

(*Sort CMS*)
CMSSort[cms_, d : ("Date" | "Month" | "Year" | "Day")] := 
  CMSSort[cms, d, False];
CMSSort[cms_, d : ("Date" | "Month" | "Year" | "Day"), True] := 
  CMSSort[cms, d, False];

CMSSort[cms_, property_, up_: True] :=
  With[{SortF = 
     Position[CMSHeader[], property] // 
      If[# === {}, Identity, Function[x, x[[#[[1, 1]]]]]] &},
   If[up, Identity, Reverse]@SortBy[cms, SortF]];

CMSSort[property_] := CMSSort[CMSBody[], property];

(*CMSSort[cms_,properties_List,up_:True]:=Fold[CMSSort[#1,#2,up]&,cms,\
properties]*)

CMSSort[cms_, properties_List, up_: True] :=
  If[properties === {},
   cms,
   With[{SortF = 
      Position[CMSHeader[], Last[properties]] // 
       If[# === {}, Identity, Function[x, x[[#[[1, 1]]]]]] &},
    Flatten[
     CMSSort[#, Most@properties, up] & /@ 
      GatherBy[CMSSort[cms, Last[properties], up], SortF], 1]]];

(*Obtain the nth item with a certain type*)
CMSIndexedItem[cms_, type_, n_] := 
  CMSFilter[cms, MakeFilter["Type", Caplow@type]] // 
   With[{nu = ToExpression@ToString@n}, 
     If[0 < nu < 1 + Length[#], #[[nu]], {}]] &;
CMSIndexedItem[type_, n_] := CMSIndexedItem[CMS[], type, n];

(*Select n more recent posts or alphabetically or etc..*)
CMSFilterSort[cms_, property_, up_, n_: All] :=
  CMSSort[CMSFilter[CMS[], MakeFilter[property]], property, up][[
   1 ;; n]];

*/




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

// Transformer: Table Inverted
function MakeInvertedTable(dataarray){
	function EnRow(dataline){
		var datalin = dataline.map(
			function(x){
				var y = String(x);
				if(y!="")
					y="\t\t<td>"+String(x)+"</td>";
				return y;
			});
		var dtl = datalin.join("\n");
		console.log(dtl);
		if(dtl!="\n")
			dtl="\t<tr>\n"+dtl+"</tr>";
		return 	dtl;
	};
	return "<table>\n"+dataarray.map(EnRow).reverse().join("\n")+"</table>";
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
// Buttons and Components

function CloseButtonHTML(targetid){
	return '<span class="button closer" onclick="Close(\''+targetid+'\')">&times;</span>'
}

function SubmitButtonHTML(questionid){
	return '<div class="button" onclick="Answer(\''+questionid+'\')">Submit</div>';
}

function MessageHTML(message){
	return "<h4 class='question'>"+message+"</h4>";
}

function ChoicesButtonHTML(choice,questionid){
	return '<div class="button" data-choice="'+choice+'" onclick="ToggleThis(event,this);ToggleData(\'answer\',\''+choice+'\',\''+questionid+'\')">'+choice+'</div>';
}

function ExclusiveChoiceButtonHTML(choice,questionid){
	return '<div class="button" data-choice="'+choice+'" onclick="ToggleThisOnly(event,this);ToggleData(\'answer\',\''+choice+'\',\''+questionid+'\')">'+choice+'</div>';
}

function ChoiceHTML(QuestionName,choices,questionid,TypeOfChoice){
	var choi="";
	for(var i in choices)
		choi=choi+TypeOfChoice(choices[i],questionid);
	return '<div class="buttonrow" data-question="'+QuestionName+'">'+choi+'</div>'+SubmitButtonHTML(questionid);
}

function ChoicesButtonRowHTML(QuestionName,choices,questionid){
	return ChoiceHTML(QuestionName,choices,questionid,ChoicesButtonHTML)
}

function ExclusiveChoiceButtonRowHTML(QuestionName,choices,questionid){
	return ChoiceHTML(QuestionName,choices,questionid,ExclusiveChoiceButtonHTML)
}

function InputHTML(placeholder,QuestionName){return "<input data-question='"+QuestionName+"' placeholder='"+placeholder+"'></input>"}
function TextareaHTML(placeholder,QuestionName){return "<textarea data-question='"+QuestionName+"' placeholder='"+placeholder+"'></textarea>"}

function LongAnswerHTML(QuestionName,id){return TextareaHTML(' ❤ Pedro PSI ❤ ',QuestionName)+SubmitButtonHTML(id)}
function ShortAnswerHTML(QuestionName,id){return InputHTML(QuestionName,QuestionName)+SubmitButtonHTML(id)}

function QuestionHTML(QuestionName,Choices,destination){
	var qid=SanitizeId(QuestionName);
	var answers=Choices;
	var title=MessageHTML(QuestionName);
	if (typeof Choices==="object")
		if(Choices.length>2)
			answers=ChoicesButtonRowHTML(QuestionName,Choices,qid)
		else
			answers=ExclusiveChoiceButtonRowHTML(QuestionName,Choices,qid)
	else if (Choices===""||Choices==="textarea")
		answers=LongAnswerHTML(QuestionName,qid);
	else if (Choices==="input"){
		answers=ShortAnswerHTML(QuestionName,qid);
		title="";
	}
	var QA='<div data-destination="'+destination+'">'+title+answers+"</div>";
	return QA;
}


////////////////////////////////////////////////////////////////////////////////
// Balloons

function BalloonHTML(avatarsrc,content,id){
	return '\
		<div class="balloon" id='+id+'>\
			'+CloseButtonHTML(id)+'\
			<img class="avatar" src="'+avatarsrc+'"/>\
			<div class="subtitle">'+content+'</div>\
		</div>';
}

function OpenMessageBalloon(message,targetid){
	var qid=SanitizeId(message);
	OpenBalloon(message,qid,targetid);
}

function OpenSubmittedBalloon(targetid){
	var qid="thanks";
	OpenBalloon("Submitted. Thank you!",qid,targetid);
}

function OpenFeedbackBalloon(QuestionName,Choices,targetid){
	var qid=SanitizeId(QuestionName);
	var QA = QuestionHTML(QuestionName,Choices,"feedback");
	OpenBalloon(QA,qid,targetid)
}

function OpenBalloon(message,id,targetid){
	AddElement(BalloonHTML("images/logo.png",message,id),targetid);
}

function CloseBalloonIn(targetid){
	var ballon=document.getElementById(targetid).querySelector(".balloon");
	if(ballon)
		Close(ballon.id);
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

function Answer(questionid,choice){
	if(typeof choice!=="undefined")
		SetData("answer",choice,questionid);

	var formtype=FindData("destination",questionid);
	var destinationObject=GetDestination(formtype);
	var dataObject=(destinationObject.Data)(questionid);
	
	SubmitData(dataObject,destinationObject);	
	Close(questionid);
}

function FindData(type,id){
	return	FindDataInNode(type,document.getElementById(id))
};
	
function FindDataInNode(type,node){
	if(typeof node==="null")
		return undefined;
	else if(HasData(type,node)){
		return GetData(type,node);
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

function HasData(type,node){
	if(type==="answer"&&["INPUT","TEXTAREA"].indexOf(node.tagName)>=0)
		return (node.value!=="undefined")
	else
		return (typeof node.dataset!=="undefined")&&(typeof node.dataset[type]!=="undefined");
}

function GetData(type,node){
	if(type==="answer"&&["INPUT","TEXTAREA"].indexOf(node.tagName)>=0)
		return (node.value)
	else
		return (node.dataset[type]);
}

function SetData(type,value,questionid){
	document.getElementById(questionid).setAttribute("data-"+type,value);
}

function ToggleData(type,value,questionid){
	var e=document.getElementById(questionid);
	console.log(e);
	var a;
	if(!e.hasAttribute("data-"+type))
		e.setAttribute("data-"+type,value)
	else{
		a=e.getAttribute("data-"+type);
		if(a.replace(value,"")===a)
			e.setAttribute("data-"+type,a+" "+value)
		else
			e.setAttribute("data-"+type,a.replace(value,""))
	}
		console.log(e);
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
