function starry(thi,j){
	thi.classList.add('checked');
	document.getElementById('rate-it').setAttribute('value',j);
	var elems = document.getElementsByClassName("star-b");
	for(var i = 0; i < elems.length; i++) {
		elems[i].disabled = true;
	}
	elems = document.getElementsByClassName("label-on");
	var k= elems.length;
	for(var i = 0; i < k; i++) {
		elems[0].classList.remove("label-on");
	}
}

function handleFormSubmit(event) {  
	event.preventDefault();// prevent page reload
	var data = {formGoogleSheetName:"Rating",formDataNameOrder: "[\"identifier\",\"rating\"]",identifier: pageTitle(),rating: document.querySelector("#rating-form #rate-it").value};
	var u= "https://script.google.com/macros/s/AKfycbwB-a8j-INbkzTiQFJ55qETLYkdZrRvSg2s8urj9bPbG0XkBg9z/exec";
	echoPureData(data,u);
}

function loaded() {
	var form = document.getElementById('rating-form');
	form.addEventListener("submit", handleFormSubmit, false);
};

document.addEventListener('DOMContentLoaded', loaded, false);