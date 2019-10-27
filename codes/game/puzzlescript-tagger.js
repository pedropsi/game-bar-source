function InString(string,n){
	return string.replace(n,"")!==string;
}

function ReadGameData(){
	var data=false;
	if(InString(document.URL,"itch.io")){
		var T=document.getElementsByTagName("TITLE")[0].innerHTML;
		data={
		"title":T.replace(/\sby\s.*/,""),
		"author":T.replace(/.*\sby\s/,""),
		"link":document.URL,
		"page":document.URL.replace(/itch.io\/.*/,"itch.io")
		};
	}else if(InString(document.URL,"gist.github.com")){
		var D=Array.from(document.querySelectorAll(".js-file-line")).map(function(x){return x.innerHTML});
		var T=D.filter(function(l){return /title/i.test(l)})[0].replace(/title\s*/i,"");
		var A=D.filter(function(l){return /author/i.test(l)});
		var P=D.filter(function(l){return /homepage/i.test(l)});
		
		var id=document.URL.replace(/.*gist\.github\.com\/.*\//,"");
				
		if(P.length>0)
			P=P[0].replace(/homepage\s*/i,"");
		else
			var P=document.URL.replace(id,"");
				
		if(A.length>0)
			A=A[0].replace(/author\s*/i,"");
		else
			A=P.replace(/.*gist\.github\.com/,"").replace(/\//g,"");
		
		document.getElementsByTagName("TITLE")[0].innerHTML;
		data={
		"title":T,
		"author":A,
		"link":"https://www.puzzlescript.net/play.html?p="+id,
		"page":P
		};
	}else if(InString(document.URL,"increpare.com")){
		var T=document.getElementsByTagName("TITLE")[0].innerHTML;
		data={
		"title":T.replace(/\s\-\s.*/,""),
		"author":"Stephen Lavelle",
		"link":document.URL,
		"page":"https://increpare.com/"
		};
	}else{
		
		var link=document.URL;
		if(InString(link,"hack")&&InString(link,"puzzlescript"))
			link=link.replace("hack=","p=").replace("editor.html","play.html");
		
		if(state&&state.metadata){
			data={
			"title":state.metadata.title,
			"author":state.metadata.author,
			"link":link,
			"page":state.metadata.homepage?state.metadata.homepage:""
			};
		}
	}
	return data;
};

function SubmitGameData(){
	var data=ReadGameData();
	if(data){
		data.formDataNameOrder=DESTINATION_TAGGER.headers;
		data.formGoogleSendEmail="";
		data.formGoogleSheetName=DESTINATION_TAGGER.sheet;
		
		EchoPureData(data,DESTINATION_TAGGER.url);
		alert("Game "+data.title+" by "+data.author+" submitted, if not already!");
	}
	else
		alert("Sorry, no game could be found in this page. Please tell Pedro PSI whether this is an error.");
}

var DESTINATION_TAGGER={
	url:"https://script.google.com/macros/s/AKfycbwl1oMrc36DizbST5TJAxCYMV-5hnGpHsVs_U8fsgZwBqBZnsWm/exec",
	headers:"[\"title\",\"author\",\"link\",\"page\"]",
	sheet:"Games List",
	name:"GameDatabase"
}

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

	xhr.send(encoded);	
}


SubmitGameData();