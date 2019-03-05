////////////////////////////////////////////////////////////////////////////////
// Analytics and Actions
var analyticsURL="https://script.google.com/macros/s/AKfycbwuyyGb7XP7H91GH_8tZrXh6y_fjbZg4vSxl6S8xvAAEdyoIHcS/exec";
var clearance = "test";
var clearancePages = [""];

function DataUnit(){
	return {
		formGoogleSendEmail:"",
		"identifier":pageIdentifier(pageURL()),
		"name":UserId()
	};		
}

function DataUnitAnalytics(){
	return FuseObjects(DataUnit(),{
		formDataNameOrder:"[\"identifier\",\"language\",\"timezone\",\"screen\",\"agent\",\"from\",\"campaign\",\"name\"]",
		formGoogleSheetName:"analytics"
		});		
}

function DataUnitActions(){
	return FuseObjects(DataUnit(),{
		formDataNameOrder:"[\"identifier\",\"type\",\"target\",\"name\"]",
		formGoogleSheetName:"actions"
		});		
}


 function FingerprintOpen(){
	var data=DataUnitAnalytics();
	
	function LangUpperCase(s){
		var pos=s.replace(/(.*-)/,"").replace(s,"");
		var pre=s.replace(/(-.*)/,"").replace(s,"");
		return pos.length?(pre+"-"+pos.toUpperCase()):s
	};
	
	return FuseObjects(data,{
		"language":LangUpperCase(window.navigator.language),
		"timezone":Date(),
		"screen":[	window.screen.height,
					window.screen.width,
					window.screen.colorDepth].join("x"),
		"agent":window.navigator.userAgent,
		"from":document.referrer,
		"campaign":(pageTag(pageURL())=="")?"none":pageTag(pageURL())
		});		
}



function FingerprintAction(type,target){
	var data=DataUnitActions();
	return FuseObjects(data,{
		"target":target,
		"type":type,
	});
}

function FingerprintLink(ref){
	return FingerprintAction(
		isInnerLink(ref)?"InLink":"OutLink",
		isInnerLink(ref)?pageIdentifier(ref):ref
	)
}


// Echoes
 
function EchoAnalytics(data){
	echoPureData(data,analyticsURL);	
}
 
function RegisterOpen(){
	EchoAnalytics(FingerprintOpen());	
}
function RegisterLink(l){
	EchoAnalytics(FingerprintLink(l));
};
function RegisterElementClicked(b){
	EchoAnalytics(FingerprintAction("Click",b.innerText));	
}
function RegisterMosaicToggled(b){ //Mosaic change
	EchoAnalytics(FingerprintAction("BG toggle","---"));	
}
function RegisterNightModeToggled(b){
	EchoAnalytics(FingerprintAction("NM toggle",b.innerText));	
}
function RegisterLevelNavigated(b){
	EchoAnalytics(FingerprintAction("Level Navigated",b.innerText));	
}




////////////////////////////////////////////////////////////////////////////////
// Links Management

function ChangeLinks(f){
	MarkElements("a",f);
}

function outLinks(){
	function prepareLink(l){
		var ref=l.href;
		if(isOuterLink(ref)){
			l.setAttribute("target","_blank");};
		l.addEventListener("mousedown", (function(){RegisterLink(ref)}),false);
	};
	ChangeLinks(prepareLink);
};

////////////////////////////////////////////////////////////////////////////////
// Link reformatting

function anonimiseLinks(){
	function prepareLink(l){
		var ref=l.href;
		if(isInnerLink(ref))
			l.href= pageNoTag(ref)+"#"+clearance;
		};
	ChangeLinks(prepareLink);
}
 
function absolutiseLinks(){
	function prepareLink(l){
		var ref=l.href;
		console.log("ABS!",ref);
		if(isAbsolutableLink(ref))
			l.href=pageAbsolute(pageNoTag(ref));
		};
	ChangeLinks(prepareLink);
}



///////////////////////////////////////////////////////////////////////////////
// Analytics Behaviour

function AnalyticsClearance(){
	return (pageTag()!==clearance)&&!isFileLink(pageURL());
}

function AnalyticsInnerClearance(title){
	return clearancePages.indexOf(title)<0; //Special pages without internal analytics
}

if(AnalyticsClearance()){
	document.addEventListener('DOMContentLoaded', RegisterOpen, false);
	MarkElements(".button",ElementClicked);
	MarkElements(".mosaic",MosaicToggled);
	MarkElements(".gameNav",LevelNavigated);
	MarkElements("#NightMode",NightModeToggled);
	outLinks();
}
else{
	anonimiseLinks();
};


////////////////////////////////////////////////////////////////////////////////
// Analytics: custom actions

function ElementClicked(b){b.addEventListener("click", function(){RegisterElementClicked(this)}); return b};
function MosaicToggled(b){b.addEventListener("click", function(){RegisterMosaicToggled(this)}); return b};
function NightModeToggled(b){b.addEventListener("click", function(){RegisterNightModeToggled(this)}); return b};
function LevelNavigated(b){b.addEventListener("click", function(){RegisterLevelNavigated(this)}); return b};

////////////////////////////////////////////////////////////////////////////////
// Inter-page memory via configs

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
	ChangeLinks(propagateConfig);
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
		activateNightMode();
	if(inConfig("🖼»"))
		activateBGMode(getConfigArg("🖼»"));
}

loadConfig();
