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

function Datafy(object){
	var O={};
	var keys=Object.keys(object);
	var datakey;
	for(var k in keys){
		datakey="data-"+(keys[k].replace("data-",""));
		O[datakey]=object[keys[k]];
	}
	return O;
}

///////////////////////////////////////////////////////////////////////////////
//Regex
function CombineMultiRegex(exprarray,joiner){
	var j="";var kl="";var kr="";
	if(joiner){
		j=joiner;//kl="(";kr=")"
	}
	var regarray=exprarray.map(a=>new RegExp(a));
	regarray=regarray.map(a=>a.source);
	var comb=new RegExp("("+regarray.join(j)+")","g");
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
var domains =["pedropsi.github.io","combinatura.github.io"];
var predomainssoft=AlternateRegex(domains.map(d=>CombineRegex(/^[\d\D]*/,d)));
var predomainshard=AlternateRegex(domains.map(d=>CombineRegex(/^(https?:\/\/)*/,d)));
var posdomains=AlternateRegex(domains.map(d=>CombineRegex(d,/[\d\D]*$/)));
var idomain=CombineRegex(/^/,AlternateRegex(domains));

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
		var u=pageNoConfig(url);
		if(pageTag(u)==="")
			return u.replace("#","");
		else
			return u.replace(ForwardRegex(pageTag(u)),"").replace("#","");
	}
}

function pageIdentifierSimple(url){
	if(typeof url==="undefined")
		return pageIdentifierSimple(pageURL());
	else{
		var urlAfter=pageNoTag(url).replace(/(.*\/)/,"");
		if(isMaybeRoot(urlAfter))
			return ""
		else
			return urlAfter.replace(".html","").replace(".htm","");
	}
}

