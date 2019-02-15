///// ANALYTICS
var domain = "pedropsi.github.io|combinatura.github.io";
var analyticsURL="https://script.google.com/macros/s/AKfycbwuyyGb7XP7H91GH_8tZrXh6y_fjbZg4vSxl6S8xvAAEdyoIHcS/exec";
var analyticsParameters="[\"identifier\",\"language\",\"timezone\",\"screen\",\"agent\",\"from\",\"campaign\",\"name\"]";
var analyticsSheetName="analytics";
var clearance = "test";
var clearancePages = [""];

function LangUpperCase(s){
	var pos=s.replace(/(.*-)/,"").replace(s,"");
	var pre=s.replace(/(-.*)/,"").replace(s,"");
	return pos.length?(pre+"-"+pos.toUpperCase()):s
}


 function fingerprintData() {
	return {
		formDataNameOrder: analyticsParameters,
		formGoogleSendEmail: "",
		formGoogleSheetName: analyticsSheetName,
		"identifier":pageIdentifier(pageURL()),
		"language":LangUpperCase(window.navigator.language),
		"timezone":Date(),
		"screen":[	window.screen.height,
					window.screen.width,
					window.screen.colorDepth].join("x"),
		"agent":window.navigator.userAgent,
		"from":document.referrer,
		"campaign":(pageTag(pageURL())=="")?"none":pageTag(pageURL()),
		"name":UserId()
	};		
}

 function fingerprintLink(ref){
	var data=fingerprintData();
	var fro=data["identifier"];
	data["identifier"]=ref;
	data["from"]=fro;
	data["campaign"]="OutLink";
	return data;
}

function changeLinks(f){
	var links=document.getElementsByTagName("a");
	var i=0;
	for(i=0;i<links.length;i++){
		f(links[i]);
	};
}

var idomain=CombineRegex(/^/,domain);

