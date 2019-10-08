function In(SAO,n){
	return SAO.replace(n,"")!==SAO;
}

function ReadGameData(){
	if(In(document.URL,"itch.io")){
		var T=document.getElementsByTagName("TITLE")[0].innerHTML;
		return {
		"title":T.replace(/\sby\s.*/,""),
		"author":T.replace(/.*\sby\s/,""),
		"link":document.URL,
		"page":document.URL.replace(/itch.io\/.*/,"itch.io")
	};
	}else
		return {
		"title":state.metadata.title,
		"author":state.metadata.author,
		"link":document.URL,
		"page":state.metadata.homepage?state.metadata.homepage:""
	};
};


function SubmitGameData(){
	var data=ReadGameData();
	data.formDataNameOrder=DESTINATION_TAGGER.headers;
	data.formGoogleSendEmail="";
	data.formGoogleSheetName=DESTINATION_TAGGER.sheet;
	
	EchoPureData(data,DESTINATION_TAGGER.url);
	alert("Game "+data.title+" by "+data.author+" submitted!")
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