function pageIdentifier(url){
	var i=pageIdentifierSimple(url);
	if(i=="index")
		return pageTitle(url);
	else
		return i;
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
		return url.replace(predomainssoft,"").replace(/^\//,"");
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
	return url.replace(predomainshard,"")!==url;
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
//Page traversal

function MarkElements(selector,markfunction){
	var elementNodes=Object.values(document.querySelectorAll(selector));
	return elementNodes.map(t=>markfunction(t));
}

///////////////////////////////////////////////////////////////////////////////
//Page auto index
function IDfy(s){
	return s.replace(/([^A-Za-z0-9\:\_\.])+/g,"-").replace(/\-$/g,"");
}

function IndexTitle(t){t.id=t.id?t.id:IDfy(t.innerText); return t.id}

function IndexTag(h){
	return MarkElements(h,IndexTitle);
}

function IndexTitles(){
	return ["h1","h2","h3","h4","h5","h6"].map(IndexTag);
}

document.addEventListener('DOMContentLoaded', IndexTitles, false);



///////////////////////////////////////////////////////////////////////////////
//Unique random identifier
var UID=""
function UserId(){
	if(UID==="")
		UID=GenerateId();
	return UID;
}

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
//Load scripts

function LoadAsync(sourcename,folder){
	var head= GetElements('head')[0];
	var script= document.createElement('script');
	var ext='.js';
	var folder=((folder+"/").replace(/\/\//,"/"))||"codes/"
	if(sourcename.replace(".txt","")!=sourcename){
		ext="";
	}
	script.src= folder+sourcename+ext;
	script.async= false;
	
	head.appendChild(script);
}

function LoaderInFolder(folder){
	return function(sourcename){return LoadAsync(sourcename,folder)};
}




///////////////////////////////////////////////////////////////////////////////
// Data transmission - JSON, to a script in url "url"

function echoPureData(data,url){
	var xhr = new XMLHttpRequest();
	xhr.open('POST',url);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = function(){
		console.log(xhr.status, xhr.statusText);
		console.log(xhr.responseText);
		return;
	};
	// url encode form data for sending as post data
	var encoded = Object.keys(data).map(function(k){
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&')
	xhr.send(encoded);	
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
	return txt.replace(/\«([^\»\«]+?)\:([^\»\«]+?)\»/g,function (match,param,action){
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

// Get element based on selectors: .class, tag, or the element itself
function GetElements(selectorString){
	var HTMLCollect;
	if(IsClass(selectorString))
		HTMLCollect=document.getElementsByClassName(selectorString.replace(/^\./,""));
	else if (IsTag(selectorString))
		HTMLCollect=document.getElementsByTagName(selectorString);
	return Array.prototype.slice.call(HTMLCollect);
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
function ReplaceElement(html,parentIDsel){
	var p=GetElement(parentIDsel);
	p.innerHTML=html;
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
		var au=SafeString(dataline[2]);
		var id=SafeString(dataline[4]);
		var rid=NextReplyMessageId(id,dataarray); //may duplicate in high traffic times
		
		var b=ButtonOnClickHTML("Reply to "+au,'RequestMessageReply("'+rid+'")');
		var datereply="<div class='date'>"+SafeString(dataline[0])+b+"</div>";
		var c="<p class='quote'>"+SafeString(dataline[3])+"</p>";
		var a="<span class='author'>"+au+"</span>";
		var o="<span class='subject'>, on "+SafeString(dataline[1])+"</span>";
		
		var html="<div class='comment' data-id='"+id+"' data-depth='"+IdDepth(id)+"'><div>"+c+"<p>"+a+o+"</p></div>"+datereply+"</div>";
		return 	html;
	};
	return "<table><tbody>\n"+dataarray.sort(function(dl1,dl2){return CompareId(SafeString(dl1[4]),SafeString(dl2[4]))}).map(MakeComment).join("\n")+"</tbody></table>";
}

function CompareId(a,b){
	if(a===b)
		return 0;
	else{
		var a1=a.replace(/\».*$/,"");
		var b1=b.replace(/\».*$/,"");
		
		if(a1!==b1)
			return Number(a1)<Number(b1)?1:-1;
		else if((ThreadId(a,a1)==="")||(ThreadId(b,b1)===""))
			return IdDepth(a)<IdDepth(b)?-1:1;
		else
			return CompareId(ThreadId(a,a1),ThreadId(b,b1));
	}
}

function ThreadId(fullid,startid){return fullid.replace(CombineRegex(/^/,startid),"").replace(/^\»/,"")};
function IdDepth(fullid){return String(fullid).split("»").length};
	
function NextReplyMessageId(id,dataarray){
	//all comment ids
	var commentids=dataarray.map(function(dataline){return dataline[4]});
	//children comment ids (exactly depth + 1)
	function FollowingThreadIds(fullid){return ThreadId(fullid,id)};
	var childrenThreadIds=commentids.filter(function(fullid){return (ThreadId(fullid,id)!==fullid)&&(IdDepth(fullid)===(1+IdDepth(id)))});
	//+1 child comment;
	return id+"»"+String(childrenThreadIds.length+1);
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
	
	if(GetElement(LOADID)!==null){
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
function Download(data, filename, type){
    var file = new Blob([data], {type: type});
    if(window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
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
	return GetElement(LOADID);
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
	 if(e.keyCode == 81 && e.ctrlKey){
		  ToggleEdit();
     }
	 // Esc -> Don't save
	 else if(e.keyCode == 27 ){
		  ClosePageEditNode();
     };
};


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

function ToggleThis(ev,thi){
	if(ev.target.id===thi.id)
		Toggle(thi);
}

function ToggleThisOnly(ev,thi){
	var siblings=thi.parentNode.childNodes;
	var i=0;
	while (i<siblings.length){
		if(siblings[i]!==thi)
			Deselect(siblings[i]);
		else
			Select(siblings[i]);
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
// Video modal

function VideoEmbedHTML(ytid,origin){
	var ori=origin?"&origin="+origin:"";
	return '<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0"width="100%" height="100%" type="text/html" src="https://www.youtube.com/embed/'+ytid+'?autoplay=1&fs=1&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0'+ori+'"></iframe>'};

function OpenVideoModal(ytid){
	AddElement(ModalHTML(VideoEmbedHTML(ytid,pageTag()),GenerateId(),"gallery-video"),document.body.id);
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


//DataPack integration in console
function LaunchConsoleMessage(DP){
	ConsoleAdd(QuestionHTML(DP));
}




///////////////////////////////////////////////////////////////////////////////
//Sounds Control

function MakeSound(sourcepath,data,id){
	return ElementHTML({
		tag:"audio",
		txt:" ",
		attributes:FuseObjects({'class':'sound',type:'audio/mpeg',preload:'auto','src':sourcepath,'id':(id?id:IDfy(sourcepath))},data?Datafy(data):{})
	});
}

function LoadSound(soundpath,data,id,parentElement){
	return AddElement(MakeSound(soundpath,data,id),parentElement);
}

function LS(soundobject,id,parentElement){
		var src=soundobject.src;
		var opts=FuseObjects(soundobject,{});
		delete opts.src;
		LoadSound(src,opts,id,parentElement);
};

function LoadSounds(soundtrack,parentElement){
	var names=Object.keys(soundtrack);
	for (var i=0;i<names.length;i++){
		LS(soundtrack[names[i]],names[i],parentElement);
	}
}

function PlaySound(soundname){
	GetElement(soundname).play();
}

///////////////////////////////////////////////////////////////////////////////
//Music Control

//Playlist
function Playlist(i){
	if(typeof Playlist.p==="undefined"){
		Playlist.p=GetElements('.music');
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
		Select('MuteButton');
		window.addEventListener("blur", PlaylistSleep);
		//console.log("Now playing: "+song);
	}
}

function PauseSong(song){
	if((typeof song!=="undefined")&&!song.paused){
		song.pause();
		ConsoleAdd("Music paused...");
		Deselect('MuteButton');
		window.removeEventListener("blur", PlaylistSleep);
	}
}

function ResumeSong(song){
	if((typeof song!=="undefined")&&song.paused){
		song.play();
		ConsoleAdd("Resumed playing ♫♪♪ "+NameSong(song));
		Select('MuteButton');
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

function HasSong(){
	return (typeof Playlist.current)!=="undefined";
}

function ToggleCurrentSong(thi){
	var song=CurrentSong();
	if(typeof song==="undefined")
		ConsoleAdd("Error: can't find the jukebox...");
	else if(song.paused){
		ResumeSong(song);
	}
	else {
		PauseSong(song);
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

function FullscreenActivate(browserprefix){
	Select("FullscreenButton");
	console.log("sel");
	var F=function(){
		Deselect("FullscreenButton");
		console.log("desel");
		document.removeEventListener(browserprefix,F);
	}
	setTimeout(function(){
		document.addEventListener(browserprefix,F); 
	},1000) //Delay 1 second
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
//Focus
function FocusOn(targetIDsel){
	var firstelement=GetElement(targetIDsel);
	if(firstelement&&firstelement[0])
		firstelement[0].focus();
}