function isInnerLink(url){
	var urlnohead=url.replace(/^https?\:\/\//,"");
	return (urlnohead.replace(idomain,"")!=urlnohead)||(url.replace("http","").length==url.length)	
}

function isInPageLink(url){
	var inpage=url.replace(/^#/,"");
	return url!=inpage;
}

function hrefShort(url){
	return url.replace(window.location,"");
}

function outLinks(){
	function RegisterOutLink(l){
		echoPureData(fingerprintLink(l),analyticsURL);
		};
	function prepareLink(l){
		var ref=l.href;
		if(!isInnerLink(ref)){
			l.setAttribute("target","_blank");};
			l.addEventListener("mousedown", (function(){RegisterOutLink(ref)}),false);
	};
	changeLinks(prepareLink);
};

function anonimiseLinks(){
	function prepareLink(l){
		var ref=l.href;
		if(isInnerLink(ref)&&!isInPageLink(hrefShort(ref)))
			l.href= ref+"#"+clearance;
		};
	changeLinks(prepareLink);
}
 
function absolutiseLinks(){
	function prepareLink(l){
		var ref=l.href;
		if(ref===pageRelativePath(ref))
			l.href=pageDomain(url)+ref
		};
	changeLinks(prepareLink);
}
 
 
function Analytics(){
	echoPureData(fingerprintData(),analyticsURL);	
}

function AnalyticsClearance(){
		return (pageTag()!==clearance)&&(pageURL().replace(/^file\:\/\//,"")===pageURL());
}

function AnalyticsInnerClearance(title){
	return clearancePages.indexOf(title)<0; //Special pages without internal analytics
}

if(AnalyticsClearance()){
	document.addEventListener('DOMContentLoaded', Analytics, false);
	outLinks();
}
else{
	anonimiseLinks();
};









/////// CONFIGS

function pageTagFull(url){
	if(pageTag(url)!="")
		return "#"+pageTag(url);
	else
		return "";
}

function cleanConfigURL(url){
	return url.replace(/#.*/,"")+"#"+pageTag(url);
}

function pageConfig(url){
	if(typeof url==="undefined")
		return pageConfig(""+window.location);
	else
		return decodeURIComponent(url.replace(/.*\$/,"").replace(url,""));
}

var config;
function Config(){
	if(typeof config==="undefined")
		config=pageConfig();
	return config;
}

function updateConfig(newconfig){
	config=newconfig;
	function propagateConfig(l){
		var ref=l.href;
		if(isInnerLink(ref))
			l.href=cleanConfigURL(ref)+(newconfig!=""?"$":"")+newconfig;
		};
	changeLinks(propagateConfig);
}

//// Mode parsing


function hideArgs(mode,prefix){
// hideargs(
// config1»...config3(arguments3)»...config4(args4)»... ,
// config3 )
// -> config1»...config3»...config4(args4)»...

	if(typeof prefix === "undefined"){
		var pre="";}
	else{
		var	pre=prefix;
	}
	var comb = CombineRegex(pre,/\(.*?\)/);
	return mode.replace(comb,pre);
}

function hideSuffix(mode){
	return mode.replace(/\»$/,"");
}

function Prefix(mode){
	return hideSuffix(hideArgs(mode));
}

function getArg(mode){
	return hideSuffix(mode).replace(Prefix(mode),"").replace(/.*\(/,"").replace(/\).*/,"");	
}

// Config Evaluation

function getConfigMode(mode){
	var modesuff = Config().replace(CombineRegex(/.*/,Prefix(mode)),Prefix(mode));
	var suff=hideConfig(mode).replace(CombineRegex(/.*/,hideArgs(mode)),"");
	return modesuff.replace(suff,"");
}

function getConfigArg(mode){
	return hideSuffix(getConfigMode(mode)).replace(Prefix(mode),"").replace(/.*\(/,"").replace(/\).*/,"");	
}

function inConfigFull(mode){
	var detect=Config().replace(mode,"");
	return !(detect===Config());
}	

function inConfig(mode){
	var miniConfig=hideArgs(Config(),Prefix(mode));
	return !(miniConfig.replace(hideArgs(mode),"")===miniConfig);
}	

function hideConfig(mode){
	var miniConfig=hideArgs(Config(),Prefix(mode));
	return miniConfig.replace(hideArgs(mode),"");
}

function activateConfig(mode){
	updateConfig(hideConfig(mode)+mode);
}	

function deactivateConfig(mode){
	updateConfig(hideConfig(mode));
}	

function toggleConfig(mode){
	if(inConfig(mode))
		deactivateConfig(mode)
	else
		activateConfig(mode)
}

// Night Mode

function toggleNightMode(){
	if(	document.body.className.replace("nightmode","")==document.body.className){
		document.body.className=document.body.className+" nightmode";
		document.getElementById("NightMode").innerHTML="☀ Brighten";
	}
	else{
		document.body.className=document.body.className.replace("nightmode","");
		document.getElementById("NightMode").innerHTML="☾ Darken";
	}
	toggleConfig("☾»")
}

function activateNightMode(){
	if(	document.body.className.replace("nightmode","")==document.body.className){
		document.body.className=document.body.className+" nightmode";
		document.getElementById("NightMode").innerHTML="☀ Brighten";
	}
	activateConfig("☾»")
}

// Background

function toggleBGMode(bg){
	if(document.body.style.backgroundImage!='url("images/mosaic/'+bg+'.png")'){
		document.body.style.backgroundImage='url("images/mosaic/'+bg+'.png")';
		document.body.style.backgroundSize='150px';
		activateConfig("🖼("+bg+")»");
		} 
	else{
        document.body.style.backgroundImage='';
		deactivateConfig("🖼("+bg+")»");		
		}
}

function activateBGMode(bg){
	document.body.style.backgroundImage='url("images/mosaic/'+bg+'.png")';
	document.body.style.backgroundSize='150px';
	activateConfig("🖼("+bg+")»")
}


//

function loadConfig(){
	updateConfig(Config())
	if(inConfig("☾»"))
		activateNightMode()
	if(inConfig("🖼»"))
		activateBGMode(getConfigArg("🖼»"))
	/*if(AnalyticsClearance()){
		if(inConfig("💾»"))
			UID=getConfigArg("💾»")
		else activateConfig("💾("+UserId()+")»")
	}*/  
}

loadConfig();
