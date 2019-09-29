var DESTINATIONS={};

var LOGO='<?xml version="1.0"?>\
<svg viewBox="-8 -8 16 16" xmlns="http://www.w3.org/2000/svg">\
  <rect x="-5" y="-5" width="10" height="10" class="logo-1" fill="#070070"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-1" fill="#070070" transform="rotate(45)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-2" fill="#000fff" transform="scale(0.765367) rotate(22.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-2" fill="#000fff" transform="scale(0.765367) rotate(67.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-3" fill="#1982ed" transform="scale(0.585786) rotate(0)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-3" fill="#1982ed" transform="scale(0.585786) rotate(45)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-4" fill="#3bf8de" transform="scale(0.448342) rotate(22.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-4" fill="#3bf8de" transform="scale(0.448342) rotate(67.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-5" fill="#46f46f" transform="scale(0.343146) rotate(0)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-5" fill="#46f46f" transform="scale(0.343146) rotate(45)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-6" fill="#f0f8af" transform="scale(0.262632) rotate(22.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-6" fill="#f0f8af" transform="scale(0.262632) rotate(67.5)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-7" fill="#fff9c9" transform="scale(0.201010) rotate(0)"></rect>\
  <rect x="-5" y="-5" width="10" height="10" class="logo-7" fill="#fff9c9" transform="scale(0.201010) rotate(45)"></rect>\
</svg>'

///////////////////////////////////////////////////////////////////////////////
//Do nothing
function Identity(){return;};

///////////////////////////////////////////////////////////////////////////////
// Array or Object

//Distinguish Objects and Arrays
function IsArray(array){
	return FunctionName(array.constructor)==="Array";
}

function IsObject(array){
	return FunctionName(array.constructor)==="Object";
}

//Apply function to Array or Object
function Apply(arrayOrObj,F){
	if(IsArray(arrayOrObj))
		return F(arrayOrObj);
	else if(IsObject(arrayOrObj))
		return F(Object.keys(arrayOrObj));
	else{
		console.log("error, nor array nor object");
		return undefined
	}
};

// Does element exist?
function In(arrayOrObj,n){
	function F(ao){return ao.indexOf(n)>=0;};
	return Apply(arrayOrObj,F)||false;
};

//Update Object Keys
function UpdateKeys(Obj,F){
	var keys=Object.keys(Obj);
	for (var i in keys){
		if(Obj.hasOwnProperty(keys[i])){
			Obj[F(keys[i])]=Obj[keys[i]];
			if(F(keys[i])!==keys[i])
				delete  Obj[keys[i]];
		}
	}
	return Obj;
};

///////////////////////////////////////////////////////////////////////////////
//Repetitive functions

// Fold
function FoldM(F,x0,xArray){
	if(xArray.length<1){
		return x0;
	}else if(xArray.length===1){
		return F(x0,xArray[0]);
	}else{
		var x1=xArray[0];
		xArray.shift();
		return FoldM(F,F(x0,x1),xArray);
	}
}

function Fold(F,x0,xArray){
	return FoldM(F,x0,xArray.slice());
}

// Fixed point
function FixedPoint(F,x){
	var i=x;
	while(i!==F(i)){
		i=F(i);
	}
	return i;
}

function SequenceF(f1,f2){
	return function(){
	f1();
	f2();
	};
}

///////////////////////////////////////////////////////////////////////////////
// String Replace
function StringReplace(string,rules){
	if(typeof rules==="string")
		return string.replace(rules,"");
	else if(IsObject(rules)){
		var ks=Object.keys(rules);
		var rules=ks.map(function(k){return [k,rules[k]];});
		return StringReplace(string,rules);
	}
	else if(IsArray(rules)){
		function Replace(string,rule){
			return string.replace(rule[0],rule[1]);
		}
		return Fold(Replace,string,rules);
	}
	else {
		console.log("error: can't make string rule from",r);
		return string;
	}
}

