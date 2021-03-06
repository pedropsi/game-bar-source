
///////////////////////////////////////////////////////////////////////////////
//Do nothing
function Identity(i){return i;};
function True(){return true};
function False(){return false};

///////////////////////////////////////////////////////////////////////////////
// Lists (AS = Array or String)

function Last(AS){
	if(AS.length)
		return AS[AS.length-1];
	else
		return null;
}

function First(AS){
	if(AS.length)
		return AS[0];
	else
		return null;
}

function Rest(AS){
	if(AS.length){
		if(typeof AS==="string")
			return Rest(AS.split("")).join("");
		else{
			A=Clone(AS);
			A.shift();
			return A;
		}
	}
	else
		return null;
}

function Most(AS){
	if(AS.length){
		if(typeof AS==="string")
			return Most(AS.split("")).join("");
		else{
			A=Clone(AS);
			A.pop();
			return A;
		}
	}
	else
		return null;
}


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
function InArrayOrObj(arrayOrObj,n){
	if(!arrayOrObj)
		return false;
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

function InString(string,n){
	var s=string;
	return s.replace(n,"")!==string;
}

function In(SAO,n){
	if(typeof SAO==="string")
		return InString(SAO,n);
	else
		return InArrayOrObj(SAO,n);
}

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


Fold(function(s,r){return s.replace(r[0],r[1])},"ohnoanother",[["o","l"],["a","i"]])

///////////////////////////////////////////////////////////////////////////////
// String Replace
function StringReplaceOnceRule(string,rule){
	return string.replace(rule[0],rule.length>0?rule[1]:"");
}
function StringReplaceRule(string,rule){
	return FixedPoint(function(s){return StringReplaceOnceRule(s,rule)},string)
}
function StringReplaceRuleArray(string,ruleArray){
	return Fold(StringReplaceRule,string,ruleArray);
}

function ObjectRules(Obj){
	var keys=Object.keys(Obj);
	var a=[];
	for(var i in keys){
		if (Obj.hasOwnProperty(keys[i])){
			a.push([keys[i],Obj[keys[i]]])
		}
	}
	return a;
}

function StringReplaceRulesObject(string,rulesObj){
	return FixedPoint(function(s){return StringReplaceRuleArray(s,ObjectRules(rulesObj))},string);
}

function StringReplace(string,rules){
	if(typeof rules==="string")
		return string.replace(rules,"");
	else if(IsObject(rules)){ //Inversion
		return StringReplaceRulesObject(string,rules);
	}
	else if(IsArray(rules)){
		if(IsArray(rules[0]))
			return StringReplaceRuleArray(string,rules);
		else
			return StringReplaceRule(string,rule);
	}
	else{
		console.log("error: can't make string rule from",r);
		return string;
	}
}

///////////////////////////////////////////////////////////////////////////////
//Get Function Name as a string, or make up a unique one based on the function's body
function FunctionName(FunctionF){
	var name=FunctionF.toString().replace(/\(.*/,"").replace("function ","");
	name=name.replace(/\s.*/gm,"");
	if(name!=="function")
		return name;
	else{
		var body=FunctionF.toString().replace(/[^\)]*\)/,"");
		return body.replace(/[^ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890]/gi,"").replace(/^[1234567890]*/,"");
	}
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

function CloneObject(Obj){
	return FuseObjects({},Obj);
}

function CloneArray(Arr){
	return [].concat(Arr);
}

function Clone(AOS){
	if(typeof AOS==="string")
		return AOS;
	else if(IsObject(AOS))
		return CloneObject(AOS);
	else
		return CloneArray(AOS);
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
var domains=["pedropsi.github.io","combinatura.github.io"];
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
			return urlAfter.replace(".html","").replace(".htm","").replace(/\?.*/g,"");
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


//Search queries
function pageSearch(parameter,page){
	var l=document.createElement("a");
	l.href=page||document.URL;
	var id=l.search.replace("?"+parameter+"=","");
	if(/.*\=.*/.test(id))
		id="";
	return id;
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

//Glocal Files
function Local(){
	return /^file\:.*/.test(document.URL);
}
function JoinPath(path,subpath){
	return path.replace(/\\*$/,"")+"/"+subpath.replace(/^\\*/,"");
}
function GlocalPath(urlpath,relativepath){
if(Local())
	var u="..";
else
	var u=urlpath;
return JoinPath(u,relativepath);
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
	var preconsonants="bcdfghjklmnpqrstvwxz";
	var preconsonants2="hjlnrs";
	var vowels="aeiouyáéíóúàèìòùýäëïöüÿãõâêîôû";
	var posconsonants2="pkstm";
	var posconsonants="bcdglmnrstxz";
				
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
	var head=GetElement('head');
	var script=document.createElement('script');
	var ext='.js';
	var folder=((folder+"/").replace(/\/\//,"/"))||"codes/"
	if(sourcename.replace(".txt","")!=sourcename){
		ext="";
	}
	script.src=folder+sourcename+ext;
	script.async=false;
	
	head.appendChild(script);
}

function LoaderInFolder(folder){
	return function(sourcename){return LoadAsync(sourcename,folder)};
}

//Load styles

function LoadStyle(sourcename){
	var head=document.getElementsByTagName('head')[0];
	
	//Load
	var styleelement=document.createElement('link');
	styleelement.href=sourcename.replace(".css","")+".css";
	styleelement.rel="stylesheet";
	styleelement.type="text/css";
	head.appendChild(styleelement);	
}

///////////////////////////////////////////////////////////////////////////////
//Data Reception

//Fetch data from url
function LoadData(url,SuccessF,header){
	var rawFile=new XMLHttpRequest();
	rawFile.open("GET",url,true);
	rawFile.onreadystatechange=function(){
		if(rawFile.readyState===4){
			if(rawFile.status===404)
				console.log("Nothing found at: ",url,", not necessarily an error!");
			else if(rawFile.status===200||rawFile.status==0){
				SuccessF(rawFile.responseText);
			}
		}
	}
	if(header)
		rawFile.setRequestHeader("Content-type", header);
	rawFile.send(null);
};

//Network status

function Online(){return navigator.onLine};
function Offline(){return !Online()};

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
	
	if(!parentElement||!parentElement.querySelector)
		var parentElement=document.body;
	
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


//Siblings of any depth
function Siblings(thi,depth,maxParent){
	var depth=depth||1;
	var maxParent=GetElement(maxParent)||document.body;
	var d=0;
	var parent=GetElement(thi);
	
	if(!parent)
		return [];
	
	while(d<depth&&parent!==maxParent){
		parent=parent.parentNode;
		d=d+1;
	}
	
	var chi=[[parent]];
	while(d>0){
		var sib=[];
		Last(chi).map(function(c){sib=sib.concat(Array.from(c.childNodes).filter(function(n){return n.nodeName!=="#text"}))})
		chi.push(sib);
		d=d-1;
	}
	return Last(chi);
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
function GetElements(selectorString,parentIDsel){
	var HTMLCollect;
	var parentElement=GetElement(parentIDsel)||document;
	if(IsClass(selectorString))
		HTMLCollect=parentElement.getElementsByClassName(selectorString.replace(/^\./,""));
	else if (IsTag(selectorString))
		HTMLCollect=parentElement.getElementsByTagName(selectorString);
	return Array.prototype.slice.call(HTMLCollect);
};

// Add new element to page, under a parent element
function Element(htmlOrElement){
	var e=htmlOrElement;
	if (typeof htmlOrElement==="string")
		e=MakeElement(htmlOrElement);
	return e;
}

function AddElement(htmlOrElement,parentIDsel){
	var e=Element(htmlOrElement);
	var p=GetElement(parentIDsel);
	p.appendChild(e);
	return e;
};

function PreAddElement(htmlOrElement,parentIDsel){
	var e=Element(htmlOrElement);
	var p=GetElement(parentIDsel);
	p.prepend(e);
	return e;
};

// Add new element to page, after a sibling element
function AppendElement(htmlOrElement,selector){
	var e=Element(htmlOrElement);
	var s=GetElement(selector);
	if(s)
		return s.insertAdjacentElement('afterend',e);
};

function PrependElement(htmlOrElement,selector){
	var e=Element(htmlOrElement);
	var s=GetElement(selector);
	if(s)
		return s.insertAdjacentElement('beforebegin',e);
};


// Replace parent element contents with new element
function ReplaceChildren(html,parentIDsel){
	var p=GetElement(parentIDsel);
	if(p)
		p.innerHTML=html;
};

// Replace element with new element
function ReplaceElement(htmlOrElement,elemIDsel){
	var a=AppendElement(htmlOrElement,elemIDsel);
	RemoveElement(elemIDsel);
	return a;
};

function AddSingleElement(html,parentIDsel,selfSel){
	if(GetElement(selfSel))
		return ReplaceElement(html,selfSel);
	else
		return AddElement(html,parentIDsel);
};

//Wrap Element
function WrapElement(html,elemIDsel,newparentIdsel){
	AppendElement(html,elemIDsel);
	AddElement(GetElement(elemIDsel),newparentIdsel);
}


// Remove Children
function RemoveChildren(parentID){
	ReplaceChildren("",parentID)
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
  var e=GetElement(elementIDsel);
  e.scrollIntoView();
}


//////////////////////////////////////////////////
//Sort tables

function ColumnNumber(tableSelector,n){
	var headers=GetElements("TH",tableSelector);
	if(typeof n==="number"&&n>-1&&n<=headers.length-1)
		return n;
	
	if(typeof n!=="string")
		return -1;
	else{
		headers=headers.map(function(th){return th.textContent.toLowerCase()});
		return headers.indexOf(n.toLowerCase());
	}
}

function CompareRow(n,descending){
	function CompareAscending(rowA,rowB){
		
		var A=Array.from(rowA.children);
		var B=Array.from(rowB.children);
		
		if(A.length<n-1)
			if(B.length<n-1)
				return 0;
			else
				return 1;
		
		if(B.length<n-1)
			return -1;

		var Atext=A[n]?A[n].textContent.toLowerCase():"";
		var Btext=B[n]?B[n].textContent.toLowerCase():"";
		
		if(Atext<Btext)
			return -1;
		else
			return 1;
	}
	
	if(!descending)
		return CompareAscending;
	else
		return function(rowA,rowB){return 0-CompareAscending(rowA,rowB)};
}


function SortTable(tableSelector,n,descending){
	var descending=descending||false;
	var table=GetElement(tableSelector);
	var tbody=GetElement("TBODY",table);
	var n=ColumnNumber(table,n);
	
	var rows=GetElements("TR",tbody);
	rows=rows.sort(CompareRow(n,descending));
	rows.map(function(row){return row.cloneNode(true)});
	RemoveChildren(tbody);
	rows.map(function(row){AddElement(row,tbody)});
}

function SortableTable(tableSelector){
	var headers=GetElements("TH",tableSelector);
	
	function SortByHeader(header){
		var table=header.parentElement.parentElement.parentElement; //improve this with a Parent function
		var column=header.textContent;
		function SortByThis(){
			Toggle(header,"Ascending");
			var descending=!Classed(header,"Ascending")
			if(descending)
				SelectSimple(header,"Descending");
			else
				Deselect(header,"Descending");
			SortTable(tableSelector,column,descending);
		}
		Listen('click',SortByThis,header);
	}
	
	headers.map(SortByHeader)
}

function SortableTables(){
	GetElements("TABLE").map(SortableTable);
}

ListenOnce('load',SortableTables);

function TableLength(idSel){
	return Array.from(GetElementIn("TBODY",idSel).childNodes).filter(function(e){return e.childNodes.length>0}).length;
}

//////////////////////////////////////////////////
// Safe string loading
function SafeString(tex){
	return String(tex).replace(/[\<\>\=\+\-\(\)\*\'\"]/g,"");
}

function SafeUrl(tex){
	var prefix="https://";
	if(In(tex,"http:"))
		prefix="http://";
	return prefix+String(tex).replace(/[\<\>\+\(\)\*\'\"\#\\\s]+.*/g,"").replace(/https?:\/\//,"");
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

function PlaceholderImageHTML(){
	return ImageHTML()
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
	var id='#'+IDfy(title);
	if(GetElement(id))
		return ButtonHTML({tag:"a",txt:title,attributes:{href:id,onclick:'FullscreenClose()'}});
	else
		return GhostButtonHTML(id);
}

function GhostButtonHTML(id){
	"<span id='"+id+"' class='hidden'></span>";
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
		
		destination:'Feedback',			//Name of data repository (default)
		requireConnection:true,			//Does it need a connection?

		action:CheckSubmit, 			//action on submit :receives a qid
		actionvalid:SubmitValidAnswer,	//action on valid submit: receives a DataPack
		actionText:'Submit',			//text to display instead of "Submit"
		
		qtargetid:document.body.id,		//Where to introduce form in page?
		qdisplay:LaunchModal,			//Question display function :receives a DataPack

		qonsubmit:LaunchThanksModal,	//Next modal on successful submit: receives a DataPack
		qonclose:Identity,				//Next modal on close (defaults to nothing): receives a DataPack
		thanksmessage:"Submitted. Thank you!",

		closeonblur:true,				//Whether to close the DP on losing focus (e.g. clicking outside)
		closeOthersCondition:True,		//Condition for other DPs to close
		layer:0,						//Independent Layers for closing
		
		shortcutExtras:{},				//Extended shortcuts, to use ad-hoc
		spotlight:document.body,		//Spotlight after closing
		closed:false,
		
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
			qsubmittable:false}),
		message:NewDataField({
			action:Close,
			destination:'',
			qtype:LongAnswerHTML,
			qdisplay:LaunchThanksModal}),
		exclusivechoice:NewDataField({
			qfield:'answer',
			questionname:"Which one?",
			qchoices:["on","off"],
			qtype:ExclusiveChoiceButtonRowHTML}),
		navi:NewDataField({
			qfield:"navi",
			qclass:"nowrap",
			questionname:"",
			qchoices:["◀","OK","▶"],
			qtype:ExclusiveChoiceButtonRowHTML,
			defaultChoice:function(i,txt){return txt==="OK";},
			qsubmittable:false}),
		keyboard:NewDataField({
			qfield:"keyboard",
			questionname:"",
			qchoices:DefaultKeyboardKeys(),
			//["Ctrl","Alt","\t\t\t\t\t\t\t\t\t","Shift"]["🠴","␡","⮐"]
			qtype:KeyboardHTML,
			defaultChoice:function(i,txt){return txt==="⮐";},//Defaults to enter
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
		
		function SameType(DP1){return function(DP2){return DP1.buttonSelector===DP2.buttonSelector}};
		function SameLayer(DP1){return function(DP2){return DP1.layer===DP2.layer}};
		
		if(DP.buttonSelector!=="none"&&CurrentDatapack(SameType(DP)))
			ClosePreviousDatapacks(SameType(DP));
		else{
			ClosePreviousDatapacks(SameLayer(DP));
			
			if(!GetDataPack.history)
				GetDataPack.history=[];
			GetDataPack.history.push(DP);
			
			DP.qdisplay(DP);
			Select(DP.buttonSelector);		//Activate button
			setTimeout(function(){FocusInside("#"+DP.qid);},100);		//Focus on first question
			
			if(DP.closeonblur)
				setTimeout(function(){ListenOutside("click",function(){Close(DP.qid)},DP.qid)},500); //Click outside to close
			SetDatapackShortcuts(DP);
			
			return DP;
		}
	}
};

// DataField HTML Components

function PlainHTML(dataField){
	return PlainMessageHTML(dataField.questionname);
}

function ExclusiveChoiceButtonHTML(choice,dataFiel,i){
	var args='(\"'+dataFiel.qfield+'\",\"'+choice+'\",\"'+dataFiel.pid+'\");';
	var SetF='SetData'+args;
	var ExecuteF='ExecuteChoice'+args;
	var SelectF='ToggleThisOnly(event,this,'+dataFiel.pid+');'+SetF;

	var buAttribs={
		'onfocus':SelectF,
		'onmouseover':SelectF,
		'onclick':ExecuteF,
		'ondblclick':ExecuteF,
		id:"choice-"+choice};
	
	if(dataFiel.defaultChoice(i,choice)){
		buAttribs=FuseObjects(buAttribs,{class:"selected",onload:SetF});
		SetData(dataFiel.qfield,choice,dataFiel.pid);//Actualy choose it
	}
	
	return ButtonHTML({txt:choice,attributes:buAttribs});
};

function MultiChoiceButtonHTML(choice,dataFiel,i){
		var args='(\''+dataFiel.qfield+'\',\''+choice+'\',\''+dataFiel.pid+'\')';
		var SelectF='ToggleThis(event,this);ToggleData'+args;
		var buAttribs={'onclick':SelectF,'onfocus':SelectF,id:"choice-"+choice};
		
		return ButtonHTML({txt:choice,attributes:buAttribs});
	};

function ChoiceRowHTML(dataField,buttontype){
	var choi="";
	for(var i in dataField.qchoices)
		choi=choi+buttontype(dataField.qchoices[i],dataField,i);
	return choi;
}

function LayoutHTML(dataField,buttontype,layoutclass,LayoutF){
	ClearData(dataField.qfield,dataField.pid);
	var clear='onload="ClearData(\''+dataField.qfield+'\',\''+dataField.pid+'\')" ';
	var choi=LayoutF(dataField,buttontype);
	return '<div class="'+layoutclass+' '+dataField.qclass+'" '+clear+'id="'+dataField.qid+'">'+choi+'</div>';
}


function ExclusiveChoiceButtonRowHTML(dataField){
	return LayoutHTML(dataField,ExclusiveChoiceButtonHTML,'buttonrow',ChoiceRowHTML)
}

function ChoicesButtonRowHTML(dataField){
	return LayoutHTML(dataField,MultiChoiceButtonHTML,'buttonrow',ChoiceRowHTML)
}


function ShortAnswerHTML(dataField){
	return "<input class='input' data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"' tabindex='0'></input>";
}

function LongAnswerHTML(dataField){
	return "<textarea class='input' data-"+dataField.qfield+"='' placeholder='"+dataField.qplaceholder+"' id='"+dataField.qid+"' tabindex='0'></textarea>";
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
		qdisplay:LaunchAvatarBalloon,
		requireConnection:false});
}

function LaunchBalloon(DP){
	OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}


function LaunchAvatarBalloon(DP){
	OpenBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid,true);
}

function BalloonHTML(avatarHTML,content,id,classExtra){
	var classExtra=classExtra||"";
	var b='<div class="balloon window '+classExtra+'" id='+id+'>'+CloseButtonHTML(id)+'<div class="baloon-content">'+avatarHTML+'<div class="subtitle">'+content+'</div></div></div>';
	return b;
}

function OpenBalloon(content,id,targetid,avatar){
	if(!avatar||typeof LOGO==="undefined")
		var avatar="";
	else
		var avatar='<div class="logo avatar">'+LOGO+'</div>';
	AddElement(BalloonHTML(avatar,content,id),targetid);
}

//Banner (e.g for keyboard)
function BannerHTML(content,id,classExtra){
	var classExtra=classExtra||"";
	var b='<div class="banner window '+classExtra+'" id='+id+'><div class="banner-content">'+content+'</div></div>';
	return b;
}

function OpenKeyboardBanner(content,id,targetid){
	return AddElement(BannerHTML(content,id,"keyboard"),targetid);
}

function LaunchKeyboardBanner(DP){
	OpenKeyboardBanner(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

function OpenKeyboardBalloon(content,id,targetid){
	return AddElement(BalloonHTML("",content,id,"keyboard"),targetid);
}

function LaunchKeyboardBalloon(DP){
	OpenKeyboardBalloon(QuestionHTML(DP),DP.qid,DP.qtargetid);
}

// On-screen Keyboard
function DefaultKeyboardKeys(){
	return [["1","2","3","4","5","6","7","8","9","0"],["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M",".","-"]]};
	
function KeyboardRowsHTML(dataField,buttontype){
	var kblines="";
	var i=0;
	for(var keyboardline in dataField.qchoices){
		var k="";
		for (var key in dataField.qchoices[keyboardline]){
			i=i+1;
			k=k+buttontype(dataField.qchoices[keyboardline][key],dataField,i);
		}
		kblines=kblines+"<div class='keyline'>"+k+"</div>";
	}
	return kblines;
}

function KeyboardHTML(dataField){
	return LayoutHTML(dataField,KeyboardButtonHTML,'keyboard',KeyboardRowsHTML)
}

function KeyboardButtonHTML(choice,dataFiel,i){
	var buID='kb'+i;
	KeyboardButtonHTML[buID]=function(){ExecuteChoice(dataFiel.qfield,choice,dataFiel.pid)};
	var Kargs='(KeyboardButtonHTML.'+buID+',250,"'+buID+'")';
	var Start='AutoRepeat'+Kargs;
	var Stop='AutoStop'+Kargs;

	var buAttribs={
		'onclick':'KeyboardButtonHTML.'+buID+'()',
		'ontouchstart':Start,
		'onmousedown':Start,
		'onmouseup':Stop,
		'ontouchend':Stop,
		'ontouchcancel':Stop,
		id:"choice-"+choice};
		
	return ButtonHTML({txt:choice,attributes:buAttribs});
};



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


////////////////////////////////////////////////////////////////////////////////
// Toggling class & buttons

function ToggleThis(ev,thi){
	if(ev.target.id===thi.id)
		Toggle(thi);
}

function ToggleThisOnly(ev,thi,maxparent){
	var siblings=Siblings(thi,999,maxparent);
	var i=0;
	while (i<siblings.length){
		if(siblings[i]!==thi)
			Deselect(siblings[i]);
		else{
			Select(siblings[i]);
		}
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
	return e;
}

function Select(selectorE,clas){ //With Pulse by default
	var e=SelectSimple(selectorE,clas);
	PulseSelect(selectorE);
	return e;
}

function Deselect(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.remove(clas);
	return e;
}

function Selected(selectorE){
	return Classed(selectorE,"selected");
}

function Classed(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	return e&&e.classList&&e.classList.contains(clas);
}

function Toggle(selectorE,clas){
	var clas=clas||'selected';
	var e=GetElement(selectorE);
	if(e)
		e.classList.toggle(clas);
	return e;
}

// Select Pulse

function PulseSelect(selectorE,clas,delay){
	var delay=delay||100;
	var clas=clas||"pulsating";
	SelectSimple(selectorE,clas);
	setTimeout(function(){Deselect(selectorE,clas);},delay);
}

// Show/Hide

function HiddenHTML(id){
	return "<span id='"+id.replace(/\#/g,"")+"' class='hidden'></span>"
}

function Show(selectorE){
	var e=GetElement(selectorE);
	
	//Restore tabindex
	if(e&&e.dataset.tabindex)
		e.tabindex=e.dataset.tabindex;
	
	Deselect(selectorE,"hidden");
	SelectSimple(selectorE);
}

function Hide(selectorE){
	var e=GetElement(selectorE);
	
	//Hide tabindex
	if(e&&e.tabindex){
		e.removeAttribute(tabindex);
		e.dataset.tabindex=e.tabindex;
	}
	
	Deselect(selectorE);
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
	var DP=GetDataPack(targetid);
	if(DP)
		CloseDatapack(DP);
	else
		CloseElement(targetid);
}

function CloseAndContinue(DP){
	Deselect(DP.buttonSelector);
	if(DP.qonsubmit)
		DP.qonsubmit(DP);
	CloseElement(DP.qid);
}

// Current Datapack
function CurrentDatapack(ConditionF){
	var ConditionF=ConditionF||True;
	var h=GetDataPack.history;
	if(h)
		h=h.filter(ConditionF);
	if(h&&h.length>0){
		var DP=Last(h);
		if(DP.closed)
			return undefined;
		else
			return DP;
	}
	else
		return undefined;
}

function CloseDatapack(DP){
	if(DP){
		Deselect(DP.buttonSelector);
		DeleteShortcuts(DP.qid);
		DP.closed=true;
		if(DP.qonclose)
			DP.qonclose(DP);
		if(DP.spotlight)
			FocusElement(DP.spotlight);
		
		CloseElement(DP.qid);
	}
}

function CloseCurrentDatapack(){
	CloseDatapack(CurrentDatapack());
}

function ClosePreviousDatapacks(ConditionF){
	var h=GetDataPack.history;
	if(!h)
		return;
	h=h.filter(ConditionF).filter(function(DP){return !DP.closed});
	
	var l=Last(h);
	
	h=Most(h); //Close previous ones without firing onclose event
	if(h)
		h.map(function(DP){DP.qonclose=Identity;CloseDatapack(DP)});
	
	CloseDatapack(l); //the last one should fire it
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
	return Last(Spotlight.s);
}

function AddSpotlight(element){
	if(Spotlight()!==element){
		Spotlight.s.push(element);
	}
	return element;
}


//Focus clicked items (also to escape focus by clicking in unfocusable parents)
Listen("mousedown",function(e){FocusElement(e.target)});
Listen("click",function(e){FocusElement(e.target)});

// Focus Element
function FocusElement(targetIDsel){
	var focussing=GetElement(targetIDsel);
	if(focussing){
		focussing.focus();	
		AddSpotlight(focussing);
		//ListenOnce('blur',FocusActive,focussing);
	}
	return focussing;
};


// Which elements are focusable?
function FocusableInput(e){
	return Classed(e,"input")||In(["INPUT","TEXTAREA"],e.tagName);
}
function Focusable(e){
	return FocusableInput(e)||Classed(e,"button")||Classed(e,"gif")||e.tagName==="A";//List of element and classes
}
function UnFocusable(e){
	return Classed(e,"closer")||Classed(e,"logo");
}

// Focus Inside Element, looking for focusables
function FocusInside(targetIDsel,backward){
	var e=GetElement(targetIDsel);
	if(!e)
		return false;
	
	if(!backward)
		var backward=false;
	
	if(Focusable(e)){
		return FocusElement(e); //doubles as true
	}
	
	var selElem=GetElement(".selected",targetIDsel);
	
	if(Selected(selElem)&&selElem.parentNode.isEqualNode(e)){
		return FocusElement(selElem); //doubles as true
	}
	else {	
		var children=e.children;
		var found=false;
		var i=0;
		var j,c;
		while(!found&&children&&i<children.length){
			j=backward?(children.length-1-i):i;
			c=children[j];
			if(UnFocusable(c))
				found=false;
			else 
				found=FocusInside(c,backward);
			i++;
		}
		return found;
	}
};


function FocusAdjacentElement(elem,backward,bounded){

	if(!backward)
		var backward=false;
	
	if(!elem)
		return FocusInside(document.body,backward);
	
	var next=backward?elem.previousSibling:elem.nextSibling;
	
	if(!next){
		if(bounded)
			return false;
		else
			return FocusAdjacentElement(elem.parentElement,backward);
	}
	
	var f=false;
	while(next&&!f){
		f=FocusInside(next,backward);
		next=backward?next.previousSibling:next.nextSibling;
	}
	
	if(f)
		return f;
	else
		return FocusAdjacentElement(elem.parentElement,backward);
}


//Focus Next, Prev, Stay: bounded or not
function FocusNext(F){
	var e=FocusAdjacentElement(document.activeElement,false);
	if(F&&typeof F==="function")
		F(e);
	return e;
}

function FocusPrev(F){
	var e=FocusAdjacentElement(document.activeElement,true);
	if(F&&typeof F==="function")
		F(e);
	return e;
}

function FocusStay(F){
	var e=document.activeElement;
	if(F&&typeof F==="function")
		F(e);
	return e;
}

function FocusNextBounded(F){
	var e=FocusAdjacentElement(document.activeElement,false,true);
	if(F&&typeof F==="function")
		F(e);
	return e;
}

function FocusPrevBounded(F){
	var e=FocusAdjacentElement(document.activeElement,true,true);
	if(F&&typeof F==="function")
		F(e);
	return e;
}

//Focus NextParent
function FocusNextParent(F){
	var e=FocusAdjacentElement(document.activeElement.parentElement,false);
	if(F&&typeof F==="function")
		F(e);
	return e;
}

function FocusPrevParent(F){
	var e=FocusAdjacentElement(document.activeElement.parentElement,true);
	if(F&&typeof F==="function")
		F(e);
	return e;
}


//Click
function ClickElement(elem){
	var elem=GetElement(elem);
	elem.click();
}

function ClickPrevBounded(){
	FocusPrevBounded(ClickElement);
}

function ClickNextBounded(){
	FocusNextBounded(ClickElement);
}

function ClickStay(){
	FocusStay(ClickElement);
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
	evObj["ev"].map(function(e){Listen(e,evObj["F"],evObj["target"])});
}

function Listen(eString,F,target){
	var target=target||window;
	if(In(['click','mousedown'],eString))
		target.addEventListener(eString,F,{"passive":true})
	else
		target.addEventListener(eString,F)
};




////////////////////////////////////////////////////////////////////////////////
// Data submission in forms

function SubmitData(dataObject,destination){
	var data=dataObject;
	data.formDataNameOrder=destination.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=destination.sheet;
	
	if(!PreviousSubmission.history)
		PreviousSubmission.history=[];
	PreviousSubmission.history.push(data);
	
	EchoData(data,destination.url);
}

function SubmitValidAnswer(DP){
	var formDestination=DP.findDestination(DP);
	var destinationObject=GetDestination(formDestination);
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
		AppendElement(ErrorHTML(validator.error,errorid),"#"+DF.qid);
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
		return Last(s)[field];
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
		var children=node.childNodes;
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
		var children=node.childNodes;
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
	if(DP!==undefined){
		GetDataPack(id)[field]=value;
		Shout("Set "+field);
	}
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

//Modal self-laucher for questions (datapacks)
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

function ConsoleAdd(messageHTML,wait,duration,mID){
	
	if(GetElement("Console")===null)
		ConsoleLoad();
	
	var duration=duration?Math.max(1000,duration):TextReadDuration(messageHTML);
	var wait=wait?wait:0;
	var mID=mID?mID:"c-"+GenerateId();//random id
	setTimeout(function(){AddElement(ConsoleMessageHTML(messageHTML,mID),"Console")},wait)
	setTimeout(function(){CloseElement(mID)},duration+wait);
	consolebuffer.push(mID);
	while(consolebuffer.length>consolemax){
		ConsoleRemove(consolebuffer[0]);
	}
}

function ConsoleLoad(selector){
	var selector=selector||ParentSelector(gameSelector);
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
	ConsoleAdd(QuestionHTML(DP),undefined,undefined,DP.qid);
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

function PlaySound(src){
	var s=new Audio(src);
	s.play();
	return;
}

///////////////////////////////////////////////////////////////////////////////
//Music Control

//Playlist
function Playlist(i){
	if(typeof Playlist.p==="undefined"){
		Playlist.p=GetElements('.music');
		Playlist.l=Playlist.p.length;
	}
	if(typeof i==="undefined"){
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
	var mutebutton=GetElement("MuteButton");
	if(mutebutton)
		return !Selected(mutebutton);
	else
		return false;
}
function Mute(){
	Deselect("MuteButton");
}
function Unmute(){
	Select("MuteButton");
}

function ValidSong(song){
	return (typeof song!=="undefined")&&(FileSong(song).replace(/\.mp3$/,"").replace(/\.wav$/,"").replace(/\.ogg$/,"")!==FileSong(song));
}


function PlaySong(song){
	if(ValidSong(song)&&song.paused){
		song.play();
		ListenOnce('ended',PlayNextF(song),song);
		Unmute();
		Listen("blur", PlaylistSleep);
		//console.log("Now playing: "+song);
	}
}

function PauseSong(song){
	if(ValidSong(song)&&!song.paused){
		song.pause();
		ConsoleAdd("Music paused...");
		Mute();
		window.removeEventListener("blur", PlaylistSleep);
	}
}

function ResumeSong(song){
	if(ValidSong(song)&&song.paused){
		song.play();
		ConsoleAdd("Resumed playing ♫♪♪ "+NameSong(song));
		Unmute();
		Listen("blur", PlaylistSleep);
	}
}

function NameSong(song){
	return FileSong(song).replace(/\.mp3$/,"").replace(/\.wav$/,"").replace(/\.ogg$/,"").replace(/\%20/g," ");
}

function FileSong(song){
	return pageRelativePath(song.src).replace(/.*\//,"");
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
		Listen("focus", PlaylistAwaken);
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
	var e=GetElement(targetIDsel);
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
		"tab":FocusNext,
		"shift tab":FocusPrev,
		"up":FocusPrev,
		"down":FocusNext,
		"left":FocusPrev,
		"right":FocusNext,
		"W":FocusPrev,
		"S":FocusNext,
		"A":FocusPrev,
		"D":FocusNext
	},
	".window":{
		"escape":CloseCurrentDatapack,
		"ctrl w":CloseCurrentDatapack,
		"ctrl enter":SubmitCurrentDatapack,
		"enter":SubmitCurrentDatapack,
		"tab":FocusNext,
		"shift tab":FocusPrev,
		"left":FocusPrev,
		"right":FocusNext,
		"up":FocusPrev,
		"down":FocusNext,
		"W":FocusPrev,
		"S":FocusNext,
		"A":FocusPrev,
		"D":FocusNext
	},
	".navi":{
		"up":FocusPrevParent,
		"down":FocusNextParent,
		"left":ClickPrevBounded,
		"right":ClickNextBounded,
		"W":FocusPrevParent,
		"S":FocusNextParent,
		"A":ClickPrevBounded,
		"D":ClickNextBounded
	},
	".buttonrow":{
		"up":FocusPrevParent,
		"down":FocusNextParent,
		"left":FocusPrevBounded,
		"right":FocusNextBounded,
		"W":FocusPrevParent,
		"S":FocusNextParent,
		"A":FocusPrevBounded,
		"D":FocusNextBounded
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
		//"alt enter":EnterLine, or dispatch event (enter?)
		//"shift enter":EnterLine,		"escape":CloseCurrentDatapack,
		"escape":CloseCurrentDatapack,
		"enter":FocusNext,
		"ctrl enter":SubmitCurrentDatapack,
		"tab":FocusNext,
		"shift tab":FocusPrev
	},
	".gif":{
		"space":PlayPauseGif,
		"enter":PlayPauseGif,
		"X":PlayPauseGif
	}
}


//Context finding
function Context(targetSelector){
	var context;
	if(typeof targetSelector==="undefined")
		context=ElementContext(Spotlight());
	else
		context=ElementContext(targetSelector);
	
	if(!context){
		var e=FocusElement(document.activeElement);
		context=ElementContext(e)||ElementContext("BODY");
	}
	
	return context;
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
		if(!subcontext)
			subcontext={};
		context=FuseObjects(Clone(subcontext),context);
	}
	return context;
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
//Keyboard input
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
		
		keystring=UnShiftKeyString(keystring);
		keystring=UnAltKeyString(keystring);
		keystring=UnCtrlKeyString(keystring);
		keystring=UnEnterKeyString(keystring);
		keystring=UnSpaceKeyString(keystring);
		
		keystring=keystring.replace(/[\+\.\-\ ]*/g,"");

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
	//console.log("no key for number:",keynumber);
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

function CaptureComboKey(event){
	event=event||window.event;
	var keystring=EventKeystring(event);
	var context=Context();
	if(In(context,keystring)){
		event.preventDefault();
		context[keystring](event);
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
// Time-based functions

function AutoRepeat(RepeatF,delay,name){
	var name=name||FunctionName(RepeatF);
	clearTimeout(AutoRepeat[name]);
	AutoRepeat[name]=setTimeout(function(){
		RepeatF();
		AutoRepeat(RepeatF,delay,name);
	},delay);
}

function AutoStop(RepeatF,delay,name){
	var name=name||FunctionName(RepeatF);
	clearTimeout(AutoRepeat[name]);
	setTimeout(function(){
		clearTimeout(AutoRepeat[name]);
	},delay);
}

function Monitor(MonitorF,delay,DisplayF){
	var DisplayF=DisplayF?DisplayF:console.log;
	function M(){
		DisplayF(MonitorF());
	}
	AutoRepeat(M,delay);
}


//Prevent execution unless time cooldown exceeded, in ms
function Throttle(F,cooldown,id){
	if(!Throttle[id]||Date.now()-Throttle[id]>=cooldown){
		Throttle[id]=Date.now();
		return F();
	}
	return false;
}

//Delay execution until certain condition is met
function DelayUntil(Condition,F,i){
	var n=Condition.name+F.name+(i?i:0);
	
	if(!DelayUntil[n])
		DelayUntil[n]=0;
	DelayUntil[n]++;

	if(Condition()){
		DelayUntil[n]=0;
		return F();
	}
	else{

		//console.log(DelayUntil[n]);
		
		if(DelayUntil[n]<10){
			function D(){return DelayUntil(Condition,F,i);};
			setTimeout(D,100*(Math.pow(2,DelayUntil[n])));
		}
		else
			console.log("Timed out: ",n);
	}
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

function LoadImage(fullpath,parentIDsel){
	
	function ImageReplace(data){
		if(data==="")
			return console.log("no image found at: "+fullpath);
		
		if(IsGif(fullpath)){
			gifID=GenerateId();
			loaded=ImageHTML({attributes:{id:gifID,src:fullpath,onload:'StartGIF('+gifID+')',tabindex:'0',class:"gif"}});
		}
		else
			loaded=ImageHTML({attributes:{src:fullpath}});
		
		ReplaceChildren(loaded,parentIDsel);
	}
	
	LoadData(fullpath,ImageReplace);
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
	var c=AddElement("<canvas class='gif' tabindex='0'></canvas>",g.parentElement);
	
	Hide(g);	
	ResizeGIF();
	c.addEventListener('resize',ResizeGIF);
	StartGIF.e=c;
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
		
		var s=Math.pow(w*h,0.5)/3;
				
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
		StartGIF.e=g;
		ListenOnce('click',SG,g);
		Show(g);
		Hide(c);
	}
}

function PlayPauseGif(){
	if(StartGIF.e)
		StartGIF.e.click();
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
			ctx.lineWidth=lineWidth;
			ctx.strokeStyle=strokeColor;
			ctx.stroke();			
		}			
	}		
}

///////////////////////////////////////////////////////////////////////////////
//Reduce

function Accumulate(acc,val){return acc+val};

///////////////////////////////////////////////////////////////////////////////
// Custom events 

function Shout(name,targetSelector){
	var ev=new CustomEvent(name);
	var e=GetElement(targetSelector)||window;
	e.dispatchEvent(ev);
}

//polyfill
if(typeof window.CustomEvent!=="function"){
	function CustomEvent(event,optObj){
		optObj=optObj||{
			bubbles:false,
			detail:undefined,
			cancelable:false
			};
		var ev=document.createEvent('CustomEvent');
		ev.initCustomEvent(event,optObj.bubbles,optObj.cancelable,optObj.detail);
		return ev;
	}
	CustomEvent.prototype=window.Event.prototype;
	window.CustomEvent=CustomEvent;
}
