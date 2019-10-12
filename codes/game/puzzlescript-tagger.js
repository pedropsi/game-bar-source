function In(SAO,n){
	return SAO.replace(n,"")!==SAO;
}

function ReadGameData(){
	var data=false;
	if(In(document.URL,"itch.io")){
		var T=document.getElementsByTagName("TITLE")[0].innerHTML;
		data={
		"title":T.replace(/\sby\s.*/,""),
		"author":T.replace(/.*\sby\s/,""),
		"link":document.URL,
		"page":document.URL.replace(/itch.io\/.*/,"itch.io")
		};
	}else if(In(document.URL,"increpare.com")){
		var T=document.getElementsByTagName("TITLE")[0].innerHTML;
		data={
		"title":T.replace(/\s\-\s.*/,""),
		"author":"Stephen Lavelle",
		"link":"https://increpare.com/",
		"page":document.URL
		};
	}else{
		
		var link=document.URL;
		if(In(link,"hack")&&In(link,"puzzlescript"))
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