///////////////////////////////////////////////////////////////////////////////
//Get Function Name as a string
function FunctionName(FunctionF){
	var name=FunctionF.toString().replace(/\(.*/,"").replace("function ","");
	return name.replace(/\s.*/gm,"");
}

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

function Clone(Obj){
	return FuseObjects({},Obj);
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
	var regarray=exprarray.map(function(a){return new RegExp(a)});
	regarray=regarray.map(function(a){return(a.source)});
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
var predomainssoft=AlternateRegex(domains.map(function(d){return CombineRegex(/^[\d\D]*/,d)}));
var predomainshard=AlternateRegex(domains.map(function(d){return CombineRegex(/^(https?:\/\/)*/,d)}));
var posdomains=AlternateRegex(domains.map(function(d){return CombineRegex(d,/[\d\D]*$/)}));
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
	return QueryAll(selector).map(markfunction);
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

ListenOnce('DOMContentLoaded',IndexTitles);


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

function LoadScript(sourcecode){
	var head= GetElements('head')[0];
	var script= document.createElement('script');
	script.innerHTML=sourcecode;
	head.appendChild(script);
}

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

//Load styles

function LoadStyle(sourcename){
	var head= document.getElementsByTagName('head')[0];
	var styleelement= document.createElement('link');
	styleelement.href= sourcename.replace(".css","")+".css";
	styleelement.rel="stylesheet";
	styleelement.type="text/css";
	head.appendChild(styleelement);
}

///////////////////////////////////////////////////////////////////////////////
//Data Reception

//Fetch data from url
function LoadDataMaybe(url){
	var data;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", url, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                data = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
	return data;
};

function LoadData(url){
	if(LoadData[url]){
		console.log("(cached data:",url,")");
		return LoadData[url];
	}
	if(Online()){
		try{
			return LoadData[url]=LoadDataMaybe(url);
		}
		catch(errorDummy){
			return undefined;
		}
	}
	else{
		console.log("Offline - couldn't load:",url)
		return undefined;
	}
};

function LoadExternalScript(url){
	LoadScript(LoadData(url));
}

///////////////////////////////////////////////////////////////////////////////
// Data transmission - JSON, to a script in url "url"

function EchoPureData(data,url){
	var encoded = Object.keys(data).map(function(k){
		return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
	}).join('&');

	var xhr = new XMLHttpRequest();
	xhr.open('POST',url);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.onreadystatechange = function(){
		console.log(xhr.status, xhr.statusText);
		console.log(xhr.responseText);
		return;
	};
	// url encode form data for sending as post data

	xhr.send(encoded);	
}

function EchoData(data,url){
	if(Online())
		EchoPureData(data,url);
	else
		BufferData(data,url);	
}

function EchoDataBuffer(){
	while(Connection.queue.length>0){
		EchoPureData(Connection.queue[0][0],Connection.queue[0][1]);
		Connection.queue.shift();
	}
};

function BufferData(data,url){
	Connection.queue.push([data,url]);
}

function DataBufferEmpty(){
	return Connection.queue.length<1;
}

//Network status

function Online(){return navigator.onLine};
function Offline(){return !Online()};

function MonitorConnection() {
	if(Online()){
		var message="Network status:<b>Online</b>";
		if(!DataBufferEmpty()){
			message=message+" re-sending data...";
			EchoDataBuffer();
		}
		ListenOnce('offline',MonitorConnection);
	}else{
		var message="Network status:<b>Offline</b>";
		ListenOnce('online',MonitorConnection);
	}
    ConsoleAdd(message);
 }

function Connection(){
	if(!Connection.queue)
		Connection.queue=[];

ListenOnce('offline', MonitorConnection);
}

Connection();

///////////////////////////////////////////////////////////////////////////////
// DOM Manipulation

function MakeElement(html){
	var e=document.createElement("div");
	e.innerHTML=html;
	return e.firstChild;
}

HTMLTags=['!DOCTYPE','a','abbr','acronym','abbr','address','applet','embed','object','area','article','aside','audio','b','base','basefont','bdi','bdo','big','blockquote','body','br','button','canvas','caption','center','cite','code','col','colgroup','colgroup','data','datalist','dd','del','details','dfn','dialog','dir','ul','div','dl','dt','em','embed','fieldset','figcaption','figure','figure','font','footer','form','frame','frameset','h1','h2','h3','h4','h5','h6','head','header','hr','html','i','iframe','img','input','ins','kbd','label','input','legend','fieldset','li','link','main','map','mark','meta','meter','nav','noframes','noscript','object','ol','optgroup','option','output','p','param','picture','pre','progress','q','rp','rt','ruby','s','samp','script','section','select','small','source','video','audio','span','strike','del','s','strong','style','sub','summary','details','sup','svg','table','tbody','td','template','textarea','tfoot','th','thead','time','title','tr','track','video','audio','tt','u','ul','var','video','wbr'];

HTMLTags=HTMLTags.map(function(s){return s.toUpperCase()});

function IsTag(selector){
	return In(HTMLTags,selector.toUpperCase());
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
	return "#"+parentElement.id;
}

function MakeQuerySelector(selector){
	if(IsQuerySelector(selector))
		return selector;
	else
		return "#"+(selector.replace(/^\#/,""));
}

// Get element based on selectors: .class, #id, idsring, or the element itself
function GetElementFromTextSelector(selector,parentElement){
	if(parentElement===null)
		return null;
	selector=MakeQuerySelector(selector);
	return parentElement.querySelector(selector);
};

function GetElementIn(selector,parentElement){
	if(typeof selector==="string")
		return GetElementFromTextSelector(selector,parentElement);
	else
		return selector; //in case the actual element is given in the beginning
};

function GetElement(selector,pSelector){
	var parentElement;
	if(!pSelector)
		parentElement=document;
	else{
		if(typeof pSelector==="string")
			parentElement=GetElementIn(pSelector,document);
		else
			parentElement=pSelector;
	}		
	return GetElementIn(selector,parentElement)
}

//Match Element to selector
function QueryAll(selector){
	return Array.from(document.querySelectorAll(MakeQuerySelector(selector)));
}

function Match(elem,selector){
	return In(QueryAll(selector),elem);
}

//Find first Element matching selector
function FindFirstMatch(selectorArray,elem){
	var elem=GetElement(elem);
	
	function F(a){
		return a.find(function(sel){return Match(elem,sel)})
	};
		
	var item=Apply(selectorArray,F);
	if(IsObject(selectorArray))
		return selectorArray[item];
	else 
		return item;
}



//Inside

function InsideAt(parentSelector,selector){
	if(GetElement(parentSelector)===null||GetElement(selector)===null)
		return undefined;
	return Inside(parentSelector,selector)||GetElement(parentSelector).isEqualNode(GetElement(selector));
}

function Inside(parentSelector,selector){
	if(GetElement(parentSelector)===null||GetElement(selector)===null)
		return undefined;
	return GetElement(parentSelector).contains(GetElement(selector));
}

function Outside(parentSelector,selector){
	if(GetElement(parentSelector)===null||GetElement(selector)===null)
		return undefined;
	return !InsideAt(parentSelector,selector);
}

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
	return e;
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


//////////////////////////////////////////////////
// Guestbook 
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


// Comment tree system
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

function SingleElementHTML(optionsObj){
	var tag=optionsObj.tag?optionsObj.tag:"div";
	var attributes=(optionsObj.attributes)?' '+ReadAttributes(optionsObj.attributes):'';	//attributes is an Object
	return "<"+tag+attributes+"/>"
};


// Basic Elements

function ImageHTML(optionsObj){
	var o=optionsObj?optionsObj:{};
	o.tag="img";
	if(!o.attributes)
		o.attributes={src:"images/splash.png"}
	return SingleElementHTML(o)
};

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
	
	var ao=o.attributes['onclick'];
	o.attributes['onclick']="PulseSelect(this);"+(ao?ao:"");
	//o.attributes['onkeydown']="ExecuteShortcut(this,event)";

	//Context Menu and Select prevention
	o.attributes['oncontextmenu']="(function(e){e.preventDefault()})(event);";
	o.attributes['unselectable']="on";
	o.attributes['onselectstart']="return false;";
	
	o.attributes['tabindex']="0";
	
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
	return "<div class='closer'>"+ButtonHTML({tag:"span",txt:"&times;",attributes:{onclick:'CloseCurrentDatapack()'}})+"</div>";
}

function OkButtonHTML(targetid){
	return ButtonOnClickHTML("OK",'Close(\"'+targetid+'\")');
}
function SubmitButtonHTML(DP){
	return ButtonOnClickHTML(DP.actionText,FunctionName(DP.action)+"(\""+DP.qid+"\")");
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
		defaultChoice:DefaultChoice,	//choice formatting, based on itself, receives (index,choicetxt)

		qtype:PlainHTML,				//Format of question :receives a DataField
		qplaceholder:"❤ Pedro PSI ❤",	//Placeholder answer

		shortcuts:Identity,				//Special shortcuts

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
		qclass:"",						//class
		
		destination:'Feedback',			//Name of data repository
		requireConnection:true,			//Does it need a connection?

		action:CheckSubmit, 			//action on submit :receives a qid
		actionvalid:SubmitValidAnswer,	//action on valid submit: receives a DataPack
		actionText:'Submit',			//text to display instead of "Submit"
		
		qtargetid:document.body.id,		//Where to introduce form in page?
		qdisplay:LaunchModal,			//Question display function :receives a DataPack

		qonsubmit:LaunchThanksModal,	//Next modal on successful submit: receives a DataPack
		qonclose:Identity,				//Next modal on close (defaults to nothing): receives a DataPack
		thanksmessage:"Submitted. Thank you!",
		
		shortcutExtras:{},				//Extended shortcuts, to use ad-hoc
		spotlight:Spotlight(),			//Spotlight at the moment of calling
		
		buttonSelector:"none"			//Selector for button requesting the datapack
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
			action:Close,
			destination:'',
			qtype:LongAnswerHTML,
			qdisplay:LaunchThanksModal}),
		email:NewDataField({
			qtype:ShortAnswerHTML,
			qfield:"address",
			qplaceholder:"_______@___.___",
			qvalidator:EmailValidator}),
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
		navi:NewDataField({
			qfield:"navi",
			qclass:"nowrap",
			questionname:"",
			qchoices:["◀","OK","▶"],
			qtype:ExclusiveChoiceButtonRowHTML,
			defaultChoice:function(i,txt){return txt==="OK";},
			qsubmittable:false}),
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
		
		if(!GetDataPack.history)
			GetDataPack.history=[];
		
		if(GetDataPack.history.length>0){
			var last=GetDataPack.history[GetDataPack.history.length-1].qid;
			Close(last);
		}
		
		GetDataPack.history.push(DP);
		DP.qdisplay(DP);
		
		Select(DP.buttonSelector);		//Activate button
		FocusInside("#"+DP.qid); 		//Focus on first question
		
		setTimeout(function(){ListenOutside("click",function(){Close(DP.qid)},DP.qid)},500); //Click outside to close
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
	return '<div class="buttonrow '+dataField.qclass+'" '+clear+'id="'+dataField.qid+'">'+choi+'</div>';
}

function ChoicesButtonRowHTML(dataField){
	function ChoicesButtonHTML(choice,dataFiel,i){
		var args='(\''+dataFiel.qfield+'\',\''+choice+'\',\''+dataFiel.pid+'\')';
		var SelectF='ToggleThis(event,this);ToggleData'+args;
		var buAttribs={'onclick':SelectF,'onfocus':SelectF,id:"choice-"+choice};
		
		return ButtonHTML({txt:choice,attributes:buAttribs});
	};
	//console.log(dataField.qfield);console.log(dataField.pid);console.log(GetDefaultData(dataField.qfield,dataField.pid));
	ClearData(dataField.qfield,dataField.pid);
	return ChoiceHTML(dataField,ChoicesButtonHTML)
}

function ExclusiveChoiceButtonRowHTML(dataField){
	function ExclusiveChoiceButtonHTML(choice,dataFiel,i){
		var args='(\"'+dataFiel.qfield+'\",\"'+choice+'\",\"'+dataFiel.pid+'\");';
		var SetF='SetData'+args;
		var ExecuteF='ExecuteChoice'+args;
		var SelectF='ToggleThisOnly(event,this);'+SetF;
		//var ExecuteF=SelectF+'CheckSubmit(\"'+dataFiel.pid+'\");';
		var buAttribs={
			'onfocus':SelectF,
			'onclick':ExecuteF,
			'ondblclick':ExecuteF,
			id:"choice-"+choice};
		var bu;
		//console.log(i,choice,typeof i);
		if(dataFiel.defaultChoice(i,choice)){
			bu=ButtonHTML({txt:choice,attributes:FuseObjects(buAttribs,{class:"selected",onload:SetF})});
			SetData(dataFiel.qfield,choice,dataFiel.pid);//Actualy choose it
		}
		else 
			bu=ButtonHTML({txt:choice,attributes:buAttribs});
		return bu;
	};
	//console.log(dataField.qfield);console.log(dataField.pid);
	ClearData(dataField.qfield,dataField.pid);
	return ChoiceHTML(dataField,ExclusiveChoiceButtonHTML)
}

function ShortAnswerHTML(dataField){
	return "<input class='input' data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"'></input>";
}

function LongAnswerHTML(dataField){
	return "<textarea class='input' data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"'></textarea>";
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

function LaunchThanksBalloon(DP){
	RequestDataPack(
		[['plain',{questionname:DP.thanksmessage,destination:""}]],
		{qtargetid:DP.qtargetid,
		qdisplay:LaunchBalloon,
		requireConnection:false});
}

function LaunchBalloon(DP){
	OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function BalloonHTML(avatarHTML,content,id){
	var b='<div class="balloon window" id='+id+'>'+CloseButtonHTML(id)+'<div class="baloon-content">'+avatarHTML+'<div class="subtitle">'+content+'</div></div></div>';
	return b;
}

function OpenBalloon(content,id,targetid){
	AddElement(BalloonHTML('<div class="logo avatar">'+LOGO+'</div>',content,id),targetid);
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

function SelectSimple(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e){
		e.classList.remove(clas);
		e.classList.add(clas);
	}
}

function Select(selectorE,clas){ //With Pulse by default
	SelectSimple(selectorE,clas);
	PulseSelect(selectorE);
}

function Deselect(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.remove(clas);
}

function Selected(selectorE){
	return Classed(selectorE,"selected");
}

function Classed(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	return e&&e.classList.contains(clas);
}

function Toggle(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.toggle(clas);
}

// Select Pulse

function PulseSelect(selectorE){
	var clas="pulsating";
	SelectSimple(selectorE,clas);
	setTimeout(function(){Deselect(selectorE,clas);},100);
}

// Show/Hide

function Show(selectorE){
	Deselect(selectorE,"hidden");
}

function Hide(selectorE){
	SelectSimple(selectorE,"hidden");
}

////////////////////////////////////////////////////////////////////////////////
// Closing functions

function CloseElement(targetIDsel){
	var fading=GetElement(targetIDsel);
	if(fading){
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
	var DP=GetDataPack(targetid);
	if(typeof DP!=="undefined"){
		Deselect(DP.buttonSelector);
		DeleteShortcuts(DP.qid);
		var ClosingF=DP.qonclose;
		if(typeof ClosingF!=="undefined")
			ClosingF(DP);
	}
	CloseElement(targetid);
}

function CloseAndContinue(DP){
	var NextF=DP.qonsubmit;
	Deselect(DP.buttonSelector);
	if(typeof NextF!=="undefined")
		NextF(DP);
	CloseElement(DP.qid);
}

// Current Datapack
function CurrentDatapack(){
	var c=GetElement(".closer");
	if(c)
		return GetDataPack(c.parentElement.id);
	else
		return undefined;
}

function CloseCurrentDatapack(){
	Close(CurrentDatapack().qid);
}

function SubmitCurrentDatapack(){
	var DP=CurrentDatapack();
	DP.action(DP.qid);
}

////////////////////////////////////////////////////////////////////////////////
// Focus functions

// Spotlight (context shifting)
function Spotlight(){
	if(!Spotlight.s)
		Spotlight.s=[document.body];
	return Spotlight.s[Spotlight.s.length-1];
}

function AddSpotlight(element){
	if(Spotlight()!==element){
		Spotlight.s.push(element);
	}
	return element;
}

function FocusSpotlight(elem){
	var elem=GetElement(elem);
	var f=FocusInside(elem);
	if(!f)
		FocusElement(elem);
}

window.addEventListener('click',function(ev){FocusSpotlight(ev.target);});

// Focus management
function FocusElement(targetIDsel){
	var focussing=GetElement(targetIDsel);
	if(focussing){
		focussing.focus();	
		AddSpotlight(focussing);
	}
	return focussing;
};

function FocusableInput(e){
	return Classed(e,"input")||In(["INPUT","TEXTAREA"],e.tagName);
}
function Focusable(e){
	return FocusableInput(e)||Classed(e,"button");//List of element and classes
}
function UnFocusable(e){
	return Classed(e,"closer")||Classed(e,"logo");
}

function FocusInside(targetIDsel){
	var e=GetElement(targetIDsel);
	if(!e)
		return false;
	
	if(Focusable(e)){
		FocusElement(e);
		return true;
	}
	
	var selElem=GetElement(".selected",targetIDsel);
		
	if(Selected(selElem)&&selElem.parentNode.isEqualNode(GetElement(targetIDsel))){
		FocusElement(selElem);
		return true;
	}
	else {	
		var children=e.children;
		var found=false;
		var i=0;
		while(!found&&i<children.length){
			if(UnFocusable(children[i])){
				found=false;
			} else {
				found=FocusInside(children[i]);
			}
			i++;
		}
		return found;
	}
};

function FocusPrev(F,bounded){
	if(F===undefined||typeof F!=="function")
		var F=Identity;
	var prev=document.activeElement.previousSibling;
	if(prev===null)
		if(bounded===true)
			return console.log("beginning reached");
		else
			prev=document.activeElement.parentElement.lastChild;
	FocusInside(prev);
	F(prev);
}

function FocusNext(F,bounded){
	if(F===undefined||typeof F!=="function")
		var F=Identity;
	var next=document.activeElement.nextSibling;
	if(next===null)
		if(bounded===true)
			return console.log("end reached");
		else
		next=document.activeElement.parentElement.firstChild;
	FocusInside(next);
	F(next);
}

function FocusStay(F){
	if(F===undefined||typeof F!=="function")
		var F=Identity;
	var stay=document.activeElement;
	FocusElement(stay);
	F(stay);
}

function FocusPrevBounded(F){
	FocusPrev(F,true)
}

function FocusNextBounded(F){
	FocusNext(F,true)
}

//Click
function ClickPrevBounded(){
	FocusPrevBounded(function(elem){elem.click()},true)
}

function ClickNextBounded(){
	FocusNextBounded(function(elem){elem.click()},true)
}

function ClickStay(){
	FocusStay(function(elem){elem.click()},true)
}

///////////////////////////////////////////////////////////////////////////////
//Event Listeners

function ListenOnce(ev,fun,target){
	return ListenF(ev,fun,target?target:window,function(eve){return true;});
}

function ListenOutside(ev,fun,target){
	return ListenF(ev,fun,window,function(eve){return Outside(target,eve.target);});
}

function ListenF(ev,fun,target,ConditionF){
		var evObj={
			"ev":IsArray(ev)?ev:[ev],
			"F":F,
			"target":GetElement(target)
		};
			
		function F(eve){
			if(ConditionF(eve)){
				fun();
				ListenNoMore(evObj);
			}
		};
		
		ListenIndeed(evObj);
		return evObj;
}

function ListenNoMore(evObj){
	evObj["ev"].map(function(e){evObj["target"].removeEventListener(e,evObj["F"])});
}

function ListenIndeed(evObj){
	evObj["ev"].map(function(e){evObj["target"].addEventListener(e,evObj["F"])});
}



////////////////////////////////////////////////////////////////////////////////
// Data submission in forms

function SubmitData(dataObject,destination){
	var data =dataObject;
	data.formDataNameOrder=destination.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=destination.sheet;
	
	if(!PreviousSubmission.history)
		PreviousSubmission.history=[];
	PreviousSubmission.history.push(data);
	
	EchoData(data,destination.url);
}

function SubmitValidAnswer(DP){
	var formtype=FindData("destination",DP.qid);
	var destinationObject=GetDestination(formtype);
	var dataObject=(destinationObject.Data)(DP.qid);
	SubmitData(dataObject,destinationObject);
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


function SubmitAnswerSet(DP){
	var invalidation=DP.fields.map(InvalidateAnswer);
	if(!invalidation.some(function(x){return x===true})){
		DP.actionvalid(DP),CloseAndContinue(DP);
	}
}

function CheckSubmit(qid){
	var DP=GetDataPack(qid);
	if(typeof DP!=="undefined"){
		if(DP.requireConnection&&!Online())
			ConsoleAdd("<b>Network offline...</b>Submission saved - will be re-sent when back online.");
		SubmitAnswerSet(DP);
	}
};


function PreviousSubmission(field){
	if(!PreviousSubmission.history)
		PreviousSubmission.history=[];
	
	var s=PreviousSubmission.history.filter(function(datasub){return ((typeof datasub[field])!=="undefined")});
	
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
	if(FocusableInput(node)&&typeof node.dataset[field]!=="undefined")
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
	if(FocusableInput(node)&&typeof node.dataset[field]!=="undefined")
		return (node.value=newdata);
	else
		return (node.dataset[field]=newdata);
}

///////////////////////

function GetDataPack(id){
	if(!GetDataPack.history)
		GetDataPack.history=[];
	
	return GetDataPack.history.find(
		function(DP){return DP.qid===id;}
		);
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
	var DP=GetDataPack(parentid);
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

function ExecuteChoice(field,value,pid){
	GetField(field,pid).executeChoice(value,pid); //Not dynamically updated. And why should it be?
};


///////////////////////////////////////////////////////////////////////////////
// Global Data Transmission Variables


function GetDestination(dname){
	return DESTINATIONS[dname];
}

///////////////////////////////////////////////////////////////////////////////
// Modals

function ModalHTML(content,id,type){
	var t=type?(" "+type):"";
	return'<div class="modal window'+t+'" id="'+id+'" onclick="CloseThis(event,this,\''+id+'\')">\
	        <div class="modal-frame">\
				'+CloseButtonHTML(id)+'\
				<div class="modal-content">\
					'+content+'\
				</div>\
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
		{qtargetid:DP.qtargetid,
		qdisplay:LaunchModal,
		requireConnection:false});
	
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

function ConsoleAddOnce(messageHTML,wait,duration){
	if(!ConsoleAddOnce.messages)
		ConsoleAddOnce.messages=[];
	
	if(!In(ConsoleAddOnce.messages,messageHTML)){
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

function PlaylistStartPlay(){
	PlaySong(Playlist(0));
	//console.log("Music on");
}


//Song
function Muted(){
	return !Selected(GetElement("MuteButton"));
}
function Mute(){
	Deselect("MuteButton");
}
function Unmute(){
	Select("MuteButton");
}

function PlaySong(song){
	if((typeof song!=="undefined")&&song.paused){
		song.play();
		ListenOnce('ended',PlayNextF(song),song);
		Unmute();
		window.addEventListener("blur", PlaylistSleep);
		//console.log("Now playing: "+song);
	}
}

function PauseSong(song){
	if((typeof song!=="undefined")&&!song.paused){
		song.pause();
		ConsoleAdd("Music paused...");
		Mute();
		window.removeEventListener("blur", PlaylistSleep);
	}
}

function ResumeSong(song){
	if((typeof song!=="undefined")&&song.paused){
		song.play();
		ConsoleAdd("Resumed playing ♫♪♪ "+NameSong(song));
		Unmute();
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
		//console.log("Finished playing: "+song);
	}
}


//Player

function CurrentSong(){
	return Playlist.p[Playlist.current];
}

function HasSong(){
	return (typeof Playlist.current)!=="undefined";
}

function ToggleCurrentSong(){
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



///////////////////////////////////////////////////////////////////////////////
//Fullscreen

function FullscreenAllowed(){
	return (document.exitFullscreen||document.mozCancelFullScreen||document.webkitExitFullscreen||document.msExitFullscreen||(document.webkitFullscreenElement&&document.webkitExitFullscreen)||false)!==false;
}

function FullscreenActivate(browserprefix){
	function Deactivate(){
		if(!(document.fullscreenElement||document.webkitFullscreenElement)){
			Deselect("FullscreenButton");
			FreeFullscreenCursor();
		}
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
		ShowFullscreenCursor();
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
		FreeFullscreenCursor();
		ConsoleLoad();
	};
}

function FullscreenToggle(targetIDsel){
	FullscreenElement.selector=targetIDsel;
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

function FullscreenElement(){
	return GetElement(FullscreenElement.selector);
}

//Fullscreen cursor
function HiddenFullscreenCursor(){
	return Classed(FullscreenElement(),"hideCursor");
}
function HideFullscreenCursor(){
	if(!HiddenFullscreenCursor()){
		Select(FullscreenElement(),"hideCursor");
		HideFullscreenCursor.last=ListenOnce('mousemove',ShowFullscreenCursor,FullscreenElement());
	}
}
function ShowFullscreenCursor(){
	Deselect(FullscreenElement(),"hideCursor");
	FreeFullscreenCursor.timeout=setTimeout(HideFullscreenCursor,3000);
}
function FreeFullscreenCursor(){
	Deselect(FullscreenElement(),"hideCursor");
	clearTimeout(FreeFullscreenCursor.timeout);
	if(HideFullscreenCursor.last)
		ListenNoMore(HideFullscreenCursor.last);
}


///////////////////////////////////////////////////////////////////////////////
//Contextual Shortcuts

var ContextualShortcuts={
	"BODY":{
		"left":FocusPrev,
		"right":FocusNext,
	},
	".window":{
		"escape":CloseCurrentDatapack,
		"ctrl w":CloseCurrentDatapack,
		"ctrl enter":SubmitCurrentDatapack
	},
	".navi":{
		"left":ClickPrevBounded,
		"up":ClickNextBounded,
		"right":ClickNextBounded,
		"down":ClickPrevBounded
	},
	".buttonrow":{
		"left":FocusPrev,
		"up":FocusNext,
		"right":FocusNext,
		"down":FocusPrev
	},
	".button":{
		"enter":ClickStay,
		"space":ClickStay,
		"X":ClickStay
	},
	"A":{
		"space":ClickStay
	},
	".input":{
		"escape":CloseCurrentDatapack,
		"enter":FocusNext,
		"tab":FocusNext,
		"shift tab":FocusPrev,
		"ctrl enter":SubmitCurrentDatapack
	}
}


//Context finding
function Context(targetSelector){
	if(typeof targetSelector==="undefined")
		return ElementContext(Spotlight());
	else
		return ElementContext(targetSelector);
}

function ElementContext(targetSelector){
	var e=GetElement(targetSelector);
	if(!e){
		return console.log("no element  for context",targetSelector); //Add last context
	}
	
	var context=SubContext(e);
	var subcontext;
		
	while(e.parentElement&&!ContextBlocker(e)){
		e=e.parentElement;
		subcontext=SubContext(e);
		if(subcontext)
			context=FuseObjects(subcontext,context);
		//Add blocking rules or references
	}
	return context
}

function ContextBlocker(e){
	return FocusableInput(e)||Classed(e,"window");
}

function SubContext(elem){
	var keyActions=FindFirstMatch(ContextualShortcuts,elem);
	if(keyActions)
		return UpdateKeys(keyActions,ComboKeystring);
	else
		return undefined;
}


//Add Shortcuts
function OverwriteShortcuts(selector,keyActions){
	var keyActions=UpdateKeys(Clone(keyActions),ComboKeystring);
	
	if(!ContextualShortcuts[selector])
		ContextualShortcuts[selector]=keyActions;
	else
		ContextualShortcuts[selector]=FuseObjects(keyActions,UpdateKeys(ContextualShortcuts[selector],ComboKeystring));

	return ContextualShortcuts[selector];
}

function DeleteShortcuts(selector){
	if(ContextualShortcuts[selector])
		delete ContextualShortcuts[selector];
	return ContextualShortcuts;
}



///////////////////////////////////////////////////////////////////////////////
//Keyboard input - TODO collapse everything in a nicer function by storing the regex as object.
function UnCtrlKeyString(keystring){
	return keystring.replace(/co?n?tro?l/i,"").replace(/co?mm?a?n?d/i,"");
}
function UnShiftKeyString(keystring){
	return keystring.replace(/sh?i?ft?/i,"");
}
function UnAltKeyString(keystring){
	return keystring.replace(/alt/i,"");
}
function UnEnterKeyString(keystring){
	return keystring.replace(/ente?r/i,"").replace(/re?tu?rn/i,"");
}
/*
function UnBackspaceKeyString(keystring){
	return keystring.replace(/ba?c?k?spa?c?e?/i,"");
}
*/
function UnSpaceKeyString(keystring){
	return keystring.replace(/spa?ce?b?a?r?/i,"");
}

function CtrlKey(keystring){
	return keystring!==UnCtrlKeyString(keystring);
}
function ShiftKey(keystring){
	return keystring!==UnShiftKeyString(keystring);
}
function AltKey(keystring){
	return keystring!==UnAltKeyString(keystring);
}
function EnterKey(keystring){
	return keystring!==UnEnterKeyString(keystring);
}
/*function BackspaceKey(keystring){
	return keystring!==UnBackspaceKeyString(keystring);
}*/
function SpaceKey(keystring){
	return keystring!==UnSpaceKeyString(keystring);
}


//Canonical Keystring Combo
function EventKeystring(event){
	var keystring=
	(event.ctrlKey? "ctrl " :"")+
	(event.altKey?  "alt "  :"")+
	(event.shiftKey?"shift ":"")+
	KeyNumberLookup(event.keyCode);
	return ComboKeystring(keystring);
}

function ComboKeystring(key){
	if(typeof key==="number")
		return ComboKeystring(KeyNumberLookup(key));
	else {//reduce to one space, lowercase, order: ctrl alt shift
		var keystring=key.toLowerCase();
		keystring=UnSpaceKeyString(UnEnterKeyString(UnCtrlKeyString(UnAltKeyString(UnShiftKeyString(keystring)))));
		keystring=keystring.replace(/[\+\.\-\ ]*/g,"");

		/*if(BackspaceKey(key))
			keystring="back "+keystring;
		else*/
		if(SpaceKey(key))
			keystring="space "+keystring;	
		if(EnterKey(key))
			keystring="enter "+keystring;		
		if(ShiftKey(key))
			keystring="shift "+keystring;
		if(AltKey(key))
			keystring="alt "+keystring;
		if(CtrlKey(key))
			keystring="ctrl "+keystring;
		
		keystring=keystring.replace(/\s*$/,"")
		
		return keystring;
	}
}

function KeyNumberLookup(keynumber){
	for(var i in KeyCodes){
		if(KeyCodes[i]===keynumber)
			return i;
	}
	console.log("no key for number:",keynumber);
	return "";
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
	'arrowleft':37,
	'up':38,
	'arrowup':38,
	'right':39,
	'arrowright':39,
	'down':40,
	'arrowdown':40,
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


//Key Capturing
function CaptureComboKey(event) {
	event = event || window.event;
	var keystring=EventKeystring(event);
	var context=Context();
	if(In(context,keystring)){
		event.preventDefault();
		context[keystring](event); //TODO see whether sending an event is appropriate
	}
}


//Key Capturing Setters
function StopCapturingKeys(OnKeyDown){
	document.removeEventListener('keydown',OnKeyDown); // TODO improve
}
function ResumeCapturingKeys(OnKeyDown){ // TODO improve
	StopCapturingKeys(OnKeyDown);
	document.addEventListener('keydown',OnKeyDown);
}



//Datapack Integration
function SetDatapackShortcuts(DP){
	return OverwriteShortcuts("#"+DP.qid,DP.shortcutExtras);
}
 


///////////////////////////////////////////////////////////////////////////////
// AutoRepeat and AutoStop functions

function AutoRepeat(RepeatF,delay){
	clearTimeout(AutoRepeat[FunctionName(RepeatF)]);
	AutoRepeat[FunctionName(RepeatF)]=setTimeout(function(){
		RepeatF();
		AutoRepeat(RepeatF,delay);
	},delay);
}

function AutoStop(RepeatF,delay){
	clearTimeout(AutoRepeat[FunctionName(RepeatF)]);
	setTimeout(function(){
		clearTimeout(AutoRepeat[FunctionName(RepeatF)]);
	},delay);
}

function Monitor(MonitorF,delay,DisplayF){
	var DisplayF=DisplayF?DisplayF:console.log;
	function M(){
		DisplayF(MonitorF());
	}
	AutoRepeat(M,delay);
}


///////////////////////////////////////////////////////////////////////////////
// Cycle

function ArrayHash(array){
	return "hash"+JSON.stringify(array).replace(/[^\w]|\d/g,"");
}

function CyclePosition(array){
	var arrayhash=ArrayHash(array);
	if(!Cycle.hashArray||!In(Cycle.hashArray,arrayhash))
		return 0;
	else
		return Cycle.hashArray[arrayhash];
}

function Cycle(array,n,bounded){
	var arrayhash="hash"+JSON.stringify(array).replace(/[^\w]|\d/g,"");
	if(!Cycle.hashArray)
		Cycle.hashArray={};
	
	if(!In(Cycle.hashArray,arrayhash))
		Cycle.hashArray[arrayhash]=0;
	else{
		var i=(Cycle.hashArray[arrayhash]+n);
		
		if(bounded===true)
			i=Math.max(Math.min(i,array.length-1),0);
		else
			i=i%(array.length);
		
		Cycle.hashArray[arrayhash]=i;
	}
	return array[Cycle.hashArray[arrayhash]];	
}

function CycleStay(array){
	return Cycle(array,0);
}

function CycleNext(array){
	return Cycle(array,1);
}

function CyclePrev(array){
	return Cycle(array,-1);
}

function CycleNextBounded(array){
	return Cycle(array,1,true);
}

function CyclePrevBounded(array){
	return Cycle(array,-1,true);
}


///////////////////////////////////////////////////////////////////////////////
//Image
var ImageExtensions=["apng","bmp","gif","ico","cur","jpg","jpeg","jfif","pjpeg","pjp","png","svg","tif","tiff","webp"];

function LoadImage(fullpath){
	var loaded=LoadData(fullpath)!==undefined;
	if(loaded){
		if(IsGif){
			gifID=GenerateId();
			loaded=ImageHTML({attributes:{id:gifID,src:fullpath,onload:'StartGIF('+gifID+')'}});
		}
		else
			loaded=ImageHTML({attributes:{src:fullpath}});
	}
	else{
		console.log("no image found at: ",fullpath);
		loaded="";
	}
	return loaded;
}

function IsImageReference(ref){
	return ImageExtensions.some(function(ext){return ref.replace("."+ext,"")!==ref});
}

//GIF Pause Support
function IsGif(ref){
	return ref.replace(".gif","")!==ref;
}

function StartGIF(gid){
	var g=GetElement(gid);
	
	RemoveElement(GetElementIn("CANVAS",g.parentElement));
	var c=AddElement("<canvas></canvas>",g.parentElement);
	
	Hide(g);	
	ResizeGIF();
	c.addEventListener('resize',ResizeGIF);	
	ListenOnce('click',PlayGif(c,gid),c);
	
	function ResizeGIF(){
		var g=GetElement(gid);
		var c=g.nextSibling;
		var ctx=c.getContext('2d');
		var w=g.width;
		var h=g.height;
		c.width=w;
		c.height=h;
		DrawImage({
			"elem":g,
			"width":w,
			"height":h
		})(ctx);
		
		var s=(w*h)**0.5/3;
				
		DrawPolygon({
			"size":s/2,
			"fillColor":getComputedStyle(c)["color"],
			"strokeColor":getComputedStyle(c)["background-color"],
			"lineWidth":s/20,
			"n":1,
			x:w/2,
			y:h/2
		})(ctx);
		
		DrawPolygon({
			"size":s/2*0.8,
			"fillColor":getComputedStyle(c)["background-color"],
			"n":3,
			x:w/2,
			y:h/2
		})(ctx);
		
	}
	
}

function PlayGif(c,gid){
	return function(){
		var g=GetElement(gid);
		function SG(){
			return StartGIF(gid)
		}
		ListenOnce('click',SG,g);
		Show(g);
		Hide(c);
	}
}


///////////////////////////////////////////////////////////////////////////////
// Canvas Drawing

function DrawImage(txtObj){
	if(!txtObj.elem)
		return console.log("no image element in",txtObj);
	
	var elem=txtObj.elem;
	var x=txtObj.x?txtObj.x:0;
	var y=txtObj.y?txtObj.y:0;
	var width=txtObj.width?txtObj.width:100; //Improve these defaults
	var height=txtObj.height?txtObj.height:100;
		
	return function(ctx){
		ctx.drawImage(elem,x,y,width,height);
	}		
}

function DrawPolygon(txtObj){
	var strokeColor=txtObj.strokeColor?txtObj.strokeColor:getComputedStyle(document.body)["strokeColor"];
	var fillColor=txtObj.fillColor?txtObj.fillColor:getComputedStyle(document.body)["background-strokeColor"];
		
	var x=txtObj.x?txtObj.x:0;
	var y=txtObj.y?txtObj.y:0;
	var size=txtObj.size?txtObj.size:100;
	
	var lineWidth=txtObj.lineWidth?txtObj.lineWidth:size/20;
	
	var n=txtObj.n?txtObj.n:3;				//Number of sides
	var startAngle=txtObj.startAngle?txtObj.startAngle:0;		//StartAngle
		
	return function(ctx){
		ctx.beginPath();
		if(n>=3){
			for (var i=0;i<n;i++){
				var angle=startAngle+i*Math.PI*2/n;
				var xpos=x+size*Math.cos(angle);
				var ypos=y+size*Math.sin(angle);
				ctx.lineTo(xpos,ypos);
			}
		}
		else{
			ctx.arc(x,y,size,0,Math.PI*2);
		}
		ctx.closePath();
		ctx.fillStyle=fillColor;
		ctx.fill();

		if(txtObj.lineWidth){
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle=strokeColor;
			ctx.stroke();			
		}			
	}		
}

///////////////////////////////////////////////////////////////////////////////
//Reduce

function Accumulate(acc,val){return acc+val};