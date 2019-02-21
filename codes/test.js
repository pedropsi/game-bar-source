////////////////////////////////////////////////////////////////////////////////
// Test Suite

function RunFullSuite(names){
	if(typeof names==="undefined")
		return Testsuite.map(SuiteRun);
	else{
		var SubCases=Testsuite;
		if(typeof names==="object")
			SubCases=SubCases.filter(x=>(names.indexOf(x.name)>0));
		else if(typeof names==="string");
			SubCases=SubCases.filter(x=>(x.name===names));
		return SubCases.map(SuiteRun);
	}
}

function SuiteRun(suite){
	console.log(suite.name);
	function T(va){return suite.startvalues[va]};
	return suite.tests(T).map(ReportResult);
}

function ReportResult(test){
	var result=test[1]===test[2];
	if(!result){
		console.log("Error in:",test[0]);
		console.log("Wanted:",test[2]);
		console.log("Got:",test[1]);
	}
	return result;
}

Testsuite=[
	{
	name:"URL Basic",
	startvalues:{
		url:"file:///D:/Robert/Documents/GitHub/pedropsi.github.io/folder/guestbook.html",
		url2:"http://pedropsi.github.io/folder/guestbook.html",
		url3:"https://pedropsi.github.io/folder/guestbook.html",
		url4:"folder/guestbook.html",
		url5:"www.xxx.yyy",
		url6:"http://www.xxx.yyy",
		url7:"http://www.xxx.yyy/great/greater.htm",
		url8:"http://www.xxx.yyy/greater.htm",
		url9:"https://pedropsi.github.io/guestbook.html",
		url10:"https://pedropsi.github.io/gravirinth.html#$%F0%9F%93%B0%C2%BB"
		},
	tests:function(T){
		return[
		["pageHead",pageHead(T("url")),"file:///"],
		["pageHead",pageHead(T("url3")),"https://"],
		["pageHead",pageHead(T("url2")),"http://"],
		["pageHead",pageHead(T("url4")),""],
		["pageHead",pageHead(T("url5")),""],
		["pageNoHead",pageNoHead(T("url")),"D:/Robert/Documents/GitHub/pedropsi.github.io/folder/guestbook.html"],
		["pageNoHead",pageNoHead(T("url3")),"pedropsi.github.io/folder/guestbook.html"],
		["pageNoHead",pageNoHead(T("url4")),"folder/guestbook.html"],
		["pageNoHead",pageNoHead(T("url5")),"www.xxx.yyy"],
		["pageRelativePath",pageRelativePath(T("url")),"folder/guestbook.html"],
		["pageRelativePath",pageRelativePath(T("url3")),"folder/guestbook.html"],
		["pageRelativePath",pageRelativePath(T("url4")),"folder/guestbook.html"],
		["pageRelativePath",pageRelativePath(T("url5")),""],
		["pageRelativePath",pageRelativePath(T("url6")),""],
		["pageRelativePath",pageRelativePath(T("url7")),"great/greater.htm"],
		["pageRelativePath",pageRelativePath(T("url8")),"greater.htm"],
		["pageRelativePath",pageRelativePath(T("url9")),"guestbook.html"],
		["pageIdentifier",pageIdentifier(T("url")),"guestbook"],
		["pageIdentifier",pageIdentifier(T("url3")),"guestbook"],
		["pageIdentifier",pageIdentifier(T("url4")),"guestbook"],
		["pageIdentifier",pageIdentifier(T("url5")),""],
		["pageIdentifier",pageIdentifier(T("url6")),""],
		["pageIdentifier",pageIdentifier(T("url7")),"greater"],
		["pageIdentifier",pageIdentifier(T("url8")),"greater"],
		["pageIdentifier",pageIdentifier(T("url9")),"guestbook"],
		["pageIdentifier",pageIdentifier(T("url10")),"gravirinth"]

		]}},
	{
	name:"Link Classification",
	startvalues:{
		url:"file:///D:/Robert/Documents/GitHub/pedropsi.github.io/folder/guestbook.html",
		url2:"http://pedropsi.github.io/folder/guestbook.html",
		url3:"https://pedropsi.github.io/folder/guestbook.html",
		url4:"folder/guestbook.html",
		url5:"www.xxx.yyy",
		url6:"http://www.xxx.yyy"
		},
	tests:function(T){
		return[
		["isRelativeLink local",isRelativeLink(T("url")),false],
		["isRelativeLink relative domain",isRelativeLink(T("url2")),false],
		["isRelativeLink online",isRelativeLink(T("url4")),true],
		["isLocalLink local",isLocalLink(T("url")),true],
		["isLocalLink relative domain",isLocalLink(T("url2")),false],
		["isLocalLink online",isLocalLink(T("url4")),true],
		["isInnerLink local",isInnerLink(T("url")),true],
		["isInnerLink absolute domain",isInnerLink(T("url2")),true],
		["isInnerLink relative folder",isInnerLink(T("url4")),true],
		["isInnerLink online external www",isInnerLink(T("url5")),false],
		["isInnerLink online external full http",isInnerLink(T("url6")),false],
		]}},
	{
	name:"Tags",
	startvalues:{
		url:"file:///D:/Robert/Documents/GitHub/pedropsi.github.io/folder/guestbook.html#one",
		url2:"http://pedropsi.github.io/folder/guestbook.html#two",
		url3:"https://pedropsi.github.io/folder/guestbook.html#",
		url4:"folder/guestbook.html#one#more",
		url5:"www.xxx.yyy#tag$config"
		},
	tests:function(T){
		return[
		["pageTag",pageTag(T("url")),"one"],
		["pageTag",pageTag(T("url2")),"two"],
		["pageTag",pageTag(T("url3")),""],
		["pageTag",pageTag(T("url4")),"more"],
		["pageTag",pageTag(T("url5")),"tag"]
		]}}
]